export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'RECRUITER'
  | 'REVIEWER'
  | 'MANAGER'
  | 'VIEW_ONLY';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
}

export type CandidateStatus =
  | 'NEW'
  | 'PROCESSING'
  | 'READY_FOR_REVIEW'
  | 'SHORTLIST_RECOMMENDED'
  | 'HUMAN_REVIEW'
  | 'SHORTLISTED'
  | 'REJECTED_BY_RECRUITER'
  | 'ON_HOLD'
  | 'HIRED';

export interface CandidateEducation {
  id: string;
  qualification: string;
  specialization?: string;
  institution: string;
  year?: string;
  grade?: string;
}

export interface CandidateExperience {
  id: string;
  company: string;
  job_title: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  duration_months: number;
  responsibilities: string[];
}

export interface CandidateSkill {
  id: string;
  skill_name: string;
  normalized_name: string;
  category: 'TECHNICAL' | 'DOMAIN' | 'SOFT_SKILL' | 'CERTIFICATION' | 'TOOL';
  proficiency?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

export interface CandidateResume {
  id: string;
  file_name: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  version: number;
  is_current: boolean;
  uploaded_by: string;
  uploaded_at: string;
  preview_url?: string;
  raw_text?: string;
  pages?: string[]; // base64 or preview URLs of captured pages
}

export interface CandidateTimelineItem {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  actor_role: UserRole;
  details: string;
  badge_color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

export interface MatchEvidence {
  id: string;
  requirement_id?: string;
  requirement_name: string;
  requirement_type: 'MANDATORY' | 'PREFERRED' | 'OPTIONAL';
  candidate_evidence: string;
  source_resume_page?: number;
  result: 'MATCH' | 'PARTIAL' | 'MISSING';
  explanation: string;
}

export interface ScoreBreakdown {
  education: number;
  max_education: number;
  experience: number;
  max_experience: number;
  mandatory_skills: number;
  max_mandatory_skills: number;
  preferred_skills: number;
  max_preferred_skills: number;
  industry_experience: number;
  max_industry_experience: number;
  location_match: number;
  max_location_match: number;
}

export type RecommendationColor = 'GREEN' | 'YELLOW' | 'RED';

export interface CandidateJobMatch {
  id: string;
  candidate_id: string;
  job_role_id: string;
  job_role_name: string;
  department: string;
  overall_score: number; // 0 - 100
  recommendation: RecommendationColor;
  generated_at: string;
  model_version: string;
  score_breakdown: ScoreBreakdown;
  evidence: MatchEvidence[];
  summary_reason: string;
  missing_items: string[];
  strengths: string[];
}

export interface Candidate {
  id: string;
  candidate_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  professional_summary: string;
  total_experience_months: number;
  current_job_title: string;
  current_company: string;
  notice_period?: string;
  expected_salary?: string;
  source: 'Camera Scan' | 'Manual Upload' | 'Referral' | 'Job Portal';
  status: CandidateStatus;
  education: CandidateEducation[];
  experience: CandidateExperience[];
  skills: CandidateSkill[];
  certifications: string[];
  languages: string[];
  resumes: CandidateResume[];
  matches?: CandidateJobMatch[];
  top_match?: CandidateJobMatch;
  timeline: CandidateTimelineItem[];
  rejection_reason?: string;
  rejection_notes?: string;
  recruiter_notes?: Array<{
    id: string;
    author: string;
    text: string;
    created_at: string;
  }>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface JobRequirement {
  id: string;
  job_role_id: string;
  requirement_type: 'MANDATORY' | 'PREFERRED' | 'OPTIONAL';
  requirement_name: string;
  category: 'EXPERIENCE' | 'EDUCATION' | 'SKILL' | 'CERTIFICATION' | 'LOCATION' | 'INDUSTRY' | 'TOOL';
  mandatory: boolean;
  weight: number;
  minimum_value?: string;
  maximum_value?: string;
  description?: string;
}

export interface JobRole {
  id: string;
  role_name: string;
  department: string;
  description: string;
  is_active: boolean;
  location: string;
  min_experience_years: number;
  max_experience_years: number;
  salary_range?: string;
  requirements: JobRequirement[];
  created_at: string;
  candidate_count?: number;
  shortlisted_count?: number;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  entity_type: 'CANDIDATE' | 'RESUME' | 'JOB_ROLE' | 'MATCH' | 'DECISION' | 'AUTH';
  entity_id: string;
  entity_name: string;
  ip_address: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface RecruiterTask {
  id: string;
  title: string;
  description: string;
  type: 'REVIEW_PENDING' | 'REJECTION_FEEDBACK' | 'INTERVIEW_SCHEDULED' | 'DUPLICATE_CHECK';
  candidate_id?: string;
  candidate_name?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  due_text: string;
  completed: boolean;
}

export type ProcessingStep = 
  | 'UPLOADED'
  | 'OCR_PROCESSING'
  | 'TEXT_EXTRACTED'
  | 'AI_ANALYSIS'
  | 'STRUCTURED'
  | 'MATCHED'
  | 'READY_FOR_REVIEW'
  | 'FAILED';

export const REJECTION_REASONS = [
  'Mandatory qualification / degree missing',
  'Experience requirement not met (insufficient years)',
  'Lack of mandatory BFSI / Insurance domain experience',
  'Key mandatory skills missing from profile',
  'Location mismatch / unwilling to relocate',
  'Salary expectation outside budget bracket',
  'Notice period too long (> 60 days)',
  'Communication / language requirement not met',
  'Duplicate or incomplete resume document',
  'Candidate declined initial discussion',
  'Other (specified in notes)'
];
