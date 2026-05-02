import { cn } from '@/lib/utils';

type StatusVariant =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'trial'
  | 'churned'
  | 'suspended'
  | 'open'
  | 'resolved'
  | 'escalated'
  | 'enabled'
  | 'disabled'
  | 'success'
  | 'warning'
  | 'error';

const VARIANT_STYLES: Record<StatusVariant, string> = {
  active: 'bg-brand/10 text-brand border-brand/20',
  success: 'bg-brand/10 text-brand border-brand/20',
  enabled: 'bg-brand/10 text-brand border-brand/20',
  inactive: 'bg-muted text-muted-foreground border-border',
  disabled: 'bg-muted text-muted-foreground border-border',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  trial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  churned: 'bg-destructive/10 text-destructive border-destructive/20',
  suspended: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  open: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  resolved: 'bg-brand/10 text-brand border-brand/20',
  escalated: 'bg-destructive/10 text-destructive border-destructive/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
};

const DOTS: Record<StatusVariant, string> = {
  active: 'bg-brand',
  success: 'bg-brand',
  enabled: 'bg-brand',
  inactive: 'bg-muted-foreground',
  disabled: 'bg-muted-foreground',
  pending: 'bg-yellow-400',
  trial: 'bg-blue-400',
  churned: 'bg-destructive',
  suspended: 'bg-orange-400',
  open: 'bg-yellow-400',
  resolved: 'bg-brand',
  escalated: 'bg-destructive',
  warning: 'bg-yellow-400',
  error: 'bg-destructive',
};

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, label, showDot = true, className }: StatusBadgeProps) {
  const displayLabel = label ?? status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        VARIANT_STYLES[status],
        className,
      )}
    >
      {showDot && (
        <span
          className={cn('inline-block h-1.5 w-1.5 shrink-0 rounded-full', DOTS[status])}
          aria-hidden="true"
        />
      )}
      {displayLabel}
    </span>
  );
}
