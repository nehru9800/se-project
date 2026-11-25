
from typing import Dict, Any
from datetime import datetime

from database.store import DataStore

from agents.analysis_agents import (
    ClassificationAgent,
    ClarificationAgent,
    ConflictDetectionAgent,
    SecurityPrivacyAgent,
    ValidationAgent,
)

from agents.gemini_agents import GeminiFinancialAgent

from rules.sdlc_engine import FinTechSDLCRuleEngine
from schemas.project import ProjectFactors


class CoordinatorAgent:
    """
    Coordinates the financial requirements analysis pipeline.

    Includes:
    - Requirement classification
    - Gemini-powered AI insights
    - Quality and ambiguity detection
    - Conflict detection
    - Compliance mapping
    - Security and privacy analysis
    - Risk analysis
    - Validation
    - Deterministic SDLC evaluation
    - Human approval routing
    """

    STAGES = [
        "Input Collection",
        "Requirement Extraction",
        "Multi-Label Classification",
        "Quality & Ambiguity Detection",
        "Conflict Detection",
        "RAG Compliance Mapping",
        "Security & Privacy Threat Modeling",
        "Risk Analysis",
        "Validation Check",
        "Deterministic SDLC Evaluation",
        "Human Approval Routing",
    ]

    @classmethod
    def run_full_pipeline(
        cls,
        project_id: str,
        user_name: str = "Lead Analyst",
        user_role: str = "Business Analyst",
    ) -> Dict[str, Any]:

        store = DataStore.get_instance()

        project = store.projects.get(project_id)

        if not project:
            raise ValueError(f"Project {project_id} not found")

        requirements = store.requirements.get(project_id, [])

        factors_dict = project.get("factors", {})
        factors = ProjectFactors(**factors_dict)

        pipeline_log = []

        # ------------------------------------------------
        # 1. INPUT COLLECTION
        # ------------------------------------------------

        documents = store.documents.get(project_id, [])

        pipeline_log.append({
            "stage": "Input Collection",
            "status": "Completed",
            "detail": (
                f"Gathered {len(requirements)} requirements "
                f"and {len(documents)} source documents."
            ),
        })

        # ------------------------------------------------
        # 2. REQUIREMENT CLASSIFICATION
        # ------------------------------------------------

        for req in requirements:
            statement = req.get("statement", "")

            categories = ClassificationAgent.classify(statement)

            if categories:
                existing = req.get("categories", [])
                req["categories"] = list(
                    set(existing + categories)
                )

        pipeline_log.append({
            "stage": "Multi-Label Classification",
            "status": "Completed",
            "detail": (
                f"Classified {len(requirements)} requirements "
                "using existing financial taxonomies."
            ),
        })

        # ------------------------------------------------
        # 3. GEMINI AI ANALYSIS
        # ------------------------------------------------

        gemini_insights = []
        gemini_status = "Completed"

        try:
            gemini_insights = (
                GeminiFinancialAgent.analyze_requirements(
                    requirements
                )
            )

            insights_by_id = {
                str(item.get("id")): item
                for item in gemini_insights
            }

            for req in requirements:
                insight = insights_by_id.get(
                    str(req.get("id"))
                )

                if insight:
                    req["ai_insights"] = insight

        except Exception as exc:
            gemini_status = "Unavailable"
            print(f"Gemini analysis warning: {exc}")

        pipeline_log.append({
            "stage": "Gemini AI Requirement Analysis",
            "status": gemini_status,
            "detail": (
                f"Generated AI insights for "
                f"{len(gemini_insights)} requirements."
                if gemini_status == "Completed"
                else "Gemini unavailable; existing analysis continued."
            ),
        })

        # ------------------------------------------------
        # 4. QUALITY AND AMBIGUITY DETECTION
        # ------------------------------------------------

        ambiguity_count = 0

        for req in requirements:
            issues = ClarificationAgent.analyze_quality(req)

            if issues:
                req["quality_issues"] = [
                    issue.model_dump()
                    for issue in issues
                ]

                req["status"] = "Under Clarification"
                ambiguity_count += len(issues)

        pipeline_log.append({
            "stage": "Quality & Ambiguity Detection",
            "status": (
                "Needs Review"
                if ambiguity_count > 0
                else "Completed"
            ),
            "detail": (
                f"Detected {ambiguity_count} quality and "
                "ambiguity issues."
            ),
        })

        # ------------------------------------------------
        # 5. CONFLICT DETECTION
        # ------------------------------------------------

        conflicts = ConflictDetectionAgent.detect_conflicts(
            requirements
        )

        for req in requirements:
            conflicts_for_req = []

            for conflict in conflicts:
                if conflict["req_a"] == req["id"]:
                    conflicts_for_req.append(
                        conflict["req_b"]
                    )

                elif conflict["req_b"] == req["id"]:
                    conflicts_for_req.append(
                        conflict["req_a"]
                    )

            req["conflicts_with"] = list(
                set(conflicts_for_req)
            )

        pipeline_log.append({
            "stage": "Conflict Detection",
            "status": (
                "Needs Review"
                if conflicts
                else "Completed"
            ),
            "detail": (
                f"Detected {len(conflicts)} potential "
                "requirement conflicts."
            ),
        })

        # ------------------------------------------------
        # 6. COMPLIANCE MAPPING
        # ------------------------------------------------

        compliance_mappings = (
            store.compliance_mappings.get(project_id, [])
        )

        gap_count = sum(
            1
            for item in compliance_mappings
            if item.get("status") == "Compliance Gap"
        )

        pipeline_log.append({
            "stage": "RAG Compliance Mapping",
            "status": (
                "Needs Review"
                if gap_count > 0
                else "Completed"
            ),
            "detail": (
                f"Reviewed {len(compliance_mappings)} "
                f"compliance mappings. {gap_count} gaps found."
            ),
        })

        # ------------------------------------------------
        # 7. SECURITY AND PRIVACY
        # ------------------------------------------------

        sec_results = SecurityPrivacyAgent.evaluate_security(
            requirements
        )

        security_posture = sec_results.get(
            "security_posture",
            "Unknown",
        )

        pipeline_log.append({
            "stage": "Security & Privacy Threat Modeling",
            "status": (
                "Completed"
                if security_posture == "Strong"
                else "Needs Review"
            ),
            "detail": (
                f"Security posture: {security_posture}."
            ),
        })

        # ------------------------------------------------
        # 8. RISK ANALYSIS
        # ------------------------------------------------

        risks = store.risks.get(project_id, [])

        critical_risks = sum(
            1
            for risk in risks
            if risk.get("severity") == "Critical"
        )

        pipeline_log.append({
            "stage": "Risk Analysis",
            "status": "Completed",
            "detail": (
                f"Assessed {len(risks)} risks, "
                f"including {critical_risks} critical risks."
            ),
        })

        # ------------------------------------------------
        # 9. VALIDATION
        # ------------------------------------------------

        validation = ValidationAgent.validate_dataset(
            requirements,
            compliance_mappings,
        )

        pipeline_log.append({
            "stage": "Validation Check",
            "status": "Completed",
            "detail": (
                f"Quality index: "
                f"{validation['quality_percentage']}%. "
                f"Grounded evidence index: "
                f"{validation['grounded_evidence_percentage']}%."
            ),
        })

        # ------------------------------------------------
        # 10. DETERMINISTIC SDLC EVALUATION
        # ------------------------------------------------

        sdlc_rec = FinTechSDLCRuleEngine.evaluate(
            project_id,
            factors,
        )

        store.sdlc_recommendations[
            project_id
        ] = sdlc_rec.model_dump()

        pipeline_log.append({
            "stage": "Deterministic SDLC Evaluation",
            "status": "Completed",
            "detail": (
                f"Recommended {sdlc_rec.recommended_model} "
                "using deterministic SDLC rules."
            ),
        })

        # ------------------------------------------------
        # 11. HUMAN APPROVAL ROUTING
        # ------------------------------------------------

        pending_approvals = [
            approval
            for approval in store.approvals
            if approval.get("project_id") == project_id
            and approval.get("status") == "Pending"
        ]

        pipeline_log.append({
            "stage": "Human Approval Routing",
            "status": "Pending",
            "detail": (
                f"{len(pending_approvals)} decisions "
                "are awaiting human review."
            ),
        })

        # ------------------------------------------------
        # UPDATE PROJECT
        # ------------------------------------------------

        project["status"] = "AI Analysis Completed"

        project["current_pipeline_stage"] = (
            "Human Approval Gates"
        )

        project["updated_at"] = datetime.now().isoformat()

        # ------------------------------------------------
        # AUDIT LOG
        # ------------------------------------------------

        store.log_audit(
            action="Full Multi-Agent Pipeline Execution",
            user_name=user_name,
            user_role=user_role,
            project_id=project_id,
            agent_name="Coordinator Agent",
            input_summary=(
                "Triggered LangGraph-compatible "
                "financial requirements analysis."
            ),
            output_summary=(
                f"Analysis completed with "
                f"{ambiguity_count} ambiguities, "
                f"{len(conflicts)} conflicts, "
                f"{len(pending_approvals)} pending approvals."
            ),
        )

        # ------------------------------------------------
        # FINAL RESULT
        # ------------------------------------------------

        return {
            "project_id": project_id,
            "pipeline_status": "Completed with Approval Gates",
            "stages": pipeline_log,
            "total_stages": len(pipeline_log),
            "completed_stages": sum(
                1
                for stage in pipeline_log
                if stage["status"] in [
                    "Completed",
                    "Needs Review",
                ]
            ),
            "pending_approvals_count": len(
                pending_approvals
            ),
            "recommended_sdlc": (
                sdlc_rec.recommended_model
            ),
            "gemini_insights_count": len(
                gemini_insights
            ),
            "timestamp": datetime.now().isoformat(),
        }
