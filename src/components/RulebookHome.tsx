import React, { useState, useRef } from 'react';
import { Upload, ArrowRight, FileText, CheckCircle2, Sparkles, File, Shield } from 'lucide-react';
import { PRELOADED_PROJECTS } from '../data/preloadedProjects';
import { EngineeringProject } from '../types/project';
import { parseCustomEngineeringDocument } from '../utils/documentParser';

interface Props {
  onProjectReady: (project: EngineeringProject) => void;
}

export const RulebookHome: React.FC<Props> = ({ onProjectReady }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const processUploadedFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      const parsedDoc = parseCustomEngineeringDocument(file.name, content);

      // Build synthesized project
      const customProject: EngineeringProject = {
        id: `proj-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        clientName: 'Enterprise Client',
        domain: 'Custom',
        currentStack: 'Legacy Document / Specification',
        targetStack: 'Modern Full-Stack Architecture',
        sourceDocName: file.name,
        fileSizeBytes: file.size,
        uploadedAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'ready',
        prd: {
          visionStatement: `Engineered specification and modernization blueprint for ${file.name}.`,
          targetAudience: [
            { persona: 'Product Owner', description: 'Governs scope & releases', coreNeed: 'Clear PRD & acceptance criteria.' },
            { persona: 'Lead Architect', description: 'Designs data & service tier', coreNeed: 'Rigorous FSD contracts & schema.' }
          ],
          problemStatement: 'Unstructured legacy documentation slows engineering discovery and causes estimation inaccuracies.',
          valueProposition: 'Rulebook decomposes raw text into structured PRD, BRD, FSD, flowmaps, and calibrated PERT estimations.',
          successMetrics: [
            { metric: 'Discovery Time', target: '< 5 minutes', baseline: '3 - 5 days' },
            { metric: 'Architecture Clarity', target: '100% visual traceability', baseline: 'Scattered docs' }
          ],
          coreWorkflows: [
            { workflowName: 'System Ingestion & Execution', steps: ['Ingest Data', 'Apply Rules', 'Generate Result'], outcome: 'Standardized output' }
          ]
        },
        brd: {
          objectives: ['Decompose functional scope', 'Validate business rules', 'Calibrate delivery timeline'],
          stakeholders: [
            { role: 'Engineering Sponsor', name: 'VP of Technology', raci: 'Accountable (A)', responsibility: 'Approves budget & milestone schedule.' }
          ],
          requirements: parsedDoc.features.map((f, idx) => ({
            id: `BRD-${f.code}`,
            module: f.category,
            title: f.title,
            description: f.description,
            businessValue: 'Core system functionality.',
            priority: idx < 3 ? 'Must Have' : 'Should Have',
            acceptanceCriteria: ['Validates input boundary', 'Ensures data persistence'],
            stakeholder: 'Business Operations'
          })),
          asIsVsToBe: [
            { area: 'Discovery & Design', asIs: 'Manual doc hunting across folders', toBe: 'Instant visual understanding with Rulebook', impact: '85% time saved' }
          ],
          roiMetrics: [
            { metric: 'Necessary LOC', value: `${parsedDoc.headlineLoc.necessaryLoc} lines`, context: 'Application logic' },
            { metric: 'Calibrated Hours', value: `${parsedDoc.recommendedHours} hrs`, context: 'Standard delivery estimate' }
          ]
        },
        fsd: {
          architectureTopology: 'Clean Layered Architecture with Rest API Gateway and Relational Storage.',
          endpoints: [
            {
              module: 'Core Services',
              name: 'Execute Business Logic',
              method: 'POST',
              endpoint: '/api/v1/process',
              description: 'Processes input parameters according to document specification.',
              headers: { 'Content-Type': 'application/json' },
              responseBody: '{\n  "status": "SUCCESS"\n}',
              securityScope: 'Bearer JWT',
              validationRules: ['Parameters required']
            }
          ],
          entities: [
            {
              tableName: 'domain_entities',
              description: 'Primary records table',
              columns: [
                { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'Primary Key' },
                { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Timestamp' }
              ],
              indices: ['CREATE INDEX idx_domain_entities ON domain_entities(id);']
            }
          ],
          businessRules: parsedDoc.businessRules.map(b => ({ ruleCode: b.code, title: b.title, description: b.description }))
        },
        estimation: {
          totalLoc: parsedDoc.headlineLoc.allFilesWithUtilities,
          necessaryLoc: parsedDoc.headlineLoc.necessaryLoc,
          recommendedHours: parsedDoc.recommendedHours,
          hourIndex: parsedDoc.hourIndex,
          confidenceScore: parsedDoc.confidenceScore,
          tasks: parsedDoc.features.map((f, idx) => ({
            id: `TSK-${f.code}-${idx + 1}`,
            wbsCode: `1.${idx + 1}`,
            sprint: 1,
            title: f.title,
            category: 'Frontend',
            optimisticDays: 2,
            mostLikelyDays: 4,
            pessimisticDays: 6,
            storyPoints: 5,
            assignedRole: 'Senior Full-Stack Engineer',
            deliverables: f.description
          }))
        },
        flowmap: {
          nodes: parsedDoc.flowNodes,
          edges: parsedDoc.flowEdges
        },
        userJourney: {
          personaName: 'Lead Engineer',
          roleTitle: 'Primary User',
          steps: parsedDoc.userJourneySteps
        },
        rawDocument: parsedDoc
      };

      setIsProcessing(false);
      onProjectReady(customProject);
    };
    reader.readAsText(file);
  };

  const loadPreloadedProject = (projId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const proj = PRELOADED_PROJECTS.find(p => p.id === projId) || PRELOADED_PROJECTS[0];
      setIsProcessing(false);
      onProjectReady(proj);
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 space-y-10 animate-in fade-in duration-200">
      
      {/* Top Hero Section matching screenshot */}
      <div className="space-y-4">
        <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase block">
          START WITH THE SOURCE
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Read it clearly. <br />
          <span className="text-slate-400 font-normal">Before you analyse it.</span>
        </h1>
        <div className="text-sm text-slate-500 space-y-1 max-w-xl font-normal leading-relaxed">
          <p>Compare the original PDF with the text Rulebook reads.</p>
          <p>Find missing content and unclear tables before moving forward.</p>
        </div>
      </div>

      {/* Main Drop Card matching reference image */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        className={`bg-white rounded-3xl border transition-all duration-200 p-10 sm:p-14 text-center shadow-xs space-y-6 ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50/40 ring-4 ring-indigo-500/10' 
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.txt,.md,.json,.csv"
          className="hidden"
        />

        {/* Clean Document Icon with check badge */}
        <div className="relative w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-2xs">
          <FileText className="w-8 h-8" strokeWidth={1.75} />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-100 border-2 border-white text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card Title & Subtitle */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            A clearer view starts here.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Drop a PDF here to see its pages and extracted text.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-7 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-sm hover:shadow inline-flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{isProcessing ? 'Analyzing Document...' : 'Open a PDF'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Metadata Note */}
        <div className="text-[11px] text-slate-400">
          PDF only · up to 20 MB and 150 pages
        </div>

        {/* Pre-loaded Benchmark One-Click Starters */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
          <span className="text-slate-400 font-medium">Or open attached source document:</span>
          <button
            onClick={() => loadPreloadedProject('proj-sales-forecast')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors border border-slate-200/80 inline-flex items-center gap-1.5"
          >
            <File className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sales Forecast LOC & ETA Analysis (8 Pages)</span>
          </button>
          <button
            onClick={() => loadPreloadedProject('proj-edupulse-attendance')}
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
          >
            EduPulse Attendance Spec
          </button>
        </div>

        {/* Bottom privacy badge */}
        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>PDF reading stays in your browser. AI runs only if you choose it.</span>
        </div>
      </div>

    </div>
  );
};
