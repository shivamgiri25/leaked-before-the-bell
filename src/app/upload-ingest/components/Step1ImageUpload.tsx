'use client';

import React, { useRef } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Upload, ImageIcon, X } from 'lucide-react';
import type { IngestFormData } from './types';

const sourceChannels = [
  { id: 'src-whatsapp', value: 'WhatsApp', label: 'WhatsApp' },
  { id: 'src-telegram', value: 'Telegram', label: 'Telegram' },
  { id: 'src-twitter', value: 'Twitter/X', label: 'Twitter / X' },
  { id: 'src-facebook', value: 'Facebook', label: 'Facebook' },
  { id: 'src-email', value: 'Email Tip', label: 'Email Tip' },
  { id: 'src-other', value: 'Other', label: 'Other' },
];

interface Props {
  register: UseFormRegister<IngestFormData>;
  errors: FieldErrors<IngestFormData>;
  previewUrl: string | null;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  onFileSelect: (file: File) => void;
  setValue: UseFormSetValue<IngestFormData>;
  watchedValues: Partial<IngestFormData>;
  onNext: () => void;
}

export default function Step1ImageUpload({
  register,
  errors,
  previewUrl,
  isDragging,
  setIsDragging,
  onFileSelect,
  setValue,
  watchedValues,
  onNext,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Drop Zone */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          Suspicious Image <span className="text-risk-high">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Upload the suspicious exam paper image. Accepted: JPG, PNG, WEBP. Max 20MB.
        </p>

        {!previewUrl ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}
          >
            <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center">
              <Upload size={24} className={isDragging ? 'text-primary' : 'text-muted-foreground'} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, WEBP up to 20MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-border bg-muted group">
            <img src={previewUrl} alt="Uploaded suspicious exam paper image preview" className="w-full max-h-72 object-contain" />
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-xs font-semibold bg-card border border-border rounded-lg text-foreground hover:bg-secondary transition-colors"
              >
                Replace Image
              </button>
            </div>
            <div className="absolute top-2 right-2 bg-card/90 border border-border rounded-md px-2 py-1 text-2xs font-semibold text-risk-low flex items-center gap-1">
              <ImageIcon size={10} />
              Image loaded
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>

      {/* Source Channel */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          Source / Channel <span className="text-risk-high">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Where was this image originally posted or received?
        </p>
        <div className="grid grid-cols-3 gap-2">
          {sourceChannels.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setValue('source', ch.value)}
              className={`px-3 py-2.5 text-xs font-semibold rounded-lg border transition-all duration-150 active:scale-95 ${
                watchedValues.source === ch.value
                  ? 'bg-primary/15 border-primary text-primary' :'bg-muted border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>
        <input type="hidden" {...register('source', { required: 'Source channel is required' })} />
        {errors.source && (
          <p className="mt-1.5 text-xs text-risk-high">{errors.source.message}</p>
        )}
      </div>

      {/* Post Timestamp */}
      <div>
        <label htmlFor="postTimestamp" className="block text-sm font-semibold text-foreground mb-1.5">
          Post Timestamp <span className="text-risk-high">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Date and time when this image was posted on the source channel (used for timeline verification)
        </p>
        <input
          id="postTimestamp"
          type="datetime-local"
          className={`w-full px-3 py-2.5 rounded-lg bg-input border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
            errors.postTimestamp ? 'border-risk-high' : 'border-border focus:border-primary/50'
          }`}
          {...register('postTimestamp', { required: 'Post timestamp is required' })}
        />
        {errors.postTimestamp && (
          <p className="mt-1.5 text-xs text-risk-high">{errors.postTimestamp.message}</p>
        )}
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="caption" className="block text-sm font-semibold text-foreground mb-1.5">
            Caption / Message
          </label>
          <p className="text-xs text-muted-foreground mb-2">Optional text accompanying the image</p>
          <input
            id="caption"
            type="text"
            placeholder="e.g. Aaj ka paper — Mathematics"
            className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all"
            {...register('caption')}
          />
        </div>
        <div>
          <label htmlFor="postId" className="block text-sm font-semibold text-foreground mb-1.5">
            Post ID / Message ID
          </label>
          <p className="text-xs text-muted-foreground mb-2">Unique identifier from the source platform</p>
          <input
            id="postId"
            type="text"
            placeholder="e.g. TG-@examleaks2026"
            className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-all font-mono-data"
            {...register('postId')}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 active:scale-95"
        >
          Next: Exam Details →
        </button>
      </div>
    </div>
  );
}