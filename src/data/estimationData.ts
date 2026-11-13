import { EstimationTask } from '../types';

export const ESTIMATION_TASKS: EstimationTask[] = [
  // Sprint 1: Architecture, RBAC & Core Data Foundations
  {
    id: 'TSK-101',
    wbsCode: '1.1',
    sprint: 1,
    title: 'Database Schema & Migration Pipeline (PostgreSQL & Drizzle/Prisma)',
    category: 'Database',
    optimisticDays: 3,
    mostLikelyDays: 4,
    pessimisticDays: 7,
    storyPoints: 5,
    assignedRole: 'Senior Backend Engineer',
    deliverables: 'ERD schema, migration scripts, indices for attendance_sessions, audit_logs, override_requests.'
  },
  {
    id: 'TSK-102',
    wbsCode: '1.2',
    sprint: 1,
    title: 'JWT Authentication Gateway with Scoped RBAC Claims & MFA',
    category: 'Security & RBAC',
    optimisticDays: 4,
    mostLikelyDays: 5,
    pessimisticDays: 8,
    storyPoints: 8,
    assignedRole: 'Lead Solutions Architect',
    deliverables: 'Dual portal login (Admin vs Teacher), argon2id password hashing, TOTP MFA, scoped section token generator.'
  },
  {
    id: 'TSK-103',
    wbsCode: '1.3',
    sprint: 1,
    title: 'CI/CD Pipeline, Docker Staging Environments & Observability',
    category: 'DevOps & CI/CD',
    optimisticDays: 2,
    mostLikelyDays: 3,
    pessimisticDays: 5,
    storyPoints: 3,
    assignedRole: 'Cloud DevOps / SRE',
    deliverables: 'GitHub Actions workflow, preview deployments, Prometheus/Grafana health checks.'
  },

  // Sprint 2: Admin Entity Provisioning & User Governance
  {
    id: 'TSK-201',
    wbsCode: '2.1',
    sprint: 2,
    title: 'Admin Master Configuration UI (Classes, Sections, Subjects, Timetables)',
    category: 'Frontend',
    optimisticDays: 4,
    mostLikelyDays: 6,
    pessimisticDays: 9,
    storyPoints: 8,
    assignedRole: 'Senior Full-Stack Engineer',
    deliverables: 'Interactive academic tree manager, section capacity validator, timetable schedule slot builder.'
  },
  {
    id: 'TSK-202',
    wbsCode: '2.2',
    sprint: 2,
    title: 'User Management CRUD & Bulk CSV Batch Ingestion Engine',
    category: 'Backend',
    optimisticDays: 3,
    mostLikelyDays: 5,
    pessimisticDays: 8,
    storyPoints: 5,
    assignedRole: 'Senior Backend Engineer',
    deliverables: 'CSV streaming parser, transactional rollback on row error, welcome credential emailer.'
  },
  {
    id: 'TSK-203',
    wbsCode: '2.3',
    sprint: 2,
    title: 'System Dashboard KPIs & Real-Time Alert Engine (Redis WebSockets)',
    category: 'Frontend',
    optimisticDays: 3,
    mostLikelyDays: 4,
    pessimisticDays: 6,
    storyPoints: 5,
    assignedRole: 'Senior Full-Stack Engineer',
    deliverables: 'Attendance gauge widgets, teacher clock-in status ticker, discrepancy alert banner.'
  },

  // Sprint 3: Teacher Portal, Geofenced Check-in & Bulk Roll-Call
  {
    id: 'TSK-301',
    wbsCode: '3.1',
    sprint: 3,
    title: 'Staff Geofenced Mobile Self-Check-in with Arrival Window Validator',
    category: 'Frontend',
    optimisticDays: 3,
    mostLikelyDays: 4,
    pessimisticDays: 7,
    storyPoints: 5,
    assignedRole: 'Senior Full-Stack Engineer',
    deliverables: 'GPS geolocation verification, campus boundary math (Haversine formula), late-arrival flagger.'
  },
  {
    id: 'TSK-302',
    wbsCode: '3.2',
    sprint: 3,
    title: 'High-Speed Bulk Attendance Marking View (1-Click Mark All)',
    category: 'Frontend',
    optimisticDays: 4,
    mostLikelyDays: 5,
    pessimisticDays: 8,
    storyPoints: 8,
    assignedRole: 'Senior Full-Stack Engineer',
    deliverables: 'Roster grid, quick keyboard hotkeys (P/A/L), medical alerts tooltip, batch payload submit.'
  },
  {
    id: 'TSK-303',
    wbsCode: '3.3',
    sprint: 3,
    title: 'Real-time Section Access Boundary Enforcement Middleware',
    category: 'Security & RBAC',
    optimisticDays: 2,
    mostLikelyDays: 3,
    pessimisticDays: 5,
    storyPoints: 3,
    assignedRole: 'Senior Backend Engineer',
    deliverables: 'Row-level security middleware verifying teacher-to-section token claim integrity.'
  },

  // Sprint 4: Cutoff Lock Engine & Override Escalation Loop
  {
    id: 'TSK-401',
    wbsCode: '4.1',
    sprint: 4,
    title: 'Automated 09:30 AM Cutoff Lock Daemon & Transition Engine',
    category: 'Backend',
    optimisticDays: 3,
    mostLikelyDays: 4,
    pessimisticDays: 6,
    storyPoints: 5,
    assignedRole: 'Senior Backend Engineer',
    deliverables: 'Cron/Worker lock processor, session status transition, parent SMS queue dispatch.'
  },
  {
    id: 'TSK-402',
    wbsCode: '4.2',
    sprint: 4,
    title: 'Teacher Restricted Request for Admin Override Workflow UI',
    category: 'Frontend',
    optimisticDays: 3,
    mostLikelyDays: 4,
    pessimisticDays: 6,
    storyPoints: 5,
    assignedRole: 'Senior Full-Stack Engineer',
    deliverables: 'Override petition modal, minimum text length validation, file upload for medical slips.'
  },
  {
    id: 'TSK-403',
    wbsCode: '4.3',
    sprint: 4,
    title: 'Admin Global Attendance Records & Override Adjudication Queue',
    category: 'Frontend',
    optimisticDays: 4,
    mostLikelyDays: 5,
    pessimisticDays: 8,
    storyPoints: 8,
    assignedRole: 'Senior Full-Stack Engineer',
    deliverables: 'Pending ticket triage table, approve/reject action modal, instant status amendment.'
  },

  // Sprint 5: Audit Compliance, Export Engine & QA Signoff
  {
    id: 'TSK-501',
    wbsCode: '5.1',
    sprint: 5,
    title: 'Immutable Cryptographic Audit Ledger & Event Recorder',
    category: 'Backend',
    optimisticDays: 3,
    mostLikelyDays: 4,
    pessimisticDays: 6,
    storyPoints: 5,
    assignedRole: 'Lead Solutions Architect',
    deliverables: 'SHA-256 chain log recorder, tamper-evident hash verification, FERPA compliance.'
  },
  {
    id: 'TSK-502',
    wbsCode: '5.2',
    sprint: 5,
    title: 'State Compliance PDF/Excel Export Worker (Streaming)',
    category: 'Backend',
    optimisticDays: 3,
    mostLikelyDays: 4,
    pessimisticDays: 7,
    storyPoints: 5,
    assignedRole: 'Senior Backend Engineer',
    deliverables: 'Puppeteer/PDFKit report generator, chronic absenteeism flags, checksum signoff.'
  },
  {
    id: 'TSK-503',
    wbsCode: '5.3',
    sprint: 5,
    title: 'End-to-End Automated Testing (Playwright & Jest 90% Coverage)',
    category: 'QA & Testing',
    optimisticDays: 4,
    mostLikelyDays: 6,
    pessimisticDays: 9,
    storyPoints: 8,
    assignedRole: 'Senior QA Automation Engineer',
    deliverables: 'Automated test suite covering cutoffs, override loop, RBAC leaks, and edge-case loads.'
  }
];

export const ESTIMATION_ROLES = [
  { role: 'Lead Solutions Architect', allocationPct: 20, standardRate: 140 },
  { role: 'Senior Full-Stack Engineer', allocationPct: 40, standardRate: 105 },
  { role: 'Senior Backend Engineer', allocationPct: 40, standardRate: 110 },
  { role: 'Senior QA Automation Engineer', allocationPct: 30, standardRate: 85 },
  { role: 'Cloud DevOps / SRE', allocationPct: 20, standardRate: 115 }
];
