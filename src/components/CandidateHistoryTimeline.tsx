import React from 'react';
import { 
  History, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Camera, 
  UserCheck, 
  MessageSquare,
  GitMerge
} from 'lucide-react';
import { CandidateTimelineItem } from '../types';

interface CandidateHistoryTimelineProps {
  timeline: CandidateTimelineItem[];
}

export const CandidateHistoryTimeline: React.FC<CandidateHistoryTimelineProps> = ({ timeline }) => {
  const getActionIcon = (action?: string) => {
    const act = (action || '').toLowerCase();
    if (act.includes('camera') || act.includes('scan')) return <Camera className="w-3.5 h-3.5" />;
    if (act.includes('ocr') || act.includes('extraction') || act.includes('ai')) return <Sparkles className="w-3.5 h-3.5" />;
    if (act.includes('match')) return <Sparkles className="w-3.5 h-3.5" />;
    if (act.includes('shortlist')) return <CheckCircle2 className="w-3.5 h-3.5" />;
    if (act.includes('reject') || act.includes('not suitable')) return <XCircle className="w-3.5 h-3.5" />;
    if (act.includes('note')) return <MessageSquare className="w-3.5 h-3.5" />;
    if (act.includes('merge')) return <GitMerge className="w-3.5 h-3.5" />;
    return <Clock className="w-3.5 h-3.5" />;
  };

  const getBadgeColorClasses = (color?: string) => {
    switch (color) {
      case 'green':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400">
        No timeline events recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4 relative pl-4 border-l-2 border-slate-200">
      {timeline.map((item, idx) => (
        <div key={item.id || idx} className="relative group">
          {/* Timeline node icon */}
          <div className={`absolute -left-[25px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-xs bg-white ${getBadgeColorClasses(item.badge_color)}`}>
            {getActionIcon(item.action)}
          </div>

          {/* Timeline content card */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {item.action}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(item.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              {item.details}
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Actor: <strong className="text-slate-700">{item.actor}</strong>
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                {item.actor_role}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
