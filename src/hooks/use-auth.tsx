import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { authService } from '@/services/api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'nc_auth_user';

const demoAccounts: { role: UserRole; label: string; email: string; name: string }[] = [
  { role: 'school_admin', label: 'School Administrator', email: 'admin@nilecrest.ac.ug', name: 'Daniel Okello' },
  { role: 'headteacher', label: 'Headteacher', email: 'headteacher@nilecrest.ac.ug', name: 'Sarah Namusoke' },
  { role: 'director_of_studies', label: 'Director of Studies', email: 'dos@nilecrest.ac.ug', name: 'Joshua Kato' },
  { role: 'teacher', label: 'Teacher', email: 'teacher@nilecrest.ac.ug', name: 'Faith Atim' },
  { role: 'security_officer', label: 'Security Officer', email: 'security@nilecrest.ac.ug', name: 'Brian Ssemanda' },
  { role: 'nurse', label: 'School Nurse', email: 'nurse@nilecrest.ac.ug', name: 'Lydia Nabirye' },
  { role: 'warden', label: 'Dormitory Warden', email: 'warden@nilecrest.ac.ug', name: 'Moses Ochieng' },
  { role: 'transport_officer', label: 'Transport Officer', email: 'transport@nilecrest.ac.ug', name: 'Esther Akello' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password);
    const demo = demoAccounts.find((d) => d.email === email);
    const finalUser = demo ? { ...u, role: demo.role, name: demo.name, email: demo.email } : u;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalUser));
    setUser(finalUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const demo = demoAccounts.find((d) => d.role === role);
    if (demo) {
      const newUser: User = {
        id: 'u1',
        name: demo.name,
        email: demo.email,
        role: demo.role,
        staffNumber: 'STF/1001',
        department: 'Administration',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    }
  }, []);

  const value = useMemo(() => ({ user, isLoading, login, logout, switchRole }), [user, isLoading, login, logout, switchRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { demoAccounts };
