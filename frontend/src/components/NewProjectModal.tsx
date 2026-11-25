import React, { useState } from 'react';
import { X, Building2, Layers, Shield, Sparkles } from 'lucide-react';
import { ProjectCreate, ProjectFactors } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: Partial<any>) => Promise<any>;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('Digital Commercial Loan Origination');
  const [financialDomain, setFinancialDomain] = useState('Loan Processing / Digital Origination');
  const [description, setDescription] = useState(
    'A high-throughput cloud-native commercial credit origination system with automated KYC, financial statement analysis, and real-time underwriting.'
  );
  const [businessObjective, setBusinessObjective] = useState(
    'Reduce commercial loan origination turnaround from 14 days to under 4 hours while adhering to GLBA Safeguards and SOX 404 controls.'
  );
  const [expectedUsers, setExpectedUsers] = useState('Commercial Borrowers, Loan Officers, Senior Risk Underwriters, Auditors');
  const [projectSize, setProjectSize] = useState('Enterprise');
  const [budget, setBudget] = useState('$3,200,000');
  const [timeline, setTimeline] = useState('14 Months');

  // Factors
  const [regCrit, setRegCrit] = useState(0.90);
  const [secCrit, setSecCrit] = useState(0.95);
  const [volatility, setVolatility] = useState(0.60);
  const [complexity, setComplexity] = useState(0.80);
  const [legacyDep, setLegacyDep] = useState(0.65);
  const [cdEnabled, setCdEnabled] = useState(true);
  const [formalVerif, setFormalVerif] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name,
        financial_domain: financialDomain,
        description,
        business_objective: businessObjective,
        expected_users: expectedUsers,
        project_size: projectSize,
        budget,
        timeline,
        factors: {
          regulatory_criticality: regCrit,
          security_criticality: secCrit,
          requirement_volatility: volatility,
          project_complexity: complexity,
          system_size: projectSize,
          legacy_dependency: legacyDep,
          continuous_deployment: cdEnabled,
          stakeholder_availability: 0.85,
          formal_verification_needed: formalVerif,
          consequences_of_failure: 'Severe Financial & Legal Penalty',
          budget_flexibility: 'Moderate',
          timeline_months: 14
        }
      };

      await onCreate(payload);
      onClose();
    } catch (err) {
      console.error('Failed to create project', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b1622] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-card-dark overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Create New Financial Software Project</h2>
              <p className="text-[11px] text-slate-400">Initialize workspace and calibrate the multi-agent decision engine</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          <div>
            <label className="text-slate-300 font-medium block mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Financial Domain</label>
              <select
                value={financialDomain}
                onChange={(e) => setFinancialDomain(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Loan Processing / Digital Origination">Loan Processing / Digital Origination</option>
                <option value="Digital Banking">Digital Banking</option>
                <option value="Payment Systems">Payment Systems</option>
                <option value="Fraud Detection & AML">Fraud Detection & AML</option>
                <option value="Customer Onboarding & KYC">Customer Onboarding & KYC</option>
                <option value="Regulatory Reporting">Regulatory Reporting</option>
                <option value="Insurance Platform">Insurance Platform</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Project Size</label>
              <select
                value={projectSize}
                onChange={(e) => setProjectSize(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Large">Large</option>
                <option value="Medium">Medium</option>
                <option value="Small">Small</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Project Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Business Objective</label>
            <input
              type="text"
              value={businessObjective}
              onChange={(e) => setBusinessObjective(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Budget Allocation</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">Delivery Timeline</label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Factor Calibration Section */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold block">
              Architectural & Regulatory Characteristics
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Regulatory Criticality</span>
                  <span className="font-mono text-blue-400">{Math.round(regCrit * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={regCrit}
                  onChange={(e) => setRegCrit(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Security Criticality</span>
                  <span className="font-mono text-rose-400">{Math.round(secCrit * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={secCrit}
                  onChange={(e) => setSecCrit(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cdEnabled}
                  onChange={(e) => setCdEnabled(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
                <span className="text-xs text-slate-300">Continuous Deployment (DevSecOps)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formalVerif}
                  onChange={(e) => setFormalVerif(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-0"
                />
                <span className="text-xs text-slate-300">Formal Verification Required</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-glow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Project...' : 'Initialize Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
