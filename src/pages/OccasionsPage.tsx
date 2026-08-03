import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Plus, Play, Pause, Lock, RotateCcw, Download, Search,
  Calendar, MapPin, Users, Clock, MoreHorizontal,
} from 'lucide-react';
import { attendanceService } from '@/services/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, attendanceStatusBadge } from '@/components/shared/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/States';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs';
import type { AttendanceOccasion } from '@/types';
import { cn } from '@/lib/utils';

const categories = ['Gate Entry', 'Gate Exit', 'Morning Assembly', 'Evening Assembly', 'Class Lesson', 'Examination', 'Morning Prep', 'Evening Prep', 'Dormitory Roll Call', 'Dining', 'Sick Bay', 'Transport', 'Sports', 'Clubs', 'Trips', 'Official Duty'];

export function OccasionsPage() {
  const occasionsQ = useQuery({ queryKey: ['occasions'], queryFn: attendanceService.getOccasions });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tab, setTab] = useState('active');

  const filtered = (occasionsQ.data || []).filter((o) => {
    if (search && !o.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== 'all' && o.category !== categoryFilter) return false;
    if (tab === 'active' && o.status !== 'active') return false;
    if (tab === 'closed' && o.status !== 'closed') return false;
    if (tab === 'scheduled' && o.status !== 'scheduled') return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Attendance Occasions"
        count={occasionsQ.data?.length || 0}
        subtitle="Manage and monitor all attendance occasions across the school"
        actions={
          <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Create occasion</Button>
        }
      />

      <div className="p-4 lg:p-6">
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search occasions..." className="h-9 pl-9 text-xs" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-[160px] text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 flex h-auto gap-1 rounded-lg border border-border bg-white p-1">
            <TabsTrigger value="active" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Active</TabsTrigger>
            <TabsTrigger value="scheduled" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Scheduled</TabsTrigger>
            <TabsTrigger value="closed" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Closed</TabsTrigger>
            <TabsTrigger value="all" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">All</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-0">
            {occasionsQ.isLoading ? (
              <LoadingState />
            ) : occasionsQ.isError ? (
              <ErrorState onRetry={() => occasionsQ.refetch()} />
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-border bg-white">
                <EmptyState title="No occasions found" description="Create an attendance occasion to start scanning." actionLabel="Create occasion" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((o) => <OccasionCard key={o.id} occasion={o} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OccasionCard({ occasion: o }: { occasion: AttendanceOccasion }) {
  const b = attendanceStatusBadge(o.status);
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-navy">{o.name}</h3>
          <p className="text-xs text-slate-500">{o.category}</p>
        </div>
        <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>
      </div>

      <div className="mb-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="h-3.5 w-3.5" /> {o.date}
          <Clock className="ml-2 h-3.5 w-3.5" /> {o.startTime} — {o.endTime}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" /> {o.location}
          <Users className="ml-2 h-3.5 w-3.5" /> {o.scannedLearners}/{o.expectedLearners}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Completion</span>
          <span className="font-semibold text-navy">{o.completionPercentage}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
          <div className={cn('h-full rounded-full', o.completionPercentage >= 80 ? 'bg-success' : o.completionPercentage >= 50 ? 'bg-cyan-brand' : 'bg-warning')} style={{ width: `${o.completionPercentage}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <p className="text-[10px] text-slate-400">Staff: {o.responsibleStaff}</p>
        <div className="flex items-center gap-1">
          {o.status === 'active' && (
            <Button size="sm" variant="outline" className="h-7 text-xs"><Pause className="mr-1 h-3 w-3" /> Pause</Button>
          )}
          {o.status === 'paused' && (
            <Button size="sm" variant="outline" className="h-7 text-xs"><Play className="mr-1 h-3 w-3" /> Resume</Button>
          )}
          {o.status === 'scheduled' && (
            <Button size="sm" variant="outline" className="h-7 text-xs"><Play className="mr-1 h-3 w-3" /> Start</Button>
          )}
          {o.status === 'closed' && (
            <Button size="sm" variant="outline" className="h-7 text-xs"><RotateCcw className="mr-1 h-3 w-3" /> Reopen</Button>
          )}
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
    </div>
  );
}
