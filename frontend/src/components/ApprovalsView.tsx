import React, { useState } from 'react';
import { 
  CheckCircle, Clock, AlertTriangle, Check, X, Edit, 
  UserCheck, ShieldCheck, Filter, AlertOctagon 
} from 'lucide-react';
import { ApprovalRequest, UserRole } from '../types';

interface ApprovalsViewProps {
  approvals: ApprovalRequest[];
  currentRole: UserRole;
  onRecordAction: (approvalId: string, decision: string, notes: string, actorName: string, actorRole: string) => Promise<any>;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  approvals,
  currentRole,
  onRecordAction
}) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Pending');
  const [activeApproval, setActiveApproval] = useState<ApprovalRequest | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionType, setActionType] = useState<string>('Approved');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filteredApprovals = approvals.filter(a => {
    if (selectedRoleFilter !== 'All' && a.target_role !== selectedRoleFilter) return false;
    if (selectedStatusFilter !== 'All' && a.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleOpenAction = (approval: ApprovalRequest, decision: string) => {
    setActiveApproval(approval);
    setActionType(decision);
    setActionNotes('');
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!activeApproval) return;
    try {
      await onRecordAction(
        activeApproval.id,
        actionType,
        actionNotes,
        `Authorized Officer (${currentRole})`,
        currentRole
      );
      setSuccessMsg(`Decision '${actionType}' recorded for ${activeApproval.title}`);
      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e) {
      console.error('Failed to record approval action', e);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Human-in-the-Loop Governance & Approvals</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30">
              Role-Gated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mandatory human authorization gates for regulatory determinations, high-risk security exceptions, and SDLC model selection.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3 text-xs">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Decision</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Changes Requested">Changes Requested</option>
          </select>

          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Target Roles</option>
            <option value="Compliance Officer">Compliance Officer</option>
            <option value="Security Officer">Security Officer</option>
            <option value="Risk Manager">Risk Manager</option>
            <option value="Project Manager">Project Manager</option>
          </select>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-200">No Approvals Pending in Queue</h3>
            <p className="text-xs text-slate-400">All required governance gates have been signed off for the selected filters.</p>
          </div>
        ) : (
          filteredApprovals.map((appr) => {
            const isPending = appr.status === 'Pending';
            return (
              <div 
                key={appr.id}
                className="bg-slate-900/70 rounded-xl border border-slate-800 p-5 space-y-3 shadow-card-dark"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/30">
                      {appr.item_type}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{appr.title}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-400 font-mono">Target Role: <strong className="text-blue-400">{appr.target_role}</strong></span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                      appr.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      appr.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {appr.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {appr.description}
                </p>

                {appr.decision_notes && (
                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
                    <span className="font-bold text-slate-300 block text-[11px]">Decision Notes ({appr.decided_by}):</span>
                    "{appr.decision_notes}"
                  </div>
                )}

                {/* Action Buttons */}
                {isPending && (
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleOpenAction(appr, 'Approved')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(appr, 'Changes Requested')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(appr, 'Rejected')}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs border border-rose-500/40 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Action Dialog Modal */}
      {isModalOpen && activeApproval && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1622] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-card-dark text-xs">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-blue-400" />
              <span>Record Official Governance Decision</span>
            </h2>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200">{activeApproval.title}</span>
              <p className="text-slate-400 text-[11px]">{activeApproval.description}</p>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Enter Decision Rationale & Audit Comments:
              </label>
              <textarea
                rows={3}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="State regulatory justification, risk acceptance arguments, or required engineering changes..."
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-lg text-white font-semibold shadow-glow-sm ${
                  actionType === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-500' :
                  actionType === 'Rejected' ? 'bg-rose-600 hover:bg-rose-500' :
                  'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                Confirm {actionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
