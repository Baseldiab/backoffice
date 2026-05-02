'use client';

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { Ban, RefreshCw, UserCog } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { RoleBadge } from '@/components/team/role-badge';
import { cn } from '@/lib/utils';
import type { TeamMember } from '@/lib/mock/team';

interface EmployeeDrawerProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditRole: (member: TeamMember) => void;
  onSuspend: (member: TeamMember) => void;
  onReactivate: (member: TeamMember) => void;
}

function fmtDate(s: string | null) {
  if (!s) return '—';
  const d = parseISO(s);
  return isValid(d) ? format(d, 'MMM d, yyyy') : s;
}

function fmtRelative(s: string | null) {
  if (!s) return 'Never';
  const d = parseISO(s);
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : s;
}

function initials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

export function EmployeeDrawer({
  member,
  open,
  onOpenChange,
  onEditRole,
  onSuspend,
  onReactivate,
}: EmployeeDrawerProps) {
  if (!member) return null;

  const avatar = initials(member.firstName, member.lastName);
  const recentAudit = [...member.auditTrail].reverse().slice(0, 3);

  const statusVariant =
    member.status === 'Active' ? 'active' : member.status === 'Pending' ? 'pending' : 'suspended';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:max-w-[400px] flex flex-col p-0 overflow-hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Employee Details</SheetTitle>
          <SheetDescription>
            Details for {member.firstName} {member.lastName}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          {/* Profile header */}
          <div className="px-6 pt-8 pb-5 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-base font-semibold text-foreground">
                {avatar}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-base font-semibold text-foreground leading-tight">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">{member.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{member.phone}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <RoleBadge role={member.role} />
              <StatusBadge status={statusVariant} />
            </div>

            {member.jobTitle && (
              <p className="mt-2.5 text-sm text-muted-foreground">{member.jobTitle}</p>
            )}
          </div>

          {/* Info grid */}
          <div className="px-6 py-5 border-b border-border">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Info
            </p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <InfoItem label="Invited by" value={member.invitedBy} />
              <InfoItem label="Invited on" value={fmtDate(member.invitedAt)} />
              <InfoItem label="Joined on" value={fmtDate(member.joinedAt)} />
              <InfoItem label="Last login" value={fmtRelative(member.lastLogin)} />
            </dl>
          </div>

          {/* Audit trail */}
          <div className="px-6 py-5 border-b border-border">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Recent Activity
            </p>
            <ul className="space-y-3">
              {recentAudit.map((entry, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  <div>
                    <p className="text-xs text-foreground leading-snug">{entry.action}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {fmtRelative(entry.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="px-6 py-5 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => onEditRole(member)}
            >
              <UserCog className="h-4 w-4" />
              Edit Role
            </Button>

            {member.status === 'Active' && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'w-full justify-start gap-2',
                  'text-destructive border-destructive/20',
                  'hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5',
                )}
                onClick={() => onSuspend(member)}
              >
                <Ban className="h-4 w-4" />
                Suspend Member
              </Button>
            )}

            {member.status === 'Suspended' && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-emerald-400 border-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/5"
                onClick={() => onReactivate(member)}
              >
                <RefreshCw className="h-4 w-4" />
                Reactivate Member
              </Button>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}
