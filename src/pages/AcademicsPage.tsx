import { useState } from 'react';
import {
  GraduationCap, Plus, Download, BookOpen, FileText, TrendingUp,
  Users, AlertCircle, ClipboardList, Award, BarChart3,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Christian Religious Education', 'Kiswahili', 'Agriculture', 'ICT', 'Entrepreneurship'];

const competencyData = [
  { subject: 'Mathematics', competency: 78 },
  { subject: 'English', competency: 82 },
  { subject: 'Physics', competency: 71 },
  { subject: 'Chemistry', competency: 75 },
  { subject: 'Biology', competency: 80 },
  { subject: 'History', competency: 85 },
];

const classPerformance = [
  { class: 'S1', avg: 72 },
  { class: 'S2', avg: 68 },
  { class: 'S3', avg: 74 },
  { class: 'S4', avg: 79 },
  { class: 'S5', avg: 65 },
  { class: 'S6', avg: 71 },
];

export function AcademicsPage() {
  const [tab, setTab] = useState('subjects');

  return (
    <div>
      <PageHeader
        title="Academics"
        subtitle="Subjects, assessments, marks and competency tracking"
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
            <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Add subject</Button>
          </>
        }
      />

      <div className="p-4 lg:p-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 flex h-auto flex-wrap gap-1 rounded-lg border border-border bg-white p-1">
            {[
              { v: 'subjects', l: 'Subjects' },
              { v: 'assessments', l: 'Assessments' },
              { v: 'marks', l: 'Marks Entry' },
              { v: 'competency', l: 'Competency' },
              { v: 'analysis', l: 'Subject Analysis' },
              { v: 'class', l: 'Class Analysis' },
              { v: 'progress', l: 'Learner Progress' },
              { v: 'missing', l: 'Missing Work' },
              { v: 'completion', l: 'Teacher Completion' },
              { v: 'reports', l: 'Report Cards' },
            ].map((t) => (
              <TabsTrigger key={t.v} value={t.v} className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">{t.l}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="subjects" className="mt-0">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subjects.map((s, i) => (
                <div key={s} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-light"><BookOpen className="h-5 w-5 text-navy" /></div>
                    <StatusBadge variant={i % 3 === 0 ? 'success' : 'neutral'} dot>{i % 2 === 0 ? 'O-Level' : 'A-Level'}</StatusBadge>
                  </div>
                  <h4 className="text-sm font-semibold text-navy">{s}</h4>
                  <p className="mt-1 text-xs text-slate-500">{Math.floor(Math.random() * 4) + 2} classes · {Math.floor(Math.random() * 3) + 1} teacher(s)</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-navy">Term 2 · 2026 Assessments</h3>
              <div className="space-y-2">
                {['Beginning of Term Assessment', 'Mid-Term Assessment', 'End of Term Examination', 'Competency Assessment (S1-S3)'].map((a, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-cyan-brand" />
                      <div>
                        <p className="text-xs font-medium text-navy">{a}</p>
                        <p className="text-[10px] text-slate-400">{i < 2 ? 'Completed' : i === 2 ? 'Scheduled' : 'In progress'}</p>
                      </div>
                    </div>
                    <StatusBadge variant={i < 2 ? 'success' : i === 2 ? 'info' : 'warning'} dot>{i < 2 ? 'Completed' : i === 2 ? 'Scheduled' : 'Active'}</StatusBadge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="marks" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-navy">Marks Entry — Mathematics · S2A</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-slate-50/60">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Learner</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500">BOT (30)</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500">Mid-Term (30)</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500">EOT (40)</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500">Total</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Amina Nansubuga', 'Daniel Okello', 'Sarah Namusoke', 'Joshua Kato', 'Faith Atim'].map((name, i) => {
                      const bot = Math.floor(Math.random() * 15) + 15;
                      const mid = Math.floor(Math.random() * 15) + 15;
                      const eot = Math.floor(Math.random() * 20) + 20;
                      const total = bot + mid + eot;
                      const grade = total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : total >= 50 ? 'D' : 'E';
                      return (
                        <tr key={i} className="border-b border-border">
                          <td className="px-3 py-2 text-xs font-medium text-navy">{name}</td>
                          <td className="px-3 py-2 text-center"><input type="number" defaultValue={bot} className="h-7 w-16 rounded border border-border px-2 text-center text-xs" /></td>
                          <td className="px-3 py-2 text-center"><input type="number" defaultValue={mid} className="h-7 w-16 rounded border border-border px-2 text-center text-xs" /></td>
                          <td className="px-3 py-2 text-center"><input type="number" defaultValue={eot} className="h-7 w-16 rounded border border-border px-2 text-center text-xs" /></td>
                          <td className="px-3 py-2 text-center text-xs font-semibold text-navy">{total}</td>
                          <td className="px-3 py-2 text-center"><StatusBadge variant={grade === 'A' ? 'success' : grade === 'E' ? 'danger' : 'info'}>{grade}</StatusBadge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex justify-end"><Button size="sm">Save marks</Button></div>
            </div>
          </TabsContent>

          <TabsContent value="competency" className="mt-0">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-navy">Lower-secondary competency assessment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={competencyData}>
                    <PolarGrid stroke="#E6ECF2" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#667085' }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#667085' }} />
                    <Radar dataKey="competency" stroke="#43BDEB" fill="#43BDEB" fillOpacity={0.3} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-navy">Competency breakdown</h3>
                <div className="space-y-2">
                  {competencyData.map((c) => (
                    <div key={c.subject} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <span className="text-xs font-medium text-navy">{c.subject}</span>
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-cyan-brand" style={{ width: `${c.competency}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-navy">{c.competency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-navy">Subject performance analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={competencyData}>
                  <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#667085' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="competency" fill="#132465" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="class" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-navy">Class performance comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classPerformance}>
                  <XAxis dataKey="class" tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="avg" fill="#43BDEB" radius={[4, 4, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy"><TrendingUp className="h-4 w-4 text-cyan-brand" /> Learner progress tracking</h3>
              <p className="text-sm text-slate-500">Select a learner to view their academic progress across terms and subjects.</p>
            </div>
          </TabsContent>

          <TabsContent value="missing" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy"><AlertCircle className="h-4 w-4 text-warning" /> Missing work</h3>
              <div className="space-y-2">
                {['Amina Nansubuga — Mathematics EOT', 'Daniel Okello — Physics Mid-Term', 'Sarah Namusoke — Chemistry BOT'].map((m, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="text-xs text-navy">{m}</span>
                    <Button size="sm" variant="outline" className="h-6 text-xs">Follow up</Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="completion" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy"><ClipboardList className="h-4 w-4 text-cyan-brand" /> Teacher marks entry completion</h3>
              <div className="space-y-2">
                {[
                  { name: 'Kato Joshua', subject: 'Mathematics', completion: 85 },
                  { name: 'Atim Faith', subject: 'Physics', completion: 72 },
                  { name: 'Ssemanda Brian', subject: 'English', completion: 95 },
                  { name: 'Nabirye Lydia', subject: 'Biology', completion: 60 },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <div>
                      <p className="text-xs font-medium text-navy">{t.name}</p>
                      <p className="text-[10px] text-slate-400">{t.subject}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 rounded-full bg-slate-100">
                        <div className={t.completion >= 80 ? 'h-full rounded-full bg-success' : t.completion >= 60 ? 'h-full rounded-full bg-warning' : 'h-full rounded-full bg-danger'} style={{ width: `${t.completion}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-navy">{t.completion}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-0">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy"><Award className="h-4 w-4 text-cyan-brand" /> Report cards</h3>
              <p className="text-sm text-slate-500">Generate term report cards for individual learners or entire classes. Ranking is optional and can be disabled in settings.</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm">Generate class reports</Button>
                <Button size="sm" variant="outline">Generate individual report</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
