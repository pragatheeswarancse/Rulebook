import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Search, 
  Barcode, 
  Volume2, 
  Maximize2, 
  FileCode, 
  Palette, 
  MousePointer, 
  Play, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  Check,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Monitor,
  LayoutGrid,
  Filter,
  Columns,
  GitBranch
} from 'lucide-react';
import { RulebookProject, RulebookAnalysis, AiFlowchartData } from '../../types/rulebook';
import { PerspectiveFlowchartCanvas } from './PerspectiveFlowchartCanvas';

interface Props {
  project: RulebookProject;
  analysis: RulebookAnalysis;
  onOpenSourcePage: (page: number) => void;
  onSaveFlowchart?: (perspective: 'frontend' | 'backend', flowchart: AiFlowchartData) => void;
}

export const FrontendPerspectiveView: React.FC<Props> = ({
  project,
  analysis,
  onOpenSourcePage,
  onSaveFlowchart
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'flowchart' | 'access_roles' | 'screens' | 'sidebars' | 'inputs_filters' | 'tables' | 'sandbox'>('flowchart');
  
  // Interactive Sandbox & Role state
  const [simSelectedRole, setSimSelectedRole] = useState<string>('P1 – Cycle Counter');
  const [simCategory, setSimCategory] = useState<string>('Lighting Fixtures');
  const [simPartGroup, setSimPartGroup] = useState<string>('LED High Bay');
  const [simSearchTerm, setSimSearchTerm] = useState<string>('');
  const [simBarcodeScan, setSimBarcodeScan] = useState<string>('');
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [simRecentEvents, setSimRecentEvents] = useState<{ id: string; time: string; text: string; type: 'success' | 'warn' | 'info' }[]>([
    { id: 'ev-1', time: '10:42:01', text: 'Loaded default warehouse LAX1 (is_default = 1)', type: 'info' },
    { id: 'ev-2', time: '10:42:05', text: 'TanStack Virtual Grid initialized with 42 items & utilization badges', type: 'success' }
  ]);

  const handleSimulateScan = (code: string) => {
    if (!code.trim()) return;
    const now = new Date().toLocaleTimeString();
    if (code.toUpperCase().includes('MIA')) {
      setSimRecentEvents(prev => [
        { id: `ev-${Date.now()}`, time: now, text: `Barcode [${code}] detected on MIA order. Triggering relocation modal.`, type: 'warn' },
        ...prev.slice(0, 5)
      ]);
      setActiveDialog('MIA Relocation Staging Modal');
    } else if (code.length < 5) {
      setSimRecentEvents(prev => [
        { id: `ev-${Date.now()}`, time: now, text: `VR09 Guard: Code [${code}] too short (< 5 chars). Audio: Beep_Fail (350Hz).`, type: 'warn' },
        ...prev.slice(0, 5)
      ]);
    } else {
      setSimRecentEvents(prev => [
        { id: `ev-${Date.now()}`, time: now, text: `Scanned [${code}] -> Verified receipt date on INSTOCK. Audio: Beep_Success (1200Hz).`, type: 'success' },
        ...prev.slice(0, 5)
      ]);
    }
    setSimBarcodeScan('');
  };

  // 1. ACCESS & ROLES CLIENT GUARDRAILS (What FE really wants for RBAC UI)
  const roleAccessMatrix = [
    {
      role: 'P1 – Cycle Counter',
      screenAccess: 'frmCycleCount (Floor Terminal)',
      buttonState: {
        markCounted: { state: 'Enabled', label: 'Mark As Counted (F13)' },
        checkIn: { state: 'Enabled', label: 'Check Item In (F16)' },
        miaMove: { state: 'Enabled', label: 'Move to MIA (F17)' },
        inventoryLaunchers: { state: 'Hidden', label: 'Inventory Launchers (F19)' },
        partMaintenance: { state: 'Hidden', label: 'Part Maintenance (F19)' },
        checkUpReview: { state: 'Enabled', label: 'Check Up View (F23)' }
      },
      clientGuardNotes: 'Standard floor operator. Menu toolbar security-trims admin utilities via fn_user_menus.'
    },
    {
      role: 'P2 – Inventory Editor',
      screenAccess: 'frmCycleCount + Inventory Launchers',
      buttonState: {
        markCounted: { state: 'Enabled', label: 'Mark As Counted (F13)' },
        checkIn: { state: 'Enabled', label: 'Check Item In (F16)' },
        miaMove: { state: 'Enabled', label: 'Move to MIA (F17)' },
        inventoryLaunchers: { state: 'Enabled', label: 'Add/Remove Inventory (F19)' },
        partMaintenance: { state: 'Hidden', label: 'Part Maintenance (F19)' },
        checkUpReview: { state: 'Enabled', label: 'Check Up View (F23)' }
      },
      clientGuardNotes: 'Holds dbo.can_edit_inventory() = 1. Launchers active on ribbon toolbar.'
    },
    {
      role: 'P3 – Parts Editor',
      screenAccess: 'frmCycleCount + Part Master Launchers',
      buttonState: {
        markCounted: { state: 'Enabled', label: 'Mark As Counted (F13)' },
        checkIn: { state: 'Enabled', label: 'Check Item In (F16)' },
        miaMove: { state: 'Enabled', label: 'Move to MIA (F17)' },
        inventoryLaunchers: { state: 'Hidden', label: 'Inventory Launchers (F19)' },
        partMaintenance: { state: 'Enabled', label: 'Part Maintenance (F19)' },
        checkUpReview: { state: 'Enabled', label: 'Check Up View (F23)' }
      },
      clientGuardNotes: 'Holds dbo.can_edit_parts() = 1. Allows dimensional & weight spec editing.'
    },
    {
      role: 'P5 – Warehouse Supervisor',
      screenAccess: 'Full Access + Governance Audit',
      buttonState: {
        markCounted: { state: 'Enabled', label: 'Mark As Counted (F13)' },
        checkIn: { state: 'Enabled', label: 'Check Item In (F16)' },
        miaMove: { state: 'Enabled', label: 'Move to MIA (F17)' },
        inventoryLaunchers: { state: 'Enabled', label: 'Add/Remove Inventory (F19)' },
        partMaintenance: { state: 'Enabled', label: 'Part Maintenance (F19)' },
        checkUpReview: { state: 'Enabled', label: 'Supervisory Review & Excel (F23)' }
      },
      clientGuardNotes: 'Full oversight access. Reviews daily counts per user and triggers Excel COM exports.'
    },
    {
      role: 'P6 – User With No Warehouse',
      screenAccess: 'Read-Only Floor Browse',
      buttonState: {
        markCounted: { state: 'Disabled', label: 'Disabled (Requires Default Warehouse)' },
        checkIn: { state: 'Disabled', label: 'Disabled (Requires Default Warehouse)' },
        miaMove: { state: 'Disabled', label: 'Disabled (Requires Default Warehouse)' },
        inventoryLaunchers: { state: 'Hidden', label: 'Inventory Launchers (F19)' },
        partMaintenance: { state: 'Hidden', label: 'Part Maintenance (F19)' },
        checkUpReview: { state: 'Enabled', label: 'Check Up View (F23)' }
      },
      clientGuardNotes: '_UserWarehouseCode is empty. Write actions display alert tooltip: "Contact administrator for default warehouse assignment."'
    }
  ];

  // 2. INPUTS & FILTERS SPECIFICATION (What FE really wants for form controls)
  const inputSpecs = [
    {
      name: 'Warehouse Selector ComboBox',
      targetRef: 'F03 / BR01',
      componentType: 'Radix UI Select / React-Select',
      defaultValue: '_UserWarehouseCode (warehouses.is_default = 1)',
      rules: 'Strictly excludes "LAX2" and "NEW, LAX2". On selection change, invalidates parts cache and re-queries.',
      validation: 'Required field. Cannot be cleared. Fallback to first available facility.',
      keyboardNav: 'Alt+W shortcut to focus. Arrow navigation.'
    },
    {
      name: 'Debounced Free-Text Search',
      targetRef: 'F08 / VR05',
      componentType: 'SearchInput with clear button',
      defaultValue: 'Empty string',
      rules: 'Filters across partno and description client-side and server-side. Debounce threshold: 300ms.',
      validation: 'Alphanumeric and standard delimiters (- / _ .). Clear button appears when length > 0.',
      keyboardNav: 'Ctrl+F or "/" focuses input. Esc clears query.'
    },
    {
      name: 'Barcode Scanner Wedge Listener',
      targetRef: 'F14 / F15 / VR09',
      componentType: 'Global Keypress Buffer Listener',
      defaultValue: 'Listening on window',
      rules: 'Intercepts rapid keystrokes (<50ms inter-key gap) ending in Carriage Return (CR/LF).',
      validation: 'Length >= 5 characters. Codes < 5 trigger acoustic Beep_Fail (350Hz) and visual amber pulse.',
      keyboardNav: 'Global listener does not require manual text box focus.'
    },
    {
      name: 'Category Commodity Selector',
      targetRef: 'F05 / Sidebar',
      componentType: 'Vertical ListBox with badge counts',
      defaultValue: 'First alphabetical category',
      rules: 'On category change, cascades and resets Part Group list. Shows active part count per commodity.',
      validation: 'Single-select mandatory.',
      keyboardNav: 'Arrow Up/Down cycles items; Space/Enter selects.'
    },
    {
      name: 'Check-In Quantity Spinner',
      targetRef: 'F16 / Modal',
      componentType: 'Numeric Stepper',
      defaultValue: '1',
      rules: 'Integer only. Range 1 to 9999. Defaults to 1 for serialized parts.',
      validation: 'Rejects negative numbers and non-integers. Auto-rounds decimal input.',
      keyboardNav: 'Arrow Up (+1), Arrow Down (-1), PageUp (+10), PageDown (-10).'
    }
  ];

  // 3. TABLES & VIRTUAL GRIDS ARCHITECTURE (Modernizing UltraWinGrid to React)
  const gridColumns = [
    { key: 'partno', label: 'Part Number', width: '130px', align: 'left', font: 'font-mono font-bold text-[#2558E8]', render: 'Text with copy icon on hover' },
    { key: 'descr', label: 'Part Description', width: 'flex-1 (min 220px)', align: 'left', font: 'text-[#0F172A]', render: 'Truncated text with native tooltip' },
    { key: 'category', label: 'Category', width: '130px', align: 'left', font: 'text-[#64748B]', render: 'Secondary muted label' },
    { key: 'onhand', label: 'On Hand', width: '90px', align: 'right', font: 'font-mono text-slate-800 font-bold', render: 'Integer count' },
    { 
      key: 'util_pct', 
      label: 'Utilization %', 
      width: '120px', 
      align: 'center', 
      font: 'font-mono', 
      render: 'Dynamic Color Ramp Badge: 0% Red (#DC2626), <20% Pink (#F43F5E), 20-79% Neutral (#64748B), >=80% Green (#059669)' 
    },
    { key: 'last_count', label: 'Last Counted', width: '120px', align: 'left', font: 'font-mono text-xs', render: 'Relative time or "Never"' },
    { key: 'actions', label: 'Quick Actions', width: '170px', align: 'right', font: '', render: 'Mark Counted (F13), Check-In (F16), MIA (F17)' }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Borderless Horizontal Sub-tab Rail */}
      <div className="border-b border-slate-200/90 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'flowchart', label: 'AI Flowchart', icon: GitBranch },
            { id: 'access_roles', label: 'Access & Roles', icon: Shield, count: 4 },
            { id: 'screens', label: 'Screens & Layout', icon: Monitor, count: 4 },
            { id: 'sidebars', label: 'Sidebars & Trees', icon: Columns },
            { id: 'inputs_filters', label: 'Inputs & Filters', icon: Sliders, count: 5 },
            { id: 'tables', label: 'Virtual Tables', icon: LayoutGrid, count: 6 },
            { id: 'sandbox', label: 'Sandbox', icon: Play }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`relative shrink-0 inline-flex items-center gap-2 px-3 py-3 text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#2558E8]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md tabular-nums ${
                      isActive
                        ? 'bg-blue-50 text-[#2558E8] border border-blue-200/70'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="frontend-subtab-indicator"
                    transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                    className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[#2558E8]"
                  />
                )}
              </button>
            );
          })}
        </div>

        <span className="hidden xl:inline-flex items-center shrink-0 text-[11px] font-mono text-slate-400 pl-3 border-l border-slate-200/80">
          React 19 · TanStack · Radix
        </span>
      </div>

      {/* =====================================================================
          SUB-TAB 0: AI ARCHITECTURE FLOWCHART (GEMINI MAIN CHARACTER)
         ===================================================================== */}
      {activeSubTab === 'flowchart' && (
        <PerspectiveFlowchartCanvas
          project={project}
          analysis={analysis}
          perspective="frontend"
          onOpenSourcePage={onOpenSourcePage}
          onSaveFlowchart={(persp, fc) => onSaveFlowchart?.(persp, fc)}
        />
      )}

      {/* =====================================================================
          SUB-TAB 1: ACCESS & ROLES CLIENT GUARDRAILS (What FE really wants)
         ===================================================================== */}
      {activeSubTab === 'access_roles' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#2558E8]" />
                <span>Client-Side Role-Based UI Guardrails (RBAC Matrix)</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Exact button states, conditional rendering rules, and tooltip blockers for all 6 personas in the application.
              </p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-[#2558E8] font-bold px-2.5 py-1 rounded-md border border-blue-200 shrink-0">
              6 Personas Mapped
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-[#64748B] border-b border-[#E2E8F0] font-semibold">
                <tr>
                  <th className="py-3 px-4 min-w-[160px]">Persona / Actor</th>
                  <th className="py-3 px-3 min-w-[150px]">Allowed Screen Scope</th>
                  <th className="py-3 px-3">Mark Counted (F13)</th>
                  <th className="py-3 px-3">Check-In Item (F16)</th>
                  <th className="py-3 px-3">MIA Move (F17)</th>
                  <th className="py-3 px-3">Inventory Tools</th>
                  <th className="py-3 px-3">Part Maint</th>
                  <th className="py-3 px-4 min-w-[220px]">FE Guardrail Implementation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roleAccessMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0F172A] whitespace-nowrap">
                      {item.role}
                    </td>
                    <td className="py-3.5 px-3 text-[#2558E8] font-mono text-[11px] whitespace-nowrap">
                      {item.screenAccess}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.buttonState.markCounted.state === 'Enabled' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {item.buttonState.markCounted.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.buttonState.checkIn.state === 'Enabled' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {item.buttonState.checkIn.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.buttonState.miaMove.state === 'Enabled' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {item.buttonState.miaMove.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.buttonState.inventoryLaunchers.state === 'Enabled' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.buttonState.inventoryLaunchers.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.buttonState.partMaintenance.state === 'Enabled' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.buttonState.partMaintenance.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] leading-relaxed text-[11px]">
                      {item.clientGuardNotes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 2: SCREENS & LAYOUT ARCHITECTURE
         ===================================================================== */}
      {activeSubTab === 'screens' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Layout Specs (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 border-b border-slate-100 pb-3">
              <Monitor className="w-4 h-4 text-[#2558E8]" />
              <span>Viewport Grid &amp; Container Architecture</span>
            </h3>

            <div className="space-y-3.5 text-xs text-[#334155] leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-[#0F172A] block text-xs">Primary Viewport Specifications:</span>
                <ul className="space-y-1 list-disc list-inside text-[11px] text-[#475569]">
                  <li><strong>Target Canvas Width:</strong> Maximum 1440px container, centered with 24px gutters.</li>
                  <li><strong>Split-Pane Layout:</strong> Left Sidebar (260px fixed), Center Virtual Grid (flex-1), Right Part Details (320px collapsible).</li>
                  <li><strong>Minimum Screen Resolution:</strong> 1280 x 800 without horizontal scrolling.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1.5">
                <span className="font-bold text-[#0F172A] block text-xs">Responsive Mobile &amp; Tablet Strategy:</span>
                <ul className="space-y-1 list-disc list-inside text-[11px] text-[#475569]">
                  <li><strong>Tablet (768px – 1024px):</strong> Right accordion panel folds into bottom expandable sheet.</li>
                  <li><strong>Warehouse Handheld Mobile (&lt;768px):</strong> Sidebar collapses into drawer; full-screen barcode scanning mode.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-[#0F172A] block text-xs">Modal Dialogs Required:</span>
                <div className="space-y-1 text-[11px] font-mono text-[#2558E8]">
                  <div>• frmCheckInDialog (480px fixed width, focus trapped)</div>
                  <div>• frmMIAOrderPicker (520px fixed width, multi-row transfer)</div>
                  <div>• frmBarcodeCollisionPicker (440px duplicate resolver)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Wireframe Preview (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-[#2558E8]" />
                <span>Modern Screen Wireframe: frmCycleCount</span>
              </span>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                1280px Desktop Blueprint
              </span>
            </div>

            {/* Rendered Wireframe Mock - Clean Enterprise Blueprint */}
            <div className="border border-slate-200 rounded-xl bg-slate-50/70 p-3.5 space-y-2 text-slate-800 font-sans">
              
              {/* App Bar */}
              <div className="bg-white border border-slate-200/80 px-3 py-2 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-900">Cycle Count OS — [LAX1 Facility]</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Operator: kasinthan_p (P1)</span>
              </div>

              {/* Sub-Header Ribbon */}
              <div className="bg-white border border-slate-200/80 p-2 rounded-lg flex items-center justify-between text-[11px] gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Warehouse:</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono font-medium">LAX1 - Main Warehouse</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Check Up (F23)</span>
                  <span className="bg-slate-900 text-white px-2 py-0.5 rounded font-medium">Export</span>
                </div>
              </div>

              {/* 3-Column Body Mock */}
              <div className="grid grid-cols-12 gap-2 min-h-[220px] text-xs">
                
                {/* Left (3 cols) */}
                <div className="col-span-3 bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Categories</span>
                  <div className="space-y-1 text-[11px]">
                    <div className="bg-slate-900 text-white px-2 py-1 rounded font-medium">Lighting Fixtures</div>
                    <div className="text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded">Cables &amp; Distro</div>
                    <div className="text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded">Rigging Parts</div>
                  </div>
                </div>

                {/* Center (6 cols) */}
                <div className="col-span-6 bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Parts Virtual Grid (42 SKUs)</span>
                      <span className="text-[10px] text-emerald-700 font-mono font-medium">Search Active</span>
                    </div>
                    <div className="rounded border border-slate-200 p-2 space-y-1 text-[10px] font-mono mt-1.5">
                      <div className="flex justify-between text-slate-400 border-b border-slate-100 pb-1">
                        <span>SKU</span>
                        <span>Util %</span>
                        <span>On Hand</span>
                      </div>
                      <div className="flex justify-between text-slate-800 font-medium py-0.5">
                        <span className="text-blue-600">LTG-8801</span>
                        <span className="text-emerald-700">84%</span>
                        <span>142 units</span>
                      </div>
                      <div className="flex justify-between text-slate-600 py-0.5">
                        <span className="text-blue-600">LTG-8802</span>
                        <span className="text-amber-700">18%</span>
                        <span>38 units</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-1.5 bg-slate-50 border border-slate-200/80 rounded text-[10px] flex items-center justify-between">
                    <span className="text-slate-600 font-mono">Scanner Wedge: READY</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">Acoustic Cues ON</span>
                  </div>
                </div>

                {/* Right (3 cols) */}
                <div className="col-span-3 bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-2 text-[10px]">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider block">Part Specs</span>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1 text-slate-700">
                    <div>Gross: 14.2 lbs (6.4 kg)</div>
                    <div>Dims: 18 x 12 x 8 in</div>
                    <div className="text-emerald-700 font-medium">Locations: 3 Bins</div>
                  </div>
                  <button className="w-full py-1.5 bg-slate-900 text-white rounded font-medium text-[11px] hover:bg-slate-800 transition-colors cursor-pointer">
                    Mark Counted
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          SUB-TAB 3: SIDEBARS & HIERARCHICAL TREES
         ===================================================================== */}
      {activeSubTab === 'sidebars' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Columns className="w-4 h-4 text-[#2558E8]" />
              <span>Sidebar Component Specification (Category &amp; Part Group Trees)</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Keyboard accessibility, auto-selection cascade, and responsive collapsing rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0F172A] block text-xs">1. Commodity Category List</span>
              <p className="text-[#475569] leading-relaxed">
                Single-select vertical list. Selecting a category immediately filters the Part Group child list and resets pagination.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-1">
                State: `selectedCategory: string` (default first alphabetical item).
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0F172A] block text-xs">2. Part Group Prefix Extraction</span>
              <p className="text-[#475569] leading-relaxed">
                Extracted from text token preceding first comma in part description per BR06. Falls back to "All Part Groups" if none match.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-1">
                State: `selectedPartGroup: string | null`.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0F172A] block text-xs">3. Keyboard Traversal</span>
              <p className="text-[#475569] leading-relaxed">
                Full accessibility: <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">ArrowUp</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">ArrowDown</kbd> traverses categories without focus loss.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-1">
                ARIA: `role="listbox"`, `aria-activedescendant`.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 4: INPUTS & FILTERS SPECIFICATION
         ===================================================================== */}
      {activeSubTab === 'inputs_filters' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2558E8]" />
                <span>Detailed Form Inputs &amp; Filter Surface Specification</span>
              </h3>
              <p className="text-xs text-[#64748B]">
                Component types, validation constraints, debounce rates, and keyboard navigation specifications.
              </p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-[#2558E8] font-bold px-2.5 py-1 rounded-md border border-blue-200">
              5 Core Controls
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-[#64748B] border-b border-[#E2E8F0] font-semibold">
                <tr>
                  <th className="py-3 px-3">Control Name</th>
                  <th className="py-3 px-3">Component Type</th>
                  <th className="py-3 px-3">Default Value</th>
                  <th className="py-3 px-4 min-w-[220px]">Behavioral Rule &amp; Cascading</th>
                  <th className="py-3 px-3">Validation &amp; Error State</th>
                  <th className="py-3 px-3">Keyboard Shortcut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inputSpecs.map((inp, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[#0F172A] whitespace-nowrap">
                      {inp.name}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[#2558E8] text-[11px] whitespace-nowrap">
                      {inp.componentType}
                    </td>
                    <td className="py-3.5 px-3 text-[#334155] font-mono text-[11px] whitespace-nowrap">
                      {inp.defaultValue}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] leading-relaxed">
                      {inp.rules}
                    </td>
                    <td className="py-3.5 px-3 text-red-600 text-[11px]">
                      {inp.validation}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {inp.keyboardNav}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 5: VIRTUAL TABLES & GRIDS ARCHITECTURE
         ===================================================================== */}
      {activeSubTab === 'tables' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#2558E8]" />
                <span>TanStack Table Virtual Grid Architecture (UltraWinGrid Migration)</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Column definitions, cell renderers, dynamic color ramp badges, and DOM virtualization parameters.
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-md border border-emerald-200">
              Virtualization: 10,000+ Rows
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-[#64748B] border-b border-[#E2E8F0] font-semibold">
                <tr>
                  <th className="py-3 px-3">Column ID</th>
                  <th className="py-3 px-3">Header Label</th>
                  <th className="py-3 px-3">Target Width</th>
                  <th className="py-3 px-3">Alignment</th>
                  <th className="py-3 px-4 min-w-[280px]">Custom Cell Renderer &amp; Badge Style</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gridColumns.map((col) => (
                  <tr key={col.key} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#2558E8]">
                      {col.key}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#0F172A]">
                      {col.label}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">
                      {col.width}
                    </td>
                    <td className="py-3.5 px-3 capitalize font-mono text-[11px] text-slate-600">
                      {col.align}
                    </td>
                    <td className="py-3.5 px-4 text-[#334155] leading-relaxed text-[11px]">
                      {col.render}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <span className="font-bold text-[#0F172A] block text-xs">Virtualization Technical Parameters:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#475569] text-[11px] font-mono">
              <div>• Row Height: 38px fixed</div>
              <div>• Overscan Buffer: 10 rows</div>
              <div>• Scroll Mode: Window scroll / Virtual viewport</div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 6: INTERACTIVE UI SANDBOX WITH LIVE RBAC TOGGLE
         ===================================================================== */}
      {activeSubTab === 'sandbox' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Play className="w-4 h-4 text-[#2558E8]" />
                <span>Interactive UI Sandbox &amp; Live Client RBAC Simulator</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Switch active persona to see client button states and tooltips dynamically update in real time.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B] font-bold">Simulate Persona:</span>
              <select 
                value={simSelectedRole}
                onChange={(e) => setSimSelectedRole(e.target.value)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 cursor-pointer shadow-2xs focus:ring-2 focus:ring-[#2558E8] focus:outline-none"
              >
                <option>P1 – Cycle Counter</option>
                <option>P2 – Inventory Editor</option>
                <option>P3 – Parts Editor</option>
                <option>P5 – Warehouse Supervisor</option>
                <option>P6 – User with no warehouse</option>
              </select>
            </div>
          </div>

          {/* Sandbox Canvas */}
          <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/60 space-y-5">
            
            {/* Active Permissions Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#0F172A]">Simulated Active Session: {simSelectedRole}</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                simSelectedRole.includes('P6') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {simSelectedRole.includes('P6') ? 'Restricted: No Default Warehouse' : 'Full Floor Access'}
              </span>
            </div>

            {/* Inputs & Filter Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Category (F05):</label>
                <select 
                  value={simCategory} 
                  onChange={(e) => setSimCategory(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option>Lighting Fixtures</option>
                  <option>Cables &amp; Power Distro</option>
                  <option>Rigging Hardware</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Part Group (F06):</label>
                <select 
                  value={simPartGroup} 
                  onChange={(e) => setSimPartGroup(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option>LED High Bay</option>
                  <option>Moving Spot Mover</option>
                  <option>Stage Wash Unit</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Debounced Search (F08):</label>
                <input 
                  type="text" 
                  value={simSearchTerm}
                  onChange={(e) => setSimSearchTerm(e.target.value)}
                  placeholder="Type to filter parts list..."
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Live Interactive Parts List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs text-xs">
              <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between font-bold text-slate-700">
                <span>Active Parts for {simCategory} &gt; {simPartGroup}</span>
                <span className="text-[11px] font-mono text-slate-500">2 matching items</span>
              </div>

              <div className="divide-y divide-slate-100 p-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#2558E8] text-sm">LTG-8801</span>
                      <span className="font-semibold text-[#0F172A]">LED High Bay 200W IP65</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">On Hand: 142 units | Last Counted: 10 Nov 2026</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      84% Utilized
                    </span>
                    <button 
                      disabled={simSelectedRole.includes('P6')}
                      onClick={() => handleSimulateScan('BC-LTG-8801')}
                      className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                        simSelectedRole.includes('P6') 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-[#2558E8] text-white hover:bg-[#1D47C5] shadow-xs'
                      }`}
                    >
                      {simSelectedRole.includes('P6') ? 'Count Blocked (P6)' : 'Mark Counted (F13)'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#2558E8] text-sm">LTG-8802</span>
                      <span className="font-semibold text-[#0F172A]">Moving Spot Mover 300W</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">On Hand: 38 units | Last Counted: 14 Oct 2026</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      18% Low Util
                    </span>
                    <button 
                      disabled={simSelectedRole.includes('P6')}
                      onClick={() => handleSimulateScan('MIA-LTG-8802')}
                      className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                        simSelectedRole.includes('P6') 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
                      }`}
                    >
                      {simSelectedRole.includes('P6') ? 'MIA Blocked (P6)' : 'Relocate to MIA (F17)'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Dialog Trigger Preview */}
            {activeDialog && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs animate-in zoom-in-95 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-900 block text-xs">Simulated Modal Triggered: {activeDialog}</span>
                    <span className="text-amber-800 text-[11px]">Enforces inter-warehouse check-in parameters per BR15 / BR21.</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDialog(null)}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Dismiss Modal
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
