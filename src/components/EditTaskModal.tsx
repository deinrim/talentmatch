import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  X, 
  Save, 
  Clock, 
  AlertCircle, 
  User, 
  CheckCircle2, 
  Trash2
} from 'lucide-react';
import { RecruiterTask, Candidate } from '../types';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: RecruiterTask | null; // null means create new task
  candidates: Candidate[];
  onSave: (taskData: Partial<RecruiterTask>) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  candidates,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<RecruiterTask>>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    due_text: 'Today',
    candidate_id: '',
    candidate_name: '',
    completed: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setFormData(JSON.parse(JSON.stringify(task)));
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        due_text: 'Today',
        candidate_id: '',
        candidate_name: '',
        completed: false
      });
    }
    setError(null);
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleCandidateSelect = (candidateId: string) => {
    const selected = candidates.find(c => c.id === candidateId);
    setFormData(prev => ({
      ...prev,
      candidate_id: candidateId,
      candidate_name: selected ? `${selected.first_name} ${selected.last_name}` : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setError('Task Title is required.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(formData);
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save task.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {task ? 'Edit Recruiter Task' : 'Add New Recruiter Task'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Set follow-up reminders, review notes, and interview schedules
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Schedule Level 2 Interview for Rohan Sharma"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Next Steps</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Add specifics, interview questions to ask, or salary negotiation details..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={formData.priority || 'MEDIUM'}
                onChange={(e) => setFormData(p => ({ ...p, priority: e.target.value as any }))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-hidden"
              >
                <option value="HIGH">High Priority 🔴</option>
                <option value="MEDIUM">Medium Priority 🟡</option>
                <option value="LOW">Low Priority 🟢</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Due Timeline</label>
              <input
                type="text"
                value={formData.due_text || ''}
                onChange={(e) => setFormData(p => ({ ...p, due_text: e.target.value }))}
                placeholder="e.g. Today, Tomorrow, Nov 12"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Linked Candidate (Optional)</label>
            <select
              value={formData.candidate_id || ''}
              onChange={(e) => handleCandidateSelect(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-hidden"
            >
              <option value="">-- None / General Recruiter Task --</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name} ({c.candidate_code}) - {c.current_job_title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="task-completed-check"
              checked={formData.completed || false}
              onChange={(e) => setFormData(p => ({ ...p, completed: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="task-completed-check" className="text-xs font-bold text-slate-700 cursor-pointer">
              Mark task as completed
            </label>
          </div>

          {/* Submit & Delete Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {task && onDelete ? (
              <button
                type="button"
                onClick={async () => {
                  if (confirm(`Delete task "${task.title}"?`)) {
                    await onDelete(task.id);
                    onClose();
                  }
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="save-task-btn"
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : task ? 'Update Task' : 'Create Task'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
