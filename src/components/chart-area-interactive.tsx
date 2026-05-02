'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { useReducedMotion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn, formatNumber, formatPercentage } from '@/lib/utils';
import { chartData, widgets } from '@/lib/mock-data';
import type { ChartDataPoint, ChartMetric, ChartInterval } from '@/lib/types';

interface MetricOption {
  id: ChartMetric;
  label: string;
}

const METRIC_OPTIONS: MetricOption[] = [
  { id: 'reach', label: 'Reach' },
  { id: 'impressions', label: 'Impression' },
  { id: 'clicks', label: 'Click' },
  { id: 'activeUsers', label: 'Active Users' },
  { id: 'eventTracker', label: 'Completion' },
];

const INTERVAL_OPTIONS: { id: ChartInterval; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

function getMetricTotal(data: ChartDataPoint[], metric: ChartMetric): number {
  return data.reduce((sum, point) => sum + point[metric], 0);
}

function getMetricTrend(data: ChartDataPoint[], metric: ChartMetric): number {
  if (data.length < 2) return 0;
  const mid = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, mid).reduce((sum, p) => sum + p[metric], 0);
  const secondHalf = data.slice(mid).reduce((sum, p) => sum + p[metric], 0);
  if (firstHalf === 0) return 0;
  return ((secondHalf - firstHalf) / firstHalf) * 100;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
  metricLabel: string;
}

function CustomTooltip({ active, payload, label, metricLabel }: CustomTooltipProps) {
  if (!active || !payload?.length || !label) return null;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{format(parseISO(label), 'MMM d, yyyy')}</p>
      <p className="text-sm font-semibold tabular-nums">
        {metricLabel}: {formatNumber(payload[0].value)}
      </p>
    </div>
  );
}

export function ChartAreaInteractive() {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('reach');
  const [activeInterval, setActiveInterval] = useState<ChartInterval>('daily');
  const prefersReducedMotion = useReducedMotion();

  const activeOption = METRIC_OPTIONS.find((m) => m.id === activeMetric) ?? METRIC_OPTIONS[0];
  const chartColor = 'hsl(var(--chart-1))';
  const gradientId = `chart-gradient-${activeMetric}`;
  const widgetNames = widgets.map((w) => w.appName);

  return (
    <div className="overflow-hidden rounded-xl bg-muted/50">
      <div className="flex flex-col md:flex-row">
        {/* Left column — Metric selector */}
        <div className="w-full shrink-0 border-b border-border/50 p-4 md:w-[240px] md:border-b-0 md:border-e">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Metrics
          </p>
          <div className="grid grid-cols-2 gap-1 md:grid-cols-1">
            {METRIC_OPTIONS.map((metric) => {
              const total = getMetricTotal(chartData, metric.id);
              const trend = getMetricTrend(chartData, metric.id);
              const isActive = activeMetric === metric.id;
              const isPositive = trend >= 0;

              return (
                <button
                  key={metric.id}
                  onClick={() => setActiveMetric(metric.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-start transition-all',
                    isActive
                      ? 'border border-border bg-muted'
                      : 'border border-transparent hover:bg-accent/50',
                  )}
                >
                  <div className="space-y-1">
                    <span
                      className={cn(
                        'text-sm',
                        isActive ? 'font-medium text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {metric.label}
                    </span>
                    <p className="font-mono text-lg font-semibold tabular-nums">
                      {formatNumber(total)}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'hidden items-center gap-0.5 text-xs font-medium md:flex',
                      isPositive ? 'text-emerald-400' : 'text-red-400',
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {formatPercentage(Math.abs(trend), 1)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column — Chart area */}
        <div className="flex flex-1 flex-col">
          {/* Interval toggle */}
          <div className="flex items-center justify-end gap-1 border-b border-border/50 px-4 py-3">
            {INTERVAL_OPTIONS.map((interval) => (
              <button
                key={interval.id}
                onClick={() => setActiveInterval(interval.id)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  activeInterval === interval.id
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-accent',
                )}
              >
                {interval.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="flex-1 px-4 pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  strokeOpacity={0.4}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value: string) => format(parseISO(value), 'MMM d')}
                  tickMargin={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value: number) => formatNumber(value)}
                  width={50}
                  tickMargin={8}
                />
                <RechartsTooltip
                  content={<CustomTooltip metricLabel={activeOption.label} />}
                  cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                />
                <Area
                  type="natural"
                  dataKey={activeMetric}
                  stroke={chartColor}
                  strokeWidth={1.5}
                  fill={`url(#${gradientId})`}
                  dot={false}
                  isAnimationActive={!prefersReducedMotion}
                  activeDot={{
                    r: 4,
                    fill: chartColor,
                    stroke: 'hsl(var(--background))',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart footer — widget legend */}
          <div className="flex items-center gap-4 border-t border-border/50 px-4 py-3">
            {widgetNames.map((name) => (
              <div key={name} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />
                <span className="text-xs text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
