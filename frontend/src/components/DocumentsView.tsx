import React, { useState } from 'react';
import { 
  FileText, Upload, Download, CheckCircle2, FileSpreadsheet, 
  FileCode, Sparkles, AlertCircle, Eye, ArrowDownToLine 
} from 'lucide-react';
import { DocumentMetadata } from '../types';

interface DocumentsViewProps {
  projectId: string;
  documents: DocumentMetadata[];
  onUploadDocument: (file: File, docType: string, jurisdiction: string, version: string) => Promise<any>;
  onGenerateDocument: (format: 'markdown' | 'docx' | 'pdf') => Promise<any>;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  projectId,
  documents,
  onUploadDocument,
  onGenerateDocument
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('Regulatory Standard');
  const [jurisdiction, setJurisdiction] = useState('US Federal');
  const [version, setVersion] = useState('v1.0');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ format: string; filename: string; download_url: string; preview?: string } | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadSuccess(null);
    try {
      await onUploadDocument(selectedFile, docType, jurisdiction, version);
      setUploadSuccess(`Successfully uploaded, chunked, and indexed ${selectedFile.name} into RAG Knowledge Base!`);
      setSelectedFile(null);
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async (format: 'markdown' | 'docx' | 'pdf') => {
    setIsGenerating(true);
    try {
      const res = await onGenerateDocument(format);
      setGeneratedResult(res);
    } catch (e) {
      console.error('Generation failed', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">Document Hub & SRS Generation</h1>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
            IEEE-830 Compliant
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Upload and index institutional policy documents into the RAG vector store, or auto-generate formal Software Requirements Specifications (SRS).
        </p>
      </div>

      {/* SRS Generator Card */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-card-dark space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Generate Formal Specification Documents</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Produces a complete Software Requirements Specification (SRS) with Introduction, Architecture, Functional & Security Requirements, RAG Regulatory Citations, and Risk Matrix.
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => handleGenerate('markdown')}
              disabled={isGenerating}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all disabled:opacity-50"
            >
              <FileCode className="w-4 h-4" />
              <span>Markdown (.md)</span>
            </button>

            <button
              onClick={() => handleGenerate('docx')}
              disabled={isGenerating}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Word (.docx)</span>
            </button>

            <button
              onClick={() => handleGenerate('pdf')}
              disabled={isGenerating}
              className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>PDF Report</span>
            </button>
          </div>
        </div>

        {/* Generation Result Banner */}
        {generatedResult && (
          <div className="p-4 bg-slate-950/80 rounded-xl border border-blue-500/40 space-y-3 pt-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Document Ready: {generatedResult.filename}</span>
              </div>

              <a
                href={generatedResult.download_url}
                target="_blank"
                rel="noreferrer"
                download
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Download File</span>
              </a>
            </div>

            {generatedResult.preview && (
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
                {generatedResult.preview}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Ingestion & Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center space-x-2">
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Upload Regulatory or Policy Document</span>
          </h2>
          <p className="text-xs text-slate-400">
            Supports PDF, DOCX, TXT, CSV. Documents are automatically chunked and indexed into the RAG vector engine.
          </p>

          <form onSubmit={handleUpload} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Select File (.pdf, .docx, .txt, .csv)</label>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.csv"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
              >
                <option value="Regulatory Standard">Regulatory Standard</option>
                <option value="Policy Document">Policy Document</option>
                <option value="Requirement Document">Requirement Document</option>
                <option value="Legacy Architecture">Legacy Architecture</option>
                <option value="Audit Report">Audit Report</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Jurisdiction</label>
                <input
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-glow-sm disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isUploading ? 'Chunking & Embedding...' : 'Ingest Document to ChromaDB'}</span>
            </button>
          </form>

          {uploadSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}
        </div>

        {/* Ingested Documents List */}
        <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Indexed Documents Repository ({documents.length})
            </h2>
            <span className="text-[11px] font-mono text-emerald-400">RAG Vector Index: 100% Active</span>
          </div>

          <div className="space-y-3">
            {documents.map((d) => (
              <div 
                key={d.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-slate-200">{d.filename}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {d.document_type}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {d.processing_status} ({d.chunk_count} Chunks)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1 font-mono">
                  <span>Version: {d.version}</span>
                  <span>Jurisdiction: {d.jurisdiction}</span>
                  <span>Uploaded: {new Date(d.upload_date).toLocaleDateString()}</span>
                  <span>Source: {d.source}</span>
                </div>

                {d.extracted_text_preview && (
                  <p className="text-[11px] text-slate-400 italic line-clamp-2 pt-1 border-t border-slate-800/80">
                    "{d.extracted_text_preview}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
