'use client';

import React from 'react';
import { RefreshCw, Download } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div
      className="px-6 lg:px-8 xl:px-10 py-4 flex items-center justify-between gap-4 flex-wrap"
      style={{ borderBottom: '1px solid #2f2f2f' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 style={{ fontSize: '16px', fontWeight: 600, color: '#ececec', letterSpacing: '-0.01em', lineHeight: 1 }}>
              Investigation Dashboard
            </h1>
            <span
              style={{ fontSize: '10px', fontWeight: 500, color: '#8e8ea0', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}
            >
              LIVE DATA
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#8e8ea0', marginTop: '3px', lineHeight: 1.4 }}>
            Forensic overview — suspicious submissions, risk signals, pending human review
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ background: '#2f2f2f', border: '1px solid #3f3f3f', fontSize: '11px', color: '#8e8ea0', fontFamily: 'JetBrains Mono, monospace' }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10a37f', animation: 'pulse 2s ease-in-out infinite' }} />
          <span>Awaiting data connection</span>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150"
          style={{ background: '#2f2f2f', border: '1px solid #3f3f3f', fontSize: '12px', color: '#8e8ea0' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ececec'; (e.currentTarget as HTMLElement).style.background = '#383838'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#8e8ea0'; (e.currentTarget as HTMLElement).style.background = '#2f2f2f'; }}
        >
          <RefreshCw size={12} />
          <span>Refresh</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150"
          style={{ background: '#2f2f2f', border: '1px solid #3f3f3f', fontSize: '12px', color: '#8e8ea0' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ececec'; (e.currentTarget as HTMLElement).style.background = '#383838'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#8e8ea0'; (e.currentTarget as HTMLElement).style.background = '#2f2f2f'; }}
        >
          <Download size={12} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}