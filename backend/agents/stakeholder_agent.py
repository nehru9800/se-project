import re
from typing import Dict, Any, List, Tuple
from schemas.interview import InterviewTurnResponse

class StakeholderInteractionAgent:
    """
    Conducts domain-specific elicitation interviews for financial systems.
    Identifies missing topics (KYC, limits, adverse action, audit logs, DTI)
    and dynamically produces context-aware follow-up clarification questions.
    """

    FINANCIAL_DOMAINS = {
        "loan_types": ["personal", "auto", "mortgage", "commercial", "student", "credit line"],
        "underwriting_rules": ["dti", "debt-to-income", "credit score", "fico", "income", "underwriting", "approval threshold"],
        "identity_kyc": ["kyc", "identity", "photo id", "biometric", "ofac", "sanctions", "cip", "patriot act"],
        "transaction_limits": ["disbursement", "limit", "transfer", "max amount", "$", "25,000", "funds release"],
        "security_auth": ["mfa", "multi-factor", "password", "encryption", "aes", "token", "fido2"],
        "compliance_disclosures": ["disclosure", "apr", "truth in lending", "reg z", "estimate", "adverse action"],
        "audit_retention": ["audit log", "7 years", "retention", "immutable", "sox", "tamper", "record"]
    }

    @classmethod
    def process_turn(cls, user_message: str, history: List[Dict[str, Any]]) -> Dict[str, Any]:
        msg_lower = user_message.lower()
        
        # Analyze mentioned domains
        mentioned_domains = []
        for domain, keywords in cls.FINANCIAL_DOMAINS.items():
            if any(k in msg_lower for k in keywords):
                mentioned_domains.append(domain)

        # Identify missing financial aspects across entire conversation
        all_text = " ".join([h.get("content", "").lower() for h in history]) + " " + msg_lower
        missing_aspects = []
        if not any(k in all_text for k in cls.FINANCIAL_DOMAINS["identity_kyc"]):
            missing_aspects.append("Customer Identification (KYC/CIP & OFAC Sanctions Screening)")
        if not any(k in all_text for k in cls.FINANCIAL_DOMAINS["transaction_limits"]):
            missing_aspects.append("Transaction Limits & Dual-Officer Disbursement Controls")
        if not any(k in all_text for k in cls.FINANCIAL_DOMAINS["compliance_disclosures"]):
            missing_aspects.append("Statutory Disclosures (CFPB Reg Z 3-Day Loan Estimate & APR Precision)")
        if not any(k in all_text for k in cls.FINANCIAL_DOMAINS["audit_retention"]):
            missing_aspects.append("SOX 404 / GLBA 7-Year Immutable Audit Trail")

        # Formulate context-aware follow-up
        if "fast" in msg_lower or "quick" in msg_lower or "frictionless" in msg_lower:
            reply = (
                "You noted that the process should be fast and frictionless. To convert this into an engineering requirement: "
                "What is the maximum acceptable automated decision time (e.g. under 180 seconds), and how should exceptional cases "
                "with border-line credit scores or high DTI be routed to human underwriters?"
            )
            suggested = [
                "Automated approval within 120s for FICO >= 680 and DTI <= 43%",
                "Route DTI 43.1% - 50% to manual senior underwriter queue",
                "Decline applications over 50% DTI automatically"
            ]
        elif "disburs" in msg_lower or "payout" in msg_lower or "transfer" in msg_lower:
            reply = (
                "Regarding funds disbursement: Federal guidelines (FFIEC) recommend dual authorization for high-value funds transfers. "
                "Will your platform allow instant automated payouts for all amounts, or will you enforce a dollar threshold (such as $25,000) "
                "above which a secondary Risk Officer must authorize the transfer?"
            )
            suggested = [
                "Automated disbursement up to $25,000; dual officer authorization above $25,000",
                "Mandatory 24-hour escrow hold on first-time borrowers",
                "Instant RTP/FedNow settlement for authenticated existing account holders"
            ]
        elif missing_aspects:
            next_topic = missing_aspects[0]
            reply = (
                f"Understood. Moving to key regulatory controls: how will the system address {next_topic}? "
                "Specifically, what compliance rules and evidence records must be generated to satisfy federal auditing standards?"
            )
            suggested = [
                "Integrate certified third-party KYC with 3D selfie liveness and OFAC check",
                "Record immutable audit logs for all credit scoring decisions retained for 7 years",
                "Deliver CFPB Loan Estimate disclosures within 3 business days"
            ]
        else:
            reply = (
                "Thank you. We have captured key functional, underwriting, security, and compliance boundaries. "
                "Are there any legacy core banking integrations (e.g. FIS, Fiserv, Jack Henry) or third-party credit bureau SLA "
                "constraints that must be documented?"
            )
            suggested = [
                "Integrate with core banking system via ISO 20022 REST APIs",
                "Tri-bureau credit pulling (Equifax, Experian, TransUnion) with automated fallback",
                "Proceed to Run Multi-Agent Analysis"
            ]

        return {
            "reply": reply,
            "agent_name": "Stakeholder Interaction Agent",
            "missing_aspects_probed": missing_aspects,
            "suggested_followups": suggested,
            "candidate_requirements_found": len(mentioned_domains) + 1,
            "transcript_length": len(history) + 2
        }
