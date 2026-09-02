import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Plus, 
  Layers, 
  Users, 
  CheckCircle2, 
  MapPin, 
  IndianRupee, 
  Award,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Eye,
  Filter,
  Camera
} from 'lucide-react';
import { JobRole } from '../types';

interface JobRolesViewProps {
  jobRoles: JobRole[];
  onOpenAiJdModal: () => void;
  onSelectRoleFilter?: (roleId: string) => void;
  onEditRole?: (role: JobRole) => void;
  onDeleteRole?: (role: JobRole) => void;
  onCreateRole?: () => void;
  onScanForRole?: (roleId: string) => void;
}

export const JobRolesView: React.FC<JobRolesViewProps> = ({
  jobRoles,
  onOpenAiJdModal,
  onSelectRoleFilter,
  onEditRole,
  onDeleteRole,
  onCreateRole,
  onScanForRole,
}) => {
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(jobRoles[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedRoleId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Job Roles Master & Requirements
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              {jobRoles.length} Active Positions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configured job criteria, mandatory qualifications, edit/delete controls, & AI matching weight rules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onCreateRole && (
            <button
              id="jobs-manual-create-btn"
              onClick={onCreateRole}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>New Job Role</span>
            </button>
          )}

          <button
            id="jobs-ai-architect-btn"
            onClick={onOpenAiJdModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-200 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Job Architect</span>
          </button>
        </div>
      </div>

      {/* Roles List */}
      <div className="space-y-3">
        {jobRoles.map((role) => {
          const isExpanded = expandedRoleId === role.id;
          const mandatoryReqs = role.requirements.filter(r => r.mandatory);
          const preferredReqs = role.requirements.filter(r => !r.mandatory);

          return (
            <div
              key={role.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Role Header Card */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div 
                  onClick={() => toggleExpand(role.id)}
                  className="flex items-start space-x-3.5 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-50 to-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base shrink-0 border border-indigo-200">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {role.role_name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                        {role.department}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {role.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {role.location}
                      </span>
                      <span>•</span>
                      <span>Exp: <strong>{role.min_experience_years} - {role.max_experience_years || '8+'} Yrs</strong></span>
                      {role.salary_range && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-emerald-700">{role.salary_range}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Candidate Counts & Action Controls */}
                <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  
                  {/* Candidate count metrics */}
                  <div className="text-left md:text-right mr-2">
                    <div className="flex items-center space-x-1.5 md:justify-end">
                      <span className="text-xs font-bold text-slate-900">{role.candidate_count || 0}</span>
                      <span className="text-xs text-slate-500">matched</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 block">
                      {role.shortlisted_count || 0} shortlisted
                    </span>
                  </div>

                  {/* Scan Resume for Role */}
                  {onScanForRole && (
                    <button
                      onClick={() => onScanForRole(role.id)}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                      title="Scan resume specifically for this job role"
                    >
                      <Camera className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Scan for Role</span>
                    </button>
                  )}

                  {/* Filter Candidates by Role */}
                  {onSelectRoleFilter && (
                    <button
                      onClick={() => onSelectRoleFilter(role.id)}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                      title="View candidates matched to this role"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Candidates</span>
                    </button>
                  )}

                  {/* View Details / Expand */}
                  <button
                    onClick={() => toggleExpand(role.id)}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                    title={isExpanded ? "Collapse requirements" : "View requirements breakdown"}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isExpanded ? 'Hide' : 'Criteria'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                  </button>

                  {/* Edit Role */}
                  {onEditRole && (
                    <button
                      onClick={() => onEditRole(role)}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                      title="Edit job role and scoring weights"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}

                  {/* Delete Role */}
                  {onDeleteRole && (
                    <button
                      onClick={() => onDeleteRole(role)}
                      className="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 rounded-xl transition-all cursor-pointer"
                      title="Delete job role"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Requirements Breakdown */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Role Evaluation Criteria & Scoring Weights ({role.requirements?.length || 0} Total)
                    </h4>
                    {onEditRole && (
                      <button
                        onClick={() => onEditRole(role)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Criteria</span>
                      </button>
                    )}
                  </div>

                  {/* Requirements Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    
                    {/* Mandatory Reqs */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">
                        Mandatory Criteria ({mandatoryReqs.length})
                      </span>
                      {mandatoryReqs.map((req) => (
                        <div key={req.id} className="p-2.5 rounded-xl bg-white border border-red-200 text-xs shadow-2xs">
                          <div className="flex justify-between font-semibold text-slate-900">
                            <span>{req.requirement_name}</span>
                            <span className="font-mono text-red-700 font-bold text-[11px]">{req.weight}% wt</span>
                          </div>
                          {req.description && (
                            <p className="text-[11px] text-slate-500 mt-0.5">{req.description}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Preferred Reqs */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                        Preferred / Bonus Criteria ({preferredReqs.length})
                      </span>
                      {preferredReqs.map((req) => (
                        <div key={req.id} className="p-2.5 rounded-xl bg-white border border-blue-200 text-xs shadow-2xs">
                          <div className="flex justify-between font-semibold text-slate-900">
                            <span>{req.requirement_name}</span>
                            <span className="font-mono text-blue-700 font-bold text-[11px]">{req.weight}% wt</span>
                          </div>
                          {req.description && (
                            <p className="text-[11px] text-slate-500 mt-0.5">{req.description}</p>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
