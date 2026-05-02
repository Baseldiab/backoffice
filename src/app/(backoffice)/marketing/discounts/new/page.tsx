'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { DiscountType, DiscountCycle } from '@/lib/mock/discounts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const ALL_PLANS = ['starter', 'pro', 'business', 'enterprise'] as const;
const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
  enterprise: 'Enterprise',
};

export default function NewDiscountPage() {
  const router = useRouter();

  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [type, setType] = useState<DiscountType>('percentage');
  const [value, setValue] = useState<number>(0);
  const [cycle, setCycle] = useState<DiscountCycle>('both');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [maxUsage, setMaxUsage] = useState<number>(100);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [applicablePlans, setApplicablePlans] = useState<string[]>([
    'starter',
    'pro',
    'business',
    'enterprise',
  ]);

  const durationDays = useMemo(() => {
    if (!startDate || !endDate) return null;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  }, [startDate, endDate]);

  const togglePlan = (plan: string) => {
    setApplicablePlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan],
    );
  };

  const handleCreate = () => {
    if (!nameEn.trim()) {
      toast.error('Discount name (English) is required');
      return;
    }
    if (value <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Start and end dates are required');
      return;
    }
    if (applicablePlans.length === 0) {
      toast.error('Select at least one applicable plan');
      return;
    }
    toast.success(`Discount "${nameEn}" created successfully`);
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
            <h1 className="text-2xl font-bold tracking-tight">Create Discount</h1>
          </div>

          {/* Section 1: Discount Details */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Discount Details</h2>
            <div className="space-y-2">
              <Label htmlFor="nameEn">Name (English) *</Label>
              <Input
                id="nameEn"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Gulf Summer Sale"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">Name (Arabic)</Label>
              <Input
                id="nameAr"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
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
                      type === t
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-foreground/20',
                    )}
                    onClick={() => setType(t)}
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
                  {type === 'percentage' ? '%' : '$'}
                </span>
                <Input
                  id="value"
                  type="number"
                  value={value || ''}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="pl-7"
                  placeholder="0"
                  min={0}
                  max={type === 'percentage' ? 100 : undefined}
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
                      cycle === c
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-foreground/20',
                    )}
                    onClick={() => setCycle(c)}
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
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || undefined}
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
                  {isPublic
                    ? 'Visible on pricing pages and checkout'
                    : 'Only available via direct link or code'}
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Max Usage</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Unlimited</span>
                  <Switch checked={isUnlimited} onCheckedChange={setIsUnlimited} />
                </div>
              </div>
              {!isUnlimited && (
                <Input
                  type="number"
                  value={maxUsage || ''}
                  onChange={(e) => setMaxUsage(Number(e.target.value))}
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
                      applicablePlans.includes(plan)
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border hover:border-foreground/20',
                    )}
                  >
                    <Checkbox
                      checked={applicablePlans.includes(plan)}
                      onCheckedChange={() => togglePlan(plan)}
                    />
                    <span className="text-sm font-medium">{PLAN_LABELS[plan]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border bg-card px-6 py-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/marketing/discounts')}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleCreate}>
          <Save className="mr-2 h-4 w-4" />
          Create Discount
        </Button>
      </div>
    </div>
  );
}
