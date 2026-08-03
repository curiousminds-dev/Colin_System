import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Upload, Download, Search, Filter, X, Phone, MapPin,
  Eye, QrCode, ScanLine, CalendarPlus, MessageSquare, MoreHorizontal,
  ChevronRight, Users,
} from 'lucide-react';
import { learnerService } from '@/services/api';
import type { Learner } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, useSort, type Column } from '@/components/shared/DataTable';
import { StatusBadge, attendanceStatusBadge } from '@/components/shared/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/States';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function LearnersPage() {
  const navigate = useNavigate();
  const { data: learners, isLoading, isError, refetch } = useQuery({
    queryKey: ['learners'],
    queryFn: learnerService.list,
  });

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [streamFilter, setStreamFilter] = useState('all');
  const [boardingFilter, setBoardingFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [qrFilter, setQrFilter] = useState('all');
  const [selected, setSelected] = useState<Learner | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { sorted, sortKey, sortDirection, handleSort } = useSort<Learner>(learners || [], 'lastName');

  const filtered = useMemo(() => {
    if (!sorted) return [];
    return sorted.filter((l) => {
      if (search) {
        const q = search.toLowerCase();
        const match = `${l.firstName} ${l.lastName} ${l.admissionNumber} ${l.lin}`.toLowerCase();
        if (!match.includes(q)) return false;
      }
      if (classFilter !== 'all' && l.classId !== classFilter) return false;
      if (streamFilter !== 'all' && l.streamName !== streamFilter) return false;
      if (boardingFilter !== 'all' && l.boardingStatus !== boardingFilter) return false;
      if (genderFilter !== 'all' && l.gender !== genderFilter) return false;
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (qrFilter !== 'all' && l.qrStatus !== qrFilter) return false;
      return true;
    });
  }, [sorted, search, classFilter, streamFilter, boardingFilter, genderFilter, statusFilter, qrFilter]);

  const handleRowClick = (row: Learner) => {
    setSelected(row);
    setPanelOpen(true);
  };

  const resetFilters = () => {
    setSearch('');
    setClassFilter('all');
    setStreamFilter('all');
    setBoardingFilter('all');
    setGenderFilter('all');
    setStatusFilter('all');
    setQrFilter('all');
  };

  const hasFilters = search || classFilter !== 'all' || streamFilter !== 'all' || boardingFilter !== 'all' || genderFilter !== 'all' || statusFilter !== 'all' || qrFilter !== 'all';

  const columns: Column<Learner>[] = [
    {
      key: 'name',
      header: 'Student',
      sortable: true,
      width: '220px',
      render: (l) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={l.photo} />
            <AvatarFallback className="bg-navy/10 text-[10px] font-semibold text-navy">
              {l.firstName[0]}{l.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-navy">{l.firstName} {l.lastName}</p>
            <p className="truncate text-[10px] text-slate-400">{l.admissionNumber}</p>
          </div>
        </div>
      ),
    },
    { key: 'admissionNumber', header: 'Admission No.', sortable: true, width: '130px' },
    { key: 'lin', header: 'LIN', width: '100px' },
    { key: 'className', header: 'Class', sortable: true, width: '100px' },
    { key: 'streamName', header: 'Stream', width: '70px' },
    { key: 'gender', header: 'Gender', width: '80px', render: (l) => <span className="capitalize">{l.gender}</span> },
    { key: 'boardingStatus', header: 'Day/Boarding', width: '100px', render: (l) => <span className="capitalize">{l.boardingStatus}</span> },
    {
      key: 'todayStatus',
      header: "Today's Status",
      width: '110px',
      render: (l) => {
        const b = attendanceStatusBadge(l.todayStatus);
        return <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>;
      },
    },
    {
      key: 'attendancePercentage',
      header: 'Att %',
      sortable: true,
      width: '80px',
      align: 'center',
      render: (l) => (
        <span className={cn('font-semibold', l.attendancePercentage >= 90 ? 'text-success' : l.attendancePercentage >= 80 ? 'text-warning' : 'text-danger')}>
          {l.attendancePercentage}%
        </span>
      ),
    },
    {
      key: 'qrStatus',
      header: 'QR Status',
      width: '100px',
      render: (l) => {
        const b = attendanceStatusBadge(l.qrStatus);
        return <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>;
      },
    },
    {
      key: 'guardian',
      header: 'Guardian Contact',
      width: '140px',
      render: (l) => (
        <div className="min-w-0">
          <p className="truncate text-xs text-navy">{l.guardians[0]?.name || '—'}</p>
          <p className="truncate text-[10px] text-slate-400">{l.guardians[0]?.phone || '—'}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '50px',
      align: 'right',
      render: (l) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button onClick={(e) => e.stopPropagation()} className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-100">
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/learners/${l.id}`)}>View full profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRowClick(l)}>Quick view</DropdownMenuItem>
            <DropdownMenuItem>View QR card</DropdownMenuItem>
            <DropdownMenuItem>Record observation</DropdownMenuItem>
            <DropdownMenuItem>Authorize absence</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Learners"
        count={learners?.length || 0}
        subtitle="Manage learner records, enrolment and identity credentials"
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV</Button>
            <Button variant="outline" size="sm"><Upload className="mr-1.5 h-3.5 w-3.5" /> Import CSV</Button>
            <Button size="sm" onClick={() => navigate('/learners/new')}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add learner</Button>
          </>
        }
      />

      {/* Toolbar */}
      <div className="border-b border-border bg-white px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, admission no. or LIN..."
              className="h-9 pl-9 text-xs"
            />
          </div>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="h-9 w-[120px] text-xs"><SelectValue placeholder="Class" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              <SelectItem value="c1">Senior One</SelectItem>
              <SelectItem value="c2">Senior Two</SelectItem>
              <SelectItem value="c3">Senior Three</SelectItem>
              <SelectItem value="c4">Senior Four</SelectItem>
              <SelectItem value="c5">Senior Five</SelectItem>
              <SelectItem value="c6">Senior Six</SelectItem>
            </SelectContent>
          </Select>
          <Select value={boardingFilter} onValueChange={setBoardingFilter}>
            <SelectTrigger className="h-9 w-[110px] text-xs"><SelectValue placeholder="Boarding" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="boarding">Boarding</SelectItem>
            </SelectContent>
          </Select>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="h-9 w-[100px] text-xs"><SelectValue placeholder="Gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[110px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
          <Select value={qrFilter} onValueChange={setQrFilter}>
            <SelectTrigger className="h-9 w-[110px] text-xs"><SelectValue placeholder="QR" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All QR</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 text-xs">
              <X className="mr-1 h-3.5 w-3.5" /> Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table area */}
      <div className="p-4 lg:p-6">
        {isLoading ? (
          <DataTable columns={columns} data={[]} rowKey={() => ''} loading />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-white">
            <EmptyState
              icon={Users}
              title="No learners found"
              description={hasFilters ? 'No learners match your current filters. Try adjusting or resetting them.' : 'No learners have been registered yet.'}
              actionLabel={hasFilters ? 'Reset filters' : 'Add learner'}
              onAction={hasFilters ? resetFilters : () => navigate('/learners/new')}
            />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            rowKey={(l) => l.id}
            onRowClick={handleRowClick}
            selectedRowKey={selected?.id}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            pageSize={12}
          />
        )}
      </div>

      {/* Details side panel - desktop */}
      {selected && (
        <div className="fixed right-0 top-14 z-20 hidden h-[calc(100vh-3.5rem)] w-[340px] border-l border-border bg-white shadow-lg xl:block">
          <LearnerDetailPanel learner={selected} onClose={() => { setSelected(null); setPanelOpen(false); }} onFullProfile={() => navigate(`/learners/${selected.id}`)} />
        </div>
      )}

      {/* Details drawer - mobile/tablet */}
      <Sheet open={panelOpen && !!selected} onOpenChange={setPanelOpen}>
        <SheetContent className="w-full sm:max-w-[380px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="sr-only">Learner details</SheetTitle>
          </SheetHeader>
          {selected && <LearnerDetailPanel learner={selected} onClose={() => setPanelOpen(false)} onFullProfile={() => navigate(`/learners/${selected.id}`)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function LearnerDetailPanel({ learner, onClose, onFullProfile }: { learner: Learner; onClose: () => void; onFullProfile: () => void }) {
  const b = attendanceStatusBadge(learner.todayStatus);
  const qrBadge = attendanceStatusBadge(learner.qrStatus);
  const guardian = learner.guardians[0];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-navy">Learner details</h3>
        <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100">
          <X className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Photo + name */}
        <div className="flex flex-col items-center border-b border-border px-4 py-6 text-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={learner.photo} />
            <AvatarFallback className="bg-navy/10 text-lg font-semibold text-navy">
              {learner.firstName[0]}{learner.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-3 text-base font-semibold text-navy">{learner.firstName} {learner.lastName}</h2>
          <p className="text-xs text-slate-500">{learner.admissionNumber}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
            <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>
            <StatusBadge variant={qrBadge.variant} dot>{qrBadge.label}</StatusBadge>
          </div>
        </div>

        {/* Key info */}
        <div className="space-y-px border-b border-border">
          {[
            ['Class', `${learner.className} · ${learner.streamName}`],
            ['LIN', learner.lin],
            ['Day/Boarding', <span className="capitalize">{learner.boardingStatus}</span>],
            ['Gender', <span className="capitalize">{learner.gender}</span>],
            ['Date of birth', learner.dateOfBirth],
            ['House', learner.houseName || '—'],
            ['Dormitory', learner.dormitoryName || '—'],
            ['Attendance', `${learner.attendancePercentage}%`],
          ].map(([label, value], i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50">
              <span className="text-xs text-slate-500">{label as string}</span>
              <span className="text-xs font-medium text-navy">{value as React.ReactNode}</span>
            </div>
          ))}
        </div>

        {/* Guardian */}
        <div className="border-b border-border px-4 py-3">
          <p className="mb-2 text-xs font-semibold text-slate-500">Guardian</p>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-navy">{guardian?.name}</p>
            <p className="text-[10px] text-slate-400">{guardian?.relationship}</p>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-navy">
              <Phone className="h-3 w-3 text-cyan-brand" />
              {guardian?.phone}
            </div>
          </div>
        </div>

        {/* Recent observations */}
        <div className="border-b border-border px-4 py-3">
          <p className="mb-2 text-xs font-semibold text-slate-500">Recent observations</p>
          <div className="space-y-1.5">
            <div className="rounded-lg border border-border px-3 py-2">
              <div className="flex items-center justify-between">
                <StatusBadge variant="info" dot>Academic</StatusBadge>
                <span className="text-[10px] text-slate-400">3 days ago</span>
              </div>
              <p className="mt-1.5 text-xs text-navy">Consistently submits assignments on time.</p>
            </div>
          </div>
        </div>

        {/* Active intervention */}
        <div className="px-4 py-3">
          <p className="mb-2 text-xs font-semibold text-slate-500">Active intervention</p>
          <div className="rounded-lg border border-info/30 bg-info/5 px-3 py-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-navy">Mentorship Programme</p>
              <StatusBadge variant="info" dot>Active</StatusBadge>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">Assigned to Atim Faith · Review in 5 days</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="border-t border-border p-3">
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" onClick={onFullProfile} className="text-xs">
            <Eye className="mr-1.5 h-3.5 w-3.5" /> Full profile
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <QrCode className="mr-1.5 h-3.5 w-3.5" /> View QR
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <ScanLine className="mr-1.5 h-3.5 w-3.5" /> Record att.
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <Eye className="mr-1.5 h-3.5 w-3.5" /> Observation
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <CalendarPlus className="mr-1.5 h-3.5 w-3.5" /> Auth. absence
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Contact
          </Button>
        </div>
      </div>
    </div>
  );
}
