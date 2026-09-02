import React, { useState } from 'react';
import { 
  History, 
  Search, 
  ShieldCheck, 
  Filter, 
  Calendar, 
  User as UserIcon,
  Tag
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    if (actionFilter !== 'ALL' && !(log.action || '').includes(actionFilter)) return false;
    if (search) {
      const q = (search || '').toLowerCase();
      const match = (log.action || '').toLowerCase().includes(q) ||
        (log.user_name || '').toLowerCase().includes(q) ||
        (log.entity_name || '').toLowerCase().includes(q) ||
        (log.ip_address || '').includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-5 pb-20 md:pb-8 animate-in fade-in duration-150">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Security & Recruiter Audit Trail
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
            Immutable Logs
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Full compliance log of resume scans, AI extractions, recruiter human decisions, and profile merges.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, action, candidate name, or IP address..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="text-xs p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
        >
          <option value="ALL">All Event Types</option>
          <option value="DECISION">Decisions (Shortlist/Reject/Hold)</option>
          <option value="SCAN">Resume Scans & Uploads</option>
          <option value="MERGE">Candidate Merges</option>
          <option value="JOB">Job Role Modifications</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor & Role</th>
                <th className="px-4 py-3">Action Event</th>
                <th className="px-4 py-3">Target Entity</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No audit logs matching this search filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {new Date(log.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{log.user_name}</div>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                        {log.user_role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        log.action.includes('SHORTLIST')
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : log.action.includes('REJECT')
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : log.action.includes('HOLD')
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{log.entity_name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {log.entity_type} #{log.entity_id.slice(-6)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      {log.ip_address}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
