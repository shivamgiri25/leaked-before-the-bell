import React from 'react';
import { Upload, BookOpen, CheckCircle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const steps = [
  { id: 1, label: 'Image Upload', icon: Upload },
  { id: 2, label: 'Exam Details', icon: BookOpen },
  { id: 3, label: 'Review & Submit', icon: CheckCircle },
];

export default function StepProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between relative">
      {/* Connector line behind */}
      <div className="absolute top-5 left-0 right-0 h-px bg-border z-0" />
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isDone = step.id < currentStep;
        return (
          <div key={`step-${step.id}`} className="flex flex-col items-center gap-2 z-10 flex-1">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isDone
                  ? 'bg-primary border-primary text-primary-foreground'
                  : isActive
                  ? 'bg-primary/15 border-primary text-primary' :'bg-card border-border text-muted-foreground'
              }`}
            >
              {isDone ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <Icon size={15} />
              )}
            </div>
            <span
              className={`text-xs font-medium transition-colors duration-200 ${
                isActive ? 'text-primary' : isDone ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}