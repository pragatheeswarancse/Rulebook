import { EngineeringProject } from '../types/project';
import { SALES_FORECAST_DOCUMENT } from './salesForecastAnalysisData';
import { FLOW_NODES, FLOW_EDGES } from './flowmapData';
import { FSD_API_ENDPOINTS, FSD_DATABASE_ENTITIES, FSD_BUSINESS_RULES } from './fsdData';
import { BRD_REQUIREMENTS, BRD_AS_IS_VS_TO_BE, BRD_ROI_METRICS, BRD_STAKEHOLDERS } from './brdData';
import { ESTIMATION_TASKS } from './estimationData';
import { USER_JOURNEYS } from './userJourneyData';

export const PRELOADED_PROJECTS: EngineeringProject[] = [
  // ========================================================
  // PROJECT 1: SALES FORECAST MODERNIZATION (ATTACHED PDF)
  // ========================================================
  {
    id: 'proj-sales-forecast',
    name: 'Sales Forecast Modernization & LOC Estimation',
    clientName: 'Commercial Operations & Logistics Group',
    domain: 'Enterprise Modernization',
    currentStack: 'Visual Basic 6 Desktop EXE',
    targetStack: 'Finesse-Style .NET WinForms / Web API',
    sourceDocName: 'CD-Sales_Forecast_Analysis__LOC_Count__Comparison__and_ETA_Estimation-281026-084501_f749799f.pdf',
    sourceDocPath: '/public/assets/aistudio/CD-Sales_Forecast_Analysis__LOC_Count__Comparison__and_ETA_Estimation-281026-084501_f749799f.pdf',
    fileSizeBytes: 284109,
    uploadedAt: '16 Sep 2026',
    status: 'ready',

    prd: {
      visionStatement: 'Modernize the legacy VB6 Sales Forecast desktop tool to a high-performance .NET WinForms application with asynchronous multi-recordset data pipelines, dynamic hierarchical money grids, and seamless Excel COM exports.',
      targetAudience: [
        {
          persona: 'Commercial Operations Analyst',
          description: 'Tracks quarterly revenue milestones across warehouse branches.',
          coreNeed: 'Instant filter adjustments without application lockup during 14-recordset hydration.'
        },
        {
          persona: 'Account Executive (AE)',
          description: 'Monitors quoted proposal pipeline and job-costing probability thresholds.',
          coreNeed: 'Dynamic show/hide for Ops columns and one-click launch of sibling Project Maintenance tools.'
        },
        {
          persona: 'Chief Financial Officer',
          description: 'Reviews consolidated enterprise revenue projections by company group.',
          coreNeed: 'Formatted multi-level Excel workbook exports with outline groupings and $K currency formatting.'
        }
      ],
      problemStatement: 'The legacy VB6 EXE suffers from single-threaded UI freezes during heavy SQL queries, lack of 64-bit compatibility, and tight coupling to deprecated COM libraries, risking mission-critical sales forecasting operations.',
      valueProposition: 'Delivers a modernized, maintainable 64-bit codebase that preserves identical business logic (BR-01 to BR-19) and 14-recordset contracts while slashing query wait times and eliminating application crashes.',
      successMetrics: [
        { metric: 'UI Freeze / Lockup Latency', target: '<50ms (Async)', baseline: '12-18 seconds in VB6' },
        { metric: 'Tree Expand/Collapse FPS', target: '60 FPS (Virtual Grid)', baseline: 'Flickering / Stutter' },
        { metric: 'Excel COM Export Speed', target: '<4 seconds for 3,000 rows', baseline: '25-35 seconds' }
      ],
      coreWorkflows: [
        {
          workflowName: '12-Month Horizon Financial Projection',
          steps: ['Select Warehouse & Account Executives', 'Set Probability Threshold (e.g., >=50%)', 'Choose 12-Month Rolling Date Window', 'Stream 14 Recordsets Asynchronously', 'Render Collapsible Company / Project Tree'],
          outcome: 'Reconciled forward revenue projections displayed in thousands.'
        },
        {
          workflowName: 'Executive Reporting & Sibling Maintenance Launch',
          steps: ['Inspect Project Row in Hierarchical Grid', 'Export Formatted Outlined Excel Spreadsheet', 'Right-Click Project to Launch Sibling Maintenance EXE'],
          outcome: 'Direct drill-down into sibling systems without manual data re-entry.'
        }
      ]
    },

    brd: {
      objectives: [
        'Eliminate legacy VB6 runtime dependencies across enterprise workstations.',
        'Preserve 100% parity for 26 active functional behaviors (F-01 to F-26).',
        'Maintain exact SQL stored procedure interface contract (get_sales_forecast_quoted_by_warehouse, 14 recordsets).',
        'Calibrate delivery cost against Project Calendar (860h) and Scheduling Board (1,480h) benchmarks.'
      ],
      stakeholders: [
        { role: 'Product Sponsor', name: 'Commercial Technology Director', raci: 'Accountable (A)', responsibility: 'Approves budget, timeline index (0.64 vs Calendar), and release milestones.' },
        { role: 'Lead Architect', name: 'Senior Modernization Architect', raci: 'Responsible (R)', responsibility: 'Validates .NET WinForms architecture, NextRecordset mapping, and Win32 interop.' },
        { role: 'Business Analyst', name: 'Akshara Karikalan', raci: 'Consulted (C)', responsibility: 'Performed source scan, LOC analysis, and dead code classification.' },
        { role: 'QA Lead', name: 'Enterprise QA Manager', raci: 'Responsible (R)', responsibility: 'Executes cross-permutation test matrix comparing legacy VB6 output against .NET output.' }
      ],
      requirements: [
        {
          id: 'BRD-SF-01',
          module: 'Security & Access',
          title: 'SQL Role-Based Scoped Visibility',
          description: 'The modernized tool must enforce SalesForecastSuperUsers role for global billing company views, while standard users default strictly to their assigned home warehouse and company.',
          businessValue: 'Protects commercial pricing privacy across competing regional warehouse divisions.',
          priority: 'Must Have',
          acceptanceCriteria: ['Standard users can only query their authorized warehouse ID.', 'Super-users receive dropdown with "All Companies (Flat)" mode enabled.'],
          stakeholder: 'Commercial Technology Director'
        },
        {
          id: 'BRD-SF-02',
          module: 'Data Pipeline',
          title: 'Asynchronous 14-Recordset Stored Procedure Execution',
          description: 'Must stream get_sales_forecast_quoted_by_warehouse asynchronously with strict NextRecordset sequencing, displaying non-blocking progress to the user.',
          businessValue: 'Eliminates desktop freezing and prevents OS "Not Responding" false crashes.',
          priority: 'Must Have',
          acceptanceCriteria: ['Async execution allows user cancellation at any point.', 'All 14 recordsets mapped into domain models with zero data truncation.'],
          stakeholder: 'Lead Architect'
        },
        {
          id: 'BRD-SF-03',
          module: 'Presentation',
          title: 'Hierarchical Tree Render with Outlined Parent Dollars',
          description: 'Render multi-level Company > Parent > Project tree grid with 12 monthly columns formatted in thousands, hiding parent dollars when expanded.',
          businessValue: 'Preserves identical executive visual semantics from legacy system.',
          priority: 'Must Have',
          acceptanceCriteria: ['Expand/collapse transitions preserve scroll bar position.', 'Totals update dynamically when filter probability threshold shifts.'],
          stakeholder: 'Commercial Operations Analyst'
        },
        {
          id: 'BRD-SF-04',
          module: 'Integration',
          title: 'Outlined Excel Export & Sibling EXE Launchers',
          description: 'Automate Excel export with collapsible outline levels and launch sibling tools (Project Maintenance, Bid Report, Quote Report, Invoicing vs Bid) with context parameters.',
          businessValue: 'Supports executive CFO reporting and daily operational job-costing workflows.',
          priority: 'Should Have',
          acceptanceCriteria: ['Excel export builds outline levels 1 through 3 automatically.', 'Sibling tools launch in normal window state with active project number.'],
          stakeholder: 'Account Executive'
        }
      ],
      asIsVsToBe: [
        {
          area: 'Execution Architecture',
          asIs: 'Single-threaded Visual Basic 6 desktop EXE with blocking ADODB recordsets; crashes on network timeout.',
          toBe: 'Multi-threaded 64-bit .NET WinForms application with asynchronous task-based data streaming.',
          impact: '100% elimination of UI freezes and full 64-bit OS compatibility'
        },
        {
          area: 'Code Base & Maintainability',
          asIs: '3,718 total lines in folder cluttered with dead option button handlers, VSS junk, and 480 lines of unused shared dump.',
          toBe: '1,849 clean, refactored C# application logic lines with strongly-typed DTOs and clean Win32 wrappers.',
          impact: '50% reduction in codebase surface area and elimination of technical debt'
        },
        {
          area: 'State & Tree Navigation',
          asIs: 'Scroll position lost on tree node expand/collapse; parent dollars display duplicates child amounts.',
          toBe: 'ColumnTreeViewStateHelper ported to .NET with virtualized rendering and clean parent summarization.',
          impact: 'Fluid 60 FPS scrolling and zero visual clutter'
        }
      ],
      roiMetrics: [
        { metric: 'Necessary LOC Refactored', value: '1,849 lines', context: 'From 3,718 gross lines in legacy folder' },
        { metric: 'Modernization Effort', value: '550 hours', context: '0.64 index vs Project Calendar (860h)' },
        { metric: 'Active Features Ported', value: '26 of 26', context: 'F-01 through F-26 with zero scope drop' },
        { metric: 'Query Pipeline Latency', value: '<2.2 sec', context: 'Down from 12-18 sec in single-threaded VB6' }
      ]
    },

    fsd: {
      architectureTopology: '.NET WinForms Client with Task-based Asynchronous Stored Procedure Hydration and Win32 Process Spawning.',
      endpoints: [
        {
          module: 'Data Ingestion Pipeline',
          name: 'get_sales_forecast_quoted_by_warehouse',
          method: 'POST',
          endpoint: 'EXEC get_sales_forecast_quoted_by_warehouse',
          description: 'Executes complex SQL stored procedure returning 14 sequential recordsets containing warehouse projections, company rollups, and project details.',
          headers: { 'Connection': 'SQLOLEDB / Microsoft.Data.SqlClient' },
          requestBody: '{\n  "warehouseId": "WH_CHICAGO_01",\n  "accountExecId": "AE_991",\n  "probabilityThreshold": 50,\n  "startMonth": "2026-10-01",\n  "endMonth": "2027-09-30",\n  "includeProposalTypes": [1, 2]\n}',
          responseBody: '{\n  "recordsetCount": 14,\n  "recordsetSequence": [\n    "Metadata",\n    "CompanyHierarchy",\n    "ProjectWarehouseRollup",\n    "MonthlyQuotedValues",\n    "RFIActuals",\n    "TopLineSummary",\n    "GrandTotals"\n  ],\n  "status": "SUCCESS"\n}',
          securityScope: 'SQL Role: SalesForecastSuperUsers or WarehouseScopedUser',
          validationRules: [
            'Must iterate NextRecordset in exact sequence or ADODB stream corrupts',
            'Start month and end month must define a valid 12-month rolling horizon'
          ]
        },
        {
          module: 'Tool Orchestration',
          name: 'Launch Sibling Project Maintenance',
          method: 'POST',
          endpoint: 'Win32 CreateProcessA',
          description: 'Launches sibling executable passing active selected project number as command-line parameter.',
          headers: { 'Interop': 'P/Invoke kernel32.dll' },
          requestBody: '{\n  "executable": "ProjectMaintenance.exe",\n  "commandArgs": "/PROJECT=PRJ-8819",\n  "windowState": "SW_SHOWNORMAL"\n}',
          responseBody: '{\n  "processId": 14920,\n  "status": "SPAWNED"\n}',
          securityScope: 'Windows User Execution Context',
          validationRules: [
            'Project number must match alphanumeric format PRJ-[0-9]{4,8}',
            'Verify sibling EXE exists in application directory prior to invocation'
          ]
        }
      ],
      entities: [
        {
          tableName: 'frmSalesForecast (Form State)',
          description: 'Desktop form state holding active filters, tree node pointers, and 12-month date window.',
          columns: [
            { name: 'SelectedWarehouseId', type: 'VARCHAR(32)', nullable: false, isPrimary: true, description: 'Active warehouse combo selection' },
            { name: 'ProbabilityThreshold', type: 'INTEGER', nullable: false, description: 'Minimum probability threshold (0, 25, 50, 75, 100)' },
            { name: 'StartMonth', type: 'DATE', nullable: false, description: 'Starting calendar month for 12-month horizon' },
            { name: 'EndMonth', type: 'DATE', nullable: false, description: 'Calculated ending month (StartMonth + 11 months)' },
            { name: 'IsSuperUserMode', type: 'BOOLEAN', nullable: false, description: 'True if user possesses SalesForecastSuperUsers role' }
          ],
          indices: ['Active In-Memory Form State']
        }
      ],
      businessRules: [
        { ruleCode: 'BR-01', title: '12-Month Money Horizon', description: 'Grid columns project exactly 12 consecutive calendar months starting from user-selected start month, displayed in thousands ($K).' },
        { ruleCode: 'BR-02', title: 'Probability Cutoff Rule', description: 'Only proposals with probability >= selected threshold are aggregated into forward forecast columns.' },
        { ruleCode: 'BR-03', title: 'Parent Dollar Summarization', description: 'When child rows are expanded, parent line item dollars are hidden to avoid visual double-counting.' },
        { ruleCode: 'BR-04', title: 'Read-Only Security Guarantee', description: 'The application contains zero INSERT or UPDATE statements; all forecast views are non-destructive queries.' }
      ]
    },

    estimation: {
      totalLoc: 3718,
      necessaryLoc: 1849,
      recommendedHours: 550,
      hourIndex: 0.64,
      confidenceScore: 92,
      tasks: [
        {
          id: 'TSK-SF-01',
          wbsCode: '1.1',
          sprint: 1,
          title: 'Data Access Layer & 14-Recordset Pipeline Port',
          category: 'Backend',
          optimisticDays: 4,
          mostLikelyDays: 6,
          pessimisticDays: 9,
          storyPoints: 8,
          assignedRole: 'Senior Backend Engineer',
          deliverables: 'C# async client mapping get_sales_forecast_quoted_by_warehouse 14 recordsets.'
        },
        {
          id: 'TSK-SF-02',
          wbsCode: '1.2',
          sprint: 1,
          title: 'Filter Panel UI & Registry State Persistence',
          category: 'Frontend',
          optimisticDays: 3,
          mostLikelyDays: 4,
          pessimisticDays: 6,
          storyPoints: 5,
          assignedRole: 'Senior Full-Stack Engineer',
          deliverables: 'Warehouse, AE, Company, Probability, and 12-month date horizon combos.'
        },
        {
          id: 'TSK-SF-03',
          wbsCode: '2.1',
          sprint: 2,
          title: 'Hierarchical Tree Render & ColumnTreeViewStateHelper Port',
          category: 'Frontend',
          optimisticDays: 5,
          mostLikelyDays: 7,
          pessimisticDays: 10,
          storyPoints: 8,
          assignedRole: 'Senior Full-Stack Engineer',
          deliverables: 'Multi-level virtualized grid with color actuals and parent dollar suppression.'
        },
        {
          id: 'TSK-SF-04',
          wbsCode: '2.2',
          sprint: 2,
          title: 'Excel COM Automation with Outline Grouping',
          category: 'Frontend',
          optimisticDays: 3,
          mostLikelyDays: 4,
          pessimisticDays: 7,
          storyPoints: 5,
          assignedRole: 'Senior Full-Stack Engineer',
          deliverables: 'Formatted workbook export with 3-level outline hierarchy and color schemes.'
        },
        {
          id: 'TSK-SF-05',
          wbsCode: '3.1',
          sprint: 3,
          title: 'Win32 Sibling Process Spawner (4 EXEs) & Security Roles',
          category: 'Security & RBAC',
          optimisticDays: 3,
          mostLikelyDays: 4,
          pessimisticDays: 6,
          storyPoints: 5,
          assignedRole: 'Senior Backend Engineer',
          deliverables: 'P/Invoke CreateProcess wrappers for Project Maintenance, Bid Report, Quote Report, Inv vs Bid.'
        },
        {
          id: 'TSK-SF-06',
          wbsCode: '3.2',
          sprint: 3,
          title: 'Cross-Permutation QA Verification vs VB6 Baseline',
          category: 'QA & Testing',
          optimisticDays: 4,
          mostLikelyDays: 6,
          pessimisticDays: 8,
          storyPoints: 8,
          assignedRole: 'Senior QA Automation Engineer',
          deliverables: 'Automated test suite verifying dollar parity across 500 test warehouse combinations.'
        }
      ]
    },

    flowmap: {
      nodes: SALES_FORECAST_DOCUMENT.flowNodes,
      edges: SALES_FORECAST_DOCUMENT.flowEdges
    },

    userJourney: {
      personaName: 'Alex Mercer',
      roleTitle: 'Senior Finance & Operations Analyst',
      steps: SALES_FORECAST_DOCUMENT.userJourneySteps
    },

    rawDocument: SALES_FORECAST_DOCUMENT
  },

  // ========================================================
  // PROJECT 2: EDUPULSE SCHOOL ATTENDANCE ERP (FIRST TURN)
  // ========================================================
  {
    id: 'proj-edupulse-attendance',
    name: 'EduPulse School Attendance & Administration Management',
    clientName: 'Oakridge Unified School District',
    domain: 'EdTech & Governance',
    currentStack: 'Paper Registers & Fragmented Spreadsheets',
    targetStack: 'Enterprise React 19 + Node.js Microservices + PostgreSQL',
    sourceDocName: 'Screenshot_2026-10-29_134800_fc761e24.png',
    sourceDocPath: '/public/assets/aistudio/Screenshot_2026-10-29_134800_fc761e24.png',
    fileSizeBytes: 142090,
    uploadedAt: '29 Oct 2026',
    status: 'ready',

    prd: {
      visionStatement: 'A legally compliant, role-partitioned school attendance ERP eliminating paperwork, securing child safety via instant truancy messaging, and enforcing automated 09:30 AM cutoff lockout with an administrative override escalation loop.',
      targetAudience: [
        {
          persona: 'Classroom Homeroom Teacher',
          description: 'Conducts morning roll call for 30+ students.',
          coreNeed: '1-click "Mark All Present" interface completing attendance in under 45 seconds.'
        },
        {
          persona: 'School Principal & Chief Administrator',
          description: 'Governs school-wide compliance and legal records.',
          coreNeed: 'Live KPI command center and centralized queue to adjudicate post-cutoff override requests.'
        },
        {
          persona: 'District Compliance Inspector',
          description: 'Audits Average Daily Attendance (ADA) for state funding.',
          coreNeed: 'Cryptographically signed audit trails and chronic absenteeism flags.'
        }
      ],
      problemStatement: 'Manual paper registers cause 18 minutes of daily teacher administrative drag, morning lobby bottlenecks, untracked record alterations, and hours of delay informing parents of missing children.',
      valueProposition: 'Cuts morning roll-call time by 75%, eliminates unauthorized record tampering through hard 09:30 AM cutoff locking, and delivers instant parental truancy alerts within 2 minutes.',
      successMetrics: [
        { metric: 'Morning Roll-Call Duration', target: '<45 seconds per classroom', baseline: '15-20 minutes' },
        { metric: 'Cutoff Lockout Accuracy', target: '100% at 09:30:00 AM', baseline: 'No lockouts (Tampering risk)' },
        { metric: 'Parent Truancy Alert Latency', target: '<2 minutes post-cutoff', baseline: '4-6 hours' }
      ],
      coreWorkflows: [
        {
          workflowName: 'Teacher Morning Roll Call & Exception Escalation',
          steps: ['Arrive on campus & submit GPS-verified check-in', 'Open assigned class roster (Grade 10-B)', '1-Click "Mark All Present" with quick toggles', 'Session locks automatically at 09:30 AM', 'File Restricted Admin Override Request for late arrivals'],
          outcome: 'Official attendance register locked with complete audit defensibility.'
        },
        {
          workflowName: 'Administrator Triage & Compliance Certification',
          steps: ['Scan live KPI dashboard', 'Review pending override requests in global records', 'Approve override with mandatory justification note', 'Export signed monthly state compliance PDF'],
          outcome: 'Amended attendance records synchronized with state funding compliance.'
        }
      ]
    },

    brd: {
      objectives: [
        'Partition system access strictly between School Administrators and Teachers.',
        'Enforce automated daily cutoff locking at 09:30 AM campus time.',
        'Provide dual-key administrative override escalation with cryptographic audit logging.',
        'Generate certified compliance exports for state education boards.'
      ],
      stakeholders: BRD_STAKEHOLDERS,
      requirements: BRD_REQUIREMENTS,
      asIsVsToBe: BRD_AS_IS_VS_TO_BE,
      roiMetrics: BRD_ROI_METRICS
    },

    fsd: {
      architectureTopology: 'React 19 SPA + Node.js API Gateway with Scoped JWT Claims + PostgreSQL RLS + Redis Pub/Sub',
      endpoints: FSD_API_ENDPOINTS,
      entities: FSD_DATABASE_ENTITIES,
      businessRules: FSD_BUSINESS_RULES
    },

    estimation: {
      totalLoc: 4406,
      necessaryLoc: 2850,
      recommendedHours: 860,
      hourIndex: 1.0,
      confidenceScore: 95,
      tasks: ESTIMATION_TASKS
    },

    flowmap: {
      nodes: FLOW_NODES,
      edges: FLOW_EDGES
    },

    userJourney: {
      personaName: 'Mrs. Eleanor Vance',
      roleTitle: 'Faculty Class Teacher (Grade 10-B)',
      steps: USER_JOURNEYS[0].steps
    }
  }
];
