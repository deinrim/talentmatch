import { Candidate, JobRole, User, AuditLog, RecruiterTask } from './types';

export const SEED_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'priya.recruiter',
    email: 'priya.sharma@talentmatch.ai',
    first_name: 'Priya',
    last_name: 'Sharma',
    role: 'RECRUITER',
    is_active: true,
    created_at: '2026-01-10T09:00:00Z',
  },
  {
    id: 'usr-2',
    username: 'super.admin',
    email: 'superadmin@talentmatch.ai',
    first_name: 'Vikram',
    last_name: 'Aditya',
    role: 'SUPER_ADMIN',
    is_active: true,
    created_at: '2025-11-01T08:00:00Z',
  },
  {
    id: 'usr-3',
    username: 'amit.reviewer',
    email: 'amit.patel@talentmatch.ai',
    first_name: 'Amit',
    last_name: 'Patel',
    role: 'REVIEWER',
    is_active: true,
    created_at: '2026-01-15T10:30:00Z',
  },
  {
    id: 'usr-4',
    username: 'rajiv.admin',
    email: 'rajiv.verma@talentmatch.ai',
    first_name: 'Rajiv',
    last_name: 'Verma',
    role: 'ADMIN',
    is_active: true,
    created_at: '2026-01-05T09:15:00Z',
  },
  {
    id: 'usr-5',
    username: 'sunita.manager',
    email: 'sunita.roy@talentmatch.ai',
    first_name: 'Sunita',
    last_name: 'Roy',
    role: 'MANAGER',
    is_active: true,
    created_at: '2026-02-01T11:00:00Z',
  },
  {
    id: 'usr-6',
    username: 'guest.viewer',
    email: 'guest@talentmatch.ai',
    first_name: 'Guest',
    last_name: 'Observer',
    role: 'VIEW_ONLY',
    is_active: true,
    created_at: '2026-02-15T14:00:00Z',
  },
];

export const SEED_JOB_ROLES: JobRole[] = [
  {
    id: 'job-1',
    role_name: 'Senior Relationship Manager - Bancassurance',
    department: 'Bancassurance Sales',
    description: 'Drive high-value life insurance and wealth solution sales through mapped partner bank branches. Build trusted relationships with branch managers, HNI clients, and bank staff.',
    is_active: true,
    location: 'Mumbai / Pune',
    min_experience_years: 3,
    max_experience_years: 8,
    salary_range: '₹ 6.5 LPA - ₹ 11 LPA + Performance Incentives',
    created_at: '2026-01-12T10:00:00Z',
    candidate_count: 8,
    shortlisted_count: 3,
    requirements: [
      {
        id: 'req-1-1',
        job_role_id: 'job-1',
        requirement_type: 'MANDATORY',
        requirement_name: 'Bancassurance or BFSI Sales Experience',
        category: 'EXPERIENCE',
        mandatory: true,
        weight: 25,
        minimum_value: '3 years',
        description: 'Demonstrated track record of direct client acquisition or bank branch channel sales.'
      },
      {
        id: 'req-1-2',
        job_role_id: 'job-1',
        requirement_type: 'MANDATORY',
        requirement_name: 'Graduate Degree (Bachelor\'s in any discipline)',
        category: 'EDUCATION',
        mandatory: true,
        weight: 15,
        minimum_value: 'Bachelor\'s Degree',
        description: 'UGC recognized university graduation required.'
      },
      {
        id: 'req-1-3',
        job_role_id: 'job-1',
        requirement_type: 'MANDATORY',
        requirement_name: 'Life Insurance Product Knowledge & Sales Pitch',
        category: 'SKILL',
        mandatory: true,
        weight: 25,
        description: 'Proficiency with ULIP, Term, Guaranteed Return, and Annuity plans.'
      },
      {
        id: 'req-1-4',
        job_role_id: 'job-1',
        requirement_type: 'PREFERRED',
        requirement_name: 'IRDAI Certification / Licentiate / AMFI',
        category: 'CERTIFICATION',
        mandatory: false,
        weight: 15,
        description: 'Valid IRDAI IC-38 or Insurance Institute of India certification.'
      },
      {
        id: 'req-1-5',
        job_role_id: 'job-1',
        requirement_type: 'PREFERRED',
        requirement_name: 'HNI Client Relationship & Lead Conversion',
        category: 'SKILL',
        mandatory: false,
        weight: 10,
        description: 'Ability to conduct portfolio reviews for affluent bank customers.'
      },
      {
        id: 'req-1-6',
        job_role_id: 'job-1',
        requirement_type: 'OPTIONAL',
        requirement_name: 'CRM Software (Salesforce / LeadSquared)',
        category: 'SKILL',
        mandatory: false,
        weight: 10,
        description: 'Daily activity logging and pipeline management tools.'
      }
    ]
  },
  {
    id: 'job-2',
    role_name: 'Branch Sales Manager - Agency Channel',
    department: 'Direct Agency Sales',
    description: 'Recruit, train, and activate agency insurance advisors. Achieve branch revenue targets across life and health insurance portfolios.',
    is_active: true,
    location: 'Bengaluru / Hyderabad',
    min_experience_years: 4,
    max_experience_years: 10,
    salary_range: '₹ 8.0 LPA - ₹ 14 LPA',
    created_at: '2026-01-15T11:30:00Z',
    candidate_count: 5,
    shortlisted_count: 1,
    requirements: [
      {
        id: 'req-2-1',
        job_role_id: 'job-2',
        requirement_type: 'MANDATORY',
        requirement_name: 'Agency Leader / Team Building Experience',
        category: 'EXPERIENCE',
        mandatory: true,
        weight: 30,
        minimum_value: '4 years',
        description: 'Proven experience in recruiting and managing 15+ active insurance agents.'
      },
      {
        id: 'req-2-2',
        job_role_id: 'job-2',
        requirement_type: 'MANDATORY',
        requirement_name: 'Bachelor\'s Degree or Master\'s (MBA Preferred)',
        category: 'EDUCATION',
        mandatory: true,
        weight: 15,
        minimum_value: 'Graduate'
      },
      {
        id: 'req-2-3',
        job_role_id: 'job-2',
        requirement_type: 'MANDATORY',
        requirement_name: 'Agent Licensing & Onboarding Knowledge',
        category: 'SKILL',
        mandatory: true,
        weight: 25,
        description: 'Deep understanding of IRDA regulations, licensing tests, and commission structures.'
      },
      {
        id: 'req-2-4',
        job_role_id: 'job-2',
        requirement_type: 'PREFERRED',
        requirement_name: 'Local Network & Agent Pool in Territory',
        category: 'LOCATION',
        mandatory: false,
        weight: 15,
        description: 'Established network of financial consultants and housewives/professionals.'
      },
      {
        id: 'req-2-5',
        job_role_id: 'job-2',
        requirement_type: 'OPTIONAL',
        requirement_name: 'Digital Prospecting & Social Selling',
        category: 'SKILL',
        mandatory: false,
        weight: 15
      }
    ]
  },
  {
    id: 'job-3',
    role_name: 'Customer Service & Policy Operations Specialist',
    department: 'Policyholder Services',
    description: 'Handle customer policy renewals, claims verification, alterations, and customer grievances across email and walk-in counters.',
    is_active: true,
    location: 'Delhi NCR / Kolkata',
    min_experience_years: 1,
    max_experience_years: 5,
    salary_range: '₹ 3.5 LPA - ₹ 6.0 LPA',
    created_at: '2026-02-01T08:45:00Z',
    candidate_count: 6,
    shortlisted_count: 2,
    requirements: [
      {
        id: 'req-3-1',
        job_role_id: 'job-3',
        requirement_type: 'MANDATORY',
        requirement_name: 'Customer Support / Operations Experience',
        category: 'EXPERIENCE',
        mandatory: true,
        weight: 25,
        minimum_value: '1 year'
      },
      {
        id: 'req-3-2',
        job_role_id: 'job-3',
        requirement_type: 'MANDATORY',
        requirement_name: 'Bachelor\'s Degree',
        category: 'EDUCATION',
        mandatory: true,
        weight: 20
      },
      {
        id: 'req-3-3',
        job_role_id: 'job-3',
        requirement_type: 'MANDATORY',
        requirement_name: 'Written & Verbal Communication Skills',
        category: 'SKILL',
        mandatory: true,
        weight: 25,
        description: 'Fluency in English & Hindi for policy grievance letters and customer call handling.'
      },
      {
        id: 'req-3-4',
        job_role_id: 'job-3',
        requirement_type: 'PREFERRED',
        requirement_name: 'Core Insurance Platform (e.g. Ingenium, LifeAsia, Oracle Insurance)',
        category: 'TOOL',
        mandatory: false,
        weight: 15
      },
      {
        id: 'req-3-5',
        job_role_id: 'job-3',
        requirement_type: 'PREFERRED',
        requirement_name: 'Microsoft Excel (VLOOKUP, Pivot Tables)',
        category: 'TOOL',
        mandatory: false,
        weight: 15
      }
    ]
  },
  {
    id: 'job-4',
    role_name: 'Tele-Sales Executive - Health & Term Plans',
    department: 'Digital Direct Sales',
    description: 'Connect with inbound web leads, conduct insurance need analysis, explain riders, and convert online term insurance and critical illness policies.',
    is_active: true,
    location: 'Remote / Hybrid (All India)',
    min_experience_years: 1,
    max_experience_years: 4,
    salary_range: '₹ 3.0 LPA - ₹ 5.5 LPA + Monthly Sales Bonus',
    created_at: '2026-02-10T14:20:00Z',
    candidate_count: 4,
    shortlisted_count: 2,
    requirements: [
      {
        id: 'req-4-1',
        job_role_id: 'job-4',
        requirement_type: 'MANDATORY',
        requirement_name: 'Inside Sales / Tele-calling Experience',
        category: 'EXPERIENCE',
        mandatory: true,
        weight: 30,
        minimum_value: '1 year'
      },
      {
        id: 'req-4-2',
        job_role_id: 'job-4',
        requirement_type: 'MANDATORY',
        requirement_name: 'Persuasive Calling & Objection Handling',
        category: 'SKILL',
        mandatory: true,
        weight: 30
      },
      {
        id: 'req-4-3',
        job_role_id: 'job-4',
        requirement_type: 'PREFERRED',
        requirement_name: 'Financial Services / BFSI Tele-sales Background',
        category: 'INDUSTRY',
        mandatory: false,
        weight: 20
      },
      {
        id: 'req-4-4',
        job_role_id: 'job-4',
        requirement_type: 'PREFERRED',
        requirement_name: 'Dialer software (Ameyo, Vicidial, Salesforce CTI)',
        category: 'TOOL',
        mandatory: false,
        weight: 20
      }
    ]
  }
];

export const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'can-1',
    candidate_code: 'CAN-2026-081',
    first_name: 'Rahul',
    last_name: 'Sharma',
    email: 'rahul.sharma88@gmail.com',
    phone: '+91 98201 44521',
    location: 'Mumbai, Maharashtra',
    professional_summary: 'Energetic BFSI sales professional with 5.2 years of consistent track record in Bancassurance channel at ICICI Prudential & HDFC Life. Experienced in driving ₹4.5 Cr annual premium target through 12 mapped partner bank branches, managing HNI relationships, and organizing branch activation drives.',
    total_experience_months: 62,
    current_job_title: 'Senior Relationship Manager',
    current_company: 'HDFC Life Insurance Ltd',
    notice_period: '30 Days (Negotiable)',
    expected_salary: '₹ 8.5 LPA',
    source: 'Camera Scan',
    status: 'READY_FOR_REVIEW',
    created_by: 'Priya Sharma',
    created_at: '2026-09-01T02:30:00Z',
    updated_at: '2026-09-01T02:35:00Z',
    education: [
      {
        id: 'edu-1',
        qualification: 'Bachelor of Commerce (B.Com)',
        specialization: 'Banking & Insurance',
        institution: 'Mumbai University (Narsee Monjee College)',
        year: '2019',
        grade: 'First Class with Distinction (74%)'
      },
      {
        id: 'edu-2',
        qualification: 'Higher Secondary Certificate (HSC)',
        specialization: 'Commerce',
        institution: 'Mithibai College',
        year: '2016',
        grade: '79%'
      }
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'HDFC Life Insurance Ltd',
        job_title: 'Senior Relationship Manager - Bancassurance',
        start_date: '2022-04-01',
        end_date: 'Present',
        is_current: true,
        duration_months: 38,
        responsibilities: [
          'Partnered with 8 HDFC Bank branches in Western Suburbs, driving ULIP and Guaranteed Savings plan acquisitions.',
          'Achieved 128% of FY24 target with ₹3.8 Cr Total Weighted Received Premium (TWRP).',
          'Trained bank PB (Personal Bankers) on new product launches and compliance guidelines.'
        ]
      },
      {
        id: 'exp-2',
        company: 'ICICI Prudential Life Insurance',
        job_title: 'Executive - Branch Channel Sales',
        start_date: '2019-06-01',
        end_date: '2022-03-31',
        is_current: false,
        duration_months: 24,
        responsibilities: [
          'Managed direct customer referrals from ICICI Bank branches.',
          'Conducted financial health check camps and retirement planning workshops for retail customers.'
        ]
      }
    ],
    skills: [
      { id: 'sk-1', skill_name: 'Bancassurance Sales', normalized_name: 'BANCASSURANCE', category: 'DOMAIN', proficiency: 'EXPERT' },
      { id: 'sk-2', skill_name: 'Life Insurance Products', normalized_name: 'LIFE INSURANCE', category: 'DOMAIN', proficiency: 'ADVANCED' },
      { id: 'sk-3', skill_name: 'HNI Relationship Management', normalized_name: 'RELATIONSHIP MANAGEMENT', category: 'TECHNICAL', proficiency: 'ADVANCED' },
      { id: 'sk-4', skill_name: 'Salesforce CRM', normalized_name: 'SALESFORCE', category: 'TOOL', proficiency: 'INTERMEDIATE' },
      { id: 'sk-5', skill_name: 'Client Needs Analysis', normalized_name: 'FINANCIAL PLANNING', category: 'TECHNICAL', proficiency: 'EXPERT' },
      { id: 'sk-6', skill_name: 'Microsoft Excel', normalized_name: 'MICROSOFT EXCEL', category: 'TOOL', proficiency: 'INTERMEDIATE' }
    ],
    certifications: [
      'IRDAI IC-38 Certified Life Insurance Advisor',
      'AMFI Mutual Fund Distributors Certification',
      'NISM Series V-A: Mutual Fund Foundation'
    ],
    languages: ['English (Fluent)', 'Hindi (Native)', 'Marathi (Conversational)'],
    resumes: [
      {
        id: 'res-1',
        file_name: 'rahul_sharma_banca_resume_v1.pdf',
        original_name: 'Rahul_Sharma_Bancassurance_CV.pdf',
        mime_type: 'application/pdf',
        file_size: 245000,
        version: 1,
        is_current: true,
        uploaded_by: 'Priya Sharma',
        uploaded_at: '2026-09-01T02:30:00Z',
        raw_text: `RAHUL SHARMA
Mobile: +91 98201 44521 | Email: rahul.sharma88@gmail.com | Location: Andheri West, Mumbai
LinkedIn: linkedin.com/in/rahulsharma-bfsi

PROFESSIONAL SUMMARY
Dynamic and goal-oriented Bancassurance professional with 5.2 years of proven success in Life Insurance distribution through tier-1 partner bank branches. Consistent Club qualifier with deep expertise in ULIP, Traditional Endowment, Term, and Retirement products. Proven relationship builder across bank leadership and affluent retail clients.

CORE COMPETENCIES
- Bancassurance Strategy & Execution
- HNI Wealth & Portfolio Needs Analysis
- Partner Branch Management (HDFC & ICICI)
- IRDAI Regulations & Compliance
- Team Training & Branch Staff Enablement

WORK EXPERIENCE
1. Senior Relationship Manager – Bancassurance
   HDFC Life Insurance Co. Ltd., Mumbai | April 2022 – Present (38 months)
   - Mapped to 8 premier HDFC Bank branches in Western Mumbai.
   - Delivered ₹3.8 Crore TWRP in FY 2023-24 (128% of assigned target).
   - Conducted weekly joint customer calls with Branch Managers and Premier Relationship Managers.
   - Reduced proposal rejection rate to below 2.8% through accurate KYC and underwriting documentation.

2. Executive – Branch Channel Sales
   ICICI Prudential Life Insurance, Mumbai | June 2019 – March 2022 (24 months)
   - Handled walk-in customer leads at 4 ICICI Bank branches.
   - Generated ₹1.9 Cr annual new business premium with 88% 13th month persistency.
   - Awarded Star Performer of the Quarter (Q3 2021).

EDUCATION
- Bachelor of Commerce (B.Com) – Banking & Insurance
  Narsee Monjee College of Commerce and Economics, Mumbai University (2016 – 2019) | Grade: 74%
- Higher Secondary Certificate (HSC) – Commerce
  Mithibai College, Mumbai (2016) | Grade: 79%

CERTIFICATIONS & LICENSES
- IRDAI IC-38 Life Insurance Agent License
- AMFI Mutual Fund Certified (ARN-192842)
- NISM Series V-A Mutual Fund Distributors Module

LANGUAGES
English, Hindi, Marathi`,
        pages: []
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2026-09-01T02:30:10Z',
        action: 'Resume Scanned via Camera',
        actor: 'Priya Sharma',
        actor_role: 'RECRUITER',
        details: 'Captured physical 2-page resume at Mumbai Recruitment Walk-in Drive.',
        badge_color: 'blue'
      },
      {
        id: 'tl-2',
        timestamp: '2026-09-01T02:30:45Z',
        action: 'AI OCR & Profile Extraction Completed',
        actor: 'System (Gemini 3.7 Flash)',
        actor_role: 'ADMIN',
        details: 'Extracted 5.2 yrs experience, 2 education records, 6 normalized skills, and 3 certifications with 0 hallucinations.',
        badge_color: 'purple'
      },
      {
        id: 'tl-3',
        timestamp: '2026-09-01T02:31:10Z',
        action: 'AI Matching Engine Calculated 91% Match',
        actor: 'Matching Engine v2.4',
        actor_role: 'ADMIN',
        details: '🟢 STRONG MATCH for "Senior Relationship Manager - Bancassurance". All 3 mandatory requirements satisfied.',
        badge_color: 'green'
      }
    ],
    matches: [
      {
        id: 'match-1',
        candidate_id: 'can-1',
        job_role_id: 'job-1',
        job_role_name: 'Senior Relationship Manager - Bancassurance',
        department: 'Bancassurance Sales',
        overall_score: 91,
        recommendation: 'GREEN',
        generated_at: '2026-09-01T02:31:10Z',
        model_version: 'Gemini-3.7-Flash-RuleEngine-v2',
        score_breakdown: {
          education: 15,
          max_education: 15,
          experience: 25,
          max_experience: 25,
          mandatory_skills: 25,
          max_mandatory_skills: 25,
          preferred_skills: 13,
          max_preferred_skills: 15,
          industry_experience: 10,
          max_industry_experience: 10,
          location_match: 3,
          max_location_match: 10
        },
        evidence: [
          {
            id: 'ev-1',
            requirement_name: 'Bancassurance or BFSI Sales Experience',
            requirement_type: 'MANDATORY',
            candidate_evidence: '5.2 total years (3.1 yrs at HDFC Life Bancassurance + 2.0 yrs at ICICI Prudential)',
            source_resume_page: 1,
            result: 'MATCH',
            explanation: '✓ Exceeds 3 years minimum requirement with proven branch channel performance.'
          },
          {
            id: 'ev-2',
            requirement_name: 'Graduate Degree (Bachelor\'s in any discipline)',
            requirement_type: 'MANDATORY',
            candidate_evidence: 'B.Com in Banking & Insurance (Mumbai University, 2019, 74%)',
            source_resume_page: 2,
            result: 'MATCH',
            explanation: '✓ Verified Bachelor degree from recognized university.'
          },
          {
            id: 'ev-3',
            requirement_name: 'Life Insurance Product Knowledge & Sales Pitch',
            requirement_type: 'MANDATORY',
            candidate_evidence: 'Deep ULIP, Endowment, and Term sales experience with ₹3.8 Cr TWRP in FY24',
            source_resume_page: 1,
            result: 'MATCH',
            explanation: '✓ Core life insurance domain fluency demonstrated across both employers.'
          },
          {
            id: 'ev-4',
            requirement_name: 'IRDAI Certification / Licentiate / AMFI',
            requirement_type: 'PREFERRED',
            candidate_evidence: 'IRDAI IC-38 Life Insurance Agent License & AMFI ARN holder',
            source_resume_page: 2,
            result: 'MATCH',
            explanation: '✓ Holds active IRDAI and AMFI certifications.'
          },
          {
            id: 'ev-5',
            requirement_name: 'CRM Software (Salesforce / LeadSquared)',
            requirement_type: 'OPTIONAL',
            candidate_evidence: 'Salesforce CRM mentioned in skills and daily lead logging',
            source_resume_page: 1,
            result: 'MATCH',
            explanation: '✓ Intermediate familiarity with Salesforce lead workflows.'
          }
        ],
        summary_reason: 'Outstanding match! 5.2 years of top-tier Bancassurance sales across HDFC Life & ICICI Prudential, IRDAI certified, verified B.Com degree, and strong numbers (₹3.8 Cr TWRP).',
        missing_items: [],
        strengths: [
          'Direct 5+ years experience in identical Bancassurance role',
          'IRDAI IC-38 and AMFI certifications in place',
          'High performance history (128% FY24 target achievement)',
          'Based in Mumbai (zero relocation delay)'
        ]
      },
      {
        id: 'match-2',
        candidate_id: 'can-1',
        job_role_id: 'job-4',
        job_role_name: 'Tele-Sales Executive - Health & Term Plans',
        department: 'Digital Direct Sales',
        overall_score: 78,
        recommendation: 'YELLOW',
        generated_at: '2026-09-01T02:31:10Z',
        model_version: 'Gemini-3.7-Flash-RuleEngine-v2',
        score_breakdown: {
          education: 15,
          max_education: 20,
          experience: 30,
          max_experience: 30,
          mandatory_skills: 20,
          max_mandatory_skills: 30,
          preferred_skills: 10,
          max_preferred_skills: 20,
          industry_experience: 0,
          max_industry_experience: 0,
          location_match: 3,
          max_location_match: 0
        },
        evidence: [
          {
            id: 'ev-2-1',
            requirement_name: 'Inside Sales / Tele-calling Experience',
            requirement_type: 'MANDATORY',
            candidate_evidence: 'Candidate has field/branch face-to-face sales rather than dedicated dialer tele-sales',
            source_resume_page: 1,
            result: 'PARTIAL',
            explanation: '⚠ Strong sales skill, but background is in-person branch sales rather than high-volume outbound dialer.'
          }
        ],
        summary_reason: 'Qualified in insurance sales, but may be overqualified for inside tele-sales. Stronger fit for Bancassurance relationship manager.',
        missing_items: ['Dedicated outbound dialer tele-calling experience'],
        strengths: ['Strong insurance objection handling and product fluency']
      }
    ]
  },
  {
    id: 'can-2',
    candidate_code: 'CAN-2026-082',
    first_name: 'Ananya',
    last_name: 'Sengupta',
    email: 'ananya.sengupta@outlook.com',
    phone: '+91 97482 11902',
    location: 'Bengaluru, Karnataka',
    professional_summary: 'Results-focused sales executive with 4.5 years of experience in retail banking and consumer loan distribution. Looking to pivot into Insurance Branch/Agency leadership. Skilled in managing customer queries, cross-selling credit cards & home loans, and local partner liaison.',
    total_experience_months: 54,
    current_job_title: 'Assistant Branch Sales Manager - Retail Assets',
    current_company: 'Axis Bank',
    notice_period: '60 Days',
    expected_salary: '₹ 9.0 LPA',
    source: 'Manual Upload',
    status: 'HUMAN_REVIEW',
    created_by: 'Priya Sharma',
    created_at: '2026-09-01T03:15:00Z',
    updated_at: '2026-09-01T03:20:00Z',
    education: [
      {
        id: 'edu-2-1',
        qualification: 'Master of Business Administration (MBA)',
        specialization: 'Marketing',
        institution: 'Christ University, Bengaluru',
        year: '2021',
        grade: 'CGPA 3.4 / 4.0'
      },
      {
        id: 'edu-2-2',
        qualification: 'Bachelor of Business Administration (BBA)',
        institution: 'St. Xavier\'s College, Kolkata',
        year: '2019',
        grade: 'First Class'
      }
    ],
    experience: [
      {
        id: 'exp-2-1',
        company: 'Axis Bank Ltd',
        job_title: 'Assistant Manager - Retail Asset Sales',
        start_date: '2021-07-01',
        end_date: 'Present',
        is_current: true,
        duration_months: 40,
        responsibilities: [
          'Sourced personal loans and auto loans through direct sales team of 6 agents.',
          'Cross-sold general insurance and credit life protection products to retail loan applicants.'
        ]
      },
      {
        id: 'exp-2-2',
        company: 'Kotak Mahindra Prime',
        job_title: 'Sales Officer',
        start_date: '2019-06-01',
        end_date: '2020-04-30',
        is_current: false,
        duration_months: 11,
        responsibilities: [
          'Handled dealer sales financing for two-wheelers in Bengaluru South.'
        ]
      }
    ],
    skills: [
      { id: 'sk-21', skill_name: 'Team Management', normalized_name: 'TEAM MANAGEMENT', category: 'TECHNICAL', proficiency: 'INTERMEDIATE' },
      { id: 'sk-22', skill_name: 'Retail Banking Products', normalized_name: 'BANKING', category: 'DOMAIN', proficiency: 'ADVANCED' },
      { id: 'sk-23', skill_name: 'Cross-selling Insurance', normalized_name: 'CROSS SELLING', category: 'TECHNICAL', proficiency: 'INTERMEDIATE' },
      { id: 'sk-24', skill_name: 'Microsoft Excel', normalized_name: 'MICROSOFT EXCEL', category: 'TOOL', proficiency: 'ADVANCED' }
    ],
    certifications: [
      'NISM Series VIII: Equity Derivatives Certification'
    ],
    languages: ['English', 'Bengali', 'Hindi', 'Kannada (Basic)'],
    resumes: [
      {
        id: 'res-2',
        file_name: 'ananya_sengupta_cv.pdf',
        original_name: 'Ananya_Sengupta_Resume.pdf',
        mime_type: 'application/pdf',
        file_size: 198000,
        version: 1,
        is_current: true,
        uploaded_by: 'Priya Sharma',
        uploaded_at: '2026-09-01T03:15:00Z',
        raw_text: `ANANYA SENGUPTA
Bengaluru, Karnataka | Phone: +91 97482 11902 | ananya.sengupta@outlook.com

EXPERIENCE
Axis Bank Ltd | Assistant Manager - Retail Asset Sales (July 2021 – Present)
- Led 6 direct sales associates in Bengaluru South cluster.
- Distributed Home Loans, Personal Loans, and bundled credit shield insurance policies.
- Achieved ₹18 Cr asset disbursement in FY 2023-24.

Kotak Mahindra Prime | Sales Officer (June 2019 – April 2020)
- Sourced auto retail loans through two-wheeler dealerships.

EDUCATION
- MBA in Marketing – Christ University, Bengaluru (2021)
- BBA – St. Xavier's College, Kolkata (2019)

SKILLS & STRENGTHS
Sales Management, DSA Channel Handling, Loan Cross-sell, Team Coaching, Kannada/English/Hindi communication.`
      }
    ],
    timeline: [
      {
        id: 'tl-21',
        timestamp: '2026-09-01T03:15:00Z',
        action: 'Resume Uploaded (PDF)',
        actor: 'Priya Sharma',
        actor_role: 'RECRUITER',
        details: 'Uploaded candidate PDF via Web Portal.',
        badge_color: 'blue'
      },
      {
        id: 'tl-22',
        timestamp: '2026-09-01T03:16:00Z',
        action: 'AI Matching: 🟡 REVIEW REQUIRED (68%)',
        actor: 'Matching Engine v2.4',
        actor_role: 'ADMIN',
        details: 'Evaluated against "Branch Sales Manager - Agency Channel". Has team management experience in banking assets, but lacks pure insurance agency licensing background.',
        badge_color: 'amber'
      }
    ],
    matches: [
      {
        id: 'match-2-1',
        candidate_id: 'can-2',
        job_role_id: 'job-2',
        job_role_name: 'Branch Sales Manager - Agency Channel',
        department: 'Direct Agency Sales',
        overall_score: 68,
        recommendation: 'YELLOW',
        generated_at: '2026-09-01T03:16:00Z',
        model_version: 'Gemini-3.7-Flash-RuleEngine-v2',
        score_breakdown: {
          education: 15,
          max_education: 15,
          experience: 20,
          max_experience: 30,
          mandatory_skills: 15,
          max_mandatory_skills: 25,
          preferred_skills: 10,
          max_preferred_skills: 15,
          industry_experience: 5,
          max_industry_experience: 10,
          location_match: 3,
          max_location_match: 5
        },
        evidence: [
          {
            id: 'ev-21-1',
            requirement_name: 'Agency Leader / Team Building Experience',
            requirement_type: 'MANDATORY',
            candidate_evidence: 'Managed team of 6 loan DSAs at Axis Bank, but not pure insurance agency advisors',
            source_resume_page: 1,
            result: 'PARTIAL',
            explanation: '⚠ Experience is in banking retail asset DSAs rather than 15+ insurance agents.'
          },
          {
            id: 'ev-21-2',
            requirement_name: 'Bachelor\'s Degree or Master\'s (MBA Preferred)',
            requirement_type: 'MANDATORY',
            candidate_evidence: 'MBA Marketing (Christ University, 2021) & BBA (St. Xavier\'s)',
            source_resume_page: 1,
            result: 'MATCH',
            explanation: '✓ Master\'s degree in Marketing fulfills educational criteria.'
          },
          {
            id: 'ev-21-3',
            requirement_name: 'Agent Licensing & Onboarding Knowledge',
            requirement_type: 'MANDATORY',
            candidate_evidence: 'No mention of IRDAI IC-38 or agent onboarding lifecycle',
            source_resume_page: 1,
            result: 'MISSING',
            explanation: '⚠ Candidate will require quick training on insurance agency onboarding regulations.'
          }
        ],
        summary_reason: 'Strong managerial potential and banking sales acumen (MBA + Axis Bank), but lacks direct insurance agency recruitment background. Human recruiter interview recommended to assess adaptability.',
        missing_items: [
          'Direct Insurance Agency (IC-38) advisor recruitment experience',
          'Pure Life Insurance product depth'
        ],
        strengths: [
          'MBA from Christ University',
          'Proven team handling of 6 direct sales associates',
          'Located in Bengaluru'
        ]
      }
    ]
  },
  {
    id: 'can-3',
    candidate_code: 'CAN-2026-083',
    first_name: 'Vikram',
    last_name: 'Malhotra',
    email: 'vikram.malhotra2024@gmail.com',
    phone: '+91 99104 88319',
    location: 'Noida, Uttar Pradesh',
    professional_summary: 'Junior IT support engineer with 1.1 years experience in software helpdesk and hardware troubleshooting. Seeking customer service or insurance operations role.',
    total_experience_months: 13,
    current_job_title: 'Helpdesk Technician',
    current_company: 'TechInfra Solutions',
    notice_period: 'Immediate',
    expected_salary: '₹ 3.2 LPA',
    source: 'Camera Scan',
    status: 'READY_FOR_REVIEW',
    created_by: 'Priya Sharma',
    created_at: '2026-09-01T04:10:00Z',
    updated_at: '2026-09-01T04:15:00Z',
    education: [
      {
        id: 'edu-3-1',
        qualification: 'Diploma in Computer Engineering',
        institution: 'Govt Polytechnic Delhi',
        year: '2023',
        grade: '68%'
      }
    ],
    experience: [
      {
        id: 'exp-3-1',
        company: 'TechInfra Solutions',
        job_title: 'Desktop Support Tech',
        start_date: '2023-08-01',
        end_date: 'Present',
        is_current: true,
        duration_months: 13,
        responsibilities: [
          'Configured laptops and resolved printer/network tickets.'
        ]
      }
    ],
    skills: [
      { id: 'sk-31', skill_name: 'Windows Desktop Troubleshooting', normalized_name: 'DESKTOP SUPPORT', category: 'TECHNICAL' },
      { id: 'sk-32', skill_name: 'Hardware Assembly', normalized_name: 'HARDWARE', category: 'TECHNICAL' },
      { id: 'sk-33', skill_name: 'Microsoft Office Basics', normalized_name: 'MS OFFICE', category: 'TOOL' }
    ],
    certifications: [],
    languages: ['Hindi', 'English (Basic)'],
    resumes: [
      {
        id: 'res-3',
        file_name: 'vikram_malhotra_resume.jpg',
        original_name: 'Vikram_Malhotra_Scanned.jpg',
        mime_type: 'image/jpeg',
        file_size: 420000,
        version: 1,
        is_current: true,
        uploaded_by: 'Priya Sharma',
        uploaded_at: '2026-09-01T04:10:00Z',
        raw_text: `VIKRAM MALHOTRA
Phone: +91 99104 88319 | Noida, UP

OBJECTIVE
Looking for a customer support or back-office job in reputed company.

EXPERIENCE
TechInfra Solutions (Aug 2023 – Present) - Desktop Support Engineer
- Solved Windows 10/11 issues for 80 internal staff.
- Installed MS Office and antivirus.

EDUCATION
Diploma in Computer Engineering - Govt Polytechnic Delhi (2023)

SKILLS
Computer Hardware, Windows OS, LAN Cabling.`
      }
    ],
    timeline: [
      {
        id: 'tl-31',
        timestamp: '2026-09-01T04:10:00Z',
        action: 'Resume Scanned via Mobile Camera',
        actor: 'Priya Sharma',
        actor_role: 'RECRUITER',
        details: 'Scanned 1-page physical resume at open walk-in drive.',
        badge_color: 'blue'
      },
      {
        id: 'tl-32',
        timestamp: '2026-09-01T04:11:00Z',
        action: 'AI Matching: 🔴 REQUIREMENTS NOT MET (38%)',
        actor: 'Matching Engine v2.4',
        actor_role: 'ADMIN',
        details: 'Evaluated against "Customer Service & Policy Operations Specialist". Missing mandatory Bachelor\'s degree and insurance communication background.',
        badge_color: 'red'
      }
    ],
    matches: [
      {
        id: 'match-3-1',
        candidate_id: 'can-3',
        job_role_id: 'job-3',
        job_role_name: 'Customer Service & Policy Operations Specialist',
        department: 'Policyholder Services',
        overall_score: 38,
        recommendation: 'RED',
        generated_at: '2026-09-01T04:11:00Z',
        model_version: 'Gemini-3.7-Flash-RuleEngine-v2',
        score_breakdown: {
          education: 5,
          max_education: 20,
          experience: 12,
          max_experience: 25,
          mandatory_skills: 8,
          max_mandatory_skills: 25,
          preferred_skills: 5,
          max_preferred_skills: 15,
          industry_experience: 0,
          max_industry_experience: 10,
          location_match: 8,
          max_location_match: 5
        },
        evidence: [
          {
            id: 'ev-31-1',
            requirement_name: 'Bachelor\'s Degree',
            requirement_type: 'MANDATORY',
            candidate_evidence: 'Diploma in Computer Engineering (Polytechnic) - No Bachelor\'s degree found',
            source_resume_page: 1,
            result: 'MISSING',
            explanation: '❌ Mandatory Bachelor\'s degree not found.'
          },
          {
            id: 'ev-31-2',
            requirement_name: 'Written & Verbal Communication Skills',
            requirement_type: 'MANDATORY',
            candidate_evidence: 'Candidate has basic hardware/desktop background, no customer grievance/writing track record',
            source_resume_page: 1,
            result: 'MISSING',
            explanation: '❌ Lacks professional written customer correspondence track record.'
          }
        ],
        summary_reason: 'Critical requirements missing: No Bachelor\'s degree and no insurance or customer-facing operations background. Highly recommend rejection or routing to IT internal helpdesk.',
        missing_items: [
          'Mandatory Bachelor\'s Degree',
          'Customer service / grievance handling experience',
          'Insurance domain knowledge'
        ],
        strengths: ['Located in NCR', 'Available immediately']
      }
    ]
  },
  {
    id: 'can-4',
    candidate_code: 'CAN-2026-084',
    first_name: 'Neha',
    last_name: 'Deshmukh',
    email: 'neha.deshmukh91@gmail.com',
    phone: '+91 98920 77154',
    location: 'Pune, Maharashtra',
    professional_summary: 'Accomplished Tele-sales Specialist with 3.8 years in Health and Term Insurance customer acquisition. Top 5% dialer performer with proven conversion rate of 14.2% on digital leads.',
    total_experience_months: 46,
    current_job_title: 'Senior Tele-sales Executive',
    current_company: 'PolicyBazaar Insurance Brokers',
    notice_period: '15 Days',
    expected_salary: '₹ 5.0 LPA',
    source: 'Manual Upload',
    status: 'SHORTLISTED',
    created_by: 'Priya Sharma',
    created_at: '2026-08-30T10:00:00Z',
    updated_at: '2026-08-31T14:30:00Z',
    education: [
      {
        id: 'edu-4-1',
        qualification: 'Bachelor of Business Administration (BBA)',
        institution: 'Symbiosis International University, Pune',
        year: '2020',
        grade: '71%'
      }
    ],
    experience: [
      {
        id: 'exp-4-1',
        company: 'PolicyBazaar Insurance Brokers Pvt Ltd',
        job_title: 'Senior Sales Consultant - Health BU',
        start_date: '2021-01-01',
        end_date: 'Present',
        is_current: true,
        duration_months: 44,
        responsibilities: [
          'Outbound calling on pre-qualified digital health insurance comparison leads.',
          'Consistently closed 35+ policies per month with average ticket size of ₹18,000 premium.'
        ]
      }
    ],
    skills: [
      { id: 'sk-41', skill_name: 'Tele-sales', normalized_name: 'TELESALES', category: 'TECHNICAL', proficiency: 'EXPERT' },
      { id: 'sk-42', skill_name: 'Health Insurance', normalized_name: 'HEALTH INSURANCE', category: 'DOMAIN', proficiency: 'EXPERT' },
      { id: 'sk-43', skill_name: 'Vicidial / Ameyo CRM', normalized_name: 'CALL CENTER SOFTWARE', category: 'TOOL', proficiency: 'ADVANCED' },
      { id: 'sk-44', skill_name: 'Objection Handling', normalized_name: 'SALES PITCH', category: 'TECHNICAL', proficiency: 'EXPERT' }
    ],
    certifications: [
      'POSP (Point of Sales Person) General & Health License'
    ],
    languages: ['English', 'Hindi', 'Marathi'],
    resumes: [
      {
        id: 'res-4',
        file_name: 'neha_deshmukh_telesales.pdf',
        original_name: 'Neha_Deshmukh_CV.pdf',
        mime_type: 'application/pdf',
        file_size: 185000,
        version: 1,
        is_current: true,
        uploaded_by: 'Priya Sharma',
        uploaded_at: '2026-08-30T10:00:00Z',
        raw_text: `NEHA DESHMUKH
Senior Tele-sales Consultant | Pune | +91 98920 77154 | neha.deshmukh91@gmail.com

SUMMARY
High-energy insurance tele-calling professional with 3.8+ years selling comprehensive health insurance, riders, and family floater plans at PolicyBazaar. Top quartile converter with Vicidial and Salesforce CTI expertise.`
      }
    ],
    timeline: [
      {
        id: 'tl-41',
        timestamp: '2026-08-30T10:00:00Z',
        action: 'Resume Uploaded',
        actor: 'Priya Sharma',
        actor_role: 'RECRUITER',
        details: 'Candidate profile uploaded from internal referral.',
        badge_color: 'blue'
      },
      {
        id: 'tl-42',
        timestamp: '2026-08-30T10:02:00Z',
        action: 'AI Match Calculated: 🟢 94% STRONG MATCH',
        actor: 'Matching Engine v2.4',
        actor_role: 'ADMIN',
        details: 'Highest fit for "Tele-Sales Executive - Health & Term Plans". All mandatory & preferred skills met.',
        badge_color: 'green'
      },
      {
        id: 'tl-43',
        timestamp: '2026-08-31T14:30:00Z',
        action: 'Candidate Shortlisted by Recruiter',
        actor: 'Priya Sharma',
        actor_role: 'RECRUITER',
        details: 'Human Decision: SHORTLISTED. Scheduled for Round 1 technical interview on Sep 3rd with Sales Head.',
        badge_color: 'purple'
      }
    ],
    matches: [
      {
        id: 'match-4-1',
        candidate_id: 'can-4',
        job_role_id: 'job-4',
        job_role_name: 'Tele-Sales Executive - Health & Term Plans',
        department: 'Digital Direct Sales',
        overall_score: 94,
        recommendation: 'GREEN',
        generated_at: '2026-08-30T10:02:00Z',
        model_version: 'Gemini-3.7-Flash-RuleEngine-v2',
        score_breakdown: {
          education: 18,
          max_education: 20,
          experience: 30,
          max_experience: 30,
          mandatory_skills: 30,
          max_mandatory_skills: 30,
          preferred_skills: 10,
          max_preferred_skills: 10,
          industry_experience: 10,
          max_industry_experience: 10,
          location_match: 5,
          max_location_match: 5
        },
        evidence: [
          {
            id: 'ev-41-1',
            requirement_name: 'Inside Sales / Tele-calling Experience',
            requirement_type: 'MANDATORY',
            candidate_evidence: '3.8 years at PolicyBazaar Health BU closing 35+ policies/month',
            source_resume_page: 1,
            result: 'MATCH',
            explanation: '✓ Direct inside tele-sales experience in insurance domain.'
          },
          {
            id: 'ev-41-2',
            requirement_name: 'Persuasive Calling & Objection Handling',
            requirement_type: 'MANDATORY',
            candidate_evidence: '14.2% conversion rate on digital leads with POSP certification',
            source_resume_page: 1,
            result: 'MATCH',
            explanation: '✓ Proven phone conversion skills and insurance product explanations.'
          }
        ],
        summary_reason: 'Exceptional match for Tele-sales. High lead conversion rate, 3.8 years in PolicyBazaar, POSP certified, and short 15-day notice period.',
        missing_items: [],
        strengths: ['Immediate product ramp up', 'Top-tier conversion metrics (14.2%)', '15 days notice']
      }
    ]
  }
];

export const SEED_TASKS: RecruiterTask[] = [
  {
    id: 'tsk-1',
    title: 'Review Rahul Sharma (CAN-2026-081)',
    description: 'AI recommended 🟢 91% Strong Match for Senior Relationship Manager. Human decision required.',
    type: 'REVIEW_PENDING',
    candidate_id: 'can-1',
    candidate_name: 'Rahul Sharma',
    priority: 'HIGH',
    due_text: 'Today by 5:00 PM',
    completed: false
  },
  {
    id: 'tsk-2',
    title: 'Evaluate Ananya Sengupta (CAN-2026-082)',
    description: 'AI flagged 🟡 68% Review Required for Branch Sales Manager (has Banking loan team exp, lacks pure agency background).',
    type: 'REVIEW_PENDING',
    candidate_id: 'can-2',
    candidate_name: 'Ananya Sengupta',
    priority: 'MEDIUM',
    due_text: 'Tomorrow at 11:00 AM',
    completed: false
  },
  {
    id: 'tsk-3',
    title: 'Interview Scheduled with Neha Deshmukh',
    description: 'Round 1 technical phone screen with VP Sales at 2:30 PM.',
    type: 'INTERVIEW_SCHEDULED',
    candidate_id: 'can-4',
    candidate_name: 'Neha Deshmukh',
    priority: 'HIGH',
    due_text: 'Sep 3, 2:30 PM',
    completed: false
  },
  {
    id: 'tsk-4',
    title: 'Verify Walk-in Scan Queue',
    description: '3 resumes scanned at the morning recruitment camp waiting for initial recruiter triage.',
    type: 'REVIEW_PENDING',
    priority: 'MEDIUM',
    due_text: 'Today',
    completed: false
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    user_id: 'usr-1',
    user_name: 'Priya Sharma',
    user_role: 'RECRUITER',
    action: 'RESUME_CAMERA_SCAN',
    entity_type: 'RESUME',
    entity_id: 'res-1',
    entity_name: 'Rahul Sharma Resume',
    ip_address: '103.21.14.88',
    metadata: { source: 'Mobile Camera', pages: 2, device: 'OnePlus 11 5G' },
    created_at: '2026-09-01T02:30:10Z'
  },
  {
    id: 'log-2',
    user_id: 'usr-1',
    user_name: 'Priya Sharma',
    user_role: 'RECRUITER',
    action: 'AI_OCR_EXTRACTION_SUCCESS',
    entity_type: 'CANDIDATE',
    entity_id: 'can-1',
    entity_name: 'Rahul Sharma',
    ip_address: '103.21.14.88',
    metadata: { tokens: 1420, model: 'gemini-3.7-flash', duration_ms: 1840 },
    created_at: '2026-09-01T02:30:45Z'
  },
  {
    id: 'log-3',
    user_id: 'usr-1',
    user_name: 'Priya Sharma',
    user_role: 'RECRUITER',
    action: 'AI_ROLE_MATCH_CALCULATED',
    entity_type: 'MATCH',
    entity_id: 'match-1',
    entity_name: 'CAN-2026-081 -> Senior Relationship Manager',
    ip_address: '103.21.14.88',
    metadata: { score: 91, recommendation: 'GREEN' },
    created_at: '2026-09-01T02:31:10Z'
  },
  {
    id: 'log-4',
    user_id: 'usr-1',
    user_name: 'Priya Sharma',
    user_role: 'RECRUITER',
    action: 'CANDIDATE_SHORTLISTED',
    entity_type: 'DECISION',
    entity_id: 'can-4',
    entity_name: 'Neha Deshmukh',
    ip_address: '103.21.14.88',
    metadata: { previous_status: 'HUMAN_REVIEW', new_status: 'SHORTLISTED', notes: 'Scheduled technical round' },
    created_at: '2026-08-31T14:30:00Z'
  }
];

export const SAMPLE_TEST_RESUMES = [
  {
    title: 'Arun Kumar Jaiswal (3-Page Multi-Page Resume - 4 Yrs Bancassurance)',
    roleHint: 'Senior Relationship Manager - Bancassurance',
    text: `--- PAGE 1 OF 3: PROFILE, CONTACT & SUMMARY ---
ARUN KUMAR JAISWAL
Mumbai, Maharashtra, India | Phone: +91 98201 45892 | Email: arun.jaiswal@email.com
LinkedIn: linkedin.com/in/arunkumar-jaiswal | Notice Period: 30 Days | Expected CTC: ₹ 8.5 LPA

EXECUTIVE SUMMARY:
High-performing financial services and Bancassurance professional with 4.2 years of consistent quota achievement in retail life insurance distribution and bancassurance partner management. Proven track record of managing 8+ Axis & HDFC Bank partner branches, achieving 135% of annual Gross Written Premium (GWP) targets. Expertise in ULIPs, traditional savings, retirement planning, high-net-worth client wealth advisory, and branch relationship management.

CORE COMPETENCIES & DOMAIN SKILLS:
• Bancassurance Sales & Branch Banking Channel Management
• Life Insurance Products (ULIPs, Term Plans, Guaranteed Income, Annuities)
• HNI & Wealth Client Relationship Management
• Team Collaboration & Branch Staff Training
• IRDAI Regulatory Compliance & Underwriting Requirements
• Financial Advisory & Portfolio Needs Analysis

--- PAGE 2 OF 3: DETAILED EMPLOYMENT HISTORY & CHANNEL DISTRIBUTION ---
WORK EXPERIENCE:

1. Senior Relationship Manager - Bancassurance
   HDFC Life Insurance Co. Ltd | Mumbai Branch
   Duration: April 2022 – Present (2 Years 4 Months)
   • Assigned to 8 top-tier partner bank branches in Western Suburbs Mumbai.
   • Delivered ₹ 3.8 Crores in Annualized Premium Equivalent (APE) in FY24-25 against target of ₹ 2.8 Crores (135% achievement).
   • Conducted daily joint customer calls with Bank Branch Managers and Relationship Executives.
   • Conducted 24+ training workshops for bank branch staff on new product launches, ULIP market performance, and IRDAI compliance.
   • Spearheaded customer persistence campaign resulting in 88% 13th-month renewal persistence rate.

2. Relationship Executive - Direct & Banca Sales
   ICICI Prudential Life Insurance Co. Ltd | Thane & Mumbai
   Duration: August 2020 – March 2022 (1 Year 8 Months)
   • Managed walk-in customer interactions and mapped branch leads for retail term and savings plans.
   • Onboarded 180+ new policyholders with zero customer grievances or mis-selling complaints.
   • Achieved "Top Rookie Producer" award in Western Region for Q3 2021.

--- PAGE 3 OF 3: EDUCATION, CERTIFICATIONS & LANGUAGES ---
EDUCATION & QUALIFICATIONS:

• Bachelor of Commerce (B.Com) - Financial Accounting & Auditing
  University of Mumbai (R.A. Podar College of Commerce and Economics)
  Graduation Year: 2020 | Grade: First Class with Distinction (74.5%)

• Higher Secondary Certificate (H.S.C. - 12th Commerce)
  Maharashtra State Board of Secondary and Higher Secondary Education
  Year: 2017 | Percentage: 78.2%

PROFESSIONAL CERTIFICATIONS & LICENSES:
• IRDAI IC-38 Certified Life Insurance Specialist (Certificate No: IRDA-2020-94812)
• AMFI Mutual Fund Distributor Certification (ARN-184920)
• NISM Series V-A: Mutual Fund Foundation Certification
• Microsoft Excel for Financial Analysts (Advanced VLOOKUP, Pivot Tables, Dashboards)

LANGUAGES:
• English (Fluent - Professional Working Proficiency)
• Hindi (Native / Fluent)
• Marathi (Conversational Proficiency)`
  },
  {
    title: 'Amitav Banerjee (6 Yrs BFSI & Bancassurance)',
    roleHint: 'Senior Relationship Manager - Bancassurance',
    text: `AMITAV BANERJEE
Kolkata & Mumbai | +91 98301 22940 | amitav.banerjee@gmail.com

SUMMARY
Accomplished Bancassurance leader with 6.2 years at Max Life Insurance and Tata AIA. Mapped across 10 Axis Bank branches, generating ₹4.2 Cr annual premium. Deep mastery of ULIP, retirement, child education savings, and high-sum assured term insurance.

EXPERIENCE
Max Life Insurance Co. – Senior Relationship Manager (2021 – Present)
- Mapped to top Axis Bank branches in South Mumbai & Kolkata.
- Won Chairman's Circle Award for 142% target delivery.
- Trained 45+ Bank Assistant Managers on underwriting rules and customer objection handling.

Tata AIA Life Insurance – Executive Associate (2018 – 2021)
- Managed direct walk-in bank branch leads.

EDUCATION
- B.Com (Honours) – St. Xavier's College, Kolkata (2018) | 78%

CERTIFICATIONS
- IRDAI IC-38 Certified Life Insurance Agent
- AMFI Mutual Fund Distributor (ARN-201839)`
  },
  {
    title: 'Ramesh Patel (Agency Channel Leader - 7 Yrs)',
    roleHint: 'Branch Sales Manager - Agency Channel',
    text: `RAMESH PATEL
Ahmedabad & Bengaluru | +91 98791 40552 | ramesh.patel.sales@gmail.com

PROFESSIONAL SUMMARY
Senior Agency Development Manager with 7.5 years driving agency recruitment and activation at SBI Life Insurance. Successfully recruited, licensed, and mentored 32 active life insurance advisors. Consistent MDRT branch producer.

WORK HISTORY
SBI Life Insurance – Agency Development Manager (2019 – Present)
- Recruited 32 licensed IRDAI advisors, achieving ₹3.1 Cr New Business Premium.
- Conducted regular morning agency motivation sessions and field training.

Bajaj Allianz Life – Sales Officer (2017 – 2019)
- Agency advisor onboarding and exam prep.

EDUCATION
- MBA in Sales & Marketing – Gujarat University (2017)
- B.Com – Gujarat College (2015)

CERTIFICATIONS
- IRDAI Licentiate (III Mumbai)`
  },
  {
    title: 'Pooja Verma (Junior Fresher - Needs Triage)',
    roleHint: 'Customer Service or Tele-Sales',
    text: `POOJA VERMA
Delhi NCR | +91 99581 00213 | pooja.verma.jobs@yahoo.com

CAREER OBJECTIVE
Recent graduate seeking an entry-level position in customer relationship or insurance operations where I can utilize my communication skills.

EDUCATION
- Bachelor of Arts (B.A.) in English – Delhi University (2025) | 68%
- 12th CBSE – Commerce stream (2022) | 75%

SKILLS & PROJECTS
- Fluent English & Hindi Communication
- MS Office (Word, Excel basics, PowerPoint)
- College Event Volunteer & Public Speaking Lead`
  }
];
