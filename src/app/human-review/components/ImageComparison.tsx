'use client';

import React, { useState } from 'react';
import { Submission } from '@/lib/appData';
import AppImage from '@/components/ui/AppImage';

interface Props {
  submission: Submission;
}

export default function ImageComparisonPanel({ submission }: Props) {
  const [activeTab, setActiveTab] = useState<'original' | 'processed'>('original');

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Image Evidence</h3>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(['original', 'processed'] as const).map((tab) => (
            <button
              key={`img-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                activeTab === tab
                  ? 'bg-primary/15 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab === 'original' ? 'Original' : 'Processed'}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-border bg-muted relative">
        <AppImage
          src={activeTab === 'original' ? submission.imageUrl : submission.processedImageUrl}
          alt={`${activeTab === 'original' ? 'Original' : 'Preprocessed'} suspicious exam paper image for submission ${submission.id}`}
          width={800}
          height={500}
          className="w-full max-h-64 object-contain"
        />
        <div className="absolute top-2 left-2 bg-card/90 border border-border rounded-md px-2 py-1 text-2xs font-mono-data text-muted-foreground">
          {submission.id} · {activeTab.toUpperCase()}
        </div>
        <div className="absolute top-2 right-2 bg-card/90 border border-border rounded-md px-2 py-1 text-2xs font-semibold text-risk-medium">
          IMAGE EVIDENCE
        </div>
      </div>

      {activeTab === 'processed' && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: 'Resolution', value: '1240×1754' },
            { label: 'Quality Score', value: '87/100' },
            { label: 'OCR Confidence', value: '91%' },
          ].map((item) => (
            <div key={`img-meta-${item.label}`} className="bg-muted rounded-lg px-3 py-2 text-center border border-border">
              <p className="text-2xs text-muted-foreground mb-0.5">{item.label}</p>
              <p className="text-xs font-bold font-mono-data text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}