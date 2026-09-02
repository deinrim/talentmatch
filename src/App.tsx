import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ResumeScannerModal } from './components/ResumeScannerModal';
import { HumanDecisionModal } from './components/HumanDecisionModal';
import { AiJobDescriptionAssistantModal } from './components/AiJobDescriptionAssistantModal';
import { DuplicateMergeModal } from './components/DuplicateMergeModal';
import { EditCandidateModal } from './components/EditCandidateModal';
import { EditJobRoleModal } from './components/EditJobRoleModal';
import { EditTaskModal } from './components/EditTaskModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';

import { DashboardView } from './views/DashboardView';
import { ReviewQueueView } from './views/ReviewQueueView';
import { CandidatesListView } from './views/CandidatesListView';
import { CandidateDetailView } from './views/CandidateDetailView';
import { JobRolesView } from './views/JobRolesView';
import { TasksView } from './views/TasksView';
import { ReportsView } from './views/ReportsView';
import { AuditLogsView } from './views/AuditLogsView';
import { MoreMobileView } from './views/MoreMobileView';

import { Candidate, JobRole, User, RecruiterTask, AuditLog } from './types';
import { 
  SEED_USERS, 
  SEED_JOB_ROLES, 
  SEED_CANDIDATES, 
  SEED_TASKS, 
  SEED_AUDIT_LOGS 
} from './initialData';

export function App() {
  // Application Data State
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]);
  const [availableUsers, setAvailableUsers] = useState<User[]>(SEED_USERS);
  const [candidates, setCandidates] = useState<Candidate[]>(SEED_CANDIDATES);
  const [jobRoles, setJobRoles] = useState<JobRole[]>(SEED_JOB_ROLES);
  const [tasks, setTasks] = useState<RecruiterTask[]>(SEED_TASKS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);

  // Navigation State
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Modals State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [rescanCandidate, setRescanCandidate] = useState<Candidate | null>(null);
  const [scannerInitialRoleId, setScannerInitialRoleId] = useState<string | null>(null);
  const [decisionCandidate, setDecisionCandidate] = useState<Candidate | null>(null);
  const [isAiJdModalOpen, setIsAiJdModalOpen] = useState(false);
  const [duplicatePair, setDuplicatePair] = useState<{ candidateA: Candidate; candidateB: Candidate } | null>(null);

  // Edit Modals State
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isEditCandidateOpen, setIsEditCandidateOpen] = useState(false);

  const [editingJobRole, setEditingJobRole] = useState<JobRole | null>(null);
  const [isEditJobRoleOpen, setIsEditJobRoleOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<RecruiterTask | null>(null);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);

  // Confirmation Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'candidate' | 'job' | 'task';
    id: string;
    title: string;
    subtitle?: string;
  } | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Load from API with fallback to seeds
  const fetchData = async () => {
    try {
      const [candRes, jobRes, taskRes, logRes, sessionRes] = await Promise.allSettled([
        fetch('/api/candidates').then(r => r.json()),
        fetch('/api/jobs').then(r => r.json()),
        fetch('/api/tasks').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json()),
        fetch('/api/session').then(r => r.json()),
      ]);

      if (candRes.status === 'fulfilled' && Array.isArray(candRes.value)) {
        setCandidates(candRes.value);
      }
      if (jobRes.status === 'fulfilled' && Array.isArray(jobRes.value)) {
        setJobRoles(jobRes.value);
      }
      if (taskRes.status === 'fulfilled' && Array.isArray(taskRes.value)) {
        setTasks(taskRes.value);
      }
      if (logRes.status === 'fulfilled' && Array.isArray(logRes.value)) {
        setAuditLogs(logRes.value);
      }
      if (sessionRes.status === 'fulfilled' && sessionRes.value?.user) {
        setCurrentUser(sessionRes.value.user);
        setAvailableUsers(sessionRes.value.availableUsers || SEED_USERS);
      }
    } catch (err) {
      console.warn('API fetch warning, using seed state:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Switch User (RBAC test)
  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        showToast(`Switched active persona to ${data.user.first_name} ${data.user.last_name} (${data.user.role})`);
      }
    } catch (e) {
      const found = availableUsers.find(u => u.id === userId);
      if (found) {
        setCurrentUser(found);
        showToast(`Switched active persona to ${found.first_name} ${found.last_name} (${found.role})`);
      }
    }
  };

  // Handle Resume Scan Success
  const handleScanSuccess = (
    newCandidate: Candidate, 
    isDuplicate: boolean, 
    duplicateCandidate: Candidate | null
  ) => {
    setIsScannerOpen(false);
    setRescanCandidate(null);
    setCandidates(prev => [newCandidate, ...prev.filter(c => c.id !== newCandidate.id)]);

    if (isDuplicate && duplicateCandidate) {
      setDuplicatePair({
        candidateA: newCandidate,
        candidateB: duplicateCandidate,
      });
      showToast(`⚠️ Possible duplicate detected for ${newCandidate.first_name} ${newCandidate.last_name}`);
    } else {
      setSelectedCandidate(newCandidate);
      setActiveView('candidate-detail');
      // Instant mobile scroll to top so the candidate review is immediately visible
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      showToast(`✓ Resume processed & AI match calculated: ${newCandidate.top_match?.overall_score || 0}% fit`);
    }
  };

  // Handle Recruiter Decision
  const handleDecisionSubmitted = (updatedCandidate: Candidate) => {
    setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
    if (selectedCandidate?.id === updatedCandidate.id) {
      setSelectedCandidate(updatedCandidate);
    }
    showToast(`✓ Recruiter decision saved: ${updatedCandidate.status.replace(/_/g, ' ')}`);
  };

  // Handle Adding Recruiter Note
  const handleAddNote = async (candidateId: string, text: string) => {
    try {
      const res = await fetch(`/api/candidates/${candidateId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        setCandidates(prev => prev.map(c => c.id === candidateId ? data.candidate : c));
        if (selectedCandidate?.id === candidateId) {
          setSelectedCandidate(data.candidate);
        }
        showToast('✓ Recruiter note added.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // === CRUD HANDLERS: CANDIDATES ===
  const handleOpenEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsEditCandidateOpen(true);
  };

  const handleSaveCandidate = async (candidateData: Partial<Candidate>) => {
    if (!candidateData.id) return;
    try {
      const res = await fetch(`/api/candidates/${candidateData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData),
      });
      if (!res.ok) throw new Error('Failed to update candidate');
      const data = await res.json();
      const updated = data.candidate;
      
      setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
      if (selectedCandidate?.id === updated.id) {
        setSelectedCandidate(updated);
      }
      showToast(`✓ Candidate ${updated.first_name} ${updated.last_name} updated successfully.`);
    } catch (e: any) {
      console.error(e);
      showToast(`Error: ${e.message || 'Could not update candidate'}`);
      throw e;
    }
  };

  const handleRequestDeleteCandidate = (candidate: Candidate) => {
    setDeleteTarget({
      type: 'candidate',
      id: candidate.id,
      title: `Candidate: ${candidate.first_name} ${candidate.last_name} (${candidate.candidate_code})`,
      subtitle: `Are you sure you want to permanently delete this candidate record, resume extracts, and match history?`,
    });
  };

  // === CRUD HANDLERS: JOB ROLES ===
  const handleOpenCreateJobRole = () => {
    setEditingJobRole(null);
    setIsEditJobRoleOpen(true);
  };

  const handleOpenEditJobRole = (role: JobRole) => {
    setEditingJobRole(role);
    setIsEditJobRoleOpen(true);
  };

  const handleSaveJobRole = async (roleData: Partial<JobRole>) => {
    try {
      if (roleData.id) {
        // Update existing
        const res = await fetch(`/api/jobs/${roleData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roleData),
        });
        if (!res.ok) throw new Error('Failed to update job role');
        const data = await res.json();
        setJobRoles(prev => prev.map(j => j.id === data.jobRole.id ? data.jobRole : j));
        showToast(`✓ Job role "${data.jobRole.role_name}" updated & scores refreshed.`);
      } else {
        // Create new
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roleData),
        });
        if (!res.ok) throw new Error('Failed to create job role');
        const data = await res.json();
        setJobRoles(prev => [data.jobRole, ...prev]);
        showToast(`✓ Job role "${data.jobRole.role_name}" created & matching activated.`);
      }

      // Refresh candidate list to receive newly recalculated scores
      const candRes = await fetch('/api/candidates');
      if (candRes.ok) {
        const candData = await candRes.json();
        setCandidates(candData);
        if (selectedCandidate) {
          const reloaded = candData.find((c: Candidate) => c.id === selectedCandidate.id);
          if (reloaded) setSelectedCandidate(reloaded);
        }
      }
    } catch (e: any) {
      console.error(e);
      showToast(`Error: ${e.message || 'Could not save job role'}`);
      throw e;
    }
  };

  const handleRequestDeleteJobRole = (role: JobRole) => {
    setDeleteTarget({
      type: 'job',
      id: role.id,
      title: `Job Position: ${role.role_name} (${role.department})`,
      subtitle: `Deleting this role will remove all matching weight rules. Candidates matched to this role will have their top matches re-evaluated.`,
    });
  };

  // === CRUD HANDLERS: RECRUITER TASKS ===
  const handleOpenCreateTask = () => {
    setEditingTask(null);
    setIsEditTaskOpen(true);
  };

  const handleOpenEditTask = (task: RecruiterTask) => {
    setEditingTask(task);
    setIsEditTaskOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<RecruiterTask>) => {
    try {
      if (taskData.id) {
        // Update task
        const res = await fetch(`/api/tasks/${taskData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        if (!res.ok) throw new Error('Failed to update task');
        const data = await res.json();
        setTasks(prev => prev.map(t => t.id === data.task.id ? data.task : t));
        showToast('✓ Task updated successfully.');
      } else {
        // Create task
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        if (!res.ok) throw new Error('Failed to create task');
        const data = await res.json();
        setTasks(prev => [data.task, ...prev]);
        showToast('✓ New task created.');
      }
    } catch (e: any) {
      console.error(e);
      showToast(`Error: ${e.message || 'Could not save task'}`);
      throw e;
    }
  };

  const handleRequestDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setDeleteTarget({
      type: 'task',
      id: taskId,
      title: `Task: ${task?.title || 'Recruiter Task'}`,
      subtitle: `Are you sure you want to delete this task?`,
    });
  };

  // === UNIFIED DELETE CONFIRMATION EXECUTOR ===
  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;

    try {
      if (type === 'candidate') {
        const res = await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete candidate');
        setCandidates(prev => prev.filter(c => c.id !== id));
        if (selectedCandidate?.id === id) {
          setSelectedCandidate(null);
          setActiveView('candidates');
        }
        showToast('✓ Candidate deleted successfully.');
      } else if (type === 'job') {
        const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete job role');
        setJobRoles(prev => prev.filter(j => j.id !== id));
        // Refresh candidate match scores
        const candRes = await fetch('/api/candidates');
        if (candRes.ok) {
          const candData = await candRes.json();
          setCandidates(candData);
        }
        showToast('✓ Job role deleted successfully.');
      } else if (type === 'task') {
        const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete task');
        setTasks(prev => prev.filter(t => t.id !== id));
        showToast('✓ Task deleted successfully.');
      }
      setDeleteTarget(null);
    } catch (e: any) {
      console.error(e);
      showToast(`Error: ${e.message || 'Failed to delete'}`);
    }
  };

  // Handle Task Toggle
  const handleToggleTask = async (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    try {
      await fetch(`/api/tasks/${taskId}/toggle`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Merge Candidates
  const handleMergeSuccess = (primaryCandidate: Candidate) => {
    setCandidates(prev => [primaryCandidate, ...prev.filter(c => c.id !== primaryCandidate.id && c.id !== duplicatePair?.candidateB.id)]);
    setDuplicatePair(null);
    setSelectedCandidate(primaryCandidate);
    setActiveView('candidate-detail');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    showToast(`✓ Candidate record merged successfully into ${primaryCandidate.candidate_code}`);
  };

  // Handle New Job Created from AI Assistant
  const handleJobCreated = (newJob: JobRole) => {
    setJobRoles(prev => [newJob, ...prev]);
    showToast(`✓ Job role "${newJob.role_name}" activated & matching rules applied.`);
    // Refresh candidates
    fetch('/api/candidates')
      .then(r => r.json())
      .then(data => setCandidates(data))
      .catch(() => {});
  };

  // Reset Demo Database
  const handleResetDemoData = async () => {
    if (!window.confirm('Reset database to initial demo candidates and job roles?')) return;
    try {
      await fetch('/api/reset-demo-data', { method: 'POST' });
      setCandidates(JSON.parse(JSON.stringify(SEED_CANDIDATES)));
      setJobRoles(JSON.parse(JSON.stringify(SEED_JOB_ROLES)));
      setTasks(JSON.parse(JSON.stringify(SEED_TASKS)));
      setAuditLogs(JSON.parse(JSON.stringify(SEED_AUDIT_LOGS)));
      setSelectedCandidate(null);
      setActiveView('dashboard');
      showToast('✓ Database reset to original sample test candidates.');
    } catch (e) {
      console.error(e);
    }
  };

  const reviewPendingCount = candidates.filter(c => c.status === 'READY_FOR_REVIEW' || c.status === 'HUMAN_REVIEW').length;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        availableUsers={availableUsers}
        onSwitchUser={handleSwitchUser}
        onOpenScanner={() => setIsScannerOpen(true)}
        pendingTasksCount={pendingTasksCount}
        onNavigate={(view) => {
          setSelectedCandidate(null);
          setActiveView(view);
        }}
        activeView={activeView}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={(view) => {
            setSelectedCandidate(null);
            setActiveView(view);
          }}
          onOpenScanner={() => setIsScannerOpen(true)}
          reviewCount={reviewPendingCount}
          pendingTasksCount={pendingTasksCount}
          currentUser={currentUser}
        />

        {/* View Router */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 max-w-full">
          
          {/* Toast Alert */}
          {toastMessage && (
            <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
              {toastMessage}
            </div>
          )}

          {/* Views */}
          {activeView === 'dashboard' && (
            <DashboardView
              candidates={candidates}
              jobRoles={jobRoles}
              tasks={tasks}
              currentUser={currentUser}
              onOpenScanner={() => setIsScannerOpen(true)}
              onSelectCandidate={(cand) => {
                setSelectedCandidate(cand);
                setActiveView('candidate-detail');
              }}
              onNavigate={setActiveView}
              onToggleTask={handleToggleTask}
              onOpenDecisionModal={(cand) => setDecisionCandidate(cand)}
              onOpenAiJdModal={() => setIsAiJdModalOpen(true)}
            />
          )}

          {activeView === 'review-queue' && (
            <ReviewQueueView
              candidates={candidates}
              onSelectCandidate={(cand) => {
                setSelectedCandidate(cand);
                setActiveView('candidate-detail');
              }}
              onOpenDecisionModal={(cand) => setDecisionCandidate(cand)}
              onOpenScanner={() => setIsScannerOpen(true)}
              onEditCandidate={handleOpenEditCandidate}
              onDeleteCandidate={handleRequestDeleteCandidate}
            />
          )}

          {activeView === 'candidates' && (
            <CandidatesListView
              candidates={candidates}
              onSelectCandidate={(cand) => {
                setSelectedCandidate(cand);
                setActiveView('candidate-detail');
              }}
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenDecisionModal={(cand) => setDecisionCandidate(cand)}
              onEditCandidate={handleOpenEditCandidate}
              onDeleteCandidate={handleRequestDeleteCandidate}
            />
          )}

          {activeView === 'candidate-detail' && selectedCandidate && (
            <CandidateDetailView
              candidate={selectedCandidate}
              allJobRoles={jobRoles}
              onBack={() => setActiveView('candidates')}
              onOpenDecisionModal={(cand) => setDecisionCandidate(cand)}
              onAddNote={handleAddNote}
              onRescanCandidate={(cand) => {
                setRescanCandidate(cand);
                setIsScannerOpen(true);
              }}
              onEditCandidate={handleOpenEditCandidate}
              onDeleteCandidate={handleRequestDeleteCandidate}
            />
          )}

          {activeView === 'jobs' && (
            <JobRolesView
              jobRoles={jobRoles}
              onOpenAiJdModal={() => setIsAiJdModalOpen(true)}
              onSelectRoleFilter={(roleId) => {
                setActiveView('candidates');
              }}
              onEditRole={handleOpenEditJobRole}
              onDeleteRole={handleRequestDeleteJobRole}
              onCreateRole={handleOpenCreateJobRole}
              onScanForRole={(roleId) => {
                setScannerInitialRoleId(roleId);
                setRescanCandidate(null);
                setIsScannerOpen(true);
              }}
            />
          )}

          {activeView === 'tasks' && (
            <TasksView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onSelectCandidateById={(candidateId) => {
                const found = candidates.find(c => c.id === candidateId);
                if (found) {
                  setSelectedCandidate(found);
                  setActiveView('candidate-detail');
                }
              }}
              onEditTask={handleOpenEditTask}
              onDeleteTask={handleRequestDeleteTask}
              onCreateTask={handleOpenCreateTask}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              candidates={candidates}
              jobRoles={jobRoles}
            />
          )}

          {activeView === 'audit-logs' && (
            <AuditLogsView
              logs={auditLogs}
            />
          )}

          {activeView === 'more' && (
            <MoreMobileView
              currentUser={currentUser}
              onNavigate={setActiveView}
              onResetDemoData={handleResetDemoData}
              pendingTasksCount={pendingTasksCount}
            />
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeView={activeView}
        onNavigate={(view) => {
          setSelectedCandidate(null);
          setActiveView(view);
        }}
        onOpenScanner={() => setIsScannerOpen(true)}
        reviewCount={reviewPendingCount}
      />

      {/* MODALS */}
      {/* 1. Resume Scanner Modal */}
      <ResumeScannerModal
        isOpen={isScannerOpen}
        jobRoles={jobRoles}
        initialJobRoleId={scannerInitialRoleId}
        allCandidates={candidates}
        onClose={() => {
          setIsScannerOpen(false);
          setRescanCandidate(null);
          setScannerInitialRoleId(null);
        }}
        onSuccess={(newCandidate, isDuplicate, duplicateCandidate) => {
          setRescanCandidate(null);
          setScannerInitialRoleId(null);
          setIsScannerOpen(false);
          handleScanSuccess(newCandidate, isDuplicate, duplicateCandidate);
        }}
        onBatchSuccess={(newCandidates) => {
          setRescanCandidate(null);
          setScannerInitialRoleId(null);
          setIsScannerOpen(false);
          setCandidates(prev => {
            const existingIds = new Set(prev.map(c => c.id));
            const fresh = newCandidates.filter(c => !existingIds.has(c.id));
            return [...fresh, ...prev];
          });
          showToast(`✓ Successfully processed and ingested ${newCandidates.length} candidate resumes!`);
          fetchData();
        }}
        rescanCandidate={rescanCandidate}
      />

      {/* 2. Human Recruiter Decision Modal */}
      {decisionCandidate && (
        <HumanDecisionModal
          isOpen={!!decisionCandidate}
          onClose={() => setDecisionCandidate(null)}
          candidate={decisionCandidate}
          onDecisionSubmitted={handleDecisionSubmitted}
        />
      )}

      {/* 3. AI Job Description Assistant Modal */}
      <AiJobDescriptionAssistantModal
        isOpen={isAiJdModalOpen}
        onClose={() => setIsAiJdModalOpen(false)}
        onJobCreated={handleJobCreated}
      />

      {/* 4. Duplicate Candidate Merge Modal */}
      {duplicatePair && (
        <DuplicateMergeModal
          isOpen={!!duplicatePair}
          onClose={() => setDuplicatePair(null)}
          candidateA={duplicatePair.candidateA}
          candidateB={duplicatePair.candidateB}
          onMergeSuccess={handleMergeSuccess}
          onKeepBoth={() => {
            const newCand = duplicatePair.candidateA;
            setDuplicatePair(null);
            setSelectedCandidate(newCand);
            setActiveView('candidate-detail');
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'instant' });
            }
            showToast(`Kept both profiles as separate candidate records.`);
          }}
        />
      )}

      {/* 5. Edit Candidate Modal */}
      <EditCandidateModal
        isOpen={isEditCandidateOpen}
        onClose={() => {
          setIsEditCandidateOpen(false);
          setEditingCandidate(null);
        }}
        candidate={editingCandidate}
        jobRoles={jobRoles}
        onSave={handleSaveCandidate}
        onDelete={async (candId) => {
          const cand = candidates.find(c => c.id === candId);
          if (cand) handleRequestDeleteCandidate(cand);
        }}
      />

      {/* 6. Edit / Create Job Role Modal */}
      <EditJobRoleModal
        isOpen={isEditJobRoleOpen}
        onClose={() => {
          setIsEditJobRoleOpen(false);
          setEditingJobRole(null);
        }}
        jobRole={editingJobRole}
        onSave={handleSaveJobRole}
        onDelete={async (roleId) => {
          const role = jobRoles.find(j => j.id === roleId);
          if (role) handleRequestDeleteJobRole(role);
        }}
      />

      {/* 7. Edit / Create Task Modal */}
      <EditTaskModal
        isOpen={isEditTaskOpen}
        onClose={() => {
          setIsEditTaskOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        candidates={candidates}
        onSave={handleSaveTask}
        onDelete={async (taskId) => {
          handleRequestDeleteTask(taskId);
        }}
      />

      {/* 8. Confirmation Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleExecuteDelete}
        title={deleteTarget ? `Delete ${deleteTarget.type === 'candidate' ? 'Candidate' : deleteTarget.type === 'job' ? 'Job Position' : 'Recruiter Task'}` : 'Confirm Delete'}
        itemName={deleteTarget?.title || 'this item'}
        itemType={deleteTarget?.type === 'candidate' ? 'Candidate' : deleteTarget?.type === 'job' ? 'Job Role' : 'Task'}
        warningMessage={deleteTarget?.subtitle}
      />

    </div>
  );
}

export default App;
