import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import {
  Plus, Search, Download, Gavel, Eye, FileText, MessageSquare,
  CheckCircle2, XCircle, ArrowRight, Clock, ShieldAlert,
} from 'lucide-react';
import { caseService } from '@/services/api';
import type { Case, CaseStage } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, useSort, type Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingState, ErrorState, EmptyState, SensitiveDataNotice } from '@/components/shared/States';
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
import { cn } from '@/lib/utils';

const stages: CaseStage[] = ['submitted', 'assigned', 'learner_response', 'evidence_review', 'finding', 'intervention', 'review', 'closure'];

const stageLabels: Record<CaseStage, string> = {
  submitted: 'Submitted',
  assigned: 'Assigned',
  learner_response: 'Learner Response',
  evidence_review: 'Evidence Review',
  finding: 'Finding',
  intervention: 'Intervention',
  review: 'Review',
  closure: 'Closure',
};

const findingConfig = {
  confirmed: { label: 'Confirmed', variant: 'danger' as const },
  unconfirmed: { label: 'Unconfirmed', variant: 'warning' as const },
  dismissed: { label: 'Dismissed', variant: 'neutral' as const },
  referred: { label: 'Referred', variant: 'info' as const },
};

export function CasesPage() {
  const casesQ = useQuery({ queryKey: ['cases'], queryFn: caseService.list });
  const interventionsQ = useQuery({ queryKey: ['interventions'], queryFn: caseService.getInterventions });
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState<Case | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { sorted, sortKey, sortDirection, handleSort } = useSort<Case>(casesQ.data || [], 'submittedAt');

  const filtered = useMemo(() => {
    return (sorted || []).filter((c) => {
      if (search && !c.caseNumber.toLowerCase().includes(search.toLowerCase()) && !c.learnerName.toLowerCase().includes(search.toLowerCase())) return false;
      if (stageFilter !== 'all' && c.stage !== stageFilter) return false;
      if (tab === 'open' && c.stage === 'closure') return false;
      if (tab === 'closed' && c.stage !== 'closure') return false;
      return true;
    });
  }, [sorted, search, stageFilter, tab]);

  const columns: Column<Case>[] = [
    {
      key: 'caseNumber',
      header: 'Case No.',
      sortable: true,
      width: '140px',
      render: (c) => <p className="text-xs font-semibold text-navy">{c.caseNumber}</p>,
    },
    {
      key: 'learnerName',
      header: 'Learner',
      sortable: true,
      width: '160px',
      render: (c) => (
        <div>
          <p className="text-xs font-medium text-navy">{c.learnerName}</p>
          <p className="text-[10px] text-slate-400">{c.className}</p>
        </div>
      ),
    },
    {
      key: 'summary',
      header: 'Summary',
      render: () => <p className="text-xs text-slate-500 italic">Case details restricted</p>,
    },
    {
      key: 'stage',
      header: 'Stage',
      width: '140px',
      render: (c) => <StatusBadge variant="info" dot>{stageLabels[c.stage]}</StatusBadge>,
    },
    {
      key: 'finding',
      header: 'Finding',
      width: '120px',
      render: (c) => c.finding ? <StatusBadge variant={findingConfig[c.finding].variant} dot>{findingConfig[c.finding].label}</StatusBadge> : <span className="text-xs text-slate-400">—</span>,
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '100px',
      render: (c) => <StatusBadge variant={c.priority === 'urgent' ? 'danger' : c.priority === 'high' ? 'warning' : 'info'} dot><span className="capitalize">{c.priority}</span></StatusBadge>,
    },
    { key: 'submittedAt', header: 'Submitted', width: '100px', render: (c) => c.submittedAt.split('T')[0] },
  ];

  return (
    <div>
      <PageHeader
        title="Cases and Interventions"
        count={casesQ.data?.length || 0}
        subtitle="Fair and structured case review with learner support"
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
            <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Open case</Button>
          </>
        }
      />

      <div className="border-b border-border bg-white px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by case number or learner..." className="h-9 pl-9 text-xs" />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="h-9 w-[150px] text-xs"><SelectValue placeholder="Stage" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {stages.map((s) => <SelectItem key={s} value={s}>{stageLabels[s]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 flex h-auto gap-1 rounded-lg border border-border bg-white p-1">
            <TabsTrigger value="all" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">All cases</TabsTrigger>
            <TabsTrigger value="open" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Open</TabsTrigger>
            <TabsTrigger value="closed" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Closed</TabsTrigger>
            <TabsTrigger value="interventions" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Interventions</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-0">
            {tab === 'interventions' ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {(interventionsQ.data || []).map((iv) => (
                  <div key={iv.id} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-navy">{iv.learnerName}</p>
                        <p className="text-xs text-slate-500">{iv.type}</p>
                      </div>
                      <StatusBadge variant={iv.status === 'active' ? 'info' : iv.status === 'completed' ? 'success' : 'neutral'} dot><span className="capitalize">{iv.status}</span></StatusBadge>
                    </div>
                    <p className="text-xs text-slate-500">{iv.description}</p>
                    <div className="mt-3 border-t border-border pt-3 text-[10px] text-slate-400">
                      <p>Assigned to: {iv.assignedTo}</p>
                      <p>Started: {iv.startDate} · Review: {iv.reviewDate || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : casesQ.isLoading ? (
              <DataTable columns={columns} data={[]} rowKey={() => ''} loading />
            ) : casesQ.isError ? (
              <ErrorState onRetry={() => casesQ.refetch()} />
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-border bg-white">
                <EmptyState icon={Gavel} title="No cases found" description="Open a new case to start the review process." />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filtered}
                rowKey={(c) => c.id}
                onRowClick={(c) => { setSelected(c); setPanelOpen(true); }}
                selectedRowKey={selected?.id}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
                pageSize={12}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Case detail panel */}
      {selected && (
        <div className="fixed right-0 top-14 z-20 hidden h-[calc(100vh-3.5rem)] w-[380px] border-l border-border bg-white shadow-lg xl:block">
          <CaseDetailPanel caseData={selected} onClose={() => { setSelected(null); setPanelOpen(false); }} />
        </div>
      )}
      <Sheet open={panelOpen && !!selected} onOpenChange={setPanelOpen}>
        <SheetContent className="w-full sm:max-w-[400px] overflow-y-auto">
          <SheetHeader><SheetTitle className="sr-only">Case details</SheetTitle></SheetHeader>
          {selected && <CaseDetailPanel caseData={selected} onClose={() => setPanelOpen(false)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CaseDetailPanel({ caseData: c, onClose }: { caseData: Case; onClose: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-navy">{c.caseNumber}</h3>
          <p className="text-xs text-slate-500">{c.learnerName} · {c.className}</p>
        </div>
        <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 text-slate-400">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="border-b border-border p-4">
          <SensitiveDataNotice message="Case details are confidential. Only authorised reviewers and administrators can view this information." />
        </div>

        <div className="space-y-4 p-4">
          {/* Stage pipeline */}
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Case Pipeline</p>
            <div className="flex items-center gap-1">
              {stages.map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold',
                    stages.indexOf(c.stage) >= i ? 'bg-cyan-brand text-white' : 'bg-slate-100 text-slate-400')}>
                    {i + 1}
                  </div>
                  {i < stages.length - 1 && <div className={cn('h-0.5 w-4', stages.indexOf(c.stage) > i ? 'bg-cyan-brand' : 'bg-slate-200')} />}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-navy">Current: <span className="font-semibold">{stageLabels[c.stage]}</span></p>
          </div>

          <div className="space-y-px rounded-lg border border-border">
            {[
              ['Priority', <span className="capitalize">{c.priority}</span>],
              ['Submitted by', c.submittedBy],
              ['Submitted at', c.submittedAt.split('T')[0]],
              ['Assigned to', c.assignedTo || 'Unassigned'],
              ['Review date', c.reviewDate || 'Not scheduled'],
              ['Parent contacted', c.parentContacted ? 'Yes' : 'No'],
              ['Finding', c.finding ? findingConfig[c.finding].label : 'Pending'],
            ].map(([label, value], i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 hover:bg-slate-50">
                <span className="text-xs text-slate-500">{label as string}</span>
                <span className="text-xs font-medium text-navy">{value as React.ReactNode}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Summary</p>
            <p className="text-xs text-navy">{c.summary}</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Timeline</p>
            <div className="space-y-2">
              {[
                { event: 'Case submitted', date: c.submittedAt, by: c.submittedBy },
                { event: c.assignedTo ? `Assigned to ${c.assignedTo}` : 'Awaiting assignment', date: c.submittedAt, by: 'System' },
                { event: c.parentContacted ? 'Parent/guardian contacted' : 'Parent contact pending', date: c.submittedAt, by: c.submittedBy },
              ].map((t, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-cyan-brand" />
                    {i < 2 && <div className="h-full w-px bg-border" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs text-navy">{t.event}</p>
                    <p className="text-[10px] text-slate-400">{t.date.split('T')[0]} · {t.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-3">
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" className="text-xs"><Eye className="mr-1.5 h-3.5 w-3.5" /> Evidence</Button>
          <Button size="sm" variant="outline" className="text-xs"><MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Contact</Button>
          <Button size="sm" variant="outline" className="text-xs"><FileText className="mr-1.5 h-3.5 w-3.5" /> Review</Button>
          <Button size="sm" className="text-xs">Advance stage</Button>
        </div>
      </div>
    </div>
  );
}
