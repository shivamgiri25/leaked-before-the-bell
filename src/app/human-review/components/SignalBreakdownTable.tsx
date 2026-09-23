'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Signal } from '@/lib/appData';
import Badge from '@/components/ui/Badge';

type SignalStatus = Signal['status'];

const statusVariant: Record<SignalStatus, 'pass' | 'fail' | 'warn' | 'unknown'> = {
  MATCH: 'pass',
  PASS: 'pass',
  MISMATCH: 'fail',
  FAIL: 'fail',
  NOT_FOUND: 'unknown',
  SUSPICIOUS: 'warn',
  NORMAL: 'pass',
  UNREADABLE: 'unknown',
  POSTED_AFTER_EXAM: 'pass',
};

const statusLabel: Record<SignalStatus, string> = {
  MATCH: 'MATCH',
  PASS: 'PASS',
  MISMATCH: 'MISMATCH',
  FAIL: 'FAIL',
  NOT_FOUND: 'NOT FOUND',
  SUSPICIOUS: 'SUSPICIOUS',
  NORMAL: 'NORMAL',
  UNREADABLE: 'UNREADABLE',
  POSTED_AFTER_EXAM: 'POST-EXAM',
};

interface Props {
  signals: Signal[];
}

export default function SignalBreakdownTable({ signals }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalScore = signals.reduce((s, sig) => s + sig.score, 0);
  const totalMax = signals.reduce((s, sig) => s + sig.maxScore, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Verification Signal Breakdown
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Total:</span>
          <span className="text-sm font-bold font-mono-data text-foreground">
            {totalScore}/{totalMax}
          </span>
          <span className="text-2xs text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
            LIVE DATA
          </span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-2xs font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                Signal
              </th>
              <th className="text-center py-2 px-3 text-2xs font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                Weight
              </th>
              <th className="text-center py-2 px-3 text-2xs font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                Score
              </th>
              <th className="text-center py-2 px-3 text-2xs font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                Status
              </th>
              <th className="text-left py-2 px-3 text-2xs font-semibold text-muted-foreground uppercase tracking-widest">
                Reason
              </th>
              <th className="py-2 px-3 w-8" />
            </tr>
          </thead>
          <tbody>
            {signals.map((sig) => {
              const isExpanded = expandedId === sig.id;
              const pct = Math.round((sig.score / sig.maxScore) * 100);
              const barColor =
                pct >= 80
                  ? 'bg-risk-low'
                  : pct >= 50
                  ? 'bg-risk-medium' :'bg-risk-high';

              return (
                <React.Fragment key={`sig-row-${sig.id}`}>
                  <tr
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors duration-100 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : sig.id)}
                  >
                    <td className="py-3 px-3">
                      <span className="font-semibold text-foreground">{sig.name}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono-data text-muted-foreground">{sig.weight}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold font-mono-data text-foreground">
                          {sig.score}/{sig.maxScore}
                        </span>
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${barColor} transition-all duration-300`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={statusVariant[sig.status]} size="sm">
                        {statusLabel[sig.status]}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <p className="text-muted-foreground leading-snug line-clamp-2">
                        {sig.reason}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      {isExpanded ? (
                        <ChevronDown size={13} className="text-muted-foreground" />
                      ) : (
                        <ChevronRight size={13} className="text-muted-foreground" />
                      )}
                    </td>
                  </tr>
                  {isExpanded && sig.detail && (
                    <tr key={`sig-detail-${sig.id}`} className="border-b border-border/30">
                      <td colSpan={6} className="px-3 py-3">
                        <div className="bg-muted rounded-lg px-4 py-3 border border-border">
                          <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                            Technical Detail
                          </p>
                          <p className="text-xs text-foreground leading-relaxed font-mono-data">
                            {sig.detail}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}