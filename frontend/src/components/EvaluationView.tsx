import React, { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, CheckCircle2, RefreshCw, ShieldCheck, Target } from 'lucide-react';
import { api } from '../services/api';
import type { ProjectEvaluation } from '../types';

type Props = { projectId: string; projectName: string };

const metricLabels: Array<{ key: keyof ProjectEvaluation['metrics']; label: string; description: string }> = [
  { key: 'requirement_completeness', label: 'Requirement completeness', description: 'Required fields populated' },
  { key: 'acceptance_criteria_testability', label: 'Acceptance testability', description: 'Requirements with actionable criteria' },
  { key: 'compliance_coverage', label: 'Compliance coverage', description: 'Requirements mapped to controls' },
  { key: 'traceability_coverage', label: 'Traceability coverage', description: 'Requirements linked to traceability items' },
  { key: 'approval_resolution_rate', label: 'Approval resolution', description: 'Approval requests with a final decision' },
  { key: 'ambiguity_rate', label: 'Ambiguity rate', description: 'Lower is better' },
  { key: 'conflict_rate', label: 'Conflict rate', description: 'Lower is better' },
];

export const EvaluationView: React.FC<Props> = ({ projectId, projectName }) => {
  const [data, setData] = useState<ProjectEvaluation | null>(null);
  const [benchmark, setBenchmark] = useState<{ project_count: number; average_readiness_score: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [evaluation, portfolio] = await Promise.all([api.getEvaluation(projectId), api.getEvaluationBenchmark()]);
      setData(evaluation);
      setBenchmark(portfolio);
    }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not load evaluation metrics'); }
    finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => { void load(); }, [load]);

  return (
    <section className="mx-auto max-w-7xl space-y-6 p-5 md:p-8" aria-label="Evaluation and benchmarking">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-cyan-300"><BarChart3 className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-widest">Step 7 · Evaluation</span></div>
          <h1 className="mt-2 text-2xl font-bold text-white">Quality & Benchmarking</h1>
          <p className="mt-1 text-sm text-slate-400">Operational quality indicators for {projectName}.</p>
        </div>
        <button onClick={() => void load()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:border-cyan-500 disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh metrics
        </button>
      </header>

      {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}
      {loading && !data ? <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-sm text-slate-400">Calculating project metrics…</div> : null}

      {data && <>
        {benchmark && <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-xs"><span className="text-slate-400">Portfolio benchmark · {benchmark.project_count} projects</span><span className="font-semibold text-cyan-300">Average readiness {benchmark.average_readiness_score.toFixed(1)} / 100</span></div>}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-slate-900 p-5 md:col-span-1">
            <div className="flex items-center gap-2 text-cyan-300"><Target className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-wider">SDLC readiness index</span></div>
            <div className="mt-4 flex items-end gap-2"><span className="text-5xl font-bold text-white">{data.readiness_score}</span><span className="pb-1 text-slate-400">/ 100</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${data.readiness_score}%` }} /></div>
            <p className="mt-3 text-sm text-cyan-200">{data.readiness_label}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">Weighted project indicator; it is not a compliance certification or AI accuracy score.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            {[
              ['Requirements', data.sample_size.requirements], ['Compliance mappings', data.sample_size.compliance_mappings],
              ['Traceability links', data.sample_size.traceability_links], ['Risks assessed', data.sample_size.risks],
              ['Approval requests', data.sample_size.approvals], ['Open quality issues', data.quality_indicators.open_quality_issues],
            ].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-2xl font-semibold tabular-nums text-white">{value}</p></div>)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="mb-5 flex items-center gap-2"><Activity className="h-5 w-5 text-cyan-300" /><h2 className="font-semibold text-white">Evaluation metrics</h2></div>
          <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
            {metricLabels.map(metric => {
              const value = data.metrics[metric.key];
              const lowerIsBetter = metric.key === 'ambiguity_rate' || metric.key === 'conflict_rate';
              return <div key={metric.key}>
                <div className="mb-2 flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-slate-200">{metric.label}</p><p className="text-xs text-slate-500">{metric.description}</p></div><strong className={`text-sm tabular-nums ${lowerIsBetter && value > 20 ? 'text-amber-300' : 'text-cyan-300'}`}>{value.toFixed(1)}%</strong></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${lowerIsBetter ? 'bg-amber-400' : 'bg-cyan-400'}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>
              </div>;
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-300" /><h2 className="font-semibold text-white">Items requiring attention</h2></div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-950 p-3"><span className="text-slate-400">Ambiguous requirements</span><p className="mt-1 text-xl font-semibold text-amber-300">{data.quality_indicators.ambiguous_requirements}</p></div>
              <div className="rounded-lg bg-slate-950 p-3"><span className="text-slate-400">Conflicted requirements</span><p className="mt-1 text-xl font-semibold text-amber-300">{data.quality_indicators.conflicted_requirements}</p></div>
              <div className="rounded-lg bg-slate-950 p-3"><span className="text-slate-400">Critical risks</span><p className="mt-1 text-xl font-semibold text-rose-300">{data.quality_indicators.critical_risks}</p></div>
              <div className="rounded-lg bg-slate-950 p-3"><span className="text-slate-400">Pending approvals</span><p className="mt-1 text-xl font-semibold text-blue-300">{data.quality_indicators.pending_approvals}</p></div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-3 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-300" /><h2 className="font-semibold text-white">How to interpret results</h2></div>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-400">{data.limitations.map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{item}</li>)}</ul>
            <p className="mt-4 border-t border-slate-800 pt-3 text-[11px] text-slate-500">Updated {new Date(data.generated_at).toLocaleString()}</p>
          </div>
        </div>
      </>}
    </section>
  );
};
