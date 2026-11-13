import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Check, 
  X, 
  ExternalLink, 
  Lock, 
  Unlock, 
  ShieldAlert,
  ChevronDown,
  Info,
  Filter,
  Search,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { AccessRecord, PermissionEffect, RecordScope } from '../../types/rulebook';

interface Props {
  roles: AccessRecord[];
  onUpdateRoleState: (id: string, newState: 'Approved' | 'Rejected' | 'Unresolved') => void;
  onOpenSourcePage: (page: number) => void;
}

export const RolesAccessSection: React.FC<Props> = ({
  roles,
  onUpdateRoleState,
  onOpenSourcePage
}) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [effectFilter, setEffectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const uniqueRoles = useMemo(() => 
    Array.from(new Set(roles.map(r => r.role))),
    [roles]
  );

  const filteredRoles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return roles.filter(r => {
      if (selectedRoleFilter !== 'all' && r.role !== selectedRoleFilter) return false;
      if (effectFilter !== 'all' && r.effect.toLowerCase() !== effectFilter.toLowerCase()) return false;
      if (q) {
        return (
          r.role.toLowerCase().includes(q) ||
          r.action.toLowerCase().includes(q) ||
          r.resource.toLowerCase().includes(q) ||
          (r.conditions && r.conditions.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [roles, selectedRoleFilter, effectFilter, searchQuery]);

  // Group filtered records by role name
  const groupedByRole = useMemo(() => {
    const map = new Map<string, AccessRecord[]>();
    filteredRoles.forEach(record => {
      const existing = map.get(record.role) || [];
      existing.push(record);
      map.set(record.role, existing);
    });
    return map;
  }, [filteredRoles]);

  const getEffectIndicator = (effect: PermissionEffect) => {
    switch (effect) {
      case 'Allow':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-[#059669] border border-emerald-200">
            <Unlock className="w-3 h-3 text-[#059669]" />
            <span>Allow</span>
          </span>
        );
      case 'Deny':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-[#DC2626] border border-red-200">
            <Lock className="w-3 h-3 text-[#DC2626]" />
            <span>Deny (Strict)</span>
          </span>
        );
      case 'Require':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-[#D97706] border border-amber-200">
            <ShieldAlert className="w-3 h-3 text-[#D97706]" />
            <span>Requires Auth</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-[#64748B] border border-slate-200">
            Not Established
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Overview & Security Notice */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold text-[#0F172A] tracking-tight">
              Roles & Permissions
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Structured authorization policies, role boundaries, and action capabilities extracted from the specification.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-[#059669] border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>{uniqueRoles.length} Roles · {roles.length} Rules</span>
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <label className="text-[#64748B] font-medium">Actor:</label>
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2558E8] cursor-pointer"
              >
                <option value="all">All Roles ({uniqueRoles.length})</option>
                {uniqueRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-[#E2E8F0]">
              <button
                onClick={() => setEffectFilter('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  effectFilter === 'all' ? 'bg-white text-[#0F172A] shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setEffectFilter('allow')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  effectFilter === 'allow' ? 'bg-white text-[#059669] shadow-xs' : 'text-[#64748B] hover:text-[#059669]'
                }`}
              >
                Allow
              </button>
              <button
                onClick={() => setEffectFilter('deny')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  effectFilter === 'deny' ? 'bg-white text-[#DC2626] shadow-xs' : 'text-[#64748B] hover:text-[#DC2626]'
                }`}
              >
                Deny
              </button>
              <button
                onClick={() => setEffectFilter('require')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  effectFilter === 'require' ? 'bg-white text-[#D97706] shadow-xs' : 'text-[#64748B] hover:text-[#D97706]'
                }`}
              >
                Require
              </button>
            </div>
          </div>

          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Search actions or resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg px-3 py-1.5 text-[#0F172A] placeholder-slate-400 focus:outline-none"
            />
          </div>

        </div>

      </div>

      {/* Role-Oriented Cards Layout */}
      {groupedByRole.size > 0 ? (
        <div className="space-y-5">
          {Array.from(groupedByRole.entries()).map(([roleName, records]) => (
            <div 
              key={roleName}
              className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden"
            >
              {/* Role Header */}
              <div className="p-4 sm:px-6 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-[#0F172A] flex items-center justify-center font-bold text-xs">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight">{roleName}</h3>
                    <p className="text-[11px] text-[#64748B]">{records.length} defined capabilities</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-slate-200 text-[#64748B]">
                  Role Group
                </span>
              </div>

              {/* Permissions List */}
              <div className="divide-y divide-[#E2E8F0]">
                {records.map((record) => (
                  <div 
                    key={record.id}
                    className="p-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Left: Action, Resource & Conditions */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getEffectIndicator(record.effect)}
                        <span className="text-xs font-semibold text-[#0F172A]">{record.action}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-medium text-[#64748B]">Target: {record.resource}</span>
                      </div>

                      {record.conditions && (
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          Scope constraint: <span className="font-mono text-[#0F172A]">{record.conditions}</span> ({record.recordScope} Scope)
                        </p>
                      )}

                      {/* Source Citation */}
                      {record.provenance && (
                        <div className="pt-1 flex items-center gap-2 text-[11px] text-[#64748B]">
                          <button
                            onClick={() => onOpenSourcePage(record.provenance.page)}
                            className="text-[#2558E8] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                          >
                            <span>Page {record.provenance.page}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          <span>·</span>
                          <span className="italic truncate max-w-md">"{record.provenance.passage}"</span>
                        </div>
                      )}
                    </div>

                    {/* Right: Review Status Toggles */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                      <button
                        onClick={() => onUpdateRoleState(record.id, record.reviewState === 'Approved' ? 'Unresolved' : 'Approved')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                          record.reviewState === 'Approved'
                            ? 'bg-emerald-50 text-[#059669] border-emerald-200'
                            : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-100'
                        }`}
                        title="Mark permission as approved"
                      >
                        <Check className="w-3 h-3" />
                        <span>{record.reviewState === 'Approved' ? 'Approved' : 'Approve'}</span>
                      </button>

                      <button
                        onClick={() => onUpdateRoleState(record.id, record.reviewState === 'Rejected' ? 'Unresolved' : 'Rejected')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                          record.reviewState === 'Rejected'
                            ? 'bg-red-50 text-[#DC2626] border-red-200'
                            : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-100'
                        }`}
                        title="Mark permission as rejected"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-xl border border-[#E2E8F0] text-xs text-[#64748B]">
          No roles or permissions match your current filter query.
        </div>
      )}

    </div>
  );
};
