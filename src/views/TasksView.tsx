import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trash2,
  ChevronRight,
  Edit3,
  Eye,
  User
} from 'lucide-react';
import { RecruiterTask, Candidate } from '../types';

interface TasksViewProps {
  tasks: RecruiterTask[];
  onToggleTask: (taskId: string) => void;
  onSelectCandidateById: (candidateId: string) => void;
  onEditTask?: (task: RecruiterTask) => void;
  onDeleteTask?: (taskId: string) => void;
  onCreateTask?: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onSelectCandidateById,
  onEditTask,
  onDeleteTask,
  onCreateTask,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('PENDING');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'PENDING') return !t.completed;
    if (filter === 'COMPLETED') return t.completed;
    return true;
  });

  return (
    <div className="space-y-5 pb-20 md:pb-8 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recruiter Action & Task Queue
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              {tasks.filter(t => !t.completed).length} Incomplete
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track pending evaluations, interview schedules, add notes, and manage recruiter action items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Filter Pill Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filter === 'PENDING' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Pending ({tasks.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filter === 'COMPLETED' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Done ({tasks.filter(t => t.completed).length})
            </button>
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filter === 'ALL' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({tasks.length})
            </button>
          </div>

          {onCreateTask && (
            <button
              id="create-task-btn"
              onClick={onCreateTask}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center space-x-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No tasks in this view</h3>
            <p className="text-xs text-slate-400 mt-0.5">Great job keeping the recruiter pipeline organized.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                task.completed 
                  ? 'border-slate-200/60 bg-slate-50/50 opacity-75' 
                  : 'border-slate-200 shadow-xs hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start space-x-3 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  title={task.completed ? "Mark as pending" : "Mark as completed"}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-xs sm:text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    {task.priority && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                        task.priority === 'HIGH'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : task.priority === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{task.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-medium">
                    {task.due_text && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Due: {task.due_text}</span>
                      </span>
                    )}
                    {task.candidate_name && (
                      <span className="flex items-center space-x-1 text-slate-600 font-semibold">
                        <User className="w-3 h-3 text-indigo-500" />
                        <span>Candidate: {task.candidate_name}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions: Review Candidate, Edit, Delete */}
              <div className="flex items-center space-x-1.5 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {task.candidate_id && (
                  <button
                    onClick={() => onSelectCandidateById(task.candidate_id!)}
                    className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center space-x-1"
                    title="View linked candidate profile"
                  >
                    <span>Candidate</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}

                {onEditTask && (
                  <button
                    onClick={() => onEditTask(task)}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center space-x-1"
                    title="Edit task details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}

                {onDeleteTask && (
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
