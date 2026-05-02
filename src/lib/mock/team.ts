export type TeamRole =
  | 'Super Admin'
  | 'Ops Manager'
  | 'Finance Officer'
  | 'Support Agent'
  | 'Content Manager'
  | 'Viewer';

export type TeamStatus = 'Active' | 'Pending' | 'Suspended';

export interface AuditEntry {
  action: string;
  at: string;
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: TeamRole;
  status: TeamStatus;
  jobTitle: string;
  invitedAt: string;
  joinedAt: string | null;
  lastLogin: string | null;
  invitedBy: string;
  auditTrail: AuditEntry[];
}

export interface InviteEntry {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  role: TeamRole;
}

export const ALL_ROLES: TeamRole[] = [
  'Super Admin',
  'Ops Manager',
  'Finance Officer',
  'Support Agent',
  'Content Manager',
  'Viewer',
];

export const MOCK_TEAM: TeamMember[] = [
  {
    id: 'tm_1',
    firstName: 'Layla',
    lastName: 'Al-Hassan',
    email: 'layla.alhassan@hikayat.io',
    phone: '+966 50 123 4567',
    role: 'Super Admin',
    status: 'Active',
    jobTitle: 'Head of Platform',
    invitedAt: '2024-01-10',
    joinedAt: '2024-01-11',
    lastLogin: '2026-04-10T08:30:00Z',
    invitedBy: 'System',
    auditTrail: [
      { action: 'Joined the platform', at: '2024-01-11T09:00:00Z' },
      { action: 'Role changed to Super Admin', at: '2024-01-11T09:05:00Z' },
      { action: 'Logged in', at: '2026-04-10T08:30:00Z' },
    ],
  },
  {
    id: 'tm_2',
    firstName: 'Omar',
    lastName: 'Khalid',
    email: 'omar.khalid@hikayat.io',
    phone: '+971 55 987 6543',
    role: 'Ops Manager',
    status: 'Active',
    jobTitle: 'Operations Lead',
    invitedAt: '2024-01-15',
    joinedAt: '2024-01-16',
    lastLogin: '2026-04-09T14:20:00Z',
    invitedBy: 'Layla Al-Hassan',
    auditTrail: [
      { action: 'Invitation sent by Layla Al-Hassan', at: '2024-01-15T10:00:00Z' },
      { action: 'Joined the platform', at: '2024-01-16T11:00:00Z' },
      { action: 'Logged in', at: '2026-04-09T14:20:00Z' },
    ],
  },
  {
    id: 'tm_3',
    firstName: 'Sara',
    lastName: 'Bin Nasser',
    email: 'sara.binnasser@hikayat.io',
    phone: '+966 54 321 0987',
    role: 'Finance Officer',
    status: 'Active',
    jobTitle: 'Financial Controller',
    invitedAt: '2024-02-01',
    joinedAt: '2024-02-03',
    lastLogin: '2026-04-08T09:45:00Z',
    invitedBy: 'Layla Al-Hassan',
    auditTrail: [
      { action: 'Invitation sent by Layla Al-Hassan', at: '2024-02-01T09:00:00Z' },
      { action: 'Joined the platform', at: '2024-02-03T10:00:00Z' },
      { action: 'Logged in', at: '2026-04-08T09:45:00Z' },
    ],
  },
  {
    id: 'tm_4',
    firstName: 'Khalid',
    lastName: 'Al-Rashidi',
    email: 'khalid.alrashidi@hikayat.io',
    phone: '+965 99 876 5432',
    role: 'Support Agent',
    status: 'Active',
    jobTitle: 'Senior Support Specialist',
    invitedAt: '2024-03-10',
    joinedAt: '2024-03-11',
    lastLogin: '2026-04-11T07:50:00Z',
    invitedBy: 'Omar Khalid',
    auditTrail: [
      { action: 'Invitation sent by Omar Khalid', at: '2024-03-10T08:00:00Z' },
      { action: 'Joined the platform', at: '2024-03-11T09:00:00Z' },
      { action: 'Logged in', at: '2026-04-11T07:50:00Z' },
    ],
  },
  {
    id: 'tm_5',
    firstName: 'Nour',
    lastName: 'Al-Zahrawi',
    email: 'nour.alzahrawi@hikayat.io',
    phone: '+974 33 654 3210',
    role: 'Content Manager',
    status: 'Active',
    jobTitle: 'Content Strategy Lead',
    invitedAt: '2024-03-20',
    joinedAt: '2024-03-21',
    lastLogin: '2026-04-10T16:30:00Z',
    invitedBy: 'Layla Al-Hassan',
    auditTrail: [
      { action: 'Invitation sent by Layla Al-Hassan', at: '2024-03-20T11:00:00Z' },
      { action: 'Joined the platform', at: '2024-03-21T12:00:00Z' },
      { action: 'Logged in', at: '2026-04-10T16:30:00Z' },
    ],
  },
  {
    id: 'tm_6',
    firstName: 'Faisal',
    lastName: 'Al-Mutairi',
    email: 'faisal.almutairi@hikayat.io',
    phone: '+966 56 234 5678',
    role: 'Viewer',
    status: 'Active',
    jobTitle: 'Business Analyst',
    invitedAt: '2024-05-01',
    joinedAt: '2024-05-02',
    lastLogin: '2026-04-07T11:20:00Z',
    invitedBy: 'Omar Khalid',
    auditTrail: [
      { action: 'Invitation sent by Omar Khalid', at: '2024-05-01T14:00:00Z' },
      { action: 'Joined the platform', at: '2024-05-02T10:00:00Z' },
      { action: 'Logged in', at: '2026-04-07T11:20:00Z' },
    ],
  },
  {
    id: 'tm_7',
    firstName: 'Dina',
    lastName: 'Yousef',
    email: 'dina.yousef@hikayat.io',
    phone: '+971 50 345 6789',
    role: 'Support Agent',
    status: 'Pending',
    jobTitle: 'Customer Success Specialist',
    invitedAt: '2026-04-08',
    joinedAt: null,
    lastLogin: null,
    invitedBy: 'Omar Khalid',
    auditTrail: [{ action: 'Invitation sent by Omar Khalid', at: '2026-04-08T10:00:00Z' }],
  },
  {
    id: 'tm_8',
    firstName: 'Ahmed',
    lastName: 'Al-Ghamdi',
    email: 'ahmed.alghamdi@hikayat.io',
    phone: '+966 58 456 7890',
    role: 'Content Manager',
    status: 'Pending',
    jobTitle: 'Content Creator',
    invitedAt: '2026-04-09',
    joinedAt: null,
    lastLogin: null,
    invitedBy: 'Nour Al-Zahrawi',
    auditTrail: [{ action: 'Invitation sent by Nour Al-Zahrawi', at: '2026-04-09T13:00:00Z' }],
  },
  {
    id: 'tm_9',
    firstName: 'Reem',
    lastName: 'Al-Otaibi',
    email: 'reem.alotaibi@hikayat.io',
    phone: '+966 55 567 8901',
    role: 'Finance Officer',
    status: 'Suspended',
    jobTitle: 'Accounts Executive',
    invitedAt: '2024-04-01',
    joinedAt: '2024-04-02',
    lastLogin: '2025-12-01T14:30:00Z',
    invitedBy: 'Sara Bin Nasser',
    auditTrail: [
      { action: 'Joined the platform', at: '2024-04-02T09:00:00Z' },
      { action: 'Last login recorded', at: '2025-12-01T14:30:00Z' },
      { action: 'Account suspended', at: '2026-01-15T10:00:00Z' },
    ],
  },
  {
    id: 'tm_10',
    firstName: 'Tariq',
    lastName: 'Al-Shammari',
    email: 'tariq.alshammari@hikayat.io',
    phone: '+966 53 678 9012',
    role: 'Ops Manager',
    status: 'Suspended',
    jobTitle: 'Operations Coordinator',
    invitedAt: '2024-06-15',
    joinedAt: '2024-06-17',
    lastLogin: '2025-11-20T10:00:00Z',
    invitedBy: 'Layla Al-Hassan',
    auditTrail: [
      { action: 'Joined the platform', at: '2024-06-17T11:00:00Z' },
      { action: 'Role changed to Ops Manager', at: '2024-07-01T09:00:00Z' },
      { action: 'Account suspended', at: '2026-02-10T10:00:00Z' },
    ],
  },
];
