import { useQuery } from '@tanstack/react-query';
import {
  Users, CheckCircle2, Clock, AlertCircle, HeartPulse, Smartphone,
  Plus, Upload, ScanLine, Eye, CalendarPlus, FileBarChart, UserPlus,
  ArrowRight, RefreshCw, Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricCard } from '@/components/shared/MetricCard';
import { ChartCard } from '@/components/shared/PageHeader';
import { StatusBadge, attendanceStatusBadge } from '@/components/shared/StatusBadge';
import { LoadingState, ErrorState } from '@/components/shared/States';
import { dashboardService, attendanceService, observationService, caseService, deviceService } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export function DashboardPage() {
  const metricsQ = useQuery({ queryKey: ['dashboard-metrics'], queryFn: dashboardService.getMetrics });
  const trendQ = useQuery({ queryKey: ['attendance-trend'], queryFn: dashboardService.getAttendanceTrend });
  const classQ = useQuery({ queryKey: ['class-attendance'], queryFn: dashboardService.getClassAttendance });
  const occasionsQ = useQuery({ queryKey: ['occasions'], queryFn: attendanceService.getOccasions });
  const observationsQ = useQuery({ queryKey: ['observations'], queryFn: observationService.list });
  const casesQ = useQuery({ queryKey: ['cases'], queryFn: caseService.list });
  const devicesQ = useQuery({ queryKey: ['devices'], queryFn: deviceService.list });

  if (metricsQ.isLoading) return <LoadingState className="py-20" />;
  if (metricsQ.isError) return <ErrorState onRetry={() => metricsQ.refetch()} className="py-20" />;

  const m = metricsQ.data!;
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const distributionData = [
    { name: 'Present', value: m.presentToday, color: '#22A06B' },
    { name: 'Late', value: m.lateToday, color: '#E9A23B' },
    { name: 'Absent', value: m.unexplainedAbsences, color: '#D64545' },
    { name: 'Excused', value: 14, color: '#2F80ED' },
  ];

  const caseStatusData = [
    { name: 'Submitted', count: 3 },
    { name: 'Assigned', count: 2 },
    { name: 'Under Review', count: 2 },
    { name: 'Intervention', count: 2 },
    { name: 'Closed', count: 1 },
  ];

  const quickActions = [
    { label: 'Add learner', icon: Plus, path: '/learners' },
    { label: 'Import learners', icon: Upload, path: '/learners' },
    { label: 'Create occasion', icon: CalendarPlus, path: '/occasions' },
    { label: 'Start scanning', icon: ScanLine, path: '/attendance' },
    { label: 'Record observation', icon: Eye, path: '/observations' },
    { label: 'Authorize absence', icon: CalendarPlus, path: '/welfare' },
    { label: 'Generate report', icon: FileBarChart, path: '/reports' },
    { label: 'Add staff member', icon: UserPlus, path: '/staff' },
  ];

  return (
    <div className="space-y-5 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-navy">Good morning, Administrator</h1>
        <p className="text-sm text-slate-500">Here is today's school attendance and learner-support overview.</p>
        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
          <span>{today}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>Term 2 · 2026</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Active learners" value={m.activeLearners} icon={Users} change={m.changes.activeLearners} iconColor="text-navy" iconBg="bg-navy/5" />
        <MetricCard label="Present today" value={m.presentToday} icon={CheckCircle2} change={m.changes.presentToday} iconColor="text-success" iconBg="bg-success/10" />
        <MetricCard label="Late today" value={m.lateToday} icon={Clock} change={m.changes.lateToday} iconColor="text-warning" iconBg="bg-warning/10" />
        <MetricCard label="Unexplained absences" value={m.unexplainedAbsences} icon={AlertCircle} change={m.changes.unexplainedAbsences} iconColor="text-danger" iconBg="bg-danger/10" />
        <MetricCard label="Open welfare concerns" value={m.openWelfareConcerns} icon={HeartPulse} change={m.changes.openWelfareConcerns} iconColor="text-info" iconBg="bg-info/10" />
        <MetricCard label="Devices awaiting sync" value={m.devicesAwaitingSync} icon={Smartphone} change={m.changes.devicesAwaitingSync} iconColor="text-cyan-brand" iconBg="bg-cyan-light" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Seven-day attendance trend" subtitle="Daily present, late and absent counts">
          {trendQ.isLoading ? <LoadingState /> : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trendQ.data}>
                <defs>
                  <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22A06B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22A06B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gLate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E9A23B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E9A23B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E6ECF2' }} />
                <Area type="monotone" dataKey="present" stroke="#22A06B" strokeWidth={2} fill="url(#gPresent)" name="Present" />
                <Area type="monotone" dataKey="late" stroke="#E9A23B" strokeWidth={2} fill="url(#gLate)" name="Late" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Attendance status distribution" subtitle="Today's breakdown">
          {metricsQ.isLoading ? <LoadingState /> : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={240}>
                <PieChart>
                  <Pie data={distributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {distributionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E6ECF2' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {distributionData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-slate-600">{d.name}</span>
                    </div>
                    <span className="font-semibold text-navy">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Attendance by class" subtitle="Today's percentage per class">
          {classQ.isLoading ? <LoadingState /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={classQ.data} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="className" tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E6ECF2' }} />
                <Bar dataKey="percentage" fill="#43BDEB" radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Cases and interventions status" subtitle="Current case pipeline">
          {casesQ.isLoading ? <LoadingState /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={caseStatusData}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#667085' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E6ECF2' }} />
                <Bar dataKey="count" fill="#132465" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Operational sections */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {/* Today's occasions */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-navy">Today's occasions</h3>
            <Link to="/occasions" className="flex items-center gap-1 text-xs text-cyan-brand hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {(occasionsQ.data || []).slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-navy">{o.name}</p>
                  <p className="text-[10px] text-slate-400">{o.location} · {o.startTime}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-navy">{o.completionPercentage}%</span>
                  <StatusBadge variant={attendanceStatusBadge(o.status).variant} dot>{attendanceStatusBadge(o.status).label}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unexplained absences */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-navy">Recent unexplained absences</h3>
            <Link to="/attendance" className="flex items-center gap-1 text-xs text-cyan-brand hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {['Amina Nansubuga', 'Daniel Okello', 'Sarah Namusoke', 'Joshua Kato'].map((name, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-navy">
                    {name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-navy">{name}</p>
                    <p className="text-[10px] text-slate-400">S{(i % 4) + 1} · {i % 2 === 0 ? 'Boarding' : 'Day'}</p>
                  </div>
                </div>
                <StatusBadge variant="danger" dot>Absent</StatusBadge>
              </div>
            ))}
          </div>
        </div>

        {/* Serious cases */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-navy">Serious cases requiring review</h3>
            <Link to="/cases" className="flex items-center gap-1 text-xs text-cyan-brand hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {(casesQ.data || []).filter((c) => c.priority === 'high' || c.priority === 'urgent').slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-navy">{c.caseNumber}</p>
                  <p className="truncate text-[10px] text-slate-400">Case details restricted</p>
                </div>
                <StatusBadge variant={c.priority === 'urgent' ? 'danger' : 'warning'} dot>{c.priority}</StatusBadge>
              </div>
            ))}
          </div>
        </div>

        {/* Devices with sync problems */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-navy">Devices with sync problems</h3>
            <Link to="/devices" className="flex items-center gap-1 text-xs text-cyan-brand hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {(devicesQ.data || []).filter((d) => d.status !== 'synced').slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-navy">{d.name}</p>
                  <p className="text-[10px] text-slate-400">{d.location} · {d.pendingRecords} pending</p>
                </div>
                <StatusBadge variant={attendanceStatusBadge(d.status).variant} dot>{attendanceStatusBadge(d.status).label}</StatusBadge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent staff actions */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-navy">Recent staff actions</h3>
            <Link to="/audit" className="flex items-center gap-1 text-xs text-cyan-brand hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Sarah Namusoke', action: 'Closed case CASE/2026/0103', time: '5 min ago' },
              { name: 'Daniel Okello', action: 'Generated QR card for learner', time: '12 min ago' },
              { name: 'Faith Atim', action: 'Recorded welfare observation', time: '28 min ago' },
              { name: 'Joshua Kato', action: 'Started attendance occasion', time: '45 min ago' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-lg px-1 py-1.5">
                <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-brand" />
                <div className="min-w-0">
                  <p className="text-xs text-navy"><span className="font-medium">{a.name}</span> {a.action}</p>
                  <p className="text-[10px] text-slate-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-navy">Quick actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((qa) => (
              <Link
                key={qa.label}
                to={qa.path}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-xs font-medium text-navy hover:border-cyan-brand hover:bg-cyan-light/40"
              >
                <qa.icon className="h-4 w-4 text-cyan-brand" />
                <span className="truncate">{qa.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
