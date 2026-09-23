'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

const riskColors: Record<RiskLevel, string> = {
  HIGH: 'var(--risk-high)',
  MEDIUM: 'var(--risk-medium)',
  LOW: 'var(--risk-low)',
};

const riskLabels: Record<RiskLevel, string> = {
  HIGH: 'HIGH RISK — Immediate review required',
  MEDIUM: 'MEDIUM RISK — Review recommended',
  LOW: 'LOW RISK — Likely safe',
};

interface Props {
  score: number;
  riskLevel: RiskLevel;
}

export default function RiskGauge({ score, riskLevel }: Props) {
  const data = [{ name: 'risk', value: score, fill: riskColors[riskLevel] }];

  return (
    <div className="bg-card border border-border rounded-xl p-5 text-center">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        Risk Confidence Score
      </p>

      <div className="relative">
        <ResponsiveContainer width="100%" height={140}>
          <RadialBarChart
            cx="50%"
            cy="75%"
            innerRadius="65%"
            outerRadius="90%"
            startAngle={180}
            endAngle={0}
            data={data}
            barSize={12}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              background={{ fill: 'var(--muted)' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pb-2">
          <span
            className="text-4xl font-bold font-mono-data leading-none"
            style={{ color: riskColors[riskLevel] }}
          >
            {score}
          </span>
          <span className="text-xs text-muted-foreground mt-1">/ 100</span>
        </div>
      </div>

      <div
        className="mt-3 px-3 py-2 rounded-lg text-xs font-semibold leading-snug"
        style={{
          background: `${riskColors[riskLevel]}18`,
          color: riskColors[riskLevel],
          border: `1px solid ${riskColors[riskLevel]}30`,
        }}
      >
        {riskLabels[riskLevel]}
      </div>

      <p className="text-2xs text-muted-foreground mt-3 leading-relaxed">
        ⚠ This score is an AI-assisted assessment. It does NOT confirm a paper leak. Human review is required before any action.
      </p>
    </div>
  );
}