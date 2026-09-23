'use client';

import React, { useState } from 'react';
import {
  submissions,
  signals as availableSignals,
  ocrResult as availableOcrResult,
  duplicates as availableDuplicates,
  reviewActions as availableReviewActions,
} from '@/lib/appData';
import Badge from '@/components/ui/Badge';
import RiskGauge from './RiskGauge';
import SignalBreakdownTable from './SignalBreakdownTable';
import OcrIdentifiersPanel from './OcrIdentifiers';
import DuplicateRelationsPanel from './DuplicateRelationship';
import AuditTrail from './AuditTrail';
import ReviewActionPanel from './ReviewActionPanel';
import ImageComparisonPanel from './ImageComparison';

type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

const riskVariant: Record<RiskLevel, 'high' | 'medium' | 'low'> = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

interface Props {
  submissionId: string;
  onDecision: (id: string, decision: 'REVIEWED' | 'ESCALATED' | 'FALSE_ALERT', notes: string) => void;
  isReviewed: boolean;
}

export default function ReviewDetailPanel({ submissionId, onDecision, isReviewed }: Props) {
  const submission = submissions.find((s) => s.id === submissionId);

  if (!submission) {
    return (
      <div className="flex items-center justify-center h-full p-12 text-muted-foreground text-sm">
        Select a submission from the queue to begin review
      </div>
    );
  }

  const signals = submissionId === 'sub-002' ? availableSignals : availableSignals.map((s) => ({
    ...s,
    score: Math.round(s.score * (submission.riskScore / 91)),
  }));
  const ocrResult = submissionId === 'sub-002' ? availableOcrResult : availableOcrResult ? {
    ...availableOcrResult,
    submissionId,
    paperCode: submission.paperCode,
    setNumber: submission.setNumber,
    centreCode: submission.centreId,
  } : null;
  const duplicates = submissionId === 'sub-002' || submissionId === 'sub-001'
    ? availableDuplicates
    : [];
  const auditActions = submissionId === 'sub-002' ? availableReviewActions : availableReviewActions.map((a) => ({
    ...a,
    submissionId,
  }));

  return (
    <div className="flex h-full">
      {/* Evidence Column */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-thin">
        {/* Alert Banner */}
        {submission.riskLevel === 'HIGH' && !isReviewed && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-risk-high/30 gradient-red">
            <div className="w-2 h-2 rounded-full bg-risk-high animate-pulse-amber flex-shrink-0" />
            <p className="text-sm font-bold text-risk-high">
              HIGH-RISK ALERT — HUMAN REVIEW REQUIRED
            </p>
            <span className="ml-auto text-xs font-mono-data text-risk-high/70 flex-shrink-0">
              Risk Score: {submission.riskScore}/100
            </span>
          </div>
        )}

        {isReviewed && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-risk-low/25 gradient-green">
            <p className="text-sm font-semibold text-risk-low">
              ✓ This submission has been reviewed in this session
            </p>
          </div>
        )}

        {/* Case Metadata */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-semibold text-foreground">{submission.examName}</h2>
                <Badge variant={riskVariant[submission.riskLevel as RiskLevel]} size="md">
                  {submission.riskLevel} RISK
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono-data">
                {submission.id} · {submission.paperCode} · {submission.setNumber} · {submission.centreId}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-bold font-mono-data text-risk-high leading-none">
                {submission.riskScore}
              </p>
              <p className="text-2xs text-muted-foreground mt-0.5">Risk Score / 100</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Source', value: submission.source },
              { label: 'Post Timestamp', value: submission.postTimestamp.replace('T', ' ').slice(0, 16) },
              { label: 'Exam Date', value: submission.examDate },
              { label: 'Assigned To', value: submission.analyst },
            ].map((row) => (
              <div key={`meta-${row.label}`} className="bg-muted rounded-lg px-3 py-2">
                <p className="text-2xs text-muted-foreground uppercase tracking-widest mb-0.5">{row.label}</p>
                <p className="text-xs font-semibold text-foreground font-mono-data truncate">{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image Comparison */}
        <ImageComparisonPanel submission={submission} />

        {/* OCR Identifiers */}
        {ocrResult && <OcrIdentifiersPanel ocrResult={ocrResult} />}

        {/* Signal Breakdown */}
        <SignalBreakdownTable signals={signals} />

        {/* Duplicate Relations */}
        {duplicates.length > 0 && (
          <DuplicateRelationsPanel duplicates={duplicates} />
        )}

        {/* Matched Questions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Matched Question Excerpts
            <span className="text-2xs text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border ml-auto">
              Awaiting analysis
            </span>
          </h3>
          <div className="space-y-2">
                {ocrResult?.extractedQuestions.map((q, idx) => (
              <div
                key={`q-excerpt-${idx}`}
                className="px-3 py-2.5 rounded-lg border border-accent/15 bg-accent/5 text-xs text-foreground leading-relaxed"
              >
                <span className="font-mono-data text-muted-foreground mr-2">
                  QBK-MTH-{String(idx + 1).padStart(3, '0')}
                </span>
                {q}
              </div>
            ))}
          </div>
        </div>

        {/* Audit Trail */}
        <AuditTrail actions={auditActions} />
      </div>

      {/* Action Sidebar */}
      <div className="w-72 xl:w-80 flex-shrink-0 border-l border-border p-5 overflow-y-auto scrollbar-thin">
        <div className="sticky top-0 space-y-5">
          <RiskGauge score={submission.riskScore} riskLevel={submission.riskLevel as RiskLevel} />
          <ReviewActionPanel
            submissionId={submission.id}
            isReviewed={isReviewed}
            onDecision={onDecision}
          />
        </div>
      </div>
    </div>
  );
}