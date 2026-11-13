import { AnalyzedEngineeringDocument } from '../types/documentAnalysis';

export const SALES_FORECAST_DOCUMENT: AnalyzedEngineeringDocument = {
  id: 'doc-sales-forecast-pdf',
  title: 'Sales Forecast Analysis: LOC Count, Comparison, and ETA Estimation',
  documentType: 'Complexity Assessment & Modernization Man-Hour Estimation',
  moduleName: 'Sales Forecast / Sales Projections (SalesForecast.exe, prjSalesForecast)',
  sourceScannedPath: 'C:\\Users\\akshara.karikalan\\Downloads\\SalesForecast',
  scanDate: '16 Sep 2026',
  currentStack: 'Visual Basic 6 Desktop EXE (not .NET)',
  targetModernizationStack: 'Finesse-Style .NET WinForms Modernization',
  headlineSummary: 'Complexity assessment and modernization estimation for legacy VB6 SalesForecast application. Contains 1,849 necessary logic lines across 1 form and 1 complex stored procedure with 14 recordsets. Estimated at 550 hours (0.64 index vs Project Calendar).',
  sourceFilePath: '/public/assets/aistudio/CD-Sales_Forecast_Analysis__LOC_Count__Comparison__and_ETA_Estimation-281026-084501_f749799f.pdf',

  headlineLoc: {
    necessaryLoc: 1849,
    uiLayoutLines: 470,
    logicPlusUiLayout: 2319,
    allFilesWithUtilities: 3718
  },

  locMetrics: [
    {
      fileName: 'frmSalesForecast.frm',
      grossLines: 2709,
      designerLines: 470,
      blankLines: 522,
      commentLines: 128,
      logicLines: 1589,
      necessaryLoc: 1581,
      notes: 'Minus ~8 dead option-button click handlers (optRevenueGross_Click / optRevenueNet_Click)'
    },
    {
      fileName: 'ColumnTreeViewStateHelper.cls',
      grossLines: 101,
      designerLines: 0,
      blankLines: 17,
      commentLines: 4,
      logicLines: 80,
      necessaryLoc: 80,
      notes: 'Helper for hierarchical tree expand/scroll state preservation'
    },
    {
      fileName: 'General.bas',
      grossLines: 5,
      designerLines: 0,
      blankLines: 2,
      commentLines: 0,
      logicLines: 3,
      necessaryLoc: 3,
      notes: 'Global cnApp database connection definition'
    },
    {
      fileName: 'Utilities.bas (used subset)',
      grossLines: 903,
      designerLines: 0,
      blankLines: 189,
      commentLines: 47,
      logicLines: 667,
      necessaryLoc: 185,
      notes: 'Only ~185 logic lines used by this EXE (SafeItemData, Win32 sizing APIs, color translations, CreateProcess)'
    },
    {
      fileName: 'prjSalesForecast.vbp',
      grossLines: 48,
      designerLines: 0,
      blankLines: 0,
      commentLines: 0,
      logicLines: 0,
      necessaryLoc: 0,
      notes: 'VB6 project definition file (not application logic)'
    },
    {
      fileName: '.scc / .vbw / .log / .frx',
      grossLines: 0,
      designerLines: 0,
      blankLines: 0,
      commentLines: 0,
      logicLines: 0,
      necessaryLoc: 0,
      notes: 'SourceSafe junk, IDE state, and binary form resources (excluded from LOC count)'
    }
  ],

  complexityBreakdown: [
    {
      area: 'UI / Frontend',
      level: 'Low-Medium',
      justification: 'One primary form, multi-criteria filter panel, one 12-month money grid tree. No notes UI, no 3-view board, no calendar cell engine. Excel grouping/colors add effort.'
    },
    {
      area: 'Backend & API',
      level: 'Medium',
      justification: 'One fat stored procedure (get_sales_forecast_quoted_by_warehouse) but maps 14 distinct recordsets in strict NextRecordset sequence. Read-only; zero INSERT/UPDATE.'
    },
    {
      area: 'Workflow & Orchestration',
      level: 'Low',
      justification: 'Straightforward pipeline: Filter selection → async SP fetch → tree hydration. No attach/detach, no substitution, no notes CRUD.'
    },
    {
      area: 'Data Model & Persistence',
      level: 'Low-Medium',
      justification: 'Registry settings only on client (saved filter state & window geometry). Reads Company, Warehouse, Currency, ProjectStatus. Forecast aggregation logic lives in the SP.'
    },
    {
      area: 'Integration & Dependencies',
      level: 'Low-Medium',
      justification: 'Excel COM automation with custom color outlines + 4 sibling EXE process launchers (Project Maintenance, Bid Report, Quote Report, Inv vs Bid).'
    }
  ],

  benchmarks: [
    {
      moduleName: 'Sales Forecast (Current Target)',
      runtimeToday: 'VB6 Desktop EXE',
      appLogicLoc: 1849,
      designerLayout: 470,
      activeStoredProcs: '1 (get_sales_forecast_quoted_by_warehouse, 14 recordsets)',
      formsCount: 1,
      writesBusinessData: false,
      locRatioVsCalendar: 0.42,
      benchmarkHours: 550,
      hourIndexVsCalendar: 0.64,
      primaryUx: 'Hierarchical tree, 12-month financial money grid',
      userWorkflows: 'Filter → query → view / Excel export / launch sibling tools'
    },
    {
      moduleName: 'Project Calendar (Baseline 1.0)',
      runtimeToday: 'VB6 Desktop EXE',
      appLogicLoc: 4406,
      designerLayout: 2388,
      activeStoredProcs: 'Multiple (calendar, notes, crew queries)',
      formsCount: 5,
      writesBusinessData: true,
      locRatioVsCalendar: 1.00,
      benchmarkHours: 860,
      hourIndexVsCalendar: 1.00,
      primaryUx: 'Weekly calendar grid + color states + notes panel',
      userWorkflows: 'Navigate weeks, notes CRUD, crew inquiry, context menus'
    },
    {
      moduleName: 'Scheduling Board (Heavy)',
      runtimeToday: 'VB Shop 4.8 WinForms',
      appLogicLoc: 4967,
      designerLayout: 2130,
      activeStoredProcs: '11 Stored Procedures (availability math, commit)',
      formsCount: 3,
      writesBusinessData: true,
      locRatioVsCalendar: 1.13,
      benchmarkHours: 1480,
      hourIndexVsCalendar: 1.72,
      primaryUx: 'Three full views (Board / Timeline / Calendar), merged cells, frozen columns',
      userWorkflows: 'Availability, substitution/split, warehouse groups, crew mode'
    },
    {
      moduleName: 'PAM (Comparison Method Ref)',
      runtimeToday: 'WinForms Reference',
      appLogicLoc: 3800,
      designerLayout: 1500,
      activeStoredProcs: 'Multiple CRUD SPs',
      formsCount: 4,
      writesBusinessData: true,
      locRatioVsCalendar: 0.86,
      benchmarkHours: 800,
      hourIndexVsCalendar: 0.93,
      primaryUx: 'Project Activity Manager tabular grid',
      userWorkflows: 'Project milestone scheduling, budget edits, status reviews'
    }
  ],

  features: [
    { code: 'F-01', title: 'Startup & SQLOLEDB Connection', description: 'Read ESS* environment variables, initialize global cnApp connection pool.', isActiveInEstimate: true, category: 'Setup & Auth' },
    { code: 'F-02', title: 'Super-User Role Authorization', description: 'Check SalesForecastSuperUsers SQL role and my_company_visible claims.', isActiveInEstimate: true, category: 'Setup & Auth' },
    { code: 'F-03', title: 'Account Executive Combos', description: 'Dual combo dropdowns for Primary AE and 2nd AE populated from ACCTEXEC.', isActiveInEstimate: true, category: 'Filter Surface' },
    { code: 'F-04', title: 'Currency Selector', description: 'Currency combo populated from system defaults and user info.', isActiveInEstimate: true, category: 'Filter Surface' },
    { code: 'F-05', title: 'Probability Threshold Filter', description: 'Segmented filtering for forecast probability (0%, 25%, 50%, 75%, 100%).', isActiveInEstimate: true, category: 'Filter Surface' },
    { code: 'F-06', title: 'Warehouse Combo Selector', description: 'Warehouse scope picker enforcing user assigned facility constraints.', isActiveInEstimate: true, category: 'Filter Surface' },
    { code: 'F-07', title: 'Billing Company Combo', description: 'Company filter showing all companies for super-users or scoped company.', isActiveInEstimate: true, category: 'Filter Surface' },
    { code: 'F-08', title: 'Company Group Combo', description: 'Categorical grouping filter for enterprise accounts.', isActiveInEstimate: true, category: 'Filter Surface' },
    { code: 'F-09', title: '12-Month Rolling Date Window', description: 'Year-2 to Year+2 selector, quick quarter/year toggle buttons.', isActiveInEstimate: true, category: 'Filter Surface' },
    { code: 'F-10', title: 'Project Status Filter', description: 'Multi-select status filter excluding inactive status "I".', isActiveInEstimate: true, category: 'Filter Surface' },
    { code: 'F-11', title: 'Proposal Type Selector', description: 'Filter by active job costing proposals (DoJobCosting = 1).', isActiveInEstimate: true, category: 'Filter Surface' },
    { code: 'F-12', title: 'Registry State Persistence', description: 'Restore and persist user filter preferences and window geometry in registry.', isActiveInEstimate: true, category: 'Setup & Auth' },
    { code: 'F-13', title: 'Async Stored Procedure Execution', description: 'Asynchronous invocation of get_sales_forecast_quoted_by_warehouse with 14 recordsets.', isActiveInEstimate: true, category: 'Data Pipeline' },
    { code: 'F-14', title: 'Hierarchical Tree Render Engine', description: 'Render Company / Parent / Project × Warehouse multi-level grid with colors, actuals, and totals.', isActiveInEstimate: true, category: 'Tree UX' },
    { code: 'F-15', title: 'Filter Auto-Refresh Engine', description: 'Debounced re-query trigger upon filter modification.', isActiveInEstimate: true, category: 'Data Pipeline' },
    { code: 'F-16', title: 'Linked Start/End Months', description: 'Dynamic date boundary validation preventing inverted forecast windows.', isActiveInEstimate: true, category: 'Filter Surface' },
    { code: 'F-17', title: 'Expand/Collapse Row State', description: 'Dynamic parent dollar summarization when child rows are collapsed.', isActiveInEstimate: true, category: 'Tree UX' },
    { code: 'F-18', title: 'Show/Hide AE & Ops Columns', description: 'User-configurable column visibility toggle for presentation modes.', isActiveInEstimate: true, category: 'Tree UX' },
    { code: 'F-19', title: 'Excel COM Export with Outlines', description: 'Generate formatted spreadsheet with hierarchical grouping, colors, and thousands notation.', isActiveInEstimate: true, category: 'Reporting & Launchers' },
    { code: 'F-20', title: 'Launch Project Maintenance EXE', description: 'Shell process spawn via Win32 CreateProcess to sibling Project Maintenance app.', isActiveInEstimate: true, category: 'Reporting & Launchers' },
    { code: 'F-21', title: 'Launch Project Detail EXE', description: 'Launch Project Detail window passing active selected project number.', isActiveInEstimate: true, category: 'Reporting & Launchers' },
    { code: 'F-22', title: 'Launch Bid Report EXE', description: 'Direct invocation of sibling Bid Report reporting engine.', isActiveInEstimate: true, category: 'Reporting & Launchers' },
    { code: 'F-23', title: 'Launch Quote Report EXE', description: 'Process launch for detailed sales quote summary report.', isActiveInEstimate: true, category: 'Reporting & Launchers' },
    { code: 'F-24', title: 'Launch Invoicing vs Bid EXE', description: 'Process launch for invoicing comparison analysis tool.', isActiveInEstimate: true, category: 'Reporting & Launchers' },
    { code: 'F-25', title: 'Unload Persistence Engine', description: 'Clean teardown of ADODB recordsets, tree pointers, and COM handles.', isActiveInEstimate: true, category: 'Setup & Auth' },
    { code: 'F-26', title: 'Window Resize & Grid Anchor', description: 'Dynamic WinForms anchoring and DPI scaling math for grid controls.', isActiveInEstimate: true, category: 'Tree UX' }
  ],

  excludedItems: [
    'Combined Grand Total / Actual Grand Total (commented out in legacy code)',
    'Alternate Stored Procedures (get_sales_forecast, quoted, quoted_vs_manual)',
    'Gross vs Net option button handlers (dead/removed from UI form)',
    'Rewriting get_sales_forecast_quoted_by_warehouse internals (SP not in repository; risk adder only)',
    'Full React / Web API cloud architecture rebuild (estimate is specifically scoped for .NET WinForms modernization)'
  ],

  businessRules: [
    { code: 'BR-01', title: '12-Month Money Horizon', description: 'Grid columns dynamically project 12 consecutive months starting from selected start month, formatted in thousands.' },
    { code: 'BR-02', title: 'Probability Cutoff Rule', description: 'Only proposals with probability greater than or equal to chosen threshold are included in forecast calculations.' },
    { code: 'BR-03', title: 'Super-User Flat vs Hierarchical Layout', description: 'Users with SalesForecastSuperUsers SQL role can toggle company-wide flat lists or branch hierarchies.' },
    { code: 'BR-04', title: 'Read-Only Security Guarantee', description: 'The application contains zero database INSERT or UPDATE statements; all forecast views are non-destructive queries.' }
  ],

  // Generated Flowmap for Sales Forecast
  flowNodes: [
    {
      id: 'sf-node-1',
      role: 'admin',
      title: 'Startup & ESS* Auth',
      subtitle: 'Environment & Connection',
      iconName: 'LogIn',
      swimlane: 'School Administrator Role (Full System Access)',
      stepNumber: 1,
      category: 'auth',
      description: 'Initialize application, parse ESS* environment variables, configure SQLOLEDB connection string, and query current user profile.',
      inputs: ['ESS_SERVER', 'ESS_DATABASE', 'User Windows Token'],
      outputs: ['Active ADODB.Connection (cnApp)', 'User Context'],
      businessRules: ['Connection timeout 30s', 'Graceful exit if database unreachable'],
      apiEndpoints: [{ method: 'POST', path: 'SQLOLEDB Connection (cnApp.Open)', authScope: 'ESS Trusted Context', errorCodes: ['0x80004005 (Unspecified error)'] }],
      dbTables: ['SysConfig', 'my_user_info'],
      exceptionHandling: ['Failover to secondary database mirror if configured'],
      coordinates: { x: 50, y: 70 }
    },
    {
      id: 'sf-node-2',
      role: 'admin',
      title: 'Check SQL Roles',
      subtitle: 'SalesForecastSuperUsers',
      iconName: 'UserCheck',
      swimlane: 'School Administrator Role (Full System Access)',
      stepNumber: 2,
      category: 'auth',
      description: 'Evaluate if the current user belongs to the SalesForecastSuperUsers security role or has restricted single-company visibility.',
      inputs: ['cnApp', 'User SUID'],
      outputs: ['isSuperUser Boolean', 'my_company_visible array'],
      businessRules: ['Super-users can view all billing companies', 'Standard users restricted to home warehouse'],
      apiEndpoints: [{ method: 'GET', path: 'IS_MEMBER("SalesForecastSuperUsers")', authScope: 'SQL Role Check', errorCodes: ['403 Access Denied'] }],
      dbTables: ['sys.database_principals'],
      exceptionHandling: ['Default to scoped single company on query error'],
      coordinates: { x: 250, y: 70 }
    },
    {
      id: 'sf-node-3',
      role: 'admin',
      title: 'Hydrate Filter Panel',
      subtitle: 'Combos & Date Horizon',
      iconName: 'Settings',
      swimlane: 'School Administrator Role (Full System Access)',
      stepNumber: 3,
      category: 'config',
      description: 'Populate filter dropdowns: Account Executives (ACCTEXEC), Warehouses, Companies, Currencies, and 12-month rolling range.',
      inputs: ['cnApp', 'Registry Saved Filters'],
      outputs: ['Populated ComboBox Controls', 'Active Filter State Object'],
      businessRules: ['Restore user last-used filter selections from Windows Registry'],
      apiEndpoints: [{ method: 'GET', path: 'SELECT * FROM Warehouse, Company, ACCTEXEC', authScope: 'Read-only Lookups', errorCodes: ['Data Hydration Error'] }],
      dbTables: ['Warehouse', 'Company', 'ACCTEXEC', 'pjproptype'],
      exceptionHandling: ['Fallback to default system warehouse if saved ID no longer exists'],
      coordinates: { x: 250, y: 200 }
    },
    {
      id: 'sf-node-4',
      role: 'teacher',
      title: 'Async Stored Procedure',
      subtitle: '14 Recordsets Pipeline',
      iconName: 'Database',
      swimlane: 'Teacher Role (Scoped Access)',
      stepNumber: 4,
      category: 'attendance',
      description: 'Asynchronous execution of get_sales_forecast_quoted_by_warehouse, streaming back 14 distinct recordsets via strict NextRecordset iteration.',
      inputs: ['Filter Parameters (WH, AE, Dates, Probability, Status, Proposal Type)'],
      outputs: ['14 Linked ADODB.Recordset Streams'],
      businessRules: ['Must iterate NextRecordset in exact contract sequence or data corruption occurs'],
      apiEndpoints: [{ method: 'POST', path: 'EXEC get_sales_forecast_quoted_by_warehouse', authScope: 'Execute SP', errorCodes: ['SP Timeout (>60s)', 'Broken Recordset Order'] }],
      dbTables: ['Stored Procedure get_sales_forecast_quoted_by_warehouse'],
      exceptionHandling: ['Cancel async query button on form to abort hung execution'],
      coordinates: { x: 480, y: 70 }
    },
    {
      id: 'sf-node-5',
      role: 'teacher',
      title: 'ColumnTreeView Render',
      subtitle: 'Multi-Level Financial Grid',
      iconName: 'LayoutDashboard',
      swimlane: 'Teacher Role (Scoped Access)',
      stepNumber: 5,
      category: 'dashboard',
      description: 'Render Company / Parent / Project × Warehouse hierarchical tree with 12-month money columns, formatting in thousands and color-coding actuals.',
      inputs: ['14 Hydrated Recordsets', 'ColumnTreeViewStateHelper'],
      outputs: ['Rendered Hierarchical Money Grid', 'Top-line Summary', 'Grand Totals'],
      businessRules: ['Hide parent dollars when expanded', 'Preserve scroll position using ColumnTreeViewStateHelper'],
      apiEndpoints: [{ method: 'GET', path: 'Local Memory Tree Hydration', authScope: 'Client In-Memory', errorCodes: ['Tree Out of Memory'] }],
      dbTables: ['Local Tree State'],
      exceptionHandling: ['Virtual rendering buffer to handle >5,000 project rows'],
      coordinates: { x: 680, y: 70 }
    },
    {
      id: 'sf-node-6',
      role: 'teacher',
      title: 'Excel COM Export',
      subtitle: 'Hierarchical Groups & Colors',
      iconName: 'FileText',
      swimlane: 'Teacher Role (Scoped Access)',
      stepNumber: 6,
      category: 'reports',
      description: 'Automate Microsoft Excel via COM interop: builds grouped outline levels, translates OleColor palettes, and outputs executive forecast sheet.',
      inputs: ['Active Tree Data Snapshot', 'User Output File Path'],
      outputs: ['Formatted .XLS / .XLSX Spreadsheet', 'Progress Dialog'],
      businessRules: ['Format all money cells in thousands ($K)', 'Maintain outline collapsible levels'],
      apiEndpoints: [{ method: 'POST', path: 'Excel.Application COM Automation', authScope: 'Client Desktop Local', errorCodes: ['Excel Not Installed', 'COM Security Block'] }],
      dbTables: ['None (Client Export)'],
      exceptionHandling: ['Gracefully warn if Excel is not installed and offer CSV fallback'],
      coordinates: { x: 680, y: 220 }
    },
    {
      id: 'sf-node-7',
      role: 'teacher',
      title: 'Launch Sibling EXEs',
      subtitle: '4 Win32 Process Spawners',
      iconName: 'Lock',
      swimlane: 'Teacher Role (Scoped Access)',
      stepNumber: 7,
      category: 'escalation',
      description: 'Spawn sibling Finesse tools using Win32 CreateProcess API: Project Maintenance, Bid Report, Quote Report, and Invoicing vs Bid.',
      inputs: ['Selected Project Number', 'Executable Path Resolution'],
      outputs: ['Spawned Win32 Process', 'Process Handle'],
      businessRules: ['Pass active project ID as command line argument', 'Normal window state'],
      apiEndpoints: [{ method: 'POST', path: 'Win32 CreateProcessA(..., SW_SHOWNORMAL)', authScope: 'OS Process Spawn', errorCodes: ['File Not Found', 'Access Denied'] }],
      dbTables: ['None'],
      exceptionHandling: ['Check file existence before invoking CreateProcess'],
      coordinates: { x: 480, y: 220 }
    }
  ],

  flowEdges: [
    { id: 'sf-e1', source: 'sf-node-1', target: 'sf-node-2', label: 'Connection Validated' },
    { id: 'sf-e2', source: 'sf-node-2', target: 'sf-node-3', label: 'Role Context Hydrated' },
    { id: 'sf-e3', source: 'sf-node-3', target: 'sf-node-4', label: 'User Triggers Query' },
    { id: 'sf-e4', source: 'sf-node-4', target: 'sf-node-5', label: '14 Recordsets Streamed' },
    { id: 'sf-e5', source: 'sf-node-5', target: 'sf-node-6', label: 'Export to Excel' },
    { id: 'sf-e6', source: 'sf-node-5', target: 'sf-node-7', label: 'Drilldown to Sibling Tools' }
  ],

  userJourneySteps: [
    {
      stepIndex: 1,
      phase: 'Phase 1: Application Launch & Profile Sync',
      userGoal: 'Launch Sales Forecast tool and connect to enterprise SQL database',
      userAction: 'User double-clicks SalesForecast.exe. System reads ESS* environment variables and validates Windows auth credentials.',
      systemResponse: 'Initializes global connection pool, verifies SalesForecastSuperUsers role, and restores saved window coordinates from registry.',
      uiScreenMock: 'Main window frame appears centered at previous desktop coordinates with loading status.',
      emotionalState: 'confident',
      frictionRisk: 'Database server offline or unmapped ESS_SERVER environment variable.',
      technicalTouchpoint: 'SQLOLEDB cnApp.Open with Trusted_Connection=Yes.',
      kpiMetric: 'Cold startup time < 1.8 seconds'
    },
    {
      stepIndex: 2,
      phase: 'Phase 2: Horizon & Filter Selection',
      userGoal: 'Specify 12-month rolling forecast criteria for Q4 review',
      userAction: 'User selects Chicago Warehouse, sets probability threshold to 50%, picks October 2026 as start month, and selects active proposal types.',
      systemResponse: 'Dropdown combos validate input. Linked end month updates automatically to September 2027. Filter auto-refresh triggers.',
      uiScreenMock: 'Multi-criteria filter strip at top: Warehouse, AE, Company, Probability (50%), 12-Month horizon.',
      emotionalState: 'neutral',
      frictionRisk: 'Selecting a non-existent warehouse group or date range inverted.',
      technicalTouchpoint: 'Local registry persistence + debounced parameter validation.',
      kpiMetric: 'Filter change response < 50ms'
    },
    {
      stepIndex: 3,
      phase: 'Phase 3: 14-Recordset Pipeline Execution',
      userGoal: 'Query multi-dimensional sales projections',
      userAction: 'User clicks "Execute Query". Loading progress meter displays.',
      systemResponse: 'Backend executes stored procedure get_sales_forecast_quoted_by_warehouse, streaming back 14 distinct recordsets in NextRecordset order.',
      uiScreenMock: 'Status label: "Fetching records from warehouse SQL server... 14 recordsets processed."',
      emotionalState: 'confident',
      frictionRisk: 'Slow SQL query execution on heavy multi-warehouse enterprise databases.',
      technicalTouchpoint: 'Async ADODB.Command execution with 14 NextRecordset calls.',
      kpiMetric: 'Query & hydration completed in < 4.2 seconds'
    },
    {
      stepIndex: 4,
      phase: 'Phase 4: Hierarchical Tree Analysis',
      userGoal: 'Inspect company branch projections and drill down to individual projects',
      userAction: 'User expands "Acme Corp" node. Child project rows expand displaying monthly quoted values.',
      systemResponse: 'ColumnTreeViewStateHelper calculates dynamic parent dollar rollup, updates grid column colors, and maintains scroll position.',
      uiScreenMock: 'Hierarchical tree grid: Company > Parent > Project × Warehouse with 12 monthly columns in thousands ($K).',
      emotionalState: 'confident',
      frictionRisk: 'Flickering during tree row expansion on legacy UI controls.',
      technicalTouchpoint: 'ColumnTreeViewStateHelper.cls tree expand state management.',
      kpiMetric: 'Node expand/collapse latency < 15ms'
    },
    {
      stepIndex: 5,
      phase: 'Phase 5: Executive Excel Export',
      userGoal: 'Export tree view with formatting for CFO presentation',
      userAction: 'User clicks "Export to Excel" button.',
      systemResponse: 'System initializes Excel COM automation, creates multi-level collapsible row outlines, colors header rows, and opens formatted workbook.',
      uiScreenMock: 'Progress modal: "Generating Excel Workbook with Outline Groups..." followed by Excel window opening.',
      emotionalState: 'relieved',
      frictionRisk: 'Missing Excel desktop installation or COM permission lock.',
      technicalTouchpoint: 'Win32 COM automation with OleTranslateColor palette mappings.',
      kpiMetric: 'Excel generation < 5 seconds for 2,000 rows'
    },
    {
      stepIndex: 6,
      phase: 'Phase 6: Sibling Tool Deep Dive',
      userGoal: 'Modify quote line items in sibling Project Maintenance app',
      userAction: 'User right-clicks Project #PRJ-8819 and selects "Launch Project Maintenance".',
      systemResponse: 'System invokes Win32 CreateProcess with project parameter. Project Maintenance launches with project context pre-loaded.',
      uiScreenMock: 'Project Maintenance window opens with #PRJ-8819 details.',
      emotionalState: 'satisfied',
      frictionRisk: 'Sibling EXE path not found in application directory.',
      technicalTouchpoint: 'Win32 CreateProcessA(ProjectMaintenance.exe PRJ-8819).',
      kpiMetric: 'Tool launch latency < 800ms'
    }
  ],

  recommendedHours: 550,
  hourIndex: 0.64,
  locIndex: 0.42,
  confidenceScore: 92
};
