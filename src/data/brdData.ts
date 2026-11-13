import { BrdRequirement } from '../types';

export const BRD_METADATA = {
  documentId: 'BRD-EDUPULSE-2026-V1.0',
  title: 'Business Requirements Document (BRD)',
  projectName: 'EduPulse Integrated Attendance & School Administration Platform',
  clientOrganization: 'Oakridge Unified School District & Secondary Academies',
  projectSponsor: 'Office of the Superintendent & Director of Educational Technology',
  targetFiscalYear: 'FY 2026-2027',
  version: '1.0.0-FINAL'
};

export const BRD_STAKEHOLDERS = [
  {
    role: 'School Administrator / Principal',
    name: 'Dr. Marcus Sterling',
    responsibility: 'Accountable for school-wide attendance compliance, staff accountability, master entity governance, and override authorization.',
    raci: 'Accountable (A)'
  },
  {
    role: 'Classroom Teachers & Faculty',
    name: 'Eleanor Vance (Faculty Rep)',
    responsibility: 'Responsible for daily personal clock-in and classroom roll-call completion within the morning cutoff time window.',
    raci: 'Responsible (R)'
  },
  {
    role: 'District Compliance & Audit Officer',
    name: 'Sarah Jenkins (OUSD Inspector)',
    responsibility: 'Consulted on state education board reporting guidelines, chronic absenteeism formulas, and regulatory audit formats.',
    raci: 'Consulted (C)'
  },
  {
    role: 'IT Systems & Security Administrator',
    name: 'Liam Zhang (Lead DevOps)',
    responsibility: 'Informed regarding JWT key rotation, identity federation, uptime SLAs (99.9%), and infrastructure backups.',
    raci: 'Informed (I)'
  }
];

export const BRD_AS_IS_VS_TO_BE = [
  {
    area: 'Roll-Call Speed & Efficiency',
    asIs: 'Paper attendance sheets passed between rooms or manual double-entry into disparate legacy desktop spreadsheets; takes 15-20 minutes per morning.',
    toBe: '1-click bulk marking via responsive mobile/tablet portal; takes under 45 seconds per homeroom period.',
    impact: '75% time reduction for faculty in first period'
  },
  {
    area: 'Audit Integrity & Record Tampering',
    asIs: 'Attendance sheets editable by anyone with file access; zero tamper-detection or historical change tracking.',
    toBe: 'Automated 09:30 AM cutoff hard lockout; changes require formal admin override ticket with cryptographic audit trails.',
    impact: 'Zero unapproved record alterations; 100% FERPA compliance'
  },
  {
    area: 'Staff Attendance & Check-in',
    asIs: 'Physical paper punch register in main office causing morning lobby bottlenecks and unreliable arrival timestamps.',
    toBe: 'Geofenced mobile personal check-in with GPS verification and automatic duty roster sync.',
    impact: 'Elimination of morning lobby queues; instant relief staff allocation'
  },
  {
    area: 'Parent Notification & Child Safety',
    asIs: 'Absent students flagged hours later by office clerk calls; parents frequently informed only after midday.',
    toBe: 'Real-time absent status triggers instantaneous parent SMS & email dispatch immediately after cutoff.',
    impact: 'Student truancy detection latency reduced from 4 hours to 3 minutes'
  }
];

export const BRD_REQUIREMENTS: BrdRequirement[] = [
  {
    id: 'BRD-01',
    module: 'Authentication & Access Control',
    title: 'Role-Based Access Control (RBAC) & Scoped Data Partitioning',
    description: 'The system must strictly partition access levels between School Administrators (unrestricted school-wide access) and Teachers (strictly scoped to assigned classes and own clock-in).',
    businessValue: 'Prevents student record privacy leaks and prevents faculty from tampering with other classes.',
    priority: 'Must Have',
    acceptanceCriteria: [
      'Teachers cannot query or view attendance rosters for classes they are not actively assigned to.',
      'Administrators possess global visibility into all grades, sections, staff registers, and audit logs.',
      'Session tokens expire after 15 minutes of inactivity with seamless refresh token rotation.'
    ],
    stakeholder: 'Principal / IT Security'
  },
  {
    id: 'BRD-02',
    module: 'Faculty Check-in',
    title: 'Geofenced Staff Morning Check-in with Automated Cutoff',
    description: 'Faculty must record their daily attendance on campus premises within a configurable morning arrival window (07:30 - 08:45 AM). Arrivals after 08:45 AM are flagged as Late; after 09:15 AM self check-in is locked.',
    businessValue: 'Automates payroll data collection, eliminates physical punch cards, and ensures adequate classroom coverage.',
    priority: 'Must Have',
    acceptanceCriteria: [
      'Captures latitude/longitude within 250m campus boundary.',
      'Arrival between 08:46 AM and 09:15 AM automatically tags staff status as LATE.',
      'Check-in attempts after 09:15 AM reject submission with prompt to request Administrator Override.'
    ],
    stakeholder: 'Office of the Principal'
  },
  {
    id: 'BRD-03',
    module: 'Classroom Roll-Call',
    title: 'Bulk 1-Click Roll-Call Marking Interface',
    description: 'Teachers must be provided with an optimized bulk marking interface allowing one-tap "Mark All Present", quick toggles for Absent and Late, and immediate submission receipt.',
    businessValue: 'Maximizes instructional teaching time and minimizes teacher administrative friction.',
    priority: 'Must Have',
    acceptanceCriteria: [
      'UI displays full student roster sorted by roll number and alphabetical surname.',
      'Default "Mark All Present" button sets all students to PRESENT in single click.',
      'Individual toggles allow single-tap change to ABSENT or LATE with optional notes field.'
    ],
    stakeholder: 'Faculty Teachers'
  },
  {
    id: 'BRD-04',
    module: 'Governance & Lockout',
    title: 'Cutoff Lockout and Mandatory Admin Override Escalation',
    description: 'Classroom attendance registers must be hard-locked at 09:30 AM daily. Any retrospective modification must require an electronic escalation ticket reviewed and approved by an Administrator.',
    businessValue: 'Guarantees legal defensibility of official records and eliminates fraudulent retroactive mark changes.',
    priority: 'Must Have',
    acceptanceCriteria: [
      'At 09:30:00 AM server time, direct editing in teacher portal is disabled.',
      'Teachers requesting a correction must submit justification text (minimum 20 characters).',
      'Administrator receives instant notification and can approve or decline with feedback note.'
    ],
    stakeholder: 'District Compliance Officer'
  },
  {
    id: 'BRD-05',
    module: 'Reporting & Compliance',
    title: 'Standardized State Education Board Compliance Exports',
    description: 'The platform must generate one-click exportable PDF and CSV reports conforming to state education compliance standards, including chronic absenteeism flags.',
    businessValue: 'Protects state funding formulas tied to average daily attendance (ADA) and simplifies annual accreditation audits.',
    priority: 'Should Have',
    acceptanceCriteria: [
      'Exports include student name, state student ID, date, status, and any authorized override signatures.',
      'Includes summary calculations of attendance percentage per section and grade level.',
      'Automated highlight for students with attendance rates below 90% in trailing 30 days.'
    ],
    stakeholder: 'District Auditor'
  },
  {
    id: 'BRD-06',
    module: 'Parent Communication',
    title: 'Automated Truancy Alert Messaging',
    description: 'Upon closure of the 09:30 AM morning cutoff, the system must trigger automated SMS and email notifications to registered guardians of unmarked or absent students.',
    businessValue: 'Enhances child safety, fosters immediate parental engagement, and reduces truancy.',
    priority: 'Should Have',
    acceptanceCriteria: [
      'Dispatches within 120 seconds of session cutoff finalization.',
      'Supports parent reply confirmation ("Acknowledged / Sick at Home").'
    ],
    stakeholder: 'Parents & School Safety Officer'
  }
];

export const BRD_ROI_METRICS = [
  { metric: 'Faculty Roll-Call Time Saved', value: '18 min / day', context: 'Per classroom homeroom teacher' },
  { metric: 'Annual School Administrative Hours Recovered', value: '1,420 hrs', context: 'Replaced manual paperwork triage' },
  { metric: 'Audit Dispute Resolution Time', value: '<30 sec', context: 'Down from 3-5 days in legacy filing cabinets' },
  { metric: 'Student Safety Notification Latency', value: '<2 min', context: 'Immediate parent alert upon verified absence' }
];
