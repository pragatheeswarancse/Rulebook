import React, { useState, useEffect } from 'react';
import { ScreenType, AnalyzeSection, RulebookProject, DocumentVersion, PerspectiveType } from './types/rulebook';
import { INITIAL_RULEBOOK_PROJECTS } from './data/rulebookProjectsData';
import { Header } from './components/Header';
import { ProjectListView } from './components/ProjectListView';
import { DocUploadView } from './components/DocUploadView';
import { AnalyzeView } from './components/AnalyzeView';
import { LandingPageView } from './components/LandingPageView';

const STORAGE_KEY = 'rulebook_user_projects_v2';

export default function App() {
  // Load only user-created/uploaded projects from browser storage (Client Database)
  const [projects, setProjects] = useState<RulebookProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved projects from database:', e);
    }
    // Per user directive: "Delete all demo / pre project now only show user uploaded/ created project"
    // Starts with empty workspace by default.
    return [];
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0].id;
        }
      }
    } catch (e) {
      // ignore
    }
    return '';
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('projects');
  const [activeAnalyzeSection, setActiveAnalyzeSection] = useState<AnalyzeSection>('role_map');

  // Sync projects with browser database (localStorage)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (err) {
      console.error('Failed to sync projects to localStorage database:', err);
    }
  }, [projects]);

  const currentProject: RulebookProject | undefined = 
    (projects && projects.length > 0)
      ? (projects.find(p => p.id === currentProjectId) || projects[0])
      : undefined;

  // Actions - Project Card is the primary entry point
  const handleSelectProject = (projectId: string, initialSection: AnalyzeSection = 'role_map') => {
    setCurrentProjectId(projectId);
    setCurrentScreen('analyze');
    setActiveAnalyzeSection(initialSection);
  };

  const handleOpenUpload = (projectId?: string) => {
    if (projectId) {
      setCurrentProjectId(projectId);
      setCurrentScreen('upload');
    } else {
      // Create new blank project container for uploaded document
      const newProject: RulebookProject = {
        id: `proj-${Date.now()}`,
        name: 'New Specification Analysis',
        objective: 'Uploaded requirements specification analysis.',
        domain: 'Enterprise Architecture',
        latestVersion: 'v1.0',
        status: 'draft',
        unresolvedCount: 0,
        createdAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        updatedAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        currentVersionId: '',
        versions: [],
        selectedPerspective: 'frontend'
      };
      setProjects(prev => [newProject, ...prev]);
      setCurrentProjectId(newProject.id);
      setCurrentScreen('upload');
    }
  };

  const handleCreateProject = (name: string, objective: string, domain: string) => {
    const newProject: RulebookProject = {
      id: `proj-${Date.now()}`,
      name,
      objective: objective || 'System design and requirements specification.',
      domain: domain || 'Enterprise System',
      latestVersion: 'v1.0',
      status: 'draft',
      unresolvedCount: 0,
      createdAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      updatedAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      currentVersionId: '',
      versions: [],
      selectedPerspective: 'frontend'
    };

    setProjects(prev => [newProject, ...prev]);
    setCurrentProjectId(newProject.id);
    setCurrentScreen('upload');
  };

  // Permanently delete single project from state & database
  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => {
      const remaining = prev.filter(p => p.id !== projectId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
      } catch (e) {
        console.error(e);
      }
      return remaining;
    });

    if (currentProjectId === projectId) {
      const remaining = projects.filter(p => p.id !== projectId);
      setCurrentProjectId(remaining[0]?.id || '');
    }
  };

  // Permanently delete all projects from database
  const handleDeleteAllProjects = () => {
    setProjects([]);
    setCurrentProjectId('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Optional on-demand loader for testing Cycle Count FSD
  const handleLoadDemoCycleCount = () => {
    const cycleCountDemo = INITIAL_RULEBOOK_PROJECTS.find(p => p.id === 'proj-cycle-count') || INITIAL_RULEBOOK_PROJECTS[0];
    if (cycleCountDemo) {
      setProjects(prev => [cycleCountDemo, ...prev.filter(p => p.id !== cycleCountDemo.id)]);
      setCurrentProjectId(cycleCountDemo.id);
      setCurrentScreen('analyze');
      setActiveAnalyzeSection('role_map');
    }
  };

  const handleRenameProject = (projectId: string, newName: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, name: newName } : p));
  };

  const handleDocumentReplaced = (newVersion: DocumentVersion, perspective: PerspectiveType = 'frontend') => {
    if (!currentProject) return;

    // Use parsed document title if project is currently generic
    const isGenericName = currentProject.name.startsWith('New Specification') || currentProject.name.startsWith('Rulebook');
    const detectedName = isGenericName && newVersion.analysis?.purpose?.module 
      ? newVersion.analysis.purpose.module 
      : currentProject.name;

    const updatedProject: RulebookProject = {
      ...currentProject,
      name: detectedName,
      domain: newVersion.analysis?.purpose?.primaryPurpose === 'BRD' 
        ? 'Business Requirements' 
        : currentProject.domain || 'Enterprise Architecture',
      latestVersion: `v${((currentProject.versions?.length || 1) + 1).toFixed(1)}`,
      status: 'needs_review',
      currentVersionId: newVersion.versionId,
      versions: [newVersion, ...(currentProject.versions || [])],
      selectedPerspective: perspective,
      activeBaseline: undefined
    };

    handleUpdateProject(updatedProject);
    setCurrentScreen('analyze');
    setActiveAnalyzeSection('role_map');
  };

  const handleUpdateProject = (updated: RulebookProject) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleOpenSourcePage = (pageNumber: number) => {
    setCurrentScreen('upload');
  };

  const handleLoadPreloadedProject = (projectId: string) => {
    const existing = projects.find(p => p.id === projectId);
    if (!existing) {
      const preloaded = INITIAL_RULEBOOK_PROJECTS.find(p => p.id === projectId);
      if (preloaded) {
        setProjects(prev => [preloaded, ...prev]);
      }
    }
    setCurrentProjectId(projectId);
  };

  // Standalone Marketing & Portfolio Showcase for Clients and Google Website
  if (currentScreen === 'landing') {
    return (
      <LandingPageView
        onEnterApp={() => setCurrentScreen('projects')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#2558E8] selection:text-white">
      
      {/* Enterprise Header */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        activeAnalyzeSection={activeAnalyzeSection}
        projectName={currentProject?.name || 'Rulebook'}
        hasApprovedBaseline={currentProject?.status === 'approved_baseline'}
        onPrint={() => window.print()}
      />

      {/* Main Screen Router with generous enterprise 1440px grid container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* SCREEN 1: Project List */}
        {currentScreen === 'projects' && (
          <ProjectListView
            projects={projects}
            onSelectProject={handleSelectProject}
            onOpenUpload={handleOpenUpload}
            onDeleteProject={handleDeleteProject}
            onDeleteAllProjects={handleDeleteAllProjects}
            onRestoreDemoProjects={handleLoadDemoCycleCount}
            onRenameProject={handleRenameProject}
            onCreateProject={handleCreateProject}
          />
        )}

        {/* SCREEN 2: Doc Upload & Side-by-Side Reader */}
        {currentScreen === 'upload' && currentProject && (
          <DocUploadView
            project={currentProject}
            onProceedToAnalyze={() => {
              setCurrentScreen('analyze');
              setActiveAnalyzeSection('overview');
            }}
            onDocumentReplaced={handleDocumentReplaced}
            onClearDocument={() => {}}
            onLoadPreloadedProject={handleLoadPreloadedProject}
          />
        )}

        {/* SCREEN 3: Analyze & Breakdown Engine */}
        {currentScreen === 'analyze' && currentProject && (
          <AnalyzeView
            project={currentProject}
            activeSection={activeAnalyzeSection}
            onSelectSection={setActiveAnalyzeSection}
            onOpenSourcePage={handleOpenSourcePage}
            onUpdateProject={handleUpdateProject}
            onOpenReader={() => setCurrentScreen('upload')}
          />
        )}

        {/* Fallback when all projects deleted and on upload/analyze */}
        {((currentScreen === 'upload' || currentScreen === 'analyze') && !currentProject) && (
          <div className="p-12 text-center bg-white rounded-xl border border-[#E2E8F0] space-y-4 max-w-md mx-auto my-12 shadow-xs">
            <h3 className="text-base font-semibold text-[#0F172A]">No Active Architecture Project</h3>
            <p className="text-xs text-[#64748B]">All projects were removed from the workspace database. Return to the registry to create or upload one.</p>
            <div className="flex items-center justify-center pt-2">
              <button
                onClick={() => setCurrentScreen('projects')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2558E8] hover:bg-[#1D47C5] rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Enterprise Footer with developer credit */}
      <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-4 text-xs text-[#64748B]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0F172A]">Rulebook</span>
            <span>·</span>
            <span>Enterprise Specification OS</span>
            <span>·</span>
            <button
              onClick={() => setCurrentScreen('landing')}
              className="text-[#2558E8] hover:text-[#1D47C5] transition-colors cursor-pointer"
            >
              Methodology Showcase
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[#64748B]">
            <span>Developed and designed by</span>
            <span className="font-semibold text-[#0F172A]">
              Pragatheeswaran Kasinthan
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
