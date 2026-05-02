'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ActivitySquare,
  ArrowLeft,
  Headphones,
  Pencil,
  Plus,
  Settings2,
  ShieldCheck,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useRolesStore } from '@/lib/roles-store';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { BASE_ROLES, type BaseRole, type CustomRole, getParentRoleName } from '@/lib/mock/roles';
import { cn } from '@/lib/utils';

// ─── Roles activity data ─────────────────────────────────────────────────────

const ROLES_ACTIVITIES = [
  {
    id: 'ra-1',
    type: 'created' as const,
    description: 'Nadia Khalil created the "Content Manager" custom role',
    actor: 'Nadia Khalil',
    time: '1 day ago',
  },
  {
    id: 'ra-2',
    type: 'edited' as const,
    description: 'Saad Al-Rashid updated permissions for "Support Agent" role — added billing.view',
    actor: 'Saad Al-Rashid',
    time: '2 days ago',
  },
  {
    id: 'ra-3',
    type: 'assigned' as const,
    description: 'Nadia Khalil assigned Khalid Al-Otaibi to the "Content Manager" role',
    actor: 'Nadia Khalil',
    time: '3 days ago',
  },
  {
    id: 'ra-4',
    type: 'deleted' as const,
    description: 'Saad Al-Rashid deleted "Temporary Access" role — 2 members moved to Viewer',
    actor: 'Saad Al-Rashid',
    time: '4 days ago',
  },
  {
    id: 'ra-5',
    type: 'edited' as const,
    description: 'Nadia Khalil updated permissions for "Admin" role — added team.manage',
    actor: 'Nadia Khalil',
    time: '5 days ago',
  },
  {
    id: 'ra-6',
    type: 'assigned' as const,
    description: 'Saad Al-Rashid assigned Lina Al-Harbi to the "Editor" role',
    actor: 'Saad Al-Rashid',
    time: '6 days ago',
  },
  {
    id: 'ra-7',
    type: 'created' as const,
    description: 'Saad Al-Rashid created the "Support Agent" custom role',
    actor: 'Saad Al-Rashid',
    time: '7 days ago',
  },
  {
    id: 'ra-8',
    type: 'edited' as const,
    description: 'Nadia Khalil updated permissions for "Editor" role — removed settings.manage',
    actor: 'Nadia Khalil',
    time: '8 days ago',
  },
];

const ROLES_ACTIVITY_ICON_MAP = {
  created: { Icon: Plus, color: 'text-[#3ECF8E]' },
  edited: { Icon: Pencil, color: 'text-blue-400' },
  assigned: { Icon: UserCheck, color: 'text-purple-400' },
  deleted: { Icon: Trash2, color: 'text-destructive' },
} as const;

// ─── Icon map ─────────────────────────────────────────────────────────────────

function RoleIcon({ name, className }: { name: string; className?: string }) {
  if (name === 'Settings2') return <Settings2 className={className} />;
  if (name === 'Headphones') return <Headphones className={className} />;
  return <ShieldCheck className={className} />;
}

// ─── Base role card ───────────────────────────────────────────────────────────

function BaseRoleCard({ role }: { role: BaseRole }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      {/* Row 1: icon + name + badge */}
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-2">
          <RoleIcon name={role.icon} className="h-7 w-7 text-[#3ECF8E]" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{role.name}</p>
            <Badge variant="secondary">Base</Badge>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{role.description}</p>
        </div>
      </div>

      {/* Row 3: placeholder (keeps same height as custom card's inherits-from row) */}
      <div className="h-5" />

      {/* Row 4: counts */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{role.memberCount} members</span>
        <span className="text-border">·</span>
        <span>{role.permissions.length} permissions</span>
      </div>

      <Separator />

      {/* Row 6: actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
          <Link href={`/team/roles/${role.id}/edit`}>
            <Pencil className="mr-1.5 h-3 w-3" />
            Edit Permissions
          </Link>
        </Button>
        <div className="h-7 w-16" />
      </div>
    </div>
  );
}

// ─── Custom role card ─────────────────────────────────────────────────────────

function CustomRoleCard({
  role,
  onDelete,
}: {
  role: CustomRole;
  onDelete: (role: CustomRole) => void;
}) {
  return (
    <div className="relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:rounded-l-xl before:bg-[#3ECF8E]/60">
      {/* Row 1: initials + name + badge */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground">
          {role.initials}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{role.name}</p>
            <Badge variant="outline" className="border-primary text-primary">
              Custom
            </Badge>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{role.description}</p>
        </div>
      </div>

      {/* Row 3: inherits from */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Inherits from:</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {getParentRoleName(role.parentRoleId)}
        </span>
      </div>

      {/* Row 4: counts */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{role.memberCount} members</span>
        <span className="text-border">·</span>
        <span>{role.permissions.length} permissions</span>
      </div>

      <Separator />

      {/* Row 6: actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
          <Link href={`/team/roles/${role.id}/edit`}>
            <Pencil className="mr-1.5 h-3 w-3" />
            Edit Permissions
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(role)}
        >
          <Trash2 className="mr-1.5 h-3 w-3" />
          Delete
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RolesPage() {
  const { customRoles, baseRolePermissions, deleteCustomRole } = useRolesStore();
  const [deleteTarget, setDeleteTarget] = useState<CustomRole | null>(null);
  const [activityLogOpen, setActivityLogOpen] = useState(false);

  const mergedBaseRoles = useMemo(
    () =>
      BASE_ROLES.map((r) => ({
        ...r,
        permissions: baseRolePermissions[r.id] ?? r.permissions,
      })),
    [baseRolePermissions],
  );

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    deleteCustomRole(deleteTarget.id);
    toast.success(`Role "${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" className="mt-0.5 h-8 w-8 shrink-0" asChild>
            <Link href="/team">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Roles &amp; Permissions</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Define access levels for your team members
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs font-medium"
            onClick={() => setActivityLogOpen(true)}
          >
            <ActivitySquare className="h-3.5 w-3.5" />
            Activity Log
          </Button>
          <Button
            className="shrink-0 bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90 gap-1.5 text-xs font-medium"
            size="sm"
            asChild
          >
            <Link href="/team/roles/new">
              <Plus className="h-3.5 w-3.5" />
              Create Role
            </Link>
          </Button>
        </div>
      </div>

      {/* Roles grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mergedBaseRoles.map((role) => (
          <BaseRoleCard key={role.id} role={role as BaseRole} />
        ))}
        {customRoles.map((role) => (
          <CustomRoleCard key={role.id} role={role} onDelete={setDeleteTarget} />
        ))}
      </div>

      {/* Activity Log Sheet */}
      <Sheet open={activityLogOpen} onOpenChange={setActivityLogOpen}>
        <SheetContent className="w-96 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Activity Log</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-0">
            {ROLES_ACTIVITIES.map((a) => {
              const { Icon, color } = ROLES_ACTIVITY_ICON_MAP[a.type];
              return (
                <div
                  key={a.id}
                  className="flex gap-3 px-1 py-3 border-b border-border/50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Icon className={cn('h-4 w-4', color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{a.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {a.actor} · {a.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name ?? ''}"`}
        description={
          deleteTarget
            ? `${deleteTarget.memberCount} ${deleteTarget.memberCount === 1 ? 'member' : 'members'} will be moved to ${getParentRoleName(deleteTarget.parentRoleId)}.`
            : ''
        }
        confirmLabel="Delete & Move Members"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
