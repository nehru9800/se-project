
import React from 'react';
import {
  Building2, CheckSquare, AlertOctagon, ShieldAlert, AlertTriangle,
  CheckCircle, ArrowUpRight, TrendingUp, ShieldCheck, Activity,
  GitBranch, Play, Clock, Sparkles, UserCheck, Shield, Lock,
  Cpu, Scale, FileText, CheckCircle2, ChevronRight, Layers,
  Users, Zap, Terminal
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from 'recharts';

import {
  Project,
  Requirement,
  ComplianceReport,
  RiskSummary,
  SDLCRecommendation,
  AuditLogEntry,
  UserRole
} from '../types';

interface DashboardViewProps {
  project: Project;
  requirements: Requirement[];
  compliance: ComplianceReport | null;
  risks: RiskSummary | null;
  sdlc: SDLCRecommendation | null;
  auditLogs: AuditLogEntry[];
  userRole?: UserRole;
  onChangeRole?: (role: UserRole) => void;
  onNavigate: (tab: any) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
}

interface KPI {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color: string;
  tab: string;
}

interface ChartItem {
  name: string;
  count?: number;
  value?: number;
  fill?: string;
  color?: string;
}

interface Callout {
  title: string;
  desc: string;
  tab: string;
  severity: 'high' | 'medium' | 'info';
}

interface RoleConfig {
  title: string;
  subtitle: string;
  authority: string;
  badgeClass: string;
  gradientClass: string;
  icon: LucideIcon;
  urgentDirective: {
    title: string;
    description: string;
    actionText: string;
    actionTab: string;
    badge: string;
    badgeColor: string;
  };
  kpis: KPI[];
  chart1: {
    title: string;
    data: ChartItem[];
  };
  chart2: {
    title: string;
    data: ChartItem[];
  };
  radarTitle: string;
  radarData: { subject: string; score: number }[];
  callouts: Callout[];
}

const COLORS = {
  blue: '#3b82f6',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#f43f5e',
  purple: '#a855f7',
  slate: '#64748b'
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  requirements,
  compliance,
  risks,
  sdlc,
  auditLogs,
  userRole = 'Business Analyst',
  onChangeRole,
  onNavigate,
  onRunAnalysis,
  isAnalyzing
}) => {
  const allRoles: UserRole[] = [
    'Business Analyst',
    'Compliance Officer',
    'Security Officer',
    'Risk Manager',
    'Developer/Architect',
    'Project Manager',
    'Stakeholder',
    'Administrator'
  ];

  // Live project metrics with demo fallbacks when data is unavailable.
  const totalReqs = requirements.length || 14;
  const actualApproved = requirements.filter(
    r => r.approval_status === 'Approved'
  ).length;

  const approvedReqs = requirements.length ? actualApproved : 10;

  const actualIssues = requirements.reduce(
    (count, requirement) =>
      count + (requirement.quality_issues?.length || 0),
    0
  );

  const openIssues = requirements.length ? actualIssues : 3;

  const complianceGaps = compliance?.gap_count ?? 1;
  const highRisks =
    ((risks?.critical_count || 0) + (risks?.high_count || 0)) || 4;

  const pendingApprovals = compliance?.pending_approval_count ?? 2;
  const complianceScore = compliance?.overall_compliance_score ?? 94.2;

  const approvedPercentage = totalReqs
    ? Math.round((approvedReqs / totalReqs) * 100)
    : 0;

  const getRoleConfig = (role: UserRole): RoleConfig => {
    const businessAnalyst: RoleConfig = {
      title: 'Requirements Engineering, Elicitation & Quality Command',
      subtitle:
        'IEEE-830 statement normalization, multi-label classification, ambiguity detection, and stakeholder interview transcripts.',
      authority: 'Requirements Baseline Authority',
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      gradientClass:
        'from-blue-900/40 via-indigo-950/40 to-slate-900 border-blue-500/20',
      icon: CheckSquare,
      urgentDirective: {
        title: 'Action Required: 3 Ambiguities Detected in Requirement Baseline',
        description:
          'Multi-Agent Quality Checker flagged vague latency qualifiers ("instant", "high-speed") and missing SLA error-rate thresholds in FR-DISB-001 and FR-CRED-002.',
        actionText: 'Resolve in Quality Checker',
        actionTab: 'quality',
        badge: '3 Open Issues',
        badgeColor:
          'bg-amber-500/20 text-amber-300 border-amber-500/30'
      },
      kpis: [
        {
          label: 'Total Requirements',
          value: `${totalReqs}`,
          sub: `${approvedReqs} Approved (${approvedPercentage}%)`,
          icon: CheckSquare,
          color: 'text-blue-400',
          tab: 'requirements'
        },
        {
          label: 'Quality & Ambiguity Gaps',
          value: `${openIssues || 6}`,
          sub: 'Vague terms & SLA gaps',
          icon: AlertOctagon,
          color: 'text-amber-400',
          tab: 'quality'
        },
        {
          label: 'AI Elicitation Interview',
          value: 'Interactive',
          sub: 'Interactive stakeholder sessions',
          icon: Sparkles,
          color: 'text-purple-400',
          tab: 'interview'
        },
        {
          label: 'Policy Contradictions',
          value: '1 Flagged',
          sub: 'Instant disbursement conflict',
          icon: ShieldAlert,
          color: 'text-rose-400',
          tab: 'quality'
        },
        {
          label: 'SRS Export Readiness',
          value: 'Ready',
          sub: 'IEEE-830 Compliant',
          icon: FileText,
          color: 'text-emerald-400',
          tab: 'documents'
        },
        {
          label: 'Pending Human Approvals',
          value: `${pendingApprovals}`,
          sub: 'Signoff gates required',
          icon: CheckCircle2,
          color: 'text-blue-400',
          tab: 'approvals'
        }
      ],
      chart1: {
        title: 'Requirements by Category (Multi-Label)',
        data: [
          { name: 'Functional', count: 8, fill: COLORS.blue },
          { name: 'Security', count: 6, fill: COLORS.red },
          { name: 'Regulatory', count: 5, fill: COLORS.purple },
          { name: 'SLA / Performance', count: 4, fill: COLORS.amber },
          { name: 'Privacy (GLBA)', count: 3, fill: COLORS.green }
        ]
      },
      chart2: {
        title: 'Quality Issue Severity Breakdown',
        data: [
          { name: 'Ambiguous Wording', value: 2, color: COLORS.amber },
          { name: 'Missing SLA Threshold', value: 1, color: COLORS.red },
          { name: 'Baseline Stable', value: 11, color: COLORS.green }
        ]
      },
      radarTitle: 'Requirements Maturity Radar',
      radarData: [
        { subject: 'Atomicity', score: 92 },
        { subject: 'Testability', score: 85 },
        { subject: 'Completeness', score: 88 },
        { subject: 'Unambiguity', score: 79 },
        { subject: 'Traceability', score: 95 }
      ],
      callouts: [
        {
          title: 'FR-DISB-001 Ambiguity Revision',
          desc: 'Clarify "Instant disbursement" with a quantifiable 3.0s SLA and explicit $25,000 threshold clause.',
          tab: 'quality',
          severity: 'high'
        },
        {
          title: 'Interactive AI Interview Turn',
          desc: 'Stakeholder Interaction Agent identified a missing CFPB Reg Z disclosure clause in a recent interview.',
          tab: 'interview',
          severity: 'medium'
        },
        {
          title: 'Full Traceability Matrix Validated',
          desc: '14 functional requirements mapped bidirectionally to source policies and verification tests.',
          tab: 'traceability',
          severity: 'info'
        }
      ]
    };

    const complianceOfficer: RoleConfig = {
      title: 'Regulatory Audit & Statutory Compliance Control Center',
      subtitle:
        'Grounding functional requirements against banking mandates including GLBA, CFPB Reg Z, SOX 404 and FFIEC.',
      authority: 'Statutory Sign-off Authority',
      badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      gradientClass:
        'from-purple-950/50 via-slate-900 to-indigo-950/40 border-purple-500/30',
      icon: Scale,
      urgentDirective: {
        title: 'Action Required: FFIEC Large-Disbursement Dual Authorization Exception',
        description:
          'FR-DISB-001 enables instant disbursement, which conflicts with dual-custody controls for wires exceeding $25,000. Regulatory review is required.',
        actionText: 'Review Compliance Mappings',
        actionTab: 'compliance',
        badge: '1 Regulatory Gap',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
      },
      kpis: [
        {
          label: 'Overall RAG Compliance',
          value: `${complianceScore}%`,
          sub: 'GLBA, CFPB, SOX 404, FFIEC',
          icon: ShieldCheck,
          color: 'text-emerald-400',
          tab: 'compliance'
        },
        {
          label: 'Statutory Gaps',
          value: `${complianceGaps}`,
          sub: 'Requires regulatory review',
          icon: ShieldAlert,
          color: 'text-rose-400',
          tab: 'compliance'
        },
        {
          label: 'RAG Grounded Citations',
          value: '14 Citations',
          sub: 'Regulatory evidence references',
          icon: FileText,
          color: 'text-purple-400',
          tab: 'compliance'
        },
        {
          label: 'CFPB Reg Z 3-Day Clock',
          value: '72h Active',
          sub: 'Loan Estimate delivery',
          icon: Clock,
          color: 'text-amber-400',
          tab: 'interview'
        },
        {
          label: 'Compliance Gate Approvals',
          value: `${pendingApprovals} Pending`,
          sub: 'Dual authorization sign-off',
          icon: CheckCircle2,
          color: 'text-blue-400',
          tab: 'approvals'
        },
        {
          label: 'Willful Non-Compliance',
          value: 'Review Required',
          sub: 'Unmapped mandates',
          icon: Shield,
          color: 'text-emerald-400',
          tab: 'compliance'
        }
      ],
      chart1: {
        title: 'Statutory Mandates Distribution',
        data: [
          { name: 'GLBA Safeguards', count: 5, fill: COLORS.purple },
          { name: 'CFPB Reg Z', count: 4, fill: '#8b5cf6' },
          { name: 'SOX 404 Audit', count: 3, fill: '#6366f1' },
          { name: 'FFIEC Security', count: 2, fill: '#ec4899' }
        ]
      },
      chart2: {
        title: 'Compliance Status Distribution',
        data: [
          { name: 'Compliant (Grounded)', value: 12, color: COLORS.green },
          { name: 'Pending Review', value: 1, color: COLORS.amber },
          { name: 'Statutory Gap', value: 1, color: COLORS.red }
        ]
      },
      radarTitle: 'Regulatory Framework Rigor',
      radarData: [
        { subject: 'GLBA Data Privacy', score: 95 },
        { subject: 'CFPB Disclosures', score: 92 },
        { subject: 'SOX Auditability', score: 98 },
        { subject: 'FFIEC Controls', score: 85 },
        { subject: 'Anti-Redlining / ECOA', score: 90 }
      ],
      callouts: [
        {
          title: 'CFPB Statutory 3-Day Clock',
          desc: 'Regulation Z requires timestamp verification on delivery of the Loan Estimate.',
          tab: 'compliance',
          severity: 'high'
        },
        {
          title: 'GLBA § 501(b) Encryption Boundary',
          desc: 'Credit bureau payloads require secure transmission and protection of non-public information.',
          tab: 'requirements',
          severity: 'medium'
        },
        {
          title: 'SOX 404 Immutable Retention',
          desc: 'Underwriting decision audit trails require tamper-evident retention controls.',
          tab: 'audit',
          severity: 'info'
        }
      ]
    };

    const securityOfficer: RoleConfig = {
      title: 'Cybersecurity, Cryptography & Threat Modeling Command',
      subtitle:
        'STRIDE threat assessment, encryption at rest and in transit, and zero-trust credential boundaries.',
      authority: 'Cryptographic & Architecture Gatekeeper',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      gradientClass:
        'from-rose-950/50 via-slate-900 to-slate-950 border-rose-500/30',
      icon: ShieldAlert,
      urgentDirective: {
        title: 'Action Required: STRIDE Threat Surface Sign-off',
        description:
          'Credit score aggregation introduces tampering and privilege elevation vectors. Key rotation and mutual TLS controls require review.',
        actionText: 'Inspect STRIDE Threat Modeling',
        actionTab: 'risks',
        badge: '2 Critical Vectors',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
      },
      kpis: [
        {
          label: 'STRIDE Threat Surface',
          value: '2 Flagged',
          sub: 'Tampering & Privilege Elevation',
          icon: ShieldAlert,
          color: 'text-rose-400',
          tab: 'risks'
        },
        {
          label: 'Cryptographic Standard',
          value: 'AES-256-GCM',
          sub: 'Encryption at rest',
          icon: Lock,
          color: 'text-emerald-400',
          tab: 'requirements'
        },
        {
          label: 'PII / NPI Masking Boundary',
          value: 'Strict Tokenization',
          sub: 'Sensitive data protection',
          icon: Shield,
          color: 'text-purple-400',
          tab: 'compliance'
        },
        {
          label: 'Critical Security Risks',
          value: '1 Critical',
          sub: 'Third-party bureau API',
          icon: AlertTriangle,
          color: 'text-amber-400',
          tab: 'risks'
        },
        {
          label: 'DevSecOps SAST/DAST Gate',
          value: 'Pre-Deploy',
          sub: 'Security verification',
          icon: Cpu,
          color: 'text-blue-400',
          tab: 'sdlc'
        },
        {
          label: 'Pending Security Signoffs',
          value: '1 Awaiting',
          sub: 'Key management review',
          icon: CheckCircle2,
          color: 'text-rose-400',
          tab: 'approvals'
        }
      ],
      chart1: {
        title: 'STRIDE Threat Vectors Identified',
        data: [
          { name: 'Tampering', count: 3, fill: COLORS.red },
          { name: 'Elevation of Priv', count: 2, fill: '#fb7185' },
          { name: 'Info Disclosure', count: 2, fill: '#f97316' },
          { name: 'Repudiation', count: 1, fill: COLORS.amber },
          { name: 'Denial of Service', count: 1, fill: COLORS.blue }
        ]
      },
      chart2: {
        title: 'Security Control Coverage',
        data: [
          { name: 'AES-256-GCM', value: 5, color: COLORS.green },
          { name: 'TLS 1.3', value: 4, color: COLORS.blue },
          { name: 'PII Tokenization', value: 3, color: COLORS.purple },
          { name: 'Dual-Key Escrow', value: 2, color: COLORS.red }
        ]
      },
      radarTitle: 'Defense-in-Depth Posture',
      radarData: [
        { subject: 'Perimeter Tokenization', score: 92 },
        { subject: 'Auth & RBAC', score: 96 },
        { subject: 'Crypto Standard', score: 98 },
        { subject: 'Threat Resiliency', score: 86 },
        { subject: 'Audit Immutability', score: 94 }
      ],
      callouts: [
        {
          title: 'Credit Bureau Credential Isolation',
          desc: 'Third-party API credentials should be stored in a protected secrets vault with rotation.',
          tab: 'risks',
          severity: 'high'
        },
        {
          title: 'Underwriter Session Revocation',
          desc: 'High-privilege sessions should enforce MFA and appropriate idle timeouts.',
          tab: 'requirements',
          severity: 'medium'
        },
        {
          title: 'Cryptographic Audit Trail Signing',
          desc: 'Ledger state changes should be protected against unauthorized modification.',
          tab: 'audit',
          severity: 'info'
        }
      ]
    };

    const riskManager: RoleConfig = {
      title: 'Enterprise Risk Management & 5x5 Matrix Command',
      subtitle:
        'Likelihood versus impact assessment, policy contradiction mitigation, and credit exposure limits.',
      authority: '5x5 Risk Matrix Sign-off',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      gradientClass:
        'from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/30',
      icon: AlertTriangle,
      urgentDirective: {
        title: 'Action Required: Credit Bureau API Outage & Disbursement Exposure',
        description:
          'Critical operational risks require mitigation review and authorization of fallback processing.',
        actionText: 'Review 5x5 Risk Register',
        actionTab: 'risks',
        badge: '2 Critical Risks',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      },
      kpis: [
        {
          label: 'Composite Risk Index',
          value: 'High (72/100)',
          sub: 'Mitigation approval required',
          icon: AlertTriangle,
          color: 'text-rose-400',
          tab: 'risks'
        },
        {
          label: 'Critical / High Exposures',
          value: `${highRisks}`,
          sub: 'Project risk records',
          icon: ShieldAlert,
          color: 'text-amber-400',
          tab: 'risks'
        },
        {
          label: 'Policy Contradictions',
          value: '1 Active Conflict',
          sub: 'Disbursement vs dual authorization',
          icon: AlertOctagon,
          color: 'text-amber-400',
          tab: 'quality'
        },
        {
          label: 'Residual Risk Target',
          value: 'Low-Medium',
          sub: 'Following mitigation',
          icon: TrendingUp,
          color: 'text-emerald-400',
          tab: 'risks'
        },
        {
          label: 'Financial Threshold Ceiling',
          value: '> $25,000',
          sub: 'Two-person custody review',
          icon: Building2,
          color: 'text-blue-400',
          tab: 'compliance'
        },
        {
          label: 'Risk Acceptance Signoffs',
          value: '1 Pending',
          sub: 'Officer sign-off',
          icon: CheckCircle2,
          color: 'text-purple-400',
          tab: 'approvals'
        }
      ],
      chart1: {
        title: 'Risk Categories Exposure',
        data: [
          { name: 'Operational Failure', count: 4, fill: COLORS.amber },
          { name: 'Regulatory Penalty', count: 3, fill: COLORS.red },
          { name: 'Credit Fraud', count: 3, fill: '#f97316' },
          { name: 'Data Breach', count: 2, fill: COLORS.purple }
        ]
      },
      chart2: {
        title: '5x5 Severity Distribution',
        data: [
          {
            name: 'Critical',
            value: risks?.critical_count || 2,
            color: COLORS.red
          },
          {
            name: 'High',
            value: risks?.high_count || 2,
            color: '#f97316'
          },
          {
            name: 'Medium',
            value: risks?.medium_count || 1,
            color: COLORS.amber
          },
          {
            name: 'Low',
            value: risks?.low_count || 0,
            color: COLORS.green
          }
        ]
      },
      radarTitle: 'Multi-Dimensional Risk Exposure',
      radarData: [
        { subject: 'Operational Delay', score: 88 },
        { subject: 'Financial Fraud', score: 75 },
        { subject: 'Regulatory Sanctions', score: 92 },
        { subject: 'Reputational Damage', score: 82 },
        { subject: 'Systemic Availability', score: 78 }
      ],
      callouts: [
        {
          title: 'Credit Bureau Outage Fallback',
          desc: 'Define fallback behavior when an external credit bureau is unavailable.',
          tab: 'risks',
          severity: 'high'
        },
        {
          title: 'Disbursement Exceeding $25,000',
          desc: 'Review dual authorization requirements for high-value transfers.',
          tab: 'compliance',
          severity: 'high'
        },
        {
          title: 'Underwriting Algorithm Drift',
          desc: 'Schedule fair-lending and model-performance monitoring.',
          tab: 'requirements',
          severity: 'medium'
        }
      ]
    };

    const developer: RoleConfig = {
      title: 'Software Architecture, SDLC Models & Engineering Governance',
      subtitle:
        'V-Model verification rigor, service latency SLAs, and automated CI/CD branch guardrails.',
      authority: 'Architecture & SDLC Gatekeeper',
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      gradientClass:
        'from-blue-950/50 via-slate-900 to-indigo-950/40 border-blue-500/30',
      icon: Cpu,
      urgentDirective: {
        title: 'Architecture Recommendation: Hybrid DevSecOps + V-Model',
        description:
          'The current rule engine recommends a hybrid approach based on regulatory criticality and deployment needs.',
        actionText: 'Inspect SDLC Model & Phases',
        actionTab: 'sdlc',
        badge: 'Recommended Model',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      },
      kpis: [
        {
          label: 'Recommended SDLC Model',
          value: 'Hybrid V-Model',
          sub: 'Rule engine recommendation',
          icon: GitBranch,
          color: 'text-blue-400',
          tab: 'sdlc'
        },
        {
          label: 'Round-Trip Latency SLA',
          value: '< 2.5 Seconds',
          sub: 'Bureau aggregation target',
          icon: Zap,
          color: 'text-amber-400',
          tab: 'requirements'
        },
        {
          label: 'External Integrations',
          value: '4 Endpoints',
          sub: 'Bureau, KYC and banking',
          icon: Layers,
          color: 'text-purple-400',
          tab: 'traceability'
        },
        {
          label: 'Traceability Graph',
          value: '100% Target',
          sub: 'Forward link integrity',
          icon: Activity,
          color: 'text-emerald-400',
          tab: 'traceability'
        },
        {
          label: 'Formal Verification',
          value: 'Mandatory',
          sub: 'Acceptance test mapping',
          icon: CheckSquare,
          color: 'text-blue-400',
          tab: 'sdlc'
        },
        {
          label: 'CI/CD Guardrails',
          value: 'SAST & Sonar',
          sub: 'Automated quality gates',
          icon: Cpu,
          color: 'text-emerald-400',
          tab: 'sdlc'
        }
      ],
      chart1: {
        title: 'SDLC Model Multi-Criteria Scores',
        data: sdlc?.model_scores?.slice(0, 5).map(m => ({
          name: m.model_name.replace(
            ' (DevSecOps + V-Model Verification)',
            ' (Hybrid)'
          ),
          count: m.score,
          fill: m.is_recommended ? COLORS.blue : COLORS.slate
        })) || [
          { name: 'Hybrid', count: 96.5, fill: COLORS.blue },
          { name: 'DevSecOps', count: 94, fill: COLORS.slate },
          { name: 'V-Model', count: 91.5, fill: COLORS.slate },
          { name: 'Spiral', count: 88, fill: COLORS.slate },
          { name: 'Agile', count: 85, fill: COLORS.slate }
        ]
      },
      chart2: {
        title: 'Verification Testability Distribution',
        data: [
          { name: 'Automated CI/CD', value: 8, color: COLORS.blue },
          { name: 'Formal Acceptance', value: 4, color: COLORS.green },
          { name: 'Manual Audit', value: 2, color: COLORS.amber }
        ]
      },
      radarTitle: 'Architectural Suitability Radar',
      radarData: [
        { subject: 'Regulatory Rigor', score: 94 },
        { subject: 'Deployment Velocity', score: 88 },
        { subject: 'Traceability Depth', score: 96 },
        { subject: 'Fault Tolerance', score: 90 },
        { subject: 'API Modularity', score: 92 }
      ],
      callouts: [
        {
          title: 'Bureau Fallback Timeout',
          desc: 'Define service timeout and circuit-breaker behavior for bureau integrations.',
          tab: 'requirements',
          severity: 'medium'
        },
        {
          title: 'Immutable Ledger Hook',
          desc: 'Protect underwriting event history against unauthorized modification.',
          tab: 'traceability',
          severity: 'info'
        },
        {
          title: 'Automated Formal Verification',
          desc: 'Map acceptance tests to the applicable functional requirements.',
          tab: 'sdlc',
          severity: 'info'
        }
      ]
    };

    const projectManager: RoleConfig = {
      title: 'Project Governance, Delivery Gates & SDLC Decision Support',
      subtitle:
        'Milestone tracking, cross-functional sign-offs, budget allocation and risk mitigation.',
      authority: 'SDLC Model & Milestone Sign-off',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      gradientClass:
        'from-sky-950/40 via-slate-900 to-indigo-950/40 border-sky-500/30',
      icon: Building2,
      urgentDirective: {
        title: 'Action Required: Human-in-the-Loop SDLC Model Sign-off',
        description:
          'The multi-agent engine recommends a Hybrid model. Project Manager approval or modification is required.',
        actionText: 'Review SDLC Recommendation',
        actionTab: 'sdlc',
        badge: 'Pending PM Signoff',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
      },
      kpis: [
        {
          label: 'SDLC Approval Gate',
          value: sdlc?.approval_status || 'Pending Signoff',
          sub: 'Hybrid model recommended',
          icon: GitBranch,
          color: 'text-amber-400',
          tab: 'sdlc'
        },
        {
          label: 'Delivery Schedule',
          value: project.timeline || '14 Months',
          sub: 'Target production cutover',
          icon: Clock,
          color: 'text-sky-400',
          tab: 'workspace'
        },
        {
          label: 'Budget Allocation',
          value: project.budget || '$3,200,000',
          sub: 'Project funding',
          icon: Building2,
          color: 'text-emerald-400',
          tab: 'workspace'
        },
        {
          label: 'Approved Requirements',
          value: `${approvedReqs} / ${totalReqs}`,
          sub: `${approvedPercentage}% baseline approved`,
          icon: CheckSquare,
          color: 'text-emerald-400',
          tab: 'requirements'
        },
        {
          label: 'Cross-Role Approval Gates',
          value: `${pendingApprovals} Pending`,
          sub: 'Compliance, Security and Risk',
          icon: Users,
          color: 'text-purple-400',
          tab: 'approvals'
        },
        {
          label: 'Delivery Confidence',
          value: '91% (High)',
          sub: 'Indicative project estimate',
          icon: TrendingUp,
          color: 'text-blue-400',
          tab: 'workspace'
        }
      ],
      chart1: {
        title: 'Approval Pipeline by Department',
        data: [
          { name: 'Business Requirements', count: 11, fill: COLORS.green },
          { name: 'Compliance Signoff', count: 1, fill: COLORS.purple },
          { name: 'Security Architecture', count: 1, fill: COLORS.red },
          { name: 'Risk Acceptance', count: 1, fill: COLORS.amber }
        ]
      },
      chart2: {
        title: 'Project Phase Status',
        data: [
          { name: 'Requirements', value: 90, color: COLORS.green },
          { name: 'Statutory Verification', value: 75, color: COLORS.blue },
          { name: 'Architecture', value: 60, color: COLORS.purple },
          { name: 'Implementation', value: 15, color: COLORS.slate }
        ]
      },
      radarTitle: 'Governance & Readiness Dimensions',
      radarData: [
        { subject: 'Scope Clarity', score: 85 },
        { subject: 'Compliance Readiness', score: 94 },
        { subject: 'Security Readiness', score: 92 },
        { subject: 'Resource Availability', score: 88 },
        { subject: 'Schedule Buffer', score: 80 }
      ],
      callouts: [
        {
          title: 'Phase 1 Requirements Freeze',
          desc: 'Schedule the baseline freeze after flagged ambiguities are resolved.',
          tab: 'quality',
          severity: 'medium'
        },
        {
          title: 'SDLC Workflow Transition',
          desc: 'Review the Hybrid model and its workflow phases.',
          tab: 'sdlc',
          severity: 'info'
        },
        {
          title: 'Audit Readiness Review',
          desc: 'Review the SRS and traceability matrix for oversight.',
          tab: 'documents',
          severity: 'info'
        }
      ]
    };

    const stakeholder: RoleConfig = {
      title: 'Executive Stakeholder Value & Commercial Outcomes Dashboard',
      subtitle:
        'Origination turnaround reduction, business objective alignment, customer journey acceleration and SRS export.',
      authority: 'Investment & Scope Authority',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      gradientClass:
        'from-emerald-950/40 via-slate-900 to-indigo-950/40 border-emerald-500/30',
      icon: Users,
      urgentDirective: {
        title: 'Commercial Objective: Turnaround Reduction from 14 Days to Under 4 Hours',
        description:
          'Automated KYC, credit score aggregation and statutory disclosure dispatch are included in the proposed baseline.',
        actionText: 'Download Executive SRS Document',
        actionTab: 'documents',
        badge: '320% ROI Target',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      },
      kpis: [
        {
          label: 'Turnaround Reduction',
          value: '14 Days → <4h',
          sub: 'Target commercial credit speed',
          icon: Zap,
          color: 'text-emerald-400',
          tab: 'workspace'
        },
        {
          label: 'Approved Scope',
          value: `${approvedReqs} of ${totalReqs}`,
          sub: `${approvedPercentage}% requirements approved`,
          icon: CheckSquare,
          color: 'text-blue-400',
          tab: 'requirements'
        },
        {
          label: 'Regulatory Clearance',
          value: 'Review Required',
          sub: 'Compliance evidence available',
          icon: ShieldCheck,
          color: 'text-purple-400',
          tab: 'compliance'
        },
        {
          label: 'Projected Efficiency',
          value: '+320% ROI',
          sub: 'Target business outcome',
          icon: TrendingUp,
          color: 'text-emerald-400',
          tab: 'workspace'
        },
        {
          label: 'Executive SRS Package',
          value: 'Generated',
          sub: 'Document export options',
          icon: FileText,
          color: 'text-blue-400',
          tab: 'documents'
        },
        {
          label: 'Go/No-Go Posture',
          value: 'Favorable (91%)',
          sub: 'Indicative readiness',
          icon: CheckCircle2,
          color: 'text-emerald-400',
          tab: 'sdlc'
        }
      ],
      chart1: {
        title: 'User Journeys Impacted',
        data: [
          { name: 'Commercial Borrowers', count: 6, fill: COLORS.green },
          { name: 'Loan Officers', count: 4, fill: COLORS.blue },
          { name: 'Risk Underwriters', count: 3, fill: COLORS.purple },
          { name: 'Compliance Auditors', count: 2, fill: COLORS.amber }
        ]
      },
      chart2: {
        title: 'Feature Baseline Status',
        data: [
          { name: 'Approved Features', value: approvedReqs, color: COLORS.green },
          { name: 'Clarification Needed', value: Math.max(totalReqs - approvedReqs, 0), color: COLORS.amber }
        ]
      },
      radarTitle: 'Business Objective Realization',
      radarData: [
        { subject: 'Customer Experience', score: 94 },
        { subject: 'Origination Speed', score: 96 },
        { subject: 'Regulatory Safety', score: 92 },
        { subject: 'Operational Cost', score: 90 },
        { subject: 'Underwriting Precision', score: 88 }
      ],
      callouts: [
        {
          title: 'Sub-4-Hour Commercial Decisioning',
          desc: 'Review the proposed automation and credit bureau integration requirements.',
          tab: 'requirements',
          severity: 'info'
        },
        {
          title: 'Executive Document Download',
          desc: 'Review the Software Requirements Specification for executive approval.',
          tab: 'documents',
          severity: 'info'
        },
        {
          title: 'Direct AI Elicitation Follow-up',
          desc: 'Use the AI Elicitation Agent to propose or clarify business requirements.',
          tab: 'interview',
          severity: 'info'
        }
      ]
    };

    const administrator: RoleConfig = {
      title: 'System Telemetry, Agent Coordination & Multi-Engine Administration',
      subtitle:
        'Agent coordination, vector knowledge collections, persistence health and LLM telemetry.',
      authority: 'System & Engine Administrator',
      badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      gradientClass:
        'from-indigo-950/50 via-slate-900 to-slate-950 border-indigo-500/30',
      icon: Terminal,
      urgentDirective: {
        title: 'System Health: Multi-Agent Subsystems',
        description:
          'Review the status of agent execution, persistence, model integration and audit logging.',
        actionText: 'Inspect System Audit Logs',
        actionTab: 'audit',
        badge: 'System Overview',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
      },
      kpis: [
        {
          label: 'Autonomous Agents',
          value: '10 Agents',
          sub: 'Configured pipeline components',
          icon: Cpu,
          color: 'text-indigo-400',
          tab: 'workspace'
        },
        {
          label: 'Vector RAG Knowledge Base',
          value: 'ChromaDB',
          sub: 'Regulatory knowledge store',
          icon: Layers,
          color: 'text-purple-400',
          tab: 'knowledge'
        },
        {
          label: 'Data Persistence Store',
          value: 'Configured',
          sub: 'Application persistence',
          icon: Activity,
          color: 'text-emerald-400',
          tab: 'audit'
        },
        {
          label: 'LLM Model Engine',
          value: 'Gemini',
          sub: 'Configured through backend',
          icon: Zap,
          color: 'text-amber-400',
          tab: 'interview'
        },
        {
          label: 'RBAC Enforcement',
          value: '8 Roles',
          sub: 'Role-based authorization',
          icon: UserCheck,
          color: 'text-blue-400',
          tab: 'approvals'
        },
        {
          label: 'Audit Trail Records',
          value: `${auditLogs.length} Events`,
          sub: 'Recorded activity entries',
          icon: FileText,
          color: 'text-emerald-400',
          tab: 'audit'
        }
      ],
      chart1: {
        title: 'Agent Executions by Pipeline Stage',
        data: [
          { name: 'Normalization', count: 14, fill: '#6366f1' },
          { name: 'Classification', count: 14, fill: '#8b5cf6' },
          { name: 'Compliance RAG', count: 14, fill: COLORS.purple },
          { name: 'Security', count: 14, fill: '#ec4899' },
          { name: 'Risk Engine', count: 14, fill: COLORS.red }
        ]
      },
      chart2: {
        title: 'System Subsystem Status',
        data: [
          { name: 'FastAPI Backend', value: 35, color: COLORS.green },
          { name: 'ChromaDB', value: 25, color: COLORS.blue },
          { name: 'Document Generators', value: 20, color: COLORS.purple },
          { name: 'Vite React Client', value: 20, color: '#06b6d4' }
        ]
      },
      radarTitle: 'Subsystem Reliability Metrics',
      radarData: [
        { subject: 'API Responsiveness', score: 98 },
        { subject: 'RAG Retrieval', score: 94 },
        { subject: 'Data Store Integrity', score: 100 },
        { subject: 'RBAC Boundary', score: 96 },
        { subject: 'Pipeline Orchestration', score: 95 }
      ],
      callouts: [
        {
          title: 'Vector Store Regulatory Index',
          desc: 'Review the regulatory knowledge base and retrieval configuration.',
          tab: 'knowledge',
          severity: 'info'
        },
        {
          title: 'LLM Multi-Provider Fallback',
          desc: 'Review configured model fallback behavior and error handling.',
          tab: 'interview',
          severity: 'info'
        },
        {
          title: 'Audit Trail Export',
          desc: 'Inspect recorded agent activity and audit events.',
          tab: 'audit',
          severity: 'info'
        }
      ]
    };

    switch (role) {
      case 'Compliance Officer':
        return complianceOfficer;
      case 'Security Officer':
        return securityOfficer;
      case 'Risk Manager':
        return riskManager;
      case 'Developer/Architect':
        return developer;
      case 'Project Manager':
        return projectManager;
      case 'Stakeholder':
        return stakeholder;
      case 'Administrator':
        return administrator;
      default:
        return businessAnalyst;
    }
  };

  const roleConfig = getRoleConfig(userRole);
  const RoleIcon = roleConfig.icon;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">

      {/* Persona Perspective Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Interactive Persona Perspective
            </div>
            <div className="text-xs text-slate-200">
              Active Dashboard Lens:{' '}
              <strong className="text-white font-bold">{userRole}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          {allRoles.map(role => {
            const selected = role === userRole;

            return (
              <button
                key={role}
                type="button"
                onClick={() => onChangeRole?.(role)}
                aria-pressed={selected}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                  selected
                    ? 'bg-blue-600 text-white shadow-glow-sm border border-blue-400/40 font-semibold'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <span>{role}</span>
                {selected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Welcome Banner */}
      <div
        className={`bg-gradient-to-r ${roleConfig.gradientClass} rounded-2xl p-6 relative overflow-hidden shadow-card-dark transition-all duration-300`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center flex-wrap gap-2">
              <span
                className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border flex items-center space-x-1.5 ${roleConfig.badgeClass}`}
              >
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{userRole} Mode</span>
              </span>

              <span className="text-xs text-slate-400 font-mono bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
                Authority: {roleConfig.authority}
              </span>

              <span className="text-xs text-slate-400 font-mono">
                • {project.financial_domain}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              {roleConfig.title}
            </h1>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {roleConfig.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('workspace')}
              className="px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              Workspace Pipeline
            </button>

            <button
              type="button"
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-sm flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {isAnalyzing ? 'Analyzing...' : 'Run Multi-Agent Analysis'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Directive */}
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-900 to-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 mt-0.5">
            <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>

          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                {roleConfig.urgentDirective.title}
              </span>

              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold border ${roleConfig.urgentDirective.badgeColor}`}
              >
                {roleConfig.urgentDirective.badge}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {roleConfig.urgentDirective.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate(roleConfig.urgentDirective.actionTab)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 whitespace-nowrap transition-colors flex-shrink-0"
        >
          <span>{roleConfig.urgentDirective.actionText}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {roleConfig.kpis.map((kpi, index) => {
          const KpiIcon = kpi.icon;

          return (
            <button
              type="button"
              key={`${kpi.label}-${index}`}
              onClick={() => onNavigate(kpi.tab)}
              className="text-left bg-slate-900/70 hover:bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium truncate pr-1">
                  {kpi.label}
                </span>
                <KpiIcon
                  className={`w-4 h-4 ${kpi.color} group-hover:scale-110 transition-transform flex-shrink-0`}
                />
              </div>

              <div className={`text-xl font-bold font-mono tracking-tight ${kpi.color}`}>
                {kpi.value}
              </div>

              <div className="text-[11px] text-slate-400 truncate">
                {kpi.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              {roleConfig.chart1.title}
            </h3>
            <span className="text-[11px] text-blue-400 font-mono font-medium">
              Domain Focus
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleConfig.chart1.data}>
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={55}
                />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {roleConfig.chart1.data.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={entry.fill || COLORS.blue}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              {roleConfig.chart2.title}
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Status Ratio
            </span>
          </div>

          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleConfig.chart2.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                >
                  {roleConfig.chart2.data.map((entry, index) => (
                    <Cell
                      key={`pie-${index}`}
                      fill={entry.color || COLORS.blue}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around text-xs flex-wrap gap-2">
            {roleConfig.chart2.data.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center space-x-1.5"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color || COLORS.blue }}
                />
                <span className="text-slate-400 text-[11px]">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              {roleConfig.radarTitle}
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono">
              Multi-Axis Audit
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={roleConfig.radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                />
                <PolarRadiusAxis
                  stroke="#475569"
                  angle={30}
                  domain={[0, 100]}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Stream and Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Audit Activity */}
        <div className="lg:col-span-2 bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Multi-Agent Activity & Audit Trail</span>
            </h3>

            <button
              type="button"
              onClick={() => onNavigate('audit')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <span>View Full Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.length > 0 ? (
              auditLogs.slice(0, 5).map(log => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start justify-between text-xs gap-3"
                >
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-semibold text-slate-200">
                        {log.action}
                      </span>

                      {log.agent_name && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20 font-mono">
                          {log.agent_name}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {log.output_summary}
                    </p>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                No audit activity is available for this project yet.
              </div>
            )}
          </div>
        </div>

        {/* Role Directives */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                {userRole} Directives
              </h3>

              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold border ${roleConfig.badgeClass}`}
              >
                Priority Focus
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Curated items flagged by the multi-agent engine requiring{' '}
              {userRole} oversight:
            </p>

            <div className="space-y-2.5">
              {roleConfig.callouts.map((callout, index) => (
                <button
                  type="button"
                  key={`${callout.title}-${index}`}
                  onClick={() => onNavigate(callout.tab)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    callout.severity === 'high'
                      ? 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/15'
                      : callout.severity === 'medium'
                        ? 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15'
                        : 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-bold">
                    <span
                      className={
                        callout.severity === 'high'
                          ? 'text-rose-400'
                          : callout.severity === 'medium'
                            ? 'text-amber-400'
                            : 'text-blue-400'
                      }
                    >
                      {callout.title}
                    </span>

                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  </div>

                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {callout.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
