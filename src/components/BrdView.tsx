import React, { useState } from 'react';
import { 
  BRD_METADATA, 
  BRD_STAKEHOLDERS, 
  BRD_AS_IS_VS_TO_BE, 
  BRD_REQUIREMENTS, 
  BRD_ROI_METRICS 
} from '../data/brdData';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Award, 
  Search,
  Filter,
  FileCheck
} from 'lucide-react';

export const BrdView: React.FC = () => {
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Must Have' | 'Should Have'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequirements = BRD_REQUIREMENTS.filter((req) => {
    const matchesPriority = priorityFilter === 'All' || req.priority === priorityFilter;
    const matchesQuery =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {BRD_METADATA.documentId}
              </span>
              <span className="text-xs text-slate-500 font-mono">v{BRD_METADATA.version}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{BRD_METADATA.title}</h1>
            <p className="text-xs text-slate-600 mt-1">{BRD_METADATA.projectName}</p>
          </div>

          <div className="flex flex-col sm:items-end text-xs text-slate-500 space-y-1">
            <div><strong className="text-slate-700">Client:</strong> {BRD_METADATA.clientOrganization}</div>
            <div><strong className="text-slate-700">Sponsor:</strong> {BRD_METADATA.projectSponsor}</div>
            <div><strong className="text-slate-700">Fiscal Target:</strong> {BRD_METADATA.targetFiscalYear}</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="pt-4">
          <p className="text-xs text-slate-700 leading-relaxed">
            The objective of this software engineering project is to replace disparate paper attendance logs and fragmented manual clerical workflows
            with a unified, role-governed digital attendance platform. By coupling instant classroom roll-call with automated 09:30 AM cutoff locking
            and a formal Administrator Override escalation workflow, the system achieves flawless state audit defensibility, reduces teacher overhead,
            and secures child safety through immediate truancy notification.
          </p>
        </div>
      </div>

      {/* ROI & Key Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BRD_ROI_METRICS.map((roi, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">{roi.metric}</span>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums text-teal-700">{roi.value}</div>
            <p className="text-[11px] text-slate-500">{roi.context}</p>
          </div>
        ))}
      </div>

      {/* As-Is vs To-Be Comparative Process Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-teal-600" />
          Process Transformation Matrix: As-Is vs. To-Be
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4 w-1/4">Operational Domain</th>
                <th className="py-2.5 px-4 w-1/3 text-rose-900">Current As-Is (Legacy)</th>
                <th className="py-2.5 px-4 w-1/3 text-emerald-900">Future To-Be (EduPulse)</th>
                <th className="py-2.5 px-4">Measurable Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BRD_AS_IS_VS_TO_BE.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {row.area}
                  </td>
                  <td className="py-3 px-4 text-slate-600 bg-rose-50/30">
                    {row.asIs}
                  </td>
                  <td className="py-3 px-4 text-slate-800 bg-emerald-50/30 font-medium">
                    {row.toBe}
                  </td>
                  <td className="py-3 px-4 font-mono text-teal-700 font-semibold">
                    {row.impact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stakeholder Analysis & RACI Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          Stakeholder Analysis & RACI Governance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {BRD_STAKEHOLDERS.map((st, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{st.role}</h4>
                  <p className="text-[11px] text-slate-500">{st.name}</p>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {st.raci}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {st.responsibility}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MoSCoW Prioritized Functional Requirements Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-teal-600" />
              MoSCoW Prioritized Requirements & Acceptance Criteria
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Formal functional scope contract for engineering delivery</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setPriorityFilter('All')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  priorityFilter === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Priorities
              </button>
              <button
                onClick={() => setPriorityFilter('Must Have')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  priorityFilter === 'Must Have' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Must Have
              </button>
              <button
                onClick={() => setPriorityFilter('Should Have')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  priorityFilter === 'Should Have' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Should Have
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {filteredRequirements.map((req) => (
            <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    {req.id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-mono">{req.module}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    req.priority === 'Must Have' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {req.priority}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {req.description}
              </p>

              <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-100 text-xs">
                <span className="font-semibold text-teal-900 block mb-1">Acceptance Criteria (Definition of Done):</span>
                <ul className="space-y-1 text-teal-950">
                  {req.acceptanceCriteria.map((ac, acIdx) => (
                    <li key={acIdx} className="flex items-start gap-1.5">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span>{ac}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                <span>Business Value: {req.businessValue}</span>
                <span className="font-sans text-slate-700">Stakeholder: {req.stakeholder}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
