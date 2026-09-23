'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { submissions } from '@/lib/appData';
import Badge from '@/components/ui/Badge';

type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

const riskBadgeVariant: Record<RiskLevel, 'high' | 'medium' | 'low'> = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

const statusColor: Record<string, string> = {
  SUBMITTED: 'text-muted-foreground',
  PREPROCESSING: 'text-accent',
  ANALYZING: 'text-accent',
  PENDING_REVIEW: 'text-primary',
  REVIEWED: 'text-risk-low',
  ESCALATED: 'text-risk-high',
  FALSE_ALERT: 'text-muted-foreground',
};

const statusDot: Record<string, string> = {
  SUBMITTED: 'bg-muted-foreground',
  PREPROCESSING: 'bg-accent',
  ANALYZING: 'bg-accent',
  PENDING_REVIEW: 'bg-primary',
  REVIEWED: 'bg-risk-low',
  ESCALATED: 'bg-risk-high',
  FALSE_ALERT: 'bg-muted-foreground',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export default function RecentSubmissionsTable() {
  const recent = submissions.slice(0, 5);

  return (
    <div className="rounded-xl flex flex-col h-full" style={{ background: '#2f2f2f', border: '1px solid #3f3f3f' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #3f3f3f' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#ececec', letterSpacing: '-0.01em' }}>Recent Submissions</h2>
        <Link
          href="/submissions"
          className="flex items-center gap-0.5 transition-colors"
          style={{ fontSize: '11px', color: '#8e8ea0' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ececec')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#8e8ea0')}
        >
          All <ArrowRight size={10} />
        </Link>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(63,63,63,0.6)' }}>
              {['Paper', 'Source', 'Risk', 'Status', 'Ingested'].map((h) => (
                <th key={h} className="text-left py-2 px-4" style={{ fontSize: '10px', fontWeight: 500, color: '#8e8ea0', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-xs text-muted-foreground">No submissions available</td>
              </tr>
            ) : recent.map((sub) => (
              <tr
                key={`recent-sub-${sub.id}`}
                style={{ borderBottom: '1px solid rgba(63,63,63,0.4)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="py-2.5 px-4">
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: '11px', color: '#ececec' }}>{sub.paperCode}</p>
                  <p style={{ fontSize: '10px', color: '#8e8ea0' }}>{sub.setNumber}</p>
                </td>
                <td className="py-2.5 px-4">
                  <span style={{ fontSize: '11px', color: '#acacac' }}>{sub.source}</span>
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={riskBadgeVariant[sub.riskLevel as RiskLevel]}>
                      {sub.riskLevel}
                    </Badge>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '11px', color: '#ececec' }}>{sub.riskScore}</span>
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[sub.status] || 'bg-muted-foreground'}`} />
                    <span className={`font-medium ${statusColor[sub.status] || 'text-muted-foreground'}`} style={{ fontSize: '10px' }}>
                      {sub.status.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#8e8ea0' }}>{formatDate(sub.submittedAt)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}