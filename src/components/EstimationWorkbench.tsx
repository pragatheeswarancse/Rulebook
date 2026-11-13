import React, { useState } from 'react';
import { ESTIMATION_TASKS, ESTIMATION_ROLES } from '../data/estimationData';
import { 
  Calculator, 
  Calendar, 
  Clock, 
  DollarSign, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  BarChart2, 
  RotateCcw,
  CheckCircle,
  Users
} from 'lucide-react';

export const EstimationWorkbench: React.FC = () => {
  // Configurable Parameters
  const [hourlyRate, setHourlyRate] = useState<number>(95);
  const [velocityPerSprint, setVelocityPerSprint] = useState<number>(32);
  const [contingencyPct, setContingencyPct] = useState<number>(15);
  const [teamSize, setTeamSize] = useState<number>(4);
  const [selectedSprintFilter, setSelectedSprintFilter] = useState<number | 'all'>('all');

  // PERT Calculations
  // E = (a + 4m + b) / 6
  // Hours = Days * 8 hours
  const totalStoryPoints = ESTIMATION_TASKS.reduce((acc, t) => acc + t.storyPoints, 0);
  
  const totalPertDays = ESTIMATION_TASKS.reduce((acc, t) => {
    const pertDays = (t.optimisticDays + 4 * t.mostLikelyDays + t.pessimisticDays) / 6;
    return acc + pertDays;
  }, 0);

  const totalDevHours = Math.round(totalPertDays * 8);
  const totalBaseCost = Math.round(totalDevHours * hourlyRate);
  const contingencyCost = Math.round(totalBaseCost * (contingencyPct / 100));
  const totalBudget = totalBaseCost + contingencyCost;

  // Timeline calculation: Sprints = Total Story Points / Velocity
  const calculatedSprints = Math.ceil(totalStoryPoints / velocityPerSprint);
  const totalCalendarWeeks = calculatedSprints * 2; // 2-week sprints

  const filteredTasks = selectedSprintFilter === 'all'
    ? ESTIMATION_TASKS
    : ESTIMATION_TASKS.filter((t) => t.sprint === selectedSprintFilter);

  const resetDefaults = () => {
    setHourlyRate(95);
    setVelocityPerSprint(32);
    setContingencyPct(15);
    setTeamSize(4);
    setSelectedSprintFilter('all');
  };

  return (
    <div className="space-y-8">
      {/* Workbench Header & Interactive Sliders Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                PERT 3-POINT ESTIMATION MODEL
              </span>
              <span className="text-xs text-slate-500 font-mono">Agile Scrum 2-Week Cadence</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Software Engineering Estimation Workbench</h1>
            <p className="text-xs text-slate-600 mt-1">
              Interactive cost, timeline, and resource allocation calculator based on functional specifications and WBS deliverables.
            </p>
          </div>

          <button
            onClick={resetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Parameters
          </button>
        </div>

        {/* Real-Time Parameter Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Slider 1: Hourly Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Blended Hourly Rate:</span>
              <span className="font-mono font-bold text-teal-700">${hourlyRate}/hr</span>
            </div>
            <input
              type="range"
              min="65"
              max="160"
              step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$65/hr</span>
              <span>$160/hr</span>
            </div>
          </div>

          {/* Slider 2: Sprint Velocity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Team Sprint Velocity:</span>
              <span className="font-mono font-bold text-blue-700">{velocityPerSprint} SP/Sprint</span>
            </div>
            <input
              type="range"
              min="18"
              max="45"
              step="1"
              value={velocityPerSprint}
              onChange={(e) => setVelocityPerSprint(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>18 SP</span>
              <span>45 SP</span>
            </div>
          </div>

          {/* Slider 3: Contingency Buffer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Contingency Risk Buffer:</span>
              <span className="font-mono font-bold text-amber-700">+{contingencyPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={contingencyPct}
              onChange={(e) => setContingencyPct(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Lean)</span>
              <span>30% (High Risk)</span>
            </div>
          </div>

          {/* Slider 4: Team FTEs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Engineering Team Size:</span>
              <span className="font-mono font-bold text-purple-700">{teamSize} Dedicated FTEs</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>2 Engineers</span>
              <span>8 Engineers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Effort</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalDevHours.toLocaleString()} <span className="text-sm font-normal text-slate-500">hours</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {totalStoryPoints} Total Story Points ({Math.round(totalPertDays)} dev days)
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Delivery Timeline</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalCalendarWeeks} <span className="text-sm font-normal text-slate-500">calendar weeks</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {calculatedSprints} Sprints @ {velocityPerSprint} SP velocity
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Base Engineering Cost</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            ${totalBaseCost.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Labor @ ${hourlyRate}/hr blended rate
          </p>
        </div>

        <div className="bg-white rounded-xl border border-emerald-300 bg-emerald-50/30 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Budget (+Buffer)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">
            ${totalBudget.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 font-mono">
            Includes ${contingencyCost.toLocaleString()} ({contingencyPct}%) risk reserve
          </p>
        </div>
      </div>

      {/* Resource Allocation & Role Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-600" />
          Cross-Functional Resource Allocation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ESTIMATION_ROLES.map((r, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block truncate" title={r.role}>{r.role}</span>
              <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                <span>Allocation:</span>
                <span className="font-semibold text-slate-900">{r.allocationPct}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                <span>Rate:</span>
                <span>${r.standardRate}/hr</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Breakdown Structure (WBS) Table with PERT 3-Point Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Work Breakdown Structure (WBS) & PERT Estimates
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Duration calculated as $E = (a + 4m + b) / 6$, where $a$ = optimistic, $m$ = most likely, $b$ = pessimistic
            </p>
          </div>

          {/* Sprint Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedSprintFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedSprintFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Sprints
            </button>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSprintFilter(s)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedSprintFilter === s ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sprint {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">WBS</th>
                <th className="py-2.5 px-3">Sprint</th>
                <th className="py-2.5 px-4 w-1/4">Feature / Deliverable</th>
                <th className="py-2.5 px-3">Discipline</th>
                <th className="py-2.5 px-2 text-right">Opt (a)</th>
                <th className="py-2.5 px-2 text-right">Likely (m)</th>
                <th className="py-2.5 px-2 text-right">Pess (b)</th>
                <th className="py-2.5 px-3 text-right font-bold text-teal-800">Expected (E)</th>
                <th className="py-2.5 px-3 text-right">Points</th>
                <th className="py-2.5 px-3">Assigned Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredTasks.map((task, idx) => {
                const pertDays = ((task.optimisticDays + 4 * task.mostLikelyDays + task.pessimisticDays) / 6).toFixed(1);
                return (
                  <tr key={`${task.id}-${idx}`} className="hover:bg-slate-50/70 text-slate-700">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{task.wbsCode}</td>
                    <td className="py-2.5 px-3">S{task.sprint}</td>
                    <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                      <div>{task.title}</div>
                      <div className="text-[11px] text-slate-500 font-sans mt-0.5">{task.deliverables}</div>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        task.category === 'Frontend' ? 'bg-blue-100 text-blue-800' :
                        task.category === 'Backend' ? 'bg-emerald-100 text-emerald-800' :
                        task.category === 'Security & RBAC' ? 'bg-amber-100 text-amber-800' :
                        task.category === 'Database' ? 'bg-purple-100 text-purple-800' :
                        task.category === 'QA & Testing' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {task.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-500 tabular-nums">{task.optimisticDays}d</td>
                    <td className="py-2.5 px-2 text-right text-slate-700 tabular-nums">{task.mostLikelyDays}d</td>
                    <td className="py-2.5 px-2 text-right text-slate-500 tabular-nums">{task.pessimisticDays}d</td>
                    <td className="py-2.5 px-3 text-right font-bold text-teal-700 tabular-nums">{pertDays}d</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">{task.storyPoints} SP</td>
                    <td className="py-2.5 px-3 font-sans text-slate-600 text-[11px]">{task.assignedRole}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
