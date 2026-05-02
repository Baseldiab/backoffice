'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CreditCard,
  Zap,
  Users,
  LayoutGrid,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Ban,
  MessageSquare,
  ShieldOff,
  X,
  Plus,
  MoreHorizontal,
  Calendar,
  Pencil,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DataTable } from '@/components/shared/DataTable';
import {
  MOCK_CUSTOMERS,
  type Company,
  type CompanyUser,
  type Widget,
  type CreditEntry,
  type Note,
  type Plan,
  type CompanyStatus,
  type UserRole,
  type AuditIconType,
} from '@/lib/mock/customers';
import { formatCurrency, formatRelativeDate, formatDate, cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type AuditCategory = 'Billing' | 'Content' | 'Security' | 'Account';
type TimelineFilter = 'All' | 'Billing' | 'Content' | 'Security';

interface TimelineEntry {
  id: string;
  date: string;
  action: string;
  actor: string;
  category: AuditCategory;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function planVariant(plan: Plan): 'inactive' | 'trial' | 'warning' | 'active' {
  if (plan === 'Starter') return 'inactive';
  if (plan === 'Pro') return 'trial';
  if (plan === 'Business') return 'warning';
  return 'active';
}

function maskToken(token: string): string {
  const parts = token.split('_');
  if (parts.length >= 3) return parts.slice(0, 2).join('_') + '_••••••••';
  return token.slice(0, 8) + '••••••••';
}

function getCategoryFromIconType(iconType: AuditIconType): AuditCategory {
  const map: Record<AuditIconType, AuditCategory> = {
    upgrade: 'Billing',
    payment: 'Billing',
    credit: 'Billing',
    user: 'Security',
    suspend: 'Security',
    widget: 'Content',
    note: 'Account',
  };
  return map[iconType] ?? 'Account';
}

const PLANS: Plan[] = ['Starter', 'Pro', 'Business', 'Enterprise'];

const PLATFORM_STYLES: Record<string, string> = {
  Web: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
  iOS: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Android: 'bg-green-500/10 text-green-400 border border-green-500/20',
  'React Native': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
};

const ROLE_STYLES: Record<UserRole, string> = {
  Owner: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  Admin: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Member: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
  Viewer: 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50',
};

const AUDIT_ICON_MAP: Record<AuditIconType, { icon: React.ElementType; cls: string }> = {
  upgrade: { icon: TrendingUp, cls: 'text-[#3ECF8E] bg-[#3ECF8E]/10' },
  payment: { icon: CreditCard, cls: 'text-[#3ECF8E] bg-[#3ECF8E]/10' },
  user: { icon: Users, cls: 'text-blue-400 bg-blue-500/10' },
  widget: { icon: LayoutGrid, cls: 'text-zinc-400 bg-zinc-800' },
  credit: { icon: Zap, cls: 'text-yellow-400 bg-yellow-500/10' },
  suspend: { icon: Ban, cls: 'text-red-400 bg-red-500/10' },
  note: { icon: MessageSquare, cls: 'text-zinc-400 bg-zinc-800' },
};

const CATEGORY_DOT: Record<AuditCategory, string> = {
  Billing: 'bg-[#3ECF8E]',
  Content: 'bg-blue-400',
  Security: 'bg-red-400',
  Account: 'bg-zinc-400',
};

const inputCls =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-[#3ECF8E]';

const TABS = ['Timeline', 'Users', 'Widgets', 'AI Credits', 'Audit Log'] as const;
type TabId = (typeof TABS)[number];

const TIMELINE_FILTERS: TimelineFilter[] = ['All', 'Billing', 'Content', 'Security'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

// ─── 404 state ───────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="flex h-80 flex-col items-center justify-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
        <ShieldOff className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="font-medium text-foreground">Company not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          This company doesn&apos;t exist or has been removed.
        </p>
      </div>
      <Link href="/customers">
        <Button variant="outline" size="sm" className="mt-1 text-xs">
          ← Back to Customers
        </Button>
      </Link>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

interface Props {
  params: { id: string };
}

export default function CustomerDetailPage({ params }: Props) {
  const base = MOCK_CUSTOMERS.find((c) => c.id === params.id);
  if (!base) return <NotFound />;
  return <CustomerDetail company={base} />;
}

function CustomerDetail({ company: base }: { company: Company }) {
  const [activeTab, setActiveTab] = useState<TabId>('Timeline');

  // Mutable state
  const [status, setStatus] = useState<CompanyStatus>(base.status);
  const [tags, setTags] = useState<string[]>(base.tags);
  const [notes, setNotes] = useState<Note[]>(base.notes);
  const [users, setUsers] = useState<CompanyUser[]>(base.users);
  const [creditHistory, setCreditHistory] = useState<CreditEntry[]>(base.creditHistory);
  const [creditsTotal, setCreditsTotal] = useState(base.creditsTotal);
  const [creditsUsed] = useState(base.creditsUsed);

  // UI state
  const [chartMode, setChartMode] = useState<'weekly' | 'monthly'>('weekly');
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('All');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Dialog state
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [addCreditsOpen, setAddCreditsOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [suspendUserId, setSuspendUserId] = useState<string | null>(null);

  // Form state
  const [selectedPlan, setSelectedPlan] = useState<Plan>(base.plan);
  const [creditsAmount, setCreditsAmount] = useState('');
  const [creditsReason, setCreditsReason] = useState('');
  const [noteText, setNoteText] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Edit state
  const [companyData, setCompanyData] = useState({
    industry: base.industry ?? '',
    companySize: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    vatNumber: '',
  });
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: base.name,
    domain: base.domain ?? '',
    industry: base.industry ?? '',
    companySize: '',
    country: base.countryName ?? '',
    website: '',
    email: '',
    phone: '',
    address: '',
    vatNumber: '',
    billingCycle: (base.billingCycle as string) ?? '',
    paymentMethod: '',
    phonePrefix: '+966',
  });

  // Computed
  const activeWidgets = base.widgets.filter((w) => w.status === 'active').length;
  const creditsRemaining = creditsTotal - creditsUsed;
  const creditsPct = Math.round((creditsUsed / creditsTotal) * 100);

  const chartData = base.impressionData;
  const totalImpressions = chartData.reduce((sum, d) => sum + d.impressions, 0);
  const avgCtr =
    chartData.length > 0 ? chartData.reduce((sum, d) => sum + d.ctr, 0) / chartData.length : 0;
  const trendImpressions =
    chartData.length >= 2 && chartData[0].impressions > 0
      ? ((chartData[chartData.length - 1].impressions - chartData[0].impressions) /
          chartData[0].impressions) *
        100
      : 0;
  const trendCtr =
    chartData.length >= 2 && chartData[0].ctr > 0
      ? ((chartData[chartData.length - 1].ctr - chartData[0].ctr) / chartData[0].ctr) * 100
      : 0;

  const timelineEntries = useMemo<TimelineEntry[]>(() => {
    return base.auditLog
      .map((entry) => ({
        id: entry.id,
        date: entry.date,
        action: entry.action,
        actor: entry.actor,
        category: getCategoryFromIconType(entry.iconType),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [base.auditLog]);

  const filteredTimeline = useMemo(
    () =>
      timelineFilter === 'All'
        ? timelineEntries
        : timelineEntries.filter((e) => e.category === timelineFilter),
    [timelineEntries, timelineFilter],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleSuspend() {
    setStatus('suspended');
    setSuspendOpen(false);
  }

  function handleUpgradePlan() {
    setUpgradeOpen(false);
  }

  function handleAddCredits() {
    const amount = parseInt(creditsAmount);
    if (isNaN(amount) || amount <= 0 || !creditsReason) return;
    const today = new Date().toISOString().split('T')[0];
    setCreditsTotal((t) => t + amount);
    setCreditHistory((prev) => [
      {
        id: `cr${Date.now()}`,
        date: today,
        action: 'added',
        amount,
        feature: creditsReason,
        balanceAfter: creditsTotal + amount - creditsUsed,
      },
      ...prev,
    ]);
    setCreditsAmount('');
    setCreditsReason('');
    setAddCreditsOpen(false);
  }

  function handleAddNote() {
    if (!noteText.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    setNotes((prev) => [
      { id: `n${Date.now()}`, content: noteText.trim(), author: 'You', date: today },
      ...prev,
    ]);
    setNoteText('');
    toast.success('Note added');
  }

  function deleteNote(noteId: string) {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    toast.success('Note deleted');
  }

  function handleSuspendUser() {
    if (!suspendUserId) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === suspendUserId ? { ...u, status: 'suspended' as const } : u)),
    );
    setSuspendUserId(null);
  }

  async function handleCopy(token: string) {
    await navigator.clipboard.writeText(token).catch(() => {});
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function commitNewTag() {
    const t = newTagInput.trim();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setNewTagInput('');
    setIsAddingTag(false);
  }

  function updateField(field: string, value: string) {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
    toast.success('Updated successfully');
  }

  function handleSaveDetails() {
    setCompanyData({
      industry: editForm.industry,
      companySize: editForm.companySize,
      website: editForm.website,
      email: editForm.email,
      phone: editForm.phone,
      address: editForm.address,
      vatNumber: editForm.vatNumber,
    });
    setEditDetailsOpen(false);
    toast.success('Company details saved');
  }

  // ── Column defs ────────────────────────────────────────────────────────────

  const userColumns = useMemo<ColumnDef<CompanyUser>[]>(
    () => [
      {
        id: 'name',
        header: 'Name',
        accessorFn: (r) => r.name,
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium text-foreground">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ getValue }) => {
          const role = getValue<UserRole>();
          return (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                ROLE_STYLES[role],
              )}
            >
              {role}
            </span>
          );
        },
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">
            {formatRelativeDate(getValue<string>())}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => <StatusBadge status={getValue<CompanyUser['status']>()} />,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Edit Role
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(['Owner', 'Admin', 'Member', 'Viewer'] as UserRole[]).map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() =>
                        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)))
                      }
                    >
                      {role}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="destructive"
                size="sm"
                className="text-xs"
                onClick={() => setSuspendUserId(user.id)}
              >
                Suspend
              </Button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const widgetColumns = useMemo<ColumnDef<Widget>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Widget Name',
        cell: ({ getValue }) => (
          <span className="font-medium text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'platform',
        header: 'Platform',
        cell: ({ getValue }) => {
          const platform = getValue<string>();
          return (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                PLATFORM_STYLES[platform] ?? 'bg-zinc-800 text-zinc-300 border border-zinc-700',
              )}
            >
              {platform}
            </span>
          );
        },
      },
      {
        accessorKey: 'sdkToken',
        header: 'SDK Token',
        cell: ({ row }) => {
          const token = row.original.sdkToken;
          const copied = copiedToken === token;
          return (
            <div className="flex items-center gap-2">
              <code className="font-mono text-xs text-muted-foreground">{maskToken(token)}</code>
              <button
                onClick={() => handleCopy(token)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-[#3ECF8E]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: 'storiesCount',
        header: 'Stories',
        cell: ({ getValue }) => (
          <span className="text-sm text-foreground">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => <StatusBadge status={getValue<Widget['status']>()} />,
      },
    ],
    [copiedToken],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/customers"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Customers
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">{base.name}</span>
      </div>

      {/* ── Header Card ─────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: avatar + name + domain + actions */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-base font-bold text-foreground">
              {initials(base.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold leading-tight text-foreground">{base.name}</h1>
                <StatusBadge status={status} />
                <StatusBadge status={planVariant(base.plan)} label={base.plan} />
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{base.domain}</p>
            </div>
          </div>

          {/* Right: suspend + ⋮ menu */}
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/50 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setSuspendOpen(true)}
              disabled={status === 'suspended'}
            >
              Suspend Account
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditDetailsOpen(true)}>
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAddNoteOpen(true)}>Add Note</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAddCreditsOpen(true)}>
                  Add Credits
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUpgradeOpen(true)}>
                  Upgrade Plan
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Impersonate (Super Admin only)</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Export Data</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ── Row 1: Details + Stat cards ─────────────────────────────────────── */}
      <div className="flex gap-4">
        {/* Details card */}
        <div className="min-w-0 flex-1 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Details</h3>
          <div className="space-y-0">
            {/* Company Name — readonly */}
            <div className="flex items-center justify-between border-b border-border/50 py-2">
              <span className="w-32 shrink-0 text-xs text-muted-foreground">Company Name</span>
              <span className="flex-1 text-sm text-foreground">{base.name}</span>
            </div>

            {/* Domain — readonly */}
            <div className="flex items-center justify-between border-b border-border/50 py-2">
              <span className="w-32 shrink-0 text-xs text-muted-foreground">Domain</span>
              <span className="flex-1 text-sm text-foreground">{base.domain}</span>
            </div>

            {/* Plan — readonly */}
            <div className="flex items-center justify-between border-b border-border/50 py-2">
              <span className="w-32 shrink-0 text-xs text-muted-foreground">Plan</span>
              <div className="flex-1">
                <StatusBadge status={planVariant(base.plan)} label={base.plan} />
              </div>
            </div>

            {/* Status — readonly */}
            <div className="flex items-center justify-between border-b border-border/50 py-2">
              <span className="w-32 shrink-0 text-xs text-muted-foreground">Status</span>
              <div className="flex-1">
                <StatusBadge status={status} />
              </div>
            </div>

            {/* Country — readonly */}
            <div className="flex items-center justify-between border-b border-border/50 py-2">
              <span className="w-32 shrink-0 text-xs text-muted-foreground">Country</span>
              <span className="flex-1 text-sm text-foreground">
                {base.countryFlag} {base.countryName}
              </span>
            </div>

            {/* Inline-editable fields */}
            {(
              [
                { label: 'Industry', field: 'industry' },
                { label: 'Company Size', field: 'companySize' },
                { label: 'Website', field: 'website' },
                { label: 'Email', field: 'email' },
                { label: 'Phone', field: 'phone' },
                { label: 'Address', field: 'address' },
                { label: 'VAT Number', field: 'vatNumber' },
              ] as const
            ).map(({ label, field }) => {
              const value = companyData[field];
              return (
                <div
                  key={field}
                  className="group flex items-center justify-between border-b border-border/50 py-2"
                >
                  <span className="w-32 shrink-0 text-xs text-muted-foreground">{label}</span>
                  {isEditing === field ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        autoFocus
                        defaultValue={value}
                        onBlur={(e) => {
                          updateField(field, e.target.value);
                          setIsEditing(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.currentTarget.blur();
                          if (e.key === 'Escape') setIsEditing(null);
                        }}
                        className="h-7 flex-1 rounded border border-primary bg-muted px-2 text-sm focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center gap-2">
                      {value ? (
                        <span className="flex-1 text-sm">{value}</span>
                      ) : (
                        <button
                          onClick={() => setIsEditing(field)}
                          className="flex items-center gap-1 text-sm italic text-muted-foreground/40 transition-colors hover:text-muted-foreground"
                        >
                          <Plus className="h-3 w-3" />
                          Add {label.toLowerCase()}
                        </button>
                      )}
                      {value && (
                        <button
                          onClick={() => setIsEditing(field)}
                          className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                          aria-label={`Edit ${label}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Tags */}
            <div className="pt-3">
              <p className="mb-1.5 text-xs text-muted-foreground">Tags</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove tag ${tag}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {isAddingTag ? (
                  <input
                    autoFocus
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitNewTag();
                      if (e.key === 'Escape') {
                        setNewTagInput('');
                        setIsAddingTag(false);
                      }
                    }}
                    onBlur={commitNewTag}
                    placeholder="Tag name…"
                    className="h-6 w-24 rounded-full border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-[#3ECF8E]"
                  />
                ) : (
                  <button
                    onClick={() => setIsAddingTag(true)}
                    className="flex items-center gap-0.5 rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Plus className="h-3 w-3" />
                    Add Tag
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards column */}
        <div className="flex w-52 shrink-0 flex-col gap-3">
          {/* Last Payment */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <p className="text-xs text-muted-foreground">Last Payment</p>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-lg font-bold tabular-nums text-foreground">
              {base.lastPayment ? formatCurrency(base.lastPayment.amountCents / 100) : '—'}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {base.lastPayment ? formatRelativeDate(base.lastPayment.date) : 'No payments yet'}
            </p>
          </div>

          {/* Active Widgets */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <p className="text-xs text-muted-foreground">Active Widgets</p>
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-lg font-bold tabular-nums text-foreground">{activeWidgets}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">of {base.widgets.length} total</p>
          </div>

          {/* Member Since */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <p className="text-xs text-muted-foreground">Member Since</p>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-sm font-bold text-foreground">
              {formatDate(base.registeredAt)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatRelativeDate(base.registeredAt)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Notes ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Internal Notes</h3>

        {/* Notes list */}
        <div className="mb-3 space-y-3">
          {notes.length === 0 ? (
            <p className="text-xs italic text-muted-foreground">No notes yet</p>
          ) : (
            [...notes]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((note) => (
                <div key={note.id} className="group flex gap-2">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
                    {note.author.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <span className="text-xs font-medium text-foreground">{note.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(note.date), { addSuffix: true })}
                      </span>
                      <button
                        onClick={() => deleteNote(note.id)}
                        aria-label="Delete note"
                        className="ml-auto opacity-0 text-muted-foreground transition-opacity hover:text-destructive group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{note.content}</p>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Compact add note — single row */}
        <div className="flex items-center gap-2 border-t border-border pt-3">
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && noteText.trim()) handleAddNote();
            }}
            placeholder="Add a note... (Enter to save)"
            className="h-8 flex-1 rounded-lg border border-border bg-muted px-3 text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddNote}
            disabled={!noteText.trim()}
            className="h-8 shrink-0 px-3 text-xs"
          >
            Save
          </Button>
        </div>
      </div>

      {/* ── Row 2: Usage Chart ───────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Story Impressions</h3>
          <div className="flex items-center gap-2">
            {/* Weekly / Monthly toggle */}
            <div className="flex overflow-hidden rounded-md border border-border">
              {(['weekly', 'monthly'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setChartMode(mode)}
                  className={cn(
                    'px-3 py-1 text-xs capitalize transition-colors',
                    chartMode === mode
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {mode === 'weekly' ? 'Weekly' : 'Monthly'}
                </button>
              ))}
            </div>
            <Select defaultValue="6w">
              <SelectTrigger className="h-7 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6w">Last 6 weeks</SelectItem>
                <SelectItem value="12w">Last 12 weeks</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metrics row */}
        <div className="mb-4 flex gap-8">
          <div>
            <p className="text-xs text-muted-foreground">Total Impressions</p>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-xl font-bold tabular-nums text-foreground">
                {totalImpressions.toLocaleString()}
              </p>
              <TrendBadge value={trendImpressions} />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg CTR</p>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-xl font-bold tabular-nums text-foreground">{avgCtr.toFixed(1)}%</p>
              <TrendBadge value={trendCtr} />
            </div>
          </div>
        </div>

        {/* Area chart */}
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="fillImpressions" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v))}
            />
            <RechartsTooltip content={<ChartTooltip />} cursor={false} />
            <Area
              type="natural"
              dataKey="impressions"
              strokeWidth={1.5}
              stroke="hsl(var(--chart-1))"
              fill="url(#fillImpressions)"
              dot={false}
              activeDot={{ r: 3, fill: 'hsl(var(--chart-1))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Row 3: Tabs ─────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Tab bar */}
        <div className="flex border-b border-border">
          {TABS.map((tab) => {
            const count =
              tab === 'Timeline'
                ? timelineEntries.length
                : tab === 'Users'
                  ? users.length
                  : tab === 'Widgets'
                    ? base.widgets.length
                    : tab === 'Audit Log'
                      ? base.auditLog.length
                      : null;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex items-center gap-1.5 px-4 pb-2.5 pt-3 text-sm transition-colors',
                  activeTab === tab
                    ? 'border-b-2 border-[#3ECF8E] font-medium text-[#3ECF8E]'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab}
                {count !== null && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                      activeTab === tab
                        ? 'bg-[#3ECF8E]/10 text-[#3ECF8E]'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {/* ── Tab: Timeline ──────────────────────────────────────────────── */}
          {activeTab === 'Timeline' && (
            <div>
              {/* Filter pills */}
              <div className="mb-5 flex gap-2">
                {TIMELINE_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setTimelineFilter(f)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      timelineFilter === f
                        ? 'border-border bg-muted text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {filteredTimeline.length > 0 ? (
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute bottom-2 left-[5px] top-2 w-px bg-border" />
                  <div className="space-y-0">
                    {filteredTimeline.map((entry) => (
                      <div key={entry.id} className="relative flex gap-4 pb-5 last:pb-0">
                        <div
                          className={cn(
                            'relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full',
                            CATEGORY_DOT[entry.category],
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{entry.action}</p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{entry.actor}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{entry.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={<MessageSquare className="h-5 w-5 text-muted-foreground" />}
                  message="No timeline events"
                  detail="Account activity will appear here."
                />
              )}
            </div>
          )}

          {/* ── Tab: Users ─────────────────────────────────────────────────── */}
          {activeTab === 'Users' && (
            <>
              {users.length > 0 ? (
                <DataTable
                  columns={userColumns}
                  data={users}
                  pageSize={10}
                  emptyMessage="No users found."
                />
              ) : (
                <EmptyState
                  icon={<Users className="h-5 w-5 text-muted-foreground" />}
                  message="No users yet"
                  detail="Users will appear here once they are invited."
                />
              )}
            </>
          )}

          {/* ── Tab: Widgets ───────────────────────────────────────────────── */}
          {activeTab === 'Widgets' && (
            <>
              {base.widgets.length > 0 ? (
                <DataTable
                  columns={widgetColumns}
                  data={base.widgets}
                  pageSize={10}
                  emptyMessage="No widgets found."
                />
              ) : (
                <EmptyState
                  icon={<LayoutGrid className="h-5 w-5 text-muted-foreground" />}
                  message="No widgets yet"
                  detail="Widgets will appear here once the SDK is integrated."
                />
              )}
            </>
          )}

          {/* ── Tab: AI Credits ────────────────────────────────────────────── */}
          {activeTab === 'AI Credits' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Credit Usage</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {creditsUsed.toLocaleString()} used of {creditsTotal.toLocaleString()} total (
                      {creditsPct}%)
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#3ECF8E] text-xs text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
                    onClick={() => setAddCreditsOpen(true)}
                  >
                    Add Credits
                  </Button>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-[#3ECF8E] transition-all"
                    style={{ width: `${Math.min(creditsPct, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {creditsRemaining.toLocaleString()} credits remaining
                </p>
              </div>

              {creditHistory.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {['Date', 'Action', 'Amount', 'Feature', 'Balance After'].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                      {creditHistory.map((entry) => (
                        <tr key={entry.id} className="transition-colors hover:bg-card/60">
                          <td className="px-4 py-3 text-sm text-muted-foreground">{entry.date}</td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              status={
                                entry.action === 'used'
                                  ? 'error'
                                  : entry.action === 'added'
                                    ? 'active'
                                    : 'warning'
                              }
                              label={entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                            />
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={entry.amount > 0 ? 'text-[#3ECF8E]' : 'text-red-400'}>
                              {entry.amount > 0 ? '+' : ''}
                              {entry.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">{entry.feature}</td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {entry.balanceAfter.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon={<Zap className="h-5 w-5 text-muted-foreground" />}
                  message="No credit history"
                  detail="Credit usage and top-ups will appear here."
                />
              )}
            </div>
          )}

          {/* ── Tab: Audit Log ─────────────────────────────────────────────── */}
          {activeTab === 'Audit Log' && (
            <>
              {base.auditLog.length > 0 ? (
                <div className="relative space-y-0">
                  <div className="absolute bottom-2 left-[17px] top-2 w-px bg-border" />
                  {base.auditLog.map((entry) => {
                    const { icon: Icon, cls } =
                      AUDIT_ICON_MAP[entry.iconType] ?? AUDIT_ICON_MAP.note;
                    return (
                      <div key={entry.id} className="relative flex gap-4 pb-5 last:pb-0">
                        <div
                          className={cn(
                            'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                            cls,
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-sm font-medium text-foreground">{entry.action}</p>
                          <div className="mt-1 flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{entry.actor}</span>
                            <span className="text-xs text-muted-foreground">{entry.date}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={<MessageSquare className="h-5 w-5 text-muted-foreground" />}
                  message="No audit events"
                  detail="Account activity will be logged here."
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Dialogs ─────────────────────────────────────────────────────────── */}

      <ConfirmDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        title="Suspend Account"
        description={`Suspending ${base.name} will immediately revoke platform access for all users. This can be reversed.`}
        confirmLabel="Suspend"
        onConfirm={handleSuspend}
      />

      <ConfirmDialog
        open={!!suspendUserId}
        onOpenChange={(o) => !o && setSuspendUserId(null)}
        title="Suspend User"
        description={`This will revoke access for ${users.find((u) => u.id === suspendUserId)?.name ?? 'this user'}. They will not be able to log in until reinstated.`}
        confirmLabel="Suspend User"
        onConfirm={handleSuspendUser}
      />

      {/* Edit Details Drawer */}
      <Sheet open={editDetailsOpen} onOpenChange={setEditDetailsOpen}>
        <SheetContent side="right" className="w-[480px] flex flex-col p-0">
          <SheetHeader className="shrink-0 px-6 py-4 border-b border-border">
            <SheetTitle>Edit Company Details</SheetTitle>
          </SheetHeader>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Section: Basic Info */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Basic Info
              </p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Company Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Domain</label>
                  <input
                    value={editForm.domain}
                    onChange={(e) => setEditForm((f) => ({ ...f, domain: e.target.value }))}
                    placeholder="e.g. acme.com"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Industry
                  </label>
                  <select
                    value={editForm.industry}
                    onChange={(e) => setEditForm((f) => ({ ...f, industry: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Select industry</option>
                    {[
                      'E-commerce',
                      'Retail',
                      'F&B',
                      'Real Estate',
                      'Healthcare',
                      'Education',
                      'Tech',
                      'Other',
                    ].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Company Size
                  </label>
                  <select
                    value={editForm.companySize}
                    onChange={(e) => setEditForm((f) => ({ ...f, companySize: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Select size</option>
                    {['1-10', '11-50', '51-200', '201-500', '500+'].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Country
                  </label>
                  <select
                    value={editForm.country}
                    onChange={(e) => setEditForm((f) => ({ ...f, country: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Select country</option>
                    {[
                      { code: 'SA', label: '🇸🇦 Saudi Arabia' },
                      { code: 'AE', label: '🇦🇪 UAE' },
                      { code: 'KW', label: '🇰🇼 Kuwait' },
                      { code: 'QA', label: '🇶🇦 Qatar' },
                      { code: 'BH', label: '🇧🇭 Bahrain' },
                      { code: 'OM', label: '🇴🇲 Oman' },
                    ].map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Website
                  </label>
                  <input
                    value={editForm.website}
                    onChange={(e) => setEditForm((f) => ({ ...f, website: e.target.value }))}
                    placeholder="https://example.com"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Section: Contact */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Contact
              </p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Primary Email
                  </label>
                  <input
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    type="email"
                    placeholder="contact@company.com"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={editForm.phonePrefix}
                      onChange={(e) => setEditForm((f) => ({ ...f, phonePrefix: e.target.value }))}
                      className="w-28 rounded-md border border-border bg-background px-2 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-[#3ECF8E]"
                    >
                      {['+966', '+971', '+965', '+974'].map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <input
                      value={editForm.phone}
                      onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="5xxxxxxxx"
                      className={cn(inputCls, 'flex-1')}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Address
                  </label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                    rows={2}
                    placeholder="Street, City, Country"
                    className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-[#3ECF8E]"
                  />
                </div>
              </div>
            </div>

            {/* Section: Billing */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Billing
              </p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    VAT Registration Number
                  </label>
                  <input
                    value={editForm.vatNumber}
                    onChange={(e) => setEditForm((f) => ({ ...f, vatNumber: e.target.value }))}
                    placeholder="e.g. 300000000000003"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Billing Cycle
                  </label>
                  <select
                    value={editForm.billingCycle}
                    onChange={(e) => setEditForm((f) => ({ ...f, billingCycle: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Select cycle</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Payment Method
                  </label>
                  <select
                    value={editForm.paymentMethod}
                    onChange={(e) => setEditForm((f) => ({ ...f, paymentMethod: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Select method</option>
                    {['Mada', 'STC Pay', 'Stripe', 'PayTabs', 'KNET'].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="shrink-0 flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-card">
            <Button variant="ghost" onClick={() => setEditDetailsOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!editForm.name.trim()} onClick={handleSaveDetails}>
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Upgrade Plan */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Upgrade Plan</DialogTitle>
            <DialogDescription>
              Select a new plan for <span className="font-medium text-foreground">{base.name}</span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="py-1">
            <label className="mb-1.5 block text-xs font-medium text-foreground">Plan</label>
            <Select value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as Plan)}>
              <SelectTrigger className="h-9 w-full text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLANS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUpgradeOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
              onClick={handleUpgradePlan}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Credits */}
      <Dialog open={addCreditsOpen} onOpenChange={setAddCreditsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add AI Credits</DialogTitle>
            <DialogDescription>
              Add credits to <span className="font-medium text-foreground">{base.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Amount *</label>
              <input
                type="number"
                value={creditsAmount}
                onChange={(e) => setCreditsAmount(e.target.value)}
                placeholder="e.g. 5000"
                min="1"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Reason *</label>
              <input
                value={creditsReason}
                onChange={(e) => setCreditsReason(e.target.value)}
                placeholder="e.g. Goodwill top-up"
                className={inputCls}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddCreditsOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
              onClick={handleAddCredits}
              disabled={!creditsAmount || parseInt(creditsAmount) <= 0 || !creditsReason.trim()}
            >
              Add Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note */}
      <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Leave an internal note on{' '}
              <span className="font-medium text-foreground">{base.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-1">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your note here…"
              rows={4}
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-[#3ECF8E]"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddNoteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
              onClick={handleAddNote}
              disabled={!noteText.trim()}
            >
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Trend badge ─────────────────────────────────────────────────────────────

function TrendBadge({ value }: { value: number }) {
  if (Math.abs(value) < 0.5) return null;
  const positive = value > 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
        positive ? 'bg-[#3ECF8E]/10 text-[#3ECF8E]' : 'bg-destructive/10 text-destructive',
      )}
    >
      {positive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
      {positive ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({
  icon,
  message,
  detail,
}: {
  icon: React.ReactNode;
  message: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-14">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
