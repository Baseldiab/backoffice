'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Building2,
  Kanban,
  CreditCard,
  Tag,
  LayoutTemplate,
  Users,
  Shield,
  Flag,
  KeyRound,
  Settings,
  ChevronLeft,
  ChevronRight,
  History,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Archive,
  RotateCcw,
  Power,
  PowerOff,
  UserPlus,
  UserMinus,
  Move,
  Download,
  Copy,
  Send,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  MOCK_ACTIVITY_LOG,
  type ActivityLog,
  type ActivityModule,
  type ActivityAction,
} from '@/lib/mock/activity-log';

/* ─── Module config ─── */
const MODULE_CONFIG: Record<
  ActivityModule,
  { label: string; icon: React.ElementType; color: string }
> = {
  customer: { label: 'Customer', icon: Building2, color: 'text-blue-400' },
  deal: { label: 'Deal', icon: Kanban, color: 'text-purple-400' },
  plan: { label: 'Plan', icon: CreditCard, color: 'text-cyan-400' },
  discount: { label: 'Discount', icon: Tag, color: 'text-amber-400' },
  template: { label: 'Template', icon: LayoutTemplate, color: 'text-pink-400' },
  team: { label: 'Team', icon: Users, color: 'text-emerald-400' },
  role: { label: 'Role', icon: Shield, color: 'text-orange-400' },
  billing: { label: 'Billing', icon: CreditCard, color: 'text-teal-400' },
  'feature-flag': { label: 'Feature Flag', icon: Flag, color: 'text-yellow-400' },
  'api-key': { label: 'API Key', icon: KeyRound, color: 'text-red-400' },
  settings: { label: 'Settings', icon: Settings, color: 'text-zinc-400' },
};

const ACTION_CONFIG: Record<
  ActivityAction,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  created: {
    label: 'Created',
    icon: Plus,
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  updated: {
    label: 'Updated',
    icon: Pencil,
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  deleted: {
    label: 'Deleted',
    icon: Trash2,
    badgeClass: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    badgeClass: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  },
  restored: {
    label: 'Restored',
    icon: RotateCcw,
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  activated: {
    label: 'Activated',
    icon: Power,
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  deactivated: {
    label: 'Deactivated',
    icon: PowerOff,
    badgeClass: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  },
  assigned: {
    label: 'Assigned',
    icon: UserPlus,
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  moved: {
    label: 'Moved',
    icon: Move,
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  exported: {
    label: 'Exported',
    icon: Download,
    badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  },
  invited: {
    label: 'Invited',
    icon: UserPlus,
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  removed: {
    label: 'Removed',
    icon: UserMinus,
    badgeClass: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  published: {
    label: 'Published',
    icon: Send,
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  duplicated: {
    label: 'Duplicated',
    icon: Copy,
    badgeClass: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  },
};

/* ─── Helpers ─── */
function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date('2026-05-04');
  const yesterday = new Date('2026-05-03');

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) return 'Today';
  if (sameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getDateKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const ITEMS_PER_PAGE = 25;

/* ─── Date range helper ─── */
function getDateThreshold(filter: string): Date {
  const now = new Date('2026-05-04T23:59:59Z');
  switch (filter) {
    case '1d':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '3d':
      return new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '1m': {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      return d;
    }
    case '3m': {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 3);
      return d;
    }
    case '1y': {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      return d;
    }
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

/* ─── Page ─── */
export default function ActivityLogPage() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [actorFilter, setActorFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('7d');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Unique actors
  const actors = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    for (const a of MOCK_ACTIVITY_LOG) {
      if (!map.has(a.actor.id)) map.set(a.actor.id, { id: a.actor.id, name: a.actor.name });
    }
    return Array.from(map.values());
  }, []);

  // Filtered
  const filtered = useMemo(() => {
    const threshold = getDateThreshold(dateFilter);
    return MOCK_ACTIVITY_LOG.filter((a) => {
      const activityDate = new Date(a.timestamp);
      if (activityDate < threshold) return false;
      if (moduleFilter !== 'all' && a.module !== moduleFilter) return false;
      if (actorFilter !== 'all' && a.actor.id !== actorFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !a.entityName.toLowerCase().includes(q) &&
          !a.description.toLowerCase().includes(q) &&
          !a.actor.name.toLowerCase().includes(q) &&
          !a.action.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [search, moduleFilter, actorFilter, dateFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Group by date
  const grouped = useMemo(() => {
    const groups: { dateKey: string; label: string; items: ActivityLog[] }[] = [];
    let currentKey = '';
    for (const item of paginated) {
      const key = getDateKey(item.timestamp);
      if (key !== currentKey) {
        currentKey = key;
        groups.push({ dateKey: key, label: formatDateLabel(item.timestamp), items: [] });
      }
      groups[groups.length - 1].items.push(item);
    }
    return groups;
  }, [paginated]);

  const selected = selectedId ? (MOCK_ACTIVITY_LOG.find((a) => a.id === selectedId) ?? null) : null;

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      {/* Top bar */}
      <div className="shrink-0 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Activity Log</h1>
            <p className="text-sm text-muted-foreground">
              Audit trail of all actions across the platform
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs tabular-nums">
            {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          </Badge>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="ps-9"
            />
          </div>
          <Select
            value={moduleFilter}
            onValueChange={(v) => {
              setModuleFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {Object.entries(MODULE_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={actorFilter}
            onValueChange={(v) => {
              setActorFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Actors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actors</SelectItem>
              {actors.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="1d">Last 24 hours</option>
            <option value="3d">Last 3 days</option>
            <option value="7d">Last 7 days</option>
            <option value="1m">Last month</option>
            <option value="3m">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          {(search || moduleFilter !== 'all' || actorFilter !== 'all' || dateFilter !== '7d') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setModuleFilter('all');
                setActorFilter('all');
                setDateFilter('7d');
                setPage(1);
              }}
            >
              <X className="mr-1 h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* 2-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className="flex w-full flex-col border-e border-border lg:w-[480px] xl:w-[520px]">
          <ScrollArea className="flex-1">
            <div className="p-4">
              {grouped.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <History className="h-7 w-7 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No activities found</p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    Try adjusting your filters
                  </p>
                </div>
              )}
              {grouped.map((group) => (
                <div key={group.dateKey} className="mb-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const modCfg = MODULE_CONFIG[item.module];
                      const ModIcon = modCfg.icon;
                      const isActive = selectedId === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedId(isActive ? null : item.id)}
                          className={cn(
                            'flex w-full items-start gap-3 rounded-lg px-3 py-3 text-start transition-colors',
                            isActive ? 'bg-muted' : 'hover:bg-muted/50',
                          )}
                        >
                          <div
                            className={cn(
                              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted',
                              isActive && 'bg-background',
                            )}
                          >
                            <ModIcon className={cn('h-4 w-4', modCfg.color)} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-medium">
                                {item.entityName}
                              </span>
                              <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                                {modCfg.label}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {item.description}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span>{item.actor.name}</span>
                              <span>·</span>
                              <span>{formatTime(item.timestamp)}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Pagination */}
          {filtered.length > ITEMS_PER_PAGE && (
            <div className="flex shrink-0 items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="hidden flex-1 lg:block">
          {!selected ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <History className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">Select an Activity</h3>
                <p className="text-xs text-muted-foreground">
                  Click on an activity to view details and changes
                </p>
              </div>
            </div>
          ) : (
            <DetailPanel activity={selected} onClose={() => setSelectedId(null)} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Detail Panel ─── */
function DetailPanel({ activity, onClose }: { activity: ActivityLog; onClose: () => void }) {
  const modCfg = MODULE_CONFIG[activity.module];
  const actCfg = ACTION_CONFIG[activity.action];
  const ModIcon = modCfg.icon;
  const ActIcon = actCfg.icon;

  const fullDate = new Date(activity.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fullTime = new Date(activity.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <ModIcon className={cn('h-5 w-5', modCfg.color)} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{activity.entityName}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {modCfg.label}
                </Badge>
                <Badge variant="outline" className={cn('text-xs', actCfg.badgeClass)}>
                  <ActIcon className="mr-1 h-3 w-3" />
                  {actCfg.label}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
            aria-label="Close detail panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{activity.description}</p>

        <Separator className="my-5" />

        {/* Meta */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Actor</span>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold uppercase">
                {activity.actor.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <span className="text-sm">{activity.actor.name}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Email</span>
            <span className="text-sm text-muted-foreground">{activity.actor.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Date</span>
            <span className="text-sm">{fullDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Time</span>
            <span className="text-sm font-mono tabular-nums">{fullTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Entity ID</span>
            <span className="text-sm font-mono text-muted-foreground">{activity.entityId}</span>
          </div>
        </div>

        <Separator className="my-5" />

        {/* Changes / Diff */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Changes</h3>
          {activity.changes.length === 0 ? (
            <p className="text-xs text-muted-foreground">No field changes recorded.</p>
          ) : (
            <div className="space-y-3">
              {activity.changes.map((change, i) => (
                <div key={i} className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="mb-2 text-xs font-medium">{change.field}</p>
                  <div className="flex items-start gap-2">
                    {change.oldValue !== null ? (
                      <div className="min-w-0 flex-1 rounded-md border border-red-500/20 bg-red-500/5 px-2.5 py-1.5">
                        <p className="break-words text-xs text-red-400">{change.oldValue}</p>
                      </div>
                    ) : (
                      <div className="min-w-0 flex-1 rounded-md border border-border bg-muted/50 px-2.5 py-1.5">
                        <p className="text-xs italic text-muted-foreground">empty</p>
                      </div>
                    )}
                    <ArrowRight className="mt-1.5 h-3 w-3 shrink-0 text-muted-foreground" />
                    {change.newValue !== null ? (
                      <div className="min-w-0 flex-1 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5">
                        <p className="break-words text-xs text-emerald-400">{change.newValue}</p>
                      </div>
                    ) : (
                      <div className="min-w-0 flex-1 rounded-md border border-border bg-muted/50 px-2.5 py-1.5">
                        <p className="text-xs italic text-muted-foreground">removed</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
