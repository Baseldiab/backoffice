import { cn } from '@/lib/utils';
import type { TeamRole } from '@/lib/mock/team';

const ROLE_STYLES: Record<TeamRole, string> = {
  'Super Admin': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Ops Manager': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Finance Officer': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Support Agent': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Content Manager': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Viewer: 'bg-muted text-muted-foreground border-border',
};

const ROLE_DOTS: Record<TeamRole, string> = {
  'Super Admin': 'bg-purple-400',
  'Ops Manager': 'bg-blue-400',
  'Finance Officer': 'bg-emerald-400',
  'Support Agent': 'bg-orange-400',
  'Content Manager': 'bg-pink-400',
  Viewer: 'bg-muted-foreground',
};

interface RoleBadgeProps {
  role: TeamRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        ROLE_STYLES[role],
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', ROLE_DOTS[role])} aria-hidden="true" />
      {role}
    </span>
  );
}
