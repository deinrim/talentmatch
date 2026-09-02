import React from 'react';
import { 
  Home, 
  Users, 
  Scan, 
  Briefcase, 
  ClipboardCheck, 
  ClipboardList, 
  BarChart3, 
  History, 
  GitMerge, 
  Sparkles,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenScanner: () => void;
  reviewCount: number;
  pendingTasksCount: number;
  currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  onOpenScanner,
  reviewCount,
  pendingTasksCount,
  currentUser,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'review-queue', label: 'Review Queue', icon: ClipboardCheck, badge: reviewCount, badgeColor: 'bg-amber-500 text-white' },
    { id: 'candidates', label: 'All Candidates', icon: Users },
    { id: 'jobs', label: 'Job Roles Master', icon: Briefcase },
    { id: 'tasks', label: 'Recruiter To-Do', icon: ClipboardList, badge: pendingTasksCount, badgeColor: 'bg-indigo-600 text-white' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'audit-logs', label: 'Audit Trail', icon: History },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 select-none min-h-[calc(100vh-4rem)]">
      
      {/* Primary Scan Button on Sidebar */}
      <div className="p-4 border-b border-slate-100">
        <button
          id="sidebar-scan-btn"
          onClick={onOpenScanner}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Scan className="w-4 h-4 animate-pulse" />
          <span>Scan Resume Camera</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Core Workflows
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shadow-xs ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Human In The Loop Philosophy Callout Box */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl">
          <div className="flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-900">Human-in-the-Loop</p>
              <p className="text-[11px] text-emerald-700 leading-tight mt-0.5">
                AI extracts & recommends; human recruiter retains 100% decision authority.
              </p>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
};
