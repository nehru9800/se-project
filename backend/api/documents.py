import os
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Body
from fastapi.responses import FileResponse, PlainTextResponse
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
from database.store import DataStore
from schemas.document import DocumentMetadata
from rag.vector_engine import FinTechRAGEngine
from services.doc_generator import DocumentGenerator
from config import settings
from pypdf import PdfReader
from docx import Document as DocxReader

router = APIRouter(prefix="/projects/{project_id}/documents", tags=["Documents"])

@router.get("", response_model=List[DocumentMetadata])
def list_documents(project_id: str):
    store = DataStore.get_instance()
    docs = store.documents.get(project_id, [])
    return [DocumentMetadata(**d) for d in docs]

@router.post("/upload", response_model=DocumentMetadata)
async def upload_document(
    project_id: str,
    file: UploadFile = File(...),
    document_type: str = Form("Regulatory Standard"),
    jurisdiction: str = Form("US Federal"),
    version: str = Form("v1.0")
):
    store = DataStore.get_instance()
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")

    file_ext = os.path.splitext(file.filename)[1].lower()
    allowed_exts = [".pdf", ".docx", ".txt", ".csv"]
    if file_ext not in allowed_exts:
        raise HTTPException(status_code=400, detail=f"Unsupported format {file_ext}. Supported: PDF, DOCX, TXT, CSV")

    # Save file
    file_id = f"doc-{uuid.uuid4().hex[:8]}"
    save_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}_{file.filename}")
    content = await file.read()
    with open(save_path, "wb") as f:
        f.write(content)

    # Extract text based on extension
    extracted_text = ""
    try:
        if file_ext == ".pdf":
            reader = PdfReader(save_path)
            for page in reader.pages:
                extracted_text += page.extract_text() or ""
        elif file_ext == ".docx":
            d = DocxReader(save_path)
            extracted_text = "\n".join([p.text for p in d.paragraphs])
        else: # .txt or .csv
            extracted_text = content.decode("utf-8", errors="ignore")
    except Exception as e:
        extracted_text = f"Text extraction error: {str(e)}"

    # Index into RAG vector engine
    rag = FinTechRAGEngine.get_instance()
    rag.add_document(
        title=file.filename,
        text=extracted_text,
        jurisdiction=jurisdiction,
        version=version,
        section="Uploaded Document Section"
    )

    now = datetime.now().isoformat()
    doc_metadata = {
        "id": file_id,
        "project_id": project_id,
        "filename": file.filename,
        "document_type": document_type,
        "upload_date": now,
        "version": version,
        "source": "User Upload",
        "jurisdiction": jurisdiction,
        "effective_date": datetime.now().strftime("%Y-%m-%d"),
        "processing_status": "Indexed in ChromaDB",
        "chunk_count": max(1, len(extracted_text) // 500),
        "extracted_text_preview": (extracted_text[:300] + "...") if len(extracted_text) > 300 else extracted_text,
        "file_path": save_path
    }

    store.documents.setdefault(project_id, []).append(doc_metadata)

    store.log_audit(
        action="Document Uploaded & RAG Indexed",
        user_name="Business Analyst",
        user_role="Business Analyst",
        project_id=project_id,
        agent_name="Coordinator Agent",
        input_summary=f"Uploaded {file.filename} ({document_type}, {jurisdiction})",
        output_summary=f"Extracted {len(extracted_text)} chars, created {doc_metadata['chunk_count']} vector chunks and indexed into ChromaDB"
    )

    return DocumentMetadata(**doc_metadata)

@router.post("/generate")
def generate_document(
    project_id: str,
    format_type: str = Body("markdown", embed=True), # "markdown", "docx", "pdf"
    doc_type: str = Body("SRS", embed=True)
):
    store = DataStore.get_instance()
    project = store.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    reqs = store.requirements.get(project_id, [])
    compliance = store.compliance_mappings.get(project_id, [])
    risks = store.risks.get(project_id, [])
    sdlc = store.sdlc_recommendations.get(project_id)

    safe_title = "".join(c for c in project.get("name", "Project") if c.isalnum() or c in (' ', '_', '-')).rstrip()
    safe_title = safe_title.replace(" ", "_")

    if format_type == "markdown":
        md_content = DocumentGenerator.generate_srs_markdown(project, reqs, compliance, risks, sdlc)
        filename = f"{safe_title}_SRS.md"
        filepath = os.path.join(settings.GENERATED_DOCS_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(md_content)
        return {
            "status": "success",
            "format": "markdown",
            "filename": filename,
            "download_url": f"/api/v1/projects/{project_id}/documents/download/{filename}",
            "preview": md_content[:1500] + "\n\n...[Full document available for download]..."
        }

    elif format_type == "docx":
        filename = f"{safe_title}_SRS.docx"
        filepath = DocumentGenerator.generate_docx(project, reqs, compliance, risks, filename)
        return {
            "status": "success",
            "format": "docx",
            "filename": filename,
            "download_url": f"/api/v1/projects/{project_id}/documents/download/{filename}"
        }

    elif format_type == "pdf":
        filename = f"{safe_title}_SRS.pdf"
        filepath = DocumentGenerator.generate_pdf(project, reqs, compliance, filename)
        return {
            "status": "success",
            "format": "pdf",
            "filename": filename,
            "download_url": f"/api/v1/projects/{project_id}/documents/download/{filename}"
        }

    else:
        raise HTTPException(status_code=400, detail="Invalid format_type. Choose markdown, docx, or pdf")

@router.get("/download/{filename}")
def download_generated_doc(project_id: str, filename: str):
    filepath = os.path.join(settings.GENERATED_DOCS_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Generated document file not found")
    
    media_types = {
        ".pdf": "application/pdf",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".md": "text/markdown",
        ".txt": "text/plain"
    }
    ext = os.path.splitext(filename)[1].lower()
    return FileResponse(filepath, media_type=media_types.get(ext, "application/octet-stream"), filename=filename)
