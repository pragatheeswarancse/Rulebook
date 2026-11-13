import { FsdApiEndpoint, FsdDbEntity } from '../types';

export const FSD_METADATA = {
  documentId: 'FSD-EDUPULSE-2026-V1.0',
  title: 'Functional Specification Document (FSD)',
  subTitle: 'EduPulse School Attendance & Administration Management System',
  author: 'Lead Software Architect & Engineering Systems Team',
  targetAudience: 'Engineering Teams, QA Automation, Tech Leads, DevOps, Stakeholders',
  complianceStandards: 'IEEE 830-1998, ISO/IEC/IEEE 29148:2018, FERPA, GDPR-K',
  lastUpdated: 'October 30, 2026',
  version: '1.0.0-RELEASE'
};

export const FSD_API_ENDPOINTS: FsdApiEndpoint[] = [
  {
    module: 'Authentication & Session RBAC',
    name: 'Admin / Staff JWT Login',
    method: 'POST',
    endpoint: '/api/v1/auth/login',
    description: 'Authenticates admin or teacher credentials, executes MFA verification if enabled, and issues cryptographically signed JWT with explicit scope and role claims.',
    headers: { 'Content-Type': 'application/json' },
    requestBody: JSON.stringify({
      email: 'teacher.vance@school.edu',
      password: 'SecureP@ssw0rd!2026',
      totpCode: '491028',
      clientMetadata: { device: 'Chrome 124 / macOS', campusWifiSsid: 'Oakridge_Faculty_Secure' }
    }, null, 2),
    responseBody: JSON.stringify({
      status: 'SUCCESS',
      accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      tokenType: 'Bearer',
      expiresInSeconds: 900,
      user: {
        id: 'usr_tea_491',
        fullName: 'Eleanor Vance',
        email: 'e.vance@school.edu',
        role: 'TEACHER',
        assignedSections: ['sec_10B_2026', 'sec_9A_2026'],
        permissions: ['attendance:mark', 'attendance:override_request', 'roster:read']
      }
    }, null, 2),
    securityScope: 'Public endpoint with IP-based rate limiting (5 req/min/IP)',
    validationRules: [
      'Email must match standard RFC 5322 format',
      'Password minimum 10 chars with at least 1 digit, 1 special character',
      'Account locks automatically for 15 minutes upon 5 consecutive failed attempts'
    ]
  },
  {
    module: 'Staff Self-Check-in',
    name: 'Record Daily Staff Check-in',
    method: 'POST',
    endpoint: '/api/v1/teacher/check-in',
    description: 'Submits staff daily check-in with GPS telemetry. Enforces morning arrival window (07:30 - 08:45 AM). Flags 08:46 - 09:15 AM as late, and locks past 09:15 AM.',
    headers: { 'Authorization': 'Bearer <TEACHER_JWT>', 'Content-Type': 'application/json' },
    requestBody: JSON.stringify({
      timestamp: '2026-10-30T08:14:22.108Z',
      coordinates: { latitude: 37.774929, longitude: -122.419416, accuracyMeters: 8.5 },
      deviceUuid: 'dev_iphone_15_fac491'
    }, null, 2),
    responseBody: JSON.stringify({
      checkInId: 'chk_staff_99182',
      status: 'ON_TIME',
      checkInTime: '08:14:22',
      cutoffStatus: 'ACCEPTED',
      geofenceVerified: true,
      dutyStatus: 'ACTIVE_ON_CAMPUS'
    }, null, 2),
    securityScope: 'Bearer JWT (role: TEACHER or role: STAFF)',
    validationRules: [
      'Timestamp must be within +/- 60 seconds of server clock to prevent spoofing',
      'GPS coordinates must fall within 250m circular radius of campus centroid',
      'Check-in rejected with HTTP 423 if submitted after 09:15 AM cutoff'
    ]
  },
  {
    module: 'Classroom Roll-Call Engine',
    name: 'Bulk Submit Student Attendance',
    method: 'POST',
    endpoint: '/api/v1/teacher/sections/{sectionId}/attendance',
    description: 'Bulk records student attendance statuses (PRESENT, ABSENT, LATE, EXCUSED) for a designated academic period and triggers automated parent alerts for unexcused absences.',
    headers: { 'Authorization': 'Bearer <TEACHER_JWT>', 'Content-Type': 'application/json' },
    requestBody: JSON.stringify({
      date: '2026-10-30',
      periodNumber: 1,
      subjectId: 'sub_bio_101',
      attendanceRecords: [
        { studentId: 'stu_101', status: 'PRESENT' },
        { studentId: 'stu_102', status: 'ABSENT', note: 'Unreported absence' },
        { studentId: 'stu_103', status: 'LATE', arrivalTime: '09:12:00', note: 'Bus delay' },
        { studentId: 'stu_104', status: 'PRESENT' }
      ]
    }, null, 2),
    responseBody: JSON.stringify({
      sessionId: 'att_ses_20261030_10B_P1',
      recordedAt: '2026-10-30T09:05:41Z',
      totalEnrolled: 32,
      presentCount: 30,
      absentCount: 1,
      lateCount: 1,
      cutoffLockTime: '2026-10-30T09:30:00Z',
      immutableHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    }, null, 2),
    securityScope: 'Bearer JWT with sectionId included in assignedSections claim',
    validationRules: [
      'Teacher must be assigned to sectionId in current academic year',
      'Submission blocked if server timestamp > 09:30 AM (returns HTTP 423 Locked)',
      'All student IDs must belong to the active enrolled roster of sectionId'
    ]
  },
  {
    module: 'Discrepancy Escalation & Override',
    name: 'Request Admin Attendance Override',
    method: 'POST',
    endpoint: '/api/v1/teacher/attendance/override-request',
    description: 'Filing of a formal escalation ticket when cutoff is locked or an error requires administrative amendment. Notifies School Administrator queue immediately.',
    headers: { 'Authorization': 'Bearer <TEACHER_JWT>', 'Content-Type': 'application/json' },
    requestBody: JSON.stringify({
      sessionId: 'att_ses_20261030_10B_P1',
      studentId: 'stu_102',
      originalStatus: 'ABSENT',
      requestedStatus: 'PRESENT',
      justificationReason: 'Student Aria Chen was reporting to the nurse office at 09:00 AM for routine allergy checkup. Medical pass verified.',
      supportingDocumentUrl: 'https://storage.school.edu/passes/nurse_slip_491.pdf'
    }, null, 2),
    responseBody: JSON.stringify({
      ticketId: 'ovr_tk_99104',
      status: 'PENDING_ADMIN_REVIEW',
      submittedAt: '2026-10-30T09:42:15Z',
      assignedToQueue: 'admin_overrides_priority',
      slaMinutes: 120
    }, null, 2),
    securityScope: 'Bearer JWT (role: TEACHER)',
    validationRules: [
      'Justification reason string length must be between 20 and 500 characters',
      'Cannot submit duplicate pending override ticket for the same student and session'
    ]
  },
  {
    module: 'Admin Adjudication & Override',
    name: 'Adjudicate Override Request',
    method: 'PATCH',
    endpoint: '/api/v1/admin/attendance/overrides/{ticketId}',
    description: 'Administrator reviews and either APPROVES or REJECTS the teacher override request. If approved, atomically updates attendance record and writes to immutable audit ledger.',
    headers: { 'Authorization': 'Bearer <ADMIN_JWT>', 'Content-Type': 'application/json' },
    requestBody: JSON.stringify({
      decision: 'APPROVED',
      adminNote: 'Verified with nurse station. Roll-call amended to PRESENT with excused late annotation.',
      finalStatus: 'PRESENT'
    }, null, 2),
    responseBody: JSON.stringify({
      ticketId: 'ovr_tk_99104',
      status: 'RESOLVED',
      decision: 'APPROVED',
      resolvedBy: 'Dr. Marcus Sterling (Principal)',
      resolvedAt: '2026-10-30T09:48:30Z',
      auditLogId: 'aud_log_884920'
    }, null, 2),
    securityScope: 'Bearer JWT (role: SYSTEM_ADMIN with permission: sys:override:write)',
    validationRules: [
      'Admin decision must be either APPROVED or REJECTED',
      'Admin note mandatory (min 10 characters) for regulatory compliance',
      'Record locked pessimistically during atomic state transition'
    ]
  },
  {
    module: 'Compliance & Export Engine',
    name: 'Generate Global Compliance & Audit Report',
    method: 'POST',
    endpoint: '/api/v1/admin/reports/generate',
    description: 'Produces signed audit and compliance reports in PDF, Excel, or CSV format with SHA-256 digital verification hashes for state education boards.',
    headers: { 'Authorization': 'Bearer <ADMIN_JWT>', 'Content-Type': 'application/json' },
    requestBody: JSON.stringify({
      reportType: 'DISTRICT_BOARD_MONTHLY_COMPLIANCE',
      format: 'PDF',
      dateRange: { startDate: '2026-10-01', endDate: '2026-10-30' },
      filters: { gradeLevel: 'ALL', includeOverrides: true, includeAuditHistory: true }
    }, null, 2),
    responseBody: JSON.stringify({
      jobId: 'job_rep_55102',
      status: 'COMPLETED',
      downloadUrl: 'https://cdn.school.edu/exports/compliance_oct_2026_signed.pdf',
      fileSizeBytes: 2490184,
      digitalSignatureSha256: '9f83377d860e6118629d6f114f7988da4e297ac734ab5c9ef964d0b5e40a042d'
    }, null, 2),
    securityScope: 'Bearer JWT (role: SYSTEM_ADMIN)',
    validationRules: [
      'Date range cannot exceed 365 calendar days in a single sync request',
      'Generates immutable audit trail record of report generation with executing admin ID'
    ]
  }
];

export const FSD_DATABASE_ENTITIES: FsdDbEntity[] = [
  {
    tableName: 'users',
    description: 'Central identity table holding administrative staff, faculty teachers, and system operators.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'Unique user identifier (e.g. usr_tea_491)' },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, description: 'Normalized institutional email address (UNIQUE)' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'Argon2id cryptographic password hash' },
      { name: 'role', type: 'ENUM(ADMIN, TEACHER, STAFF)', nullable: false, description: 'Primary RBAC role classification' },
      { name: 'full_name', type: 'VARCHAR(128)', nullable: false, description: 'Legal name of staff/teacher' },
      { name: 'employee_code', type: 'VARCHAR(32)', nullable: false, description: 'School district staff registration number' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Account status flag (soft-deactivation support)' },
      { name: 'failed_login_count', type: 'INTEGER', nullable: false, description: 'Consecutive failed auth counter for lockout' },
      { name: 'locked_until', type: 'TIMESTAMP', nullable: true, description: 'Timestamp when brute-force lockout expires' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, description: 'Record creation timestamp' }
    ],
    indices: ['CREATE UNIQUE INDEX idx_users_email ON users(email);', 'CREATE INDEX idx_users_role ON users(role);']
  },
  {
    tableName: 'sections',
    description: 'Master classroom division linking grades, academic years, and homeroom faculty.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'Section identifier (e.g. sec_10B_2026)' },
      { name: 'grade_level', type: 'VARCHAR(16)', nullable: false, description: 'Grade/Standard level (e.g. 10)' },
      { name: 'section_name', type: 'VARCHAR(16)', nullable: false, description: 'Section division symbol (e.g. B)' },
      { name: 'academic_year', type: 'VARCHAR(16)', nullable: false, description: 'Academic school year (e.g. 2026-2027)' },
      { name: 'homeroom_teacher_id', type: 'VARCHAR(64)', nullable: false, isForeign: true, description: 'Foreign Key -> users.id' },
      { name: 'room_number', type: 'VARCHAR(32)', nullable: true, description: 'Designated campus classroom location' },
      { name: 'capacity', type: 'INTEGER', nullable: false, description: 'Maximum student enrollment limit' }
    ],
    indices: ['CREATE UNIQUE INDEX idx_grade_section_year ON sections(grade_level, section_name, academic_year);']
  },
  {
    tableName: 'attendance_sessions',
    description: 'Roll-call session instances created for each class section and period.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'Session primary key (e.g. att_ses_20261030_10B_P1)' },
      { name: 'section_id', type: 'VARCHAR(64)', nullable: false, isForeign: true, description: 'Foreign Key -> sections.id' },
      { name: 'recorded_by_teacher_id', type: 'VARCHAR(64)', nullable: false, isForeign: true, description: 'Foreign Key -> users.id' },
      { name: 'session_date', type: 'DATE', nullable: false, description: 'Calendar date of attendance' },
      { name: 'period_number', type: 'INTEGER', nullable: false, description: 'Timetable period slot (1 through 8)' },
      { name: 'status', type: 'ENUM(PENDING, SUBMITTED, LOCKED, AMENDED)', nullable: false, description: 'Lifecycle state of session' },
      { name: 'cutoff_time', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, description: 'Calculated lock deadline timestamp (09:30 AM)' },
      { name: 'submitted_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: true, description: 'Timestamp when teacher clicked submit' }
    ],
    indices: ['CREATE UNIQUE INDEX idx_session_date_section_period ON attendance_sessions(session_date, section_id, period_number);']
  },
  {
    tableName: 'student_attendance_records',
    description: 'Granular individual student status entries within an attendance session.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'Record identifier' },
      { name: 'session_id', type: 'VARCHAR(64)', nullable: false, isForeign: true, description: 'Foreign Key -> attendance_sessions.id' },
      { name: 'student_id', type: 'VARCHAR(64)', nullable: false, description: 'Student unique roster ID' },
      { name: 'status', type: 'ENUM(PRESENT, ABSENT, LATE, EXCUSED)', nullable: false, description: 'Recorded attendance status' },
      { name: 'teacher_note', type: 'TEXT', nullable: true, description: 'Optional explanation note from class teacher' },
      { name: 'is_overridden', type: 'BOOLEAN', nullable: false, description: 'True if amended by admin override action' },
      { name: 'last_modified_by', type: 'VARCHAR(64)', nullable: false, description: 'User ID of last modifying actor' }
    ],
    indices: ['CREATE UNIQUE INDEX idx_session_student ON student_attendance_records(session_id, student_id);']
  },
  {
    tableName: 'override_requests',
    description: 'Escalation queue storing locked cutoff modification petitions from teachers to admins.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'Ticket ID (e.g. ovr_tk_99104)' },
      { name: 'session_id', type: 'VARCHAR(64)', nullable: false, isForeign: true, description: 'Foreign Key -> attendance_sessions.id' },
      { name: 'student_id', type: 'VARCHAR(64)', nullable: false, description: 'Student identifier' },
      { name: 'requested_by_teacher_id', type: 'VARCHAR(64)', nullable: false, isForeign: true, description: 'Foreign Key -> users.id' },
      { name: 'original_status', type: 'ENUM(PRESENT, ABSENT, LATE, EXCUSED)', nullable: false, description: 'Status at time of lock' },
      { name: 'requested_status', type: 'ENUM(PRESENT, ABSENT, LATE, EXCUSED)', nullable: false, description: 'Requested new status' },
      { name: 'justification_reason', type: 'TEXT', nullable: false, description: 'Teacher explanation (min 20 chars)' },
      { name: 'status', type: 'ENUM(PENDING, APPROVED, REJECTED)', nullable: false, description: 'Adjudication status' },
      { name: 'reviewed_by_admin_id', type: 'VARCHAR(64)', nullable: true, isForeign: true, description: 'Foreign Key -> users.id' },
      { name: 'admin_resolution_note', type: 'TEXT', nullable: true, description: 'Mandatory admin comment upon resolution' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, description: 'Submission timestamp' },
      { name: 'resolved_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: true, description: 'Approval/rejection timestamp' }
    ],
    indices: ['CREATE INDEX idx_override_status ON override_requests(status);']
  },
  {
    tableName: 'audit_logs',
    description: 'Immutable regulatory audit record tracking all security, override, and access events.',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'Cryptographic log entry hash ID' },
      { name: 'actor_user_id', type: 'VARCHAR(64)', nullable: false, description: 'User ID responsible for action' },
      { name: 'actor_role', type: 'VARCHAR(32)', nullable: false, description: 'Active role at time of transaction' },
      { name: 'action_type', type: 'VARCHAR(64)', nullable: false, description: 'e.g. OVERRIDE_APPROVED, USER_CREATED, CUTOFF_LOCKED' },
      { name: 'target_entity', type: 'VARCHAR(64)', nullable: false, description: 'e.g. student_attendance_records' },
      { name: 'target_entity_id', type: 'VARCHAR(64)', nullable: false, description: 'Primary key of modified record' },
      { name: 'before_state_json', type: 'JSONB', nullable: true, description: 'Snapshot prior to state change' },
      { name: 'after_state_json', type: 'JSONB', nullable: true, description: 'Snapshot post state change' },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: false, description: 'IPv4 / IPv6 client address' },
      { name: 'timestamp', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, description: 'Tamper-evident timestamp' }
    ],
    indices: ['CREATE INDEX idx_audit_target ON audit_logs(target_entity, target_entity_id);', 'CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);']
  }
];

export const FSD_BUSINESS_RULES = [
  {
    ruleCode: 'BR-SEC-01',
    title: 'Scoped RBAC Enforcement for Teachers',
    description: 'A teacher token contains scoped permissions strictly constrained to assigned class sections. The database layer employs Row-Level Security (RLS) and API gateway middleware to abort any access to unassigned classes with HTTP 403 Forbidden.'
  },
  {
    ruleCode: 'BR-ATT-02',
    title: 'Daily Cutoff Lockout Mechanism',
    description: 'School attendance roll-call carries a mandatory morning submission cutoff at 09:30 AM local campus time. At 09:30:01 AM, any unfinished or submitted session automatically transitions to LOCKED status. Direct edits by teachers are blocked.'
  },
  {
    ruleCode: 'BR-OVR-03',
    title: 'Dual-Key Override Workflow Escalation',
    description: 'When a locked record requires modification (e.g. late medical arrival or roll-call clerical error), the teacher must file a Restricted Override Request. The request can only be finalized by a designated School Administrator with formal justification.'
  },
  {
    ruleCode: 'BR-AUD-04',
    title: 'Cryptographic Immutability of Audit Trails',
    description: 'Every override adjudication, status amendment, and configuration change generates an append-only audit record stored with a SHA-256 chain checksum. Audit records can never be updated or deleted, guaranteeing FERPA compliance.'
  },
  {
    ruleCode: 'BR-GEO-05',
    title: 'Campus Geofence Boundary Check',
    description: 'Teacher morning self check-in requires GPS verification within 250 meters of campus administrative perimeter. Staff clock-in outside the geofence prompts campus Wi-Fi hardware SSID secondary validation.'
  }
];
