import React from 'react';
import { 
  Laptop, 
  Database, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { PerspectiveType } from '../../types/rulebook';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectPerspective: (perspective: PerspectiveType) => void;
  currentPerspective?: PerspectiveType;
  projectName: string;
}

export const PerspectiveSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectPerspective,
  currentPerspective = 'frontend',
  projectName
}) => {
  if (!isOpen) return null;

  const perspectives: {
    id: PerspectiveType;
    title: string;
    roleLabel: string;
    badge: string;
    badgeColor: string;
    accentColor: string;
    icon: React.ElementType;
    description: string;
    keyDeliverables: string[];
    audience: string;
  }[] = [
    {
      id: 'frontend',
      title: 'Frontend Perspective',
      roleLabel: 'UI Engineer / Design Architect',
      badge: 'Client Telematics',
      badgeColor: 'bg-blue-50 text-[#2558E8] border-blue-200',
      accentColor: '#2558E8',
      icon: Laptop,
      description: 'Deconstruct screens, layout hierarchies, client-side validation rules (VR01–VR26), telematics, and interactive wireframes.',
      keyDeliverables: [
        'Screen layout hierarchies & modal dialogs',
        'Client-side validation rules & input masks',
        'Barcode scanner wedge & sound triggers',
        'Interactive wireframe & component sandbox'
      ],
      audience: 'Senior Frontend Engineers, UI Architects & UX Specialists'
    },
    {
      id: 'backend',
      title: 'Backend Perspective',
      roleLabel: 'Systems / Database Engineer',
      badge: 'Pipeline & Security',
      badgeColor: 'bg-emerald-50 text-[#059669] border-emerald-200',
      accentColor: '#059669',
      icon: Database,
      description: 'Inspect stored procedures, relational database schemas, transactional integrity, mass transfer staging, and SQL RBAC security.',
      keyDeliverables: [
        'Stored procedures & execution timeout contracts',
        'Relational schema tables, PKs, FKs & indices',
        'Transaction safety, staging views & rollback logic',
        'SQL user auth claims (SUSER_SNAME) & rights'
      ],
      audience: 'Backend Engineers, Database Administrators & Cloud Architects'
    },
    {
      id: 'manager',
      title: 'PO / Manager Perspective',
      roleLabel: 'Product Owner / Engineering Lead',
      badge: 'Delivery & Governance',
      badgeColor: 'bg-purple-50 text-[#7C3AED] border-purple-200',
      accentColor: '#7C3AED',
      icon: Briefcase,
      description: 'Review PERT calibrated effort hours, sprint delivery milestones, persona value propositions, and technical gap risks (G01–G13).',
      keyDeliverables: [
        'Calibrated PERT hours (Optimistic / Likely / Pessimistic)',
        'Sprint milestone roadmap & delivery schedule',
        'Persona matrix (P1–P6) & operational impact',
        'Technical gaps audit (G01–G13) & ARB review sign-off'
      ],
      audience: 'Product Owners, Engineering Managers, CISOs & ARB Boards'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div 
        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-[#2558E8] border border-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Perspective-Tailored Workspace</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              What perspective would you like to explore?
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Targeting <span className="font-semibold text-[#0F172A]">{projectName}</span>. Rulebook adjusts visual architecture, data depth, and action surfaces to match your engineering lens.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Close perspective modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Interactive Role Cards */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {perspectives.map((persp) => {
            const Icon = persp.icon;
            const isSelected = currentPerspective === persp.id;

            return (
              <div
                key={persp.id}
                onClick={() => {
                  onSelectPerspective(persp.id);
                  onClose();
                }}
                className={`group relative rounded-xl border p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/30 border-[#2558E8] ring-2 ring-[#2558E8]/20 shadow-md'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                
                {/* Top Section */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ 
                        backgroundColor: `${persp.accentColor}12`,
                        color: persp.accentColor 
                      }}
                    >
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${persp.badgeColor}`}>
                      {persp.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#2558E8] transition-colors">
                      {persp.title}
                    </h3>
                    <p className="text-[11px] font-medium text-[#64748B]">
                      {persp.roleLabel}
                    </p>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed">
                    {persp.description}
                  </p>

                  {/* Bullet Deliverables */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Key Highlights:
                    </span>
                    {persp.keyDeliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#334155]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2558E8] text-white shadow-xs'
                        : 'bg-slate-100 text-[#0F172A] group-hover:bg-[#2558E8] group-hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Currently Active' : `Enter ${persp.title.split(' ')[0]} Lens`}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <span className="text-[10px] text-slate-400 text-center block mt-1.5 truncate">
                    For {persp.audience.split(',')[0]}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer Note with Deep Dive Spec Option */}
        <div className="p-4 px-6 sm:px-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>Looking for granular AST deconstruction?</span>
            <button
              type="button"
              onClick={() => {
                onSelectPerspective('granular' as any);
                onClose();
              }}
              className="font-semibold text-slate-900 hover:text-[#2558E8] underline cursor-pointer"
            >
              Open Deep Dive Spec (10 Modules)
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            Keep current view
          </button>
        </div>

      </div>

    </div>
  );
};
