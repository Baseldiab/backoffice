'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, formatPercentage } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KpiCardProps {
  label: string;
  value: number;
  format: 'number' | 'percentage' | 'currency';
  trend: number;
  trendDirection: 'up' | 'down' | 'flat';
  description?: string;
  sparklineData?: number[];
}

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;

  const width = 80;
  const height = 28;
  const padding = 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
          <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkline-fill)" />
      <path d={linePath} fill="none" stroke="hsl(var(--chart-1))" strokeWidth={1.5} />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  format,
  trend,
  trendDirection,
  description,
  sparklineData,
}: KpiCardProps) {
  const displayValue = format === 'percentage' ? formatPercentage(value) : formatNumber(value);
  const isPositive = trendDirection === 'up';

  return (
    <div className="group relative overflow-hidden rounded-xl bg-muted/50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/70">
      {/* Info icon — visible on hover */}
      {description && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="absolute end-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Info about ${label}`}
              >
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[200px]">
              <p className="text-xs">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tabular-nums tracking-tight">{displayValue}</p>
          <div
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400',
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            <span>{formatPercentage(trend, 1)}</span>
          </div>
        </div>

        {sparklineData && sparklineData.length > 1 && (
          <div className="mt-2">
            <Sparkline data={sparklineData} />
          </div>
        )}
      </div>
    </div>
  );
}
