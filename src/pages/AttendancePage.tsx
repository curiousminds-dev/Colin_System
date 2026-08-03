import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanLine, Calendar, Download, Printer, CheckCircle2, Clock,
  AlertCircle, HelpCircle, RefreshCw, Search,
} from 'lucide-react';
import { attendanceService } from '@/services/api';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader, ChartCard } from '@/components/shared/PageHeader';
import { DataTable, useSort, type Column } from '@/components/shared/DataTable';
import { StatusBadge, attendanceStatusBadge } from '@/components/shared/StatusBadge';
import { LoadingState, ErrorState } from '@/components/shared/States';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs';
import type { AttendanceRecord } from '@/types';
import { cn } from '@/lib/utils';

export function AttendancePage() {
  const navigate = useNavigate();
  const recordsQ = useQuery({ queryKey: ['attendance-records'], queryFn: attendanceService.getRecords });
  const occasionsQ = useQuery({ queryKey: ['occasions'], queryFn: attendanceService.getOccasions });
  const scansQ = useQuery({ queryKey: ['scans'], queryFn: attendanceService.getScans });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [occasionFilter, setOccasionFilter] = useState('all');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tab, setTab] = useState('today');

  const { sorted, sortKey, sortDirection, handleSort } = useSort<AttendanceRecord>(recordsQ.data || [], 'learnerName');

  const filtered = useMemo(() => {
    return (sorted || []).filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        if (!`${r.learnerName} ${r.admissionNumber} ${r.className}`.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (occasionFilter !== 'all' && r.occasionId !== occasionFilter) return false;
      return true;
    });
  }, [sorted, search, statusFilter, occasionFilter]);

  const present = (recordsQ.data || []).filter((r) => r.status === 'present').length;
  const late = (recordsQ.data || []).filter((r) => r.status === 'late').length;
  const absent = (recordsQ.data || []).filter((r) => r.status === 'absent').length;
  const excused = (recordsQ.data || []).filter((r) => r.status === 'excused').length;
  const unreconciled = (recordsQ.data || []).filter((r) => r.reconciliationStatus === 'unreconciled').length;

  const columns: Column<AttendanceRecord>[] = [
    {
      key: 'learnerName',
      header: 'Learner',
      sortable: true,
      width: '180px',
      render: (r) => (
        <div>
          <p className="text-xs font-medium text-navy">{r.learnerName}</p>
          <p className="text-[10px] text-slate-400">{r.admissionNumber}</p>
        </div>
      ),
    },
    { key: 'className', header: 'Class', width: '90px' },
    { key: 'occasionName', header: 'Occasion', width: '150px' },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (r) => {
        const b = attendanceStatusBadge(r.status);
        return <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>;
      },
    },
    { key: 'scanTime', header: 'Scan time', width: '100px', render: (r) => r.scanTime ? new Date(r.scanTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—' },
    { key: 'recordedBy', header: 'Recorded by', width: '120px' },
    {
      key: 'reconciliationStatus',
      header: 'Reconciliation',
      width: '120px',
      render: (r) => {
        const b = attendanceStatusBadge(r.reconciliationStatus);
        return <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>;
      },
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      align: 'right',
      render: () => (
        <Button variant="ghost" size="sm" className="h-6 text-xs">Reconcile</Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Monitor daily attendance, scans and reconciliation"
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
            <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
            <Button size="sm" onClick={() => navigate('/attendance/scan')}><ScanLine className="mr-1.5 h-3.5 w-3.5" /> Start scanning</Button>
          </>
        }
      />

      <div className="p-4 lg:p-6">
        {/* Summary */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
          <MetricCard label="Expected" value={847} icon={Calendar} iconColor="text-navy" iconBg="bg-navy/5" />
          <MetricCard label="Present" value={present} icon={CheckCircle2} iconColor="text-success" iconBg="bg-success/10" />
          <MetricCard label="Late" value={late} icon={Clock} iconColor="text-warning" iconBg="bg-warning/10" />
          <MetricCard label="Excused" value={excused} icon={HelpCircle} iconColor="text-info" iconBg="bg-info/10" />
          <MetricCard label="Unexplained" value={absent} icon={AlertCircle} iconColor="text-danger" iconBg="bg-danger/10" />
          <MetricCard label="Pending recon." value={unreconciled} icon={RefreshCw} iconColor="text-cyan-brand" iconBg="bg-cyan-light" />
          <MetricCard label="Active occasions" value={(occasionsQ.data || []).filter((o) => o.status === 'active').length} icon={ScanLine} iconColor="text-navy" iconBg="bg-navy/5" />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 flex h-auto flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
            <TabsTrigger value="today" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Today's attendance</TabsTrigger>
            <TabsTrigger value="scans" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Recent scans</TabsTrigger>
            <TabsTrigger value="unreconciled" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Unreconciled absences</TabsTrigger>
            <TabsTrigger value="sync" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Device sync</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-0">
            {/* Filters */}
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-white p-3">
              <div className="relative min-w-[200px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search learners..." className="h-9 pl-9 text-xs" />
              </div>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 w-[150px] text-xs" />
              <Select value={occasionFilter} onValueChange={setOccasionFilter}>
                <SelectTrigger className="h-9 w-[160px] text-xs"><SelectValue placeholder="Occasion" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All occasions</SelectItem>
                  {(occasionsQ.data || []).map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[120px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9 text-xs">Bulk reconcile</Button>
            </div>

            {recordsQ.isLoading ? (
              <DataTable columns={columns} data={[]} rowKey={() => ''} loading />
            ) : recordsQ.isError ? (
              <ErrorState onRetry={() => recordsQ.refetch()} />
            ) : (
              <DataTable columns={columns} data={filtered} rowKey={(r) => r.id} sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} pageSize={12} />
            )}
          </TabsContent>

          <TabsContent value="scans" className="mt-0">
            <div className="rounded-xl border border-border bg-white">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-navy">Recent scans</h3>
                <p className="text-xs text-slate-500">Live feed of QR scans across all devices</p>
              </div>
              <div className="divide-y divide-border">
                {(scansQ.data || []).map((s) => {
                  const b = attendanceStatusBadge(s.status);
                  return (
                    <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-navy">
                        {s.learnerName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-navy">{s.learnerName}</p>
                        <p className="truncate text-[10px] text-slate-400">{s.admissionNumber} · {s.className} · {s.occasionName}</p>
                      </div>
                      <div className="hidden text-right sm:block">
                        <p className="text-xs text-navy">{new Date(s.scannedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-[10px] text-slate-400">{s.deviceName}</p>
                      </div>
                      <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="unreconciled" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold text-navy">Unreconciled absences</h3>
              <div className="space-y-2">
                {(recordsQ.data || []).filter((r) => r.reconciliationStatus === 'unreconciled').map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <div>
                      <p className="text-xs font-medium text-navy">{r.learnerName}</p>
                      <p className="text-[10px] text-slate-400">{r.admissionNumber} · {r.className} · {r.occasionName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge variant="warning" dot>Unreconciled</StatusBadge>
                      <Button size="sm" variant="outline" className="h-6 text-xs">Reconcile</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sync" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold text-navy">Device synchronization</h3>
              <div className="space-y-2">
                {[
                  { name: 'Main Gate Tablet 01', status: 'synced', last: '2 min ago', pending: 0 },
                  { name: "Boys' Dormitory Phone", status: 'pending', last: '15 min ago', pending: 12 },
                  { name: 'School Bus 03 Tablet', status: 'failed', last: '1 hour ago', pending: 8 },
                ].map((d, i) => {
                  const b = attendanceStatusBadge(d.status);
                  return (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <div>
                        <p className="text-xs font-medium text-navy">{d.name}</p>
                        <p className="text-[10px] text-slate-400">Last sync: {d.last} · {d.pending} pending records</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>
                        {d.status !== 'synced' && <Button size="sm" variant="outline" className="h-6 text-xs">Sync now</Button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
