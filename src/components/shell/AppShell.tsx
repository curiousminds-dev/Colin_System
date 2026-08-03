import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={cn('flex min-h-screen flex-col transition-all duration-300', collapsed ? 'lg:pl-[68px]' : 'lg:pl-[240px]')}>
        <TopBar onMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
