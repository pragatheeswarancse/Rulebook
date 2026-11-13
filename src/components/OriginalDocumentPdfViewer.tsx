import React, { useState } from 'react';
import { FileText, Search, ZoomIn, ZoomOut, Check, ChevronLeft, ChevronRight, X, Download, Copy, ExternalLink, Layers } from 'lucide-react';
import { SALES_FORECAST_DOCUMENT } from '../data/salesForecastAnalysisData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalDocumentPdfViewer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'visual' | 'extracted-text' | 'loc-table'>('visual');
  const [searchText, setSearchText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalPages = 8;

  const pdfPagesText: Record<number, string> = {
    1: `Sales Forecast Analysis: LOC Count, Comparison, and ETA Estimation
Sales Forecast (SalesForecast-main) — LOC Count, Comparison, and ETA
Document type: Complexity assessment + man-hour estimation (same method as Comparison ETA – PAM)
Module: Sales Forecast / Sales Projections ( SalesForecast.exe , prjSalesForecast )
Source scanned: C:\\Users\\akshara.karikalan\\Downloads\\SalesForecast
Benchmarks:
• Project Calendar — C:\\Users\\...\\ProjectCalendar + Calendar.txt (860 hours, index 1.0)
• Scheduling Board — C:\\Users\\...\\SchedulingBoard-main + Scheduling-board.txt (1,480 hours, index 1.72)
• Method example — Comparison+ETA+-+PAM.doc (PAM = 800 hours, index 0.93)
Date: 16 Sep 2026
Stack of current code: Visual Basic 6 desktop EXE (not .NET). Estimate below is for a Finesse-style .NET WinForms modernization.

A. Lines of code — necessary application lines only
Counting rules (what "necessary" means)
Included:
• Executable product logic (filters, SQL/SP call, tree render, Excel export, tool launch, settings)
• Helper code actually called by that logic
• ColumnTreeViewStateHelper.cls (tree expand/scroll restore)
Excluded:
• Visual SourceSafe / IDE junk (.scc, .vbw, .log)
• Binary resources (.frx)
• VB6 form designer layout (control coordinates; needed to compile, not business logic)
• Blank lines and comment-only lines
• Dead handlers (optRevenueGross_Click / optRevenueNet_Click — controls are not on the form)`,

    2: `• Unused Utilities.bas routines (shared Finesse dump; same file also appears in Project Calendar)
• Duplicate Utilities.AppendSQL (the form has its own AppendSQL)

A.1 File-level count
File: frmSalesForecast.frm
• Gross lines: 2,709 | Designer / layout: 470 | Blank: 522 | Comments: 128 | Logic: 1,589 | Necessary logic: 1,581 (minus ~8 dead option-button handlers)

File: ColumnTreeViewStateHelper.cls
• Gross lines: 101 | Designer: 0 | Blank: 17 | Comments: 4 | Logic: 80 | Necessary logic: 80

File: General.bas
• Gross lines: 5 | Designer: 0 | Blank: 2 | Comments: 0 | Logic: 3 | Necessary logic: 3 (Global cnApp)

File: Utilities.bas (entire file)
• Gross lines: 903 | Designer: 0 | Blank: 189 | Comments: 47 | Logic: 667 | Necessary: ~185 used subset only

File: prjSalesForecast.vbp
• Gross lines: 48 (Project file, not app logic)`,

    3: `File: .scc / .vbw / .log / .frx: 0 (not application code)
Total necessary application LOC: 1,849

Necessary Utilities.bas subset (used by this EXE)
Used symbol: SafeItemData, MatchComboText, MatchComboItemData -> Filter combo selection
Used symbol: SetComboBoxHeight + SendMessageLong, GetWindowRect, ScreenToClient, MoveWindow, POINTAPI, RECT, CB_GETITEMHEIGHT -> Dropdown height
Used symbol: SaveWindowState, LoadWindowState -> Window geometry persistence
Used symbol: SysColorToRGB, GetRValue, GetGValue, GetBValue, OleTranslateColor -> Tree/Excel colors
Used symbol: CreateProcess, STARTUPINFO, PROCESS_INFORMATION, STARTF_USESHOWWINDOW, NORMAL_PRIORITY_CLASS, SW_SHOWNORMAL -> Project Maintenance / Project Detail launch

Not counted in the 1,849 (present in Utilities.bas but unused here): clipboard retry, timezone conversion, BringWindowToFront, FlexGrid autosize, SQLQuote/SQLDate, RGBA helpers, RunningInIDE, etc. (~480 logic lines of shared leftover).`,

    4: `A.2 Headline LOC numbers (use these)
• Necessary application LOC: 1,849 (Effort / complexity - this number)
• UI layout (VB6 designer in .frm): 470 (Compile-time form definition only)
• Necessary logic + UI layout: 2,319 (If you count screen definition as "app")
• All .frm/.bas/.cls including unused Utilities: 3,718 (Inflated; do not use for estimation)
SalesForecast-main necessary application lines = 1,849.

B. Comparison vs Project Calendar and Scheduling Board
B.1 Necessary application LOC (same rules)
• Sales Forecast: VB6 EXE | App logic: 1,849 | Designer: 470 | Active SPs in client: 1 (get_sales_forecast_quoted_by_warehouse, 14 recordsets) | Forms: 1 | Writes business data? No
• Project Calendar: VB6 EXE | App logic: 4,406 | Designer: 2,388 | Active SPs: Multiple (calendar/notes/crew) | Forms: 5 | Writes business data? Yes (notes CRUD)
• Scheduling Board: VB Shop 4.8 WinForms | App logic: 4,967 | Designer: 2,130 | Active SPs: 11 | Forms: 3 | Writes business data? Yes (substitution, warehouse groups, commit)`,

    5: `LOC ratios vs Calendar logic (4,406):
• Project Calendar: Logic LOC / Calendar: 1.00 | Hours benchmark: 860 | Hours / Calendar: 1.00
• Sales Forecast: Logic LOC / Calendar: 0.42 | Hours benchmark: (this estimate) | Hours / Calendar: 0.64
• Scheduling Board: Logic LOC / Calendar: 1.13 | Hours benchmark: 1,480 | Hours / Calendar: 1.72
• PAM (from example doc): Logic LOC / Calendar: n/a | Hours benchmark: 800 | Hours / Calendar: 0.93

Hours do not scale 1:1 with LOC. Sales Forecast is smaller, but still pays a floor cost for QA permutations, Excel export, SP contract, and Finesse EXE launches. That is why the hour index (0.64) is higher than the LOC index (0.42).

B.2 Scope comparison (from code + Calendar.txt + Scheduling-board.txt)
• Primary UX: One hierarchical tree, 12-month money grid vs Weekly calendar grid + color states vs Three views (Board / Timeline / Calendar)
• User workflows: Filter -> query -> view / Excel / launch tool vs Navigate weeks, notes CRUD, crew inquiry vs Availability, substitution/split, warehouse groups, crew mode
• Edits to SQL business data: None vs Notes insert/update/delete vs Substitution commit, warehouse group commit, sequence updates`,

    6: `• Filter surface: WH, 2 AEs, company, group, dates, status, proposal type, probability, currency
• Display modes: Super-user hierarchy vs flat
• Excel: Tree snapshot with grouping/colors
• Sibling EXEs: 4 (Proj Maint, Bid Report, Quote Report, Inv vs Bid)
• Auto-refresh: No
• AuthZ in client: SQL role SalesForecastSuperUsers + my_company_visible
• UI density: Medium-Low
• Backend depth: Medium (1 fat SP, 14 RS mapping)
Classification vs mandated labels:
Less complex than Calendar.txt (and far less complex than Scheduling-board.txt; also less complex than PAM)

C. Estimation (PAM document structure)
1. Functional coverage checklist (Active features in estimate):
[x] F-01 Startup, SQLOLEDB connect via ESS* env vars
[x] F-02 Super-user flag (SalesForecastSuperUsers)
[x] F-03 Account Executive + 2nd AE combos (ACCTEXEC)
[x] F-04 Currency combo; default from my_user_info
[x] F-05 Probability threshold 0/25/50/75/100
[x] F-06 Warehouse combo
[x] F-07 Billing company combo + (all companies; flat) for super-user
[x] F-08 Company group combo
[x] F-09 12-month window, year-2..year+2, quarter/year buttons
[x] F-10 Project status list (exclude I)
[x] F-11 Proposal types (DoJobCosting = 1)
[x] F-12 Restore/save filters + window (registry)
[x] F-13 Async get_sales_forecast_quoted_by_warehouse
[x] F-14 Tree render: company / parent / project*warehouse, thousands, colors, RFI actuals, top line, grand totals
[x] F-15 Filter auto-refresh`,

    7: `[x] F-16 Linked start/end months
[x] F-17 Expand/collapse; hide parent dollars when expanded
[x] F-18 Show/hide AE/Ops columns
[x] F-19 Excel export (group, colors, thousands, outline)
[x] F-20 Launch Project Maintenance
[x] F-21 Launch Project Detail (requires project #)
[x] F-22 Launch Bid Report
[x] F-23 Launch Quote Report
[x] F-24 Launch Invoicing vs Bid
[x] F-25 Unload persistence
[x] F-26 Resize + End
Active feature count: 26 (vs PAM 35, Calendar ~8 feature groups, Scheduling Board much larger)

Explicitly not in estimate (gaps / leftovers in current code):
• Combined Grand Total / Actual Grand Total (commented out)
• Alternate SPs (get_sales_forecast, quoted, quoted_vs_manual)
• Gross vs Net option buttons (dead)
• Rewriting get_sales_forecast_quoted_by_warehouse internals (SP not in repo) — risk adder only
• React / .NET 8 Web API rebuild (different delivery model than WinForms estimates)

Business rules included:
BR-01 to BR-19 from the as-is FSD (12-month window, thousands display, probability >=, status/proposal filters, super-user layout, color rules, read-only SQL, etc.)`,

    8: `2. Complexity breakdown
• UI / Frontend: Low-Medium | One form, many filters, one tree. No notes UI, no 3-view board, no calendar cell engine. Excel grouping/colors add work. Simpler than Calendar; much simpler than Scheduling Board.
• Backend & API: Medium | One stored procedure but 14 recordsets and strict NextRecordset order. Lookup SQL + role/visibility. No INSERT/UPDATE. Simpler than PAM writes and SB availability math. SP body unknown (risk).
• Workflow & orchestration: Low | Filter -> async fetch -> render. No attach/detach, no substitution, no notes CRUD.
• Data model & persistence: Low-Medium | Registry settings only on the client. Reads Company, Warehouse, Currency, ProjectStatus, pjproptype, employee job types, SysConfig. Forecast grain lives in the SP.
• Integration & dependencies: Low-Medium | Excel COM + 4 sibling EXEs + env SQL login. Fewer than Calendar context menus and far fewer than SB's 9+ tools.`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pdfPagesText[currentPage] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[92vh] flex flex-col border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Attached Source Document Viewer
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-100 text-rose-800 font-bold">
                  PDF 8 Pages
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                CD-Sales_Forecast_Analysis__LOC_Count__Comparison__and_ETA_Estimation-281026-084501_f749799f.pdf
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Page' : 'Copy Page Text'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="px-6 py-2.5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'visual' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Structured Document View
            </button>
            <button
              onClick={() => setActiveTab('extracted-text')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'extracted-text' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Raw OCR Text Pages ({currentPage}/{totalPages})
            </button>
            <button
              onClick={() => setActiveTab('loc-table')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'loc-table' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              LOC Count & Benchmark Table
            </button>
          </div>

          {/* Page Navigator */}
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs font-bold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 text-xs text-slate-800 space-y-4">
          
          {/* TAB 1: STRUCTURED DOCUMENT VIEW */}
          {activeTab === 'visual' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Executive Summary Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono text-teal-700 uppercase font-bold tracking-wider">Executive Synthesis</span>
                  <span className="font-mono text-slate-500">Document Date: 16 Sep 2026</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Sales Forecast (SalesForecast-main) — LOC Count, Comparison, and ETA
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs">
                  Complexity assessment and man-hour estimation for modernizing legacy Visual Basic 6 desktop application to .NET WinForms.
                  Uses identical assessment methodology as Comparison ETA – PAM. Evaluates application logic, designer layout lines, active stored procedures, and benchmark calibration.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-teal-50 border border-teal-100">
                    <span className="text-[10px] text-teal-800 font-bold block uppercase">Necessary LOC</span>
                    <span className="text-xl font-bold font-mono text-teal-900">1,849</span>
                    <span className="text-[10px] text-teal-700 block">Lines of code</span>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <span className="text-[10px] text-blue-800 font-bold block uppercase">Target ETA</span>
                    <span className="text-xl font-bold font-mono text-blue-900">550h</span>
                    <span className="text-[10px] text-blue-700 block">Hour index: 0.64</span>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                    <span className="text-[10px] text-purple-800 font-bold block uppercase">Active Features</span>
                    <span className="text-xl font-bold font-mono text-purple-900">26</span>
                    <span className="text-[10px] text-purple-700 block">F-01 through F-26</span>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <span className="text-[10px] text-amber-800 font-bold block uppercase">Stored Proc Pipeline</span>
                    <span className="text-xl font-bold font-mono text-amber-900">14 RS</span>
                    <span className="text-[10px] text-amber-700 block">NextRecordset order</span>
                  </div>
                </div>
              </div>

              {/* LOC Counting Rules Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Section A: Counting Rules (What "Necessary" Means)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-100 space-y-2">
                    <span className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] block">Included in 1,849 Count</span>
                    <ul className="space-y-1 text-emerald-950 text-[11px]">
                      <li>✓ Executable product logic (filters, SQL/SP call, tree render, Excel export, tool launch, settings)</li>
                      <li>✓ Helper code actually called by that logic</li>
                      <li>✓ ColumnTreeViewStateHelper.cls (tree expand/scroll restore)</li>
                      <li>✓ Necessary Utilities.bas subset (~185 lines: Win32 combo sizing, window state, colors, CreateProcess)</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-100 space-y-2">
                    <span className="font-bold text-rose-900 uppercase tracking-wider text-[11px] block">Excluded from Count</span>
                    <ul className="space-y-1 text-rose-950 text-[11px]">
                      <li>✗ Visual SourceSafe / IDE junk (.scc, .vbw, .log)</li>
                      <li>✗ Binary form resources (.frx)</li>
                      <li>✗ VB6 form designer layout (470 lines; coordinates needed to compile, not business logic)</li>
                      <li>✗ Blank lines and comment-only lines (650+ lines)</li>
                      <li>✗ Dead handlers (optRevenueGross_Click / optRevenueNet_Click)</li>
                      <li>✗ Unused Utilities.bas leftover (~480 lines of shared clipboard/timezone code)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Benchmark Hours Ratio Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Section B: Benchmark Ratios & Scope Comparison</h4>
                <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 text-xs">
                  <span className="font-bold block mb-1">Key Engineering Finding (Hours do not scale 1:1 with LOC):</span>
                  Sales Forecast logic is 42% of Calendar (0.42 LOC ratio), but the effort index is 0.64 (550 hours vs 860 hours)
                  because every application pays a floor cost for QA permutations, Excel COM export, stored procedure contract verification, and Finesse EXE launches.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXTRACTED OCR RAW TEXT PAGES */}
          {activeTab === 'extracted-text' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-bold text-slate-700 uppercase">
                  Page {currentPage} of {totalPages} Text Extract
                </span>
                <span className="text-slate-400 text-[11px]">Source: PDF OCR Layer</span>
              </div>

              <pre className="font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto max-h-[500px]">
                {pdfPagesText[currentPage] || 'No text available for this page.'}
              </pre>

              <div className="flex justify-between items-center pt-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30"
                >
                  Previous Page
                </button>
                <span className="font-mono text-xs text-slate-500">
                  Viewing Page {currentPage}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30"
                >
                  Next Page
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LOC TABLE & BENCHMARK COMPARISON */}
          {activeTab === 'loc-table' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-4 bg-slate-100 border-b border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm">Table A.1: File-Level LOC Count</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                        <th className="py-2.5 px-4">File</th>
                        <th className="py-2.5 px-3 text-right">Gross Lines</th>
                        <th className="py-2.5 px-3 text-right">Designer</th>
                        <th className="py-2.5 px-3 text-right">Blank</th>
                        <th className="py-2.5 px-3 text-right">Comments</th>
                        <th className="py-2.5 px-3 text-right">Logic Lines</th>
                        <th className="py-2.5 px-3 text-right font-bold text-teal-800">Necessary LOC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {SALES_FORECAST_DOCUMENT.locMetrics.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-4 font-sans font-medium text-slate-800">
                            <div>{m.fileName}</div>
                            <div className="text-[10px] text-slate-500">{m.notes}</div>
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-500">{m.grossLines}</td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-500">{m.designerLines}</td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-500">{m.blankLines}</td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-500">{m.commentLines}</td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">{m.logicLines}</td>
                          <td className="py-2.5 px-3 text-right tabular-nums font-bold text-teal-700">{m.necessaryLoc}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 font-bold text-slate-900">
                        <td className="py-3 px-4">Total Necessary Application LOC</td>
                        <td className="py-3 px-3 text-right">3,718</td>
                        <td className="py-3 px-3 text-right">470</td>
                        <td className="py-3 px-3 text-right">730</td>
                        <td className="py-3 px-3 text-right">179</td>
                        <td className="py-3 px-3 text-right">2,339</td>
                        <td className="py-3 px-3 text-right text-teal-800 text-sm">1,849</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table B.1 Comparison vs Project Calendar and Scheduling Board */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-4 bg-slate-100 border-b border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm">Table B.1: Scope Comparison vs Benchmarks</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                        <th className="py-2.5 px-4">Module</th>
                        <th className="py-2.5 px-3">Runtime</th>
                        <th className="py-2.5 px-3 text-right">App Logic</th>
                        <th className="py-2.5 px-3 text-right">Designer</th>
                        <th className="py-2.5 px-3">Active SPs</th>
                        <th className="py-2.5 px-3 text-right font-bold text-blue-800">Hours</th>
                        <th className="py-2.5 px-3 text-right">Hour Index</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {SALES_FORECAST_DOCUMENT.benchmarks.map((b, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-4 font-sans font-semibold text-slate-900">{b.moduleName}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-600">{b.runtimeToday}</td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-800">{b.appLogicLoc.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-slate-500">{b.designerLayout.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-sans text-[11px] text-slate-600 truncate max-w-[140px]">{b.activeStoredProcs}</td>
                          <td className="py-2.5 px-3 text-right tabular-nums font-bold text-blue-700">{b.benchmarkHours}h</td>
                          <td className="py-2.5 px-3 text-right tabular-nums font-bold text-slate-900">{b.hourIndexVsCalendar}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Source file: /public/assets/aistudio/CD-Sales_Forecast_Analysis__LOC_Count__Comparison__and_ETA_Estimation-281026-084501_f749799f.pdf</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
