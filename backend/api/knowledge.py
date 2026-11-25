from fastapi import APIRouter, Query
from typing import List, Optional
from database.store import DataStore
from schemas.document import KnowledgeBaseItem

router = APIRouter(prefix="/knowledge-base", tags=["Knowledge Base"])

@router.get("", response_model=List[KnowledgeBaseItem])
def list_knowledge_base(category: Optional[str] = Query(None), search: Optional[str] = Query(None)):
    store = DataStore.get_instance()
    items = store.knowledge_base
    if category and category != "All":
        items = [k for k in items if k.get("category") == category]
    if search:
        s = search.lower()
        items = [k for k in items if s in k.get("title", "").lower() or s in k.get("summary", "").lower()]
    return [KnowledgeBaseItem(**k) for k in items]
