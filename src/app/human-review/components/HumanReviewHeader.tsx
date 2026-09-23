'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import ReviewQueuePanel from './ReviewQueue';
import ReviewDetailPanel from './ReviewDetailPanel';


export default function HumanReviewClient() {
  const [selectedId, setSelectedId] = useState<string>('sub-002');
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const handleDecision = (submissionId: string, decision: 'REVIEWED' | 'ESCALATED' | 'FALSE_ALERT', notes: string) => {
    // Backend integration: POST /api/review/{submissionId} with { decision, notes }
    setReviewedIds((prev) => new Set([...prev, submissionId]));
    const labels: Record<string, string> = {
      REVIEWED: 'Marked as Reviewed',
      ESCALATED: 'Escalated for Investigation',
      FALSE_ALERT: 'Marked as False Alert',
    };
    toast.success(`${labels[decision]} — Submission ${submissionId}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#212121' }}>
      {/* Header */}
      <div className="px-6 lg:px-8 xl:px-10 py-4 flex items-center justify-between gap-4 flex-shrink-0" style={{ borderBottom: '1px solid #2f2f2f' }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 style={{ fontSize: '16px', fontWeight: 600, color: '#ececec', letterSpacing: '-0.01em' }}>Human Review Queue</h1>
            <span style={{ padding: '2px 8px', fontSize: '10px', fontWeight: 600, borderRadius: '6px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              0 PENDING
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#8e8ea0', marginTop: '2px' }}>
            Review HIGH and MEDIUM risk alerts — make decisions on flagged exam paper submissions
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0" style={{ fontSize: '11px', color: '#8e8ea0', background: '#2f2f2f', padding: '6px 12px', borderRadius: '8px', border: '1px solid #3f3f3f', fontFamily: 'JetBrains Mono, monospace' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10a37f', animation: 'pulse 2s ease-in-out infinite' }} />
          <span>Awaiting data connection</span>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Queue */}
        <div className="w-80 xl:w-96 flex-shrink-0 overflow-y-auto scrollbar-thin" style={{ borderRight: '1px solid #2f2f2f' }}>
          <ReviewQueuePanel
            selectedId={selectedId}
            onSelect={setSelectedId}
            reviewedIds={reviewedIds}
          />
        </div>

        {/* Right Detail */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <ReviewDetailPanel
            submissionId={selectedId}
            onDecision={handleDecision}
            isReviewed={reviewedIds.has(selectedId)}
          />
        </div>
      </div>
    </div>
  );
}