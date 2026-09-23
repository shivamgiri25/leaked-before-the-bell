import React from 'react';
import { DuplicateRelation } from '@/lib/appData';
import { Copy } from 'lucide-react';
import Badge from '@/components/ui/Badge';

const relTypeLabels: Record<DuplicateRelation['relationshipType'], string> = {
  EXACT_DUPLICATE: 'Exact Duplicate',
  COMPRESSED_COPY: 'Compressed Copy',
  CROPPED_VARIANT: 'Cropped Variant',
  MODIFIED_COPY: 'Modified Copy',
};

const relTypeVariant: Record<DuplicateRelation['relationshipType'], 'fail' | 'warn' | 'medium' | 'info'> = {
  EXACT_DUPLICATE: 'fail',
  COMPRESSED_COPY: 'warn',
  CROPPED_VARIANT: 'warn',
  MODIFIED_COPY: 'info',
};

interface Props {
  duplicates: DuplicateRelation[];
}

export default function DuplicateRelationsPanel({ duplicates }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
        <Copy size={14} className="text-primary" />
        Duplicate Image Relationships
        <span className="text-2xs text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border ml-auto">
          pHash — Hamming Distance
        </span>
      </h3>

      <div className="space-y-3">
        {duplicates.map((dup) => (
          <div
            key={`dup-rel-${dup.id}`}
            className="rounded-lg border border-primary/20 gradient-amber p-4"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-muted rounded-lg px-3 py-1.5 text-xs font-mono-data font-semibold text-foreground border border-border">
                  {dup.submissionId}
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-px w-12 bg-primary/50" />
                  <span className="text-2xs text-primary font-bold mt-0.5">dist={dup.hashDistance}</span>
                </div>
                <div className="bg-muted rounded-lg px-3 py-1.5 text-xs font-mono-data font-semibold text-foreground border border-border">
                  {dup.matchedSubmissionId}
                </div>
              </div>
              <Badge variant={relTypeVariant[dup.relationshipType]} size="sm">
                {relTypeLabels[dup.relationshipType]}
              </Badge>
            </div>
            <div className="flex gap-4 text-2xs text-muted-foreground">
              <span>Matched source: <span className="text-foreground font-semibold">{dup.matchedSource}</span></span>
              <span>Detected: <span className="font-mono-data text-foreground">{dup.matchedAt.replace('T', ' ').slice(0, 16)}</span></span>
              <span>Hash distance: <span className="font-mono-data font-bold text-primary">{dup.hashDistance}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}