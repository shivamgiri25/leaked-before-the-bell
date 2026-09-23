'use client';

import React from 'react';
import { submissions } from '@/lib/appData';
import Badge from '@/components/ui/Badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';

type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

const riskVariant: Record<RiskLevel, 'high' | 'medium' | 'low'> = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  reviewedIds: Set<string>;
}

export default function ReviewQueuePanel({ selectedId, onSelect, reviewedIds }: Props) {
  // Show HIGH and MEDIUM risk submissions
  const queue = submissions.filter((s) => s.riskLevel === 'HIGH' || s.riskLevel === 'MEDIUM');

  const pending = queue.filter((s) => !reviewedIds.has(s.id) && s.status !== 'FALSE_ALERT' && s.status !== 'REVIEWED');
  const done = queue.filter((s) => reviewedIds.has(s.id) || s.status === 'FALSE_ALERT' || s.status === 'REVIEWED');

  return (
    <div className="p-3 space-y-1">
      <div className="px-2 py-2 flex items-center gap-2">
        <AlertTriangle size={13} className="text-risk-high" />
        <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-widest">
          Pending Review ({pending.length})
        </p>
      </div>

      {pending.map((sub) => (
        <QueueItem
          key={`queue-${sub.id}`}
          sub={sub}
          isSelected={selectedId === sub.id}
          isReviewed={false}
          onSelect={onSelect}
        />
      ))}

      {done.length > 0 && (
        <>
          <div className="px-2 py-2 flex items-center gap-2 mt-3">
            <CheckCircle size={13} className="text-risk-low" />
            <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-widest">
              Reviewed ({done.length})
            </p>
          </div>
          {done.map((sub) => (
            <QueueItem
              key={`queue-done-${sub.id}`}
              sub={sub}
              isSelected={selectedId === sub.id}
              isReviewed
              onSelect={onSelect}
            />
          ))}
        </>
      )}
    </div>
  );
}

function QueueItem({
  sub,
  isSelected,
  isReviewed,
  onSelect,
}: {
  sub: (typeof submissions)[0];
  isSelected: boolean;
  isReviewed: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(sub.id)}
      className={`w-full text-left px-3 py-3 rounded-lg border transition-all duration-150 ${
        isSelected
          ? 'bg-primary/10 border-primary/40' :'bg-card border-border hover:border-primary/25 hover:bg-muted/40'
      } ${isReviewed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-2xs font-mono-data text-muted-foreground">{sub.id}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold font-mono-data text-foreground">{sub.riskScore}</span>
          <Badge variant={riskVariant[sub.riskLevel as RiskLevel]} size="sm">
            {sub.riskLevel}
          </Badge>
        </div>
      </div>
      <p className="text-xs font-semibold text-foreground truncate leading-snug mb-1">
        {sub.paperCode} — {sub.setNumber}
      </p>
      <p className="text-2xs text-muted-foreground truncate mb-1.5">
        {sub.examName.split(' — ')[0]}
      </p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-2xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {sub.source}
        </span>
        <span className="text-2xs font-mono-data text-muted-foreground">
          {formatTime(sub.submittedAt)}
        </span>
      </div>
      {sub.duplicateCount > 0 && (
        <div className="mt-1.5 text-2xs text-primary font-semibold">
          ⊕ {sub.duplicateCount} duplicate{sub.duplicateCount > 1 ? 's' : ''} detected
        </div>
      )}
    </button>
  );
}