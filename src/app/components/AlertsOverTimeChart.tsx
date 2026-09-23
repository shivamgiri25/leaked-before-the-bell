'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { alertsOverTimeData } from '@/lib/appData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-border px-3 py-2.5 shadow-xl text-xs space-y-1.5"
      style={{ background: 'var(--card)' }}>
      <p className="font-mono-data text-muted-foreground mb-1.5" style={{ fontSize: '10px' }}>{label}</p>
      {payload.map((p: any) => (
        <div key={`tt-${p.dataKey}`} className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize" style={{ fontSize: '10px' }}>{p.name}</span>
          <span className="font-mono-data font-semibold text-foreground ml-auto" style={{ fontSize: '11px' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AlertsOverTimeChart() {
  return (
    <div className="rounded-xl p-4 h-full" style={{ background: '#2f2f2f', border: '1px solid #3f3f3f' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#ececec', letterSpacing: '-0.01em' }}>Alert Volume</h2>
          <p style={{ fontSize: '11px', color: '#8e8ea0', marginTop: '2px' }}>Submissions by risk level · past 14 days</p>
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#8e8ea0', background: '#383838', border: '1px solid #4a4a4a', padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.05em' }}>
          LIVE DATA
        </span>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={alertsOverTimeData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--risk-high)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--risk-high)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--risk-medium)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--risk-medium)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--risk-low)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--risk-low)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" strokeOpacity={0.6} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="high" name="High" stroke="var(--risk-high)" fill="url(#gradHigh)" strokeWidth={1.5} dot={false} />
          <Area type="monotone" dataKey="medium" name="Medium" stroke="var(--risk-medium)" fill="url(#gradMedium)" strokeWidth={1.5} dot={false} />
          <Area type="monotone" dataKey="low" name="Low" stroke="var(--risk-low)" fill="url(#gradLow)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      {/* Manual legend — more control than recharts default */}
      <div className="flex items-center gap-4 mt-3 pl-1">
        {[
          { label: 'High', color: 'var(--risk-high)' },
          { label: 'Medium', color: 'var(--risk-medium)' },
          { label: 'Low', color: 'var(--risk-low)' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{ background: l.color }} />
            <span className="text-muted-foreground" style={{ fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}