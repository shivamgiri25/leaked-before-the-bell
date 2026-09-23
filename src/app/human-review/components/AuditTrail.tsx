import React from 'react';
import { ReviewAction } from '@/lib/appData';
import { Activity } from 'lucide-react';

const actionColors: Record<string, string> = {
  SUBMISSION_INGESTED: 'bg-accent/20 text-accent border-accent/25',
  PREPROCESSING_COMPLETE: 'bg-accent/20 text-accent border-accent/25',
  DUPLICATE_DETECTED: 'bg-primary/20 text-primary border-primary/25',
  VERIFICATION_COMPLETE: 'bg-risk-high/20 text-risk-high border-risk-high/25',
  ASSIGNED_FOR_REVIEW: 'bg-muted-foreground/15 text-muted-foreground border-border',
  REVIEWED: 'bg-risk-low/20 text-risk-low border-risk-low/25',
  ESCALATED: 'bg-risk-high/20 text-risk-high border-risk-high/25',
  FALSE_ALERT: 'bg-muted-foreground/15 text-muted-foreground border-border',
};

interface Props {
  actions: ReviewAction[];
}

export default function AuditTrail({ actions }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
        <Activity size={14} className="text-muted-foreground" />
        Audit Trail — Chain of Custody
      </h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {actions.map((action) => (
            <div key={`audit-${action.id}`} className="flex gap-4 relative">
              <div className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0 z-10">
                <div className="w-2 h-2 rounded-full bg-primary/60" />
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span
                    className={`text-2xs font-bold px-2 py-0.5 rounded border ${
                      actionColors[action.action] || 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {action.action.replace(/_/g, ' ')}
                  </span>
                  <span className="text-2xs font-mono-data text-muted-foreground flex-shrink-0">
                    {action.timestamp.replace('T', ' ').slice(0, 19)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{action.notes}</p>
                <p className="text-2xs text-muted-foreground/60 mt-0.5">by {action.actor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}