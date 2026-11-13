import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  History
} from 'lucide-react';
import { ApprovedBaseline, RulebookAnalysis } from '../../types/rulebook';

interface Props {
  analysis: RulebookAnalysis;
  activeBaseline?: ApprovedBaseline;
  onApproveBaseline: (name: string, approvedBy: string) => void;
}

export const HumanReviewSection: React.FC<Props> = ({
  analysis,
  activeBaseline,
  onApproveBaseline
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [baselineName, setBaselineName] = useState('Baseline v1.0 - Engineering Handoff');
  const [approverName, setApproverName] = useState('Pragatheeswaran Kasinathan');

  const approvedRolesCount = analysis.roles.filter(r => r.reviewState === 'Approved').length;
  const rejectedRolesCount = analysis.roles.filter(r => r.reviewState === 'Rejected').length;
  const approvedFactsCount = analysis.facts.filter(f => f.reviewState === 'Approved').length;
  const approvedScopeCount = analysis.scope.items.filter(s => s.deliveryScope === 'Included' && s.reviewState === 'Approved').length;
  const openQuestionsCount = analysis.questions.filter(q => q.state === 'Open').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baselineName.trim()) return;
    onApproveBaseline(baselineName.trim(), approverName.trim() || 'Engineering Lead');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview & Baseline Sign-off Strip */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Baseline Freeze & Sign-off
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Lock decisions and authorize downstream engineering handoff.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Freeze Baseline</span>
          </button>
        </div>

        {/* Current Active Baseline Card */}
        {activeBaseline ? (
          <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-950 text-sm">{activeBaseline.name}</span>
                <span className="text-[10px] font-mono font-semibold text-emerald-800 uppercase">
                  Active Baseline
                </span>
              </div>
              <p className="text-emerald-800">
                Approved by <strong>{activeBaseline.approvedBy}</strong> on {activeBaseline.approvedAt} · Governs {activeBaseline.includedScopeCount} committed scope items.
              </p>
            </div>

            <div className="text-[11px] font-mono text-emerald-700 shrink-0">
              Downstream outputs synchronized
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/80 text-amber-900 text-xs flex items-center justify-between">
            <span>No formal baseline frozen yet. Downstream forecasts and tasks are operating on draft review.</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Approved Roles</span>
            <div className="text-xl font-bold font-mono text-slate-900">
              {approvedRolesCount} <span className="text-xs font-normal text-slate-500">/ {analysis.roles.length}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Approved Facts</span>
            <div className="text-xl font-bold font-mono text-slate-900">
              {approvedFactsCount} <span className="text-xs font-normal text-slate-500">/ {analysis.facts.length}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Committed Scope</span>
            <div className="text-xl font-bold font-mono text-slate-900">
              {approvedScopeCount} <span className="text-xs font-normal text-slate-500">items</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Open Blockers</span>
            <div className={`text-xl font-bold font-mono ${openQuestionsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {openQuestionsCount} <span className="text-xs font-normal text-slate-500">questions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Baseline History */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
            Frozen Baseline Audit History
          </h3>
        </div>

        {analysis.baselineHistory.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {analysis.baselineHistory.map((bh) => (
              <div key={bh.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-900">{bh.name}</div>
                  <div className="text-slate-500 mt-0.5">
                    Authorized by {bh.approvedBy} on {bh.approvedAt}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] text-slate-600">
                    {bh.includedScopeCount} scope items locked
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400">
            No historical baselines recorded. Click "Freeze Baseline" above to establish v1.0.
          </div>
        )}
      </div>

      {/* Modal: Freeze & Approve Baseline */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-700 block">
                Baseline Authority
              </span>
              <h3 className="text-base font-semibold text-slate-900">Authorize Specification Baseline</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Freezing creates an immutable decision point that anchors all downstream task decomposition, PERT estimations, and delivery commitments.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Baseline Name / Version</label>
                <input
                  type="text"
                  value={baselineName}
                  onChange={(e) => setBaselineName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Approving Engineer / Lead</label>
                <input
                  type="text"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-700">Audit Commitment:</div>
                <p>• {approvedRolesCount} Roles explicitly marked Approved</p>
                <p>• {approvedScopeCount} Scope deliverables locked into planning</p>
                <p>• {openQuestionsCount} Open clarification questions</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors"
                >
                  Freeze & Commit Baseline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
