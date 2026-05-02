'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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
  generateInitials,
  getModules,
  getPermissionsByModule,
  type CustomRole,
} from '@/lib/mock/roles';

export default function NewRolePage() {
  const router = useRouter();
  const { addCustomRole } = useRolesStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentRoleId, setParentRoleId] = useState('ops-manager');
  const [permissions, setPermissions] = useState<string[]>([]);

  // Pre-fill permissions from default parent
  useEffect(() => {
    const parent = BASE_ROLES.find((r) => r.id === 'ops-manager');
    if (parent) setPermissions([...parent.permissions]);
  }, []);

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

  function handleSubmit() {
    if (!name.trim()) return;
    const newRole: CustomRole = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      initials: generateInitials(name),
      isBase: false,
      parentRoleId,
      permissions,
      createdAt: new Date().toISOString().split('T')[0],
      memberCount: 0,
    };
    addCustomRole(newRole);
    toast.success(`Role "${newRole.name}" created`);
    router.push('/team/roles');
  }

  const parentName = BASE_ROLES.find((r) => r.id === parentRoleId)?.name ?? '';

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
          <h2 className="text-lg font-semibold text-foreground">Create New Role</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Define a custom role with specific permissions
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="mx-auto max-w-2xl space-y-6 rounded-xl border border-border bg-card p-6">
        {/* Section 1: Role Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Role Details</h3>

          <div className="space-y-1.5">
            <Label htmlFor="role-name">Role Name *</Label>
            <Input
              id="role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Regional Manager"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role-desc">Description</Label>
            <Textarea
              id="role-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this role's responsibilities"
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Parent Role *</Label>
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
              Members inherit base permissions. If this role is deleted, members revert to parent
              role.
            </p>
          </div>
        </div>

        <Separator />

        {/* Section 2: Permissions */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-foreground">Configure Permissions</h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Based on {parentName}
            </span>
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
            disabled={!name.trim()}
            className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
            onClick={handleSubmit}
          >
            Create Role
          </Button>
        </div>
      </div>
    </div>
  );
}
