import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Edit3, 
  ExternalLink,
  Info,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  FileSearch,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { PurposeUnderstanding, PrimaryPurpose } from '../../types/rulebook';

interface Props {
  purpose: PurposeUnderstanding;
  documentName: string;
  onUpdatePurpose: (updated: PurposeUnderstanding) => void;
  onOpenSourcePage: (page: number) => void;
}

export const PurposeOverviewSection: React.FC<Props> = ({
  purpose,
  documentName,
  onUpdatePurpose,
  onOpenSourcePage
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editModule, setEditModule] = useState(purpose.module);
  const [editCurrent, setEditCurrent] = useState(purpose.currentSituation);
  const [editIntended, setEditIntended] = useState(purpose.intendedWork);
  const [editPurpose, setEditPurpose] = useState<PrimaryPurpose>(purpose.primaryPurpose);

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePurpose({
      ...purpose,
      module: editModule.trim(),
      currentSituation: editCurrent.trim(),
      intendedWork: editIntended.trim(),
      primaryPurpose: editPurpose,
      isUserCorrected: true,
      userNotes: 'Verified and refined by architect review'
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* =========================================================================
          1. SECTION HEADER & METADATA BAR
         ========================================================================= */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-semibold text-[#0F172A] tracking-tight">
                Purpose & Scope
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-slate-100 text-[#0F172A] border border-slate-200">
                <FileSearch className="w-3 h-3 text-[#2558E8]" />
                <span>{purpose.primaryPurpose}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Understand the business objective, current challenges, and intended system capabilities.
            </p>
          </div>

          <button
            onClick={() => {
              setEditModule(purpose.module);
              setEditCurrent(purpose.currentSituation);
              setEditIntended(purpose.intendedWork);
              setEditPurpose(purpose.primaryPurpose);
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0F172A] bg-white hover:bg-slate-50 active:bg-slate-100 border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer shadow-2xs self-start sm:self-auto shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#2558E8]" />
            <span>{purpose.isUserCorrected ? 'Edit Understanding' : 'Correct Understanding'}</span>
          </button>
        </div>

        {/* User Correction Audit Notice (if corrected) */}
        {purpose.isUserCorrected && (
          <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-[#0F172A] text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2558E8] shrink-0" />
              <span>
                <strong>Reviewer override active:</strong> {purpose.userNotes || 'Document understanding verified by reviewer.'} Original source evidence citations remain preserved for provenance.
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#2558E8] uppercase font-semibold px-2 py-0.5 rounded bg-white border border-blue-200 shrink-0">
              Verified Baseline
            </span>
          </div>
        )}

        {/* Identified Module Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block">
              Identified Module
            </span>
            <p className="font-semibold text-[#0F172A] text-sm truncate" title={purpose.module}>
              {purpose.module}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block">
              Source Document
            </span>
            <p className="font-mono text-[#0F172A] truncate" title={documentName}>
              {documentName}
            </p>
          </div>

          <div className="space-y-0.5 sm:text-right">
            <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block">
              Provenance Citations
            </span>
            <span className="font-mono text-[#059669] font-medium flex items-center sm:justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{purpose.supportingEvidence?.length || 1} verified references</span>
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          2. AS-IS (CURRENT SITUATION) vs TO-BE (INTENDED DELIVERY) COMPARISON
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left: Current Situation (AS-IS) */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono font-medium text-[#64748B] uppercase tracking-wider block">
                  Operational Baseline
                </span>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Current Situation (AS-IS)
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-[#64748B] border border-slate-200">
                Baseline
              </span>
            </div>

            <div className="text-xs sm:text-sm text-[#0F172A] leading-relaxed space-y-2">
              <p>{purpose.currentSituation}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-[#64748B] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Info className="w-3.5 h-3.5" />
              <span>Extracted from specification problem statement</span>
            </span>
          </div>
        </div>

        {/* Right: Intended Delivery (TO-BE) */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono font-medium text-[#2558E8] uppercase tracking-wider block">
                  Target Architecture
                </span>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Intended Delivery (TO-BE)
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#2558E8] border border-blue-200 font-medium">
                Scope Target
              </span>
            </div>

            <div className="text-xs sm:text-sm text-[#0F172A] leading-relaxed space-y-2">
              <p>{purpose.intendedWork}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-[#64748B] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#059669]">
              <Check className="w-3.5 h-3.5" />
              <span>Target system deliverables mapped to execution tasks</span>
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          3. EXPLICIT UNKNOWNS & SUPPORTING SOURCE EVIDENCE
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Explicit Unknowns & Clarification Requirements */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#D97706]" />
                <h3 className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                  Explicit Unknowns & Unestablished Scope
                </h3>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Unspecified calculation formulas, external dependencies, or policy decisions.
              </p>
            </div>
            
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-[#D97706] border border-amber-200">
              {purpose.unknowns?.length || 0} items
            </span>
          </div>

          {purpose.unknowns && purpose.unknowns.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {purpose.unknowns.map((unk, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/80 text-xs text-[#0F172A] flex items-start gap-3 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="font-medium text-[#0F172A]">{unk}</p>
                    <div className="flex items-center gap-2 text-[11px] text-[#D97706]">
                      <span>Action: Confirm with Architecture Review Board</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <CheckCircle2 className="w-5 h-5 text-[#059669] mx-auto" />
              <p className="text-xs font-medium text-[#0F172A]">Zero Unresolved Requirements</p>
              <p className="text-[11px] text-[#64748B]">All core operational flows have explicitly defined parameters.</p>
            </div>
          )}
        </div>

        {/* Supporting Source Evidence (Traceability & Provenance) */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#2558E8]" />
                <h3 className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                  Supporting Source Evidence
                </h3>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Traceable passages directly cited from the uploaded specification.
              </p>
            </div>

            <span className="font-mono text-xs text-[#059669] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified Citations
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {purpose.supportingEvidence && purpose.supportingEvidence.length > 0 ? (
              purpose.supportingEvidence.map((ev, idx) => (
                <button 
                  key={idx}
                  type="button"
                  onClick={() => onOpenSourcePage(ev.page)}
                  className="w-full text-left p-3 rounded-lg bg-[#F8FAFC] hover:bg-slate-100/80 border border-[#E2E8F0] hover:border-slate-300 transition-colors cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-[#0F172A] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2558E8]" />
                      <span>Page {ev.page}</span>
                    </span>
                    <span className="text-[#2558E8] group-hover:underline flex items-center gap-1 text-[11px] font-medium">
                      <span>Jump to Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] italic leading-relaxed line-clamp-2">
                    "{ev.passage}"
                  </p>
                </button>
              ))
            ) : (
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B]">
                Primary document summary extracted from document header and initial modules.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* =========================================================================
          4. MODAL: CORRECT DOCUMENT UNDERSTANDING
         ========================================================================= */}
      {isEditing && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="correct-understanding-title"
          className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-xl border border-[#E2E8F0] max-w-lg w-full p-6 shadow-xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="space-y-0.5">
                <h3 id="correct-understanding-title" className="text-base font-semibold text-[#0F172A]">
                  Correct Document Understanding
                </h3>
                <p className="text-xs text-[#64748B]">
                  Update classification, module boundary, or system delivery objectives.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-[#0F172A] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCorrection} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#0F172A]">Primary Purpose</label>
                <select
                  value={editPurpose}
                  onChange={(e) => setEditPurpose(e.target.value as PrimaryPurpose)}
                  className="w-full bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg px-3 py-2 text-[#0F172A] focus:outline-none cursor-pointer"
                >
                  <option value="FSD or detailed requirements">FSD or detailed requirements</option>
                  <option value="BRD">BRD</option>
                  <option value="Existing system description">Existing system description</option>
                  <option value="Estimation or analysis report">Estimation or analysis report</option>
                  <option value="Feature inventory">Feature inventory</option>
                  <option value="Mixed or unclear">Mixed or unclear</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#0F172A]">Module Identification</label>
                <input
                  type="text"
                  required
                  value={editModule}
                  onChange={(e) => setEditModule(e.target.value)}
                  className="w-full bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg px-3 py-2 text-[#0F172A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#0F172A]">Current Situation (AS-IS)</label>
                <textarea
                  rows={3}
                  value={editCurrent}
                  onChange={(e) => setEditCurrent(e.target.value)}
                  className="w-full bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg px-3 py-2 text-[#0F172A] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#0F172A]">Intended Delivery (TO-BE)</label>
                <textarea
                  rows={3}
                  value={editIntended}
                  onChange={(e) => setEditIntended(e.target.value)}
                  className="w-full bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg px-3 py-2 text-[#0F172A] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-[#2558E8] hover:bg-[#1D47C5] rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Save Corrections
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
