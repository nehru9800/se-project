import React, { useState } from 'react';
import { 
  GitCompare, ShieldCheck, CheckCircle2, AlertTriangle, 
  HelpCircle, Sparkles, Check, X, Edit3, ArrowRight, Cpu, Scale 
} from 'lucide-react';
import { SDLCRecommendation, SDLCModelScore, UserRole } from '../types';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell 
} from 'recharts';

interface SDLCDecisionViewProps {
  sdlc: SDLCRecommendation | null;
  currentRole: UserRole;
  onDecision: (decision: string, comments: string, selectedModel?: string) => Promise<any>;
}

export const SDLCDecisionView: React.FC<SDLCDecisionViewProps> = ({
  sdlc,
  currentRole,
  onDecision
}) => {
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'Approved' | 'Rejected' | 'Modified'>('Approved');
  const [selectedCustomModel, setSelectedCustomModel] = useState<string>('DevSecOps');
  const [comments, setComments] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!sdlc) {
    return <div className="p-8 text-center text-slate-400">Loading SDLC Decision Support...</div>;
  }

  const isPM = currentRole === 'Project Manager' || currentRole === 'Administrator';

  const chartData = sdlc.model_scores.map(m => ({
    name: m.model_name.replace(' (DevSecOps + V-Model Verification)', ' (Hybrid)'),
    fullName: m.model_name,
    score: m.score,
    isRecommended: m.is_recommended
  }));

  const handleOpenDecision = (type: 'Approved' | 'Rejected' | 'Modified') => {
    setDecisionType(type);
    setSelectedCustomModel(sdlc.recommended_model);
    setComments(sdlc.approval_comments || '');
    setIsDecisionModalOpen(true);
  };

  const handleConfirmDecision = async () => {
    try {
      await onDecision(
        decisionType, 
        comments, 
        decisionType === 'Modified' ? selectedCustomModel : undefined
      );
      setSuccessMessage(`SDLC Decision recorded as ${decisionType}!`);
      setIsDecisionModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (e) {
      console.error('Decision failed', e);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-card-dark space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {sdlc.rule_engine_version}
              </span>
              <span className="text-xs text-slate-400 font-mono">• Deterministic Rule Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Recommended:</span>
              <span className="text-blue-400 font-extrabold">{sdlc.recommended_model}</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Mathematically evaluated across 16 financial project parameters (Regulatory Criticality 20%, Security 20%, Volatility 15%, Continuous Delivery 15%).
            </p>
          </div>

          {/* Decision Buttons for Project Manager */}
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-mono px-3 py-1.5 rounded-lg border font-semibold ${
              sdlc.approval_status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
              sdlc.approval_status === 'Modified' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
              sdlc.approval_status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
              'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}>
              {sdlc.approval_status} {sdlc.approved_by && `by ${sdlc.approved_by}`}
            </span>

            {isPM && (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-700">
                <button
                  onClick={() => handleOpenDecision('Approved')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleOpenDecision('Modified')}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                >
                  Modify
                </button>
                <button
                  onClick={() => handleOpenDecision('Rejected')}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs border border-rose-500/30 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* AI Explainability Card */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-card-dark">
        <div className="flex items-center space-x-2 text-blue-400">
          <Sparkles className="w-4 h-4" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            AI-Generated Natural Language Explainability
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
          {sdlc.ai_generated_explanation}
        </p>
      </div>

      {/* Scoring Comparison Bar Chart */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-card-dark">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Deterministic Rule Engine Comparative Scores
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Out of 100 Points</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={130} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val) => [`${val}/100`, 'Score']}
              />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isRecommended ? '#3b82f6' : '#475569'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Deep Dive Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
          Detailed Model Breakdown & Limitations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sdlc.model_scores.map((m, idx) => (
            <div 
              key={idx}
              className={`p-5 rounded-2xl border transition-all space-y-4 ${
                m.is_recommended 
                  ? 'bg-blue-950/20 border-blue-500/40 shadow-glow-sm' 
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-sm font-bold ${m.is_recommended ? 'text-blue-400' : 'text-slate-200'}`}>
                    {m.model_name}
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded mt-1 inline-block ${
                    m.suitability_level === 'Highly Recommended' ? 'bg-emerald-500/20 text-emerald-400' :
                    m.suitability_level === 'Viable with Mitigations' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {m.suitability_level}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-white">{m.score}</div>
                  <span className="text-[10px] text-slate-500 font-mono">points</span>
                </div>
              </div>

              {/* Supporting factors */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">
                  Supporting Architectural Factors:
                </span>
                <ul className="space-y-1">
                  {m.supporting_factors.map((f, i) => (
                    <li key={i} className="text-slate-300 flex items-start space-x-1.5 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block">
                  Potential Limitations in FinTech:
                </span>
                <ul className="space-y-1">
                  {m.potential_limitations.map((l, i) => (
                    <li key={i} className="text-slate-400 flex items-start space-x-1.5 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Modal */}
      {isDecisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1622] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-card-dark text-xs">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-blue-400" />
              <span>Project Manager SDLC Decision Protocol</span>
            </h2>

            <p className="text-slate-300">
              You are recording an official governance decision for the project SDLC methodology.
            </p>

            {decisionType === 'Modified' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Select Custom Framework:</label>
                <select
                  value={selectedCustomModel}
                  onChange={(e) => setSelectedCustomModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="Hybrid (DevSecOps + V-Model Verification)">Hybrid (DevSecOps + V-Model Verification)</option>
                  <option value="DevSecOps">DevSecOps</option>
                  <option value="V-Model">V-Model</option>
                  <option value="Spiral">Spiral</option>
                  <option value="Agile">Agile</option>
                  <option value="Waterfall">Waterfall</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 block mb-1">Decision Rationale & Comments:</label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Document justification for engineering squads and compliance audits..."
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsDecisionModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-glow-sm"
              >
                Confirm {decisionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
