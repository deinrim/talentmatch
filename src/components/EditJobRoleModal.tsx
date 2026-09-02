import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Layers,
  MapPin,
  Clock,
  IndianRupee,
  ShieldAlert
} from 'lucide-react';
import { JobRole, JobRequirement } from '../types';

interface EditJobRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobRole: JobRole | null; // If null, means creating a new Job Role
  onSave: (roleData: JobRole) => Promise<void>;
  onOpenAIArchitect?: () => void;
}

export const EditJobRoleModal: React.FC<EditJobRoleModalProps> = ({
  isOpen,
  onClose,
  jobRole,
  onSave,
  onOpenAIArchitect,
}) => {
  const [formData, setFormData] = useState<Partial<JobRole>>({
    role_name: '',
    department: 'Bancassurance & Direct Sales',
    description: '',
    location: 'Pan India / Hybrid',
    min_experience_years: 3,
    max_experience_years: 7,
    salary_range: '₹ 6.0 LPA - ₹ 9.5 LPA',
    is_active: true,
    requirements: []
  });

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REQUIREMENTS'>('OVERVIEW');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobRole) {
      setFormData(JSON.parse(JSON.stringify(jobRole)));
    } else {
      setFormData({
        id: `job-${Date.now()}`,
        role_name: '',
        department: 'Bancassurance & Direct Sales',
        description: '',
        location: 'Pan India / Hybrid',
        min_experience_years: 3,
        max_experience_years: 7,
        salary_range: '₹ 6.0 LPA - ₹ 9.5 LPA',
        is_active: true,
        created_at: new Date().toISOString(),
        requirements: [
          {
            id: `req-${Date.now()}-1`,
            job_role_id: '',
            requirement_name: 'Relevant Industry Experience (BFSI/Insurance)',
            requirement_type: 'MANDATORY',
            category: 'EXPERIENCE',
            mandatory: true,
            weight: 30,
            minimum_value: '3 years',
            description: 'Proven track record in insurance sales or retail banking.'
          },
          {
            id: `req-${Date.now()}-2`,
            job_role_id: '',
            requirement_name: 'Bachelor\'s Degree in Any Discipline',
            requirement_type: 'MANDATORY',
            category: 'EDUCATION',
            mandatory: true,
            weight: 25,
            minimum_value: 'Graduate',
            description: 'Recognized university graduate degree.'
          },
          {
            id: `req-${Date.now()}-3`,
            job_role_id: '',
            requirement_name: 'Client Acquisition & Product Presentation',
            requirement_type: 'MANDATORY',
            category: 'SKILL',
            mandatory: true,
            weight: 25,
            description: 'High proficiency in sales presentation and handling objections.'
          },
          {
            id: `req-${Date.now()}-4`,
            job_role_id: '',
            requirement_name: 'IRDAI IC-38 Certification',
            requirement_type: 'PREFERRED',
            category: 'CERTIFICATION',
            mandatory: false,
            weight: 20,
            description: 'Active life insurance agent license or IC-38 qualification.'
          }
        ]
      });
    }
    setError(null);
  }, [jobRole, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof JobRole, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRequirementChange = (index: number, field: keyof JobRequirement, value: any) => {
    const list = [...(formData.requirements || [])];
    const updated = { ...list[index], [field]: value };
    
    // sync mandatory boolean if requirement_type changes
    if (field === 'requirement_type') {
      updated.mandatory = value === 'MANDATORY';
    }
    list[index] = updated;
    setFormData(prev => ({ ...prev, requirements: list }));
  };

  const addRequirement = () => {
    const newReq: JobRequirement = {
      id: `req-${Date.now()}`,
      job_role_id: formData.id || '',
      requirement_name: '',
      requirement_type: 'MANDATORY',
      category: 'SKILL',
      mandatory: true,
      weight: 15,
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), newReq]
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: (prev.requirements || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role_name?.trim()) {
      setError('Job Role Name is required.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(formData as JobRole);
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save job role.');
      setIsSaving(false);
    }
  };

  const totalWeight = (formData.requirements || []).reduce((sum, r) => sum + (Number(r.weight) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {jobRole ? `Edit Role: ${jobRole.role_name}` : 'Create New Job Role'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Configure candidate matching criteria, weights, and qualifications
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

        {/* Tab Navigation */}
        <div className="flex justify-between items-center border-b border-slate-200 px-5 bg-white">
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => setActiveTab('OVERVIEW')}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'OVERVIEW'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Role Overview & Experience
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('REQUIREMENTS')}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'REQUIREMENTS'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Criteria & Rubric ({formData.requirements?.length || 0})
            </button>
          </div>

          {onOpenAIArchitect && !jobRole && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAIArchitect();
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use AI Job Architect</span>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
              {error}
            </div>
          )}

          {activeTab === 'OVERVIEW' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.role_name || ''}
                    onChange={(e) => handleFieldChange('role_name', e.target.value)}
                    placeholder="e.g. Senior Banca Sales Manager"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => handleFieldChange('department', e.target.value)}
                    placeholder="e.g. Bancassurance & Direct Sales"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Exp (Years)</label>
                  <input
                    type="number"
                    value={formData.min_experience_years || 0}
                    onChange={(e) => handleFieldChange('min_experience_years', parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Exp (Years)</label>
                  <input
                    type="number"
                    value={formData.max_experience_years || 0}
                    onChange={(e) => handleFieldChange('max_experience_years', parseFloat(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={formData.salary_range || ''}
                    onChange={(e) => handleFieldChange('salary_range', e.target.value)}
                    placeholder="e.g. ₹ 6.5 LPA - ₹ 10.0 LPA"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Active Status</label>
                  <select
                    value={formData.is_active ? 'true' : 'false'}
                    onChange={(e) => handleFieldChange('is_active', e.target.value === 'true')}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-hidden"
                  >
                    <option value="true">Active (Used for AI Matching)</option>
                    <option value="false">Inactive / Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Summary & Responsibilities</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Describe key responsibilities and candidate expectations..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                />
              </div>
            </div>
          )}

          {activeTab === 'REQUIREMENTS' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-700">Evaluation Criteria & Weights</span>
                  <p className="text-[11px] text-slate-400">Total weight sum: {totalWeight}%</p>
                </div>
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Requirement</span>
                </button>
              </div>

              {(formData.requirements || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No evaluation criteria added yet.</p>
              ) : (
                formData.requirements?.map((req, idx) => (
                  <div 
                    key={req.id || idx} 
                    className={`p-3 rounded-2xl border space-y-2 relative transition-all ${
                      req.requirement_type === 'MANDATORY' 
                        ? 'bg-rose-50/40 border-rose-200' 
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => removeRequirement(idx)}
                      className="absolute top-3 right-3 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete criterion"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-8">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Requirement Name</label>
                        <input
                          type="text"
                          required
                          value={req.requirement_name}
                          onChange={(e) => handleRequirementChange(idx, 'requirement_name', e.target.value)}
                          placeholder="e.g. ULIPs and Life Insurance Knowledge"
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Type</label>
                          <select
                            value={req.requirement_type}
                            onChange={(e) => handleRequirementChange(idx, 'requirement_type', e.target.value)}
                            className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden font-bold"
                          >
                            <option value="MANDATORY">Mandatory (Gate)</option>
                            <option value="PREFERRED">Preferred</option>
                            <option value="OPTIONAL">Optional</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Category</label>
                          <select
                            value={req.category}
                            onChange={(e) => handleRequirementChange(idx, 'category', e.target.value)}
                            className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden"
                          >
                            <option value="EXPERIENCE">Experience</option>
                            <option value="EDUCATION">Education</option>
                            <option value="SKILL">Skill</option>
                            <option value="CERTIFICATION">Certification</option>
                            <option value="LOCATION">Location</option>
                            <option value="INDUSTRY">Industry</option>
                            <option value="TOOL">Tool</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Description / Guidance</label>
                        <input
                          type="text"
                          value={req.description || ''}
                          onChange={(e) => handleRequirementChange(idx, 'description', e.target.value)}
                          placeholder="Optional guidance notes for AI evaluator..."
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Weight %</label>
                        <input
                          type="number"
                          value={req.weight}
                          onChange={(e) => handleRequirementChange(idx, 'weight', parseInt(e.target.value) || 0)}
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Submit Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-job-btn"
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Role...' : jobRole ? 'Update Job Role' : 'Create Job Role'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
