import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertCircle, FileText, CheckCircle2, 
  ExternalLink, ChevronDown, ChevronRight, Lock, Check, X 
} from 'lucide-react';
import { ComplianceReport, ComplianceMapping, UserRole } from '../types';

interface ComplianceViewProps {
  compliance: ComplianceReport | null;
  currentRole: UserRole;
  onApproveMapping: (mappingId: string, officerName: string, decision: string, notes?: string) => Promise<any>;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  compliance,
  currentRole,
  onApproveMapping
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedMapping, setSelectedMapping] = useState<ComplianceMapping | null>(null);
  const [signoffNotes, setSignoffNotes] = useState('');
  const [isSignoffModalOpen, setIsSignoffModalOpen] = useState(false);
  const [signoffSuccess, setSignoffSuccess] = useState<string | null>(null);

  if (!compliance) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading Compliance Matrix...
      </div>
    );
  }

  const handleOpenSignoff = (m: ComplianceMapping) => {
    setSelectedMapping(m);
    setSignoffNotes(m.compliance_gap_notes || '');
    setIsSignoffModalOpen(true);
  };

  const handleSignoffDecision = async (decision: 'Approved' | 'Rejected') => {
    if (!selectedMapping) return;
    try {
      await onApproveMapping(selectedMapping.id, 'Compliance Officer (Elena Rostova)', decision, signoffNotes);
      setSignoffSuccess(`Compliance determination ${decision.toLowerCase()} for ${selectedMapping.control_id}`);
      setIsSignoffModalOpen(false);
      setTimeout(() => setSignoffSuccess(null), 3500);
    } catch (e) {
      console.error('Signoff failed', e);
    }
  };

  const isComplianceOfficer = currentRole === 'Compliance Officer' || currentRole === 'Administrator';

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Regulatory Compliance Matrix (RAG-Grounded)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Verifiable Citations
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded against FTC GLBA Safeguards (16 CFR Part 314), CFPB Regulation Z (12 CFR Part 1026), SOX 404, and PCI-DSS v4.0.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Current Role:</span>
          <span className={`px-2 py-0.5 rounded border font-semibold ${
            isComplianceOfficer ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}>
            {currentRole}
          </span>
        </div>
      </div>

      {signoffSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{signoffSuccess}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Mapped Controls</span>
          <div className="text-2xl font-bold text-white font-mono">{compliance.total_controls}</div>
          <span className="text-[10px] text-slate-500">Statutory & corporate checks</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Compliant</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{compliance.compliant_count}</div>
          <span className="text-[10px] text-emerald-400/80">Full evidence grounding</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Compliance Gaps</span>
          <div className="text-2xl font-bold text-rose-400 font-mono">{compliance.gap_count}</div>
          <span className="text-[10px] text-rose-400/80">Action required (FFIEC)</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Pending Review</span>
          <div className="text-2xl font-bold text-purple-400 font-mono">{compliance.pending_approval_count}</div>
          <span className="text-[10px] text-purple-400/80">Officer signoff required</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-card-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold w-10"></th>
                <th className="py-3 px-4 font-semibold w-28">Req ID</th>
                <th className="py-3 px-4 font-semibold">Regulation & Control</th>
                <th className="py-3 px-4 font-semibold">Grounded Evidence Citation</th>
                <th className="py-3 px-4 font-semibold w-32">Status</th>
                <th className="py-3 px-4 font-semibold w-20">Conf.</th>
                <th className="py-3 px-4 font-semibold w-28 text-right">Signoff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {compliance.mappings.map((m) => {
                const isExpanded = expandedId === m.id;
                return (
                  <React.Fragment key={m.id}>
                    <tr 
                      onClick={() => setExpandedId(isExpanded ? null : m.id)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 text-slate-500">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                        {m.requirement_id}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-200">{m.regulation_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{m.control_id}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="text-slate-300 italic text-[11px] line-clamp-2">
                          "{m.evidence_quote}"
                        </div>
                        <div className="text-[10px] text-blue-400 font-mono mt-0.5">
                          {m.source_document} • {m.section}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                          m.status === 'Compliant' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                          m.status === 'Compliance Gap' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse' :
                          'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {Math.round(m.confidence * 100)}%
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenSignoff(m)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            m.approval_status === 'Approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40'
                          }`}
                        >
                          {m.approval_status === 'Approved' ? 'Signed Off' : 'Review'}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr className="bg-slate-950/80">
                        <td colSpan={7} className="p-4 space-y-3 border-t border-slate-800">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                                Verbatim Statutory Citation (Non-Fabricated)
                              </span>
                              <p className="text-slate-200 font-mono leading-relaxed text-[11px]">
                                "{m.evidence_quote}"
                              </p>
                              <div className="text-[10px] text-slate-400 pt-1 font-mono">
                                Jurisdiction: {m.jurisdiction} • Effective Date: {m.effective_date}
                              </div>
                            </div>

                            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                                Compliance Gap Assessment & Notes
                              </span>
                              <p className="text-slate-300 text-[11px] leading-relaxed">
                                {m.compliance_gap_notes || 'Requirement matches regulatory control without variance.'}
                              </p>
                              <div className="text-[10px] text-purple-400 pt-1 font-mono">
                                Approver: {m.approved_by || 'Awaiting Compliance Officer Review'}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Officer Signoff Modal */}
      {isSignoffModalOpen && selectedMapping && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1622] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-card-dark text-xs">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span>Compliance Officer Signoff Protocol</span>
            </h2>

            <div className="space-y-2 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="font-semibold text-slate-200">{selectedMapping.regulation_name}</div>
              <div className="text-blue-400 font-mono text-[11px]">{selectedMapping.control_id}</div>
              <p className="text-slate-300 text-[11px] italic">"{selectedMapping.evidence_quote}"</p>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Compliance Officer Interpretation & Rationale
              </label>
              <textarea
                rows={3}
                value={signoffNotes}
                onChange={(e) => setSignoffNotes(e.target.value)}
                placeholder="Enter regulatory interpretation, legal precedents, or required compensating controls..."
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsSignoffModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSignoffDecision('Rejected')}
                className="px-4 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-semibold"
              >
                Reject Interpretation
              </button>
              <button
                onClick={() => handleSignoffDecision('Approved')}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-glow-sm"
              >
                Sign Off & Authorize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
