import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Trash2, 
  Plus, 
  Eye, 
  LayoutGrid, 
  List, 
  RotateCcw,
  Clock,
  Layers,
  MoreVertical,
  X,
  Edit2,
  FolderOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  HelpCircle
} from 'lucide-react';
import { RulebookProject, AnalyzeSection } from '../types/rulebook';

interface Props {
  projects: RulebookProject[];
  onSelectProject: (projectId: string, initialSection?: AnalyzeSection) => void;
  onOpenUpload: (projectId?: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDeleteAllProjects?: () => void;
  onRestoreDemoProjects?: () => void;
  onRenameProject: (projectId: string, newName: string) => void;
  onCreateProject: (name: string, objective: string, domain: string) => void;
}

export const ProjectListView: React.FC<Props> = ({
  projects,
  onSelectProject,
  onOpenUpload,
  onDeleteProject,
  onDeleteAllProjects,
  onRestoreDemoProjects,
  onRenameProject,
  onCreateProject
}) => {
  // Search, Filter & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'review'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectObjective, setNewProjectObjective] = useState('');
  const [newProjectDomain, setNewProjectDomain] = useState('Enterprise Architecture');

  // Rename modal state
  const [projectToRename, setProjectToRename] = useState<RulebookProject | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<RulebookProject | null>(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Active Context Menu Dropdown
  const [openMenuProjectId, setOpenMenuProjectId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuProjectId(null);
      }
    };
    if (openMenuProjectId) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [openMenuProjectId]);

  // Dynamic filter counts
  const baselineCount = useMemo(() => 
    projects.filter(p => p.status === 'approved_baseline').length, 
    [projects]
  );
  
  const pendingCount = useMemo(() => 
    projects.filter(p => p.status !== 'approved_baseline').length, 
    [projects]
  );

  // Filtered and searched projects
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.filter((p) => {
      const currentVer = p.versions?.find(v => v.versionId === p.currentVersionId) || p.versions?.[0];
      const docName = currentVer?.fileName?.toLowerCase() || '';
      
      const matchesSearch = !q || (
        p.name.toLowerCase().includes(q) ||
        (p.objective && p.objective.toLowerCase().includes(q)) ||
        p.domain.toLowerCase().includes(q) ||
        docName.includes(q)
      );

      if (!matchesSearch) return false;

      if (statusFilter === 'approved') return p.status === 'approved_baseline';
      if (statusFilter === 'review') return p.status !== 'approved_baseline';
      return true;
    });
  }, [projects, searchQuery, statusFilter]);

  // Form submit handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setIsSubmittingCreate(true);
    setTimeout(() => {
      onCreateProject(newProjectName.trim(), newProjectObjective.trim(), newProjectDomain);
      setNewProjectName('');
      setNewProjectObjective('');
      setIsSubmittingCreate(false);
      setIsCreateModalOpen(false);
    }, 200);
  };

  const handleStartRename = (project: RulebookProject) => {
    setProjectToRename(project);
    setRenameValue(project.name);
    setOpenMenuProjectId(null);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectToRename && renameValue.trim()) {
      onRenameProject(projectToRename.id, renameValue.trim());
      setProjectToRename(null);
    }
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setIsDeleting(true);
      setTimeout(() => {
        onDeleteProject(projectToDelete.id);
        setProjectToDelete(null);
        setIsDeleting(false);
        setOpenMenuProjectId(null);
      }, 150);
    }
  };

  const confirmDeleteAll = () => {
    if (onDeleteAllProjects) {
      setIsDeleting(true);
      setTimeout(() => {
        onDeleteAllProjects();
        setIsDeleteAllModalOpen(false);
        setIsDeleting(false);
      }, 150);
    }
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto py-2 sm:py-4 animate-in fade-in duration-200">
      
      {/* =========================================================================
          1. COHESIVE WORKSPACE HEADER
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
        
        {/* Left Section: Title, Dynamic Project Count & Description */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-[28px] font-semibold text-[#0F172A] tracking-tight">
              Projects
            </h1>
            <span className="font-mono text-xs font-medium text-[#64748B] bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Manage your specifications, architectures, and implementation workflows.
          </p>
        </div>

        {/* Right Section: Prominent Primary Action & Safe Destructive Option */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Delete All (Subtle, Non-competing Secondary Destructive Action) */}
          {projects.length > 0 && onDeleteAllProjects && (
            <button
              onClick={() => setIsDeleteAllModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
              title="Delete all projects"
              aria-label="Delete all projects"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete All</span>
            </button>
          )}

          {/* New Project — Primary Prominent Action */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2558E8] hover:bg-[#1D47C5] active:bg-[#1638A0] text-white font-medium text-xs sm:text-sm rounded-lg shadow-xs hover:shadow transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2558E8]"
          >
            <Plus className="w-4 h-4 stroke-[2.25]" />
            <span>New Project</span>
          </button>

        </div>
      </div>

      {/* =========================================================================
          2. UNIFIED SEARCH & FILTER CONTROL SURFACE
         ========================================================================= */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-2 sm:p-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        
        {/* Prominent Search Input with Clear Button */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project, domain, or document..."
            className="w-full text-xs sm:text-sm bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg pl-9.5 pr-8 py-2 text-[#0F172A] placeholder-slate-400 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F172A] p-0.5 rounded cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters & Grid/List Switcher as One Unified Surface */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 text-xs">
          
          {/* Segmented Status Filters */}
          <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-lg border border-[#E2E8F0]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All Projects <span className="ml-1 font-mono text-[11px] text-slate-500">({projects.length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'approved'
                  ? 'bg-white text-[#059669] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#059669]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              <span>Baseline</span>
              <span className="ml-0.5 font-mono text-[11px] text-slate-500">({baselineCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('review')}
              className={`px-3 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'review'
                  ? 'bg-white text-[#D97706] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#D97706]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              <span>Pending</span>
              <span className="ml-0.5 font-mono text-[11px] text-slate-500">({pendingCount})</span>
            </button>
          </div>

          {/* Grid / List Mode Switcher */}
          <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-lg border border-[#E2E8F0]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0F172A] shadow-xs font-medium'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs font-medium">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white text-[#0F172A] shadow-xs font-medium'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
              title="List view"
              aria-label="List view"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs font-medium">List</span>
            </button>
          </div>

        </div>

      </div>

      {/* =========================================================================
          3. MAIN CONTENT: GRID OR LIST PRESENTATION
         ========================================================================= */}
      {filteredProjects.length > 0 ? (
        viewMode === 'grid' ? (
          
          /* -----------------------------------------------------------------------
             GRID VIEW: High information density, consistent cards
             ----------------------------------------------------------------------- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => {
              const currentVer = project.versions?.find(v => v.versionId === project.currentVersionId) || project.versions?.[0];
              const hasDoc = Boolean(currentVer && currentVer.fileName);
              const isBaseline = project.status === 'approved_baseline';

              return (
                <div 
                  key={project.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-slate-300 hover:shadow-xs transition-all duration-180 flex flex-col justify-between group space-y-4 relative"
                >
                  <div className="space-y-3.5">
                    
                    {/* Card Header: Domain, Status & Contextual Menu */}
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 gap-2">
                      
                      {/* Domain / Category */}
                      <span className="font-medium text-[#64748B] tracking-wide truncate max-w-[240px] shrink" title={project.domain}>
                        {project.domain}
                      </span>

                      {/* Status indicator & Context Menu */}
                      <div className="flex items-center gap-2 shrink-0">
                        
                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          isBaseline 
                            ? 'bg-emerald-50 text-[#059669] border-emerald-200/80' 
                            : 'bg-amber-50 text-[#D97706] border-amber-200/80'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isBaseline ? 'bg-[#059669]' : 'bg-[#D97706]'
                          }`} />
                          <span>{isBaseline ? 'Baseline' : 'Pending'}</span>
                        </span>

                        {/* Three-dot Contextual Actions Button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuProjectId(openMenuProjectId === project.id ? null : project.id);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Project options"
                            aria-label={`Options for ${project.name}`}
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {/* Contextual Dropdown Menu */}
                          {openMenuProjectId === project.id && (
                            <div 
                              ref={menuRef}
                              className="absolute right-0 top-6 z-30 w-44 bg-white rounded-lg border border-[#E2E8F0] shadow-md py-1 text-xs text-[#0F172A] animate-in fade-in duration-100"
                            >
                              <button
                                onClick={() => {
                                  setOpenMenuProjectId(null);
                                  onOpenUpload(project.id);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                                <span>Open Reader</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  setOpenMenuProjectId(null);
                                  onSelectProject(project.id, 'role_map');
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                              >
                                <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                                <span>Analysis & Flow</span>
                              </button>

                              <button
                                onClick={() => handleStartRename(project)}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                                <span>Rename Project</span>
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => {
                                  setOpenMenuProjectId(null);
                                  setProjectToDelete(project);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-[#DC2626] flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Project</span>
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Project Identity: Scannable Title & Clean One-Line Description */}
                    <div className="space-y-1.5">
                      <h2 
                        onClick={() => onSelectProject(project.id, 'role_map')}
                        className="text-base font-semibold text-[#0F172A] group-hover:text-[#2558E8] transition-colors cursor-pointer tracking-tight line-clamp-1 pb-0.5 break-normal"
                        title={project.name}
                      >
                        {project.name}
                      </h2>
                      <p 
                        className="text-xs text-[#64748B] line-clamp-2 leading-relaxed min-h-[2.5rem] break-normal" 
                        title={project.objective || 'Deterministic functional specifications and role-based architecture.'}
                      >
                        {project.objective || 'Deterministic functional specifications and role-based architecture.'}
                      </p>
                    </div>

                    {/* Document Information Surface (Compact, Aligned) */}
                    <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1.5">
                      {hasDoc ? (
                        <>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 text-[#0F172A] font-medium truncate" title={currentVer.fileName}>
                              <FileText className="w-3.5 h-3.5 text-[#2558E8] shrink-0" />
                              <span className="truncate">{currentVer.fileName}</span>
                            </span>
                            <span className="text-[11px] font-mono text-[#64748B] shrink-0">
                              {currentVer.pageCount || 1} {currentVer.pageCount === 1 ? 'page' : 'pages'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 border-t border-slate-200/60 font-mono">
                            <span>Ver {project.latestVersion}</span>
                            <span>Updated {project.updatedAt}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-[#64748B] py-0.5">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>No document attached</span>
                          </span>
                          <button
                            onClick={() => onOpenUpload(project.id)}
                            className="text-[#2558E8] hover:underline font-medium text-[11px]"
                          >
                            Upload →
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Pending Clarifications Badge if any */}
                    {project.unresolvedCount > 0 && (
                      <div className="text-[11px] text-[#D97706] flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        <span>{project.unresolvedCount} clarification {project.unresolvedCount === 1 ? 'question' : 'questions'} open</span>
                      </div>
                    )}

                  </div>

                  {/* Card Footer: Clear distinction between Secondary and Primary Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    
                    {/* Secondary Action: Reader */}
                    <button
                      onClick={() => onOpenUpload(project.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Inspect original document in reader"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reader</span>
                    </button>

                    {/* Primary Action: Analysis & Flow */}
                    <button
                      onClick={() => onSelectProject(project.id, 'role_map')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#2558E8] hover:bg-[#1D47C5] active:bg-[#1638A0] rounded-lg transition-colors cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2558E8]"
                    >
                      <span>Analysis & Flow</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (

          /* -----------------------------------------------------------------------
             LIST VIEW: Professional enterprise data-table format
             ----------------------------------------------------------------------- */
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-4 sm:px-6">Project</th>
                    <th scope="col" className="py-3.5 px-4">Domain</th>
                    <th scope="col" className="py-3.5 px-4">Document</th>
                    <th scope="col" className="py-3.5 px-4">Status</th>
                    <th scope="col" className="py-3.5 px-4">Updated</th>
                    <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredProjects.map((project) => {
                    const currentVer = project.versions?.find(v => v.versionId === project.currentVersionId) || project.versions?.[0];
                    const isBaseline = project.status === 'approved_baseline';

                    return (
                      <tr 
                        key={project.id}
                        className="hover:bg-[#F8FAFC]/80 transition-colors group"
                      >
                        {/* Column 1: Project Identity */}
                        <td className="py-3.5 px-4 sm:px-6 max-w-xs">
                          <div className="space-y-0.5">
                            <span 
                              onClick={() => onSelectProject(project.id, 'role_map')}
                              className="font-semibold text-sm text-[#0F172A] group-hover:text-[#2558E8] transition-colors cursor-pointer truncate block"
                              title={project.name}
                            >
                              {project.name}
                            </span>
                            {project.objective && (
                              <p className="text-[#64748B] truncate text-[11px] max-w-sm" title={project.objective}>
                                {project.objective}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Column 2: Domain */}
                        <td className="py-3.5 px-4 text-[#64748B] font-medium whitespace-nowrap">
                          {project.domain}
                        </td>

                        {/* Column 3: Document */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {currentVer?.fileName ? (
                            <span className="flex items-center gap-1.5 text-[#0F172A] font-medium" title={currentVer.fileName}>
                              <FileText className="w-3.5 h-3.5 text-[#2558E8] shrink-0" />
                              <span className="truncate max-w-[160px]">{currentVer.fileName}</span>
                              <span className="text-slate-400 font-mono text-[11px]">({currentVer.pageCount}p)</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">No document</span>
                          )}
                        </td>

                        {/* Column 4: Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                            isBaseline 
                              ? 'bg-emerald-50 text-[#059669] border-emerald-200/80' 
                              : 'bg-amber-50 text-[#D97706] border-amber-200/80'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isBaseline ? 'bg-[#059669]' : 'bg-[#D97706]'
                            }`} />
                            <span>{isBaseline ? 'Baseline' : 'Pending'}</span>
                          </span>
                        </td>

                        {/* Column 5: Last Updated */}
                        <td className="py-3.5 px-4 text-[#64748B] font-mono text-[11px] whitespace-nowrap">
                          {project.updatedAt}
                        </td>

                        {/* Column 6: Actions */}
                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Secondary: Reader */}
                            <button
                              onClick={() => onOpenUpload(project.id)}
                              className="px-2.5 py-1 text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Inspect original document"
                            >
                              Reader
                            </button>

                            {/* Primary: Analysis & Flow */}
                            <button
                              onClick={() => onSelectProject(project.id, 'role_map')}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-[#2558E8] hover:bg-[#1D47C5] rounded-md transition-colors cursor-pointer shadow-xs"
                            >
                              <span>Analysis & Flow</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete single */}
                            <button
                              onClick={() => setProjectToDelete(project)}
                              className="p-1 text-slate-400 hover:text-[#DC2626] hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              title="Delete project"
                              aria-label={`Delete project ${project.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </div>

        )
      ) : (

        /* =========================================================================
            4. PURPOSE-DESIGNED EMPTY & NO-MATCH STATES
           ========================================================================= */
        <div className="p-10 sm:p-14 text-center bg-white rounded-xl border border-[#E2E8F0] space-y-4 max-w-lg mx-auto my-8">
          
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 border border-slate-200/80 flex items-center justify-center mx-auto">
            {projects.length === 0 ? (
              <FolderOpen className="w-6 h-6 stroke-[1.75]" />
            ) : (
              <Search className="w-6 h-6 stroke-[1.75]" />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-[#0F172A]">
              {projects.length === 0 
                ? 'No projects in workspace' 
                : searchQuery
                ? `No projects matching "${searchQuery}"`
                : statusFilter === 'approved'
                ? 'No baseline projects yet'
                : 'No pending projects'}
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-md mx-auto">
              {projects.length === 0
                ? 'Upload an enterprise specification document (FSD, PRD, or Architectural Spec) to extract Frontend, Backend, and Manager perspectives, or create a project workspace.'
                : searchQuery
                ? 'Check your search query spelling or try searching across project domains and document names.'
                : 'Try adjusting your status filter to see all active projects in the workspace.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {projects.length === 0 ? (
              <>
                <button
                  onClick={() => onOpenUpload()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#2558E8] hover:bg-[#1D47C5] active:bg-[#1638A0] rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 stroke-[2.25]" />
                  <span>New Project</span>
                </button>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-[#0F172A] bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Create Blank Workspace</span>
                </button>
              </>
            ) : (
              <>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3.5 py-2 text-xs font-medium text-[#0F172A] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
                {statusFilter !== 'all' && (
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="px-3.5 py-2 text-xs font-medium text-[#2558E8] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Show All Projects
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      )}

      {/* =========================================================================
          5. MODAL: CREATE NEW PROJECT
         ========================================================================= */}
      {isCreateModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-project-title"
          className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-xl border border-[#E2E8F0] max-w-md w-full p-6 shadow-xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="space-y-0.5">
                <h3 id="create-project-title" className="text-base font-semibold text-[#0F172A]">
                  Create New Project
                </h3>
                <p className="text-xs text-[#64748B]">
                  Define project identity and architectural scope.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-[#0F172A] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              {/* Project Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#0F172A]">Project Name *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Distributed Settlement Engine"
                  className="w-full text-xs sm:text-sm bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg px-3 py-2 text-[#0F172A] placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Domain / Category */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#0F172A]">Domain / Industry</label>
                <select
                  value={newProjectDomain}
                  onChange={(e) => setNewProjectDomain(e.target.value)}
                  className="w-full text-xs bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg px-3 py-2 text-[#0F172A] focus:outline-none cursor-pointer"
                >
                  <option value="Enterprise Architecture">Enterprise Architecture</option>
                  <option value="FinTech & Settlement">FinTech & Settlement</option>
                  <option value="Aviation & Training">Aviation & Training</option>
                  <option value="Education & ERP">Education & ERP</option>
                  <option value="Governance & Compliance">Governance & Compliance</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                  <option value="Custom Enterprise System">Custom Enterprise System</option>
                </select>
              </div>

              {/* Business Objective */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#0F172A]">Business Objective / Specification Scope</label>
                <textarea
                  rows={3}
                  value={newProjectObjective}
                  onChange={(e) => setNewProjectObjective(e.target.value)}
                  placeholder="Briefly state system requirements, performance thresholds, or access boundaries..."
                  className="w-full text-xs bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg px-3 py-2 text-[#0F172A] placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim() || isSubmittingCreate}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#2558E8] hover:bg-[#1D47C5] rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-xs flex items-center gap-1.5"
                >
                  {isSubmittingCreate ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create & Open</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          6. MODAL: RENAME PROJECT
         ========================================================================= */}
      {projectToRename && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="rename-project-title"
          className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-xl border border-[#E2E8F0] max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="space-y-1">
              <h3 id="rename-project-title" className="text-base font-semibold text-[#0F172A]">Rename Project</h3>
              <p className="text-xs text-[#64748B]">Update the display title of this project.</p>
            </div>

            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <input
                type="text"
                autoFocus
                required
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full text-xs sm:text-sm bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-[#2558E8] rounded-lg px-3 py-2 text-[#0F172A] focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setProjectToRename(null)}
                  className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!renameValue.trim()}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#2558E8] hover:bg-[#1D47C5] rounded-lg cursor-pointer disabled:opacity-50"
                >
                  Save Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. MODAL: DELETE SINGLE PROJECT (SAFE CONFIRMATION)
         ========================================================================= */}
      {projectToDelete && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-project-title"
          className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-xl border border-[#E2E8F0] max-w-md w-full p-6 shadow-xl space-y-4">
            
            <div className="space-y-1">
              <h3 id="delete-project-title" className="text-base font-semibold text-[#0F172A]">
                Delete Project
              </h3>
              <p className="text-xs text-[#64748B]">
                Are you sure you want to delete <strong className="text-[#0F172A] font-semibold">{projectToDelete.name}</strong>?
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                This operation will remove this project along with all associated specification documents ({projectToDelete.versions?.length || 0} version{(projectToDelete.versions?.length || 0) === 1 ? '' : 's'}), branching role maps, and baseline records.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-3.5 py-2 text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium text-white bg-[#DC2626] hover:bg-red-700 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Project</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          8. MODAL: DELETE ALL PROJECTS (PROMINENT PROTECTION)
         ========================================================================= */}
      {isDeleteAllModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-all-title"
          className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-xl border border-[#E2E8F0] max-w-md w-full p-6 shadow-xl space-y-4">
            
            <div className="space-y-1">
              <h3 id="delete-all-title" className="text-base font-semibold text-[#0F172A]">
                Delete All Projects
              </h3>
              <p className="text-xs text-[#64748B]">
                This action will delete all <strong className="text-[#0F172A] font-semibold">{projects.length} projects</strong> currently registered in this workspace.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs space-y-1">
              <p className="text-[11px] text-red-800 leading-relaxed">
                All specifications, diagrams, and task breakdowns will be permanently deleted from the workspace.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAll}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium text-white bg-[#DC2626] hover:bg-red-700 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <span>Delete All Projects</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
