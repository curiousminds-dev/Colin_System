import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Plus, Search, Download, RefreshCw, Smartphone, Tablet,
  Laptop, ScanLine, AlertTriangle, CheckCircle2, XCircle,
  MoreHorizontal, Activity, Ban,
} from 'lucide-react';
import { deviceService } from '@/services/api';
import type { Device } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { StatusBadge, attendanceStatusBadge } from '@/components/shared/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/States';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const deviceIcons = {
  tablet: Tablet,
  phone: Smartphone,
  laptop: Laptop,
  usb_scanner: ScanLine,
};

export function DevicesPage() {
  const devicesQ = useQuery({ queryKey: ['devices'], queryFn: deviceService.list });
  const [search, setSearch] = useState('');

  const filtered = (devicesQ.data || []).filter((d) => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase()));

  const columns: Column<Device>[] = [
    {
      key: 'name',
      header: 'Device',
      sortable: true,
      width: '200px',
      render: (d) => {
        const Icon = deviceIcons[d.type] || Smartphone;
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Icon className="h-4 w-4 text-navy" />
            </div>
            <div>
              <p className="text-xs font-semibold text-navy">{d.name}</p>
              <p className="text-[10px] capitalize text-slate-400">{d.type.replace('_', ' ')}</p>
            </div>
          </div>
        );
      },
    },
    { key: 'assignedUserName', header: 'Assigned to', width: '140px' },
    { key: 'location', header: 'Location', width: '160px' },
    {
      key: 'status', header: 'Status', width: '110px',
      render: (d) => { const b = attendanceStatusBadge(d.status); return <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>; },
    },
    { key: 'lastSync', header: 'Last sync', width: '130px', render: (d) => d.lastSync ? new Date(d.lastSync).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—' },
    {
      key: 'pendingRecords', header: 'Pending', width: '80px', align: 'center',
      render: (d) => <span className={d.pendingRecords > 0 ? 'font-semibold text-warning' : 'text-slate-400'}>{d.pendingRecords}</span>,
    },
    {
      key: 'failedRecords', header: 'Failed', width: '80px', align: 'center',
      render: (d) => <span className={d.failedRecords > 0 ? 'font-semibold text-danger' : 'text-slate-400'}>{d.failedRecords}</span>,
    },
    { key: 'softwareVersion', header: 'Version', width: '80px' },
    { key: 'lastActivity', header: 'Last activity', width: '130px', render: (d) => d.lastActivity ? new Date(d.lastActivity).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—' },
    {
      key: 'actions', header: '', width: '50px', align: 'right',
      render: (d) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-100"><MoreHorizontal className="h-4 w-4 text-slate-400" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><RefreshCw className="mr-2 h-3.5 w-3.5" /> Synchronize now</DropdownMenuItem>
            <DropdownMenuItem><Activity className="mr-2 h-3.5 w-3.5" /> View history</DropdownMenuItem>
            {d.conflicts > 0 && <DropdownMenuItem><AlertTriangle className="mr-2 h-3.5 w-3.5" /> Resolve conflict</DropdownMenuItem>}
            <DropdownMenuItem className="text-danger"><Ban className="mr-2 h-3.5 w-3.5" /> Disable device</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const synced = (devicesQ.data || []).filter((d) => d.status === 'synced').length;
  const pending = (devicesQ.data || []).filter((d) => d.status === 'pending' || d.status === 'syncing').length;
  const failed = (devicesQ.data || []).filter((d) => d.status === 'failed' || d.status === 'conflict').length;

  return (
    <div>
      <PageHeader
        title="Devices"
        count={devicesQ.data?.length || 0}
        subtitle="Manage attendance devices and synchronization"
        actions={
          <>
            <Button variant="outline" size="sm"><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Sync all</Button>
            <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Register device</Button>
          </>
        }
      />

      <div className="p-4 lg:p-6">
        {/* Summary */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /><span className="text-xs text-slate-500">Synced</span></div>
            <p className="mt-2 text-2xl font-semibold text-navy">{synced}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-warning" /><span className="text-xs text-slate-500">Pending</span></div>
            <p className="mt-2 text-2xl font-semibold text-navy">{pending}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-danger" /><span className="text-xs text-slate-500">Failed/Conflict</span></div>
            <p className="mt-2 text-2xl font-semibold text-navy">{failed}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-navy" /><span className="text-xs text-slate-500">Total devices</span></div>
            <p className="mt-2 text-2xl font-semibold text-navy">{devicesQ.data?.length || 0}</p>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search devices..." className="h-9 pl-9 text-xs" />
          </div>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
        </div>

        {devicesQ.isLoading ? (
          <DataTable columns={columns} data={[]} rowKey={() => ''} loading />
        ) : devicesQ.isError ? (
          <ErrorState onRetry={() => devicesQ.refetch()} />
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-white"><EmptyState icon={Smartphone} title="No devices found" /></div>
        ) : (
          <DataTable columns={columns} data={filtered} rowKey={(d) => d.id} pageSize={10} />
        )}
      </div>
    </div>
  );
}
