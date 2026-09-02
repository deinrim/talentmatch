import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  X, 
  UploadCloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Trash2, 
  Plus, 
  Sparkles, 
  Layers, 
  FlipHorizontal,
  FileCheck2,
  ChevronRight,
  ChevronDown,
  Briefcase,
  RotateCcw,
  Sliders,
  Zap,
  Users,
  Timer,
  Check
} from 'lucide-react';
import { SAMPLE_TEST_RESUMES } from '../initialData';
import { Candidate, JobRole, ProcessingStep } from '../types';

interface ResumeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (candidate: Candidate, isDuplicate: boolean, duplicateCandidate: Candidate | null) => void;
  rescanCandidate?: Candidate | null;
  onBatchSuccess?: (candidates: Candidate[]) => void;
  jobRoles?: JobRole[];
  initialJobRoleId?: string | null;
}

const PIPELINE_STEPS: { id: ProcessingStep; label: string; desc: string }[] = [
  { id: 'UPLOADED', label: 'Multi-Page Document Ingested', desc: 'Secure image buffer and page coordinate framing' },
  { id: 'OCR_PROCESSING', label: 'High-Speed Optical Character Recognition', desc: 'Verbatim text transcription across document pages' },
  { id: 'TEXT_EXTRACTED', label: 'Token & Section Normalization', desc: 'Extracting candidate name, contact, history & degrees' },
  { id: 'AI_ANALYSIS', label: 'Gemini 3.6 Flash Multi-Modal Extraction', desc: 'High-throughput structured candidate profiling' },
  { id: 'STRUCTURED', label: 'Relational Model Validation', desc: 'Normalizing skills, dates, and experience calculations' },
  { id: 'MATCHED', label: 'Job Matching Rubric Engine', desc: 'Scoring against mandatory requirements across active roles' },
  { id: 'READY_FOR_REVIEW', label: 'Human-in-the-Loop Review Ready', desc: 'Transparent match scores, evidence, and missing items generated' },
];

// 10 Sample Resumes for Instant High-Volume Batch Demo
const BATCH_DEMO_ITEMS = [
  {
    fileName: 'Arun_Jaiswal_Senior_RM.pdf',
    rawText: `ARUN JAISWAL\nSenior Relationship Manager - Bancassurance\nEmail: arun.jaiswal@hdfclife.com | Phone: +91 98201 45892 | Mumbai, India\n\nPROFESSIONAL SUMMARY:\nAccomplished financial sales professional with 4 years track record in Bancassurance & Wealth Distribution.\n\nWORK EXPERIENCE:\n1. HDFC Life Insurance (2022 - Present) - Senior Relationship Manager\n- Managing partner bank branch channel and ULIP/Traditional product distribution.\n- Achieved 135% of annual GWP targets.\n2. ICICI Prudential Life (2020 - 2022) - Relationship Manager\n- Direct customer onboarding, financial planning, and portfolio advisory.\n\nEDUCATION:\n- Bachelor of Commerce (B.Com) - University of Mumbai (2020)\n\nSKILLS & CERTS:\n- Bancassurance, Life Insurance, Client Acquisition, Financial Advisory, MS Excel, IRDAI IC-38 Certified.`
  },
  {
    fileName: 'Neha_Sharma_Bancassurance_Lead.pdf',
    rawText: `NEHA SHARMA\nBancassurance Channel Manager\nEmail: neha.sharma@tataaig.com | Phone: +91 97112 34567 | Delhi NCR, India\n\nPROFESSIONAL SUMMARY:\n5 years of experience in Bancassurance tie-ups, bancassurance sales strategy, and team mentoring across PSU bank branches.\n\nEXPERIENCE:\n1. Tata AIG General Insurance (2021 - Present) - Bancassurance Lead\n- Supervised 14 bank branches for retail non-life & health insurance sales.\n2. Max Life Insurance (2019 - 2021) - Bancassurance Executive\n- Partner branch client relationship management.\n\nEDUCATION:\n- MBA Marketing - Amity University (2019)\n\nSKILLS:\n- Bancassurance, General Insurance, Branch Channel Management, Cross-Selling, Relationship Building.`
  },
  {
    fileName: 'Vikram_Patel_FullStack_Engineer.pdf',
    rawText: `VIKRAM PATEL\nSenior Full Stack Software Engineer\nEmail: vikram.patel@devtech.io | Phone: +91 98765 43210 | Bengaluru, India\n\nSUMMARY:\n6+ years designing and scaling web platforms with React, Node.js, TypeScript, PostgreSQL, and AWS.\n\nEXPERIENCE:\n1. CloudScale Solutions (2021 - Present) - Lead Full Stack Engineer\n- Architected microservices with Node.js, TypeScript, Docker, and Kubernetes.\n- Built real-time dashboard in React with Tailwind CSS.\n2. InnoWave Systems (2018 - 2021) - Full Stack Developer\n- Developed RESTful APIs and modern frontend workflows.\n\nEDUCATION:\n- B.Tech in Computer Science - NIT Karnataka (2018)\n\nSKILLS:\n- React, TypeScript, Node.js, Express, PostgreSQL, Docker, AWS, GraphQL, REST APIs.`
  },
  {
    fileName: 'Priya_Nair_Data_Scientist.pdf',
    rawText: `PRIYA NAIR\nLead Data Scientist & ML Engineer\nEmail: priya.nair@ai-analytics.com | Phone: +91 94471 23456 | Hyderabad, India\n\nSUMMARY:\n5 years building predictive models, NLP extraction pipelines, and Python ML systems on GCP.\n\nEXPERIENCE:\n1. CogniTech AI (2021 - Present) - Senior Data Scientist\n- Deployed transformer models and document OCR parsers for fintech clients.\n2. Fractal Analytics (2019 - 2021) - Data Analyst\n- Statistical modeling, customer churn analytics, and Tableau dashboards.\n\nEDUCATION:\n- M.Sc in Data Science - University of Hyderabad (2019)\n\nSKILLS:\n- Python, PyTorch, TensorFlow, Scikit-Learn, SQL, Pandas, NLP, LLMs, GCP Vertex AI.`
  },
  {
    fileName: 'Rahul_Verma_DevOps_Specialist.pdf',
    rawText: `RAHUL VERMA\nDevOps & Cloud Infrastructure Architect\nEmail: rahul.verma@cloudops.net | Phone: +91 98123 67890 | Pune, India\n\nSUMMARY:\n4.5 years implementing CI/CD pipelines, Kubernetes clusters, Terraform IaC, and security hardening on AWS & Azure.\n\nEXPERIENCE:\n1. Zensar Technologies (2021 - Present) - Senior DevOps Engineer\n- Automated zero-downtime deployments using GitHub Actions and ArgoCD.\n2. Persistent Systems (2019 - 2021) - Cloud Support Engineer\n- AWS EC2, S3, IAM, and VPC provisioning.\n\nEDUCATION:\n- B.E. Information Technology - Pune University (2019)\n\nSKILLS:\n- Kubernetes, Docker, Terraform, AWS, Azure, CI/CD, Linux, Shell Scripting, Prometheus, Grafana.`
  },
  {
    fileName: 'Ananya_Deshmukh_Product_Manager.pdf',
    rawText: `ANANYA DESHMUKH\nSenior Product Manager (Fintech & B2B)\nEmail: ananya.deshmukh@finprod.com | Phone: +91 99200 11223 | Mumbai, India\n\nSUMMARY:\n6 years leading product discovery, sprint roadmaps, recruiter workflows, and growth metrics for SaaS & Fintech applications.\n\nEXPERIENCE:\n1. PaySprint Technologies (2022 - Present) - Lead Product Manager\n- Spearheaded enterprise onboarding portal increasing completion rate by 42%.\n2. Cleartrip (2018 - 2022) - Associate PM to PM\n- User research, wireframing, PRD documentation, and A/B testing.\n\nEDUCATION:\n- MBA (Tech) - NMIMS Mumbai (2018)\n\nSKILLS:\n- Product Management, User Research, Agile/Scrum, JIRA, SQL, Wireframing, Go-to-Market Strategy.`
  },
  {
    fileName: 'Siddharth_Mehta_UI_UX_Designer.pdf',
    rawText: `SIDDHARTH MEHTA\nSenior Product Designer (UI/UX)\nEmail: sid.mehta@designstudio.io | Phone: +91 98334 55667 | Bengaluru, India\n\nSUMMARY:\n5+ years crafting accessible, typography-first design systems and complex enterprise dashboards in Figma.\n\nEXPERIENCE:\n1. UrbanMatrix (2021 - Present) - Senior Product Designer\n- Built multi-brand Design System adopted by 40+ engineering teams.\n2. Swiggy (2019 - 2021) - UI/UX Designer\n- Consumer app checkout and partner merchant portal design.\n\nEDUCATION:\n- B.Des - National Institute of Design (NID) (2019)\n\nSKILLS:\n- Figma, Design Systems, Wireframing, Prototyping, User Testing, Tailwind CSS, Accessibility WCAG.`
  },
  {
    fileName: 'Kavita_Rao_HR_Talent_Acquisition.pdf',
    rawText: `KAVITA RAO\nTalent Acquisition Manager\nEmail: kavita.rao@talentfirst.com | Phone: +91 97401 88990 | Chennai, India\n\nSUMMARY:\n7 years full-lifecycle technical and sales recruiting, ATS pipeline management, and campus hiring drives across India.\n\nEXPERIENCE:\n1. TechMahindra (2020 - Present) - Lead Talent Acquisition Specialist\n- Closed 180+ lateral engineering and relationship manager positions per year.\n2. Wipro (2017 - 2020) - Technical Recruiter\n- Sourcing, screening, compensation benchmarking, and onboarding.\n\nEDUCATION:\n- MBA in Human Resources - Madras University (2017)\n\nSKILLS:\n- Talent Acquisition, Candidate Sourcing, Interviewing, ATS Management, Salary Negotiation, Employer Branding.`
  },
  {
    fileName: 'Deepak_Gupta_Financial_Analyst.pdf',
    rawText: `DEEPAK GUPTA\nSenior Financial Analyst (FP&A)\nEmail: deepak.gupta@fincorp.in | Phone: +91 98109 23456 | Gurugram, India\n\nSUMMARY:\n4 years in financial modeling, variance analysis, annual budgeting, and corporate valuation for banking & insurance leaders.\n\nEXPERIENCE:\n1. KPMG India (2022 - Present) - Senior Analyst FP&A\n- Built financial forecasting models for BFSI clients.\n2. Axis Bank (2020 - 2022) - Credit & Risk Analyst\n- Portfolio underwriting and financial health assessments.\n\nEDUCATION:\n- Chartered Financial Analyst (CFA Level 2) & B.Com (Hons) - Delhi University (2020)\n\nSKILLS:\n- Financial Modeling, FP&A, DCF Valuation, Advanced Excel, PowerBI, SQL, Risk Analysis.`
  },
  {
    fileName: 'Rohan_Kulkarni_Bancassurance_Executive.pdf',
    rawText: `ROHAN KULKARNI\nBancassurance Sales Executive\nEmail: rohan.kulkarni@sbilife.co.in | Phone: +91 98670 12345 | Pune, India\n\nSUMMARY:\n3 years driving bancassurance branch walk-in insurance sales, customer relationship retention, and KYC verification.\n\nEXPERIENCE:\n1. SBI Life Insurance (2021 - Present) - Bancassurance Executive\n- Partner bank branch insurance sales and renewal retention.\n2. Bajaj Allianz Life (2020 - 2021) - Sales Trainee\n- Retail policy distribution and lead calling.\n\nEDUCATION:\n- BBA - Symbiosis International University (2020)\n\nSKILLS:\n- Bancassurance, Direct Sales, Customer Service, Life Insurance, KYC Verification, IC-38 Certified.`
  }
];

export const ResumeScannerModal: React.FC<ResumeScannerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  rescanCandidate = null,
  onBatchSuccess,
  jobRoles = [],
  initialJobRoleId = null
}) => {
  const [mode, setMode] = useState<'camera' | 'upload' | 'batch' | 'sample'>('camera');
  const [selectedJobRoleId, setSelectedJobRoleId] = useState<string | null>(initialJobRoleId || null);
  const [completedScanData, setCompletedScanData] = useState<{
    candidate: Candidate;
    isDuplicate: boolean;
    duplicateCandidate: Candidate | null;
  } | null>(null);
  const [targetPagesCount, setTargetPagesCount] = useState<number>(3);
  const [capturedPages, setCapturedPages] = useState<string[]>([]);
  const [activePageToScan, setActivePageToScan] = useState<number>(1);
  
  // Camera State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isMirrored, setIsMirrored] = useState(false);
  const [filterMode, setFilterMode] = useState<'normal' | 'contrast' | 'bw'>('contrast');
  const [shutterFlash, setShutterFlash] = useState(false);
  const [selectedPreviewPage, setSelectedPreviewPage] = useState<number | null>(null);

  // Raw text & file name
  const [rawText, setRawText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState(
    rescanCandidate ? `Rescan_${rescanCandidate.first_name}_${rescanCandidate.last_name}_Resume.pdf` : 'Scanned_Resume_3Pages.pdf'
  );
  
  // Pipeline Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Batch Processing State
  const [batchItems, setBatchItems] = useState<Array<{ fileName: string; rawText: string; images?: string[] }>>([]);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ total: number; done: number }>({ total: 0, done: 0 });
  const [batchCompleted, setBatchCompleted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const multiFileInputRef = useRef<HTMLInputElement | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement | null>(null);
  const singleSlotInputRef = useRef<HTMLInputElement | null>(null);
  const [activeUploadSlot, setActiveUploadSlot] = useState<number>(0);

  // Pre-load existing pages if rescanning a candidate
  useEffect(() => {
    if (isOpen) {
      if (rescanCandidate && rescanCandidate.resumes?.[0]?.pages?.length) {
        setCapturedPages(rescanCandidate.resumes[0].pages);
        setUploadedFileName(`Rescan_${rescanCandidate.first_name}_${rescanCandidate.last_name}.pdf`);
        setTargetPagesCount(Math.max(3, rescanCandidate.resumes[0].pages.length));
        setActivePageToScan(rescanCandidate.resumes[0].pages.length + 1);
      } else {
        setCapturedPages([]);
        setActivePageToScan(1);
        setTargetPagesCount(3);
      }
      setProcessingError(null);
      setElapsedSeconds(0);
      setBatchCompleted(false);
      setCompletedScanData(null);
    }
  }, [isOpen, rescanCandidate, initialJobRoleId]);

  // Manage camera lifecycle
  useEffect(() => {
    if (isOpen && mode === 'camera' && !isProcessing && !batchProcessing) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, mode, facingMode, isProcessing, batchProcessing]);

  // High-Speed Image Downscaler (< 80KB per page for rapid AI multimodal transmission)
  const compressImage = (dataUrl: string, maxDim = 960, quality = 0.78): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by this browser/device.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera initiation failed:', err);
      setCameraError(err?.message || 'Unable to access camera. Please use file upload.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const toggleCameraFacing = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 180);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Scale frame to optimal dimensions (< 960px for instant OCR)
    let w = video.videoWidth || 960;
    let h = video.videoHeight || 720;
    const maxDim = 960;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (filterMode === 'contrast') {
        ctx.filter = 'contrast(1.4) brightness(1.05) saturate(1.1)';
      } else if (filterMode === 'bw') {
        ctx.filter = 'grayscale(1) contrast(1.6) brightness(1.1)';
      } else {
        ctx.filter = 'none';
      }

      if (isMirrored) {
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      } else {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.80);
      
      const newPages = [...capturedPages, dataUrl];
      setCapturedPages(newPages);
      setActivePageToScan(newPages.length + 1);
    }
  };

  const rotatePage = (index: number) => {
    const pageSrc = capturedPages[index];
    if (!pageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((90 * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        const rotatedData = canvas.toDataURL('image/jpeg', 0.84);
        setCapturedPages(prev => {
          const copy = [...prev];
          copy[index] = rotatedData;
          return copy;
        });
      }
    };
    img.src = pageSrc;
  };

  const removePage = (index: number) => {
    const updated = capturedPages.filter((_, i) => i !== index);
    setCapturedPages(updated);
    setActivePageToScan(updated.length + 1);
  };

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const filesArray: File[] = Array.from(fileList);
    setUploadedFileName(filesArray.length > 1 ? `${filesArray.length}_Pages_Resume.pdf` : filesArray[0].name);

    const imageFiles = filesArray.filter(f => f.type.startsWith('image/'));
    const textFiles = filesArray.filter(f => !f.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      const readPromises = imageFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const rawBase64 = (event.target?.result as string) || '';
            const optimized = await compressImage(rawBase64);
            resolve(optimized);
          };
          reader.readAsDataURL(file);
        });
      });

      const compressedImages = await Promise.all(readPromises);
      const valid = compressedImages.filter(Boolean);
      setCapturedPages(prev => [...prev, ...valid]);
      setTargetPagesCount(Math.max(3, capturedPages.length + valid.length));
      setActivePageToScan(capturedPages.length + valid.length + 1);
    }

    if (textFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setRawText(content || '');
      };
      reader.readAsText(textFiles[0]);
    }
  };

  const handleSingleSlotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const optimized = await compressImage(base64);
        setCapturedPages(prev => {
          const updated = [...prev];
          if (activeUploadSlot < updated.length) {
            updated[activeUploadSlot] = optimized;
          } else {
            updated.push(optimized);
          }
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const loadSampleResume = (sample: typeof SAMPLE_TEST_RESUMES[0]) => {
    setRawText(sample.text);
    setUploadedFileName(`${sample.title.split(' ')[0]}_3Page_Resume.pdf`);
    setCapturedPages([]);
    setTargetPagesCount(3);
    setMode('sample');
  };

  // Run the full AI OCR and Matching Pipeline with swift non-blocking animation
  const runPipeline = async () => {
    if (capturedPages.length === 0 && !rawText.trim()) {
      alert('Please capture or upload at least one page of the resume.');
      return;
    }

    stopCamera();
    setIsProcessing(true);
    setCurrentStepIndex(0);
    setProcessingError(null);
    setElapsedSeconds(0);

    // Dynamic timer
    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      setElapsedSeconds(Number(((Date.now() - startTime) / 1000).toFixed(1)));
    }, 100);

    // Fast progress simulator while network request runs
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 220);

    try {
      const response = await fetch('/api/candidates/process-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: rescanCandidate?.id,
          images: capturedPages,
          rawText: rawText,
          fileName: uploadedFileName,
          source: capturedPages.length > 0 ? 'Camera Scan' : 'Manual Upload',
          targetJobRoleId: selectedJobRoleId
        }),
      });

      clearInterval(stepInterval);
      clearInterval(timerInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to process multi-page resume.');
      }

      const data = await response.json();
      
      // Instantly sweep through remaining steps to finish
      setCurrentStepIndex(PIPELINE_STEPS.length - 1);
      setCompletedScanData({
        candidate: data.candidate,
        isDuplicate: data.isDuplicate,
        duplicateCandidate: data.duplicateCandidate
      });

      // Quick visual confirmation before transitioning
      await new Promise(r => setTimeout(r, 450));

      setIsProcessing(false);
      onSuccess(data.candidate, data.isDuplicate, data.duplicateCandidate);
      onClose();

    } catch (err: any) {
      clearInterval(stepInterval);
      clearInterval(timerInterval);
      console.error('Pipeline error:', err);
      setProcessingError(err?.message || 'An error occurred during resume OCR parsing.');
      setIsProcessing(false);
    }
  };

  // Run High-Throughput Batch Resume Processing (for 10 to 1000 resumes)
  const runBatchProcessing = async (itemsToProcess: Array<{ fileName: string; rawText: string; images?: string[] }>) => {
    if (itemsToProcess.length === 0) return;
    
    stopCamera();
    setBatchProcessing(true);
    setBatchCompleted(false);
    setBatchProgress({ total: itemsToProcess.length, done: 0 });
    setProcessingError(null);

    try {
      const progressTimer = setInterval(() => {
        setBatchProgress(prev => {
          if (prev.done < prev.total - 1) {
            return { ...prev, done: prev.done + 1 };
          }
          return prev;
        });
      }, 350);

      const response = await fetch('/api/candidates/process-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: itemsToProcess,
          targetJobRoleId: selectedJobRoleId
        })
      });

      clearInterval(progressTimer);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed batch resume processing.');
      }

      const data = await response.json();
      setBatchProgress({ total: itemsToProcess.length, done: itemsToProcess.length });
      setBatchCompleted(true);
      setBatchProcessing(false);

      if (onBatchSuccess && data.candidates) {
        onBatchSuccess(data.candidates);
      } else if (data.candidates && data.candidates[0]) {
        onSuccess(data.candidates[0], false, null);
      }
    } catch (err: any) {
      console.error('Batch scan error:', err);
      setProcessingError(err?.message || 'Failed batch resume parsing.');
      setBatchProcessing(false);
    }
  };

  const handleBatchFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const filesArray: File[] = Array.from(fileList);
    const parsedItems: Array<{ fileName: string; rawText: string }> = [];

    for (const file of filesArray) {
      const text = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve((ev.target?.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsText(file);
      });
      parsedItems.push({
        fileName: file.name,
        rawText: text || `Uploaded Resume: ${file.name}`
      });
    }

    setBatchItems(parsedItems);
    runBatchProcessing(parsedItems);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Hidden Canvas for High-Resolution Frame Rendering */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  {rescanCandidate ? `Re-Scan Resume: ${rescanCandidate.first_name} ${rescanCandidate.last_name}` : 'High-Speed Resume Scanner & OCR'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  {mode === 'batch' ? '⚡ High-Volume Batch' : `${targetPagesCount} Pages Mode`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Real-time Gemini OCR extraction and automated candidate rubric matching
              </p>
            </div>
          </div>
          {!isProcessing && !batchProcessing && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          
          {/* Active Processing Flow Visualizer */}
          {completedScanData ? (
            <div className="py-8 px-4 text-center animate-in fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg ring-8 ring-emerald-50">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Resume Scanning & Match Complete!
              </h4>
              <p className="text-sm font-semibold text-emerald-700 mt-1">
                {completedScanData.candidate.first_name} {completedScanData.candidate.last_name} ({completedScanData.candidate.candidate_code})
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 border border-slate-200">
                <span>Evaluated For:</span>
                <span className="text-indigo-600 font-bold">{completedScanData.candidate.top_match?.job_role_name || 'Role'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {completedScanData.candidate.top_match?.overall_score || 0}% Fit
                </span>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    onSuccess(completedScanData.candidate, completedScanData.isDuplicate, completedScanData.duplicateCandidate);
                    onClose();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 cursor-pointer active:scale-95 transition-all"
                >
                  <span>Open Candidate Profile Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            <div className="py-5 px-2 text-center animate-in fade-in">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Processing {capturedPages.length > 0 ? `${capturedPages.length}-Page Resume` : 'Resume Document'}
              </h4>
              <div className="flex items-center justify-center space-x-2 text-xs text-indigo-600 font-semibold mt-1 mb-5">
                <Timer className="w-3.5 h-3.5" />
                <span>Elapsed: {elapsedSeconds}s • High-Throughput Engine</span>
              </div>

              {/* Step-by-Step Flowchart */}
              <div className="max-w-md mx-auto space-y-1.5 text-left">
                {PIPELINE_STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div 
                      key={step.id}
                      className={`flex items-start space-x-3 p-2.5 rounded-xl border transition-all ${
                        isCurrent 
                          ? 'bg-indigo-50/90 border-indigo-300 shadow-xs ring-1 ring-indigo-200' 
                          : isDone 
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-700' 
                          : 'bg-slate-50/50 border-slate-100 opacity-40'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isCurrent ? 'text-indigo-900' : isDone ? 'text-emerald-900' : 'text-slate-500'}`}>
                            {step.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-semibold text-indigo-600 animate-pulse">Running...</span>
                          )}
                          {isDone && (
                            <span className="text-[10px] font-semibold text-emerald-600">Complete ✓</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : batchProcessing ? (
            /* Batch Processing Live Progress Screen */
            <div className="py-8 px-4 text-center animate-in fade-in">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg animate-pulse">
                <Zap className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Bulk Scanning {batchProgress.total} Resumes
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Ingesting candidates, running OCR, extracting skills & scoring job matching rubrics in parallel.
              </p>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 mb-3 border border-slate-200">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.round((batchProgress.done / Math.max(1, batchProgress.total)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between max-w-md mx-auto text-xs font-bold text-slate-700">
                <span>{batchProgress.done} of {batchProgress.total} Processed</span>
                <span className="text-indigo-600">{Math.round((batchProgress.done / Math.max(1, batchProgress.total)) * 100)}%</span>
              </div>
            </div>
          ) : batchCompleted ? (
            /* Batch Completion Screen */
            <div className="py-8 px-4 text-center animate-in fade-in">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Batch Scanning Complete!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 mb-6">
                Successfully processed {batchProgress.total} resumes. All candidate profiles, extracted skills, and rubric match scores have been added to the Candidate Database.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                View Candidates in Review Queue
              </button>
            </div>
          ) : (
            <div>
              
              {/* Error Banner */}
              {processingError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-red-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">OCR Extraction Error</p>
                    <p className="mt-0.5 text-red-700">{processingError}</p>
                  </div>
                  <button
                    onClick={runPipeline}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Target Job Role / Requisition Selector */}
              <div className="mb-4 bg-linear-to-r from-slate-50 to-indigo-50/50 p-3 rounded-2xl border border-indigo-100 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="target-job-role-select" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Target Requisition / Post:</span>
                  </label>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/90 px-2 py-0.5 rounded-full border border-indigo-200">
                    {selectedJobRoleId ? 'Designated Role Scoring' : 'Auto-Match Across All Roles'}
                  </span>
                </div>
                
                <div className="relative">
                  <select
                    id="target-job-role-select"
                    value={selectedJobRoleId || ''}
                    onChange={(e) => setSelectedJobRoleId(e.target.value ? e.target.value : null)}
                    className="w-full bg-white border border-slate-300 hover:border-indigo-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 transition-all cursor-pointer appearance-none pr-8"
                  >
                    <option value="">🌐 Auto-Match (AI Discovers Best Fit Across All Active Requisitions)</option>
                    {jobRoles.filter(jr => jr.is_active).map(role => (
                      <option key={role.id} value={role.id}>
                        💼 {role.role_name} • {role.department} ({role.min_experience_years}-{role.max_experience_years} Yrs)
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Selected Role Snapshot */}
                {selectedJobRoleId && (
                  (() => {
                    const role = jobRoles.find(r => r.id === selectedJobRoleId);
                    if (!role) return null;
                    return (
                      <div className="mt-2 pt-2 border-t border-indigo-100/60 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                        <span className="font-bold text-slate-700">Scoring against:</span>
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 font-medium">
                          {role.min_experience_years}-{role.max_experience_years} Yrs Experience
                        </span>
                        {role.requirements.filter(r => r.mandatory).slice(0, 3).map((req, rIdx) => (
                          <span key={rIdx} className="bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 text-indigo-700 font-medium">
                            ✓ {req.requirement_name}
                          </span>
                        ))}
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-4">
                <button
                  id="tab-camera-mode"
                  onClick={() => { setMode('camera'); startCamera(); }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                    mode === 'camera' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Camera</span>
                  <span className="sm:hidden">Scan</span>
                </button>
                <button
                  id="tab-upload-mode"
                  onClick={() => { setMode('upload'); stopCamera(); }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                    mode === 'upload' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Files</span>
                </button>
                <button
                  id="tab-batch-mode"
                  onClick={() => { setMode('batch'); stopCamera(); }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                    mode === 'batch' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>⚡ Batch (10-1000)</span>
                </button>
                <button
                  id="tab-sample-mode"
                  onClick={() => { setMode('sample'); stopCamera(); }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                    mode === 'sample' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Samples</span>
                </button>
              </div>

              {/* MODE: BATCH PROCESSING (10 to 1000 Resumes) */}
              {mode === 'batch' ? (
                <div className="space-y-4">
                  <div className="bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-4 text-left">
                    <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm mb-1">
                      <Zap className="w-4 h-4 text-indigo-600" />
                      <span>High-Throughput Batch Resume Ingestion</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Upload dozens or hundreds of resume documents at once. The system will concurrently extract profiles, transcribe multi-page contents, calculate job rubric matches, and populate your candidate database.
                    </p>
                  </div>

                  {/* Batch Upload Dropzone */}
                  <input
                    type="file"
                    ref={batchFileInputRef}
                    onChange={handleBatchFilesUpload}
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                    className="hidden"
                  />

                  <div 
                    onClick={() => batchFileInputRef.current?.click()}
                    className="border-2 border-dashed border-indigo-300 hover:border-indigo-600 bg-white hover:bg-indigo-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      Drop 10, 50, 100+ Resumes Here or Click to Browse
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Supports multi-file selection of PDF, PNG, JPG, or TXT documents
                    </p>
                  </div>

                  {/* Instant 10-Resume Demo Button */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => runBatchProcessing(BATCH_DEMO_ITEMS)}
                      className="w-full py-3 px-4 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl text-xs font-bold shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-98 transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      <span>⚡ Run 10-Candidate Turbo Batch Test (Instant Recruiter Demo)</span>
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-1.5">
                      Instantly parses 10 diverse candidate profiles (Sales RM, Full-Stack, Data Science, DevOps, PM, etc.) in ~2.5 seconds.
                    </p>
                  </div>
                </div>
              ) : (
                /* SINGLE / MULTI-PAGE DOCUMENT SCANNER */
                <div>
                  {/* Multi-Page Progress & Page Target Selector */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center space-x-1.5">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-800">
                          Document Page Target:
                        </span>
                      </div>
                      
                      {/* Target Page Buttons */}
                      <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                        {[1, 2, 3, 4].map((cnt) => (
                          <button
                            key={cnt}
                            type="button"
                            onClick={() => setTargetPagesCount(cnt)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                              targetPagesCount === cnt
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {cnt} {cnt === 1 ? 'Page' : 'Pages'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step-by-Step Page Status Tabs */}
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: targetPagesCount }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isCaptured = capturedPages[idx] !== undefined;
                        const isCurrent = activePageToScan === pageNum;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActivePageToScan(pageNum)}
                            className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                              isCaptured
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                : isCurrent
                                ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200 text-indigo-950'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider">
                                Page {pageNum}
                              </p>
                              <p className="text-[11px] font-semibold truncate">
                                {isCaptured ? 'Captured ✓' : isCurrent ? 'Active Frame' : 'Pending'}
                              </p>
                            </div>
                            {isCaptured ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <div className={`w-3.5 h-3.5 rounded-full border ${isCurrent ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* MODE 1: LIVE CAMERA VIEWFINDER */}
                  {mode === 'camera' && (
                    <div className="space-y-3">
                      <div className="relative aspect-4/3 w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-inner flex items-center justify-center">
                        
                        {/* Live Video Stream */}
                        <video
                          ref={videoRef}
                          playsInline
                          muted
                          autoPlay
                          className={`w-full h-full object-cover transition-all ${
                            isMirrored ? 'scale-x-[-1]' : ''
                          } ${
                            filterMode === 'contrast' ? 'filter contrast-125 brightness-105 saturate-110' : filterMode === 'bw' ? 'filter grayscale contrast-150 brightness-110' : ''
                          }`}
                        />

                        {/* Flash feedback */}
                        {shutterFlash && (
                          <div className="absolute inset-0 bg-white animate-in fade-in duration-75" />
                        )}

                        {/* Scanner Document Framing Overlay */}
                        <div className="absolute inset-4 sm:inset-6 border-2 border-dashed border-indigo-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                          <div className="flex justify-between">
                            <div className="w-5 h-5 border-t-4 border-l-4 border-indigo-400 -mt-1 -ml-1 rounded-tl-lg" />
                            <div className="w-5 h-5 border-t-4 border-r-4 border-indigo-400 -mt-1 -mr-1 rounded-tr-lg" />
                          </div>

                          <div className="text-center">
                            <span className="px-3 py-1 bg-slate-900/85 text-white text-[11px] font-bold rounded-full backdrop-blur-xs border border-white/20 shadow-md">
                              Position Page {activePageToScan} of {targetPagesCount} inside frame
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <div className="w-5 h-5 border-b-4 border-l-4 border-indigo-400 -mb-1 -ml-1 rounded-bl-lg" />
                            <div className="w-5 h-5 border-b-4 border-r-4 border-indigo-400 -mb-1 -mr-1 rounded-br-lg" />
                          </div>
                        </div>

                        {/* Top camera controls */}
                        <div className="absolute top-2 right-2 flex items-center space-x-1.5 z-10">
                          {/* Text Un-mirror toggle */}
                          <button
                            type="button"
                            onClick={() => setIsMirrored(!isMirrored)}
                            className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer text-xs flex items-center space-x-1 ${
                              isMirrored ? 'bg-indigo-600 text-white font-bold shadow-xs ring-2 ring-white/50' : 'bg-slate-900/70 text-white hover:bg-slate-800'
                            }`}
                            title="Un-Mirror / Flip Camera Text (Useful for webcams)"
                          >
                            <FlipHorizontal className="w-3.5 h-3.5" />
                            <span className="text-[10px] hidden sm:inline">{isMirrored ? 'Mirrored ✓' : 'Flip Text'}</span>
                          </button>

                          {/* OCR Filter presets */}
                          <button
                            type="button"
                            onClick={() => setFilterMode(prev => prev === 'normal' ? 'contrast' : prev === 'contrast' ? 'bw' : 'normal')}
                            className={`p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer text-xs flex items-center space-x-1 ${
                              filterMode !== 'normal' ? 'bg-amber-500 text-white font-bold' : 'bg-slate-900/70 text-white hover:bg-slate-800'
                            }`}
                            title="Boost OCR Text Contrast for Clear Reading"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span className="text-[10px] hidden sm:inline">
                              {filterMode === 'normal' ? 'Normal' : filterMode === 'contrast' ? 'High Contrast' : 'B&W Sharp'}
                            </span>
                          </button>

                          {/* Front/Back Camera toggle */}
                          <button
                            type="button"
                            onClick={toggleCameraFacing}
                            className="p-2 rounded-xl bg-slate-900/70 text-white hover:bg-slate-800 backdrop-blur-md transition-colors cursor-pointer"
                            title="Switch Camera (Front / Rear)"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Error state if camera blocked */}
                        {cameraError && (
                          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-4 text-center">
                            <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
                            <p className="text-white text-xs font-bold">{cameraError}</p>
                            <button
                              type="button"
                              onClick={startCamera}
                              className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                            >
                              Retry Camera
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Snap Button */}
                      <div className="flex items-center justify-center">
                        <button
                          id="capture-page-btn"
                          type="button"
                          onClick={capturePhoto}
                          disabled={!cameraActive}
                          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all cursor-pointer text-sm"
                        >
                          <Camera className="w-5 h-5" />
                          <span>
                            {capturedPages[activePageToScan - 1] 
                              ? `Re-Capture Page ${activePageToScan}` 
                              : `Snap Page ${activePageToScan} (${capturedPages.length}/${targetPagesCount})`}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MODE 2: MULTI-FILE UPLOAD */}
                  {mode === 'upload' && (
                    <div className="space-y-4">
                      
                      <input
                        type="file"
                        ref={multiFileInputRef}
                        onChange={handleMultipleFilesUpload}
                        multiple
                        accept="image/*,.pdf,.txt,.doc,.docx"
                        className="hidden"
                      />
                      <input
                        type="file"
                        ref={singleSlotInputRef}
                        onChange={handleSingleSlotUpload}
                        accept="image/*,.pdf"
                        className="hidden"
                      />

                      <div 
                        onClick={() => multiFileInputRef.current?.click()}
                        className="border-2 border-dashed border-indigo-300 hover:border-indigo-600 bg-indigo-50/30 rounded-2xl p-5 text-center cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 mx-auto mb-2 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                          Upload Multi-Page Resume Files (Page 1, 2, 3)
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Select all page images or upload a multi-page PDF document
                        </p>
                      </div>

                      {/* Dedicated Page Upload Slots Grid */}
                      <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50">
                        <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                          <span>Document Page Slots ({targetPagesCount} Target Pages)</span>
                          <span className="text-[11px] text-slate-500 font-normal">Click slot to upload specific page</span>
                        </h4>

                        <div className="grid grid-cols-3 gap-2.5">
                          {Array.from({ length: targetPagesCount }).map((_, slotIdx) => {
                            const pageImage = capturedPages[slotIdx];
                            return (
                              <div
                                key={slotIdx}
                                onClick={() => {
                                  setActiveUploadSlot(slotIdx);
                                  singleSlotInputRef.current?.click();
                                }}
                                className={`relative aspect-3/4 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${
                                  pageImage
                                    ? 'border-indigo-500 bg-slate-900 shadow-xs'
                                    : 'border-dashed border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50'
                                }`}
                              >
                                {pageImage ? (
                                  <>
                                    <img src={pageImage} alt={`Page ${slotIdx + 1}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                      Replace Page {slotIdx + 1}
                                    </div>
                                    <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                      Page {slotIdx + 1}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removePage(slotIdx);
                                      }}
                                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </>
                                ) : (
                                  <div className="p-2 text-center text-slate-400 hover:text-indigo-600">
                                    <Plus className="w-5 h-5 mx-auto mb-1" />
                                    <p className="text-[11px] font-bold">Page {slotIdx + 1}</p>
                                    <p className="text-[9px] text-slate-400">Click to upload</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick Paste Raw Text */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Or Paste OCR / Resume Raw Text Directly:
                        </label>
                        <textarea
                          rows={3}
                          value={rawText}
                          onChange={(e) => setRawText(e.target.value)}
                          placeholder="Paste resume text or notes here..."
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono bg-white"
                        />
                      </div>

                    </div>
                  )}

                  {/* MODE 3: SAMPLE RESUMES */}
                  {mode === 'sample' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 font-medium">
                        Test the multi-page OCR & AI Matching pipeline immediately with realistic sample candidate resumes:
                      </p>
                      <div className="space-y-2">
                        {SAMPLE_TEST_RESUMES.map((sample, idx) => (
                          <div
                            key={idx}
                            onClick={() => loadSampleResume(sample)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              rawText === sample.text 
                                ? 'bg-indigo-50 border-indigo-400 shadow-xs' 
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                P.3
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-bold text-slate-900 truncate">{sample.title}</p>
                                <span className="text-[10px] font-semibold text-indigo-600">
                                  Target Fit: {sample.roleHint} • 3 Pages
                                </span>
                              </div>
                            </div>
                            {rawText === sample.text ? (
                              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Multi-Page Scanned Thumbnails Tray */}
                  {capturedPages.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" />
                          Captured Document Pages ({capturedPages.length} of {targetPagesCount})
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {capturedPages.length >= targetPagesCount ? 'Ready to process' : `Add ${targetPagesCount - capturedPages.length} more pages`}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {capturedPages.map((page, idx) => (
                          <div 
                            key={idx} 
                            className="relative group shrink-0 w-24 h-32 rounded-xl overflow-hidden border-2 border-indigo-300 shadow-xs bg-slate-900 cursor-pointer"
                            onClick={() => setSelectedPreviewPage(idx)}
                          >
                            <img src={page} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                              Page {idx + 1}
                            </span>
                            
                            <div className="absolute top-1 right-1 flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  rotatePage(idx);
                                }}
                                className="p-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-md transition-colors cursor-pointer"
                                title="Rotate 90°"
                              >
                                <RotateCcw className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePage(idx);
                                }}
                                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer"
                                title="Delete Page"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Add Next Page Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (mode === 'camera') {
                              capturePhoto();
                            } else {
                              singleSlotInputRef.current?.click();
                            }
                          }}
                          className="shrink-0 w-24 h-32 rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-600 bg-indigo-50/50 flex flex-col items-center justify-center text-indigo-600 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-5 h-5 mb-1" />
                          <span>Add Page {capturedPages.length + 1}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Selected Page Full Preview Modal */}
        {selectedPreviewPage !== null && capturedPages[selectedPreviewPage] && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                <span className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Inspecting Page {selectedPreviewPage + 1} of {capturedPages.length}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => rotatePage(selectedPreviewPage)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Rotate 90 Degrees"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rotate 90°</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewPage(null)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-slate-950 flex-1 overflow-auto flex items-center justify-center min-h-[320px]">
                <img
                  src={capturedPages[selectedPreviewPage]}
                  alt={`Page ${selectedPreviewPage + 1}`}
                  className="max-h-[70vh] object-contain rounded-lg shadow-lg"
                />
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    removePage(selectedPreviewPage);
                    setSelectedPreviewPage(null);
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete this page</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewPage(null)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        {!isProcessing && !batchProcessing && !batchCompleted && mode !== 'batch' && (
          <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            
            <button
              id="start-process-resume-btn"
              onClick={runPipeline}
              disabled={capturedPages.length === 0 && !rawText.trim()}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {capturedPages.length > 0
                  ? `Process ${capturedPages.length} Pages (High-Speed OCR)`
                  : 'Process Resume (High-Speed OCR)'}
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
