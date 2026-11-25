import React, { useState } from 'react';
import { 
  Search, Filter, Plus, CheckSquare, ShieldAlert, AlertTriangle, 
  CheckCircle2, Clock, AlertOctagon, ExternalLink, ArrowUpDown 
} from 'lucide-react';
import { Requirement } from '../types';
import { RequirementDetailModal } from './RequirementDetailModal';

interface RequirementsViewProps {
  projectId: string;
  requirements: Requirement[];
  onCreateRequirement: (req: Partial<Requirement>) => Promise<any>;
  onUpdateRequirement: (reqId: string, updates: Partial<Requirement>) => Promise<any>;
  onClarifyRequirement: (reqId: string, action: string, customStatement?: string) => Promise<any>;
}

export const RequirementsView: React.FC<RequirementsViewProps> = ({
  projectId,
  requirements,
  onCreateRequirement,
  onUpdateRequirement,
  onClarifyRequirement
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedCompliance, setSelectedCompliance] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  const [activeReq, setActiveReq] = useState<Requirement | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStmt, setNewStmt] = useState('');
  const [newCategory, setNewCategory] = useState('Functional');
  const [newPriority, setNewPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');

  // Filter logic
  const filtered = requirements.filter(r => {
    if (selectedCategory !== 'All' && !r.categories?.includes(selectedCategory)) return false;
    if (selectedPriority !== 'All' && r.priority !== selectedPriority) return false;
    if (selectedRisk !== 'All' && r.risk_level !== selectedRisk) return false;
    if (selectedCompliance !== 'All' && r.compliance_status !== selectedCompliance) return false;
    if (selectedStatus !== 'All' && r.status !== selectedStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      const match = r.statement.toLowerCase().includes(q) ||
                    r.id.toLowerCase().includes(q) ||
                    r.source.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStmt.trim()) return;
    await onCreateRequirement({
      statement: newStmt,
      categories: [newCategory],
      priority: newPriority,
      source: 'Business Analyst Manual Input'
    });
    setNewStmt('');
    setIsAddModalOpen(false);
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Critical': return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
      case 'High': return 'text-orange-400 bg-orange-500/15 border-orange-500/30';
      case 'Medium': return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getComplianceBadge = (c: string) => {
    switch (c) {
      case 'Compliant': return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      case 'Compliance Gap': return 'text-rose-400 bg-rose-500/15 border-rose-500/30 animate-pulse';
      case 'Needs Human Review': return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      default: return 'text-blue-400 bg-blue-500/15 border-blue-500/30';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'Approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Under Clarification': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Needs Review': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-300 bg-slate-800/80 border-slate-700';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Requirements Management Center</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
              {filtered.length} of {requirements.length} Requirements
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structured IEEE-830 specification baseline with multi-label classification, RAG regulatory grounding, and confidence scores.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Requirement</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, keyword, stakeholder, or regulatory term..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 text-slate-200 text-xs rounded-lg focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Functional">Functional</option>
              <option value="Security">Security</option>
              <option value="Regulatory">Regulatory</option>
              <option value="Privacy">Privacy</option>
              <option value="Performance">Performance</option>
              <option value="Audit">Audit</option>
              <option value="Integration">Integration</option>
            </select>

            {/* Priority */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Compliance */}
            <select
              value={selectedCompliance}
              onChange={(e) => setSelectedCompliance(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Compliance</option>
              <option value="Compliant">Compliant</option>
              <option value="Compliance Gap">Compliance Gap</option>
              <option value="Needs Human Review">Needs Review</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Under Clarification">Under Clarification</option>
              <option value="Needs Review">Needs Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requirements Data Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-card-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold w-28">ID</th>
                <th className="py-3 px-4 font-semibold">Requirement Statement</th>
                <th className="py-3 px-4 font-semibold w-32">Type</th>
                <th className="py-3 px-4 font-semibold w-24">Priority</th>
                <th className="py-3 px-4 font-semibold w-24">Risk</th>
                <th className="py-3 px-4 font-semibold w-32">Compliance</th>
                <th className="py-3 px-4 font-semibold w-32">Status</th>
                <th className="py-3 px-4 font-semibold w-20">Conf.</th>
                <th className="py-3 px-4 font-semibold w-24 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setActiveReq(req)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                    {req.id}
                  </td>

                  {/* Statement */}
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="text-slate-200 font-medium line-clamp-2 leading-relaxed">
                      {req.statement}
                    </div>
                    {req.quality_issues && req.quality_issues.length > 0 && (
                      <div className="flex items-center space-x-1.5 text-amber-400 text-[10px] mt-1">
                        <AlertOctagon className="w-3 h-3 flex-shrink-0" />
                        <span>{req.quality_issues.length} quality issue(s) detected</span>
                      </div>
                    )}
                    {req.conflicts_with && req.conflicts_with.length > 0 && (
                      <div className="flex items-center space-x-1.5 text-rose-400 text-[10px] mt-0.5">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        <span>Conflicts with {req.conflicts_with.join(', ')}</span>
                      </div>
                    )}
                  </td>

                  {/* Categories */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {req.categories?.slice(0, 2).map((c, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getPriorityBadge(req.priority)}`}>
                      {req.priority}
                    </span>
                  </td>

                  {/* Risk */}
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-semibold ${
                      req.risk_level === 'Critical' ? 'text-rose-400' :
                      req.risk_level === 'High' ? 'text-orange-400' :
                      req.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {req.risk_level}
                    </span>
                  </td>

                  {/* Compliance */}
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-medium ${getComplianceBadge(req.compliance_status)}`}>
                      {req.compliance_status}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </td>

                  {/* Confidence */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {Math.round(req.confidence * 100)}%
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform inline-block">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <RequirementDetailModal
        requirement={activeReq}
        onClose={() => setActiveReq(null)}
        onClarify={async (action, customStmt) => {
          if (activeReq) {
            await onClarifyRequirement(activeReq.id, action, customStmt);
            setActiveReq(null);
          }
        }}
        onApprove={async () => {
          if (activeReq) {
            await onUpdateRequirement(activeReq.id, { approval_status: 'Approved' });
            setActiveReq({ ...activeReq, approval_status: 'Approved', status: 'Approved' });
          }
        }}
      />

      {/* Add Requirement Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1622] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-card-dark">
            <h2 className="text-base font-bold text-white">Add New Requirement</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Requirement Statement (IEEE 830)</label>
                <textarea
                  rows={3}
                  value={newStmt}
                  onChange={(e) => setNewStmt(e.target.value)}
                  placeholder="The system shall allow..."
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Functional">Functional</option>
                    <option value="Security">Security</option>
                    <option value="Regulatory">Regulatory</option>
                    <option value="Privacy">Privacy</option>
                    <option value="Performance">Performance</option>
                    <option value="Audit">Audit</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm"
                >
                  Save Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
