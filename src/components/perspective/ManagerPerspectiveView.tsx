import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar, 
  Clock, 
  Users, 
  AlertOctagon, 
  FileCheck2, 
  TrendingUp, 
  CheckCircle2, 
  Copy, 
  Download, 
  Share2, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  FileText,
  Sparkles,
  Wrench,
  Zap,
  DollarSign,
  BarChart,
  ListTodo,
  Layers,
  ChevronRight
} from 'lucide-react';
import { RulebookProject, RulebookAnalysis } from '../../types/rulebook';

interface Props {
  project: RulebookProject;
  analysis: RulebookAnalysis;
  onOpenSourcePage: (page: number) => void;
}

type PlanningBasis = 'sprint' | 'time';
type DevMethodology = 'ai_assisted' | 'full_manual';

export const ManagerPerspectiveView: React.FC<Props> = ({
  project,
  analysis,
  onOpenSourcePage
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'planning' | 'pert' | 'personas' | 'gaps' | 'brief'>('planning');
  
  // 1. PO Basis Mode (Sprint-Based vs Time-Based)
  const [planningBasis, setPlanningBasis] = useState<PlanningBasis>('sprint');
  
  // 2. Development Methodology (AI-Assisted vs Full Manual)
  const [devMethodology, setDevMethodology] = useState<DevMethodology>('ai_assisted');

  const [copiedBrief, setCopiedBrief] = useState(false);
  const [signedGaps, setSignedGaps] = useState<Record<string, boolean>>({
    'G01': true,
    'G04': false,
    'G06': false
  });

  const toggleGapSignOff = (code: string) => {
    setSignedGaps(prev => ({ ...prev, [code]: !prev[code] }));
  };

  // Dynamic Metrics based on Methodology
  const isAi = devMethodology === 'ai_assisted';

  // Manual baseline vs AI accelerated hours
  const optimisticHours = isAi ? 145 : 235;
  const expectedHours = isAi ? 180 : 290;
  const pessimisticHours = isAi ? 240 : 390;
  
  // Calendar Weeks (2 Senior Engineers, 7h/day, 5d/week = 70h/week)
  const expectedWeeks = Number((expectedHours / 70).toFixed(1));
  const savedHours = 290 - expectedHours;
  const estimatedDollarsSaved = savedHours * 120; // $120/hr standard senior engineering rate

  // Sprint Plans (Sprint-Based Mode)
  const sprintPlans = isAi ? [
    {
      sprintNumber: 1,
      name: 'Sprint 1: SQL Infrastructure, Stored Procs & Core Scanning',
      storyPoints: 52,
      targetDate: '15 Dec 2026',
      status: 'In Progress',
      hoursAllocated: 90,
      velocityFactor: 'High (AI-Accelerated DTOs & Queries)',
      deliverables: [
        'EF Core 8 / Dapper migration of 4 Stored Procedures with 600s timeouts',
        'Hardware scanner wedge listener with acoustic audio triggers',
        'TanStack Virtual Grid replacement with utilization color ramp badges'
      ]
    },
    {
      sprintNumber: 2,
      name: 'Sprint 2: MIA Staging, Supervisor Check Up & ARB Sign-Off',
      storyPoints: 48,
      targetDate: '02 Jan 2027',
      status: 'Planned',
      hoursAllocated: 90,
      velocityFactor: 'High (Automated Test Suites & OpenXML)',
      deliverables: [
        'MassTransferStaging_v transactional staging with automatic rollback',
        'Supervisor Check Up review screen with operator daily metrics',
        'OpenXML Excel export pipeline and final security compliance gate'
      ]
    }
  ] : [
    {
      sprintNumber: 1,
      name: 'Sprint 1: Core Connectivity & SQL Infrastructure',
      storyPoints: 34,
      targetDate: '15 Dec 2026',
      status: 'In Progress',
      hoursAllocated: 95,
      velocityFactor: 'Baseline Manual Coding',
      deliverables: [
        'Establish EF Core 8 & Dapper data layer connected to Finesse DB',
        'Implement SP Get_Cycle_Count_Utility_Parts_List with 600s timeout',
        'Setup SUSER_SNAME() session security trimming and warehouse scoping'
      ]
    },
    {
      sprintNumber: 2,
      name: 'Sprint 2: Floor Telematics & Barcode Scanning',
      storyPoints: 45,
      targetDate: '05 Jan 2027',
      status: 'Planned',
      hoursAllocated: 125,
      velocityFactor: 'Baseline Manual Coding',
      deliverables: [
        'Hardware keyboard wedge scanner listener with audio frequency cues',
        'Infragistics UltraGrid replacement with responsive React 19 virtual grid',
        'Inter-warehouse check-in modal and instant receipt date refresh'
      ]
    },
    {
      sprintNumber: 3,
      name: 'Sprint 3: MIA Exceptions, Audit Check Up & Excel Interop',
      storyPoints: 25,
      targetDate: '22 Jan 2027',
      status: 'Planned',
      hoursAllocated: 70,
      velocityFactor: 'Baseline Manual Coding',
      deliverables: [
        'MassTransferStaging_v transactional staging and commit SP',
        'Supervisor Check Up review screen with operator metrics',
        'Export parts to OpenXML Excel workbooks and final ARB sign-off'
      ]
    }
  ];

  // Time-Based Milestones (Time-Based Mode)
  const timeMilestones = [
    {
      phase: 'Phase 1: Architecture Ingestion & Database DTOs',
      weeks: isAi ? 'Week 1' : 'Weeks 1 – 2',
      startDate: '01 Dec 2026',
      endDate: isAi ? '08 Dec 2026' : '15 Dec 2026',
      milestone: 'Database Layer Functional & Procedures Benchmarked',
      criticalPath: true,
      dependency: 'SQL Server DB Access'
    },
    {
      phase: 'Phase 2: Virtual Grid & Hardware Scanner Wedge',
      weeks: isAi ? 'Weeks 1.5 – 2' : 'Weeks 2 – 3.5',
      startDate: isAi ? '09 Dec 2026' : '16 Dec 2026',
      endDate: isAi ? '19 Dec 2026' : '05 Jan 2027',
      milestone: 'Floor Scanning Operational with Audio Feedback',
      criticalPath: true,
      dependency: 'Physical Zebra / Honeywell Scanner Hardware'
    },
    {
      phase: 'Phase 3: MIA Relocation & Audit Governance',
      weeks: isAi ? 'Weeks 2 – 2.6' : 'Weeks 3.5 – 4.1',
      startDate: isAi ? '20 Dec 2026' : '06 Jan 2027',
      endDate: isAi ? '02 Jan 2027' : '22 Jan 2027',
      milestone: 'Final ARB Baseline Approved & Production Rollout',
      criticalPath: true,
      dependency: 'CISO / ARB Sign-Off'
    }
  ];

  // Technical Gaps & Ambiguities (G01 - G13)
  const technicalGaps = [
    {
      code: 'G01',
      title: 'Missing External ClairUtilities Submodule',
      severity: 'High Architecture Risk',
      description: 'The legacy codebase references ClairUtilities external Git submodule which is missing from the repository. Methods are inferred from consumption.',
      recommendation: isAi 
        ? 'AI generates native TypeScript / C# helper replacement in 2 hours with full unit tests.'
        : 'Manually write helper library and stub all inferred functions (estimated 16 hours).',
      impact: 'Build failure if not decoupled.'
    },
    {
      code: 'G04',
      title: 'Unhandled SQL Query Timeouts (600s)',
      severity: 'Medium Operational Risk',
      description: 'The parts query sets CommandTimeout = 600s. Under high network congestion or locked tables, the UI locks without cancellation tokens.',
      recommendation: 'Implement CancellationTokenSource and background streaming with progress bar.',
      impact: 'Floor worker terminal freeze.'
    },
    {
      code: 'G06',
      title: 'Absence of Hard Rollback Audit Logging',
      severity: 'Compliance & Audit Defensibility',
      description: 'Failed check-ins and rolled-back mass transfers are discarded without writing to an exception log.',
      recommendation: 'Create SecurityExceptionLog table to capture failed relocation attempts.',
      impact: 'Audit trail gap for ISO compliance.'
    }
  ];

  // Persona Matrix
  const personas = [
    {
      code: 'P1',
      title: 'Cycle Counter',
      dailyUsers: '45 floor operators',
      coreValue: 'Eliminates clipboard tallies; cuts cycle count logging time by 68% via direct scanner wedge.',
      frictionRemoved: 'Manual data entry errors and missing shelf location mismatches.',
      accessLevel: 'Floor Scan & Count Writes'
    },
    {
      code: 'P2',
      title: 'Inventory Editor',
      dailyUsers: '6 warehouse leads',
      coreValue: 'Immediate stock corrections without navigating legacy ERP screens.',
      frictionRemoved: 'Delayed inventory reconciliations causing backorders.',
      accessLevel: 'Adjust Inventory Launchers'
    },
    {
      code: 'P3',
      title: 'Parts Editor',
      dailyUsers: '2 catalogue managers',
      coreValue: 'Maintains dimensional standards and package weight specifications.',
      frictionRemoved: 'Incorrect cubic weight freight charges.',
      accessLevel: 'Part Maintenance Launcher'
    },
    {
      code: 'P5',
      title: 'Warehouse Supervisor',
      dailyUsers: '4 facility directors',
      coreValue: 'Audits daily counts per operator, monitors MIA trends, exports audit reports.',
      frictionRemoved: 'Blind spots in count compliance across regional hubs.',
      accessLevel: 'Check Up & Excel Governance'
    }
  ];

  // Dynamic Executive Brief
  const executiveBriefText = `RULEBOOK — ARCHITECTURE REVIEW BOARD (ARB) EXECUTIVE BRIEF
PROJECT: ${project.name}
DOMAIN: ${project.domain}
PLANNING BASIS: ${planningBasis === 'sprint' ? 'Sprint-Based Agile' : 'Time-Based Gantt / Milestones'}
DEVELOPMENT METHODOLOGY: ${isAi ? 'AI-Accelerated Engineering (Cursor / Copilot)' : 'Full Manual Development (Baseline)'}
DATE: ${new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
PREPARED BY: Pragatheeswaran Kasinthan

1. EXECUTIVE SUMMARY:
Modernizing legacy 2-tier VB.NET WinForms inventory utility to web architecture. Architecture deconstructed across 6 user personas (P1–P6), 25 functional features (F01–F25), and 4 stored procedures.

2. CALIBRATED DELIVERY EFFORT:
• Methodology: ${isAi ? 'AI-Accelerated Engineering (~38% Velocity Boost)' : 'Full Traditional Manual Coding'}
• Optimistic Effort: ${optimisticHours} Hours
• Expected / Most Likely: ${expectedHours} Hours (~${expectedWeeks} Calendar Weeks)
• Pessimistic (Risk-Weighted): ${pessimisticHours} Hours
• Team Capacity: 2 Senior Software Engineers (7 hrs/day) + 15% Architectural Review Buffer.
${isAi ? `• Net Savings via AI Assistance: ~${savedHours} Engineering Hours (~$${estimatedDollarsSaved.toLocaleString()})` : '• Manual Coding Baseline: No AI tooling multipliers applied.'}

3. ${planningBasis === 'sprint' ? 'SPRINT DELIVERY MILESTONES' : 'TIME-BASED CRITICAL PATH'}:
${planningBasis === 'sprint' ? sprintPlans.map(s => `• Sprint ${s.sprintNumber}: ${s.name} (${s.hoursAllocated}h / ${s.storyPoints} SP) - Target: ${s.targetDate}`).join('\n') : timeMilestones.map(m => `• ${m.phase}: ${m.weeks} (${m.startDate} – ${m.endDate}) [Milestone: ${m.milestone}]`).join('\n')}

4. CRITICAL TECHNICAL GAPS & MITIGATIONS:
• G01: Decouple missing ClairUtilities submodule via native modern utility service.
• G04: Introduce async CancellationToken on 600s queries to eliminate UI freezes.
• G06: Provision immutable SecurityExceptionLog for failed transfers.

STATUS: Recommended for Baseline Sign-Off by Architecture Review Board.`;

  const handleCopyBrief = () => {
    navigator.clipboard.writeText(executiveBriefText);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Borderless Horizontal Sub-tab Rail */}
      <div className="border-b border-slate-200/90 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'planning', label: 'Delivery Planning', icon: Calendar },
            { id: 'pert', label: 'PERT & Velocity', icon: Clock },
            { id: 'personas', label: 'Persona Value (ROI)', icon: Users, count: personas.length },
            { id: 'gaps', label: 'Technical Gaps (G)', icon: AlertOctagon, count: technicalGaps.length },
            { id: 'brief', label: 'ARB Executive Brief', icon: FileCheck2 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`relative shrink-0 inline-flex items-center gap-2 px-3 py-3 text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#2558E8]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md tabular-nums ${
                      isActive
                        ? 'bg-blue-50 text-[#2558E8] border border-blue-200/70'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="manager-subtab-indicator"
                    transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                    className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[#2558E8]"
                  />
                )}
              </button>
            );
          })}
        </div>

        <span className="hidden xl:inline-flex items-center shrink-0 text-[11px] font-mono text-slate-400 pl-3 border-l border-slate-200/80">
          Sprint &amp; Time · PERT Velocity
        </span>
      </div>

      {/* =========================================================================
          GLOBAL METHODOLOGY & PLANNING TOGGLE STRIP
         ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        
        {/* Toggle 1: Sprint-based vs Time-based */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Planning Horizon:</span>
          <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setPlanningBasis('sprint')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                planningBasis === 'sprint'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Sprint-Based (Agile)</span>
            </button>
            <button
              onClick={() => setPlanningBasis('time')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                planningBasis === 'time'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Time-Based (Gantt)</span>
            </button>
          </div>
        </div>

        {/* Toggle 2: AI-Assisted vs Full Manual Development */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Dev Methodology:</span>
          <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setDevMethodology('ai_assisted')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                devMethodology === 'ai_assisted'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>AI-Assisted Dev (~38% Faster)</span>
            </button>
            <button
              onClick={() => setDevMethodology('full_manual')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                devMethodology === 'full_manual'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Full Manual Baseline</span>
            </button>
          </div>
        </div>

      </div>

      {/* =====================================================================
          SUB-TAB 1: DELIVERY PLANNING (SPRINT OR TIME BASED)
         ===================================================================== */}
      {activeSubTab === 'planning' && (
        <div className="space-y-6">
          
          {/* Methodology Impact Summary Pill */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isAi 
              ? 'bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white border-purple-200' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isAi ? 'bg-[#7C3AED] text-white' : 'bg-slate-700 text-white'
              }`}>
                {isAi ? <Zap className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-bold text-[#0F172A] block">
                  {isAi ? 'AI-Accelerated Engineering Applied' : 'Traditional Full Manual Engineering Applied'}
                </span>
                <span className="text-[11px] text-[#64748B]">
                  {isAi 
                    ? `Estimated completion in ${expectedWeeks} weeks (~180 hrs) with 2 senior engineers. Saved ~110 hrs ($${estimatedDollarsSaved.toLocaleString()}).`
                    : `Standard baseline: ~4.1 weeks (290 hrs) with 2 senior engineers across 3 full sprints.`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-[#0F172A]">{expectedHours} Hours</span>
              <span className="text-slate-400">•</span>
              <span className="text-[#7C3AED] font-bold">{expectedWeeks} Weeks</span>
            </div>
          </div>

          {/* SPRINT-BASED PLANNING VIEW */}
          {planningBasis === 'sprint' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-[#7C3AED]" />
                  <span>Sprint Breakdown &amp; Agile Velocity Allocation ({sprintPlans.length} Sprints)</span>
                </h3>
                <span className="text-xs font-mono bg-purple-50 text-[#7C3AED] font-bold px-2.5 py-1 rounded-md border border-purple-200">
                  {isAi ? 'Velocity: 52 SP / Sprint' : 'Velocity: 35 SP / Sprint'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sprintPlans.map((sp) => (
                  <div 
                    key={sp.sprintNumber}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-5 space-y-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#7C3AED]">
                          Sprint {sp.sprintNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED]">
                          {sp.storyPoints} Story Points
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
                        {sp.name}
                      </h4>

                      <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-slate-100 font-mono">
                        <span>Target: {sp.targetDate}</span>
                        <span className="font-bold text-slate-800">{sp.hoursAllocated}h</span>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Sprint Backlog:
                        </span>
                        {sp.deliverables.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-[#334155]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                      Factor: {sp.velocityFactor}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIME-BASED GANTT / MILESTONE VIEW */}
          {planningBasis === 'time' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#7C3AED]" />
                    <span>Time-Based Critical Path Timeline (Gantt Milestones)</span>
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Calendar-based sequence tracking phase handoffs, dependencies, and critical release gates.
                  </p>
                </div>
                <span className="text-xs font-mono bg-purple-50 text-[#7C3AED] font-bold px-2.5 py-1 rounded-md border border-purple-200">
                  Total Duration: ~{expectedWeeks} Weeks
                </span>
              </div>

              <div className="space-y-4">
                {timeMilestones.map((milestone, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs font-mono">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-[#0F172A]">{milestone.phase}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="font-bold text-[#7C3AED]">{milestone.weeks}</span>
                        <span className="text-slate-400">({milestone.startDate} – {milestone.endDate})</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-200/80">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Gate Deliverable:</span>
                        <span className="font-semibold text-[#0F172A]">{milestone.milestone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Critical Dependency:</span>
                        <span className="font-mono text-purple-700">{milestone.dependency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* =====================================================================
          SUB-TAB 2: CALIBRATED PERT & AI METHODOLOGY COMPARISON
         ===================================================================== */}
      {activeSubTab === 'pert' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7C3AED]" />
                <span>Calibrated PERT Estimation Model &amp; AI Multiplier</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Formula: PERT = (Optimistic + 4 × Expected + Pessimistic) / 6 with 15% Architectural Review buffer.
              </p>
            </div>
            <span className="text-xs font-mono bg-purple-50 text-[#7C3AED] font-bold px-2.5 py-1 rounded-md border border-purple-200">
              Active Mode: {isAi ? 'AI-Assisted' : 'Full Manual'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
                Optimistic Scenario
              </span>
              <div className="text-2xl font-bold text-[#0F172A] font-mono">
                {optimisticHours} <span className="text-sm font-normal text-slate-500">Hours</span>
              </div>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                ~{(optimisticHours / 70).toFixed(1)} weeks. Assumes zero database schema collisions and instant submodule decoupling.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1.5">
              <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">
                Expected / Most Likely
              </span>
              <div className="text-2xl font-bold text-[#7C3AED] font-mono">
                {expectedHours} <span className="text-sm font-normal text-slate-500">Hours</span>
              </div>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                ~{expectedWeeks} weeks with 2 senior engineers. Calibrated for Infragistics grid migration and wedge telematics.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Pessimistic Scenario
              </span>
              <div className="text-2xl font-bold text-amber-900 font-mono">
                {pessimisticHours} <span className="text-sm font-normal text-slate-500">Hours</span>
              </div>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                ~{(pessimisticHours / 70).toFixed(1)} weeks. Incorporates legacy bug remediation, deadlock retry loops, and network lag.
              </p>
            </div>
          </div>

          {/* AI vs Manual Comparison Analysis Table */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-[#0F172A] block">
              Methodology Impact Comparison: AI-Assisted vs. Full Manual Development
            </span>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="text-[#64748B] border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Metric Dimension</th>
                    <th className="py-2 px-3 text-[#7C3AED] font-bold">✨ AI-Accelerated (Cursor/Copilot)</th>
                    <th className="py-2 px-3 text-slate-700 font-bold">🛠️ Full Manual Development</th>
                    <th className="py-2 px-3 text-emerald-700 font-bold">Delta Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Expected Delivery Hours</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#7C3AED]">180 Hours</td>
                    <td className="py-2.5 px-3 font-mono">290 Hours</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">110 Hours Saved (-38%)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Calendar Timeline (2 Eng)</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#7C3AED]">2.6 Weeks</td>
                    <td className="py-2.5 px-3 font-mono">4.1 Weeks</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">1.5 Weeks Faster</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Sprint Count</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#7C3AED]">2 Sprints (50 SP/sprint)</td>
                    <td className="py-2.5 px-3 font-mono">3 Sprints (35 SP/sprint)</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">1 Entire Sprint Saved</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#0F172A]">Estimated Budget Impact</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#7C3AED]">$21,600</td>
                    <td className="py-2.5 px-3 font-mono">$34,800</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">$13,200 Cost Reduction</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 3: PERSONA VALUE & OPERATIONAL IMPACT (ROI)
         ===================================================================== */}
      {activeSubTab === 'personas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {personas.map((p) => (
              <div 
                key={p.code}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4 shadow-2xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-purple-100 text-[#7C3AED] font-bold text-xs flex items-center justify-center font-mono">
                      {p.code}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">{p.title}</h4>
                      <span className="text-[11px] text-slate-500">{p.dailyUsers}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border">
                    {p.accessLevel}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="font-bold text-[#0F172A] block mb-0.5">Business ROI &amp; Operational Value:</span>
                    <p className="text-[#334155] leading-relaxed">{p.coreValue}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="font-bold text-slate-600 block mb-0.5">Floor Friction Eliminated:</span>
                    <p className="text-slate-500 leading-relaxed">{p.frictionRemoved}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 4: TECHNICAL GAPS AUDIT (G01 - G13)
         ===================================================================== */}
      {activeSubTab === 'gaps' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Technical Gaps, Inferred Logic &amp; Risk Register</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Items requiring Architectural Review Board (ARB) sign-off prior to baseline lockdown.
              </p>
            </div>
            <span className="text-xs font-mono bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-md font-bold">
              3 High-Priority Flags
            </span>
          </div>

          <div className="space-y-3.5">
            {technicalGaps.map((gap) => {
              const isSigned = signedGaps[gap.code];

              return (
                <div 
                  key={gap.code}
                  className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAFC] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-md">
                        {gap.code}
                      </span>
                      <h4 className="text-sm font-bold text-[#0F172A]">{gap.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        {gap.severity}
                      </span>
                      <button
                        onClick={() => toggleGapSignOff(gap.code)}
                        className={`px-3 py-1 text-xs rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          isSigned
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSigned ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>ARB Signed Off</span>
                          </>
                        ) : (
                          <span>Sign Off Gap</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#334155] leading-relaxed">
                    {gap.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-200">
                    <div>
                      <span className="font-bold text-slate-600 block text-[11px]">Architectural Recommendation:</span>
                      <span className="text-[#0F172A] leading-relaxed">{gap.recommendation}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600 block text-[11px]">Operational Impact:</span>
                      <span className="text-rose-700 leading-relaxed font-semibold">{gap.impact}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 5: EXECUTIVE BRIEF & ARB MEMO
         ===================================================================== */}
      {activeSubTab === 'brief' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#7C3AED]" />
                <span>Executive Architecture Review Board (ARB) Brief</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Pre-formatted governance brief dynamically factoring in {isAi ? 'AI-assisted velocity' : 'manual development baseline'} and {planningBasis === 'sprint' ? 'sprint horizons' : 'time milestones'}.
              </p>
            </div>

            <button
              onClick={handleCopyBrief}
              className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              {copiedBrief ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Brief!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy ARB Memo</span>
                </>
              )}
            </button>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap shadow-inner max-h-96">
            {executiveBriefText}
          </div>
        </div>
      )}

    </div>
  );
};
