'use client';

import React, { useState, useEffect } from 'react';
import type { IngestFormData } from './types';
import { CheckCircle, Loader2, ImageIcon, Hash } from 'lucide-react';

interface Props {
  watchedValues: Partial<IngestFormData>;
  previewUrl: string | null;
  suspiciousFile: File | null;
  isSubmitting: boolean;
  onBack: () => void;
}

const pipelineSteps = [
  { id: 'pipe-validate', label: 'Image validation', detail: 'File type, size, resolution check' },
  { id: 'pipe-resize', label: 'Resize & normalise', detail: 'Standardising to 1240×1754px' },
  { id: 'pipe-contrast', label: 'Contrast enhancement', detail: 'CLAHE adaptive histogram equalisation' },
  { id: 'pipe-noise', label: 'Noise removal', detail: 'Gaussian blur denoising' },
  { id: 'pipe-phash', label: 'pHash generation', detail: 'Perceptual hash computation' },
  { id: 'pipe-duplicate', label: 'Duplicate detection', detail: 'Hamming distance against 10 existing hashes' },
];

export default function Step3ReviewSubmit({ watchedValues, previewUrl, suspiciousFile, isSubmitting, onBack }: Props) {
  const [pipelineProgress, setPipelineProgress] = useState(0);

  useEffect(() => {
    if (!isSubmitting) return;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setPipelineProgress(step);
      if (step >= pipelineSteps.length) clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Preview */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <ImageIcon size={14} className="text-muted-foreground" />
            Image Preview
          </p>
          {previewUrl ? (
            <div className="rounded-lg overflow-hidden border border-border bg-muted">
              <img src={previewUrl} alt="Suspicious exam paper image submitted for verification" className="w-full max-h-48 object-contain" />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted h-48 flex items-center justify-center">
              <p className="text-xs text-muted-foreground">No image uploaded</p>
            </div>
          )}
        </div>

        {/* Submission Summary */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Submission Details</p>
          <div className="space-y-2">
            {[
              { label: 'Source', value: watchedValues.source || '—' },
              { label: 'Post Timestamp', value: watchedValues.postTimestamp || '—' },
              { label: 'Paper Code', value: watchedValues.paperCode || '—' },
              { label: 'Set Number', value: watchedValues.setNumber || '—' },
              { label: 'Centre ID', value: watchedValues.centreId || '—' },
              { label: 'Exam Date', value: watchedValues.examDate || '—' },
            ].map((row) => (
              <div key={`summary-${row.label}`} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-semibold text-foreground font-mono-data">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preprocessing Pipeline */}
      <div className="bg-muted rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Hash size={14} className="text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">Preprocessing Pipeline</p>
          <span className="text-2xs text-muted-foreground bg-card px-2 py-0.5 rounded border border-border ml-auto">
            Processing status
          </span>
        </div>
        <div className="space-y-2">
          {pipelineSteps.map((step, idx) => {
            const done = pipelineProgress > idx;
            const active = isSubmitting && pipelineProgress === idx;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-200 ${
                  done
                    ? 'signal-pass-bg'
                    : active
                    ? 'bg-primary/5 border-primary/20' :'bg-card border-border opacity-50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  done ? 'bg-risk-low/20' : active ? 'bg-primary/15' : 'bg-muted'
                }`}>
                  {done ? (
                    <CheckCircle size={12} className="text-risk-low" />
                  ) : active ? (
                    <Loader2 size={12} className="text-primary animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  <p className="text-2xs text-muted-foreground truncate">{step.detail}</p>
                </div>
                {done && step.id === 'pipe-phash' && (
                  <span className="text-2xs font-mono-data text-muted-foreground bg-card px-2 py-0.5 rounded border border-border">
                    Awaiting result
                  </span>
                )}
                {done && step.id === 'pipe-duplicate' && (
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded border text-muted-foreground bg-muted border-border">
                    BACKEND ANALYSIS PENDING
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* pHash Display (after processing) */}
      {pipelineProgress >= 5 && (
        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
              Computed pHash
            </p>
            <p className="font-mono-data text-lg font-bold text-foreground tracking-widest">
              Awaiting result
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Hamming Distance to nearest</p>
            <p className="font-mono-data text-2xl font-bold text-muted-foreground">—</p>
            <p className="text-2xs text-muted-foreground">Backend analysis pending</p>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-muted border border-border text-foreground hover:bg-secondary transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-[180px] justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Ingesting...</span>
            </>
          ) : (
            'Ingest Submission →'
          )}
        </button>
      </div>
    </div>
  );
}

