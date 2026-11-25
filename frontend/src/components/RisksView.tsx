import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldAlert, ArrowUpRight, CheckCircle2, 
  Filter, HelpCircle, Layers, ShieldCheck 
} from 'lucide-react';
import { RiskSummary, RiskItem } from '../types';

interface RisksViewProps {
  risks: RiskSummary | null;
}

export const RisksView: React.FC<RisksViewProps> = ({ risks }) => {
  const [selectedCell, setSelectedCell] = useState<{ l: number; i: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!risks) {
    return <div className="p-8 text-center text-slate-400">Loading Risk Register...</div>;
  }

  // Filter risks by cell and category
  const filteredRisks = risks.risks.filter(r => {
    if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
    if (selectedCell && (r.likelihood !== selectedCell.l || r.impact !== selectedCell.i)) return false;
    return true;
  });

  const getHeatmapColor = (l: number, i: number) => {
    const score = l * i;
    if (score >= 15) return 'bg-rose-950/70 border-rose-600/50 text-rose-300 hover:bg-rose-900/80';
    if (score >= 10) return 'bg-orange-950/70 border-orange-600/50 text-orange-300 hover:bg-orange-900/80';
    if (score >= 5) return 'bg-amber-950/70 border-amber-600/50 text-amber-300 hover:bg-amber-900/80';
    return 'bg-emerald-950/70 border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/80';
  };

  const getSeverityBadge = (s: string) => {
    switch (s) {
      case 'Critical': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Risk Register & 5x5 Heatmap Matrix</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30">
              Severity Scored (1-25)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Systemic evaluation of financial, operational, compliance, and cyber risks linked directly to software requirements.
          </p>
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Risk Categories</option>
          <option value="Security">Security Risks</option>
          <option value="Compliance">Compliance Risks</option>
          <option value="Technical">Technical Risks</option>
          <option value="Business">Business Risks</option>
          <option value="Operational">Operational Risks</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Risks</span>
          <div className="text-2xl font-bold text-white font-mono">{risks.total_risks}</div>
          <span className="text-[10px] text-slate-500">Evaluated across all squads</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Critical Severity</span>
          <div className="text-2xl font-bold text-rose-400 font-mono">{risks.critical_count}</div>
          <span className="text-[10px] text-rose-400/80">Score &ge; 16 (Immediate action)</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">High Severity</span>
          <div className="text-2xl font-bold text-orange-400 font-mono">{risks.high_count}</div>
          <span className="text-[10px] text-orange-400/80">Score 10-15</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Medium Severity</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">{risks.medium_count}</div>
          <span className="text-[10px] text-amber-400/80">Score 5-9</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Overall Exposure</span>
          <div className="text-2xl font-bold text-blue-400 font-mono">{risks.risk_score}/100</div>
          <span className="text-[10px] text-blue-400/80">Normalized risk index</span>
        </div>
      </div>

      {/* 5x5 Heatmap Matrix */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-card-dark">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
              5x5 Interactive Risk Matrix (Likelihood vs Impact)
            </h2>
            <p className="text-xs text-slate-400">
              Click any cell to filter the Risk Register table below. Likelihood (1-5) on vertical axis, Impact (1-5) on horizontal axis.
            </p>
          </div>
          {selectedCell && (
            <button
              onClick={() => setSelectedCell(null)}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono underline"
            >
              Reset Matrix Filter
            </button>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl space-y-2">
            {/* Rows from Likelihood 5 down to 1 */}
            {[5, 4, 3, 2, 1].map((l) => (
              <div key={l} className="flex items-center space-x-2">
                <span className="w-20 text-[11px] font-mono text-slate-400 text-right pr-2">
                  L{l} {l === 5 ? '(Certain)' : l === 1 ? '(Rare)' : ''}
                </span>

                <div className="grid grid-cols-5 gap-2 flex-1">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const count = risks.risks.filter(r => r.likelihood === l && r.impact === i).length;
                    const isSelected = selectedCell?.l === l && selectedCell?.i === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedCell(isSelected ? null : { l, i })}
                        className={`h-11 rounded-lg border flex items-center justify-center font-mono font-bold text-xs transition-all ${
                          getHeatmapColor(l, i)
                        } ${isSelected ? 'ring-2 ring-white scale-105 shadow-glow-sm' : ''}`}
                      >
                        {count > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-black/40">{count}</span>
                        ) : (
                          <span className="text-slate-600 text-[10px]">{l * i}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Impact Axis Labels */}
            <div className="flex items-center space-x-2 pt-2">
              <span className="w-20"></span>
              <div className="grid grid-cols-5 gap-2 flex-1 text-center font-mono text-[10px] text-slate-400">
                <span>I1 (Minor)</span>
                <span>I2</span>
                <span>I3 (Moderate)</span>
                <span>I4</span>
                <span>I5 (Catastrophic)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Register Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-card-dark space-y-3">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Detailed Risk Register ({filteredRisks.length} Records)
          </h2>
          {selectedCell && (
            <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/30">
              Filtered to L{selectedCell.l} x I{selectedCell.i} (Score {selectedCell.l * selectedCell.i})
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold w-24">Risk ID</th>
                <th className="py-3 px-4 font-semibold w-28">Category</th>
                <th className="py-3 px-4 font-semibold">Description</th>
                <th className="py-3 px-4 font-semibold w-24">L x I</th>
                <th className="py-3 px-4 font-semibold w-24">Severity</th>
                <th className="py-3 px-4 font-semibold w-32">Affected Req</th>
                <th className="py-3 px-4 font-semibold max-w-sm">Mitigation Strategy</th>
                <th className="py-3 px-4 font-semibold w-28">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRisks.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-orange-400 whitespace-nowrap">
                    {r.id}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {r.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200 font-medium leading-relaxed">
                    {r.description}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {r.likelihood} &times; {r.impact} = <strong>{r.severity_score}</strong>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getSeverityBadge(r.severity)}`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-400 whitespace-nowrap">
                    {r.affected_requirement_id || 'Global System'}
                  </td>
                  <td className="py-3 px-4 text-slate-300 leading-relaxed text-[11px]">
                    {r.mitigation_strategy}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {r.owner}
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
