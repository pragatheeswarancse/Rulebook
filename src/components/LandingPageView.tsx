import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  FileText, 
  ShieldCheck, 
  Eye, 
  Layers, 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  BarChart3, 
  GitBranch, 
  Clock, 
  Lock, 
  FileCheck, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';

interface Props {
  onEnterApp: () => void;
}

export const LandingPageView: React.FC<Props> = ({ onEnterApp }) => {
  // Interactive Product Preview Tab State
  const [activePreviewTab, setActivePreviewTab] = useState<'map' | 'reader' | 'tasks'>('map');
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Teacher' | 'Parent'>('Admin');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqItems = [
    {
      q: 'What types of documents can I upload to Rulebook?',
      a: 'Rulebook supports Functional Specification Documents (FSD), Business Requirement Documents (BRD), Product Requirement Documents (PRD), and software architecture specs in PDF, Markdown (.md), Plain Text (.txt), and JSON formats up to 25 MB.'
    },
    {
      q: 'Do my confidential documents leave my computer?',
      a: 'No. All document parsing and text extraction occurs locally in your web browser session. Your proprietary specifications never get saved to external servers or used to train third-party AI models.'
    },
    {
      q: 'How does Rulebook identify missing or ambiguous requirements?',
      a: 'Rulebook scans requirements for unstated calculation formulas, unspecified edge cases, and missing approval hierarchies, cataloging them into a clean "Clarifications" checklist before engineering begins.'
    },
    {
      q: 'Can I edit or correct the extracted roles and tasks?',
      a: 'Yes. Rulebook provides a "Correct Understanding" workflow where architects and product owners can refine role names, override permissions, and approve baseline versions with a full audit trail.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans selection:bg-[#2558E8] selection:text-white antialiased">
      
      {/* =========================================================================
          1. HEADER (CLEAN & MINIMAL)
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              R
            </div>
            <span className="text-base font-bold text-[#0F172A] tracking-tight">Rulebook</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#64748B]">
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-[#0F172A] transition-colors cursor-pointer">
              How It Works
            </button>
            <button onClick={() => scrollTo('features')} className="hover:text-[#0F172A] transition-colors cursor-pointer">
              Key Features
            </button>
            <button onClick={() => scrollTo('comparison')} className="hover:text-[#0F172A] transition-colors cursor-pointer">
              Before & After
            </button>
            <button onClick={() => scrollTo('faq')} className="hover:text-[#0F172A] transition-colors cursor-pointer">
              FAQ
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-xs cursor-pointer"
            >
              <span>Open Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION (CLEAR, SIMPLE, HUMAN)
         ========================================================================= */}
      <section id="hero" className="pt-14 sm:pt-20 pb-16 px-4 sm:px-6 max-w-[1240px] mx-auto text-center space-y-6">
        
        {/* Kicker Tag - Clean Unboxed Metadata */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
          <span>Enterprise Specification OS</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Role Guardrails</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Zero Hallucinations</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#0F172A] tracking-tight leading-[1.15] max-w-3xl mx-auto">
          Turn 100-page specification documents into clear, visual implementation plans.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed font-normal">
          Upload any Functional Specification (FSD) or Business Requirement (BRD). Rulebook automatically extracts user roles, workflows, permissions, and engineering tasks in seconds—100% in your browser.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Analyzing Documents</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollTo('preview-section')}
            className="w-full sm:w-auto px-5 py-3 rounded-lg bg-white hover:bg-slate-50 text-[#0F172A] font-medium text-sm border border-[#E2E8F0] shadow-2xs transition-colors cursor-pointer"
          >
            See Live Preview ↓
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#059669]" />
            <span>100% In-Browser Privacy</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#2558E8]" />
            <span>PDF, Word, Markdown & TXT</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Instant Analysis</span>
          </div>
        </div>

      </section>

      {/* =========================================================================
          3. INTERACTIVE PRODUCT SHOWCASE (INSTANTLY UNDERSTANDABLE)
         ========================================================================= */}
      <section id="preview-section" className="py-8 px-4 sm:px-6 max-w-[1240px] mx-auto">
        
        <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 shadow-sm space-y-4">
          
          {/* Header of Preview Box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-[#0F172A]">Interactive Example: School Management FSD (64 pages)</span>
            </div>

            {/* Preview Navigation Tabs */}
            <div className="inline-flex items-center p-1 bg-white rounded-lg border border-[#E2E8F0] text-xs">
              <button
                onClick={() => setActivePreviewTab('map')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activePreviewTab === 'map' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>1. Role & Workflow Map</span>
              </button>

              <button
                onClick={() => setActivePreviewTab('reader')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activePreviewTab === 'reader' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>2. Side-by-Side Reader</span>
              </button>

              <button
                onClick={() => setActivePreviewTab('tasks')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activePreviewTab === 'tasks' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3. Implementation Tasks</span>
              </button>
            </div>
          </div>

          {/* TAB 1: VISUAL ROLE & WORKFLOW MAP */}
          {activePreviewTab === 'map' && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-semibold text-[#0F172A]">User Role Authorization Hierarchy</h4>
                  <p className="text-xs text-[#64748B]">Click any role below to explore what they are permitted to do in the specification:</p>
                </div>

                {/* Role Switcher */}
                <div className="flex items-center gap-1.5">
                  {(['Admin', 'Teacher', 'Parent'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        selectedRole === role 
                          ? 'bg-[#2558E8] text-white border-[#2558E8]' 
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Workflow Cards based on selected role */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {selectedRole === 'Admin' && (
                  <>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <span className="text-[11px] font-mono text-[#059669] font-semibold uppercase">● Full Access</span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">Manage Master Academic Data</h5>
                      <p className="text-xs text-[#64748B] leading-relaxed">Configures classes, academic terms, grading scales, and teacher assignments.</p>
                      <span className="text-[11px] font-mono text-slate-400 block pt-1">Cited: Page 4 §1.2</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <span className="text-[11px] font-mono text-[#059669] font-semibold uppercase">● Approval Gate</span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">Approve Question Papers</h5>
                      <p className="text-xs text-[#64748B] leading-relaxed">Reviews exam question papers drafted by teachers. Can approve or return for revisions.</p>
                      <span className="text-[11px] font-mono text-slate-400 block pt-1">Cited: Page 18 §4.1</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <span className="text-[11px] font-mono text-[#059669] font-semibold uppercase">● Administrative Override</span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">Attendance & Audit Overrides</h5>
                      <p className="text-xs text-[#64748B] leading-relaxed">Can edit historical attendance records with mandatory audit justification notes.</p>
                      <span className="text-[11px] font-mono text-slate-400 block pt-1">Cited: Page 22 §5.3</span>
                    </div>
                  </>
                )}

                {selectedRole === 'Teacher' && (
                  <>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <span className="text-[11px] font-mono text-[#2558E8] font-semibold uppercase">● Assigned Scope Only</span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">Take Daily Attendance</h5>
                      <p className="text-xs text-[#64748B] leading-relaxed">Marks morning and afternoon attendance only for their assigned classroom sections.</p>
                      <span className="text-[11px] font-mono text-slate-400 block pt-1">Cited: Page 7 §2.1</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <span className="text-[11px] font-mono text-[#2558E8] font-semibold uppercase">● Authoring</span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">Draft Question Papers</h5>
                      <p className="text-xs text-[#64748B] leading-relaxed">Submits question papers for review. Cannot publish exams without Admin approval.</p>
                      <span className="text-[11px] font-mono text-slate-400 block pt-1">Cited: Page 19 §4.2</span>
                    </div>

                    <div className="p-4 rounded-xl bg-red-50/50 border border-red-200/60 space-y-2">
                      <span className="text-[11px] font-mono text-[#DC2626] font-semibold uppercase">✕ Restricted Access</span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">Cannot View Other Classes</h5>
                      <p className="text-xs text-[#64748B] leading-relaxed">Strictly blocked from modifying fee receipts or viewing students from unassigned grades.</p>
                      <span className="text-[11px] font-mono text-slate-400 block pt-1">Cited: Page 9 §2.4</span>
                    </div>
                  </>
                )}

                {selectedRole === 'Parent' && (
                  <>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <span className="text-[11px] font-mono text-[#059669] font-semibold uppercase">● Read-Only Linked</span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">View Child Attendance & Grades</h5>
                      <p className="text-xs text-[#64748B] leading-relaxed">Accesses attendance reports, report cards, and homework for linked children only.</p>
                      <span className="text-[11px] font-mono text-slate-400 block pt-1">Cited: Page 31 §7.1</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <span className="text-[11px] font-mono text-[#2558E8] font-semibold uppercase">● Action Allowed</span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">Pay School Fees Online</h5>
                      <p className="text-xs text-[#64748B] leading-relaxed">Selects pending fee terms, completes payment gateway checkout, and downloads receipts.</p>
                      <span className="text-[11px] font-mono text-slate-400 block pt-1">Cited: Page 36 §8.2</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <span className="text-[11px] font-mono text-[#059669] font-semibold uppercase">● Real-Time Telemetry</span>
                      <h5 className="text-xs font-semibold text-[#0F172A]">Track Transport Bus</h5>
                      <p className="text-xs text-[#64748B] leading-relaxed">Monitors morning and afternoon live school bus GPS arrival notifications.</p>
                      <span className="text-[11px] font-mono text-slate-400 block pt-1">Cited: Page 40 §9.1</span>
                    </div>
                  </>
                )}

              </div>

            </div>
          )}

          {/* TAB 2: SIDE-BY-SIDE READER */}
          {activePreviewTab === 'reader' && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
                
                {/* Original Document Excerpt */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#64748B] pb-2 border-b border-slate-100">
                    <span>ORIGINAL PDF SPECIFICATION</span>
                    <span>Page 18 §4.1</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-slate-700 leading-relaxed font-serif">
                    "4.1 Examination Workflow: Teaching staff shall prepare and submit exam papers at least 14 days before the semester test date. Submitted papers enter a Pending Review state. The School Administrator holds sole authority to approve the exam paper for print distribution or return it with modification remarks."
                  </div>
                </div>

                {/* Structured Rulebook Extraction */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#2558E8] pb-2 border-b border-slate-100">
                    <span>RULEBOOK EXTRACTED RULES</span>
                    <span>100% Traceable</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[#0F172A] space-y-1">
                      <span className="font-semibold block text-[#2558E8]">Rule 1: 14-Day Advance Deadline</span>
                      <p className="text-xs text-slate-600">Exam papers must be submitted &ge; 14 days prior to exam date.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#0F172A] space-y-1">
                      <span className="font-semibold block text-[#059669]">Rule 2: Role Gate (Teacher $\to$ Admin)</span>
                      <p className="text-xs text-slate-600">Teachers cannot publish directly; Admin approval required.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: IMPLEMENTATION TASKS */}
          {activePreviewTab === 'tasks' && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <span className="font-semibold text-[#0F172A]">Generated Engineering Sprint Backlog</span>
                <span className="text-[#64748B] font-mono">18 Discrete Tasks Extracted</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-[#2558E8]">TSK-01</span>
                    <div>
                      <h5 className="font-semibold text-[#0F172A]">Database Schema for Question Paper Approval</h5>
                      <p className="text-[11px] text-[#64748B]">Create status enum [Draft, Submitted, Approved, Rejected] with foreign key to teacher ID.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#2558E8] shrink-0">Backend · 2-3 Days</span>
                </div>

                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-[#2558E8]">TSK-02</span>
                    <div>
                      <h5 className="font-semibold text-[#0F172A]">Admin Review & Feedback Interface</h5>
                      <p className="text-[11px] text-[#64748B]">Build approval queue UI with rejection feedback notes modal and email notifications.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-[#059669] shrink-0">Frontend · 1-2 Days</span>
                </div>

                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-[#2558E8]">TSK-03</span>
                    <div>
                      <h5 className="font-semibold text-[#0F172A]">14-Day Deadline Guard Invariant</h5>
                      <p className="text-[11px] text-[#64748B]">Validate exam submission date constraint in API payload validator.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 shrink-0">Validation · 0.5 Days</span>
                </div>
              </div>
            </div>
          )}

          {/* Action to enter app */}
          <div className="pt-2 text-center">
            <button
              onClick={onEnterApp}
              className="text-xs font-semibold text-[#2558E8] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore this complete project inside Rulebook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </section>

      {/* =========================================================================
          4. HOW IT WORKS (3 SIMPLE STEPS)
         ========================================================================= */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-[1240px] mx-auto space-y-12 border-t border-[#E2E8F0]">
        
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase text-[#2558E8]">Simple 3-Step Process</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            How Rulebook works
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            From raw, ambiguous specification documents to verified engineering plans in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2558E8] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">Upload your specification</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Drop any PDF, Word document, Markdown file, or text specification. Rulebook extracts every heading, table, and requirement clause.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">Automatic deconstruction</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Rulebook analyzes user roles, authorization rules, and scope boundaries, highlighting missing details and ambiguous clauses automatically.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">Execute with confidence</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Explore interactive role maps, review discrete engineering tasks, calibrate delivery estimates, and approve baselines with your stakeholders.
            </p>
          </div>

        </div>

      </section>

      {/* =========================================================================
          5. KEY FEATURES (CLEAR & INTUITIVE)
         ========================================================================= */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-[1240px] mx-auto space-y-12 border-t border-[#E2E8F0]">
        
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase text-[#2558E8]">Core Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Everything you need to master complex requirements
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Designed for software architects, business analysts, engineering leads, and project managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] text-[#2558E8] flex items-center justify-center shadow-2xs">
              <GitBranch className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#0F172A]">Interactive Role Maps</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              See who can do what across every module without hunting through 100 pages of text.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] text-[#059669] flex items-center justify-center shadow-2xs">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#0F172A]">Spot Missing Rules</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Flags unstated formulas, ambiguous terms, and missing dependencies before coding starts.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] text-purple-700 flex items-center justify-center shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#0F172A]">Clear Scope Fencing</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Fences what is Included vs Excluded to protect sprint velocity and prevent scope creep.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] text-[#D97706] flex items-center justify-center shadow-2xs">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#0F172A]">Sprint Task Estimates</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Generates discrete developer tasks with 3-point realistic effort ranges for sprint planning.
            </p>
          </div>

        </div>

      </section>

      {/* =========================================================================
          6. BEFORE & AFTER COMPARISON (CLIENT CLARITY)
         ========================================================================= */}
      <section id="comparison" className="py-20 px-4 sm:px-6 max-w-[1240px] mx-auto space-y-12 border-t border-[#E2E8F0]">
        
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase text-[#2558E8]">Why Teams Choose Rulebook</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Before Rulebook vs. With Rulebook
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            See how Rulebook eliminates requirement confusion and engineering re-work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Traditional Way */}
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
              <span>✕ Traditional Requirement Reviews</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Engineers spend days reading 120-page PDFs with conflicting clauses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Unstated assumptions and ambiguous rules get discovered midway through sprints.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Silent scope creep expands deadlines and causes friction between clients and devs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Estimates are based on subjective guesswork rather than discrete functional tasks.</span>
              </li>
            </ul>
          </div>

          {/* With Rulebook */}
          <div className="p-6 rounded-xl bg-blue-50/40 border border-blue-200/80 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2558E8] uppercase">
              <span>✓ With Rulebook Specification OS</span>
            </div>
            <ul className="space-y-3 text-xs text-[#0F172A]">
              <li className="flex items-start gap-2">
                <span className="text-[#059669] font-bold shrink-0">✓</span>
                <span>Instant visual role maps and clear permissions anyone on the team can understand in 2 minutes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#059669] font-bold shrink-0">✓</span>
                <span>Missing calculation formulas and ambiguous rules are flagged upfront before code is written.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#059669] font-bold shrink-0">✓</span>
                <span>Strict scope fencing distinguishes Included vs Excluded deliverables with 1-click approvals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#059669] font-bold shrink-0">✓</span>
                <span>Discrete developer tasks and calibrated PERT effort curves ready for your sprint backlog.</span>
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* =========================================================================
          7. FREQUENTLY ASKED QUESTIONS (FAQ)
         ========================================================================= */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-[840px] mx-auto space-y-10 border-t border-[#E2E8F0]">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-semibold uppercase text-[#2558E8]">Frequently Asked Questions</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Common questions about Rulebook
          </h2>
        </div>

        <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
          {faqItems.map((item, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 text-sm font-semibold text-[#0F172A] cursor-pointer"
              >
                <span>{item.q}</span>
                <span className="text-[#64748B] text-lg font-light shrink-0">
                  {openFaqIndex === idx ? '−' : '+'}
                </span>
              </button>
              {openFaqIndex === idx && (
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pt-2.5">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>

      </section>

      {/* =========================================================================
          8. BOTTOM CALL TO ACTION
         ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 max-w-[1240px] mx-auto">
        <div className="bg-[#0F172A] text-white rounded-2xl p-8 sm:p-14 text-center space-y-5 shadow-lg">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl mx-auto">
            Ready to make your specification documents clear and actionable?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Upload your document or explore preloaded enterprise projects. No complex setup or server installation required.
          </p>
          <div className="pt-2">
            <button
              onClick={onEnterApp}
              className="px-6 py-3 rounded-lg bg-[#2558E8] hover:bg-[#1D47C5] active:bg-[#1638A0] text-white font-medium text-sm transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Rulebook Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FOOTER (CLEAN & PROFESSIONAL)
         ========================================================================= */}
      <footer className="border-t border-[#E2E8F0] bg-[#F8FAFC] py-12 text-xs text-[#64748B]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs">
              R
            </div>
            <span className="font-semibold text-[#0F172A]">Rulebook</span>
            <span>·</span>
            <span>Document Analysis & Specification Engine</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span>Developed and designed by</span>
            <span className="font-semibold text-[#0F172A]">
              Pragatheeswaran Kasinthan
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
};
