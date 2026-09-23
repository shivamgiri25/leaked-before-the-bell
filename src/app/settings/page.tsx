'use client';

import { useState } from 'react';
import { Bell, Check, Database, KeyRound, RotateCcw, Save, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/AppLayout';

interface SettingsState {
  highRiskThreshold: number;
  mediumRiskThreshold: number;
  assignedTeam: string;
  emailAlerts: boolean;
  browserAlerts: boolean;
  dailyDigest: boolean;
  retentionDays: string;
  autoArchive: boolean;
}

const initialSettings: SettingsState = {
  highRiskThreshold: 75,
  mediumRiskThreshold: 45,
  assignedTeam: 'Forensic Review Team',
  emailAlerts: true,
  browserAlerts: true,
  dailyDigest: false,
  retentionDays: '180',
  autoArchive: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);

  const update = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const saveSettings = () => {
    toast.success('Settings saved for this session.');
  };

  const resetSettings = () => {
    setSettings(initialSettings);
    toast('Settings restored to defaults.');
  };

  return (
    <AppLayout>
      <div className="min-h-screen p-6 lg:p-8" style={{ background: '#212121' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">System</p>
              <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                Configure detection thresholds, review ownership, alerts, and data handling for the investigation workspace.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-risk-low/25 bg-risk-low/5 px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-risk-low" />
              <span className="text-xs font-semibold text-risk-low">SYSTEM ONLINE</span>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] mt-6">
            <div className="space-y-5">
              <SettingsSection icon={SlidersHorizontal} title="Risk detection" description="Choose when automated analysis escalates a submission for human review.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberField label="High-risk threshold" value={settings.highRiskThreshold} suffix="/ 100" onChange={(value) => update('highRiskThreshold', value)} />
                  <NumberField label="Medium-risk threshold" value={settings.mediumRiskThreshold} suffix="/ 100" onChange={(value) => update('mediumRiskThreshold', value)} />
                </div>
                <p className="text-2xs text-muted-foreground mt-3">Scores at or above the high threshold appear as urgent alerts. Medium scores enter the standard review queue.</p>
              </SettingsSection>

              <SettingsSection icon={UserRound} title="Review workflow" description="Control who receives new alerts and how cases move through review.">
                <label className="block text-xs font-semibold text-foreground mb-2" htmlFor="assigned-team">Default review team</label>
                <select id="assigned-team" value={settings.assignedTeam} onChange={(event) => update('assignedTeam', event.target.value)} className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary">
                  <option>Forensic Review Team</option>
                  <option>Examination Authority</option>
                  <option>Regional Investigations</option>
                </select>
                <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-muted px-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Require a decision note</p>
                    <p className="text-2xs text-muted-foreground mt-1">Keep an explanation with every review action.</p>
                  </div>
                  <Check className="text-risk-low" size={17} />
                </div>
              </SettingsSection>

              <SettingsSection icon={Bell} title="Notifications" description="Select which events should notify investigators immediately.">
                <ToggleRow label="Email alerts" description="Send high-risk and duplicate alerts to the review team." checked={settings.emailAlerts} onChange={(value) => update('emailAlerts', value)} />
                <ToggleRow label="Browser notifications" description="Show live alerts while the dashboard is open." checked={settings.browserAlerts} onChange={(value) => update('browserAlerts', value)} />
                <ToggleRow label="Daily digest" description="Receive a summary of new submissions at 09:00 IST." checked={settings.dailyDigest} onChange={(value) => update('dailyDigest', value)} />
              </SettingsSection>

              <SettingsSection icon={Database} title="Data retention" description="Define how long evidence and audit records remain available.">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <label className="text-sm font-medium text-foreground" htmlFor="retention-days">Evidence retention</label>
                    <p className="text-2xs text-muted-foreground mt-1">Days before archived evidence is removed.</p>
                  </div>
                  <select id="retention-days" value={settings.retentionDays} onChange={(event) => update('retentionDays', event.target.value)} className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">1 year</option>
                    <option value="730">2 years</option>
                  </select>
                </div>
                <ToggleRow label="Auto-archive reviewed cases" description="Move resolved cases out of the active investigation queue." checked={settings.autoArchive} onChange={(value) => update('autoArchive', value)} />
              </SettingsSection>
            </div>

            <aside className="space-y-5">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Workspace access</h2>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Your role controls access to evidence, decisions, and audit history.</p>
                <div className="mt-4 rounded-lg border border-border bg-muted px-3 py-3">
                  <p className="text-2xs uppercase tracking-widest text-muted-foreground">Current role</p>
                  <p className="text-sm font-semibold text-foreground mt-1">Senior Investigator</p>
                </div>
                <button type="button" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-foreground">
                  <KeyRound size={14} /> Manage access keys
                </button>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-2xs uppercase tracking-widest text-muted-foreground">Configuration status</p>
                <p className="text-3xl font-bold font-mono-data text-primary mt-2">READY</p>
                <p className="text-xs text-muted-foreground mt-2">Changes apply to this local prototype session.</p>
              </div>
            </aside>
          </div>

          <div className="sticky bottom-4 mt-6 flex items-center justify-end gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur">
            <button type="button" onClick={resetSettings} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
              <RotateCcw size={14} /> Reset
            </button>
            <button type="button" onClick={saveSettings} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
              <Save size={14} /> Save changes
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SettingsSection({ icon: Icon, title, description, children }: { icon: typeof SlidersHorizontal; title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3 border-b border-border pb-4">
        <Icon size={17} className="mt-0.5 text-primary" />
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      <div className="pt-4">{children}</div>
    </section>
  );
}

function NumberField({ label, value, suffix, onChange }: { label: string; value: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <label className="block text-xs font-semibold text-foreground">
      {label}
      <span className="mt-2 flex items-center rounded-lg border border-border bg-muted px-3 focus-within:border-primary">
        <input type="number" min="0" max="100" value={value} onChange={(event) => onChange(Math.min(100, Math.max(0, Number(event.target.value))))} className="w-full bg-transparent py-2 text-sm text-foreground outline-none" />
        <span className="text-xs text-muted-foreground">{suffix}</span>
      </span>
    </label>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-border py-3 last:border-0 last:pb-0 first:pt-0">
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="block text-2xs text-muted-foreground mt-1">{description}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
    </label>
  );
}
