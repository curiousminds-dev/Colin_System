import {
  generateAuditEvents,
  generateAttendanceRecords,
  generateAttendanceTrend,
  generateAuthorizedAbsences,
  generateCases,
  generateClassAttendance,
  generateDashboardMetrics,
  generateDevices,
  generateInterventions,
  generateLearners,
  generateNotifications,
  generateObservations,
  generateOccasions,
  generateRoles,
  generateScanEvents,
  generateSchool,
  generateStaff,
  generateSyncRecords,
  generateTerm,
} from './mock-data';
import type {
  AuditEvent,
  AttendanceRecord,
  AttendanceTrendPoint,
  AuthorizedAbsence,
  Case,
  ClassAttendance,
  DashboardMetrics,
  Device,
  Intervention,
  Learner,
  Notification,
  Observation,
  Role,
  ScanEvent,
  School,
  StaffMember,
  SyncRecord,
  Term,
  UserRole,
  User,
  AttendanceOccasion,
} from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function mockDelay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), ms));
}

async function apiFetch<T>(path: string, fallback: () => Promise<T>): Promise<T> {
  if (USE_MOCK || !BASE_URL) {
    return fallback();
  }
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// Auth
export const authService = {
  async login(email: string, _password: string): Promise<User> {
    return mockDelay({
      id: 'u1',
      name: 'Daniel Okello',
      email,
      role: 'school_admin' as UserRole,
      staffNumber: 'STF/1001',
      department: 'Administration',
      lastLogin: new Date().toISOString(),
    });
  },
  async me(): Promise<User> {
    return mockDelay({
      id: 'u1',
      name: 'Daniel Okello',
      email: 'd.okello@nilecrest.ac.ug',
      role: 'school_admin',
      staffNumber: 'STF/1001',
      department: 'Administration',
      lastLogin: new Date().toISOString(),
    });
  },
};

// Dashboard
export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    return apiFetch('/dashboard', () => mockDelay(generateDashboardMetrics()));
  },
  async getAttendanceTrend(): Promise<AttendanceTrendPoint[]> {
    return apiFetch('/dashboard/attendance-trend', () => mockDelay(generateAttendanceTrend()));
  },
  async getClassAttendance(): Promise<ClassAttendance[]> {
    return apiFetch('/dashboard/class-attendance', () => mockDelay(generateClassAttendance()));
  },
};

// Learners
export const learnerService = {
  async list(): Promise<Learner[]> {
    return apiFetch('/learners', () => mockDelay(generateLearners(48)));
  },
  async getById(id: string): Promise<Learner | undefined> {
    const all = await this.list();
    return all.find((l) => l.id === id);
  },
};

// Attendance
export const attendanceService = {
  async getRecords(): Promise<AttendanceRecord[]> {
    return apiFetch('/attendance', () => mockDelay(generateAttendanceRecords()));
  },
  async getOccasions(): Promise<AttendanceOccasion[]> {
    return apiFetch('/attendance/occasions', () => mockDelay(generateOccasions()));
  },
  async getScans(): Promise<ScanEvent[]> {
    return apiFetch('/attendance/scans', () => mockDelay(generateScanEvents()));
  },
  async getSyncRecords(): Promise<SyncRecord[]> {
    return apiFetch('/attendance/sync', () => mockDelay(generateSyncRecords()));
  },
};

// Observations
export const observationService = {
  async list(): Promise<Observation[]> {
    return apiFetch('/observations', () => mockDelay(generateObservations()));
  },
};

// Cases
export const caseService = {
  async list(): Promise<Case[]> {
    return apiFetch('/cases', () => mockDelay(generateCases()));
  },
  async getInterventions(): Promise<Intervention[]> {
    return apiFetch('/interventions', () => mockDelay(generateInterventions()));
  },
};

// Welfare
export const welfareService = {
  async getAuthorizedAbsences(): Promise<AuthorizedAbsence[]> {
    return apiFetch('/welfare/absences', () => mockDelay(generateAuthorizedAbsences()));
  },
  async getConcerns(): Promise<Observation[]> {
    return apiFetch('/welfare/concerns', () => mockDelay(generateObservations().filter((o) => o.category === 'welfare_concern' || o.category === 'serious_alleged_incident')));
  },
};

// Staff
export const staffService = {
  async list(): Promise<StaffMember[]> {
    return apiFetch('/staff', () => mockDelay(generateStaff()));
  },
  async getRoles(): Promise<Role[]> {
    return apiFetch('/roles', () => mockDelay(generateRoles()));
  },
};

// Devices
export const deviceService = {
  async list(): Promise<Device[]> {
    return apiFetch('/devices', () => mockDelay(generateDevices()));
  },
};

// Notifications
export const notificationService = {
  async list(): Promise<Notification[]> {
    return apiFetch('/notifications', () => mockDelay(generateNotifications()));
  },
};

// Audit
export const auditService = {
  async list(): Promise<AuditEvent[]> {
    return apiFetch('/audit-logs', () => mockDelay(generateAuditEvents()));
  },
};

// Settings
export const settingsService = {
  async getSchool(): Promise<School> {
    return apiFetch('/settings/school', () => mockDelay(generateSchool()));
  },
  async getTerm(): Promise<Term> {
    return apiFetch('/settings/term', () => mockDelay(generateTerm()));
  },
};
