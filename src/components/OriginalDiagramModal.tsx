import React from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalDiagramModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Source Engineering Architecture Diagram</h3>
            <p className="text-xs text-slate-500">School Administrator Role vs Teacher Role with Cutoff Locked Escalation</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
            <img
              src="/public/assets/aistudio/Screenshot_2026-10-29_134800_fc761e24.png"
              alt="Source Engineering Architecture Diagram"
              className="w-full h-auto object-contain max-h-[480px]"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-3 rounded-lg bg-teal-50 border border-teal-100">
              <span className="font-semibold text-teal-900 block mb-1">Left Swimlane: School Administrator Role</span>
              <ul className="space-y-1 list-disc list-inside text-teal-800">
                <li>Full System Access with JWT RBAC</li>
                <li>System Dashboard with KPIs & Anomaly Alerts</li>
                <li>Manage User Accounts (CRUD for Staff & Students)</li>
                <li>Configure Master Entities (Classes, Sections, Subjects)</li>
                <li>Global Attendance Records & Override Adjudication</li>
                <li>Exportable Compliance Reports & Audits</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <span className="font-semibold text-blue-900 block mb-1">Right Swimlane: Teacher Role</span>
              <ul className="space-y-1 list-disc list-inside text-blue-800">
                <li>Scoped Access restricted strictly to assigned classes</li>
                <li>Dashboard Quick Actions & Timetable Schedule</li>
                <li>Branch 1: Submit Daily Personal Check-in</li>
                <li>Branch 2: Access Roster & Bulk Student Marking</li>
                <li>Cutoff Locked triggers Restricted Admin Override Request</li>
                <li>Cross-swimlane loop escalates ticket to Admin queue</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
