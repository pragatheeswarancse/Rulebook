import { FlowNode, FlowEdge, UserJourneyStep, BrdRequirement, FsdApiEndpoint } from './index';

export interface LocMetric {
  fileName: string;
  grossLines: number;
  designerLines: number;
  blankLines: number;
  commentLines: number;
  logicLines: number;
  necessaryLoc: number;
  notes: string;
}

export interface ScopeBenchmark {
  moduleName: string;
  runtimeToday: string;
  appLogicLoc: number;
  designerLayout: number;
  activeStoredProcs: string;
  formsCount: number;
  writesBusinessData: boolean;
  locRatioVsCalendar: number;
  benchmarkHours: number;
  hourIndexVsCalendar: number;
  primaryUx: string;
  userWorkflows: string;
}

export interface ComplexityRating {
  area: string;
  level: 'Low' | 'Low-Medium' | 'Medium' | 'Medium-High' | 'High';
  justification: string;
}

export interface FeatureItem {
  code: string;
  title: string;
  description: string;
  isActiveInEstimate: boolean;
  category: 'Setup & Auth' | 'Filter Surface' | 'Data Pipeline' | 'Tree UX' | 'Reporting & Launchers';
}

export interface AnalyzedEngineeringDocument {
  id: string;
  title: string;
  documentType: string;
  moduleName: string;
  sourceScannedPath: string;
  scanDate: string;
  currentStack: string;
  targetModernizationStack: string;
  headlineSummary: string;
  sourceFilePath?: string;
  
  // LOC Metrics
  locMetrics: LocMetric[];
  headlineLoc: {
    necessaryLoc: number;
    uiLayoutLines: number;
    logicPlusUiLayout: number;
    allFilesWithUtilities: number;
  };

  // Complexity & Benchmarks
  complexityBreakdown: ComplexityRating[];
  benchmarks: ScopeBenchmark[];
  
  // Functional Scope & Rules
  features: FeatureItem[];
  excludedItems: string[];
  businessRules: { code: string; title: string; description: string }[];

  // Visual Assets generated
  flowNodes: FlowNode[];
  flowEdges: FlowEdge[];
  userJourneySteps: UserJourneyStep[];

  // Estimation Numbers
  recommendedHours: number;
  hourIndex: number;
  locIndex: number;
  confidenceScore: number;
}
