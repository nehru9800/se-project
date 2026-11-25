
from typing import TypedDict, Any

from langgraph.graph import StateGraph, END

from database.store import DataStore
from agents.coordinator import CoordinatorAgent


class AnalysisState(TypedDict, total=False):
    project_id: str
    user_name: str
    user_role: str
    result: dict[str, Any]
    error: str


def validate_project(state: AnalysisState):
    """Check that the requested project exists."""
    store = DataStore.get_instance()
    project_id = state["project_id"]

    if project_id not in store.projects:
        return {"error": f"Project {project_id} not found"}

    return {}


def execute_analysis(state: AnalysisState):
    """Execute the existing financial analysis pipeline."""
    result = CoordinatorAgent.run_full_pipeline(
        project_id=state["project_id"],
        user_name=state.get("user_name", "Lead Analyst"),
        user_role=state.get("user_role", "Business Analyst"),
    )

    return {"result": result}


def route_after_validation(state: AnalysisState):
    if state.get("error"):
        return "finish"
    return "execute"


def finish_with_error(state: AnalysisState):
    return {}


def build_analysis_graph():
    workflow = StateGraph(AnalysisState)

    workflow.add_node("validate_project", validate_project)
    workflow.add_node("execute_analysis", execute_analysis)
    workflow.add_node("finish_with_error", finish_with_error)

    workflow.set_entry_point("validate_project")

    workflow.add_conditional_edges(
        "validate_project",
        route_after_validation,
        {
            "execute": "execute_analysis",
            "finish": "finish_with_error",
        },
    )

    workflow.add_edge("execute_analysis", END)
    workflow.add_edge("finish_with_error", END)

    return workflow.compile()


analysis_graph = build_analysis_graph()


def run_langgraph_pipeline(
    project_id: str,
    user_name: str = "Lead Analyst",
    user_role: str = "Business Analyst",
):
    initial_state: AnalysisState = {
        "project_id": project_id,
        "user_name": user_name,
        "user_role": user_role,
    }

    final_state = analysis_graph.invoke(initial_state)

    if final_state.get("error"):
        raise ValueError(final_state["error"])

    return final_state["result"]
