import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Plus, Search, Download, HeartPulse, ShieldAlert, Lock,
  CalendarPlus, Stethoscope, Phone, FileText, ClipboardList,
} from 'lucide-react';
import { welfareService } from '@/services/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { StatusBadge, attendanceStatusBadge } from '@/components/shared/StatusBadge';
import { LoadingState, ErrorState, EmptyState, SensitiveDataNotice, PermissionDenied } from '@/components/shared/States';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs';
import type { AuthorizedAbsence, Observation } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { isWelfareRestricted } from '@/lib/permissions';

export function WelfarePage() {
  const { user } = useAuth();
  const absencesQ = useQuery({ queryKey: ['authorized-absences'], queryFn: welfareService.getAuthorizedAbsences });
  const concernsQ = useQuery({ queryKey: ['welfare-concerns'], queryFn: welfareService.getConcerns });
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('absences');

  if (isWelfareRestricted(user!.role)) {
    return (
      <div>
        <PageHeader title="Welfare" subtitle="Restricted welfare module" />
        <div className="p-6"><PermissionDenied message="Welfare information is restricted to authorised staff (administrators, headteacher, nurse, warden). Your current role does not permit access to this section." /></div>
      </div>
    );
  }

  const absenceColumns: Column<AuthorizedAbsence>[] = [
    {
      key: 'learnerName', header: 'Learner', width: '180px', sortable: true,
      render: (a) => <div><p className="text-xs font-medium text-navy">{a.learnerName}</p><p className="text-[10px] text-slate-400">{a.admissionNumber}</p></div>,
    },
    { key: 'className', header: 'Class', width: '90px' },
    { key: 'reason', header: 'Reason', render: (a) => <p className="text-xs text-navy">{a.reason}</p> },
    { key: 'startDate', header: 'Start', width: '100px', sortable: true },
    { key: 'endDate', header: 'End', width: '100px' },
    { key: 'authorizedBy', header: 'Authorized by', width: '160px' },
    {
      key: 'status', header: 'Status', width: '100px',
      render: (a) => { const b = attendanceStatusBadge(a.status); return <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>; },
    },
    {
      key: 'parentNotified', header: 'Guardian', width: '100px',
      render: (a) => a.parentNotified ? <StatusBadge variant="success" dot>Notified</StatusBadge> : <StatusBadge variant="warning" dot>Pending</StatusBadge>,
    },
  ];

  const concernColumns: Column<Observation>[] = [
    {
      key: 'learnerName', header: 'Learner', width: '180px', sortable: true,
      render: (o) => <div><p className="text-xs font-medium text-navy">{o.learnerName}</p><p className="text-[10px] text-slate-400">{o.admissionNumber}</p></div>,
    },
    {
      key: 'category', header: 'Category', width: '140px',
      render: (o) => <StatusBadge variant="danger" dot>{o.category.replace(/_/g, ' ')}</StatusBadge>,
    },
    {
      key: 'severity', header: 'Severity', width: '100px',
      render: (o) => <StatusBadge variant={o.severity === 'critical' ? 'danger' : 'warning'} dot><span className="capitalize">{o.severity}</span></StatusBadge>,
    },
    { key: 'description', header: 'Description', render: (o) => <p className="line-clamp-2 text-xs text-navy">{o.description}</p> },
    { key: 'date', header: 'Date', width: '100px', sortable: true },
    { key: 'recordedBy', header: 'Recorded by', width: '120px' },
  ];

  return (
    <div>
      <PageHeader
        title="Welfare"
        subtitle="Authorized absences, sick-bay activity and welfare support"
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
            <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Authorize absence</Button>
          </>
        }
      />

      <div className="p-4 lg:p-6">
        <div className="mb-4">
          <SensitiveDataNotice />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 flex h-auto flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
            <TabsTrigger value="absences" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Authorized Absences</TabsTrigger>
            <TabsTrigger value="sickbay" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Sick Bay</TabsTrigger>
            <TabsTrigger value="concerns" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Welfare Concerns</TabsTrigger>
            <TabsTrigger value="counselling" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Counselling</TabsTrigger>
            <TabsTrigger value="safeguarding" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Safeguarding</TabsTrigger>
            <TabsTrigger value="plans" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Support Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="absences" className="mt-0">
            <div className="mb-3 flex items-center gap-2">
              <div className="relative min-w-[200px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search learner..." className="h-9 pl-9 text-xs" />
              </div>
            </div>
            {absencesQ.isLoading ? <LoadingState /> : absencesQ.isError ? <ErrorState onRetry={() => absencesQ.refetch()} /> : (
              <DataTable columns={absenceColumns} data={(absencesQ.data || []).filter((a) => !search || a.learnerName.toLowerCase().includes(search.toLowerCase()))} rowKey={(a) => a.id} pageSize={10} />
            )}
          </TabsContent>

          <TabsContent value="sickbay" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy"><Stethoscope className="h-4 w-4 text-cyan-brand" /> Sick-bay activity</h3>
              <div className="space-y-2">
                {[
                  { name: 'Amina Nansubuga', cls: 'S2', time: '10:30', reason: 'Headache', status: 'Returned to class' },
                  { name: 'Daniel Okello', cls: 'S3', time: '12:15', reason: 'Stomach pain', status: 'Resting' },
                  { name: 'Sarah Namusoke', cls: 'S1', time: '14:00', reason: 'Minor cut', status: 'Treated' },
                ].map((v, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <div>
                      <p className="text-xs font-medium text-navy">{v.name} · {v.cls}</p>
                      <p className="text-[10px] text-slate-400">{v.time} · {v.reason}</p>
                    </div>
                    <StatusBadge variant={v.status === 'Returned to class' ? 'success' : 'info'} dot>{v.status}</StatusBadge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="concerns" className="mt-0">
            {concernsQ.isLoading ? <LoadingState /> : concernsQ.isError ? <ErrorState onRetry={() => concernsQ.refetch()} /> : (
              <DataTable columns={concernColumns} data={concernsQ.data || []} rowKey={(o) => o.id} pageSize={10} />
            )}
          </TabsContent>

          <TabsContent value="counselling" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <SensitiveDataNotice message="Counselling referrals are strictly confidential. Only the school counsellor and authorised administrators can view these records." />
              <div className="mt-4 space-y-2">
                {[
                  { name: 'Joshua Kato', type: 'Weekly counselling', status: 'Active', sessions: 3 },
                  { name: 'Faith Atim', type: 'One-off consultation', status: 'Completed', sessions: 1 },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-warning" />
                      <div>
                        <p className="text-xs font-medium text-navy">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.type} · {c.sessions} session(s)</p>
                      </div>
                    </div>
                    <StatusBadge variant={c.status === 'Active' ? 'info' : 'success'} dot>{c.status}</StatusBadge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="safeguarding" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <SensitiveDataNotice message="Safeguarding follow-up records are highly restricted. Access is limited to the designated safeguarding lead and school administrator." />
              <div className="mt-4">
                <EmptyState icon={ShieldAlert} title="No active safeguarding follow-ups" description="All safeguarding cases are currently closed or under external review." />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plans" className="mt-0">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                { name: 'Amina Nansubuga', plan: 'Attendance support plan', review: '5 days', status: 'Active' },
                { name: 'Brian Ssemanda', plan: 'Behavioural support plan', review: '2 weeks', status: 'Active' },
              ].map((p, i) => (
                <div key={i} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-navy">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.plan}</p>
                    </div>
                    <StatusBadge variant="info" dot>{p.status}</StatusBadge>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-400">Next review: {p.review}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
