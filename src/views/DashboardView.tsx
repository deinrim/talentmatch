import React from 'react';
import { 
  Scan, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ClipboardList, 
  TrendingUp, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Candidate, JobRole, RecruiterTask, User } from '../types';

interface DashboardViewProps {
  candidates: Candidate[];
  jobRoles: JobRole[];
  tasks: RecruiterTask[];
  currentUser: User;
  onOpenScanner: () => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onNavigate: (view: string) => void;
  onToggleTask: (taskId: string) => void;
  onOpenDecisionModal: (candidate: Candidate) => void;
  onOpenAiJdModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  candidates,
  jobRoles,
  tasks,
  currentUser,
  onOpenScanner,
  onSelectCandidate,
  onNavigate,
  onToggleTask,
  onOpenDecisionModal,
  onOpenAiJdModal,
}) => {
  const readyForReview = candidates.filter(c => c.status === 'READY_FOR_REVIEW' || c.status === 'HUMAN_REVIEW');
  const shortlisted = candidates.filter(c => c.status === 'SHORTLISTED');
  const greenMatches = candidates.filter(c => c.top_match?.recommendation === 'GREEN');
  const recentCandidates = candidates.slice(0, 5);
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 4);

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-150">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-emerald-300 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Human-in-the-Loop Recruiting</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Welcome back, {currentUser.first_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Use your phone's camera to scan candidate resumes in seconds. The AI extracts structured credentials and recommends matching roles with 100% human decision control.
            </p>
          </div>

          {/* Large Primary Action Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="dashboard-hero-scan-btn"
              onClick={onOpenScanner}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4 animate-pulse text-slate-950" />
              <span>Scan Resume Camera</span>
            </button>
            <button
              id="dashboard-hero-queue-btn"
              onClick={() => onNavigate('review-queue')}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold px-4 py-3 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>Review Queue ({readyForReview.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Pending Review */}
        <div 
          onClick={() => onNavigate('review-queue')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Review Queue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
            {readyForReview.length}
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Awaiting human decision</p>
        </div>

        {/* Metric 2: Strong Matches */}
        <div 
          onClick={() => onNavigate('candidates')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Strong Matches</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            {greenMatches.length}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">🟢 75%+ score & all reqs met</p>
        </div>

        {/* Metric 3: Shortlisted */}
        <div 
          onClick={() => onNavigate('candidates')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Shortlisted</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {shortlisted.length}
          </div>
          <p className="text-[11px] text-indigo-600 font-medium mt-0.5">Approved for interviews</p>
        </div>

        {/* Metric 4: Active Job Roles */}
        <div 
          onClick={() => onNavigate('jobs')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Job Roles</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {jobRoles.filter(j => j.is_active).length}
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">Configured role criteria</p>
        </div>

      </div>

      {/* Main Grid: Pending Review Candidates + Recruiter Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Priority Candidates Awaiting Review */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Recent Resume Scans & Matches
              </h2>
              <p className="text-xs text-slate-500">
                Tap to inspect multi-page OCR extract & match score breakdown
              </p>
            </div>
            <button
              onClick={() => onNavigate('review-queue')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All ({candidates.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentCandidates.map((cand) => {
              const topMatch = cand.top_match;
              const isGreen = topMatch?.recommendation === 'GREEN';
              const isYellow = topMatch?.recommendation === 'YELLOW';

              return (
                <div
                  key={cand.id}
                  id={`dashboard-candidate-${cand.id}`}
                  onClick={() => onSelectCandidate(cand)}
                  className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                      {cand.first_name[0]}{cand.last_name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {cand.first_name} {cand.last_name}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.2 bg-slate-100 rounded">
                          {cand.candidate_code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {cand.current_job_title} • {cand.current_company} • {(cand.total_experience_months / 12).toFixed(1)} yrs exp
                      </p>
                      
                      {/* Top Match Target */}
                      {topMatch && (
                        <div className="flex items-center space-x-1.5 mt-1.5">
                          <span className="text-[11px] font-medium text-slate-600">Top Match:</span>
                          <span className="text-[11px] font-bold text-slate-800">{topMatch.job_role_name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommendation Badge & Action */}
                  <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {topMatch && (
                      <div className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1.5 ${
                        isGreen
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isYellow
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        <span>{isGreen ? '🟢 Strong Match' : isYellow ? '🟡 Review Required' : '🔴 Requirements Issue'}</span>
                        <span className="font-mono">({topMatch.overall_score}%)</span>
                      </div>
                    )}

                    {cand.status === 'READY_FOR_REVIEW' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDecisionModal(cand);
                        }}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Decide
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                        {cand.status.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Recruiter To-Do Tasks & Quick Job Assistant */}
        <div className="space-y-4">
          
          {/* Tasks Box */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ClipboardList className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Recruiter To-Do Tasks</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                {pendingTasks.length} Pending
              </span>
            </div>

            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-start space-x-2.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id)}
                    className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold leading-tight ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('tasks')}
              className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-3 border-t border-slate-100 mt-3 cursor-pointer"
            >
              View Full Task Queue →
            </button>
          </div>

          {/* AI Job Assistant Shortcut Box */}
          <div className="bg-gradient-to-br from-indigo-50 to-emerald-50/50 p-4 rounded-3xl border border-indigo-100 shadow-xs">
            <div className="flex items-start space-x-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">AI Job Description Architect</h4>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  Type a quick prompt to auto-generate requirements & weights with Gemini.
                </p>
              </div>
            </div>
            <button
              id="dashboard-open-ai-jd-btn"
              onClick={onOpenAiJdModal}
              className="w-full mt-2 py-2 px-3 bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-700 font-bold rounded-xl text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Role with AI Assistant</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
