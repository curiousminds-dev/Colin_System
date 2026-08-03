import type {
  AuditEvent,
  AttendanceOccasion,
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
  Permission,
  Role,
  ScanEvent,
  School,
  StaffMember,
  SyncRecord,
  Term,
  UserRole,
} from '@/types';

const firstNames = [
  'Amina', 'Daniel', 'Sarah', 'Joshua', 'Faith', 'Brian', 'Lydia', 'Moses',
  'Esther', 'David', 'Grace', 'Isaac', 'Joan', 'Michael', 'Ruth', 'Samuel',
  'Patricia', 'Joseph', 'Nancy', 'Timothy', 'Doreen', 'Emmanuel', 'Stella',
  'Patrick', 'Agnes', 'Robert', 'Catherine', 'Andrew', 'Mercy', 'Stephen',
  'Brenda', 'Peter', 'Janet', 'Collins', 'Vanessa', 'Ronald', 'Lillian',
  'Geoffrey', 'Sharon', 'Dennis', 'Tracy', 'Julius', 'Hellen', 'Vincent',
  'Jackie', 'Kenneth', 'Phiona', 'Eric', 'Bridget', 'Gideon',
];

const lastNames = [
  'Nansubuga', 'Okello', 'Namusoke', 'Kato', 'Atim', 'Ssemanda', 'Nabirye',
  'Ochieng', 'Nakato', 'Mukasa', 'Akello', 'Tumusiime', 'Nabukenya', 'Lwanga',
  'Auma', 'Ssali', 'Kabugho', 'Wasswa', 'Apio', 'Byaruhanga', 'Nakimera',
  'Ssentongo', 'Nankya', 'Bbosa', 'Anyait', 'Kiggundu', 'Tusiime', 'Nuwagaba',
  'Kemigisha', 'Otim', 'Baluku', 'Nabaggala', 'Ssekandi', 'Achan', 'Muhwezi',
  'Nalwoga', 'Kakuru', 'Birungi', 'Ntagungira', 'Wanyana', 'Nakigozi',
  'Opedun', 'Katusiime', 'Mwesigwa', 'Nakayita', 'Ninsiima', 'Ahebwa',
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fullName(i: number): { first: string; last: string; full: string } {
  const first = pick(firstNames, i * 7 + 3);
  const last = pick(lastNames, i * 5 + 2);
  return { first, last, full: `${first} ${last}` };
}

function phone(): string {
  const prefix = randomFrom(['77', '78', '70', '76', '79']);
  const rest = String(randomInt(100, 999)).padStart(3, '0') + ' ' +
    String(randomInt(100, 999)).padStart(3, '0') + ' ' +
    String(randomInt(100, 999)).padStart(3, '0');
  return `+256 ${prefix} ${rest}`;
}

function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?backgroundColor=132465,43BDEB,2F80ED&backgroundType=gradientLinear&seed=${encodeURIComponent(seed)}&fontFamily=Inter&fontWeight=600`;
}

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function dateTimeStr(daysAgo: number, hour = 8, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const classes = [
  { id: 'c1', name: 'Senior One', level: 'S1' as const, category: 'O-Level' as const },
  { id: 'c2', name: 'Senior Two', level: 'S2' as const, category: 'O-Level' as const },
  { id: 'c3', name: 'Senior Three', level: 'S3' as const, category: 'O-Level' as const },
  { id: 'c4', name: 'Senior Four', level: 'S4' as const, category: 'O-Level' as const },
  { id: 'c5', name: 'Senior Five', level: 'S5' as const, category: 'A-Level' as const },
  { id: 'c6', name: 'Senior Six', level: 'S6' as const, category: 'A-Level' as const },
];

const streams = ['A', 'B', 'C'];
const houses = [
  { id: 'h1', name: 'Crane House', color: '#43BDEB' },
  { id: 'h2', name: 'Marabou House', color: '#22A06B' },
  { id: 'h3', name: 'Crested Eagle House', color: '#E9A23B' },
  { id: 'h4', name: 'Buffalo House', color: '#D64545' },
];

const dormitories = [
  { id: 'd1', name: 'Nile Boys Dormitory', gender: 'male' as const, capacity: 120 },
  { id: 'd2', name: 'Victoria Boys Dormitory', gender: 'male' as const, capacity: 100 },
  { id: 'd3', name: 'Pearl Girls Dormitory', gender: 'female' as const, capacity: 110 },
  { id: 'd4', name: 'Equator Girls Dormitory', gender: 'female' as const, capacity: 90 },
];

export function generateLearners(count = 48): Learner[] {
  const learners: Learner[] = [];
  for (let i = 0; i < count; i++) {
    const { first, last, full } = fullName(i);
    const cls = pick(classes, i);
    const streamLetter = pick(streams, i + 1);
    const gender = i % 2 === 0 ? 'male' : 'female';
    const boarding = i % 3 !== 0 ? 'boarding' : 'day';
    const dobYear = 2008 - (parseInt(cls.level.replace('S', '')) - 1);
    const dob = `${dobYear}-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}`;
    const statuses: Learner['todayStatus'][] = ['present', 'present', 'present', 'present', 'late', 'absent', 'excused', 'pending'];
    const qrStatuses: Learner['qrStatus'][] = ['active', 'active', 'active', 'active', 'active', 'revoked', 'pending', 'none'];
    const enrollmentStatuses: Learner['status'][] = ['active', 'active', 'active', 'active', 'active', 'active', 'suspended', 'withdrawn'];

    const dorm = boarding === 'boarding' && gender === 'male' ? dormitories[0] : boarding === 'boarding' ? dormitories[2] : undefined;
    const house = pick(houses, i);

    learners.push({
      id: `l${i + 1}`,
      admissionNumber: `NC/${String(2024 + (i % 3))}/${String(1001 + i).padStart(4, '0')}`,
      lin: `LIN-${String(100000 + i * 137).slice(0, 6)}`,
      unebNumber: i % 4 === 0 ? `U${String(1000000 + i * 911).slice(0, 7)}` : undefined,
      firstName: first,
      lastName: last,
      gender,
      dateOfBirth: dob,
      nationality: 'Ugandan',
      photo: avatarUrl(full),
      classId: cls.id,
      className: cls.name,
      streamId: `${cls.id}-s${streamLetter}`,
      streamName: streamLetter,
      houseId: house.id,
      houseName: house.name,
      dormitoryId: dorm?.id,
      dormitoryName: dorm?.name,
      boardingStatus: boarding,
      enrollmentDate: dateStr(randomInt(30, 400)),
      status: pick(enrollmentStatuses, i),
      guardians: [
        {
          id: `g${i}-1`,
          name: `${randomFrom(firstNames)} ${last}`,
          relationship: randomFrom(['Father', 'Mother', 'Uncle', 'Aunt', 'Guardian']),
          phone: phone(),
          email: i % 3 === 0 ? `guardian${i}@gmail.com` : undefined,
          isEmergencyContact: true,
        },
      ],
      qrStatus: pick(qrStatuses, i),
      attendancePercentage: randomInt(78, 99),
      todayStatus: pick(statuses, i),
    });
  }
  return learners;
}

export function generateStaff(): StaffMember[] {
  const roleMap: { role: UserRole; label: string; dept: string }[] = [
    { role: 'school_admin', label: 'School Administrator', dept: 'Administration' },
    { role: 'headteacher', label: 'Headteacher', dept: 'Administration' },
    { role: 'director_of_studies', label: 'Director of Studies', dept: 'Academics' },
    { role: 'teacher', label: 'Teacher', dept: 'Sciences' },
    { role: 'teacher', label: 'Teacher', dept: 'Languages' },
    { role: 'teacher', label: 'Teacher', dept: 'Humanities' },
    { role: 'teacher', label: 'Teacher', dept: 'Mathematics' },
    { role: 'security_officer', label: 'Security Officer', dept: 'Security' },
    { role: 'nurse', label: 'School Nurse', dept: 'Sick Bay' },
    { role: 'warden', label: 'Dormitory Warden', dept: 'Boarding' },
    { role: 'transport_officer', label: 'Transport Officer', dept: 'Transport' },
  ];

  return roleMap.map((r, i) => {
    const { first, last, full } = fullName(i * 3 + 10);
    return {
      id: `s${i + 1}`,
      staffNumber: `STF/${String(1001 + i).padStart(4, '0')}`,
      firstName: first,
      lastName: last,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@nilecrest.ac.ug`,
      phone: phone(),
      department: r.dept,
      role: r.role,
      roleLabel: r.label,
      assignedClasses: r.role === 'teacher' ? [classes[i % classes.length].name] : undefined,
      assignedDeviceId: r.role === 'security_officer' || r.role === 'transport_officer' ? `dev${i + 1}` : undefined,
      accountStatus: i % 5 === 4 ? 'invited' : 'active',
      lastLogin: i % 3 === 0 ? dateTimeStr(randomInt(0, 3), randomInt(7, 17)) : undefined,
      photo: avatarUrl(full),
    };
  });
}

export function generateDevices(): Device[] {
  const deviceData = [
    { name: 'Main Gate Tablet 01', type: 'tablet' as const, location: 'Main Gate', assigned: 'Security Officer' },
    { name: 'Assembly Scanner 02', type: 'tablet' as const, location: 'Assembly Hall', assigned: 'Duty Teacher' },
    { name: "Boys' Dormitory Phone", type: 'phone' as const, location: "Boys' Dormitory Block A", assigned: 'Warden' },
    { name: "Girls' Dormitory Phone", type: 'phone' as const, location: "Girls' Dormitory Block B", assigned: 'Warden' },
    { name: 'School Bus 03 Tablet', type: 'tablet' as const, location: 'Bus Route 03', assigned: 'Transport Officer' },
    { name: 'Sick Bay Laptop', type: 'laptop' as const, location: 'Sick Bay', assigned: 'Nurse' },
    { name: 'Library USB Scanner', type: 'usb_scanner' as const, location: 'Library', assigned: 'Librarian' },
    { name: 'Dining Hall Scanner', type: 'tablet' as const, location: 'Dining Hall', assigned: 'Duty Teacher' },
  ];
  const statuses: Device['status'][] = ['synced', 'synced', 'synced', 'pending', 'syncing', 'failed', 'conflict', 'disabled'];

  return deviceData.map((d, i) => ({
    id: `dev${i + 1}`,
    name: d.name,
    type: d.type,
    assignedUserName: d.assigned,
    location: d.location,
    status: pick(statuses, i),
    lastSync: dateTimeStr(randomInt(0, 2), randomInt(6, 18)),
    pendingRecords: i % 3 === 0 ? randomInt(5, 40) : 0,
    failedRecords: i === 5 ? randomInt(2, 8) : 0,
    conflicts: i === 6 ? randomInt(1, 3) : 0,
    softwareVersion: `v2.${randomInt(0, 4)}.${randomInt(0, 9)}`,
    lastActivity: dateTimeStr(randomInt(0, 1), randomInt(6, 18)),
    imei: `35${String(randomInt(100000000, 999999999))}`,
  }));
}

export function generateOccasions(): AttendanceOccasion[] {
  const occasionData = [
    { name: 'Morning Gate Entry', cat: 'Gate Entry', loc: 'Main Gate', staff: 'Okello Daniel' },
    { name: 'Morning Assembly', cat: 'Morning Assembly', loc: 'Assembly Hall', staff: 'Namusoke Sarah' },
    { name: 'Senior One Mathematics', cat: 'Class Lesson', loc: 'Room S1A', staff: 'Kato Joshua' },
    { name: 'Senior Three Physics', cat: 'Class Lesson', loc: 'Lab 2', staff: 'Atim Faith' },
    { name: 'Evening Prep S4', cat: 'Evening Prep', loc: 'S4 Hall', staff: 'Ssemanda Brian' },
    { name: 'Dormitory Roll Call', cat: 'Dormitory Roll Call', loc: "Boys' Dorm A", staff: 'Nabirye Lydia' },
    { name: 'Lunch Dining', cat: 'Dining', loc: 'Dining Hall', staff: 'Ochieng Moses' },
    { name: 'Afternoon Gate Exit', cat: 'Gate Exit', loc: 'Main Gate', staff: 'Okello Daniel' },
    { name: 'Sports Practice', cat: 'Sports', loc: 'Sports Field', staff: 'Akello Esther' },
    { name: 'Debate Club', cat: 'Clubs', loc: 'Room S5B', staff: 'Mukasa David' },
  ];
  const statuses: AttendanceOccasion['status'][] = ['active', 'closed', 'scheduled', 'paused', 'closed', 'closed', 'active', 'closed', 'scheduled', 'closed'];

  return occasionData.map((o, i) => {
    const expected = randomInt(30, 120);
    const scanned = i < 2 ? expected - randomInt(0, 5) : randomInt(0, expected);
    return {
      id: `occ${i + 1}`,
      name: o.name,
      category: o.cat,
      date: dateStr(i % 3),
      startTime: `${randomInt(6, 19)}:${i % 2 === 0 ? '00' : '30'}`,
      endTime: `${randomInt(7, 20)}:${i % 2 === 0 ? '00' : '30'}`,
      expectedLearners: expected,
      scannedLearners: scanned,
      completionPercentage: Math.round((scanned / expected) * 100),
      responsibleStaff: o.staff,
      location: o.loc,
      status: pick(statuses, i),
    };
  });
}

export function generateScanEvents(): ScanEvent[] {
  const learners = generateLearners(20);
  const events: ScanEvent[] = [];
  for (let i = 0; i < 24; i++) {
    const l = learners[i % learners.length];
    const statuses: ScanEvent['status'][] = ['present', 'present', 'present', 'present', 'late', 'duplicate', 'wrong_class', 'revoked', 'unknown'];
    events.push({
      id: `scan${i + 1}`,
      learnerId: l.id,
      learnerName: `${l.firstName} ${l.lastName}`,
      admissionNumber: l.admissionNumber,
      className: l.className,
      streamName: l.streamName,
      occasionId: `occ${(i % 3) + 1}`,
      occasionName: ['Morning Gate Entry', 'Morning Assembly', 'Senior One Mathematics'][i % 3],
      deviceId: `dev${(i % 4) + 1}`,
      deviceName: ['Main Gate Tablet 01', 'Assembly Scanner 02', "Boys' Dormitory Phone", 'Dining Hall Scanner'][i % 4],
      scannedAt: dateTimeStr(0, randomInt(6, 9), randomInt(0, 59)),
      scannedBy: ['Okello Daniel', 'Namusoke Sarah', 'Kato Joshua', 'Atim Faith'][i % 4],
      status: pick(statuses, i),
      photo: l.photo,
    });
  }
  return events;
}

export function generateAttendanceRecords(): AttendanceRecord[] {
  const learners = generateLearners(30);
  const records: AttendanceRecord[] = [];
  const statuses: AttendanceRecord['status'][] = ['present', 'present', 'present', 'present', 'late', 'absent', 'excused', 'pending'];
  const recon: AttendanceRecord['reconciliationStatus'][] = ['reconciled', 'reconciled', 'reconciled', 'unreconciled', 'pending'];

  for (let i = 0; i < 40; i++) {
    const l = learners[i % learners.length];
    const status = pick(statuses, i);
    records.push({
      id: `ar${i + 1}`,
      learnerId: l.id,
      learnerName: `${l.firstName} ${l.lastName}`,
      admissionNumber: l.admissionNumber,
      className: l.className,
      streamName: l.streamName,
      occasionId: `occ${(i % 3) + 1}`,
      occasionName: ['Morning Gate Entry', 'Morning Assembly', 'Evening Prep S4'][i % 3],
      date: dateStr(0),
      status,
      scanTime: status === 'present' || status === 'late' ? dateTimeStr(0, randomInt(6, 9)) : undefined,
      deviceId: `dev${(i % 4) + 1}`,
      recordedBy: ['Okello Daniel', 'Namusoke Sarah', 'Kato Joshua'][i % 3],
      reconciliationStatus: pick(recon, i),
    });
  }
  return records;
}

export function generateObservations(): Observation[] {
  const learners = generateLearners(20);
  const categories: Observation['category'][] = ['positive_conduct', 'academic_observation', 'minor_concern', 'welfare_concern', 'general_observation', 'serious_alleged_incident'];
  const severities: Observation['severity'][] = ['low', 'medium', 'high', 'critical'];
  const locations = ['Classroom S2A', 'Assembly Hall', 'Dining Hall', 'Sports Field', 'Dormitory Block A', 'Library', 'Main Gate'];
  const descs = [
    'Demonstrated excellent leadership during group discussion in Mathematics class.',
    'Consistently submits assignments on time and assists peers with difficult topics.',
    'Arrived late to morning assembly for the third time this week.',
    'Appears withdrawn and less engaged in class activities over the past week.',
    'Observed helping a younger learner carry books to the dormitory.',
    'Reported feeling unwell during evening prep; referred to sick bay.',
    'Displayed disruptive behaviour during Physics practical lesson.',
    'Alleged involvement in a disagreement with another learner during break time.',
  ];

  return Array.from({ length: 16 }, (_, i) => {
    const l = learners[i % learners.length];
    const cat = pick(categories, i);
    return {
      id: `obs${i + 1}`,
      learnerId: l.id,
      learnerName: `${l.firstName} ${l.lastName}`,
      admissionNumber: l.admissionNumber,
      category: cat,
      severity: pick(severities, i),
      date: dateStr(randomInt(0, 14)),
      time: `${randomInt(7, 17)}:${i % 2 === 0 ? '00' : '30'}`,
      location: pick(locations, i),
      relatedOccasionId: i % 2 === 0 ? `occ${(i % 3) + 1}` : undefined,
      description: pick(descs, i),
      immediateAction: i % 3 === 0 ? 'Spoke with learner privately after class.' : undefined,
      recommendedFollowUp: i % 4 === 0 ? 'Schedule meeting with guardian.' : undefined,
      recordedBy: pick(['Kato Joshua', 'Atim Faith', 'Namusoke Sarah', 'Ssemanda Brian'], i),
      parentContactRecommended: i % 3 === 0,
      status: pick(['open', 'reviewed', 'closed'] as const, i),
    };
  });
}

export function generateCases(): Case[] {
  const learners = generateLearners(15);
  const stages: Case['stage'][] = ['submitted', 'assigned', 'learner_response', 'evidence_review', 'finding', 'intervention', 'review', 'closure'];
  const findings: Case['finding'][] = ['confirmed', 'unconfirmed', 'dismissed', 'referred', null];
  const priorities: Case['priority'][] = ['low', 'medium', 'high', 'urgent'];
  const summaries = [
    'Alleged disruptive behaviour during evening prep session.',
    'Repeated late arrival to morning assembly over two weeks.',
    'Reported disagreement between two learners in dormitory.',
    'Concern raised about learner welfare and attendance pattern.',
    'Alleged use of unauthorised device during examination.',
    'Positive conduct referral for leadership during school event.',
  ];

  return Array.from({ length: 10 }, (_, i) => {
    const l = learners[i % learners.length];
    const stage = pick(stages, i);
    return {
      id: `case${i + 1}`,
      caseNumber: `CASE/${2026}/${String(101 + i).padStart(4, '0')}`,
      learnerId: l.id,
      learnerName: `${l.firstName} ${l.lastName}`,
      admissionNumber: l.admissionNumber,
      className: l.className,
      stage,
      finding: stage === 'finding' || stage === 'intervention' || stage === 'review' || stage === 'closure' ? pick(findings, i) : null,
      summary: pick(summaries, i),
      submittedAt: dateTimeStr(randomInt(1, 20)),
      submittedBy: pick(['Kato Joshua', 'Atim Faith', 'Namusoke Sarah'], i),
      assignedTo: stage !== 'submitted' ? pick(['Namusoke Sarah (Headteacher)', 'Okello Daniel (Admin)', 'Atim Faith (Counsellor)'], i) : undefined,
      reviewDate: stage === 'review' || stage === 'closure' ? dateStr(randomInt(0, 7)) : undefined,
      closedAt: stage === 'closure' ? dateTimeStr(randomInt(0, 3)) : undefined,
      parentContacted: i % 2 === 0,
      interventionId: stage === 'intervention' || stage === 'review' || stage === 'closure' ? `int${i + 1}` : undefined,
      priority: pick(priorities, i),
    };
  });
}

export function generateInterventions(): Intervention[] {
  const learners = generateLearners(10);
  const types = ['Counselling Session', 'Mentorship Programme', 'Attendance Monitoring', 'Behavioural Support Plan', 'Academic Support'];
  const statuses: Intervention['status'][] = ['active', 'completed', 'paused', 'cancelled'];

  return Array.from({ length: 8 }, (_, i) => {
    const l = learners[i % learners.length];
    return {
      id: `int${i + 1}`,
      learnerId: l.id,
      learnerName: `${l.firstName} ${l.lastName}`,
      type: pick(types, i),
      description: 'Structured support plan with weekly review and guardian involvement.',
      startDate: dateStr(randomInt(5, 30)),
      reviewDate: dateStr(randomInt(0, 7)),
      endDate: i % 3 === 0 ? dateStr(randomInt(0, 14)) : undefined,
      assignedTo: pick(['Atim Faith (Counsellor)', 'Namusoke Sarah (Headteacher)', 'Kato Joshua (Teacher)'], i),
      status: pick(statuses, i),
    };
  });
}

export function generateAuthorizedAbsences(): AuthorizedAbsence[] {
  const learners = generateLearners(12);
  const reasons = [
    'Family bereavement',
    'Medical appointment',
    'Religious observance',
    'Family emergency',
    'Approved school representation',
    'Illness (with medical note)',
  ];

  return Array.from({ length: 8 }, (_, i) => {
    const l = learners[i % learners.length];
    return {
      id: `abs${i + 1}`,
      learnerId: l.id,
      learnerName: `${l.firstName} ${l.lastName}`,
      admissionNumber: l.admissionNumber,
      className: l.className,
      startDate: dateStr(randomInt(0, 5)),
      endDate: dateStr(randomInt(0, 3)),
      reason: pick(reasons, i),
      authorizedBy: pick(['Namusoke Sarah (Headteacher)', 'Okello Daniel (Admin)'], i),
      authorizedAt: dateTimeStr(randomInt(0, 5)),
      status: pick(['active', 'expired', 'cancelled'] as const, i),
      parentNotified: i % 4 !== 0,
      notes: i % 2 === 0 ? 'Guardian acknowledged receipt of absence notification.' : undefined,
    };
  });
}

export function generateAuditEvents(): AuditEvent[] {
  const users = generateStaff();
  const actions = [
    'LOGIN', 'LOGOUT', 'CREATE_LEARNER', 'UPDATE_LEARNER', 'GENERATE_QR', 'REVOKE_QR',
    'RECORD_ATTENDANCE', 'CREATE_OCCASION', 'CLOSE_OCCASION', 'RECORD_OBSERVATION',
    'OPEN_CASE', 'ASSIGN_CASE', 'CLOSE_CASE', 'SYNC_DEVICE', 'AUTHORIZE_ABSENCE',
    'UPDATE_SETTINGS', 'EXPORT_REPORT', 'SEND_NOTIFICATION', 'CHANGE_ROLE',
  ];
  const modules = ['Auth', 'Learners', 'Attendance', 'Observations', 'Cases', 'Devices', 'Settings', 'Reports', 'Communication'];
  const results: AuditEvent['result'][] = ['success', 'success', 'success', 'failure', 'denied'];

  return Array.from({ length: 30 }, (_, i) => {
    const u = users[i % users.length];
    return {
      id: `audit${i + 1}`,
      timestamp: dateTimeStr(randomInt(0, 7), randomInt(6, 19), randomInt(0, 59)),
      userId: u.id,
      userName: `${u.firstName} ${u.lastName}`,
      userRole: u.roleLabel,
      action: pick(actions, i),
      module: pick(modules, i),
      recordId: i % 2 === 0 ? `rec${1000 + i}` : undefined,
      recordType: pick(['Learner', 'AttendanceRecord', 'Case', 'Device', 'Settings'], i),
      deviceId: i % 4 === 0 ? `dev${(i % 4) + 1}` : undefined,
      ipAddress: `102.176.${randomInt(100, 200)}.${randomInt(1, 254)}`,
      reason: i % 5 === 0 ? 'Routine administrative action' : undefined,
      result: pick(results, i),
    };
  });
}

export function generateNotifications(): Notification[] {
  const templates = ['Absence Alert', 'Arrival Notification', 'Reporting Date Reminder', 'Parent Meeting Notice', 'Intervention Follow-up'];
  const statuses: Notification['status'][] = ['sent', 'sent', 'sent', 'failed', 'pending', 'draft'];
  const messages = [
    'Dear guardian, your child was marked absent today. Please contact the school.',
    'Dear guardian, your child arrived safely at school this morning.',
    'Reminder: Mid-term reports will be available on Friday. Please collect from the office.',
    'You are invited to a parent meeting on Friday at 10:00 AM in the main hall.',
    'Please contact the school regarding an important learner-support matter.',
  ];

  return Array.from({ length: 15 }, (_, i) => ({
    id: `notif${i + 1}`,
    type: 'sms' as const,
    templateId: `tpl${(i % 5) + 1}`,
    guardianPhone: phone(),
    message: pick(messages, i),
    sentAt: i % 4 !== 0 ? dateTimeStr(randomInt(0, 3), randomInt(7, 18)) : undefined,
    status: pick(statuses, i),
    triggeredBy: pick(['Okello Daniel', 'Namusoke Sarah', 'System (Automated)'], i),
  }));
}

export function generateSyncRecords(): SyncRecord[] {
  const devices = generateDevices();
  return devices.slice(0, 6).map((d, i) => ({
    id: `sync${i + 1}`,
    deviceId: d.id,
    deviceName: d.name,
    syncedAt: dateTimeStr(randomInt(0, 2), randomInt(6, 18)),
    recordsUploaded: randomInt(20, 200),
    recordsFailed: i % 3 === 0 ? randomInt(0, 5) : 0,
    conflicts: i % 4 === 0 ? randomInt(0, 2) : 0,
    status: pick(['success', 'success', 'partial', 'failed'] as const, i),
  }));
}

export function generateDashboardMetrics(): DashboardMetrics {
  return {
    activeLearners: 847,
    presentToday: 792,
    lateToday: 23,
    unexplainedAbsences: 18,
    openWelfareConcerns: 7,
    devicesAwaitingSync: 3,
    changes: {
      activeLearners: 4,
      presentToday: -8,
      lateToday: 5,
      unexplainedAbsences: -3,
      openWelfareConcerns: 1,
      devicesAwaitingSync: -1,
    },
  };
}

export function generateAttendanceTrend(): AttendanceTrendPoint[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    date: day,
    present: randomInt(750, 810),
    late: randomInt(15, 35),
    absent: randomInt(12, 25),
    excused: randomInt(5, 15),
  }));
}

export function generateClassAttendance(): ClassAttendance[] {
  return classes.map((c, i) => ({
    className: c.name,
    percentage: randomInt(82, 98),
    present: randomInt(100, 145),
    total: randomInt(120, 150),
  }));
}

export function generateRoles(): Role[] {
  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'school_admin', label: 'School Administrator', desc: 'Full system access including settings and audit.' },
    { role: 'headteacher', label: 'Headteacher', desc: 'Oversight of learners, cases, reports and staff.' },
    { role: 'director_of_studies', label: 'Director of Studies', desc: 'Academic management and reporting.' },
    { role: 'teacher', label: 'Teacher', desc: 'Attendance, observations and marks entry.' },
    { role: 'security_officer', label: 'Security Officer', desc: 'Gate scanning and permitted exits only.' },
    { role: 'nurse', label: 'School Nurse', desc: 'Sick-bay attendance and health encounters.' },
    { role: 'warden', label: 'Dormitory Warden', desc: 'Dormitory roll calls and boarding welfare.' },
    { role: 'transport_officer', label: 'Transport Officer', desc: 'Bus scanning and transport attendance.' },
  ];

  const modules = ['Dashboard', 'Learners', 'Attendance', 'Observations', 'Cases', 'Welfare', 'Academics', 'Staff', 'Devices', 'Reports', 'Communication', 'Audit Logs', 'Settings'];

  return roles.map((r) => {
    let perms: Permission[];
    if (r.role === 'school_admin') {
      perms = modules.map((m) => ({ module: m, actions: ['read', 'write', 'delete', 'admin'] as const }));
    } else if (r.role === 'headteacher') {
      perms = modules.filter((m) => m !== 'Settings').map((m) => ({ module: m, actions: ['read', 'write'] as const }));
    } else if (r.role === 'director_of_studies') {
      perms = ['Dashboard', 'Learners', 'Attendance', 'Academics', 'Reports'].map((m) => ({ module: m, actions: ['read', 'write'] as const }));
    } else if (r.role === 'teacher') {
      perms = ['Dashboard', 'Learners', 'Attendance', 'Observations', 'Academics'].map((m) => ({ module: m, actions: ['read', 'write'] as const }));
    } else if (r.role === 'security_officer') {
      perms = ['Dashboard', 'Attendance'].map((m) => ({ module: m, actions: ['read', 'write'] as const }));
    } else if (r.role === 'nurse') {
      perms = ['Dashboard', 'Welfare', 'Attendance'].map((m) => ({ module: m, actions: ['read', 'write'] as const }));
    } else if (r.role === 'warden') {
      perms = ['Dashboard', 'Attendance', 'Welfare'].map((m) => ({ module: m, actions: ['read', 'write'] as const }));
    } else {
      perms = ['Dashboard', 'Attendance'].map((m) => ({ module: m, actions: ['read', 'write'] as const }));
    }
    return { id: r.role, name: r.role, label: r.label, description: r.desc, permissions: perms as Permission[] };
  });
}

export function generateSchool(): School {
  return {
    id: 'sch1',
    name: 'Nile Crest Secondary School',
    motto: 'Knowledge · Integrity · Service',
    address: 'Plot 14, Kololo Hill Drive',
    district: 'Kampala',
    region: 'Central',
  };
}

export function generateTerm(): Term {
  return {
    id: 'term2-2026',
    academicYearId: 'ay2026',
    name: 'Term 2',
    startDate: '2026-05-26',
    endDate: '2026-08-26',
    isCurrent: true,
    label: 'Term 2 · 2026',
  };
}

export { classes, streams, houses, dormitories };
