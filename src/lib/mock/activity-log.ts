export type ActivityModule =
  | 'customer'
  | 'deal'
  | 'plan'
  | 'discount'
  | 'template'
  | 'team'
  | 'role'
  | 'billing'
  | 'feature-flag'
  | 'api-key'
  | 'settings';

export type ActivityAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'archived'
  | 'restored'
  | 'activated'
  | 'deactivated'
  | 'assigned'
  | 'moved'
  | 'exported'
  | 'invited'
  | 'removed'
  | 'published'
  | 'duplicated';

export interface ActivityChange {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

export interface ActivityLog {
  id: string;
  module: ActivityModule;
  action: ActivityAction;
  entityId: string;
  entityName: string;
  description: string;
  actor: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  changes: ActivityChange[];
  metadata?: Record<string, string>;
  timestamp: string;
}

const actors = {
  admin: {
    id: 'u-1',
    name: 'Faisal Al-Harbi',
    email: 'faisal@hikayat.io',
  },
  sarah: {
    id: 'u-2',
    name: 'Sarah Al-Mutairi',
    email: 'sarah@hikayat.io',
  },
  omar: {
    id: 'u-3',
    name: 'Omar Al-Dosari',
    email: 'omar@hikayat.io',
  },
  noura: {
    id: 'u-4',
    name: 'Noura Al-Qahtani',
    email: 'noura@hikayat.io',
  },
  system: {
    id: 'system',
    name: 'System',
    email: 'system@hikayat.io',
  },
};

export const MOCK_ACTIVITY_LOG: ActivityLog[] = [
  // Today
  {
    id: 'act-1',
    module: 'deal',
    action: 'moved',
    entityId: 'deal-5',
    entityName: 'Noon Commerce',
    description: 'Moved deal to "Won" stage',
    actor: actors.sarah,
    changes: [
      { field: 'Stage', oldValue: 'Negotiation', newValue: 'Won' },
      { field: 'Closed Date', oldValue: null, newValue: '2026-05-04' },
    ],
    timestamp: '2026-05-04T14:32:00Z',
  },
  {
    id: 'act-2',
    module: 'customer',
    action: 'updated',
    entityId: 'cust-12',
    entityName: 'Jarir Bookstore',
    description: 'Updated company information',
    actor: actors.omar,
    changes: [
      { field: 'Industry', oldValue: 'Retail', newValue: 'E-Commerce' },
      { field: 'Employee Count', oldValue: '500-1000', newValue: '1000-5000' },
    ],
    timestamp: '2026-05-04T13:15:00Z',
  },
  {
    id: 'act-3',
    module: 'template',
    action: 'published',
    entityId: 'tpl-7',
    entityName: 'Renewal Reminder Email',
    description: 'Published template to active',
    actor: actors.noura,
    changes: [{ field: 'Status', oldValue: 'Draft', newValue: 'Active' }],
    timestamp: '2026-05-04T12:45:00Z',
  },
  {
    id: 'act-4',
    module: 'discount',
    action: 'created',
    entityId: 'disc-8',
    entityName: 'Summer 2026 Promo',
    description: 'Created new discount code',
    actor: actors.admin,
    changes: [
      { field: 'Code', oldValue: null, newValue: 'SUMMER2026' },
      { field: 'Discount', oldValue: null, newValue: '25%' },
      { field: 'Valid Until', oldValue: null, newValue: '2026-08-31' },
    ],
    timestamp: '2026-05-04T11:20:00Z',
  },
  {
    id: 'act-5',
    module: 'team',
    action: 'invited',
    entityId: 'u-5',
    entityName: 'Khalid Al-Rashid',
    description: 'Invited new team member',
    actor: actors.admin,
    changes: [
      { field: 'Email', oldValue: null, newValue: 'khalid@hikayat.io' },
      { field: 'Role', oldValue: null, newValue: 'Sales Manager' },
    ],
    timestamp: '2026-05-04T10:05:00Z',
  },
  {
    id: 'act-6',
    module: 'plan',
    action: 'updated',
    entityId: 'plan-2',
    entityName: 'Pro Plan',
    description: 'Updated plan pricing',
    actor: actors.admin,
    changes: [
      { field: 'Monthly Price', oldValue: 'SAR 1,299', newValue: 'SAR 1,499' },
      { field: 'Annual Price', oldValue: 'SAR 12,990', newValue: 'SAR 14,990' },
    ],
    timestamp: '2026-05-04T09:30:00Z',
  },
  // Yesterday
  {
    id: 'act-7',
    module: 'deal',
    action: 'created',
    entityId: 'deal-18',
    entityName: 'STC Solutions',
    description: 'Created new deal',
    actor: actors.sarah,
    changes: [
      { field: 'Value', oldValue: null, newValue: 'SAR 45,000' },
      { field: 'Stage', oldValue: null, newValue: 'Discovery' },
      { field: 'Expected Close', oldValue: null, newValue: '2026-06-15' },
    ],
    timestamp: '2026-05-03T16:45:00Z',
  },
  {
    id: 'act-8',
    module: 'feature-flag',
    action: 'activated',
    entityId: 'ff-3',
    entityName: 'whatsapp-integration',
    description: 'Enabled feature flag',
    actor: actors.admin,
    changes: [{ field: 'Enabled', oldValue: 'false', newValue: 'true' }],
    timestamp: '2026-05-03T15:30:00Z',
  },
  {
    id: 'act-9',
    module: 'customer',
    action: 'created',
    entityId: 'cust-15',
    entityName: 'Tamimi Markets',
    description: 'Added new customer',
    actor: actors.omar,
    changes: [
      { field: 'Company', oldValue: null, newValue: 'Tamimi Markets' },
      { field: 'Industry', oldValue: null, newValue: 'Retail' },
      { field: 'Contact', oldValue: null, newValue: 'Mohammed Al-Tamimi' },
    ],
    timestamp: '2026-05-03T14:20:00Z',
  },
  {
    id: 'act-10',
    module: 'template',
    action: 'updated',
    entityId: 'tpl-1',
    entityName: 'Introduction Email',
    description: 'Updated email body content',
    actor: actors.noura,
    changes: [
      {
        field: 'Subject',
        oldValue: 'Introducing Highlit — Stories for {{company_name}}',
        newValue: 'Introducing Highlit — In-App Stories for {{company_name}}',
      },
    ],
    timestamp: '2026-05-03T11:10:00Z',
  },
  {
    id: 'act-11',
    module: 'role',
    action: 'updated',
    entityId: 'role-3',
    entityName: 'Sales Manager',
    description: 'Updated role permissions',
    actor: actors.admin,
    changes: [
      { field: 'Permissions Added', oldValue: null, newValue: 'billing.view, billing.export' },
      { field: 'Permissions Removed', oldValue: 'settings.manage', newValue: null },
    ],
    timestamp: '2026-05-03T10:00:00Z',
  },
  {
    id: 'act-12',
    module: 'billing',
    action: 'exported',
    entityId: 'export-5',
    entityName: 'April 2026 Invoices',
    description: 'Exported billing report',
    actor: actors.admin,
    changes: [
      { field: 'Format', oldValue: null, newValue: 'CSV' },
      { field: 'Period', oldValue: null, newValue: 'April 2026' },
      { field: 'Records', oldValue: null, newValue: '147' },
    ],
    timestamp: '2026-05-03T09:15:00Z',
  },
  // May 2
  {
    id: 'act-13',
    module: 'deal',
    action: 'updated',
    entityId: 'deal-12',
    entityName: 'Mobily Enterprise',
    description: 'Updated deal value and notes',
    actor: actors.sarah,
    changes: [
      { field: 'Value', oldValue: 'SAR 30,000', newValue: 'SAR 38,000' },
      {
        field: 'Notes',
        oldValue: 'Initial proposal sent',
        newValue: 'Counter-proposal received, negotiating terms',
      },
    ],
    timestamp: '2026-05-02T17:00:00Z',
  },
  {
    id: 'act-14',
    module: 'discount',
    action: 'deactivated',
    entityId: 'disc-3',
    entityName: 'Ramadan Special',
    description: 'Deactivated expired discount',
    actor: actors.system,
    changes: [{ field: 'Status', oldValue: 'Active', newValue: 'Expired' }],
    timestamp: '2026-05-02T00:00:00Z',
  },
  {
    id: 'act-15',
    module: 'api-key',
    action: 'created',
    entityId: 'key-7',
    entityName: 'Production API Key',
    description: 'Generated new API key',
    actor: actors.admin,
    changes: [
      { field: 'Environment', oldValue: null, newValue: 'Production' },
      { field: 'Permissions', oldValue: null, newValue: 'Read/Write' },
    ],
    timestamp: '2026-05-02T14:30:00Z',
  },
  {
    id: 'act-16',
    module: 'customer',
    action: 'archived',
    entityId: 'cust-8',
    entityName: 'Al-Rajhi Digital',
    description: 'Archived inactive customer',
    actor: actors.omar,
    changes: [{ field: 'Status', oldValue: 'Active', newValue: 'Archived' }],
    timestamp: '2026-05-02T13:45:00Z',
  },
  {
    id: 'act-17',
    module: 'template',
    action: 'duplicated',
    entityId: 'tpl-8',
    entityName: 'Follow-up WhatsApp (Copy)',
    description: 'Duplicated template from Follow-up WhatsApp',
    actor: actors.noura,
    changes: [
      { field: 'Source', oldValue: null, newValue: 'Follow-up WhatsApp (tpl-4)' },
      { field: 'Status', oldValue: null, newValue: 'Draft' },
    ],
    timestamp: '2026-05-02T11:20:00Z',
  },
  {
    id: 'act-18',
    module: 'team',
    action: 'removed',
    entityId: 'u-9',
    entityName: 'Hanan Al-Zahrani',
    description: 'Removed team member',
    actor: actors.admin,
    changes: [
      { field: 'Role', oldValue: 'Support Agent', newValue: null },
      { field: 'Status', oldValue: 'Active', newValue: 'Removed' },
    ],
    timestamp: '2026-05-02T10:15:00Z',
  },
  // May 1
  {
    id: 'act-19',
    module: 'plan',
    action: 'created',
    entityId: 'plan-5',
    entityName: 'Enterprise Plus',
    description: 'Created new subscription plan',
    actor: actors.admin,
    changes: [
      { field: 'Name', oldValue: null, newValue: 'Enterprise Plus' },
      { field: 'Monthly Price', oldValue: null, newValue: 'SAR 4,999' },
      {
        field: 'Features',
        oldValue: null,
        newValue: 'Unlimited stories, Priority support, Custom domain',
      },
    ],
    timestamp: '2026-05-01T16:30:00Z',
  },
  {
    id: 'act-20',
    module: 'deal',
    action: 'moved',
    entityId: 'deal-10',
    entityName: 'Zain KSA',
    description: 'Moved deal to "Proposal" stage',
    actor: actors.sarah,
    changes: [{ field: 'Stage', oldValue: 'Discovery', newValue: 'Proposal' }],
    timestamp: '2026-05-01T15:00:00Z',
  },
  {
    id: 'act-21',
    module: 'settings',
    action: 'updated',
    entityId: 'settings-1',
    entityName: 'Workspace Settings',
    description: 'Updated workspace timezone',
    actor: actors.admin,
    changes: [
      { field: 'Timezone', oldValue: 'UTC', newValue: 'Asia/Riyadh (UTC+3)' },
      { field: 'Date Format', oldValue: 'MM/DD/YYYY', newValue: 'DD/MM/YYYY' },
    ],
    timestamp: '2026-05-01T14:00:00Z',
  },
  {
    id: 'act-22',
    module: 'customer',
    action: 'updated',
    entityId: 'cust-3',
    entityName: 'Almarai Co.',
    description: 'Updated subscription plan',
    actor: actors.omar,
    changes: [
      { field: 'Plan', oldValue: 'Starter', newValue: 'Pro' },
      { field: 'MRR', oldValue: 'SAR 499', newValue: 'SAR 1,499' },
    ],
    timestamp: '2026-05-01T11:30:00Z',
  },
  {
    id: 'act-23',
    module: 'feature-flag',
    action: 'created',
    entityId: 'ff-8',
    entityName: 'advanced-analytics',
    description: 'Created new feature flag',
    actor: actors.admin,
    changes: [
      { field: 'Key', oldValue: null, newValue: 'advanced-analytics' },
      { field: 'Enabled', oldValue: null, newValue: 'false' },
      { field: 'Description', oldValue: null, newValue: 'Enable advanced analytics dashboard' },
    ],
    timestamp: '2026-05-01T10:00:00Z',
  },
  // April 30
  {
    id: 'act-24',
    module: 'discount',
    action: 'updated',
    entityId: 'disc-5',
    entityName: 'Early Bird Discount',
    description: 'Extended discount validity',
    actor: actors.admin,
    changes: [
      { field: 'End Date', oldValue: '2026-04-30', newValue: '2026-05-31' },
      { field: 'Max Usage', oldValue: '100', newValue: '200' },
    ],
    timestamp: '2026-04-30T16:00:00Z',
  },
  {
    id: 'act-25',
    module: 'template',
    action: 'archived',
    entityId: 'tpl-3',
    entityName: 'Payment Link',
    description: 'Archived template',
    actor: actors.noura,
    changes: [{ field: 'Status', oldValue: 'Active', newValue: 'Archived' }],
    timestamp: '2026-04-30T14:30:00Z',
  },
  {
    id: 'act-26',
    module: 'deal',
    action: 'assigned',
    entityId: 'deal-15',
    entityName: 'Salam Telecom',
    description: 'Reassigned deal owner',
    actor: actors.admin,
    changes: [{ field: 'Owner', oldValue: 'Omar Al-Dosari', newValue: 'Sarah Al-Mutairi' }],
    timestamp: '2026-04-30T13:15:00Z',
  },
  {
    id: 'act-27',
    module: 'role',
    action: 'created',
    entityId: 'role-5',
    entityName: 'Marketing Coordinator',
    description: 'Created new role',
    actor: actors.admin,
    changes: [
      { field: 'Name', oldValue: null, newValue: 'Marketing Coordinator' },
      {
        field: 'Permissions',
        oldValue: null,
        newValue: 'templates.manage, discounts.manage, analytics.view',
      },
    ],
    timestamp: '2026-04-30T11:00:00Z',
  },
  {
    id: 'act-28',
    module: 'billing',
    action: 'created',
    entityId: 'inv-234',
    entityName: 'Invoice #INV-2026-234',
    description: 'Generated invoice',
    actor: actors.system,
    changes: [
      { field: 'Customer', oldValue: null, newValue: 'Noon Commerce' },
      { field: 'Amount', oldValue: null, newValue: 'SAR 14,990' },
      { field: 'Due Date', oldValue: null, newValue: '2026-05-15' },
    ],
    timestamp: '2026-04-30T09:00:00Z',
  },
  // April 29
  {
    id: 'act-29',
    module: 'customer',
    action: 'restored',
    entityId: 'cust-6',
    entityName: 'SABIC Digital',
    description: 'Restored archived customer',
    actor: actors.omar,
    changes: [{ field: 'Status', oldValue: 'Archived', newValue: 'Active' }],
    timestamp: '2026-04-29T15:20:00Z',
  },
  {
    id: 'act-30',
    module: 'deal',
    action: 'deleted',
    entityId: 'deal-7',
    entityName: 'Test Deal',
    description: 'Deleted test deal',
    actor: actors.sarah,
    changes: [{ field: 'Reason', oldValue: null, newValue: 'Duplicate entry' }],
    timestamp: '2026-04-29T14:00:00Z',
  },
  {
    id: 'act-31',
    module: 'template',
    action: 'created',
    entityId: 'tpl-6',
    entityName: 'SMS Payment Reminder',
    description: 'Created new SMS template',
    actor: actors.noura,
    changes: [
      { field: 'Channel', oldValue: null, newValue: 'SMS' },
      { field: 'Category', oldValue: null, newValue: 'Billing' },
      { field: 'Language', oldValue: null, newValue: 'Both (EN/AR)' },
    ],
    timestamp: '2026-04-29T11:45:00Z',
  },
  {
    id: 'act-32',
    module: 'api-key',
    action: 'deleted',
    entityId: 'key-3',
    entityName: 'Legacy Staging Key',
    description: 'Revoked deprecated API key',
    actor: actors.admin,
    changes: [
      { field: 'Environment', oldValue: 'Staging', newValue: null },
      { field: 'Reason', oldValue: null, newValue: 'Deprecated — migrated to new key' },
    ],
    timestamp: '2026-04-29T10:30:00Z',
  },
  {
    id: 'act-33',
    module: 'team',
    action: 'updated',
    entityId: 'u-3',
    entityName: 'Omar Al-Dosari',
    description: 'Updated team member role',
    actor: actors.admin,
    changes: [{ field: 'Role', oldValue: 'Sales Rep', newValue: 'Senior Account Executive' }],
    timestamp: '2026-04-29T09:15:00Z',
  },
];
