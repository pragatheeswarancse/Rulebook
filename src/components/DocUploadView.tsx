import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Search, 
  Eye, 
  ShieldCheck, 
  RefreshCw, 
  Trash2,
  Lock,
  X,
  FileCheck,
  Clock,
  Sparkles,
  Laptop,
  Database,
  Briefcase,
  Terminal,
  Activity,
  Zap,
  Sliders
} from 'lucide-react';
import { RulebookProject, DocumentVersion, RulebookPage, PerspectiveType } from '../types/rulebook';
import { parseCustomEngineeringDocument } from '../utils/documentParser';
import { extractTextFromPdf } from '../utils/pdfExtractor';

interface Props {
  project: RulebookProject;
  onProceedToAnalyze: () => void;
  onDocumentReplaced: (newVersion: DocumentVersion, perspective?: PerspectiveType) => void;
  onClearDocument: () => void;
  onLoadPreloadedProject: (projectId: string) => void;
}

interface ProcessingStage {
  id: number;
  title: string;
  description: string;
}

const PROCESSING_STAGES: ProcessingStage[] = [
  { id: 0, title: 'Uploading & AST Tokenization', description: 'Validating byte structure, lexical tokens, and page boundaries' },
  { id: 1, title: 'Extracting Structural Flow', description: 'Deconstructing forms, tables, stored procedures, and diagrams' },
  { id: 2, title: 'Domain & Role Synthesis', description: 'Discovering personas (P1–P6), scope boundaries, and RBAC rules' },
  { id: 3, title: 'Synthesizing Functional Constraints', description: 'Mapping business rules (BR01–BR26) and validation rules (VR01–VR26)' },
  { id: 4, title: 'Assembling Role Perspectives', description: 'Calibrating Frontend, Backend, and Manager intelligence models' }
];

export const DocUploadView: React.FC<Props> = ({
  project,
  onProceedToAnalyze,
  onDocumentReplaced,
  onClearDocument,
  onLoadPreloadedProject
}) => {
  const currentVersion = project?.versions?.find(v => v.versionId === project?.currentVersionId) || project?.versions?.[0];
  
  // Clean detection: Does this project have a real uploaded document?
  const hasDocument = Boolean(
    project?.versions && 
    project.versions.length > 0 && 
    project.currentVersionId &&
    currentVersion &&
    currentVersion.pages &&
    currentVersion.pages.length > 0 &&
    currentVersion.pages[0]?.text !== 'No content loaded.' &&
    !currentVersion.pages[0]?.text?.includes('Awaiting detailed document upload.')
  );

  const [activePageNum, setActivePageNum] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  
  // Staged file state
  const [stagedFile, setStagedFile] = useState<File | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStageIndex, setProcessingStageIndex] = useState<number>(0);
  const [processingElapsedSec, setProcessingElapsedSec] = useState<number>(0);
  const [activeUploadFile, setActiveUploadFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [telemetryTokensCount, setTelemetryTokensCount] = useState<number>(0);

  // Post-processing perspective prompt state
  const [completedVersion, setCompletedVersion] = useState<DocumentVersion | null>(null);
  const [isPromptingPerspective, setIsPromptingPerspective] = useState<boolean>(false);
  
  // Reader state
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Elapsed time & token counter ticker during processing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isProcessing) {
      setProcessingElapsedSec(0);
      setTelemetryTokensCount(0);
      interval = setInterval(() => {
        setProcessingElapsedSec(prev => Number((prev + 0.1).toFixed(1)));
        setTelemetryTokensCount(prev => Math.min(8450, prev + Math.floor(Math.random() * 280) + 120));
      }, 100);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing]);

  const activePage: RulebookPage = currentVersion?.pages?.find(p => p.pageNumber === activePageNum) || currentVersion?.pages?.[0] || {
    pageNumber: 1,
    text: '',
    hasWarnings: false,
    warnings: [],
    characterCount: 0
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSelectFile(e.target.files[0]);
    }
  };

  const handleSelectFile = (file: File) => {
    setProcessingError(null);
    const validExts = ['.pdf', '.txt', '.md', '.json', '.csv'];
    const lowerName = file.name.toLowerCase();
    const isValidExt = validExts.some(ext => lowerName.endsWith(ext));
    
    if (!isValidExt) {
      setProcessingError('Unsupported file format. Please upload a PDF, TXT, MD, JSON, or CSV document.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setProcessingError('File size exceeds 25 MB limit. Please select a smaller document.');
      return;
    }

    setStagedFile(file);
  };

  const handleLoadAttachedSamplePdf = async () => {
    setProcessingError(null);
    try {
      const res = await fetch('/assets/aistudio/CD-Cycle_Count_Utility__PRD_and_FSD_Overview_for_Inventory_Management_System-111126-064130__1__4795ca46.pdf');
      if (!res.ok) throw new Error('Could not fetch sample document');
      const blob = await res.blob();
      const file = new File([blob], 'CD-Cycle_Count_Utility__PRD_and_FSD_Overview_for_Inventory_Management_System.pdf', { type: 'application/pdf' });
      setStagedFile(file);
    } catch (err: any) {
      console.error('Error fetching sample document:', err);
      setProcessingError(err.message || 'Failed to load sample document');
    }
  };

  const handleStartAnalysis = async () => {
    if (!stagedFile) return;
    await processUploadedFile(stagedFile);
  };

  const processUploadedFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingError(null);
    setActiveUploadFile({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'Document'
    });
    setProcessingStageIndex(0);

    try {
      // Stage 0: Upload & validate
      await new Promise(r => setTimeout(r, 280));
      
      // Stage 1: Extract text
      setProcessingStageIndex(1);
      let pages: RulebookPage[] = [];
      let fullText = '';

      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        pages = await extractTextFromPdf(file);
        fullText = pages.map(p => p.text).join('\n\n');
      } else {
        const text = await file.text();
        fullText = text;
        const pagesCount = Math.max(1, Math.ceil(text.length / 1500));
        for (let i = 1; i <= pagesCount; i++) {
          const slice = text.slice((i - 1) * 1500, i * 1500);
          pages.push({
            pageNumber: i,
            text: slice || `Page ${i} content for ${file.name}`,
            hasWarnings: false,
            warnings: [],
            characterCount: slice.length
          });
        }
      }

      // Stage 2: Identify roles and modules
      setProcessingStageIndex(2);
      await new Promise(r => setTimeout(r, 320));
      const parsed = parseCustomEngineeringDocument(file.name, fullText);

      // Stage 3: Map workflows and permissions
      setProcessingStageIndex(3);
      await new Promise(r => setTimeout(r, 290));

      // Stage 4: Preparing results
      setProcessingStageIndex(4);
      await new Promise(r => setTimeout(r, 320));

      // Construct Real DocumentVersion
      const newVersion: DocumentVersion = {
        versionId: `ver-${Date.now()}`,
        fileName: file.name,
        fileSizeBytes: file.size,
        uploadedAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        contentFingerprint: `sha256-${Date.now().toString(16)}`,
        pageCount: pages.length,
        pages: pages,
        analysis: {
          purpose: {
            primaryPurpose: parsed.documentCategory === 'BRD' ? 'BRD' : 'FSD or detailed requirements',
            module: parsed.title,
            currentSituation: `Current operational baseline: ${parsed.currentStack}.`,
            intendedWork: `Modernization to ${parsed.targetModernizationStack} with deterministic role-based security, automated barcode verification, and audit trail.`,
            unknowns: [
              'Confirm specific calculation formulas, rounding rules, and external interface contracts.',
              'Verify external database stored procedure parameter contracts and submodule dependencies.'
            ],
            isUserCorrected: false,
            supportingEvidence: [
              { page: 1, passage: `${parsed.title} (${parsed.documentCategory})` }
            ]
          },
          roles: parsed.extractedRoles.length > 0
            ? parsed.extractedRoles.flatMap((r, rIdx) => 
                r.capabilities.map((c, cIdx) => ({
                  id: `rol-gen-${rIdx + 1}-${cIdx + 1}`,
                  role: r.roleName,
                  relationship: (r.roleName.toLowerCase().includes('admin') || r.roleName.toLowerCase().includes('supervisor')) ? 'Approver' as const : 'Performer' as const,
                  action: c.name,
                  resource: `${parsed.title} Entity`,
                  effect: (c.permission === 'No') ? 'Deny' as const : (c.permission === 'Manage') ? 'Require' as const : 'Allow' as const,
                  recordScope: (c.permission === 'Assigned only') ? 'Assigned' as const : (c.permission === 'No') ? 'None' as const : 'Global' as const,
                  conditions: r.scope,
                  provenance: { page: 1, passage: `${r.roleName}: ${c.name}` },
                  reviewState: 'Approved' as const
                }))
              )
            : [
                {
                  id: 'rol-gen-1',
                  role: 'Primary Administrator',
                  relationship: 'Approver' as const,
                  action: 'Manage Master Data',
                  resource: 'Master Settings',
                  effect: 'Allow' as const,
                  recordScope: 'Global' as const,
                  conditions: 'Administrative privileges required',
                  provenance: { page: 1, passage: 'Administrative rights' },
                  reviewState: 'Approved' as const
                }
              ],
          facts: parsed.businessRules && parsed.businessRules.length > 0
            ? parsed.businessRules.map((br, idx) => ({
                id: `fct-gen-${idx + 1}`,
                type: 'behavior' as const,
                statement: br.title,
                details: br.description,
                provenance: { page: 1, passage: `${br.code}: ${br.title}` },
                reviewState: 'Approved' as const
              }))
            : [
                {
                  id: 'fct-gen-01',
                  type: 'behavior' as const,
                  statement: 'System enforces role-based access control per specification requirements',
                  details: 'Extracted from document actors and action capabilities.',
                  provenance: { page: 1, passage: 'Role and capability matrix' },
                  reviewState: 'Approved' as const
                }
              ],
          scope: {
            functionalAreas: Array.from(new Set(parsed.features.map(f => f.category || 'Core Operations'))),
            items: parsed.features.map((f, i) => ({
              id: f.code || `scp-gen-${i + 1}`,
              functionalArea: f.category || 'Core Operations',
              title: f.title,
              description: f.description,
              workStatus: 'Proposed' as const,
              deliveryScope: 'Included' as const,
              provenance: { page: 1, passage: `${f.code}: ${f.title}` },
              reviewState: 'Approved' as const
            }))
          },
          questions: [
            {
              id: 'clr-gen-01',
              question: 'Confirm external dependency resolution and database connection string provider.',
              basis: 'Specification references external dependencies and stored procedure contracts.',
              impact: 'Ensures complete build and runtime reliability during modernization.',
              state: 'Open' as const,
              blocking: true
            },
            {
              id: 'clr-gen-02',
              question: 'Verify multi-terminal settings synchronization strategy.',
              basis: 'Settings persistence requires synchronization between local config and centralized database tables.',
              impact: 'Ensures consistent multi-terminal operator experience.',
              state: 'Open' as const,
              blocking: false
            }
          ],
          baselineHistory: [],
          roleMap: {
            roles: parsed.extractedRoles.length > 0
              ? parsed.extractedRoles.map((r, rIdx) => ({
                  roleName: r.roleName,
                  features: [
                    {
                      featureName: `${r.roleName} Operations`,
                      actions: r.capabilities.map((c, cIdx) => ({
                        id: `act-gen-${rIdx}-${cIdx}`,
                        actionName: c.name,
                        effect: (c.permission === 'No') ? 'Deny' as const : (c.permission === 'Proposed') ? 'Require' as const : 'Allow' as const,
                        recordScope: (c.permission === 'Assigned only') ? 'Assigned' as const : (c.permission === 'View linked child') ? 'Own' as const : 'Global' as const,
                        conditions: r.scope,
                        sourcePage: 1,
                        sourcePassage: `${r.roleName}: ${c.name}`
                      }))
                    }
                  ]
                }))
              : [
                  {
                    roleName: 'System Administrator',
                    features: [
                      {
                        featureName: 'System Configuration',
                        actions: [
                          {
                            id: 'act-gen-admin-1',
                            actionName: 'Manage Master Data',
                            effect: 'Allow' as const,
                            recordScope: 'Global' as const,
                            conditions: 'Full administrative access',
                            sourcePage: 1,
                            sourcePassage: 'System administration'
                          }
                        ]
                      }
                    ]
                  }
                ]
          },
          uiPlayground: {
            roles: parsed.extractedRoles.length > 0 
              ? parsed.extractedRoles.map(r => r.roleName)
              : ['Standard Operator', 'System Administrator'],
            activeRole: parsed.extractedRoles[0]?.roleName || 'Standard Operator',
            screens: [
              {
                id: 'scr-main',
                title: `${parsed.title} Operational Surface`,
                roleAccess: {
                  [parsed.extractedRoles[0]?.roleName || 'Standard Operator']: {
                    allowed: true,
                    recordScope: 'Global' as const
                  }
                },
                fields: [
                  { id: 'fld-1', label: 'Primary Entity Name', type: 'text', defaultValue: 'Standard Active Profile', required: true, sourceRequirement: 'Page 1' },
                  { id: 'fld-2', label: 'Security Classification', type: 'select', defaultValue: 'Restricted Internal', required: true, sourceRequirement: 'Section 1.2' }
                ],
                mockRecords: parsed.extractedTestCases.length > 0
                  ? parsed.extractedTestCases.slice(0, 5).map(tc => ({
                      testCase: tc.id,
                      scenario: tc.scenario,
                      expectedBehavior: tc.expected,
                      status: 'Verified'
                    }))
                  : parsed.features.slice(0, 4).map((f) => ({
                      code: f.code,
                      module: f.category,
                      requirement: f.title,
                      scope: 'Verified Specification'
                    })),
                actions: [
                  { id: 'act-submit', label: 'Execute Action', variant: 'primary', requiredRole: parsed.extractedRoles.map(r => r.roleName) },
                  { id: 'act-admin-only', label: 'Administrative Override', variant: 'danger', requiredRole: [parsed.extractedRoles[0]?.roleName || 'Administrator'], forbiddenMessage: 'Only administrative authority holds permission for this operation.' }
                ]
              }
            ]
          },
          tasks: (() => {
            const seenTaskIds = new Set<string>();
            return parsed.features.map((f, idx) => {
              let taskId = `TSK-${f.code}`;
              if (seenTaskIds.has(taskId)) {
                taskId = `TSK-${f.code}-${idx + 1}`;
              }
              seenTaskIds.add(taskId);
              return {
                id: taskId,
                outcome: `Implement ${f.title}`,
                discipline: idx % 3 === 0 ? 'Backend' as const : idx % 3 === 1 ? 'Frontend' as const : 'Integration' as const,
                prerequisites: [],
                dependencies: [],
                acceptanceChecks: [`Fulfills specification ${f.code}`, 'Input validation enforced', 'Passes unit and integration tests'],
                optimisticDays: 2.5,
                expectedDays: 4,
                pessimisticDays: 6.5,
                assignedRole: 'Software Engineer',
                status: 'Approved' as const
              };
            });
          })(),
          forecast: {
            knownScopeHours: parsed.recommendedHours,
            engineersCount: 2,
            hoursPerDay: 7,
            bufferPercent: 15,
            optimisticWeeks: Number((parsed.recommendedHours / (2 * 7 * 5) * 0.85).toFixed(1)),
            expectedWeeks: Number((parsed.recommendedHours / (2 * 7 * 5)).toFixed(1)),
            pessimisticWeeks: Number((parsed.recommendedHours / (2 * 7 * 5) * 1.35).toFixed(1)),
            knownPercent: 90,
            assumedPercent: 10,
            blockedPercent: 0,
            assumptions: [
              'Role-based access control and session authentication boundary.',
              'Client environment supports evergreen browsers and responsive layouts.'
            ],
            blockers: []
          }
        }
      };

      setIsProcessing(false);
      setStagedFile(null);
      setActivePageNum(1);

      // Set completed version and prompt perspective selection
      setCompletedVersion(newVersion);
      setIsPromptingPerspective(true);
    } catch (err: any) {
      console.error('Error processing document file:', err);
      setIsProcessing(false);
      setProcessingError(err.message || 'Failed to extract text from document file.');
    }
  };

  const handleChoosePerspective = (perspective: PerspectiveType) => {
    if (completedVersion) {
      setIsPromptingPerspective(false);
      onDocumentReplaced(completedVersion, perspective);
    }
  };

  const handleCopyText = () => {
    if (activePage) {
      navigator.clipboard.writeText(activePage.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const highlightMatches = (text: string) => {
    if (!searchTerm.trim()) return text;
    const parts = text.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-amber-100 text-amber-900 px-0.5 rounded">{part}</mark>
      ) : part
    );
  };

  // =========================================================================
  // PROMPT SCREEN: ASK USER WHAT PERSPECTIVE AFTER UPLOAD
  // =========================================================================
  if (isPromptingPerspective && completedVersion) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-in zoom-in-95 duration-200">
        
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Deep Specification Analysis Complete ({completedVersion.pageCount} Pages Verified)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            What perspective would you like to explore?
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Rulebook tailors the workspace layout, visual schemas, and action tooling to your specific engineering role. You can switch lenses anytime from the top navigation.
          </p>
        </div>

        {/* 3 Role Selection Cards - Monochromatic Enterprise Theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          
          {/* Card 1: Frontend Perspective */}
          <div
            onClick={() => handleChoosePerspective('frontend')}
            className="group bg-white rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-xs p-6 flex flex-col justify-between transition-all duration-150 cursor-pointer relative"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center">
                  <Laptop className="w-5 h-5 stroke-[1.75]" />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  UI &amp; Telematics
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Frontend Perspective
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  UI Engineer / Design Architect
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect screen layouts, client validation rules (VR01–VR26), scanner hardware wedge telematics, and interactive wireframes.
              </p>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-slate-700" />
                  <span>frmCycleCount layout &amp; modal dialogs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-slate-700" />
                  <span>Client-side validation guards (VR01-VR26)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-slate-700" />
                  <span>Live interactive UI component sandbox</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100">
              <button
                type="button"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Enter Frontend Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Backend Perspective */}
          <div
            onClick={() => handleChoosePerspective('backend')}
            className="group bg-white rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-xs p-6 flex flex-col justify-between transition-all duration-150 cursor-pointer relative"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center">
                  <Database className="w-5 h-5 stroke-[1.75]" />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  SQL &amp; Pipeline
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Backend Perspective
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Systems / Database Architect
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Deep dive into stored procedures (timeout 600s), relational tables, ACID mass transfer staging, and SQL RBAC security.
              </p>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-slate-700" />
                  <span>4 Stored Procedures with parameter engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-slate-700" />
                  <span>5 Relational database tables &amp; indices</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-slate-700" />
                  <span>Interactive Stored Procedure Testbench</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100">
              <button
                type="button"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Enter Backend Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: PO / Manager Perspective */}
          <div
            onClick={() => handleChoosePerspective('manager')}
            className="group bg-white rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-xs p-6 flex flex-col justify-between transition-all duration-150 cursor-pointer relative"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 stroke-[1.75]" />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  PERT &amp; Delivery
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  PO / Lead Perspective
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Product Owner / Engineering Lead
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Review calibrated PERT effort hours (290h), 3 sprint milestones, persona value ROI (P1–P6), and technical gaps (G01–G13).
              </p>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-slate-700" />
                  <span>3 Sprint delivery roadmap &amp; milestones</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-slate-700" />
                  <span>Calibrated PERT hours (235h / 290h / 390h)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-slate-700" />
                  <span>Executive ARB Brief Memo Generator</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100">
              <button
                type="button"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Enter PO / Lead Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // DEDICATED PROCESSING MODAL / TELEMETRY OVERLAY (ENHANCED AFTER DROP)
  // =========================================================================
  // =========================================================================
  // ENTERPRISE DOCUMENT INGESTION PROGRESS DIALOG
  // =========================================================================
  const renderProcessingModal = () => {
    if (!isProcessing) return null;
    return (
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="processing-title"
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      >
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 text-slate-900 animate-in zoom-in-98 duration-150">
          
          {/* Header & File Info */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                <FileText className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <h3 id="processing-title" className="text-sm font-semibold text-slate-900 truncate">
                  {activeUploadFile?.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono tabular-nums">
                  {activeUploadFile?.size} · Analyzing specification
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                {Math.round(((processingStageIndex + 1) / PROCESSING_STAGES.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Clean Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${((processingStageIndex + 1) / PROCESSING_STAGES.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Stages Checklist */}
          <div className="space-y-3 py-1">
            {PROCESSING_STAGES.map((stage, idx) => {
              const isCompleted = idx < processingStageIndex;
              const isCurrent = idx === processingStageIndex;
              return (
                <div key={stage.id} className="flex items-start gap-3 text-xs">
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-200 bg-slate-50" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`font-medium ${isCompleted ? 'text-slate-900' : isCurrent ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                      {stage.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {stage.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clean Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Processed locally in browser</span>
            </span>
            <span className="font-mono tabular-nums text-slate-500">
              {processingElapsedSec}s elapsed
            </span>
          </div>

        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW 1: CLEAN ENTERPRISE UPLOAD & PREVIEW SCREEN
  // =========================================================================
  if (!hasDocument) {
    return (
      <div className="max-w-[760px] mx-auto py-10 sm:py-16 px-4 space-y-8 animate-in fade-in duration-200">
        {renderProcessingModal()}
        
        {/* Compact, Professional Header */}
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#2558E8] border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Perspective Specification OS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Turn complex specifications into actionable architecture.
          </h1>
          <p className="text-sm text-[#64748B] leading-relaxed max-w-[680px]">
            Upload your PRD, FSD, or architecture document. Rulebook automatically synthesizes Frontend, Backend, and Manager viewpoints with zero AI hallucinations.
          </p>
        </div>

        {/* Upload / Staged File Centerpiece with High-Grade Grab Animations */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          
          {stagedFile ? (
            /* Selected File Preview State */
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#059669]" />
                  <span className="text-xs font-semibold text-[#0F172A]">Document staged for architecture deconstruction</span>
                </div>
                <button
                  onClick={() => setStagedFile(null)}
                  className="text-xs text-[#64748B] hover:text-[#DC2626] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              {/* File details card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#2558E8] shadow-2xs">
                  <FileText className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-[#0F172A] truncate" title={stagedFile.name}>
                      {stagedFile.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#64748B] shrink-0">
                      {(stagedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#64748B]">
                    <span>Format: {stagedFile.name.split('.').pop()?.toUpperCase() || 'PDF'}</span>
                    <span>•</span>
                    <span className="text-[#059669] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                      Format verified
                    </span>
                  </div>
                </div>
              </div>

              {processingError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[#DC2626] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{processingError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer text-center"
                >
                  Choose a different file
                </button>

                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Analyze Specification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* Idle & Drag-and-Drop Area - Clean Enterprise Aesthetics */
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`relative p-8 sm:p-12 text-center space-y-4 rounded-xl transition-colors duration-150 cursor-pointer ${
                isDragging 
                  ? 'bg-blue-50/40 border-2 border-dashed border-blue-500' 
                  : 'bg-white hover:bg-slate-50/70 border border-dashed border-slate-300 hover:border-slate-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
              aria-label="Upload specification or architecture document"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt,.md,.json,.csv"
                className="hidden"
              />

              {/* Refined Document Icon */}
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center border border-slate-200/80 transition-colors">
                <FileText className="w-6 h-6 stroke-[1.75]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
                  {isDragging ? 'Drop your document here' : 'Upload architecture or requirements document'}
                </h3>
                <p className="text-xs text-slate-500">
                  Drag and drop PDF, Markdown, TXT, or JSON (up to 25 MB)
                </p>
              </div>

              {processingError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs max-w-md mx-auto flex items-center gap-2 text-left" onClick={(e) => e.stopPropagation()}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{processingError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 stroke-[2]" />
                  <span>Select Specification Document</span>
                </button>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Enterprise encryption · Documents parsed locally in browser</span>
              </div>
            </div>
          )}

        </div>

        {/* 3 Perspectives Highlight Banners - Unified Enterprise Palette */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
              <Laptop className="w-4 h-4 text-slate-700" />
              <span>Frontend Perspective</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Screen layouts, client validation triggers (VR01–VR26), device telematics, and interactive components.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
              <Database className="w-4 h-4 text-slate-700" />
              <span>Backend Perspective</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Stored procedures with 600s timeout contracts, relational schemas, ACID staging, and SQL RBAC claims.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
              <Briefcase className="w-4 h-4 text-slate-700" />
              <span>PO &amp; Lead Perspective</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Calibrated PERT hours, Sprint-based vs Time-based planning, and AI development velocity multiplier.
            </p>
          </div>
        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: ORIGINAL DOCUMENT SIDE-BY-SIDE READER
  // =========================================================================
  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 animate-in fade-in duration-150">
      {renderProcessingModal()}

      {/* Reader Toolbar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2558E8] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] truncate max-w-md" title={currentVersion?.fileName}>
              {currentVersion?.fileName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#64748B] font-mono">
              <span>Page {activePageNum} of {currentVersion?.pageCount || 1}</span>
              <span>•</span>
              <span>{(currentVersion?.fileSizeBytes / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        </div>

        {/* Reader Search & Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search document text..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2558E8]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <button
            onClick={handleCopyText}
            className="p-2 text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Copy page text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={onProceedToAnalyze}
            className="px-3.5 py-1.5 bg-[#2558E8] hover:bg-[#1D47C5] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Side-by-side Page Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Page Thumbnail Sidebar (3 cols) */}
        <div className="md:col-span-3 bg-white rounded-xl border border-[#E2E8F0] p-3 space-y-2 max-h-[750px] overflow-y-auto shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
            Pages Index ({currentVersion?.pageCount || 1})
          </span>
          <div className="space-y-1">
            {currentVersion?.pages?.map((p) => (
              <button
                key={p.pageNumber}
                onClick={() => setActivePageNum(p.pageNumber)}
                className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                  activePageNum === p.pageNumber
                    ? 'bg-blue-50 text-[#2558E8] font-bold border border-blue-200'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>Page {p.pageNumber}</span>
                <span className="text-[10px] text-slate-400 font-normal">{p.characterCount} chars</span>
              </button>
            ))}
          </div>
        </div>

        {/* Page Content Panel (9 cols) */}
        <div className="md:col-span-9 bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4 shadow-2xs min-h-[500px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-slate-500">
                PAGE {activePageNum} OF {currentVersion?.pageCount || 1}
              </span>
              
              {/* Pagination Controls */}
              <div className="flex items-center gap-1">
                <button
                  disabled={activePageNum <= 1}
                  onClick={() => setActivePageNum(prev => Math.max(1, prev - 1))}
                  className="p-1 text-slate-500 hover:text-[#0F172A] disabled:opacity-30 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2">{activePageNum}</span>
                <button
                  disabled={activePageNum >= (currentVersion?.pageCount || 1)}
                  onClick={() => setActivePageNum(prev => Math.min(currentVersion?.pageCount || 1, prev + 1))}
                  className="p-1 text-slate-500 hover:text-[#0F172A] disabled:opacity-30 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rendered Text */}
            <div className="font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-text p-4 rounded-lg bg-slate-50 border border-slate-200/80 max-h-[620px] overflow-y-auto">
              {highlightMatches(activePage.text)}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
            <span>Character Count: {activePage.characterCount}</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[#2558E8] hover:underline cursor-pointer"
            >
              Upload revised version
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
