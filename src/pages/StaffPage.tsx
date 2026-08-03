import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import {
  Plus, Search, Download, UserCog, Mail, KeyRound, Ban,
  Shield, Activity, Smartphone, MoreHorizontal, Check, X,
} from 'lucide-react';
import { staffService } from '@/services/api';
import type { StaffMember, Role } from '@/types';
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
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function StaffPage() {
  const staffQ = useQuery({ queryKey: ['staff'], queryFn: staffService.list });
  const rolesQ = useQuery({ queryKey: ['roles'], queryFn: staffService.getRoles });
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [tab, setTab] = useState('staff');
  const [selected, setSelected] = useState<StaffMember | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { sorted, sortKey, sortDirection, handleSort } = useSort<StaffMember>(staffQ.data || [], 'lastName');

  const filtered = useMemo(() => {
    return (sorted || []).filter((s) => {
      if (search && !`${s.firstName} ${s.lastName} ${s.staffNumber} ${s.email}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (deptFilter !== 'all' && s.department !== deptFilter) return false;
      if (roleFilter !== 'all' && s.role !== roleFilter) return false;
      return true;
    });
  }, [sorted, search, deptFilter, roleFilter]);

  const columns: Column<StaffMember>[] = [
    {
      key: 'name',
      header: 'Staff member',
      sortable: true,
      width: '200px',
      render: (s) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={s.photo} />
            <AvatarFallback className="bg-navy/10 text-[10px] font-semibold text-navy">{s.firstName[0]}{s.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-semibold text-navy">{s.firstName} {s.lastName}</p>
            <p className="text-[10px] text-slate-400">{s.staffNumber}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', header: 'Department', width: '130px', sortable: true },
    { key: 'roleLabel', header: 'Role', width: '150px' },
    { key: 'assignedClasses', header: 'Classes', width: '120px', render: (s) => s.assignedClasses?.join(', ') || '—' },
    { key: 'assignedDeviceId', header: 'Device', width: '100px', render: (s) => s.assignedDeviceId || '—' },
    {
      key: 'accountStatus', header: 'Account', width: '110px',
      render: (s) => { const b = attendanceStatusBadge(s.accountStatus); return <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>; },
    },
    { key: 'lastLogin', header: 'Last login', width: '120px', render: (s) => s.lastLogin ? new Date(s.lastLogin).toLocaleDateString('en-GB') : '—' },
    {
      key: 'actions', header: '', width: '50px', align: 'right',
      render: (s) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button onClick={(e) => e.stopPropagation()} className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-100"><MoreHorizontal className="h-4 w-4 text-slate-400" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setSelected(s); setPanelOpen(true); }}>View profile</DropdownMenuItem>
            <DropdownMenuItem><Mail className="mr-2 h-3.5 w-3.5" /> Invite account</DropdownMenuItem>
            <DropdownMenuItem><KeyRound className="mr-2 h-3.5 w-3.5" /> Reset password</DropdownMenuItem>
            <DropdownMenuItem><Shield className="mr-2 h-3.5 w-3.5" /> Change role</DropdownMenuItem>
            <DropdownMenuItem className="text-danger"><Ban className="mr-2 h-3.5 w-3.5" /> Suspend account</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Staff and Roles"
        count={staffQ.data?.length || 0}
        subtitle="Manage staff accounts, roles and permissions"
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
            <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Add staff member</Button>
          </>
        }
      />

      <div className="border-b border-border bg-white px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff..." className="h-9 pl-9 text-xs" />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="h-9 w-[140px] text-xs"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
              <SelectItem value="Sciences">Sciences</SelectItem>
              <SelectItem value="Languages">Languages</SelectItem>
              <SelectItem value="Humanities">Humanities</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Sick Bay">Sick Bay</SelectItem>
              <SelectItem value="Boarding">Boarding</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-9 w-[150px] text-xs"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {(rolesQ.data || []).map((r) => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 flex h-auto gap-1 rounded-lg border border-border bg-white p-1">
            <TabsTrigger value="staff" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Staff members</TabsTrigger>
            <TabsTrigger value="roles" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Roles and permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="mt-0">
            {staffQ.isLoading ? (
              <DataTable columns={columns} data={[]} rowKey={() => ''} loading />
            ) : staffQ.isError ? (
              <ErrorState onRetry={() => staffQ.refetch()} />
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-border bg-white"><EmptyState icon={UserCog} title="No staff found" /></div>
            ) : (
              <DataTable columns={columns} data={filtered} rowKey={(s) => s.id} onRowClick={(s) => { setSelected(s); setPanelOpen(true); }} selectedRowKey={selected?.id} sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} pageSize={12} />
            )}
          </TabsContent>

          <TabsContent value="roles" className="mt-0">
            <PermissionsMatrix roles={rolesQ.data || []} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Staff detail panel */}
      {selected && (
        <div className="fixed right-0 top-14 z-20 hidden h-[calc(100vh-3.5rem)] w-[340px] border-l border-border bg-white shadow-lg xl:block">
          <StaffDetailPanel staff={selected} onClose={() => setSelected(null)} />
        </div>
      )}
      <Sheet open={panelOpen && !!selected} onOpenChange={setPanelOpen}>
        <SheetContent className="w-full sm:max-w-[380px] overflow-y-auto">
          <SheetHeader><SheetTitle className="sr-only">Staff details</SheetTitle></SheetHeader>
          {selected && <StaffDetailPanel staff={selected} onClose={() => setPanelOpen(false)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StaffDetailPanel({ staff: s, onClose }: { staff: StaffMember; onClose: () => void }) {
  const b = attendanceStatusBadge(s.accountStatus);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-navy">Staff details</h3>
        <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 text-slate-400">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="flex flex-col items-center border-b border-border px-4 py-6 text-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={s.photo} />
            <AvatarFallback className="bg-navy/10 text-lg font-semibold text-navy">{s.firstName[0]}{s.lastName[0]}</AvatarFallback>
          </Avatar>
          <h2 className="mt-3 text-base font-semibold text-navy">{s.firstName} {s.lastName}</h2>
          <p className="text-xs text-slate-500">{s.roleLabel}</p>
          <div className="mt-2"><StatusBadge variant={b.variant} dot>{b.label}</StatusBadge></div>
        </div>
        <div className="space-y-px">
          {[
            ['Staff number', s.staffNumber],
            ['Email', s.email],
            ['Phone', s.phone],
            ['Department', s.department],
            ['Role', s.roleLabel],
            ['Assigned classes', s.assignedClasses?.join(', ') || '—'],
            ['Assigned device', s.assignedDeviceId || '—'],
            ['Last login', s.lastLogin ? new Date(s.lastLogin).toLocaleString('en-GB') : 'Never'],
          ].map(([label, value], i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50">
              <span className="text-xs text-slate-500">{label}</span>
              <span className="text-xs font-medium text-navy">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border p-3">
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" className="text-xs"><Shield className="mr-1.5 h-3.5 w-3.5" /> Permissions</Button>
          <Button size="sm" variant="outline" className="text-xs"><Activity className="mr-1.5 h-3.5 w-3.5" /> Activity</Button>
          <Button size="sm" variant="outline" className="text-xs"><KeyRound className="mr-1.5 h-3.5 w-3.5" /> Reset pass</Button>
          <Button size="sm" variant="outline" className="text-xs"><Smartphone className="mr-1.5 h-3.5 w-3.5" /> Assign device</Button>
        </div>
      </div>
    </div>
  );
}

function PermissionsMatrix({ roles }: { roles: Role[] }) {
  const modules = ['Dashboard', 'Learners', 'Attendance', 'Observations', 'Cases', 'Welfare', 'Academics', 'Staff', 'Devices', 'Reports', 'Communication', 'Audit Logs', 'Settings'];
  const actionIcons: Record<string, typeof Check> = { read: Check, write: Check, delete: Check, admin: Check };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50/60">
              <th className="sticky left-0 bg-slate-50/95 px-4 py-3 text-left text-xs font-semibold text-slate-500">Module</th>
              {roles.map((r) => (
                <th key={r.id} className="px-3 py-3 text-center text-xs font-semibold text-slate-500" style={{ minWidth: 90 }}>
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((mod) => (
              <tr key={mod} className="border-b border-border">
                <td className="sticky left-0 bg-white px-4 py-2.5 text-xs font-medium text-navy">{mod}</td>
                {roles.map((r) => {
                  const perm = r.permissions.find((p) => p.module === mod);
                  const hasRead = perm?.actions.includes('read');
                  const hasWrite = perm?.actions.includes('write');
                  const hasAdmin = perm?.actions.includes('admin') || perm?.actions.includes('delete');
                  return (
                    <td key={r.id} className="px-3 py-2.5 text-center">
                      {hasRead ? (
                        <div className="flex items-center justify-center gap-1">
                          {hasRead && <Check className="h-3.5 w-3.5 text-success" />}
                          {hasWrite && <Check className="h-3.5 w-3.5 text-info" />}
                          {hasAdmin && <Check className="h-3.5 w-3.5 text-navy" />}
                        </div>
                      ) : (
                        <X className="mx-auto h-3.5 w-3.5 text-slate-200" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-[10px] text-slate-400">
        <span className="flex items-center gap-1"><Check className="h-3 w-3 text-success" /> Read</span>
        <span className="flex items-center gap-1"><Check className="h-3 w-3 text-info" /> Write</span>
        <span className="flex items-center gap-1"><Check className="h-3 w-3 text-navy" /> Admin/Delete</span>
      </div>
    </div>
  );
}
