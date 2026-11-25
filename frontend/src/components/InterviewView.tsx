import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, User, Send, Sparkles, AlertCircle, CheckCircle2, 
  HelpCircle, ArrowRight, Download, PlusCircle 
} from 'lucide-react';
import { InterviewMessage } from '../types';

interface InterviewViewProps {
  projectId: string;
  transcript: InterviewMessage[];
  onSendMessage: (msg: string) => Promise<any>;
  onExtractRequirements: () => Promise<any>;
}

export const InterviewView: React.FC<InterviewViewProps> = ({
  projectId,
  transcript,
  onSendMessage,
  onExtractRequirements
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractSuccess, setExtractSuccess] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;
    setIsSending(true);
    setInputText('');
    try {
      await onSendMessage(text);
    } catch (e) {
      console.error('Failed to send interview message', e);
    } finally {
      setIsSending(false);
    }
  };

  const handleExtract = async () => {
    setIsExtracting(true);
    setExtractSuccess(null);
    try {
      const res = await onExtractRequirements();
      setExtractSuccess(`Successfully extracted and added ${res.extracted_requirements || 2} new requirements to the register!`);
    } catch (e) {
      console.error('Failed to extract', e);
    } finally {
      setIsExtracting(false);
    }
  };

  // Preset quick prompt suggestions based on financial topics
  const quickSuggestions = [
    "Underwriting: Auto-approve applications with FICO >= 680 and DTI <= 43% within 180s.",
    "Security: Enforce FIDO2 WebAuthn MFA and AES-256 encryption on all borrower PII.",
    "Disbursement: Disburse approved loans under $25k instantly, but mandate dual risk signoff above $25k.",
    "Disclosures: Deliver CFPB Truth in Lending Loan Estimate PDF within 3 business days."
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-400" />
            <h1 className="text-base font-bold text-white">Stakeholder Interaction Agent</h1>
            <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
              Active Elicitation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Conducts an intelligent interview to probe unstated constraints: KYC, transaction caps, adverse action notices, DTI limits, and audit trails.
          </p>
        </div>

        <button
          onClick={handleExtract}
          disabled={isExtracting || transcript.length < 2}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-glow-sm disabled:opacity-50 transition-all flex-shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isExtracting ? 'Extracting...' : 'Extract Formal Requirements'}</span>
        </button>
      </div>

      {extractSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{extractSuccess}</span>
        </div>
      )}

      {/* Transcript Chat Area */}
      <div className="flex-1 bg-slate-950/60 rounded-xl border border-slate-800/80 p-5 overflow-y-auto space-y-4">
        {transcript.map((msg) => {
          const isAgent = msg.role === 'agent';
          return (
            <div 
              key={msg.id}
              className={`flex items-start space-x-3 ${isAgent ? 'max-w-3xl' : 'max-w-2xl ml-auto flex-row-reverse space-x-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isAgent ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-300'
              }`}>
                {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`space-y-2 p-4 rounded-2xl text-xs leading-relaxed ${
                isAgent 
                  ? 'bg-slate-900 border border-slate-800 text-slate-200' 
                  : 'bg-blue-600 text-white rounded-tr-none'
              }`}>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-slate-300">
                    {isAgent ? (msg.agent_name || 'Stakeholder Interaction Agent') : 'Borrower / Product Stakeholder'}
                  </span>
                  <span className="font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Identified Topics Tags */}
                {isAgent && msg.identified_domain_topics && msg.identified_domain_topics.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">Domain Probes:</span>
                    {msg.identified_domain_topics.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center space-x-3 text-xs text-blue-400 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <span>Stakeholder Agent is analyzing financial rules and formulating follow-up...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Followups */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Suggested Stakeholder Answers:</span>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="text-[11px] text-left px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="flex items-center space-x-2 pt-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="State a requirement or answer the agent's question (e.g., 'Customers should upload pay stubs for loan verification')..."
          className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 placeholder:text-slate-500 shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-sm disabled:opacity-50 transition-all flex items-center space-x-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
