import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number; // percentage, positive = up
    label?: string;
  };
  icon?: React.ElementType;
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  className,
  loading = false,
}: StatCardProps) {
  const trendPositive = trend && trend.value > 0;
  const trendNegative = trend && trend.value < 0;

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border/80',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {loading ? (
        <div className="mt-3 space-y-2">
          <div className="h-8 w-32 animate-pulse rounded-md bg-border" />
          <div className="h-3 w-24 animate-pulse rounded-md bg-border" />
        </div>
      ) : (
        <>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
          </div>

          {(trend || description) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    trendPositive && 'text-brand',
                    trendNegative && 'text-destructive',
                    !trendPositive && !trendNegative && 'text-muted-foreground',
                  )}
                >
                  {trendPositive && <TrendingUp className="h-3 w-3" />}
                  {trendNegative && <TrendingDown className="h-3 w-3" />}
                  {!trendPositive && !trendNegative && <Minus className="h-3 w-3" />}
                  {Math.abs(trend.value)}%
                </span>
              )}
              {description && <span className="text-xs text-muted-foreground">{description}</span>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
