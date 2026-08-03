import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import {
  Search, Download, ScrollText, ChevronRight, X,
} from 'lucide-react';
import { auditService } from '@/services/api';
import type { AuditEvent } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, useSort, type Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/States';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function AuditLogsPage() {
  const auditQ = useQuery({ queryKey: ['audit'], queryFn: auditService.list });
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { sorted, sortKey, sortDirection, handleSort } = useSort<AuditEvent>(auditQ.data || [], 'timestamp');

  const filtered = useMemo(() => {
    return (sorted || []).filter((a) => {
      if (search && !`${a.userName} ${a.action} ${a.module}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (moduleFilter !== 'all' && a.module !== moduleFilter) return false;
      if (resultFilter !== 'all' && a.result !== resultFilter) return false;
      return true;
    });
  }, [sorted, search, moduleFilter, resultFilter]);

  const columns: Column<AuditEvent>[] = [
    {
      key: 'timestamp', header: 'Date & Time', sortable: true, width: '150px',
      render: (a) => <span className="text-xs text-navy">{new Date(a.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>,
    },
    {
      key: 'userName', header: 'User', sortable: true, width: '150px',
      render: (a) => <div><p className="text-xs font-medium text-navy">{a.userName}</p><p className="text-[10px] text-slate-400">{a.userRole}</p></div>,
    },
    {
      key: 'action', header: 'Action', width: '180px',
      render: (a) => <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-navy">{a.action}</span>,
    },
    { key: 'module', header: 'Module', width: '120px' },
    { key: 'recordType', header: 'Record', width: '120px', render: (a) => a.recordType || '—' },
    { key: 'ipAddress', header: 'IP Address', width: '130px' },
    {
      key: 'result', header: 'Result', width: '100px',
      render: (a) => <StatusBadge variant={a.result === 'success' ? 'success' : a.result === 'failure' ? 'danger' : 'warning'} dot><span className="capitalize">{a.result}</span></StatusBadge>,
    },
    {
      key: 'actions', header: '', width: '40px', align: 'right',
      render: (a) => <button onClick={(e) => { e.stopPropagation(); setSelected(a); setPanelOpen(true); }} className="text-slate-400 hover:text-navy"><ChevronRight className="h-4 w-4" /></button>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        count={auditQ.data?.length || 0}
        subtitle="Read-only system activity and audit trail"
        actions={<Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>}
      />

      <div className="border-b border-border bg-white px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user, action or module..." className="h-9 pl-9 text-xs" />
          </div>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="h-9 w-[140px] text-xs"><SelectValue placeholder="Module" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              <SelectItem value="Auth">Auth</SelectItem>
              <SelectItem value="Learners">Learners</SelectItem>
              <SelectItem value="Attendance">Attendance</SelectItem>
              <SelectItem value="Observations">Observations</SelectItem>
              <SelectItem value="Cases">Cases</SelectItem>
              <SelectItem value="Devices">Devices</SelectItem>
              <SelectItem value="Settings">Settings</SelectItem>
            </SelectContent>
          </Select>
          <Select value={resultFilter} onValueChange={setResultFilter}>
            <SelectTrigger className="h-9 w-[120px] text-xs"><SelectValue placeholder="Result" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All results</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failure">Failure</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {auditQ.isLoading ? (
          <DataTable columns={columns} data={[]} rowKey={() => ''} loading />
        ) : auditQ.isError ? (
          <ErrorState onRetry={() => auditQ.refetch()} />
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-white"><EmptyState icon={ScrollText} title="No audit events" /></div>
        ) : (
          <DataTable columns={columns} data={filtered} rowKey={(a) => a.id} onRowClick={(a) => { setSelected(a); setPanelOpen(true); }} selectedRowKey={selected?.id} sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} pageSize={15} />
        )}
      </div>

      {/* Audit detail drawer */}
      <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
        <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Audit Event Detail</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 pt-4">
              <div className="space-y-px rounded-lg border border-border">
                {[
                  ['Timestamp', new Date(selected.timestamp).toLocaleString('en-GB')],
                  ['User', selected.userName],
                  ['Role', selected.userRole],
                  ['Action', selected.action],
                  ['Module', selected.module],
                  ['Record ID', selected.recordId || '—'],
                  ['Record type', selected.recordType || '—'],
                  ['Device', selected.deviceId || '—'],
                  ['IP Address', selected.ipAddress],
                  ['Reason', selected.reason || '—'],
                  ['Result', <StatusBadge variant={selected.result === 'success' ? 'success' : selected.result === 'failure' ? 'danger' : 'warning'} dot><span className="capitalize">{selected.result}</span></StatusBadge>],
                ].map(([label, value], i) => (
                  <div key={i} className="flex items-start justify-between px-3 py-2.5 hover:bg-slate-50">
                    <span className="text-xs text-slate-500">{label as string}</span>
                    <span className="text-right text-xs font-medium text-navy">{value as React.ReactNode}</span>
                  </div>
                ))}
              </div>

              {selected.previousValue && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-500">Previous value</p>
                  <pre className="overflow-x-auto rounded-lg bg-slate-50 p-3 text-[10px] text-navy">{JSON.stringify(selected.previousValue, null, 2)}</pre>
                </div>
              )}
              {selected.newValue && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-500">New value</p>
                  <pre className="overflow-x-auto rounded-lg bg-cyan-light/50 p-3 text-[10px] text-navy">{JSON.stringify(selected.newValue, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
