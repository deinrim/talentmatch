import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  History, 
  MessageSquare,
  AlertCircle,
  ChevronRight,
  Send,
  Download,
  Share2,
  ExternalLink,
  BookOpen,
  Edit3,
  Trash2
} from 'lucide-react';
import { Candidate, JobRole } from '../types';
import { CandidateHistoryTimeline } from '../components/CandidateHistoryTimeline';

interface CandidateDetailViewProps {
  candidate: Candidate;
  allJobRoles: JobRole[];
  onBack: () => void;
  onOpenDecisionModal: (candidate: Candidate) => void;
  onAddNote: (candidateId: string, text: string) => void;
  onRescanCandidate?: (candidate: Candidate) => void;
  onEditCandidate?: (candidate: Candidate) => void;
  onDeleteCandidate?: (candidate: Candidate) => void;
}

export const CandidateDetailView: React.FC<CandidateDetailViewProps> = ({
  candidate,
  allJobRoles,
  onBack,
  onOpenDecisionModal,
  onAddNote,
  onRescanCandidate,
  onEditCandidate,
  onDeleteCandidate,
}) => {
  const [activeTab, setActiveTab] = useState<'MATCH' | 'PROFILE' | 'ROLES' | 'TIMELINE' | 'NOTES'>('MATCH');
  const [activeResumePage, setActiveResumePage] = useState<number>(0);
  const [resumeViewMode, setResumeViewMode] = useState<'IMAGE' | 'TEXT'>('TEXT');
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const topMatch = candidate.top_match;
  const isGreen = topMatch?.recommendation === 'GREEN';
  const isYellow = topMatch?.recommendation === 'YELLOW';
  const isRed = topMatch?.recommendation === 'RED';

  const currentResume = candidate.resumes?.[0];
  const pages = currentResume?.pages || [];

  const handleSendNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setIsSubmittingNote(true);
    await onAddNote(candidate.id, newNoteText);
    setNewNoteText('');
    setIsSubmittingNote(false);
  };

  return (
    <div className="space-y-4 pb-28 md:pb-8 animate-in fade-in duration-150">
      
      {/* Top Navigation & Status Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back to List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-xl font-bold text-slate-900">
                {candidate.first_name} {candidate.last_name}
              </h1>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                {candidate.candidate_code}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                candidate.status === 'SHORTLISTED'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : candidate.status === 'ON_HOLD'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : candidate.status === 'REJECTED_BY_RECRUITER'
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : 'bg-indigo-100 text-indigo-800 border-indigo-200'
              }`}>
                {candidate.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Scanned: {new Date(candidate.created_at).toLocaleDateString()} • Source: {candidate.source}
            </p>
          </div>
        </div>

        {/* Action button trigger */}
        <div className="flex flex-wrap items-center gap-2">
          {onEditCandidate && (
            <button
              id="candidate-detail-edit-btn"
              onClick={() => onEditCandidate(candidate)}
              className="flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 active:scale-95 transition-all cursor-pointer"
              title="Edit candidate profile & experience"
            >
              <Edit3 className="w-4 h-4 text-slate-700" />
              <span>Edit Profile</span>
            </button>
          )}

          {onRescanCandidate && (
            <button
              id="candidate-detail-rescan-btn"
              onClick={() => onRescanCandidate(candidate)}
              className="flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 active:scale-95 transition-all cursor-pointer"
              title="Add more pages or re-scan resume"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Add Pages / Re-scan</span>
            </button>
          )}

          <button
            onClick={() => onOpenDecisionModal(candidate)}
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-indigo-200 active:scale-95 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Recruiter Decision</span>
          </button>

          {onDeleteCandidate && (
            <button
              id="candidate-detail-delete-btn"
              onClick={() => onDeleteCandidate(candidate)}
              className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-all cursor-pointer"
              title="Delete candidate record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Main Split Layout: Left Pane (Resume Viewer) & Right Pane (Structured AI Profile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT PANE (5 Cols): Scanned Resume Document Viewer */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Original Resume Document
              </h3>
            </div>
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setResumeViewMode('TEXT')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  resumeViewMode === 'TEXT' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                }`}
              >
                Text Extract
              </button>
              {pages.length > 0 && (
                <button
                  onClick={() => setResumeViewMode('IMAGE')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    resumeViewMode === 'IMAGE' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Page Scans ({pages.length})
                </button>
              )}
            </div>
          </div>

          {/* Quick Rescan & Add Page Banner */}
          {onRescanCandidate && (
            <div className="flex items-center justify-between p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
              <div className="text-[11px] text-indigo-900 font-medium">
                Document has {pages.length > 0 ? `${pages.length} pages` : '1 text version'}. Missing Page 2 or 3?
              </div>
              <button
                onClick={() => onRescanCandidate(candidate)}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg shrink-0 cursor-pointer shadow-2xs"
              >
                + Add Pages / Rescan
              </button>
            </div>
          )}

          {/* Document Content Box */}
          {resumeViewMode === 'IMAGE' && pages.length > 0 ? (
            <div className="space-y-3">
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={pages[activeResumePage]}
                  alt={`Page ${activeResumePage + 1}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Page {activeResumePage + 1} of {pages.length}
                </div>
              </div>

              {/* Page Carousel Thumbnails */}
              {pages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {pages.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveResumePage(idx)}
                      className={`relative w-14 h-18 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                        activeResumePage === idx ? 'border-indigo-600 shadow-sm' : 'border-slate-200 opacity-60'
                      }`}
                    >
                      <img src={p} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-slate-900 text-white px-1 rounded">
                        P.{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 max-h-[600px] overflow-y-auto font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {currentResume?.raw_text || candidate.professional_summary || 'No raw document text available.'}
            </div>
          )}

          <div className="text-[11px] text-slate-400 text-center">
            🔒 Encrypted & stored outside web root with audit tracking
          </div>
        </div>

        {/* RIGHT PANE (7 Cols): Tabs for Match Rubric, Structured Profile, Timeline, Notes */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Tabs Navigation Header */}
          <div className="flex space-x-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('MATCH')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'MATCH' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Match Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab('PROFILE')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'PROFILE' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Structured Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('ROLES')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'ROLES' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Job Matches</span>
            </button>
            <button
              onClick={() => setActiveTab('TIMELINE')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'TIMELINE' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Timeline ({candidate.timeline?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('NOTES')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'NOTES' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Notes ({candidate.recruiter_notes?.length || 0})</span>
            </button>
          </div>

          {/* TAB 1: MATCH ANALYSIS & TRANSPARENT SCORING RUBRIC */}
          {activeTab === 'MATCH' && topMatch && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-5 shadow-xs">
              
              {/* Overall Score Header Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isGreen 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : isYellow 
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-red-50 border-red-200 text-red-950'
              }`}>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-75">Target Role Match</span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-white/70 rounded-full">
                      {topMatch.department}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mt-0.5">{topMatch.job_role_name}</h3>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">{topMatch.summary_reason}</p>
                </div>
                <div className="text-center sm:text-right shrink-0 bg-white/80 p-3 rounded-xl border border-black/5">
                  <div className="text-3xl font-extrabold font-mono leading-none">
                    {topMatch.overall_score}%
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block mt-1">
                    {isGreen ? '🟢 Strong Fit' : isYellow ? '🟡 Review Required' : '🔴 Requirements Issue'}
                  </span>
                </div>
              </div>

              {/* Point-by-Point Transparent Scoring Rubric Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Transparent Scoring Rubric (100 Points Total)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Education */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-700">Education & Degrees</span>
                      <span className="text-indigo-600 font-mono">
                        {topMatch.score_breakdown.education} / {topMatch.score_breakdown.max_education} pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full" 
                        style={{ width: `${(topMatch.score_breakdown.education / topMatch.score_breakdown.max_education) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-700">Experience Tenure</span>
                      <span className="text-indigo-600 font-mono">
                        {topMatch.score_breakdown.experience} / {topMatch.score_breakdown.max_experience} pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full" 
                        style={{ width: `${(topMatch.score_breakdown.experience / topMatch.score_breakdown.max_experience) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Mandatory Skills */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-700">Mandatory Core Skills</span>
                      <span className="text-indigo-600 font-mono">
                        {topMatch.score_breakdown.mandatory_skills} / {topMatch.score_breakdown.max_mandatory_skills} pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full" 
                        style={{ width: `${(topMatch.score_breakdown.mandatory_skills / topMatch.score_breakdown.max_mandatory_skills) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Preferred Skills */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-700">Preferred / Desired Skills</span>
                      <span className="text-indigo-600 font-mono">
                        {topMatch.score_breakdown.preferred_skills} / {topMatch.score_breakdown.max_preferred_skills} pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full" 
                        style={{ width: `${(topMatch.score_breakdown.preferred_skills / topMatch.score_breakdown.max_preferred_skills) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Domain Experience */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-700">Insurance / BFSI Domain</span>
                      <span className="text-indigo-600 font-mono">
                        {topMatch.score_breakdown.industry_experience} / {topMatch.score_breakdown.max_industry_experience} pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full" 
                        style={{ width: `${(topMatch.score_breakdown.industry_experience / topMatch.score_breakdown.max_industry_experience) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-700">Location Compatibility</span>
                      <span className="text-indigo-600 font-mono">
                        {topMatch.score_breakdown.location_match} / {topMatch.score_breakdown.max_location_match} pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full" 
                        style={{ width: `${(topMatch.score_breakdown.location_match / topMatch.score_breakdown.max_location_match) * 100}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Verified Evidence & Citations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Requirement Evidence & Citations
                </h4>
                <div className="space-y-2">
                  {topMatch.evidence.map((ev) => (
                    <div 
                      key={ev.id}
                      className={`p-3 rounded-2xl border flex items-start space-x-3 text-xs ${
                        ev.result === 'MATCH'
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : ev.result === 'PARTIAL'
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-red-50/50 border-red-200'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {ev.result === 'MATCH' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : ev.result === 'PARTIAL' ? (
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{ev.requirement_name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                            {ev.requirement_type}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{ev.candidate_evidence}</p>
                        <p className="text-[11px] font-medium text-slate-500 mt-1 italic">{ev.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: STRUCTURED PROFILE */}
          {activeTab === 'PROFILE' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-6 shadow-xs">
              
              {/* Contact Information Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="truncate">{candidate.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{candidate.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{candidate.location}</span>
                </div>
              </div>

              {/* Professional Summary */}
              {candidate.professional_summary && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Professional Summary
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                    {candidate.professional_summary}
                  </p>
                </div>
              )}

              {/* Work Experience */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Work Experience ({(candidate.total_experience_months / 12).toFixed(1)} Yrs Total)
                </h4>
                <div className="space-y-3">
                  {candidate.experience.map((exp) => (
                    <div key={exp.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{exp.job_title}</h5>
                          <p className="text-xs font-semibold text-indigo-700">{exp.company}</p>
                        </div>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-600">
                          {exp.start_date} - {exp.end_date}
                        </span>
                      </div>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc list-inside">
                          {exp.responsibilities.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Education & Qualifications
                </h4>
                <div className="space-y-2">
                  {candidate.education.map((edu) => (
                    <div key={edu.id} className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{edu.qualification}</p>
                        <p className="text-slate-500">{edu.institution} {edu.year ? `(${edu.year})` : ''}</p>
                      </div>
                      {edu.grade && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md">
                          {edu.grade}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Certifications */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Skills & Certifications
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((sk) => (
                    <span key={sk.id} className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-semibold">
                      {sk.skill_name}
                    </span>
                  ))}
                  {candidate.certifications?.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-semibold">
                      🏆 {c}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ALL ROLE MATCHES */}
          {activeTab === 'ROLES' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Cross-Matching Across Active Company Openings
              </h4>
              <div className="space-y-2.5">
                {candidate.matches?.map((match) => (
                  <div 
                    key={match.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{match.job_role_name}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-md text-slate-600">{match.department}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{match.summary_reason}</p>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                        match.recommendation === 'GREEN'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : match.recommendation === 'YELLOW'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        {match.overall_score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TIMELINE */}
          {activeTab === 'TIMELINE' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                Audit Trail & Processing History
              </h4>
              <CandidateHistoryTimeline timeline={candidate.timeline} />
            </div>
          )}

          {/* TAB 5: RECRUITER NOTES */}
          {activeTab === 'NOTES' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recruiter Collaboration Notes
              </h4>

              {/* Existing notes */}
              <div className="space-y-2.5">
                {(candidate.recruiter_notes || []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-3">No recruiter notes added yet.</p>
                ) : (
                  candidate.recruiter_notes?.map((n) => (
                    <div key={n.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">{n.author}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{n.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add note form */}
              <form onSubmit={handleSendNote} className="space-y-2 pt-2 border-t border-slate-100">
                <textarea
                  rows={2}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Type an internal recruiter note or interview scheduling update..."
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <button
                  type="submit"
                  disabled={isSubmittingNote || !newNoteText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer ml-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Sticky Bottom Human Decision Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-xl flex items-center justify-between max-w-7xl mx-auto px-4">
        <div className="hidden sm:block text-xs font-semibold text-slate-600">
          Candidate: <strong className="text-slate-900">{candidate.first_name} {candidate.last_name}</strong> ({candidate.candidate_code})
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => onOpenDecisionModal(candidate)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md shadow-indigo-200 active:scale-95 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm Recruiter Decision (Shortlist / Hold / Reject)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
