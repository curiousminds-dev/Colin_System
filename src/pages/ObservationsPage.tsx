import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import {
  Plus, Search, Filter, Eye, FileText, AlertTriangle, Heart,
  CheckCircle2, MessageSquare, Download,
} from 'lucide-react';
import { observationService } from '@/services/api';
import type { Observation, ObservationCategory } from '@/types';
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const categoryConfig: Record<ObservationCategory, { label: string; variant: 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'cyan'; icon: typeof Eye }> = {
  positive_conduct: { label: 'Positive Conduct', variant: 'success', icon: CheckCircle2 },
  academic_observation: { label: 'Academic', variant: 'info', icon: FileText },
  minor_concern: { label: 'Minor Concern', variant: 'warning', icon: AlertTriangle },
  welfare_concern: { label: 'Welfare Concern', variant: 'danger', icon: Heart },
  general_observation: { label: 'General', variant: 'neutral', icon: Eye },
  serious_alleged_incident: { label: 'Serious Incident', variant: 'danger', icon: AlertTriangle },
};

export function ObservationsPage() {
  const observationsQ = useQuery({ queryKey: ['observations'], queryFn: observationService.list });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);

  const { sorted, sortKey, sortDirection, handleSort } = useSort<Observation>(observationsQ.data || [], 'date');

  const filtered = useMemo(() => {
    return (sorted || []).filter((o) => {
      if (search && !o.learnerName.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && o.category !== categoryFilter) return false;
      if (severityFilter !== 'all' && o.severity !== severityFilter) return false;
      return true;
    });
  }, [sorted, search, categoryFilter, severityFilter]);

  const columns: Column<Observation>[] = [
    {
      key: 'learnerName',
      header: 'Learner',
      sortable: true,
      width: '180px',
      render: (o) => (
        <div>
          <p className="text-xs font-medium text-navy">{o.learnerName}</p>
          <p className="text-[10px] text-slate-400">{o.admissionNumber}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: '140px',
      render: (o) => {
        const c = categoryConfig[o.category];
        return <StatusBadge variant={c.variant} dot>{c.label}</StatusBadge>;
      },
    },
    {
      key: 'severity',
      header: 'Severity',
      width: '100px',
      render: (o) => (
        <StatusBadge variant={o.severity === 'critical' ? 'danger' : o.severity === 'high' ? 'warning' : o.severity === 'medium' ? 'info' : 'neutral'} dot>
          <span className="capitalize">{o.severity}</span>
        </StatusBadge>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (o) => <p className="line-clamp-2 text-xs text-navy">{o.description}</p>,
    },
    { key: 'date', header: 'Date', sortable: true, width: '100px' },
    { key: 'location', header: 'Location', width: '120px' },
    { key: 'recordedBy', header: 'Recorded by', width: '120px' },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (o) => <StatusBadge variant={o.status === 'open' ? 'warning' : o.status === 'reviewed' ? 'info' : 'success'} dot><span className="capitalize">{o.status}</span></StatusBadge>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Observations"
        count={observationsQ.data?.length || 0}
        subtitle="Record and track learner observations across all categories"
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="mr-1.5 h-3.5 w-3.5" /> Record observation</Button>
          </>
        }
      />

      <div className="border-b border-border bg-white px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by learner name..." className="h-9 pl-9 text-xs" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-[150px] text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {Object.entries(categoryConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-9 w-[120px] text-xs"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {observationsQ.isLoading ? (
          <DataTable columns={columns} data={[]} rowKey={() => ''} loading />
        ) : observationsQ.isError ? (
          <ErrorState onRetry={() => observationsQ.refetch()} />
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-white">
            <EmptyState icon={Eye} title="No observations found" description="Record an observation to start tracking learner behaviour and welfare." actionLabel="Record observation" onAction={() => setCreateOpen(true)} />
          </div>
        ) : (
          <DataTable columns={columns} data={filtered} rowKey={(o) => o.id} sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} pageSize={12} />
        )}
      </div>

      <CreateObservationDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

function CreateObservationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [category, setCategory] = useState<ObservationCategory>('general_observation');
  const [severity, setSeverity] = useState('low');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    toast.success('Observation recorded successfully');
    onOpenChange(false);
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Observation</DialogTitle>
          <DialogDescription>Capture a factual observation. Do not label or categorise learners permanently.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Learner</Label>
              <Input placeholder="Search learner..." className="mt-1 h-9 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ObservationCategory)} className="mt-1 h-9 w-full rounded-md border border-border bg-white px-3 text-xs">
                {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Severity</Label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-border bg-white px-3 text-xs">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Location</Label>
              <Input placeholder="e.g. Classroom S2A" className="mt-1 h-9 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Date and time</Label>
              <Input type="datetime-local" className="mt-1 h-9 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Related occasion (optional)</Label>
              <Input placeholder="e.g. Morning Assembly" className="mt-1 h-9 text-xs" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Factual description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what was observed factually. Avoid labels such as 'bad student'." className="mt-1 text-xs" rows={4} />
          </div>
          <div>
            <Label className="text-xs">Immediate action taken (optional)</Label>
            <Input placeholder="e.g. Spoke with learner after class" className="mt-1 h-9 text-xs" />
          </div>
          <div>
            <Label className="text-xs">Recommended follow-up (optional)</Label>
            <Input placeholder="e.g. Schedule meeting with guardian" className="mt-1 h-9 text-xs" />
          </div>
          <label className="flex items-center gap-2 text-xs text-navy">
            <input type="checkbox" className="rounded border-border text-cyan-brand" />
            Parent/guardian contact recommended
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit}>Record observation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
