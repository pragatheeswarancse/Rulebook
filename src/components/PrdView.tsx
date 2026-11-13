import React from 'react';
import { PrdSection } from '../types/project';
import { 
  Target, 
  Users, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  Compass,
  FileCheck
} from 'lucide-react';

interface Props {
  prd: PrdSection;
  projectName: string;
}

export const PrdView: React.FC<Props> = ({ prd, projectName }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Vision & Scope Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
            PRD SPECIFICATION
          </span>
          <span className="text-xs text-slate-500 font-mono">Product Requirements & Scope Definition</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Product Requirements Document: {projectName}
        </h1>
        <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 text-slate-800 text-xs leading-relaxed">
          <span className="font-bold text-teal-900 block uppercase tracking-wider text-[11px] mb-1">Vision Statement:</span>
          {prd.visionStatement}
        </div>
      </div>

      {/* Problem Statement vs Value Proposition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Core Problem Statement
          </h3>
          <p className="text-slate-700 leading-relaxed bg-rose-50/40 p-3.5 rounded-xl border border-rose-100">
            {prd.problemStatement}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Target Value Proposition
          </h3>
          <p className="text-slate-700 leading-relaxed bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100">
            {prd.valueProposition}
          </p>
        </div>
      </div>

      {/* Target User Personas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-600" />
          Target User Personas & Core Needs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {prd.targetAudience.map((user, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">{user.persona}</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">{user.description}</p>
              <div className="pt-2 border-t border-slate-200/80">
                <span className="font-semibold text-teal-900 block text-[10px] uppercase">Core Need:</span>
                <span className="text-slate-800 text-[11px]">{user.coreNeed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Workflows Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-600" />
          Core Functional Product Workflows
        </h3>

        <div className="space-y-4">
          {prd.coreWorkflows.map((flow, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{flow.workflowName}</h4>
                <span className="font-mono text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {flow.steps.length} Steps
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {flow.steps.map((st, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 font-medium text-[11px]">
                      {sIdx + 1}. {st}
                    </span>
                    {sIdx < flow.steps.length - 1 && (
                      <span className="text-slate-400 font-bold">➔</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-950 font-medium">
                <strong>Expected Product Outcome:</strong> {flow.outcome}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Measurable Success KPIs & Acceptance Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          Measurable Product Success Metrics & Release Criteria
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {prd.successMetrics.map((sm, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="font-bold text-slate-900 text-xs block">{sm.metric}</span>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-xl font-bold text-emerald-700">{sm.target}</span>
                <span className="text-[10px] text-slate-400">Target SLA</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Baseline (Current): {sm.baseline}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
