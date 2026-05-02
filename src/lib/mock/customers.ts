export type Plan = 'Starter' | 'Pro' | 'Business' | 'Enterprise';
export type CompanyStatus = 'active' | 'trial' | 'suspended' | 'churned';
export type UserRole = 'Owner' | 'Admin' | 'Member' | 'Viewer';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type WidgetStatus = 'active' | 'inactive';
export type Platform = 'Web' | 'iOS' | 'Android' | 'React Native';
export type CreditAction = 'used' | 'added' | 'reset';
export type CustomerFit = 'High' | 'Medium' | 'Low';
export type AuditIconType =
  | 'upgrade'
  | 'payment'
  | 'user'
  | 'widget'
  | 'credit'
  | 'suspend'
  | 'note';

export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
}

export interface Widget {
  id: string;
  name: string;
  platform: Platform;
  sdkToken: string;
  storiesCount: number;
  status: WidgetStatus;
}

export interface CreditEntry {
  id: string;
  date: string;
  action: CreditAction;
  amount: number;
  feature: string;
  balanceAfter: number;
}

export interface AuditEntry {
  id: string;
  date: string;
  action: string;
  actor: string;
  iconType: AuditIconType;
}

export interface Note {
  id: string;
  content: string;
  author: string;
  date: string;
}

export interface ImpressionPoint {
  label: string;
  impressions: number;
  ctr: number;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  country: 'SA' | 'AE' | 'KW' | 'QA';
  countryName: string;
  countryFlag: string;
  plan: Plan;
  status: CompanyStatus;
  mrrCents: number;
  creditsUsed: number;
  creditsTotal: number;
  billingCycle: 'Monthly' | 'Annual';
  nextRenewal: string;
  paymentLastFour: string;
  registeredAt: string;
  lastLoginAt: string;
  // CRM fields
  tags: string[];
  customerFit: CustomerFit;
  accountOwner: string;
  lastPayment: { date: string; amountCents: number } | null;
  impressionData: ImpressionPoint[];
  users: CompanyUser[];
  widgets: Widget[];
  creditHistory: CreditEntry[];
  auditLog: AuditEntry[];
  notes: Note[];
}

export const MOCK_CUSTOMERS: Company[] = [
  {
    id: 'c1',
    name: 'Noon Commerce',
    domain: 'noon.com',
    email: 'tech@noon.com',
    phone: '+971 4 555 0100',
    address: 'Downtown Dubai, UAE',
    industry: 'E-Commerce',
    country: 'AE',
    countryName: 'UAE',
    countryFlag: '🇦🇪',
    plan: 'Enterprise',
    status: 'active',
    mrrCents: 299900,
    creditsUsed: 18400,
    creditsTotal: 50000,
    billingCycle: 'Annual',
    nextRenewal: '2026-12-01',
    paymentLastFour: '4242',
    registeredAt: '2024-01-15',
    lastLoginAt: '2026-04-08',
    tags: ['Enterprise', 'E-Commerce', 'Gulf'],
    customerFit: 'High',
    accountOwner: 'Sarah Al-Rashidi',
    lastPayment: { date: '2026-04-01', amountCents: 299900 },
    impressionData: [
      { label: 'Feb 24', impressions: 142000, ctr: 4.2 },
      { label: 'Mar 3', impressions: 158000, ctr: 4.5 },
      { label: 'Mar 10', impressions: 163000, ctr: 4.8 },
      { label: 'Mar 17', impressions: 171000, ctr: 5.1 },
      { label: 'Mar 24', impressions: 189000, ctr: 5.3 },
      { label: 'Mar 31', impressions: 204000, ctr: 5.6 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Faisal Al-Mansoori',
        email: 'faisal@noon.com',
        role: 'Owner',
        status: 'active',
        lastLogin: '2026-04-08',
      },
      {
        id: 'u2',
        name: 'Layla Hassan',
        email: 'layla@noon.com',
        role: 'Admin',
        status: 'active',
        lastLogin: '2026-04-07',
      },
      {
        id: 'u3',
        name: 'Omar Khalid',
        email: 'omar@noon.com',
        role: 'Member',
        status: 'active',
        lastLogin: '2026-04-05',
      },
      {
        id: 'u4',
        name: 'Sara Ahmed',
        email: 'sara@noon.com',
        role: 'Member',
        status: 'inactive',
        lastLogin: '2026-02-10',
      },
      {
        id: 'u5',
        name: 'Jad Nassar',
        email: 'jad@noon.com',
        role: 'Viewer',
        status: 'active',
        lastLogin: '2026-04-01',
      },
    ],
    widgets: [
      {
        id: 'w1',
        name: 'Homepage Stories',
        platform: 'Web',
        sdkToken: 'hk_live_noon_web_01',
        storiesCount: 24,
        status: 'active',
      },
      {
        id: 'w2',
        name: 'Mobile App',
        platform: 'iOS',
        sdkToken: 'hk_live_noon_ios_02',
        storiesCount: 18,
        status: 'active',
      },
      {
        id: 'w3',
        name: 'Android App',
        platform: 'Android',
        sdkToken: 'hk_live_noon_and_03',
        storiesCount: 18,
        status: 'active',
      },
      {
        id: 'w4',
        name: 'Category Widgets',
        platform: 'Web',
        sdkToken: 'hk_live_noon_web_04',
        storiesCount: 9,
        status: 'inactive',
      },
    ],
    creditHistory: [
      {
        id: 'cr1',
        date: '2026-04-01',
        action: 'used',
        amount: -120,
        feature: 'Story Generation',
        balanceAfter: 31600,
      },
      {
        id: 'cr2',
        date: '2026-03-15',
        action: 'added',
        amount: 5000,
        feature: 'Manual Top-up',
        balanceAfter: 31720,
      },
      {
        id: 'cr3',
        date: '2026-03-01',
        action: 'used',
        amount: -2300,
        feature: 'Story Generation',
        balanceAfter: 26720,
      },
      {
        id: 'cr4',
        date: '2026-02-01',
        action: 'reset',
        amount: 50000,
        feature: 'Monthly Reset',
        balanceAfter: 50000,
      },
      {
        id: 'cr5',
        date: '2026-01-15',
        action: 'used',
        amount: -4800,
        feature: 'Story Generation',
        balanceAfter: 28400,
      },
    ],
    auditLog: [
      {
        id: 'a1',
        date: '2026-04-08',
        action: 'Plan upgraded from Business to Enterprise',
        actor: 'Admin: Layla Hassan',
        iconType: 'upgrade',
      },
      {
        id: 'a2',
        date: '2026-04-01',
        action: 'Invoice #INV-2026-04 paid ($2,999)',
        actor: 'System',
        iconType: 'payment',
      },
      {
        id: 'a3',
        date: '2026-03-20',
        action: 'New user jad@noon.com added as Viewer',
        actor: 'Faisal Al-Mansoori',
        iconType: 'user',
      },
      {
        id: 'a4',
        date: '2026-03-10',
        action: "Widget 'Category Widgets' deactivated",
        actor: 'Omar Khalid',
        iconType: 'widget',
      },
      {
        id: 'a5',
        date: '2026-03-15',
        action: '5,000 AI credits added manually',
        actor: 'Admin: Support Team',
        iconType: 'credit',
      },
      {
        id: 'a6',
        date: '2026-02-01',
        action: 'AI credits reset to 50,000 (monthly cycle)',
        actor: 'System',
        iconType: 'credit',
      },
    ],
    notes: [
      {
        id: 'n1',
        content:
          'Enterprise deal closed Q1 2026. Champion is Faisal. Renewal due Dec 2026 — flag for upsell conversation in Oct.',
        author: 'Sarah (CS)',
        date: '2026-01-15',
      },
      {
        id: 'n2',
        content:
          'Requested custom widget templates. Forwarded to product team — tracked in #product-requests Slack.',
        author: 'Ahmed (Support)',
        date: '2026-03-22',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Jarir Bookstore',
    domain: 'jarir.com',
    email: 'digital@jarir.com',
    phone: '+966 11 463 3333',
    address: 'Riyadh, Saudi Arabia',
    industry: 'Retail',
    country: 'SA',
    countryName: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    plan: 'Business',
    status: 'active',
    mrrCents: 149900,
    creditsUsed: 9200,
    creditsTotal: 20000,
    billingCycle: 'Monthly',
    nextRenewal: '2026-05-01',
    paymentLastFour: '1234',
    registeredAt: '2024-03-10',
    lastLoginAt: '2026-04-07',
    tags: ['Retail', 'Saudi Arabia'],
    customerFit: 'High',
    accountOwner: 'Ahmed Khalid',
    lastPayment: { date: '2026-04-02', amountCents: 149900 },
    impressionData: [
      { label: 'Feb 24', impressions: 45000, ctr: 3.1 },
      { label: 'Mar 3', impressions: 52000, ctr: 3.3 },
      { label: 'Mar 10', impressions: 49000, ctr: 3.0 },
      { label: 'Mar 17', impressions: 58000, ctr: 3.5 },
      { label: 'Mar 24', impressions: 61000, ctr: 3.7 },
      { label: 'Mar 31', impressions: 67000, ctr: 3.9 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Mohammed Al-Zahrani',
        email: 'm.zahrani@jarir.com',
        role: 'Owner',
        status: 'active',
        lastLogin: '2026-04-07',
      },
      {
        id: 'u2',
        name: 'Reem Saleh',
        email: 'reem@jarir.com',
        role: 'Admin',
        status: 'active',
        lastLogin: '2026-04-06',
      },
    ],
    widgets: [
      {
        id: 'w1',
        name: 'Bookstore Stories',
        platform: 'Web',
        sdkToken: 'hk_live_jar_web_01',
        storiesCount: 12,
        status: 'active',
      },
    ],
    creditHistory: [
      {
        id: 'cr1',
        date: '2026-04-02',
        action: 'used',
        amount: -800,
        feature: 'Story Generation',
        balanceAfter: 10800,
      },
    ],
    auditLog: [
      {
        id: 'a1',
        date: '2026-04-02',
        action: 'Invoice #INV-2026-04 paid ($1,499)',
        actor: 'System',
        iconType: 'payment',
      },
    ],
    notes: [],
  },
  {
    id: 'c3',
    name: 'Talabat',
    domain: 'talabat.com',
    email: 'tech@talabat.com',
    phone: '+965 2244 0000',
    address: 'Kuwait City, Kuwait',
    industry: 'Food Delivery',
    country: 'KW',
    countryName: 'Kuwait',
    countryFlag: '🇰🇼',
    plan: 'Pro',
    status: 'active',
    mrrCents: 79900,
    creditsUsed: 3100,
    creditsTotal: 10000,
    billingCycle: 'Annual',
    nextRenewal: '2026-11-15',
    paymentLastFour: '5678',
    registeredAt: '2024-05-20',
    lastLoginAt: '2026-04-06',
    tags: ['Food Delivery', 'Mobile', 'Kuwait'],
    customerFit: 'High',
    accountOwner: 'Sarah Al-Rashidi',
    lastPayment: { date: '2026-03-01', amountCents: 79900 },
    impressionData: [
      { label: 'Feb 24', impressions: 28000, ctr: 3.8 },
      { label: 'Mar 3', impressions: 31000, ctr: 4.0 },
      { label: 'Mar 10', impressions: 29500, ctr: 3.7 },
      { label: 'Mar 17', impressions: 35000, ctr: 4.2 },
      { label: 'Mar 24', impressions: 38000, ctr: 4.5 },
      { label: 'Mar 31', impressions: 42000, ctr: 4.8 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Ali Al-Rashidi',
        email: 'ali@talabat.com',
        role: 'Owner',
        status: 'active',
        lastLogin: '2026-04-06',
      },
      {
        id: 'u2',
        name: 'Nour Hamad',
        email: 'nour@talabat.com',
        role: 'Member',
        status: 'active',
        lastLogin: '2026-04-03',
      },
    ],
    widgets: [
      {
        id: 'w1',
        name: 'App Stories',
        platform: 'iOS',
        sdkToken: 'hk_live_tal_ios_01',
        storiesCount: 8,
        status: 'active',
      },
      {
        id: 'w2',
        name: 'Android Stories',
        platform: 'Android',
        sdkToken: 'hk_live_tal_and_02',
        storiesCount: 8,
        status: 'active',
      },
    ],
    creditHistory: [
      {
        id: 'cr1',
        date: '2026-03-28',
        action: 'used',
        amount: -400,
        feature: 'Story Generation',
        balanceAfter: 6900,
      },
    ],
    auditLog: [
      {
        id: 'a1',
        date: '2026-03-01',
        action: 'Invoice #INV-2026-03 paid ($799)',
        actor: 'System',
        iconType: 'payment',
      },
    ],
    notes: [],
  },
  {
    id: 'c4',
    name: 'Salla',
    domain: 'salla.sa',
    email: 'hello@salla.sa',
    phone: '+966 50 000 1234',
    address: 'Jeddah, Saudi Arabia',
    industry: 'E-Commerce SaaS',
    country: 'SA',
    countryName: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    plan: 'Business',
    status: 'trial',
    mrrCents: 0,
    creditsUsed: 450,
    creditsTotal: 2000,
    billingCycle: 'Monthly',
    nextRenewal: '2026-04-22',
    paymentLastFour: '',
    registeredAt: '2026-03-22',
    lastLoginAt: '2026-04-08',
    tags: ['Trial', 'SaaS', 'E-Commerce'],
    customerFit: 'Medium',
    accountOwner: 'Ahmed Khalid',
    lastPayment: null,
    impressionData: [
      { label: 'Feb 24', impressions: 0, ctr: 0 },
      { label: 'Mar 3', impressions: 0, ctr: 0 },
      { label: 'Mar 10', impressions: 0, ctr: 0 },
      { label: 'Mar 17', impressions: 0, ctr: 0 },
      { label: 'Mar 24', impressions: 800, ctr: 1.5 },
      { label: 'Mar 31', impressions: 2100, ctr: 2.2 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Khalid Batarfi',
        email: 'khalid@salla.sa',
        role: 'Owner',
        status: 'active',
        lastLogin: '2026-04-08',
      },
    ],
    widgets: [
      {
        id: 'w1',
        name: 'Merchant Stories',
        platform: 'Web',
        sdkToken: 'hk_trial_sal_web_01',
        storiesCount: 3,
        status: 'active',
      },
    ],
    creditHistory: [],
    auditLog: [
      {
        id: 'a1',
        date: '2026-03-22',
        action: 'Trial started — Business plan (14 days)',
        actor: 'System',
        iconType: 'upgrade',
      },
    ],
    notes: [
      {
        id: 'n1',
        content: 'High-intent trial — Khalid came from a referral. Follow up on day 10.',
        author: 'Ahmed (Sales)',
        date: '2026-03-23',
      },
    ],
  },
  {
    id: 'c5',
    name: 'Careem',
    domain: 'careem.com',
    email: 'partners@careem.com',
    phone: '+971 800 27336',
    address: 'Dubai, UAE',
    industry: 'Mobility',
    country: 'AE',
    countryName: 'UAE',
    countryFlag: '🇦🇪',
    plan: 'Enterprise',
    status: 'suspended',
    mrrCents: 299900,
    creditsUsed: 0,
    creditsTotal: 50000,
    billingCycle: 'Annual',
    nextRenewal: '2026-08-01',
    paymentLastFour: '9012',
    registeredAt: '2023-08-01',
    lastLoginAt: '2026-02-15',
    tags: ['Enterprise', 'Suspended', 'Mobility'],
    customerFit: 'Medium',
    accountOwner: 'Sarah Al-Rashidi',
    lastPayment: { date: '2026-01-01', amountCents: 299900 },
    impressionData: [
      { label: 'Feb 24', impressions: 18000, ctr: 2.1 },
      { label: 'Mar 3', impressions: 9000, ctr: 1.4 },
      { label: 'Mar 10', impressions: 3000, ctr: 0.8 },
      { label: 'Mar 17', impressions: 800, ctr: 0.3 },
      { label: 'Mar 24', impressions: 0, ctr: 0 },
      { label: 'Mar 31', impressions: 0, ctr: 0 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Tariq Yusuf',
        email: 'tariq@careem.com',
        role: 'Owner',
        status: 'suspended',
        lastLogin: '2026-02-15',
      },
    ],
    widgets: [],
    creditHistory: [],
    auditLog: [
      {
        id: 'a1',
        date: '2026-02-20',
        action: 'Account suspended — payment overdue 30 days',
        actor: 'System',
        iconType: 'suspend',
      },
      {
        id: 'a2',
        date: '2026-02-01',
        action: 'Invoice #INV-2026-02 failed (card declined)',
        actor: 'System',
        iconType: 'payment',
      },
    ],
    notes: [
      {
        id: 'n1',
        content:
          'Account suspended due to non-payment. Waiting for updated billing info from Tariq.',
        author: 'Billing Team',
        date: '2026-02-21',
      },
    ],
  },
  {
    id: 'c6',
    name: 'Namshi',
    domain: 'namshi.com',
    email: 'tech@namshi.com',
    phone: '+971 4 888 1234',
    address: 'Dubai, UAE',
    industry: 'Fashion',
    country: 'AE',
    countryName: 'UAE',
    countryFlag: '🇦🇪',
    plan: 'Pro',
    status: 'active',
    mrrCents: 79900,
    creditsUsed: 2800,
    creditsTotal: 10000,
    billingCycle: 'Monthly',
    nextRenewal: '2026-05-10',
    paymentLastFour: '3456',
    registeredAt: '2024-10-10',
    lastLoginAt: '2026-04-07',
    tags: ['Fashion', 'UAE'],
    customerFit: 'Medium',
    accountOwner: 'Ahmed Khalid',
    lastPayment: { date: '2026-04-10', amountCents: 79900 },
    impressionData: [
      { label: 'Feb 24', impressions: 22000, ctr: 3.2 },
      { label: 'Mar 3', impressions: 25000, ctr: 3.4 },
      { label: 'Mar 10', impressions: 24000, ctr: 3.1 },
      { label: 'Mar 17', impressions: 28000, ctr: 3.6 },
      { label: 'Mar 24', impressions: 30000, ctr: 3.8 },
      { label: 'Mar 31', impressions: 33000, ctr: 4.0 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Dina Khalil',
        email: 'dina@namshi.com',
        role: 'Owner',
        status: 'active',
        lastLogin: '2026-04-07',
      },
    ],
    widgets: [
      {
        id: 'w1',
        name: 'Fashion Stories',
        platform: 'Web',
        sdkToken: 'hk_live_nam_web_01',
        storiesCount: 15,
        status: 'active',
      },
    ],
    creditHistory: [],
    auditLog: [
      {
        id: 'a1',
        date: '2026-04-10',
        action: 'Invoice #INV-2026-04 paid ($799)',
        actor: 'System',
        iconType: 'payment',
      },
      {
        id: 'a2',
        date: '2024-10-10',
        action: 'Account registered — Pro plan',
        actor: 'System',
        iconType: 'upgrade',
      },
    ],
    notes: [],
  },
  {
    id: 'c7',
    name: 'Bayt',
    domain: 'bayt.com',
    email: 'product@bayt.com',
    phone: '+971 4 367 2021',
    address: 'Dubai, UAE',
    industry: 'Recruitment',
    country: 'AE',
    countryName: 'UAE',
    countryFlag: '🇦🇪',
    plan: 'Starter',
    status: 'active',
    mrrCents: 29900,
    creditsUsed: 600,
    creditsTotal: 3000,
    billingCycle: 'Monthly',
    nextRenewal: '2026-05-03',
    paymentLastFour: '7890',
    registeredAt: '2025-03-03',
    lastLoginAt: '2026-04-05',
    tags: ['Recruitment', 'UAE'],
    customerFit: 'Low',
    accountOwner: 'Sarah Al-Rashidi',
    lastPayment: { date: '2026-04-03', amountCents: 29900 },
    impressionData: [
      { label: 'Feb 24', impressions: 5200, ctr: 2.1 },
      { label: 'Mar 3', impressions: 5800, ctr: 2.3 },
      { label: 'Mar 10', impressions: 6100, ctr: 2.2 },
      { label: 'Mar 17', impressions: 5900, ctr: 2.4 },
      { label: 'Mar 24', impressions: 6800, ctr: 2.6 },
      { label: 'Mar 31', impressions: 7200, ctr: 2.8 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Ziad Mourad',
        email: 'ziad@bayt.com',
        role: 'Owner',
        status: 'active',
        lastLogin: '2026-04-05',
      },
    ],
    widgets: [
      {
        id: 'w1',
        name: 'Job Stories',
        platform: 'Web',
        sdkToken: 'hk_live_bay_web_01',
        storiesCount: 5,
        status: 'active',
      },
    ],
    creditHistory: [],
    auditLog: [
      {
        id: 'a1',
        date: '2026-04-03',
        action: 'Invoice #INV-2026-04 paid ($299)',
        actor: 'System',
        iconType: 'payment',
      },
      {
        id: 'a2',
        date: '2025-03-03',
        action: 'Account registered — Starter plan',
        actor: 'System',
        iconType: 'upgrade',
      },
    ],
    notes: [],
  },
  {
    id: 'c8',
    name: 'Mumzworld',
    domain: 'mumzworld.com',
    email: 'digital@mumzworld.com',
    phone: '+971 4 227 4444',
    address: 'Dubai, UAE',
    industry: 'Baby & Kids Retail',
    country: 'AE',
    countryName: 'UAE',
    countryFlag: '🇦🇪',
    plan: 'Business',
    status: 'active',
    mrrCents: 149900,
    creditsUsed: 7400,
    creditsTotal: 20000,
    billingCycle: 'Annual',
    nextRenewal: '2026-09-01',
    paymentLastFour: '2345',
    registeredAt: '2024-09-01',
    lastLoginAt: '2026-04-06',
    tags: ['Retail', 'Family', 'UAE'],
    customerFit: 'High',
    accountOwner: 'Ahmed Khalid',
    lastPayment: { date: '2025-09-01', amountCents: 149900 },
    impressionData: [
      { label: 'Feb 24', impressions: 38000, ctr: 3.5 },
      { label: 'Mar 3', impressions: 42000, ctr: 3.7 },
      { label: 'Mar 10', impressions: 45000, ctr: 3.9 },
      { label: 'Mar 17', impressions: 48000, ctr: 4.1 },
      { label: 'Mar 24', impressions: 52000, ctr: 4.3 },
      { label: 'Mar 31', impressions: 58000, ctr: 4.6 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Hana Aziz',
        email: 'hana@mumzworld.com',
        role: 'Owner',
        status: 'active',
        lastLogin: '2026-04-06',
      },
      {
        id: 'u2',
        name: 'Mona Farouk',
        email: 'mona@mumzworld.com',
        role: 'Admin',
        status: 'active',
        lastLogin: '2026-04-04',
      },
    ],
    widgets: [
      {
        id: 'w1',
        name: 'Product Stories',
        platform: 'Web',
        sdkToken: 'hk_live_mum_web_01',
        storiesCount: 20,
        status: 'active',
      },
      {
        id: 'w2',
        name: 'App Onboarding',
        platform: 'React Native',
        sdkToken: 'hk_live_mum_rn_02',
        storiesCount: 6,
        status: 'active',
      },
    ],
    creditHistory: [],
    auditLog: [
      {
        id: 'a1',
        date: '2025-09-01',
        action: 'Annual subscription renewed — Business plan',
        actor: 'System',
        iconType: 'payment',
      },
      {
        id: 'a2',
        date: '2024-09-01',
        action: 'Account registered — Business plan',
        actor: 'System',
        iconType: 'upgrade',
      },
    ],
    notes: [],
  },
  {
    id: 'c9',
    name: 'STC Pay',
    domain: 'stcpay.com.sa',
    email: 'tech@stcpay.com.sa',
    phone: '+966 920 000 202',
    address: 'Riyadh, Saudi Arabia',
    industry: 'FinTech',
    country: 'SA',
    countryName: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    plan: 'Enterprise',
    status: 'active',
    mrrCents: 299900,
    creditsUsed: 22000,
    creditsTotal: 50000,
    billingCycle: 'Annual',
    nextRenewal: '2026-10-15',
    paymentLastFour: '6789',
    registeredAt: '2023-10-15',
    lastLoginAt: '2026-04-08',
    tags: ['Enterprise', 'FinTech', 'Saudi Arabia'],
    customerFit: 'High',
    accountOwner: 'Sarah Al-Rashidi',
    lastPayment: { date: '2025-10-15', amountCents: 299900 },
    impressionData: [
      { label: 'Feb 24', impressions: 115000, ctr: 4.8 },
      { label: 'Mar 3', impressions: 128000, ctr: 5.0 },
      { label: 'Mar 10', impressions: 135000, ctr: 5.2 },
      { label: 'Mar 17', impressions: 142000, ctr: 5.4 },
      { label: 'Mar 24', impressions: 155000, ctr: 5.7 },
      { label: 'Mar 31', impressions: 168000, ctr: 5.9 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Waleed Al-Ghamdi',
        email: 'waleed@stcpay.com.sa',
        role: 'Owner',
        status: 'active',
        lastLogin: '2026-04-08',
      },
      {
        id: 'u2',
        name: 'Fatima Al-Qahtani',
        email: 'fatima@stcpay.com.sa',
        role: 'Admin',
        status: 'active',
        lastLogin: '2026-04-07',
      },
      {
        id: 'u3',
        name: 'Ibrahim Saud',
        email: 'ibrahim@stcpay.com.sa',
        role: 'Member',
        status: 'active',
        lastLogin: '2026-04-06',
      },
    ],
    widgets: [
      {
        id: 'w1',
        name: 'Onboarding Flow',
        platform: 'iOS',
        sdkToken: 'hk_live_stc_ios_01',
        storiesCount: 10,
        status: 'active',
      },
      {
        id: 'w2',
        name: 'Feature Highlights',
        platform: 'Android',
        sdkToken: 'hk_live_stc_and_02',
        storiesCount: 10,
        status: 'active',
      },
      {
        id: 'w3',
        name: 'Web Portal Stories',
        platform: 'Web',
        sdkToken: 'hk_live_stc_web_03',
        storiesCount: 7,
        status: 'active',
      },
    ],
    creditHistory: [],
    auditLog: [
      {
        id: 'a1',
        date: '2025-10-15',
        action: 'Annual subscription renewed — Enterprise plan',
        actor: 'System',
        iconType: 'payment',
      },
      {
        id: 'a2',
        date: '2026-02-12',
        action: 'New user ibrahim@stcpay.com.sa added as Member',
        actor: 'Waleed Al-Ghamdi',
        iconType: 'user',
      },
      {
        id: 'a3',
        date: '2023-10-15',
        action: 'Account registered — Enterprise plan',
        actor: 'System',
        iconType: 'upgrade',
      },
    ],
    notes: [],
  },
  {
    id: 'c10',
    name: 'Vodafone Qatar',
    domain: 'vodafone.qa',
    email: 'digital@vodafone.qa',
    phone: '+974 44 500 500',
    address: 'Doha, Qatar',
    industry: 'Telecom',
    country: 'QA',
    countryName: 'Qatar',
    countryFlag: '🇶🇦',
    plan: 'Business',
    status: 'churned',
    mrrCents: 0,
    creditsUsed: 0,
    creditsTotal: 20000,
    billingCycle: 'Annual',
    nextRenewal: '',
    paymentLastFour: '0000',
    registeredAt: '2024-02-01',
    lastLoginAt: '2025-12-10',
    tags: ['Churned', 'Telecom', 'Qatar'],
    customerFit: 'Low',
    accountOwner: 'Ahmed Khalid',
    lastPayment: null,
    impressionData: [
      { label: 'Feb 24', impressions: 8200, ctr: 1.8 },
      { label: 'Mar 3', impressions: 4100, ctr: 1.2 },
      { label: 'Mar 10', impressions: 1500, ctr: 0.6 },
      { label: 'Mar 17', impressions: 200, ctr: 0.1 },
      { label: 'Mar 24', impressions: 0, ctr: 0 },
      { label: 'Mar 31', impressions: 0, ctr: 0 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Saeed Al-Kuwari',
        email: 'saeed@vodafone.qa',
        role: 'Owner',
        status: 'inactive',
        lastLogin: '2025-12-10',
      },
    ],
    widgets: [],
    creditHistory: [],
    auditLog: [
      {
        id: 'a1',
        date: '2026-01-01',
        action: 'Account churned — subscription cancelled',
        actor: 'System',
        iconType: 'suspend',
      },
    ],
    notes: [
      {
        id: 'n1',
        content: 'Customer churned citing budget constraints. May revisit in H2 2026.',
        author: 'CS Team',
        date: '2026-01-05',
      },
    ],
  },
  {
    id: 'c11',
    name: 'Al Tayer Group',
    domain: 'altayer.com',
    email: 'ecom@altayer.com',
    phone: '+971 4 339 9000',
    address: 'Dubai, UAE',
    industry: 'Luxury Retail',
    country: 'AE',
    countryName: 'UAE',
    countryFlag: '🇦🇪',
    plan: 'Pro',
    status: 'trial',
    mrrCents: 0,
    creditsUsed: 200,
    creditsTotal: 2000,
    billingCycle: 'Monthly',
    nextRenewal: '2026-04-18',
    paymentLastFour: '',
    registeredAt: '2026-04-04',
    lastLoginAt: '2026-04-08',
    tags: ['Trial', 'Luxury', 'UAE'],
    customerFit: 'Medium',
    accountOwner: 'Sarah Al-Rashidi',
    lastPayment: null,
    impressionData: [
      { label: 'Feb 24', impressions: 0, ctr: 0 },
      { label: 'Mar 3', impressions: 0, ctr: 0 },
      { label: 'Mar 10', impressions: 0, ctr: 0 },
      { label: 'Mar 17', impressions: 0, ctr: 0 },
      { label: 'Mar 24', impressions: 0, ctr: 0 },
      { label: 'Mar 31', impressions: 1200, ctr: 1.8 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Leila Mansouri',
        email: 'leila@altayer.com',
        role: 'Owner',
        status: 'active',
        lastLogin: '2026-04-08',
      },
    ],
    widgets: [
      {
        id: 'w1',
        name: 'Luxury Stories',
        platform: 'Web',
        sdkToken: 'hk_trial_alt_web_01',
        storiesCount: 2,
        status: 'active',
      },
    ],
    creditHistory: [],
    auditLog: [
      {
        id: 'a1',
        date: '2026-04-04',
        action: 'Trial started — Pro plan (14 days)',
        actor: 'System',
        iconType: 'upgrade',
      },
    ],
    notes: [],
  },
  {
    id: 'c12',
    name: 'Xceed',
    domain: 'xceed.sa',
    email: 'hello@xceed.sa',
    phone: '+966 13 888 9999',
    address: 'Dammam, Saudi Arabia',
    industry: 'Events',
    country: 'SA',
    countryName: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    plan: 'Starter',
    status: 'active',
    mrrCents: 29900,
    creditsUsed: 1100,
    creditsTotal: 3000,
    billingCycle: 'Monthly',
    nextRenewal: '2026-05-07',
    paymentLastFour: '1111',
    registeredAt: '2025-05-07',
    lastLoginAt: '2026-04-03',
    tags: ['Events', 'Saudi Arabia'],
    customerFit: 'Low',
    accountOwner: 'Ahmed Khalid',
    lastPayment: { date: '2026-04-07', amountCents: 29900 },
    impressionData: [
      { label: 'Feb 24', impressions: 6800, ctr: 2.4 },
      { label: 'Mar 3', impressions: 7200, ctr: 2.6 },
      { label: 'Mar 10', impressions: 7500, ctr: 2.5 },
      { label: 'Mar 17', impressions: 8100, ctr: 2.8 },
      { label: 'Mar 24', impressions: 8800, ctr: 3.0 },
      { label: 'Mar 31', impressions: 9500, ctr: 3.2 },
    ],
    users: [
      {
        id: 'u1',
        name: 'Yousef Al-Dossary',
        email: 'yousef@xceed.sa',
        role: 'Owner',
        status: 'active',
        lastLogin: '2026-04-03',
      },
    ],
    widgets: [
      {
        id: 'w1',
        name: 'Event Stories',
        platform: 'Web',
        sdkToken: 'hk_live_xce_web_01',
        storiesCount: 7,
        status: 'active',
      },
    ],
    creditHistory: [],
    auditLog: [
      {
        id: 'a1',
        date: '2026-04-07',
        action: 'Invoice #INV-2026-04 paid ($299)',
        actor: 'System',
        iconType: 'payment',
      },
      {
        id: 'a2',
        date: '2025-05-07',
        action: 'Account registered — Starter plan',
        actor: 'System',
        iconType: 'upgrade',
      },
    ],
    notes: [],
  },
];
