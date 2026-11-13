export type TabType = 'reader' | 'prd' | 'brd' | 'fsd' | 'flowmap' | 'journey' | 'estimation' | 'analysis';

export interface FlowNode {
  id: string;
  role: 'admin' | 'teacher';
  title: string;
  subtitle: string;
  iconName: string;
  swimlane: string;
  stepNumber: number;
  category: 'auth' | 'dashboard' | 'crud' | 'config' | 'attendance' | 'escalation' | 'reports';
  description: string;
  inputs: string[];
  outputs: string[];
  businessRules: string[];
  apiEndpoints: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    authScope: string;
    requestSample?: string;
    responseSample?: string;
    errorCodes: string[];
  }[];
  dbTables: string[];
  exceptionHandling: string[];
  coordinates: { x: number; y: number };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'standard' | 'conditional' | 'escalation';
  conditionText?: string;
}

export interface UserJourneyStep {
  stepIndex: number;
  phase: string;
  userAction: string;
  userGoal: string;
  systemResponse: string;
  uiScreenMock: string;
  emotionalState: 'confident' | 'neutral' | 'stressed' | 'relieved' | 'satisfied';
  frictionRisk: string;
  technicalTouchpoint: string;
  kpiMetric: string;
}

export interface UserJourneyPersona {
  id: string;
  name: string;
  roleTitle: string;
  avatarSeed: string;
  department: string;
  primaryGoals: string[];
  keyFrustrations: string[];
  steps: UserJourneyStep[];
}

export interface BrdRequirement {
  id: string;
  module: string;
  title: string;
  description: string;
  businessValue: string;
  priority: 'Must Have' | 'Should Have' | 'Could Have' | 'Won\'t Have';
  acceptanceCriteria: string[];
  stakeholder: string;
}

export interface FsdApiEndpoint {
  module: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  description: string;
  headers: Record<string, string>;
  requestBody?: string;
  responseBody: string;
  securityScope: string;
  validationRules: string[];
}

export interface FsdDbEntity {
  tableName: string;
  description: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    isPrimary?: boolean;
    isForeign?: boolean;
    description: string;
  }[];
  indices: string[];
}

export interface EstimationTask {
  id: string;
  wbsCode: string;
  sprint: number;
  title: string;
  category: 'Frontend' | 'Backend' | 'Security & RBAC' | 'Database' | 'DevOps & CI/CD' | 'QA & Testing';
  optimisticDays: number;
  mostLikelyDays: number;
  pessimisticDays: number;
  storyPoints: number;
  assignedRole: string;
  deliverables: string;
}
