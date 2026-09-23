import React from 'react';
import {
  AlertTriangle,
  Clock,
  Copy,
  CheckCircle,
  Activity,
  Timer,
  XCircle,
  FileSearch,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface KPICardProps {
  id: string;
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  variant: 'hero' | 'danger' | 'warning' | 'success' | 'info' | 'neutral';
  size?: 'wide' | 'tall' | 'default';
  trend?: { direction: 'up' | 'down' | 'neutral'; label: string };
  note?: string;
}

const cards: KPICardProps[] = [
  {
    id: 'kpi-submissions',
    label: 'Total Submissions',
    value: '3',
    subtext: '3 active cases',
    icon: FileSearch,
    variant: 'neutral',
    size: 'wide',
    note: 'Local fixture data',
  },
  {
    id: 'kpi-high-risk',
    label: 'High-Risk Alerts',
    value: '2',
    subtext: '2 unreviewed',
    icon: AlertTriangle,
    variant: 'danger',
  },
  {
    id: 'kpi-pending',
    label: 'Pending Reviews',
    value: '2',
    subtext: 'Requires human action',
    icon: Clock,
    variant: 'warning',
  },
  {
    id: 'kpi-duplicates',
    label: 'Duplicates',
    value: '1',
    subtext: 'pHash match group',
    icon: Copy,
    variant: 'warning',
  },
  {
    id: 'kpi-verified',
    label: 'Verified Clean',
    value: '0',
    subtext: 'No verified cases',
    icon: CheckCircle,
    variant: 'success',
  },
  {
    id: 'kpi-avg-risk',
    label: 'Avg Risk Score',
    value: '77.7',
    subtext: 'Across active submissions',
    icon: Activity,
    variant: 'info',
    size: 'wide',
    note: 'Elevated — review required',
  },
  {
    id: 'kpi-timeline-suspicious',
    label: 'Timeline Suspicious',
    value: '67%',
    subtext: 'Posted before exam end',
    icon: Timer,
    variant: 'danger',
  },
  {
    id: 'kpi-false-alert',
    label: 'False Alert Rate',
    value: '0%',
    subtext: 'No cleared cases yet',
    icon: XCircle,
    variant: 'neutral',
  },
];

const variantStyles: Record<KPICardProps['variant'], { bg: string; border: string; iconColor: string; valueColor: string }> = {
  hero:    { bg: 'rgba(99,102,241,0.06)',  border: 'rgba(99,102,241,0.18)',  iconColor: '#6366f1', valueColor: '#ececec' },
  danger:  { bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.18)',   iconColor: '#ef4444', valueColor: '#ef4444' },
  warning: { bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.18)',  iconColor: '#f59e0b', valueColor: '#f59e0b' },
  success: { bg: 'rgba(16,163,127,0.06)',  border: 'rgba(16,163,127,0.18)', iconColor: '#10a37f', valueColor: '#10a37f' },
  info:    { bg: 'rgba(99,102,241,0.06)',  border: 'rgba(99,102,241,0.18)',  iconColor: '#6366f1', valueColor: '#6366f1' },
  neutral: { bg: '#2f2f2f',               border: '#3f3f3f',               iconColor: '#8e8ea0', valueColor: '#ececec' },
};

const TrendIcon = ({ direction }: { direction: 'up' | 'down' | 'neutral' }) => {
  if (direction === 'up') return <TrendingUp size={11} style={{ color: '#ef4444' }} />;
  if (direction === 'down') return <TrendingDown size={11} style={{ color: '#10a37f' }} />;
  return <Minus size={11} style={{ color: '#8e8ea0' }} />;
};

function KPICard({ label, value, subtext, icon: Icon, variant, size, trend, note }: KPICardProps) {
  const isWide = size === 'wide';
  const styles = variantStyles[variant];

  return (
    <div
      className={`rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 ${isWide ? 'col-span-2' : 'col-span-1'}`}
      style={{ background: styles.bg, border: `1px solid ${styles.border}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p style={{ fontSize: '11px', fontWeight: 500, color: '#8e8ea0', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.2 }}>
          {label}
        </p>
        <Icon size={14} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: '1px', color: styles.iconColor }} />
      </div>

      <div className="flex items-end gap-2">
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            lineHeight: 1,
            fontSize: isWide ? '2.25rem' : '1.875rem',
            color: styles.valueColor,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
        {trend && (
          <div className="flex items-center gap-1 mb-0.5">
            <TrendIcon direction={trend.direction} />
            <span style={{ fontSize: '10px', color: '#8e8ea0' }}>{trend.label}</span>
          </div>
        )}
      </div>

      <p style={{ fontSize: '11px', color: '#8e8ea0', lineHeight: 1.4 }}>{subtext}</p>

      {note && isWide && (
        <p
          style={{ fontSize: '10px', color: '#8e8ea0', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '2px', lineHeight: 1.4 }}
        >
          {note}
        </p>
      )}
    </div>
  );
}

export default function KPIBentoGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <KPICard key={card.id} {...card} />
      ))}
    </div>
  );
}