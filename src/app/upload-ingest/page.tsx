import React from 'react';
import AppLayout from '@/components/AppLayout';
import UploadIngestClient from './components/UploadIngestContent';

// Backend integration: form submit calls POST /api/upload, then POST /api/analyze/{submission_id}
export default function UploadIngestPage() {
  return (
    <AppLayout>
      <UploadIngestClient />
    </AppLayout>
  );
}