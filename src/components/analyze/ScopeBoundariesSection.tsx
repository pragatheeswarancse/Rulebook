import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ExternalLink, 
  Check, 
  X,
  Filter,
  Search,
  CheckSquare
} from 'lucide-react';
import { ScopeBoundaryAnalysis, ScopeItem, WorkStatus, DeliveryScope } from '../../types/rulebook';

interface Props {
  scope: ScopeBoundaryAnalysis;
  onUpdateScopeItem: (id: string, updates: Partial<ScopeItem>) => void;
  onOpenSourcePage: (page: number) => void;
}

export const ScopeBoundariesSection: React.FC<Props> = ({
  scope,
  onUpdateScopeItem,
  onOpenSourcePage
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [deliveryScopeFilter, setDeliveryScopeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scope.items.filter(item => {
      if (selectedArea !== 'all' && item.functionalArea !== selectedArea) return false;
      if (deliveryScopeFilter !== 'all' && item.deliveryScope.toLowerCase() !== deliveryScopeFilter.toLowerCase()) return false;
      if (q) {
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.functionalArea.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [scope.items, selectedArea, deliveryScopeFilter, searchQuery]);

  const includedCount = useMemo(() => 
    scope.items.filter(i => i.deliveryScope === 'Included').length,
    [scope.items]
  );

  const excludedCount = useMemo(() => 
    scope.items.filter(i => i.deliveryScope === 'Excluded').length,
    [scope.items]
  );

  const undecidedCount = useMemo(() => 
    scope.items.filter(i => i.deliveryScope === 'Undecided').length,
    [scope.items]
  );

  const getDeliveryIndicator = (del: DeliveryScope) => {
    switch (del) {
      case 'Included':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-[#059669] border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
            <span>In Scope</span>
          </span>
        );
      case 'Excluded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-[#DC2626] border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Excluded / Deferred</span>
          </span>
        );
      case 'Undecided':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-[#D97706] border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Undecided (Pending Review)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-[#64748B] border border-slate-200">
            Not Established
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Info & Scope Counter Cards */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold text-[#0F172A] tracking-tight">
              Scope Boundaries
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Explicit delivery commitments, out-of-scope constraints, and unconfirmed scope decisions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto shrink-0">
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-[#059669] border border-emerald-200 font-semibold">
              {includedCount} Included
            </span>
            <span className="px-2.5 py-1 rounded bg-red-50 text-[#DC2626] border border-red-200 font-semibold">
              {excludedCount} Excluded
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-50 text-[#D97706] border border-amber-200 font-semibold">
              {undecidedCount} Undecided
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <label className="text-[#64748B] font-medium">Functional Area:</label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2558E8] cursor-pointer"
              >
                <option value="all">All Functional Areas ({scope.functionalAreas.length})</option>
                {scope.functionalAreas.map(fa => (
                  <option key={fa} value={fa}>{fa}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-[#E2E8F0]">
              <button
                onClick={() => setDeliveryScopeFilter('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  deliveryScopeFilter === 'all' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                All ({scope.items.length})
              </button>
              <button
                onClick={() => setDeliveryScopeFilter('included')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  deliveryScopeFilter === 'included' ? 'bg-white text-[#059669] shadow-xs' : 'text-[#64748B] hover:text-[#059669]'
                }`}
              >
                In Scope
              </button>
              <button
                onClick={() => setDeliveryScopeFilter('excluded')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  deliveryScopeFilter === 'excluded' ? 'bg-white text-[#DC2626] shadow-xs' : 'text-[#64748B] hover:text-[#DC2626]'
                }`}
              >
                Excluded
              </button>
              <button
                onClick={() => setDeliveryScopeFilter('undecided')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  deliveryScopeFilter === 'undecided' ? 'bg-white text-[#D97706] shadow-xs' : 'text-[#64748B] hover:text-[#D97706]'
                }`}
              >
                Undecided
              </button>
            </div>
          </div>

          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Search deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg px-3 py-1.5 text-[#0F172A] placeholder-slate-400 focus:outline-none"
            />
          </div>

        </div>

      </div>

      {/* Scope Items List */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:px-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-[11px] font-semibold text-[#0F172A] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {item.id}
                  </span>
                  <span className="text-xs font-mono font-medium text-[#64748B]">
                    {item.functionalArea}
                  </span>
                  <span className="text-slate-300">·</span>
                  {getDeliveryIndicator(item.deliveryScope)}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-[#0F172A] tracking-tight">{item.title}</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">{item.description}</p>
                </div>

                {item.provenance && (
                  <div className="pt-0.5 flex items-center gap-2 text-[11px] text-[#64748B]">
                    <button
                      onClick={() => onOpenSourcePage(item.provenance.page)}
                      className="text-[#2558E8] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                    >
                      <span>Page {item.provenance.page}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <span>·</span>
                    <span className="italic truncate max-w-md">"{item.provenance.passage}"</span>
                  </div>
                )}
              </div>

              {/* Scope Toggles */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={() => onUpdateScopeItem(item.id, { deliveryScope: 'Included' })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                    item.deliveryScope === 'Included'
                      ? 'bg-emerald-50 text-[#059669] border-emerald-200'
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                  }`}
                >
                  Include
                </button>
                <button
                  onClick={() => onUpdateScopeItem(item.id, { deliveryScope: 'Excluded' })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                    item.deliveryScope === 'Excluded'
                      ? 'bg-red-50 text-[#DC2626] border-red-200'
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                  }`}
                >
                  Exclude
                </button>
                <button
                  onClick={() => onUpdateScopeItem(item.id, { deliveryScope: 'Undecided' })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                    item.deliveryScope === 'Undecided'
                      ? 'bg-amber-50 text-[#D97706] border-amber-200'
                      : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                  }`}
                >
                  Undecided
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-xl border border-[#E2E8F0] text-xs text-[#64748B]">
          No scope deliverables match your current filter.
        </div>
      )}

    </div>
  );
};
