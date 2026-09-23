'use client';

import React from 'react';
import { ClipboardCheck, FileSearch, FileClock, LogOut, ShieldCheck } from 'lucide-react';

interface AdminShellProps {
  children: React.ReactNode;
  onLock: () => void;
}

export default function AdminShell({ children, onLock }: AdminShellProps) {
  return (
    <div className="min-h-screen" style={{ background: '#161616' }}>
      <header className="flex min-h-[64px] items-center justify-between border-b border-primary/20 bg-[#111111] px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
            <ShieldCheck size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Authority Control Room</p>
            <p className="text-2xs uppercase tracking-[0.14em] text-primary">Restricted admin workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <ClipboardCheck size={14} className="text-primary" /> Incoming review queue
          </div>
          <button type="button" onClick={onLock} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
            <LogOut size={14} /> Exit admin
          </button>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-96px)]">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-[#191919] p-4 md:block">
          <p className="px-3 text-2xs uppercase tracking-[0.16em] text-muted-foreground">Authority tools</p>
          <nav className="mt-3 space-y-1">
            <a href="/authority-dashboard/incoming-requests" className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-xs font-semibold text-primary"><FileSearch size={15} /> Incoming requests</a>
            <a href="/authority-dashboard/evidence-review" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"><ClipboardCheck size={15} /> Evidence review</a>
            <a href="/authority-dashboard/audit-history" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"><FileClock size={15} /> Audit history</a>
          </nav>
          <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-3 text-2xs text-muted-foreground">
            <p className="font-semibold text-primary">Admin access active</p>
            <p className="mt-1">User reports and authority evidence are visible only in this workspace.</p>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
