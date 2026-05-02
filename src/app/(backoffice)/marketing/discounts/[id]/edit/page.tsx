'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_DISCOUNTS, getDiscountStatus } from '@/lib/mock/discounts';
import type { Discount } from '@/lib/mock/discounts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const ALL_PLANS = ['starter', 'pro', 'business', 'enterprise'] as const;
const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
  enterprise: 'Enterprise',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-primary/10 text-primary',
  scheduled: 'bg-blue-500/10 text-blue-400',
  paused: 'bg-yellow-500/10 text-yellow-400',
  expired: 'bg-muted text-muted-foreground',
};

export default function EditDiscountPage() {
  const params = useParams();
  const router = useRouter();
  const discountId = params.id as string;

  const originalDiscount = MOCK_DISCOUNTS.find((d) => d.id === discountId);

  const [discount, setDiscount] = useState<Discount | null>(() =>
    originalDiscount ? JSON.parse(JSON.stringify(originalDiscount)) : null,
  );
  const [pauseOpen, setPauseOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const durationDays = useMemo(() => {
    if (!discount?.startDate || !discount?.endDate) return null;
    const s = new Date(discount.startDate);
    const e = new Date(discount.endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  }, [discount?.startDate, discount?.endDate]);

  if (!originalDiscount || !discount) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-xl font-semibold">Discount not found</h1>
        <Button asChild>
          <Link href="/marketing/discounts">Back to Discounts</Link>
        </Button>
      </div>
    );
  }

  const computedStatus = getDiscountStatus(discount);
  const hasChanges = JSON.stringify(discount) !== JSON.stringify(originalDiscount);

  const togglePlan = (plan: string) => {
    setDiscount(
      (prev) =>
        prev && {
          ...prev,
          applicablePlans: prev.applicablePlans.includes(plan)
            ? prev.applicablePlans.filter((p) => p !== plan)
            : [...prev.applicablePlans, plan],
        },
    );
  };

  const handleSave = () => {
    if (!discount.nameEn.trim()) {
      toast.error('Discount name (English) is required');
      return;
    }
    if (discount.value <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }
    if (discount.applicablePlans.length === 0) {
      toast.error('Select at least one applicable plan');
      return;
    }
    toast.success(`Discount "${discount.nameEn}" updated successfully`);
    router.push('/marketing/discounts');
  };

  const handlePause = () => {
    const isPaused = discount.status === 'paused';
    setDiscount((prev) =>
      prev ? { ...prev, status: isPaused ? ('active' as const) : ('paused' as const) } : prev,
    );
    setPauseOpen(false);
    toast.success(isPaused ? `"${discount.nameEn}" resumed` : `"${discount.nameEn}" paused`);
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    toast.success(`"${discount.nameEn}" deleted`);
    router.push('/marketing/discounts');
  };

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 px-6 py-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/marketing/discounts" aria-label="Back to discounts">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Edit Discount: {discount.nameEn}</h1>
            <Badge className={cn('capitalize', STATUS_COLORS[computedStatus])}>
              {computedStatus}
            </Badge>
          </div>

          {/* Section 1: Discount Details */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Discount Details</h2>
            <div className="space-y-2">
              <Label htmlFor="nameEn">Name (English) *</Label>
              <Input
                id="nameEn"
                value={discount.nameEn}
                onChange={(e) => setDiscount((prev) => prev && { ...prev, nameEn: e.target.value })}
                placeholder="e.g. Gulf Summer Sale"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">Name (Arabic)</Label>
              <Input
                id="nameAr"
                value={discount.nameAr}
                onChange={(e) => setDiscount((prev) => prev && { ...prev, nameAr: e.target.value })}
                placeholder="e.g. تخفيضات الصيف الخليجي"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <div className="flex gap-2">
                {(['percentage', 'fixed'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={cn(
                      'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                      discount.type === t
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-foreground/20',
                    )}
                    onClick={() => setDiscount((prev) => prev && { ...prev, type: t })}
                  >
                    {t === 'percentage' ? 'Percentage (%)' : 'Fixed Amount ($)'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value *</Label>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {discount.type === 'percentage' ? '%' : '$'}
                </span>
                <Input
                  id="value"
                  type="number"
                  value={discount.value || ''}
                  onChange={(e) =>
                    setDiscount((prev) => prev && { ...prev, value: Number(e.target.value) })
                  }
                  className="pl-7"
                  placeholder="0"
                  min={0}
                  max={discount.type === 'percentage' ? 100 : undefined}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Applies to Cycle</Label>
              <div className="flex gap-2">
                {(['monthly', 'annual', 'both'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      'rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors',
                      discount.cycle === c
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-foreground/20',
                    )}
                    onClick={() => setDiscount((prev) => prev && { ...prev, cycle: c })}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Duration */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold">Duration</h2>
              {durationDays !== null && (
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {durationDays} day{durationDays !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={discount.startDate}
                  onChange={(e) =>
                    setDiscount((prev) => prev && { ...prev, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={discount.endDate}
                  onChange={(e) =>
                    setDiscount((prev) => prev && { ...prev, endDate: e.target.value })
                  }
                  min={discount.startDate || undefined}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Visibility & Limits */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Visibility &amp; Limits</h2>
            <div className="flex items-center justify-between">
              <div>
                <Label>Public Discount</Label>
                <p className="text-xs text-muted-foreground">
                  {discount.isPublic
                    ? 'Visible on pricing pages and checkout'
                    : 'Only available via direct link or code'}
                </p>
              </div>
              <Switch
                checked={discount.isPublic}
                onCheckedChange={(v) => setDiscount((prev) => prev && { ...prev, isPublic: v })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Max Usage</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Unlimited</span>
                  <Switch
                    checked={discount.maxUsage === null}
                    onCheckedChange={(v) =>
                      setDiscount((prev) => prev && { ...prev, maxUsage: v ? null : 100 })
                    }
                  />
                </div>
              </div>
              {discount.maxUsage !== null && (
                <Input
                  type="number"
                  value={discount.maxUsage || ''}
                  onChange={(e) =>
                    setDiscount((prev) => prev && { ...prev, maxUsage: Number(e.target.value) })
                  }
                  placeholder="100"
                  min={1}
                  className="max-w-xs"
                />
              )}
            </div>
            <div className="space-y-3">
              <Label>Applicable Plans *</Label>
              <div className="grid grid-cols-2 gap-3">
                {ALL_PLANS.map((plan) => (
                  <label
                    key={plan}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors',
                      discount.applicablePlans.includes(plan)
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border hover:border-foreground/20',
                    )}
                  >
                    <Checkbox
                      checked={discount.applicablePlans.includes(plan)}
                      onCheckedChange={() => togglePlan(plan)}
                    />
                    <span className="text-sm font-medium">{PLAN_LABELS[plan]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Usage Info (read-only) */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Usage Info</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Times Used</p>
                <p className="text-lg font-semibold tabular-nums">{discount.usageCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm">{discount.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created By</p>
                <p className="text-sm">{discount.createdBy}</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4 rounded-xl border border-destructive/30 bg-card p-6">
            <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
            <Separator />
            {(computedStatus === 'active' || computedStatus === 'paused') && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {discount.status === 'paused' ? 'Resume Discount' : 'Pause Discount'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {discount.status === 'paused'
                      ? 'Make this discount available again'
                      : 'Temporarily stop new customers from using this discount'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    discount.status === 'paused'
                      ? 'border-primary/30 text-primary hover:bg-primary/10'
                      : 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10',
                  )}
                  onClick={() => setPauseOpen(true)}
                >
                  {discount.status === 'paused' ? 'Resume' : 'Pause'}
                </Button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Discount</p>
                <p className="text-xs text-muted-foreground">
                  {discount.usageCount > 0
                    ? `${discount.usageCount} customers have used this discount`
                    : 'Permanently remove this discount'}
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border bg-card px-6 py-4">
        {hasChanges && (
          <div className="mr-auto flex items-center gap-1.5 text-xs text-yellow-400">
            <AlertCircle className="h-3.5 w-3.5" />
            Unsaved changes
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => router.push('/marketing/discounts')}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={pauseOpen}
        onOpenChange={setPauseOpen}
        title={discount.status === 'paused' ? 'Resume Discount' : 'Pause Discount'}
        description={
          discount.status === 'paused'
            ? `Are you sure you want to resume "${discount.nameEn}"? It will become active again.`
            : `Are you sure you want to pause "${discount.nameEn}"? New customers won't be able to use it.`
        }
        confirmLabel={discount.status === 'paused' ? 'Resume' : 'Pause'}
        variant="default"
        onConfirm={handlePause}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Discount"
        description={`Are you sure you want to permanently delete "${discount.nameEn}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
