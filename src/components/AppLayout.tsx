'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('lbb-authenticated') === 'true';
    if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login');
      return;
    }
    setCheckingAccess(false);
  }, [pathname, router]);

  if (checkingAccess) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-sm text-muted-foreground">Checking access...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#212121' }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin" style={{ background: '#212121' }}>
        {children}
      </main>
    </div>
  );
}