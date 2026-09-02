import React from 'react';
import { 
  Home, 
  Users, 
  Scan, 
  Briefcase, 
  MoreHorizontal,
  ClipboardList
} from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenScanner: () => void;
  reviewCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  onNavigate,
  onOpenScanner,
  reviewCount,
}) => {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1 shadow-lg"
    >
      <div className="flex items-center justify-around">
        
        {/* 1. HOME */}
        <button
          id="mobile-nav-home"
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-colors cursor-pointer ${
            activeView === 'dashboard' 
              ? 'text-indigo-600 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 2. CANDIDATES */}
        <button
          id="mobile-nav-candidates"
          onClick={() => onNavigate('candidates')}
          className={`relative flex flex-col items-center py-1.5 px-3 rounded-xl transition-colors cursor-pointer ${
            activeView === 'candidates' || activeView === 'review-queue' 
              ? 'text-indigo-600 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Candidates</span>
          {reviewCount > 0 && (
            <span className="absolute top-1 right-2 bg-amber-500 text-white font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {reviewCount}
            </span>
          )}
        </button>

        {/* 3. SCAN RESUME - PROMINENT CENTER ACTION */}
        <button
          id="mobile-nav-scan-center"
          onClick={onOpenScanner}
          className="flex flex-col items-center -mt-5 cursor-pointer group focus:outline-hidden"
          title="Scan Resume"
        >
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-indigo-400 group-active:scale-90 transition-transform border-4 border-white">
            <Scan className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-indigo-700 mt-0.5 tracking-tight">SCAN</span>
        </button>

        {/* 4. JOBS */}
        <button
          id="mobile-nav-jobs"
          onClick={() => onNavigate('jobs')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-colors cursor-pointer ${
            activeView === 'jobs' 
              ? 'text-indigo-600 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Jobs</span>
        </button>

        {/* 5. MORE / REPORTS */}
        <button
          id="mobile-nav-more"
          onClick={() => onNavigate('more')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-colors cursor-pointer ${
            activeView === 'reports' || activeView === 'audit-logs' || activeView === 'tasks' || activeView === 'more'
              ? 'text-indigo-600 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>

      </div>
    </nav>
  );
};
