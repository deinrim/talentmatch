import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  PauseCircle, 
  XCircle, 
  ChevronRight, 
  Layers, 
  FileText, 
  ArrowUpDown,
  ShieldCheck,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';
import { Candidate, RecommendationColor } from '../types';

interface ReviewQueueViewProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenDecisionModal: (candidate: Candidate) => void;
  onOpenScanner: () => void;
  onEditCandidate?: (candidate: Candidate) => void;
  onDeleteCandidate?: (candidate: Candidate) => void;
}

export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({
  candidates,
  onSelectCandidate,
  onOpenDecisionModal,
  onOpenScanner,
  onEditCandidate,
  onDeleteCandidate,
}) => {
  const [filterTab, setFilterTab] = useState<'ALL' | RecommendationColor>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  // Filter candidate pool
  const queueCandidates = candidates.filter(c => {
    // Only pending or review items unless search is active
    const isPending = c.status === 'READY_FOR_REVIEW' || c.status === 'HUMAN_REVIEW';
    if (!isPending && !searchQuery) return false;

    if (filterTab !== 'ALL' && c.top_match?.recommendation !== filterTab) {
      return false;
    }

    if (selectedRole !== 'ALL' && c.top_match?.job_role_id !== selectedRole) {
      return false;
    }

    if (searchQuery) {
      const q = (searchQuery || '').toLowerCase();
      const match = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase().includes(q) ||
        (c.candidate_code || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.current_job_title || '').toLowerCase().includes(q) ||
        (c.current_company || '').toLowerCase().includes(q) ||
        (c.top_match?.job_role_name || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const greenCount = candidates.filter(c => c.top_match?.recommendation === 'GREEN').length;
  const yellowCount = candidates.filter(c => c.top_match?.recommendation === 'YELLOW').length;
  const redCount = candidates.filter(c => c.top_match?.recommendation === 'RED').length;

  return (
    <div className="space-y-5 pb-20 md:pb-8 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recruiter Review Queue
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
              {queueCandidates.length} Pending Decision
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate AI match evidence and confirm Shortlist, Hold, or Not Suitable decisions.
          </p>
        </div>

        <button
          onClick={onOpenScanner}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          + Scan Next Resume
        </button>
      </div>

      {/* Traffic Light Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterTab('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Profiles ({candidates.length})
        </button>
        <button
          onClick={() => setFilterTab('GREEN')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
            filterTab === 'GREEN'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          <span>🟢 Strong Matches</span>
          <span className="font-mono px-1.5 py-0.2 rounded-full bg-emerald-700/20 text-[10px]">{greenCount}</span>
        </button>
        <button
          onClick={() => setFilterTab('YELLOW')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
            filterTab === 'YELLOW'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
          }`}
        >
          <span>🟡 Review Required</span>
          <span className="font-mono px-1.5 py-0.2 rounded-full bg-amber-700/20 text-[10px]">{yellowCount}</span>
        </button>
        <button
          onClick={() => setFilterTab('RED')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
            filterTab === 'RED'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-red-50 border border-red-200 text-red-800 hover:bg-red-100'
          }`}
        >
          <span>🔴 Requirements Issue</span>
          <span className="font-mono px-1.5 py-0.2 rounded-full bg-red-700/20 text-[10px]">{redCount}</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by candidate name, code, skills, current role, or company..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
        />
      </div>

      {/* Candidates Cards List */}
      <div className="space-y-3">
        {queueCandidates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
            <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">Review Queue is Clean!</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              All candidate resumes matching this filter have been processed and reviewed by recruiters.
            </p>
          </div>
        ) : (
          queueCandidates.map((candidate) => {
            const topMatch = candidate.top_match;
            const isGreen = topMatch?.recommendation === 'GREEN';
            const isYellow = topMatch?.recommendation === 'YELLOW';
            const isRed = topMatch?.recommendation === 'RED';

            return (
              <div
                key={candidate.id}
                onClick={() => onSelectCandidate(candidate)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all p-4 cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left: Avatar + Candidate Info */}
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {candidate.first_name[0]}{candidate.last_name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {candidate.first_name} {candidate.last_name}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 bg-slate-100 rounded-md">
                          {candidate.candidate_code}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {candidate.source}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1">
                        <strong>{candidate.current_job_title}</strong> at {candidate.current_company} • {(candidate.total_experience_months / 12).toFixed(1)} yrs exp • {candidate.location}
                      </p>

                      {/* Top Skills Badges */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {candidate.skills.slice(0, 4).map((sk) => (
                          <span key={sk.id} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                            {sk.skill_name}
                          </span>
                        ))}
                        {candidate.skills.length > 4 && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-md">
                            +{candidate.skills.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* AI Match Reason Snippet */}
                      {topMatch && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                          <span className="font-bold text-slate-900">AI Assessment: </span>
                          {topMatch.summary_reason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Score & Quick Decision Actions */}
                  <div className="flex flex-col sm:items-end justify-between shrink-0 space-y-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {topMatch && (
                      <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 ${
                        isGreen
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isYellow
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        <span>{isGreen ? '🟢 Strong Fit' : isYellow ? '🟡 Review Required' : '🔴 Requirements Issue'}</span>
                        <span className="font-mono">({topMatch.overall_score}%)</span>
                      </div>
                    )}

                    {/* Quick 1-Click Human Decision & Management Bar */}
                    <div className="flex flex-wrap items-center gap-1.5 justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(candidate);
                        }}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                        title="View Full Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {onEditCandidate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCandidate(candidate);
                          }}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                          title="Edit candidate details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDecisionModal(candidate);
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Decision</span>
                      </button>

                      {onDeleteCandidate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCandidate(candidate);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                          title="Delete candidate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
