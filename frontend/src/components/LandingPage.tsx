import React from 'react';
import { 
  Building2, ArrowRight, ShieldCheck, Cpu, Database, 
  GitBranch, CheckCircle, FileSpreadsheet, Lock, AlertTriangle, 
  Sparkles, Layers, Users, Scale
} from 'lucide-react';

interface LandingPageProps {
  onExploreDemo: () => void;
  onStartNewProject: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreDemo,
  onStartNewProject,
}) => {
  const featureCards = [
    {
      title: 'AI Requirement Gathering',
      icon: Users,
      desc: 'Interactive stakeholder elicitation agent that dynamically detects missing financial boundaries (KYC, transaction caps, adverse action notices).'
    },
    {
      title: 'Multi-Agent Analysis',
      icon: Cpu,
      desc: 'Specialized LangGraph-style agent mesh for classification, conflict detection, security posture evaluation, and automated quality auditing.'
    },
    {
      title: 'Compliance Mapping (RAG)',
      icon: Scale,
      desc: 'Verifiable citations grounded in GLBA Safeguards, CFPB Regulation Z, SOX Section 404, and PCI-DSS without regulatory hallucination.'
    },
    {
      title: 'Risk Detection & Heatmap',
      icon: AlertTriangle,
      desc: '5x5 Likelihood vs Impact severity analysis linking operational and security risks directly to affected financial requirements.'
    },
    {
      title: 'RAG-Grounded Intelligence',
      icon: Database,
      desc: 'Instant semantic retrieval across statutory banking frameworks, institutional underwriting manuals, and internal policy documents.'
    },
    {
      title: 'SDLC Decision Support',
      icon: GitBranch,
      desc: 'Deterministic multi-factor mathematical rule engine scoring Agile, DevSecOps, Spiral, V-Model, and Hybrid models with AI explainability.'
    },
    {
      title: 'Human-in-the-Loop Approval',
      icon: CheckCircle,
      desc: 'Role-based authorization gates for compliance officers, CISOs, and risk managers to sign off on baseline requirements and regulatory exceptions.'
    },
    {
      title: 'Complete Traceability',
      icon: Layers,
      desc: 'End-to-end bidirectional graph linking Stakeholder Statement -> Requirement -> Acceptance Criteria -> Risk -> Compliance -> Test Case -> SDLC Phase.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#08111d] text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 px-8 py-4 flex items-center justify-between backdrop-blur-md bg-[#08111d]/80 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-glow-sm">
            <div className="w-full h-full bg-[#08111d] rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white">FinTech SDLC Intelligence</span>
            <span className="ml-2 text-[10px] font-mono uppercase bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
              Enterprise v1.0
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onStartNewProject}
            className="text-xs font-semibold px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            New Project
          </button>
          <button
            onClick={onExploreDemo}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-glow-sm transition-all"
          >
            Launch Command Center
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20 flex-1">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Agentic AI Platform for Financial Software Engineering</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            AI-Powered Requirements Engineering for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
              Financial Software
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
            Transform stakeholder conversations and financial policies into validated, traceable software requirements and project-specific SDLC workflows. Built specifically for high-criticality banking, lending, and payment platforms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-glow-md flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
            >
              <span>Explore Demo Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onStartNewProject}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Start New Project</span>
            </button>
          </div>
        </div>

        {/* High-Level Architecture Visualization */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 shadow-card-dark space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
              THREE-LAYER MULTI-AGENT ARCHITECTURE
            </h2>
            <p className="text-xs text-slate-400">
              Rigorous separation between elicitation input, autonomous multi-agent analysis, and human-verified governance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Layer 1 */}
            <div className="bg-[#08111d] p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-blue-400">
                <Users className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">LAYER 1</span>
              </div>
              <h3 className="font-bold text-sm text-slate-200">Stakeholder & Document Ingestion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Captures conversational interviews via the Stakeholder Interaction Agent and ingests PDF, DOCX, TXT policy documents into the RAG vector store.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Interview Transcript</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">PDF Ingestion</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Policy Chunking</span>
              </div>
            </div>

            {/* Layer 2 */}
            <div className="bg-[#08111d] p-5 rounded-xl border border-blue-500/30 glow-border space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Cpu className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">LAYER 2</span>
              </div>
              <h3 className="font-bold text-sm text-slate-200">Coordinator & Agent Mesh</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Coordinator Agent orchestrates Classification, Conflict Detection, RAG Compliance, Security Threat Modeling, and the Deterministic SDLC Engine.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Conflict Detection</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">RAG Grounding</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">SDLC Scoring</span>
              </div>
            </div>

            {/* Layer 3 */}
            <div className="bg-[#08111d] p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">LAYER 3</span>
              </div>
              <h3 className="font-bold text-sm text-slate-200">Validated Baseline & Governance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Role-based human-in-the-loop approvals, complete bidirectional traceability, 5x5 risk register, and automated IEEE-830 SRS document export.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Human Signoffs</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Traceability Graph</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">SRS Generation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">Core Capabilities for Regulated FinTech</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Engineered specifically to solve the high-stakes compliance and architectural requirements of digital lending and core banking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featureCards.map((f, i) => {
              const Icon = f.icon;
              return (
                <div 
                  key={i} 
                  className="bg-slate-900/50 hover:bg-slate-900/80 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-200">{f.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-8 text-center text-xs text-slate-500">
        <p>Agentic AI Financial Software Requirements Engineering & SDLC Decision Support Platform. Fully grounded in GLBA, CFPB, and SOX 404.</p>
      </footer>
    </div>
  );
};
