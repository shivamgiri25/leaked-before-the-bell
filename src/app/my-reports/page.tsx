'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, Clock3, FileImage, SearchCheck } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import type { UserReport } from '@/lib/appData';

export default function MyReportsPage() {
  const [reports, setReports] = useState<UserReport[]>([]);

  useEffect(() => {
    const email = sessionStorage.getItem('lbb-user-email') || '';
    const stored: UserReport[] = JSON.parse(localStorage.getItem('lbb-reports') || '[]');
    setReports(stored.filter((report) => !email || report.userEmail === email));
    const refreshReports = () => {
      const latest: UserReport[] = JSON.parse(localStorage.getItem('lbb-reports') || '[]');
      setReports(latest.filter((report) => !email || report.userEmail === email));
    };
    window.addEventListener('focus', refreshReports);
    window.addEventListener('storage', refreshReports);
    return () => {
      window.removeEventListener('focus', refreshReports);
      window.removeEventListener('storage', refreshReports);
    };
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen p-6 lg:p-8" style={{ background: '#212121' }}>
        <div className="mx-auto max-w-5xl">
          <header className="border-b border-border pb-6">
            <p className="text-xs uppercase tracking-[0.16em] text-primary">User workspace</p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground">My Reports</h1>
            <p className="mt-2 text-sm text-muted-foreground">Track the suspicious-paper reports submitted from your account and their review status.</p>
          </header>

          {reports.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <ClipboardList size={30} className="mx-auto text-muted-foreground" />
              <h2 className="mt-4 text-sm font-semibold text-foreground">No reports submitted yet</h2>
              <p className="mt-2 text-xs text-muted-foreground">Submit a suspicious paper to receive a case ID and status here.</p>
              <a href="/upload-ingest" className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Submit a report</a>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {reports.map((report) => (
                <article key={report.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileImage size={16} className="text-primary" />
                        <h2 className="font-mono-data text-sm font-semibold text-foreground">{report.id}</h2>
                      </div>
                      <p className="mt-2 text-sm text-foreground">{report.paperCode || report.examId} · {report.setNumber || 'Paper details submitted'}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Submitted {new Date(report.submittedAt).toLocaleString()}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-2xs font-semibold uppercase ${report.status === 'REVIEWED' ? 'border-risk-low/30 bg-risk-low/10 text-risk-low' : report.status === 'FALSE_ALERT' ? 'border-risk-high/30 bg-risk-high/10 text-risk-high' : 'border-risk-medium/30 bg-risk-medium/10 text-risk-medium'}`}>
                      <Clock3 size={12} /> {report.status === 'REVIEWED' ? 'TRUE / CONFIRMED' : report.status === 'FALSE_ALERT' ? 'FALSE ALERT' : 'IN REVIEW'}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-4">
                    <ReportDetail label="Source" value={report.source} />
                    <ReportDetail label="Exam date" value={report.examDate || 'Not provided'} />
                    <ReportDetail label="Centre" value={report.centreId || 'Not provided'} />
                    <ReportDetail label="Paper image" value={report.imageName} />
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                    <SearchCheck size={14} className="text-primary" /> Authority review has not completed analysis yet.
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function ReportDetail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-border bg-muted px-3 py-2"><p className="text-2xs uppercase tracking-widest text-muted-foreground">{label}</p><p className="mt-1 truncate text-xs font-semibold text-foreground">{value}</p></div>;
}
