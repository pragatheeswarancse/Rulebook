import React, { useState } from 'react';
import { 
  CheckSquare, 
  User, 
  CheckCircle2, 
  Clock, 
  Layers
} from 'lucide-react';
import { TaskItem } from '../../types/rulebook';

interface Props {
  tasks: TaskItem[];
  onUpdateTaskStatus: (id: string, newStatus: 'Approved' | 'Excluded' | 'Blocked') => void;
}

export const TasksAcceptanceSection: React.FC<Props> = ({
  tasks,
  onUpdateTaskStatus
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');

  const filteredTasks = tasks.filter(t => {
    if (selectedDiscipline === 'all') return true;
    return t.discipline.toLowerCase() === selectedDiscipline.toLowerCase();
  });

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Task Breakdown & Acceptance Checks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {tasks.length} actionable engineering tasks with acceptance criteria.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="text-slate-500 font-medium">Filter Discipline:</span>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Disciplines ({tasks.length})</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="integration">Integration</option>
              <option value="testing">Testing</option>
              <option value="data">Data</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task, idx) => (
          <div 
            key={`${task.id}-${idx}`}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3 hover:border-slate-300 transition-colors"
          >
            {/* Header: ID, Discipline, Role, Effort */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-slate-500">
                  {task.id}
                </span>
                <span>·</span>
                <span className="font-medium text-slate-800">
                  {task.discipline}
                </span>
                <span>·</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{task.assignedRole}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-500">Effort (O/E/P):</span>
                <span className="font-semibold text-slate-800">
                  {task.optimisticDays}d / {task.expectedDays}d / {task.pessimisticDays}d
                </span>
              </div>
            </div>

            {/* Task Statement */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                {task.outcome}
              </h3>
            </div>

            {/* Observable Acceptance Checks */}
            {task.acceptanceChecks && task.acceptanceChecks.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Observable Acceptance Criteria:</span>
                </div>
                <ul className="space-y-1 pl-4 list-disc text-slate-600 leading-relaxed">
                  {task.acceptanceChecks.map((chk, i) => (
                    <li key={i}>{chk}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prerequisites & Actions */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                {task.prerequisites && task.prerequisites.length > 0 ? (
                  <span>Prerequisites: <strong className="font-mono text-slate-700">{task.prerequisites.join(', ')}</strong></span>
                ) : (
                  <span>No blocking prerequisites</span>
                )}
              </div>

              <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                <button
                  onClick={() => onUpdateTaskStatus(task.id, 'Approved')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    task.status === 'Approved'
                      ? 'bg-emerald-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => onUpdateTaskStatus(task.id, 'Excluded')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    task.status === 'Excluded'
                      ? 'bg-slate-700 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Exclude
                </button>
                <button
                  onClick={() => onUpdateTaskStatus(task.id, 'Blocked')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    task.status === 'Blocked'
                      ? 'bg-rose-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Blocked
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
