import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  GitBranch, 
  ChevronRight, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  LogIn, 
  Gauge, 
  Users, 
  Settings, 
  FileText, 
  Clock, 
  ShieldCheck, 
  CheckSquare, 
  ArrowRight, 
  Zap, 
  XCircle, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search,
  Filter,
  Layers,
  GraduationCap,
  Bus,
  CreditCard,
  UserCheck,
  Shield,
  Check,
  Maximize2,
  Minimize2,
  FolderTree,
  ListOrdered,
  Table
} from 'lucide-react';
import { BranchingRoleMapData, AccessRecord } from '../../types/rulebook';

interface Props {
  roleMap: BranchingRoleMapData;
  accessRoles?: AccessRecord[];
  projectName?: string;
  onOpenSourcePage: (page: number) => void;
}

export interface TreeAction {
  id: string;
  name: string;
  roleId: string;
  roleName: string;
  moduleId: string;
  moduleName: string;
  permission: 'Allow' | 'Deny' | 'Scoped';
  scopeType: 'Global' | 'Assigned Only' | 'Linked Record Only';
  techDetail: string;
  reqCode: string;
  testCase?: string;
  sourcePage: number;
  sourcePassage: string;
  inputs?: string[];
  outputs?: string[];
  isDecision?: boolean;
  handoffTo?: {
    roleId: string;
    roleName: string;
    actionId: string;
    actionName: string;
    label: string;
  };
}

export interface TreeModule {
  id: string;
  name: string;
  roleId: string;
  actions: TreeAction[];
}

export interface TreeRole {
  id: string;
  name: string;
  shortName: string;
  tier: string;
  scopeBadge: string;
  themeColor: 'emerald' | 'indigo' | 'teal' | 'slate';
  description: string;
  modules: TreeModule[];
}

export const BranchingRoleMapSection: React.FC<Props> = ({
  roleMap,
  accessRoles = [],
  projectName = '',
  onOpenSourcePage
}) => {
  const [selectedAction, setSelectedAction] = useState<TreeAction | null>(null);
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('all');
  const [activePermissionFilter, setActivePermissionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'tree' | 'swimlanes' | 'matrix'>('tree');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [enableAnimations, setEnableAnimations] = useState<boolean>(true);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<Array<{ id: string; d: string; color: string; isHandoff?: boolean; label?: string }>>([]);

  const isSchoolAdminProject = projectName.toLowerCase().includes('parent') || 
                               projectName.toLowerCase().includes('administration') || 
                               projectName.toLowerCase().includes('school');

  // =========================================================================
  // 1. DATA: School Administration and Parent Management FSD Hierarchy
  // =========================================================================
  const schoolAdminTree: TreeRole[] = useMemo(() => [
    {
      id: 'role-admin',
      name: 'School Administrator',
      shortName: 'Admin',
      tier: 'Tier 1 · Governance',
      scopeBadge: 'Global Scope',
      themeColor: 'emerald',
      description: 'Central administrative governance over teachers, students, exam papers, fee structures, and payroll.',
      modules: [
        {
          id: 'mod-admin-staff',
          name: 'Staff Accounts',
          roleId: 'role-admin',
          actions: [
            {
              id: 'act-admin-add-staff',
              name: 'Add Staff Account',
              roleId: 'role-admin',
              roleName: 'School Administrator',
              moduleId: 'mod-admin-staff',
              moduleName: 'Staff Accounts',
              permission: 'Allow',
              scopeType: 'Global',
              techDetail: 'POST /api/v1/admin/teachers { name, subject, salary, email }',
              reqCode: 'FR-TCH-001',
              testCase: 'TC-001',
              sourcePage: 2,
              sourcePassage: 'FR-TCH-001: Admin creates and provisions teacher accounts across all departments with RSA keys.',
              inputs: ['Staff Profile Payload', 'Department ID', 'Salary Baseline'],
              outputs: ['Created Teacher Profile', 'Signed Initial Credentials']
            },
            {
              id: 'act-admin-edit-staff',
              name: 'Edit Staff Details',
              roleId: 'role-admin',
              roleName: 'School Administrator',
              moduleId: 'mod-admin-staff',
              moduleName: 'Staff Accounts',
              permission: 'Allow',
              scopeType: 'Global',
              techDetail: 'PUT /api/v1/admin/teachers/:id { department, salary, permissions }',
              reqCode: 'FR-TCH-002',
              testCase: 'TC-002',
              sourcePage: 2,
              sourcePassage: 'FR-TCH-002: Admin updates teacher assignment, status, and payroll parameters.',
              inputs: ['Updated Fields Array'],
              outputs: ['Audit Log Entry', 'Updated Record']
            }
          ]
        },
        {
          id: 'mod-admin-exam',
          name: 'Question Papers',
          roleId: 'role-admin',
          actions: [
            {
              id: 'act-admin-approve-paper',
              name: 'Approve Question Paper',
              roleId: 'role-admin',
              roleName: 'School Administrator',
              moduleId: 'mod-admin-exam',
              moduleName: 'Question Papers',
              permission: 'Allow',
              scopeType: 'Global',
              techDetail: 'POST /api/v1/admin/question-papers/:id/decision { decision: "Approved", signoffKey }',
              reqCode: 'FR-EXAM-003',
              testCase: 'TC-009',
              isDecision: true,
              sourcePage: 3,
              sourcePassage: 'FR-EXAM-003: Admin reviews drafted papers and marks decision. Approved papers are permanently locked for printing.',
              inputs: ['Submitted Exam Blueprint', 'Digital Signature Key'],
              outputs: ['Approved Exam Release', 'Printing License']
            },
            {
              id: 'act-admin-reject-paper',
              name: 'Reject with Revision Feedback',
              roleId: 'role-admin',
              roleName: 'School Administrator',
              moduleId: 'mod-admin-exam',
              moduleName: 'Question Papers',
              permission: 'Allow',
              scopeType: 'Global',
              techDetail: 'POST /api/v1/admin/question-papers/:id/decision { decision: "Rejected", feedback }',
              reqCode: 'FR-EXAM-004',
              testCase: 'TC-010',
              isDecision: true,
              sourcePage: 3,
              sourcePassage: 'FR-EXAM-004: Rejected papers return to the drafting teacher with revision notes.',
              inputs: ['Revision Feedback Text'],
              outputs: ['Revision Request Ticket to Teacher']
            }
          ]
        },
        {
          id: 'mod-admin-governance',
          name: 'Master Setup & Audit',
          roleId: 'role-admin',
          actions: [
            {
              id: 'act-admin-classes',
              name: 'Master Class Setup',
              roleId: 'role-admin',
              roleName: 'School Administrator',
              moduleId: 'mod-admin-governance',
              moduleName: 'Master Setup & Audit',
              permission: 'Allow',
              scopeType: 'Global',
              techDetail: 'POST /api/v1/admin/master/classes { gradeLevel, sections, subjects }',
              reqCode: 'FR-STD-004',
              sourcePage: 2,
              sourcePassage: 'FR-STD-004: Admin configures master academic entities: classes, sections, and subjects.',
              inputs: ['Curriculum Matrix'],
              outputs: ['Academic Class Registry']
            },
            {
              id: 'act-admin-attendance-override',
              name: 'Attendance Override',
              roleId: 'role-admin',
              roleName: 'School Administrator',
              moduleId: 'mod-admin-governance',
              moduleName: 'Master Setup & Audit',
              permission: 'Allow',
              scopeType: 'Global',
              techDetail: 'POST /api/v1/admin/attendance/override { studentId, date, reason }',
              reqCode: 'FR-ATT-001',
              testCase: 'TC-007',
              sourcePage: 2,
              sourcePassage: 'FR-ATT-001: Admin marks, views, and edits attendance for any student with audit trail.',
              inputs: ['Correction Reason', 'Student ID'],
              outputs: ['Audit-Stamped Attendance Correction']
            }
          ]
        }
      ]
    },
    {
      id: 'role-staff',
      name: 'Teacher / Staff',
      shortName: 'Staff',
      tier: 'Tier 2 · Operational',
      scopeBadge: 'Assigned Scope',
      themeColor: 'indigo',
      description: 'Classroom instructors managing assigned student records, daily morning/afternoon attendance, and authoring question papers.',
      modules: [
        {
          id: 'mod-staff-students',
          name: 'Students',
          roleId: 'role-staff',
          actions: [
            {
              id: 'act-staff-edit-student',
              name: 'Edit Assigned Student',
              roleId: 'role-staff',
              roleName: 'Teacher / Staff',
              moduleId: 'mod-staff-students',
              moduleName: 'Students',
              permission: 'Scoped',
              scopeType: 'Assigned Only',
              techDetail: 'PUT /api/v1/staff/classes/:classId/students/:id { permittedFields }',
              reqCode: 'FR-STD-002',
              testCase: 'TC-005',
              sourcePage: 2,
              sourcePassage: 'FR-STD-002: Staff edits permitted fields for assigned students only; cannot create students.',
              inputs: ['Assigned Class ID', 'Student Roll'],
              outputs: ['Updated Student Record']
            },
            {
              id: 'act-staff-add-student',
              name: 'Add New Student',
              roleId: 'role-staff',
              roleName: 'Teacher / Staff',
              moduleId: 'mod-staff-students',
              moduleName: 'Students',
              permission: 'Deny',
              scopeType: 'Assigned Only',
              techDetail: 'POST /api/v1/students -> HTTP 403 Forbidden (Admin only privilege)',
              reqCode: 'FR-STD-002',
              sourcePage: 2,
              sourcePassage: 'FR-STD-002: Staff cannot add students. Creation is strictly reserved for Admin.',
              inputs: ['Attempted Unauthorized Payload'],
              outputs: ['Security Violation 403']
            }
          ]
        },
        {
          id: 'mod-staff-attendance',
          name: 'Attendance',
          roleId: 'role-staff',
          actions: [
            {
              id: 'act-staff-record-attendance',
              name: 'Record Daily Attendance',
              roleId: 'role-staff',
              roleName: 'Teacher / Staff',
              moduleId: 'mod-staff-attendance',
              moduleName: 'Attendance',
              permission: 'Scoped',
              scopeType: 'Assigned Only',
              techDetail: 'POST /api/v1/staff/attendance/batch { classId: "10-A", session: "AM", records }',
              reqCode: 'FR-ATT-002',
              testCase: 'TC-006',
              sourcePage: 2,
              sourcePassage: 'FR-ATT-002: Staff marks and edits attendance for assigned students only; prevents duplicate records.',
              inputs: ['Class 10-A Roll', 'Status: Present / Absent / Late'],
              outputs: ['Classroom Session Batch', 'Truancy Push Event to Parents'],
              handoffTo: {
                roleId: 'role-parent',
                roleName: 'Parent',
                actionId: 'act-parent-view-attendance',
                actionName: 'View Daily Attendance',
                label: 'Auto-notifies Parent Portal'
              }
            }
          ]
        },
        {
          id: 'mod-staff-exam',
          name: 'Exam Authoring',
          roleId: 'role-staff',
          actions: [
            {
              id: 'act-staff-draft-paper',
              name: 'Draft & Submit Paper',
              roleId: 'role-staff',
              roleName: 'Teacher / Staff',
              moduleId: 'mod-staff-exam',
              moduleName: 'Exam Authoring',
              permission: 'Allow',
              scopeType: 'Assigned Only',
              techDetail: 'POST /api/v1/staff/question-papers { subjectId, questions, maxMarks }',
              reqCode: 'FR-EXAM-001',
              testCase: 'TC-008',
              sourcePage: 3,
              sourcePassage: 'FR-EXAM-001: Staff creates question papers with subject mapping and submits for administrative approval.',
              inputs: ['Question Set Payload', 'Subject Identifier'],
              outputs: ['Draft Paper Ticket'],
              handoffTo: {
                roleId: 'role-admin',
                roleName: 'School Administrator',
                actionId: 'act-admin-approve-paper',
                actionName: 'Approve Question Paper',
                label: 'Requires Admin Approval Gate'
              }
            },
            {
              id: 'act-staff-self-approve',
              name: 'Self-Approve Paper',
              roleId: 'role-staff',
              roleName: 'Teacher / Staff',
              moduleId: 'mod-staff-exam',
              moduleName: 'Exam Authoring',
              permission: 'Deny',
              scopeType: 'Assigned Only',
              techDetail: 'POST /api/v1/staff/question-papers/:id/approve -> HTTP 403 Forbidden',
              reqCode: 'FR-EXAM-006',
              testCase: 'TC-011',
              sourcePage: 3,
              sourcePassage: 'FR-EXAM-006: Self-approval is strictly forbidden. Only Admin holds authority to approve papers.',
              inputs: ['Self-Approval Attempt'],
              outputs: ['Enforced Security Denial 403']
            }
          ]
        }
      ]
    },
    {
      id: 'role-parent',
      name: 'Parent / Guardian',
      shortName: 'Parent',
      tier: 'Tier 3 · Self-Service',
      scopeBadge: 'Linked Child Only',
      themeColor: 'teal',
      description: 'Family guardians tracking linked children: real-time school bus GPS tracking, secure fee payments, and attendance review.',
      modules: [
        {
          id: 'mod-parent-bus',
          name: 'Bus tracking',
          roleId: 'role-parent',
          actions: [
            {
              id: 'act-parent-view-bus',
              name: 'View Live GPS Status',
              roleId: 'role-parent',
              roleName: 'Parent / Guardian',
              moduleId: 'mod-parent-bus',
              moduleName: 'Bus tracking',
              permission: 'Scoped',
              scopeType: 'Linked Record Only',
              techDetail: 'GET /api/v1/parent/telematics/bus-stream?studentId=STD-1092',
              reqCode: 'FR-BUS-001',
              sourcePage: 3,
              sourcePassage: 'FR-BUS-001: Parents view live GPS telematics, speed, and stop proximity for their linked child route only.',
              inputs: ['Linked Student Authorization Token'],
              outputs: ['Real-time Coordinates Feed', 'ETA Estimates']
            }
          ]
        },
        {
          id: 'mod-parent-fees',
          name: 'Fees',
          roleId: 'role-parent',
          actions: [
            {
              id: 'act-parent-pay-fees',
              name: 'Pay Online',
              roleId: 'role-parent',
              roleName: 'Parent / Guardian',
              moduleId: 'mod-parent-fees',
              moduleName: 'Fees',
              permission: 'Allow',
              scopeType: 'Linked Record Only',
              techDetail: 'POST /api/v1/parent/fees/checkout { studentId, term, paymentToken }',
              reqCode: 'FR-FEE-004',
              sourcePage: 4,
              sourcePassage: 'FR-FEE-004: Parents pay tuition and transport fees online via UPI, card, or net banking with instant receipt.',
              inputs: ['Outstanding Term Fee Balance', 'Payment Instrument'],
              outputs: ['Settlement Confirmation', 'GST Tax Invoice']
            },
            {
              id: 'act-parent-view-ledger',
              name: 'View Fee Invoices',
              roleId: 'role-parent',
              roleName: 'Parent / Guardian',
              moduleId: 'mod-parent-fees',
              moduleName: 'Fees',
              permission: 'Scoped',
              scopeType: 'Linked Record Only',
              techDetail: 'GET /api/v1/parent/fees/ledger?studentId=STD-1092',
              reqCode: 'FR-FEE-003',
              sourcePage: 4,
              sourcePassage: 'FR-FEE-003: Parents view detailed fee breakdown, past payment history, and due dates.',
              inputs: ['Student ID'],
              outputs: ['Ledger History']
            }
          ]
        },
        {
          id: 'mod-parent-attendance',
          name: 'Attendance & Reports',
          roleId: 'role-parent',
          actions: [
            {
              id: 'act-parent-view-attendance',
              name: 'View Daily Attendance',
              roleId: 'role-parent',
              roleName: 'Parent / Guardian',
              moduleId: 'mod-parent-attendance',
              moduleName: 'Attendance & Reports',
              permission: 'Scoped',
              scopeType: 'Linked Record Only',
              techDetail: 'GET /api/v1/parent/attendance?studentId=STD-1092&month=Current',
              reqCode: 'FR-ATT-003',
              sourcePage: 2,
              sourcePassage: 'FR-ATT-003: Parents view daily attendance status and absence alerts for their registered children.',
              inputs: ['Student ID'],
              outputs: ['Attendance Calendar View']
            }
          ]
        }
      ]
    }
  ], []);

  // =========================================================================
  // 2. DATA: Cycle Count Utility: PRD and FSD Overview for Inventory Management
  // =========================================================================
  const cycleCountTree: TreeRole[] = useMemo(() => [
    {
      id: 'role-cycle-counter',
      name: 'P1 · Cycle Counter / Warehouse Staff',
      shortName: 'Cycle Counter',
      tier: 'Tier 1 · Warehouse Floor Operations',
      scopeBadge: 'Floor & Scan Scope',
      themeColor: 'emerald',
      description: 'Performs physical inventory counts, scans barcodes to refresh receipt dates, checks in items found on projects, and verifies dimensions.',
      modules: [
        {
          id: 'mod-wh-counting',
          name: 'Cycle Count Execution',
          roleId: 'role-cycle-counter',
          actions: [
            {
              id: 'act-wh-scan',
              name: 'Scan Barcode & Refresh Receipt',
              roleId: 'role-cycle-counter',
              roleName: 'Cycle Counter',
              moduleId: 'mod-wh-counting',
              moduleName: 'Cycle Count Execution',
              permission: 'Allow',
              scopeType: 'Assigned Only',
              techDetail: 'SP dbo.Update_Barcode_Receipt_Date @barcode, OUT @IsFlagged',
              reqCode: 'F14',
              sourcePage: 33,
              sourcePassage: 'F14: Scans barcodes during a count. In-stock items get their receipt date refreshed; rows turn green on match.',
              inputs: ['Barcode Scan', 'Current Locations Grid'],
              outputs: ['Refreshed Receipt Date', 'Audio Confirmation Beep']
            },
            {
              id: 'act-wh-mark-counted',
              name: 'Mark Part As Counted',
              roleId: 'role-cycle-counter',
              roleName: 'Cycle Counter',
              moduleId: 'mod-wh-counting',
              moduleName: 'Cycle Count Execution',
              permission: 'Allow',
              scopeType: 'Assigned Only',
              techDetail: 'INSERT INTO WarehouseCycleCounts (warehouse, partno, lastcount, username)',
              reqCode: 'F13',
              sourcePage: 32,
              sourcePassage: 'F13: Inserts record to WarehouseCycleCounts with SQL login and server timestamp.',
              inputs: ['Selected Part Cell', 'Warehouse Entity'],
              outputs: ['WarehouseCycleCounts Record', 'Refreshed Parts Grid']
            },
            {
              id: 'act-wh-locate-bc',
              name: 'Locate Part Across Warehouses',
              roleId: 'role-cycle-counter',
              roleName: 'Cycle Counter',
              moduleId: 'mod-wh-counting',
              moduleName: 'Cycle Count Execution',
              permission: 'Allow',
              scopeType: 'Global',
              techDetail: 'Enter Barcode lookup in inpartsub / inpart',
              reqCode: 'F15',
              sourcePage: 34,
              sourcePassage: 'F15: Locates part by barcode across warehouses and injects row into parts list if from another warehouse.',
              inputs: ['Barcode Number'],
              outputs: ['Auto-selected Category, Part Group, and Part']
            }
          ]
        },
        {
          id: 'mod-wh-checkin',
          name: 'Check-In & MIA Relocation',
          roleId: 'role-cycle-counter',
          actions: [
            {
              id: 'act-wh-checkin',
              name: 'Check-in Project Item to Warehouse',
              roleId: 'role-cycle-counter',
              roleName: 'Cycle Counter',
              moduleId: 'mod-wh-checkin',
              moduleName: 'Check-In & MIA Relocation',
              permission: 'Allow',
              scopeType: 'Assigned Only',
              techDetail: 'SP part_checkin_with_barcode @unique_no, @to_bld=userWH, @to_batchno=INSTOCK',
              reqCode: 'F16',
              sourcePage: 35,
              sourcePassage: 'F16: Check item found on project back into user default warehouse INSTOCK with warehouse confirmation dialog.',
              inputs: ['Location Row', 'Default Warehouse Code'],
              outputs: ['INSTOCK Location Record', 'Warehouse Transfer Audit']
            },
            {
              id: 'act-wh-mia-move',
              name: 'Move Stray Item to MIA Order',
              roleId: 'role-cycle-counter',
              roleName: 'Cycle Counter',
              moduleId: 'mod-wh-checkin',
              moduleName: 'Check-In & MIA Relocation',
              permission: 'Allow',
              scopeType: 'Assigned Only',
              techDetail: 'DELETE dbo.MassTransferStaging_v; INSERT ...; EXEC commit_mass_transfer',
              reqCode: 'F17',
              sourcePage: 38,
              sourcePassage: 'F17: Mass transfer staging for missing or stray inventory items to personal MIA order.',
              inputs: ['Location Row', 'MIA Order Number', 'Transfer Quantity'],
              outputs: ['MIA Phase Transfer', 'Staging Batch Execution']
            }
          ]
        },
        {
          id: 'mod-wh-quality',
          name: 'Dimensions & Weight Quality',
          roleId: 'role-cycle-counter',
          actions: [
            {
              id: 'act-wh-verify-dims',
              name: 'Verify Dimensions & Weight',
              roleId: 'role-cycle-counter',
              roleName: 'Cycle Counter',
              moduleId: 'mod-wh-quality',
              moduleName: 'Dimensions & Weight Quality',
              permission: 'Allow',
              scopeType: 'Assigned Only',
              techDetail: 'UPDATE inpart SET dimsVerifiedDate=dbo.today(), dimsVerifiedUser=suser_sname()',
              reqCode: 'F11',
              sourcePage: 31,
              sourcePassage: 'F11: Click verification label to stamp dimensions or weight as verified by current user today.',
              inputs: ['Part Number', 'SUSER_SNAME()'],
              outputs: ['Verification Timestamp', 'Status Bar Indicator (Green)']
            }
          ]
        }
      ]
    },
    {
      id: 'role-inv-editor',
      name: 'P2 / P3 · Inventory & Parts Editors',
      shortName: 'Inventory Editor',
      tier: 'Tier 2 · Inventory & Master Data',
      scopeBadge: 'Catalog & Tools',
      themeColor: 'indigo',
      description: 'Manages inventory stock quantities, parts master catalog, and device maintenance launchers.',
      modules: [
        {
          id: 'mod-inv-launchers',
          name: 'Adjustment Launchers',
          roleId: 'role-inv-editor',
          actions: [
            {
              id: 'act-inv-add',
              name: 'Add / Remove Inventory Launchers',
              roleId: 'role-inv-editor',
              roleName: 'Inventory Editor',
              moduleId: 'mod-inv-launchers',
              moduleName: 'Adjustment Launchers',
              permission: 'Allow',
              scopeType: 'Global',
              techDetail: 'StartFinesseProcess("Add Inventory.exe", serialno) if can_edit_inventory = 1',
              reqCode: 'F19',
              sourcePage: 40,
              sourcePassage: 'F19: Contextual launcher for Add Inventory and Device Maintenance.',
              inputs: ['can_edit_inventory() = 1', 'Part / Serial Number'],
              outputs: ['External Tool Launch']
            },
            {
              id: 'act-parts-maint',
              name: 'Part Maintenance Launcher',
              roleId: 'role-inv-editor',
              roleName: 'Parts Editor',
              moduleId: 'mod-inv-launchers',
              moduleName: 'Adjustment Launchers',
              permission: 'Allow',
              scopeType: 'Global',
              techDetail: 'StartFinesseProcess("Part Maintenance.exe", partno) if can_edit_parts = 1',
              reqCode: 'F19',
              sourcePage: 40,
              sourcePassage: 'F19: Contextual launcher for Part Maintenance master catalog editor.',
              inputs: ['can_edit_parts() = 1', 'Part Number'],
              outputs: ['Part Maintenance Interface']
            }
          ]
        }
      ]
    },
    {
      id: 'role-wh-supervisor',
      name: 'P5 · Warehouse Supervisor & Reviewer',
      shortName: 'Supervisor',
      tier: 'Tier 3 · Audit & Discrepancy Governance',
      scopeBadge: 'Audit Scope',
      themeColor: 'teal',
      description: 'Multi-warehouse count reconciliation, operator audit inspection, and structured Excel export.',
      modules: [
        {
          id: 'mod-sup-audit',
          name: 'Check Up & Export Governance',
          roleId: 'role-wh-supervisor',
          actions: [
            {
              id: 'act-sup-checkup',
              name: 'Cycle Count Check Up Review',
              roleId: 'role-wh-supervisor',
              roleName: 'Supervisor',
              moduleId: 'mod-sup-audit',
              moduleName: 'Check Up & Export Governance',
              permission: 'Allow',
              scopeType: 'Global',
              techDetail: 'frmCycleCountCheckUp: warehouse combo -> dates grid -> users grid -> counted parts',
              reqCode: 'F23',
              sourcePage: 42,
              sourcePassage: 'F23: Review who counted what, and when by warehouse, date, and user.',
              inputs: ['Selected Warehouse', 'Date Range Filter'],
              outputs: ['Count Totals by Date & Operator', 'Discrepancy Audit']
            },
            {
              id: 'act-sup-excel',
              name: 'Export Parts Grid to Styled Excel',
              roleId: 'role-wh-supervisor',
              roleName: 'Supervisor',
              moduleId: 'mod-sup-audit',
              moduleName: 'Check Up & Export Governance',
              permission: 'Allow',
              scopeType: 'Global',
              techDetail: 'COM Interop export to Excel workbook with formatted percentage columns',
              reqCode: 'F21',
              sourcePage: 41,
              sourcePassage: 'F21: Copy every grid column and row into DataTable, write bulk range to Excel workbook.',
              inputs: ['Filtered Parts Grid Rows'],
              outputs: ['Cycle Count Excel Sheet']
            }
          ]
        }
      ]
    }
  ], []);

  // Generic fallback if user opened another project
  const genericTree: TreeRole[] = useMemo(() => {
    return [
      {
        id: 'role-gen-admin',
        name: 'Lead Systems Architect',
        shortName: 'Architect',
        tier: 'Tier 1 · Governance',
        scopeBadge: 'Global Scope',
        themeColor: 'emerald',
        description: 'System architecture, configuration baseline, and security policies.',
        modules: [
          {
            id: 'mod-gen-core',
            name: 'Core Services',
            roleId: 'role-gen-admin',
            actions: [
              {
                id: 'act-gen-1',
                name: 'Manage System Baseline',
                roleId: 'role-gen-admin',
                roleName: 'Lead Systems Architect',
                moduleId: 'mod-gen-core',
                moduleName: 'Core Services',
                permission: 'Allow',
                scopeType: 'Global',
                techDetail: 'POST /api/v1/system/configure',
                reqCode: 'FR-SYS-001',
                sourcePage: 1,
                sourcePassage: 'Administration baseline',
                inputs: ['Config'],
                outputs: ['State']
              }
            ]
          }
        ]
      }
    ];
  }, []);

  // Dynamic tree builder for custom uploaded projects
  const dynamicAccessTree: TreeRole[] | null = useMemo(() => {
    if (!accessRoles || accessRoles.length === 0) return null;
    
    // Group access roles by role name
    const roleGroups = new Map<string, AccessRecord[]>();
    accessRoles.forEach(r => {
      const existing = roleGroups.get(r.role) || [];
      existing.push(r);
      roleGroups.set(r.role, existing);
    });

    if (roleGroups.size === 0) return null;

    const colors: Array<'emerald' | 'indigo' | 'teal' | 'slate'> = ['emerald', 'indigo', 'teal', 'slate'];
    let roleIdx = 0;

    const generated: TreeRole[] = [];
    roleGroups.forEach((records, roleName) => {
      const themeColor = colors[roleIdx % colors.length];
      const tierLabel = roleIdx === 0 ? 'Tier 1 · Primary Operations' : roleIdx === 1 ? 'Tier 2 · Domain Management' : 'Tier 3 · Audit & Governance';
      
      // Group records into modules by resource
      const moduleMap = new Map<string, AccessRecord[]>();
      records.forEach(rec => {
        const modKey = rec.resource || 'Core Services';
        const arr = moduleMap.get(modKey) || [];
        arr.push(rec);
        moduleMap.set(modKey, arr);
      });

      const modules: TreeModule[] = [];
      let modIdx = 0;
      moduleMap.forEach((modRecords, modName) => {
        const moduleId = `mod-dyn-${roleIdx}-${modIdx}`;
        modules.push({
          id: moduleId,
          name: modName.slice(0, 30),
          roleId: `role-dyn-${roleIdx}`,
          actions: modRecords.map((rec, aIdx) => ({
            id: `act-dyn-${roleIdx}-${modIdx}-${aIdx}`,
            name: rec.action,
            roleId: `role-dyn-${roleIdx}`,
            roleName: rec.role,
            moduleId,
            moduleName: modName.slice(0, 30),
            permission: rec.effect === 'Deny' ? 'Deny' as const : rec.effect === 'Require' ? 'Scoped' as const : 'Allow' as const,
            scopeType: rec.recordScope === 'Global' ? 'Global' as const : rec.recordScope === 'Assigned' ? 'Assigned Only' as const : 'Linked Record Only' as const,
            techDetail: `${rec.action} on ${rec.resource}`,
            reqCode: `FR-0${aIdx + 1}`,
            sourcePage: rec.provenance?.page || 1,
            sourcePassage: rec.provenance?.passage || rec.conditions || `${rec.role}: ${rec.action}`,
            inputs: ['Authorized Session', rec.resource],
            outputs: ['Execution State', 'Audit Event']
          }))
        });
        modIdx++;
      });

      generated.push({
        id: `role-dyn-${roleIdx}`,
        name: roleName,
        shortName: roleName.split(' ')[0] || roleName,
        tier: tierLabel,
        scopeBadge: records[0]?.recordScope === 'Global' ? 'Global Scope' : 'Assigned Scope',
        themeColor,
        description: records[0]?.conditions || `${roleName} operational scope and permissions.`,
        modules
      });

      roleIdx++;
    });

    return generated.length > 0 ? generated : null;
  }, [accessRoles]);

  // Determine active tree
  const isCycleCount = projectName.toLowerCase().includes('cycle') || 
                       projectName.toLowerCase().includes('count') || 
                       projectName.toLowerCase().includes('inventory') ||
                       projectName.toLowerCase().includes('warehouse');

  const isStrictSchool = (projectName.toLowerCase().includes('school') || projectName.toLowerCase().includes('edupulse')) &&
                         (projectName.toLowerCase().includes('parent') || projectName.toLowerCase().includes('attendance') || projectName.toLowerCase().includes('teacher'));

  const activeTree: TreeRole[] = useMemo(() => {
    if (isCycleCount) return cycleCountTree;
    if (isStrictSchool) return schoolAdminTree;
    if (dynamicAccessTree && dynamicAccessTree.length > 0) return dynamicAccessTree;
    return genericTree;
  }, [isCycleCount, isStrictSchool, dynamicAccessTree, cycleCountTree, schoolAdminTree, genericTree]);

  // Filtered Roles
  const displayedRoles = useMemo(() => {
    return activeTree.filter(role => {
      if (activeRoleFilter !== 'all' && role.id !== activeRoleFilter) return false;
      return true;
    });
  }, [activeTree, activeRoleFilter]);

  // Recalculate SVG connector paths dynamically
  useEffect(() => {
    const updatePaths = () => {
      if (!canvasRef.current || viewMode !== 'tree') return;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newPaths: Array<{ id: string; d: string; color: string; isHandoff?: boolean; label?: string }> = [];

      displayedRoles.forEach(role => {
        const rolePort = document.getElementById(`port-out-${role.id}`);
        if (!rolePort) return;
        const roleRect = rolePort.getBoundingClientRect();
        const startX = roleRect.left - canvasRect.left + roleRect.width / 2;
        const startY = roleRect.top - canvasRect.top + roleRect.height / 2;

        role.modules.forEach(mod => {
          const modInPort = document.getElementById(`port-in-${mod.id}`);
          if (!modInPort) return;
          const modInRect = modInPort.getBoundingClientRect();
          const modInX = modInRect.left - canvasRect.left + modInRect.width / 2;
          const modInY = modInRect.top - canvasRect.top + modInRect.height / 2;

          // Bezier curve from Role to Module
          const dx1 = (modInX - startX) * 0.5;
          const d1 = `M ${startX} ${startY} C ${startX + dx1} ${startY}, ${modInX - dx1} ${modInY}, ${modInX} ${modInY}`;
          newPaths.push({
            id: `path-${role.id}-${mod.id}`,
            d: d1,
            color: role.themeColor === 'emerald' ? '#10b981' : role.themeColor === 'indigo' ? '#6366f1' : '#14b8a6'
          });

          // From Module Out to each Action In
          const modOutPort = document.getElementById(`port-out-${mod.id}`);
          if (!modOutPort) return;
          const modOutRect = modOutPort.getBoundingClientRect();
          const modOutX = modOutRect.left - canvasRect.left + modOutRect.width / 2;
          const modOutY = modOutRect.top - canvasRect.top + modOutRect.height / 2;

          mod.actions.forEach(action => {
            // Apply permission filter check
            if (activePermissionFilter !== 'all' && action.permission.toLowerCase() !== activePermissionFilter.toLowerCase()) return;
            if (searchQuery.trim() && !action.name.toLowerCase().includes(searchQuery.toLowerCase()) && !action.moduleName.toLowerCase().includes(searchQuery.toLowerCase())) return;

            const actPort = document.getElementById(`port-in-${action.id}`);
            if (!actPort) return;
            const actRect = actPort.getBoundingClientRect();
            const actX = actRect.left - canvasRect.left + actRect.width / 2;
            const actY = actRect.top - canvasRect.top + actRect.height / 2;

            const dx2 = (actX - modOutX) * 0.5;
            const d2 = `M ${modOutX} ${modOutY} C ${modOutX + dx2} ${modOutY}, ${actX - dx2} ${actY}, ${actX} ${actY}`;
            newPaths.push({
              id: `path-${mod.id}-${action.id}`,
              d: d2,
              color: action.permission === 'Allow' ? '#10b981' : action.permission === 'Deny' ? '#f43f5e' : '#6366f1'
            });

            // Cross-role handoffs
            if (action.handoffTo) {
              const targetPort = document.getElementById(`port-in-${action.handoffTo.actionId}`);
              if (targetPort) {
                const targetRect = targetPort.getBoundingClientRect();
                const tX = targetRect.left - canvasRect.left + targetRect.width / 2;
                const tY = targetRect.top - canvasRect.top + targetRect.height / 2;

                const handoffD = `M ${actX} ${actY} C ${actX + 60} ${actY}, ${tX - 60} ${tY}, ${tX} ${tY}`;
                newPaths.push({
                  id: `handoff-${action.id}-${action.handoffTo.actionId}`,
                  d: handoffD,
                  color: '#f59e0b',
                  isHandoff: true,
                  label: action.handoffTo.label
                });
              }
            }
          });
        });
      });

      setPaths(newPaths);
    };

    const timer = setTimeout(updatePaths, 100);
    window.addEventListener('resize', updatePaths);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePaths);
    };
  }, [displayedRoles, activePermissionFilter, searchQuery, zoomLevel, viewMode]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:px-4 sm:py-3 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-1.5 self-start md:self-auto text-xs">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'tree' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Branching Flowchart</span>
          </button>

          <button
            onClick={() => setViewMode('swimlanes')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'swimlanes' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Process Steps</span>
          </button>

          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'matrix' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>RBAC Matrix</span>
          </button>
        </div>

        {/* Center: Search & Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search flowchart..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={activeRoleFilter}
            onChange={(e) => setActiveRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            {activeTree.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <select
            value={activePermissionFilter}
            onChange={(e) => setActivePermissionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Permissions</option>
            <option value="allow">Allow</option>
            <option value="scoped">Scoped</option>
            <option value="deny">Deny</option>
          </select>
        </div>

        {/* Right: Zoom & Animation Controls */}
        <div className="flex items-center gap-1.5 self-end md:self-auto text-xs">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.1))}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] text-slate-500 w-10 text-center font-semibold">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 2. Main Flowchart Canvas View */}
      {viewMode === 'tree' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden relative">
          
          {/* Canvas Viewport */}
          <div 
            ref={canvasRef}
            className="p-8 sm:p-12 overflow-x-auto min-h-[580px] bg-[#fcfcfd] relative select-none"
            style={{
              backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* SVG Connecting Curves Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {paths.map(p => (
                <g key={p.id}>
                  <path
                    d={p.d}
                    fill="none"
                    stroke={p.color}
                    strokeWidth={p.isHandoff ? 2 : 2.5}
                    strokeDasharray={p.isHandoff ? "5,5" : undefined}
                    opacity={p.isHandoff ? 0.8 : 0.65}
                    className="transition-all duration-300"
                  />
                  {/* Animated Signal Particle */}
                  {enableAnimations && (
                    <circle r={p.isHandoff ? 3 : 2.5} fill={p.color} filter="url(#glow)">
                      <animateMotion path={p.d} dur={p.isHandoff ? "3s" : "2.4s"} repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              ))}
            </svg>

            {/* Tree Nodes Container with Zoom Scaling */}
            <div 
              className="space-y-12 w-max transition-transform origin-top-left"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {displayedRoles.map((role) => (
                <div 
                  key={role.id} 
                  className="flex items-center gap-12 sm:gap-16 relative z-20"
                >
                  
                  {/* LEVEL 1: ROLE NODE (Styled like user attachment, enhanced for enterprise) */}
                  <div className="relative group">
                    <div 
                      className={`w-48 p-4 rounded-xl border-2 transition-all shadow-xs bg-white flex items-center gap-3 ${
                        role.themeColor === 'emerald'
                          ? 'border-emerald-500/80 hover:border-emerald-600 ring-2 ring-emerald-500/10'
                          : role.themeColor === 'indigo'
                          ? 'border-indigo-500/80 hover:border-indigo-600 ring-2 ring-indigo-500/10'
                          : 'border-teal-500/80 hover:border-teal-600 ring-2 ring-teal-500/10'
                      }`}
                    >
                      {/* Avatar Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                        role.themeColor === 'emerald'
                          ? 'bg-emerald-50 text-emerald-700'
                          : role.themeColor === 'indigo'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-teal-50 text-teal-700'
                      }`}>
                        {role.id === 'role-admin' ? <Shield className="w-5 h-5" /> : role.id === 'role-staff' ? <GraduationCap className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                          {role.tier}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate">
                          {role.shortName}
                        </h3>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {role.scopeBadge}
                        </span>
                      </div>
                    </div>

                    {/* Output Port Connector */}
                    <div 
                      id={`port-out-${role.id}`}
                      className={`w-3.5 h-3.5 rounded-full border-2 bg-white absolute -right-1.5 top-1/2 -translate-y-1/2 z-30 ${
                        role.themeColor === 'emerald' ? 'border-emerald-500' : role.themeColor === 'indigo' ? 'border-indigo-500' : 'border-teal-500'
                      }`}
                    />
                  </div>

                  {/* LEVEL 2 & 3: MODULES & ACTIONS BRANCHING */}
                  <div className="flex flex-col gap-6">
                    {role.modules.map((mod) => (
                      <div key={mod.id} className="flex items-center gap-12 sm:gap-14 relative">
                        
                        {/* LEVEL 2: MODULE NODE */}
                        <div className="relative group">
                          {/* Input Port */}
                          <div 
                            id={`port-in-${mod.id}`}
                            className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 bg-white absolute -left-1.5 top-1/2 -translate-y-1/2 z-30"
                          />

                          <div className="w-48 p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs transition-all flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-slate-900 block truncate">
                                {mod.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {mod.actions.length} action{mod.actions.length > 1 ? 's' : ''}
                              </span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                          </div>

                          {/* Output Port */}
                          <div 
                            id={`port-out-${mod.id}`}
                            className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 bg-white absolute -right-1.5 top-1/2 -translate-y-1/2 z-30"
                          />
                        </div>

                        {/* LEVEL 3: ACTIONS FORK */}
                        <div className="flex flex-col gap-2.5">
                          {mod.actions.map((act) => {
                            const isSelected = selectedAction?.id === act.id;
                            const isSearchMatch = searchQuery.trim() && act.name.toLowerCase().includes(searchQuery.toLowerCase());

                            return (
                              <div key={act.id} className="relative group">
                                {/* Input Port */}
                                <div 
                                  id={`port-in-${act.id}`}
                                  className={`w-3 h-3 rounded-full border-2 bg-white absolute -left-1.5 top-1/2 -translate-y-1/2 z-30 ${
                                    act.permission === 'Allow' ? 'border-emerald-500' : act.permission === 'Deny' ? 'border-rose-500' : 'border-indigo-500'
                                  }`}
                                />

                                <button
                                  type="button"
                                  onClick={() => setSelectedAction(act)}
                                  className={`w-64 p-3 rounded-xl border text-left transition-all cursor-pointer shadow-2xs flex items-center justify-between gap-2.5 ${
                                    isSelected
                                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                                      : isSearchMatch
                                      ? 'bg-amber-50 border-amber-300 text-slate-900 ring-2 ring-amber-300/20'
                                      : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="min-w-0 space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                        {act.name}
                                      </span>
                                    </div>
                                    <span className={`text-[10px] font-mono block truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                                      {act.reqCode} · p.{act.sourcePage}
                                    </span>
                                  </div>

                                  <div className="shrink-0 flex items-center gap-1">
                                    {act.permission === 'Allow' ? (
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                        isSelected ? 'bg-emerald-900/80 text-emerald-200' : 'bg-emerald-50 text-emerald-700'
                                      }`}>
                                        Allow
                                      </span>
                                    ) : act.permission === 'Deny' ? (
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                        isSelected ? 'bg-rose-900/80 text-rose-200' : 'bg-rose-50 text-rose-700'
                                      }`}>
                                        Deny
                                      </span>
                                    ) : (
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                        isSelected ? 'bg-indigo-900/80 text-indigo-200' : 'bg-indigo-50 text-indigo-700'
                                      }`}>
                                        Scoped
                                      </span>
                                    )}
                                  </div>
                                </button>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Canvas Footer Legend */}
          <div className="px-5 py-3 bg-white border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <span className="text-slate-400 font-medium">Flowchart Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-600">Authorized (Allow)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                <span className="text-slate-600">Row-Scoped (Scoped)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="text-slate-600">Strictly Forbidden (Deny)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="text-slate-600">Cross-Role Handoff Gate</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Click any action node to inspect technical contract & provenance
            </div>
          </div>

        </div>
      )}

      {/* 3. Alternative View: Process Sequence Swimlanes */}
      {viewMode === 'swimlanes' && (
        <div className="space-y-4">
          {displayedRoles.map((role) => (
            <div key={role.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">{role.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400">({role.tier})</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{role.scopeBadge}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {role.modules.flatMap(m => m.actions).map((act, idx) => (
                  <div 
                    key={act.id} 
                    onClick={() => setSelectedAction(act)}
                    className="p-3.5 rounded-lg border border-slate-200/70 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-400 font-semibold">{String(idx + 1).padStart(2, '0')}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        act.permission === 'Allow' ? 'bg-emerald-50 text-emerald-700' : act.permission === 'Deny' ? 'bg-rose-50 text-rose-700' : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {act.permission}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">{act.name}</h4>
                    <p className="text-[11px] font-mono text-slate-500 truncate">{act.techDetail}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Alternative View: RBAC Matrix */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500 uppercase">
              <tr>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Module</th>
                <th className="py-3 px-4 font-semibold">Operation / Action</th>
                <th className="py-3 px-4 font-semibold">Permission Effect</th>
                <th className="py-3 px-4 font-semibold">Scope Boundary</th>
                <th className="py-3 px-4 font-semibold">Requirement</th>
                <th className="py-3 px-4 text-right font-semibold">Source Anchor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedRoles.flatMap(r => r.modules.flatMap(m => m.actions)).map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{act.roleName}</td>
                  <td className="py-3 px-4 text-slate-600">{act.moduleName}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{act.name}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-semibold ${
                      act.permission === 'Allow' ? 'text-emerald-700' : act.permission === 'Deny' ? 'text-rose-700' : 'text-indigo-700'
                    }`}>
                      {act.permission}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{act.scopeType}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{act.reqCode}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenSourcePage(act.sourcePage)}
                      className="font-mono text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      p.{act.sourcePage}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Enterprise Node Inspector Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
                  {selectedAction.roleName} · {selectedAction.moduleName}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedAction.name}
                </h3>
              </div>

              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                selectedAction.permission === 'Allow' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : selectedAction.permission === 'Deny'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}>
                {selectedAction.permission}
              </span>
            </div>

            {/* Technical Contract */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  API Technical Endpoint
                </span>
                <p className="font-mono text-slate-800 text-[11px] select-all">
                  {selectedAction.techDetail}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  Specification Provenance ({selectedAction.reqCode})
                </span>
                <p className="text-slate-600 italic leading-relaxed">
                  "{selectedAction.sourcePassage}"
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Source: Page {selectedAction.sourcePage}</span>
                  <button
                    onClick={() => {
                      onOpenSourcePage(selectedAction.sourcePage);
                      setSelectedAction(null);
                    }}
                    className="text-indigo-600 hover:text-indigo-700 font-sans font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Page in Reader</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {selectedAction.handoffTo && (
                <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cross-Role Handoff Flow</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Executing this action hands off to <strong>{selectedAction.handoffTo.roleName}</strong>: {selectedAction.handoffTo.actionName}.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedAction(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
