import React, { useState } from 'react';
import { 
  AlertOctagon, CheckCircle2, AlertTriangle, XCircle, 
  HelpCircle, Edit3, ArrowRight, Check, RefreshCw 
} from 'lucide-react';
import { Requirement } from '../types';

interface QualityAnalysisViewProps {
  requirements: Requirement[];
  onClarify: (reqId: string, action: string, customStatement?: string, issueId?: string) => Promise<any>;
}

export const QualityAnalysisView: React.FC<QualityAnalysisViewProps> = ({
  requirements,
  onClarify
}) => {
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Compute quality metrics
  let totalAmbiguities = 0;
  let totalConflicts = 0;
  let totalDuplicates = 0;
  let totalUntestable = 0;

  const requirementsWithIssues = requirements.filter(r => {
    let hasIssues = false;
    if (r.quality_issues && r.quality_issues.length > 0) {
      hasIssues = true;
      r.quality_issues.forEach(qi => {
        if (qi.issue_type === 'Ambiguity') totalAmbiguities++;
        else if (qi.issue_type === 'Conflict') totalConflicts++;
        else if (qi.issue_type === 'Duplicate') totalDuplicates++;
        else if (qi.issue_type === 'Untestable') totalUntestable++;
      });
    }
    if (r.conflicts_with && r.conflicts_with.length > 0) {
      hasIssues = true;
      totalConflicts += r.conflicts_with.length;
    }
    return hasIssues;
  });

  const handleAction = async (reqId: string, action: string, customStatement?: string, issueId?: string) => {
    try {
      await onClarify(reqId, action, customStatement, issueId);
      setActionSuccess(`Clarification applied successfully! Requirement ${reqId} updated.`);
      setEditingIssueId(null);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (e) {
      console.error('Clarification failed', e);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <AlertOctagon className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">Requirement Quality & Ambiguity Analysis</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Automated heuristic and agentic inspection detecting subjective adjectives, untestable claims, contradictory constraints, and regulatory omissions.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Ambiguities Detected</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">{totalAmbiguities}</div>
          <span className="text-[10px] text-slate-500">Subjective or unquantified SLAs</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Policy Conflicts</span>
          <div className="text-2xl font-bold text-rose-400 font-mono">{totalConflicts}</div>
          <span className="text-[10px] text-slate-500">Direct operational contradictions</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Duplicate Requirements</span>
          <div className="text-2xl font-bold text-blue-400 font-mono">{totalDuplicates}</div>
          <span className="text-[10px] text-slate-500">Overlapping security statements</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Untestable Statements</span>
          <div className="text-2xl font-bold text-purple-400 font-mono">{totalUntestable}</div>
          <span className="text-[10px] text-slate-500">Lacking acceptance criteria</span>
        </div>
      </div>

      {/* Detailed Issues List */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
          Flagged Requirements Requiring Resolution ({requirementsWithIssues.length})
        </h2>

        {requirementsWithIssues.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-200">Zero Quality Issues Detected</h3>
            <p className="text-xs text-slate-400">All requirements have quantified SLAs and verifiable acceptance criteria.</p>
          </div>
        ) : (
          requirementsWithIssues.map((req) => (
            <div 
              key={req.id}
              className="bg-slate-900/70 rounded-xl border border-slate-800 p-5 space-y-4 shadow-card-dark"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                    {req.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{req.source}</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span>Categories: {req.categories?.join(', ')}</span>
                  <span>• Priority: <strong className="text-amber-400">{req.priority}</strong></span>
                </div>
              </div>

              {/* Requirement Statement */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Statement
                </span>
                <p className="text-xs font-medium text-slate-200 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {req.statement}
                </p>
              </div>

              {/* Quality Issues */}
              {req.quality_issues?.map((qi) => (
                <div 
                  key={qi.issue_id}
                  className="bg-[#0e1726] border border-amber-500/30 p-4 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        qi.severity === 'Critical' || qi.severity === 'High' 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {qi.severity} SEVERITY
                      </span>
                      <span className="font-bold text-slate-200">{qi.issue_type}: "{qi.affected_text}"</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{qi.issue_id}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {qi.description}
                  </p>

                  <div className="p-3 bg-blue-950/20 rounded-lg border border-blue-900/30 text-xs text-blue-200 space-y-1">
                    <span className="font-semibold text-blue-400 block text-[11px]">Suggested Clarification:</span>
                    <p>{qi.suggested_clarification}</p>
                    {qi.suggested_revision && (
                      <p className="text-emerald-400 pt-1 font-mono text-[11px]">
                        <strong>Proposed Revision:</strong> "{qi.suggested_revision}"
                      </p>
                    )}
                  </div>

                  {/* Actions: Accept, Edit, Reject */}
                  {editingIssueId === qi.issue_id ? (
                    <div className="space-y-2 pt-2">
                      <textarea
                        rows={2}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                        placeholder="Write custom clarified requirement..."
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingIssueId(null)}
                          className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-xs font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'custom', editText, qi.issue_id)}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                        >
                          Apply Custom Revision
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {qi.suggested_revision && (
                        <button
                          onClick={() => handleAction(req.id, 'accept', undefined, qi.issue_id)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Suggestion</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setEditingIssueId(qi.issue_id);
                          setEditText(qi.suggested_revision || req.statement);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Suggestion</span>
                      </button>

                      <button
                        onClick={() => handleAction(req.id, 'reject', undefined, qi.issue_id)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-300 text-xs border border-slate-800 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Policy Conflict Box if applicable */}
              {req.conflicts_with && req.conflicts_with.length > 0 && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Direct Contradiction with {req.conflicts_with.join(', ')}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    This requirement conflicts directly with the operational limits defined in {req.conflicts_with.join(', ')}. Review the conflicting requirements to align policy before freezing baseline.
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
