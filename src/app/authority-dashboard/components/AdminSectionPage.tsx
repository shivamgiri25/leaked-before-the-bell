'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, FileClock, Search } from 'lucide-react';
import Link from 'next/link';
import AdminShell from '@/components/AdminShell';
import Badge from '@/components/ui/Badge';
import ReviewDetailPanel from '@/app/human-review/components/ReviewDetailPanel';
import {
  ocrResult,
  reviewActions,
  signals,
  submissions,
  type SubmissionStatus,
  type UserReport,
} from '@/lib/appData';

type AdminSection = 'incoming' | 'evidence' | 'audit';
type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
const riskVariant: Record<RiskLevel, 'high' | 'medium' | 'low'> = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

interface AdminAuditEvent {
  id: string;
  submissionId: string;
  action: string;
  actor: string;
  timestamp: string;
}

const resolvedStatuses: SubmissionStatus[] = ['REVIEWED', 'FALSE_ALERT'];

function isResolved(status?: SubmissionStatus) {
  return Boolean(status && resolvedStatuses.includes(status));
}

function readAdminAuditEvents(): AdminAuditEvent[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('lbb-admin-audit') || '[]') as AdminAuditEvent[];
}

function persistAdminDecision(selectedId: string, decision: 'REVIEWED' | 'FALSE_ALERT') {
  const stored: UserReport[] = JSON.parse(localStorage.getItem('lbb-reports') || '[]');
  localStorage.setItem(
    'lbb-reports',
    JSON.stringify(
      stored.map((report) => (report.id === selectedId ? { ...report, status: decision } : report))
    )
  );
  const auditEvents = readAdminAuditEvents();
  localStorage.setItem(
    'lbb-admin-audit',
    JSON.stringify([
      {
        id: `admin-audit-${Date.now()}`,
        submissionId: selectedId,
        action: decision === 'REVIEWED' ? 'TRUE / CONFIRMED' : 'FALSE ALERT',
        actor: 'Authority Admin',
        timestamp: new Date().toISOString(),
      },
      ...auditEvents,
    ])
  );
}

export default function AdminSectionPage({ section }: { section: AdminSection }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authorized, setAuthorized] = useState(false);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [selectedId, setSelectedId] = useState(
    section === 'evidence' ? '' : submissions[0]?.id || ''
  );
  const [statuses, setStatuses] = useState<Record<string, SubmissionStatus>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    const isAdmin =
      sessionStorage.getItem('lbb-authenticated') === 'true' &&
      sessionStorage.getItem('lbb-role') === 'admin';
    if (!isAdmin) router.replace('/login');
    else setAuthorized(true);
    const loadReports = () => setReports(JSON.parse(localStorage.getItem('lbb-reports') || '[]'));
    loadReports();
    const requestedCase = searchParams.get('case');
    if (requestedCase) setSelectedId(requestedCase);
    window.addEventListener('focus', loadReports);
    return () => window.removeEventListener('focus', loadReports);
  }, [router, searchParams]);

  const lock = () => {
    sessionStorage.removeItem('lbb-authenticated');
    sessionStorage.removeItem('lbb-role');
    router.replace('/login');
  };

  if (!authorized)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-sm text-muted-foreground">
        Checking authority access...
      </div>
    );

  const titles = {
    incoming: ['Incoming Requests', 'Review reports submitted by users.'],
    evidence: ['Evidence Review', 'Inspect suspicious-paper evidence and analysis signals.'],
    audit: ['Audit History', 'Review authority actions and case status changes.'],
  } as const;

  return (
    <AdminShell onLock={lock}>
      <div className="min-h-[calc(100vh-96px)] p-6 lg:p-8" style={{ background: '#161616' }}>
        <div className="mx-auto max-w-7xl">
          <header className="border-b border-border pb-6">
            <p className="text-2xs uppercase tracking-[0.18em] text-primary">Admin workspace</p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground">{titles[section][0]}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{titles[section][1]}</p>
          </header>
          {section === 'incoming' && <IncomingRequests reports={reports} />}
          {section === 'evidence' && (
            <EvidenceReview
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              search={search}
              setSearch={setSearch}
              reports={reports}
            />
          )}
          {section === 'audit' && <AuditHistory />}
        </div>
      </div>
    </AdminShell>
  );
}

function IncomingRequests({ reports }: { reports: UserReport[] }) {
  const activeReports = reports.filter((report) => !isResolved(report.status));
  if (activeReports.length === 0) return <EmptyState text="No incoming user reports." />;
  return (
    <div className="mt-6 space-y-3">
      {activeReports.map((report) => (
        <article key={report.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono-data text-sm font-semibold text-foreground">{report.id}</p>
              <p className="mt-1 text-sm text-foreground">
                {report.paperCode || report.examId} · {report.setNumber || 'Paper'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {report.userName} · {report.userEmail}
              </p>
            </div>
            <Badge variant="medium">{report.status.replace('_', ' ')}</Badge>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            <Info label="Source" value={report.source} />
            <Info label="Post time" value={new Date(report.postTimestamp).toLocaleString()} />
            <Info label="Centre" value={report.centreId || 'Not provided'} />
            <Info label="Image" value={report.imageName} />
          </div>
          <Link
            href={`/authority-dashboard/evidence-review?case=${encodeURIComponent(report.id)}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            Track in Evidence Review <ArrowRight size={13} />
          </Link>
        </article>
      ))}
    </div>
  );
}

function EvidenceReview({
  selectedId,
  setSelectedId,
  search,
  setSearch,
  reports,
}: {
  selectedId: string;
  setSelectedId: (id: string) => void;
  search: string;
  setSearch: (value: string) => void;
  reports: UserReport[];
}) {
  const [draftStatus, setDraftStatus] = useState<SubmissionStatus | null>(null);
  const [savedStatuses, setSavedStatuses] = useState<Record<string, SubmissionStatus>>({});
  const filtered = submissions.filter((item) =>
    `${item.id} ${item.paperCode} ${item.examName}`.toLowerCase().includes(search.toLowerCase())
  );
  const selectedReport = reports.find((report) => report.id === selectedId);
  const selected = submissions.find((item) => item.id === selectedId);
  const relatedSubmission = selectedReport ? findRelatedSubmission(selectedReport) : selected;
  const currentStatus =
    draftStatus || savedStatuses[selectedId] || selected?.status || selectedReport?.status;

  const saveDecision = () => {
    if (!draftStatus || !selectedId) return;
    setSavedStatuses((current) => ({ ...current, [selectedId]: draftStatus }));
    if (draftStatus === 'REVIEWED' || draftStatus === 'FALSE_ALERT')
      persistAdminDecision(selectedId, draftStatus);
    setDraftStatus(null);
  };

  if (selectedReport) {
    return (
      <ReviewReport
        report={selectedReport}
        relatedSubmission={relatedSubmission}
        currentStatus={currentStatus}
        draftStatus={draftStatus}
        setDraftStatus={setDraftStatus}
        saveDecision={saveDecision}
      />
    );
  }

  if (selected) {
    return (
      <div className="mt-6 min-h-[calc(100vh-240px)] overflow-hidden rounded-xl border border-border bg-card">
        <ReviewDetailPanel
          submissionId={selected.id}
          isReviewed={isResolved(selected.status)}
          onDecision={(id, decision) => {
            if (decision === 'REVIEWED' || decision === 'FALSE_ALERT') {
              setSavedStatuses((current) => ({ ...current, [id]: decision }));
              persistAdminDecision(id, decision);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="rounded-xl border border-border bg-card p-3">
        <label className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
          <Search size={14} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search cases"
            className="w-full bg-transparent text-xs text-foreground outline-none"
          />
        </label>
        <div className="mt-3 space-y-2">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedId(item.id);
                setDraftStatus(null);
              }}
              className={`w-full rounded-lg border p-3 text-left ${selectedId === item.id ? 'border-primary bg-primary/10' : 'border-border bg-muted'}`}
            >
              <p className="font-mono-data text-xs font-semibold text-foreground">{item.id}</p>
              <p className="mt-1 text-2xs text-muted-foreground">
                {item.paperCode} · {item.riskScore}/100
              </p>
            </button>
          ))}
        </div>
      </div>
      <EmptyState text="Select a case from Incoming Requests using Track in Evidence Review." />
    </div>
  );
}

function findRelatedSubmission(report: UserReport) {
  const normalizedPaperCode = report.paperCode.trim().toLowerCase();
  const normalizedSetNumber = report.setNumber.trim().toLowerCase();
  const normalizedCentreId = report.centreId.trim().toLowerCase();
  const normalizedSource = report.source.trim().toLowerCase();
  const normalizedExamId = report.examId.trim().toLowerCase();

  return (
    submissions.find((submission) => submission.id === report.id) ||
    submissions.find(
      (submission) =>
        submission.paperCode.toLowerCase() === normalizedPaperCode &&
        submission.setNumber.toLowerCase() === normalizedSetNumber &&
        submission.centreId.toLowerCase() === normalizedCentreId
    ) ||
    submissions.find(
      (submission) =>
        submission.paperCode.toLowerCase() === normalizedPaperCode &&
        submission.source.toLowerCase() === normalizedSource
    ) ||
    submissions.find((submission) => submission.paperCode.toLowerCase() === normalizedPaperCode) ||
    submissions.find((submission) => submission.examName.toLowerCase() === normalizedExamId)
  );
}

function ReviewReport({
  report,
  relatedSubmission,
  currentStatus,
  draftStatus,
  setDraftStatus,
  saveDecision,
}: {
  report: UserReport;
  relatedSubmission?: (typeof submissions)[number];
  currentStatus?: SubmissionStatus;
  draftStatus: SubmissionStatus | null;
  setDraftStatus: (status: SubmissionStatus) => void;
  saveDecision: () => void;
}) {
  return (
    <article className="mt-6 rounded-xl border border-primary/30 bg-card p-5">
      <p className="text-2xs uppercase tracking-widest text-primary">Tracked incoming request</p>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="mt-1 text-lg font-semibold text-foreground">{report.id}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Submitted by {report.userName} · {report.userEmail}
          </p>
        </div>
        {relatedSubmission ? (
          <Badge variant={riskVariant[relatedSubmission.riskLevel]}>
            {relatedSubmission.riskLevel} · {relatedSubmission.riskScore}/100
          </Badge>
        ) : (
          <Badge variant="medium">Analysis pending</Badge>
        )}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-lg border border-border bg-background">
          {report.imageData ? (
            <img
              src={report.imageData}
              alt={`Uploaded paper for ${report.id}`}
              className="h-64 w-full object-contain"
            />
          ) : (
            <div className="flex h-64 items-center justify-center p-4 text-center text-xs text-muted-foreground">
              Image data is not available for this older report.
              <br />
              File: {report.imageName}
            </div>
          )}
        </div>
        <div className="grid content-start gap-2 sm:grid-cols-2">
          <Info label="Source" value={report.source} />
          <Info label="Post time" value={new Date(report.postTimestamp).toLocaleString()} />
          <Info label="Exam" value={report.examId} />
          <Info label="Paper code" value={report.paperCode || 'Not provided'} />
          <Info label="Centre" value={report.centreId || 'Not provided'} />
          <Info label="Image" value={report.imageName} />
        </div>
      </div>
      {relatedSubmission ? (
        <div className="mt-5 space-y-3">
          <div className="grid gap-2 sm:grid-cols-4">
            <Info label="Risk score" value={`${relatedSubmission.riskScore}/100`} />
            <Info label="Risk level" value={relatedSubmission.riskLevel} />
            <Info label="Duplicate count" value={String(relatedSubmission.duplicateCount)} />
            <Info label="pHash" value={relatedSubmission.pHash} />
          </div>
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-2xs uppercase tracking-widest text-muted-foreground">
              Analysis signals
            </p>
            <div className="mt-3 space-y-2">
              {signals.map((signal) => (
                <div
                  key={signal.id}
                  className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-xs font-semibold text-foreground">{signal.name}</span>
                  <span className="text-2xs text-muted-foreground">
                    {signal.score}/{signal.maxScore} · {signal.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Info label="OCR confidence" value={`${ocrResult.ocrConfidence}%`} />
            <Info label="Serial" value={ocrResult.serialNumber} />
            <Info label="Watermark" value={ocrResult.watermarkId} />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-border bg-muted p-4">
          <p className="text-sm font-semibold text-foreground">Analysis pending</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Evidence analysis will appear here after the analysis service processes this report.
          </p>
        </div>
      )}
      <DecisionControls
        draftStatus={draftStatus}
        setDraftStatus={setDraftStatus}
        saveDecision={saveDecision}
        currentStatus={currentStatus}
      />
    </article>
  );
}

function DecisionControls({
  draftStatus,
  setDraftStatus,
  saveDecision,
  currentStatus,
}: {
  draftStatus: SubmissionStatus | null;
  setDraftStatus: (status: SubmissionStatus) => void;
  saveDecision: () => void;
  currentStatus?: SubmissionStatus;
}) {
  return (
    <div className="mt-5 rounded-lg border border-border bg-muted p-4">
      <p className="text-xs font-semibold text-foreground">Admin decision</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDraftStatus('REVIEWED')}
          className={`rounded-lg border px-3 py-2 text-xs font-semibold ${draftStatus === 'REVIEWED' ? 'border-risk-low bg-risk-low/20 text-risk-low' : 'border-risk-low/30 bg-risk-low/10 text-risk-low'}`}
        >
          True / Confirmed
        </button>
        <button
          type="button"
          onClick={() => setDraftStatus('FALSE_ALERT')}
          className={`rounded-lg border px-3 py-2 text-xs font-semibold ${draftStatus === 'FALSE_ALERT' ? 'border-risk-high bg-risk-high/20 text-risk-high' : 'border-risk-high/30 bg-risk-high/10 text-risk-high'}`}
        >
          False Alert
        </button>
        <button
          type="button"
          onClick={() => setDraftStatus('PENDING_REVIEW')}
          className={`rounded-lg border px-3 py-2 text-xs font-semibold ${draftStatus === 'PENDING_REVIEW' ? 'border-primary bg-primary/20 text-primary' : 'border-border bg-card text-muted-foreground'}`}
        >
          Keep in Review
        </button>
      </div>
      <button
        type="button"
        disabled={!draftStatus}
        onClick={saveDecision}
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        Save decision
      </button>
      <p className="mt-3 text-2xs text-muted-foreground">
        Current saved status: {currentStatus ? currentStatus.replace('_', ' ') : 'Not reviewed'}
      </p>
    </div>
  );
}

function AuditHistory() {
  const [localEvents, setLocalEvents] = useState<AdminAuditEvent[]>([]);

  useEffect(() => {
    setLocalEvents(readAdminAuditEvents());
    const refresh = () => setLocalEvents(readAdminAuditEvents());
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  const events = [
    ...localEvents,
    ...reviewActions.map((action) => ({
      id: action.id,
      submissionId: action.submissionId,
      action: action.action,
      actor: action.actor,
      timestamp: action.timestamp,
    })),
  ];
  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <FileClock size={16} className="text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Authority audit events</h2>
      </div>
      <div className="mt-4 space-y-2">
        {events.map((action) => (
          <div
            key={action.id}
            className="flex flex-col gap-1 rounded-lg border border-border bg-muted p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-foreground">{action.action}</p>
              <p className="mt-1 text-2xs text-muted-foreground">
                Case {action.submissionId} · {action.actor}
              </p>
            </div>
            <span className="font-mono-data text-2xs text-muted-foreground">
              {new Date(action.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted px-3 py-2">
      <p className="text-2xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}
function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
