import React from 'react';
import AppLayout from '@/components/AppLayout';
import HumanReviewClient from './components/HumanReviewHeader';

// Backend integration: GET /api/alerts?status=PENDING_REVIEW, GET /api/alerts/{id} for full detail
export default function HumanReviewPage() {
  return (
    <AppLayout>
      <HumanReviewClient />
    </AppLayout>
  );
}