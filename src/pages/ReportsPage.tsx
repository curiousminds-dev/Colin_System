import { useState } from 'react';
import {
  Download, Printer, FileBarChart, Calendar, Filter,
  ScanLine, ClipboardList, HeartPulse, Smartphone, ScrollText,
  QrCode, Database, GraduationCap, CheckCircle2, ShieldAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface ReportItem {
  title: string;
  description: string;
  icon: LucideIcon;
  restricted?: boolean;
}

const reportCategories: { name: string; reports: ReportItem[] }[] = [
  {
    name: 'Attendance',
    reports: [
      { title: 'Daily register', description: 'Day-by-day attendance for all learners', icon: Calendar },
      { title: 'Weekly summary', description: 'Weekly attendance overview by class', icon: FileBarChart },
      { title: 'Term report', description: 'Full term attendance summary', icon: FileBarChart },
      { title: 'Late-coming report', description: 'Learners with frequent late arrivals', icon: ScanLine },
      { title: 'Unexplained absence', description: 'Absences without authorization', icon: ShieldAlert },
      { title: 'Authorized absence', description: 'Approved absences with reasons', icon: CheckCircle2 },
      { title: 'Attendance by class', description: 'Comparative class attendance rates', icon: FileBarChart },
      { title: 'Attendance by learner', description: 'Individual learner attendance history', icon: FileBarChart },
    ],
  },
  {
    name: 'Welfare and Conduct',
    reports: [
      { title: 'Positive conduct', description: 'Learners with positive observations', icon: CheckCircle2 },
      { title: 'Open concerns', description: 'Active welfare and conduct concerns', icon: ShieldAlert, restricted: true },
      { title: 'Case status', description: 'Case pipeline and outcomes summary', icon: ClipboardList, restricted: true },
      { title: 'Intervention follow-up', description: 'Active interventions and review dates', icon: HeartPulse, restricted: true },
      { title: 'Sick-bay summary', description: 'Sick-bay visits and outcomes', icon: HeartPulse, restricted: true },
    ],
  },
  {
    name: 'Administration',
    reports: [
      { title: 'Device synchronization', description: 'Sync status and pending records', icon: Smartphone },
      { title: 'Audit report', description: 'Staff activity and system events', icon: ScrollText },
      { title: 'Staff activity', description: 'Login and action summary by staff', icon: ScrollText },
      { title: 'QR replacements', description: 'QR card issuance and revocation log', icon: QrCode },
      { title: 'Data quality', description: 'Missing or incomplete records', icon: Database },
    ],
  },
];

export function ReportsPage() {
  const [category, setCategory] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const visibleCategories = category === 'all' ? reportCategories : reportCategories.filter((c) => c.name === category);

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generate and export attendance, welfare and administrative reports"
        actions={
          <>
            <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print preview</Button>
          </>
        }
      />

      <div className="border-b border-border bg-white px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 w-[180px] text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {reportCategories.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
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
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 w-[140px] text-xs" />
          <span className="text-xs text-slate-400">to</span>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 w-[140px] text-xs" />
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="space-y-6">
          {visibleCategories.map((cat) => (
            <div key={cat.name}>
              <h3 className="mb-3 text-sm font-semibold text-navy">{cat.name}</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.reports.map((r) => (
                  <div key={r.title} className="group rounded-xl border border-border bg-white p-4 shadow-sm hover:border-cyan-brand hover:shadow-md transition-all">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-light">
                        <r.icon className="h-5 w-5 text-navy" />
                      </div>
                      {r.restricted && <StatusBadge variant="warning" dot>Restricted</StatusBadge>}
                    </div>
                    <h4 className="text-sm font-semibold text-navy">{r.title}</h4>
                    <p className="mt-1 text-xs text-slate-500">{r.description}</p>
                    <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3">
                      <Button size="sm" variant="outline" className="h-7 text-xs"><Download className="mr-1 h-3 w-3" /> PDF</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs"><Download className="mr-1 h-3 w-3" /> CSV</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs"><Printer className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
