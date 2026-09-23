import React from 'react';

type BadgeVariant = 'high' | 'medium' | 'low' | 'info' | 'muted' | 'pass' | 'fail' | 'warn' | 'unknown';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  high: 'risk-badge-high',
  medium: 'risk-badge-medium',
  low: 'risk-badge-low',
  info: 'bg-accent/10 text-accent border border-accent/25',
  muted: 'bg-muted text-muted-foreground border border-border',
  pass: 'bg-[rgba(34,197,94,0.1)] text-[#22c55e] border border-[rgba(34,197,94,0.25)]',
  fail: 'bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.25)]',
  warn: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.25)]',
  unknown: 'bg-muted text-muted-foreground border border-border',
};

export default function Badge({ variant, children, className = '', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-2xs';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold leading-none ${sizeClass} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}