import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ChevronLeft, Edit, QrCode, Eye, CalendarPlus, Printer, MoreHorizontal,
  Lock, Download, RefreshCw, X, ShieldAlert,
} from 'lucide-react';
import { learnerService, observationService, caseService } from '@/services/api';
import { StatusBadge, attendanceStatusBadge } from '@/components/shared/StatusBadge';
import { LoadingState, ErrorState, SensitiveDataNotice } from '@/components/shared/States';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { isWelfareRestricted } from '@/lib/permissions';
import { cn } from '@/lib/utils';

export function LearnerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);

  const learnerQ = useQuery({
    queryKey: ['learner', id],
    queryFn: () => learnerService.getById(id!),
    enabled: !!id,
  });
  const observationsQ = useQuery({ queryKey: ['observations'], queryFn: observationService.list });
  const casesQ = useQuery({ queryKey: ['cases'], queryFn: caseService.list });

  if (learnerQ.isLoading) return <LoadingState className="py-20" />;
  if (learnerQ.isError || !learnerQ.data) return <ErrorState onRetry={() => learnerQ.refetch()} className="py-20" />;

  const l = learnerQ.data;
  const b = attendanceStatusBadge(l.todayStatus);
  const qrBadge = attendanceStatusBadge(l.qrStatus);
  const learnerObs = (observationsQ.data || []).filter((o) => o.learnerId === l.id);
  const learnerCases = (casesQ.data || []).filter((c) => c.learnerId === l.id);
  const welfareRestricted = isWelfareRestricted(user!.role);

  const attendanceData = Array.from({ length: 7 }, (_, i) => ({
    week: `W${i + 1}`,
    rate: Math.floor(Math.random() * 15) + 82 + i,
  }));

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border bg-white px-4 py-4 lg:px-6">
        <button onClick={() => navigate('/learners')} className="mb-3 flex items-center gap-1 text-xs text-slate-500 hover:text-navy">
          <ChevronLeft className="h-3.5 w-3.5" /> Back to learners
        </button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage src={l.photo} />
              <AvatarFallback className="bg-navy/10 text-lg font-semibold text-navy">
                {l.firstName[0]}{l.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-navy">{l.firstName} {l.lastName}</h1>
              <p className="text-sm text-slate-500">{l.admissionNumber} · {l.lin}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <StatusBadge variant="neutral">{l.className} · {l.streamName}</StatusBadge>
                <span className="capitalize text-xs text-slate-500">{l.boardingStatus}</span>
                <StatusBadge variant={b.variant} dot>{b.label} today</StatusBadge>
                <StatusBadge variant={qrBadge.variant} dot>QR: {qrBadge.label}</StatusBadge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm"><Edit className="mr-1.5 h-3.5 w-3.5" /> Edit profile</Button>
            <Button variant="outline" size="sm" onClick={() => setQrDialogOpen(true)}><QrCode className="mr-1.5 h-3.5 w-3.5" /> Replace QR</Button>
            <Button variant="outline" size="sm"><Eye className="mr-1.5 h-3.5 w-3.5" /> Record observation</Button>
            <Button variant="outline" size="sm"><CalendarPlus className="mr-1.5 h-3.5 w-3.5" /> Authorize absence</Button>
            <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print summary</Button>
            <Button variant="ghost" size="sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4 lg:p-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-4 flex h-auto flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
            {[
              { v: 'overview', l: 'Overview' },
              { v: 'attendance', l: 'Attendance' },
              { v: 'academics', l: 'Academics' },
              { v: 'conduct', l: 'Conduct' },
              { v: 'welfare', l: 'Welfare', restricted: welfareRestricted },
              { v: 'health', l: 'Health', restricted: welfareRestricted },
              { v: 'participation', l: 'Participation' },
              { v: 'interventions', l: 'Interventions' },
              { v: 'documents', l: 'Documents' },
              { v: 'timeline', l: 'Timeline' },
            ].map((t) => (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white',
                )}
              >
                {t.l}
                {t.restricted && <Lock className="h-3 w-3" />}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-navy">Key information</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                    {[
                      ['Admission No.', l.admissionNumber],
                      ['LIN', l.lin],
                      ['UNEB Number', l.unebNumber || '—'],
                      ['Date of birth', l.dateOfBirth],
                      ['Gender', <span className="capitalize">{l.gender}</span>],
                      ['Nationality', l.nationality],
                      ['Class', l.className],
                      ['Stream', l.streamName],
                      ['House', l.houseName || '—'],
                      ['Dormitory', l.dormitoryName || '—'],
                      ['Boarding', <span className="capitalize">{l.boardingStatus}</span>],
                      ['Enrolled', l.enrollmentDate],
                    ].map(([label, value], i) => (
                      <div key={i}>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">{label as string}</p>
                        <p className="text-xs font-medium text-navy">{value as React.ReactNode}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-navy">Guardian and emergency contact</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-navy">{l.guardians[0]?.name}</p>
                      <p className="text-[10px] text-slate-400">{l.guardians[0]?.relationship} · Emergency contact: {l.guardians[0]?.isEmergencyContact ? 'Yes' : 'No'}</p>
                      <p className="mt-1 text-xs text-navy">{l.guardians[0]?.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-navy">QR credential</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-50">
                      <QrCode className="h-12 w-12 text-navy" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge variant={qrBadge.variant} dot>{qrBadge.label}</StatusBadge>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500">Issued: 15 Jan 2026 by Daniel Okello</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Button size="sm" variant="outline" className="h-7 text-xs"><Printer className="mr-1 h-3 w-3" /> Print</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs"><Download className="mr-1 h-3 w-3" /> Download</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setRevokeDialogOpen(true)}><X className="mr-1 h-3 w-3" /> Revoke</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-navy">Attendance summary</h3>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="relative flex h-16 w-16 items-center justify-center">
                      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#E6ECF2" strokeWidth="3" />
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#43BDEB" strokeWidth="3" strokeDasharray={`${l.attendancePercentage} 100`} pathLength={100} />
                      </svg>
                      <span className="absolute text-sm font-semibold text-navy">{l.attendancePercentage}%</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      <p>Overall attendance rate</p>
                      <p className="mt-1 text-navy">{l.attendancePercentage >= 90 ? 'Good standing' : l.attendancePercentage >= 80 ? 'Monitor' : 'At risk'}</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={attendanceData}>
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#667085' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: '#667085' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Area type="monotone" dataKey="rate" stroke="#43BDEB" strokeWidth={2} fill="#E8F8FE" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-navy">Recent observations</h3>
                  <div className="space-y-2">
                    {learnerObs.slice(0, 3).map((o) => (
                      <div key={o.id} className="rounded-lg border border-border px-3 py-2">
                        <div className="flex items-center justify-between">
                          <StatusBadge variant={o.severity === 'high' || o.severity === 'critical' ? 'danger' : 'info'} dot>{o.category.replace(/_/g, ' ')}</StatusBadge>
                          <span className="text-[10px] text-slate-400">{o.date}</span>
                        </div>
                        <p className="mt-1.5 text-xs text-navy">{o.description}</p>
                      </div>
                    ))}
                    {learnerObs.length === 0 && <p className="text-xs text-slate-400">No observations recorded.</p>}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-navy">Attendance history</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={attendanceData}>
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="rate" stroke="#43BDEB" strokeWidth={2} fill="#E8F8FE" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="academics" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Academic records and competency tracking will appear here. This module connects to the academics API.</p>
            </div>
          </TabsContent>

          <TabsContent value="conduct" className="mt-0">
            <div className="space-y-3">
              {learnerCases.map((c) => (
                <div key={c.id} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-navy">{c.caseNumber}</p>
                    <StatusBadge variant={c.priority === 'urgent' ? 'danger' : c.priority === 'high' ? 'warning' : 'info'} dot>{c.stage.replace(/_/g, ' ')}</StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Case details are restricted to authorised staff.</p>
                </div>
              ))}
              {learnerCases.length === 0 && <p className="text-sm text-slate-400">No conduct cases on record.</p>}
            </div>
          </TabsContent>

          <TabsContent value="welfare" className="mt-0">
            {welfareRestricted ? (
              <div className="rounded-xl border border-border bg-white p-6">
                <SensitiveDataNotice message="Welfare information is restricted to authorised staff (administrators, headteacher, nurse, warden). Your current role does not permit access to this section." />
              </div>
            ) : (
              <div className="space-y-4">
                <SensitiveDataNotice />
                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-navy">Welfare observations</h3>
                  <div className="space-y-2">
                    {learnerObs.filter((o) => o.category === 'welfare_concern').map((o) => (
                      <div key={o.id} className="rounded-lg border border-border px-3 py-2">
                        <p className="text-xs text-navy">{o.description}</p>
                        <p className="mt-1 text-[10px] text-slate-400">{o.date} · {o.recordedBy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="health" className="mt-0">
            {welfareRestricted ? (
              <div className="rounded-xl border border-border bg-white p-6">
                <SensitiveDataNotice message="Health encounter records are restricted to the school nurse and authorised administrators." />
              </div>
            ) : (
              <div className="space-y-4">
                <SensitiveDataNotice />
                <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-navy">Sick-bay visits</h3>
                  <p className="text-sm text-slate-400">No health encounters recorded this term.</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="participation" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Clubs, sports and activity participation records will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="interventions" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-navy">Active interventions</h3>
              <div className="rounded-lg border border-info/30 bg-info/5 p-3">
                <p className="text-xs font-medium text-navy">Mentorship Programme</p>
                <p className="mt-1 text-[10px] text-slate-400">Assigned to Atim Faith · Review in 5 days · Active</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Uploaded documents and certificates will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-navy">Activity timeline</h3>
              <div className="space-y-3">
                {[
                  { date: 'Today', event: 'Marked present at Morning Gate Entry', by: 'System' },
                  { date: 'Yesterday', event: 'Observation recorded: Positive conduct', by: 'Kato Joshua' },
                  { date: '3 days ago', event: 'QR credential used at Assembly Scanner 02', by: 'System' },
                  { date: '1 week ago', event: 'Enrolled in Mentorship Programme', by: 'Atim Faith' },
                ].map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-cyan-brand" />
                      {i < 3 && <div className="h-full w-px bg-border" />}
                    </div>
                    <div className="pb-3">
                      <p className="text-xs font-medium text-navy">{t.event}</p>
                      <p className="text-[10px] text-slate-400">{t.date} · {t.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Preview Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR Credential Preview</DialogTitle>
            <DialogDescription>The QR code contains an opaque token. No personal data is encoded.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="flex h-48 w-48 items-center justify-center rounded-xl border-2 border-navy bg-white">
              <QrCode className="h-32 w-32 text-navy" />
            </div>
            <p className="mt-3 text-xs text-slate-500">Token: QR-••••••••••••••••</p>
            <p className="text-[10px] text-slate-400">Issued: 15 Jan 2026 · Status: Active</p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print card</Button>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Download</Button>
            <Button variant="outline" size="sm" onClick={() => { setQrDialogOpen(false); setRevokeDialogOpen(true); }}><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Replace</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-danger" /> Revoke QR Credential</DialogTitle>
            <DialogDescription>This action is irreversible. A reason and responsible staff member are required.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-medium text-navy">Reason for revocation</label>
              <select className="mt-1 h-9 w-full rounded-md border border-border bg-white px-3 text-xs">
                <option>Lost card</option>
                <option>Stolen card</option>
                <option>Damaged card</option>
                <option>Learner withdrawn</option>
                <option>Security concern</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-navy">Responsible staff member</label>
              <Input placeholder="Daniel Okello" className="mt-1 h-9 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setRevokeDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={() => { setRevokeDialogOpen(false); }}>Confirm revocation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
