'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Step1ImageUpload from './Step1ImageUpload';
import Step2ExamDetails from './Step2ExamDetails';
import Step3ReviewSubmit from './Step3ReviewSubmit';
import StepProgressBar from './StepProgressBar';
import type { IngestFormData } from './types';
import type { UserReport } from '@/lib/appData';

export default function UploadIngestClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [suspiciousFile, setSuspiciousFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<IngestFormData>({
    defaultValues: {
      source: '',
      postTimestamp: '',
      caption: '',
      postId: '',
      examId: '',
      examDate: '',
      centreId: '',
      paperCode: '',
      setNumber: '',
    },
  });

  const watchedValues = watch();

  const handleFileSelect = useCallback((file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSuspiciousFile(file);
  }, [previewUrl]);

  const goNext = async () => {
    let fields: (keyof IngestFormData)[] = [];
    if (currentStep === 1) fields = ['source', 'postTimestamp'];
    if (currentStep === 2) fields = ['examId', 'examDate', 'centreId', 'paperCode', 'setNumber'];
    const valid = await trigger(fields) && Boolean(suspiciousFile);
    if (valid) setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: IngestFormData) => {
    setIsSubmitting(true);
    // Replace local persistence with POST /api/upload and POST /api/analyze/{id} in production.
    await new Promise((r) => setTimeout(r, 2800));
    const caseId = `CASE-${Date.now().toString().slice(-6)}`;
    const imageData = suspiciousFile ? await fileToDataUrl(suspiciousFile) : undefined;
    const report: UserReport = {
      id: caseId,
      submittedAt: new Date().toISOString(),
      userName: sessionStorage.getItem('lbb-user-name') || 'User',
      userEmail: sessionStorage.getItem('lbb-user-email') || '',
      source: data.source,
      postTimestamp: data.postTimestamp,
      examId: data.examId,
      examDate: data.examDate,
      centreId: data.centreId,
      paperCode: data.paperCode,
      setNumber: data.setNumber,
      caption: data.caption,
      postId: data.postId,
      imageName: suspiciousFile?.name || 'uploaded-paper',
      imageData,
      status: 'SUBMITTED',
    };
    const existingReports: UserReport[] = JSON.parse(localStorage.getItem('lbb-reports') || '[]');
    localStorage.setItem('lbb-reports', JSON.stringify([report, ...existingReports].slice(0, 10)));
    setSubmittedId(caseId);
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success(`Report ${caseId} submitted for review.`);
  };

  return (
    <div className="min-h-screen" style={{ background: '#212121' }}>
      {/* Header */}
      <div className="px-6 lg:px-8 xl:px-10 py-4" style={{ borderBottom: '1px solid #2f2f2f' }}>
        <div className="flex items-center gap-2 mb-1">
          <h1 style={{ fontSize: '16px', fontWeight: 600, color: '#ececec', letterSpacing: '-0.01em' }}>Upload / Ingest Suspicious Image</h1>
          <span style={{ padding: '2px 8px', fontSize: '10px', fontWeight: 600, borderRadius: '6px', background: 'rgba(16,163,127,0.08)', color: '#10a37f', border: '1px solid rgba(16,163,127,0.2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            LIVE INGEST
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#8e8ea0', marginTop: '2px' }}>
          Ingest a suspicious exam paper image and begin the multi-signal verification pipeline
        </p>
      </div>

      <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-8">
        <div className="max-w-3xl mx-auto">
          {!submitted ? (
            <>
              <StepProgressBar currentStep={currentStep} />

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                {currentStep === 1 && (
                  <Step1ImageUpload
                    register={register}
                    errors={errors}
                    previewUrl={previewUrl}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    onFileSelect={handleFileSelect}
                    setValue={setValue}
                    watchedValues={watchedValues}
                    onNext={goNext}
                  />
                )}
                {currentStep === 2 && (
                  <Step2ExamDetails
                    register={register}
                    errors={errors}
                    watchedValues={watchedValues}
                    setValue={setValue}
                    onNext={goNext}
                    onBack={goBack}
                  />
                )}
                {currentStep === 3 && (
                  <Step3ReviewSubmit
                    watchedValues={watchedValues}
                    previewUrl={previewUrl}
                    suspiciousFile={suspiciousFile}
                    isSubmitting={isSubmitting}
                    onBack={goBack}
                  />
                )}
              </form>
            </>
          ) : (
            <SubmissionSuccess submittedId={submittedId} onReset={() => { setSubmitted(false); setCurrentStep(1); setPreviewUrl(null); setSuspiciousFile(null); }} />
          )}
        </div>
      </div>
    </div>
  );
}

function SubmissionSuccess({ submittedId, onReset }: { submittedId: string | null; onReset: () => void }) {
  return (
    <div className="rounded-xl p-10 text-center" style={{ background: '#2f2f2f', border: '1px solid rgba(16,163,127,0.2)' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(16,163,127,0.1)', border: '1px solid rgba(16,163,127,0.25)' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10a37f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ececec', marginBottom: '8px' }}>Report Submitted</h2>
      <p style={{ fontSize: '13px', color: '#8e8ea0', marginBottom: '4px' }}>
        Submission ID:{' '}
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#ececec' }}>{submittedId}</span>
      </p>
      <p style={{ fontSize: '13px', color: '#8e8ea0', marginBottom: '24px' }}>
        Your suspicious-paper report is queued. Track its status from My Reports.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onReset}
          className="transition-all duration-150 active:scale-95"
          style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 500, borderRadius: '8px', background: '#383838', border: '1px solid #4a4a4a', color: '#ececec', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#424242')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#383838')}
        >
          Ingest Another Image
        </button>
        <a
          href="/my-reports"
          className="transition-all duration-150 active:scale-95"
          style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 500, borderRadius: '8px', background: '#10a37f', color: '#ffffff', textDecoration: 'none', display: 'inline-block' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#0d8f6e')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#10a37f')}
        >
          Track My Report
        </a>
      </div>
    </div>
  );
}

async function fileToDataUrl(file: File): Promise<string> {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = sourceUrl;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Unable to read uploaded image'));
    });
    const maxDimension = 1400;
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.78);
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}