import React, { useState } from 'react';
import { FLOW_NODES } from '../data/flowmapData';
import { FlowNode } from '../types';
import { NodeInspectorModal } from './NodeInspectorModal';
import { 
  Users, 
  Settings, 
  FileCheck, 
  FileText, 
  LogIn, 
  LayoutDashboard, 
  Clock, 
  UserCheck, 
  Edit3, 
  Lock, 
  Gauge, 
  ArrowRight, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  GitBranch, 
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

import { AnalyzedEngineeringDocument } from '../types/documentAnalysis';

interface Props {
  document?: AnalyzedEngineeringDocument;
  onOpenSourceModal: () => void;
  onNavigateToTab: (tab: 'fsd' | 'journey') => void;
}

type PathFilter = 'all' | 'normal-rollcall' | 'escalation-loop' | 'admin-governance' | 'sf-pipeline' | 'sf-export';

export const FlowmapView: React.FC<Props> = ({ document, onOpenSourceModal, onNavigateToTab }) => {
  const isDocPdf = document?.id === 'doc-sales-forecast-pdf' || (document && document.flowNodes?.length > 0 && document.id !== 'doc-edupulse-attendance');
  const [activeModel, setActiveModel] = useState<'attendance' | 'document'>(isDocPdf ? 'document' : 'attendance');
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [pathFilter, setPathFilter] = useState<PathFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  const activeNodes = activeModel === 'document' && document?.flowNodes?.length 
    ? document.flowNodes 
    : FLOW_NODES;

  // Map icon strings to Lucide components
  const getIcon = (name: string, className: string = 'w-5 h-5') => {
    switch (name) {
      case 'UserCheck': return <UserCheck className={className} />;
      case 'Gauge': return <Gauge className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Settings': return <Settings className={className} />;
      case 'FileCheck': return <FileCheck className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'LogIn': return <LogIn className={className} />;
      case 'LayoutDashboard': return <LayoutDashboard className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'Edit3': return <Edit3 className={className} />;
      case 'Lock': return <Lock className={className} />;
      default: return <ShieldCheck className={className} />;
    }
  };

  const isNodeHighlighted = (nodeId: string): boolean => {
    if (searchQuery.trim() !== '') {
      const node = FLOW_NODES.find(n => n.id === nodeId);
      if (!node) return false;
      const q = searchQuery.toLowerCase();
      return (
        node.title.toLowerCase().includes(q) ||
        node.subtitle.toLowerCase().includes(q) ||
        node.description.toLowerCase().includes(q)
      );
    }

    if (pathFilter === 'all') return true;

    if (pathFilter === 'normal-rollcall') {
      return ['teacher-login', 'teacher-dashboard', 'teacher-checkin', 'teacher-roster', 'teacher-bulk-attendance'].includes(nodeId);
    }

    if (pathFilter === 'escalation-loop') {
      return ['teacher-bulk-attendance', 'teacher-checkin', 'teacher-override-request', 'admin-records', 'admin-reports'].includes(nodeId);
    }

    if (pathFilter === 'admin-governance') {
      return ['admin-login', 'admin-dashboard', 'admin-users', 'admin-master', 'admin-records', 'admin-reports'].includes(nodeId);
    }

    return true;
  };

  const docLeftNodes = activeNodes.filter(n => n.role === 'admin' || n.category === 'auth' || n.category === 'config');
  const docRightNodes = activeNodes.filter(n => n.role === 'teacher' || n.category === 'attendance' || n.category === 'dashboard' || n.category === 'reports' || n.category === 'escalation');

  return (
    <div className="space-y-6">
      {/* Top Architecture Mode Switcher & Filter Bar */}
      <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        
        {/* Model Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Active Architecture:</span>
            <div className="flex items-center p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => {
                  setActiveModel('document');
                  setPathFilter('all');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeModel === 'document' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {document ? document.title.split(':')[0] : 'Document'} Modernization Pipeline
              </button>
              <button
                onClick={() => {
                  setActiveModel('attendance');
                  setPathFilter('all');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeModel === 'attendance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EduPulse Attendance Architecture (First Turn)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSourceModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors whitespace-nowrap shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-teal-700" />
              Compare Source Diagram
            </button>
          </div>
        </div>

        {/* Second Row: Filters, Search & Zoom */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Highlight Path:</span>
            <button
              onClick={() => setPathFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                pathFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              All Nodes
            </button>
            {activeModel === 'attendance' ? (
              <>
                <button
                  onClick={() => setPathFilter('normal-rollcall')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    pathFilter === 'normal-rollcall' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Teacher Morning Flow
                </button>
                <button
                  onClick={() => setPathFilter('escalation-loop')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    pathFilter === 'escalation-loop' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cutoff Lock & Escalation Loop
                </button>
                <button
                  onClick={() => setPathFilter('admin-governance')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    pathFilter === 'admin-governance' ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admin Setup & Audit
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setPathFilter('sf-pipeline')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    pathFilter === 'sf-pipeline' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  14-RS Query Pipeline
                </button>
                <button
                  onClick={() => setPathFilter('sf-export')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    pathFilter === 'sf-export' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tree Render & Excel Export
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search nodes or rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-44 md:w-52"
              />
            </div>

            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono text-slate-600">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border-l border-slate-200 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Flowmap Canvas Container */}
      <div 
        className="w-full overflow-x-auto rounded-2xl border border-slate-300 bg-slate-100/70 p-4 sm:p-8 transition-transform origin-top"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
      >
        {activeModel === 'document' ? (
          /* ======================================================== */
          /* DOCUMENT PIPELINE FLOWMAP CANVAS (Sales Forecast / Uploaded) */
          /* ======================================================== */
          <div className="min-w-[1080px] max-w-[1240px] mx-auto grid grid-cols-2 gap-8 relative">
            
            {/* Left Swimlane: Setup, Security & Criteria */}
            <div className="rounded-2xl border-2 border-slate-400/40 bg-white/70 p-6 flex flex-col shadow-sm relative backdrop-blur-xs">
              <div className="bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Setup, Auth & Filter Criteria</h3>
                  <p className="text-[11px] text-slate-300 font-medium">Environment, Security Roles & Selection Surface</p>
                </div>
                <span className="text-xs text-teal-300 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Phase 1: Ingestion
                </span>
              </div>

              <div className="space-y-6 relative flex-1">
                {docLeftNodes.map((node, nIdx) => (
                  <div key={node.id}>
                    <div 
                      onClick={() => setSelectedNode(node)}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs cursor-pointer hover:border-teal-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          {getIcon(node.iconName)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900">{node.title}</h4>
                            <span className="text-[10px] font-mono text-slate-400">Step #{node.stepNumber}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{node.subtitle}</p>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{node.description}</p>
                        </div>
                      </div>
                    </div>

                    {nIdx < docLeftNodes.length - 1 && (
                      <div className="flex justify-center my-3">
                        <div className="w-0.5 h-6 bg-teal-500 relative">
                          <div className="absolute -bottom-1 -left-1 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-teal-600" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Swimlane: Execution, Tree Render & Sibling Integrations */}
            <div className="rounded-2xl border-2 border-blue-500/40 bg-blue-50/30 p-6 flex flex-col shadow-sm relative backdrop-blur-xs">
              <div className="bg-blue-900 text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Execution Engine, Tree UX & Tools</h3>
                  <p className="text-[11px] text-blue-200 font-medium">14 Recordset Pipeline, Hierarchical Grid & Sibling EXEs</p>
                </div>
                <span className="text-xs text-blue-200 font-mono bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  Phase 2: Hydration
                </span>
              </div>

              <div className="space-y-6 relative flex-1">
                {docRightNodes.map((node, nIdx) => (
                  <div key={node.id}>
                    <div 
                      onClick={() => setSelectedNode(node)}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {getIcon(node.iconName)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900">{node.title}</h4>
                            <span className="text-[10px] font-mono text-slate-400">Step #{node.stepNumber}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{node.subtitle}</p>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{node.description}</p>
                        </div>
                      </div>
                    </div>

                    {nIdx < docRightNodes.length - 1 && (
                      <div className="flex justify-center my-3">
                        <div className="w-0.5 h-6 bg-blue-500 relative">
                          <div className="absolute -bottom-1 -left-1 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-blue-600" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Horizontal Cross-Connector between Filter Surface and Async SP */}
            <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <div className="bg-white px-3 py-1 rounded-xl border border-teal-500 shadow-sm text-[11px] font-bold text-teal-800 font-mono">
                Trigger Query ➔ Stream 14 Recordsets
              </div>
            </div>

          </div>
        ) : (
          /* ======================================================== */
          /* ATTENDANCE DUAL-SWIMLANE CANVAS (First Turn Diagram)     */
          /* ======================================================== */
          <div className="min-w-[1080px] max-w-[1240px] mx-auto grid grid-cols-2 gap-8 relative">
          
          {/* ======================================================== */}
          {/* LEFT SWIMLANE: School Administrator Role (Full Access)  */}
          {/* ======================================================== */}
          <div className="rounded-2xl border-2 border-teal-600/40 bg-teal-50/40 p-6 flex flex-col shadow-sm relative backdrop-blur-xs">
            {/* Swimlane Header Banner */}
            <div className="bg-teal-800 text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-bold tracking-tight">School Administrator Role</h3>
                <p className="text-[11px] text-teal-200 font-medium">Full System Access & Governance</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-teal-100 bg-teal-900/60 px-2.5 py-1 rounded-md border border-teal-700 font-mono">
                <span>RBAC: sys:admin</span>
              </div>
            </div>

            {/* Admin Nodes Flow */}
            <div className="space-y-6 relative flex-1">
              
              {/* Row 1: Admin Login -> System Dashboard */}
              <div className="grid grid-cols-2 gap-4 items-center relative">
                {/* Node 1: Admin Login */}
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'admin-login') || null)}
                  className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md ${
                    isNodeHighlighted('admin-login') 
                      ? 'border-teal-500 hover:border-teal-600 ring-2 ring-teal-500/20' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      {getIcon('UserCheck')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">Admin Portal Login</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">JWT RBAC</p>
                    </div>
                  </div>
                </div>

                {/* Connecting arrow 1 */}
                <div className="absolute left-[47%] -translate-x-1/2 z-10 flex items-center justify-center pointer-events-none">
                  <div className="h-0.5 w-6 bg-teal-500 relative">
                    <div className="absolute -right-1 -top-1 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-teal-600" />
                  </div>
                </div>

                {/* Node 2: System Dashboard */}
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'admin-dashboard') || null)}
                  className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md ${
                    isNodeHighlighted('admin-dashboard') 
                      ? 'border-teal-500 hover:border-teal-600 ring-2 ring-teal-500/20' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      {getIcon('Gauge')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">System Dashboard</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">KPIs & Alerts</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Downward Connector to Node 3 */}
              <div className="flex justify-center -my-2">
                <div className="w-0.5 h-6 bg-teal-500 relative">
                  <div className="absolute -bottom-1 -left-1 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-teal-600" />
                </div>
              </div>

              {/* Node 3: Manage User Accounts (Centered) */}
              <div className="flex justify-center">
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'admin-users') || null)}
                  className={`w-4/5 p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md ${
                    isNodeHighlighted('admin-users') 
                      ? 'border-teal-600 hover:border-teal-700 ring-2 ring-teal-500/30' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                      {getIcon('Users')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">Manage User Accounts</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">(CRUD for Staff / Students)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Branching Lines from Node 3 down to Node 4 & Node 5 */}
              <div className="relative h-8 flex justify-center items-center">
                <div className="w-3/5 h-0.5 bg-teal-500 relative">
                  <div className="absolute -left-0.5 top-0 w-0.5 h-6 bg-teal-500" />
                  <div className="absolute -right-0.5 top-0 w-0.5 h-6 bg-teal-500" />
                  <div className="absolute left-1/2 -top-2 w-0.5 h-2 bg-teal-500" />
                </div>
              </div>

              {/* Row 3: Configure Master Entities & View Global Attendance Records */}
              <div className="grid grid-cols-2 gap-4 items-start">
                {/* Node 4: Configure Master Entities */}
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'admin-master') || null)}
                  className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md ${
                    isNodeHighlighted('admin-master') 
                      ? 'border-teal-500 hover:border-teal-600 ring-2 ring-teal-500/20' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors mt-0.5">
                      {getIcon('Settings')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">Configure Master Entities</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">(Classes, Sections, Subjects)</p>
                    </div>
                  </div>
                </div>

                {/* Node 5: View Global Attendance Records (Primary Escalation Receiver) */}
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'admin-records') || null)}
                  className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md relative ${
                    isNodeHighlighted('admin-records') 
                      ? 'border-emerald-600 hover:border-emerald-700 ring-2 ring-emerald-500/30 bg-emerald-50/20' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  {/* Highlight pill for override reception */}
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded-md uppercase tracking-wider shadow-2xs">
                    Override Queue
                  </span>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors mt-0.5">
                      {getIcon('FileCheck')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">View Global Attendance Records</h4>
                      <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">(Staff / Student Overrides)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Downward Connector to Node 6 */}
              <div className="flex justify-end pr-20 -my-2">
                <div className="w-0.5 h-6 bg-teal-500 relative">
                  <div className="absolute -bottom-1 -left-1 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-teal-600" />
                </div>
              </div>

              {/* Node 6: Generate Global Reports & Audits */}
              <div className="flex justify-end pr-4">
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'admin-reports') || null)}
                  className={`w-1/2 p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md ${
                    isNodeHighlighted('admin-reports') 
                      ? 'border-teal-500 hover:border-teal-600 ring-2 ring-teal-500/20' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      {getIcon('FileText')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">Generate Global Reports & Audits</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Compliance Exports</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>


          {/* ======================================================== */}
          {/* RIGHT SWIMLANE: Teacher Role (Scoped Access)             */}
          {/* ======================================================== */}
          <div className="rounded-2xl border-2 border-blue-600/40 bg-blue-50/40 p-6 flex flex-col shadow-sm relative backdrop-blur-xs">
            {/* Swimlane Header Banner */}
            <div className="bg-blue-800 text-white px-5 py-3 rounded-xl shadow-xs flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-bold tracking-tight">Teacher Role</h3>
                <p className="text-[11px] text-blue-200 font-medium">Scoped Access (Assigned Classes Only)</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-100 bg-blue-900/60 px-2.5 py-1 rounded-md border border-blue-700 font-mono">
                <span>RBAC: role:teacher</span>
              </div>
            </div>

            {/* Teacher Nodes Flow */}
            <div className="space-y-6 relative flex-1">
              
              {/* Row 1: Teacher Portal Login -> Dashboard Quick Actions */}
              <div className="grid grid-cols-2 gap-4 items-center relative">
                {/* Node 7: Teacher Login */}
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'teacher-login') || null)}
                  className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md ${
                    isNodeHighlighted('teacher-login') 
                      ? 'border-blue-500 hover:border-blue-600 ring-2 ring-blue-500/20' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {getIcon('LogIn')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">Teacher Portal Login</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">JWT RBAC</p>
                    </div>
                  </div>
                </div>

                {/* Connecting arrow 2 */}
                <div className="absolute left-[47%] -translate-x-1/2 z-10 flex items-center justify-center pointer-events-none">
                  <div className="h-0.5 w-6 bg-blue-500 relative">
                    <div className="absolute -right-1 -top-1 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-blue-600" />
                  </div>
                </div>

                {/* Node 8: Dashboard Quick Actions */}
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'teacher-dashboard') || null)}
                  className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md ${
                    isNodeHighlighted('teacher-dashboard') 
                      ? 'border-blue-500 hover:border-blue-600 ring-2 ring-blue-500/20' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {getIcon('LayoutDashboard')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">Dashboard Quick Actions</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">& Today's Sections</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision Branching Diamond Node */}
              <div className="relative my-2 flex justify-center items-center">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-blue-500" />
                  <div className="w-8 h-8 rounded-md bg-blue-700 text-white flex items-center justify-center rotate-45 shadow-xs border-2 border-white">
                    <Settings className="w-4 h-4 -rotate-45" />
                  </div>
                  <div className="w-full max-w-[280px] h-0.5 bg-blue-500 mt-2 relative">
                    <div className="absolute -left-0.5 top-0 w-0.5 h-6 bg-blue-500" />
                    <div className="absolute -right-0.5 top-0 w-0.5 h-6 bg-blue-500" />
                  </div>
                </div>
              </div>

              {/* Row 2: Branch A (Personal Check-in) & Branch B (Assigned Class Roster) */}
              <div className="grid grid-cols-2 gap-4 items-start">
                {/* Node 9: Submit Daily Personal Check-in */}
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'teacher-checkin') || null)}
                  className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md ${
                    isNodeHighlighted('teacher-checkin') 
                      ? 'border-blue-500 hover:border-blue-600 ring-2 ring-blue-500/20' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors mt-0.5">
                      {getIcon('Clock')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">Submit Daily Personal Check-in</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Faculty Geofence</p>
                    </div>
                  </div>
                </div>

                {/* Node 10: Access Assigned Class Roster & Student Details */}
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'teacher-roster') || null)}
                  className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md ${
                    isNodeHighlighted('teacher-roster') 
                      ? 'border-blue-500 hover:border-blue-600 ring-2 ring-blue-500/20' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors mt-0.5">
                      {getIcon('UserCheck')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">Access Assigned Class Roster</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">& Student Medical Details</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Downward Connectors */}
              <div className="grid grid-cols-2 gap-4 items-center -my-2">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 mb-1">
                    Cutoff Locked (&gt;08:45)
                  </span>
                  <div className="w-0.5 h-6 bg-blue-500 relative">
                    <div className="absolute -bottom-1 -left-1 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-blue-600" />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-blue-500 relative">
                    <div className="absolute -bottom-1 -left-1 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-blue-600" />
                  </div>
                </div>
              </div>

              {/* Row 3: Restricted Request for Admin Override & Bulk Student Attendance Marking */}
              <div className="grid grid-cols-2 gap-4 items-start">
                {/* Node 12: Restricted Request for Admin Override (Escalation Source) */}
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'teacher-override-request') || null)}
                  className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md relative ${
                    isNodeHighlighted('teacher-override-request') 
                      ? 'border-amber-500 hover:border-amber-600 ring-2 ring-amber-500/30 bg-amber-50/20' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  <span className="absolute -top-2.5 left-3 px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider shadow-2xs">
                    Escalation Origin
                  </span>
                  <div className="flex items-start gap-3 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors mt-0.5">
                      {getIcon('Lock')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">Restricted Request for Admin Override</h4>
                      <p className="text-[11px] text-amber-900 font-semibold mt-0.5">Ticket Workflow</p>
                    </div>
                  </div>
                </div>

                {/* Node 11: Bulk Student Attendance Marking */}
                <div 
                  onClick={() => setSelectedNode(FLOW_NODES.find(n => n.id === 'teacher-bulk-attendance') || null)}
                  className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all duration-200 group hover:shadow-md ${
                    isNodeHighlighted('teacher-bulk-attendance') 
                      ? 'border-blue-500 hover:border-blue-600 ring-2 ring-blue-500/20' 
                      : 'opacity-40 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors mt-0.5">
                      {getIcon('Edit3')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">Bulk Student Attendance Marking</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">(Present / Absent / Late)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal arrow connecting Node 11 back to Node 12 (if late edit requested) */}
              <div className="flex items-center justify-center -my-2 pr-12">
                <div className="flex items-center gap-2 bg-amber-100/90 text-amber-900 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <span>← Late Edit / Discrepancy Past Cutoff (09:30 AM)</span>
                </div>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* CROSS-SWIMLANE ESCALATION CONNECTOR ARROW               */}
          {/* Connects Node 12 (Teacher Override) -> Node 5 (Admin Records) */}
          {/* ======================================================== */}
          <div className="absolute top-[68%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="flex flex-col items-center bg-white px-3 py-1.5 rounded-xl border-2 border-emerald-500 shadow-md">
              <span className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1 uppercase tracking-tight">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                Escalation Dispatch Loop
              </span>
              <span className="text-[10px] text-slate-500">Teacher Override Ticket ➔ Admin Queue</span>
            </div>
            
            {/* Curving SVG Arrow */}
            <svg 
              className="w-48 h-20 absolute -left-20 -top-8 overflow-visible pointer-events-none stroke-emerald-600" 
              fill="none" 
              strokeWidth="3"
            >
              <path 
                d="M 170 30 C 100 30, 40 10, -20 20" 
                strokeDasharray="4 2"
                className="animate-pulse"
              />
              <polygon points="-25,20 -15,14 -15,26" fill="#059669" />
            </svg>
          </div>

        </div>
        )}
      </div>

      {/* Deep-Dive Inspection Drawer / Modal */}
      <NodeInspectorModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onNavigateToFsd={() => {
          setSelectedNode(null);
          onNavigateToTab('fsd');
        }}
        onNavigateToJourney={() => {
          setSelectedNode(null);
          onNavigateToTab('journey');
        }}
      />
    </div>
  );
};
