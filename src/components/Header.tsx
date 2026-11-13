import React from 'react';
import { ScreenType, AnalyzeSection } from '../types/rulebook';
import { Printer, Check, FolderGit2, ArrowLeft, ExternalLink } from 'lucide-react';

interface Props {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  activeAnalyzeSection?: AnalyzeSection;
  projectName?: string;
  hasApprovedBaseline?: boolean;
  onPrint: () => void;
}

export const Header: React.FC<Props> = ({ 
  currentScreen, 
  onSelectScreen, 
  activeAnalyzeSection = 'overview',
  projectName,
  hasApprovedBaseline = false,
  onPrint
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-14">
        
        {/* Left: Brand & Hierarchy Context */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          <button 
            onClick={() => onSelectScreen('projects')} 
            className="flex items-center gap-2.5 text-left cursor-pointer group focus-visible:outline-none"
            title="Projects overview"
          >
            <div className="w-7 h-7 rounded-md bg-[#0F172A] flex items-center justify-center text-white font-medium text-xs tracking-wide shadow-xs group-hover:bg-[#1E293B] transition-colors">
              R
            </div>
            <span className="text-sm font-semibold text-[#0F172A] tracking-tight group-hover:text-[#2558E8] transition-colors">
              Rulebook
            </span>
          </button>

          <span className="text-slate-300 select-none text-xs">/</span>

          {currentScreen === 'projects' ? (
            <span className="text-xs font-medium text-[#64748B]">
              Projects
            </span>
          ) : currentScreen === 'landing' ? (
            <div className="flex items-center gap-2 min-w-0 text-xs">
              <button
                onClick={() => onSelectScreen('projects')}
                className="text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                Projects
              </button>
              <span className="text-slate-300">/</span>
              <span className="font-medium text-[#0F172A] truncate">
                Architecture & Methodology
              </span>
            </div>
          ) : currentScreen === 'upload' ? (
            <div className="flex items-center gap-2 min-w-0 text-xs">
              <button
                onClick={() => onSelectScreen('projects')}
                className="text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                {projectName || 'Project'}
              </button>
              <span className="text-slate-300">/</span>
              <span className="font-medium text-[#0F172A]">
                Document Intake
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0 text-xs">
              <button
                onClick={() => onSelectScreen('projects')}
                className="text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer truncate max-w-[140px] sm:max-w-xs"
              >
                {projectName || 'Project'}
              </button>
              <span className="text-slate-300">/</span>
              <span className="font-medium text-[#0F172A] capitalize">
                {activeAnalyzeSection ? activeAnalyzeSection.replace('_', ' ') : 'Analysis'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Actions & State */}
        <div className="flex items-center gap-3 shrink-0">
          
          {hasApprovedBaseline && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-[#059669] bg-emerald-50 border border-emerald-200">
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Baseline Locked</span>
            </span>
          )}

          {currentScreen !== 'projects' && (
            <button
              onClick={() => onSelectScreen('projects')}
              className="text-xs font-medium text-[#64748B] hover:text-[#0F172A] px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            >
              All Projects
            </button>
          )}

          <button
            onClick={() => onSelectScreen('landing')}
            className="text-xs font-medium text-[#2558E8] hover:text-[#1D47C5] px-2.5 py-1.5 rounded-md hover:bg-blue-50/50 transition-colors cursor-pointer hidden md:inline-flex items-center gap-1"
          >
            <span>Overview & Methodology</span>
            <ExternalLink className="w-3 h-3 text-[#2558E8]" />
          </button>

          {currentScreen === 'analyze' && (
            <button
              onClick={onPrint}
              className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="Print / Export Specification"
              aria-label="Print or export specification"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}

          <div className="h-4 w-px bg-[#E2E8F0] hidden sm:block" />

          {/* Workspace label */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-medium text-slate-700">
              E
            </div>
            <span className="text-xs font-medium text-slate-700 hidden sm:inline">Enterprise</span>
          </div>

        </div>

      </div>
    </header>
  );
};
