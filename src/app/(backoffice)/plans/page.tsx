'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_PLANS } from '@/lib/mock/plans';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Eye, LayoutGrid, Users, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_SUBSCRIBERS: Record<string, number> = {
  starter: 342,
  pro: 891,
  business: 234,
  enterprise: 56,
};

export default function PlansPage() {
  const [plans, setPlans] = useState(MOCK_PLANS);

  const toggleActive = (id: string) => {
    const plan = plans.find((p) => p.id === id);
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
    toast.success(`${plan?.name} ${plan?.isActive ? 'deactivated' : 'activated'}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plans</h1>
          <p className="text-sm text-muted-foreground">Manage subscription plans and pricing</p>
        </div>
        <Button asChild>
          <Link href="/plans/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Link>
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const savings =
            plan.monthlyPrice > 0
              ? Math.round(((plan.monthlyPrice - plan.annualPrice) / plan.monthlyPrice) * 100)
              : 0;
          const subs = MOCK_SUBSCRIBERS[plan.id] ?? 0;

          return (
            <div
              key={plan.id}
              className="flex flex-col rounded-xl border border-border bg-card p-5"
            >
              {/* Name + Popular + Toggle */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{plan.name}</span>
                  {plan.isPopular && (
                    <Badge className="border-primary/20 bg-primary/10 text-[10px] text-primary">
                      Popular
                    </Badge>
                  )}
                </div>
                <Switch
                  checked={plan.isActive}
                  onCheckedChange={() => toggleActive(plan.id)}
                  aria-label={`Toggle ${plan.name} active`}
                />
              </div>

              {/* Pricing */}
              <div className="mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">${plan.monthlyPrice}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  ${plan.annualPrice}/mo billed annually
                </p>
                {savings > 0 && <p className="mt-0.5 text-xs text-primary">Save {savings}%</p>}
              </div>

              <Separator className="my-3" />

              {/* Limits */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-3.5 w-3.5 shrink-0" />
                  <span>Impressions/mo</span>
                  <span className="ml-auto font-medium text-foreground">
                    {plan.limits.impressionsPerMonth === 'unlimited'
                      ? 'Unlimited'
                      : plan.limits.impressionsPerMonth.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
                  <span>Active Widgets</span>
                  <span className="ml-auto font-medium text-foreground">
                    {plan.limits.activeWidgets === 'unlimited'
                      ? 'Unlimited'
                      : plan.limits.activeWidgets}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span>Team Members</span>
                  <span className="ml-auto font-medium text-foreground">
                    {plan.limits.teamMembers === 'unlimited'
                      ? 'Unlimited'
                      : plan.limits.teamMembers}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span>AI Credits</span>
                  <span className="ml-auto font-medium text-foreground">
                    {plan.limits.aiCreditsPerMonth.toLocaleString()}
                  </span>
                </div>
              </div>

              <Separator className="my-3" />

              {/* Subscribers */}
              <p className="text-xs text-muted-foreground">{subs} subscribers</p>

              {/* Edit Link */}
              <Button variant="link" className="mt-auto h-auto justify-start px-0 pt-2" asChild>
                <Link href={`/plans/${plan.id}/edit`}>Edit Plan &rarr;</Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
