import React, { useState, useEffect } from 'react';
import { 
  User, 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Sparkles,
  Building,
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  Clock,
  Layers
} from 'lucide-react';
import { Candidate, CandidateExperience, CandidateEducation, CandidateSkill, CandidateStatus } from '../types';

interface EditCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onSave: (updatedCandidate: Candidate) => Promise<void>;
}

export const EditCandidateModal: React.FC<EditCandidateModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Candidate>>({});
  const [activeTab, setActiveTab] = useState<'BASIC' | 'EXPERIENCE' | 'EDUCATION' | 'SKILLS'>('BASIC');
  const [newSkillName, setNewSkillName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (candidate) {
      setFormData(JSON.parse(JSON.stringify(candidate)));
      setError(null);
    }
  }, [candidate, isOpen]);

  if (!isOpen || !candidate) return null;

  const handleInputChange = (field: keyof Candidate, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExperienceChange = (index: number, field: keyof CandidateExperience, value: any) => {
    const list = [...(formData.experience || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData(prev => ({ ...prev, experience: list }));
  };

  const addExperience = () => {
    const newExp: CandidateExperience = {
      id: `exp-${Date.now()}`,
      company: '',
      job_title: '',
      start_date: '2022',
      end_date: 'Present',
      is_current: true,
      duration_months: 12,
      responsibilities: []
    };
    setFormData(prev => ({
      ...prev,
      experience: [newExp, ...(prev.experience || [])]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index: number, field: keyof CandidateEducation, value: any) => {
    const list = [...(formData.education || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData(prev => ({ ...prev, education: list }));
  };

  const addEducation = () => {
    const newEdu: CandidateEducation = {
      id: `edu-${Date.now()}`,
      qualification: '',
      institution: '',
      year: '2020',
      grade: 'First Class'
    };
    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: CandidateSkill = {
      id: `sk-${Date.now()}`,
      skill_name: newSkillName.trim(),
      normalized_name: newSkillName.trim().toLowerCase(),
      category: 'DOMAIN',
      proficiency: 'ADVANCED'
    };
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill]
    }));
    setNewSkillName('');
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index)
    }));
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) {
      setError('First and last name are required.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave({
        ...candidate,
        ...formData
      } as Candidate);
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update candidate record');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Edit Candidate: {candidate.first_name} {candidate.last_name}
                </h3>
                <span className="font-mono text-[10px] text-slate-500 px-1.5 py-0.5 bg-slate-200 rounded">
                  {candidate.candidate_code}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Update candidate credentials, employment history, and skills
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
        <div className="flex border-b border-slate-200 px-5 bg-white space-x-1">
          <button
            type="button"
            onClick={() => setActiveTab('BASIC')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'BASIC'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Basic & Contact
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('EXPERIENCE')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'EXPERIENCE'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Experience ({formData.experience?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('EDUCATION')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'EDUCATION'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Education ({formData.education?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SKILLS')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'SKILLS'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Skills ({formData.skills?.length || 0})
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
              {error}
            </div>
          )}

          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === 'BASIC' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name || ''}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name || ''}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Job Title</label>
                  <input
                    type="text"
                    value={formData.current_job_title || ''}
                    onChange={(e) => handleInputChange('current_job_title', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Company</label>
                  <input
                    type="text"
                    value={formData.current_company || ''}
                    onChange={(e) => handleInputChange('current_company', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Experience (Months)</label>
                  <input
                    type="number"
                    value={formData.total_experience_months || 0}
                    onChange={(e) => handleInputChange('total_experience_months', parseInt(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    = {((formData.total_experience_months || 0) / 12).toFixed(1)} Years
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notice Period</label>
                  <input
                    type="text"
                    value={formData.notice_period || ''}
                    onChange={(e) => handleInputChange('notice_period', e.target.value)}
                    placeholder="e.g. 30 Days"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Status</label>
                  <select
                    value={formData.status || 'READY_FOR_REVIEW'}
                    onChange={(e) => handleInputChange('status', e.target.value as CandidateStatus)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-hidden"
                  >
                    <option value="READY_FOR_REVIEW">Ready For Review</option>
                    <option value="HUMAN_REVIEW">Human Review</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="REJECTED_BY_RECRUITER">Not Suitable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Professional Summary</label>
                <textarea
                  rows={3}
                  value={formData.professional_summary || ''}
                  onChange={(e) => handleInputChange('professional_summary', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === 'EXPERIENCE' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Work Experience Timeline</span>
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              {(formData.experience || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No experience records found.</p>
              ) : (
                formData.experience?.map((exp, idx) => (
                  <div key={exp.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="absolute top-3 right-3 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-8">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Job Title</label>
                        <input
                          type="text"
                          value={exp.job_title}
                          onChange={(e) => handleExperienceChange(idx, 'job_title', e.target.value)}
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Start Date</label>
                        <input
                          type="text"
                          value={exp.start_date}
                          onChange={(e) => handleExperienceChange(idx, 'start_date', e.target.value)}
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">End Date</label>
                        <input
                          type="text"
                          value={exp.end_date}
                          onChange={(e) => handleExperienceChange(idx, 'end_date', e.target.value)}
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Months</label>
                        <input
                          type="number"
                          value={exp.duration_months}
                          onChange={(e) => handleExperienceChange(idx, 'duration_months', parseInt(e.target.value) || 0)}
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === 'EDUCATION' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Educational Qualifications</span>
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {(formData.education || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No education records found.</p>
              ) : (
                formData.education?.map((edu, idx) => (
                  <div key={edu.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="absolute top-3 right-3 p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-8">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Degree / Qualification</label>
                        <input
                          type="text"
                          value={edu.qualification}
                          onChange={(e) => handleEducationChange(idx, 'qualification', e.target.value)}
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Institution / University</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Year of Completion</label>
                        <input
                          type="text"
                          value={edu.year || ''}
                          onChange={(e) => handleEducationChange(idx, 'year', e.target.value)}
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Grade / Percentage</label>
                        <input
                          type="text"
                          value={edu.grade || ''}
                          onChange={(e) => handleEducationChange(idx, 'grade', e.target.value)}
                          className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'SKILLS' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Type skill (e.g., Bancassurance, ULIPs, CRM)..."
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer"
                >
                  + Add Skill
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {(formData.skills || []).map((sk, idx) => (
                  <span
                    key={sk.id || idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <span>{sk.skill_name}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
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
              id="save-candidate-btn"
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Candidate Record'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
