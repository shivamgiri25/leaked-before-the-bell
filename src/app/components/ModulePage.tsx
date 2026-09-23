import AppLayout from '@/components/AppLayout';

interface ModulePageProps {
  eyebrow: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}

export default function ModulePage({ eyebrow, title, description, stat, statLabel }: ModulePageProps) {
  return (
    <AppLayout>
      <div className="min-h-screen p-6 lg:p-8" style={{ background: '#212121' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">{eyebrow}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{description}</p>
            </div>
            <div className="rounded-lg border border-border bg-card px-5 py-3 min-w-32">
              <p className="text-2xl font-bold font-mono-data text-primary">{stat}</p>
              <p className="text-2xs uppercase tracking-widest text-muted-foreground mt-1">{statLabel}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-sm font-semibold text-foreground">Module ready</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              This workspace is connected to the forensic verification prototype. Data controls for this module will appear here when backend integration is enabled.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}