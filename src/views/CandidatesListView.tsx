import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  PauseCircle, 
  XCircle,
  FileSpreadsheet,
  Eye,
  Edit3,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { Candidate, RecommendationColor } from '../types';

interface CandidatesListViewProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenScanner: () => void;
  onOpenDecisionModal: (candidate: Candidate) => void;
  onEditCandidate?: (candidate: Candidate) => void;
  onDeleteCandidate?: (candidate: Candidate) => void;
}

export const CandidatesListView: React.FC<CandidatesListViewProps> = ({
  candidates,
  onSelectCandidate,
  onOpenScanner,
  onOpenDecisionModal,
  onEditCandidate,
  onDeleteCandidate,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [matchFilter, setMatchFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'exp'>('date');

  const filtered = candidates.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (matchFilter !== 'ALL' && c.top_match?.recommendation !== matchFilter) return false;
    if (search) {
      const q = (search || '').toLowerCase();
      const match = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase().includes(q) ||
        (c.candidate_code || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.current_job_title || '').toLowerCase().includes(q) ||
        (c.current_company || '').toLowerCase().includes(q) ||
        (c.top_match?.job_role_name || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'score') {
      return (b.top_match?.overall_score || 0) - (a.top_match?.overall_score || 0);
    }
    if (sortBy === 'exp') {
      return b.total_experience_months - a.total_experience_months;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const exportCSV = () => {
    const headers = ['Candidate Code', 'Name', 'Email', 'Phone', 'Experience (Yrs)', 'Current Role', 'Current Company', 'Top Matched Role', 'Score', 'AI Recommendation', 'Status'];
    const rows = filtered.map(c => [
      c.candidate_code,
      `"${c.first_name} ${c.last_name}"`,
      c.email,
      c.phone,
      (c.total_experience_months / 12).toFixed(1),
      `"${c.current_job_title}"`,
      `"${c.current_company}"`,
      `"${c.top_match?.job_role_name || ''}"`,
      c.top_match?.overall_score || 0,
      c.top_match?.recommendation || '',
      c.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Candidate_Talent_Pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Candidate Talent Directory
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              {filtered.length} of {candidates.length} Profiles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Searchable candidate database with OCR extracted records, edit/view/delete controls, & match histories.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenScanner}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
          >
            + Scan Resume
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, skills, title, company, code..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="READY_FOR_REVIEW">Ready for Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="REJECTED_BY_RECRUITER">Not Suitable</option>
          </select>

          {/* Match Score Filter */}
          <select
            value={matchFilter}
            onChange={(e) => setMatchFilter(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Match Tiers</option>
            <option value="GREEN">🟢 Strong Match (75%+)</option>
            <option value="YELLOW">🟡 Review Required (50-74%)</option>
            <option value="RED">🔴 Requirements Issue (&lt;50%)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="date">Sort: Newest First</option>
            <option value="score">Sort: Match Score (High to Low)</option>
            <option value="exp">Sort: Experience (Years)</option>
          </select>

        </div>
      </div>

      {/* Directory Table / Cards */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No candidates match the filter criteria</h3>
            <p className="text-xs text-slate-400 mt-0.5">Try clearing filters or search keyword.</p>
          </div>
        ) : (
          filtered.map((candidate) => {
            const topMatch = candidate.top_match;
            const isGreen = topMatch?.recommendation === 'GREEN';
            const isYellow = topMatch?.recommendation === 'YELLOW';
            const isRed = topMatch?.recommendation === 'RED';

            return (
              <div
                key={candidate.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 group"
              >
                {/* Candidate Info */}
                <div 
                  onClick={() => onSelectCandidate(candidate)}
                  className="flex items-start space-x-3 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {candidate.first_name[0]}{candidate.last_name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {candidate.first_name} {candidate.last_name}
                      </h4>
                      <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.2 bg-slate-100 rounded">
                        {candidate.candidate_code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                        candidate.status === 'SHORTLISTED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : candidate.status === 'ON_HOLD'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : candidate.status === 'REJECTED_BY_RECRUITER'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {candidate.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-0.5 truncate">
                      {candidate.current_job_title} • {candidate.current_company} • {(candidate.total_experience_months / 12).toFixed(1)} yrs exp • {candidate.location}
                    </p>

                    {topMatch && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[11px] text-slate-500">
                          Matched Role: <strong>{topMatch.job_role_name}</strong>
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                          isGreen
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isYellow
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                          {topMatch.overall_score}% {isGreen ? '🟢 Strong' : isYellow ? '🟡 Review' : '🔴 Issue'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Action Buttons: View, Edit, Delete, Decision */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end shrink-0">
                  
                  {/* View Details */}
                  <button
                    onClick={() => onSelectCandidate(candidate)}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                    title="View candidate full profile & match rubric"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  {/* Edit Candidate */}
                  {onEditCandidate && (
                    <button
                      onClick={() => onEditCandidate(candidate)}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                      title="Edit candidate profile & experience"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}

                  {/* Make Decision (if pending or review) */}
                  {(candidate.status === 'READY_FOR_REVIEW' || candidate.status === 'HUMAN_REVIEW') && (
                    <button
                      onClick={() => onOpenDecisionModal(candidate)}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                      title="Make recruiter decision"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Decision</span>
                    </button>
                  )}

                  {/* Delete Candidate */}
                  {onDeleteCandidate && (
                    <button
                      onClick={() => onDeleteCandidate(candidate)}
                      className="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      title="Delete candidate record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
