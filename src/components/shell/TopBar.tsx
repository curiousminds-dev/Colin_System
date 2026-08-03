import { cn } from '@/lib/utils';
import { Bell, Search, Menu, ChevronDown, User, Lock, HelpCircle, LogOut, RefreshCw, Wifi } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, demoAccounts } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/learners': 'Learners',
  '/attendance': 'Attendance',
  '/occasions': 'Attendance Occasions',
  '/observations': 'Observations',
  '/cases': 'Cases and Interventions',
  '/welfare': 'Welfare',
  '/academics': 'Academics',
  '/reports': 'Reports',
  '/communication': 'Communication',
  '/staff': 'Staff and Roles',
  '/devices': 'Devices',
  '/audit': 'Audit Logs',
  '/settings': 'School Settings',
};

interface TopBarProps {
  onMobileMenu: () => void;
}

export function TopBar({ onMobileMenu }: TopBarProps) {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const currentPath = Object.keys(pageTitles).find((p) => location.pathname.startsWith(p));
  const pageTitle = pageTitles[currentPath || ''] || 'Dashboard';
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-white px-4 lg:px-6">
      <button onClick={onMobileMenu} className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 lg:hidden">
        <Menu className="h-5 w-5 text-navy" />
      </button>

      {/* Breadcrumb + Title */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Nile Crest</span>
          <span>/</span>
          <span className="text-slate-600">{pageTitle}</span>
        </div>
        <h2 className="truncate text-sm font-semibold text-navy">{pageTitle}</h2>
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search learners, staff..."
          className="w-56 rounded-lg border border-border bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-navy placeholder:text-slate-400 focus:border-cyan-brand focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-brand/30 lg:w-64"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-white px-1.5 py-0.5 text-[10px] text-slate-400">⌘K</kbd>
      </div>

      {/* Term selector */}
      <div className="hidden lg:block">
        <Select defaultValue="term2-2026">
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="term2-2026">Term 2 · 2026</SelectItem>
            <SelectItem value="term1-2026">Term 1 · 2026</SelectItem>
            <SelectItem value="term3-2025">Term 3 · 2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campus selector */}
      <div className="hidden lg:block">
        <Select defaultValue="kampala">
          <SelectTrigger className="h-8 w-[110px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kampala">Kampala</SelectItem>
            <SelectItem value="entebbe">Entebbe</SelectItem>
            <SelectItem value="jinja">Jinja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sync status */}
      <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-border bg-slate-50 px-2.5 py-1.5">
        <Wifi className="h-3.5 w-3.5 text-success" />
        <span className="text-xs font-medium text-slate-600">All devices synced</span>
      </div>

      {/* Notifications */}
      <button className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100">
        <Bell className="h-4.5 w-4.5 text-slate-500" style={{ width: 18, height: 18 }} />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
      </button>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-slate-100">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}` : ''} />
              <AvatarFallback className="bg-navy text-xs font-semibold text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-navy">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500">{user?.role?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Admin'}</p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-navy">{user?.name}</span>
              <span className="text-xs text-slate-500">{user?.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <User className="mr-2 h-4 w-4" /> My profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Lock className="mr-2 h-4 w-4" /> Change password
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" /> Help centre
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-slate-400">Switch demo role</DropdownMenuLabel>
          {demoAccounts.map((acc) => (
            <DropdownMenuItem key={acc.role} onClick={() => switchRole(acc.role)} className={cn(user?.role === acc.role && 'bg-cyan-light')}>
              <span className="flex-1 text-xs">{acc.label}</span>
              {user?.role === acc.role && <Badge variant="outline" className="h-4 text-[10px]">Active</Badge>}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-danger">
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
