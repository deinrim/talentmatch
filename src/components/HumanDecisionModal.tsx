import React, { useState } from 'react';
import { 
  CheckCircle2, 
  PauseCircle, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Candidate, REJECTION_REASONS } from '../types';

interface HumanDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  onDecisionSubmitted: (candidate: Candidate) => void;
}

export const HumanDecisionModal: React.FC<HumanDecisionModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onDecisionSubmitted,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<'SHORTLISTED' | 'ON_HOLD' | 'REJECTED_BY_RECRUITER'>('SHORTLISTED');
  const [rejectionReason, setRejectionReason] = useState<string>(REJECTION_REASONS[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitDecision = async () => {
    if (selectedDecision === 'REJECTED_BY_RECRUITER' && !rejectionReason) {
      setErrorMsg('Please select a mandatory rejection reason from the list.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/candidates/${candidate.id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: selectedDecision,
          rejection_reason: selectedDecision === 'REJECTED_BY_RECRUITER' ? rejectionReason : undefined,
          rejection_notes: selectedDecision === 'REJECTED_BY_RECRUITER' ? notes : undefined,
          recruiter_notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit decision.');
      }

      const result = await res.json();

      // Trigger celebration confetti on shortlist!
      if (selectedDecision === 'SHORTLISTED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      onDecisionSubmitted(result.candidate);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save decision.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                Human Recruiter Decision
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {candidate.first_name} {candidate.last_name} ({candidate.candidate_code})
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

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* AI Recommendation Summary Pill */}
          {candidate.top_match && (
            <div className={`p-3 rounded-2xl border flex items-start space-x-2.5 ${
              candidate.top_match.recommendation === 'GREEN'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : candidate.top_match.recommendation === 'YELLOW'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold">AI Assistant Score: {candidate.top_match.overall_score}%</span>
                <span className="ml-1 text-[11px] opacity-80">({candidate.top_match.recommendation} Match for {candidate.top_match.job_role_name})</span>
                <p className="text-[11px] mt-0.5 opacity-90">{candidate.top_match.summary_reason}</p>
              </div>
            </div>
          )}

          {/* Core Decision Selector: 3 Action Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Final Decision:
            </label>
            <div className="grid grid-cols-3 gap-2">
              
              {/* Option 1: SHORTLIST */}
              <button
                type="button"
                id="decision-btn-shortlist"
                onClick={() => setSelectedDecision('SHORTLISTED')}
                className={`py-3 px-2 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  selectedDecision === 'SHORTLISTED'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 ${selectedDecision === 'SHORTLISTED' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>SHORTLIST</span>
              </button>

              {/* Option 2: HOLD / REVIEW */}
              <button
                type="button"
                id="decision-btn-hold"
                onClick={() => setSelectedDecision('ON_HOLD')}
                className={`py-3 px-2 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  selectedDecision === 'ON_HOLD'
                    ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <PauseCircle className={`w-5 h-5 ${selectedDecision === 'ON_HOLD' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>HOLD / REVIEW</span>
              </button>

              {/* Option 3: NOT SUITABLE */}
              <button
                type="button"
                id="decision-btn-reject"
                onClick={() => setSelectedDecision('REJECTED_BY_RECRUITER')}
                className={`py-3 px-2 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  selectedDecision === 'REJECTED_BY_RECRUITER'
                    ? 'bg-red-50 border-red-600 text-red-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <XCircle className={`w-5 h-5 ${selectedDecision === 'REJECTED_BY_RECRUITER' ? 'text-red-600' : 'text-slate-400'}`} />
                <span>NOT SUITABLE</span>
              </button>

            </div>
          </div>

          {/* Mandatory Rejection Reason Dropdown (if NOT SUITABLE is selected) */}
          {selectedDecision === 'REJECTED_BY_RECRUITER' && (
            <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-2xl space-y-2 animate-in fade-in duration-100">
              <label className="block text-xs font-bold text-red-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Mandatory Rejection Reason *
              </label>
              <select
                id="rejection-reason-select"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-xl border border-red-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              >
                {REJECTION_REASONS.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}

          {/* Recruiter Notes / Comments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Recruiter Notes & Feedback (Optional):
            </label>
            <textarea
              id="decision-notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                selectedDecision === 'SHORTLISTED'
                  ? 'e.g., Impressive 5+ yrs Bancassurance track record. Forwarded for Technical Round 1 with VP Sales.'
                  : selectedDecision === 'ON_HOLD'
                  ? 'e.g., Awaiting updated IRDA license copy or compensation slip.'
                  : 'e.g., Lacks 3 yrs minimum BFSI domain sales criteria.'
              }
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-decision-btn"
            disabled={isSubmitting}
            onClick={handleSubmitDecision}
            className={`flex items-center space-x-2 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ${
              selectedDecision === 'SHORTLISTED'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                : selectedDecision === 'ON_HOLD'
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
                : 'bg-red-600 hover:bg-red-700 shadow-red-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isSubmitting ? 'Recording...' : `Confirm [${selectedDecision.replace('_', ' ')}]`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
