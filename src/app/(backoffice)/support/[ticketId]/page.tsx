'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  List,
  Link as LinkIcon,
  Paperclip,
  Smile,
  ChevronDown,
  ChevronUp,
  FileText,
  ImageIcon,
  Download,
  Lock,
  X,
} from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import {
  MOCK_TICKETS,
  AGENT_LIST,
  ALL_STATUSES,
  ALL_PRIORITIES,
  type Ticket,
  type TicketStatus,
  type TicketPriority,
  type InternalNote,
} from '@/lib/mock/support';

// ─── Mock attachment data ─────────────────────────────────────────────────────

type MockFile = {
  name: string;
  size: string;
  sharedBy: string;
  date: string;
  type: 'doc' | 'image';
};

const MOCK_FILES: Record<string, MockFile[]> = {
  tkt_1: [
    {
      name: 'crash_log_ios17.txt',
      size: '24 KB',
      sharedBy: 'Rami Hassan',
      date: '2026-04-10',
      type: 'doc',
    },
    {
      name: 'screenshot_blank_widget.png',
      size: '148 KB',
      sharedBy: 'Rami Hassan',
      date: '2026-04-10',
      type: 'image',
    },
  ],
  tkt_12: [
    {
      name: 'network_security_config.xml',
      size: '4 KB',
      sharedBy: 'Abdulrahman Al-Dosari',
      date: '2026-04-02',
      type: 'doc',
    },
  ],
  tkt_14: [
    {
      name: 'gdpr_export_eu_q1.csv.enc',
      size: '2.1 MB',
      sharedBy: 'Sara Bin Nasser',
      date: '2026-04-12',
      type: 'doc',
    },
    {
      name: 'manifest_signed.pdf',
      size: '18 KB',
      sharedBy: 'Sara Bin Nasser',
      date: '2026-04-12',
      type: 'doc',
    },
    {
      name: 'export_verification.pdf',
      size: '32 KB',
      sharedBy: 'Sara Bin Nasser',
      date: '2026-04-12',
      type: 'doc',
    },
    {
      name: 'dpo_confirmation.pdf',
      size: '9 KB',
      sharedBy: 'Sara Bin Nasser',
      date: '2026-04-13',
      type: 'doc',
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SupportTicketPage({ params }: { params: { ticketId: string } }) {
  const initialTicket = MOCK_TICKETS.find((t) => t.id === params.ticketId) ?? MOCK_TICKETS[0];

  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [activeTicketId, setActiveTicketId] = useState(initialTicket.id);
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');
  const [noteText, setNoteText] = useState('');
  const [actionsOpen, setActionsOpen] = useState(true);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTicket = tickets.find((t) => t.id === activeTicketId) ?? tickets[0];

  const filteredTickets = useMemo(() => {
    if (!search.trim()) return tickets;
    const q = search.toLowerCase();
    return tickets.filter(
      (t) =>
        t.subject.toLowerCase().includes(q) ||
        t.companyName.toLowerCase().includes(q) ||
        t.contactEmail.toLowerCase().includes(q),
    );
  }, [tickets, search]);

  const openCount = tickets.filter((t) => t.status === 'Open').length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicketId]);

  function updateTicket(updates: Partial<Ticket>) {
    setTickets((prev) => prev.map((t) => (t.id === activeTicketId ? { ...t, ...updates } : t)));
  }

  function removeTag(tag: string) {
    updateTicket({ tags: activeTicket.tags.filter((t) => t !== tag) });
  }

  function handleSendReply() {
    if (!reply.trim()) return;
    const newMsg = {
      id: `msg_new_${Date.now()}`,
      sender: 'Khalid Al-Rashidi',
      senderType: 'agent' as const,
      content: reply.trim(),
      timestamp: new Date().toISOString(),
    };
    updateTicket({ messages: [...activeTicket.messages, newMsg] });
    setReply('');
  }

  function addNote() {
    if (!noteText.trim()) return;
    const note: InternalNote = {
      id: `note_new_${Date.now()}`,
      author: 'Khalid Al-Rashidi',
      content: noteText.trim(),
      timestamp: new Date().toISOString(),
    };
    // Internal notes are NOT visible to the customer — agent-only
    updateTicket({ internalNotes: [...activeTicket.internalNotes, note] });
    setNoteText('');
  }

  const files = MOCK_FILES[activeTicketId] ?? [];
  const visibleFiles = showAllFiles ? files : files.slice(0, 3);
  const contactName = activeTicket.messages[0]?.sender ?? activeTicket.companyName;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* ── TOPBAR ──────────────────────────────────────────────────────────── */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <Link
          href="/support"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Support
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{activeTicket.id}</span>
          <StatusBadge status={activeTicket.status} />
        </div>
      </div>
      {/* ── 3-COLUMN LAYOUT ─────────────────────────────────────────────────── */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* ── LEFT COLUMN ─────────────────────────────────────────────────────── */}
        <div className="w-1/4 flex flex-col border-r border-border bg-card">
          {/* Search */}
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tickets…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>

          {/* Section header */}
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Open Tickets ({openCount})
          </div>

          {/* Ticket list */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {filteredTickets.map((ticket) => {
                const isActive = ticket.id === activeTicketId;
                const lastMsg = ticket.messages[ticket.messages.length - 1];
                return (
                  <button
                    key={ticket.id}
                    onClick={() => {
                      setActiveTicketId(ticket.id);
                      setShowAllFiles(false);
                      setNoteText('');
                    }}
                    className={cn(
                      'flex w-full flex-col gap-1.5 border-l-2 px-3 py-3 text-left transition-colors hover:bg-muted/30',
                      isActive ? 'border-[#3ECF8E] bg-[#3ECF8E]/5' : 'border-transparent',
                    )}
                  >
                    {/* Row 1: Avatar + Name + Time */}
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                        {getInitials(ticket.companyName)}
                      </div>
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-1">
                        <span className="truncate text-sm font-medium text-foreground">
                          {ticket.companyName}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDistanceToNow(parseISO(ticket.updatedAt), { addSuffix: false })}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Message preview — 2-line clamp */}
                    <p className="line-clamp-2 pl-11 text-sm text-muted-foreground">
                      {lastMsg?.content ?? ticket.subject}
                    </p>

                    {/* Row 3: Badges */}
                    <div className="flex items-center gap-1.5 pl-11">
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                      {ticket.tags[0] && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {ticket.tags[0]}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredTickets.length === 0 && (
                <div className="flex flex-col items-center px-4 py-10 text-center">
                  <Search className="mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">No tickets found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* ── MIDDLE COLUMN ───────────────────────────────────────────────────── */}
        <div className="flex w-1/2 flex-col overflow-hidden bg-background">
          {/* Ticket header */}
          <div className="shrink-0 border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">{activeTicket.subject}</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <StatusBadge status={activeTicket.status} />
              <PriorityBadge priority={activeTicket.priority} />
              <span className="text-xs text-muted-foreground">{activeTicket.channel}</span>
              {/* Tags with delete button */}
              {activeTicket.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>
                    <X className="h-3 w-3 hover:text-destructive" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Messages thread */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-5 px-6 py-6">
              {activeTicket.messages.map((msg) => {
                const isCustomer = msg.senderType === 'customer';

                if (isCustomer) {
                  return (
                    // Customer messages: right-aligned, primary tint
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[75%]">
                        <div className="mb-1 flex items-center justify-end gap-2">
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(msg.timestamp), 'MMM d, yyyy · h:mm a')}
                          </span>
                          <span className="text-xs font-medium text-[#3ECF8E]">{msg.sender}</span>
                        </div>
                        <div className="rounded-2xl rounded-tr-sm border border-[#3ECF8E]/20 bg-[#3ECF8E]/10 px-4 py-2.5">
                          <p className="text-sm leading-relaxed text-foreground/90">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  // Agent messages: left-aligned with 28px avatar
                  <div key={msg.id} className="flex items-start gap-2">
                    <div className="mt-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                      {getInitials(msg.sender)}
                    </div>
                    <div className="max-w-[75%]">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(msg.timestamp), 'MMM d, yyyy · h:mm a')}
                        </span>
                      </div>
                      <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-2.5">
                        <p className="text-sm leading-relaxed text-foreground/90">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Reply composer */}
          <div className="shrink-0 border-t border-border p-4">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {/* Reply-to chip */}
              <div className="flex items-center gap-2 px-3 pb-2 pt-3">
                <span className="text-xs text-muted-foreground">Reply to:</span>
                <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {contactName}
                  <X className="h-3 w-3 cursor-pointer" />
                </span>
              </div>
              {/* Formatting toolbar */}
              <div className="flex items-center gap-0.5 border-b border-border/50 px-3 pb-2">
                {([Bold, Italic, Underline] as const).map((Icon, i) => (
                  <button
                    key={i}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                ))}
                <div className="mx-1 h-4 w-px bg-border" />
                <button className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <AlignLeft className="h-3.5 w-3.5" />
                </button>
                <button className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <List className="h-3.5 w-3.5" />
                </button>
                <button className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <LinkIcon className="h-3.5 w-3.5" />
                </button>
              </div>
              {/* Native textarea */}
              <textarea
                rows={4}
                placeholder="Type your reply… (Cmd+Enter to send)"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSendReply();
                }}
                className="w-full resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {/* Bottom bar */}
              <div className="flex items-center justify-between border-t border-border/50 px-3 py-2">
                <div className="flex items-center gap-0.5">
                  <button
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Attach file"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Add emoji"
                  >
                    <Smile className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Button
                  onClick={handleSendReply}
                  size="sm"
                  className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
                >
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────────────────── */}
        <div className="flex h-full w-1/4 flex-col overflow-hidden border-l border-border bg-card">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-4">
              {/* Ticket Actions — collapsible */}
              <div className="overflow-hidden rounded-lg border border-border">
                <button
                  onClick={() => setActionsOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/30"
                >
                  Ticket Actions
                  {actionsOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {actionsOpen && (
                  <div className="flex flex-col gap-3 border-t border-border p-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Status</label>
                      <Select
                        value={activeTicket.status}
                        onValueChange={(v) => updateTicket({ status: v as TicketStatus })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Priority</label>
                      <Select
                        value={activeTicket.priority}
                        onValueChange={(v) => updateTicket({ priority: v as TicketPriority })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_PRIORITIES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Assigned To</label>
                      <Select
                        value={activeTicket.assignedTo ?? 'unassigned'}
                        onValueChange={(v) =>
                          updateTicket({ assignedTo: v === 'unassigned' ? null : v })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Unassigned" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {AGENT_LIST.map((a) => (
                            <SelectItem key={a.id} value={a.name}>
                              {a.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Visitor Information */}
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="border-b border-border px-3 py-2.5">
                  <span className="text-sm font-medium text-foreground">Visitor Information</span>
                </div>
                <div className="flex flex-col gap-3 p-3">
                  {/* Basic Details */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Basic Details</span>
                    <button className="text-xs text-[#3ECF8E] hover:underline">Edit</button>
                  </div>
                  {[
                    { label: 'Email', value: activeTicket.contactEmail },
                    { label: 'Phone', value: '+966 50 000 0000' },
                    { label: 'Company', value: activeTicket.companyName },
                    { label: 'Plan', value: activeTicket.companyPlan },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="max-w-[120px] truncate text-right text-xs font-medium text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}

                  <div className="h-px bg-border" />

                  {/* Device Info */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Device Info</span>
                    <button className="text-xs text-[#3ECF8E] hover:underline">Edit</button>
                  </div>
                  {[
                    { label: 'Channel', value: activeTicket.channel },
                    {
                      label: 'Last Login',
                      value: format(parseISO(activeTicket.updatedAt), 'MMM d, yyyy'),
                    },
                    {
                      label: 'Account Created',
                      value: format(parseISO(activeTicket.createdAt), 'MMM d, yyyy'),
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-right text-xs font-medium text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Files Shared */}
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="border-b border-border px-3 py-2.5">
                  <span className="text-sm font-medium text-foreground">Files Shared</span>
                </div>
                <div className="flex flex-col gap-2 p-3">
                  {files.length === 0 ? (
                    <p className="py-3 text-center text-xs text-muted-foreground">
                      No files shared yet
                    </p>
                  ) : (
                    <>
                      {visibleFiles.map((file, i) => (
                        <div key={i} className="flex items-start gap-2">
                          {file.type === 'image' ? (
                            <ImageIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                          ) : (
                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              Shared by {file.sharedBy} on {file.date}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            aria-label="Download file"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {files.length > 3 && (
                        <button
                          onClick={() => setShowAllFiles((v) => !v)}
                          className="mt-1 text-left text-xs text-[#3ECF8E] hover:underline"
                        >
                          {showAllFiles ? 'Show less' : `Show ${files.length - 3} more`}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Internal Notes — NOT visible to customer, agent-only */}
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="border-b border-border px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Internal Notes</span>
                    <span className="text-xs text-muted-foreground">(agent only)</span>
                  </div>
                </div>
                <div className="flex flex-col p-3">
                  {activeTicket.internalNotes.length === 0 && (
                    <p className="mb-2 text-xs text-muted-foreground">No notes yet.</p>
                  )}
                  {activeTicket.internalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="mb-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-2"
                    >
                      <div className="mb-1 flex items-center justify-between gap-1">
                        <span className="text-[10px] font-medium text-yellow-600">
                          {note.author}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(parseISO(note.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-foreground/80">{note.content}</p>
                    </div>
                  ))}
                  <Textarea
                    rows={2}
                    placeholder="Add internal note…"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="mb-1.5 resize-none text-xs"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    disabled={!noteText.trim()}
                    onClick={addNote}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Fixed Close Ticket at bottom */}
          <div className="shrink-0 border-t border-border bg-card p-4">
            <ConfirmDialog
              trigger={
                <Button
                  variant="outline"
                  className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close Ticket
                </Button>
              }
              title="Close Ticket"
              description={`Are you sure you want to close ticket ${activeTicket.ticketNumber}? This action cannot be undone.`}
              confirmLabel="Close Ticket"
              variant="destructive"
              onConfirm={() => {
                // update ticket status to Closed
                updateTicket({ status: 'Closed' });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
