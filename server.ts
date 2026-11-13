import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Shared Gemini AI client configured per AI Studio guidelines
function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment. Please check Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface DocumentPageInput {
  pageNumber: number;
  text: string;
}

interface FlowchartRequestBody {
  projectName: string;
  domain?: string;
  perspective: 'frontend' | 'backend';
  documentPages: DocumentPageInput[];
  analysisContext?: {
    module?: string;
    rolesSummary?: string;
    rulesSummary?: string;
  };
  customPrompt?: string;
}

// Compact page sampler optimized for free-tier Gemini token efficiency
function buildCompactPageContext(pages: DocumentPageInput[], maxChars = 16000): string {
  if (!Array.isArray(pages) || pages.length === 0) return '';

  const meaningful = pages.filter(
    (p) =>
      p &&
      typeof p.text === 'string' &&
      p.text.trim().length > 0 &&
      !p.text.includes('No content loaded.') &&
      !p.text.includes('Awaiting detailed document upload.')
  );

  if (meaningful.length === 0) return '';

  const selectedIndices = new Set<number>();
  for (let i = 0; i < Math.min(5, meaningful.length); i++) selectedIndices.add(i);
  const step = Math.max(1, Math.floor(meaningful.length / 8));
  for (let i = 0; i < meaningful.length; i += step) selectedIndices.add(i);

  const sorted = Array.from(selectedIndices).sort((a, b) => a - b);
  let output = '';
  for (const idx of sorted) {
    const p = meaningful[idx];
    const chunk = `[PAGE ${p.pageNumber}]\n${p.text.trim().slice(0, 1500)}\n\n`;
    if (output.length + chunk.length > maxChars) break;
    output += chunk;
  }
  return output;
}

const rolesFlowSchema = {
  type: Type.OBJECT,
  properties: {
    diagramTitle: {
      type: Type.STRING,
      description: 'Clear flowchart title (5-8 words) grounded in the uploaded specification.',
    },
    summary: {
      type: Type.STRING,
      description: 'Friendly 1-2 sentence overview explaining how roles interact across the user journey.',
    },
    stageLabels: {
      type: Type.ARRAY,
      description: 'Short labels for each horizontal stepOrder column (e.g. ["Entry & Auth", "Input / Trigger", "Rule Check", "Execution / Handoff", "Outcome & State"]).',
      items: { type: Type.STRING },
    },
    roles: {
      type: Type.ARRAY,
      description: '2 to 4 key user or system roles extracted from the specification.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Short slug id like r1, r2' },
          name: { type: Type.STRING, description: 'Role name from the spec' },
          accessSummary: { type: Type.STRING, description: 'Concise 4-7 word permission scope' },
        },
        required: ['id', 'name', 'accessSummary'],
      },
    },
    nodes: {
      type: Type.ARRAY,
      description: '8 to 11 clear, detailed user-flow nodes grouped by roleId and ordered stepOrder (1 to 6). Include at least 2 decision gates and both allowed outcomes and blocked/error states.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Short node id like n1, n2' },
          roleId: { type: Type.STRING, description: 'Must match one of the role ids in roles[]' },
          stepOrder: { type: Type.INTEGER, description: 'Column order left-to-right from 1 to 6' },
          label: { type: Type.STRING, description: 'Clear 2-5 word step title' },
          sublabel: { type: Type.STRING, description: 'Concise action, screen, or endpoint tag' },
          nodeType: {
            type: Type.STRING,
            description: 'One of: role_entry, action, decision, outcome, blocked',
          },
          summary: {
            type: Type.STRING,
            description: 'Friendly 1-2 sentence explanation of what happens at this step in the user flow.',
          },
          techTouchpoint: {
            type: Type.STRING,
            description: 'Frontend UI component/guard/state or Backend API/SP/table touchpoint.',
          },
          ruleHint: {
            type: Type.STRING,
            description: 'Short condition or rule checked here (e.g. "BR01: Excludes LAX2", "Requires Manager Role").',
          },
          outcomeState: {
            type: Type.STRING,
            description: 'Resulting UI state, HTTP code, or DB update (e.g. "200 OK · Grid Updated", "403 Disabled Button").',
          },
          sourcePage: {
            type: Type.INTEGER,
            description: '1-based page number from the document.',
          },
        },
        required: [
          'id',
          'roleId',
          'stepOrder',
          'label',
          'sublabel',
          'nodeType',
          'summary',
          'techTouchpoint',
          'ruleHint',
          'outcomeState',
          'sourcePage',
        ],
      },
    },
    edges: {
      type: Type.ARRAY,
      description: '10 to 14 directed connections showing forward progression, decision branches (both allow and deny), and cross-role handoffs.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          from: { type: Type.STRING },
          to: { type: Type.STRING },
          label: { type: Type.STRING, description: 'Short 1-3 word branch label (e.g. Submit, Valid, Denied, Escalate, Retry)' },
          edgeType: { type: Type.STRING, description: 'One of: normal, allow, deny' },
        },
        required: ['id', 'from', 'to', 'label', 'edgeType'],
      },
    },
  },
  required: ['diagramTitle', 'summary', 'stageLabels', 'roles', 'nodes', 'edges'],
};

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
      model: 'gemini-4-hydrogen',
    });
  });

  // Free-tier optimized Roles & Deeper User Flow AI Flowchart Endpoint
  app.post('/api/ai/generate-flowchart', async (req, res) => {
    try {
      const body = req.body as FlowchartRequestBody;
      const {
        projectName,
        domain = 'Enterprise Software',
        perspective = 'frontend',
        documentPages = [],
        analysisContext,
        customPrompt,
      } = body;

      if (!projectName) {
        res.status(400).json({ error: 'projectName is required.' });
        return;
      }

      const ai = getAiClient();
      const pageContext = buildCompactPageContext(documentPages, 16000);

      const perspectiveLens =
        perspective === 'frontend'
          ? `FRONTEND USER-FLOW PERSPECTIVE:
Map the end-to-end user journey across screens and UI states:
- Role entry & visible navigation/buttons per role
- User input / selection / trigger actions
- Client-side validation & RBAC permission checks (decision gates branching to Allowed UI vs Disabled/Blocked alert)
- Cross-role UI handoffs (e.g. operator submits -> supervisor reviews/approves)
- Final UI state update (toast, grid refresh, modal, or retry loop).`
          : `BACKEND SYSTEM-FLOW PERSPECTIVE:
Map the end-to-end request & data lifecycle across roles:
- Role session/JWT/SQL claim verification
- API endpoint dispatch & payload validation
- Business rule & RBAC authorization gates (decision gates branching to Allow vs 403/Validation Error)
- Cross-role approval or async workflow handoffs
- Database transaction commit, immutable audit logging, or rollback recovery.`;

      const contextText = analysisContext
        ? `Known Roles: ${analysisContext.rolesSummary || 'Infer from text'}\nKey Rules: ${analysisContext.rulesSummary || 'Infer from text'}`
        : '';

      const userContents = `Project: ${projectName} (${domain})
${perspectiveLens}
${customPrompt?.trim() ? `Specific flow focus requested: ${customPrompt.trim()}` : 'Build a complete multi-step Roles & User Flow diagram covering entry, decisions, cross-role handoffs, error branches, and outcomes.'}
${contextText}

Specification Excerpts:
${pageContext || `Infer roles and multi-step user flow cleanly from project "${projectName}" in domain "${domain}".`}

Ensure:
1. 2-4 distinct roles.
2. 8-11 connected nodes distributed cleanly across stepOrder 1 to 5 or 6.
3. At least 2 decision nodes that visibly branch into BOTH an 'allow' path and a 'deny' (blocked/error) path.
4. At least 1 cross-role handoff edge between different roles where applicable.`;

      let response;
      const maxAttempts = 3;
      let lastErr: unknown;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: userContents,
            config: {
              systemInstruction:
                'You design clear, structured Roles & User Flow diagrams grounded strictly in the provided specification. Model real decision branches (allow vs deny), cross-role handoffs, and clear outcomes while keeping node labels concise and easy for team members to follow.',
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.LOW,
              },
              responseMimeType: 'application/json',
              responseSchema: rolesFlowSchema,
            },
          });
          break;
        } catch (err: unknown) {
          lastErr = err;
          const msg = String((err as { message?: string })?.message || '');
          const status = (err as { status?: number })?.status;
          const isTransient = status === 503 || status === 429 || msg.includes('503') || msg.includes('UNAVAILABLE');
          if (isTransient && attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, attempt * 900));
            continue;
          }
          throw err;
        }
      }
      if (!response) throw lastErr;

      const rawJson = (response.text ?? '').trim();
      if (!rawJson) {
        throw new Error('AI returned an empty flowchart response.');
      }

      const parsed = JSON.parse(rawJson);
      const usage = response.usageMetadata;
      const promptTokens = usage?.promptTokenCount ?? Math.ceil(userContents.length / 4);
      const outputTokens =
        (usage?.candidatesTokenCount ?? 0) + (usage?.thoughtsTokenCount ?? 0) ||
        Math.ceil(rawJson.length / 4);
      const totalTokens = usage?.totalTokenCount ?? promptTokens + outputTokens;

      res.json({
        flowchart: {
          ...parsed,
          perspective,
          focusTopic: customPrompt?.trim() || 'Roles & User Flow',
          modelUsed: 'gemini-4-hydrogen',
          generatedAt: new Date().toISOString(),
          tokenUsage: {
            promptTokens,
            outputTokens,
            totalTokens,
            contextChars: pageContext.length,
          },
        },
      });
    } catch (err: unknown) {
      const errorObj = err as { message?: string; status?: number };
      console.error('Error generating AI roles flowchart:', err);
      const status = typeof errorObj?.status === 'number' ? errorObj.status : 500;
      res.status(status).json({
        error: errorObj?.message || 'Failed to generate AI flowchart.',
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rulebook server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
