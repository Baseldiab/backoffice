'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_DISCOUNTS, getDiscountStatus } from '@/lib/mock/discounts';
import type { Discount, DiscountStatus, DiscountType, DiscountCycle } from '@/lib/mock/discounts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Plus, Search, MoreHorizontal, Pencil, Pause, Play, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS: Record<DiscountStatus, string> = {
  active: 'bg-primary/10 text-primary',
  scheduled: 'bg-blue-500/10 text-blue-400',
  paused: 'bg-yellow-500/10 text-yellow-400',
  expired: 'bg-muted text-muted-foreground',
};

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
  enterprise: 'Enterprise',
};

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const year = e.getFullYear();
  return `${fmt(s)} \u2192 ${fmt(e)}, ${year}`;
}

export default function DiscountsPage() {
  const router = useRouter();
  const [discounts, setDiscounts] = useState(MOCK_DISCOUNTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DiscountStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<DiscountType | 'all'>('all');
  const [cycleFilter, setCycleFilter] = useState<DiscountCycle | 'all'>('all');
  const [pauseTarget, setPauseTarget] = useState<Discount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Discount | null>(null);

  const filteredDiscounts = useMemo(() => {
    return discounts.filter((d) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!d.nameEn.toLowerCase().includes(q) && !d.nameAr.includes(q)) {
          return false;
        }
      }
      const computedStatus = getDiscountStatus(d);
      if (statusFilter !== 'all' && computedStatus !== statusFilter) return false;
      if (typeFilter !== 'all' && d.type !== typeFilter) return false;
      if (cycleFilter !== 'all' && d.cycle !== cycleFilter) return false;
      return true;
    });
  }, [discounts, searchQuery, statusFilter, typeFilter, cycleFilter]);

  const activeCount = discounts.filter((d) => getDiscountStatus(d) === 'active').length;
  const scheduledCount = discounts.filter((d) => getDiscountStatus(d) === 'scheduled').length;
  const expiredCount = discounts.filter((d) => getDiscountStatus(d) === 'expired').length;
  const totalUsage = discounts.reduce((s, d) => s + d.usageCount, 0);

  const stats = [
    { label: 'Active', value: String(activeCount) },
    { label: 'Scheduled', value: String(scheduledCount) },
    { label: 'Total Usage', value: String(totalUsage) },
    { label: 'Expired', value: String(expiredCount) },
  ];

  function handlePause(discount: Discount) {
    const isPaused = discount.status === 'paused';
    setDiscounts((prev) =>
      prev.map((d) =>
        d.id === discount.id
          ? { ...d, status: isPaused ? ('active' as const) : ('paused' as const) }
          : d,
      ),
    );
    setPauseTarget(null);
    toast.success(isPaused ? `"${discount.nameEn}" resumed` : `"${discount.nameEn}" paused`);
  }

  function handleDuplicate(discount: Discount) {
    const dup: Discount = {
      ...discount,
      id: `disc-${Date.now()}`,
      nameEn: `${discount.nameEn} (Copy)`,
      nameAr: `${discount.nameAr} (نسخة)`,
      usageCount: 0,
      status: 'scheduled',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setDiscounts((prev) => [dup, ...prev]);
    toast.success(`Duplicated "${discount.nameEn}"`);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setDiscounts((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.nameEn}" deleted`);
    setDeleteTarget(null);
  }

  const hasFilters = !!(
    searchQuery ||
    statusFilter !== 'all' ||
    typeFilter !== 'all' ||
    cycleFilter !== 'all'
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discounts</h1>
          <p className="text-sm text-muted-foreground">Manage promotional discounts and offers</p>
        </div>
        <Button asChild>
          <Link href="/marketing/discounts/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Discount
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 flex-wrap">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-muted/50 px-3 py-2 flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">{s.label}</span>
            <span className="text-xs font-semibold text-foreground tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name (EN or AR)..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DiscountStatus | 'all')}
          className="h-9 appearance-none pl-3 pr-8 rounded-lg border border-input bg-transparent text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="paused">Paused</option>
          <option value="expired">Expired</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as DiscountType | 'all')}
          className="h-9 appearance-none pl-3 pr-8 rounded-lg border border-input bg-transparent text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
        <select
          value={cycleFilter}
          onChange={(e) => setCycleFilter(e.target.value as DiscountCycle | 'all')}
          className="h-9 appearance-none pl-3 pr-8 rounded-lg border border-input bg-transparent text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <option value="all">All Cycles</option>
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
          <option value="both">Both</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setTypeFilter('all');
              setCycleFilter('all');
            }}
            className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {filteredDiscounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Discounts Found</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {hasFilters
              ? 'Try adjusting your filters or search query.'
              : 'Create your first discount to start offering promotions.'}
          </p>
          {!hasFilters && (
            <Button asChild>
              <Link href="/marketing/discounts/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Discount
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Discount Name
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Cycle
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Duration
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Visibility
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Usage
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Plans
                </th>
                <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.map((discount) => {
                const computedStatus = getDiscountStatus(discount);
                return (
                  <tr
                    key={discount.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium">{discount.nameEn}</p>
                      <p className="text-xs text-muted-foreground" dir="rtl">
                        {discount.nameAr}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium',
                          discount.type === 'percentage'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-blue-500/10 text-blue-400',
                        )}
                      >
                        {discount.type === 'percentage'
                          ? `${discount.value}%`
                          : `$${discount.value}`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground capitalize">
                      {discount.cycle}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateRange(discount.startDate, discount.endDate)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium',
                          discount.isPublic
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {discount.isPublic ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                          STATUS_COLORS[computedStatus],
                        )}
                      >
                        {computedStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm tabular-nums">
                      {discount.usageCount} /{' '}
                      {discount.maxUsage !== null ? discount.maxUsage : '\u221E'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {discount.applicablePlans.map((p) => (
                          <span
                            key={p}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize"
                          >
                            {PLAN_LABELS[p] || p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/marketing/discounts/${discount.id}/edit`)}
                          >
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          {(computedStatus === 'active' || computedStatus === 'paused') && (
                            <DropdownMenuItem onClick={() => setPauseTarget(discount)}>
                              {discount.status === 'paused' ? (
                                <>
                                  <Play className="mr-2 h-3.5 w-3.5" />
                                  Resume
                                </>
                              ) : (
                                <>
                                  <Pause className="mr-2 h-3.5 w-3.5" />
                                  Pause
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDuplicate(discount)}>
                            <Copy className="mr-2 h-3.5 w-3.5" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(discount)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pause/Resume Dialog */}
      {pauseTarget && (
        <ConfirmDialog
          open={!!pauseTarget}
          onOpenChange={() => setPauseTarget(null)}
          title={pauseTarget.status === 'paused' ? 'Resume Discount' : 'Pause Discount'}
          description={
            pauseTarget.status === 'paused'
              ? `Are you sure you want to resume "${pauseTarget.nameEn}"? It will become active again.`
              : `Are you sure you want to pause "${pauseTarget.nameEn}"? New customers won't be able to use it.`
          }
          confirmLabel={pauseTarget.status === 'paused' ? 'Resume' : 'Pause'}
          variant="default"
          onConfirm={() => handlePause(pauseTarget)}
        />
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={() => setDeleteTarget(null)}
          title="Delete Discount"
          description={`Are you sure you want to delete "${deleteTarget.nameEn}"? ${
            deleteTarget.usageCount > 0
              ? `${deleteTarget.usageCount} deals are using this discount.`
              : 'This action cannot be undone.'
          }`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
