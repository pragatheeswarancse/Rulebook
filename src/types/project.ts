import { AnalyzedEngineeringDocument } from './documentAnalysis';
import { FlowNode, FlowEdge, UserJourneyStep, BrdRequirement, FsdApiEndpoint, FsdDbEntity, EstimationTask } from './index';

export interface PrdSection {
  visionStatement: string;
  targetAudience: { persona: string; description: string; coreNeed: string }[];
  problemStatement: string;
  valueProposition: string;
  successMetrics: { metric: string; target: string; baseline: string }[];
  coreWorkflows: { workflowName: string; steps: string[]; outcome: string }[];
}

export interface EngineeringProject {
  id: string;
  name: string;
  clientName: string;
  domain: 'Enterprise Modernization' | 'EdTech & Governance' | 'Financial & Billing' | 'Healthcare' | 'Custom';
  targetStack: string;
  currentStack: string;
  sourceDocName: string;
  sourceDocPath?: string;
  fileSizeBytes?: number;
  uploadedAt: string;
  status: 'ready' | 'analyzing';
  
  // Structured Dimensions
  prd: PrdSection;
  brd: {
    objectives: string[];
    stakeholders: { role: string; name: string; raci: string; responsibility: string }[];
    requirements: BrdRequirement[];
    asIsVsToBe: { area: string; asIs: string; toBe: string; impact: string }[];
    roiMetrics: { metric: string; value: string; context: string }[];
  };
  fsd: {
    architectureTopology: string;
    endpoints: FsdApiEndpoint[];
    entities: FsdDbEntity[];
    businessRules: { ruleCode: string; title: string; description: string }[];
  };
  estimation: {
    totalLoc: number;
    necessaryLoc: number;
    recommendedHours: number;
    hourIndex: number;
    confidenceScore: number;
    tasks: EstimationTask[];
  };
  flowmap: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  userJourney: {
    personaName: string;
    roleTitle: string;
    steps: UserJourneyStep[];
  };
  rawDocument?: AnalyzedEngineeringDocument;
}
