import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant: 'kpi-cards' | 'chart' | 'table' | 'card-grid' | 'form';
  className?: string;
}

export function LoadingSkeleton({ variant, className }: LoadingSkeletonProps) {
  switch (variant) {
    case 'kpi-cards':
      return (
        <div className={cn('grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>
      );

    case 'chart':
      return <Skeleton className={cn('h-[400px] rounded-xl', className)} />;

    case 'table':
      return (
        <div className={cn('space-y-3', className)}>
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      );

    case 'card-grid':
      return (
        <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-xl" />
          ))}
        </div>
      );

    case 'form':
      return (
        <div className={cn('space-y-4', className)}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
