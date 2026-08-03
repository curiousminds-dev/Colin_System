import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { AppShell } from '@/components/shell/AppShell';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LearnersPage } from '@/pages/LearnersPage';
import { LearnerRegistrationPage } from '@/pages/LearnerRegistrationPage';
import { LearnerProfilePage } from '@/pages/LearnerProfilePage';
import { AttendancePage } from '@/pages/AttendancePage';
import { OccasionsPage } from '@/pages/OccasionsPage';
import { ScanningPage } from '@/pages/ScanningPage';
import { ObservationsPage } from '@/pages/ObservationsPage';
import { CasesPage } from '@/pages/CasesPage';
import { WelfarePage } from '@/pages/WelfarePage';
import { AcademicsPage } from '@/pages/AcademicsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { CommunicationPage } from '@/pages/CommunicationPage';
import { StaffPage } from '@/pages/StaffPage';
import { DevicesPage } from '@/pages/DevicesPage';
import { AuditLogsPage } from '@/pages/AuditLogsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PermissionDenied } from '@/components/shared/States';
import { canAccess, type NavKey } from '@/lib/permissions';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-page"><div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-brand border-t-transparent" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RoleRoute({ page, children }: { page: NavKey; children: ReactNode }) {
  const { user } = useAuth();
  if (!user || !canAccess(user.role, page)) {
    return (
      <div className="p-6">
        <PermissionDenied />
      </div>
    );
  }
  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();
  const isScanning = location.pathname === '/attendance/scan';
  const isLogin = location.pathname === '/login';

  if (isLogin) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <ProtectedRoute>
      {isScanning ? (
        <Routes>
          <Route path="/attendance/scan" element={
            <RoleRoute page="attendance"><ScanningPage /></RoleRoute>
          } />
        </Routes>
      ) : (
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<RoleRoute page="dashboard"><DashboardPage /></RoleRoute>} />
            <Route path="/learners" element={<RoleRoute page="learners"><LearnersPage /></RoleRoute>} />
            <Route path="/learners/new" element={<RoleRoute page="learners"><LearnerRegistrationPage /></RoleRoute>} />
            <Route path="/learners/:id" element={<RoleRoute page="learners"><LearnerProfilePage /></RoleRoute>} />
            <Route path="/attendance" element={<RoleRoute page="attendance"><AttendancePage /></RoleRoute>} />
            <Route path="/attendance/scan" element={<RoleRoute page="attendance"><ScanningPage /></RoleRoute>} />
            <Route path="/occasions" element={<RoleRoute page="occasions"><OccasionsPage /></RoleRoute>} />
            <Route path="/observations" element={<RoleRoute page="observations"><ObservationsPage /></RoleRoute>} />
            <Route path="/cases" element={<RoleRoute page="cases"><CasesPage /></RoleRoute>} />
            <Route path="/welfare" element={<RoleRoute page="welfare"><WelfarePage /></RoleRoute>} />
            <Route path="/academics" element={<RoleRoute page="academics"><AcademicsPage /></RoleRoute>} />
            <Route path="/reports" element={<RoleRoute page="reports"><ReportsPage /></RoleRoute>} />
            <Route path="/communication" element={<RoleRoute page="communication"><CommunicationPage /></RoleRoute>} />
            <Route path="/staff" element={<RoleRoute page="staff"><StaffPage /></RoleRoute>} />
            <Route path="/devices" element={<RoleRoute page="devices"><DevicesPage /></RoleRoute>} />
            <Route path="/audit" element={<RoleRoute page="audit"><AuditLogsPage /></RoleRoute>} />
            <Route path="/settings" element={<RoleRoute page="settings"><SettingsPage /></RoleRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppShell>
      )}
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
