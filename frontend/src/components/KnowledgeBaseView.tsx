import React, { useState } from 'react';
import { 
  BookOpen, Search, ShieldCheck, FileText, ExternalLink, 
  Tag, Filter, CheckCircle2, Scale 
} from 'lucide-react';
import { KnowledgeBaseItem } from '../types';

interface KnowledgeBaseViewProps {
  knowledgeBase: KnowledgeBaseItem[];
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ knowledgeBase }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = knowledgeBase.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.title.toLowerCase().includes(q) ||
             item.summary.toLowerCase().includes(q) ||
             item.source.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Regulatory & Institutional Knowledge Base</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Active Corpus
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative regulatory and corporate policy documents indexed into the RAG vector store for automated requirement citation.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search regulations & policies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Financial Regulations">Financial Regulations</option>
            <option value="Security Standards">Security Standards</option>
            <option value="Company Policies">Company Policies</option>
            <option value="Privacy Policies">Privacy Policies</option>
            <option value="SDLC Guidelines">SDLC Guidelines</option>
          </select>
        </div>
      </div>

      {/* Grid of Knowledge Base Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/70 rounded-xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all shadow-card-dark flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.status}</span>
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-100">{item.title}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.summary}
              </p>

              {/* Key Controls */}
              {item.key_controls && item.key_controls.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">
                    Key Enforced Controls:
                  </span>
                  <div className="space-y-1">
                    {item.key_controls.map((kc, idx) => (
                      <div key={idx} className="text-[11px] text-slate-300 flex items-center space-x-1.5 font-mono">
                        <span className="text-blue-400">•</span>
                        <span>{kc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
              <div>Source: <span className="text-slate-300">{item.source}</span></div>
              <div>Version: <span className="text-slate-300">{item.version}</span></div>
              <div>Jurisdiction: <span className="text-slate-300">{item.jurisdiction}</span></div>
              <div>Effective: <span className="text-slate-300">{item.effective_date}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
