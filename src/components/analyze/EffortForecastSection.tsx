import React, { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  Users, 
  Sliders, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DeliveryForecast } from '../../types/rulebook';

interface Props {
  forecast: DeliveryForecast;
  onUpdateCapacity: (engineers: number, hoursPerDay: number, bufferPercent: number) => void;
}

export const EffortForecastSection: React.FC<Props> = ({
  forecast,
  onUpdateCapacity
}) => {
  const [engineers, setEngineers] = useState(forecast.engineersCount);
  const [hoursPerDay, setHoursPerDay] = useState(forecast.hoursPerDay);
  const [bufferPercent, setBufferPercent] = useState(forecast.bufferPercent);

  // Recalculate dynamic weeks
  const productiveHoursPerWeek = engineers * hoursPerDay * 5;
  const bufferedHours = forecast.knownScopeHours * (1 + bufferPercent / 100);
  const calculatedExpectedWeeks = (bufferedHours / Math.max(1, productiveHoursPerWeek)).toFixed(1);
  const calculatedOptimisticWeeks = (forecast.knownScopeHours / Math.max(1, productiveHoursPerWeek)).toFixed(1);
  const calculatedPessimisticWeeks = ((forecast.knownScopeHours * 1.35 * (1 + bufferPercent / 100)) / Math.max(1, productiveHoursPerWeek)).toFixed(1);

  const handleApplyCapacity = () => {
    onUpdateCapacity(engineers, hoursPerDay, bufferPercent);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Confidence Distribution */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Delivery Forecast (PERT)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Three-point estimate range based on {forecast.knownScopeHours} estimated hours.
            </p>
          </div>
        </div>

        {/* Confidence Meter Bar */}
        <div className="space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-800">Scope Knowledge vs Assumptions</span>
            <span className="text-slate-500 font-mono text-[11px]">
              {forecast.knownPercent}% Known · {forecast.assumedPercent}% Assumed · {forecast.blockedPercent}% Blocked
            </span>
          </div>

          <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${forecast.knownPercent}%` }} 
              className="bg-emerald-500 h-full transition-all" 
              title={`Approved Scope: ${forecast.knownPercent}%`}
            />
            <div 
              style={{ width: `${forecast.assumedPercent}%` }} 
              className="bg-amber-400 h-full transition-all" 
              title={`Productivity Assumptions: ${forecast.assumedPercent}%`}
            />
            <div 
              style={{ width: `${forecast.blockedPercent}%` }} 
              className="bg-rose-500 h-full transition-all" 
              title={`Blocked: ${forecast.blockedPercent}%`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Approved Scope & Evidence ({forecast.knownPercent}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Assumed Velocity ({forecast.assumedPercent}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              <span>Blocked Questions ({forecast.blockedPercent}%)</span>
            </span>
          </div>
        </div>

        {/* 3-Point PERT Estimate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider block">
              Optimistic (Best Case)
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {calculatedOptimisticWeeks} <span className="text-xs font-normal text-slate-500">weeks</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Zero friction, zero scope discovery, 100% focused velocity.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-200/80 space-y-1">
            <span className="text-[11px] font-mono font-semibold text-indigo-700 uppercase tracking-wider block">
              Expected Target (PERT Weighted)
            </span>
            <div className="text-2xl font-bold font-mono text-indigo-900">
              {calculatedExpectedWeeks} <span className="text-xs font-normal text-indigo-600">weeks</span>
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed font-medium">
              Realistic delivery including configured {bufferPercent}% risk buffer.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider block">
              Pessimistic (Worst Case)
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {calculatedPessimisticWeeks} <span className="text-xs font-normal text-slate-500">weeks</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unresolved questions become blockers, extended review cycles.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Capacity Workbench */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
            Sprint Capacity & Team Velocity Workbench
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {/* Engineers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Dedicated Engineers</span>
              <span className="font-mono font-bold text-slate-900">{engineers} FTEs</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={engineers}
              onChange={(e) => setEngineers(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">Available engineering squad size</span>
          </div>

          {/* Daily productive hours */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Productive Hours / Day</span>
              <span className="font-mono font-bold text-slate-900">{hoursPerDay} hrs</span>
            </div>
            <input
              type="range"
              min="4"
              max="8"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">Excludes meetings and overhead</span>
          </div>

          {/* Risk Buffer % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Uncertainty Buffer</span>
              <span className="font-mono font-bold text-slate-900">{bufferPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={bufferPercent}
              onChange={(e) => setBufferPercent(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">Safeguards unestablished edge cases</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            Weekly Squad Velocity: {productiveHoursPerWeek} hrs / week
          </span>
          <button
            onClick={handleApplyCapacity}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors cursor-pointer"
          >
            Update Project Forecast
          </button>
        </div>
      </div>

      {/* Assumptions & Blockers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Documented Velocity Assumptions
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            {forecast.assumptions.map((ass, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{ass}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Delivery Risk Factors & Blockers
            </h4>
          </div>
          {forecast.blockers.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-600">
              {forecast.blockers.map((blk, i) => (
                <li key={i} className="flex items-start gap-2 text-rose-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{blk}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed">
              No critical blockers currently unaddressed. All dependencies scheduled in task breakdown.
            </p>
          )}
        </div>
      </div>

    </div>
  );
};
