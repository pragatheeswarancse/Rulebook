import React, { useState } from 'react';
import { FSD_METADATA, FSD_API_ENDPOINTS, FSD_DATABASE_ENTITIES, FSD_BUSINESS_RULES } from '../data/fsdData';
import { 
  BookOpen, 
  Terminal, 
  Database, 
  ShieldCheck, 
  Check, 
  Copy, 
  Search, 
  Server, 
  Layers, 
  Lock, 
  Clock, 
  FileCheck
} from 'lucide-react';

export const FsdView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'apis' | 'database' | 'rules' | 'nfr'>('overview');
  const [apiSearch, setApiSearch] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const filteredApis = FSD_API_ENDPOINTS.filter(
    (api) =>
      api.name.toLowerCase().includes(apiSearch.toLowerCase()) ||
      api.endpoint.toLowerCase().includes(apiSearch.toLowerCase()) ||
      api.module.toLowerCase().includes(apiSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Document Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {FSD_METADATA.documentId}
              </span>
              <span className="text-xs text-slate-500 font-mono">v{FSD_METADATA.version}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{FSD_METADATA.title}</h1>
            <p className="text-xs text-slate-600 mt-1">{FSD_METADATA.subTitle}</p>
          </div>

          <div className="flex flex-col sm:items-end text-xs text-slate-500 space-y-1">
            <div><strong className="text-slate-700">Standards:</strong> {FSD_METADATA.complianceStandards}</div>
            <div><strong className="text-slate-700">Author:</strong> {FSD_METADATA.author}</div>
            <div><strong className="text-slate-700">Last Reviewed:</strong> {FSD_METADATA.lastUpdated}</div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeSection === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            1. System Architecture & Topology
          </button>
          <button
            onClick={() => setActiveSection('apis')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeSection === 'apis'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            2. REST API Specifications ({FSD_API_ENDPOINTS.length})
          </button>
          <button
            onClick={() => setActiveSection('database')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeSection === 'database'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            3. Database Schema & Data Dictionary ({FSD_DATABASE_ENTITIES.length})
          </button>
          <button
            onClick={() => setActiveSection('rules')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeSection === 'rules'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            4. Business Logic & Lockout Rules
          </button>
          <button
            onClick={() => setActiveSection('nfr')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeSection === 'nfr'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            5. Non-Functional Requirements (NFRs)
          </button>
        </div>
      </div>

      {/* SECTION 1: ARCHITECTURE OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">1. Architectural Topology & Service Boundaries</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              EduPulse is built on a high-concurrency micro-modular architecture designed to withstand 8:00–9:30 AM morning roll-call bursts.
              It couples stateless API services with high-durability relational persistence and Redis in-memory pub/sub channels.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider">
                  <Server className="w-4 h-4 text-teal-600" />
                  Presentation Layer
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• React 19 SPA with Tailwind CSS v4</li>
                  <li>• Scoped role-driven views (Admin vs Teacher)</li>
                  <li>• Offline-ready IndexedDB synchronization queue</li>
                  <li>• WebSocket push client for instant override alerts</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Application & Gateway Layer
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Node.js / Express API Gateway with JWT verify</li>
                  <li>• Argon2id password hashing + TOTP MFA engine</li>
                  <li>• Automated 09:30 AM Cutoff Lockout worker</li>
                  <li>• Override ticket state-machine with row locking</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wider">
                  <Database className="w-4 h-4 text-purple-600" />
                  Persistence & Caching Tier
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• PostgreSQL Relational Database with strict FKs</li>
                  <li>• Redis Cache for school-wide KPI aggregates</li>
                  <li>• Append-only SHA-256 cryptographic audit logs</li>
                  <li>• Hot replication with automated point-in-time recovery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: REST API SPECIFICATIONS */}
      {activeSection === 'apis' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search endpoints by path or module..."
                value={apiSearch}
                onChange={(e) => setApiSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <span className="text-xs font-mono text-slate-500">{filteredApis.length} Endpoints Documented</span>
          </div>

          <div className="space-y-4">
            {filteredApis.map((api, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      api.method === 'POST' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      api.method === 'GET' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      api.method === 'PATCH' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {api.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900">{api.endpoint}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs text-slate-600 font-medium">{api.name}</span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {api.securityScope}
                  </span>
                </div>

                <div className="p-5 space-y-4 text-xs">
                  <p className="text-slate-700 leading-relaxed">{api.description}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {api.requestBody && (
                      <div className="rounded-lg border border-slate-800 bg-slate-900 text-slate-100 overflow-hidden font-mono">
                        <div className="px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 flex items-center justify-between uppercase">
                          <span>Request Payload Schema</span>
                          <button
                            onClick={() => copyToClipboard(api.requestBody || '', `req-${idx}`)}
                            className="hover:text-white flex items-center gap-1"
                          >
                            {copiedEndpoint === `req-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedEndpoint === `req-${idx}` ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="p-3 text-[11px] overflow-x-auto max-h-48 leading-relaxed text-slate-300">
                          {api.requestBody}
                        </pre>
                      </div>
                    )}

                    <div className="rounded-lg border border-slate-800 bg-slate-900 text-slate-100 overflow-hidden font-mono">
                      <div className="px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-[10px] text-emerald-400 flex items-center justify-between uppercase">
                        <span>Success Response Schema (200 OK)</span>
                        <button
                          onClick={() => copyToClipboard(api.responseBody, `res-${idx}`)}
                          className="hover:text-white flex items-center gap-1 text-slate-400"
                        >
                          {copiedEndpoint === `res-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedEndpoint === `res-${idx}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-3 text-[11px] overflow-x-auto max-h-48 leading-relaxed text-emerald-300/90">
                        {api.responseBody}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Payload Validation & Constraints:</span>
                    <ul className="space-y-1 text-slate-600">
                      {api.validationRules.map((val, vIdx) => (
                        <li key={vIdx} className="flex items-center gap-1.5">
                          <span className="text-teal-600 font-bold">›</span>
                          <span>{val}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: DATABASE SCHEMA & DATA DICTIONARY */}
      {activeSection === 'database' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">Relational Database Entity Schema (PostgreSQL)</h3>
            <p className="text-xs text-slate-600 mb-6">
              Normalized relational structures enforcing referential integrity, row-level access control, and cryptographic audit logging.
            </p>

            <div className="space-y-6">
              {FSD_DATABASE_ENTITIES.map((entity, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="p-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-teal-700" />
                      <span className="font-mono text-sm font-bold text-slate-900">{entity.tableName}</span>
                    </div>
                    <span className="text-xs text-slate-600 italic">{entity.description}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-4">Column Name</th>
                          <th className="py-2.5 px-4">Type</th>
                          <th className="py-2.5 px-4">Constraints</th>
                          <th className="py-2.5 px-4">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {entity.columns.map((col, cIdx) => (
                          <tr key={cIdx} className="hover:bg-slate-50/70">
                            <td className="py-2 px-4 font-mono font-semibold text-slate-800">
                              {col.name}
                            </td>
                            <td className="py-2 px-4 font-mono text-slate-600">
                              {col.type}
                            </td>
                            <td className="py-2 px-4 font-mono">
                              {col.isPrimary && (
                                <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded mr-1">PRIMARY KEY</span>
                              )}
                              {col.isForeign && (
                                <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded mr-1">FOREIGN KEY</span>
                              )}
                              {!col.nullable ? (
                                <span className="text-slate-500">NOT NULL</span>
                              ) : (
                                <span className="text-slate-400">NULLABLE</span>
                              )}
                            </td>
                            <td className="py-2 px-4 text-slate-600">
                              {col.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-200 font-mono text-[11px] text-slate-600 flex flex-wrap gap-3">
                    <span className="font-semibold text-slate-500 uppercase font-sans">Indices:</span>
                    {entity.indices.map((ind, iIdx) => (
                      <code key={iIdx} className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        {ind}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: BUSINESS LOGIC & LOCKOUT RULES */}
      {activeSection === 'rules' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Core Business Rules & Cutoff Logic Engine</h3>
            <p className="text-xs text-slate-600">
              The platform implements hard automated business invariant rules to maintain legal compliance, child safety, and audit defense.
            </p>

            <div className="space-y-3 pt-2">
              {FSD_BUSINESS_RULES.map((rule, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono text-xs font-bold">
                      {rule.ruleCode}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{rule.title}</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed pl-1">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: NON-FUNCTIONAL REQUIREMENTS */}
      {activeSection === 'nfr' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Non-Functional Requirements (NFRs)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider block">Performance & Latency</span>
                <ul className="space-y-1 text-slate-600">
                  <li>• 95th percentile API response time &lt; 200ms during 08:30–09:30 AM morning peak.</li>
                  <li>• Bulk attendance submission payload processing &lt; 150ms for 40-student classroom rosters.</li>
                  <li>• Dashboard KPI aggregate caching in Redis refreshed asynchronously every 30 seconds.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider block">Availability & Fault Tolerance</span>
                <ul className="space-y-1 text-slate-600">
                  <li>• 99.9% uptime SLA during school operational days (Mon-Fri 06:00 to 18:00 local).</li>
                  <li>• Offline client queue preserves attendance markings if local school Wi-Fi drops.</li>
                  <li>• Automated database snapshots every 6 hours with 30-day retention and point-in-time recovery.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider block">Security & Cryptography</span>
                <ul className="space-y-1 text-slate-600">
                  <li>• All data encrypted in-transit (TLS 1.3) and at-rest (AES-256).</li>
                  <li>• Password storage using Argon2id with memory-hard parameters.</li>
                  <li>• Scoped JWT access tokens expired after 15 minutes; HttpOnly secure refresh cookies.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider block">Regulatory & Compliance</span>
                <ul className="space-y-1 text-slate-600">
                  <li>• Fully compliant with Family Educational Rights and Privacy Act (FERPA).</li>
                  <li>• COPPA compliant: Zero behavioral telemetry or third-party ad tracking.</li>
                  <li>• Immutable audit records retained for 7 years as mandated by state education board.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
