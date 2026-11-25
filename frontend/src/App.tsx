
import React, { useState, useEffect } from 'react';

import {
  Project, Requirement, ComplianceReport, RiskSummary,
  SDLCRecommendation, TraceabilityGraph, ApprovalRequest,
  AuditLogEntry, DocumentMetadata, KnowledgeBaseItem,
  InterviewMessage, UserRole, ProjectFactors
} from './types';

import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { ProjectWorkspaceView } from './components/ProjectWorkspaceView';
import { InterviewView } from './components/InterviewView';
import { RequirementsView } from './components/RequirementsView';
import { QualityAnalysisView } from './components/QualityAnalysisView';
import { ComplianceView } from './components/ComplianceView';
import { RisksView } from './components/RisksView';
import { SDLCDecisionView } from './components/SDLCDecisionView';
import { SDLCWorkflowView } from './components/SDLCWorkflowView';
import { TraceabilityView } from './components/TraceabilityView';
import { DocumentsView } from './components/DocumentsView';
import { ApprovalsView } from './components/ApprovalsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { AuditLogsView } from './components/AuditLogsView';
import { NewProjectModal } from './components/NewProjectModal';
import { EvaluationView } from './components/EvaluationView';

interface LoggedInUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export const App: React.FC = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [showLanding, setShowLanding] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('Business Analyst');

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [riskSummary, setRiskSummary] = useState<RiskSummary | null>(null);
  const [sdlcRec, setSdlcRec] = useState<SDLCRecommendation | null>(null);
  const [traceability, setTraceability] = useState<TraceabilityGraph | null>(null);
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>([]);
  const [interviewTranscript, setInterviewTranscript] = useState<InterviewMessage[]>([]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [analysisResultModal, setAnalysisResultModal] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const user = await api.me();
        setLoggedInUser(user);
        setCurrentRole(user.role as UserRole);
        setIsAuthenticated(true);
      } catch {
        console.warn('Session expired. Please sign in again.');
        localStorage.removeItem('access_token');
        setLoggedInUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && currentProject) {
      loadProjectData(currentProject.id);
    }
  }, [currentProject?.id, isAuthenticated]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const result = await api.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      setLoggedInUser(result.user);
      setCurrentRole(result.user.role as UserRole);
      setIsAuthenticated(true);
      setLoginPassword('');
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (registerPassword.length < 12) {
      setRegisterError('Password must contain at least 12 characters.');
      return;
    }

    setIsCreatingAccount(true);

    try {
      await api.register({
        full_name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });

      setRegisterSuccess(
        'Account created successfully! Please sign in with your new account.'
      );

      setLoginEmail(registerEmail.trim());
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setIsRegistering(false);
    } catch (error) {
      setRegisterError(
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.warn('Logout request failed. Clearing local session.', error);
      localStorage.removeItem('access_token');
    }

    setIsAuthenticated(false);
    setLoggedInUser(null);
    setProjects([]);
    setCurrentProject(null);
    setRequirements([]);
    setComplianceReport(null);
    setRiskSummary(null);
    setSdlcRec(null);
    setTraceability(null);
    setDocuments([]);
    setApprovals([]);
    setAuditLogs([]);
    setKnowledgeBase([]);
    setInterviewTranscript([]);
    setActiveTab('dashboard');
    setShowLanding(false);
  };

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
      setCurrentProject(previous => previous || data[0] || null);
    } catch (error) {
      console.error('Failed to load projects', error);
    }
  };

  const loadProjectData = async (projectId: string) => {
    try {
      const [
        reqs, comp, risks, sdlc, trace, docs, apps, logs, kb, interview
      ] = await Promise.all([
        api.getRequirements(projectId),
        api.getComplianceReport(projectId),
        api.getRiskSummary(projectId),
        api.getSDLCRecommendation(projectId),
        api.getTraceability(projectId),
        api.getDocuments(projectId),
        api.getApprovals(projectId),
        api.getAuditLogs(projectId),
        api.getKnowledgeBase(),
        api.getInterviewTranscript(projectId)
      ]);

      setRequirements(reqs);
      setComplianceReport(comp);
      setRiskSummary(risks);
      setSdlcRec(sdlc);
      setTraceability(trace);
      setDocuments(docs);
      setApprovals(apps);
      setAuditLogs(logs);
      setKnowledgeBase(kb);
      setInterviewTranscript(interview);
    } catch (error) {
      console.error('Failed to load project details', error);
    }
  };

  const handleRunAnalysis = async () => {
    if (!currentProject) return;

    setIsAnalyzing(true);

    try {
      const res = await api.runAnalysis(
        currentProject.id,
        'Lead Analyst',
        currentRole
      );

      setAnalysisResultModal(res);
      await loadProjectData(currentProject.id);

      const updatedProj = await api.getProject(currentProject.id);
      setCurrentProject(updatedProj);
    } catch (error) {
      console.error('Analysis failed', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResetDemo = async () => {
    if (!currentProject) return;

    try {
      await api.resetDemoProject(currentProject.id);
      await loadProjects();
      await loadProjectData(currentProject.id);
    } catch (error) {
      console.error('Reset failed', error);
    }
  };

  const handleCreateProject = async (payload: any) => {
    try {
      const newProj = await api.createProject(payload);
      setProjects(previous => [newProj, ...previous]);
      setCurrentProject(newProj);
      setActiveTab('workspace');
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  const pendingApprovalsCount = approvals.filter(
    a => a.status === 'Pending'
  ).length;

  const openIssuesCount = requirements.reduce(
    (acc, r) => acc + (r.quality_issues?.length || 0),
    0
  );

  const complianceGapCount = complianceReport?.gap_count || 0;

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#08111d] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-300">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08111d] flex items-center justify-center px-4 py-10 text-slate-100">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              F
            </div>
            <h1 className="text-2xl font-bold text-white">FinTech SDLC</h1>
            <p className="text-sm text-slate-400 mt-2">
              Financial Requirements & SDLC Decision Support System
            </p>
          </div>

          <div className="bg-[#0d1a29] border border-slate-800 rounded-2xl p-7 shadow-2xl space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {isRegistering ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {isRegistering
                  ? 'Register to access your workspace.'
                  : 'Sign in to access your workspace.'}
              </p>
            </div>

            {isRegistering ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Full name</label>
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    value={registerName}
                    onChange={e => setRegisterName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl bg-[#08111d] border border-slate-700 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Email address</label>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={registerEmail}
                    onChange={e => setRegisterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl bg-[#08111d] border border-slate-700 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={12}
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    placeholder="At least 12 characters"
                    className="w-full rounded-xl bg-[#08111d] border border-slate-700 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Use at least 12 characters.
                  </p>
                </div>

                {registerError && (
                  <p role="alert" className="text-sm text-red-400">{registerError}</p>
                )}

                <button
                  type="submit"
                  disabled={isCreatingAccount}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-4 py-3 text-sm font-semibold text-white"
                >
                  {isCreatingAccount ? 'Creating account...' : 'Create account'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setRegisterError('');
                    }}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Email address</label>
                  <input
                    type="email"
                    autoComplete="username"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl bg-[#08111d] border border-slate-700 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Password</label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl bg-[#08111d] border border-slate-700 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>

                {loginError && (
                  <p role="alert" className="text-sm text-red-400">{loginError}</p>
                )}

                {registerSuccess && (
                  <p role="status" className="text-sm text-emerald-400">{registerSuccess}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-4 py-3 text-sm font-semibold text-white"
                >
                  {isLoggingIn ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="text-center border-t border-slate-800 pt-4">
                  <p className="text-sm text-slate-400 mb-2">New to FinTech SDLC?</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(true);
                      setRegisterError('');
                      setRegisterSuccess('');
                    }}
                    className="text-sm font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Create a new account
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showLanding) {
    return (
      <LandingPage
        onExploreDemo={() => {
          setShowLanding(false);
          setActiveTab('dashboard');
        }}
        onStartNewProject={() => {
          setShowLanding(false);
          setIsNewProjectModalOpen(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#08111d] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar
        currentProject={currentProject}
        projects={projects}
        onSelectProject={p => setCurrentProject(p)}
        currentRole={currentRole}
        onChangeRole={r => setCurrentRole(r)}
        onRunAnalysis={handleRunAnalysis}
        isAnalyzing={isAnalyzing}
        onResetDemo={handleResetDemo}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onShowLanding={() => setShowLanding(true)}
      />

      <div className="flex items-center justify-end gap-3 px-5 py-2 border-b border-slate-800 bg-[#0b1622]">
        <span className="text-xs text-slate-400">
          Signed in as{' '}
          <span className="text-slate-200 font-medium">
            {loggedInUser?.full_name || loggedInUser?.email}
          </span>
        </span>
        <button
          onClick={handleLogout}
          className="text-xs font-semibold text-red-300 hover:text-red-200 border border-red-500/30 hover:bg-red-500/10 rounded-lg px-3 py-1.5"
        >
          Log out
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={tab => setActiveTab(tab)}
          pendingApprovalsCount={pendingApprovalsCount}
          openIssuesCount={openIssuesCount}
          complianceGapCount={complianceGapCount}
        />

        <main className="flex-1 overflow-y-auto bg-[#08111d] relative">
          {currentProject ? (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  project={currentProject}
                  requirements={requirements}
                  compliance={complianceReport}
                  risks={riskSummary}
                  sdlc={sdlcRec}
                  auditLogs={auditLogs}
                  userRole={currentRole}
                  onChangeRole={setCurrentRole}
                  onNavigate={tab => setActiveTab(tab)}
                  onRunAnalysis={handleRunAnalysis}
                  isAnalyzing={isAnalyzing}
                />
              )}

              {activeTab === 'workspace' && (
                <ProjectWorkspaceView
                  project={currentProject}
                  onRunAnalysis={handleRunAnalysis}
                  isAnalyzing={isAnalyzing}
                  onUpdateFactors={async (factors: ProjectFactors) => {
                    const updated = await api.reevaluateSDLC(currentProject.id, factors);
                    setSdlcRec(updated);
                    const updatedP = await api.getProject(currentProject.id);
                    setCurrentProject(updatedP);
                  }}
                />
              )}

              {activeTab === 'interview' && (
                <InterviewView
                  projectId={currentProject.id}
                  transcript={interviewTranscript}
                  onSendMessage={async msg => {
                    const res = await api.sendInterviewMessage(currentProject.id, msg);
                    const updatedTranscript = await api.getInterviewTranscript(currentProject.id);
                    setInterviewTranscript(updatedTranscript);
                    return res;
                  }}
                  onExtractRequirements={async () => {
                    const res = await api.extractInterviewRequirements(currentProject.id);
                    const reqs = await api.getRequirements(currentProject.id);
                    setRequirements(reqs);
                    return res;
                  }}
                />
              )}

              {activeTab === 'requirements' && (
                <RequirementsView
                  projectId={currentProject.id}
                  requirements={requirements}
                  onCreateRequirement={async req => {
                    const created = await api.createRequirement(currentProject.id, req);
                    setRequirements(previous => [...previous, created]);
                  }}
                  onUpdateRequirement={async (reqId, updates) => {
                    const updated = await api.updateRequirement(currentProject.id, reqId, updates);
                    setRequirements(previous =>
                      previous.map(r => r.id === reqId ? updated : r)
                    );
                  }}
                  onClarifyRequirement={async (reqId, action, customStmt) => {
                    const res = await api.clarifyRequirement(
                      currentProject.id, reqId, action, customStmt
                    );
                    setRequirements(previous =>
                      previous.map(r => r.id === reqId ? res.requirement : r)
                    );
                  }}
                />
              )}

              {activeTab === 'quality' && (
                <QualityAnalysisView
                  requirements={requirements}
                  onClarify={async (reqId, action, customStmt, issueId) => {
                    const res = await api.clarifyRequirement(
                      currentProject.id, reqId, action, customStmt, issueId
                    );
                    setRequirements(previous =>
                      previous.map(r => r.id === reqId ? res.requirement : r)
                    );
                  }}
                />
              )}

              {activeTab === 'compliance' && (
                <ComplianceView
                  compliance={complianceReport}
                  currentRole={currentRole}
                  onApproveMapping={async (mappingId, officerName, decision, notes) => {
                    await api.approveComplianceMapping(
                      currentProject.id, mappingId, officerName, decision, notes
                    );
                    const report = await api.getComplianceReport(currentProject.id);
                    setComplianceReport(report);
                  }}
                />
              )}

              {activeTab === 'risks' && (
                <RisksView risks={riskSummary} />
              )}

              {activeTab === 'sdlc' && (
                <SDLCDecisionView
                  sdlc={sdlcRec}
                  currentRole={currentRole}
                  onDecision={async (decision, comments, selectedModel) => {
                    const res = await api.recordSDLCDecision(
                      currentProject.id,
                      decision,
                      'Authorized Manager',
                      currentRole,
                      comments,
                      selectedModel
                    );
                    setSdlcRec(res.recommendation);
                  }}
                />
              )}

              {activeTab === 'workflow' && (
                <SDLCWorkflowView
                  workflow={sdlcRec?.generated_workflow || []}
                  recommendedModel={sdlcRec?.recommended_model || 'Hybrid Model'}
                />
              )}

              {activeTab === 'traceability' && (
                <TraceabilityView traceability={traceability} />
              )}

              {activeTab === 'documents' && (
                <DocumentsView
                  projectId={currentProject.id}
                  documents={documents}
                  onUploadDocument={async (file, docType, jurisdiction, version) => {
                    const doc = await api.uploadDocument(
                      currentProject.id, file, docType, jurisdiction, version
                    );
                    setDocuments(previous => [...previous, doc]);
                  }}
                  onGenerateDocument={async format => {
                    return await api.generateDocument(currentProject.id, format, 'SRS');
                  }}
                />
              )}

              {activeTab === 'approvals' && (
                <ApprovalsView
                  approvals={approvals}
                  currentRole={currentRole}
                  onRecordAction={async (
                    approvalId, decision, notes, actorName, actorRole
                  ) => {
                    await api.recordApprovalAction(
                      approvalId, decision, notes, actorName, actorRole
                    );
                    const updatedApps = await api.getApprovals(currentProject.id);
                    setApprovals(updatedApps);
                    const reqs = await api.getRequirements(currentProject.id);
                    setRequirements(reqs);
                  }}
                />
              )}

              {activeTab === 'knowledge' && (
                <KnowledgeBaseView knowledgeBase={knowledgeBase} />
              )}

              {activeTab === 'audit' && (
                <AuditLogsView auditLogs={auditLogs} />
              )}

              {activeTab === 'evaluation' && (
                <EvaluationView
                  projectId={currentProject.id}
                  projectName={currentProject.name}
                />
              )}
            </>
          ) : (
            <div className="p-16 text-center space-y-3">
              <h2 className="text-base font-bold text-white">No Project Loaded</h2>
              <p className="text-xs text-slate-400">
                Initialize a project or load the pre-seeded demo dataset.
              </p>
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Create Project
              </button>
            </div>
          )}
        </main>
      </div>

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />

      {analysisResultModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1622] border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-card-dark text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-white">
                Multi-Agent Analysis Pipeline Complete
              </span>
              <button
                onClick={() => setAnalysisResultModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300">
              Coordinator Agent orchestrated 10 specialized agent stages for{' '}
              <strong>{currentProject?.name}</strong>.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {analysisResultModal.stages?.map((stage: any, i: number) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-200 block">
                      {stage.stage}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {stage.detail}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      stage.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : stage.status === 'Needs Review'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-blue-500/15 text-blue-400'
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setAnalysisResultModal(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs"
              >
                Close & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
