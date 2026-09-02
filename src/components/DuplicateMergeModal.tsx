import React, { useState } from 'react';
import { 
  GitMerge, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  FileText, 
  Layers, 
  UserCheck 
} from 'lucide-react';
import { Candidate } from '../types';

interface DuplicateMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateA: Candidate;
  candidateB: Candidate;
  onMergeSuccess: (primary: Candidate) => void;
  onKeepBoth?: () => void;
}

export const DuplicateMergeModal: React.FC<DuplicateMergeModalProps> = ({
  isOpen,
  onClose,
  candidateA,
  candidateB,
  onMergeSuccess,
  onKeepBoth,
}) => {
  const [primaryId, setPrimaryId] = useState<string>(candidateA.id);
  const [selectedFields, setSelectedFields] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    location: string;
    current_job_title: string;
    current_company: string;
  }>({
    first_name: candidateA.first_name || candidateB.first_name,
    last_name: candidateA.last_name || candidateB.last_name,
    email: candidateA.email || candidateB.email,
    phone: candidateA.phone || candidateB.phone,
    location: candidateA.location || candidateB.location,
    current_job_title: candidateA.current_job_title || candidateB.current_job_title,
    current_company: candidateA.current_company || candidateB.current_company,
  });

  const [isMerging, setIsMerging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const duplicateCandidate = primaryId === candidateA.id ? candidateB : candidateA;
  const primaryCandidate = primaryId === candidateA.id ? candidateA : candidateB;

  const handleMerge = async () => {
    setIsMerging(true);
    setErrorMsg(null);

    let mergedCandidate: Candidate = {
      ...primaryCandidate,
      ...selectedFields,
      resumes: [
        ...(primaryCandidate.resumes || []),
        ...(duplicateCandidate.resumes || []).map(r => ({
          ...r,
          id: `res-merged-${Date.now()}`,
          is_current: false
        }))
      ],
      timeline: [
        ...(primaryCandidate.timeline || []),
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Duplicate Candidate Record Merged',
          actor: 'Mobile Recruiter',
          actor_role: 'RECRUITER',
          details: `Consolidated duplicate profile (${duplicateCandidate.candidate_code}) into master record (${primaryCandidate.candidate_code}).`,
          badge_color: 'purple'
        }
      ],
      updated_at: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/candidates/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryId: primaryCandidate.id,
          duplicateId: duplicateCandidate.id,
          mergedFields: selectedFields,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.primaryCandidate) {
          mergedCandidate = data.primaryCandidate;
        }
      }
    } catch (err: any) {
      console.warn('Backend merge request unavailable, proceeding with local consolidation:', err);
    }

    onMergeSuccess(mergedCandidate);
    onClose();
    setIsMerging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <GitMerge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                Duplicate Candidate Merge Assistant
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Resolve matching profile identities & consolidate resume version histories
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
          
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-start space-x-2 text-xs text-purple-900">
            <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Duplicate Match Detected</p>
              <p className="mt-0.5 text-purple-800">
                Matching Email/Phone found between <strong>{candidateA.candidate_code}</strong> and <strong>{candidateB.candidate_code}</strong>. Choose which master record to keep and pick values for the unified profile.
              </p>
            </div>
          </div>

          {/* Primary Record Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Primary Master Record:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setPrimaryId(candidateA.id)}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                  primaryId === candidateA.id 
                    ? 'border-purple-600 bg-purple-50/50 shadow-xs' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">{candidateA.candidate_code}</span>
                  {primaryId === candidateA.id && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                </div>
                <p className="text-xs font-bold text-slate-800">{candidateA.first_name} {candidateA.last_name}</p>
                <p className="text-[11px] text-slate-500">{candidateA.email}</p>
                <p className="text-[11px] text-slate-500">{candidateA.phone}</p>
              </div>

              <div
                onClick={() => setPrimaryId(candidateB.id)}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                  primaryId === candidateB.id 
                    ? 'border-purple-600 bg-purple-50/50 shadow-xs' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">{candidateB.candidate_code}</span>
                  {primaryId === candidateB.id && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                </div>
                <p className="text-xs font-bold text-slate-800">{candidateB.first_name} {candidateB.last_name}</p>
                <p className="text-[11px] text-slate-500">{candidateB.email}</p>
                <p className="text-[11px] text-slate-500">{candidateB.phone}</p>
              </div>
            </div>
          </div>

          {/* Fields Selection Matrix */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Choose Profile Field Values:
            </label>
            <div className="space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50/50">
              
              {/* Name */}
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="font-bold text-slate-500 w-24">Full Name</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFields({ ...selectedFields, first_name: candidateA.first_name, last_name: candidateA.last_name })}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                      selectedFields.first_name === candidateA.first_name ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-white'
                    }`}
                  >
                    {candidateA.first_name} {candidateA.last_name}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFields({ ...selectedFields, first_name: candidateB.first_name, last_name: candidateB.last_name })}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                      selectedFields.first_name === candidateB.first_name ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-white'
                    }`}
                  >
                    {candidateB.first_name} {candidateB.last_name}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="font-bold text-slate-500 w-24">Email</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFields({ ...selectedFields, email: candidateA.email })}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                      selectedFields.email === candidateA.email ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-white'
                    }`}
                  >
                    {candidateA.email}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFields({ ...selectedFields, email: candidateB.email })}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                      selectedFields.email === candidateB.email ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-white'
                    }`}
                  >
                    {candidateB.email}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="font-bold text-slate-500 w-24">Phone</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFields({ ...selectedFields, phone: candidateA.phone })}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                      selectedFields.phone === candidateA.phone ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-white'
                    }`}
                  >
                    {candidateA.phone}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFields({ ...selectedFields, phone: candidateB.phone })}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                      selectedFields.phone === candidateB.phone ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-white'
                    }`}
                  >
                    {candidateB.phone}
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center justify-between text-xs py-1">
                <span className="font-bold text-slate-500 w-24">Location</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFields({ ...selectedFields, location: candidateA.location })}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                      selectedFields.location === candidateA.location ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-white'
                    }`}
                  >
                    {candidateA.location}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFields({ ...selectedFields, location: candidateB.location })}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                      selectedFields.location === candidateB.location ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-white'
                    }`}
                  >
                    {candidateB.location}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {onKeepBoth && (
              <button
                type="button"
                onClick={onKeepBoth}
                className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
              >
                Keep Both Profiles
              </button>
            )}
          </div>
          <button
            disabled={isMerging}
            onClick={handleMerge}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <GitMerge className="w-4 h-4" />
            <span>{isMerging ? 'Merging Records...' : 'Merge & Consolidate'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
