import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth, demoAccounts } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@nilecrest.ac.ug');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Unable to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-navy-dark p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-brand">
            <School className="h-6 w-6 text-navy-dark" />
          </div>
          <div>
            <p className="text-lg font-semibold">Nile Crest Secondary School</p>
            <p className="text-sm text-white/50">Kampala Campus</p>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Student Attendance, Progress and Welfare Management System</h1>
          <p className="mt-4 max-w-md text-sm text-white/60">
            A comprehensive platform for Ugandan secondary schools — managing learners, attendance, welfare, conduct and reporting in one secure system.
          </p>
          <div className="mt-8 flex items-center gap-6 text-xs text-white/40">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Data secured</div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Offline-ready</div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Role-based access</div>
          </div>
        </div>
        <p className="text-xs text-white/30">© 2026 Nile Crest Secondary School. All rights reserved.</p>
      </div>

      {/* Right login form */}
      <div className="flex w-full flex-col items-center justify-center bg-page p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy">
                <School className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">Nile Crest</p>
                <p className="text-xs text-slate-500">Kampala Campus</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-navy">Sign in to your account</h2>
          <p className="mt-1 text-sm text-slate-500">Enter your staff credentials to access the administration portal.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@nilecrest.ac.ug"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-10"
              />
            </div>
            {error && <p className="text-xs text-danger">{error}</p>}
            <Button type="submit" disabled={loading} className="h-10 w-full bg-navy hover:bg-navy-dark">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8">
            <p className="text-xs font-medium text-slate-400">Demo accounts — click to autofill:</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {demoAccounts.slice(0, 6).map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => { setEmail(acc.email); setPassword('demo1234'); }}
                  className="rounded-lg border border-border bg-white px-3 py-2 text-left text-xs text-slate-600 hover:border-cyan-brand hover:bg-cyan-light/50"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
