'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import { alertFeed } from '@/lib/appData';


function timeAgo(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000 / 60);
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
}

export default function ActiveAlertsFeed() {
  return (
    <div className="rounded-xl flex flex-col h-full" style={{ background: '#2f2f2f', border: '1px solid #3f3f3f' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #3f3f3f' }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse-amber" style={{ background: '#ef4444' }} />
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#ececec', letterSpacing: '-0.01em' }}>Active Alerts</h2>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.04em' }}>
            HIGH RISK
          </span>
        </div>
        <Link
          href="/human-review"
          className="flex items-center gap-0.5 transition-colors"
          style={{ fontSize: '11px', color: '#8e8ea0' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ececec')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#8e8ea0')}
        >
          View all <ArrowRight size={10} />
        </Link>
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin" style={{ borderBottom: '1px solid #3f3f3f' }}>
        {alertFeed.length === 0 ? (
          <p className="px-4 py-10 text-center text-xs text-muted-foreground">No active alerts</p>
        ) : alertFeed.map((alert) => (
          <div
            key={`alert-feed-${alert.id}`}
            className="px-4 py-3 cursor-pointer transition-colors duration-100"
            style={{ borderBottom: '1px solid rgba(63,63,63,0.5)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="min-w-0 flex-1">
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#ececec', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                  {alert.examName}
                </p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#8e8ea0', marginTop: '2px' }}>
                  {alert.paperCode} · {alert.centreId}
                </p>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '13px', color: '#ef4444', flexShrink: 0 }}>
                {alert.riskScore}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: '10px', color: '#8e8ea0', background: '#383838', border: '1px solid #4a4a4a', padding: '1px 6px', borderRadius: '4px' }}>
                  {alert.source}
                </span>
                <span style={{ fontSize: '10px', color: '#8e8ea0' }}>
                  {timeAgo(alert.ingestedAt)}
                </span>
              </div>
              {alert.assignedTo ? (
                <div className="flex items-center gap-1" style={{ fontSize: '10px', color: '#8e8ea0' }}>
                  <User size={9} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '72px' }}>{alert.assignedTo}</span>
                </div>
              ) : (
                <span style={{ fontWeight: 600, fontSize: '9px', color: '#10a37f', letterSpacing: '0.05em' }}>
                  UNASSIGNED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3">
        <Link
          href="/human-review"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg transition-all duration-150"
          style={{ fontSize: '12px', fontWeight: 500, color: '#10a37f', border: '1px solid rgba(16,163,127,0.25)', background: 'rgba(16,163,127,0.05)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(16,163,127,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(16,163,127,0.05)')}
        >
          Open Review Queue
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}