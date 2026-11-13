import React, { useState } from 'react';
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Search, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { EngineeringProject } from '../types/project';

interface Props {
  project: EngineeringProject;
  onProceedToVisuals: () => void;
}

export const RulebookDocumentReader: React.FC<Props> = ({ project, onProceedToVisuals }) => {
  const [activePage, setActivePage] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const totalPages = 8;
  const isSalesForecast = project.id === 'proj-sales-forecast';

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
    navigator.clipboard.writeText(pdfPagesText[activePage] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              SOURCE DOCUMENT INSPECTION
            </span>
            <span className="text-xs text-slate-500 font-medium">Page {activePage} of {totalPages}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Compare Original Document with Rulebook Extracted Text
          </h2>
          <p className="text-xs text-slate-500">
            Source: <code className="text-slate-700 font-mono">{project.sourceDocName}</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Page' : 'Copy Text'}</span>
          </button>

          <button
            onClick={onProceedToVisuals}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-xs inline-flex items-center gap-2"
          >
            <span>Proceed to Visual Models</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Pane: Original Document View */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Original Document Source (Page {activePage})</h3>
            </div>
            
            {/* Page Pager */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                disabled={activePage <= 1}
                onClick={() => setActivePage(p => Math.max(1, p - 1))}
                className="p-1 rounded text-slate-600 hover:bg-white disabled:opacity-30 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs px-2 font-semibold text-slate-700">
                {activePage} / {totalPages}
              </span>
              <button
                disabled={activePage >= totalPages}
                onClick={() => setActivePage(p => Math.min(totalPages, p + 1))}
                className="p-1 rounded text-slate-600 hover:bg-white disabled:opacity-30 transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Visual PDF page representation */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200 min-h-[460px] flex flex-col justify-between font-serif text-slate-800 shadow-inner">
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="border-b border-slate-200 pb-2 flex items-center justify-between text-slate-400 font-sans text-[10px]">
                <span>RULEBOOK SOURCE READER</span>
                <span>ORIGINAL PDF PAGE #{activePage}</span>
              </div>
              
              <div className="text-slate-900 font-sans font-bold text-sm">
                {activePage === 1 && 'Sales Forecast Analysis: LOC Count, Comparison, and ETA Estimation'}
                {activePage === 2 && 'Section A.1: File-Level Lines of Code (LOC) Count'}
                {activePage === 3 && 'Necessary Utilities.bas Subset & Excluded Leftover'}
                {activePage === 4 && 'Section B.1: Scope Comparison vs Project Calendar'}
                {activePage === 5 && 'LOC Ratios & Benchmark Hour Scaling Principles'}
                {activePage === 6 && 'Section C: Functional Coverage Checklist (F-01..F-15)'}
                {activePage === 7 && 'Active Features Continued (F-16..F-26) & Out-of-Scope Items'}
                {activePage === 8 && 'Section 2: Complexity Breakdown Matrix'}
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-[340px] overflow-y-auto">
                {pdfPagesText[activePage]}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-sans">
              <span>Verified Authenticity</span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                OCR Text Stream Verified
              </span>
            </div>
          </div>
        </div>

        {/* Right Pane: Structured Rulebook Extraction */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Rulebook Structured Breakdown</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Clean Structured Data
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {activePage === 1 && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Module Definition</span>
                  <p className="text-slate-600">{project.prd.visionStatement}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                    <span className="text-[10px] text-indigo-700 uppercase font-bold block">Current Stack</span>
                    <span className="font-bold text-indigo-900">{project.currentStack}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-teal-50 border border-teal-100">
                    <span className="text-[10px] text-teal-700 uppercase font-bold block">Target Architecture</span>
                    <span className="font-bold text-teal-900">{project.targetStack}</span>
                  </div>
                </div>
              </div>
            )}

            {activePage >= 2 && activePage <= 5 && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block text-xs">Extracted Code Metrics</span>
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Gross Lines</span>
                      <span className="font-bold text-slate-800">3,718</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Designer Layout</span>
                      <span className="font-bold text-slate-800">470</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-teal-200 bg-teal-50/50">
                      <span className="text-[10px] text-teal-700 block font-bold">Necessary LOC</span>
                      <span className="font-bold text-teal-900">1,849</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] leading-relaxed">
                  <strong className="block mb-0.5">Floor Cost Principle:</strong>
                  Hours do not scale 1:1 with LOC. Sales Forecast has 0.42 LOC ratio vs Calendar, but carries a 0.64 hour index (550h) due to QA testing, Excel export, and 14-recordset validation floor costs.
                </div>
              </div>
            )}

            {activePage >= 6 && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">Active Features (F-01 through F-26)</span>
                  <div className="space-y-1 max-h-[220px] overflow-y-auto font-mono text-[11px]">
                    {project.brd.requirements.slice(0, 4).map((r, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between">
                        <span className="text-slate-800">{r.id}: {r.title}</span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={onProceedToVisuals}
                className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2"
              >
                <span>Open Visual Flowmap & Specification Models</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
