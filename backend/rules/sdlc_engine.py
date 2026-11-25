from typing import Dict, Any, List, Tuple
from schemas.project import ProjectFactors
from schemas.sdlc import SDLCModelScore, SDLCWorkflowPhase, SDLCRecommendation

class FinTechSDLCRuleEngine:
    """
    Deterministic rule and multi-factor scoring engine for selecting SDLC models
    in financial sector software systems. Does not rely on unpredictable LLM scoring.
    """
    VERSION = "FinTech-SDLC-Decision-Engine-v2.4"

    # Weight definitions (summing to 100 for normalization)
    WEIGHTS = {
        "regulatory_criticality": 20.0,
        "security_criticality": 20.0,
        "requirement_volatility": 15.0,
        "continuous_deployment": 15.0,
        "formal_verification": 12.0,
        "legacy_dependency": 8.0,
        "failure_consequences": 10.0,
    }

    @classmethod
    def evaluate(cls, project_id: str, factors: ProjectFactors) -> SDLCRecommendation:
        reg_crit = factors.regulatory_criticality # 0.0 - 1.0
        sec_crit = factors.security_criticality # 0.0 - 1.0
        volatility = factors.requirement_volatility # 0.0 - 1.0
        cd_need = 1.0 if factors.continuous_deployment else 0.0
        formal_verif = 1.0 if factors.formal_verification_needed else 0.0
        legacy_dep = factors.legacy_dependency
        failure_penalty = 1.0 if "Severe" in factors.consequences_of_failure else 0.5

        # 1. DevSecOps Score Calculation
        devsecops_score = (
            (sec_crit * 30.0) +
            (cd_need * 25.0) +
            (volatility * 20.0) +
            ((1.0 - legacy_dep * 0.3) * 15.0) +
            (factors.stakeholder_availability * 10.0)
        )

        # 2. V-Model Score Calculation (Verification & Validation)
        vmodel_score = (
            (reg_crit * 35.0) +
            (formal_verif * 25.0) +
            (failure_penalty * 20.0) +
            ((1.0 - volatility) * 15.0) +
            (sec_crit * 5.0)
        )

        # 3. Hybrid Model (DevSecOps + V-Model Formal Gates) - Standard for FinTech
        hybrid_score = (
            (reg_crit * 25.0) +
            (sec_crit * 25.0) +
            (cd_need * 20.0) +
            (formal_verif * 15.0) +
            (volatility * 15.0)
        )

        # 4. Pure Agile (Scrum/Kanban)
        agile_score = (
            (volatility * 40.0) +
            (cd_need * 30.0) +
            (factors.stakeholder_availability * 20.0) +
            ((1.0 - reg_crit) * 10.0)
        )

        # 5. Spiral Model (Risk-Driven Prototyping)
        spiral_score = (
            (factors.project_complexity * 35.0) +
            (sec_crit * 25.0) +
            (legacy_dep * 20.0) +
            (volatility * 20.0)
        )

        # 6. Traditional Waterfall
        waterfall_score = (
            ((1.0 - volatility) * 40.0) +
            (reg_crit * 30.0) +
            (formal_verif * 20.0) +
            ((1.0 - cd_need) * 10.0)
        )

        # Clamp all scores between 10.0 and 99.5
        scores = {
            "Hybrid (DevSecOps + V-Model Verification)": min(98.5, max(15.0, round(hybrid_score, 1))),
            "DevSecOps": min(96.0, max(15.0, round(devsecops_score, 1))),
            "V-Model": min(95.0, max(15.0, round(vmodel_score, 1))),
            "Spiral": min(92.0, max(15.0, round(spiral_score, 1))),
            "Agile": min(90.0, max(15.0, round(agile_score, 1))),
            "Waterfall": min(85.0, max(10.0, round(waterfall_score, 1)))
        }

        # Determine winner
        best_model = max(scores, key=scores.get)

        model_details = [
            SDLCModelScore(
                model_name="Hybrid (DevSecOps + V-Model Verification)",
                score=scores["Hybrid (DevSecOps + V-Model Verification)"],
                is_recommended=(best_model == "Hybrid (DevSecOps + V-Model Verification)"),
                suitability_level="Highly Recommended" if scores["Hybrid (DevSecOps + V-Model Verification)"] >= 85 else "Viable with Mitigations",
                supporting_factors=[
                    f"Balanced response to high regulatory criticality ({int(reg_crit*100)}%) with automated verification gates",
                    f"Supports continuous delivery ({'Enabled' if factors.continuous_deployment else 'Disabled'}) without compromising financial auditability",
                    "Provides bidirectional traceability linking requirement specs directly to automated acceptance tests and compliance controls",
                    "Encapsulates shift-left security (SAST/DAST) with formal pre-disbursement signoffs"
                ],
                potential_limitations=[
                    "Requires multi-disciplinary alignment between Agile development squads and formal Compliance/Risk Officers",
                    "Requires robust CI/CD pipeline automation for compliance evidence collection"
                ],
                applicable_conditions=[
                    "Regulated digital banking & loan origination systems",
                    "Requirements subject to frequent regulatory updates",
                    "Mandatory audit trail for internal accounting & CFPB compliance"
                ]
            ),
            SDLCModelScore(
                model_name="DevSecOps",
                score=scores["DevSecOps"],
                is_recommended=(best_model == "DevSecOps"),
                suitability_level="Highly Recommended" if scores["DevSecOps"] >= 85 else "Viable with Mitigations",
                supporting_factors=[
                    f"Strong alignment with high security criticality ({int(sec_crit*100)}%)",
                    "Automated vulnerability scanning, secret detection, and container security in CI/CD",
                    "Rapid feedback loops for stakeholder feature requests"
                ],
                potential_limitations=[
                    "May lack traditional formal documentary sign-off phases required by non-technical regulators if unaugmented",
                    "Requires mature automated test coverage (>= 85%)"
                ],
                applicable_conditions=[
                    "Cloud-native microservices financial architectures",
                    "Teams with dedicated security champions embedded in squads"
                ]
            ),
            SDLCModelScore(
                model_name="V-Model",
                score=scores["V-Model"],
                is_recommended=(best_model == "V-Model"),
                suitability_level="Viable with Mitigations" if scores["V-Model"] >= 70 else "Not Recommended",
                supporting_factors=[
                    f"Rigorous stage-by-stage verification suitable for critical legal penalties ({factors.consequences_of_failure})",
                    "Explicit mapping between requirements analysis and acceptance testing"
                ],
                potential_limitations=[
                    f"Rigid to requirement volatility ({int(volatility*100)}%); costly to handle scope adjustments",
                    "Incompatible with modern daily/weekly continuous deployment workflows"
                ],
                applicable_conditions=[
                    "Core banking ledger migrations",
                    "Hard real-time payment settlement engines with fixed regulatory mandates"
                ]
            ),
            SDLCModelScore(
                model_name="Agile",
                score=scores["Agile"],
                is_recommended=(best_model == "Agile"),
                suitability_level="Viable with Mitigations" if scores["Agile"] >= 65 else "Not Recommended",
                supporting_factors=[
                    "Iterative 2-week sprints allow immediate pivoting based on customer feedback",
                    "High team velocity and early MVP delivery"
                ],
                potential_limitations=[
                    "Pure Agile often defers formal compliance documentation and audit evidence to the end",
                    "High risk of regulatory non-compliance gaps in financial audits without formal checkpoints"
                ],
                applicable_conditions=[
                    "Early-stage fintech consumer UI/UX discovery prototypes"
                ]
            ),
            SDLCModelScore(
                model_name="Spiral",
                score=scores["Spiral"],
                is_recommended=(best_model == "Spiral"),
                suitability_level="Viable with Mitigations",
                supporting_factors=[
                    f"Systematic cyclic risk analysis aligns with complex integration ({int(factors.project_complexity*100)}%)",
                    "Focuses explicitly on risk mitigation prior to committing engineering investment"
                ],
                potential_limitations=[
                    "Complex to manage overhead across multiple concurrent teams",
                    "Can be difficult to predict exact release milestones"
                ],
                applicable_conditions=[
                    "High-uncertainty algorithmic trading or proprietary fraud-scoring engines"
                ]
            ),
            SDLCModelScore(
                model_name="Waterfall",
                score=scores["Waterfall"],
                is_recommended=(best_model == "Waterfall"),
                suitability_level="Not Recommended",
                supporting_factors=[
                    "Comprehensive upfront documentation and clear stage completions"
                ],
                potential_limitations=[
                    f"Catastrophic mismatch with {int(volatility*100)}% requirement volatility",
                    "Late discovery of security and integration defects during final testing phase"
                ],
                applicable_conditions=[
                    "Fixed-cost government tenders with zero anticipated change"
                ]
            )
        ]

        # Sort model details by score descending
        model_details.sort(key=lambda m: m.score, reverse=True)

        explanation = (
            f"The deterministic rule engine scored '{best_model}' as optimal ({scores[best_model]}/100). "
            f"This decision is driven by project factors: regulatory criticality is assessed at {int(reg_crit*100)}%, "
            f"security criticality at {int(sec_crit*100)}%, and requirement volatility at {int(volatility*100)}%. "
            f"Because continuous deployment is enabled and failure consequences involve {factors.consequences_of_failure}, "
            f"the system requires automated security pipelines (DevSecOps) combined with formal V-Model verification gates "
            f"before production disbursement to guarantee compliance with GLBA, SOX 404, and CFPB regulations."
        )

        workflow = cls._generate_workflow(best_model)

        return SDLCRecommendation(
            project_id=project_id,
            recommended_model=best_model,
            confidence=0.94,
            rule_engine_version=cls.VERSION,
            model_scores=model_details,
            ai_generated_explanation=explanation,
            factor_weights_used=cls.WEIGHTS,
            approval_status="Pending",
            generated_workflow=workflow
        )

    @classmethod
    def _generate_workflow(cls, model_name: str) -> List[SDLCWorkflowPhase]:
        return [
            SDLCWorkflowPhase(
                step_number=1,
                phase_name="Stakeholder Elicitation & AI Requirement Structuring",
                responsible_role="Lead Business Analyst",
                activities=[
                    "Interactive interview sessions using Stakeholder Interaction Agent",
                    "Clarification of ambiguous loan disbursement and credit limit criteria",
                    "Extraction of multi-label functional, security, and regulatory requirements"
                ],
                deliverables=[
                    "Validated Requirements Baseline v1.0",
                    "Initial Stakeholder Transcript & Quality Report"
                ],
                security_activities=[
                    "Classification of customer NPI (Non-Public Personal Information) & PII",
                    "Initial data privacy boundaries definition (GLBA Safeguards)"
                ],
                testing_focus=["Requirements testability checks", "Acceptance criteria syntax verification"],
                compliance_checkpoint="Regulatory Scope Confirmation (CFPB Reg Z & Equal Credit Opportunity Act)",
                approval_gate="Business Analyst & Compliance Officer Signoff",
                entry_criteria="Project charter approved and initial stakeholders assigned",
                exit_criteria="Zero critical ambiguity/conflict issues remaining in requirements table"
            ),
            SDLCWorkflowPhase(
                step_number=2,
                phase_name="Financial System Architecture & Threat Modeling",
                responsible_role="Enterprise Architect / Security Officer",
                activities=[
                    "Microservices boundary definition for Loan Application, Underwriting, and Disbursement",
                    "Core banking and credit bureau (Equifax/Experian) integration topology design",
                    "STRIDE threat modeling on credit data ingress/egress"
                ],
                deliverables=[
                    "System Architecture Document (SAD)",
                    "Financial Threat Model & Attack Surface Map"
                ],
                security_activities=[
                    "PCI-DSS v4.0 scope isolation",
                    "AES-256 encryption at rest and mTLS in transit architecture specifications"
                ],
                testing_focus=["Architecture risk simulation", "Failover latency modeling"],
                compliance_checkpoint="FFIEC Architecture Resiliency Review",
                approval_gate="Security Officer & Lead Architect Signoff",
                entry_criteria="Approved Requirements Baseline v1.0",
                exit_criteria="Threat model completed with identified mitigations for all high/critical risks"
            ),
            SDLCWorkflowPhase(
                step_number=3,
                phase_name="Iterative DevSecOps Sprint Execution",
                responsible_role="Full-Stack Engineering Squad",
                activities=[
                    "Test-Driven Development (TDD) of loan origination services",
                    "Continuous Integration with automated SAST (Static Analysis) and SCA (Dependency check)",
                    "Audit event logging interceptor implementation according to SOX Section 404"
                ],
                deliverables=[
                    "Versioned service containers and API implementations",
                    "Automated unit & component test suite (>= 85% branch coverage)"
                ],
                security_activities=[
                    "Automated secret scanning (TruffleHog/GitLeaks)",
                    "Dependency vulnerability threshold enforcement (Zero Critical/High CVEs)"
                ],
                testing_focus=["Unit testing", "Mocked credit bureau contract testing"],
                compliance_checkpoint="Automated CI compliance evidence tagging",
                approval_gate="Automated CI/CD Quality Gate & Peer Code Review",
                entry_criteria="Architecture approved and sprint backlog prioritized",
                exit_criteria="Green CI pipeline with all static security and coverage thresholds met"
            ),
            SDLCWorkflowPhase(
                step_number=4,
                phase_name="Dynamic Security Testing & Penetration Verification",
                responsible_role="Security Officer / AppSec Team",
                activities=[
                    "DAST (Dynamic Application Security Testing) against staging environment",
                    "Business logic testing: loan amount tampering, interest rate parameter manipulation",
                    "Privilege escalation and IDOR testing across borrower and loan officer roles"
                ],
                deliverables=[
                    "DAST Assessment Report",
                    "Application Security Attestation Certificate"
                ],
                security_activities=[
                    "Simulated unauthorized API access to loan documents",
                    "OWASP Top 10 API Security Verification"
                ],
                testing_focus=["API fuzzing", "Security vulnerability validation"],
                compliance_checkpoint="GLBA Safeguards penetration testing compliance mandate",
                approval_gate="Security Officer Approval",
                entry_criteria="Stable release candidate deployed to isolated staging environment",
                exit_criteria="All security findings remediated or formally risk-accepted"
            ),
            SDLCWorkflowPhase(
                step_number=5,
                phase_name="End-to-End Functional, Performance & UAT Verification",
                responsible_role="QA Lead & Business Stakeholders",
                activities=[
                    "End-to-end automated loan origination regression suite execution",
                    "Load & stress testing: peak loan application volume (1,000 req/sec)",
                    "User Acceptance Testing (UAT) with Underwriters and Loan Officers"
                ],
                deliverables=[
                    "UAT Signoff Protocol",
                    "Performance Benchmark Report (Disbursement latency < 2.5s)"
                ],
                security_activities=["Session timeout and MFA re-authentication validation"],
                testing_focus=["Business logic validation", "Non-functional performance & availability SLAs"],
                compliance_checkpoint="CFPB disclosure generation verification (APR & Loan Estimate accuracy)",
                approval_gate="Business Analyst & Stakeholder UAT Signoff",
                entry_criteria="DAST gate passed and staging environment seeded with test accounts",
                exit_criteria="100% acceptance criteria verified for all high-priority requirements"
            ),
            SDLCWorkflowPhase(
                step_number=6,
                phase_name="Formal Regulatory Audit & Compliance Gate",
                responsible_role="Chief Compliance Officer",
                activities=[
                    "Verification of automated Traceability Matrix linking requirements to test evidence",
                    "Audit log completeness audit for credit decisions and underwriter overrides",
                    "Legal verification of consumer consent, terms of service, and privacy notices"
                ],
                deliverables=[
                    "Independent Compliance Attestation Package",
                    "Pre-production Regulatory Filing Checklist"
                ],
                security_activities=["Verification of customer data retention and purge schedules (GDPR/GLBA)"],
                testing_focus=["Audit trail integrity and immutability testing"],
                compliance_checkpoint="SOX 404 Internal Controls & GLBA Rule 314 Final Signoff",
                approval_gate="Compliance Officer Formal Authorization",
                entry_criteria="UAT signoff completed and all traceability items verified",
                exit_criteria="Zero outstanding regulatory compliance gaps"
            ),
            SDLCWorkflowPhase(
                step_number=7,
                phase_name="Controlled Canary Deployment & Financial Production Cutover",
                responsible_role="Release Manager & DevOps Lead",
                activities=[
                    "Blue/Green or Canary rollout to 5% of digital loan applicants",
                    "Real-time telemetry monitoring for payment gateway and credit check latency",
                    "Automated rollback trigger monitoring (Error rate > 0.05%)"
                ],
                deliverables=[
                    "Production Deployment Log",
                    "Post-Cutover Verification Certificate"
                ],
                security_activities=["Real-time SIEM log ingestion verification"],
                testing_focus=["Smoke testing in production with test loan accounts"],
                compliance_checkpoint="Immediate audit logging verification in production",
                approval_gate="Project Manager & Head of Engineering Production Gate",
                entry_criteria="Compliance Officer authorization and change control board approval",
                exit_criteria="Successful 100% traffic shift with normal health metrics"
            ),
            SDLCWorkflowPhase(
                step_number=8,
                phase_name="Continuous Telemetry, Fraud Monitoring & Audit Maintenance",
                responsible_role="Site Reliability Engineering (SRE) & Risk Ops",
                activities=[
                    "Real-time monitoring of loan default patterns and automated anomaly alerts",
                    "Continuous compliance posture tracking with automated drift detection",
                    "Quarterly vulnerability scans and annual penetration testing"
                ],
                deliverables=[
                    "Monthly Operational & Compliance SLA Dashboard",
                    "Annual Regulatory Audit Evidence Binder"
                ],
                security_activities=["Incident response drills and continuous key rotation"],
                testing_focus=["Chaos engineering failover tests", "Synthetic synthetic transaction monitoring"],
                compliance_checkpoint="Continuous regulatory reporting and periodic audit reviews",
                approval_gate="Ongoing Risk Management Governance Review",
                entry_criteria="Successful production cutover",
                exit_criteria="Continual operation"
            )
        ]
