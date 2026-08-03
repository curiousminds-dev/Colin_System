import type { UserRole } from '@/types';

export type NavKey =
  | 'dashboard'
  | 'learners'
  | 'attendance'
  | 'occasions'
  | 'observations'
  | 'cases'
  | 'welfare'
  | 'academics'
  | 'reports'
  | 'communication'
  | 'staff'
  | 'devices'
  | 'audit'
  | 'settings';

const fullAccess: NavKey[] = [
  'dashboard', 'learners', 'attendance', 'occasions', 'observations',
  'cases', 'welfare', 'academics', 'reports', 'communication',
  'staff', 'devices', 'audit', 'settings',
];

const roleAccess: Record<UserRole, NavKey[]> = {
  school_admin: fullAccess,
  headteacher: ['dashboard', 'learners', 'attendance', 'occasions', 'observations', 'cases', 'welfare', 'academics', 'reports', 'communication', 'staff', 'audit'],
  director_of_studies: ['dashboard', 'learners', 'attendance', 'occasions', 'academics', 'reports'],
  teacher: ['dashboard', 'learners', 'attendance', 'occasions', 'observations', 'academics'],
  security_officer: ['dashboard', 'attendance', 'occasions', 'devices'],
  nurse: ['dashboard', 'welfare', 'attendance'],
  warden: ['dashboard', 'attendance', 'occasions', 'welfare'],
  transport_officer: ['dashboard', 'attendance', 'occasions', 'devices'],
};

export function getAccessiblePages(role: UserRole): NavKey[] {
  return roleAccess[role] ?? ['dashboard'];
}

export function canAccess(role: UserRole, page: NavKey): boolean {
  return getAccessiblePages(role).includes(page);
}

export function isWelfareRestricted(role: UserRole): boolean {
  return !['school_admin', 'headteacher', 'nurse', 'warden'].includes(role);
}

export function isAcademicRestricted(role: UserRole): boolean {
  return !['school_admin', 'headteacher', 'director_of_studies', 'teacher'].includes(role);
}

export function isStaffRestricted(role: UserRole): boolean {
  return !['school_admin', 'headteacher'].includes(role);
}

export function isSettingsRestricted(role: UserRole): boolean {
  return role !== 'school_admin';
}
