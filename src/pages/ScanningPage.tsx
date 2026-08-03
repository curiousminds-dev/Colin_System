import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, ScanLine, Volume2, VolumeX, Flashlight, Camera, Wifi, WifiOff,
  CheckCircle2, AlertTriangle, Clock, UserX, Ban, HelpCircle, Keyboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { attendanceService, learnerService } from '@/services/api';
import type { ScanEvent } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge, attendanceStatusBadge } from '@/components/shared/StatusBadge';

export function ScanningPage() {
  const navigate = useNavigate();
  const [occasion, setOccasion] = useState('occ1');
  const [checkpoint, setCheckpoint] = useState('Main Gate');
  const [scanning, setScanning] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const [online, setOnline] = useState(true);
  const [lastScan, setLastScan] = useState<ScanEvent | null>(null);
  const [manualEntry, setManualEntry] = useState('');
  const [recentScans, setRecentScans] = useState<ScanEvent[]>([]);

  const occasionsQ = useQuery({ queryKey: ['occasions'], queryFn: attendanceService.getOccasions });
  const scansQ = useQuery({ queryKey: ['scans'], queryFn: attendanceService.getScans });
  const learnersQ = useQuery({ queryKey: ['learners'], queryFn: learnerService.list });

  useEffect(() => {
    if (scansQ.data) setRecentScans(scansQ.data.slice(0, 6));
  }, [scansQ.data]);

  const simulateScan = () => {
    if (!learnersQ.data || learnersQ.data.length === 0) return;
    const learner = learnersQ.data[Math.floor(Math.random() * learnersQ.data.length)];
    const statuses: ScanEvent['status'][] = ['present', 'present', 'present', 'present', 'late', 'duplicate', 'wrong_class', 'revoked', 'unknown'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const scan: ScanEvent = {
      id: `scan-${Date.now()}`,
      learnerId: learner.id,
      learnerName: `${learner.firstName} ${learner.lastName}`,
      admissionNumber: learner.admissionNumber,
      className: learner.className,
      streamName: learner.streamName,
      occasionId: occasion,
      occasionName: occasionsQ.data?.find((o) => o.id === occasion)?.name || '',
      deviceId: 'dev1',
      deviceName: 'Main Gate Tablet 01',
      scannedAt: new Date().toISOString(),
      scannedBy: 'Daniel Okello',
      status,
      photo: learner.photo,
    };
    setLastScan(scan);
    setRecentScans((prev) => [scan, ...prev].slice(0, 6));
    setScanning(true);
    setTimeout(() => setScanning(false), 1500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualEntry) {
      simulateScan();
      setManualEntry('');
    }
  };

  const feedbackConfig = {
    present: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Present', message: 'Learner marked present' },
    late: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Late Arrival', message: 'Learner arrived late' },
    duplicate: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Duplicate Scan', message: 'This learner was already scanned' },
    wrong_class: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Wrong Class', message: 'Learner not expected at this occasion' },
    revoked: { icon: Ban, color: 'text-danger', bg: 'bg-danger/10', label: 'Revoked Card', message: 'This QR credential has been revoked' },
    unknown: { icon: HelpCircle, color: 'text-danger', bg: 'bg-danger/10', label: 'Unknown QR', message: 'QR code not recognised' },
  };

  const fb = lastScan ? feedbackConfig[lastScan.status] : null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-dark text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/attendance')} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-sm font-semibold">Scanning Mode</h1>
            <p className="text-xs text-white/50">Nile Crest · Kampala Campus</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs', online ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger')}>
            {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {online ? 'Online' : 'Offline'}
          </div>
          <div className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/60">
            Pending sync: <span className="font-semibold text-white">3</span>
          </div>
        </div>
      </div>

      {/* Config bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-3">
        <Select value={occasion} onValueChange={setOccasion}>
          <SelectTrigger className="h-8 w-[180px] border-white/10 bg-white/5 text-xs text-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(occasionsQ.data || []).map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={checkpoint} onValueChange={setCheckpoint}>
          <SelectTrigger className="h-8 w-[140px] border-white/10 bg-white/5 text-xs text-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Main Gate">Main Gate</SelectItem>
            <SelectItem value="Assembly Hall">Assembly Hall</SelectItem>
            <SelectItem value="Dormitory Block A">Dormitory Block A</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/60">Staff: Daniel Okello</div>
        <div className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/60">Device: Main Gate Tablet 01</div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
        {/* Scanner area */}
        <div className="lg:col-span-2">
          <div className="relative flex aspect-video max-h-[400px] items-center justify-center overflow-hidden rounded-2xl border-2 border-white/10 bg-navy">
            {/* Scan animation */}
            {scanning && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-0 right-0 h-0.5 bg-cyan-brand shadow-[0_0_20px_4px_rgba(67,189,235,0.6)] animate-scan-line" />
              </div>
            )}

            {lastScan && fb ? (
              <div className={cn('flex flex-col items-center justify-center p-8 text-center', fb.bg, 'rounded-2xl w-full h-full')}>
                <fb.icon className={cn('h-16 w-16 mb-3', fb.color)} />
                <Avatar className="h-24 w-24 border-4 border-white/20">
                  <AvatarImage src={lastScan.photo} />
                  <AvatarFallback className="bg-white/10 text-lg font-semibold text-white">
                    {lastScan.learnerName.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-lg font-semibold text-white">{lastScan.learnerName}</h2>
                <p className="text-sm text-white/60">{lastScan.admissionNumber} · {lastScan.className} {lastScan.streamName}</p>
                <div className={cn('mt-3 rounded-lg px-4 py-2', fb.bg)}>
                  <p className={cn('text-sm font-semibold', fb.color)}>{fb.label}</p>
                  <p className="text-xs text-white/60">{fb.message}</p>
                </div>
                <p className="mt-3 text-xs text-white/40">{new Date(lastScan.scannedAt).toLocaleTimeString('en-GB')}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                  <ScanLine className="h-10 w-10 text-cyan-brand" />
                </div>
                <p className="text-sm text-white/60">Ready to scan</p>
                <p className="text-xs text-white/40">Point camera at learner QR card or enter manually</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setSoundOn((s) => !s)} className={cn('flex h-10 w-10 items-center justify-center rounded-lg', soundOn ? 'bg-cyan-brand text-navy' : 'bg-white/5 text-white/50')}>
                {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
              <button onClick={() => setFlashOn((f) => !f)} className={cn('flex h-10 w-10 items-center justify-center rounded-lg', flashOn ? 'bg-cyan-brand text-navy' : 'bg-white/5 text-white/50')}>
                <Flashlight className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/50">
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <Button onClick={simulateScan} className="bg-cyan-brand text-navy hover:bg-cyan-brand/90">
              <ScanLine className="mr-2 h-4 w-4" /> Simulate scan
            </Button>
          </div>

          {/* Manual entry */}
          <form onSubmit={handleManualSubmit} className="mt-4 flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-white/40" />
            <Input
              value={manualEntry}
              onChange={(e) => setManualEntry(e.target.value)}
              placeholder="Enter admission number or LIN manually..."
              className="border-white/10 bg-white/5 text-xs text-white placeholder:text-white/30"
            />
            <Button type="submit" variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10">Submit</Button>
          </form>
        </div>

        {/* Recent scans sidebar */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">Recent scans</h3>
          <div className="space-y-2">
            {recentScans.map((s) => {
              const b = attendanceStatusBadge(s.status);
              return (
                <div key={s.id} className="flex items-center gap-2.5 rounded-lg bg-white/5 p-2.5">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={s.photo} />
                    <AvatarFallback className="bg-white/10 text-[10px] font-semibold text-white">
                      {s.learnerName.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-white">{s.learnerName}</p>
                    <p className="truncate text-[10px] text-white/40">{new Date(s.scannedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {s.deviceName}</p>
                  </div>
                  <StatusBadge variant={b.variant} dot>{b.label}</StatusBadge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
