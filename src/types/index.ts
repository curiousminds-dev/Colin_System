export type UserRole =
  | 'school_admin'
  | 'headteacher'
  | 'director_of_studies'
  | 'teacher'
  | 'security_officer'
  | 'nurse'
  | 'warden'
  | 'transport_officer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  staffNumber: string;
  avatar?: string;
  department?: string;
  lastLogin?: string;
}

export interface School {
  id: string;
  name: string;
  motto: string;
  address: string;
  district: string;
  region: string;
  logo?: string;
}

export interface Campus {
  id: string;
  schoolId: string;
  name: string;
  label: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Term {
  id: string;
  academicYearId: string;
  name: 'Term 1' | 'Term 2' | 'Term 3';
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  label: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  level: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';
  category: 'O-Level' | 'A-Level';
}

export interface Stream {
  id: string;
  classId: string;
  name: string;
}

export interface House {
  id: string;
  name: string;
  color: string;
}

export interface Dormitory {
  id: string;
  name: string;
  gender: 'male' | 'female';
  capacity: number;
}

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isEmergencyContact: boolean;
}

export interface Learner {
  id: string;
  admissionNumber: string;
  lin: string;
  unebNumber?: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  nationality: string;
  religion?: string;
  photo?: string;
  classId: string;
  className: string;
  streamId: string;
  streamName: string;
  houseId?: string;
  houseName?: string;
  dormitoryId?: string;
  dormitoryName?: string;
  boardingStatus: 'day' | 'boarding';
  enrollmentDate: string;
  status: 'active' | 'suspended' | 'withdrawn' | 'transferred' | 'graduated';
  guardians: Guardian[];
  qrStatus: 'active' | 'revoked' | 'pending' | 'none';
  attendancePercentage: number;
  todayStatus?: 'present' | 'late' | 'absent' | 'excused' | 'pending';
}

export interface QRCredential {
  id: string;
  learnerId: string;
  token: string;
  issuedAt: string;
  issuedBy: string;
  expiresAt?: string;
  status: 'active' | 'revoked' | 'expired';
  revokedAt?: string;
  revokedBy?: string;
  revokeReason?: string;
  replacedByCredentialId?: string;
}

export interface AttendanceOccasion {
  id: string;
  name: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  expectedLearners: number;
  scannedLearners: number;
  completionPercentage: number;
  responsibleStaff: string;
  location: string;
  status: 'scheduled' | 'active' | 'paused' | 'closed' | 'cancelled';
  classIds?: string[];
}

export interface ScanEvent {
  id: string;
  learnerId: string;
  learnerName: string;
  admissionNumber: string;
  className: string;
  streamName: string;
  occasionId: string;
  occasionName: string;
  deviceId: string;
  deviceName: string;
  scannedAt: string;
  scannedBy: string;
  status: 'present' | 'late' | 'duplicate' | 'wrong_class' | 'revoked' | 'unknown';
  photo?: string;
}

export interface AttendanceRecord {
  id: string;
  learnerId: string;
  learnerName: string;
  admissionNumber: string;
  className: string;
  streamName: string;
  occasionId: string;
  occasionName: string;
  date: string;
  status: 'present' | 'late' | 'absent' | 'excused' | 'pending';
  scanTime?: string;
  deviceId?: string;
  recordedBy: string;
  reconciliationStatus: 'reconciled' | 'unreconciled' | 'pending';
}

export interface AuthorizedAbsence {
  id: string;
  learnerId: string;
  learnerName: string;
  admissionNumber: string;
  className: string;
  startDate: string;
  endDate: string;
  reason: string;
  authorizedBy: string;
  authorizedAt: string;
  status: 'active' | 'expired' | 'cancelled';
  parentNotified: boolean;
  notes?: string;
}

export type ObservationCategory =
  | 'positive_conduct'
  | 'academic_observation'
  | 'minor_concern'
  | 'welfare_concern'
  | 'general_observation'
  | 'serious_alleged_incident';

export type ObservationSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Observation {
  id: string;
  learnerId: string;
  learnerName: string;
  admissionNumber: string;
  category: ObservationCategory;
  severity: ObservationSeverity;
  date: string;
  time: string;
  location: string;
  relatedOccasionId?: string;
  description: string;
  immediateAction?: string;
  recommendedFollowUp?: string;
  witnesses?: string[];
  recordedBy: string;
  parentContactRecommended: boolean;
  status: 'open' | 'reviewed' | 'closed';
  attachments?: string[];
}

export type CaseStage =
  | 'submitted'
  | 'assigned'
  | 'learner_response'
  | 'evidence_review'
  | 'finding'
  | 'intervention'
  | 'review'
  | 'closure';

export type CaseFinding = 'confirmed' | 'unconfirmed' | 'dismissed' | 'referred' | null;

export interface Case {
  id: string;
  caseNumber: string;
  learnerId: string;
  learnerName: string;
  admissionNumber: string;
  className: string;
  stage: CaseStage;
  finding: CaseFinding;
  summary: string;
  submittedAt: string;
  submittedBy: string;
  assignedTo?: string;
  reviewDate?: string;
  closedAt?: string;
  parentContacted: boolean;
  interventionId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface Intervention {
  id: string;
  learnerId: string;
  learnerName: string;
  type: string;
  description: string;
  startDate: string;
  reviewDate?: string;
  endDate?: string;
  assignedTo: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  notes?: string;
}

export interface StaffMember {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: UserRole;
  roleLabel: string;
  assignedClasses?: string[];
  assignedDeviceId?: string;
  accountStatus: 'active' | 'suspended' | 'invited' | 'inactive';
  lastLogin?: string;
  photo?: string;
}

export interface Permission {
  module: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

export interface Role {
  id: string;
  name: UserRole;
  label: string;
  description: string;
  permissions: Permission[];
}

export interface Device {
  id: string;
  name: string;
  type: 'tablet' | 'phone' | 'laptop' | 'usb_scanner';
  assignedUserId?: string;
  assignedUserName?: string;
  location: string;
  status: 'synced' | 'pending' | 'syncing' | 'failed' | 'conflict' | 'disabled';
  lastSync?: string;
  pendingRecords: number;
  failedRecords: number;
  conflicts: number;
  softwareVersion: string;
  lastActivity?: string;
  imei?: string;
}

export interface SyncRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  syncedAt: string;
  recordsUploaded: number;
  recordsFailed: number;
  conflicts: number;
  status: 'success' | 'partial' | 'failed';
}

export interface Notification {
  id: string;
  type: 'sms' | 'in_app';
  templateId?: string;
  learnerId?: string;
  guardianPhone?: string;
  message: string;
  sentAt?: string;
  status: 'sent' | 'failed' | 'pending' | 'draft';
  triggeredBy: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  recordId?: string;
  recordType?: string;
  deviceId?: string;
  ipAddress: string;
  reason?: string;
  result: 'success' | 'failure' | 'denied';
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
}

export interface DashboardMetrics {
  activeLearners: number;
  presentToday: number;
  lateToday: number;
  unexplainedAbsences: number;
  openWelfareConcerns: number;
  devicesAwaitingSync: number;
  changes: {
    activeLearners: number;
    presentToday: number;
    lateToday: number;
    unexplainedAbsences: number;
    openWelfareConcerns: number;
    devicesAwaitingSync: number;
  };
}

export interface AttendanceTrendPoint {
  date: string;
  present: number;
  late: number;
  absent: number;
  excused: number;
}

export interface ClassAttendance {
  className: string;
  percentage: number;
  present: number;
  total: number;
}

export interface ReportCard {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  restricted?: boolean;
}
