'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import {
  ActivitySquare,
  CheckCircle2,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Pagination } from '@/components/shared/Pagination';
import { RoleBadge } from '@/components/team/role-badge';
import { EmployeeDrawer } from '@/components/team/employee-drawer';
import { useTeamStore } from '@/lib/team-store';
import { ALL_ROLES, type TeamMember, type TeamRole } from '@/lib/mock/team';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

const TEAM_ACTIVITIES = [
  {
    id: 'ta-1',
    type: 'invited' as const,
    description: 'Nadia Khalil invited Omar Al-Zahrani as Editor',
    actor: 'Nadia Khalil',
    time: '2 hours ago',
  },
  {
    id: 'ta-2',
    type: 'joined' as const,
    description: 'Lina Al-Harbi accepted the invitation and joined the team',
    actor: 'Lina Al-Harbi',
    time: '1 day ago',
  },
  {
    id: 'ta-3',
    type: 'role_changed' as const,
    description: 'Saad Al-Rashid changed role of Khalid Al-Otaibi from Viewer to Editor',
    actor: 'Saad Al-Rashid',
    time: '2 days ago',
  },
  {
    id: 'ta-4',
    type: 'suspended' as const,
    description: 'Abdullah Al-Mutawa was suspended by Nadia Khalil',
    actor: 'Nadia Khalil',
    time: '3 days ago',
  },
  {
    id: 'ta-5',
    type: 'bulk_invite' as const,
    description: 'Saad Al-Rashid sent 5 bulk invitations via CSV upload',
    actor: 'Saad Al-Rashid',
    time: '4 days ago',
  },
  {
    id: 'ta-6',
    type: 'joined' as const,
    description: 'Fatima Al-Sabah accepted the invitation and joined the team',
    actor: 'Fatima Al-Sabah',
    time: '5 days ago',
  },
  {
    id: 'ta-7',
    type: 'role_changed' as const,
    description: 'Nadia Khalil changed role of Mariam Al-Thani from Editor to Admin',
    actor: 'Nadia Khalil',
    time: '6 days ago',
  },
  {
    id: 'ta-8',
    type: 'invited' as const,
    description: 'Saad Al-Rashid invited Bader Al-Kandari as Viewer',
    actor: 'Saad Al-Rashid',
    time: '7 days ago',
  },
  {
    id: 'ta-9',
    type: 'suspended' as const,
    description: 'Hassan Al-Maktoum was suspended by Saad Al-Rashid',
    actor: 'Saad Al-Rashid',
    time: '8 days ago',
  },
  {
    id: 'ta-10',
    type: 'bulk_invite' as const,
    description: 'Nadia Khalil sent 3 bulk invitations via CSV upload',
    actor: 'Nadia Khalil',
    time: '9 days ago',
  },
];

const ACTIVITY_ICON_MAP = {
  invited: { Icon: UserPlus, color: 'text-blue-400' },
  joined: { Icon: UserCheck, color: 'text-[#3ECF8E]' },
  role_changed: { Icon: Shield, color: 'text-purple-400' },
  suspended: { Icon: UserX, color: 'text-destructive' },
  bulk_invite: { Icon: Users, color: 'text-yellow-400' },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(s: string | null) {
  if (!s) return null;
  const d = parseISO(s);
  return isValid(d) ? format(d, 'MMM d, yyyy') : s;
}

function fmtRelative(s: string | null) {
  if (!s) return null;
  const d = parseISO(s);
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : null;
}

function avatarInitials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

// ─── Member card ──────────────────────────────────────────────────────────────

function MemberCard({
  member: m,
  onOpenDrawer,
  onEditRole,
  onResend,
  onSuspend,
  onReactivate,
  onRemove,
}: {
  member: TeamMember;
  onOpenDrawer: (id: string) => void;
  onEditRole: (m: TeamMember) => void;
  onResend: (m: TeamMember) => void;
  onSuspend: (m: TeamMember) => void;
  onReactivate: (m: TeamMember) => void;
  onRemove: (m: TeamMember) => void;
}) {
  const isPending = m.status === 'Pending';
  const isSuspended = m.status === 'Suspended';

  return (
    <div
      onClick={() => onOpenDrawer(m.id)}
      className="group cursor-pointer rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-muted/30"
    >
      {/* Top row: avatar + name + menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-foreground',
              isPending
                ? 'border-2 border-dashed border-border bg-muted opacity-60'
                : 'border border-border bg-muted',
            )}
          >
            {avatarInitials(m.firstName, m.lastName)}
          </div>

          {/* Name + status */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-sm font-medium text-foreground leading-tight">
                {m.firstName} {m.lastName}
              </p>
              {isPending && <StatusBadge status="pending" />}
              {isSuspended && <StatusBadge status="suspended" />}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{m.role}</p>
          </div>
        </div>

        {/* ⋮ menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
              aria-label="Member actions"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => onEditRole(m)}>Edit Role</DropdownMenuItem>
            {isPending && (
              <DropdownMenuItem onClick={() => onResend(m)}>Resend Invitation</DropdownMenuItem>
            )}
            {m.status === 'Active' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onSuspend(m)}
                >
                  Suspend
                </DropdownMenuItem>
              </>
            )}
            {isSuspended && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onReactivate(m)}>
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  Reactivate
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onRemove(m)}
            >
              Remove Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Email */}
      <p className="mt-3 truncate text-xs text-muted-foreground">{m.email}</p>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {isPending
            ? 'Awaiting acceptance'
            : isSuspended
              ? 'Account suspended'
              : fmtRelative(m.lastLogin)
                ? `Active ${fmtRelative(m.lastLogin)}`
                : `Joined ${fmtDate(m.joinedAt)}`}
        </span>
        <RoleBadge role={m.role} />
      </div>
    </div>
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({
  label,
  value,
  accent,
  warning,
}: {
  label: string;
  value: number;
  accent?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5">
      <span
        className={cn(
          'text-base font-bold tabular-nums leading-none',
          accent && 'text-[#3ECF8E]',
          warning && 'text-yellow-400',
          !accent && !warning && 'text-foreground',
        )}
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

// ─── Page (inner — uses useSearchParams) ──────────────────────────────────────

function TeamPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showInvitedBanner = searchParams.get('invited') === 'true';

  const { members, updateMemberRole, updateMemberStatus, removeMember } = useTeamStore();

  // Banner
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Filters + pagination
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [page, setPage] = useState(1);

  // Drawer
  const [drawerMemberId, setDrawerMemberId] = useState<string | null>(null);
  const drawerMember = members.find((m) => m.id === drawerMemberId) ?? null;

  // Edit role dialog
  const [editRoleTarget, setEditRoleTarget] = useState<TeamMember | null>(null);
  const [editRoleValue, setEditRoleValue] = useState<TeamRole>('Viewer');

  // Activity log sheet
  const [activityLogOpen, setActivityLogOpen] = useState(false);

  // Confirm dialogs
  const [suspendTarget, setSuspendTarget] = useState<TeamMember | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<TeamMember | null>(null);
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);

  // ── Filtering ────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      if (q) {
        const haystack = `${m.firstName} ${m.lastName} ${m.email} ${m.jobTitle}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filterRole !== 'all' && m.role !== filterRole) return false;
      return true;
    });
  }, [members, search, filterRole]);

  // ── Pagination ───────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── Stats ────────────────────────────────────────────────────────────────

  const totalCount = members.length;
  const activeCount = members.filter((m) => m.status === 'Active').length;
  const pendingCount = members.filter((m) => m.status === 'Pending').length;

  // ── Actions ──────────────────────────────────────────────────────────────

  function openEditRole(m: TeamMember) {
    setEditRoleTarget(m);
    setEditRoleValue(m.role);
  }

  function confirmEditRole() {
    if (!editRoleTarget) return;
    updateMemberRole(editRoleTarget.id, editRoleValue);
    toast.success(`Role updated to ${editRoleValue}`);
    setEditRoleTarget(null);
  }

  function handleResendInvitation(m: TeamMember) {
    toast.success(`Invitation resent to ${m.email}`);
  }

  function handleSuspend() {
    if (!suspendTarget) return;
    updateMemberStatus(suspendTarget.id, 'Suspended');
    toast.success(`${suspendTarget.firstName} ${suspendTarget.lastName} has been suspended`);
    setSuspendTarget(null);
  }

  function handleReactivate() {
    if (!reactivateTarget) return;
    updateMemberStatus(reactivateTarget.id, 'Active');
    toast.success(
      `${reactivateTarget.firstName} ${reactivateTarget.lastName} has been reactivated`,
    );
    setReactivateTarget(null);
  }

  function handleRemove() {
    if (!removeTarget) return;
    removeMember(removeTarget.id);
    if (drawerMemberId === removeTarget.id) setDrawerMemberId(null);
    toast.success(`${removeTarget.firstName} ${removeTarget.lastName} has been removed`);
    setRemoveTarget(null);
  }

  function dismissBanner() {
    setBannerDismissed(true);
    router.replace('/team', { scroll: false });
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Success banner */}
      {showInvitedBanner && !bannerDismissed && (
        <div className="flex items-start gap-3 rounded-lg border border-[#3ECF8E]/30 bg-[#3ECF8E]/[0.06] px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3ECF8E]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#3ECF8E]">Invitations Sent Successfully!</p>
            <p className="text-xs text-muted-foreground">
              New members will appear as pending until they accept their invitation.
            </p>
          </div>
          <button
            onClick={dismissBanner}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Section tabs */}
      <Tabs
        defaultValue="members"
        onValueChange={(v) => {
          if (v === 'roles') router.push('/team/roles');
        }}
      >
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="roles">Roles &amp; Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-5 mt-5">
          {/* Header row 1: title + add button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {members.length}
              </span>
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
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
                <Link href="/team/invite/bulk">
                  <Upload className="h-3.5 w-3.5" />
                  Bulk Upload
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="gap-1.5 bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90 text-xs font-medium"
              >
                <Link href="/team/invite">
                  <Plus className="h-3.5 w-3.5" />
                  Add New User
                </Link>
              </Button>
            </div>
          </div>

          {/* Filter bar: stats left, search + role right */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <StatChip label="Total" value={totalCount} />
              <StatChip label="Active" value={activeCount} accent />
              <StatChip label="Pending" value={pendingCount} warning />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search members…"
                  className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-[#3ECF8E]"
                />
              </div>
              <Select
                value={filterRole}
                onValueChange={(v) => {
                  setFilterRole(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {ALL_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Card grid / empty state */}
          {paginated.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {paginated.map((m) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  onOpenDrawer={setDrawerMemberId}
                  onEditRole={openEditRole}
                  onResend={handleResendInvitation}
                  onSuspend={setSuspendTarget}
                  onReactivate={setReactivateTarget}
                  onRemove={setRemoveTarget}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              {members.length === 0 ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-foreground">No team members yet</p>
                    <p className="text-xs text-muted-foreground">
                      Invite your first member to get started.
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="mt-1 gap-1.5 bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90 text-xs"
                  >
                    <Link href="/team/invite">
                      <Plus className="h-3.5 w-3.5" />
                      Invite your first member
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-foreground">No results found</p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search or role filter.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 text-xs"
                    onClick={() => {
                      setSearch('');
                      setFilterRole('all');
                      setPage(1);
                    }}
                  >
                    Clear filters
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={safePage}
            totalItems={filtered.length}
            itemsPerPage={PAGE_SIZE}
            onPageChange={setPage}
          />
        </TabsContent>
      </Tabs>

      {/* Activity Log Sheet */}
      <Sheet open={activityLogOpen} onOpenChange={setActivityLogOpen}>
        <SheetContent className="w-96 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Activity Log</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-0">
            {TEAM_ACTIVITIES.map((a) => {
              const { Icon, color } = ACTIVITY_ICON_MAP[a.type];
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

      {/* ── Drawer & dialogs ─────────────────────────────────────────────────── */}

      <EmployeeDrawer
        member={drawerMember}
        open={!!drawerMemberId}
        onOpenChange={(open) => !open && setDrawerMemberId(null)}
        onEditRole={openEditRole}
        onSuspend={setSuspendTarget}
        onReactivate={setReactivateTarget}
      />

      {/* Edit role dialog */}
      <Dialog open={!!editRoleTarget} onOpenChange={(open) => !open && setEditRoleTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Change the role for{' '}
              <span className="font-medium text-foreground">
                {editRoleTarget?.firstName} {editRoleTarget?.lastName}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="py-1">
            <label className="mb-1.5 block text-xs font-medium text-foreground">New Role</label>
            <Select value={editRoleValue} onValueChange={(v) => setEditRoleValue(v as TeamRole)}>
              <SelectTrigger className="h-9 w-full text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditRoleTarget(null)}>
              Cancel
            </Button>
            <Button
              className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
              onClick={confirmEditRole}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
        title="Suspend Member"
        description={`Suspending ${suspendTarget ? `${suspendTarget.firstName} ${suspendTarget.lastName}` : 'this member'} will immediately revoke their backoffice access. You can reactivate them at any time.`}
        confirmLabel="Suspend"
        onConfirm={handleSuspend}
      />

      <ConfirmDialog
        open={!!reactivateTarget}
        onOpenChange={(open) => !open && setReactivateTarget(null)}
        title="Reactivate Member"
        description={`This will restore backoffice access for ${reactivateTarget ? `${reactivateTarget.firstName} ${reactivateTarget.lastName}` : 'this member'}.`}
        confirmLabel="Reactivate"
        variant="default"
        onConfirm={handleReactivate}
      />

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="Remove Member"
        description={`Are you sure you want to remove ${removeTarget ? `${removeTarget.firstName} ${removeTarget.lastName}` : 'this member'}? This action cannot be undone.`}
        confirmLabel="Remove Member"
        onConfirm={handleRemove}
      />
    </div>
  );
}

// ─── Page export (wraps with Suspense for useSearchParams) ───────────────────

export default function TeamPage() {
  return (
    <Suspense>
      <TeamPageContent />
    </Suspense>
  );
}
