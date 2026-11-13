import { UserJourneyPersona } from '../types';

export const USER_JOURNEYS: UserJourneyPersona[] = [
  {
    id: 'teacher-eleanor',
    name: 'Mrs. Eleanor Vance',
    roleTitle: 'Faculty Class Teacher (Grade 10-B Homeroom & Biology)',
    department: 'Secondary Sciences',
    avatarSeed: 'Eleanor',
    primaryGoals: [
      'Complete personal daily check-in smoothly upon campus arrival',
      'Finish homeroom student attendance in under 60 seconds before morning announcements',
      'Easily handle student tardiness without getting bogged down in paper office passes'
    ],
    keyFrustrations: [
      'Waiting in lobby queues for paper clock-in sheets',
      'Having to write manual paper absence slips to the main office',
      'System locks without a clear method to correct accidental clicks'
    ],
    steps: [
      {
        stepIndex: 1,
        phase: 'Phase 1: Morning Campus Arrival',
        userGoal: 'Submit personal daily arrival check-in',
        userAction: 'Arrives at campus gate at 08:14 AM, opens Teacher Portal on mobile, taps "Submit Daily Personal Check-in".',
        systemResponse: 'Browser prompts for GPS location. System validates latitude/longitude within 250m campus boundary and records status as ON_TIME.',
        uiScreenMock: 'Mobile Green Card: "Welcome Eleanor! Campus geofence verified. Checked in at 08:14 AM."',
        emotionalState: 'confident',
        frictionRisk: 'GPS drift or disabled location permissions on personal device.',
        technicalTouchpoint: 'POST /api/v1/teacher/check-in with client coordinates + campus Wi-Fi BSSID fallback.',
        kpiMetric: 'Check-in completion latency < 3 seconds'
      },
      {
        stepIndex: 2,
        phase: 'Phase 2: Classroom Preparation',
        userGoal: 'Review class roster and schedule for period 1',
        userAction: 'Navigates to "Today\'s Schedule" on dashboard, taps "Grade 10 - Section B Homeroom".',
        systemResponse: 'Backend validates scoped JWT claims and retrieves 32 enrolled students with student photos and allergy flags.',
        uiScreenMock: 'Dashboard cards showing Period 1: Biology (10-B), active student count: 32, medical alerts: 2.',
        emotionalState: 'neutral',
        frictionRisk: 'Slow Wi-Fi connection in basement science laboratory.',
        technicalTouchpoint: 'GET /api/v1/teacher/sections/sec_10B_2026/roster (cached in Redis, latency 45ms).',
        kpiMetric: 'Roster payload size < 120KB'
      },
      {
        stepIndex: 3,
        phase: 'Phase 3: Classroom Roll-Call',
        userGoal: 'Mark attendance for 32 students in under 1 minute',
        userAction: 'Taps "Mark All Present" button. All 32 students switch to green checkmarks. Eleanor notices Marcus Bradley is missing, taps Marcus\'s toggle to switch to "Absent".',
        systemResponse: 'UI updates in-memory state. Summary counter displays: 31 Present, 1 Absent. Submit button enables.',
        uiScreenMock: 'Interactive roster grid: 31 Present (Green), 1 Absent (Red). Submit receipt timestamped 09:04 AM.',
        emotionalState: 'confident',
        frictionRisk: 'Accidentally marking the wrong student without visual photo confirmation.',
        technicalTouchpoint: 'POST /api/v1/teacher/sections/sec_10B_2026/attendance with batch payload.',
        kpiMetric: 'Average roll-call time: 38 seconds'
      },
      {
        stepIndex: 4,
        phase: 'Phase 4: Cutoff Lockout Encounter',
        userGoal: 'Update Marcus Bradley\'s attendance when he arrives late',
        userAction: 'At 09:36 AM, Marcus enters classroom with a dentist clinic note. Eleanor opens the register to change him to Late. The register shows "Cutoff Locked (09:30 AM)".',
        systemResponse: 'UI disables direct status toggles. Explanatory banner states: "Session locked at 09:30 AM cutoff for audit integrity. Click to Request Admin Override."',
        uiScreenMock: 'Amber warning banner with lock icon: "Session Locked. Submit an Admin Override Request with justification."',
        emotionalState: 'stressed',
        frictionRisk: 'Teacher confusion if locked without clear instructions on how to rectify.',
        technicalTouchpoint: 'Backend returns HTTP 423 Locked with error payload containing override workflow deep link.',
        kpiMetric: 'Lockout accuracy: 100% at exactly 09:30:00 AM'
      },
      {
        stepIndex: 5,
        phase: 'Phase 5: Override Escalation Petition',
        userGoal: 'Submit formal override request with medical pass justification',
        userAction: 'Taps "Restricted Request for Admin Override". Selects Marcus Bradley, chooses "LATE (Excused)", enters reason: "Student presented dentist appointment slip", and clicks Submit.',
        systemResponse: 'System generates ticket ovr_tk_99104 in PENDING_ADMIN_REVIEW status. WebSocket event sent directly to School Administrator queue.',
        uiScreenMock: 'Modal success dialog: "Override request #99104 dispatched to School Administrator Dr. Sterling."',
        emotionalState: 'relieved',
        frictionRisk: 'Cumbersome file attachment requirements delaying morning lesson.',
        technicalTouchpoint: 'POST /api/v1/teacher/attendance/override-request, Redis pub/sub push to admin room.',
        kpiMetric: 'Ticket dispatch latency < 500ms'
      },
      {
        stepIndex: 6,
        phase: 'Phase 6: Adjudication Resolution',
        userGoal: 'Verify that attendance record is officially amended',
        userAction: 'At 09:48 AM, a subtle push notification badge appears on Eleanor\'s dashboard: "Override Approved by Principal Sterling".',
        systemResponse: 'Marcus\'s record is officially updated to "Late (Excused)". Absence SMS to parent is automatically cancelled.',
        uiScreenMock: 'Notification drawer showing green badge: "Ticket #99104 Approved. Class register updated."',
        emotionalState: 'satisfied',
        frictionRisk: 'Delayed admin response leaving parent worried about false absence alert.',
        technicalTouchpoint: 'WebSocket event: OVERRIDE_RESOLVED received, local React query cache invalidated.',
        kpiMetric: 'End-to-end resolution time: 12 minutes'
      }
    ]
  },
  {
    id: 'admin-marcus',
    name: 'Dr. Marcus Sterling',
    roleTitle: 'School Principal & Chief System Administrator',
    department: 'School District Leadership',
    avatarSeed: 'Marcus',
    primaryGoals: [
      'Maintain 100% legal compliance and audit readiness for district funding',
      'Prevent student truancy slips and maintain transparent parent trust',
      'Rapidly adjudicate faculty escalation tickets without bureaucratic friction'
    ],
    keyFrustrations: [
      'Untracked manual changes that fail state education audits',
      'Lack of real-time visibility into whether all morning classes completed roll-call',
      'Lengthy compliance report generation taking days in spreadsheets'
    ],
    steps: [
      {
        stepIndex: 1,
        phase: 'Phase 1: Secure Portal Entry',
        userGoal: 'Access centralized school administrative system',
        userAction: 'Arrives at administrative office at 08:20 AM. Enters credentials on desktop workstation and approves 6-digit TOTP token.',
        systemResponse: 'System validates RSA-256 signatures, verifies sys:admin role claim, and initializes full administrative session.',
        uiScreenMock: 'Admin Login Screen with MFA verification and session security badge.',
        emotionalState: 'confident',
        frictionRisk: 'MFA token desync or expired token requiring IT reset.',
        technicalTouchpoint: 'POST /api/v1/auth/admin/login with TOTP verification and IP logging.',
        kpiMetric: 'Auth handshake time < 800ms'
      },
      {
        stepIndex: 2,
        phase: 'Phase 2: Morning Command & KPI Scan',
        userGoal: 'Assess school-wide morning arrival health',
        userAction: 'Views System Dashboard. Checks live KPIs: 96.3% student attendance, 74/76 faculty on-site, 2 unmarked classes.',
        systemResponse: 'Real-time aggregated analytics load in <200ms with automated alert banner for the 2 classes nearing the 09:30 AM cutoff.',
        uiScreenMock: 'Executive Dashboard: Dual gauge meters for student/staff attendance, countdown timer to 09:30 AM cutoff.',
        emotionalState: 'confident',
        frictionRisk: 'Data lag if calculations run expensive unindexed queries across 1,500 students.',
        technicalTouchpoint: 'GET /api/v1/admin/dashboard/kpis querying Redis cached aggregates.',
        kpiMetric: 'Dashboard load time < 250ms'
      },
      {
        stepIndex: 3,
        phase: 'Phase 3: Academic Master Setup',
        userGoal: 'Configure newly created biology lab section',
        userAction: 'Opens "Configure Master Entities", adds Section 10-C, assigns homeroom teacher, and sets room 204 capacity.',
        systemResponse: 'Database creates relational section record and establishes teacher assignment mapping with transactional integrity.',
        uiScreenMock: 'Master configuration grid with cascading dropdowns: Grade 10 -> Section C -> Assigned Faculty.',
        emotionalState: 'neutral',
        frictionRisk: 'Accidental conflict with existing classroom timetable slots.',
        technicalTouchpoint: 'POST /api/v1/admin/master/sections with ACID foreign key constraints.',
        kpiMetric: 'Master update execution < 150ms'
      },
      {
        stepIndex: 4,
        phase: 'Phase 4: Escalation Queue Triage',
        userGoal: 'Review incoming teacher override tickets post-cutoff',
        userAction: 'At 09:44 AM, notification chime sounds. Marcus opens "View Global Attendance Records" and filters by "Pending Overrides".',
        systemResponse: 'Table displays ticket ovr_tk_99104 submitted by Eleanor Vance for student Marcus Bradley (Grade 10-B), with reason note.',
        uiScreenMock: 'Adjudication drawer displaying original status (Absent), requested status (Late Excused), and attached nurse slip note.',
        emotionalState: 'neutral',
        frictionRisk: 'Ambiguous or insufficient teacher justifications requiring phone follow-ups.',
        technicalTouchpoint: 'GET /api/v1/admin/attendance/overrides?status=PENDING.',
        kpiMetric: 'Pending queue retrieval < 80ms'
      },
      {
        stepIndex: 5,
        phase: 'Phase 5: Override Adjudication',
        userGoal: 'Approve valid attendance rectification with audit signoff',
        userAction: 'Reviews nurse station note, types admin remark: "Medical pass verified", and clicks "Approve Override".',
        systemResponse: 'Atomic database transaction updates student record, records cryptographic audit trail entry, and pushes resolution event to Eleanor.',
        uiScreenMock: 'Status pill changes from Amber "Pending" to Emerald "Approved". Confirmation toast shown.',
        emotionalState: 'relieved',
        frictionRisk: 'Race conditions if multiple administrators review the same ticket concurrently.',
        technicalTouchpoint: 'PATCH /api/v1/admin/attendance/overrides/ovr_tk_99104 with row lock.',
        kpiMetric: 'Adjudication transaction latency < 120ms'
      },
      {
        stepIndex: 6,
        phase: 'Phase 6: Compliance Audit Export',
        userGoal: 'Generate signed compliance report for District Superintendent',
        userAction: 'Navigates to "Generate Global Reports & Audits", selects "Monthly District ADA Report", and clicks "Export Certified PDF".',
        systemResponse: 'Report worker generates multi-page PDF with student tallies, override audit log signatures, and SHA-256 digital stamp.',
        uiScreenMock: 'Download modal with SHA-256 checksum and instant download button.',
        emotionalState: 'satisfied',
        frictionRisk: 'Memory spikes during heavy PDF generation on large school datasets.',
        technicalTouchpoint: 'POST /api/v1/admin/reports/generate (streamed as signed PDF asset).',
        kpiMetric: 'Full report generated in 2.8 seconds'
      }
    ]
  }
];
