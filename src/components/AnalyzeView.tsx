import React, { useState, useMemo } from 'react';
import { 
  GitBranch, 
  FileText, 
  Play, 
  BarChart3, 
  Eye, 
  Layers,
  HelpCircle,
  Users,
  Binary,
  Compass,
  CheckSquare,
  ShieldCheck,
  FileCode2,
  Laptop,
  Database,
  Briefcase,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { 
  RulebookProject, 
  AnalyzeSection, 
  PurposeUnderstanding, 
  ScopeItem, 
  ClarificationQuestion, 
  QuestionState, 
  ApprovedBaseline,
  PerspectiveType
} from '../types/rulebook';
import { PurposeOverviewSection } from './analyze/PurposeOverviewSection';
import { RolesAccessSection } from './analyze/RolesAccessSection';
import { BehaviorsFactsSection } from './analyze/BehaviorsFactsSection';
import { ScopeBoundariesSection } from './analyze/ScopeBoundariesSection';
import { ClarificationQuestionsSection } from './analyze/ClarificationQuestionsSection';
import { HumanReviewSection } from './analyze/HumanReviewSection';
import { BranchingRoleMapSection } from './analyze/BranchingRoleMapSection';
import { UIPlaygroundSection } from './analyze/UIPlaygroundSection';
import { TasksAcceptanceSection } from './analyze/TasksAcceptanceSection';
import { EffortForecastSection } from './analyze/EffortForecastSection';
import { FrontendPerspectiveView } from './perspective/FrontendPerspectiveView';
import { BackendPerspectiveView } from './perspective/BackendPerspectiveView';
import { ManagerPerspectiveView } from './perspective/ManagerPerspectiveView';
import { PerspectiveSelectorModal } from './perspective/PerspectiveSelectorModal';

interface Props {
  project: RulebookProject;
  activeSection: AnalyzeSection;
  onSelectSection: (section: AnalyzeSection) => void;
  onOpenSourcePage: (page: number) => void;
  onUpdateProject: (updated: RulebookProject) => void;
  onOpenReader: () => void;
}

type MasterCategory = 'flowchart' | 'rules' | 'sandbox' | 'delivery';
type ViewPerspectiveMode = 'frontend' | 'backend' | 'manager' | 'granular';

export const AnalyzeView: React.FC<Props> = ({
  project,
  activeSection,
  onSelectSection,
  onOpenSourcePage,
  onUpdateProject,
  onOpenReader
}) => {
  const currentVersion = project?.versions?.find(v => v.versionId === project?.currentVersionId) || project?.versions?.[0];
  const analysis = currentVersion?.analysis;

  // Active Perspective Mode (Frontend / Backend / PO or Manager / Granular)
  const [activePerspective, setActivePerspective] = useState<ViewPerspectiveMode>(
    project.selectedPerspective || 'frontend'
  );
  const [isPerspectiveModalOpen, setIsPerspectiveModalOpen] = useState(false);

  if (!project || !currentVersion || !analysis) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-[#E2E8F0]">
        <p className="text-xs text-[#64748B]">Project data is loading or unavailable.</p>
      </div>
    );
  }

  const handleSelectPerspective = (persp: PerspectiveType) => {
    setActivePerspective(persp);
    onUpdateProject({
      ...project,
      selectedPerspective: persp
    });
  };

  // Active Category Mapping for Granular mode
  const activeCategory: MasterCategory = useMemo(() => {
    switch (activeSection) {
      case 'role_map':
        return 'flowchart';
      case 'overview':
      case 'roles':
      case 'facts':
      case 'scope':
        return 'rules';
      case 'ui_playground':
      case 'questions':
        return 'sandbox';
      case 'tasks':
      case 'forecast':
      case 'review':
        return 'delivery';
      default:
        return 'flowchart';
    }
  }, [activeSection]);

  // State update handlers
  const handleUpdatePurpose = (updatedPurpose: PurposeUnderstanding) => {
    const updatedVersion = {
      ...currentVersion,
      analysis: { ...analysis, purpose: updatedPurpose }
    };
    onUpdateProject({
      ...project,
      versions: project.versions.map(v => v.versionId === currentVersion.versionId ? updatedVersion : v)
    });
  };

  const handleUpdateRoleState = (roleId: string, newState: 'Approved' | 'Rejected' | 'Unresolved') => {
    const updatedRoles = analysis.roles.map(r => r.id === roleId ? { ...r, reviewState: newState } : r);
    const updatedVersion = {
      ...currentVersion,
      analysis: { ...analysis, roles: updatedRoles }
    };
    onUpdateProject({
      ...project,
      versions: project.versions.map(v => v.versionId === currentVersion.versionId ? updatedVersion : v)
    });
  };

  const handleUpdateFactState = (factId: string, newState: 'Approved' | 'Rejected' | 'Unresolved') => {
    const updatedFacts = analysis.facts.map(f => f.id === factId ? { ...f, reviewState: newState } : f);
    const updatedVersion = {
      ...currentVersion,
      analysis: { ...analysis, facts: updatedFacts }
    };
    onUpdateProject({
      ...project,
      versions: project.versions.map(v => v.versionId === currentVersion.versionId ? updatedVersion : v)
    });
  };

  const handleUpdateScopeItem = (itemId: string, updates: Partial<ScopeItem>) => {
    const updatedItems = analysis.scope.items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    const updatedVersion = {
      ...currentVersion,
      analysis: {
        ...analysis,
        scope: {
          ...analysis.scope,
          items: updatedItems
        }
      }
    };
    onUpdateProject({
      ...project,
      versions: project.versions.map(v => v.versionId === currentVersion.versionId ? updatedVersion : v)
    });
  };

  const handleAnswerQuestion = (questionId: string, answer: string) => {
    const updatedQuestions = analysis.questions.map(q => 
      q.id === questionId 
        ? { ...q, answer, state: 'Answered' as QuestionState } 
        : q
    );
    const unresolvedRemaining = updatedQuestions.filter(q => q.state === 'Open').length;
    const updatedVersion = {
      ...currentVersion,
      analysis: { ...analysis, questions: updatedQuestions }
    };
    onUpdateProject({
      ...project,
      unresolvedCount: unresolvedRemaining,
      versions: project.versions.map(v => v.versionId === currentVersion.versionId ? updatedVersion : v)
    });
  };

  const handleUpdateQuestionState = (questionId: string, newState: QuestionState) => {
    const updatedQuestions = analysis.questions.map(q => 
      q.id === questionId ? { ...q, state: newState } : q
    );
    const unresolvedRemaining = updatedQuestions.filter(q => q.state === 'Open').length;
    const updatedVersion = {
      ...currentVersion,
      analysis: { ...analysis, questions: updatedQuestions }
    };
    onUpdateProject({
      ...project,
      unresolvedCount: unresolvedRemaining,
      versions: project.versions.map(v => v.versionId === currentVersion.versionId ? updatedVersion : v)
    });
  };

  const handleUpdateTaskStatus = (taskId: string, status: any) => {
    const updatedTasks = analysis.tasks.map(t => 
      t.id === taskId ? { ...t, status } : t
    );
    const updatedVersion = {
      ...currentVersion,
      analysis: { ...analysis, tasks: updatedTasks }
    };
    onUpdateProject({
      ...project,
      versions: project.versions.map(v => v.versionId === currentVersion.versionId ? updatedVersion : v)
    });
  };

  const handleUpdateCapacity = (engineersCount: number, bufferPercent: number) => {
    const updatedForecast = {
      ...analysis.forecast,
      engineersCount,
      bufferPercent
    };
    const updatedVersion = {
      ...currentVersion,
      analysis: { ...analysis, forecast: updatedForecast }
    };
    onUpdateProject({
      ...project,
      versions: project.versions.map(v => v.versionId === currentVersion.versionId ? updatedVersion : v)
    });
  };

  const handleApproveBaseline = (baselineName: string, approver: string) => {
    const includedScopeItems = analysis.scope.items.filter(item => item.deliveryScope === 'Included');
    const newBaseline: ApprovedBaseline = {
      id: `base-${Date.now()}`,
      name: baselineName || `Baseline v${project.latestVersion}`,
      approvedBy: approver || 'Pragatheeswaran Kasinthan',
      approvedAt: new Date().toLocaleString(),
      includedScopeCount: includedScopeItems.length,
      status: 'active'
    };

    onUpdateProject({
      ...project,
      status: 'approved_baseline',
      activeBaseline: newBaseline,
      versions: project.versions.map(v => 
        v.versionId === currentVersion.versionId 
          ? { ...v, analysis: { ...v.analysis, baselineHistory: [newBaseline, ...(v.analysis.baselineHistory || [])] } } 
          : v
      )
    });
  };

  // Granular Navigation Categories
  const masterCategories = [
    {
      id: 'flowchart' as MasterCategory,
      title: 'Branching Access Map',
      icon: GitBranch,
      defaultSection: 'role_map' as AnalyzeSection
    },
    {
      id: 'rules' as MasterCategory,
      title: 'Specifications & Rules',
      icon: FileText,
      defaultSection: 'overview' as AnalyzeSection
    },
    {
      id: 'sandbox' as MasterCategory,
      title: 'Simulations & Gaps',
      icon: Play,
      defaultSection: 'ui_playground' as AnalyzeSection,
      badge: project.unresolvedCount
    },
    {
      id: 'delivery' as MasterCategory,
      title: 'Implementation & Effort',
      icon: BarChart3,
      defaultSection: 'tasks' as AnalyzeSection
    }
  ];

  const rulesSubTabs = [
    { id: 'overview' as AnalyzeSection, label: 'Purpose & Scope', icon: Compass },
    { id: 'roles' as AnalyzeSection, label: 'Roles & Permissions', icon: Users },
    { id: 'facts' as AnalyzeSection, label: 'Invariants & Rules', icon: Binary },
    { id: 'scope' as AnalyzeSection, label: 'Scope Boundaries', icon: Layers }
  ];

  const sandboxSubTabs = [
    { id: 'ui_playground' as AnalyzeSection, label: 'UI Role Sandbox', icon: Play },
    { id: 'questions' as AnalyzeSection, label: 'Clarifications', icon: HelpCircle, badge: project.unresolvedCount }
  ];

  const deliverySubTabs = [
    { id: 'tasks' as AnalyzeSection, label: 'Task Inventory', icon: CheckSquare },
    { id: 'forecast' as AnalyzeSection, label: 'PERT Delivery Model', icon: BarChart3 },
    { id: 'review' as AnalyzeSection, label: 'Baseline Sign-off', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto py-2 animate-in fade-in duration-150">
      
      {/* Perspective Modal */}
      <PerspectiveSelectorModal
        isOpen={isPerspectiveModalOpen}
        onClose={() => setIsPerspectiveModalOpen(false)}
        onSelectPerspective={handleSelectPerspective}
        currentPerspective={activePerspective === 'granular' ? 'frontend' : activePerspective}
        projectName={project.name}
      />

      {/* Project Context Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Project Identity & Document Metadata */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 border border-slate-700">
            {project.name.slice(0, 2).toUpperCase()}
          </div>
          
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-semibold text-[#0F172A] tracking-tight truncate max-w-lg" title={project.name}>
                {project.name}
              </h1>
              
              <span className="text-[11px] font-mono text-[#64748B] bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded font-medium">
                v{project.latestVersion}
              </span>

              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                project.status === 'approved_baseline'
                  ? 'bg-emerald-50 text-[#059669] border-emerald-200/80'
                  : 'bg-amber-50 text-[#D97706] border-amber-200/80'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  project.status === 'approved_baseline' ? 'bg-[#059669]' : 'bg-[#D97706]'
                }`} />
                <span>{project.status === 'approved_baseline' ? 'Baseline Approved' : 'Review Pending'}</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#64748B] flex-wrap font-sans">
              <span className="font-medium text-[#0F172A]">{project.domain}</span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1 truncate max-w-[280px]" title={currentVersion.fileName}>
                <FileText className="w-3.5 h-3.5 text-[#2558E8] shrink-0" />
                <span className="truncate">{currentVersion.fileName}</span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-[11px]">{currentVersion.pageCount || 1} pages</span>
            </div>
          </div>
        </div>

        {/* Right: Active Perspective Indicator & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Perspective:</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              {activePerspective === 'frontend' && <><Laptop className="w-3.5 h-3.5 text-slate-700" /> Frontend Lens</>}
              {activePerspective === 'backend' && <><Database className="w-3.5 h-3.5 text-slate-700" /> Backend Lens</>}
              {activePerspective === 'manager' && <><Briefcase className="w-3.5 h-3.5 text-slate-700" /> PO / Lead Lens</>}
              {activePerspective === 'granular' && <><Layers className="w-3.5 h-3.5 text-slate-700" /> Deep Dive Spec</>}
            </span>
          </div>

          <button
            onClick={() => setIsPerspectiveModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Switch engineering lens"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2558E8]" />
            <span>Switch</span>
          </button>

          <button
            onClick={onOpenReader}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Inspect source document in side-by-side reader"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>Document Reader</span>
          </button>
        </div>

      </div>

      {/* =========================================================================
          VIEW ROUTER: PERSPECTIVE VIEW OR GRANULAR SUB-VIEWS
         ========================================================================= */}
      <div className="pt-1">
        
        {/* PERSPECTIVE 1: Frontend View */}
        {activePerspective === 'frontend' && (
          <FrontendPerspectiveView
            project={project}
            analysis={analysis}
            onOpenSourcePage={onOpenSourcePage}
          />
        )}

        {/* PERSPECTIVE 2: Backend View */}
        {activePerspective === 'backend' && (
          <BackendPerspectiveView
            project={project}
            analysis={analysis}
            onOpenSourcePage={onOpenSourcePage}
          />
        )}

        {/* PERSPECTIVE 3: Product Owner / Manager View */}
        {activePerspective === 'manager' && (
          <ManagerPerspectiveView
            project={project}
            analysis={analysis}
            onOpenSourcePage={onOpenSourcePage}
          />
        )}

        {/* PERSPECTIVE 4: Granular Classical Deconstruction */}
        {activePerspective === 'granular' && (
          <div className="space-y-4">
            
            {/* Master Category Bar */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-1.5 overflow-x-auto">
              {masterCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (activeCategory === cat.id) return;
                      onSelectSection(cat.defaultSection);
                    }}
                    className={`flex-1 min-w-[140px] px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-[#0F172A] text-white shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span>{cat.title}</span>
                    {cat.badge !== undefined && cat.badge > 0 && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-semibold ${
                        isSelected ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cat.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sub-Tabs for Specifications */}
            {activeCategory === 'rules' && (
              <div className="flex items-center gap-1.5 text-xs bg-white rounded-lg border border-[#E2E8F0] p-1 px-1.5 overflow-x-auto shadow-2xs">
                {rulesSubTabs.map((sub) => {
                  const SubIcon = sub.icon;
                  const isSubActive = activeSection === sub.id;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => onSelectSection(sub.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        isSubActive
                          ? 'bg-[#2558E8] text-white shadow-xs'
                          : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/70'
                      }`}
                    >
                      <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Sub-Tabs for Sandbox */}
            {activeCategory === 'sandbox' && (
              <div className="flex items-center gap-1.5 text-xs bg-white rounded-lg border border-[#E2E8F0] p-1 px-1.5 overflow-x-auto shadow-2xs">
                {sandboxSubTabs.map((sub) => {
                  const SubIcon = sub.icon;
                  const isSubActive = activeSection === sub.id;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => onSelectSection(sub.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        isSubActive
                          ? 'bg-[#2558E8] text-white shadow-xs'
                          : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/70'
                      }`}
                    >
                      <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{sub.label}</span>
                      {sub.badge !== undefined && sub.badge > 0 && (
                        <span className={`text-[10px] font-mono px-1.5 rounded-full ${
                          isSubActive ? 'bg-white text-[#2558E8] font-bold' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Sub-Tabs for Delivery */}
            {activeCategory === 'delivery' && (
              <div className="flex items-center gap-1.5 text-xs bg-white rounded-lg border border-[#E2E8F0] p-1 px-1.5 overflow-x-auto shadow-2xs">
                {deliverySubTabs.map((sub) => {
                  const SubIcon = sub.icon;
                  const isSubActive = activeSection === sub.id;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => onSelectSection(sub.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        isSubActive
                          ? 'bg-[#2558E8] text-white shadow-xs'
                          : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/70'
                      }`}
                    >
                      <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Granular Section Content Display */}
            <div className="pt-1">
              {activeSection === 'overview' && (
                <PurposeOverviewSection
                  purpose={analysis.purpose}
                  documentName={currentVersion.fileName}
                  onUpdatePurpose={handleUpdatePurpose}
                  onOpenSourcePage={onOpenSourcePage}
                />
              )}

              {activeSection === 'roles' && (
                <RolesAccessSection
                  roles={analysis.roles}
                  onUpdateRoleState={handleUpdateRoleState}
                  onOpenSourcePage={onOpenSourcePage}
                />
              )}

              {activeSection === 'facts' && (
                <BehaviorsFactsSection
                  facts={analysis.facts}
                  onUpdateFactState={handleUpdateFactState}
                  onOpenSourcePage={onOpenSourcePage}
                />
              )}

              {activeSection === 'scope' && (
                <ScopeBoundariesSection
                  scope={analysis.scope}
                  onUpdateScopeItem={handleUpdateScopeItem}
                  onOpenSourcePage={onOpenSourcePage}
                />
              )}

              {activeSection === 'questions' && (
                <ClarificationQuestionsSection
                  questions={analysis.questions}
                  onAnswerQuestion={handleAnswerQuestion}
                  onUpdateQuestionState={handleUpdateQuestionState}
                />
              )}

              {activeSection === 'review' && (
                <HumanReviewSection
                  analysis={analysis}
                  activeBaseline={project.activeBaseline}
                  onApproveBaseline={handleApproveBaseline}
                />
              )}

              {activeSection === 'role_map' && (
                <BranchingRoleMapSection
                  roleMap={analysis.roleMap}
                  accessRoles={analysis.roles}
                  projectName={project.name}
                  onOpenSourcePage={onOpenSourcePage}
                />
              )}

              {activeSection === 'ui_playground' && (
                <UIPlaygroundSection
                  playgroundData={analysis.uiPlayground}
                />
              )}

              {activeSection === 'tasks' && (
                <TasksAcceptanceSection
                  tasks={analysis.tasks}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                />
              )}

              {activeSection === 'forecast' && (
                <EffortForecastSection
                  forecast={analysis.forecast}
                  onUpdateCapacity={handleUpdateCapacity}
                />
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
