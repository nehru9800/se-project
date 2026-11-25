import React, { useState } from 'react';
import { 
  GitFork, Shield, CheckCircle2, ChevronRight, ChevronDown, 
  Lock, ArrowRight, UserCheck, Scale, Terminal 
} from 'lucide-react';
import { SDLCWorkflowPhase } from '../types';

interface SDLCWorkflowViewProps {
  workflow: SDLCWorkflowPhase[];
  recommendedModel: string;
}

export const SDLCWorkflowView: React.FC<SDLCWorkflowViewProps> = ({
  workflow,
  recommendedModel
}) => {
  const [expandedStep, setExpandedStep] = useState<number>(1);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <GitFork className="w-5 h-5 text-indigo-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">Project-Specific SDLC Execution Workflow</h1>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            {recommendedModel}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Concrete engineering phase gates, security activities, deliverables, and compliance checkpoints generated from project characteristics.
        </p>
      </div>

      {/* Sequential Phase Cards */}
      <div className="space-y-4">
        {workflow.map((phase) => {
          const isExpanded = expandedStep === phase.step_number;
          return (
            <div 
              key={phase.step_number}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded 
                  ? 'bg-slate-900/80 border-indigo-500/40 shadow-card-dark' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Bar */}
              <button
                onClick={() => setExpandedStep(isExpanded ? 0 : phase.step_number)}
                className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center ${
                    isExpanded 
                      ? 'bg-indigo-600 text-white shadow-glow-sm' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    0{phase.step_number}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{phase.phase_name}</h3>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Lead: <span className="text-blue-400 font-semibold">{phase.responsible_role}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center space-x-2 text-[10px] font-mono">
                    <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      Gate: {phase.approval_gate}
                    </span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {/* Expanded Phase Content */}
              {isExpanded && (
                <div className="p-6 pt-0 border-t border-slate-800/80 space-y-6 text-xs text-slate-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Left Column: Core Activities & Deliverables */}
                    <div className="space-y-4">
                      {/* Activities */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center space-x-1.5">
                          <Terminal className="w-3.5 h-3.5 text-blue-400" />
                          <span>Core Engineering Activities</span>
                        </span>
                        <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                          {phase.activities.map((act, i) => (
                            <div key={i} className="flex items-start space-x-2 text-[11px]">
                              <span className="text-blue-400 font-mono">•</span>
                              <span className="text-slate-200">{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deliverables */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                          Artifact Deliverables
                        </span>
                        <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                          {phase.deliverables.map((del, i) => (
                            <div key={i} className="flex items-start space-x-2 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-300">{del}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Security, Testing, Compliance */}
                    <div className="space-y-4">
                      {/* Security & Threat Modeling */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center space-x-1.5">
                          <Shield className="w-3.5 h-3.5 text-rose-400" />
                          <span>Shift-Left Security Activities</span>
                        </span>
                        <div className="space-y-1.5 bg-rose-950/15 p-3.5 rounded-xl border border-rose-900/30">
                          {phase.security_activities.map((sec, i) => (
                            <div key={i} className="flex items-start space-x-2 text-[11px]">
                              <span className="text-rose-400 font-mono">•</span>
                              <span className="text-rose-200">{sec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Testing Focus & Verification */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                          Verification & Testing Focus
                        </span>
                        <div className="space-y-1.5 bg-indigo-950/15 p-3.5 rounded-xl border border-indigo-900/30">
                          {phase.testing_focus.map((tst, i) => (
                            <div key={i} className="flex items-start space-x-2 text-[11px]">
                              <span className="text-indigo-400 font-mono">•</span>
                              <span className="text-indigo-200">{tst}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gates & Criteria Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 font-mono block text-[10px] uppercase">Compliance Checkpoint</span>
                      <span className="text-purple-400 font-medium">{phase.compliance_checkpoint}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-mono block text-[10px] uppercase">Approval Gate</span>
                      <span className="text-emerald-400 font-medium">{phase.approval_gate}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-mono block text-[10px] uppercase">Entry Criteria</span>
                      <span className="text-slate-300">{phase.entry_criteria}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-mono block text-[10px] uppercase">Exit Criteria</span>
                      <span className="text-slate-300">{phase.exit_criteria}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
