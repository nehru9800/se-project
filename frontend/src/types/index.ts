export type UserRole = 
  | 'Stakeholder'
  | 'Business Analyst'
  | 'Developer/Architect'
  | 'Security Officer'
  | 'Compliance Officer'
  | 'Risk Manager'
  | 'Project Manager'
  | 'Administrator'
  | 'Super Admin';

export interface ProjectFactors {
  regulatory_criticality: number;
  security_criticality: number;
  requirement_volatility: number;
  project_complexity: number;
  system_size: string;
  legacy_dependency: number;
  continuous_deployment: boolean;
  stakeholder_availability: number;
  formal_verification_needed: boolean;
  consequences_of_failure: string;
  budget_flexibility: string;
  timeline_months: number;
}

export interface Project {
  id: string;
  name: string;
  financial_domain: string;
  description: string;
  business_objective: string;
  expected_users: string;
  project_size: string;
  budget: string;
  timeline: string;
  status: string;
  current_pipeline_stage: string;
  created_at: string;
  updated_at: string;
  owner: string;
  total_requirements: number;
  approved_requirements: number;
  compliance_score: number;
  risk_score: number;
  factors: ProjectFactors;
}

export type ProjectCreate = Partial<Project>;

export interface QualityIssue {
  issue_id: string;
  issue_type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  affected_text: string;
  suggested_clarification: string;
  suggested_revision?: string;
  status: 'Open' | 'Accepted' | 'Rejected' | 'Customized';
}

export interface Requirement {
  id: string;
  project_id: string;
  statement: string;
  categories: string[];
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  source_document?: string;
  original_stakeholder_statement?: string;
  business_justification?: string;
  assumptions: string[];
  dependencies: string[];
  acceptance_criteria: string[];
  status: 'Draft' | 'Pending Review' | 'Under Clarification' | 'Validated' | 'Approved' | 'Rejected' | 'Needs Review';
  confidence: number;
  confidence_rationale?: string;
  risk_level: 'Critical' | 'High' | 'Medium' | 'Low';
  compliance_status: 'Mapped' | 'Compliant' | 'Compliance Gap' | 'Needs Human Review' | 'Not Applicable';
  quality_issues: QualityIssue[];
  conflicts_with: string[];
  rag_evidence?: string;
  rag_source_citation?: string;
  approval_status: 'Pending' | 'Approved' | 'Rejected' | 'Changes Requested';
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceMapping {
  id: string;
  requirement_id: string;
  requirement_statement: string;
  regulation_name: string;
  control_id: string;
  control_description: string;
  evidence_quote: string;
  source_document: string;
  section: string;
  jurisdiction: string;
  effective_date: string;
  status: 'Compliant' | 'Compliance Gap' | 'Partial Compliance' | 'Needs Human Review';
  confidence: number;
  requires_human_approval: boolean;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  approved_by?: string;
  compliance_gap_notes?: string;
}

export interface ComplianceReport {
  project_id: string;
  total_controls: number;
  compliant_count: number;
  gap_count: number;
  pending_approval_count: number;
  overall_compliance_score: number;
  mappings: ComplianceMapping[];
}

export interface RiskItem {
  id: string;
  project_id: string;
  description: string;
  category: 'Business' | 'Technical' | 'Security' | 'Compliance' | 'Operational';
  likelihood: number;
  impact: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  severity_score: number;
  affected_requirement_id?: string;
  affected_requirement_statement?: string;
  mitigation_strategy: string;
  owner: string;
  status: 'Identified' | 'Mitigating' | 'Mitigated' | 'Accepted';
}

export interface RiskSummary {
  project_id: string;
  total_risks: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  risk_score: number;
  risks: RiskItem[];
}

export interface SDLCModelScore {
  model_name: string;
  score: number;
  is_recommended: boolean;
  suitability_level: string;
  supporting_factors: string[];
  potential_limitations: string[];
  applicable_conditions: string[];
}

export interface SDLCWorkflowPhase {
  step_number: number;
  phase_name: string;
  responsible_role: string;
  activities: string[];
  deliverables: string[];
  security_activities: string[];
  testing_focus: string[];
  compliance_checkpoint: string;
  approval_gate: string;
  entry_criteria: string;
  exit_criteria: string;
}

export interface SDLCRecommendation {
  project_id: string;
  recommended_model: string;
  confidence: number;
  rule_engine_version: string;
  model_scores: SDLCModelScore[];
  ai_generated_explanation: string;
  factor_weights_used: Record<string, number>;
  approval_status: 'Pending' | 'Approved' | 'Modified' | 'Rejected';
  approved_by?: string;
  approval_comments?: string;
  generated_workflow: SDLCWorkflowPhase[];
}

export interface TraceabilityItem {
  id: string;
  stakeholder_statement: string;
  requirement_id: string;
  requirement_statement: string;
  acceptance_criteria: string[];
  risk_id?: string;
  risk_title?: string;
  compliance_control_id?: string;
  compliance_control_title?: string;
  security_control?: string;
  test_case_id?: string;
  test_case_title?: string;
  sdlc_phase: string;
  verification_status: string;
}

export interface TraceabilityGraph {
  project_id: string;
  items: TraceabilityItem[];
  total_coverage_percentage: number;
}

export interface ApprovalRequest {
  id: string;
  project_id: string;
  item_type: string;
  item_id: string;
  title: string;
  description: string;
  target_role: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Changes Requested';
  requested_at: string;
  decided_at?: string;
  decided_by?: string;
  decision_notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  project_id?: string;
  user_name: string;
  user_role: string;
  action: string;
  agent_name?: string;
  input_summary?: string;
  output_summary?: string;
  retrieved_sources?: string;
  decision?: string;
  metadata?: Record<string, any>;
}

export interface DocumentMetadata {
  id: string;
  project_id: string;
  filename: string;
  document_type: string;
  upload_date: string;
  version: string;
  source: string;
  jurisdiction: string;
  effective_date: string;
  processing_status: string;
  chunk_count: number;
  extracted_text_preview?: string;
}

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  category: string;
  source: string;
  version: string;
  jurisdiction: string;
  effective_date: string;
  applicability: string;
  status: string;
  summary: string;
  key_controls: string[];
}

export interface InterviewMessage {
  id: string;
  role: 'agent' | 'user';
  agent_name?: string;
  content: string;
  timestamp: string;
  identified_domain_topics: string[];
  detected_missing_info: string[];
}


export interface ProjectEvaluation {
  project_id: string;
  project_name: string;
  generated_at: string;
  readiness_score: number;
  readiness_label: string;
  sample_size: { requirements: number; compliance_mappings: number; traceability_links: number; risks: number; approvals: number };
  metrics: { requirement_completeness: number; acceptance_criteria_testability: number; compliance_coverage: number; traceability_coverage: number; ambiguity_rate: number; conflict_rate: number; approval_resolution_rate: number };
  quality_indicators: { ambiguous_requirements: number; conflicted_requirements: number; open_quality_issues: number; critical_risks: number; high_risks: number; pending_approvals: number };
  limitations: string[];
}

