import { FlowNode, FlowEdge } from '../types';

export const FLOW_NODES: FlowNode[] = [
  // ================= ADMIN ROLE =================
  {
    id: 'admin-login',
    role: 'admin',
    title: 'Admin Portal Login',
    subtitle: 'JWT RBAC Authentication',
    iconName: 'UserCheck',
    swimlane: 'School Administrator Role (Full System Access)',
    stepNumber: 1,
    category: 'auth',
    description: 'Centralized administrative entry point enforcing multi-factor authentication (MFA) and issuing cryptographic JSON Web Tokens containing global admin claim scopes (sys:admin, rbac:all).',
    inputs: ['Admin Username/Email', 'Password (Argon2id hashed)', 'TOTP 6-digit MFA Token'],
    outputs: ['Short-lived Access Token (JWT, 15m exp)', 'HttpOnly Refresh Token (7d exp)', 'RBAC Context Object'],
    businessRules: [
      'Account lockout after 5 consecutive failed attempts for 15 minutes',
      'MFA mandatory for all role_admin accounts',
      'Audit log entry generated immediately with IP and User-Agent signature'
    ],
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v1/auth/admin/login',
        authScope: 'Public with Rate-Limit',
        requestSample: '{\n  "email": "principal.sterling@oakridge.edu",\n  "password": "••••••••••••",\n  "totpCode": "842910"\n}',
        responseSample: '{\n  "success": true,\n  "accessToken": "eyJhbGciOi...",\n  "expiresIn": 900,\n  "user": {\n    "id": "adm_8819",\n    "name": "Dr. Marcus Sterling",\n    "role": "SYSTEM_ADMIN",\n    "permissions": ["*"]\n  }\n}',
        errorCodes: ['401 Unauthorized (Invalid Creds)', '403 Forbidden (MFA Failed)', '429 Too Many Requests']
      }
    ],
    dbTables: ['users', 'user_mfa_secrets', 'auth_audit_logs'],
    exceptionHandling: [
      'Expired MFA -> Prompt for instant code resync',
      'Brute-force attack -> Trigger IP geo-block & alert SysOps'
    ],
    coordinates: { x: 70, y: 70 }
  },
  {
    id: 'admin-dashboard',
    role: 'admin',
    title: 'System Dashboard',
    subtitle: 'KPIs & Alerts Engine',
    iconName: 'Gauge',
    swimlane: 'School Administrator Role (Full System Access)',
    stepNumber: 2,
    category: 'dashboard',
    description: 'Real-time school-wide operational command center aggregating live student attendance ratios, teacher on-site check-in compliance, pending override escalations, and biometric hardware status.',
    inputs: ['Authenticated JWT session', 'Real-time WebSocket heartbeat'],
    outputs: ['Aggregated KPI metrics', 'Active discrepancy alerts', 'Pending override counter'],
    businessRules: [
      'KPI cache refreshed at 30-second intervals via Redis pub/sub',
      'Alert triggers when class attendance drops below 85% or teacher check-in delay exceeds 15 mins'
    ],
    apiEndpoints: [
      {
        method: 'GET',
        path: '/api/v1/admin/dashboard/kpis',
        authScope: 'Bearer JWT (sys:admin)',
        responseSample: '{\n  "timestamp": "2026-10-30T08:30:00Z",\n  "totalStudents": 1420,\n  "presentToday": 1368,\n  "attendanceRate": 96.3,\n  "staffPresent": 74,\n  "staffTotal": 76,\n  "pendingOverrides": 3,\n  "unmarkedClasses": 2\n}',
        errorCodes: ['401 Token Expired', '403 Insufficient Scope']
      }
    ],
    dbTables: ['attendance_sessions', 'staff_checkins', 'override_requests'],
    exceptionHandling: [
      'Database replica latency >500ms -> Serve stale cached snapshot with amber sync status indicator'
    ],
    coordinates: { x: 260, y: 70 }
  },
  {
    id: 'admin-users',
    role: 'admin',
    title: 'Manage User Accounts',
    subtitle: 'CRUD for Staff & Students',
    iconName: 'Users',
    swimlane: 'School Administrator Role (Full System Access)',
    stepNumber: 3,
    category: 'crud',
    description: 'Comprehensive identity governance console providing full lifecycle management (Create, Read, Update, Deactivate) for administrative staff, faculty teachers, and enrolled students with bulk CSV/Excel ingestion.',
    inputs: ['User profile attributes', 'Role assignment', 'Assigned class/subject metadata', 'Batch CSV upload'],
    outputs: ['User entity record', 'Generated temporary credentials', 'Welcome onboarding email/SMS'],
    businessRules: [
      'Teacher accounts require valid National Educator ID or state license format',
      'Soft-deletion only: deactivated users retain archived historic attendance records',
      'Bulk import validates unique emails and student roll numbers in pre-flight dry run'
    ],
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v1/admin/users/batch-import',
        authScope: 'Bearer JWT (sys:admin)',
        requestSample: '{\n  "role": "TEACHER",\n  "records": [\n    { "fullName": "Eleanor Vance", "email": "e.vance@school.edu", "staffId": "FAC-102" }\n  ]\n}',
        responseSample: '{\n  "imported": 1,\n  "skipped": 0,\n  "failed": 0\n}',
        errorCodes: ['400 Validation Error', '409 Conflict (Duplicate Email/ID)']
      }
    ],
    dbTables: ['users', 'user_roles', 'student_profiles', 'staff_profiles'],
    exceptionHandling: [
      'Partial batch failure -> Rollback transaction or output downloadable error report CSV'
    ],
    coordinates: { x: 180, y: 190 }
  },
  {
    id: 'admin-master',
    role: 'admin',
    title: 'Configure Master Entities',
    subtitle: 'Classes, Sections, Subjects',
    iconName: 'Settings',
    swimlane: 'School Administrator Role (Full System Access)',
    stepNumber: 4,
    category: 'config',
    description: 'Academic structure configuration matrix defining grades/standards, classroom sections, subject curricula, timetable period slots, and teacher-to-section roster mappings.',
    inputs: ['Academic Year', 'Grade tier', 'Section identifier (A/B/C)', 'Curriculum subject list', 'Teacher assignment'],
    outputs: ['Persisted academic structure', 'Timetable slot definitions', 'Scoped teacher roster mappings'],
    businessRules: [
      'A class section must have at least one designated primary homeroom teacher',
      'Cannot delete an entity with active attendance session foreign key constraints',
      'Period timing slots must be contiguous and non-overlapping'
    ],
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v1/admin/master/sections',
        authScope: 'Bearer JWT (sys:admin)',
        requestSample: '{\n  "grade": "10",\n  "section": "B",\n  "academicYear": "2026-2027",\n  "homeroomTeacherId": "usr_tea_491",\n  "capacity": 35\n}',
        responseSample: '{\n  "sectionId": "sec_10B_2026",\n  "status": "ACTIVE"\n}',
        errorCodes: ['422 Unprocessable Entity', '409 Section Conflict']
      }
    ],
    dbTables: ['academic_years', 'classes', 'sections', 'subjects', 'teacher_assignments'],
    exceptionHandling: [
      'Orphaned records prevented by strict foreign key CASCADE restrictions'
    ],
    coordinates: { x: 70, y: 330 }
  },
  {
    id: 'admin-records',
    role: 'admin',
    title: 'View Global Attendance Records',
    subtitle: 'Staff & Student Overrides Hub',
    iconName: 'FileCheck',
    swimlane: 'School Administrator Role (Full System Access)',
    stepNumber: 5,
    category: 'attendance',
    description: 'Centralized audit table aggregating school-wide attendance records across all grades and staff. Serves as the primary incoming adjudication queue for teacher override requests resulting from cutoff lockouts.',
    inputs: ['Date filter', 'Grade/Section filter', 'Pending override ticket ID', 'Admin adjudication action (Approve/Reject)'],
    outputs: ['Rectified attendance status', 'Cryptographic audit log entry', 'Push notification to requesting teacher'],
    businessRules: [
      'Override requires mandatory textual justification by approving administrator',
      'Original timestamp and modifying admin identity preserved permanently in audit record',
      'Status change immediately updates school-wide daily KPI calculation'
    ],
    apiEndpoints: [
      {
        method: 'PATCH',
        path: '/api/v1/admin/attendance/overrides/{ticketId}',
        authScope: 'Bearer JWT (sys:admin)',
        requestSample: '{\n  "decision": "APPROVED",\n  "adminNote": "Approved medical certificate presented by student family",\n  "adjustedStatus": "EXCUSED"\n}',
        responseSample: '{\n  "ticketId": "ovr_9921",\n  "status": "RESOLVED",\n  "resolvedAt": "2026-10-30T09:45:12Z"\n}',
        errorCodes: ['404 Ticket Not Found', '409 Already Resolved']
      }
    ],
    dbTables: ['attendance_sessions', 'student_attendance_records', 'override_requests', 'audit_logs'],
    exceptionHandling: [
      'Concurrent override conflict -> Pessimistic row-level lock on attendance record during adjudication'
    ],
    coordinates: { x: 280, y: 330 }
  },
  {
    id: 'admin-reports',
    role: 'admin',
    title: 'Generate Global Reports & Audits',
    subtitle: 'Export Compliance & Analytics',
    iconName: 'FileText',
    swimlane: 'School Administrator Role (Full System Access)',
    stepNumber: 6,
    category: 'reports',
    description: 'Compliance reporting engine producing auditable exports (PDF, Excel, CSV) for education department compliance, state school board submissions, and parent-teacher meeting summaries.',
    inputs: ['Date range selector', 'Grade filter', 'Report template (Monthly Summary, Chronic Absenteeism, Staff Clock-in)'],
    outputs: ['Cryptographically signed PDF', 'Raw data CSV/Excel with checksum', 'Automated email dispatch'],
    businessRules: [
      'Audit log reports must be immutable and digitally watermarked',
      'Chronic absenteeism flagged automatically for students with attendance <90% over 30 days',
      'Reports older than 90 days retrieved from cold archive storage with pre-signed S3/GCS URLs'
    ],
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v1/admin/reports/generate',
        authScope: 'Bearer JWT (sys:admin)',
        requestSample: '{\n  "template": "COMPLIANCE_AUDIT_MONTHLY",\n  "format": "PDF",\n  "startDate": "2026-10-01",\n  "endDate": "2026-10-30"\n}',
        responseSample: '{\n  "reportId": "rep_7719",\n  "downloadUrl": "https://storage.school.edu/reports/rep_7719.pdf",\n  "sha256Checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"\n}',
        errorCodes: ['400 Invalid Date Range', '504 Report Generation Timeout']
      }
    ],
    dbTables: ['audit_logs', 'student_attendance_records', 'generated_reports'],
    exceptionHandling: [
      'Large report payload -> Offload to asynchronous background worker with polling status webhook'
    ],
    coordinates: { x: 280, y: 460 }
  },

  // ================= TEACHER ROLE =================
  {
    id: 'teacher-login',
    role: 'teacher',
    title: 'Teacher Portal Login',
    subtitle: 'JWT Scoped RBAC',
    iconName: 'LogIn',
    swimlane: 'Teacher Role (Scoped Access)',
    stepNumber: 7,
    category: 'auth',
    description: 'Secure authentication gateway for faculty members, generating a scoped JWT token that restricts data queries strictly to the teacher’s assigned classes, sections, and personal records.',
    inputs: ['Staff Email / ID', 'Password', 'Device Fingerprint / Geolocation (optional check)'],
    outputs: ['Teacher Scoped JWT Token', 'Assigned Classes payload', 'Active Period context'],
    businessRules: [
      'JWT payload contains explicit claims: { role: "TEACHER", assignedSections: ["sec_10B_2026", "sec_9A_2026"] }',
      'API gateway strictly denies requests querying sections outside assigned array (HTTP 403 Scoped Access Violation)'
    ],
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v1/auth/teacher/login',
        authScope: 'Public',
        requestSample: '{\n  "email": "e.vance@school.edu",\n  "password": "••••••••••••"\n}',
        responseSample: '{\n  "token": "eyJhbGciOi...",\n  "user": {\n    "id": "usr_tea_491",\n    "name": "Eleanor Vance",\n    "assignedClasses": ["Grade 10 - Section B", "Grade 9 - Section A"]\n  }\n}',
        errorCodes: ['401 Bad Credentials', '403 Account Inactive']
      }
    ],
    dbTables: ['users', 'teacher_assignments', 'sections'],
    exceptionHandling: [
      'Inactive faculty member -> Show clear contact administrator support modal'
    ],
    coordinates: { x: 480, y: 70 }
  },
  {
    id: 'teacher-dashboard',
    role: 'teacher',
    title: 'Dashboard Quick Actions',
    subtitle: 'Sections & Today\'s Timetable',
    iconName: 'LayoutDashboard',
    swimlane: 'Teacher Role (Scoped Access)',
    stepNumber: 8,
    category: 'dashboard',
    description: 'Streamlined faculty cockpit displaying immediate daily action items: personal morning check-in status, next scheduled teaching periods, and one-tap roll-call launch buttons.',
    inputs: ['Active Teacher JWT', 'System current time'],
    outputs: ['Personal check-in status flag', 'Today\'s period schedule', 'Attendance completion badges'],
    businessRules: [
      'Alert displayed prominently if morning personal check-in is unsubmitted past 08:30 AM',
      'Period cards highlighted when current server time matches scheduled period window'
    ],
    apiEndpoints: [
      {
        method: 'GET',
        path: '/api/v1/teacher/dashboard/schedule',
        authScope: 'Bearer JWT (role:teacher)',
        responseSample: '{\n  "today": "2026-10-30",\n  "checkedIn": true,\n  "checkInTime": "08:14:22",\n  "periods": [\n    { "period": 1, "class": "10-B", "subject": "Biology", "status": "PENDING", "time": "09:00 - 09:45" }\n  ]\n}',
        errorCodes: ['401 Unauthorized']
      }
    ],
    dbTables: ['staff_checkins', 'teacher_assignments', 'timetable_slots'],
    exceptionHandling: [
      'No assigned classes found -> Guide teacher to request section assignment from administrator'
    ],
    coordinates: { x: 670, y: 70 }
  },
  {
    id: 'teacher-checkin',
    role: 'teacher',
    title: 'Submit Daily Personal Check-in',
    subtitle: 'Faculty Geofence / Timestamp',
    iconName: 'Clock',
    swimlane: 'Teacher Role (Scoped Access)',
    stepNumber: 9,
    category: 'attendance',
    description: 'Faculty self-check-in verification capturing arrival time and geofence verification within campus coordinates, recording presence for payroll and duty roster compliance.',
    inputs: ['Teacher ID', 'Client Timestamp', 'Campus GPS coordinates (within 200m buffer)'],
    outputs: ['Check-in confirmation badge', 'Duty roster status: ON_PREMISES', 'Personal attendance ledger entry'],
    businessRules: [
      'Standard check-in window: 07:30 AM – 08:45 AM',
      'Check-in between 08:46 AM and 09:15 AM flagged as "Late Arrival"',
      'After 09:15 AM cutoff, self-check-in is locked -> Requires admin override'
    ],
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v1/teacher/check-in',
        authScope: 'Bearer JWT (role:teacher)',
        requestSample: '{\n  "timestamp": "2026-10-30T08:14:22Z",\n  "latitude": 37.7749,\n  "longitude": -122.4194\n}',
        responseSample: '{\n  "status": "ON_TIME",\n  "checkInId": "chk_3019",\n  "message": "Welcome, Eleanor! Checked in at 08:14 AM."\n}',
        errorCodes: ['400 Outside Geofence Range', '423 Cutoff Window Locked']
      }
    ],
    dbTables: ['staff_checkins', 'staff_profiles'],
    exceptionHandling: [
      'Device location permission denied -> Fallback to campus Wi-Fi SSID / BSSID verification'
    ],
    coordinates: { x: 480, y: 220 }
  },
  {
    id: 'teacher-roster',
    role: 'teacher',
    title: 'Access Assigned Class Roster',
    subtitle: 'Student Details & Medical Flags',
    iconName: 'UserCheck',
    swimlane: 'Teacher Role (Scoped Access)',
    stepNumber: 10,
    category: 'attendance',
    description: 'Scoped retrieval of the student roster for the chosen class section, including student photo avatars, emergency medical flags (allergies/asthma), and attendance historical trends.',
    inputs: ['Section ID (e.g. sec_10B_2026)', 'Date query parameter'],
    outputs: ['Enrolled student array', 'Previous day attendance state', 'Special accommodation notes'],
    businessRules: [
      'Teacher can ONLY fetch rosters for sections linked in teacher_assignments table',
      'System redacts sensitive home address and financial scholarship info for classroom privacy'
    ],
    apiEndpoints: [
      {
        method: 'GET',
        path: '/api/v1/teacher/sections/{sectionId}/roster',
        authScope: 'Bearer JWT (role:teacher, scoped)',
        responseSample: '{\n  "sectionId": "sec_10B_2026",\n  "className": "Grade 10 - Section B",\n  "totalStudents": 32,\n  "students": [\n    { "id": "stu_101", "rollNo": 1, "name": "Aria Chen", "status": "UNMARKED", "flags": ["Asthma Action Plan"] }\n  ]\n}',
        errorCodes: ['403 Scoped Access Forbidden', '404 Section Not Found']
      }
    ],
    dbTables: ['sections', 'enrollments', 'student_profiles'],
    exceptionHandling: [
      'Unauthorized section access attempt -> Return 403 and log security probe event'
    ],
    coordinates: { x: 670, y: 220 }
  },
  {
    id: 'teacher-bulk-attendance',
    role: 'teacher',
    title: 'Bulk Student Attendance Marking',
    subtitle: 'Present, Absent, Late Quick Toggles',
    iconName: 'Edit3',
    swimlane: 'Teacher Role (Scoped Access)',
    stepNumber: 11,
    category: 'attendance',
    description: 'High-speed classroom roll-call UI featuring a 1-click "Mark All Present" baseline, individual status toggle buttons (Present, Absent, Late, Excused), and reason notes.',
    inputs: ['Array of { studentId, status, optionalNote }', 'Attendance date', 'Period slot'],
    outputs: ['Submission receipt hash', 'Automated parent SMS alert queue trigger for absent pupils'],
    businessRules: [
      'Attendance must be submitted prior to the daily cutoff time (e.g., 09:30 AM)',
      'Submitting marks session as "SUBMITTED" and generates timestamped hash',
      'Any modification after cutoff time (09:30 AM) is hard-locked by backend rule'
    ],
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v1/teacher/sections/{sectionId}/attendance',
        authScope: 'Bearer JWT (role:teacher)',
        requestSample: '{\n  "date": "2026-10-30",\n  "period": 1,\n  "records": [\n    { "studentId": "stu_101", "status": "PRESENT" },\n    { "studentId": "stu_102", "status": "ABSENT", "note": "Parent called in sick" }\n  ]\n}',
        responseSample: '{\n  "sessionId": "att_ses_8829",\n  "status": "RECORDED",\n  "recordedCount": 32,\n  "absentCount": 1\n}',
        errorCodes: ['423 Session Locked Past Cutoff', '400 Validation Error']
      }
    ],
    dbTables: ['attendance_sessions', 'student_attendance_records', 'notification_queue'],
    exceptionHandling: [
      'Offline network interruption -> Local IndexedDB queue with automatic sync on reconnect'
    ],
    coordinates: { x: 670, y: 350 }
  },
  {
    id: 'teacher-override-request',
    role: 'teacher',
    title: 'Restricted Request for Admin Override',
    subtitle: 'Cutoff Locked Discrepancy Escalation',
    iconName: 'Lock',
    swimlane: 'Teacher Role (Scoped Access)',
    stepNumber: 12,
    category: 'escalation',
    description: 'Secure escalation ticket workflow initiated whenever a teacher attempts to modify attendance past the mandatory cutoff deadline (09:30 AM) or rectify an erroneously marked record.',
    inputs: ['Session ID', 'Target Student ID', 'Requested New Status', 'Mandatory Justification Reason', 'Supporting Document Upload'],
    outputs: ['Pending Override Ticket (status: PENDING_REVIEW)', 'Instant notification dispatched to School Administrator queue'],
    businessRules: [
      'Form requires minimum 20-character descriptive reason text',
      'Teacher cannot unilaterally modify historical records once locked',
      'Direct websocket push sent to Administrator portal for rapid triage'
    ],
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v1/teacher/attendance/override-request',
        authScope: 'Bearer JWT (role:teacher)',
        requestSample: '{\n  "sessionId": "att_ses_8829",\n  "studentId": "stu_102",\n  "currentStatus": "ABSENT",\n  "requestedStatus": "PRESENT",\n  "reason": "Student arrived late at 09:35 AM with dentist appointment slip.",\n  "documentRef": "doc_dentist_slip_441.pdf"\n}',
        responseSample: '{\n  "ticketId": "ovr_9921",\n  "status": "PENDING_ADMIN_REVIEW",\n  "submittedAt": "2026-10-30T09:40:00Z"\n}',
        errorCodes: ['400 Missing Reason', '409 Duplicate Pending Ticket']
      }
    ],
    dbTables: ['override_requests', 'audit_logs', 'notifications'],
    exceptionHandling: [
      'Admin rejects request -> Teacher receives notification with administrator feedback note'
    ],
    coordinates: { x: 480, y: 350 }
  }
];

export const FLOW_EDGES: FlowEdge[] = [
  // Admin Flow
  { id: 'e-adm-1', source: 'admin-login', target: 'admin-dashboard', label: 'JWT Validated' },
  { id: 'e-adm-2', source: 'admin-dashboard', target: 'admin-users', label: 'Account Admin' },
  { id: 'e-adm-3', source: 'admin-users', target: 'admin-master', label: 'Provision Entities' },
  { id: 'e-adm-4', source: 'admin-users', target: 'admin-records', label: 'Manage Records' },
  { id: 'e-adm-5', source: 'admin-records', target: 'admin-reports', label: 'Export & Audit' },

  // Teacher Flow
  { id: 'e-tea-1', source: 'teacher-login', target: 'teacher-dashboard', label: 'Scoped Auth' },
  { id: 'e-tea-2', source: 'teacher-dashboard', target: 'teacher-checkin', label: 'Morning Check-in' },
  { id: 'e-tea-3', source: 'teacher-dashboard', target: 'teacher-roster', label: 'Class Roll-Call' },
  { id: 'e-tea-4', source: 'teacher-roster', target: 'teacher-bulk-attendance', label: 'Mark Present/Absent' },
  { id: 'e-tea-5', source: 'teacher-checkin', target: 'teacher-override-request', label: 'Cutoff Locked (>08:45 AM)', type: 'conditional', conditionText: 'Cutoff Locked' },
  { id: 'e-tea-6', source: 'teacher-bulk-attendance', target: 'teacher-override-request', label: 'Late Edit (>09:30 AM)', type: 'conditional', conditionText: 'Locked Edit' },

  // Cross-Swimlane Escalation Loop back to Admin
  { id: 'e-escalate-1', source: 'teacher-override-request', target: 'admin-records', label: 'Escalate to Admin Override Queue', type: 'escalation', conditionText: 'Adjudication Loop' }
];
