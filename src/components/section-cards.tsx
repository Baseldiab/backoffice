'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { cn, formatNumber, formatPercentage, calculateTrend } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { kpiMetrics, chartData } from '@/lib/mock-data';

function Sparkline({ data, id }: { data: number[]; id: string }) {
  if (data.length < 2) return null;

  const width = 80;
  const height = 32;
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
  const gradientId = `sparkline-${id}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
          <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path d={linePath} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} />
    </svg>
  );
}

function buildSparklineData(metricId: string): number[] {
  return chartData.map((point) => {
    switch (metricId) {
      case 'engagement-rate':
        return point.clicks;
      case 'avg-ctr':
        return point.clicks / Math.max(point.impressions, 1);
      case 'avg-response-rate':
        return point.eventTracker;
      case 'active-users':
        return point.activeUsers;
      default:
        return point.reach;
    }
  });
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function SectionCards() {
  return (
    <motion.div
      className="grid auto-rows-min gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {kpiMetrics.map((metric) => {
        const trend = calculateTrend(metric.value, metric.previousValue);
        const isPositive = trend.direction === 'up';
        const displayValue =
          metric.format === 'percentage'
            ? formatPercentage(metric.value)
            : formatNumber(metric.value);
        const sparklineData = buildSparklineData(metric.id);

        return (
          <motion.div
            key={metric.id}
            variants={cardVariants}
            className="group relative overflow-hidden rounded-xl bg-muted/50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/70"
          >
            {metric.description && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="absolute end-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label={`Info about ${metric.label}`}
                    >
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <p className="text-xs">{metric.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">{displayValue}</p>
                <div
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                    isPositive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400',
                  )}
                >
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  <span>{formatPercentage(trend.value, 1)}</span>
                </div>
              </div>

              {sparklineData.length > 1 && (
                <div className="mt-2">
                  <Sparkline data={sparklineData} id={metric.id} />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
