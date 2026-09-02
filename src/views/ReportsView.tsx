import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Download, 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  Clock,
  Briefcase
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Candidate, JobRole } from '../types';

interface ReportsViewProps {
  candidates: Candidate[];
  jobRoles: JobRole[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ candidates, jobRoles }) => {
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/reports/summary')
      .then(res => res.json())
      .then(data => setReportData(data))
      .catch(err => console.error(err));
  }, [candidates]);

  const total = candidates.length;
  const ready = candidates.filter(c => c.status === 'READY_FOR_REVIEW' || c.status === 'HUMAN_REVIEW').length;
  const shortlisted = candidates.filter(c => c.status === 'SHORTLISTED').length;
  const onHold = candidates.filter(c => c.status === 'ON_HOLD').length;
  const rejected = candidates.filter(c => c.status === 'REJECTED_BY_RECRUITER').length;

  const matchData = [
    { name: 'Strong Match (75%+)', value: candidates.filter(c => c.top_match?.recommendation === 'GREEN').length, color: '#10B981' },
    { name: 'Review Required', value: candidates.filter(c => c.top_match?.recommendation === 'YELLOW').length, color: '#F59E0B' },
    { name: 'Requirements Issue', value: candidates.filter(c => c.top_match?.recommendation === 'RED').length, color: '#EF4444' },
  ];

  const pipelineData = [
    { stage: 'Pending Review', count: ready, fill: '#6366F1' },
    { stage: 'Shortlisted', count: shortlisted, fill: '#10B981' },
    { stage: 'On Hold', count: onHold, fill: '#F59E0B' },
    { stage: 'Not Suitable', count: rejected, fill: '#EF4444' },
  ];

  const jobFunnelData = jobRoles.map(j => {
    const totalForJob = candidates.filter(c => c.matches?.some(m => m.job_role_id === j.id)).length;
    const shortlistedForJob = candidates.filter(c => c.status === 'SHORTLISTED' && c.top_match?.job_role_id === j.id).length;
    return {
      name: j.role_name.length > 18 ? `${j.role_name.slice(0, 18)}...` : j.role_name,
      total: totalForJob,
      shortlisted: shortlistedForJob,
    };
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-150">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Recruitment Analytics & Funnel Reports
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time hiring velocity, AI match distributions, and recruiter decision compliance.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Scans</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{total}</div>
          <span className="text-[11px] text-indigo-600 font-medium">100% OCR processed</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Shortlisted Ratio</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {total > 0 ? Math.round((shortlisted / total) * 100) : 0}%
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">{shortlisted} candidates approved</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Under Review</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{ready}</div>
          <span className="text-[11px] text-amber-700 font-medium">In recruiter queue</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Not Suitable</span>
          <div className="text-2xl font-bold text-red-600 mt-1">{rejected}</div>
          <span className="text-[11px] text-red-700 font-medium">With logged reason</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: AI Traffic Light Recommendation Breakdown */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            AI Match Tier Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={matchData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {matchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Pipeline */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Candidate Pipeline Statuses
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Chart 3: Job Wise Volume Funnel */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Job Role Conversion Funnel (Total vs Shortlisted)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={jobFunnelData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total Matched" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shortlisted" name="Shortlisted" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
