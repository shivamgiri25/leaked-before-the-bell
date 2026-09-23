'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Upload, UserCheck, FileSearch, BookOpen, ScrollText, ClipboardList, Settings, LogOut, LogIn, Radio, PanelLeftClose, PanelLeft } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  badgeVariant?: 'danger' | 'warning' | 'info';
  group: string;
}

const navItems: NavItem[] = [
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    group: 'CORE',
  },
  {
    id: 'nav-upload',
    label: 'Upload & Ingest',
    href: '/upload-ingest',
    icon: Upload,
    group: 'CORE',
  },
  {
    id: 'nav-review',
    label: 'Human Review',
    href: '/human-review',
    icon: UserCheck,
    badge: 3,
    badgeVariant: 'danger',
    group: 'CORE',
  },
  {
    id: 'nav-my-reports',
    label: 'My Reports',
    href: '/my-reports',
    icon: ClipboardList,
    group: 'CORE',
  },
  {
    id: 'nav-submissions',
    label: 'Submissions',
    href: '/submissions',
    icon: FileSearch,
    badge: 10,
    badgeVariant: 'info',
    group: 'INVESTIGATE',
  },
  {
    id: 'nav-examdb',
    label: 'Exam Database',
    href: '/examination-database',
    icon: BookOpen,
    group: 'INVESTIGATE',
  },
  {
    id: 'nav-audit',
    label: 'Audit Logs',
    href: '/audit-logs',
    icon: ScrollText,
    group: 'SYSTEM',
  },
  {
    id: 'nav-settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    group: 'SYSTEM',
  },
];

const groups = ['CORE', 'INVESTIGATE', 'SYSTEM'];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [profileName, setProfileName] = useState('User');

  useEffect(() => {
    setProfileName(sessionStorage.getItem('lbb-user-name') || 'User');
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getBadgeClass = (variant?: string) => {
    if (variant === 'danger') return 'bg-risk-high text-white';
    if (variant === 'warning') return 'bg-risk-medium text-black';
    return 'bg-accent/80 text-white';
  };

  return (
    <aside
      className={`flex flex-col h-full transition-all duration-200 ease-in-out flex-shrink-0 ${
        collapsed ? 'w-[60px]' : 'w-[260px]'
      }`}
      style={{ background: '#171717', borderRight: '1px solid #2f2f2f' }}
    >
      {/* Logo / Header area */}
      <div
        className={`flex items-center h-[60px] flex-shrink-0 ${
          collapsed ? 'justify-center px-0' : 'px-4 gap-3'
        }`}
        style={{ borderBottom: '1px solid #2f2f2f' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(16,163,127,0.15)', border: '1px solid rgba(16,163,127,0.3)' }}
        >
          <span style={{ color: '#10a37f', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '11px', letterSpacing: '-0.02em' }}>LB</span>
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#ececec', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Leaked Before Bell
            </p>
            <p style={{ fontSize: '10px', color: '#8e8ea0', letterSpacing: '0.04em', marginTop: '1px' }}>
              FORENSIC PROTOTYPE
            </p>
          </div>
        )}
      </div>

      {/* Live exam indicator */}
      {!collapsed ? (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div className="flex items-center gap-2">
            <Radio size={11} className="text-risk-high animate-pulse-amber flex-shrink-0" />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#8e8ea0', letterSpacing: '0.05em' }}>DATA CONNECTION</span>
          </div>
          <p style={{ fontSize: '10px', color: '#8e8ea0', marginTop: '2px', paddingLeft: '19px' }}>Awaiting source</p>
        </div>
      ) : (
        <div className="flex justify-center mt-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <Radio size={13} className="text-risk-high animate-pulse-amber" />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2 space-y-4">
        {groups.map((group) => {
          const items = navItems.filter((n) => n.group === group);
          return (
            <div key={`group-${group}`}>
              {!collapsed && (
                <p style={{ fontSize: '10px', fontWeight: 500, color: '#8e8ea0', padding: '0 8px', marginBottom: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {group}
                </p>
              )}
              {collapsed && <div className="h-px mx-2 mb-2" style={{ background: '#2f2f2f' }} />}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const ItemIcon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-150 relative ${
                        collapsed ? 'justify-center' : ''
                      }`}
                      style={{
                        background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                        color: active ? '#ececec' : '#8e8ea0',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                        if (!active) (e.currentTarget as HTMLElement).style.color = '#ececec';
                      }}
                      onMouseLeave={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                        if (!active) (e.currentTarget as HTMLElement).style.color = '#8e8ea0';
                      }}
                    >
                      <ItemIcon
                        size={16}
                        strokeWidth={active ? 2 : 1.7}
                        style={{ flexShrink: 0, color: active ? '#ececec' : 'inherit' }}
                      />
                      {!collapsed && (
                        <>
                          <span style={{ flex: 1, fontSize: '13px', fontWeight: active ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.label}
                          </span>
                          {item.badge !== undefined && (
                            <span
                              className={`font-bold rounded-full leading-none flex items-center justify-center ${getBadgeClass(item.badgeVariant)}`}
                              style={{ fontSize: '10px', padding: '2px 6px', minWidth: '18px' }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && item.badge !== undefined && (
                        <span
                          className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full font-bold flex items-center justify-center leading-none ${getBadgeClass(item.badgeVariant)}`}
                          style={{ fontSize: '8px' }}
                        >
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User + collapse */}
      <div className="flex-shrink-0 p-2" style={{ borderTop: '1px solid #2f2f2f' }}>
        {!collapsed && (
          <div className="px-2 py-2 flex items-center gap-3 mb-1">
            <div className="min-w-0 flex-1">
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#ececec', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{profileName}</p>
              <p style={{ fontSize: '10px', color: '#8e8ea0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Report submitter</p>
            </div>
            <button
              className="transition-colors"
              title="Sign out"
              style={{ color: '#8e8ea0' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ececec')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8e8ea0')}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
        <Link
          href="/login"
          title={collapsed ? 'Switch account' : undefined}
          className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
          style={{ color: '#8e8ea0' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#ececec'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#8e8ea0'; }}
        >
          <LogIn size={15} />
          {!collapsed && <span style={{ fontSize: '12px' }}>Switch account</span>}
        </Link>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-lg transition-all duration-150"
          style={{ color: '#8e8ea0', fontSize: '12px' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
            (e.currentTarget as HTMLElement).style.color = '#ececec';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#8e8ea0';
          }}
        >
          {collapsed ? <PanelLeft size={15} /> : <><PanelLeftClose size={15} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}