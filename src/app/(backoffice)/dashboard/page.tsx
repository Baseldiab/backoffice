'use client';

import Link from 'next/link';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Users,
  Ticket,
  Zap,
  DollarSign,
  CalendarDays,
  UserPlus,
  Building2,
  Receipt,
  Activity,
  Flag,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/shared/StatCard';
import { cn } from '@/lib/utils';
import { MOCK_CUSTOMERS } from '@/lib/mock/customers';
import { MOCK_TICKETS } from '@/lib/mock/support';
import { MOCK_TEAM } from '@/lib/mock/team';

// ─── Static derived data ──────────────────────────────────────────────────────

const mrr = MOCK_CUSTOMERS.filter((c) => c.status === 'active').reduce(
  (sum, c) => sum + c.mrrCents / 100,
  0,
);
const arr = mrr * 12;
const activeSubscriptions = MOCK_CUSTOMERS.filter((c) => c.status === 'active').length;
const openTickets = MOCK_TICKETS.filter((t) => t.status === 'Open').length;
const pendingInvitations = MOCK_TEAM.filter((m) => m.status === 'Pending').length;
const aiCreditsToday = 1240;

// Revenue trend — 6 months of mock data
const REVENUE_TREND = [
  { month: 'Nov', revenue: 6120 },
  { month: 'Dec', revenue: 6840 },
  { month: 'Jan', revenue: 7200 },
  { month: 'Feb', revenue: 7680 },
  { month: 'Mar', revenue: 7950 },
  { month: 'Apr', revenue: Math.round(mrr) },
];

// Subscriptions by plan
const planCounts: Record<string, number> = {};
MOCK_CUSTOMERS.filter((c) => c.status === 'active').forEach((c) => {
  planCounts[c.plan] = (planCounts[c.plan] ?? 0) + 1;
});
const PLAN_DATA = [
  { plan: 'Starter', count: planCounts['Starter'] ?? 0 },
  { plan: 'Pro', count: planCounts['Pro'] ?? 0 },
  { plan: 'Business', count: planCounts['Business'] ?? 0 },
  { plan: 'Enterprise', count: planCounts['Enterprise'] ?? 0 },
];
const BAR_COLORS = [
  'hsl(var(--chart-3))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-1))',
  'hsl(var(--chart-4))',
];

// Recent customers — last 5 active
const RECENT_CUSTOMERS = [...MOCK_CUSTOMERS]
  .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
  .slice(0, 5);

// Recent tickets — last 5
const RECENT_TICKETS = MOCK_TICKETS.slice(0, 5);

// Activity feed — 8 mixed events
const ACTIVITY_FEED = [
  {
    id: 1,
    type: 'customer',
    icon: Building2,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    description: 'New customer Noon Commerce signed up on Enterprise plan',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'ticket',
    icon: Ticket,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    description: 'Support ticket TKT-2026-006 opened — Analytics showing zero impressions',
    time: '3 hours ago',
  },
  {
    id: 3,
    type: 'payment',
    icon: CreditCard,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    description: 'Payment of $2,999 received from Noon Commerce',
    time: '5 hours ago',
  },
  {
    id: 4,
    type: 'invite',
    icon: Mail,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    description: 'Team invite sent to Nora Al-Zahrani (Support Agent)',
    time: '6 hours ago',
  },
  {
    id: 5,
    type: 'payment',
    icon: CreditCard,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    description: 'Payment of $499 received from AlRajhi Digital',
    time: '8 hours ago',
  },
  {
    id: 6,
    type: 'customer',
    icon: Building2,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    description: 'STC Pay upgraded from Pro to Business plan',
    time: '1 day ago',
  },
  {
    id: 7,
    type: 'ticket',
    icon: Ticket,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    description: 'Ticket TKT-2026-004 resolved — Invoice amount mismatch',
    time: '1 day ago',
  },
  {
    id: 8,
    type: 'invite',
    icon: Mail,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    description: 'Team invite sent to Faisal Al-Mutairi (Content Manager)',
    time: '2 days ago',
  },
];

const QUICK_ACTIONS = [
  { label: 'Invite Team Member', icon: UserPlus, href: '/team/invite' },
  { label: 'Add Company', icon: Building2, href: '/customers' },
  { label: 'View Billing Reports', icon: Receipt, href: '/billing' },
  { label: 'Check System Health', icon: Activity, href: '/monitoring' },
  { label: 'Manage Feature Flags', icon: Flag, href: '/settings/feature-flags' },
];

const SYSTEM_SERVICES = ['API', 'Database', 'CDN', 'Payment Gateway', 'AI Service'] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const PLAN_BADGE: Record<string, string> = {
  Starter: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  Pro: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Business: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Enterprise: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const PRIORITY_BADGE: Record<string, string> = {
  Urgent: 'bg-red-500/10 text-red-500 border-red-500/20',
  High: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Low: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const STATUS_BADGE: Record<string, string> = {
  Open: 'bg-[#3ECF8E]/10 text-[#3ECF8E] border-[#3ECF8E]/20',
  Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Resolved: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Closed: 'bg-muted text-muted-foreground border-border',
};

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
        colorClass,
      )}
    >
      {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-background">
      {/* ── 1. Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Welcome back — here&#39;s what&#39;s happening today
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          Monday, April 13, 2026
        </div>
      </div>

      {/* ── 2. KPI Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="MRR"
          value={`$${mrr.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          description="Monthly Recurring Revenue"
          icon={DollarSign}
          trend={{ value: 8.3, label: 'vs last month' }}
        />
        <StatCard
          title="ARR"
          value={`$${arr.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          description="Annual Recurring Revenue"
          icon={DollarSign}
        />
        <StatCard
          title="Active Subscriptions"
          value={activeSubscriptions}
          description="Paying accounts"
          icon={Users}
        />
        <StatCard
          title="Open Support Tickets"
          value={openTickets}
          description="Awaiting response"
          icon={Ticket}
          className={openTickets > 0 ? 'border-destructive/30' : undefined}
        />
        <StatCard
          title="Pending Invitations"
          value={pendingInvitations}
          description="Team members not yet joined"
          icon={UserPlus}
          className={pendingInvitations > 0 ? 'border-yellow-500/30' : undefined}
        />
        <StatCard
          title="AI Credits Used Today"
          value={aiCreditsToday.toLocaleString()}
          description="Across all customers"
          icon={Zap}
        />
      </div>

      {/* ── 3. Charts ──────────────────────────────────────────────────────── */}
      <div className="flex gap-4">
        {/* Revenue Trend */}
        <div className="flex-1 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-1 text-sm font-medium text-foreground">Revenue Trend</h3>
          <p className="mb-4 text-xs text-muted-foreground">MRR over the last 6 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                strokeOpacity={0.4}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'MRR']}
              />
              <Area
                type="natural"
                dataKey="revenue"
                strokeWidth={1.5}
                stroke="hsl(var(--chart-1))"
                fill="url(#revGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subscriptions by Plan */}
        <div className="w-80 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-1 text-sm font-medium text-foreground">Subscriptions by Plan</h3>
          <p className="mb-4 text-xs text-muted-foreground">Active accounts per tier</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PLAN_DATA} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                strokeOpacity={0.4}
              />
              <XAxis
                dataKey="plan"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value) => [value, 'Accounts']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {PLAN_DATA.map((_, index) => (
                  <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 4. Three columns ───────────────────────────────────────────────── */}
      <div className="flex gap-4">
        {/* Recent Customers */}
        <div className="flex-1 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-medium text-foreground">Recent Customers</h3>
          <div className="flex flex-col gap-3">
            {RECENT_CUSTOMERS.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                  {getInitials(c.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                  <Badge label={c.plan} colorClass={PLAN_BADGE[c.plan]} />
                </div>
                <span className="shrink-0 font-mono text-xs font-medium text-[#3ECF8E]">
                  ${(c.mrrCents / 100).toLocaleString()}
                </span>
                <Link
                  href={`/customers/${c.id}`}
                  className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
          <Link
            href="/customers"
            className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View all customers <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Recent Support Tickets */}
        <div className="flex-1 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-medium text-foreground">Recent Support Tickets</h3>
          <div className="flex flex-col gap-3">
            {RECENT_TICKETS.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {t.ticketNumber}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm text-foreground">{t.subject}</p>
                <Badge label={t.priority} colorClass={PRIORITY_BADGE[t.priority]} />
                <Badge label={t.status} colorClass={STATUS_BADGE[t.status]} />
              </div>
            ))}
          </div>
          <Link
            href="/support"
            className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View all tickets <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="w-64 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-medium text-foreground">Quick Actions</h3>
          <div className="flex flex-col gap-1">
            {QUICK_ACTIONS.map(({ label, icon: Icon, href }) => (
              <Button
                key={label}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link href={href}>
                  <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. Bottom row ──────────────────────────────────────────────────── */}
      <div className="flex gap-4">
        {/* Activity Feed */}
        <div className="flex-1 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-medium text-foreground">Recent Activity</h3>
          <div className="flex flex-col gap-3">
            {ACTIVITY_FEED.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={cn(
                      'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                      item.bg,
                    )}
                  >
                    <Icon className={cn('h-3.5 w-3.5', item.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground/90">{item.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="w-72 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-medium text-foreground">System Status</h3>
          <div className="flex flex-col gap-3">
            {SYSTEM_SERVICES.map((service) => (
              <div key={service} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{service}</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#3ECF8E]" />
                  <span className="text-xs text-[#3ECF8E]">Operational</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Last checked: 2 minutes ago</p>
          <Link
            href="/monitoring"
            className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View Monitoring <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
