export type ScreenType = 'projects' | 'upload' | 'analyze' | 'landing';

export type PerspectiveType = 'frontend' | 'backend' | 'manager';

export type AnalyzeSection = 
  | 'overview' 
  | 'roles' 
  | 'facts' 
  | 'scope' 
  | 'questions' 
  | 'review' 
  | 'role_map' 
  | 'ui_playground' 
  | 'tasks' 
  | 'forecast'
  | 'reader';

export type WorkStatus = 'Existing' | 'Proposed' | 'Not established';
export type DeliveryScope = 'Included' | 'Excluded' | 'Undecided' | 'Not established';
export type ReviewState = 'AI Draft' | 'Approved' | 'Rejected' | 'Unresolved';
export type PermissionEffect = 'Allow' | 'Deny' | 'Require' | 'Not established';
export type RecordScope = 'Own' | 'Assigned' | 'Class-specific' | 'Team-wide' | 'Global' | 'None';
export type QuestionState = 'Open' | 'Answered' | 'Deferred' | 'Resolved';

export type PrimaryPurpose = 
  | 'FSD or detailed requirements' 
  | 'BRD' 
  | 'Existing system description' 
  | 'Estimation or analysis report' 
  | 'Feature inventory' 
  | 'Mixed or unclear';

export interface RulebookPage {
  pageNumber: number;
  text: string;
  hasWarnings: boolean;
  warnings: string[];
  characterCount: number;
  isScanned?: boolean;
}

export interface PurposeUnderstanding {
  primaryPurpose: PrimaryPurpose;
  module: string;
  currentSituation: string;
  intendedWork: string;
  unknowns: string[];
  isUserCorrected: boolean;
  userNotes?: string;
  supportingEvidence: { page: number; passage: string }[];
}

export interface AccessRecord {
  id: string;
  role: string;
  relationship: 'Performer' | 'Requester' | 'Approver' | 'Viewer' | 'Subject';
  action: string;
  resource: string;
  effect: PermissionEffect;
  recordScope: RecordScope;
  conditions: string;
  provenance: { page: number; passage: string };
  reviewState: ReviewState;
  reviewNotes?: string;
}

export interface FactRecord {
  id: string;
  type: 'behavior' | 'dependency' | 'numeric';
  statement: string;
  details: string;
  units?: string;
  referent?: string;
  provenance: { page: number; passage: string };
  reviewState: ReviewState;
  reviewNotes?: string;
}

export interface ScopeItem {
  id: string;
  functionalArea: string;
  title: string;
  description: string;
  workStatus: WorkStatus;
  deliveryScope: DeliveryScope;
  provenance: { page: number; passage: string };
  reviewState: ReviewState;
  reviewNotes?: string;
}

export interface ScopeBoundaryAnalysis {
  functionalAreas: string[];
  items: ScopeItem[];
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  basis: string;
  impact: string;
  state: QuestionState;
  blocking: boolean;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
}

export interface ApprovedBaseline {
  id: string;
  name: string;
  approvedBy: string;
  approvedAt: string;
  includedScopeCount: number;
  status: 'active' | 'stale';
}

export interface RoleMapActionNode {
  id: string;
  actionName: string;
  effect: PermissionEffect;
  recordScope: RecordScope;
  conditions: string;
  sourcePage: number;
  sourcePassage: string;
  isBackend?: boolean;
}

export interface RoleMapFeatureNode {
  featureName: string;
  actions: RoleMapActionNode[];
}

export interface RoleMapRoleNode {
  roleName: string;
  features: RoleMapFeatureNode[];
}

export interface BranchingRoleMapData {
  roles: RoleMapRoleNode[];
}

export interface UIPlaygroundField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'date' | 'button';
  defaultValue?: string;
  options?: string[];
  required?: boolean;
  readOnlyForRoles?: string[];
  sourceRequirement: string;
}

export interface UIPlaygroundAction {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'danger';
  requiredRole: string[];
  forbiddenMessage?: string;
}

export interface UIPlaygroundScreen {
  id: string;
  title: string;
  roleAccess: Record<string, { allowed: boolean; restrictionReason?: string; recordScope: RecordScope }>;
  fields: UIPlaygroundField[];
  mockRecords: Record<string, any>[];
  actions: UIPlaygroundAction[];
}

export interface UIPlaygroundData {
  roles: string[];
  activeRole: string;
  screens: UIPlaygroundScreen[];
}

export interface TaskItem {
  id: string;
  outcome: string;
  discipline: 'Frontend' | 'Backend' | 'Integration' | 'Data' | 'Testing' | 'Deployment';
  prerequisites: string[];
  dependencies: string[];
  acceptanceChecks: string[];
  optimisticDays: number;
  expectedDays: number;
  pessimisticDays: number;
  assignedRole: string;
  status: 'Draft' | 'Approved' | 'Excluded' | 'Blocked';
}

export interface DeliveryForecast {
  knownScopeHours: number;
  engineersCount: number;
  hoursPerDay: number;
  bufferPercent: number;
  optimisticWeeks: number;
  expectedWeeks: number;
  pessimisticWeeks: number;
  knownPercent: number;
  assumedPercent: number;
  blockedPercent: number;
  assumptions: string[];
  blockers: string[];
}

export interface AiFlowchartRole {
  id: string;
  name: string;
  accessSummary: string;
}

export interface AiFlowchartNode {
  id: string;
  roleId: string;
  stepOrder: number;
  label: string;
  sublabel: string;
  nodeType: 'role_entry' | 'action' | 'decision' | 'outcome' | 'blocked';
  summary: string;
  techTouchpoint: string;
  ruleHint?: string;
  outcomeState?: string;
  sourcePage: number;
}

export interface AiFlowchartEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  edgeType: 'normal' | 'allow' | 'deny';
}

export interface AiFlowchartTokenUsage {
  promptTokens: number;
  outputTokens: number;
  totalTokens: number;
  contextChars?: number;
}

export interface AiFlowchartData {
  diagramTitle: string;
  summary: string;
  perspective: 'frontend' | 'backend';
  focusTopic?: string;
  modelUsed?: string;
  generatedAt?: string;
  tokenUsage?: AiFlowchartTokenUsage;
  stageLabels?: string[];
  roles: AiFlowchartRole[];
  nodes: AiFlowchartNode[];
  edges: AiFlowchartEdge[];
}

export interface RulebookAnalysis {
  purpose: PurposeUnderstanding;
  roles: AccessRecord[];
  facts: FactRecord[];
  scope: ScopeBoundaryAnalysis;
  questions: ClarificationQuestion[];
  baselineHistory: ApprovedBaseline[];
  roleMap: BranchingRoleMapData;
  uiPlayground: UIPlaygroundData;
  tasks: TaskItem[];
  forecast: DeliveryForecast;
  aiFlowcharts?: {
    frontend?: AiFlowchartData;
    backend?: AiFlowchartData;
  };
}

export interface DocumentVersion {
  versionId: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: string;
  contentFingerprint: string;
  pageCount: number;
  pages: RulebookPage[];
  analysis: RulebookAnalysis;
}

export interface RulebookProject {
  id: string;
  name: string;
  objective?: string;
  clientName?: string;
  domain: string;
  latestVersion: string;
  status: 'draft' | 'needs_review' | 'approved_baseline' | 'stale';
  unresolvedCount: number;
  createdAt: string;
  updatedAt: string;
  versions: DocumentVersion[];
  currentVersionId: string;
  activeBaseline?: ApprovedBaseline;
  selectedPerspective?: PerspectiveType;
}
