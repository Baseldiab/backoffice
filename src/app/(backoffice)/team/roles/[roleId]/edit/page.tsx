'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PermissionModuleAccordion } from '@/components/team/permissions-accordion';
import { useRolesStore } from '@/lib/roles-store';
import {
  BASE_ROLES,
  getModules,
  getPermissionsByModule,
  getParentRoleName,
} from '@/lib/mock/roles';

export default function EditRolePage() {
  const params = useParams();
  const roleId = params.roleId as string;
  const router = useRouter();
  const { customRoles, baseRolePermissions, updateBaseRolePermissions, updateCustomRole } =
    useRolesStore();

  const baseRole = BASE_ROLES.find((r) => r.id === roleId);
  const customRole = customRoles.find((r) => r.id === roleId);
  const isBase = !!baseRole;

  // Redirect if role not found
  useEffect(() => {
    if (!baseRole && !customRole) router.push('/team/roles');
  }, [baseRole, customRole, router]);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentRoleId, setParentRoleId] = useState('ops-manager');
  const [permissions, setPermissions] = useState<string[]>([]);

  // Populate from role
  useEffect(() => {
    if (baseRole) {
      setName(baseRole.name);
      setDescription(baseRole.description);
      setPermissions(baseRolePermissions[baseRole.id] ?? [...baseRole.permissions]);
    } else if (customRole) {
      setName(customRole.name);
      setDescription(customRole.description);
      setParentRoleId(customRole.parentRoleId);
      setPermissions([...customRole.permissions]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId]);

  function handleParentChange(id: string) {
    setParentRoleId(id);
    const parent = BASE_ROLES.find((r) => r.id === id);
    setPermissions(parent ? [...parent.permissions] : []);
  }

  function togglePermission(id: string) {
    setPermissions((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function toggleAllInModule(module: string, checked: boolean) {
    const ids = getPermissionsByModule(module).map((p) => p.id);
    setPermissions((prev) => {
      if (checked) return Array.from(new Set([...prev, ...ids]));
      return prev.filter((p) => !ids.includes(p));
    });
  }

  function handleSave() {
    if (!name.trim()) return;
    if (baseRole) {
      updateBaseRolePermissions(baseRole.id, permissions);
      toast.success(`Permissions updated for "${baseRole.name}"`);
    } else if (customRole) {
      updateCustomRole(customRole.id, {
        name: name.trim(),
        description: description.trim(),
        parentRoleId,
        permissions,
      });
      toast.success(`Role "${name.trim()}" updated`);
    }
    router.push('/team/roles');
  }

  if (!baseRole && !customRole) return null;

  const roleName = baseRole?.name ?? customRole?.name ?? '';
  const parentName = !isBase ? (BASE_ROLES.find((r) => r.id === parentRoleId)?.name ?? '') : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" className="mt-0.5 h-8 w-8 shrink-0" asChild>
          <Link href="/team/roles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Edit Role: {roleName}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {isBase
              ? 'Base role — name and description are read-only. Permissions are editable.'
              : 'Update this role name, description, and permissions.'}
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="mx-auto max-w-2xl space-y-6 rounded-xl border border-border bg-card p-6">
        {/* Section 1: Role Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Role Details</h3>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="role-name">Role Name</Label>
            {isBase ? (
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2">
                <span className="text-sm text-foreground">{name}</span>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              <Input
                id="role-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Role name"
              />
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="role-desc">Description</Label>
            {isBase ? (
              <div className="flex items-start justify-between gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
                <span className="text-sm text-foreground">{description}</span>
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            ) : (
              <Textarea
                id="role-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="resize-none"
              />
            )}
          </div>

          {/* Parent role (custom only) */}
          {!isBase && (
            <div className="space-y-1.5">
              <Label>Parent Role</Label>
              <Select value={parentRoleId} onValueChange={handleParentChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BASE_ROLES.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Inherits from:{' '}
                <span className="rounded-full bg-muted px-2 py-0.5 text-foreground">
                  {getParentRoleName(parentRoleId)}
                </span>
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Section 2: Permissions */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-foreground">Configure Permissions</h3>
            {!isBase && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Based on {parentName}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {getModules().map((mod) => (
              <PermissionModuleAccordion
                key={mod}
                module={mod}
                selected={permissions}
                onToggle={togglePermission}
                onToggleAll={toggleAllInModule}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto max-w-2xl border-t border-border pt-4 pb-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/team/roles">Cancel</Link>
          </Button>
          <Button
            disabled={!isBase && !name.trim()}
            className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
