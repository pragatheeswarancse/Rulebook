import React, { useState } from 'react';
import { 
  Play, 
  UserCheck, 
  Lock, 
  Unlock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Database
} from 'lucide-react';
import { UIPlaygroundData, UIPlaygroundScreen } from '../../types/rulebook';

interface Props {
  playgroundData: UIPlaygroundData;
}

export const UIPlaygroundSection: React.FC<Props> = ({ playgroundData }) => {
  const [selectedRole, setSelectedRole] = useState<string>(playgroundData.roles[0] || 'Standard User');
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const screen: UIPlaygroundScreen = playgroundData.screens[activeScreenIndex] || playgroundData.screens[0];
  const roleAccess = screen?.roleAccess[selectedRole] || { allowed: true, recordScope: 'Global' as const };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleActionClick = (actionId: string) => {
    const action = screen.actions.find(a => a.id === actionId);
    if (!action) return;

    if (!action.requiredRole.includes(selectedRole)) {
      setFeedbackMessage({
        text: action.forbiddenMessage || `Forbidden: Role '${selectedRole}' does not hold permission for this operation.`,
        type: 'error'
      });
      return;
    }

    setFeedbackMessage({
      text: `Action '${action.label}' executed successfully under active role '${selectedRole}'. Specification constraint verified.`,
      type: 'success'
    });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Filter records based on role scope
  const records = screen.mockRecords || [];
  const visibleRecords = records.filter(row => {
    if (selectedRole.includes('EMEA') && row.territory) {
      return row.territory === 'EMEA';
    }
    if (selectedRole.includes('Americas') && row.territory) {
      return row.territory === 'Americas';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Section Header & Active Role Switcher */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Interactive UI Sandbox
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate role-based access guards, fields, and record isolation.
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-xs shrink-0">
            <span className="text-slate-600 font-medium pl-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Simulate Role:</span>
            </span>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setFeedbackMessage(null);
              }}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-800 font-medium focus:outline-none cursor-pointer"
            >
              {playgroundData.roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Role Scope Context Notice */}
        <div className="p-3.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Simulating as <strong className="text-slate-900 font-semibold">{selectedRole}</strong> · Effective Scope: <span className="font-mono text-indigo-800 font-semibold">{roleAccess.recordScope}</span>
            </span>
          </div>

          <div className="text-[11px] font-mono text-indigo-700">
            Boundary guard active
          </div>
        </div>
      </div>

      {/* Interactive Simulator Window */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        
        {/* Window Chrome Header Bar */}
        <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="text-xs font-semibold text-slate-800 ml-2 font-mono">
              {screen.title}
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Interactive Test Bench
          </div>
        </div>

        {/* Feedback Alert Strip */}
        {feedbackMessage && (
          <div className={`p-3.5 text-xs flex items-center justify-between border-b ${
            feedbackMessage.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}>
            <div className="flex items-center gap-2 font-medium">
              {feedbackMessage.type === 'error' ? (
                <Lock className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-slate-500 hover:text-slate-900 cursor-pointer font-medium text-xs px-2 py-0.5 rounded"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Simulator Canvas Content */}
        <div className="p-6 space-y-6">
          
          {/* Documented Input Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Documented Form Controls
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Schema verification
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {screen.fields.map((field) => {
                const isReadOnly = field.readOnlyForRoles?.includes(selectedRole);
                const val = formValues[field.id] !== undefined ? formValues[field.id] : field.defaultValue;

                return (
                  <div key={field.id} className="space-y-1.5 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/70">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-medium text-slate-800">{field.label}</label>
                      {isReadOnly && (
                        <span className="text-[10px] font-mono text-rose-700 font-semibold">
                          Read-Only
                        </span>
                      )}
                    </div>

                    {field.type === 'select' ? (
                      <select
                        disabled={isReadOnly}
                        value={val}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full text-xs font-medium bg-white disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        disabled={isReadOnly}
                        value={val}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full text-xs font-medium bg-white disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed"
                      />
                    )}

                    <span className="text-[10px] text-slate-400 block font-mono truncate" title={field.sourceRequirement}>
                      Source: {field.sourceRequirement}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Documented Records Grid */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] block">
                  Documented Recordset Preview · Scoped to ({roleAccess.recordScope})
                </span>
                <span className="text-slate-500 text-xs">
                  {visibleRecords.length} records available under active authorization boundary
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span>Boundary Procedure Verified</span>
              </div>
            </div>

            <div className="border border-slate-200/90 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                  <tr>
                    {Object.keys(records[0] || {}).map(col => (
                      <th key={col} className="py-2.5 px-3.5 font-semibold">{col}</th>
                    ))}
                    <th className="py-2.5 px-3.5 text-right font-semibold">Scope Visibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleRecords.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      {Object.values(row).map((val: any, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-3.5 font-mono text-slate-700">
                          {String(val)}
                        </td>
                      ))}
                      <td className="py-2.5 px-3.5 text-right">
                        <span className="text-[11px] font-semibold text-emerald-700">
                          In Scope
                        </span>
                      </td>
                    </tr>
                  ))}
                  {visibleRecords.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-6 text-center text-slate-400 font-mono text-xs">
                        No records visible in this role's scoped boundary.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Test RBAC authorization guards and failure messages:
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {screen.actions.map((act) => {
                const isAllowed = act.requiredRole.includes(selectedRole);

                return (
                  <button
                    key={act.id}
                    onClick={() => handleActionClick(act.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isAllowed
                        ? act.variant === 'primary'
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : act.variant === 'danger'
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-75'
                    }`}
                    title={isAllowed ? `Execute ${act.label}` : act.forbiddenMessage}
                  >
                    {!isAllowed && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
