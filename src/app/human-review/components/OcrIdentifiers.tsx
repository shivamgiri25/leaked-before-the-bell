import React from 'react';
import { OcrResult } from '@/lib/appData';
import { ScanLine } from 'lucide-react';

interface Props {
  ocrResult: OcrResult;
}

const fields = (ocr: OcrResult) => [
  { id: 'ocr-exam', label: 'Exam Name', value: ocr.examName, mono: false },
  { id: 'ocr-paper', label: 'Paper Code', value: ocr.paperCode, mono: true },
  { id: 'ocr-serial', label: 'Serial Number', value: ocr.serialNumber, mono: true },
  { id: 'ocr-set', label: 'Set Number', value: ocr.setNumber, mono: true },
  { id: 'ocr-centre', label: 'Centre Code', value: ocr.centreCode, mono: true },
  { id: 'ocr-barcode', label: 'Barcode Text', value: ocr.barcodeText, mono: true },
  { id: 'ocr-watermark', label: 'Watermark ID', value: ocr.watermarkId, mono: true },
  { id: 'ocr-confidence', label: 'OCR Confidence', value: `${ocr.ocrConfidence}%`, mono: true },
];

export default function OcrIdentifiersPanel({ ocrResult }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ScanLine size={14} className="text-accent" />
          OCR-Extracted Identifiers
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-risk-low" />
          <span className="text-2xs text-risk-low font-semibold">
            Confidence: {ocrResult.ocrConfidence}%
          </span>
          <span className="text-2xs text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border ml-2">
            VERIFIED DATA
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {fields(ocrResult).map((f) => (
          <div key={f.id} className="bg-muted rounded-lg px-3 py-2.5 border border-border">
            <p className="text-2xs text-muted-foreground uppercase tracking-widest mb-1 leading-none">
              {f.label}
            </p>
            <p
              className={`text-xs font-bold text-foreground truncate ${
                f.mono ? 'font-mono-data' : ''
              }`}
            >
              {f.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}