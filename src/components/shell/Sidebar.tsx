import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, ScanLine, CalendarClock, Eye, Gavel,
  HeartPulse, GraduationCap, FileBarChart, MessageSquare, UserCog,
  Smartphone, ScrollText, Settings, ChevronLeft, School,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import type { NavKey } from '@/lib/permissions';
import { getAccessiblePages } from '@/lib/permissions';
import { useAuth } from '@/hooks/use-auth';

interface NavItem {
  key: NavKey;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [{ key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }],
  },
  {
    title: 'LEARNER MANAGEMENT',
    items: [
      { key: 'learners', label: 'Learners', icon: Users, path: '/learners' },
      { key: 'attendance', label: 'Attendance', icon: ScanLine, path: '/attendance' },
      { key: 'occasions', label: 'Occasions', icon: CalendarClock, path: '/occasions' },
    ],
  },
  {
    title: 'LEARNER SUPPORT',
    items: [
      { key: 'observations', label: 'Observations', icon: Eye, path: '/observations' },
      { key: 'cases', label: 'Cases', icon: Gavel, path: '/cases' },
      { key: 'welfare', label: 'Welfare', icon: HeartPulse, path: '/welfare' },
      { key: 'academics', label: 'Academics', icon: GraduationCap, path: '/academics' },
    ],
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { key: 'reports', label: 'Reports', icon: FileBarChart, path: '/reports' },
      { key: 'communication', label: 'Communication', icon: MessageSquare, path: '/communication' },
      { key: 'staff', label: 'Staff and Roles', icon: UserCog, path: '/staff' },
      { key: 'devices', label: 'Devices', icon: Smartphone, path: '/devices' },
      { key: 'audit', label: 'Audit Logs', icon: ScrollText, path: '/audit' },
      { key: 'settings', label: 'School Settings', icon: Settings, path: '/settings' },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-navy/40 lg:hidden" onClick={onMobileClose} />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col bg-navy-dark text-white transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-[240px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center gap-3 border-b border-white/10 px-4 py-4', collapsed && 'justify-center px-2')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-brand">
            <School className="h-5 w-5 text-navy-dark" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Nile Crest</p>
              <p className="truncate text-xs text-white/50">Kampala Campus</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto nav-scroll px-2 py-3">
          {navSections.map((section) => {
            const visibleItems = section.items.filter((item) => {
              if (!user) return true;
              return getAccessiblePages(user.role).includes(item.key);
            });
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.title} className="mb-4">
                {!collapsed && (
                  <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-wider text-white/35">{section.title}</p>
                )}
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <NavLink
                        key={item.key}
                        to={item.path}
                        onClick={onMobileClose}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          collapsed && 'justify-center px-2',
                          isActive
                            ? 'bg-cyan-brand text-white shadow-sm'
                            : 'text-white/65 hover:bg-white/5 hover:text-white',
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <item.icon className="h-4.5 w-4.5 shrink-0" style={{ width: 18, height: 18 }} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-white/10 p-2">
          <button
            onClick={onToggle}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-white/80',
              collapsed && 'justify-center px-2',
            )}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
