import React from 'react';
import { 
  X, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, 
  FileText, ExternalLink, Clock, User, Link as LinkIcon, Sparkles 
} from 'lucide-react';
import { Requirement } from '../types';

interface RequirementDetailModalProps {
  requirement: Requirement | null;
  onClose: () => void;
  onClarify?: (action: string, customStatement?: string) => void;
  onApprove?: () => void;
}

export const RequirementDetailModal: React.FC<RequirementDetailModalProps> = ({
  requirement,
  onClose,
  onClarify,
  onApprove
}) => {
  if (!requirement) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b1622] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-card-dark overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
              {requirement.id}
            </span>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold ${
                requirement.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                requirement.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-slate-800 text-slate-300'
              }`}>
                {requirement.priority} Priority
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Confidence: {Math.round(requirement.confidence * 100)}%
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Statement Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Formal Requirement Statement (IEEE 830)
            </span>
            <p className="text-sm font-medium text-white leading-relaxed">
              {requirement.statement}
            </p>
          </div>

          {/* Original Stakeholder Elicitation Quote */}
          {requirement.original_stakeholder_statement && (
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-800/30 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>Original Stakeholder Statement</span>
              </span>
              <p className="text-xs text-blue-200/90 italic">
                "{requirement.original_stakeholder_statement}"
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                Source: {requirement.source} ({requirement.source_document || 'Session Notes'})
              </div>
            </div>
          )}

          {/* Quality Issues / Ambiguities Banner */}
          {requirement.quality_issues && requirement.quality_issues.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <AlertOctagon className="w-4 h-4" />
                <span className="font-bold text-xs">Quality Issues Detected ({requirement.quality_issues.length})</span>
              </div>
              {requirement.quality_issues.map((qi) => (
                <div key={qi.issue_id} className="p-3 bg-slate-900/80 rounded-lg border border-amber-500/20 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-amber-300">{qi.issue_type}: {qi.affected_text}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">{qi.severity}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{qi.description}</p>
                  <p className="text-[11px] text-blue-300 font-medium">Suggested Action: {qi.suggested_clarification}</p>
                  {qi.suggested_revision && (
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-400 font-mono">Revision: "{qi.suggested_revision}"</span>
                      {onClarify && (
                        <button
                          onClick={() => onClarify('accept')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] transition-colors"
                        >
                          Accept Suggestion
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Conflicts Detected */}
          {requirement.conflicts_with && requirement.conflicts_with.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1 text-rose-300">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="font-bold">Contradicts Requirements:</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Conflicts directly with <strong className="text-rose-400">{requirement.conflicts_with.join(', ')}</strong>. Please review in Quality Analysis tab to resolve policy constraints.
              </p>
            </div>
          )}

          {/* RAG Retrieved Regulatory Evidence */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>RAG Regulatory Evidence Citation</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                requirement.compliance_status === 'Compliant' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                requirement.compliance_status === 'Compliance Gap' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                'bg-slate-800 text-slate-300'
              }`}>
                {requirement.compliance_status}
              </span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono leading-relaxed">
              "{requirement.rag_evidence || 'No direct evidence chunk retrieved.'}"
            </div>

            <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-1">
              <span className="font-semibold text-slate-300">Source:</span>
              <span className="text-blue-400">{requirement.rag_source_citation || 'Internal Policy Manual'}</span>
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Acceptance Criteria (Gherkin / Testable)
            </span>
            <div className="space-y-1.5">
              {requirement.acceptance_criteria && requirement.acceptance_criteria.length > 0 ? (
                requirement.acceptance_criteria.map((ac, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200">{ac}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">No acceptance criteria defined yet.</p>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-500 block">Categories</span>
              <span className="text-slate-200 font-medium">{requirement.categories?.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Risk Level</span>
              <span className={`font-semibold ${
                requirement.risk_level === 'Critical' ? 'text-rose-400' :
                requirement.risk_level === 'High' ? 'text-orange-400' :
                requirement.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
              }`}>{requirement.risk_level}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Approval Status</span>
              <span className={`font-semibold ${
                requirement.approval_status === 'Approved' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {requirement.approval_status} {requirement.approved_by && `(${requirement.approved_by})`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Last Updated</span>
              <span className="text-slate-400 font-mono">
                {new Date(requirement.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            ID: {requirement.id} • Grounded in FTC GLBA & CFPB Reg Z
          </div>

          <div className="flex items-center space-x-2">
            {onApprove && requirement.approval_status !== 'Approved' && (
              <button
                onClick={onApprove}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Approve Requirement
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
