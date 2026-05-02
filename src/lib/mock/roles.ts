export type Permission = {
  id: string;
  module: string;
  label: string;
};

export type BaseRole = {
  id: string;
  name: string;
  description: string;
  icon: string;
  isBase: true;
  permissions: string[];
  memberCount: number;
};

export type CustomRole = {
  id: string;
  name: string;
  description: string;
  initials: string;
  isBase: false;
  parentRoleId: string;
  permissions: string[];
  createdAt: string;
  memberCount: number;
};

export type Role = BaseRole | CustomRole;

// ─── Permissions ──────────────────────────────────────────────────────────────

export const PERMISSIONS: Permission[] = [
  // Customers
  { id: 'customers.view', module: 'Customers', label: 'View customers' },
  { id: 'customers.create', module: 'Customers', label: 'Create customers' },
  { id: 'customers.edit', module: 'Customers', label: 'Edit customers' },
  { id: 'customers.delete', module: 'Customers', label: 'Delete customers' },
  { id: 'customers.suspend', module: 'Customers', label: 'Suspend accounts' },
  { id: 'customers.impersonate', module: 'Customers', label: 'Impersonate users' },
  // Billing
  { id: 'billing.view', module: 'Billing', label: 'View invoices' },
  { id: 'billing.refund', module: 'Billing', label: 'Issue refunds' },
  { id: 'billing.edit_plans', module: 'Billing', label: 'Edit plans & pricing' },
  { id: 'billing.export', module: 'Billing', label: 'Export billing data' },
  // Support
  { id: 'support.view', module: 'Support', label: 'View tickets' },
  { id: 'support.reply', module: 'Support', label: 'Reply to tickets' },
  { id: 'support.assign', module: 'Support', label: 'Assign tickets' },
  { id: 'support.close', module: 'Support', label: 'Close tickets' },
  // Team
  { id: 'team.view', module: 'Team', label: 'View team members' },
  { id: 'team.invite', module: 'Team', label: 'Invite members' },
  { id: 'team.edit_roles', module: 'Team', label: 'Edit member roles' },
  { id: 'team.remove', module: 'Team', label: 'Remove members' },
  // AI Credits
  { id: 'ai.view', module: 'AI Credits', label: 'View AI usage' },
  { id: 'ai.add_credits', module: 'AI Credits', label: 'Add credits manually' },
  { id: 'ai.set_limits', module: 'AI Credits', label: 'Set credit limits' },
  // Content
  { id: 'content.view', module: 'Content', label: 'View templates' },
  { id: 'content.create', module: 'Content', label: 'Create templates' },
  { id: 'content.publish', module: 'Content', label: 'Publish templates' },
  { id: 'content.delete', module: 'Content', label: 'Delete templates' },
  // System
  { id: 'system.feature_flags', module: 'System', label: 'Manage feature flags' },
  { id: 'system.api_keys', module: 'System', label: 'Manage API keys' },
  { id: 'system.audit_log', module: 'System', label: 'View audit log' },
  { id: 'system.webhooks', module: 'System', label: 'Manage webhooks' },
];

export const ALL_PERMISSION_IDS = PERMISSIONS.map((p) => p.id);

// ─── Base Roles (3) ───────────────────────────────────────────────────────────

export const BASE_ROLES: BaseRole[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Full system access',
    icon: 'ShieldCheck',
    isBase: true,
    permissions: ALL_PERMISSION_IDS,
    memberCount: 2,
  },
  {
    id: 'ops-manager',
    name: 'Ops Manager',
    description: 'Customer & subscription management',
    icon: 'Settings2',
    isBase: true,
    permissions: [
      'customers.view',
      'customers.create',
      'customers.edit',
      'customers.delete',
      'customers.suspend',
      'customers.impersonate',
      'billing.view',
      'billing.export',
      'ai.view',
      'ai.add_credits',
      'ai.set_limits',
      'team.view',
      'team.invite',
    ],
    memberCount: 4,
  },
  {
    id: 'support',
    name: 'Support Agent',
    description: 'Customer support & tickets',
    icon: 'Headphones',
    isBase: true,
    permissions: [
      'support.view',
      'support.reply',
      'support.assign',
      'support.close',
      'customers.view',
      'ai.view',
    ],
    memberCount: 6,
  },
];

// ─── Custom Roles ─────────────────────────────────────────────────────────────

export const CUSTOM_ROLES: CustomRole[] = [
  {
    id: 'custom-1',
    name: 'Regional Manager',
    description: 'Manages Gulf region accounts',
    initials: 'RM',
    isBase: false,
    parentRoleId: 'ops-manager',
    permissions: ['customers.view', 'customers.edit', 'billing.view', 'support.view'],
    createdAt: '2026-01-15',
    memberCount: 2,
  },
  {
    id: 'custom-2',
    name: 'Finance Lead',
    description: 'Senior finance oversight',
    initials: 'FL',
    isBase: false,
    parentRoleId: 'ops-manager',
    permissions: ['billing.view', 'billing.refund', 'billing.export', 'customers.view'],
    createdAt: '2026-02-01',
    memberCount: 1,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getModules(): string[] {
  return Array.from(new Set(PERMISSIONS.map((p) => p.module)));
}

export function getPermissionsByModule(module: string): Permission[] {
  return PERMISSIONS.filter((p) => p.module === module);
}

export function getParentRoleName(parentRoleId: string): string {
  return BASE_ROLES.find((r) => r.id === parentRoleId)?.name ?? parentRoleId;
}

export function generateInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
