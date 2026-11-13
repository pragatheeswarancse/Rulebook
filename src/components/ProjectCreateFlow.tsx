import React, { useState, useRef } from 'react';
import { 
  FolderPlus, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Layers, 
  ShieldCheck, 
  X, 
  AlertCircle,
  Database,
  BarChart3,
  Compass
} from 'lucide-react';
import { EngineeringProject } from '../types/project';
import { PRELOADED_PROJECTS } from '../data/preloadedProjects';
import { parseCustomEngineeringDocument } from '../utils/documentParser';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: EngineeringProject) => void;
}

export const ProjectCreateFlow: React.FC<Props> = ({ isOpen, onClose, onProjectCreated }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [domain, setDomain] = useState<'Enterprise Modernization' | 'EdTech & Governance' | 'Financial & Billing' | 'Healthcare' | 'Custom'>('Enterprise Modernization');
  const [targetStack, setTargetStack] = useState('.NET WinForms / C# & Modern Web API');
  const [currentStack, setCurrentStack] = useState('Visual Basic 6 Legacy Desktop EXE');

  // Document upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('proj-sales-forecast');
  const [uploadSource, setUploadSource] = useState<'preset' | 'file' | 'paste'>('preset');
  const [pasteContent, setPasteContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Analysis progress animation
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisPhase, setAnalysisPhase] = useState('Scanning document structure...');
  const [analyzedProject, setAnalyzedProject] = useState<EngineeringProject | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleNextToUpload = () => {
    if (!projectName.trim() && uploadSource !== 'preset') {
      setErrorMsg('Please specify a project name to continue.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(2);
  };

  const handleStartAnalysis = () => {
    setErrorMsg(null);
    setCurrentStep(3);
    setAnalysisProgress(15);
    setAnalysisPhase('Extracting lines of code & layout geometry...');

    if (uploadSource === 'preset') {
      const preset = PRELOADED_PROJECTS.find(p => p.id === selectedPresetId) || PRELOADED_PROJECTS[0];
      
      setTimeout(() => {
        setAnalysisProgress(40);
        setAnalysisPhase('Discovering Product Requirements (PRD) & Target Personas...');
      }, 400);

      setTimeout(() => {
        setAnalysisProgress(65);
        setAnalysisPhase('Extracting Business Drivers (BRD) & MoSCoW Prioritization...');
      }, 800);

      setTimeout(() => {
        setAnalysisProgress(85);
        setAnalysisPhase('Synthesizing FSD APIs, Database Schema & Cutoff Rules...');
      }, 1200);

      setTimeout(() => {
        setAnalysisProgress(100);
        setAnalysisPhase('Generating Interactive Flowmap & Estimation Model!');
        setAnalyzedProject(preset);
      }, 1600);

    } else if (uploadSource === 'file' && selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string || '';
        const parsedDoc = parseCustomEngineeringDocument(selectedFile.name, text);
        
        const newProj: EngineeringProject = {
          id: `proj-${Date.now()}`,
          name: projectName || selectedFile.name.replace(/\.[^/.]+$/, ''),
          clientName: clientName || 'Enterprise Client',
          domain,
          currentStack: currentStack || 'Legacy Codebase',
          targetStack: targetStack || 'Modern Web Architecture',
          sourceDocName: selectedFile.name,
          fileSizeBytes: selectedFile.size,
          uploadedAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'ready',
          prd: {
            visionStatement: `Modernized delivery of ${projectName} with streamlined data access and responsive user experiences.`,
            targetAudience: [
              { persona: 'Operations Lead', description: 'Monitors daily throughput', coreNeed: 'Real-time query performance without UI freeze.' },
              { persona: 'Executive Sponsor', description: 'Reviews milestone compliance', coreNeed: 'Accurate reporting and audit defensibility.' }
            ],
            problemStatement: 'Legacy systems create operational friction, unindexed data queries, and lack of audit traceability.',
            valueProposition: 'Modern architecture with guaranteed performance SLAs and auditable state governance.',
            successMetrics: [
              { metric: 'Query Response Time', target: '<500ms', baseline: '10-15s' },
              { metric: 'Uptime SLA', target: '99.9%', baseline: '95%' }
            ],
            coreWorkflows: [
              { workflowName: 'Primary Operational Flow', steps: ['Authenticate', 'Select Criteria', 'Run Analysis', 'Export Report'], outcome: 'Validated business outputs.' }
            ]
          },
          brd: {
            objectives: ['Modernize core architecture', 'Preserve data integrity', 'Deliver compliant reporting'],
            stakeholders: [
              { role: 'Project Sponsor', name: clientName || 'Executive Sponsor', raci: 'Accountable (A)', responsibility: 'Overall governance.' }
            ],
            requirements: parsedDoc.features.map((f, idx) => ({
              id: `BRD-${f.code}`,
              module: f.category,
              title: f.title,
              description: f.description,
              businessValue: 'Ensures functional continuity and performance.',
              priority: idx < 3 ? 'Must Have' : 'Should Have',
              acceptanceCriteria: ['Validates input parameters.', 'Outputs structured result payload.'],
              stakeholder: 'Business Operations'
            })),
            asIsVsToBe: [
              { area: 'Performance', asIs: 'Slow and unindexed', toBe: 'Asynchronous streaming', impact: '10x faster execution' }
            ],
            roiMetrics: [
              { metric: 'Necessary LOC', value: `${parsedDoc.headlineLoc.necessaryLoc} lines`, context: 'Refactored logic' },
              { metric: 'Estimated Effort', value: `${parsedDoc.recommendedHours} hrs`, context: 'Estimated delivery' }
            ]
          },
          fsd: {
            architectureTopology: `${targetStack} with tiered services.`,
            endpoints: [
              {
                module: 'Core Execution',
                name: 'Process Analysis Query',
                method: 'POST',
                endpoint: '/api/v1/analyze',
                description: 'Processes uploaded document data against domain models.',
                headers: { 'Content-Type': 'application/json' },
                responseBody: '{\n  "status": "SUCCESS",\n  "processed": true\n}',
                securityScope: 'Bearer JWT',
                validationRules: ['Parameters must be non-empty']
              }
            ],
            entities: [
              {
                tableName: 'domain_records',
                description: 'Primary records table',
                columns: [
                  { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'Primary Key' },
                  { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Created' }
                ],
                indices: ['CREATE INDEX idx_records_created ON domain_records(created_at);']
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
            tasks: parsedDoc.features.map((f, fIdx) => ({
              id: `TSK-${f.code}-${fIdx + 1}`,
              wbsCode: `1.${fIdx + 1}`,
              sprint: Math.min(3, Math.floor(fIdx / 2) + 1),
              title: f.title,
              category: 'Frontend',
              optimisticDays: 3,
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
            personaName: 'Operations Lead',
            roleTitle: 'Primary User',
            steps: parsedDoc.userJourneySteps
          },
          rawDocument: parsedDoc
        };

        setAnalysisProgress(100);
        setAnalysisPhase('Document Breakdown Ready!');
        setAnalyzedProject(newProj);
      };
      reader.readAsText(selectedFile);
    } else {
      // Paste text
      const parsedDoc = parseCustomEngineeringDocument(projectName || 'Custom Specification', pasteContent);
      const newProj = PRELOADED_PROJECTS[0]; // fallback template
      setAnalysisProgress(100);
      setAnalysisPhase('Document Breakdown Ready!');
      setAnalyzedProject({
        ...newProj,
        id: `proj-${Date.now()}`,
        name: projectName || 'Pasted Specification Project',
        clientName: clientName || 'Enterprise Operations',
        sourceDocName: 'Pasted Specification Content'
      });
    }
  };

  const handleFinish = () => {
    if (analyzedProject) {
      onProjectCreated(analyzedProject);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Create Project & Analyze Document</h3>
                <span className="text-xs font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                  Step {currentStep} of 3
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {currentStep === 1 && 'Define project metadata and target modernization stack'}
                {currentStep === 2 && 'Upload software engineering document (PDF, FSD, BRD, LOC report)'}
                {currentStep === 3 && 'Automated breakdown: FSD, PRD, BRD, Estimation & Interactive Flowmap'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-white text-xs font-semibold text-center">
          <div className={`py-2.5 border-b-2 ${currentStep === 1 ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-400'}`}>
            1. Project Details
          </div>
          <div className={`py-2.5 border-b-2 ${currentStep === 2 ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-400'}`}>
            2. Upload Document
          </div>
          <div className={`py-2.5 border-b-2 ${currentStep === 3 ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-400'}`}>
            3. Visual Breakdown
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1: PROJECT SETUP & STACK DEFINITION                 */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Project Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Sales Forecast Modernization"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Client / Business Unit</label>
                  <input
                    type="text"
                    placeholder="e.g., Commercial Operations & Logistics"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Domain & Scope</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Enterprise Modernization">Enterprise Modernization (Legacy to Cloud)</option>
                    <option value="EdTech & Governance">EdTech & Governance (School ERP)</option>
                    <option value="Financial & Billing">Financial & Billing Systems</option>
                    <option value="Healthcare">Healthcare & Clinical Tools</option>
                    <option value="Custom">Custom Software Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current Legacy Stack</label>
                  <input
                    type="text"
                    placeholder="e.g., Visual Basic 6 Desktop EXE"
                    value={currentStack}
                    onChange={(e) => setCurrentStack(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Modernization Stack</label>
                <input
                  type="text"
                  placeholder="e.g., Finesse-Style .NET WinForms / React 19 + Node.js"
                  value={targetStack}
                  onChange={(e) => setTargetStack(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Quick Preset Selector */}
              <div className="pt-2">
                <span className="font-semibold text-slate-600 block mb-2">Or quick-start with a verified engineering benchmark:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    onClick={() => {
                      setProjectName('Sales Forecast Modernization & LOC Estimation');
                      setClientName('Commercial Logistics Group');
                      setDomain('Enterprise Modernization');
                      setSelectedPresetId('proj-sales-forecast');
                      setUploadSource('preset');
                      setCurrentStep(2);
                    }}
                    className="p-3 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100/60 cursor-pointer transition-all space-y-1"
                  >
                    <span className="font-bold text-teal-900 block text-xs">Attached PDF: Sales Forecast</span>
                    <p className="text-[11px] text-teal-800">1,849 LOC, 14 Recordset SP, 26 Features, 550h ETA.</p>
                  </div>

                  <div 
                    onClick={() => {
                      setProjectName('EduPulse School Attendance ERP');
                      setClientName('Oakridge Unified School District');
                      setDomain('EdTech & Governance');
                      setSelectedPresetId('proj-edupulse-attendance');
                      setUploadSource('preset');
                      setCurrentStep(2);
                    }}
                    className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 cursor-pointer transition-all space-y-1"
                  >
                    <span className="font-bold text-blue-900 block text-xs">First Turn: EduPulse Attendance</span>
                    <p className="text-[11px] text-blue-800">Admin vs Teacher scoped RBAC, 09:30 AM cutoff lock.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: UPLOAD OR CHOOSE DOCUMENT                        */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setUploadSource('preset')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    uploadSource === 'preset' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Use Attached PDF Document
                </button>
                <button
                  onClick={() => setUploadSource('file')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    uploadSource === 'file' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Upload Local File (.PDF, .TXT, .MD)
                </button>
                <button
                  onClick={() => setUploadSource('paste')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    uploadSource === 'paste' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Paste Specification Text
                </button>
              </div>

              {uploadSource === 'preset' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border-2 border-teal-500 bg-teal-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                        ATTACHED DOCUMENT DETECTED
                      </span>
                      <span className="font-mono text-slate-500 text-[11px]">284 KB</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      CD-Sales_Forecast_Analysis__LOC_Count__Comparison__and_ETA_Estimation-281026-084501_f749799f.pdf
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      The engine will parse and extract PRD, BRD, FSD, 14-recordset stored procedure data, LOC breakdown (1,849 lines), 26 active features, and the 550h estimation model.
                    </p>
                  </div>
                </div>
              )}

              {uploadSource === 'file' && (
                <div className="space-y-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    accept=".pdf,.txt,.md,.json,.csv,.doc,.docx"
                    className="hidden"
                  />
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setSelectedFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                      isDragging ? 'border-teal-500 bg-teal-50/70' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-teal-600 mb-2" />
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedFile ? selectedFile.name : 'Click to select or drag and drop any document'}
                    </span>
                    <span className="text-slate-500 text-xs mt-1">
                      {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : 'Supports PDF, FSD, BRD, Architecture Markdown, or TXT'}
                    </span>
                  </div>
                </div>
              )}

              {uploadSource === 'paste' && (
                <div className="space-y-2">
                  <label className="block text-slate-700 font-semibold">Paste Specification / LOC Notes:</label>
                  <textarea
                    rows={8}
                    placeholder="Paste functional requirements, stored procedure signatures, lines of code breakdown, or estimation data..."
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-[11px] text-slate-800 leading-relaxed"
                  />
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: AUTOMATED ANALYSIS & BREAKDOWN PROGRESS          */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
                  <Sparkles className="w-7 h-7 animate-pulse" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {analysisProgress === 100 ? 'Analysis Complete & Visual Models Generated!' : 'Analyzing Document & Discovering Dimensions...'}
                </h4>
                <p className="text-xs text-slate-500 font-mono">{analysisPhase}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-teal-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>

              {/* Breakdown Matrix Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className={`p-3 rounded-xl border transition-colors ${analysisProgress >= 40 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>PRD Extracted</span>
                  </div>
                  <span className="text-[11px] block">Vision, Personas & Workflows identified</span>
                </div>

                <div className={`p-3 rounded-xl border transition-colors ${analysisProgress >= 65 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>BRD Extracted</span>
                  </div>
                  <span className="text-[11px] block">Business Rules & RACI matrix mapped</span>
                </div>

                <div className={`p-3 rounded-xl border transition-colors ${analysisProgress >= 85 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>FSD Synthesized</span>
                  </div>
                  <span className="text-[11px] block">APIs, 14 Recordsets & Schema structured</span>
                </div>

                <div className={`p-3 rounded-xl border transition-colors ${analysisProgress >= 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Estimation & Flowmap</span>
                  </div>
                  <span className="text-[11px] block">1,849 LOC $\rightarrow$ 550h calibrated</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {currentStep > 1 && currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(1)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Back
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            {currentStep === 1 && (
              <button
                onClick={handleNextToUpload}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Continue to Document Ingestion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                onClick={handleStartAnalysis}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Multi-Dimensional Analysis</span>
              </button>
            )}

            {currentStep === 3 && analysisProgress === 100 && (
              <button
                onClick={handleFinish}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-md"
              >
                <span>Open Visual Engineering Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
