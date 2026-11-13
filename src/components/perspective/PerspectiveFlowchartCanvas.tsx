import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  RefreshCw,
  GitBranch,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  XCircle,
  CheckCircle2,
  Users,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Cpu,
  ShieldAlert,
  Maximize2,
  Coins,
  Info
} from 'lucide-react';
import {
  AiFlowchartData,
  AiFlowchartNode,
  RulebookProject,
  RulebookAnalysis
} from '../../types/rulebook';

interface Props {
  project: RulebookProject;
  analysis: RulebookAnalysis;
  perspective: 'frontend' | 'backend';
  onOpenSourcePage: (page: number) => void;
  onSaveFlowchart: (perspective: 'frontend' | 'backend', flowchart: AiFlowchartData) => void;
}

interface ComputedEdgePath {
  id: string;
  d: string;
  labelX: number;
  labelY: number;
  label: string;
  edgeType: 'normal' | 'allow' | 'deny';
  from: string;
  to: string;
}

const FLOW_FOCUS_CHIPS = [
  { id: 'core', label: 'Core User Flow', prompt: '' },
  { id: 'handoff', label: 'Approval & Role Handoff', prompt: 'End-to-end approval, escalation, and cross-role handoffs' },
  { id: 'errors', label: 'Validation & Error Branches', prompt: 'Input validation checks, permission blocks, and error/rollback branches' }
];

export const PerspectiveFlowchartCanvas: React.FC<Props> = ({
  project,
  analysis,
  perspective,
  onOpenSourcePage,
  onSaveFlowchart
}) => {
  const cachedFlowchart = analysis.aiFlowcharts?.[perspective];
  const validCached =
    cachedFlowchart && Array.isArray(cachedFlowchart.roles) && Array.isArray(cachedFlowchart.nodes)
      ? cachedFlowchart
      : null;

  const [flowchart, setFlowchart] = useState<AiFlowchartData | null>(validCached);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [activeFocusChip, setActiveFocusChip] = useState<string>('core');

  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('all');
  const [pathFilter, setPathFilter] = useState<'all' | 'allow' | 'deny'>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(validCached?.nodes?.[0]?.id || null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [estInputTokens, setEstInputTokens] = useState<number>(0);
  const [sampledCharsCount, setSampledCharsCount] = useState<number>(0);

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const canvasInnerRef = useRef<HTMLDivElement>(null);
  const [edgePaths, setEdgePaths] = useState<ComputedEdgePath[]>([]);
  const [svgBounds, setSvgBounds] = useState<{ width: number; height: number }>({ width: 1280, height: 480 });
  const autoTriggeredRef = useRef<string | null>(null);

  useEffect(() => {
    const nextValid =
      cachedFlowchart && Array.isArray(cachedFlowchart.roles) && Array.isArray(cachedFlowchart.nodes)
        ? cachedFlowchart
        : null;
    setFlowchart(nextValid);
    setSelectedNodeId(nextValid?.nodes?.[0]?.id || null);
    setActiveRoleFilter('all');
    setPathFilter('all');
    setIsPlaying(false);
    setErrorMsg(null);
  }, [project.id, perspective, cachedFlowchart]);

  const currentVersion = useMemo(
    () => project.versions.find((v) => v.versionId === project.currentVersionId) || project.versions[0],
    [project]
  );

  const generateRolesFlowchart = useCallback(
    async (promptText?: string) => {
      const pagesPayload = (currentVersion?.pages || []).map((p) => ({
        pageNumber: p.pageNumber,
        text: p.text
      }));

      // Estimate compact prompt size matching server 16k-char sampler
      const meaningfulPages = pagesPayload.filter(
        (p) =>
          p.text &&
          p.text.trim().length > 0 &&
          !p.text.includes('No content loaded.') &&
          !p.text.includes('Awaiting detailed document upload.')
      );
      const selectedIdx = new Set<number>();
      for (let i = 0; i < Math.min(5, meaningfulPages.length); i++) selectedIdx.add(i);
      const step = Math.max(1, Math.floor(meaningfulPages.length / 8));
      for (let i = 0; i < meaningfulPages.length; i += step) selectedIdx.add(i);
      let sampledLen = 0;
      for (const idx of Array.from(selectedIdx).sort((a, b) => a - b)) {
        const chunkLen = Math.min(meaningfulPages[idx].text.trim().length, 1500) + 14;
        if (sampledLen + chunkLen > 16000) break;
        sampledLen += chunkLen;
      }

      const rolesSummary = (analysis.roles || [])
        .slice(0, 12)
        .map((r) => `${r.role}: ${r.action} (${r.effect})`)
        .join('; ');

      const rulesSummary = (analysis.facts || [])
        .slice(0, 10)
        .map((f) => f.statement)
        .join('; ');

      const approxPromptChars = sampledLen + rolesSummary.length + rulesSummary.length + 780;
      setSampledCharsCount(sampledLen);
      setEstInputTokens(Math.max(420, Math.round(approxPromptChars / 4)));
      setElapsedMs(0);
      setIsGenerating(true);
      setIsPlaying(false);
      setErrorMsg(null);

      try {
        const response = await fetch('/api/ai/generate-flowchart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName: project.name,
            domain: project.domain,
            perspective,
            documentPages: pagesPayload,
            analysisContext: {
              module: analysis.purpose?.module,
              rolesSummary,
              rulesSummary
            },
            customPrompt: promptText !== undefined ? promptText : customPrompt
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || `Request failed (${response.status})`);
        }

        if (!data?.flowchart?.roles || !data?.flowchart?.nodes) {
          throw new Error('AI response format was incomplete.');
        }

        setFlowchart(data.flowchart);
        setSelectedNodeId(data.flowchart.nodes?.[0]?.id || null);
        setActiveRoleFilter('all');
        setPathFilter('all');
        onSaveFlowchart(perspective, data.flowchart);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setErrorMsg(e?.message || 'Unable to generate Roles & Flow diagram.');
      } finally {
        setIsGenerating(false);
      }
    },
    [project, currentVersion, analysis, perspective, customPrompt, onSaveFlowchart]
  );

  // Auto-generate once when opening a project/perspective without cached Roles & Flow
  useEffect(() => {
    const key = `${project.id}::${perspective}`;
    if (!validCached && !isGenerating && autoTriggeredRef.current !== key) {
      autoTriggeredRef.current = key;
      generateRolesFlowchart('');
    }
  }, [project.id, perspective, validCached, isGenerating, generateRolesFlowchart]);

  // Smooth elapsed timer for compact token consumption indicator while generating
  useEffect(() => {
    if (!isGenerating) return;
    const startedAt = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 120);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const liveTokenStats = useMemo(() => {
    const simulatedOut = Math.min(2650, Math.round(2800 * (1 - Math.exp(-elapsedMs / 3600))));
    const progressPct = Math.min(93, Math.max(10, Math.round(12 + 81 * (1 - Math.exp(-elapsedMs / 3400)))));
    const phaseIndex = elapsedMs < 750 ? 0 : elapsedMs < 2600 ? 1 : 2;
    const stageLabel =
      phaseIndex === 0
        ? 'Sampling compact specification context'
        : phaseIndex === 1
        ? 'Mapping roles & decision gates'
        : 'Synthesizing swimlanes & branch paths';
    return {
      inputTokens: estInputTokens,
      outputTokens: simulatedOut,
      totalTokens: estInputTokens + simulatedOut,
      progressPct,
      phaseIndex,
      stageLabel,
      elapsedSec: (elapsedMs / 1000).toFixed(1)
    };
  }, [elapsedMs, estInputTokens]);

  const orderedNodes = useMemo(() => {
    if (!flowchart?.nodes) return [];
    const base =
      activeRoleFilter === 'all'
        ? flowchart.nodes
        : flowchart.nodes.filter((n) => n.roleId === activeRoleFilter);
    return [...base].sort((a, b) => a.stepOrder - b.stepOrder);
  }, [flowchart, activeRoleFilter]);

  const pathFilteredNodeIds = useMemo(() => {
    if (!flowchart?.nodes) return new Set<string>();
    if (pathFilter === 'all') return new Set(flowchart.nodes.map((n) => n.id));
    if (pathFilter === 'allow') {
      const allowedEdgeTargets = new Set(
        flowchart.edges.filter((e) => e.edgeType === 'allow' || e.edgeType === 'normal').flatMap((e) => [e.from, e.to])
      );
      return new Set(
        flowchart.nodes
          .filter((n) => n.nodeType !== 'blocked' && (allowedEdgeTargets.has(n.id) || n.nodeType === 'role_entry' || n.nodeType === 'outcome'))
          .map((n) => n.id)
      );
    }
    // deny / error branch
    const denyNodes = new Set(
      flowchart.edges.filter((e) => e.edgeType === 'deny').flatMap((e) => [e.from, e.to])
    );
    return new Set(
      flowchart.nodes
        .filter((n) => n.nodeType === 'blocked' || n.nodeType === 'decision' || denyNodes.has(n.id))
        .map((n) => n.id)
    );
  }, [flowchart, pathFilter]);

  const selectedNode: AiFlowchartNode | null = useMemo(() => {
    if (!flowchart?.nodes?.length) return null;
    return flowchart.nodes.find((n) => n.id === selectedNodeId) || orderedNodes[0] || flowchart.nodes[0];
  }, [flowchart, selectedNodeId, orderedNodes]);

  const currentStepIdx = useMemo(() => {
    if (!selectedNode || orderedNodes.length === 0) return 0;
    const idx = orderedNodes.findIndex((n) => n.id === selectedNode.id);
    return idx >= 0 ? idx : 0;
  }, [orderedNodes, selectedNode]);

  // Auto-play interactive step animation
  useEffect(() => {
    if (!isPlaying || orderedNodes.length <= 1) return;
    const timer = setInterval(() => {
      setSelectedNodeId((prev) => {
        const idx = orderedNodes.findIndex((n) => n.id === prev);
        const nextIdx = (idx + 1) % orderedNodes.length;
        return orderedNodes[nextIdx].id;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [isPlaying, orderedNodes]);

  const maxStepOrder = useMemo(() => {
    if (!flowchart?.nodes?.length) return 5;
    return Math.max(...flowchart.nodes.map((n) => n.stepOrder || 1), 1);
  }, [flowchart]);

  const stageHeaders = useMemo(() => {
    const defaults = ['Entry & Auth', 'User Trigger', 'Rule Check', 'Action / Handoff', 'Outcome', 'Sync / Audit'];
    const labels: string[] = [];
    for (let i = 0; i < maxStepOrder; i++) {
      labels.push(flowchart?.stageLabels?.[i] || defaults[i] || `Stage ${i + 1}`);
    }
    return labels;
  }, [flowchart?.stageLabels, maxStepOrder]);

  // Measure node DOM positions and compute SVG Bezier edge curves
  const computeEdges = useCallback(() => {
    const container = canvasInnerRef.current;
    if (!container || !flowchart?.edges?.length) {
      setEdgePaths([]);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const scale = zoomLevel || 1;
    setSvgBounds({
      width: container.scrollWidth,
      height: container.scrollHeight
    });

    const computed: ComputedEdgePath[] = [];

    for (const edge of flowchart.edges) {
      const fromEl = document.getElementById(`rf-node-${perspective}-${edge.from}`);
      const toEl = document.getElementById(`rf-node-${perspective}-${edge.to}`);
      if (!fromEl || !toEl) continue;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const fromLeft = (fromRect.left - containerRect.left) / scale;
      const fromTop = (fromRect.top - containerRect.top) / scale;
      const fromWidth = fromRect.width / scale;
      const fromHeight = fromRect.height / scale;

      const toLeft = (toRect.left - containerRect.left) / scale;
      const toTop = (toRect.top - containerRect.top) / scale;
      const toWidth = toRect.width / scale;
      const toHeight = toRect.height / scale;

      let startX = fromLeft + fromWidth;
      let startY = fromTop + fromHeight / 2;
      let endX = toLeft;
      let endY = toTop + toHeight / 2;
      let d = '';
      let labelX = (startX + endX) / 2;
      let labelY = (startY + endY) / 2;

      if (Math.abs(toLeft - fromLeft) < 24) {
        // Vertical transition across roles or branches in same column
        const goingDown = toTop > fromTop;
        startX = fromLeft + fromWidth / 2;
        startY = goingDown ? fromTop + fromHeight : fromTop;
        endX = toLeft + toWidth / 2;
        endY = goingDown ? toTop : toTop + toHeight;
        const cp = Math.max(22, Math.abs(endY - startY) * 0.45);
        d = `M ${startX} ${startY} C ${startX} ${goingDown ? startY + cp : startY - cp}, ${endX} ${goingDown ? endY - cp : endY + cp}, ${endX} ${endY}`;
        labelX = (startX + endX) / 2;
        labelY = (startY + endY) / 2;
      } else if (endX < startX - 8) {
        // Return / retry loop curve
        startX = fromLeft + fromWidth / 2;
        startY = fromTop + fromHeight;
        endX = toLeft + toWidth / 2;
        endY = toTop + toHeight;
        const drop = 34;
        d = `M ${startX} ${startY} C ${startX} ${startY + drop}, ${endX} ${endY + drop}, ${endX} ${endY}`;
        labelX = (startX + endX) / 2;
        labelY = (startY + endY) / 2 + drop * 0.75;
      } else {
        // Forward left-to-right Bezier curve
        const dx = Math.max(36, (endX - startX) * 0.48);
        d = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
        labelX = (startX + endX) / 2;
        labelY = (startY + endY) / 2;
      }

      computed.push({
        id: edge.id,
        d,
        labelX,
        labelY,
        label: edge.label,
        edgeType: edge.edgeType,
        from: edge.from,
        to: edge.to
      });
    }

    setEdgePaths(computed);
  }, [flowchart, zoomLevel, perspective]);

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => computeEdges());
    const t1 = setTimeout(() => computeEdges(), 180);
    const t2 = setTimeout(() => computeEdges(), 480);
    window.addEventListener('resize', computeEdges);

    let observer: ResizeObserver | null = null;
    if (canvasInnerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => computeEdges());
      observer.observe(canvasInnerRef.current);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', computeEdges);
      observer?.disconnect();
    };
  }, [computeEdges, activeRoleFilter, pathFilter, zoomLevel]);

  const getNodeVisual = (type: AiFlowchartNode['nodeType']) => {
    switch (type) {
      case 'role_entry':
        return { tag: 'ROLE ENTRY', badge: 'bg-slate-900 text-white', border: 'border-slate-300', icon: Users };
      case 'decision':
        return { tag: 'DECISION GATE', badge: 'bg-blue-50 text-[#2558E8] border border-blue-200', border: 'border-blue-300', icon: GitBranch };
      case 'outcome':
        return { tag: 'OUTCOME', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200', border: 'border-emerald-200', icon: CheckCircle2 };
      case 'blocked':
        return { tag: 'BLOCKED / ERROR', badge: 'bg-rose-50 text-rose-700 border border-rose-200', border: 'border-rose-200', icon: XCircle };
      default:
        return { tag: 'STEP', badge: 'bg-slate-100 text-slate-700 border border-slate-200', border: 'border-slate-200', icon: Cpu };
    }
  };

  const focusNodeId = hoveredNodeId || selectedNode?.id || null;
  const activeRoleObj = useMemo(
    () => flowchart?.roles?.find((r) => r.id === selectedNode?.roleId),
    [flowchart, selectedNode]
  );

  const incomingEdges = useMemo(
    () => (flowchart?.edges || []).filter((e) => e.to === selectedNode?.id),
    [flowchart, selectedNode]
  );
  const outgoingEdges = useMemo(
    () => (flowchart?.edges || []).filter((e) => e.from === selectedNode?.id),
    [flowchart, selectedNode]
  );

  return (
    <div className="space-y-4">
      {/* =====================================================================
          UNIFIED ARCHITECTURE FLOWCHART WORKSPACE CARD
         ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Top Header & Prompt Strip */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200/80 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-900 text-white shrink-0">
              <Sparkles className="w-3 h-3" />
              <span>AI Flow</span>
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight truncate max-w-md">
              {flowchart?.diagramTitle ||
                (perspective === 'frontend'
                  ? 'Frontend Roles & User Journey Flow'
                  : 'Backend Roles & System Execution Flow')}
            </h3>
            {flowchart?.summary && (
              <span
                title={flowchart.summary}
                className="inline-flex items-center justify-center w-5 h-5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-help transition-colors shrink-0"
              >
                <Info className="w-3.5 h-3.5" />
              </span>
            )}
            {!isGenerating && flowchart?.tokenUsage && (
              <span
                title={`Model: ${flowchart?.modelUsed || 'gemini-4-hydrogen'} · ${flowchart.tokenUsage.promptTokens.toLocaleString()} in / ${flowchart.tokenUsage.outputTokens.toLocaleString()} out`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] font-mono text-slate-500 tabular-nums shrink-0"
              >
                <Coins className="w-3 h-3 text-slate-400" />
                <span>{flowchart.tokenUsage.totalTokens.toLocaleString()} tok</span>
              </span>
            )}
            {isGenerating && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200/80 text-[10px] font-mono text-[#2558E8] tabular-nums shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2558E8] animate-pulse" />
                <span>~{liveTokenStats.totalTokens.toLocaleString()} tok · {liveTokenStats.elapsedSec}s</span>
              </span>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isGenerating) return;
              setActiveFocusChip('custom');
              generateRolesFlowchart(customPrompt);
            }}
            className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full xl:w-auto"
          >
            <select
              aria-label="Flow Focus"
              disabled={isGenerating}
              value={activeFocusChip}
              onChange={(e) => {
                const selected = FLOW_FOCUS_CHIPS.find((c) => c.id === e.target.value);
                if (!selected) return;
                setActiveFocusChip(selected.id);
                setCustomPrompt('');
                generateRolesFlowchart(selected.prompt);
              }}
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer disabled:opacity-60"
            >
              {FLOW_FOCUS_CHIPS.map((chip) => (
                <option key={chip.id} value={chip.id}>
                  {chip.label}
                </option>
              ))}
              {activeFocusChip === 'custom' && <option value="custom">Custom Focus</option>}
            </select>

            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Chart a specific user flow..."
              className="flex-1 sm:w-52 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Mapping...' : 'Generate'}</span>
            </button>
          </form>
        </div>

        {/* =====================================================================
            LOADING STATE (inside same unified card)
           ===================================================================== */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.24 }}
          >
            {/* Architectural Blueprint Background + Subtle Animated Swimlane Wireframe */}
            <div className="relative bg-slate-50/60 bg-dot-blueprint px-5 py-9 sm:px-8 sm:py-11">
            {/* Schematic Swimlane Skeleton (gentle depth anticipation) */}
            <div
              aria-hidden="true"
              className="hidden md:block max-w-4xl mx-auto opacity-55 select-none pointer-events-none"
            >
              <div className="relative rounded-xl border border-slate-200/80 bg-white/75 p-4 space-y-4">
                {/* Animated SVG Signal Wireframe */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 800 160"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 188 44 L 212 44 M 384 44 L 408 44 M 580 44 L 604 44"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-flow-dash"
                  />
                  <path
                    d="M 188 116 L 604 116"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="1.4"
                    strokeDasharray="4 4"
                    className="animate-flow-dash"
                  />
                  <path
                    d="M 496 72 C 496 106, 560 116, 604 116"
                    fill="none"
                    stroke="#FCA5A5"
                    strokeWidth="1.4"
                    strokeDasharray="4 4"
                    className="animate-flow-dash"
                  />
                  <circle r="3" fill="#2558E8">
                    <animateMotion dur="2.1s" repeatCount="indefinite" path="M 188 44 L 604 44" />
                  </circle>
                </svg>

                {[0, 1].map((laneIdx) => (
                  <div key={laneIdx} className="grid grid-cols-4 gap-6 items-center">
                    <div className="h-14 rounded-lg bg-slate-50 border border-slate-200/70 p-2.5 flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-slate-200/90 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2 w-16 rounded bg-slate-200/90 overflow-hidden relative">
                          <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer-sweep" />
                        </div>
                        <div className="h-1.5 w-11 rounded bg-slate-200/60" />
                      </div>
                    </div>

                    {[0, 1, 2].map((colIdx) => {
                      const showGhost = !(laneIdx === 1 && colIdx === 1);
                      return (
                        <div key={colIdx}>
                          {showGhost ? (
                            <motion.div
                              initial={{ opacity: 0.45 }}
                              animate={{ opacity: [0.45, 0.85, 0.45] }}
                              transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                delay: (laneIdx * 3 + colIdx) * 0.22,
                                ease: 'easeInOut'
                              }}
                              className="h-14 rounded-lg bg-white border border-slate-200/80 p-2.5 space-y-2 shadow-2xs"
                            >
                              <div className="flex items-center justify-between">
                                <div className="h-2.5 w-12 rounded bg-slate-200/80" />
                                <div className="h-2 w-5 rounded bg-slate-100" />
                              </div>
                              <div className="h-2 w-4/5 rounded bg-slate-200/90 overflow-hidden relative">
                                <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/90 to-transparent animate-shimmer-sweep" />
                              </div>
                            </motion.div>
                          ) : (
                            <div className="h-14" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Precision Center HUD Card (Floating on desktop, centered cleanly on mobile) */}
            <div className="md:absolute md:inset-0 md:flex md:items-center md:justify-center md:p-4">
              <div className="w-full max-w-md mx-auto rounded-xl border border-slate-200/95 bg-white/95 backdrop-blur-xs shadow-[0_14px_34px_-12px_rgba(15,23,42,0.14)] p-5 space-y-4">
                {/* Top Header + Animated Orbital Ring */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 rounded-lg border border-transparent border-t-[#2558E8] border-r-[#2558E8]/30"
                      />
                      <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 tracking-tight truncate">
                        Building {perspective === 'frontend' ? 'Frontend' : 'Backend'} Roles &amp; Flow
                      </h4>
                      <div className="h-4 overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={liveTokenStats.stageLabel}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="text-[11px] text-slate-500 truncate"
                          >
                            {liveTokenStats.stageLabel}…
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-[11px] font-mono font-medium text-slate-700 tabular-nums shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2558E8] animate-pulse" />
                    <span>{liveTokenStats.elapsedSec}s</span>
                  </span>
                </div>

                {/* Minimal 3-Phase Stepper */}
                <div className="grid grid-cols-3 gap-1.5">
                  {['1. Context', '2. Roles & Gates', '3. Layout'].map((stepName, idx) => {
                    const isDone = liveTokenStats.phaseIndex > idx;
                    const isActive = liveTokenStats.phaseIndex === idx;
                    return (
                      <div
                        key={stepName}
                        className={`px-2 py-1 rounded-md border text-[10px] font-mono flex items-center justify-between transition-colors ${
                          isActive
                            ? 'bg-blue-50/70 border-blue-200 text-[#2558E8] font-semibold'
                            : isDone
                            ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-700'
                            : 'bg-slate-50 border-slate-200/60 text-slate-400'
                        }`}
                      >
                        <span className="truncate">{stepName}</span>
                        {isDone ? (
                          <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                        ) : isActive ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2558E8] animate-pulse shrink-0" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* Precision Token Consumption Telemetry Strip */}
                <div className="rounded-lg border border-slate-200/90 bg-slate-50/80 overflow-hidden">
                  <div className="px-3 py-2 flex items-center justify-between text-[10px] font-mono">
                    <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-slate-600">
                      <Coins className="w-3 h-3 text-[#2558E8]" />
                      <span>Token Consumption</span>
                    </span>
                    <span className="text-slate-400">
                      {(sampledCharsCount / 1000).toFixed(1)}k / 16k chars
                    </span>
                  </div>

                  {/* Silky Gradient Progress Track with Shimmer */}
                  <div className="px-3 pb-2.5">
                    <div className="h-1.5 w-full rounded-full bg-slate-200/80 overflow-hidden relative">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-slate-800 via-[#2558E8] to-sky-500 transition-all duration-200 ease-out relative overflow-hidden"
                        style={{ width: `${liveTokenStats.progressPct}%` }}
                      >
                        <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent animate-shimmer-sweep" />
                      </div>
                    </div>
                  </div>

                  {/* Clean Hairline Metrics Row */}
                  <div className="grid grid-cols-3 divide-x divide-slate-200/80 border-t border-slate-200/80 bg-white text-[11px] font-mono tabular-nums">
                    <div className="px-3 py-2">
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400">Input</span>
                      <span className="font-semibold text-slate-800">~{liveTokenStats.inputTokens.toLocaleString()}</span>
                    </div>
                    <div className="px-3 py-2">
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400">Output</span>
                      <span className="font-semibold text-[#2558E8]">~{liveTokenStats.outputTokens.toLocaleString()}</span>
                    </div>
                    <div className="px-3 py-2">
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400">Est. Total</span>
                      <span className="font-semibold text-slate-900">~{liveTokenStats.totalTokens.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        )}

        {/* ERROR STATE */}
        {!isGenerating && errorMsg && (
          <div className="bg-rose-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800">
                <strong className="font-semibold text-rose-900 block">Could not generate flowchart</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => generateRolesFlowchart(customPrompt)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* =====================================================================
            CANVAS CONTROLS & DIAGRAM SURFACE (inside same unified card)
           ===================================================================== */}
        {!isGenerating && flowchart && (
          <>
            {/* Integrated Quiet Canvas Control Toolbar */}
            <div className="px-4 sm:px-5 py-2 bg-slate-50/60 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
              {/* Left: Role Dropdown + Branch Switch */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Filter by Role"
                  value={activeRoleFilter}
                  onChange={(e) => setActiveRoleFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="all">All Roles ({flowchart.roles.length})</option>
                  {flowchart.roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>

                <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
                  {[
                    { id: 'all', label: 'All Branches' },
                    { id: 'allow', label: 'Allowed' },
                    { id: 'deny', label: 'Blocked' }
                  ].map((pf) => (
                    <button
                      key={pf.id}
                      type="button"
                      onClick={() => setPathFilter(pf.id as 'all' | 'allow' | 'deny')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                        pathFilter === pf.id
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {pf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Unified Playback & Zoom Controls */}
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white divide-x divide-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                      isPlaying
                        ? 'bg-blue-50 text-[#2558E8]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isPlaying ? 'Pause' : 'Animate'}</span>
                  </button>

                  {orderedNodes.length > 0 && (
                    <div className="inline-flex items-center px-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPlaying(false);
                          const prev = (currentStepIdx - 1 + orderedNodes.length) % orderedNodes.length;
                          setSelectedNodeId(orderedNodes[prev].id);
                        }}
                        className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                        title="Previous step"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-[11px] text-slate-600 px-1 tabular-nums">
                        {currentStepIdx + 1}/{orderedNodes.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPlaying(false);
                          const next = (currentStepIdx + 1) % orderedNodes.length;
                          setSelectedNodeId(orderedNodes[next].id);
                        }}
                        className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                        title="Next step"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white divide-x divide-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.65, Number((z - 0.1).toFixed(2))))}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="px-2 py-1 text-[11px] font-mono text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer tabular-nums"
                    title="Reset Zoom to 100%"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(1.15, Number((z + 0.1).toFixed(2))))}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const vw = scrollViewportRef.current?.clientWidth || 0;
                      const cw = canvasInnerRef.current?.scrollWidth || svgBounds.width;
                      if (vw > 0 && cw > vw) {
                        const fitScale = Math.max(0.65, Math.min(1, Number((vw / cw).toFixed(2))));
                        setZoomLevel(fitScale);
                      } else {
                        setZoomLevel(1);
                      }
                    }}
                    className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 inline-flex items-center gap-1 cursor-pointer"
                    title="Fit diagram to viewport"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Fit</span>
                  </button>
                </div>
              </div>
            </div>

            <div ref={scrollViewportRef} className="overflow-x-auto bg-slate-50/40">
              <div
                style={
                  zoomLevel !== 1 && svgBounds.width > 0 && svgBounds.height > 0
                    ? {
                        width: `${Math.ceil(svgBounds.width * zoomLevel)}px`,
                        height: `${Math.ceil(svgBounds.height * zoomLevel)}px`,
                        minWidth: '100%'
                      }
                    : { minWidth: '100%' }
                }
              >
                <div
                  ref={canvasInnerRef}
                  className="relative w-max min-w-full p-5 pb-8 transition-transform origin-top-left"
                  style={{
                    transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined
                  }}
                >
                  {/* Journey Stage Headers Row */}
                  <div className="relative z-10 flex items-center mb-3">
                    <div className="w-48 shrink-0 px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                      Role / Actor
                    </div>
                    <div
                      className="flex-1 grid gap-14 px-5"
                      style={{
                        gridTemplateColumns: `repeat(${maxStepOrder}, minmax(205px, 1fr))`
                      }}
                    >
                      {stageHeaders.map((stage, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 min-w-0">
                          <span className="w-4 h-4 rounded bg-slate-200/80 text-slate-700 flex items-center justify-center text-[9px] shrink-0">
                            {sIdx + 1}
                          </span>
                          <span className="truncate">{stage}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Role Swimlane Rows (z-10 backgrounds; individual cards lift to z-30) */}
                  <div className="relative z-10 divide-y divide-slate-200/80 border border-slate-200/80 rounded-xl bg-white">
                    {flowchart.roles.map((role, rIdx) => {
                      const isRoleMuted = activeRoleFilter !== 'all' && activeRoleFilter !== role.id;

                      return (
                        <motion.div
                          key={role.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: isRoleMuted ? 0.35 : 1, y: 0 }}
                          transition={{ duration: 0.25, delay: rIdx * 0.06 }}
                          className="flex items-stretch min-h-[144px]"
                        >
                          {/* Left Role Badge Column */}
                          <button
                            type="button"
                            onClick={() => setActiveRoleFilter(activeRoleFilter === role.id ? 'all' : role.id)}
                            className={`w-48 shrink-0 p-4 bg-slate-50 hover:bg-slate-100/90 border-r border-slate-200/80 flex flex-col justify-center text-left transition-colors cursor-pointer ${
                              rIdx === 0 ? 'rounded-tl-xl' : ''
                            } ${rIdx === flowchart.roles.length - 1 ? 'rounded-bl-xl' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                                {role.name.charAt(0).toUpperCase()}
                              </span>
                              <span className="text-xs font-semibold text-slate-900 leading-tight break-words">
                                {role.name}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 leading-snug mt-1.5 break-words">
                              {role.accessSummary}
                            </span>
                          </button>

                          {/* Flow Step Grid */}
                          <div
                            className="flex-1 grid gap-14 px-5 py-6 items-center"
                            style={{
                              gridTemplateColumns: `repeat(${maxStepOrder}, minmax(205px, 1fr))`
                            }}
                          >
                            {Array.from({ length: maxStepOrder }, (_, colIdx) => {
                              const stepNum = colIdx + 1;
                              const cellNodes = flowchart.nodes.filter(
                                (n) => n.roleId === role.id && n.stepOrder === stepNum
                              );

                              return (
                                <div key={stepNum} className="flex flex-col gap-4 items-stretch justify-center min-w-0">
                                  {cellNodes.map((node, nIdx) => {
                                    const vis = getNodeVisual(node.nodeType);
                                    const Icon = vis.icon;
                                    const isSelected = selectedNode?.id === node.id;
                                    const inBranch = pathFilteredNodeIds.has(node.id);
                                    const isDecision = node.nodeType === 'decision';

                                    return (
                                      <motion.button
                                        key={node.id}
                                        id={`rf-node-${perspective}-${node.id}`}
                                        type="button"
                                        initial={{ opacity: 0, scale: 0.94, y: 8 }}
                                        animate={{
                                          opacity: inBranch ? 1 : 0.25,
                                          scale: isSelected ? 1.02 : 1,
                                          y: 0
                                        }}
                                        whileHover={{ y: -2, scale: 1.02 }}
                                        whileTap={{ scale: 0.99 }}
                                        transition={{
                                          type: 'spring',
                                          stiffness: 360,
                                          damping: 26,
                                          delay: (node.stepOrder - 1) * 0.04 + nIdx * 0.03
                                        }}
                                        onMouseEnter={() => setHoveredNodeId(node.id)}
                                        onMouseLeave={() => setHoveredNodeId(null)}
                                        onClick={() => {
                                          setIsPlaying(false);
                                          setSelectedNodeId(node.id);
                                        }}
                                        className={`relative z-30 w-full text-left rounded-lg border p-3.5 bg-white cursor-pointer space-y-1.5 transition-shadow ${
                                          isDecision ? 'border-l-[3px] border-l-[#2558E8]' : ''
                                        } ${
                                          isSelected
                                            ? 'border-[#2558E8] ring-2 ring-[#2558E8]/20 shadow-md'
                                            : `${vis.border} hover:border-slate-400 shadow-2xs`
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-1.5">
                                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide shrink-0 ${vis.badge}`}>
                                            <Icon className="w-2.5 h-2.5" />
                                            <span>{vis.tag}</span>
                                          </span>
                                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                            p.{node.sourcePage || 1}
                                          </span>
                                        </div>
                                        <div className="text-xs font-semibold text-slate-900 leading-snug break-words">
                                          {node.label}
                                        </div>
                                        <div className="text-[11px] text-slate-500 leading-snug break-words">
                                          {node.sublabel}
                                        </div>
                                      </motion.button>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Layer 2 (z-20): Crisp Animated SVG Connectors (above lane bg z-10, cleanly behind node cards z-30) */}
                  <svg
                    className="absolute inset-0 pointer-events-none z-20"
                    width={svgBounds.width}
                    height={svgBounds.height}
                  >
                    <defs>
                      <marker id="rf-arrow-normal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748B" />
                      </marker>
                      <marker id="rf-arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 8 5 L 0 9 z" fill="#2558E8" />
                      </marker>
                      <marker id="rf-arrow-allow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 8 5 L 0 9 z" fill="#059669" />
                      </marker>
                      <marker id="rf-arrow-deny" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 8 5 L 0 9 z" fill="#E11D48" />
                      </marker>
                    </defs>

                    {edgePaths.map((ep) => {
                      const fromNode = flowchart.nodes.find((n) => n.id === ep.from);
                      const toNode = flowchart.nodes.find((n) => n.id === ep.to);
                      const matchesRole =
                        activeRoleFilter === 'all' ||
                        fromNode?.roleId === activeRoleFilter ||
                        toNode?.roleId === activeRoleFilter;
                      const matchesBranch =
                        pathFilteredNodeIds.has(ep.from) && pathFilteredNodeIds.has(ep.to);

                      const isHighlighted =
                        focusNodeId !== null && (ep.from === focusNodeId || ep.to === focusNodeId);

                      const strokeColor =
                        ep.edgeType === 'deny'
                          ? '#E11D48'
                          : ep.edgeType === 'allow'
                          ? '#059669'
                          : isHighlighted
                          ? '#2558E8'
                          : '#64748B';

                      const markerId =
                        ep.edgeType === 'deny'
                          ? 'url(#rf-arrow-deny)'
                          : ep.edgeType === 'allow'
                          ? 'url(#rf-arrow-allow)'
                          : isHighlighted
                          ? 'url(#rf-arrow-active)'
                          : 'url(#rf-arrow-normal)';

                      return (
                        <g
                          key={ep.id}
                          style={{ transition: 'opacity 220ms ease' }}
                          opacity={!matchesRole || !matchesBranch ? 0.14 : isHighlighted || isPlaying ? 1 : 0.85}
                        >
                          <path
                            d={ep.d}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth={isHighlighted ? 2.4 : 1.8}
                            strokeDasharray={isHighlighted || isPlaying || ep.edgeType === 'deny' ? '6 6' : undefined}
                            className={isHighlighted || isPlaying ? 'animate-flow-dash' : undefined}
                            markerEnd={markerId}
                          />

                          {(isHighlighted || isPlaying) && matchesRole && matchesBranch && (
                            <circle r="3.5" fill={strokeColor}>
                              <animateMotion dur="1.7s" repeatCount="indefinite" path={ep.d} />
                            </circle>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Layer 4 (z-40): Crisp Edge Condition Badges (always readable, never clipped or washed out) */}
                  <div
                    className="absolute inset-0 pointer-events-none z-40"
                    style={{ width: svgBounds.width, height: svgBounds.height }}
                  >
                    {edgePaths.map((ep) => {
                      if (!ep.label) return null;
                      const fromNode = flowchart.nodes.find((n) => n.id === ep.from);
                      const toNode = flowchart.nodes.find((n) => n.id === ep.to);
                      const matchesRole =
                        activeRoleFilter === 'all' ||
                        fromNode?.roleId === activeRoleFilter ||
                        toNode?.roleId === activeRoleFilter;
                      const matchesBranch =
                        pathFilteredNodeIds.has(ep.from) && pathFilteredNodeIds.has(ep.to);
                      const isHighlighted =
                        focusNodeId !== null && (ep.from === focusNodeId || ep.to === focusNodeId);

                      const badgeStyle =
                        ep.edgeType === 'deny'
                          ? 'text-rose-700 border-rose-200 bg-white'
                          : ep.edgeType === 'allow'
                          ? 'text-emerald-700 border-emerald-200 bg-white'
                          : isHighlighted
                          ? 'text-[#2558E8] border-blue-300 bg-white'
                          : 'text-slate-600 border-slate-200 bg-white';

                      return (
                        <div
                          key={`lbl-${ep.id}`}
                          style={{
                            left: `${ep.labelX}px`,
                            top: `${ep.labelY}px`,
                            opacity: !matchesRole || !matchesBranch ? 0.16 : isHighlighted || isPlaying ? 1 : 0.94
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded border shadow-2xs text-[10px] font-mono font-semibold whitespace-nowrap transition-opacity ${badgeStyle}`}
                        >
                          {ep.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Legend Footer */}
            <div className="px-4 py-2.5 bg-white border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-slate-500 inline-block" /> Flow
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-600 inline-block" /> Allowed / Valid
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-600 inline-block" /> Blocked / Error
                </span>
              </div>
              <span className="font-mono text-slate-400">
                Click any node or branch chip below to walk through the user flow
              </span>
            </div>
          </>
        )}
      </div>

      {/* =====================================================================
          INTERACTIVE USER-FLOW STEP INSPECTOR + BRANCH NAVIGATOR
         ===================================================================== */}
      {!isGenerating && flowchart && (
        <AnimatePresence mode="wait">
            {selectedNode && (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* What Happens + Rule Checked */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                        {activeRoleObj?.name || 'Role'} · Step {selectedNode.stepOrder}
                      </span>
                      <span className="text-xs font-semibold text-slate-900">
                        {selectedNode.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedNode.summary}
                    </p>
                    {selectedNode.ruleHint && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          <strong>Rule:</strong> {selectedNode.ruleHint}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Technical Touchpoint & Resulting State */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {perspective === 'frontend' ? 'Frontend UI Touchpoint' : 'Backend API / DB Touchpoint'}
                      </span>
                      <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 select-all">
                        {selectedNode.techTouchpoint}
                      </div>
                    </div>
                    {selectedNode.outcomeState && (
                      <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">Resulting State:</span>
                        <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70">
                          {selectedNode.outcomeState}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Page Citation */}
                  <div className="lg:col-span-2 flex lg:justify-end">
                    <button
                      type="button"
                      onClick={() => onOpenSourcePage(selectedNode.sourcePage || 1)}
                      className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Page {selectedNode.sourcePage || 1}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Clickable Flow Navigation Chips (Walk Branches Interactively) */}
                {(incomingEdges.length > 0 || outgoingEdges.length > 0) && (
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {incomingEdges.length > 0 && (
                        <span className="text-[11px] text-slate-400 font-medium mr-1">From:</span>
                      )}
                      {incomingEdges.map((edge) => {
                        const src = flowchart.nodes.find((n) => n.id === edge.from);
                        if (!src) return null;
                        return (
                          <button
                            key={edge.id}
                            type="button"
                            onClick={() => {
                              setIsPlaying(false);
                              setSelectedNodeId(src.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 cursor-pointer transition-colors"
                          >
                            <ArrowLeft className="w-3 h-3 text-slate-400" />
                            <span>{src.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {outgoingEdges.length > 0 && (
                        <span className="text-[11px] text-slate-400 font-medium mr-1">Next Branches:</span>
                      )}
                      {outgoingEdges.map((edge) => {
                        const tgt = flowchart.nodes.find((n) => n.id === edge.to);
                        if (!tgt) return null;
                        const isAllow = edge.edgeType === 'allow';
                        const isDeny = edge.edgeType === 'deny';
                        return (
                          <button
                            key={edge.id}
                            type="button"
                            onClick={() => {
                              setIsPlaying(false);
                              setSelectedNodeId(tgt.id);
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium cursor-pointer transition-colors ${
                              isAllow
                                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                                : isDeny
                                ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800'
                                : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-[#2558E8]'
                            }`}
                          >
                            <span className="font-mono font-semibold">{edge.label}:</span>
                            <span>{tgt.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
      )}
    </div>
  );
};
