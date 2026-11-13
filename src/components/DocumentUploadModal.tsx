import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Sparkles, X, AlertCircle, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { AnalyzedEngineeringDocument } from '../types/documentAnalysis';
import { SALES_FORECAST_DOCUMENT } from '../data/salesForecastAnalysisData';
import { parseCustomEngineeringDocument } from '../utils/documentParser';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (doc: AnalyzedEngineeringDocument) => void;
  currentDocumentId: string;
}

export const DocumentUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectDocument,
  currentDocumentId
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'paste'>('presets');
  const [pasteText, setPasteText] = useState('');
  const [customDocTitle, setCustomDocTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string || '';
        const parsed = parseCustomEngineeringDocument(file.name, content);
        onSelectDocument(parsed);
        setIsProcessing(false);
        onClose();
      } catch (err: any) {
        setUploadError(`Failed to parse file: ${err.message || 'Unknown format'}`);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read uploaded file.');
      setIsProcessing(false);
    };

    // If text-like file
    reader.readAsText(file);
  };

  const handlePasteSubmit = () => {
    if (pasteText.trim().length < 20) {
      setUploadError('Please provide more content (at least 20 characters) for analysis.');
      return;
    }

    const title = customDocTitle.trim() || 'Custom Software Engineering Document';
    const parsed = parseCustomEngineeringDocument(title, pasteText);
    onSelectDocument(parsed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Engineering Document Analyzer</h3>
              <p className="text-xs text-slate-500">Ingest any FSD, BRD, LOC report or estimation doc to generate visual understanding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'presets' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Showcase Documents (Attached PDF)
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'upload' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload File (PDF / TXT / MD)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'paste' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Paste Specification Text
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {uploadError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-slate-600">Select a pre-analyzed engineering document to inspect its visual flowmap, user journey, FSD breakdown, and estimation workbench:</p>
              
              {/* Preset 1: The Attached PDF Document */}
              <div 
                onClick={() => {
                  onSelectDocument(SALES_FORECAST_DOCUMENT);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                  currentDocumentId === SALES_FORECAST_DOCUMENT.id
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-white hover:border-teal-500 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      ATTACHED PDF SPECIFICATION
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">16 Sep 2026</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {SALES_FORECAST_DOCUMENT.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    VB6 desktop EXE modernization assessment. 1,849 necessary LOC, 1 stored procedure with 14 recordsets, 26 active features (F-01..F-26), 4 sibling EXEs, and 550h ETA (0.64 benchmark index vs Project Calendar).
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-slate-500">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">LOC: 1,849 lines</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">SP: 14 Recordsets</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">ETA: 550 Hours</span>
                  </div>
                </div>

                <div className="shrink-0 self-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 text-white shadow-2xs group-hover:bg-teal-800">
                    <span>Load & Visualize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Preset 2: School Attendance ERP */}
              <div 
                onClick={() => {
                  // Switch to initial document ID
                  onSelectDocument({
                    ...SALES_FORECAST_DOCUMENT,
                    id: 'doc-edupulse-attendance',
                    title: 'EduPulse School Attendance & Administration ERP',
                    documentType: 'Role-Based Architecture & Governance FSD',
                    moduleName: 'Attendance Governance & Access Control Subsystem',
                    sourceScannedPath: 'EduPulse/src/AttendanceSubsystem',
                    currentStack: 'Cloud Web ERP (JWT RBAC + Scoped Access)',
                    targetModernizationStack: 'Enterprise React 19 + Node.js Microservices',
                    headlineSummary: 'Dual-role attendance management system with Administrator full governance, Teacher scoped class marking, 09:30 AM cutoff locking, and escalation override loop.'
                  });
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                  currentDocumentId === 'doc-edupulse-attendance'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-blue-500 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      FIRST TURN ARCHITECTURE
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">Academic ERP</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    EduPulse School Attendance & Administration Management System
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    School Administrator vs Teacher scoped workflows with automated 09:30 AM cutoff lockout, medical override escalation queue, and FERPA-compliant audit reports.
                  </p>
                </div>

                <div className="shrink-0 self-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-700 text-white shadow-2xs group-hover:bg-blue-800">
                    <span>Load & Visualize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".txt,.md,.json,.pdf,.csv,.doc,.docx"
                className="hidden"
              />

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-teal-500 bg-teal-50/70'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-400'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-teal-600 mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Click to select or drag and drop any document</h4>
                <p className="text-slate-500 text-xs max-w-sm mb-3">
                  Supports software engineering FSD, BRD, LOC count reports, architecture markdown, or text dumps.
                </p>
                <span className="px-3 py-1 rounded-md bg-white border border-slate-200 font-mono text-[10px] text-slate-600">
                  .PDF, .TXT, .MD, .JSON, .CSV
                </span>
              </div>

              {isProcessing && (
                <div className="text-center py-2 text-teal-700 font-semibold flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
                  <span>Parsing document structure & synthesizing visual flows...</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PASTE TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Title / System Name:</label>
                <input
                  type="text"
                  placeholder="e.g., Billing Modernization Spec / Inventory Tracking FSD"
                  value={customDocTitle}
                  onChange={(e) => setCustomDocTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Paste Raw Document Text:</label>
                <textarea
                  rows={8}
                  placeholder="Paste your software specification, LOC breakdown table, functional checklist, or architecture notes..."
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-[11px] text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handlePasteSubmit}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors shadow-2xs inline-flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze & Generate Visuals
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
          <span>Instant generation of Flowmap, Journey, FSD & PERT Estimation</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
