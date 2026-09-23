'use client';

import React, { useState } from 'react';
import { CheckCircle, TrendingUp, XCircle, Loader2, AlertTriangle } from 'lucide-react';

interface Props {
  submissionId: string;
  isReviewed: boolean;
  onDecision: (id: string, decision: 'REVIEWED' | 'ESCALATED' | 'FALSE_ALERT', notes: string) => void;
}

type Decision = 'REVIEWED' | 'ESCALATED' | 'FALSE_ALERT';

export default function ReviewActionPanel({ submissionId, isReviewed, onDecision }: Props) {
  const [notes, setNotes] = useState('');
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDecision, setConfirmDecision] = useState<Decision | null>(null);

  const handleDecisionClick = (decision: Decision) => {
    if (decision === 'ESCALATED' || decision === 'FALSE_ALERT') {
      setConfirmDecision(decision);
    } else {
      submitDecision(decision);
    }
  };

  const submitDecision = async (decision: Decision) => {
    setIsLoading(true);
    setPendingDecision(decision);
    setConfirmDecision(null);
    // Backend integration: POST /api/review/{submissionId}
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setPendingDecision(null);
    onDecision(submissionId, decision, notes);
  };

  if (isReviewed) {
    return (
      <div className="bg-card border border-risk-low/25 rounded-xl p-5 text-center gradient-green">
        <CheckCircle size={28} className="text-risk-low mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">Review Complete</p>
        <p className="text-xs text-muted-foreground mt-1">
          Decision recorded for {submissionId}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <p className="text-sm font-semibold text-foreground">Reviewer Decision</p>

      {/* Notes */}
      <div>
        <label htmlFor="reviewer-notes" className="block text-xs font-semibold text-foreground mb-1.5">
          Reviewer Notes
        </label>
        <p className="text-2xs text-muted-foreground mb-2">
          Document your findings before making a decision (recommended)
        </p>
        <textarea
          id="reviewer-notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Serial number verified against CTR-1042 authorised range. Timeline strongly suspicious — posted 3h before exam. Recommend escalation..."
          className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 resize-none transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Confirm Modal inline */}
      {confirmDecision && (
        <div className="rounded-lg border border-risk-high/30 gradient-red p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-risk-high" />
            <p className="text-xs font-bold text-risk-high">
              Confirm: {confirmDecision === 'ESCALATED' ? 'Escalate for Investigation' : 'Mark as False Alert'}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {confirmDecision === 'ESCALATED' ?'This will escalate the case to the investigation team. This action is logged and cannot be undone.' :'Marking as false alert will close this case. Ensure you have reviewed all evidence before proceeding.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDecision(null)}
              className="flex-1 py-2 text-xs font-semibold rounded-lg bg-muted border border-border text-foreground hover:bg-secondary transition-all duration-150 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={() => submitDecision(confirmDecision)}
              className="flex-1 py-2 text-xs font-semibold rounded-lg bg-risk-high/20 border border-risk-high/40 text-risk-high hover:bg-risk-high/30 transition-all duration-150 active:scale-95"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Decision Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => handleDecisionClick('REVIEWED')}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg border border-risk-low/30 text-risk-low bg-risk-low/10 hover:bg-risk-low/20 transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && pendingDecision === 'REVIEWED' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <CheckCircle size={14} />
          )}
          Mark as Reviewed
        </button>

        <button
          onClick={() => handleDecisionClick('ESCALATED')}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg border border-risk-high/30 text-risk-high bg-risk-high/10 hover:bg-risk-high/20 transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && pendingDecision === 'ESCALATED' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <TrendingUp size={14} />
          )}
          Escalate for Investigation
        </button>

        <button
          onClick={() => handleDecisionClick('FALSE_ALERT')}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg border border-border text-muted-foreground bg-muted hover:bg-secondary hover:text-foreground transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && pendingDecision === 'FALSE_ALERT' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <XCircle size={14} />
          )}
          Mark as False Alert
        </button>
      </div>

      <p className="text-2xs text-muted-foreground text-center leading-relaxed">
        All decisions are permanently logged in the audit trail. This system does NOT automatically cancel examinations.
      </p>
    </div>
  );
}