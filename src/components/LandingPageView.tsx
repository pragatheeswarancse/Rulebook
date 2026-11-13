import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowDown,
  Lock,
  FileText,
  Sparkles,
  GitBranch,
  Layers,
  Eye,
  BarChart3,
  Monitor,
  Database,
  Briefcase,
  Check,
  X,
  Play,
  Cpu,
  ShieldCheck,
  Plus,
  Minus,
} from 'lucide-react';

interface Props {
  onEnterApp: () => void;
}

type PreviewTab = 'flowchart' | 'perspectives' | 'planner' | 'reader';
type FlowScenario = 'core' | 'error';
type PerspectiveId = 'frontend' | 'backend' | 'po';
type PlanBasis = 'sprint' | 'time';
type VelocityMode = 'ai' | 'manual';

interface MiniFlowNode {
  id: string;
  role: string;
  stage: number;
  kind: 'trigger' | 'step' | 'decision' | 'outcome' | 'error';
  title: string;
  subtitle: string;
  page: string;
  detail: string;
}

const FLOW_SCENARIOS: Record<
  FlowScenario,
  {
    label: string;
    tokenCount: string;
    summary: string;
    nodes: MiniFlowNode[];
  }
> = {
  core: {
    label: 'Core User Flow',
    tokenCount: '8,420 tok',
    summary:
      'End-to-end reimbursement journey across Employee, Finance Approver, and Workspace Admin roles.',
    nodes: [
      {
        id: 'submit-claim',
        role: 'Employee',
        stage: 0,
        kind: 'trigger',
        title: 'Submit Expense Claim',
        subtitle: 'Receipt OCR + Tax Code',
        page: 'p.14',
        detail:
          'Employee uploads invoice PDF, assigns cost center, and submits claim draft for policy validation.',
      },
      {
        id: 'policy-gate',
        role: 'Employee',
        stage: 1,
        kind: 'decision',
        title: 'Policy & Receipt Valid?',
        subtitle: 'Cap & Duplicate Check',
        page: 'p.15',
        detail:
          'Validates category spending limits, mandatory tax receipt presence, and duplicate invoice hash.',
      },
      {
        id: 'tier-gate',
        role: 'Finance Approver',
        stage: 2,
        kind: 'decision',
        title: 'Amount Over $2,500?',
        subtitle: 'Tier-2 Escalation Gate',
        page: 'p.19',
        detail:
          'Routes claims above $2,500 to Finance Approver sign-off while fast-tracking standard travel receipts.',
      },
      {
        id: 'approve-batch',
        role: 'Finance Approver',
        stage: 3,
        kind: 'step',
        title: 'Approve Payout Batch',
        subtitle: 'Multi-Currency Ledger',
        page: 'p.21',
        detail:
          'Finance Approver reviews converted FX totals and confirms settlement batch disbursement.',
      },
      {
        id: 'ledger-settled',
        role: 'Workspace Admin',
        stage: 4,
        kind: 'outcome',
        title: 'Disbursement Settled',
        subtitle: 'Post_Ledger_Journal',
        page: 'p.24',
        detail:
          'Commits immutable double-entry ledger lines under READ COMMITTED isolation and notifies employee.',
      },
    ],
  },
  error: {
    label: 'RBAC & Error Guards',
    tokenCount: '4,190 tok',
    summary:
      'Segregation-of-duties blocking, duplicate receipt rejection, and role-based approval guardrails.',
    nodes: [
      {
        id: 'open-review',
        role: 'Employee',
        stage: 0,
        kind: 'trigger',
        title: 'Open Claim Queue',
        subtitle: 'Session Role Entry',
        page: 'p.11',
        detail:
          'Authenticated user loads reimbursement workspace with scoped RBAC session permissions.',
      },
      {
        id: 'sod-gate',
        role: 'Finance Approver',
        stage: 1,
        kind: 'decision',
        title: 'Submitter = Approver?',
        subtitle: 'SQL Duty Check',
        page: 'p.18',
        detail:
          'Evaluates segregation-of-duties rule preventing any user from approving their own expense claim.',
      },
      {
        id: 'claim-rejected',
        role: 'Employee',
        stage: 2,
        kind: 'error',
        title: 'Submission Blocked',
        subtitle: 'Duplicate / Cap Error',
        page: 'p.16',
        detail:
          'Flags duplicate receipt checksum or missing VAT ID and halts workflow progression inline.',
      },
      {
        id: 'self-approve-blocked',
        role: 'Finance Approver',
        stage: 2,
        kind: 'error',
        title: 'Approve CTA Disabled',
        subtitle: 'Self-Approval Guard',
        page: 'p.18',
        detail:
          'Locks approval action in UI and rejects backend payload with error 50418 if impersonated.',
      },
      {
        id: 'audit-committed',
        role: 'Workspace Admin',
        stage: 4,
        kind: 'outcome',
        title: 'Audit Trail Logged',
        subtitle: 'Immutable Event Entry',
        page: 'p.28',
        detail:
          'Records security policy blocks and authorized overrides into the tamper-evident compliance log.',
      },
    ],
  },
};

export const LandingPageView: React.FC<Props> = ({ onEnterApp }) => {
  const [activePreviewTab, setActivePreviewTab] = useState<PreviewTab>('flowchart');
  const [flowScenario, setFlowScenario] = useState<FlowScenario>('core');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('policy-gate');
  const [activeLens, setActiveLens] = useState<PerspectiveId>('frontend');
  const [planBasis, setPlanBasis] = useState<PlanBasis>('sprint');
  const [velocityMode, setVelocityMode] = useState<VelocityMode>('ai');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentFlow = FLOW_SCENARIOS[flowScenario];
  const activeNode =
    currentFlow.nodes.find((n) => n.id === selectedNodeId) || currentFlow.nodes[0];

  const handleScenarioChange = (scenario: FlowScenario) => {
    setFlowScenario(scenario);
    setSelectedNodeId(
      FLOW_SCENARIOS[scenario].nodes[1]?.id || FLOW_SCENARIOS[scenario].nodes[0].id
    );
  };

  // Dynamic planner numbers matching PO / Lead Sprint vs Time & AI-Assisted vs Manual logic
  const multiplier = velocityMode === 'ai' ? 1.8 : 1.0;
  const totalBaseHours = 112;
  const adjustedHours = Math.round(totalBaseHours / multiplier);
  const sprintCount = Math.max(1, Math.ceil(adjustedHours / 40));
  const calendarWeeks = Math.max(2, Math.ceil(adjustedHours / 32));

  const faqItems = [
    {
      q: 'What specification formats can I upload into Rulebook?',
      a: 'Rulebook ingests Functional Specification Documents (FSD), Business Requirement Documents (BRD), and Product Requirement Documents (PRD) in PDF, Word (.docx), Markdown (.md), Plain Text (.txt), and JSON up to 25 MB.',
    },
    {
      q: 'How does the AI Roles & User Flowchart feature work?',
      a: 'Inside any project, open the AI Flowchart tab to generate role-based swimlane diagrams using free-tier optimized Gemini models. You can inspect Core User Flows or chart custom user journeys with step-by-step playback, decision gates, blocked error states, and transparent token telemetry.',
    },
    {
      q: 'Do my confidential specifications stay private?',
      a: 'Yes. Document parsing and workspace indexing run locally in your browser session. Your source files are never stored on external servers, and optional AI flowchart generation uses compact rule context with exact token counts shown upfront.',
    },
    {
      q: 'What are the 3 Engineering Perspectives?',
      a: 'Rulebook structures every specification into three tailored lenses: Frontend (UI guardrails, screens, virtual tables, interactive sandbox), Backend (stored procedures, ACID transactions, SQL RBAC, SP testbench), and PO / Lead (Sprint-based and Time-based PERT planning with AI-Assisted vs. Manual velocity toggles).',
    },
  ];

  return (
    <div
      className="min-h-screen bg-white text-[#0F172A] selection:bg-[#2558E8] selection:text-white antialiased"
      style={{
        fontFamily:
          '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* =========================================================================
          1. HEADER (3-ZONE ARCHITECTURAL TOP BAR)
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Lockup */}
          <button
            type="button"
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2.5 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm">
              R
            </div>
            <span className="text-base font-bold text-[#0F172A] tracking-tight">Rulebook</span>
          </button>

          {/* Center: Single-Line Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#64748B]"
          >
            <button
              type="button"
              onClick={() => scrollTo('how-it-works')}
              className="whitespace-nowrap hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollTo('features')}
              className="whitespace-nowrap hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Key Features
            </button>
            <button
              type="button"
              onClick={() => scrollTo('comparison')}
              className="whitespace-nowrap hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Before &amp; After
            </button>
            <button
              type="button"
              onClick={() => scrollTo('faq')}
              className="whitespace-nowrap hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onEnterApp}
              className="whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#0F172A] hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-xs cursor-pointer"
            >
              <span>Open Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION (REFINED BLUEPRINT GRID + EDITORIAL TWO-TONE TYPE)
         ========================================================================= */}
      <section id="hero" className="relative overflow-hidden">
        {/* Square Blueprint Grid with soft radial fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-blueprint [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_50%,transparent_100%)]"
        />
        {/* Subtle Cobalt Radial Illumination */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_28%,rgba(37,88,232,0.06),transparent_75%)]"
        />

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-14 sm:pb-18 text-center">
          {/* Unboxed Monospace Kicker */}
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-mono text-xs text-slate-500 mb-6">
            <span className="font-semibold text-[#0F172A]">Enterprise Specification OS</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span>3 Engineering Perspectives</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="font-semibold text-[#2558E8]">AI Roles &amp; Flowcharts</span>
          </div>

          {/* Two-Tone Display Headline matching inspired UI */}
          <h1 className="text-[clamp(2.25rem,4.7vw,3.85rem)] font-bold text-[#0F172A] tracking-tight leading-[1.07] max-w-4xl mx-auto text-balance">
            Turn 100-page specification documents into{' '}
            <span className="text-[#2558E8]">visual implementation plans.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Upload any Functional Specification (FSD) or Business Requirement (BRD). Rulebook
            extracts user roles, generates interactive AI swimlane flowcharts, and organizes
            Frontend, Backend, and PO sprint plans—100% in your browser.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onEnterApp}
              className="w-full sm:w-auto whitespace-nowrap px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm transition-all shadow-lg shadow-slate-900/12 inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Analyzing Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollTo('preview-section')}
              className="w-full sm:w-auto whitespace-nowrap px-5 py-3 rounded-xl bg-white/95 hover:bg-white text-[#0F172A] font-medium text-sm border border-slate-200/90 shadow-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>See Interactive Example</span>
              <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Clean Unboxed Trust Strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#059669]" />
              <span>100% In-Browser Privacy</span>
            </span>
            <span aria-hidden="true" className="text-slate-300 hidden sm:inline">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#2558E8]" />
              <span>PDF, Word, Markdown &amp; TXT</span>
            </span>
            <span aria-hidden="true" className="text-slate-300 hidden sm:inline">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#0F172A]" />
              <span>Free-Tier AI Flowcharts + Token Telemetry</span>
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE PRODUCT SHOWCASE (COMMON SAAS SOFTWARE EXAMPLE)
         ========================================================================= */}
      <section id="preview-section" className="py-8 sm:py-12 px-4 sm:px-6 max-w-[1240px] mx-auto">
        <div className="rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-4 sm:p-6 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.08)] space-y-5">
          {/* Example Chrome Header + Single-Row Underline Navigation */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-0">
            <div className="pb-3 lg:pb-3.5 flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                EX
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[#0F172A] truncate">
                    Example: Enterprise Expense &amp; Approval Portal FSD
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">v2.0 · 52 pages</span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  Illustrative software workflow preview across AI Flowcharts, 3 Perspectives &amp;
                  Sprint Planner
                </p>
              </div>
            </div>

            {/* Underline Tabs */}
            <div className="flex items-center gap-5 overflow-x-auto no-scrollbar">
              {(
                [
                  { id: 'flowchart', label: 'AI Flowchart', icon: GitBranch },
                  { id: 'perspectives', label: '3 Perspectives', icon: Layers },
                  { id: 'planner', label: 'Sprint & Time', icon: BarChart3 },
                  { id: 'reader', label: 'Source Reader', icon: Eye },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = activePreviewTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActivePreviewTab(tab.id)}
                    className={`relative pb-3.5 whitespace-nowrap inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'text-[#2558E8] font-semibold'
                        : 'text-slate-500 hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {active && (
                      <motion.div
                        layoutId="landingPreviewTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2558E8]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PREVIEW TAB CONTENT */}
          <AnimatePresence mode="wait">
            {/* TAB 1: INTERACTIVE AI ROLES & USER FLOWCHART */}
            {activePreviewTab === 'flowchart' && (
              <motion.div
                key="flowchart"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                {/* Flowchart Toolbar */}
                <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0F172A] text-white text-[11px] font-semibold">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Flow</span>
                      </span>
                      <h4 className="text-sm font-semibold text-[#0F172A]">
                        Expense Approval Role &amp; User Flow
                      </h4>
                      <span className="font-mono text-[11px] text-slate-500 tabular-nums border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50">
                        {currentFlow.tokenCount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{currentFlow.summary}</p>
                  </div>

                  {/* Interactive Flow Scenario Switcher */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {(
                      [
                        { id: 'core', label: 'Core User Flow' },
                        { id: 'error', label: 'RBAC & Error Guards' },
                      ] as const
                    ).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleScenarioChange(s.id)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          flowScenario === s.id
                            ? 'bg-[#0F172A] text-white border-[#0F172A]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-[#0F172A]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role Swimlane Canvas with SVG Flow Signal Connectors */}
                <div className="p-4 sm:p-5 bg-dot-blueprint overflow-x-auto">
                  <div className="min-w-[820px] relative space-y-2.5">
                    {/* Stage Columns Header */}
                    <div className="grid grid-cols-[148px_repeat(5,minmax(130px,1fr))] gap-3 px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      <span>Role Swimlane</span>
                      <span>1 · Entry</span>
                      <span>2 · Validation</span>
                      <span>3 · Decision Gate</span>
                      <span>4 · Execution</span>
                      <span>5 · Outcome</span>
                    </div>

                    {/* Roles */}
                    {(['Employee', 'Finance Approver', 'Workspace Admin'] as const).map(
                      (roleName) => {
                        const roleNodes = currentFlow.nodes.filter((n) => n.role === roleName);
                        return (
                          <div
                            key={roleName}
                            className="relative grid grid-cols-[148px_repeat(5,minmax(130px,1fr))] gap-3 items-center rounded-xl border border-slate-200/90 bg-white/95 p-3"
                          >
                            <div className="pr-2 border-r border-slate-100">
                              <span className="text-xs font-semibold text-[#0F172A] block">
                                {roleName}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                {roleNodes.length} {roleNodes.length === 1 ? 'node' : 'nodes'}
                              </span>
                            </div>

                            {[0, 1, 2, 3, 4].map((stageIdx) => {
                              const stageNodes = roleNodes.filter((n) => n.stage === stageIdx);
                              if (stageNodes.length === 0) {
                                return (
                                  <div
                                    key={stageIdx}
                                    className="h-[68px] rounded-lg border border-dashed border-slate-100/90 flex items-center justify-center"
                                  >
                                    <svg
                                      className="w-10 h-3 text-slate-300"
                                      viewBox="0 0 40 12"
                                      fill="none"
                                    >
                                      <path
                                        d="M2 6H36"
                                        stroke="currentColor"
                                        strokeWidth="1.25"
                                        strokeDasharray="3 3"
                                        className="animate-flow-dash"
                                      />
                                    </svg>
                                  </div>
                                );
                              }

                              return (
                                <div key={stageIdx} className="space-y-2 relative z-10">
                                  {stageNodes.map((node) => {
                                    const isSelected = activeNode.id === node.id;
                                    const accentStyle =
                                      node.kind === 'error'
                                        ? 'border-red-200 bg-red-50/45 hover:border-red-300'
                                        : node.kind === 'outcome'
                                        ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300'
                                        : node.kind === 'decision'
                                        ? 'border-blue-300 bg-blue-50/40 hover:border-blue-400'
                                        : 'border-slate-200 bg-white hover:border-slate-300';

                                    const labelColor =
                                      node.kind === 'error'
                                        ? 'text-[#DC2626]'
                                        : node.kind === 'outcome'
                                        ? 'text-[#059669]'
                                        : node.kind === 'decision'
                                        ? 'text-[#2558E8]'
                                        : 'text-slate-500';

                                    return (
                                      <button
                                        key={node.id}
                                        type="button"
                                        onClick={() => setSelectedNodeId(node.id)}
                                        className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${accentStyle} ${
                                          isSelected ? 'ring-2 ring-[#2558E8] ring-offset-1' : ''
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-1 mb-1">
                                          <span
                                            className={`text-[10px] font-mono font-semibold uppercase ${labelColor}`}
                                          >
                                            {node.kind === 'decision'
                                              ? 'Gate'
                                              : node.kind === 'error'
                                              ? 'Blocked'
                                              : node.kind === 'outcome'
                                              ? 'Outcome'
                                              : 'Step'}
                                          </span>
                                          <span className="text-[10px] font-mono text-slate-400">
                                            {node.page}
                                          </span>
                                        </div>
                                        <div className="text-[12px] font-semibold text-[#0F172A] leading-snug">
                                          {node.title}
                                        </div>
                                        <div className="text-[10.5px] font-mono text-slate-500 leading-tight mt-0.5">
                                          {node.subtitle}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Selected Node Live Inspector Bar */}
                <div className="px-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Play className="w-3.5 h-3.5 text-[#2558E8] shrink-0" />
                    <span className="font-semibold text-[#0F172A] shrink-0">
                      {activeNode.title}
                    </span>
                    <span className="text-slate-300 hidden sm:inline">|</span>
                    <span className="text-slate-600 truncate">{activeNode.detail}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 shrink-0">
                    Role: {activeNode.role} · Citation: {activeNode.page}
                  </span>
                </div>
              </motion.div>
            )}

            {/* TAB 2: 3 ENGINEERING PERSPECTIVES */}
            {activePreviewTab === 'perspectives' && (
              <motion.div
                key="perspectives"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F172A]">
                      Role-Specific Specification Lenses
                    </h4>
                    <p className="text-xs text-slate-500">
                      Switch lenses to inspect what Frontend, Backend, or PO leads extract from the
                      same expense approval spec.
                    </p>
                  </div>
                  <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200 gap-1">
                    {(
                      [
                        { id: 'frontend', label: 'Frontend', icon: Monitor },
                        { id: 'backend', label: 'Backend', icon: Database },
                        { id: 'po', label: 'PO / Lead', icon: Briefcase },
                      ] as const
                    ).map((lens) => {
                      const LensIcon = lens.icon;
                      return (
                        <button
                          key={lens.id}
                          type="button"
                          onClick={() => setActiveLens(lens.id)}
                          className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                            activeLens === lens.id
                              ? 'bg-white text-[#0F172A] shadow-2xs font-semibold'
                              : 'text-slate-600 hover:text-[#0F172A]'
                          }`}
                        >
                          <LensIcon className="w-3.5 h-3.5" />
                          <span>{lens.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {activeLens === 'frontend' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-mono text-[11px] font-semibold text-[#2558E8]">
                        UI GUARDRAIL · RBAC
                      </span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">
                        Self-Approval Button Lock
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Disable Approve CTA and display policy banner whenever claimantId matches
                        active approver session ID.
                      </p>
                      <span className="font-mono text-[11px] text-slate-400 block pt-1">
                        Cited: Page 18 §3.2
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-mono text-[11px] font-semibold text-[#059669]">
                        VIRTUAL TABLE · 50K ROWS
                      </span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">
                        Paginated Ledger Data Grid
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Pinned Claim ID column, tabular currency alignment, filter chips by cost
                        center, and inline drawer preview.
                      </p>
                      <span className="font-mono text-[11px] text-slate-400 block pt-1">
                        Cited: Page 22 §4.1
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-red-50/40 border border-red-200/70 space-y-2">
                      <span className="font-mono text-[11px] font-semibold text-[#DC2626]">
                        INTERACTIVE SANDBOX
                      </span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">
                        Policy Overflow Inline Guard
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Test missing VAT receipt upload or category cap rejection states interactively
                        before component handoff.
                      </p>
                      <span className="font-mono text-[11px] text-slate-400 block pt-1">
                        Cited: Page 16 §2.4
                      </span>
                    </div>
                  </div>
                )}

                {activeLens === 'backend' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-mono text-[11px] font-semibold text-[#2558E8]">
                        STORED PROCEDURE · 300S
                      </span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">
                        Get_Pending_Expense_Claims
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Parameterized by @OrgID, @ApproverRole, and @CostCenter under READ COMMITTED
                        snapshot isolation.
                      </p>
                      <span className="font-mono text-[11px] text-slate-400 block pt-1">
                        Cited: Page 34 §6.1
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-mono text-[11px] font-semibold text-[#059669]">
                        ACID TRANSACTION
                      </span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">
                        Post_Ledger_Journal_Entry
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Commits payout status, double-entry journal rows, and idempotency key in a
                        single atomic boundary.
                      </p>
                      <span className="font-mono text-[11px] text-slate-400 block pt-1">
                        Cited: Page 38 §6.4
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-mono text-[11px] font-semibold text-slate-700">
                        SQL RBAC ENFORCEMENT
                      </span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">
                        Segregation-of-Duties Trigger
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Blocks commit with SQL error 50418 whenever approver principal matches the
                        originating claimant.
                      </p>
                      <span className="font-mono text-[11px] text-slate-400 block pt-1">
                        Cited: Page 41 §7.2
                      </span>
                    </div>
                  </div>
                )}

                {activeLens === 'po' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-mono text-[11px] font-semibold text-[#2558E8]">
                        SCOPE FENCING
                      </span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">
                        11 Included · 3 Deferred Modules
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Direct corporate card bank feed sync is explicitly fenced out of v2.0 so core
                        payout sprints stay predictable.
                      </p>
                      <span className="font-mono text-[11px] text-slate-400 block pt-1">
                        Baseline: Approved
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-mono text-[11px] font-semibold text-[#D97706]">
                        2 OPEN CLARIFICATIONS
                      </span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">
                        FX Conversion Lock Timestamp
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Spec mentions spot conversion on p.21 without defining submission date vs.
                        settlement batch lock.
                      </p>
                      <span className="font-mono text-[11px] text-slate-400 block pt-1">
                        Flagged Prior to Sprint 1
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-mono text-[11px] font-semibold text-[#059669]">
                        PERT DELIVERY FORECAST
                      </span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">
                        2 Sprints · 62h (AI-Assisted 1.8x)
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Switch effortlessly between Sprint-Based and Time-Based planning calendars with
                        AI vs. Manual velocity.
                      </p>
                      <span className="font-mono text-[11px] text-slate-400 block pt-1">
                        Interactive Calibration
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: INTERACTIVE SPRINT & TIME FORECAST */}
            {activePreviewTab === 'planner' && (
              <motion.div
                key="planner"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F172A]">
                      Interactive PERT Forecast &amp; Velocity Calibration
                    </h4>
                    <p className="text-xs text-slate-500">
                      Test Rulebook&apos;s PO &amp; Lead planner on the Expense Portal example: switch
                      planning basis or velocity multiplier.
                    </p>
                  </div>

                  {/* Interactive Toggles */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setPlanBasis('sprint')}
                        className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                          planBasis === 'sprint'
                            ? 'bg-white text-[#0F172A] shadow-2xs font-semibold'
                            : 'text-slate-600'
                        }`}
                      >
                        Sprint-Based
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlanBasis('time')}
                        className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                          planBasis === 'time'
                            ? 'bg-white text-[#0F172A] shadow-2xs font-semibold'
                            : 'text-slate-600'
                        }`}
                      >
                        Time-Based
                      </button>
                    </div>

                    <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setVelocityMode('ai')}
                        className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                          velocityMode === 'ai'
                            ? 'bg-[#2558E8] text-white font-semibold'
                            : 'text-slate-600'
                        }`}
                      >
                        AI-Assisted (1.8x)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVelocityMode('manual')}
                        className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                          velocityMode === 'manual'
                            ? 'bg-[#0F172A] text-white font-semibold'
                            : 'text-slate-600'
                        }`}
                      >
                        Manual (1.0x)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Calculated Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-mono uppercase text-slate-500">
                      Adjusted Engineering Effort
                    </span>
                    <div className="mt-1 text-2xl font-bold text-[#0F172A] tabular-nums">
                      {adjustedHours} hrs
                    </div>
                    <span className="text-xs text-slate-500">
                      Baseline {totalBaseHours}h ÷ {multiplier.toFixed(1)}x multiplier
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-mono uppercase text-slate-500">
                      {planBasis === 'sprint' ? 'Estimated Sprints (2-wk)' : 'Calendar Window'}
                    </span>
                    <div className="mt-1 text-2xl font-bold text-[#2558E8] tabular-nums">
                      {planBasis === 'sprint' ? `${sprintCount} Sprints` : `${calendarWeeks} Weeks`}
                    </div>
                    <span className="text-xs text-slate-500">
                      {planBasis === 'sprint'
                        ? '40h engineering capacity / sprint'
                        : 'Includes QA verification & UAT buffer'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-mono uppercase text-slate-500">
                      Confidence Interval (PERT)
                    </span>
                    <div className="mt-1 text-2xl font-bold text-[#059669] tabular-nums">
                      {Math.round(adjustedHours * 0.85)}–{Math.round(adjustedHours * 1.2)} hrs
                    </div>
                    <span className="text-xs text-slate-500">
                      9 discrete Backend, Frontend &amp; QA tasks
                    </span>
                  </div>
                </div>

                {/* Task Rows */}
                <div className="space-y-2 text-xs">
                  {[
                    {
                      id: 'EX-BE-01',
                      title: 'Ledger Journal ACID Transaction & Segregation-of-Duties SQL Guard',
                      role: 'Backend',
                      base: 42,
                    },
                    {
                      id: 'EX-FE-02',
                      title: 'Expense Claim Virtual Grid, Receipt Drawer & Policy Guardrails',
                      role: 'Frontend',
                      base: 48,
                    },
                    {
                      id: 'EX-QA-03',
                      title: 'Multi-Currency Rounding & Duplicate Receipt Verification Suite',
                      role: 'Validation',
                      base: 22,
                    },
                  ].map((task) => {
                    const hrs = Math.round(task.base / multiplier);
                    return (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono font-semibold text-[#2558E8] shrink-0">
                            {task.id}
                          </span>
                          <span className="font-medium text-[#0F172A] truncate">{task.title}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-600 tabular-nums shrink-0">
                          {task.role} · {hrs}h
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 4: SIDE-BY-SIDE SOURCE READER */}
            {activePreviewTab === 'reader' && (
              <motion.div
                key="reader"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  {/* Original Specification Clause */}
                  <div className="pb-4 md:pb-0 md:pr-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 pb-2 border-b border-slate-100">
                      <span>SOURCE SPECIFICATION</span>
                      <span>Page 18 §3.4</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      &ldquo;3.4 Escalation &amp; Segregation of Duties: Expense claims exceeding
                      $2,500 require Tier-2 Finance Approver authorization before payout batch
                      inclusion. Under no circumstances may an approver authorize a reimbursement
                      submitted under their own user account.&rdquo;
                    </div>
                  </div>

                  {/* Grounded Extraction */}
                  <div className="pt-4 md:pt-0 md:pl-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#2558E8] pb-2 border-b border-slate-100">
                      <span>RULEBOOK STRUCTURED EXTRACTION</span>
                      <span>100% Grounded Citation</span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1">
                        <span className="font-semibold text-[#2558E8] block">
                          Decision Gate: $2,500 Tier-2 Threshold
                        </span>
                        <p className="text-slate-600">
                          Claims over $2,500 route automatically to Finance Approver queue prior to
                          disbursement.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                        <span className="font-semibold text-[#059669] block">
                          Blocked Outcome: Self-Approval Prevention (FE + SQL)
                        </span>
                        <p className="text-slate-600">
                          Disables approval action in UI and rejects commit via SQL error 50418 when
                          submitter equals approver.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Direct Workspace Action */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={onEnterApp}
              className="text-xs font-semibold text-[#2558E8] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Open your private workspace to analyze your own document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS (3 ARCHITECTURAL STEPS)
         ========================================================================= */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 max-w-[1240px] mx-auto space-y-12 border-t border-slate-200"
      >
        <div className="text-center space-y-2.5 max-w-xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2558E8]">
            3-Step Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight text-balance">
            How Rulebook works
          </h2>
          <p className="text-sm text-[#64748B]">
            From dense, ambiguous specification files to role-grounded visual plans in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <span className="font-mono text-xs font-semibold text-[#2558E8]">01</span>
            <h3 className="text-base font-semibold text-[#0F172A]">Parse locally in your browser</h3>
            <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed">
              Upload any PDF, Word, Markdown, or TXT specification. Every heading, constraint table,
              and role clause is indexed client-side with zero external document storage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <span className="font-mono text-xs font-semibold text-[#059669]">02</span>
            <h3 className="text-base font-semibold text-[#0F172A]">
              Generate AI Roles &amp; User Flows
            </h3>
            <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed">
              Launch the AI Flowchart engine to map user triggers, decision gates, role handoffs,
              and blocked error states with full page citations and live token telemetry.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <span className="font-mono text-xs font-semibold text-[#0F172A]">03</span>
            <h3 className="text-base font-semibold text-[#0F172A]">
              Align Frontend, Backend &amp; PO
            </h3>
            <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed">
              Switch engineering perspectives to verify UI guardrails, SQL stored procedure specs,
              and calibrated Sprint or Time-based delivery estimates before writing code.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CORE CAPABILITIES (ASYMMETRIC BENTO GRID)
         ========================================================================= */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 max-w-[1240px] mx-auto space-y-12 border-t border-slate-200"
      >
        <div className="text-center space-y-2.5 max-w-xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2558E8]">
            Updated Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight text-balance">
            Built for clarity across every engineering role
          </h2>
          <p className="text-sm text-[#64748B]">
            Engineered around real developer workflows, role governance, and transparent AI
            consumption.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Card 1 (2 cols): AI Roles & User Flowcharts */}
          <div className="lg:col-span-2 p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-[#2558E8] flex items-center justify-center">
                  <GitBranch className="w-4 h-4" />
                </div>
                <span className="font-mono text-[11px] text-slate-500">
                  Gemini Free-Tier · Live Token Telemetry
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#0F172A]">
                AI-Driven Roles &amp; User Flowchart Diagrams
              </h3>
              <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed max-w-2xl">
                Turn static requirements into interactive role swimlane flowcharts showing every
                decision gate, escalation handoff, and error rejection path. Includes architectural
                blueprint loading feedback, step-by-step playback, custom flow prompting, and
                real-time token consumption counts.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200/80 text-xs">
              <div>
                <span className="font-mono text-[11px] text-slate-400 block">Visual Gates</span>
                <span className="font-semibold text-[#0F172A]">Allow &amp; Blocked Paths</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-slate-400 block">Playback</span>
                <span className="font-semibold text-[#0F172A]">Step-by-Step Signal</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-slate-400 block">Telemetry</span>
                <span className="font-semibold text-[#0F172A] tabular-nums">
                  Exact Prompt + Output
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 (1 col): 3 Engineering Perspectives */}
          <div className="lg:col-span-1 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 text-[#059669] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">3 Dedicated Perspectives</h3>
            <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed">
              Switch instantaneously between Frontend guardrails &amp; sandboxes, Backend stored
              procedure contracts &amp; SQL RBAC, and PO / Lead scope &amp; delivery lenses.
            </p>
          </div>

          {/* Card 3 (1 col): Sprint & Time Planner */}
          <div className="lg:col-span-1 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 text-[#D97706] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">Sprint &amp; Time Forecasting</h3>
            <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed">
              Compare Sprint-Based vs. Time-Based delivery calendars and toggle AI-Assisted vs.
              Manual velocity multipliers across every extracted backlog task.
            </p>
          </div>

          {/* Featured Card 4 (2 cols): Split Reader & Grounded Citations */}
          <div className="lg:col-span-2 p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-[#0F172A] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-mono text-[11px] text-slate-500">
                  Split Document Reader · Scope Fencing
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#0F172A]">
                Grounded Page Citations &amp; Zero-Trust Local Privacy
              </h3>
              <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed max-w-2xl">
                Every rule, clarification flag, and flowchart node traces back to its exact page
                and section inside the integrated Document Reader. Keep proprietary architecture
                specs private inside your browser workspace with clean Included vs. Excluded scope
                boundaries.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200/80 text-xs">
              <div>
                <span className="font-mono text-[11px] text-slate-400 block">Traceability</span>
                <span className="font-semibold text-[#0F172A]">Exact Page &amp; Clause</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-slate-400 block">Storage</span>
                <span className="font-semibold text-[#0F172A]">Browser-Local First</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-slate-400 block">Governance</span>
                <span className="font-semibold text-[#0F172A]">Included vs Excluded</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. BEFORE & AFTER COMPARISON
         ========================================================================= */}
      <section
        id="comparison"
        className="py-20 px-4 sm:px-6 max-w-[1240px] mx-auto space-y-12 border-t border-slate-200"
      >
        <div className="text-center space-y-2.5 max-w-xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2558E8]">
            Why Teams Switch
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight text-balance">
            Before Rulebook vs. With Rulebook
          </h2>
          <p className="text-sm text-[#64748B]">
            Eliminate requirement blind spots before engineering estimation begins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              Traditional Spec Reviews
            </div>
            <ul className="space-y-3 text-xs sm:text-[13px] text-slate-600">
              {[
                'Developers spend days combing through 120-page PDFs to piece together one user flow.',
                'Role permissions and blocked error cases hide in scattered appendix notes until QA.',
                'Frontend and Backend engineers interpret different clauses from memory.',
                'Manual sprint estimates rely on gut-feel rather than discrete, calibrated engineering tasks.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With Rulebook */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-blue-200 space-y-4">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2558E8]">
              With Rulebook Specification OS
            </div>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#0F172A]">
              {[
                'Interactive AI Role & User Flowcharts map triggers, gates, and blocked paths in seconds.',
                'Frontend, Backend, and PO perspectives share a single page-cited source of truth.',
                'Ambiguous formulas and missing approval steps surface upfront in Clarifications.',
                'Sprint-Based & Time-Based PERT planners adapt instantly between AI-Assisted and Manual velocity.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FREQUENTLY ASKED QUESTIONS (FAQ)
         ========================================================================= */}
      <section
        id="faq"
        className="py-20 px-4 sm:px-6 max-w-[840px] mx-auto space-y-10 border-t border-slate-200"
      >
        <div className="text-center space-y-2.5">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2558E8]">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Common questions about Rulebook
          </h2>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={item.q} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left flex items-center justify-between gap-4 text-sm font-semibold text-[#0F172A] cursor-pointer"
                >
                  <span>{item.q}</span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed pt-2.5 pr-6">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          8. BOTTOM CONVERSION BANNER (DEEP RADIAL NAVY CARD ON BLUEPRINT CANVAS)
         ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden border-t border-slate-200">
        {/* Soft Blueprint Grid Behind Conversion Card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-blueprint [mask-image:radial-gradient(ellipse_85%_80%_at_50%_50%,#000_45%,transparent_100%)]"
        />

        <div className="relative max-w-[1060px] mx-auto">
          <div className="rounded-3xl bg-[radial-gradient(ellipse_at_top,#102042_0%,#070D1B_62%,#03060D_100%)] border border-slate-800/90 text-white p-9 sm:p-16 text-center space-y-6 shadow-[0_28px_70px_-15px_rgba(3,7,18,0.45)]">
            <div className="font-mono text-[11px] uppercase tracking-widest text-slate-300">
              Zero Installation Required · 100% Browser-Local
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.12] text-white max-w-2xl mx-auto text-balance">
              Ready to make your specification documents clear and actionable?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Upload your own private FSD, BRD, or PRD to inspect role perspectives, generate AI
              flowcharts, and calibrate sprint delivery directly in your browser.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onEnterApp}
                className="w-full sm:w-auto whitespace-nowrap px-6 py-3 rounded-xl bg-[#2558E8] hover:bg-[#1D47C5] active:bg-[#1638A0] text-white font-semibold text-sm transition-all shadow-lg shadow-[#2558E8]/30 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Rulebook Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('preview-section')}
                className="w-full sm:w-auto whitespace-nowrap px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-sm border border-white/15 transition-colors cursor-pointer"
              >
                Review Interactive Example
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-slate-400">
              <span>✓ 100% Client-Side Parsing</span>
              <span>✓ Zero External Document Storage</span>
              <span>✓ Live Gemini Token Telemetry</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. QUIET FOOTER
         ========================================================================= */}
      <footer className="border-t border-slate-200 bg-[#F8FAFC] py-10 text-xs text-[#64748B]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs">
              R
            </div>
            <span className="font-semibold text-[#0F172A]">Rulebook</span>
            <span aria-hidden="true">·</span>
            <span>Specification Intelligence &amp; AI Flowchart Workspace</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span>Developed and designed by</span>
            <span className="font-semibold text-[#0F172A]">Pragatheeswaran Kasinthan</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
