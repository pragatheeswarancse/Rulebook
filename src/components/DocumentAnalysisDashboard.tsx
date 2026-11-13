import React, { useState } from 'react';
import { AnalyzedEngineeringDocument } from '../types/documentAnalysis';
import { 
  FileText, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Database, 
  Eye, 
  Upload, 
  Code2, 
  TrendingUp, 
  Compass, 
  Sparkles,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';

interface Props {
  document: AnalyzedEngineeringDocument;
  onOpenPdfViewer: () => void;
  onOpenUploadModal: () => void;
  onNavigateToTab: (tab: 'flowmap' | 'journey' | 'fsd' | 'estimation') => void;
}

export const DocumentAnalysisDashboard: React.FC<Props> = ({
  document,
  onOpenPdfViewer,
  onOpenUploadModal,
  onNavigateToTab
}) => {
  const [featureCategory, setFeatureCategory] = useState<string>('All');
  const [featureSearch, setFeatureSearch] = useState<string>('');

  const filteredFeatures = document.features.filter((f) => {
    const matchesCat = featureCategory === 'All' || f.category === featureCategory;
    const matchesSearch =
      f.code.toLowerCase().includes(featureSearch.toLowerCase()) ||
      f.title.toLowerCase().includes(featureSearch.toLowerCase()) ||
      f.description.toLowerCase().includes(featureSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const isSalesForecastPdf = document.id === 'doc-sales-forecast-pdf';

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Document Switcher & Active Document Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                {document.documentType}
              </span>
              <span className="text-xs text-slate-500 font-mono">Scanned: {document.scanDate}</span>
              {isSalesForecastPdf && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-300">
                  User Attached PDF Loaded
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{document.title}</h1>
            <p className="text-xs text-slate-600 mt-1 font-mono">Module: {document.moduleName}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isSalesForecastPdf && (
              <button
                onClick={onOpenPdfViewer}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-rose-600" />
                <span>View Original PDF (8 Pages)</span>
              </button>
            )}

            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-teal-600" />
              <span>Switch / Upload Document</span>
            </button>
          </div>
        </div>

        {/* Narrative Executive Summary */}
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          {document.headlineSummary}
        </p>

        {/* Stack Transition Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Current Stack:</span>
            <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono text-[11px] border border-slate-200">
              {document.currentStack}
            </code>
          </div>
          <span className="text-slate-400">➔</span>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="font-semibold text-teal-700 uppercase tracking-wider text-[10px]">Target Architecture:</span>
            <code className="bg-teal-50 text-teal-900 px-2 py-0.5 rounded font-mono text-[11px] border border-teal-200 font-semibold">
              {document.targetModernizationStack}
            </code>
          </div>
        </div>
      </div>

      {/* Headline Engineering Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Necessary LOC */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Necessary Application LOC</span>
            <Code2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {document.headlineLoc.necessaryLoc.toLocaleString()} <span className="text-xs font-normal text-slate-500">lines</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {document.headlineLoc.uiLayoutLines} designer lines excluded
          </p>
        </div>

        {/* Metric 2: Estimated Hours */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Target Modernization ETA</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-700 tabular-nums">
            {document.recommendedHours} <span className="text-xs font-normal text-slate-500">hours</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Index: {document.hourIndex}x vs Project Calendar (860h)
          </p>
        </div>

        {/* Metric 3: Active Features */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Active Functional Features</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-700 tabular-nums">
            {document.features.length} <span className="text-xs font-normal text-slate-500">features</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {document.excludedItems.length} items flagged out of scope
          </p>
        </div>

        {/* Metric 4: Confidence Score */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Estimation Confidence</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {document.confidenceScore}% <span className="text-xs font-normal text-slate-500">score</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Calibrated against PAM benchmark
          </p>
        </div>
      </div>

      {/* Visual Navigation Shortcuts into the Core Engine Views */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider block">Visual Engineering Synthesis</span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Explore the Extracted Interactive Models for this Document
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Instant generation of interactive Flowmap, User Journey timeline, FSD contracts, and PERT Workbench.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateToTab('flowmap')}
              className="px-3.5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Flowmap</span>
            </button>
            <button
              onClick={() => onNavigateToTab('journey')}
              className="px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>User Journey</span>
            </button>
            <button
              onClick={() => onNavigateToTab('fsd')}
              className="px-3.5 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>FSD Specifications</span>
            </button>
            <button
              onClick={() => onNavigateToTab('estimation')}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Estimation Workbench</span>
            </button>
          </div>
        </div>
      </div>

      {/* Complexity Breakdown & Justification Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Architectural Complexity Assessment Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">5-point domain breakdown from document analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {document.complexityBreakdown.map((c, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{c.area}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  c.level === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                  c.level === 'Low-Medium' ? 'bg-teal-100 text-teal-800' :
                  c.level === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {c.level}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {c.justification}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark Ratios Table & Floor Cost Insight */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Scope Comparison vs Calibrated Project Benchmarks
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrated against Project Calendar (860h) and Scheduling Board (1,480h)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-4">Module</th>
                <th className="py-2.5 px-3">Runtime Today</th>
                <th className="py-2.5 px-3 text-right">App Logic LOC</th>
                <th className="py-2.5 px-3 text-right">LOC Ratio</th>
                <th className="py-2.5 px-3 text-right font-bold text-blue-800">Benchmark Hours</th>
                <th className="py-2.5 px-3 text-right font-bold">Hour Index</th>
                <th className="py-2.5 px-4">Primary UX Workflows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {document.benchmarks.map((b, idx) => (
                <tr key={idx} className={`hover:bg-slate-50/70 ${b.moduleName.includes('Sales Forecast') ? 'bg-teal-50/30' : ''}`}>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">
                    {b.moduleName}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-600">{b.runtimeToday}</td>
                  <td className="py-3 px-3 text-right tabular-nums text-slate-800">{b.appLogicLoc.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right tabular-nums text-teal-700 font-semibold">{b.locRatioVsCalendar}x</td>
                  <td className="py-3 px-3 text-right tabular-nums font-bold text-blue-700">{b.benchmarkHours}h</td>
                  <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">{b.hourIndexVsCalendar}x</td>
                  <td className="py-3 px-4 font-sans text-slate-600 text-[11px]">{b.userWorkflows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Software Engineering Principle: Hours Do Not Scale 1:1 With Lines of Code
          </span>
          <p className="text-[11px] text-amber-900 leading-relaxed">
            While Sales Forecast application logic is only 42% of Project Calendar (LOC index 0.42), the estimated modernization effort is 64% (0.64 hour index = 550h).
            This accounts for mandatory project floor costs: complex 14-recordset stored procedure contract bindings, Excel COM automation, multiple sibling Win32 EXE launches, and QA cross-browser permutations.
          </p>
        </div>
      </div>

      {/* Functional Coverage Checklist (F-01..F-26) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Functional Coverage Checklist ({document.features.length} Features)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Active features accounted for in engineering estimate</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search features..."
                value={featureSearch}
                onChange={(e) => setFeatureSearch(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden w-40"
              />
            </div>

            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-[11px]">
              {['All', 'Filter Surface', 'Tree UX', 'Reporting & Launchers'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFeatureCategory(cat)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    featureCategory === cat ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          {filteredFeatures.map((f) => (
            <div key={f.code} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
              <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold">
                ✓
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{f.code}: {f.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{f.category}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Excluded Items Strip */}
        <div className="pt-2">
          <span className="font-bold text-slate-700 text-xs block mb-2">Explicitly Out of Scope / Excluded in Current Estimate:</span>
          <div className="space-y-1.5 text-xs">
            {document.excludedItems.map((ex, exIdx) => (
              <div key={exIdx} className="p-2 rounded-lg bg-rose-50/50 border border-rose-100 text-rose-900 flex items-start gap-2 text-[11px]">
                <span className="text-rose-500 font-bold">✗</span>
                <span>{ex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
