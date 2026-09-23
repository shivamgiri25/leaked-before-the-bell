'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';

import type { IngestFormData } from './types';
import { examinations } from '@/lib/appData';

const setCodes = ['SET-A', 'SET-B', 'SET-C', 'SET-D'];

interface Props {
  register: UseFormRegister<IngestFormData>;
  errors: FieldErrors<IngestFormData>;
  watchedValues: Partial<IngestFormData>;
  setValue: UseFormSetValue<IngestFormData>;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2ExamDetails({ register, errors, watchedValues, setValue, onNext, onBack }: Props) {
  const selectedExam = examinations.find((e) => e.id === watchedValues.examId);

  const handleExamSelect = (examId: string) => {
    setValue('examId', examId);
    const exam = examinations.find((e) => e.id === examId);
    if (exam) {
      setValue('examDate', exam.date);
      setValue('paperCode', exam.code);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Exam Selector */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          Examination <span className="text-risk-high">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Select the examination this paper is suspected to belong to
        </p>
        {examinations.length > 0 ? (
          <div className="space-y-2">
            {examinations.map((exam) => (
            <button
              key={`exam-sel-${exam.id}`}
              type="button"
              onClick={() => handleExamSelect(exam.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-all duration-150 active:scale-[0.99] ${
                watchedValues.examId === exam.id
                  ? 'bg-primary/10 border-primary' :'bg-muted border-border hover:border-primary/40'
              }`}
            >
              <div>
                <p className={`text-sm font-semibold ${watchedValues.examId === exam.id ? 'text-primary' : 'text-foreground'}`}>
                  {exam.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono-data">
                  {exam.code} · {exam.date}
                </p>
              </div>
              <span
                className={`text-2xs font-bold px-2 py-1 rounded-full border ${
                  exam.status === 'IN_PROGRESS' ?'text-primary bg-primary/10 border-primary/25' :'text-muted-foreground bg-muted border-border'
                }`}
              >
                {exam.status.replace('_', ' ')}
              </span>
            </button>
            ))}
          </div>
        ) : (
          <div>
            <input
              id="examId"
              type="text"
              placeholder="Enter examination ID or name"
              className={`w-full px-3 py-2.5 rounded-lg bg-input border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all font-mono-data ${
                errors.examId ? 'border-risk-high' : 'border-border focus:border-primary/50'
              }`}
              {...register('examId', { required: 'Examination selection is required' })}
            />
            <p className="mt-2 text-2xs text-muted-foreground">No examination database is connected. Enter the examination manually.</p>
          </div>
        )}
        {examinations.length > 0 && (
          <input type="hidden" {...register('examId', { required: 'Examination selection is required' })} />
        )}
        {errors.examId && (
          <p className="mt-1.5 text-xs text-risk-high">{errors.examId.message}</p>
        )}
      </div>

      {/* Fields Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="examDate" className="block text-sm font-semibold text-foreground mb-1.5">
            Exam Date <span className="text-risk-high">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Scheduled date of the examination (auto-filled from selection)
          </p>
          <input
            id="examDate"
            type="date"
            className={`w-full px-3 py-2.5 rounded-lg bg-input border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              errors.examDate ? 'border-risk-high' : 'border-border focus:border-primary/50'
            }`}
            {...register('examDate', { required: 'Exam date is required' })}
          />
          {errors.examDate && (
            <p className="mt-1.5 text-xs text-risk-high">{errors.examDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="centreId" className="block text-sm font-semibold text-foreground mb-1.5">
            Centre ID <span className="text-risk-high">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Examination centre code visible on the paper
          </p>
          <input
            id="centreId"
            type="text"
            placeholder="e.g. CTR-1042"
            className={`w-full px-3 py-2.5 rounded-lg bg-input border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all font-mono-data ${
              errors.centreId ? 'border-risk-high' : 'border-border focus:border-primary/50'
            }`}
            {...register('centreId', {
              required: 'Centre ID is required',
              pattern: { value: /^CTR-\d{4}$/, message: 'Format: CTR-XXXX' },
            })}
          />
          {errors.centreId && (
            <p className="mt-1.5 text-xs text-risk-high">{errors.centreId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="paperCode" className="block text-sm font-semibold text-foreground mb-1.5">
            Paper Code <span className="text-risk-high">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Paper code as printed on the exam paper (auto-filled from exam selection)
          </p>
          <input
            id="paperCode"
            type="text"
            placeholder="e.g. MTH-042"
            className={`w-full px-3 py-2.5 rounded-lg bg-input border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all font-mono-data ${
              errors.paperCode ? 'border-risk-high' : 'border-border focus:border-primary/50'
            }`}
            {...register('paperCode', { required: 'Paper code is required' })}
          />
          {errors.paperCode && (
            <p className="mt-1.5 text-xs text-risk-high">{errors.paperCode.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Set Number <span className="text-risk-high">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Paper set as visible on the exam paper
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {setCodes.map((s) => (
              <button
                key={`set-${s}`}
                type="button"
                onClick={() => setValue('setNumber', s)}
                className={`py-2.5 text-xs font-bold rounded-lg border transition-all duration-150 active:scale-95 ${
                  watchedValues.setNumber === s
                    ? 'bg-primary/15 border-primary text-primary' :'bg-muted border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {s.replace('SET-', '')}
              </button>
            ))}
          </div>
          <input type="hidden" {...register('setNumber', { required: 'Set number is required' })} />
          {errors.setNumber && (
            <p className="mt-1.5 text-xs text-risk-high">{errors.setNumber.message}</p>
          )}
        </div>
      </div>

      {/* Summary Card */}
      {selectedExam && (
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
          <p className="text-xs font-semibold text-accent mb-2">Selected Examination</p>
          <p className="text-sm font-semibold text-foreground">{selectedExam.name}</p>
          <div className="flex gap-4 mt-1.5 text-xs text-muted-foreground font-mono-data">
            <span>Code: {selectedExam.code}</span>
            <span>Date: {selectedExam.date}</span>
            <span className={selectedExam.status === 'IN_PROGRESS' ? 'text-primary font-semibold' : ''}>
              {selectedExam.status}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-muted border border-border text-foreground hover:bg-secondary transition-all duration-150 active:scale-95"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 active:scale-95"
        >
          Next: Review & Submit →
        </button>
      </div>
    </div>
  );
}