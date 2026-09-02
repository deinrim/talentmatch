import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Briefcase, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sliders, 
  ArrowRight,
  RefreshCw,
  Layers
} from 'lucide-react';
import { JobRole, JobRequirement } from '../types';

interface AiJobDescriptionAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (job: JobRole) => void;
}

export const AiJobDescriptionAssistantModal: React.FC<AiJobDescriptionAssistantModalProps> = ({
  isOpen,
  onClose,
  onJobCreated,
}) => {
  const [prompt, setPrompt] = useState('Insurance Sales Manager, 4+ years experience, Bancassurance & Agency channel, Kolkata');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Generated Job State
  const [jobData, setJobData] = useState<Partial<JobRole> | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/jobs/generate-ai-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate Job Description.');
      }

      const data = await res.json();
      setJobData(data.job);
    } catch (err: any) {
      setErrorMsg(err.message || 'AI Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveJob = async () => {
    if (!jobData || !jobData.role_name) return;

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...jobData,
          is_active: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to save job role.');
      const data = await res.json();
      onJobCreated(data.job);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save job.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                AI Job Description Architect
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Auto-generate role requirements, weights, and scoring criteria with Gemini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Input Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Describe the Role / Key Mandates:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="ai-jd-prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Agency Channel Leader, 5+ yrs life insurance, IRDA licensed, Bangalore"
                className="flex-1 text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button
                type="button"
                id="ai-jd-generate-btn"
                disabled={isGenerating || !prompt.trim()}
                onClick={handleGenerate}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Architecting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate JD</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Generated Result Preview */}
          {jobData && (
            <div className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-4 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200">
                    Generated Job Role Schema
                  </span>
                  <input
                    type="text"
                    value={jobData.role_name || ''}
                    onChange={(e) => setJobData({ ...jobData, role_name: e.target.value })}
                    className="block text-base font-bold text-slate-900 mt-1 bg-transparent border-b border-indigo-200 focus:outline-hidden focus:border-indigo-600 w-full"
                  />
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500">Department</span>
                  <input
                    type="text"
                    value={jobData.department || ''}
                    onChange={(e) => setJobData({ ...jobData, department: e.target.value })}
                    className="block text-xs font-bold text-indigo-700 bg-transparent text-right border-b border-indigo-200 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Role Summary</label>
                <textarea
                  rows={2}
                  value={jobData.description || ''}
                  onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block">Min Exp (Yrs)</span>
                  <input
                    type="number"
                    value={jobData.min_experience_years || 0}
                    onChange={(e) => setJobData({ ...jobData, min_experience_years: Number(e.target.value) })}
                    className="text-xs font-bold text-slate-800 w-full mt-0.5"
                  />
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block">Salary Range</span>
                  <input
                    type="text"
                    value={jobData.salary_range || ''}
                    onChange={(e) => setJobData({ ...jobData, salary_range: e.target.value })}
                    className="text-xs font-bold text-slate-800 w-full mt-0.5"
                  />
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block">Target Location</span>
                  <input
                    type="text"
                    value={jobData.location || ''}
                    onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                    className="text-xs font-bold text-slate-800 w-full mt-0.5"
                  />
                </div>
              </div>

              {/* Weighted Requirements List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Evaluation Requirements & Weighting
                  </span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {(jobData.requirements || []).map((req, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          req.mandatory 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {req.mandatory ? 'MANDATORY' : 'PREFERRED'}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">{req.requirement_name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 font-bold shrink-0 ml-2">
                        {req.weight}% wt
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!jobData}
            onClick={handleSaveJob}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Activate Job Role</span>
          </button>
        </div>

      </div>
    </div>
  );
};
