import React, { useState } from 'react';
import { USER_JOURNEYS } from '../data/userJourneyData';
import { UserJourneyPersona } from '../types';
import { 
  Smile, 
  Meh, 
  Frown, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  TrendingUp, 
  Play, 
  RotateCcw, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  FileCheck2,
  Lock,
  Send,
  UserCheck
} from 'lucide-react';

import { AnalyzedEngineeringDocument } from '../types/documentAnalysis';

interface Props {
  document?: AnalyzedEngineeringDocument;
}

export const UserJourneyView: React.FC<Props> = ({ document }) => {
  const isSalesForecast = document?.id === 'doc-sales-forecast-pdf' || document?.userJourneySteps?.length;

  const documentPersona: UserJourneyPersona | null = isSalesForecast && document?.userJourneySteps ? {
    id: 'analyst-sales-forecast',
    name: 'Alex Mercer',
    roleTitle: 'Senior Finance & Operations Analyst (Sales Forecast)',
    department: 'Commercial Projections & Estimating',
    avatarSeed: 'Alex',
    primaryGoals: [
      'Filter 12-month projections across multiple warehouse facilities without UI lag',
      'Hydrate 14 complex stored procedure recordsets accurately in hierarchical tree',
      'Export formatted Excel spreadsheets with outline groupings for executive review',
      'Directly drill into sibling Project Maintenance & Bid tools via single click'
    ],
    keyFrustrations: [
      'Legacy VB6 application crashing on large multi-warehouse dataset fetches',
      'Losing scroll position when expanding parent and child tree nodes',
      'Having to manually re-type project numbers into sibling maintenance EXEs'
    ],
    steps: document.userJourneySteps
  } : null;

  const allPersonas = documentPersona ? [documentPersona, ...USER_JOURNEYS] : USER_JOURNEYS;
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(documentPersona ? documentPersona.id : 'teacher-eleanor');
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  // Simulation State
  const [simStep, setSimStep] = useState<number>(1);
  const [simCheckInDone, setSimCheckInDone] = useState<boolean>(false);
  const [simAttendanceSubmitted, setSimAttendanceSubmitted] = useState<boolean>(false);
  const [simCutoffLocked, setSimCutoffLocked] = useState<boolean>(false);
  const [simOverrideSubmitted, setSimOverrideSubmitted] = useState<boolean>(false);
  const [simAdminApproved, setSimAdminApproved] = useState<boolean>(false);
  const [simMarcusStatus, setSimMarcusStatus] = useState<'PRESENT' | 'ABSENT' | 'LATE'>('ABSENT');
  const [overrideReason, setOverrideReason] = useState<string>('Student arrived at 09:35 AM with valid dental clinic doctor slip.');
  const [adminNote, setAdminNote] = useState<string>('Reviewed and approved against front office appointment log.');

  const currentPersona = allPersonas.find((p) => p.id === selectedPersonaId) || allPersonas[0];

  const getEmotionalBadge = (state: string) => {
    switch (state) {
      case 'confident':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><Smile className="w-3.5 h-3.5" /> Confident</span>;
      case 'neutral':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"><Meh className="w-3.5 h-3.5" /> Focused / Neutral</span>;
      case 'stressed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800"><Frown className="w-3.5 h-3.5" /> Friction / Stressed</span>;
      case 'relieved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800"><Smile className="w-3.5 h-3.5" /> Relieved</span>;
      case 'satisfied':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800"><CheckCircle2 className="w-3.5 h-3.5" /> High Satisfaction</span>;
      default:
        return null;
    }
  };

  const resetSimulator = () => {
    setSimStep(1);
    setSimCheckInDone(false);
    setSimAttendanceSubmitted(false);
    setSimCutoffLocked(false);
    setSimOverrideSubmitted(false);
    setSimAdminApproved(false);
    setSimMarcusStatus('ABSENT');
  };

  return (
    <div className="space-y-8">
      {/* Top Selector & Mode Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        {/* Persona Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Select Persona:</span>
          {allPersonas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => {
                setSelectedPersonaId(persona.id);
                setShowSimulator(false);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedPersonaId === persona.id && !showSimulator
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {persona.name} ({persona.roleTitle.split('(')[0].trim()})
            </button>
          ))}
        </div>

        {/* Live Simulator Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-2xs ${
              showSimulator
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {showSimulator ? 'Close Live Simulator' : 'Launch Interactive Flow Simulator'}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE LIVE SIMULATOR WIDGET                         */}
      {/* ========================================================= */}
      {showSimulator && (
        <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">Live End-to-End Test Sandbox</span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Simulating: Teacher Roll-Call ➔ 09:30 AM Cutoff Lock ➔ Admin Override Approval
              </h3>
            </div>
            <button
              onClick={resetSimulator}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Simulation
            </button>
          </div>

          {/* Stepper Header */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className={`p-2.5 rounded-lg border ${simStep === 1 ? 'bg-blue-950 border-blue-500 text-blue-200' : simStep > 1 ? 'bg-slate-800/80 border-slate-700 text-emerald-400' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
              <span className="font-mono text-[10px] block">STEP 1</span>
              <span className="font-semibold">Staff Check-in</span>
            </div>
            <div className={`p-2.5 rounded-lg border ${simStep === 2 ? 'bg-blue-950 border-blue-500 text-blue-200' : simStep > 2 ? 'bg-slate-800/80 border-slate-700 text-emerald-400' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
              <span className="font-mono text-[10px] block">STEP 2</span>
              <span className="font-semibold">Morning Roll-Call</span>
            </div>
            <div className={`p-2.5 rounded-lg border ${simStep === 3 ? 'bg-amber-950 border-amber-500 text-amber-200' : simStep > 3 ? 'bg-slate-800/80 border-slate-700 text-emerald-400' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
              <span className="font-mono text-[10px] block">STEP 3</span>
              <span className="font-semibold">Cutoff Lock Escalation</span>
            </div>
            <div className={`p-2.5 rounded-lg border ${simStep === 4 ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : simStep > 4 ? 'bg-slate-800/80 border-slate-700 text-emerald-400' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
              <span className="font-mono text-[10px] block">STEP 4</span>
              <span className="font-semibold">Admin Adjudication</span>
            </div>
          </div>

          {/* Simulation Step Views */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 min-h-[260px] flex flex-col justify-center">
            
            {/* Step 1: Staff Check-in */}
            {simStep === 1 && (
              <div className="space-y-4 max-w-lg mx-auto text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">08:14 AM — Faculty Campus Arrival</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Eleanor arrives at Oakridge High gate. Geolocation service detects GPS within 120m of main building.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSimCheckInDone(true);
                      setSimStep(2);
                    }}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-md inline-flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Daily Personal Check-in (GPS Verified)
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Classroom Roll-Call */}
            {simStep === 2 && (
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-xs font-mono text-blue-400">Section 10-B (Biology Homeroom)</span>
                    <h4 className="text-sm font-bold text-white">09:04 AM — Fast Morning Roll-Call</h4>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Target Cutoff: 09:30:00 AM
                  </div>
                </div>

                {/* Simulated Student List */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-medium text-slate-200">#01 Aria Chen</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400">PRESENT</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-medium text-slate-200">#02 Marcus Bradley (Missing at 09:04 AM)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-400">ABSENT</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-medium text-slate-200">#03 Jordan Rivera</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400">PRESENT</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">31 Present, 1 Absent</span>
                  <button
                    onClick={() => {
                      setSimAttendanceSubmitted(true);
                      setSimCutoffLocked(true);
                      setSimStep(3);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors shadow-md inline-flex items-center gap-2"
                  >
                    Submit Register (Advances clock past 09:30 AM Cutoff)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Cutoff Locked & Override Petition */}
            {simStep === 3 && (
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Current Time: 09:36 AM — Session Hard Locked!</span>
                    <span>Student Marcus Bradley just entered classroom with a clinic slip. Direct editing is prohibited. You must petition for an Admin Override.</span>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Student:</label>
                    <input 
                      type="text" 
                      disabled 
                      value="Marcus Bradley (Grade 10-B) — Current: ABSENT" 
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Requested Amendment:</label>
                    <input 
                      type="text" 
                      disabled 
                      value="PRESENT (Excused Late - Dentist Appointment)" 
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-emerald-400 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Teacher Justification (Mandatory &gt;20 chars):</label>
                    <textarea
                      rows={2}
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setSimOverrideSubmitted(true);
                      setSimStep(4);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-500 transition-colors shadow-md inline-flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Dispatch Restricted Override Request to Admin Queue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Admin Review & Adjudication */}
            {simStep === 4 && (
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span className="text-xs font-mono text-teal-400 uppercase">Role Switched to: Dr. Marcus Sterling (Principal)</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Queue: PENDING (1 ticket)</span>
                </div>

                {!simAdminApproved ? (
                  <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-teal-500/30 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold text-white">Ticket #ovr_tk_99104</span>
                      <span className="font-mono text-[10px] text-amber-400">Submitted by Eleanor Vance at 09:37 AM</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Reason:</span>
                      "{overrideReason}"
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Principal Resolution Note (Mandatory):
                      </label>
                      <input
                        type="text"
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => {
                          setSimAdminApproved(true);
                          setSimMarcusStatus('PRESENT');
                        }}
                        className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-500 transition-colors shadow-md inline-flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Approve & Atomically Amend Official Register
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Escalation Resolved & Cryptographic Audit Recorded!</h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Student Marcus Bradley status officially updated to <strong className="text-emerald-400">PRESENT (Late Excused)</strong>. Parent truancy SMS aborted. Immutable SHA-256 hash generated in <code className="text-slate-400">audit_logs</code>.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={resetSimulator}
                        className="px-4 py-1.5 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                      >
                        Run Simulation Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PERSONA HEADER PROFILE & OBJECTIVES                      */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
              {currentPersona.name.split(' ')[1]?.[0] || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{currentPersona.name}</h2>
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {currentPersona.department}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-0.5">{currentPersona.roleTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>6 Key User Touchpoints</span>
            <span aria-hidden="true">·</span>
            <span>Zero Unresolved Frictions</span>
          </div>
        </div>

        {/* Goals & Frustrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Primary User Goals
            </h4>
            <ul className="space-y-1.5 text-slate-700">
              {currentPersona.primaryGoals.map((g, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">›</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100">
            <h4 className="font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Key Frustrations Eliminated
            </h4>
            <ul className="space-y-1.5 text-rose-800">
              {currentPersona.keyFrustrations.map((f, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">›</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CHRONOLOGICAL USER JOURNEY TIMELINE                       */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Chronological Step-by-Step Experience Journey</h3>

        <div className="space-y-4">
          {currentPersona.steps.map((step) => (
            <div 
              key={step.stepIndex}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-colors"
            >
              {/* Step Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {step.stepIndex}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">{step.phase}</span>
                    <h4 className="text-sm font-bold text-slate-900">{step.userGoal}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getEmotionalBadge(step.emotionalState)}
                </div>
              </div>

              {/* Step Action & System Response Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 text-xs">
                {/* User Action */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="font-bold text-slate-600 uppercase tracking-wider block mb-1">User Action:</span>
                  <p className="text-slate-800 leading-relaxed">{step.userAction}</p>
                </div>

                {/* System Response */}
                <div className="p-3 rounded-lg bg-teal-50/50 border border-teal-100">
                  <span className="font-bold text-teal-800 uppercase tracking-wider block mb-1">System Behavior:</span>
                  <p className="text-teal-950 leading-relaxed">{step.systemResponse}</p>
                </div>
              </div>

              {/* Wireframe Mock & Technical Context Strip */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-100/70 border border-slate-200">
                  <span className="font-semibold text-slate-500 uppercase block mb-0.5">UI Screen Mockup:</span>
                  <span className="text-slate-800 italic">{step.uiScreenMock}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60">
                  <span className="font-semibold text-amber-800 uppercase block mb-0.5">Potential Friction Risk:</span>
                  <span className="text-amber-950">{step.frictionRisk}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono">
                  <span className="font-sans font-semibold text-slate-400 uppercase block mb-0.5 text-[10px]">Technical Endpoint / Touchpoint:</span>
                  <span className="text-emerald-400 text-[10px] break-all">{step.technicalTouchpoint}</span>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-mono">
                <span>Target SLA / KPI: {step.kpiMetric}</span>
                <span className="text-teal-700 font-semibold font-sans">Verified Requirement</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
