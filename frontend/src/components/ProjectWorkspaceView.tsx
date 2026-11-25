import React, { useState } from 'react';
import { 
  FolderGit2, Play, CheckCircle2, Clock, AlertTriangle, 
  Settings2, Activity, ShieldCheck, Scale, Cpu, Save 
} from 'lucide-react';
import { Project, ProjectFactors } from '../types';

interface ProjectWorkspaceViewProps {
  project: Project;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  onUpdateFactors: (factors: ProjectFactors) => void;
}

export const ProjectWorkspaceView: React.FC<ProjectWorkspaceViewProps> = ({
  project,
  onRunAnalysis,
  isAnalyzing,
  onUpdateFactors,
}) => {
  const [factors, setFactors] = useState<ProjectFactors>(project.factors);
  const [isSaved, setIsSaved] = useState(false);

  const pipelineStages = [
    { name: 'Input Gathering', status: 'Completed', detail: 'Stakeholder transcript & policy docs ingested' },
    { name: 'Requirement Extraction', status: 'Completed', detail: '14 structured atomic requirements' },
    { name: 'Classification', status: 'Completed', detail: 'Multi-label taxonomy assignment' },
    { name: 'Quality Analysis', status: 'Needs Review', detail: '2 ambiguous SLA statements detected' },
    { name: 'Compliance Mapping', status: 'Needs Review', detail: '1 FFIEC disbursement policy gap detected' },
    { name: 'Security Threat Modeling', status: 'Completed', detail: 'STRIDE boundaries & AES-256 encryption' },
    { name: 'Risk Analysis', status: 'Completed', detail: '5x5 Likelihood x Impact severity scored' },
    { name: 'Validation', status: 'Completed', detail: 'Bidirectional traceability links established' },
    { name: 'SDLC Decision', status: 'Completed', detail: 'Hybrid (DevSecOps + V-Model Verification) selected' },
    { name: 'Human Approvals', status: 'Pending', detail: '3 items awaiting Compliance & Risk Officer signoff' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'Needs Review':
        return (
          <span className="flex items-center space-x-1 text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-medium">
            <AlertTriangle className="w-3 h-3" />
            <span>Needs Review</span>
          </span>
        );
      case 'Processing':
        return (
          <span className="flex items-center space-x-1 text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-medium animate-pulse">
            <Activity className="w-3 h-3 animate-spin" />
            <span>Processing</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const handleSaveFactors = () => {
    onUpdateFactors(factors);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Overview Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-card-dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/30">
                {project.financial_domain}
              </span>
              <span className="text-xs text-slate-400 font-mono">• Owner: {project.owner}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">{project.description}</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-sm flex items-center space-x-2 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  <span>Running AI Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run AI Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Project Metrics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Budget Allocation</span>
            <span className="font-mono font-bold text-slate-200">{project.budget}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Target Timeline</span>
            <span className="font-mono font-bold text-slate-200">{project.timeline}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Target Users</span>
            <span className="font-mono font-bold text-slate-200 truncate block max-w-xs">{project.expected_users}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Pipeline Status</span>
            <span className="font-mono font-bold text-blue-400">{project.current_pipeline_stage}</span>
          </div>
        </div>
      </div>

      {/* 10-Stage Pipeline Progress Tracker */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Requirements Engineering Execution Pipeline
            </h2>
            <p className="text-xs text-slate-400">
              End-to-end multi-agent orchestration progression from raw input to human-governed SDLC execution
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            8 / 10 Stages Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pipelineStages.map((stage, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-slate-500 text-[11px]">0{idx+1}.</span>
                  <span className="font-semibold text-slate-200">{stage.name}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{stage.detail}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                {getStatusBadge(stage.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Characteristics & Factor Controls */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Project Characteristics & Factor Weights
            </h2>
          </div>

          <button
            onClick={handleSaveFactors}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Factors Saved!' : 'Save & Re-evaluate'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Adjust project characteristics to re-calibrate the deterministic SDLC scoring engine (weights: Regulatory 20%, Security 20%, Volatility 15%, CD 15%, Verification 12%).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Slider 1 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Regulatory Criticality</span>
              <span className="font-mono text-blue-400">{Math.round(factors.regulatory_criticality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={factors.regulatory_criticality}
              onChange={(e) => setFactors({ ...factors, regulatory_criticality: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">GLBA Safeguards, CFPB, and SOX 404 mandate</span>
          </div>

          {/* Slider 2 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Security Criticality</span>
              <span className="font-mono text-rose-400">{Math.round(factors.security_criticality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={factors.security_criticality}
              onChange={(e) => setFactors({ ...factors, security_criticality: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">NPI encryption, FIDO2 MFA, PCI-DSS</span>
          </div>

          {/* Slider 3 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Requirement Volatility</span>
              <span className="font-mono text-amber-400">{Math.round(factors.requirement_volatility * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={factors.requirement_volatility}
              onChange={(e) => setFactors({ ...factors, requirement_volatility: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Frequency of loan policy and market changes</span>
          </div>

          {/* Slider 4 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Legacy Dependency</span>
              <span className="font-mono text-slate-300">{Math.round(factors.legacy_dependency * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={factors.legacy_dependency}
              onChange={(e) => setFactors({ ...factors, legacy_dependency: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Core banking mainframe (FIS/Fiserv)</span>
          </div>

          {/* Toggle 1 */}
          <div className="space-y-2">
            <span className="text-slate-300 block text-xs">Continuous Deployment</span>
            <div className="flex items-center space-x-3 pt-1">
              <button
                type="button"
                onClick={() => setFactors({ ...factors, continuous_deployment: !factors.continuous_deployment })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  factors.continuous_deployment 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {factors.continuous_deployment ? 'Enabled (DevSecOps)' : 'Disabled'}
              </button>
            </div>
            <span className="text-[10px] text-slate-500">Automated daily/weekly release pipelines</span>
          </div>

          {/* Toggle 2 */}
          <div className="space-y-2">
            <span className="text-slate-300 block text-xs">Formal Verification Needed</span>
            <div className="flex items-center space-x-3 pt-1">
              <button
                type="button"
                onClick={() => setFactors({ ...factors, formal_verification_needed: !factors.formal_verification_needed })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  factors.formal_verification_needed 
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {factors.formal_verification_needed ? 'Required (V-Model Gate)' : 'Optional'}
              </button>
            </div>
            <span className="text-[10px] text-slate-500">Mandatory pre-release audit attestation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
