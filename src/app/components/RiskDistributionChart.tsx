'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { riskDistributionData } from '@/lib/appData';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded border border-border px-3 py-2.5 shadow-xl text-xs"
      style={{ background: 'var(--card)' }}>
      <p className="font-semibold text-foreground text-xs">{d.name}</p>
      <p className="text-muted-foreground mt-1" style={{ fontSize: '10px' }}>
        Count: <span className="font-mono-data font-bold text-foreground">{d.value}</span>
      </p>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.08) return null;
  return (
    <text x={x} y={y} fill="rgba(255,255,255,0.9)" textAnchor="middle" dominantBaseline="central"
      fontSize={10} fontWeight={600} fontFamily="var(--font-mono)">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function RiskDistributionChart() {
  const total = riskDistributionData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-xl p-4 h-full flex flex-col" style={{ background: '#2f2f2f', border: '1px solid #3f3f3f' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#ececec', letterSpacing: '-0.01em' }}>Risk Distribution</h2>
          <p style={{ fontSize: '11px', color: '#8e8ea0', marginTop: '2px' }}>Current active submissions</p>
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#8e8ea0', background: '#383838', border: '1px solid #4a4a4a', padding: '3px 8px', borderRadius: '6px' }}>
          n={total}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center">
        {total === 0 ? <div className="flex h-[170px] items-center justify-center text-xs text-muted-foreground">No risk data available</div> : <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={riskDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={76}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              strokeWidth={0}
            >
              {riskDistributionData.map((entry, index) => (
                <Cell key={`cell-risk-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>}

        {/* Legend as a compact table */}
        <div className="w-full mt-2 space-y-1.5">
          {riskDistributionData.map((d, i) => (
            <div key={`legend-risk-${i}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                <span className="text-muted-foreground" style={{ fontSize: '10px' }}>{d.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 rounded-full" style={{
                  width: `${Math.round((d.value / total) * 60)}px`,
                  background: d.color,
                  opacity: 0.4
                }} />
                <span className="font-mono-data font-bold text-foreground" style={{ fontSize: '11px' }}>{d.value}</span>
                <span className="text-muted-foreground" style={{ fontSize: '9px' }}>
                  {Math.round((d.value / total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}