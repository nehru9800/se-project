import React, { useState } from 'react';
import { History, Search, Filter, ShieldCheck, Download, Clock } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditLogsViewProps {
  auditLogs: AuditLogEntry[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = auditLogs.filter(log => {
    if (roleFilter !== 'All' && log.user_role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return log.action.toLowerCase().includes(q) ||
             log.user_name.toLowerCase().includes(q) ||
             (log.agent_name && log.agent_name.toLowerCase().includes(q)) ||
             (log.output_summary && log.output_summary.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">System Audit Trail & Compliance Log</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Immutable
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete cryptographic audit trail recording every agent execution, regulatory citation, quality clarification, and human governance decision.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search actions, agents, actors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="AI System">AI Multi-Agent Engine</option>
            <option value="Business Analyst">Business Analyst</option>
            <option value="Compliance Officer">Compliance Officer</option>
            <option value="Security Officer">Security Officer</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Stakeholder">Stakeholder</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-card-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold w-20">Log ID</th>
                <th className="py-3 px-4 font-semibold w-36">Timestamp</th>
                <th className="py-3 px-4 font-semibold w-36">Actor & Role</th>
                <th className="py-3 px-4 font-semibold w-36">Agent</th>
                <th className="py-3 px-4 font-semibold w-40">Action</th>
                <th className="py-3 px-4 font-semibold">Execution Summary & Citations</th>
                <th className="py-3 px-4 font-semibold w-24">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400 whitespace-nowrap">
                    {log.id}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-200">{log.user_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.user_role}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {log.agent_name ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {log.agent_name}
                      </span>
                    ) : (
                      <span className="text-slate-600 font-mono text-[10px]">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-200 whitespace-nowrap">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-4 max-w-md space-y-1">
                    {log.output_summary && (
                      <p className="text-slate-300 leading-relaxed text-[11px]">{log.output_summary}</p>
                    )}
                    {log.input_summary && (
                      <p className="text-slate-500 text-[10px] italic">Input: "{log.input_summary}"</p>
                    )}
                    {log.retrieved_sources && (
                      <div className="text-[10px] text-purple-400 font-mono">
                        Source Citation: {log.retrieved_sources}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {log.decision ? (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                        log.decision === 'Approved' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                        log.decision === 'Rejected' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                        'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      }`}>
                        {log.decision}
                      </span>
                    ) : (
                      <span className="text-slate-600 font-mono text-[10px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
