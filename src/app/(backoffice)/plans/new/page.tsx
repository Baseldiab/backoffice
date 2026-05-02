'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PLAN_FEATURES } from '@/lib/mock/plans';
import type { Plan, PlanFeature } from '@/lib/mock/plans';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
import { ArrowLeft, Save } from 'lucide-react';
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

export default function NewPlanPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [annualPrice, setAnnualPrice] = useState(0);
  const [limits, setLimits] = useState<Plan['limits']>({
    impressionsPerMonth: 0,
    activeWidgets: 0,
    teamMembers: 0,
    aiCreditsPerMonth: 0,
    customDomains: 0,
    dataRetentionDays: 30,
  });
  const [features, setFeatures] = useState<Record<string, boolean | number | string>>(
    Object.fromEntries(PLAN_FEATURES.map((f) => [f.id, false])),
  );
  const [discountId, setDiscountId] = useState('none');

  const savings =
    monthlyPrice > 0 ? Math.round(((monthlyPrice - annualPrice) / monthlyPrice) * 100) : 0;

  const updateLimit = (key: string, value: number | 'unlimited') => {
    setLimits((prev) => ({ ...prev, [key]: value }) as Plan['limits']);
  };

  const toggleFeature = (id: string) => {
    setFeatures((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Plan name is required');
      return;
    }
    toast.success(`Plan "${name}" created successfully`);
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
            <h1 className="text-2xl font-bold tracking-tight">Create New Plan</h1>
          </div>
          {/* Section 1: Basic Info */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Basic Info</h2>
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pro, Business, Enterprise"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              <Switch checked={isPopular} onCheckedChange={setIsPopular} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Status</Label>
                <p className="text-xs text-muted-foreground">
                  {isActive ? 'Visible to customers' : 'Hidden from customers'}
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
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
                    value={monthlyPrice || ''}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
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
                    value={annualPrice || ''}
                    onChange={(e) => setAnnualPrice(Number(e.target.value))}
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
                const val = limits[lf.key];
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
                const enabled = catFeatures.filter((f) => features[f.id]).length;
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
                              checked={!!features[f.id]}
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
            <Select value={discountId} onValueChange={setDiscountId}>
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
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border bg-card px-6 py-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/plans')}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleCreate}>
          <Save className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>
    </div>
  );
}
