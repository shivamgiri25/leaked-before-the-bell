'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, ShieldCheck, Search, FileImage } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import AppImage from '@/components/ui/AppImage';
import Badge from '@/components/ui/Badge';
import { duplicates, ocrResult, reviewActions, signals, submissions, type SubmissionStatus, type UserReport } from '@/lib/appData';

const DEMO_ADMIN_CODE = 'ADMIN-2026';

type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

const riskVariant: Record<RiskLevel, 'high' | 'medium' | 'low'> = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export default function AuthorityDashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [accessCode, setAccessCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [localReports, setLocalReports] = useState<UserReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reportStatuses, setReportStatuses] = useState<Record<string, SubmissionStatus>>({});
  const [reportNotes, setReportNotes] = useState<Record<string, string>>({});
  const [selectedCaseId, setSelectedCaseId] = useState('sub-002');
  const [caseStatuses, setCaseStatuses] = useState<Record<string, SubmissionStatus>>({});
  const [investigationNotes, setInvestigationNotes] = useState('');

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('lbb-authenticated') === 'true' && sessionStorage.getItem('lbb-role') === 'admin';
    if (!isAdmin) {
      router.replace('/login');
      return;
    }
    setAuthenticated(true);
    setCheckingAccess(false);
  }, [router]);

  useEffect(() => {
    const loadReports = () => setLocalReports(JSON.parse(localStorage.getItem('lbb-reports') || '[]'));
    loadReports();
    window.addEventListener('focus', loadReports);
    return () => window.removeEventListener('focus', loadReports);
  }, []);

  useEffect(() => {
    if (Object.keys(reportStatuses).length === 0) return;
    const stored: UserReport[] = JSON.parse(localStorage.getItem('lbb-reports') || '[]');
    localStorage.setItem('lbb-reports', JSON.stringify(stored.map((report) => reportStatuses[report.id] ? { ...report, status: reportStatuses[report.id] } : report)));
  }, [reportStatuses]);

  const signIn = () => {
    if (accessCode === DEMO_ADMIN_CODE) {
      setAuthenticated(true);
      setError('');
      return;
    }
    setError('Admin access code is incorrect.');
  };

  const lockDashboard = () => {
    sessionStorage.removeItem('lbb-authenticated');
    sessionStorage.removeItem('lbb-role');
    setAuthenticated(false);
    router.replace('/login');
  };

  if (checkingAccess) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-sm text-muted-foreground">Checking authority access...</div>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#161616' }}>
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-7 shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
              <LockKeyhole size={22} className="text-primary" />
            </div>
            <p className="mt-5 text-center text-2xs uppercase tracking-[0.18em] text-muted-foreground">Restricted area</p>
            <h1 className="mt-2 text-center text-xl font-semibold text-foreground">Authority dashboard</h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">This area contains all submitted papers, evidence previews, and investigation requests.</p>
            <label className="mt-6 block text-xs font-semibold text-foreground" htmlFor="admin-code">Admin access code</label>
            <input
              id="admin-code"
              type="password"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') signIn(); }}
              placeholder="Enter admin code"
              className="mt-2 w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            {error && <p className="mt-2 text-xs text-risk-high">{error}</p>}
            <button type="button" onClick={signIn} className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Open authority dashboard
            </button>
            <p className="mt-4 text-center text-2xs text-muted-foreground">Prototype access gate. Connect this route to server-side authentication before production use.</p>
          </div>
        </div>
    );
  }

  const filteredSubmissions = submissions.filter((submission) => {
    const query = searchTerm.toLowerCase();
    return [submission.id, submission.examName, submission.paperCode, submission.centreId, submission.source].some((value) => value.toLowerCase().includes(query));
  });

  const selectedCase = submissions.find((submission) => submission.id === selectedCaseId);
  const saveCaseStatus = (status: SubmissionStatus) => {
    setCaseStatuses((current) => ({ ...current, [selectedCaseId]: status }));
  };

  return (
    <AdminShell onLock={lockDashboard}>
      <div className="min-h-screen p-6 lg:p-8" style={{ background: '#212121' }}>
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-primary" />
                <p className="text-xs uppercase tracking-[0.16em] text-primary">Admin only</p>
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-foreground">Authority Dashboard</h1>
              <p className="mt-2 text-sm text-muted-foreground">Central view of submitted requests, papers, evidence, and review status.</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">Admin authority view</div>
          </header>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <AuthorityStat label="Total requests" value={String(submissions.length)} />
            <AuthorityStat label="High risk" value={String(submissions.filter((item) => item.riskLevel === 'HIGH').length)} />
            <AuthorityStat label="Pending review" value={String(submissions.filter((item) => item.status === 'PENDING_REVIEW').length)} />
            <AuthorityStat label="Submitted sources" value={String(new Set(submissions.map((item) => item.source)).size)} />
          </div>

          <div id="incoming-requests" className="mt-6 rounded-xl border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">All submitted papers</h2>
                <p className="mt-1 text-xs text-muted-foreground">Every request currently available to the authority role.</p>
              </div>
              <label className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 sm:w-72" htmlFor="authority-search">
                <Search size={14} className="text-muted-foreground" />
                <input id="authority-search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search submissions" className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground" />
              </label>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredSubmissions.map((submission) => (
                <article key={submission.id} className={`overflow-hidden rounded-lg border bg-muted ${selectedCaseId === submission.id ? 'border-primary' : 'border-border'}`}>
                  <div className="relative h-44 bg-background">
                    <AppImage src={submission.imageUrl} alt={`Submitted paper ${submission.id}`} width={800} height={500} className="h-full w-full object-contain" />
                    <span className="absolute left-3 top-3 rounded border border-border bg-card/90 px-2 py-1 text-2xs font-mono-data text-muted-foreground">{submission.id}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono-data text-sm font-semibold text-foreground">{submission.paperCode} · {submission.setNumber}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{submission.examName}</p>
                      </div>
                      <Badge variant={riskVariant[submission.riskLevel]}>{submission.riskLevel}</Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-2xs">
                      <Detail label="Score" value={`${submission.riskScore}/100`} />
                      <Detail label="Status" value={(caseStatuses[submission.id] || submission.status).replace('_', ' ')} />
                      <Detail label="Source" value={submission.source} />
                      <Detail label="Centre" value={submission.centreId} />
                    </div>
                    <button type="button" onClick={() => setSelectedCaseId(submission.id)} className="mt-3 w-full rounded-lg border border-primary/30 bg-primary/10 py-2 text-xs font-semibold text-primary hover:bg-primary/20">Open case</button>
                    <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-2xs text-muted-foreground">
                      <FileImage size={13} /> Submitted {new Date(submission.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {filteredSubmissions.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">No submissions match this search.</p>}
          </div>

          {localReports.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground">Incoming user reports</h2>
              <p className="mt-1 text-xs text-muted-foreground">Reports submitted through the user workspace on this browser.</p>
              <div className="mt-4 space-y-2">
                {localReports.map((report) => (
                  <button type="button" key={report.id} onClick={() => setSelectedReportId(report.id)} className={`flex w-full flex-col gap-2 rounded-lg border bg-muted px-3 py-3 text-left sm:flex-row sm:items-center sm:justify-between ${selectedReportId === report.id ? 'border-primary' : 'border-border'}`}>
                    <div><p className="font-mono-data text-xs font-semibold text-foreground">{report.id}</p><p className="mt-1 text-2xs text-muted-foreground">{report.userName} · {report.userEmail} · {report.paperCode || report.examId}</p></div>
                    <span className="text-2xs font-semibold uppercase text-risk-medium">{(reportStatuses[report.id] || report.status).replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedReportId && (() => {
            const report = localReports.find((item) => item.id === selectedReportId);
            if (!report) return null;
            const status = reportStatuses[report.id] || report.status;
            return (
              <section className="mt-6 rounded-xl border border-primary/30 bg-card p-5">
                <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div><p className="text-2xs uppercase tracking-widest text-primary">Incoming request review</p><h2 className="mt-1 text-lg font-semibold text-foreground">{report.id}</h2><p className="mt-1 text-xs text-muted-foreground">Submitted by {report.userName} · {report.userEmail}</p></div>
                  <select value={status} onChange={(event) => setReportStatuses((current) => ({ ...current, [report.id]: event.target.value as SubmissionStatus }))} className="rounded-lg border border-border bg-muted px-3 py-2 text-xs font-semibold text-foreground">
                    {['SUBMITTED', 'ANALYZING', 'PENDING_REVIEW', 'REVIEWED', 'ESCALATED', 'FALSE_ALERT'].map((value) => <option key={value} value={value}>{value.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Detail label="Source" value={report.source} /><Detail label="Post time" value={new Date(report.postTimestamp).toLocaleString()} /><Detail label="Exam" value={report.examId} /><Detail label="Paper code" value={report.paperCode || 'Not provided'} /><Detail label="Centre" value={report.centreId || 'Not provided'} /><Detail label="Image" value={report.imageName} />
                </div>
                <label className="mt-5 block text-xs font-semibold text-foreground" htmlFor="incoming-report-notes">Investigation notes<textarea id="incoming-report-notes" value={reportNotes[report.id] || ''} onChange={(event) => setReportNotes((current) => ({ ...current, [report.id]: event.target.value }))} rows={4} placeholder="Record review findings, evidence requests, or next steps..." className="mt-2 w-full rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground outline-none focus:border-primary" /></label>
                <div className="mt-4 flex flex-wrap gap-2">
                  <DecisionButton label="True / Confirmed" tone="success" onClick={() => setReportStatuses((current) => ({ ...current, [report.id]: 'REVIEWED' }))} />
                  <DecisionButton label="False Alert" tone="danger" onClick={() => setReportStatuses((current) => ({ ...current, [report.id]: 'FALSE_ALERT' }))} />
                  <DecisionButton label="Keep in Review" tone="neutral" onClick={() => setReportStatuses((current) => ({ ...current, [report.id]: 'PENDING_REVIEW' }))} />
                </div>
                <p className="mt-3 text-2xs text-muted-foreground">Status and notes are held in this authority session until backend persistence is connected.</p>
              </section>
            );
          })()}

          {selectedCase && (
            <section id="evidence-review" className="mt-6 rounded-xl border border-primary/30 bg-card p-5">
              <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="text-2xs uppercase tracking-widest text-primary">Open suspicious-paper case</p><h2 className="mt-1 text-lg font-semibold text-foreground">{selectedCase.id} · {selectedCase.paperCode}</h2><p className="mt-1 text-xs text-muted-foreground">{selectedCase.examName} · {selectedCase.centreId} · {selectedCase.source}</p></div>
                <select value={caseStatuses[selectedCase.id] || selectedCase.status} onChange={(event) => saveCaseStatus(event.target.value as SubmissionStatus)} className="rounded-lg border border-border bg-muted px-3 py-2 text-xs font-semibold text-foreground">
                  {['SUBMITTED', 'ANALYZING', 'PENDING_REVIEW', 'REVIEWED', 'ESCALATED', 'FALSE_ALERT'].map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Analysis evidence</h3>
                  <div className="grid grid-cols-2 gap-2 text-2xs"><Detail label="OCR confidence" value={`${ocrResult.ocrConfidence}%`} /><Detail label="Serial" value={ocrResult.serialNumber} /><Detail label="Barcode" value={ocrResult.barcodeText} /><Detail label="Watermark" value={ocrResult.watermarkId} /><Detail label="pHash" value={selectedCase.pHash} /><Detail label="Duplicate count" value={String(selectedCase.duplicateCount)} /></div>
                  <div className="rounded-lg border border-border bg-muted p-3"><p className="text-2xs uppercase tracking-widest text-muted-foreground">Question matching</p><p className="mt-2 text-xs text-foreground">{ocrResult.extractedQuestions.join(' ')}</p></div>
                  <div className="rounded-lg border border-border bg-muted p-3"><p className="text-2xs uppercase tracking-widest text-muted-foreground">Timeline</p><p className="mt-2 text-xs text-foreground">Posted {new Date(selectedCase.postTimestamp).toLocaleString()} for an exam dated {selectedCase.examDate}.</p></div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Signals and audit</h3>
                  {signals.map((signal) => <div key={signal.id} className="rounded-lg border border-border bg-muted p-3"><div className="flex justify-between gap-3"><span className="text-xs font-semibold text-foreground">{signal.name}</span><span className="font-mono-data text-xs text-primary">{signal.score}/{signal.maxScore}</span></div><p className="mt-1 text-2xs text-muted-foreground">{signal.reason}</p></div>)}
                  <div className="rounded-lg border border-border bg-muted p-3"><p className="text-2xs uppercase tracking-widest text-muted-foreground">Audit log</p>{reviewActions.map((action) => <p key={action.id} className="mt-2 text-2xs text-foreground">{action.action} · {action.actor} · {new Date(action.timestamp).toLocaleString()}</p>)}{duplicates.length > 0 && <p className="mt-2 text-2xs text-risk-medium">Duplicate relation: {duplicates[0].relationshipType.replace('_', ' ')}</p>}</div>
                  <label className="block text-xs font-semibold text-foreground" htmlFor="investigation-notes">Investigation notes<textarea id="investigation-notes" value={investigationNotes} onChange={(event) => setInvestigationNotes(event.target.value)} rows={4} placeholder="Add authority findings or next steps..." className="mt-2 w-full rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground outline-none focus:border-primary" /></label>
                  <div className="flex flex-wrap gap-2">
                    <DecisionButton label="True / Confirmed" tone="success" onClick={() => saveCaseStatus('REVIEWED')} />
                    <DecisionButton label="False Alert" tone="danger" onClick={() => saveCaseStatus('FALSE_ALERT')} />
                    <DecisionButton label="Keep in Review" tone="neutral" onClick={() => saveCaseStatus('PENDING_REVIEW')} />
                  </div>
                  <button type="button" onClick={() => setInvestigationNotes((notes) => notes.trim())} className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Save investigation note</button>
                </div>
              </div>
            </section>
          )}

          <div id="audit-history" className="mt-6 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Audit history</h2>
            <p className="mt-1 text-xs text-muted-foreground">Every Admin decision should be persisted here when the backend is connected.</p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function AuthorityStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-card p-4"><p className="text-2xl font-bold font-mono-data text-primary">{value}</p><p className="mt-1 text-2xs uppercase tracking-widest text-muted-foreground">{label}</p></div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-border bg-card/60 px-2 py-2"><p className="text-muted-foreground">{label}</p><p className="mt-1 truncate font-mono-data font-semibold text-foreground">{value}</p></div>;
}

function DecisionButton({ label, tone, onClick }: { label: string; tone: 'success' | 'danger' | 'neutral'; onClick: () => void }) {
  const styles = {
    success: 'border-risk-low/30 bg-risk-low/10 text-risk-low hover:bg-risk-low/20',
    danger: 'border-risk-high/30 bg-risk-high/10 text-risk-high hover:bg-risk-high/20',
    neutral: 'border-border bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground',
  };
  return <button type="button" onClick={onClick} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${styles[tone]}`}>{label}</button>;
}
