import React, { useState } from 'react';
import { 
  Scan, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronDown, 
  UserCheck, 
  Sparkles,
  ClipboardList,
  RefreshCw,
  Bell
} from 'lucide-react';
import { User, UserRole } from '../types';

interface NavbarProps {
  currentUser: User;
  availableUsers: User[];
  onSwitchUser: (userId: string) => void;
  onOpenScanner: () => void;
  pendingTasksCount: number;
  onNavigate: (view: string) => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  availableUsers,
  onSwitchUser,
  onOpenScanner,
  pendingTasksCount,
  onNavigate,
  activeView,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RECRUITER':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REVIEWER':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MANAGER':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => onNavigate('dashboard')}
            id="nav-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">TalentMatch AI</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  Mobile OCR v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                AI Resume Scanner & Human-in-the-Loop Job Matcher
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Primary Mobile & Desktop Scan Button */}
            <button
              id="header-scan-btn"
              onClick={onOpenScanner}
              className="flex items-center space-x-1.5 sm:space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-300 transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Resume</span>
            </button>

            {/* Task list shortcut */}
            <button
              id="header-tasks-btn"
              onClick={() => onNavigate('tasks')}
              className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
                activeView === 'tasks' 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Recruiter Tasks"
            >
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
              {pendingTasksCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {pendingTasksCount}
                </span>
              )}
            </button>

            {/* Role Switcher & User Profile Menu */}
            <div className="relative">
              <button
                id="header-user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  {currentUser.first_name[0]}{currentUser.last_name[0]}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.first_name} {currentUser.last_name}
                  </div>
                  <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadge(currentUser.role)}`}>
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Role & Session</p>
                      <p className="text-sm font-bold text-slate-800">{currentUser.first_name} {currentUser.last_name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getRoleBadge(currentUser.role)}`}>
                          Role: {currentUser.role.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="px-3 py-2">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                        Switch Persona (RBAC Testing)
                      </p>
                      <div className="space-y-1">
                        {availableUsers.map((u) => (
                          <button
                            key={u.id}
                            id={`switch-user-${u.id}`}
                            onClick={() => {
                              onSwitchUser(u.id);
                              setShowUserMenu(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                              u.id === currentUser.id 
                                ? 'bg-indigo-50 text-indigo-900 font-semibold' 
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                                {u.first_name[0]}
                              </span>
                              <div className="text-left">
                                <p className="leading-tight">{u.first_name} {u.last_name}</p>
                                <span className={`text-[9px] font-semibold px-1 rounded ${getRoleBadge(u.role)}`}>
                                  {u.role.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                            {u.id === currentUser.id && (
                              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 px-3 pt-2 pb-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          CSRF & RBAC Enforced
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
