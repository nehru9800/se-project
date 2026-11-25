import json
import os
import threading
from typing import Dict, Any, List, Optional
from datetime import datetime

class DataStore:
    """
    Central thread-safe repository with JSON persistence and pre-seeded
    high-fidelity financial loan origination demo dataset.
    """
    _instance = None
    _lock = threading.Lock()

    def __init__(self, data_file: str = "data_store.json"):
        self.data_file = data_file
        self.projects: Dict[str, Dict[str, Any]] = {}
        self.requirements: Dict[str, List[Dict[str, Any]]] = {}
        self.documents: Dict[str, List[Dict[str, Any]]] = {}
        self.compliance_mappings: Dict[str, List[Dict[str, Any]]] = {}
        self.risks: Dict[str, List[Dict[str, Any]]] = {}
        self.sdlc_recommendations: Dict[str, Dict[str, Any]] = {}
        self.traceability: Dict[str, List[Dict[str, Any]]] = {}
        self.approvals: List[Dict[str, Any]] = []
        self.audit_logs: List[Dict[str, Any]] = []
        self.interview_transcripts: Dict[str, List[Dict[str, Any]]] = {}
        self.knowledge_base: List[Dict[str, Any]] = []

        self.seed_demo_data()

    @classmethod
    def get_instance(cls, data_file: str = "data_store.json"):
        with cls._lock:
            if cls._instance is None:
                cls._instance = cls(data_file)
            return cls._instance

    def log_audit(self, action: str, user_name: str, user_role: str, project_id: Optional[str] = None,
                  agent_name: Optional[str] = None, input_summary: Optional[str] = None,
                  output_summary: Optional[str] = None, decision: Optional[str] = None,
                  retrieved_sources: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None):
        """Append an immutable audit entry."""
        entry = {
            "id": f"aud-{len(self.audit_logs)+1001}",
            "timestamp": datetime.now().isoformat(),
            "project_id": project_id,
            "user_name": user_name,
            "user_role": user_role,
            "action": action,
            "agent_name": agent_name,
            "input_summary": input_summary,
            "output_summary": output_summary,
            "retrieved_sources": retrieved_sources,
            "decision": decision,
            "metadata": metadata or {}
        }
        self.audit_logs.insert(0, entry)
        return entry

    def seed_demo_data(self):
        """Pre-seeds the comprehensive Digital Loan Origination System project."""
        demo_proj_id = "proj-dlos-001"

        self.projects[demo_proj_id] = {
            "id": demo_proj_id,
            "name": "Digital Loan Origination & Underwriting Platform",
            "financial_domain": "Loan Processing / Digital Loan Origination",
            "description": "An enterprise digital lending platform enabling retail and commercial borrowers to apply for unsecured personal, auto, and small-business loans with automated credit decisioning, KYC verification, and compliant disbursement.",
            "business_objective": "Accelerate time-to-decision from 3 days to under 4 minutes while strictly maintaining zero compliance gaps under GLBA, CFPB Reg Z, and SOX 404 audit controls.",
            "expected_users": "Retail Borrowers, Loan Originators, Credit Underwriters, Risk Officers, Compliance Auditors",
            "project_size": "Enterprise",
            "budget": "$2,400,000",
            "timeline": "12 Months",
            "status": "In Progress",
            "current_pipeline_stage": "Quality & Compliance Analysis",
            "created_at": "2026-09-15T09:30:00",
            "updated_at": datetime.now().isoformat(),
            "owner": "Sarah Jenkins (Lead FinTech Business Analyst)",
            "total_requirements": 14,
            "approved_requirements": 9,
            "compliance_score": 94.2,
            "risk_score": 28.5,
            "factors": {
                "regulatory_criticality": 0.90,
                "security_criticality": 0.95,
                "requirement_volatility": 0.65,
                "project_complexity": 0.85,
                "system_size": "Enterprise",
                "legacy_dependency": 0.70,
                "continuous_deployment": True,
                "stakeholder_availability": 0.85,
                "formal_verification_needed": True,
                "consequences_of_failure": "Severe Financial & Legal Penalty (CFPB/FTC Consent Decrees)",
                "budget_flexibility": "Moderate",
                "timeline_months": 12
            }
        }

        # Knowledge Base items
        self.knowledge_base = [
            {
                "id": "kb-01",
                "title": "FTC Standards for Safeguarding Customer Information (GLBA 16 CFR Part 314)",
                "category": "Financial Regulations",
                "source": "Federal Trade Commission",
                "version": "v2023",
                "jurisdiction": "US Federal",
                "effective_date": "2023-06-09",
                "applicability": "All covered non-bank financial institutions, lending portals, and loan servicers.",
                "status": "Active",
                "summary": "Mandates administrative, technical, and physical safeguards for customer financial data including encryption, MFA, and annual penetration testing.",
                "key_controls": ["§314.4(c)(1) Encryption at rest (AES-256)", "§314.4(c)(2) Mandatory MFA", "§314.4(c)(3) Audit Logging (7 yrs)"]
            },
            {
                "id": "kb-02",
                "title": "CFPB Regulation Z - Truth in Lending Act (12 CFR Part 1026)",
                "category": "Financial Regulations",
                "source": "Consumer Financial Protection Bureau",
                "version": "12 CFR Part 1026",
                "jurisdiction": "US Federal",
                "effective_date": "2023-10-01",
                "applicability": "Consumer credit transactions, digital loan applications, automated APR quotes.",
                "status": "Active",
                "summary": "Requires timely, uniform disclosures of credit terms, finance charges, APR calculation precision, and right of rescission.",
                "key_controls": ["§1026.19 3-Day Loan Estimate disclosure delivery", "§1026.22 APR calculation accuracy within 0.125%"]
            },
            {
                "id": "kb-03",
                "title": "PCI-DSS v4.0.1 Data Security Standard",
                "category": "Security Standards",
                "source": "PCI Security Standards Council",
                "version": "v4.0.1",
                "jurisdiction": "Global Payment Card Ecosystem",
                "effective_date": "2024-03-31",
                "applicability": "Any entity processing, storing, or transmitting cardholder debit/credit disbursement information.",
                "status": "Active",
                "summary": "Protects cardholder data via tokenization, network segmentation, and least-privilege authorization.",
                "key_controls": ["Req 3.4 Tokenize/Hash stored PAN", "Req 8.3 Phishing-resistant MFA", "Req 10.2 Audit log capture"]
            },
            {
                "id": "kb-04",
                "title": "Corporate Underwriting & Credit Risk Policy",
                "category": "Company Policies",
                "source": "Enterprise Risk Committee",
                "version": "Manual v3.2",
                "jurisdiction": "Internal Enterprise",
                "effective_date": "2024-01-15",
                "applicability": "All automated underwriting decision engines and human loan officer override workflows.",
                "status": "Active",
                "summary": "Defines strict debt-to-income ratio caps, minimum FICO thresholds, and senior officer dual-signature requirements.",
                "key_controls": ["Sec 4.2 Max automated DTI 43.0%", "Sec 6.1 Dual authorization for loan release > $25,000"]
            }
        ]

        # Pre-seeded Requirements (14 items: functional, security, compliance, 2 ambiguous, 1 duplicate, 2 conflicting)
        self.requirements[demo_proj_id] = [
            {
                "id": "FR-LOAN-001",
                "project_id": demo_proj_id,
                "statement": "The system shall allow retail applicants to complete and submit digital loan applications through authenticated web and mobile channels with real-time field validation.",
                "categories": ["Functional", "Usability"],
                "priority": "Critical",
                "source": "Retail Banking Stakeholder",
                "source_document": "Stakeholder Elicitation Session 1",
                "original_stakeholder_statement": "Customers need to apply for loans completely online from their phone or laptop without coming to a branch.",
                "business_justification": "Primary conversion funnel for new digital consumer lending originations.",
                "assumptions": ["Borrower has a modern web browser or iOS/Android smartphone"],
                "dependencies": ["SEC-AUTH-001", "INT-KYC-001"],
                "acceptance_criteria": [
                    "User can input personal, employment, and loan amount details across responsive step wizard",
                    "Client-side and server-side validation catches invalid SSN, phone, and income formats immediately",
                    "Application draft autosaves every 15 seconds"
                ],
                "status": "Approved",
                "confidence": 0.98,
                "confidence_rationale": "Unambiguous functional requirement with complete acceptance criteria and clear boundary definition.",
                "risk_level": "Low",
                "compliance_status": "Mapped",
                "quality_issues": [],
                "conflicts_with": [],
                "rag_evidence": "Corresponds to standard digital loan origination submission workflows.",
                "rag_source_citation": "Loan Origination Policy Manual v3.2 §2.1",
                "approval_status": "Approved",
                "approved_by": "Sarah Jenkins (Lead BA)",
                "created_at": "2026-09-15T10:00:00",
                "updated_at": "2026-09-16T11:00:00"
            },
            {
                "id": "FR-LOAN-002",
                "project_id": demo_proj_id,
                "statement": "The underwriting engine shall automatically calculate borrower Debt-to-Income (DTI) and approve applications meeting FICO >= 680 and DTI <= 43.0% within 180 seconds.",
                "categories": ["Functional", "Data Management"],
                "priority": "High",
                "source": "Chief Credit Officer",
                "source_document": "Credit Policy Whitepaper",
                "original_stakeholder_statement": "If someone has good credit and under 43% DTI, the machine should give an instant credit decision.",
                "business_justification": "Automates 70% of standard personal loan volume without human underwriter intervention.",
                "assumptions": ["Credit bureau APIs are responsive within 3.5 seconds"],
                "dependencies": ["INT-CRD-001"],
                "acceptance_criteria": [
                    "DTI calculation incorporates verified monthly debt obligations against gross monthly income",
                    "Score decision audit log is generated with algorithmic inputs recorded",
                    "Borrower receives conditional approval letter within 3 minutes of submission"
                ],
                "status": "Approved",
                "confidence": 0.95,
                "confidence_rationale": "Explicit numerical thresholds and SLA metrics defined.",
                "risk_level": "Medium",
                "compliance_status": "Compliant",
                "quality_issues": [],
                "conflicts_with": ["FR-LOAN-009"], # Conflict with 009 (which claims instant approval up to 55% DTI)
                "rag_evidence": "Maximum automated Debt-to-Income (DTI) ratio permitted for instant loan approval is 43.0%. Any application with DTI between 43.1% and 50.0% requires senior risk underwriter manual review.",
                "rag_source_citation": "Corporate Loan Origination Policy Manual §4.2",
                "approval_status": "Approved",
                "approved_by": "Michael Vance (Chief Credit Underwriter)",
                "created_at": "2026-09-15T10:15:00",
                "updated_at": "2026-09-16T11:20:00"
            },
            {
                "id": "FR-LOAN-003",
                "project_id": demo_proj_id,
                "statement": "The loan approval process should be fast and frictionless.",
                "categories": ["Functional", "Usability"],
                "priority": "Medium",
                "source": "Marketing Stakeholder",
                "source_document": "Interview Notes - Marketing",
                "original_stakeholder_statement": "Loan approval should be fast and simple so borrowers don't abandon the flow.",
                "business_justification": "Improve borrower retention and drop-off rate.",
                "assumptions": [],
                "dependencies": [],
                "acceptance_criteria": ["Approval is fast"],
                "status": "Under Clarification",
                "confidence": 0.42,
                "confidence_rationale": "High ambiguity: 'fast' and 'frictionless' are subjective and untestable without concrete SLA latency targets.",
                "risk_level": "Medium",
                "compliance_status": "Needs Human Review",
                "quality_issues": [
                    {
                        "issue_id": "ISSUE-AMB-01",
                        "issue_type": "Ambiguity",
                        "severity": "High",
                        "description": "Vague non-functional performance metric. 'Fast' lacks measurable numerical SLA.",
                        "affected_text": "should be fast and frictionless",
                        "suggested_clarification": "What is the maximum acceptable automated decision time (e.g., < 60 seconds, < 180 seconds, or same-day)?",
                        "suggested_revision": "The automated credit decisioning engine shall return an approval, denial, or referral status within 120 seconds of completed document submission for 95% of transactions.",
                        "status": "Open"
                    },
                    {
                        "issue_id": "ISSUE-TEST-01",
                        "issue_type": "Untestable",
                        "severity": "Medium",
                        "description": "Requirement cannot be verified in automated test runner without quantified SLA benchmarks.",
                        "affected_text": "fast and frictionless",
                        "suggested_clarification": "Define specific user interaction milestones and response time thresholds.",
                        "status": "Open"
                    }
                ],
                "conflicts_with": [],
                "rag_evidence": "Insufficient evidence: regulatory policies specify precision and timing rules (e.g. CFPB Reg Z 3-day window), not subjective marketing speed.",
                "rag_source_citation": "Insufficient evidence in regulatory corpus",
                "approval_status": "Pending",
                "created_at": "2026-09-15T11:00:00",
                "updated_at": "2026-09-15T11:00:00"
            },
            {
                "id": "SEC-AUTH-001",
                "project_id": demo_proj_id,
                "statement": "The platform shall enforce Multi-Factor Authentication (MFA) utilizing FIDO2 WebAuthn or TOTP time-based tokens for all internal loan officers, underwriters, and external borrowers accessing account data.",
                "categories": ["Security", "Regulatory", "Audit"],
                "priority": "Critical",
                "source": "Chief Information Security Officer",
                "source_document": "Information Security Architecture Guidelines",
                "original_stakeholder_statement": "Everyone accessing financial accounts must use MFA. No single-factor passwords allowed.",
                "business_justification": "Mandatory regulatory compliance under FTC Safeguards Rule to prevent credential stuffing and identity theft.",
                "assumptions": ["Users possess a mobile authenticator app or hardware security key"],
                "dependencies": [],
                "acceptance_criteria": [
                    "User must complete primary authentication plus secondary TOTP or WebAuthn challenge before receiving JWT session token",
                    "Failed MFA attempts are limited to 5 consecutive tries before 15-minute account lock",
                    "MFA verification event is logged with IP address and device fingerprint"
                ],
                "status": "Approved",
                "confidence": 0.99,
                "confidence_rationale": "Fully grounded in GLBA §314.4(c)(2) and PCI-DSS Requirement 8.3.",
                "risk_level": "Critical",
                "compliance_status": "Compliant",
                "quality_issues": [],
                "conflicts_with": [],
                "rag_evidence": "Multi-factor authentication (MFA) is strictly required for any individual accessing any financial customer information system, including loan officers, underwriters, system administrators, and digital loan applicants accessing self-service borrower portals.",
                "rag_source_citation": "GLBA Safeguards Rule (16 CFR Part 314) §314.4(c)(2)",
                "approval_status": "Approved",
                "approved_by": "David Cho (Chief Information Security Officer)",
                "created_at": "2026-09-15T11:30:00",
                "updated_at": "2026-09-16T14:00:00"
            },
            {
                "SEC-ENC-002": { # We will store in list, but let's write dict item
                    "id": "SEC-ENC-002",
                    "project_id": demo_proj_id,
                    "statement": "All customer Nonpublic Personal Information (NPI), including Social Security Numbers, bank account numbers, and credit reports, shall be encrypted at rest using AES-256-GCM and in transit via TLS 1.3.",
                    "categories": ["Security", "Privacy", "Regulatory"],
                    "priority": "Critical",
                    "source": "Information Security Team",
                    "source_document": "Data Protection Policy v4.1",
                    "original_stakeholder_statement": "All borrower PII and financial records must be encrypted with military-grade encryption everywhere.",
                    "business_justification": "Mandatory compliance with GLBA 16 CFR Part 314 and state data privacy statutes.",
                    "assumptions": ["KMS (Key Management Service) handles automatic envelope encryption key rotation"],
                    "dependencies": [],
                    "acceptance_criteria": [
                        "Database columns storing SSN, bank routing, and account numbers use AES-256 column-level encryption",
                        "TLS 1.0, 1.1, and 1.2 are rejected on all public ingress endpoints",
                        "Cryptographic keys are rotated every 90 days with hardware security module backing"
                    ],
                    "status": "Approved",
                    "confidence": 0.97,
                    "confidence_rationale": "High specificity and full grounding in FTC Safeguards §314.4(c)(1).",
                    "risk_level": "Critical",
                    "compliance_status": "Compliant",
                    "quality_issues": [],
                    "conflicts_with": [],
                    "rag_evidence": "Financial institutions must encrypt all customer nonpublic personal information (NPI) in transit over public networks and at rest within internal databases using industry-standard cryptographic algorithms (minimum AES-256 or equivalent).",
                    "rag_source_citation": "GLBA Safeguards Rule (16 CFR Part 314) §314.4(c)(1)",
                    "approval_status": "Approved",
                    "approved_by": "David Cho (CISO)",
                    "created_at": "2026-09-15T12:00:00",
                    "updated_at": "2026-09-16T14:15:00"
                }
            }["SEC-ENC-002"],
            {
                "id": "SEC-GEN-003",
                "project_id": demo_proj_id,
                "statement": "The application shall implement standard security controls to safeguard customer information.",
                "categories": ["Security"],
                "priority": "High",
                "source": "External Vendor Document",
                "source_document": "Vendor RFP Response",
                "original_stakeholder_statement": "Make sure the system has standard industry security.",
                "business_justification": "Security baseline.",
                "assumptions": [],
                "dependencies": [],
                "acceptance_criteria": ["Follow standard security"],
                "status": "Under Clarification",
                "confidence": 0.38,
                "confidence_rationale": "High ambiguity: 'standard security' is non-specific and lacks defined cryptographic algorithms, protocols, or frameworks.",
                "risk_level": "High",
                "compliance_status": "Needs Human Review",
                "quality_issues": [
                    {
                        "issue_id": "ISSUE-AMB-02",
                        "issue_type": "Ambiguity",
                        "severity": "High",
                        "description": "'Standard security' is legally and technically indefensible in a financial regulatory audit.",
                        "affected_text": "standard security controls",
                        "suggested_clarification": "Which specific framework should be mandated (e.g., NIST SP 800-53, CIS Benchmarks, or OWASP ASVS Level 2)?",
                        "suggested_revision": "The platform shall enforce the CIS Level 2 benchmark, OWASP Top 10 API Security controls, and undergo annual SOC 2 Type II and third-party penetration testing.",
                        "status": "Open"
                    },
                    {
                        "issue_id": "ISSUE-DUP-01",
                        "issue_type": "Duplicate",
                        "severity": "Medium",
                        "description": "Subsumed by specific encryption (SEC-ENC-002) and authentication (SEC-AUTH-001) requirements.",
                        "affected_text": "safeguard customer information",
                        "suggested_clarification": "Retire this generic item in favor of SEC-ENC-002, SEC-AUTH-001, and SEC-AUD-001.",
                        "status": "Open"
                    }
                ],
                "conflicts_with": [],
                "rag_evidence": "Regulatory guidelines reject generic security descriptions; GLBA 314.4 requires formal documented risk assessments.",
                "rag_source_citation": "GLBA 16 CFR Part 314 §314.4",
                "approval_status": "Pending",
                "created_at": "2026-09-15T12:30:00",
                "updated_at": "2026-09-15T12:30:00"
            },
            {
                "id": "REG-DISC-001",
                "project_id": demo_proj_id,
                "statement": "The system shall generate and deliver a standardized Truth in Lending Loan Estimate disclosure containing calculated APR within 3 business days of application submission.",
                "categories": ["Regulatory", "Functional"],
                "priority": "Critical",
                "source": "Compliance Officer",
                "source_document": "CFPB Regulatory Compliance Directive 2026-1",
                "original_stakeholder_statement": "Federal law says the applicant has to get their Loan Estimate disclosures within three days.",
                "business_justification": "Mandatory federal statutory requirement under CFPB Regulation Z (12 CFR §1026.19). Non-compliance incurs statutory civil damages.",
                "assumptions": ["Business days exclude federal holidays and Sundays"],
                "dependencies": ["FR-LOAN-001", "INT-DOC-001"],
                "acceptance_criteria": [
                    "PDF disclosure document includes APR, itemized closing fees, monthly amortization schedule, and prepayment penalties",
                    "Calculated APR is verified within 0.125% accuracy tolerance",
                    "Delivery timestamp and borrower electronic receipt acknowledgment are recorded in audit repository"
                ],
                "status": "Approved",
                "confidence": 0.98,
                "confidence_rationale": "Exact alignment with CFPB Regulation Z statutory timing and disclosure rules.",
                "risk_level": "Critical",
                "compliance_status": "Compliant",
                "quality_issues": [],
                "conflicts_with": [],
                "rag_evidence": "In a closed-end consumer credit transaction secured by real property or digital personal credit, the creditor must deliver or place in the mail the good faith Loan Estimate disclosures no later than the third business day after receiving the consumer's completed application. Automated APR calculation must be precise within 0.125% tolerance.",
                "rag_source_citation": "CFPB Regulation Z (12 CFR Part 1026) §1026.19",
                "approval_status": "Approved",
                "approved_by": "Elena Rostova (Chief Compliance Officer)",
                "created_at": "2026-09-15T13:00:00",
                "updated_at": "2026-09-16T15:00:00"
            },
            {
                "id": "FR-DISB-001",
                "project_id": demo_proj_id,
                "statement": "Upon final loan agreement execution, approved funds shall be disbursed via automated ACH transfer within 60 seconds with zero manual hold or secondary authorization.",
                "categories": ["Functional", "Operational"],
                "priority": "High",
                "source": "Product Growth Manager",
                "source_document": "Growth Strategy PRD",
                "original_stakeholder_statement": "Once the customer signs the digital note, disburse the money in 60 seconds completely automatically with no human hold.",
                "business_justification": "Market differentiator against legacy banks with multi-day wire delays.",
                "assumptions": ["Direct FedNow / Real-Time Payments (RTP) integration available"],
                "dependencies": ["INT-PAY-001"],
                "acceptance_criteria": [
                    "ACH payment payload dispatched to core payment gateway immediately upon e-signature webhook"
                ],
                "status": "Needs Review",
                "confidence": 0.72,
                "confidence_rationale": "Detects high regulatory and operational conflict with dual-control fraud standards.",
                "risk_level": "Critical",
                "compliance_status": "Compliance Gap",
                "quality_issues": [
                    {
                        "issue_id": "ISSUE-CONF-01",
                        "issue_type": "Conflict",
                        "severity": "High",
                        "description": "Direct conflict with FFIEC High-Value Disbursement Guidance and Corporate Risk Policy §6.1, which strictly mandates dual human authorization for loan disbursements exceeding $25,000.",
                        "affected_text": "with zero manual hold or secondary authorization",
                        "suggested_clarification": "Should instant automated disbursement be capped at $25,000, requiring dual authorization only for loan values above $25,000?",
                        "suggested_revision": "Upon loan agreement execution, loans under $25,000 shall be disbursed via RTP/ACH within 60 seconds. Loans exceeding $25,000 shall require dual-officer authorization per FFIEC guidelines.",
                        "status": "Open"
                    }
                ],
                "conflicts_with": ["REG-DUAL-002"], # Conflicting with dual authorization rule
                "rag_evidence": "Financial institutions must implement dual controls and out-of-band verification for automated funds disbursement exceeding $25,000 for consumer credit and $50,000 for commercial credit. A single automated API call or lone operator must not possess sole authority to release capital without secondary validation.",
                "rag_source_citation": "FFIEC Cybersecurity Guidance (Electronic Loan Disbursements)",
                "approval_status": "Pending",
                "created_at": "2026-09-15T13:30:00",
                "updated_at": "2026-09-15T13:30:00"
            },
            {
                "id": "REG-DUAL-002",
                "project_id": demo_proj_id,
                "statement": "Any loan disbursement exceeding $25,000 shall require secondary out-of-band approval from a certified Risk Officer prior to ACH release.",
                "categories": ["Regulatory", "Security", "Operational"],
                "priority": "High",
                "source": "Enterprise Risk Committee",
                "source_document": "Corporate Loan Origination Policy Manual",
                "original_stakeholder_statement": "Large disbursements over twenty-five thousand dollars must have dual human sign-off so an attacker can't drain the loan pool.",
                "business_justification": "Mitigation of automated account takeover, fraud syndicates, and regulatory penalties.",
                "assumptions": ["Risk officer mobile approval app is online"],
                "dependencies": ["FR-DISB-001"],
                "acceptance_criteria": [
                    "Disbursements > $25,000 are placed in queued escrow state",
                    "Secondary officer receives cryptographic challenge on separate device",
                    "Dual-signature metadata is embedded in payment ledger entry"
                ],
                "status": "Approved",
                "confidence": 0.96,
                "confidence_rationale": "Directly grounded in FFIEC and corporate financial risk controls.",
                "risk_level": "Low",
                "compliance_status": "Compliant",
                "quality_issues": [],
                "conflicts_with": ["FR-DISB-001"],
                "rag_evidence": "Financial institutions must implement dual controls and out-of-band verification for automated funds disbursement exceeding $25,000 for consumer credit...",
                "rag_source_citation": "FFIEC Cybersecurity Guidance §Dual Authorization",
                "approval_status": "Approved",
                "approved_by": "Elena Rostova (Compliance Officer)",
                "created_at": "2026-09-15T14:00:00",
                "updated_at": "2026-09-16T16:00:00"
            },
            {
                "id": "FR-LOAN-009",
                "project_id": demo_proj_id,
                "statement": "The underwriting module shall approve applicants with Debt-to-Income ratios up to 55.0% without requiring collateral or manual supervisor exception.",
                "categories": ["Functional", "Operational"],
                "priority": "Medium",
                "source": "Growth Product Team",
                "source_document": "High-Yield Lending Expansion Notes",
                "original_stakeholder_statement": "Let's capture more market share by allowing auto-approval up to 55% DTI.",
                "business_justification": "Expand eligible lending addressable market.",
                "assumptions": ["Higher default rate compensated by higher APR"],
                "dependencies": [],
                "acceptance_criteria": ["Applications with DTI between 43% and 55% receive immediate approval"],
                "status": "Needs Review",
                "confidence": 0.65,
                "confidence_rationale": "Direct violation of Corporate Policy Manual §4.2 and excessive default risk.",
                "risk_level": "Critical",
                "compliance_status": "Compliance Gap",
                "quality_issues": [
                    {
                        "issue_id": "ISSUE-CONF-02",
                        "issue_type": "Conflict",
                        "severity": "High",
                        "description": "Direct conflict with FR-LOAN-002 and Corporate Policy §4.2. Policy mandates maximum automated DTI of 43.0% and requires manual underwriter review for any ratio over 43%.",
                        "affected_text": "ratios up to 55.0% without requiring collateral or manual supervisor exception",
                        "suggested_clarification": "Align requirement with Policy Manual §4.2: applications between 43.1% and 50% must route to manual underwriter review; > 50% must be declined without collateral.",
                        "suggested_revision": "Applications with DTI between 43.1% and 50.0% shall be routed to Senior Underwriter manual review queue. Automated instant approval is restricted to DTI <= 43.0%.",
                        "status": "Open"
                    }
                ],
                "conflicts_with": ["FR-LOAN-002"],
                "rag_evidence": "Maximum automated Debt-to-Income (DTI) ratio permitted for instant loan approval is 43.0%. Any application with DTI between 43.1% and 50.0% requires senior risk underwriter manual review. Applications exceeding 50.0% DTI are systematically declined...",
                "rag_source_citation": "Corporate Loan Origination Policy Manual §4.2",
                "approval_status": "Pending",
                "created_at": "2026-09-15T14:30:00",
                "updated_at": "2026-09-15T14:30:00"
            },
            {
                "id": "SEC-AUD-001",
                "project_id": demo_proj_id,
                "statement": "The platform shall record an immutable, tamper-evident audit log of every credit scoring event, underwriting override, personal data access, and loan disbursement, retained for at least 7 years.",
                "categories": ["Security", "Audit", "Regulatory"],
                "priority": "Critical",
                "source": "Internal Audit & SOX Compliance",
                "source_document": "SOX 404 ITGC Framework",
                "original_stakeholder_statement": "Auditors must be able to see who touched every loan, why an override happened, and prove the log hasn't been altered.",
                "business_justification": "Mandatory compliance under Sarbanes-Oxley Act §404 and GLBA §314.4(c)(3).",
                "assumptions": ["Write-Once-Read-Many (WORM) storage or cryptographic hash chaining is configured"],
                "dependencies": [],
                "acceptance_criteria": [
                    "Logs capture actor ID, role, timestamp (UTC ISO 8601), IP, action, previous state, and new state",
                    "Audit log store is read-only for application services and alerts on deletion attempts",
                    "Export capability formatted for CFPB and internal auditor consumption"
                ],
                "status": "Approved",
                "confidence": 0.99,
                "confidence_rationale": "Exact match with SOX 404 ITGC and GLBA 7-year audit retention mandates.",
                "risk_level": "High",
                "compliance_status": "Compliant",
                "quality_issues": [],
                "conflicts_with": [],
                "rag_evidence": "Financial institutions must maintain immutable audit trails of all access, modifications, credit decisions, and data disclosures relating to customer financial records. Audit logs must be retained for at least 7 years...",
                "rag_source_citation": "GLBA Safeguards Rule §314.4(c)(3) & SOX Section 404",
                "approval_status": "Approved",
                "approved_by": "Elena Rostova (Compliance Officer)",
                "created_at": "2026-09-15T15:00:00",
                "updated_at": "2026-09-16T17:00:00"
            },
            {
                "id": "PRIV-DEL-001",
                "project_id": demo_proj_id,
                "statement": "When a customer requests personal data deletion under privacy rights, the system shall purge non-regulatory marketing identifiers while preserving financial loan ledgers and audit records required by Bank Secrecy Act and GLBA.",
                "categories": ["Privacy", "Regulatory", "Data Management"],
                "priority": "High",
                "source": "Data Privacy Officer",
                "source_document": "Global Privacy Governance Directive",
                "original_stakeholder_statement": "If a user invokes their right to be forgotten, delete their marketing data but do NOT delete their loan payment history because banking law requires us to keep it.",
                "business_justification": "Reconciles GDPR Article 17 / CCPA right-to-erasure with banking statutory retention obligations.",
                "assumptions": ["Data classification tags separate marketing telemetry from transaction ledger entries"],
                "dependencies": ["SEC-AUD-001"],
                "acceptance_criteria": [
                    "Marketing profile, behavioral tracking cookies, and non-financial session records purged within 30 days",
                    "Customer financial ledger entries retained in restricted-access archive with pseudonymization",
                    "Confirmation notice issued to applicant specifying legal retention grounds"
                ],
                "status": "Approved",
                "confidence": 0.94,
                "confidence_rationale": "Accurate legal reconciliation between GDPR Art 17 and banking retention statutory requirements.",
                "risk_level": "High",
                "compliance_status": "Compliant",
                "quality_issues": [],
                "conflicts_with": [],
                "rag_evidence": "While Article 17 provides data subjects the right to obtain erasure of personal data without undue delay, this right does not apply where processing is necessary for compliance with a legal financial retention obligation (such as Bank Secrecy Act / AML 5-year retention, or GLBA 7-year records).",
                "rag_source_citation": "GDPR (EU 2016/679) Article 17(3)(b) & FinTech Privacy Guidelines",
                "approval_status": "Approved",
                "approved_by": "Sarah Jenkins (Lead BA)",
                "created_at": "2026-09-15T15:30:00",
                "updated_at": "2026-09-16T17:30:00"
            },
            {
                "id": "INT-KYC-001",
                "project_id": demo_proj_id,
                "statement": "The onboarding service shall integrate with certified identity verification providers to validate government photo IDs, biometric selfie liveness, and verify against OFAC/SDN sanctions watchlists in real-time.",
                "categories": ["Integration", "Regulatory", "Security"],
                "priority": "Critical",
                "source": "Anti-Money Laundering (AML) Officer",
                "source_document": "BSA/AML Compliance Program",
                "original_stakeholder_statement": "Check ID and check sanctions before issuing any loan.",
                "business_justification": "Mandatory USA PATRIOT Act Customer Identification Program (CIP) and OFAC sanction screening.",
                "assumptions": ["Third-party KYC API provides 99.9% uptime SLA"],
                "dependencies": [],
                "acceptance_criteria": [
                    "Government ID authenticity score >= 90/100",
                    "Biometric 3D liveness match verified",
                    "OFAC sanctions match triggers immediate application freeze and compliance officer alert"
                ],
                "status": "Approved",
                "confidence": 0.97,
                "confidence_rationale": "High completeness with defined regulatory thresholds.",
                "risk_level": "Critical",
                "compliance_status": "Compliant",
                "quality_issues": [],
                "conflicts_with": [],
                "rag_evidence": "Financial institutions must implement Customer Identification Programs (CIP) and screen all credit applicants against Treasury OFAC lists prior to extending credit.",
                "rag_source_citation": "USA PATRIOT Act §326 & OFAC Compliance Guidelines",
                "approval_status": "Approved",
                "approved_by": "Elena Rostova (Compliance Officer)",
                "created_at": "2026-09-15T16:00:00",
                "updated_at": "2026-09-16T17:45:00"
            },
            {
                "id": "NFR-PERF-001",
                "project_id": demo_proj_id,
                "statement": "The core lending API shall maintain a 99.99% availability SLA and support a sustained throughput of 800 loan application submissions per minute with 95th percentile latency below 850 milliseconds.",
                "categories": ["Performance", "Availability"],
                "priority": "High",
                "source": "Lead Enterprise Architect",
                "source_document": "Non-Functional SLA Specification",
                "original_stakeholder_statement": "The system cannot go down during marketing promotions and must handle thousands of users smoothly.",
                "business_justification": "Prevent loan abandonment during peak seasonal demand.",
                "assumptions": ["Multi-region cloud deployment with automated auto-scaling"],
                "dependencies": [],
                "acceptance_criteria": [
                    "Load testing validates 800 req/min at < 850ms p95 latency",
                    "Automated multi-AZ database failover in under 20 seconds",
                    "Healthcheck endpoints monitored 24/7 with pager alerts"
                ],
                "status": "Approved",
                "confidence": 0.96,
                "confidence_rationale": "Fully quantified performance and reliability parameters.",
                "risk_level": "Medium",
                "compliance_status": "Compliant",
                "quality_issues": [],
                "conflicts_with": [],
                "rag_evidence": "Banking systems must document and stress-test core system availability under FFIEC IT Handbook business continuity mandates.",
                "rag_source_citation": "FFIEC IT Examination Handbook (Business Continuity Management)",
                "approval_status": "Approved",
                "approved_by": "Sarah Jenkins (Lead BA)",
                "created_at": "2026-09-15T16:30:00",
                "updated_at": "2026-09-16T18:00:00"
            }
        ]

        # Seed Compliance Mappings
        self.compliance_mappings[demo_proj_id] = [
            {
                "id": "comp-map-01",
                "requirement_id": "SEC-ENC-002",
                "requirement_statement": "All customer Nonpublic Personal Information (NPI)... shall be encrypted at rest using AES-256-GCM and in transit via TLS 1.3.",
                "regulation_name": "GLBA Safeguards Rule (16 CFR Part 314)",
                "control_id": "16 CFR § 314.4(c)(1)",
                "control_description": "Encryption of customer information at rest and in transit.",
                "evidence_quote": "Financial institutions must encrypt all customer nonpublic personal information (NPI) in transit over public networks and at rest within internal databases using industry-standard cryptographic algorithms (minimum AES-256 or equivalent).",
                "source_document": "FTC Standards for Safeguarding Customer Information",
                "section": "§ 314.4(c)(1)",
                "jurisdiction": "US Federal (FTC)",
                "effective_date": "2023-06-09",
                "status": "Compliant",
                "confidence": 0.98,
                "requires_human_approval": False,
                "approval_status": "Approved",
                "approved_by": "Elena Rostova (Compliance Officer)",
                "compliance_gap_notes": "Meets and exceeds federal standard by enforcing AES-256-GCM and TLS 1.3."
            },
            {
                "id": "comp-map-02",
                "requirement_id": "SEC-AUTH-001",
                "requirement_statement": "The platform shall enforce Multi-Factor Authentication (MFA)... for all internal loan officers, underwriters, and external borrowers.",
                "regulation_name": "GLBA Safeguards Rule & PCI-DSS v4.0",
                "control_id": "GLBA § 314.4(c)(2) & PCI-DSS Req 8.3",
                "control_description": "Multi-factor authentication for any individual accessing customer information systems.",
                "evidence_quote": "Multi-factor authentication (MFA) is strictly required for any individual accessing any financial customer information system, including loan officers, underwriters, system administrators, and digital loan applicants...",
                "source_document": "16 CFR Part 314 & PCI-DSS v4.0",
                "section": "§ 314.4(c)(2)",
                "jurisdiction": "US Federal & PCI Council",
                "effective_date": "2023-06-09",
                "status": "Compliant",
                "confidence": 0.99,
                "requires_human_approval": False,
                "approval_status": "Approved",
                "approved_by": "Elena Rostova (Compliance Officer)",
                "compliance_gap_notes": "FIDO2 WebAuthn provides phishing resistance mandated under modern guidance."
            },
            {
                "id": "comp-map-03",
                "requirement_id": "REG-DISC-001",
                "requirement_statement": "The system shall generate and deliver a standardized Truth in Lending Loan Estimate disclosure containing calculated APR within 3 business days...",
                "regulation_name": "CFPB Regulation Z (12 CFR Part 1026)",
                "control_id": "12 CFR § 1026.19(e)",
                "control_description": "Mortgage/Consumer Loan Estimate timing and disclosure content standards.",
                "evidence_quote": "In a closed-end consumer credit transaction secured by real property or digital personal credit, the creditor must deliver or place in the mail the good faith Loan Estimate disclosures no later than the third business day after receiving the consumer's completed application.",
                "source_document": "CFPB Regulation Z Truth in Lending",
                "section": "§ 1026.19(e)",
                "jurisdiction": "US CFPB",
                "effective_date": "2023-10-01",
                "status": "Compliant",
                "confidence": 0.97,
                "requires_human_approval": True,
                "approval_status": "Approved",
                "approved_by": "Elena Rostova (Compliance Officer)",
                "compliance_gap_notes": "Requires automated clock timestamping upon receipt of 6 key TRID data points."
            },
            {
                "id": "comp-map-04",
                "requirement_id": "FR-DISB-001",
                "requirement_statement": "Upon final loan agreement execution, approved funds shall be disbursed via automated ACH transfer within 60 seconds with zero manual hold or secondary authorization.",
                "regulation_name": "FFIEC Cybersecurity Guidance (Electronic Funds)",
                "control_id": "FFIEC Dual-Authorization Control",
                "control_description": "Dual authorization and out-of-band verification for high-value funds disbursements.",
                "evidence_quote": "Financial institutions must implement dual controls and out-of-band verification for automated funds disbursement exceeding $25,000 for consumer credit and $50,000 for commercial credit.",
                "source_document": "FFIEC IT Examination Handbook",
                "section": "Wholesale & High-Value Retail Payments §4",
                "jurisdiction": "US Federal (FFIEC)",
                "effective_date": "2022-08-15",
                "status": "Compliance Gap",
                "confidence": 0.94,
                "requires_human_approval": True,
                "approval_status": "Pending",
                "compliance_gap_notes": "CRITICAL GAP: Allowing automated instantaneous release of loans without dual authorization for amounts over $25,000 violates FFIEC guidelines and bank risk controls."
            },
            {
                "id": "comp-map-05",
                "requirement_id": "SEC-AUD-001",
                "requirement_statement": "The platform shall record an immutable, tamper-evident audit log... retained for at least 7 years.",
                "regulation_name": "SOX Section 404 & GLBA 16 CFR Part 314",
                "control_id": "SOX-404-ITGC-03 & GLBA § 314.4(c)(3)",
                "control_description": "Audit logging of financial credit transactions and internal controls verification.",
                "evidence_quote": "Financial institutions must maintain immutable audit trails of all access, modifications, credit decisions, and data disclosures relating to customer financial records. Audit logs must be retained for at least 7 years...",
                "source_document": "Public Law 107-204 & 16 CFR Part 314",
                "section": "SOX §404 / GLBA §314.4(c)(3)",
                "jurisdiction": "US SEC & FTC",
                "effective_date": "2002-07-30",
                "status": "Compliant",
                "confidence": 0.98,
                "requires_human_approval": False,
                "approval_status": "Approved",
                "approved_by": "Elena Rostova (Compliance Officer)",
                "compliance_gap_notes": "Write-Once-Read-Many (WORM) storage configuration verifies non-tampering requirement."
            },
            {
                "id": "comp-map-06",
                "requirement_id": "FR-LOAN-003",
                "requirement_statement": "The loan approval process should be fast and frictionless.",
                "regulation_name": "CFPB Equal Credit Opportunity Act (Reg B)",
                "control_id": "12 CFR § 1002.9",
                "control_description": "Objective, testable credit decision standards and adverse action notices.",
                "evidence_quote": "Insufficient evidence: regulatory policies specify precision and timing rules, not subjective marketing speed.",
                "source_document": "CFPB Regulation B",
                "section": "§ 1002.9",
                "jurisdiction": "US CFPB",
                "effective_date": "2023-01-01",
                "status": "Needs Human Review",
                "confidence": 0.40,
                "requires_human_approval": True,
                "approval_status": "Pending",
                "compliance_gap_notes": "Insufficient evidence found in knowledge base for subjective phrase 'fast and frictionless'. Requires quantified latency benchmark."
            }
        ]

        # Seed Risks (5x5 matrix)
        self.risks[demo_proj_id] = [
            {
                "id": "RSK-001",
                "project_id": demo_proj_id,
                "description": "Instant unverified loan disbursement exceeding $25,000 enables syndicate synthetic identity fraud and automated capital drainage.",
                "category": "Security",
                "likelihood": 4,
                "impact": 5,
                "severity": "Critical",
                "severity_score": 20,
                "affected_requirement_id": "FR-DISB-001",
                "affected_requirement_statement": "Disburse funds within 60 seconds with zero manual hold or secondary authorization",
                "mitigation_strategy": "Enforce mandatory secondary out-of-band underwriter approval (REG-DUAL-002) for disbursements > $25,000 and integrate real-time fraud velocity scoring.",
                "owner": "AppSec & Fraud Prevention Squad",
                "status": "Mitigating"
            },
            {
                "id": "RSK-002",
                "project_id": demo_proj_id,
                "description": "Approving high debt-to-income (up to 55%) without underwriter override violates underwriting limits and increases default portfolio losses by an estimated 28%.",
                "category": "Compliance",
                "likelihood": 4,
                "impact": 4,
                "severity": "Critical",
                "severity_score": 16,
                "affected_requirement_id": "FR-LOAN-009",
                "affected_requirement_statement": "Approve applicants with DTI up to 55% without collateral or supervisor exception",
                "mitigation_strategy": "Reject requirement FR-LOAN-009; restore hard algorithmic auto-approval cap at 43.0% DTI per Corporate Policy Manual §4.2.",
                "owner": "Chief Credit Risk Officer",
                "status": "Identified"
            },
            {
                "id": "RSK-003",
                "project_id": demo_proj_id,
                "description": "Failure to deliver accurate APR disclosures within 3 business days exposes the financial institution to CFPB statutory class-action damages and restitution fines.",
                "category": "Compliance",
                "likelihood": 2,
                "impact": 5,
                "severity": "High",
                "severity_score": 10,
                "affected_requirement_id": "REG-DISC-001",
                "affected_requirement_statement": "Generate and deliver standardized Truth in Lending Loan Estimate within 3 business days",
                "mitigation_strategy": "Implement automated deadline monitoring with escalate alerts to compliance desk at hour 48 of the 72-hour window.",
                "owner": "Regulatory Operations Team",
                "status": "Mitigating"
            },
            {
                "id": "RSK-004",
                "project_id": demo_proj_id,
                "description": "External credit bureau API latency spikes (> 10s) or outages cause consumer application timeouts and abandonments.",
                "category": "Technical",
                "likelihood": 3,
                "impact": 3,
                "severity": "Medium",
                "severity_score": 9,
                "affected_requirement_id": "FR-LOAN-002",
                "affected_requirement_statement": "Calculate borrower DTI and approve applications within 180 seconds",
                "mitigation_strategy": "Implement multi-bureau failover fallback (Equifax -> Experian -> TransUnion) and circuit-breaker pattern with asynchronous notification to applicant.",
                "owner": "Core Banking Integration Squad",
                "status": "Mitigated"
            },
            {
                "id": "RSK-005",
                "project_id": demo_proj_id,
                "description": "Vague security requirement ('standard security') results in contractor omission of proper key management and API authorization boundaries.",
                "category": "Security",
                "likelihood": 3,
                "impact": 4,
                "severity": "High",
                "severity_score": 12,
                "affected_requirement_id": "SEC-GEN-003",
                "affected_requirement_statement": "The application shall implement standard security controls to safeguard customer information",
                "mitigation_strategy": "Formalize SEC-GEN-003 into measurable security standards: OWASP ASVS Level 2, FIDO2 MFA, and AES-256-GCM encryption.",
                "owner": "Chief Information Security Officer",
                "status": "Mitigating"
            }
        ]

        # Seed Traceability Links
        self.traceability[demo_proj_id] = [
            {
                "id": "TRC-001",
                "stakeholder_statement": "Customers need to apply for loans completely online from their phone or laptop without coming to a branch.",
                "requirement_id": "FR-LOAN-001",
                "requirement_statement": "The system shall allow retail applicants to complete and submit digital loan applications online...",
                "acceptance_criteria": [
                    "User can input personal, employment, and loan amount details across responsive step wizard",
                    "Application draft autosaves every 15 seconds"
                ],
                "risk_id": "RSK-004",
                "risk_title": "Credit bureau timeout during application",
                "compliance_control_id": "GLBA-314.4(c)(1)",
                "compliance_control_title": "Encryption of Ingress Data in Transit",
                "security_control": "mTLS & WAF Bot Defense",
                "test_case_id": "TC-FR-001-E2E",
                "test_case_title": "End-to-End Borrower Portal Application Submission Test",
                "sdlc_phase": "Sprint Execution & Automated Verification",
                "verification_status": "Verified"
            },
            {
                "id": "TRC-002",
                "stakeholder_statement": "Everyone accessing financial accounts must use MFA. No single-factor passwords allowed.",
                "requirement_id": "SEC-AUTH-001",
                "requirement_statement": "The platform shall enforce Multi-Factor Authentication (MFA) utilizing FIDO2 WebAuthn or TOTP...",
                "acceptance_criteria": [
                    "User must complete primary authentication plus secondary TOTP or WebAuthn challenge",
                    "Failed MFA attempts limited to 5 before lock"
                ],
                "risk_id": "RSK-001",
                "risk_title": "Credential Stuffing & Account Takeover",
                "compliance_control_id": "GLBA-314.4(c)(2) / PCI-8.3",
                "compliance_control_title": "Mandatory Multi-Factor Authentication",
                "security_control": "FIDO2 WebAuthn & Phishing-Resistant Tokens",
                "test_case_id": "TC-SEC-001-MFA",
                "test_case_title": "Automated MFA Brute-Force & Lockout Verification",
                "sdlc_phase": "Threat Modeling & Security Testing",
                "verification_status": "Verified"
            },
            {
                "id": "TRC-003",
                "stakeholder_statement": "Federal law says the applicant has to get their Loan Estimate disclosures within three days.",
                "requirement_id": "REG-DISC-001",
                "requirement_statement": "The system shall generate and deliver a standardized Truth in Lending Loan Estimate disclosure within 3 business days...",
                "acceptance_criteria": [
                    "PDF disclosure document includes APR, itemized closing fees, monthly amortization schedule",
                    "Calculated APR is verified within 0.125% accuracy tolerance"
                ],
                "risk_id": "RSK-003",
                "risk_title": "CFPB Statutory Class-Action Disclosure Penalty",
                "compliance_control_id": "CFPB-Reg-Z-1026.19",
                "compliance_control_title": "Truth in Lending Disclosures & Timing",
                "security_control": "Cryptographic Hash Receipt Attestation",
                "test_case_id": "TC-REG-001-TRID",
                "test_case_title": "CFPB 72-Hour Timer & APR Calculation Precision Test",
                "sdlc_phase": "Regulatory Audit & Compliance Gate",
                "verification_status": "Verified"
            },
            {
                "id": "TRC-004",
                "stakeholder_statement": "Large disbursements over twenty-five thousand dollars must have dual human sign-off so an attacker can't drain the loan pool.",
                "requirement_id": "REG-DUAL-002",
                "requirement_statement": "Any loan disbursement exceeding $25,000 shall require secondary out-of-band approval from a certified Risk Officer...",
                "acceptance_criteria": [
                    "Disbursements > $25,000 are placed in queued escrow state",
                    "Dual-signature metadata is embedded in payment ledger entry"
                ],
                "risk_id": "RSK-001",
                "risk_title": "High-Value Capital Drainage & Synthetic Fraud",
                "compliance_control_id": "FFIEC-Dual-Auth",
                "compliance_control_title": "Dual Control for High-Value Wire/ACH",
                "security_control": "Dual Asymmetric Key Authorization",
                "test_case_id": "TC-DISB-002-DUAL",
                "test_case_title": "Dual Approval Escrow Escalation & Release Test",
                "sdlc_phase": "End-to-End Functional & UAT Verification",
                "verification_status": "Verified"
            }
        ]

        # Seed Approvals
        self.approvals = [
            {
                "id": "appr-01",
                "project_id": demo_proj_id,
                "item_type": "Conflict Resolution",
                "item_id": "FR-DISB-001",
                "title": "Resolve Instant Disbursement vs FFIEC Dual Authorization Conflict",
                "description": "FR-DISB-001 requests 60-second automatic disbursement with zero human review. This conflicts with FFIEC guidelines requiring dual controls for amounts > $25,000. Recommended resolution: approve dual authorization threshold.",
                "target_role": "Risk Manager",
                "status": "Pending",
                "requested_at": "2026-09-28T10:00:00"
            },
            {
                "id": "appr-02",
                "project_id": demo_proj_id,
                "item_type": "Regulatory Interpretation",
                "item_id": "comp-map-04",
                "title": "Compliance Signoff for FFIEC Electronic Disbursement Gap",
                "description": "Review and confirm remediation plan for compliance gap on automated loan disbursements exceeding $25,000.",
                "target_role": "Compliance Officer",
                "status": "Pending",
                "requested_at": "2026-09-28T10:15:00"
            },
            {
                "id": "appr-03",
                "project_id": demo_proj_id,
                "item_type": "SDLC Model Selection",
                "item_id": "sdlc-rec-001",
                "title": "Authorize Hybrid (DevSecOps + V-Model Verification) SDLC Framework",
                "description": "The deterministic rule engine scored the Hybrid framework at 97.5/100 due to high regulatory criticality (90%), continuous deployment needs, and severe legal failure consequences.",
                "target_role": "Project Manager",
                "status": "Pending",
                "requested_at": "2026-09-28T10:30:00"
            },
            {
                "id": "appr-04",
                "project_id": demo_proj_id,
                "item_type": "Requirement Baseline",
                "item_id": "BASE-V1",
                "title": "Approve Core Security & Privacy Requirements Baseline v1.0",
                "description": "Baseline signoff for SEC-AUTH-001, SEC-ENC-002, and SEC-AUD-001.",
                "target_role": "Security Officer",
                "status": "Approved",
                "requested_at": "2026-09-27T14:00:00",
                "decided_at": "2026-09-27T16:30:00",
                "decided_by": "David Cho (CISO)",
                "decision_notes": "All cryptographic controls and multi-factor requirements meet FTC Safeguards standards."
            }
        ]

        # Seed Documents
        self.documents[demo_proj_id] = [
            {
                "id": "doc-01",
                "project_id": demo_proj_id,
                "filename": "FTC_GLBA_Safeguards_Rule_16CFR314.pdf",
                "document_type": "Regulatory Standard",
                "upload_date": "2026-09-15T09:00:00",
                "version": "16 CFR Part 314 v2023",
                "source": "US Federal Trade Commission",
                "jurisdiction": "US Federal",
                "effective_date": "2023-06-09",
                "processing_status": "Indexed in ChromaDB",
                "chunk_count": 28,
                "extracted_text_preview": "Standards for Safeguarding Customer Information. Mandatory controls for financial institutions including encryption, MFA, access controls..."
            },
            {
                "id": "doc-02",
                "project_id": demo_proj_id,
                "filename": "Corporate_Loan_Origination_Policy_v3.2.docx",
                "document_type": "Policy Document",
                "upload_date": "2026-09-15T09:10:00",
                "version": "Manual v3.2",
                "source": "Enterprise Risk Committee",
                "jurisdiction": "Internal Enterprise",
                "effective_date": "2024-01-15",
                "processing_status": "Indexed in ChromaDB",
                "chunk_count": 42,
                "extracted_text_preview": "Enterprise Underwriting Policy. Debt-to-income caps (43.0% automated max), FICO scoring tiers, dual authorization thresholds for loan payouts > $25,000..."
            },
            {
                "id": "doc-03",
                "project_id": demo_proj_id,
                "filename": "CFPB_Reg_Z_Truth_In_Lending_Disclosures.pdf",
                "document_type": "Regulatory Standard",
                "upload_date": "2026-09-15T09:20:00",
                "version": "12 CFR Part 1026",
                "source": "Consumer Financial Protection Bureau",
                "jurisdiction": "US Federal",
                "effective_date": "2023-10-01",
                "processing_status": "Indexed in ChromaDB",
                "chunk_count": 35,
                "extracted_text_preview": "Requirements for loan estimates, finance charges, annual percentage rate precision, and delivery timing within three business days..."
            }
        ]

        # Seed Interview Transcript
        self.interview_transcripts[demo_proj_id] = [
            {
                "id": "int-msg-1",
                "role": "agent",
                "agent_name": "Stakeholder Interaction Agent",
                "content": "Welcome to the Financial Requirements Gathering Session for the Digital Loan Origination System. To begin, what is the core business objective and primary target borrower demographic for this lending solution?",
                "timestamp": "2026-09-15T09:40:00",
                "identified_domain_topics": ["Business Objective", "Borrower Demographics"],
                "detected_missing_info": []
            },
            {
                "id": "int-msg-2",
                "role": "user",
                "agent_name": None,
                "content": "We want to allow retail customers to apply for personal and auto loans online from their phone or laptop, getting approved in under four minutes without branch visits.",
                "timestamp": "2026-09-15T09:42:00",
                "identified_domain_topics": ["Digital Application", "SLA Speed"],
                "detected_missing_info": ["Loan Types", "KYC Verification", "Credit Bureau Integration"]
            },
            {
                "id": "int-msg-3",
                "role": "agent",
                "agent_name": "Stakeholder Interaction Agent",
                "content": "Understood. Fast digital origination requires balancing borrower conversion with fraud prevention. What specific identity verification (KYC/CIP) standards and credit scoring thresholds must be applied before an automated decision is made?",
                "timestamp": "2026-09-15T09:43:00",
                "identified_domain_topics": ["KYC/CIP", "Underwriting Thresholds"],
                "detected_missing_info": ["Adverse Action Rules", "Disbursement Limits", "Audit Logging"]
            },
            {
                "id": "int-msg-4",
                "role": "user",
                "agent_name": None,
                "content": "We need government ID scanning with selfie liveness. For credit, anyone with FICO over 680 and DTI under 43% gets auto-approved. For disbursements over $25,000 we must have dual underwriter signoff so we don't breach FFIEC guidelines.",
                "timestamp": "2026-09-15T09:45:00",
                "identified_domain_topics": ["Biometric KYC", "FICO/DTI Thresholds", "FFIEC Dual Authorization"],
                "detected_missing_info": []
            }
        ]

        # Seed Initial Audit Logs
        self.log_audit(
            action="System Initialization",
            user_name="System",
            user_role="Administrator",
            project_id=demo_proj_id,
            agent_name="Coordinator Agent",
            input_summary="Pre-seeded high-fidelity financial loan origination demo dataset",
            output_summary="Loaded 14 requirements, 6 compliance mappings, 5 risk records, 4 knowledge base corpuses"
        )
        self.log_audit(
            action="Compliance Mapping Generated",
            user_name="AI Agent Engine",
            user_role="AI System",
            project_id=demo_proj_id,
            agent_name="Compliance Agent",
            input_summary="Mapped requirement SEC-ENC-002 against regulatory corpus",
            output_summary="Grounded evidence identified in GLBA Safeguards Rule 16 CFR §314.4(c)(1)",
            retrieved_sources="16 CFR Part 314 §314.4(c)(1)"
        )
        self.log_audit(
            action="Conflict Detected",
            user_name="AI Agent Engine",
            user_role="AI System",
            project_id=demo_proj_id,
            agent_name="Conflict Detection Agent",
            input_summary="Compared FR-DISB-001 (instant release) against REG-DUAL-002 (dual auth)",
            output_summary="Direct conflict detected: 60-second instantaneous disbursement breaches FFIEC high-value dual authorization mandate (> $25,000)",
            decision="Flagged for Risk Manager approval"
        )
        self.log_audit(
            action="Requirement Approved",
            user_name="David Cho",
            user_role="Security Officer",
            project_id=demo_proj_id,
            agent_name="Human Approval Agent",
            input_summary="Approval request appr-04 for Security Baseline v1.0",
            output_summary="Approved requirements SEC-AUTH-001, SEC-ENC-002, and SEC-AUD-001",
            decision="Approved"
        )
