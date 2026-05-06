'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Headphones, Pencil, Plus, Settings2, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useRolesStore } from '@/lib/roles-store';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BASE_ROLES, type BaseRole, type CustomRole, getParentRoleName } from '@/lib/mock/roles';

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
