import React, { useState, useMemo } from 'react';
import { 
  Binary, 
  Cpu, 
  Hash, 
  ExternalLink, 
  Database,
  Check, 
  X,
  Search,
  Filter,
  CheckCircle2,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { FactRecord } from '../../types/rulebook';

interface Props {
  facts: FactRecord[];
  onUpdateFactState: (id: string, newState: 'Approved' | 'Rejected' | 'Unresolved') => void;
  onOpenSourcePage: (page: number) => void;
}

export const BehaviorsFactsSection: React.FC<Props> = ({
  facts,
  onUpdateFactState,
  onOpenSourcePage
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | 'numeric' | 'behavior' | 'dependency'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return facts.filter(f => {
      if (typeFilter !== 'all' && f.type !== typeFilter) return false;
      if (q) {
        return (
          f.statement.toLowerCase().includes(q) ||
          (f.details && f.details.toLowerCase().includes(q)) ||
          f.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [facts, typeFilter, searchQuery]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'numeric':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-[#059669] border border-emerald-200">
            <Hash className="w-3 h-3 text-[#059669]" />
            <span>Numeric Invariant</span>
          </span>
        );
      case 'dependency':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Database className="w-3 h-3 text-purple-600" />
            <span>Dependency</span>
          </span>
        );
      case 'behavior':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-blue-50 text-[#2558E8] border border-blue-200">
            <Cpu className="w-3 h-3 text-[#2558E8]" />
            <span>Behavioral Rule</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-[#64748B] border border-slate-200">
            <Binary className="w-3 h-3 text-slate-500" />
            <span>General Rule</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Info & Controls */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold text-[#0F172A] tracking-tight">
              Invariants & Business Rules
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Atomic rules, calculation constraints, and deterministic invariants extracted from requirements.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 font-mono text-xs text-[#64748B] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <span>{facts.length} Verified Rules</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-[#E2E8F0] overflow-x-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                typeFilter === 'all' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All ({facts.length})
            </button>
            <button
              onClick={() => setTypeFilter('behavior')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                typeFilter === 'behavior' ? 'bg-white text-[#2558E8] shadow-xs' : 'text-[#64748B] hover:text-[#2558E8]'
              }`}
            >
              Behaviors
            </button>
            <button
              onClick={() => setTypeFilter('numeric')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                typeFilter === 'numeric' ? 'bg-white text-[#059669] shadow-xs' : 'text-[#64748B] hover:text-[#059669]'
              }`}
            >
              Numeric
            </button>
            <button
              onClick={() => setTypeFilter('dependency')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                typeFilter === 'dependency' ? 'bg-white text-purple-700 shadow-xs' : 'text-[#64748B] hover:text-purple-700]'
              }`}
            >
              Dependencies
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Search invariants by keyword or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg px-3 py-1.5 text-[#0F172A] placeholder-slate-400 focus:outline-none"
            />
          </div>

        </div>

      </div>

      {/* Facts Grid */}
      {filteredFacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFacts.map((fact) => (
            <div 
              key={fact.id}
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-[#0F172A] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {fact.id}
                    </span>
                    {getTypeBadge(fact.type)}
                  </div>

                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    fact.reviewState === 'Approved'
                      ? 'bg-emerald-50 text-[#059669] border-emerald-200'
                      : 'bg-slate-100 text-[#64748B] border-slate-200'
                  }`}>
                    {fact.reviewState || 'Approved'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-[#0F172A] leading-snug">
                    {fact.statement}
                  </h4>
                  {fact.details && (
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {fact.details}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer: Provenance Citation & Verification */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {fact.provenance ? (
                  <button
                    onClick={() => onOpenSourcePage(fact.provenance.page)}
                    className="text-[#2558E8] hover:underline flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                  >
                    <span>Page {fact.provenance.page}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-slate-400 text-[11px]">System Invariant</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateFactState(fact.id, fact.reviewState === 'Approved' ? 'Unresolved' : 'Approved')}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      fact.reviewState === 'Approved'
                        ? 'text-[#059669] bg-emerald-50'
                        : 'text-slate-400 hover:text-[#059669] hover:bg-slate-100'
                    }`}
                    title="Mark rule as approved"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateFactState(fact.id, fact.reviewState === 'Rejected' ? 'Unresolved' : 'Rejected')}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      fact.reviewState === 'Rejected'
                        ? 'text-[#DC2626] bg-red-50'
                        : 'text-slate-400 hover:text-[#DC2626] hover:bg-slate-100'
                    }`}
                    title="Mark rule as rejected"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-xl border border-[#E2E8F0] text-xs text-[#64748B]">
          No business invariants match your current filter.
        </div>
      )}

    </div>
  );
};
