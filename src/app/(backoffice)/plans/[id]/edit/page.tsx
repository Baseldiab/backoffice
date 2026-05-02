'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_PLANS, PLAN_FEATURES } from '@/lib/mock/plans';
import type { Plan, PlanFeature } from '@/lib/mock/plans';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const FEATURE_CATEGORIES: Record<PlanFeature['category'], string> = {
  stories: 'Stories',
  analytics: 'Analytics',
  integrations: 'Integrations',
  support: 'Support',
  ai: 'AI',
  customization: 'Customization',
};

const DISCOUNTS = [
  { id: 'none', label: 'No discount', percent: 0 },
  { id: 'gulf_summer', label: 'Gulf Summer Sale — 20% off', percent: 20 },
  { id: 'ramadan', label: 'Ramadan Special — 15% off', percent: 15 },
  { id: 'new_customer', label: 'New Customer — 10% off', percent: 10 },
];

const LIMIT_FIELDS: {
  key: keyof Plan['limits'];
  label: string;
  unit: string;
  allowUnlimited: boolean;
}[] = [
  {
    key: 'impressionsPerMonth',
    label: 'Monthly Impressions',
    unit: '/month',
    allowUnlimited: true,
  },
  {
    key: 'activeWidgets',
    label: 'Active Widgets',
    unit: '',
    allowUnlimited: true,
  },
  {
    key: 'teamMembers',
    label: 'Team Members',
    unit: '',
    allowUnlimited: true,
  },
  {
    key: 'aiCreditsPerMonth',
    label: 'AI Credits',
    unit: '/month',
    allowUnlimited: false,
  },
  {
    key: 'customDomains',
    label: 'Custom Domains',
    unit: '',
    allowUnlimited: false,
  },
  {
    key: 'dataRetentionDays',
    label: 'Data Retention',
    unit: 'days',
    allowUnlimited: false,
  },
];

const MOCK_SUBSCRIBERS: Record<string, number> = {
  starter: 342,
  pro: 891,
  business: 234,
  enterprise: 56,
};

export default function EditPlanPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const originalPlan = MOCK_PLANS.find((p) => p.id === planId);

  const [plan, setPlan] = useState<Plan | null>(() =>
    originalPlan ? JSON.parse(JSON.stringify(originalPlan)) : null,
  );
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!originalPlan || !plan) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-xl font-semibold">Plan not found</h1>
        <Button asChild>
          <Link href="/plans">Back to Plans</Link>
        </Button>
      </div>
    );
  }

  const hasChanges = JSON.stringify(plan) !== JSON.stringify(originalPlan);

  const subs = MOCK_SUBSCRIBERS[planId] ?? 0;

  const savings =
    plan.monthlyPrice > 0
      ? Math.round(((plan.monthlyPrice - plan.annualPrice) / plan.monthlyPrice) * 100)
      : 0;

  const updateLimit = (key: string, value: number | 'unlimited') => {
    setPlan(
      (prev) =>
        prev && {
          ...prev,
          limits: { ...prev.limits, [key]: value } as Plan['limits'],
        },
    );
  };

  const toggleFeature = (featureId: string) => {
    setPlan(
      (prev) =>
        prev && {
          ...prev,
          features: {
            ...prev.features,
            [featureId]: !prev.features[featureId],
          },
        },
    );
  };

  const handleSave = () => {
    toast.success(`Plan "${plan.name}" updated successfully`);
    router.push('/plans');
  };

  const handleDeactivate = () => {
    setPlan((prev) => prev && { ...prev, isActive: false });
    setDeactivateOpen(false);
    toast.success(`Plan "${plan.name}" deactivated`);
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    toast.success(`Plan "${plan.name}" deleted`);
    router.push('/plans');
  };

  const categories = Object.keys(FEATURE_CATEGORIES) as PlanFeature['category'][];

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/plans" aria-label="Back to plans">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Edit Plan: {plan.name}</h1>
          </div>
          {/* Section 1: Basic Info */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Basic Info</h2>
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                value={plan.name}
                onChange={(e) => setPlan((prev) => prev && { ...prev, name: e.target.value })}
                placeholder="e.g. Pro, Business, Enterprise"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={plan.description}
                onChange={(e) =>
                  setPlan((prev) => prev && { ...prev, description: e.target.value })
                }
                placeholder="Brief description of this plan..."
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Mark as Popular</Label>
                <p className="text-xs text-muted-foreground">
                  Highlight this plan in pricing pages
                </p>
              </div>
              <Switch
                checked={plan.isPopular}
                onCheckedChange={(v) => setPlan((prev) => prev && { ...prev, isPopular: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Status</Label>
                <p className="text-xs text-muted-foreground">
                  {plan.isActive ? 'Visible to customers' : 'Hidden from customers'}
                </p>
              </div>
              <Switch
                checked={plan.isActive}
                onCheckedChange={(v) => setPlan((prev) => prev && { ...prev, isActive: v })}
              />
            </div>
          </div>

          {/* Section 2: Pricing */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly">Monthly Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="monthly"
                    type="number"
                    value={plan.monthlyPrice || ''}
                    onChange={(e) =>
                      setPlan(
                        (prev) =>
                          prev && {
                            ...prev,
                            monthlyPrice: Number(e.target.value),
                          },
                      )
                    }
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">USD/month</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="annual">Annual Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="annual"
                    type="number"
                    value={plan.annualPrice || ''}
                    onChange={(e) =>
                      setPlan(
                        (prev) =>
                          prev && {
                            ...prev,
                            annualPrice: Number(e.target.value),
                          },
                      )
                    }
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">USD/month billed annually</p>
              </div>
            </div>
            {savings > 0 && (
              <Badge variant="outline" className="border-primary/30 text-primary">
                Customers save {savings}%
              </Badge>
            )}
          </div>

          {/* Section 3: Usage Limits */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Usage Limits</h2>
            <div className="grid grid-cols-2 gap-4">
              {LIMIT_FIELDS.map((lf) => {
                const val = plan.limits[lf.key];
                const isUnlimited = val === 'unlimited';
                return (
                  <div key={lf.key} className="space-y-2">
                    <Label>{lf.label}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={isUnlimited ? '' : val || ''}
                        onChange={(e) => updateLimit(lf.key, Number(e.target.value))}
                        disabled={isUnlimited}
                        placeholder={isUnlimited ? 'Unlimited' : '0'}
                        className="flex-1"
                      />
                      {lf.unit && (
                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                          {lf.unit}
                        </span>
                      )}
                    </div>
                    {lf.allowUnlimited && (
                      <button
                        type="button"
                        className={cn(
                          'rounded-md border px-2 py-0.5 text-[10px] transition-colors',
                          isUnlimited
                            ? 'border-primary/30 bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-foreground/20',
                        )}
                        onClick={() => updateLimit(lf.key, isUnlimited ? 0 : 'unlimited')}
                      >
                        Unlimited
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Features */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Features</h2>
            <Accordion type="multiple" className="w-full">
              {categories.map((cat) => {
                const catFeatures = PLAN_FEATURES.filter((f) => f.category === cat);
                const enabled = catFeatures.filter((f) => plan.features[f.id]).length;
                return (
                  <AccordionItem key={cat} value={cat}>
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-2">
                        {FEATURE_CATEGORIES[cat]}
                        <Badge variant="secondary" className="h-5 text-[10px]">
                          {enabled}/{catFeatures.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-1">
                        {catFeatures.map((f) => (
                          <div key={f.id} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm">{f.label}</p>
                              {f.description && (
                                <p className="text-xs text-muted-foreground">{f.description}</p>
                              )}
                            </div>
                            <Switch
                              checked={!!plan.features[f.id]}
                              onCheckedChange={() => toggleFeature(f.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Section 5: Discount */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Discount</h2>
            <Select
              value={plan.discountId || 'none'}
              onValueChange={(v) =>
                setPlan(
                  (prev) =>
                    prev && {
                      ...prev,
                      discountId: v === 'none' ? undefined : v,
                    },
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DISCOUNTS.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4 rounded-xl border border-destructive/30 bg-card p-6">
            <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Deactivate Plan</p>
                <p className="text-xs text-muted-foreground">
                  Existing subscribers keep access until billing period ends
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => setDeactivateOpen(true)}
                disabled={!plan.isActive}
              >
                Deactivate
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Plan</p>
                <p className="text-xs text-muted-foreground">
                  {subs > 0
                    ? `Cannot delete — ${subs} active subscribers`
                    : 'Permanently remove this plan'}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                disabled={subs > 0}
              >
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
        <Button variant="ghost" size="sm" onClick={() => router.push('/plans')}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate Plan"
        description={`Are you sure you want to deactivate "${plan.name}"? Existing subscribers will keep their access until their billing period ends.`}
        confirmLabel="Deactivate"
        variant="destructive"
        onConfirm={handleDeactivate}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Plan"
        description={`Are you sure you want to permanently delete "${plan.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
