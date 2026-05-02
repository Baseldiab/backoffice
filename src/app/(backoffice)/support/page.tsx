'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Mail,
  MessageCircle,
  MessagesSquare,
  MoreHorizontal,
  Search,
  X,
} from 'lucide-react';
import { formatDistanceToNow, parseISO, differenceInHours } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/shared/Pagination';
import {
  MOCK_TICKETS,
  AGENT_LIST,
  ALL_STATUSES,
  ALL_PRIORITIES,
  ALL_CHANNELS,
  type Ticket,
  type TicketStatus,
  type TicketPriority,
} from '@/lib/mock/support';

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isOverdue(ticket: Ticket) {
  if (ticket.status !== 'Open') return false;
  return differenceInHours(new Date(), parseISO(ticket.createdAt)) > 24;
}

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const map: Record<TicketPriority, string> = {
    Urgent: 'bg-red-500/10 text-red-500 border-red-500/20',
    High: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Low: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        map[priority],
      )}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: TicketStatus }) {
  const map: Record<TicketStatus, string> = {
    Open: 'bg-[#3ECF8E]/10 text-[#3ECF8E] border-[#3ECF8E]/20',
    Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Resolved: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Closed: 'bg-muted text-muted-foreground border-border',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        map[status],
      )}
    >
      {status}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const map: Record<string, string> = {
    Enterprise: 'bg-purple-500/10 text-purple-400',
    Business: 'bg-blue-500/10 text-blue-400',
    Pro: 'bg-[#3ECF8E]/10 text-[#3ECF8E]',
    Starter: 'bg-zinc-500/10 text-zinc-400',
  };
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 text-[10px] font-medium',
        map[plan] ?? 'bg-muted text-muted-foreground',
      )}
    >
      {plan}
    </span>
  );
}

function ChannelIcon({ channel }: { channel: string }) {
  if (channel === 'Email') return <Mail className="h-3.5 w-3.5" />;
  if (channel === 'WhatsApp') return <MessageCircle className="h-3.5 w-3.5" />;
  return <MessagesSquare className="h-3.5 w-3.5" />;
}

function AgentAvatar({ name, size = 'sm' }: { name: string | null; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs';
  if (!name) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full border border-dashed border-border bg-muted',
          dim,
        )}
      />
    );
  }
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-[#3ECF8E]/10 font-semibold text-[#3ECF8E]',
        dim,
      )}
    >
      {getInitials(name)}
    </div>
  );
}

function StatChip({
  label,
  value,
  accent,
  warning,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          'text-sm font-semibold tabular-nums',
          accent ? 'text-[#3ECF8E]' : warning ? 'text-yellow-500' : 'text-foreground',
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssigned, setFilterAssigned] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');

  function updateTicket(id: string, updates: Partial<Ticket>) {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }

  // Stats
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const pendingCount = tickets.filter((t) => t.status === 'Pending').length;
  const today = new Date().toISOString().slice(0, 10);
  const resolvedTodayCount = tickets.filter(
    (t) => t.resolvedAt && t.resolvedAt.startsWith(today),
  ).length;

  // Filters
  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.ticketNumber.toLowerCase().includes(q) &&
          !t.companyName.toLowerCase().includes(q) &&
          !t.subject.toLowerCase().includes(q)
        )
          return false;
      }
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
      if (filterChannel !== 'all' && t.channel !== filterChannel) return false;
      if (filterAssigned !== 'all') {
        if (filterAssigned === 'unassigned' && t.assignedTo !== null) return false;
        if (filterAssigned !== 'unassigned' && t.assignedTo !== filterAssigned) return false;
      }
      return true;
    });
  }, [tickets, search, filterStatus, filterPriority, filterAssigned, filterChannel]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function setFilter<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  const hasFilters =
    !!search ||
    filterStatus !== 'all' ||
    filterPriority !== 'all' ||
    filterAssigned !== 'all' ||
    filterChannel !== 'all';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Support</h1>
        <p className="text-sm text-muted-foreground">Manage customer tickets and conversations.</p>
      </div>

      {/* Stat chips */}
      <div className="flex flex-wrap items-center gap-2">
        <StatChip label="Open" value={openCount} accent />
        <StatChip label="Pending" value={pendingCount} warning />
        <StatChip label="Resolved Today" value={resolvedTodayCount} />
        <StatChip label="Avg Response" value="2.4h" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search ticket # or company…"
            className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-[#3ECF8E]"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilter(setFilterStatus)}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilter(setFilterPriority)}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            {ALL_PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterAssigned} onValueChange={setFilter(setFilterAssigned)}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Assigned To" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agents</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {AGENT_LIST.map((a) => (
              <SelectItem key={a.id} value={a.name}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterChannel} onValueChange={setFilter(setFilterChannel)}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            {ALL_CHANNELS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-xs text-muted-foreground"
            onClick={() => {
              setSearch('');
              setFilterStatus('all');
              setFilterPriority('all');
              setFilterAssigned('all');
              setFilterChannel('all');
              setPage(1);
            }}
          >
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Ticket #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Channel
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Assigned To
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Last Update
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MessagesSquare className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-foreground">No tickets found</p>
                      <p className="text-xs text-muted-foreground">
                        {hasFilters ? 'Try adjusting your filters.' : 'No support tickets yet.'}
                      </p>
                      {hasFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1 text-xs"
                          onClick={() => {
                            setSearch('');
                            setFilterStatus('all');
                            setFilterPriority('all');
                            setFilterAssigned('all');
                            setFilterChannel('all');
                          }}
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30 last:border-0"
                  >
                    {/* Ticket # */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-xs text-muted-foreground">
                          {ticket.ticketNumber}
                        </span>
                        {isOverdue(ticket) && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-red-500">
                            <AlertCircle className="h-2.5 w-2.5" /> Overdue
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-foreground">
                          {ticket.companyName}
                        </span>
                        <PlanBadge plan={ticket.companyPlan} />
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-4 py-3 max-w-[220px]">
                      <span className="line-clamp-1 text-xs text-foreground" title={ticket.subject}>
                        {ticket.subject.length > 40
                          ? ticket.subject.slice(0, 40) + '…'
                          : ticket.subject}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3">
                      <PriorityBadge priority={ticket.priority} />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={ticket.status} />
                    </td>

                    {/* Channel */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ChannelIcon channel={ticket.channel} />
                        <span>{ticket.channel}</span>
                      </div>
                    </td>

                    {/* Assigned To */}
                    <td className="px-4 py-3">
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <AgentAvatar name={ticket.assignedTo} />
                          <span className="text-xs text-foreground">
                            {ticket.assignedTo.split(' ')[0]}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <AgentAvatar name={null} />
                          <span className="text-xs text-muted-foreground">Unassigned</span>
                        </div>
                      )}
                    </td>

                    {/* Last Update */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(parseISO(ticket.updatedAt), { addSuffix: true })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            aria-label="Ticket actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => router.push(`/support/${ticket.id}`)}>
                            View Ticket
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              const agent = AGENT_LIST[0];
                              updateTicket(ticket.id, { assignedTo: agent.name });
                              toast.success(`Assigned to ${agent.name}`);
                            }}
                          >
                            Assign To…
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              updateTicket(ticket.id, {
                                status: 'Pending',
                                updatedAt: new Date().toISOString(),
                              });
                              toast.success('Status changed to Pending');
                            }}
                          >
                            Mark Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              updateTicket(ticket.id, {
                                status: 'Resolved',
                                resolvedAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                              });
                              toast.success('Ticket resolved');
                            }}
                          >
                            Mark Resolved
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              updateTicket(ticket.id, {
                                status: 'Closed',
                                resolvedAt: ticket.resolvedAt ?? new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                              });
                              toast.success('Ticket closed');
                            }}
                          >
                            Close Ticket
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-border px-4 py-3">
          <Pagination
            currentPage={safePage}
            totalItems={filtered.length}
            itemsPerPage={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
