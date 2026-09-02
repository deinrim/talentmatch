import React from 'react';
import { 
  ClipboardList, 
  BarChart3, 
  History, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  ChevronRight, 
  User, 
  Database,
  ExternalLink
} from 'lucide-react';
import { User as UserType } from '../types';

interface MoreMobileViewProps {
  currentUser: UserType;
  onNavigate: (view: string) => void;
  onResetDemoData: () => void;
  pendingTasksCount: number;
}

export const MoreMobileView: React.FC<MoreMobileViewProps> = ({
  currentUser,
  onNavigate,
  onResetDemoData,
  pendingTasksCount,
}) => {
  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-150">
      
      {/* Current User Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
          {currentUser.first_name[0]}{currentUser.last_name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-slate-900 truncate">
            {currentUser.first_name} {currentUser.last_name}
          </h2>
          <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
          <span className="inline-block text-[10px] font-bold px-2 py-0.2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 mt-1">
            Role: {currentUser.role.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        
        <button
          onClick={() => onNavigate('tasks')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Recruiter Action Tasks</span>
              <span className="text-[11px] text-slate-500">Pending review & interview items</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {pendingTasksCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 bg-amber-500 text-white rounded-full">
                {pendingTasksCount}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Reports & Analytics</span>
              <span className="text-[11px] text-slate-500">Pipeline conversion and match stats</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => onNavigate('audit-logs')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Security Audit Trail</span>
              <span className="text-[11px] text-slate-500">Immutable log of recruiter decisions</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

      </div>

      {/* Human In The Loop Rules Card */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-4 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <h3 className="text-xs font-bold">Human-in-the-Loop Architecture</h3>
        </div>
        <p className="text-[11px] text-emerald-800 leading-relaxed">
          AI functions strictly as an OCR & extraction assistant. Rejection reasons are mandatory and every action is timestamped in the audit log.
        </p>
      </div>

      {/* Reset Demo Data Button */}
      <button
        onClick={onResetDemoData}
        className="w-full p-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-2xl shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4 text-slate-500" />
        <span>Reset to Sample Candidates Demo State</span>
      </button>

    </div>
  );
};
