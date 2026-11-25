from pydantic import BaseModel
from typing import List, Optional

class DocumentMetadata(BaseModel):
    id: str
    project_id: str
    filename: str
    document_type: str # "Requirement Document", "Regulatory Standard", "Policy Document", "Legacy Architecture", "Audit Report"
    upload_date: str
    version: str
    source: str
    jurisdiction: str
    effective_date: str
    processing_status: str # "Uploaded", "Chunked & Embedded", "Indexed in ChromaDB", "Error"
    chunk_count: int = 0
    extracted_text_preview: Optional[str] = None
    file_path: Optional[str] = None

class KnowledgeBaseItem(BaseModel):
    id: str
    title: str
    category: str # "Financial Regulations", "Company Policies", "Security Standards", "Privacy Policies", "SDLC Guidelines"
    source: str
    version: str
    jurisdiction: str
    effective_date: str
    applicability: str
    status: str = "Active"
    summary: str
    key_controls: List[str] = []
