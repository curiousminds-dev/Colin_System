import { useState } from 'react';
import {
  School, Palette, Building2, CalendarDays, GraduationCap,
  Home, BedDouble, BookOpen, ScanLine, Clock, Eye, Bell,
  Award, Database, ShieldCheck, FileText, Languages, Save,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const sections: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'school', label: 'School profile', icon: School },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'campuses', label: 'Campuses', icon: Building2 },
  { id: 'years', label: 'Academic years', icon: CalendarDays },
  { id: 'terms', label: 'Terms', icon: CalendarDays },
  { id: 'classes', label: 'Classes', icon: GraduationCap },
  { id: 'streams', label: 'Streams', icon: GraduationCap },
  { id: 'houses', label: 'Houses', icon: Home },
  { id: 'dormitories', label: 'Dormitories', icon: BedDouble },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'attendance', label: 'Attendance rules', icon: ScanLine },
  { id: 'late', label: 'Late thresholds', icon: Clock },
  { id: 'observation', label: 'Observation categories', icon: Eye },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'grading', label: 'Grading', icon: Award },
  { id: 'retention', label: 'Retention', icon: Database },
  { id: 'backups', label: 'Backups', icon: Database },
  { id: 'privacy', label: 'Privacy notices', icon: ShieldCheck },
  { id: 'consent', label: 'Consent', icon: FileText },
  { id: 'languages', label: 'Languages', icon: Languages },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('school');

  return (
    <div>
      <PageHeader
        title="School Settings"
        subtitle="Configure your school, academic structure, attendance rules and privacy"
        actions={<Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save changes</Button>}
      />

      <div className="p-4 lg:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="flex flex-col gap-4 lg:flex-row">
          <TabsList className="flex h-auto w-full flex-wrap gap-1 rounded-lg border border-border bg-white p-2 lg:w-[220px] lg:flex-col">
            {sections.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-xs font-medium text-slate-600 data-[state=active]:bg-cyan-brand data-[state=active]:text-white"
              >
                <s.icon className="h-4 w-4" />
                <span className="truncate">{s.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1">
            <TabsContent value="school" className="mt-0">
              <SettingsCard title="School profile" description="Basic information about your school">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="School name"><Input defaultValue="Nile Crest Secondary School" className="h-9 text-xs" /></FormField>
                  <FormField label="Motto"><Input defaultValue="Knowledge · Integrity · Service" className="h-9 text-xs" /></FormField>
                  <FormField label="Address"><Input defaultValue="Plot 14, Kololo Hill Drive" className="h-9 text-xs" /></FormField>
                  <FormField label="District"><Input defaultValue="Kampala" className="h-9 text-xs" /></FormField>
                  <FormField label="Region"><Input defaultValue="Central" className="h-9 text-xs" /></FormField>
                  <FormField label="School code"><Input defaultValue="NC-SEC-2018" className="h-9 text-xs" /></FormField>
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="branding" className="mt-0">
              <SettingsCard title="Branding" description="Logo, colours and visual identity">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs">School logo</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-navy"><School className="h-8 w-8 text-white" /></div>
                      <div>
                        <Button size="sm" variant="outline">Upload logo</Button>
                        <p className="mt-1 text-[10px] text-slate-400">PNG or SVG, max 512x512px</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                      ['Primary navy', '#132465'],
                      ['Sidebar dark', '#0F1E56'],
                      ['Active cyan', '#43BDEB'],
                      ['Page background', '#F4F8FC'],
                    ].map(([label, color]) => (
                      <div key={label}>
                        <Label className="text-xs">{label}</Label>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg border border-border" style={{ backgroundColor: color }} />
                          <Input defaultValue={color} className="h-8 text-xs" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="campuses" className="mt-0">
              <SettingsCard title="Campuses" description="Manage school campuses">
                <div className="space-y-2">
                  {['Kampala', 'Entebbe', 'Jinja'].map((c) => (
                    <div key={c} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <span className="text-xs font-medium text-navy">{c}</span>
                      <StatusBadge variant={c === 'Kampala' ? 'success' : 'neutral'} dot>{c === 'Kampala' ? 'Primary' : 'Secondary'}</StatusBadge>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="mt-3">Add campus</Button>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="years" className="mt-0">
              <SettingsCard title="Academic years" description="Manage academic year calendar">
                <div className="space-y-2">
                  {[
                    { year: '2026', start: 'Jan 2026', end: 'Dec 2026', current: true },
                    { year: '2025', start: 'Jan 2025', end: 'Dec 2025', current: false },
                  ].map((y) => (
                    <div key={y.year} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <div>
                        <p className="text-xs font-medium text-navy">Academic Year {y.year}</p>
                        <p className="text-[10px] text-slate-400">{y.start} — {y.end}</p>
                      </div>
                      {y.current && <StatusBadge variant="success" dot>Current</StatusBadge>}
                    </div>
                  ))}
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="terms" className="mt-0">
              <SettingsCard title="Terms" description="Configure term dates">
                <div className="space-y-2">
                  {[
                    { name: 'Term 1', start: 'Feb 2026', end: 'May 2026', current: false },
                    { name: 'Term 2', start: 'May 2026', end: 'Aug 2026', current: true },
                    { name: 'Term 3', start: 'Sep 2026', end: 'Dec 2026', current: false },
                  ].map((t) => (
                    <div key={t.name} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <div>
                        <p className="text-xs font-medium text-navy">{t.name} · 2026</p>
                        <p className="text-[10px] text-slate-400">{t.start} — {t.end}</p>
                      </div>
                      {t.current && <StatusBadge variant="success" dot>Current</StatusBadge>}
                    </div>
                  ))}
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="classes" className="mt-0">
              <SettingsCard title="Classes" description="Senior One through Senior Six">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {['Senior One', 'Senior Two', 'Senior Three', 'Senior Four', 'Senior Five', 'Senior Six'].map((c) => (
                    <div key={c} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <span className="text-xs font-medium text-navy">{c}</span>
                      <StatusBadge variant={c.includes('Four') || c.includes('Six') ? 'info' : 'neutral'}>{c.includes('Four') || c.includes('Six') ? 'A-Level' : 'O-Level'}</StatusBadge>
                    </div>
                  ))}
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="streams" className="mt-0">
              <SettingsCard title="Streams" description="Class streams (A, B, C)">
                <div className="flex gap-2">
                  {['A', 'B', 'C'].map((s) => (
                    <div key={s} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-sm font-semibold text-navy">{s}</div>
                  ))}
                  <Button size="sm" variant="outline">Add stream</Button>
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="houses" className="mt-0">
              <SettingsCard title="Houses" description="School houses for competitions">
                <div className="space-y-2">
                  {[
                    { name: 'Crane House', color: '#43BDEB' },
                    { name: 'Marabou House', color: '#22A06B' },
                    { name: 'Crested Eagle House', color: '#E9A23B' },
                    { name: 'Buffalo House', color: '#D64545' },
                  ].map((h) => (
                    <div key={h.name} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: h.color }} />
                      <span className="text-xs font-medium text-navy">{h.name}</span>
                    </div>
                  ))}
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="dormitories" className="mt-0">
              <SettingsCard title="Dormitories" description="Boarding facilities">
                <div className="space-y-2">
                  {[
                    { name: 'Nile Boys Dormitory', gender: 'Male', capacity: 120 },
                    { name: 'Victoria Boys Dormitory', gender: 'Male', capacity: 100 },
                    { name: 'Pearl Girls Dormitory', gender: 'Female', capacity: 110 },
                    { name: 'Equator Girls Dormitory', gender: 'Female', capacity: 90 },
                  ].map((d) => (
                    <div key={d.name} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <div>
                        <p className="text-xs font-medium text-navy">{d.name}</p>
                        <p className="text-[10px] text-slate-400">{d.gender} · Capacity: {d.capacity}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="h-6 text-xs">Edit</Button>
                    </div>
                  ))}
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="subjects" className="mt-0">
              <SettingsCard title="Subjects" description="Academic subjects offered">
                <div className="flex flex-wrap gap-2">
                  {['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'CRE', 'Kiswahili', 'Agriculture', 'ICT', 'Entrepreneurship'].map((s) => (
                    <span key={s} className="rounded-lg border border-border bg-slate-50 px-3 py-1.5 text-xs font-medium text-navy">{s}</span>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="mt-3">Add subject</Button>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="attendance" className="mt-0">
              <SettingsCard title="Attendance rules" description="Configure attendance policies">
                <div className="space-y-4">
                  <ToggleRow label="Require QR scan for all occasions" defaultChecked />
                  <ToggleRow label="Allow manual attendance entry" defaultChecked />
                  <ToggleRow label="Auto-close occasions at end time" />
                  <ToggleRow label="Notify guardians of absences automatically" defaultChecked />
                  <FormField label="Grace period (minutes)"><Input type="number" defaultValue="15" className="h-9 text-xs" /></FormField>
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="late" className="mt-0">
              <SettingsCard title="Late thresholds" description="Define when a learner is marked late">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Morning assembly late (minutes)"><Input type="number" defaultValue="10" className="h-9 text-xs" /></FormField>
                  <FormField label="Class lesson late (minutes)"><Input type="number" defaultValue="5" className="h-9 text-xs" /></FormField>
                  <FormField label="Gate entry late (minutes)"><Input type="number" defaultValue="15" className="h-9 text-xs" /></FormField>
                  <FormField label="Prep late (minutes)"><Input type="number" defaultValue="10" className="h-9 text-xs" /></FormField>
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="observation" className="mt-0">
              <SettingsCard title="Observation categories" description="Categories for learner observations">
                <div className="flex flex-wrap gap-2">
                  {['Positive Conduct', 'Academic Observation', 'Minor Concern', 'Welfare Concern', 'General Observation', 'Serious Alleged Incident'].map((c) => (
                    <span key={c} className="rounded-lg border border-border bg-slate-50 px-3 py-1.5 text-xs font-medium text-navy">{c}</span>
                  ))}
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <SettingsCard title="Notification settings" description="SMS and in-app notification preferences">
                <div className="space-y-4">
                  <ToggleRow label="Absence alerts to guardians" defaultChecked />
                  <ToggleRow label="Arrival notifications" defaultChecked />
                  <ToggleRow label="Late arrival alerts" defaultChecked />
                  <ToggleRow label="Parent meeting reminders" defaultChecked />
                  <ToggleRow label="Intervention follow-up reminders" defaultChecked />
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="grading" className="mt-0">
              <SettingsCard title="Grading system" description="Grade boundaries and assessment weights">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-slate-50/60">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Grade</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Range</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['A', '80-100', 'Excellent'],
                        ['B', '70-79', 'Very Good'],
                        ['C', '60-69', 'Good'],
                        ['D', '50-59', 'Fair'],
                        ['E', '40-49', 'Below Average'],
                        ['F', '0-39', 'Fail'],
                      ].map((g) => (
                        <tr key={g[0]} className="border-b border-border">
                          <td className="px-3 py-2 text-xs font-semibold text-navy">{g[0]}</td>
                          <td className="px-3 py-2 text-xs text-navy">{g[1]}</td>
                          <td className="px-3 py-2 text-xs text-slate-500">{g[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3">
                  <ToggleRow label="Enable ranking (optional)" />
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="retention" className="mt-0">
              <SettingsCard title="Data retention" description="How long records are kept">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Attendance records (years)"><Input type="number" defaultValue="7" className="h-9 text-xs" /></FormField>
                  <FormField label="Audit logs (years)"><Input type="number" defaultValue="10" className="h-9 text-xs" /></FormField>
                  <FormField label="Case records (years)"><Input type="number" defaultValue="7" className="h-9 text-xs" /></FormField>
                  <FormField label="Medical records (years)"><Input type="number" defaultValue="10" className="h-9 text-xs" /></FormField>
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="backups" className="mt-0">
              <SettingsCard title="Backups" description="Automated backup configuration">
                <div className="space-y-4">
                  <ToggleRow label="Enable automatic daily backups" defaultChecked />
                  <FormField label="Backup time"><Input type="time" defaultValue="02:00" className="h-9 text-xs" /></FormField>
                  <div>
                    <p className="mb-2 text-xs text-slate-500">Last backup: 03 Aug 2026, 02:00 AM</p>
                    <Button size="sm" variant="outline">Run backup now</Button>
                  </div>
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="privacy" className="mt-0">
              <SettingsCard title="Privacy notices" description="Data protection and privacy policies">
                <div className="space-y-4">
                  <FormField label="Privacy policy URL"><Input defaultValue="https://nilecrest.ac.ug/privacy" className="h-9 text-xs" /></FormField>
                  <FormField label="Data protection officer"><Input defaultValue="privacy@nilecrest.ac.ug" className="h-9 text-xs" /></FormField>
                  <div>
                    <Label className="text-xs">Privacy notice text</Label>
                    <Textarea defaultValue="Nile Crest Secondary School is committed to protecting the privacy of learner data in accordance with Ugandan data protection regulations." rows={4} className="mt-1 text-xs" />
                  </div>
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="consent" className="mt-0">
              <SettingsCard title="Consent management" description="Manage consent types collected during enrolment">
                <div className="space-y-3">
                  <ToggleRow label="Data processing consent" defaultChecked />
                  <ToggleRow label="Photo and identity consent" defaultChecked />
                  <ToggleRow label="Medical emergency consent" defaultChecked />
                  <ToggleRow label="Transport consent" defaultChecked />
                  <ToggleRow label="Educational trip consent" defaultChecked />
                </div>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="languages" className="mt-0">
              <SettingsCard title="Languages" description="Interface language configuration">
                <div className="space-y-2">
                  {[
                    { name: 'English', code: 'en', active: true, note: 'Currently active' },
                    { name: 'Luganda', code: 'lg', active: false, note: 'Prepared for future localization' },
                    { name: 'Kiswahili', code: 'sw', active: false, note: 'Prepared for future localization' },
                  ].map((l) => (
                    <div key={l.code} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <div>
                        <p className="text-xs font-medium text-navy">{l.name}</p>
                        <p className="text-[10px] text-slate-400">{l.note}</p>
                      </div>
                      <StatusBadge variant={l.active ? 'success' : 'neutral'} dot>{l.active ? 'Active' : 'Available'}</StatusBadge>
                    </div>
                  ))}
                </div>
              </SettingsCard>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function SettingsCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-navy">{title}</h3>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      {children}
      <div className="mt-4 flex justify-end border-t border-border pt-3">
        <Button size="sm" onClick={() => toast.success('Settings saved successfully')}>Save changes</Button>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
      <span className="text-xs font-medium text-navy">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
