import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Plus, Send, Search, MessageSquare, AlertCircle, CheckCircle2,
  Clock, XCircle, FileText,
} from 'lucide-react';
import { notificationService } from '@/services/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { StatusBadge, attendanceStatusBadge } from '@/components/shared/StatusBadge';
import { LoadingState, ErrorState, EmptyState, SensitiveDataNotice } from '@/components/shared/States';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs';
import type { Notification } from '@/types';
import { toast } from 'sonner';

const templates = [
  { id: 'tpl1', name: 'Absence Alert', content: 'Dear guardian, your child was marked absent today. Please contact the school.' },
  { id: 'tpl2', name: 'Arrival Notification', content: 'Dear guardian, your child arrived safely at school this morning.' },
  { id: 'tpl3', name: 'Reporting Date Reminder', content: 'Reminder: Mid-term reports will be available on Friday. Please collect from the office.' },
  { id: 'tpl4', name: 'Parent Meeting Notice', content: 'You are invited to a parent meeting on Friday at 10:00 AM in the main hall.' },
  { id: 'tpl5', name: 'Intervention Follow-up', content: 'Please contact the school regarding an important learner-support matter.' },
];

export function CommunicationPage() {
  const notifQ = useQuery({ queryKey: ['notifications'], queryFn: notificationService.list });
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('history');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [message, setMessage] = useState(templates[0].content);

  const columns: Column<Notification>[] = [
    {
      key: 'message', header: 'Message', render: (n) => <p className="line-clamp-2 text-xs text-navy">{n.message}</p>,
    },
    { key: 'guardianPhone', header: 'Recipient', width: '150px' },
    { key: 'triggeredBy', header: 'Triggered by', width: '140px' },
    { key: 'sentAt', header: 'Sent at', width: '140px', render: (n) => n.sentAt ? new Date(n.sentAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—' },
    {
      key: 'status', header: 'Status', width: '100px',
      render: (n) => { const b = attendanceStatusBadge(n.status); return <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>; },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Communication"
        subtitle="SMS templates, parent notifications and delivery tracking"
        actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New template</Button>}
      />

      <div className="p-4 lg:p-6">
        <div className="mb-4">
          <SensitiveDataNotice message="Do not include medical, counselling or detailed disciplinary information in SMS messages. Use safe wording for sensitive matters." />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 flex h-auto gap-1 rounded-lg border border-border bg-white p-1">
            <TabsTrigger value="history" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Delivery History</TabsTrigger>
            <TabsTrigger value="templates" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">SMS Templates</TabsTrigger>
            <TabsTrigger value="compose" className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-cyan-brand data-[state=active]:text-white">Compose Message</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-0">
            <div className="mb-3 flex items-center gap-2">
              <div className="relative min-w-[200px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="h-9 pl-9 text-xs" />
              </div>
            </div>
            {notifQ.isLoading ? <LoadingState /> : notifQ.isError ? <ErrorState onRetry={() => notifQ.refetch()} /> : (
              <DataTable columns={columns} data={(notifQ.data || []).filter((n) => !search || n.message.toLowerCase().includes(search.toLowerCase()))} rowKey={(n) => n.id} pageSize={10} />
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-0">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((t) => (
                <div key={t.id} className="rounded-xl border border-border bg-white p-4 shadow-sm hover:border-cyan-brand transition-colors">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-light"><MessageSquare className="h-4 w-4 text-navy" /></div>
                    <h4 className="text-sm font-semibold text-navy">{t.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500">{t.content}</p>
                  <div className="mt-3 flex gap-1.5 border-t border-border pt-3">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setSelectedTemplate(t); setMessage(t.content); setTab('compose'); }}><Send className="mr-1 h-3 w-3" /> Use</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs"><FileText className="mr-1 h-3 w-3" /> Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compose" className="mt-0">
            <div className="mx-auto max-w-2xl rounded-xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-navy">Compose Message</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs">Template</Label>
                  <select value={selectedTemplate.id} onChange={(e) => { const t = templates.find((x) => x.id === e.target.value)!; setSelectedTemplate(t); setMessage(t.content); }} className="mt-1 h-9 w-full rounded-md border border-border bg-white px-3 text-xs">
                    {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Recipient phone</Label>
                  <Input placeholder="+256 77X XXX XXX" className="mt-1 h-9 text-xs" />
                </div>
                <div>
                  <Label className="text-xs">Message content</Label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="mt-1 text-xs" />
                  <p className="mt-1 text-[10px] text-slate-400">{message.length} characters · {Math.ceil(message.length / 160)} SMS</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">Save as draft</Button>
                  <Button size="sm" onClick={() => toast.success('Message sent successfully')}><Send className="mr-1.5 h-3.5 w-3.5" /> Send message</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
