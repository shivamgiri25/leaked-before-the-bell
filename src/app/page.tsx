import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardHeader from './components/DashboardHeader';
import KPIBentoGrid from './components/KPIBentoGrid';
import AlertsOverTimeChart from './components/AlertsOverTimeChart';
import RiskDistributionChart from './components/RiskDistributionChart';
import ActiveAlertsFeed from './components/ActiveAlertsFeed';
import RecentSubmissionsTable from './components/RecentSubmissionsTable';

export default function InvestigationDashboardPage() {
  return (
    <AppLayout>
      <div className="min-h-screen" style={{ background: '#212121' }}>
        <DashboardHeader />
        <div className="px-6 lg:px-8 xl:px-10 pb-10 space-y-5 pt-5">
          {/* Data connection status */}
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}
          >
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse-amber" style={{ background: '#ef4444' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#ef4444', fontSize: '10px', letterSpacing: '0.07em' }}>
                DATA CONNECTION
              </span>
            </div>
            <span style={{ color: '#8e8ea0', fontSize: '10px' }}>—</span>
            <p style={{ fontSize: '12px', color: '#acacac', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Connect an examination data source to populate this dashboard.
            </p>
            <span className="ml-auto flex-shrink-0" style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#ef4444', fontSize: '10px', letterSpacing: '0.04em' }}>
              NO ACTIVE DATA
            </span>
          </div>

          {/* KPI Bento Grid */}
          <KPIBentoGrid />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3">
              <AlertsOverTimeChart />
            </div>
            <div className="lg:col-span-2">
              <RiskDistributionChart />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3">
              <RecentSubmissionsTable />
            </div>
            <div className="lg:col-span-2">
              <ActiveAlertsFeed />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}