import ModulePage from '@/app/components/ModulePage';

export default function AuditLogsPage() {
  return (
    <ModulePage
      eyebrow="System"
      title="Audit Logs"
      description="Track investigator decisions, automated risk assessments, and changes made across the review workflow."
      stat="128"
      statLabel="events today"
    />
  );
}