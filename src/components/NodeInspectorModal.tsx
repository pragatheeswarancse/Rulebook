import React from 'react';
import { FlowNode } from '../types';
import { X, Database, Terminal, ShieldAlert, CheckCircle, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface Props {
  node: FlowNode | null;
  onClose: () => void;
  onNavigateToFsd?: () => void;
  onNavigateToJourney?: () => void;
}

export const NodeInspectorModal: React.FC<Props> = ({
  node,
  onClose,
  onNavigateToFsd,
  onNavigateToJourney
}) => {
  if (!node) return null;

  const isRoleAdmin = node.role === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-2xl h-full sm:h-[92vh] sm:rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b border-slate-200 ${isRoleAdmin ? 'bg-gradient-to-r from-teal-50 to-emerald-50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold">
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wide ${isRoleAdmin ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'}`}>
                  {node.swimlane}
                </span>
                <span className="text-slate-500 font-mono">Node #{node.stepNumber}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{node.title}</h2>
              <p className="text-xs font-medium text-slate-600 mt-0.5">{node.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Functional Purpose */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Functional Purpose</h4>
            <p className="text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {node.description}
            </p>
          </div>

          {/* I/O Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Required Inputs</span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {node.inputs.map((inp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-teal-600 font-bold">›</span>
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">System Outputs</span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {node.outputs.map((outp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">›</span>
                    <span>{outp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Business & Validation Rules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Business & Security Rules</h4>
            <div className="space-y-2">
              {node.businessRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50/60 border border-amber-100/80 text-xs text-amber-950">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* API Endpoints & Payload Contracts */}
          {node.apiEndpoints.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  REST API Contract
                </h4>
                <span className="text-[11px] font-mono text-slate-500">{node.apiEndpoints[0].authScope}</span>
              </div>

              {node.apiEndpoints.map((api, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900 text-slate-100 overflow-hidden font-mono text-xs">
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950 border-b border-slate-800 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                        api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                        api.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                        api.method === 'PATCH' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-200'
                      }`}>
                        {api.method}
                      </span>
                      <span className="text-slate-300 font-semibold">{api.path}</span>
                    </div>
                  </div>

                  {api.requestSample && (
                    <div className="p-3 border-b border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase font-sans font-semibold">Request Body:</span>
                      <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed max-h-36">
                        {api.requestSample}
                      </pre>
                    </div>
                  )}

                  {api.responseSample && (
                    <div className="p-3 bg-slate-900/60">
                      <span className="text-[10px] text-emerald-400 block mb-1 uppercase font-sans font-semibold">Response (HTTP 200 OK):</span>
                      <pre className="text-emerald-300/90 overflow-x-auto text-[11px] leading-relaxed max-h-36">
                        {api.responseSample}
                      </pre>
                    </div>
                  )}

                  <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-800 flex flex-wrap gap-2 text-[10px] text-slate-400">
                    <span className="font-sans font-semibold">Error Codes:</span>
                    {api.errorCodes.map((err, errIdx) => (
                      <span key={errIdx} className="text-rose-400 font-mono">
                        {err}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Database Entities Touched */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              Impacted Database Entities
            </h4>
            <div className="flex flex-wrap gap-2">
              {node.dbTables.map((tbl, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs">
                  {tbl}
                </span>
              ))}
            </div>
          </div>

          {/* Exception & Error Handling */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
              Edge Cases & Fault Tolerance
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
              {node.exceptionHandling.map((exc, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-rose-900">
                  <span className="text-rose-500 font-bold">›</span>
                  <span>{exc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onNavigateToFsd && (
              <button
                onClick={onNavigateToFsd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                View in FSD
              </button>
            )}
            {onNavigateToJourney && (
              <button
                onClick={onNavigateToJourney}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                Simulate in Journey
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
