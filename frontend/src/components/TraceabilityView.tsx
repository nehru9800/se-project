import React, { useState } from 'react';
import { 
  Network, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, 
  ExternalLink, Layers, Search, Cpu 
} from 'lucide-react';
import { TraceabilityGraph, TraceabilityItem } from '../types';

interface TraceabilityViewProps {
  traceability: TraceabilityGraph | null;
}

export const TraceabilityView: React.FC<TraceabilityViewProps> = ({ traceability }) => {
  const [selectedItem, setSelectedItem] = useState<TraceabilityItem | null>(null);
  const [search, setSearch] = useState('');

  if (!traceability) {
    return <div className="p-8 text-center text-slate-400">Loading Traceability Matrix...</div>;
  }

  const filteredItems = traceability.items.filter(item => {
    if (!search) return true;
    const q = search.toLowerCase();
    return item.requirement_id.toLowerCase().includes(q) ||
           item.requirement_statement.toLowerCase().includes(q) ||
           (item.compliance_control_id && item.compliance_control_id.toLowerCase().includes(q)) ||
           (item.risk_id && item.risk_id.toLowerCase().includes(q));
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">End-to-End Bidirectional Traceability Graph</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {traceability.total_coverage_percentage}% Coverage Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Auditable linkage proving every stakeholder statement maps to requirements, acceptance tests, risks, compliance controls, and SDLC phases.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search traceability chains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Visual Chain Progression Ribbon */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[750px] text-[10px] font-mono uppercase text-slate-400 font-semibold px-2">
          <span>01. Stakeholder Statement</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span>02. Formal Requirement</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span>03. Acceptance Test</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span>04. Risk Mitigation</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span>05. Regulatory Control</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span>06. SDLC Phase</span>
        </div>
      </div>

      {/* Traceability Chains Grid */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-xl p-5 cursor-pointer transition-all space-y-4 shadow-card-dark"
          >
            {/* Top row */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/30">
                  {item.requirement_id}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {item.requirement_statement}
                </span>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {item.verification_status}
              </span>
            </div>

            {/* Linear Trace Flow Columns */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              {/* Elicitation Quote */}
              <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Stakeholder Origin</span>
                <p className="text-slate-300 italic text-[11px] line-clamp-2">
                  "{item.stakeholder_statement}"
                </p>
              </div>

              {/* Acceptance Criteria */}
              <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Acceptance Criteria</span>
                <p className="text-blue-300 text-[11px] line-clamp-2">
                  {item.acceptance_criteria[0] || 'Criteria defined'}
                </p>
              </div>

              {/* Risk Link */}
              <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Associated Risk</span>
                <div className="font-mono text-orange-400 font-bold text-[11px]">{item.risk_id}</div>
                <p className="text-slate-400 text-[10px] truncate">{item.risk_title}</p>
              </div>

              {/* Compliance & Security */}
              <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Compliance & Security</span>
                <div className="font-mono text-purple-400 font-bold text-[11px]">{item.compliance_control_id}</div>
                <p className="text-slate-400 text-[10px] truncate">{item.security_control}</p>
              </div>

              {/* Test Case & SDLC Phase */}
              <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">SDLC Verification</span>
                <div className="font-mono text-emerald-400 font-bold text-[11px]">{item.test_case_id}</div>
                <p className="text-slate-400 text-[10px] truncate">{item.sdlc_phase}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1622] border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-card-dark text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-white font-mono">
                Bidirectional Traceability Chain: {selectedItem.requirement_id}
              </span>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="font-mono text-[10px] text-slate-500 uppercase">1. Stakeholder Elicitation Statement</span>
                <p className="text-slate-200 italic">"{selectedItem.stakeholder_statement}"</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="font-mono text-[10px] text-slate-500 uppercase">2. Formal Requirement Specification</span>
                <p className="text-blue-300 font-semibold">{selectedItem.requirement_statement}</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="font-mono text-[10px] text-slate-500 uppercase">3. Automated Test Suite</span>
                <p className="text-emerald-300 font-mono">{selectedItem.test_case_id}: {selectedItem.test_case_title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-mono text-[10px] text-slate-500 uppercase">4. Risk Register Link</span>
                  <p className="text-orange-400 font-mono">{selectedItem.risk_id} ({selectedItem.risk_title})</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-mono text-[10px] text-slate-500 uppercase">5. Regulatory Control Grounding</span>
                  <p className="text-purple-400 font-mono">{selectedItem.compliance_control_id} ({selectedItem.compliance_control_title})</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
              >
                Close Trace Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
