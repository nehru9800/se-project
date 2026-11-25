import React from 'react';
import { 
  Building2, Shield, UserCheck, Play, RefreshCw, 
  CheckCircle2, AlertTriangle, Layers, Activity 
} from 'lucide-react';
import { UserRole, Project } from '../types';

interface NavbarProps {
  currentProject: Project | null;
  projects: Project[];
  onSelectProject: (p: Project) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  onResetDemo: () => void;
  onOpenNewProject: () => void;
  onShowLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  projects,
  onSelectProject,
  currentRole,
  onChangeRole,
  onRunAnalysis,
  isAnalyzing,
  onResetDemo,
  onOpenNewProject,
  onShowLanding
}) => {
  const roles: UserRole[] = [
    'Business Analyst',
    'Compliance Officer',
    'Security Officer',
    'Risk Manager',
    'Project Manager',
    'Stakeholder',
    'Developer/Architect',
    'Administrator'
  ];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Compliance Officer': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Security Officer': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Risk Manager': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Project Manager': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#08111d]/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand & Landing Trigger */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onShowLanding}
          className="flex items-center space-x-3 group text-left focus:outline-none"
          title="Return to Home / Overview"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-glow-sm">
            <div className="w-full h-full bg-[#08111d] rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-100 text-base tracking-tight">FinTech SDLC</span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                Multi-Agent
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Requirements & SDLC Decision Engine</p>
          </div>
        </button>

        {/* Project Selector Dropdown */}
        <div className="hidden md:flex items-center pl-4 border-l border-slate-800 space-x-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <select
            value={currentProject?.id || ''}
            onChange={(e) => {
              const p = projects.find(proj => proj.id === e.target.value);
              if (p) onSelectProject(p);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 max-w-[220px] truncate"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={onOpenNewProject}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
          >
            + New
          </button>
        </div>
      </div>

      {/* Right Controls: Role Switcher & Master Actions */}
      <div className="flex items-center space-x-3">
        {/* Role Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
          <UserCheck className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 hidden lg:inline">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className={`text-xs font-medium rounded px-2 py-0.5 border focus:outline-none cursor-pointer ${getRoleBadgeColor(currentRole)}`}
          >
            {roles.map((r) => (
              <option key={r} value={r} className="bg-slate-900 text-slate-200">{r}</option>
            ))}
          </select>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={onResetDemo}
          title="Reload fresh demo dataset"
          className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors hidden sm:flex items-center"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Master Action: Run AI Analysis */}
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
            isAnalyzing 
              ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed animate-pulse'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-glow-sm hover:scale-[1.02]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>Orchestrating Agents...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run AI Analysis</span>
            </>
          )}
        </button>

        {/* Live Status indicator */}
        <div className="hidden xl:flex items-center space-x-1.5 pl-2 border-l border-slate-800 text-[11px] text-emerald-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>RAG Active</span>
        </div>
      </div>
    </header>
  );
};
