
import {
  Project, Requirement, ComplianceReport, RiskSummary, SDLCRecommendation,
  TraceabilityGraph, ApprovalRequest, AuditLogEntry, DocumentMetadata,
  KnowledgeBaseItem, InterviewMessage, ProjectFactors, ProjectEvaluation
} from '../types';

const API_BASE = '/api/v1';

export interface AuthResponse {
  access_token: string;
  expires_at: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
  };
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('access_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `HTTP Error ${res.status}`);
  }

  return (await res.json()) as T;
}

export const api = {
  // Authentication
  login: async (data: { email: string; password: string }) => {
    const result = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    localStorage.setItem('access_token', result.access_token);
    return result;
  },

  register: (data: {
    email: string;
    full_name: string;
    password: string;
  }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () =>
    request<{
      id: number;
      email: string;
      full_name: string;
      role: string;
    }>('/auth/me'),

  logout: async () => {
    try {
      return await request<{ status: string }>('/auth/logout', {
        method: 'POST',
      });
    } finally {
      localStorage.removeItem('access_token');
    }
  },

  // Projects
  getProjects: () => request<Project[]>('/projects'),
  getProject: (id: string) => request<Project>(`/projects/${id}`),

  createProject: (data: Partial<Project>) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetDemoProject: (id: string) =>
    request<{ status: string; message: string }>(
      `/projects/${id}/reset-demo`,
      { method: 'POST' }
    ),

  // Requirements
  getRequirements: (
    projectId: string,
    params: Record<string, string> = {}
  ) => {
    const query = new URLSearchParams(params).toString();
    return request<Requirement[]>(
      `/projects/${projectId}/requirements${query ? `?${query}` : ''}`
    );
  },

  getRequirement: (projectId: string, reqId: string) =>
    request<Requirement>(`/projects/${projectId}/requirements/${reqId}`),

  createRequirement: (projectId: string, req: Partial<Requirement>) =>
    request<Requirement>(`/projects/${projectId}/requirements`, {
      method: 'POST',
      body: JSON.stringify({ ...req, project_id: projectId }),
    }),

  updateRequirement: (
    projectId: string,
    reqId: string,
    updates: Partial<Requirement>
  ) =>
    request<Requirement>(`/projects/${projectId}/requirements/${reqId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  clarifyRequirement: (
    projectId: string,
    reqId: string,
    action: string,
    customStatement?: string,
    issueId?: string
  ) =>
    request<{ status: string; requirement: Requirement }>(
      `/projects/${projectId}/requirements/${reqId}/clarify`,
      {
        method: 'POST',
        body: JSON.stringify({
          action,
          custom_statement: customStatement,
          issue_id: issueId,
        }),
      }
    ),

  // AI Pipeline Analysis
  runAnalysis: (
    projectId: string,
    userName = 'Lead Analyst',
    userRole = 'Business Analyst'
  ) =>
    request<any>(`/projects/${projectId}/analyze`, {
      method: 'POST',
      body: JSON.stringify({
        user_name: userName,
        user_role: userRole,
      }),
    }),

  getPipelineStages: (projectId: string) =>
    request<{
      project_id: string;
      current_stage: string;
      stages: Array<{
        name: string;
        status: string;
        detail: string;
      }>;
    }>(`/projects/${projectId}/analyze/stages`),

  // Interview Elicitation
  getInterviewTranscript: (projectId: string) =>
    request<InterviewMessage[]>(`/projects/${projectId}/interview`),

  sendInterviewMessage: (projectId: string, userMessage: string) =>
    request<{
      reply: string;
      agent_name: string;
      missing_aspects_probed: string[];
      suggested_followups: string[];
      candidate_requirements_found: number;
    }>(`/projects/${projectId}/interview/message`, {
      method: 'POST',
      body: JSON.stringify({
        project_id: projectId,
        user_message: userMessage,
      }),
    }),

  extractInterviewRequirements: (projectId: string) =>
    request<{
      status: string;
      extracted_requirements: number;
      total_requirements: number;
    }>(`/projects/${projectId}/interview/extract`, {
      method: 'POST',
    }),

  // Compliance
  getComplianceReport: (projectId: string) =>
    request<ComplianceReport>(`/projects/${projectId}/compliance`),

  approveComplianceMapping: (
    projectId: string,
    mappingId: string,
    officerName: string,
    decision: string,
    notes?: string
  ) =>
    request<any>(
      `/projects/${projectId}/compliance/${mappingId}/approve`,
      {
        method: 'POST',
        body: JSON.stringify({
          officer_name: officerName,
          decision,
          notes,
        }),
      }
    ),

  // Risks
  getRiskSummary: (projectId: string) =>
    request<RiskSummary>(`/projects/${projectId}/risks`),

  // SDLC
  getSDLCRecommendation: (projectId: string) =>
    request<SDLCRecommendation>(`/projects/${projectId}/sdlc`),

  reevaluateSDLC: (projectId: string, factors: ProjectFactors) =>
    request<SDLCRecommendation>(`/projects/${projectId}/sdlc/evaluate`, {
      method: 'POST',
      body: JSON.stringify(factors),
    }),

  recordSDLCDecision: (
    projectId: string,
    decision: string,
    userName: string,
    userRole: string,
    comments?: string,
    selectedModel?: string
  ) =>
    request<{
      status: string;
      recommendation: SDLCRecommendation;
    }>(`/projects/${projectId}/sdlc/decision`, {
      method: 'POST',
      body: JSON.stringify({
        decision,
        user_name: userName,
        user_role: userRole,
        comments,
        selected_model: selectedModel,
      }),
    }),

  // Traceability
  getTraceability: (projectId: string) =>
    request<TraceabilityGraph>(`/projects/${projectId}/traceability`),

  // Documents & SRS Generation
  getDocuments: (projectId: string) =>
    request<DocumentMetadata[]>(`/projects/${projectId}/documents`),

  uploadDocument: async (
    projectId: string,
    file: File,
    docType: string,
    jurisdiction: string,
    version: string
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', docType);
    formData.append('jurisdiction', jurisdiction);
    formData.append('version', version);

    const token = localStorage.getItem('access_token');
    const res = await fetch(
      `${API_BASE}/projects/${projectId}/documents/upload`,
      {
        method: 'POST',
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
        body: formData,
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Upload failed (${res.status})`);
    }

    return (await res.json()) as DocumentMetadata;
  },

  generateDocument: (
    projectId: string,
    formatType: 'markdown' | 'docx' | 'pdf',
    docType = 'SRS'
  ) =>
    request<{
      status: string;
      format: string;
      filename: string;
      download_url: string;
      preview?: string;
    }>(`/projects/${projectId}/documents/generate`, {
      method: 'POST',
      body: JSON.stringify({
        format_type: formatType,
        doc_type: docType,
      }),
    }),

  // Approvals
  getApprovals: (projectId?: string, role?: string) => {
    const params = new URLSearchParams();
    if (projectId) params.append('project_id', projectId);
    if (role && role !== 'All') params.append('role', role);

    return request<ApprovalRequest[]>(
      `/approvals${params.toString() ? `?${params.toString()}` : ''}`
    );
  },

  recordApprovalAction: (
    approvalId: string,
    decision: string,
    notes: string,
    actorName: string,
    actorRole: string
  ) =>
    request<ApprovalRequest>(`/approvals/${approvalId}/action`, {
      method: 'POST',
      body: JSON.stringify({
        decision,
        notes,
        actor_name: actorName,
        actor_role: actorRole,
      }),
    }),

  // Audit Logs
  getAuditLogs: (
    projectId?: string,
    role?: string,
    limit = 50
  ) => {
    const params = new URLSearchParams();
    if (projectId) params.append('project_id', projectId);
    if (role && role !== 'All') params.append('user_role', role);
    params.append('limit', limit.toString());

    return request<AuditLogEntry[]>(`/audit-logs?${params.toString()}`);
  },

  // Evaluation and benchmarking
  getEvaluation: (projectId: string) =>
    request<ProjectEvaluation>(`/projects/${projectId}/evaluation`),

  getEvaluationBenchmark: () =>
    request<any>('/evaluation/benchmark'),

  // Knowledge Base
  getKnowledgeBase: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') {
      params.append('category', category);
    }
    if (search) params.append('search', search);

    return request<KnowledgeBaseItem[]>(
      `/knowledge-base?${params.toString()}`
    );
  },
};
