'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Search,
  X,
  CheckCircle2,
  Check,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Lock,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Pencil,
  FileText,
  Download,
  Upload,
  Link2,
  Copy,
  Building2,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { usePipelineStore } from '@/lib/pipeline-store';
import { PIPELINE_STAGES, EMAIL_TEMPLATES } from '@/lib/mock/pipeline';
import type { Deal, DealActivity, StageRequirement } from '@/lib/mock/pipeline';
import { cn } from '@/lib/utils';
import { formatRelativeDate } from '@/lib/utils';

const KanbanBoard = dynamic(() => import('@/components/pipeline/KanbanBoard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
      Loading board...
    </div>
  ),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FLAG: Record<string, string> = {
  SA: '🇸🇦',
  AE: '🇦🇪',
  KW: '🇰🇼',
  QA: '🇶🇦',
  BH: '🇧🇭',
  OM: '🇴🇲',
};
const countryFlag = (c: string) => FLAG[c] ?? '🌍';

const LOST_REASONS = [
  'Price too high',
  'Chose competitor',
  'No budget',
  'Not a fit',
  'No response',
  'Other',
];

const DEAL_FIELDS = [
  { label: 'Company Name', field: 'companyName', type: 'text' },
  { label: 'Contact Name', field: 'contactName', type: 'text' },
  { label: 'Email', field: 'contactEmail', type: 'email' },
  { label: 'Phone', field: 'contactPhone', type: 'text' },
  {
    label: 'Country',
    field: 'country',
    type: 'select',
    options: ['SA', 'AE', 'KW', 'QA'],
  },
  { label: 'Industry', field: 'industry', type: 'text' },
  {
    label: 'Company Size',
    field: 'companySize',
    type: 'select',
    options: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
  },
  { label: 'Website', field: 'website', type: 'text' },
  {
    label: 'Lead Source',
    field: 'source',
    type: 'select',
    options: ['Website Form', 'Direct', 'Referral', 'Event'],
  },
  { label: 'Platforms', field: 'platforms', type: 'multi-select' },
  { label: 'Goals', field: 'goals', type: 'textarea' },
  {
    label: 'Plan',
    field: 'requestedPlan',
    type: 'select',
    options: ['Starter', 'Pro', 'Business', 'Enterprise'],
  },
  { label: 'Est. MRR ($)', field: 'estimatedMRR', type: 'number' },
  { label: 'Assigned To', field: 'assignedTo', type: 'text' },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const {
    deals,
    markWon,
    markLost,
    moveDealToStage,
    toggleRequirement,
    confirmPayment,
    addActivity,
    updateDeal,
    addNote,
    lastAutoWonDealId,
    clearAutoWon,
  } = usePipelineStore();

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'won' | 'lost'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const [lostDialogOpen, setLostDialogOpen] = useState(false);
  const [lostReason, setLostReason] = useState(LOST_REASONS[0]);
  const [lostNote, setLostNote] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [logInteractionOpen, setLogInteractionOpen] = useState(false);
  const [activeRequirement, setActiveRequirement] = useState<StageRequirement | null>(null);
  const [moveWarningOpen, setMoveWarningOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailNote, setEmailNote] = useState('');
  const [interactionType, setInteractionType] = useState('call');
  const [interactionDate, setInteractionDate] = useState('');
  const [interactionNotes, setInteractionNotes] = useState('');
  const [markSentOpen, setMarkSentOpen] = useState(false);
  const [markSentChannel, setMarkSentChannel] = useState<'Email' | 'WhatsApp' | 'Call'>('Email');
  const [markSentDate, setMarkSentDate] = useState('');
  const [markSentNote, setMarkSentNote] = useState('');
  const [editingActivity, setEditingActivity] = useState<DealActivity | null>(null);
  const [expandedReq, setExpandedReq] = useState<string | null>(null);
  const [paymentMethodExpanded, setPaymentMethodExpanded] = useState(false);
  const [confirmPaymentOpen, setConfirmPaymentOpen] = useState(false);
  const [trackPaymentOpen, setTrackPaymentOpen] = useState(false);
  const [paymentLinkOpen, setPaymentLinkOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'loading' | 'generated'>('form');
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentCurrency, setPaymentCurrency] = useState('SAR');
  const [paymentNotes, setPaymentNotes] = useState('');

  // ── Deal-level computed values ──
  const currentStage = selectedDeal
    ? PIPELINE_STAGES.find((s) => s.id === selectedDeal.stageId)
    : undefined;
  const completedReqs = selectedDeal?.completedRequirements || [];
  const currentStageReqs = currentStage?.requirements || [];
  const totalReqs = currentStageReqs.length;
  const completedCount =
    currentStageReqs.filter(
      (r) =>
        completedReqs.includes(r.id) || (r.field ? !!selectedDeal?.[r.field as keyof Deal] : false),
    ).length || 0;
  const currentStageIndex = selectedDeal
    ? PIPELINE_STAGES.findIndex((s) => s.id === selectedDeal.stageId)
    : -1;
  const nextStage = currentStageIndex >= 0 ? PIPELINE_STAGES[currentStageIndex + 1] : undefined;
  const missingRequirements =
    currentStageReqs.filter(
      (r) =>
        !completedReqs.includes(r.id) &&
        !(r.field ? !!selectedDeal?.[r.field as keyof Deal] : false),
    ) || [];
  const missingBlockers = missingRequirements.filter((r) => r.isBlocker);
  const hasBlockers = missingBlockers.length > 0;
  const missingNonBlockers = missingRequirements.filter((r) => !r.isBlocker);

  // ── Filters / metrics ──
  const activeDeals = deals.filter((d) => !d.closedStatus);
  const wonDeals = deals.filter((d) => d.closedStatus === 'won');
  const lostDeals = deals.filter((d) => d.closedStatus === 'lost');
  const displayDeals =
    activeTab === 'active' ? activeDeals : activeTab === 'won' ? wonDeals : lostDeals;

  const filteredDeals = useMemo(() => {
    return displayDeals.filter((d) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!d.companyName.toLowerCase().includes(q) && !d.contactName.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filterPriority && d.priority !== filterPriority) return false;
      if (filterCountry && d.country !== filterCountry) return false;
      return true;
    });
  }, [displayDeals, searchQuery, filterPriority, filterCountry]);

  const pipelineValue = activeDeals.reduce((s, d) => s + d.estimatedMRR * 12, 0);
  const conversionRate =
    wonDeals.length + lostDeals.length > 0
      ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
      : 0;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const wonThisMonth = wonDeals.filter((d) => new Date(d.updatedAt) >= thirtyDaysAgo).length;

  const metrics = [
    { label: 'Pipeline Value', value: `$${pipelineValue.toLocaleString()}` },
    { label: 'Conversion Rate', value: `${conversionRate}%` },
    { label: 'Open Deals', value: String(activeDeals.length) },
    { label: 'Won This Month', value: String(wonThisMonth) },
  ];

  // ── Handlers ──
  function updateDealField(field: string, value: string) {
    if (!selectedDeal) return;
    if (field === 'estimatedMRR') {
      updateDeal(selectedDeal.id, { [field]: Number(value) || 0 } as Partial<Deal>);
    } else {
      updateDeal(selectedDeal.id, { [field]: value } as Partial<Deal>);
    }
  }

  function handleAddNote() {
    if (!selectedDeal || !noteText.trim()) return;
    addNote(selectedDeal.id, {
      id: `n-${Date.now()}`,
      text: noteText.trim(),
      author: 'You',
      createdAt: new Date().toISOString(),
    });
    setNoteText('');
    toast.success('Note saved');
  }

  function handleMarkLost() {
    setLostDialogOpen(true);
  }

  function handleConfirmLost() {
    if (!selectedDeal) return;
    markLost(selectedDeal.id, lostReason);
    toast.success('Deal marked as lost');
    setLostDialogOpen(false);
    setLostNote('');
    setSelectedDeal(null);
  }

  // Keep selectedDeal in sync with store changes
  useEffect(() => {
    if (selectedDeal) {
      const updated = deals.find((d) => d.id === selectedDeal.id);
      if (!updated) {
        setSelectedDeal(null);
      } else if (updated !== selectedDeal) {
        setSelectedDeal(updated);
      }
    }
  }, [deals, selectedDeal]);

  useEffect(() => {
    if (lastAutoWonDealId) {
      const deal = deals.find((d) => d.id === lastAutoWonDealId);
      toast.success(`"${deal?.companyName || 'Deal'}" auto-marked as Won`);
      clearAutoWon();
    }
  }, [lastAutoWonDealId, deals, clearAutoWon]);

  const hasFilters = !!(searchQuery || filterPriority || filterCountry);

  return (
    <div className="-mx-6 -my-6 flex overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
      {/* ─── LEFT: Kanban board ─── */}
      <div
        className={cn(
          'transition-all duration-300 overflow-auto',
          selectedDeal ? 'w-[42%]' : 'flex-1',
        )}
      >
        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <h1 className="text-lg font-semibold">Sales Pipeline</h1>
            <p className="text-sm text-muted-foreground">Manage and track your deals</p>
          </div>

          {/* Metric chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-lg bg-muted/50 px-3 py-2 flex items-center gap-2"
              >
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {m.label}
                </span>
                <span className="text-xs font-semibold text-foreground tabular-nums">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Active / Won / Lost tabs */}
          <div className="flex items-center gap-1 border-b border-border">
            <button
              onClick={() => {
                setActiveTab('active');
                setSelectedDeal(null);
              }}
              className={cn(
                'px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors',
                activeTab === 'active'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              Active ({activeDeals.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('won');
                setSelectedDeal(null);
              }}
              className={cn(
                'px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors',
                activeTab === 'won'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              Won ({wonDeals.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('lost');
                setSelectedDeal(null);
              }}
              className={cn(
                'px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors',
                activeTab === 'lost'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              Lost ({lostDeals.length})
            </button>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company or contact..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={filterPriority ?? ''}
                onChange={(e) => setFilterPriority(e.target.value || null)}
                className="h-9 appearance-none pl-3 pr-8 rounded-lg border border-input bg-transparent text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                <option value="">Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={filterCountry ?? ''}
                onChange={(e) => setFilterCountry(e.target.value || null)}
                className="h-9 appearance-none pl-3 pr-8 rounded-lg border border-input bg-transparent text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                <option value="">Country</option>
                <option value="SA">SA</option>
                <option value="AE">AE</option>
                <option value="KW">KW</option>
                <option value="QA">QA</option>
              </select>
              {hasFilters && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterPriority(null);
                    setFilterCountry(null);
                  }}
                  className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Board / Table */}
          {activeTab === 'active' ? (
            <div className="flex gap-4 items-start">
              <KanbanBoard
                deals={filteredDeals}
                selectedDealId={selectedDeal?.id ?? null}
                onSelectDeal={setSelectedDeal}
              />
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="text-center py-16 text-sm text-muted-foreground">
              No {activeTab} deals found.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 px-3">
                    Company
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 px-3">
                    Contact
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 px-3">
                    Plan
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 px-3">
                    Est. ARR
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 px-3">
                    Country
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2 px-3">
                    {activeTab === 'won' ? 'Won' : 'Reason'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => (
                  <tr
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className={cn(
                      'border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/30',
                      selectedDeal?.id === deal.id && 'bg-primary/5',
                    )}
                  >
                    <td className="py-2 px-3 text-sm font-medium">{deal.companyName}</td>
                    <td className="py-2 px-3 text-sm text-muted-foreground">{deal.contactName}</td>
                    <td className="py-2 px-3 text-sm text-muted-foreground">
                      {deal.requestedPlan}
                    </td>
                    <td className="py-2 px-3 text-sm font-mono">
                      ${(deal.estimatedMRR * 12).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-sm text-muted-foreground">
                      {countryFlag(deal.country)} {deal.country}
                    </td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">
                      {activeTab === 'won'
                        ? formatRelativeDate(deal.wonAt || deal.updatedAt)
                        : deal.lostReason || '\u2014'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ─── MIDDLE: Deal Overview ─── */}
      {selectedDeal && (
        <div className="flex-1 border-l border-border flex flex-col overflow-hidden">
          {/* Sticky header */}
          <div className="shrink-0 px-6 py-4 border-b border-border bg-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground font-mono">
                HL-{selectedDeal.id.slice(-3).toUpperCase()}
              </span>
              <button onClick={() => setSelectedDeal(null)} aria-label="Close deal panel">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <h2 className="text-lg font-bold">{selectedDeal.companyName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {countryFlag(selectedDeal.country)} {selectedDeal.country}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{selectedDeal.requestedPlan}</span>
              <span className="text-xs font-bold text-primary ml-auto">
                ${selectedDeal.estimatedMRR.toLocaleString()}/mo
              </span>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Won/Lost banner */}
            {selectedDeal.closedStatus === 'won' && (
              <div className="flex items-center justify-between rounded-lg bg-primary/10 border border-primary/20 px-4 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Deal Won {selectedDeal.wonAt ? formatRelativeDate(selectedDeal.wonAt) : ''}
                  </span>
                </div>
                <button
                  onClick={() => {
                    updateDeal(selectedDeal.id, {
                      closedStatus: undefined,
                      wonAt: undefined,
                    } as Partial<Deal>);
                    toast.success('Deal reopened');
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reopen Deal
                </button>
              </div>
            )}
            {selectedDeal.closedStatus === 'lost' && (
              <div className="flex items-center justify-between rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">
                    Deal Lost
                    {selectedDeal.lostReason ? ` \u2014 ${selectedDeal.lostReason}` : ''}
                  </span>
                </div>
                <button
                  onClick={() => {
                    updateDeal(selectedDeal.id, {
                      closedStatus: undefined,
                      lostReason: undefined,
                    } as Partial<Deal>);
                    toast.success('Deal reopened');
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reopen Deal
                </button>
              </div>
            )}
            {/* SECTION: Deal Information */}
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Deal Information
              </h3>
              <div className="space-y-1">
                {DEAL_FIELDS.map((fieldDef) => {
                  const { label, field, type } = fieldDef;
                  const options = 'options' in fieldDef ? fieldDef.options : undefined;
                  const value = selectedDeal[field as keyof typeof selectedDeal];
                  const isEditing = editingField === field;

                  // ── Platforms (multi-select) ──
                  if (type === 'multi-select' && field === 'platforms') {
                    return (
                      <div
                        key={field}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 group cursor-pointer"
                        onClick={() => !isEditing && setEditingField(field)}
                      >
                        <span className="text-xs text-muted-foreground w-28 shrink-0">{label}</span>
                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            {(['iOS', 'Android', 'Web'] as const).map((p) => (
                              <button
                                key={p}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const current = (selectedDeal.platforms || []) as (
                                    | 'iOS'
                                    | 'Android'
                                    | 'Web'
                                  )[];
                                  updateDeal(selectedDeal.id, {
                                    platforms: current.includes(p)
                                      ? current.filter((x) => x !== p)
                                      : [...current, p],
                                  } as Partial<Deal>);
                                }}
                                className={cn(
                                  'text-xs px-2.5 py-1 rounded-md border transition-all',
                                  (selectedDeal.platforms || []).includes(p)
                                    ? 'bg-primary/10 border-primary text-primary font-medium'
                                    : 'border-border text-muted-foreground hover:border-primary/40',
                                )}
                              >
                                {p}
                              </button>
                            ))}
                            <button
                              onClick={() => setEditingField(null)}
                              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                            >
                              Done
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm flex-1">
                              {(selectedDeal.platforms || []).length > 0 ? (
                                (selectedDeal.platforms || []).join(', ')
                              ) : (
                                <span className="text-muted-foreground/40 italic text-xs">
                                  + Add platforms
                                </span>
                              )}
                            </span>
                            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0" />
                          </div>
                        )}
                      </div>
                    );
                  }

                  // ── Goals (textarea) ──
                  if (type === 'textarea' && field === 'goals') {
                    return (
                      <div
                        key={field}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 group cursor-pointer"
                        onClick={() => !isEditing && setEditingField(field)}
                      >
                        <span className="text-xs text-muted-foreground w-28 shrink-0">{label}</span>
                        {isEditing ? (
                          <textarea
                            autoFocus
                            defaultValue={selectedDeal.goals || ''}
                            rows={3}
                            onBlur={(e) => {
                              updateDealField('goals', e.target.value);
                              setEditingField(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') setEditingField(null);
                            }}
                            className="flex-1 px-2 py-1.5 text-sm bg-background border border-primary rounded-lg resize-none focus:outline-none"
                          />
                        ) : (
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm flex-1 truncate">
                              {selectedDeal.goals ? (
                                selectedDeal.goals
                              ) : (
                                <span className="text-muted-foreground/40 italic text-xs">
                                  + Add goals
                                </span>
                              )}
                            </span>
                            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0" />
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={field}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 group cursor-pointer"
                      onClick={() => !isEditing && setEditingField(field)}
                    >
                      <span className="text-xs text-muted-foreground w-28 shrink-0">{label}</span>
                      {isEditing ? (
                        type === 'select' ? (
                          <select
                            autoFocus
                            defaultValue={String(value || '')}
                            onBlur={(e) => {
                              updateDealField(field, e.target.value);
                              setEditingField(null);
                            }}
                            className="flex-1 h-7 px-2 text-sm bg-background border border-primary rounded focus:outline-none"
                          >
                            {options?.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            autoFocus
                            type={type}
                            defaultValue={String(value || '')}
                            onBlur={(e) => {
                              updateDealField(field, e.target.value);
                              setEditingField(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.currentTarget.blur();
                              if (e.key === 'Escape') setEditingField(null);
                            }}
                            className="flex-1 h-7 px-2 text-sm bg-background border border-primary rounded focus:outline-none"
                          />
                        )
                      ) : (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-sm truncate flex-1">
                            {value ? (
                              String(value)
                            ) : (
                              <span className="text-muted-foreground/40 italic text-xs">
                                + Add {label.toLowerCase()}
                              </span>
                            )}
                          </span>
                          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION: Stage Requirements */}
            {currentStageReqs.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Stage Requirements
                  </h3>
                  <span
                    className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-full',
                      completedCount === totalReqs
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {completedCount}/{totalReqs}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-1 mb-4">
                  <div
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{
                      width: `${totalReqs > 0 ? (completedCount / totalReqs) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="space-y-2">
                  {currentStageReqs.map((req) => {
                    const fieldValue = req.field ? selectedDeal[req.field as keyof Deal] : null;
                    const hasFieldData = req.field ? !!fieldValue : false;
                    const isManuallyChecked = completedReqs.includes(req.id);
                    const isAutoChecked = req.type === 'data_field' && hasFieldData;
                    const isCompleted = isAutoChecked || isManuallyChecked;
                    const isToggleable = !isAutoChecked;
                    const isDocumentsStage = selectedDeal.stageId === 'documents';
                    const isExpanded = expandedReq === req.id;

                    // ── Documents stage: consistent expandable rows ──
                    if (isDocumentsStage) {
                      // Inline value for each requirement
                      const inlineValue =
                        req.id === 'plan_selected'
                          ? selectedDeal.requestedPlan || null
                          : req.id === 'billing_cycle'
                            ? selectedDeal.billingCycle || null
                            : req.id === 'billing_email'
                              ? selectedDeal.contactEmail || null
                              : req.id === 'company_legal_name'
                                ? selectedDeal.companyName || null
                                : req.id === 'legal_docs'
                                  ? (selectedDeal.legalDocs || []).length > 0
                                    ? `${(selectedDeal.legalDocs || []).length} doc${(selectedDeal.legalDocs || []).length > 1 ? 's' : ''}`
                                    : null
                                  : req.id === 'discount_applied'
                                    ? selectedDeal.discount?.label || null
                                    : null;

                      // Which ones expand inline vs use editingField
                      const isExpandable =
                        req.id === 'plan_selected' ||
                        req.id === 'billing_cycle' ||
                        req.id === 'legal_docs' ||
                        req.id === 'discount_applied';

                      const linkLabel = isExpanded
                        ? 'Close'
                        : isExpandable
                          ? inlineValue
                            ? 'Edit'
                            : 'Select'
                          : inlineValue
                            ? 'Edit'
                            : 'Add';

                      return (
                        <div key={req.id}>
                          <div
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all',
                              isCompleted
                                ? 'bg-muted/30 border-border/30 opacity-60'
                                : req.isBlocker
                                  ? 'bg-destructive/5 border-destructive/20'
                                  : 'bg-card border-border hover:border-border/80',
                            )}
                          >
                            <div
                              className={cn(
                                'w-5 h-5 rounded flex items-center justify-center shrink-0 border',
                                isCompleted
                                  ? isAutoChecked
                                    ? 'bg-primary border-primary opacity-70 cursor-default'
                                    : 'bg-primary border-primary'
                                  : 'border-border',
                              )}
                              title={isAutoChecked ? 'Auto-filled from deal data' : undefined}
                            >
                              {isCompleted && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span
                                className={cn(
                                  'text-sm',
                                  isCompleted && 'line-through text-muted-foreground',
                                )}
                              >
                                {req.label}
                              </span>
                              {inlineValue && (
                                <span className="ml-2 text-xs text-primary font-medium">
                                  {inlineValue}
                                </span>
                              )}
                              {isAutoChecked && (
                                <span className="ml-2 text-[10px] text-muted-foreground italic">
                                  auto-filled
                                </span>
                              )}
                            </div>
                            {req.isBlocker && !isCompleted && (
                              <span className="text-xs text-destructive font-medium shrink-0">
                                Required
                              </span>
                            )}
                            <button
                              onClick={() =>
                                isExpandable
                                  ? setExpandedReq(isExpanded ? null : req.id)
                                  : req.field
                                    ? setEditingField(req.field)
                                    : null
                              }
                              className="text-xs text-primary hover:underline shrink-0"
                            >
                              {linkLabel}
                            </button>
                          </div>

                          {/* ── Plan selector panel ── */}
                          {isExpanded && req.id === 'plan_selected' && (
                            <div className="mt-1 p-3 bg-muted/30 border border-border/50 rounded-lg grid grid-cols-2 gap-2">
                              {(['Starter', 'Pro', 'Business', 'Enterprise'] as const).map(
                                (plan) => (
                                  <button
                                    key={plan}
                                    onClick={() => {
                                      updateDeal(selectedDeal.id, {
                                        requestedPlan: plan,
                                      } as Partial<Deal>);
                                      if (
                                        !selectedDeal.completedRequirements?.includes(
                                          'plan_selected',
                                        )
                                      ) {
                                        toggleRequirement(selectedDeal.id, 'plan_selected');
                                      }
                                      setExpandedReq(null);
                                      toast.success(`Plan set to ${plan}`);
                                    }}
                                    className={cn(
                                      'px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left',
                                      selectedDeal.requestedPlan === plan
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border hover:border-primary/50 hover:bg-muted text-foreground',
                                    )}
                                  >
                                    {plan}
                                    {selectedDeal.requestedPlan === plan && (
                                      <Check className="h-3.5 w-3.5 float-right mt-0.5" />
                                    )}
                                  </button>
                                ),
                              )}
                            </div>
                          )}

                          {/* ── Billing cycle panel ── */}
                          {isExpanded && req.id === 'billing_cycle' && (
                            <div className="mt-1 p-3 bg-muted/30 border border-border/50 rounded-lg flex gap-2">
                              {(['Monthly', 'Annual'] as const).map((cycle) => (
                                <button
                                  key={cycle}
                                  onClick={() => {
                                    updateDeal(selectedDeal.id, {
                                      billingCycle: cycle,
                                    } as Partial<Deal>);
                                    if (
                                      !selectedDeal.completedRequirements?.includes('billing_cycle')
                                    ) {
                                      toggleRequirement(selectedDeal.id, 'billing_cycle');
                                    }
                                    setExpandedReq(null);
                                    toast.success(`Billing cycle set to ${cycle}`);
                                  }}
                                  className={cn(
                                    'flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all',
                                    selectedDeal.billingCycle === cycle
                                      ? 'border-primary bg-primary/10 text-primary'
                                      : 'border-border hover:border-primary/50 hover:bg-muted text-muted-foreground',
                                  )}
                                >
                                  {cycle}
                                  {cycle === 'Annual' && (
                                    <span className="text-xs ml-1 opacity-70">Save 20%</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* ── Legal documents panel ── */}
                          {isExpanded && req.id === 'legal_docs' && (
                            <div className="mt-1 p-3 bg-muted/30 border border-border/50 rounded-lg space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">
                                    CR Number
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="1010XXXXXX"
                                    defaultValue={selectedDeal.crNumber || ''}
                                    onBlur={(e) =>
                                      updateDeal(selectedDeal.id, {
                                        crNumber: e.target.value,
                                      } as Partial<Deal>)
                                    }
                                    className="w-full h-8 px-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">
                                    VAT Number
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="3XXXXXXXXXXX3"
                                    defaultValue={selectedDeal.vatNumber || ''}
                                    onBlur={(e) =>
                                      updateDeal(selectedDeal.id, {
                                        vatNumber: e.target.value,
                                      } as Partial<Deal>)
                                    }
                                    className="w-full h-8 px-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                </div>
                              </div>

                              {(selectedDeal.legalDocs || []).length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground font-medium">
                                    Uploaded Documents
                                  </p>
                                  {(selectedDeal.legalDocs || []).map(
                                    (doc: {
                                      id: string;
                                      name: string;
                                      size: string;
                                      type: string;
                                    }) => (
                                      <div
                                        key={doc.id}
                                        className="flex items-center gap-2 px-2 py-1.5 bg-background border border-border rounded-lg"
                                      >
                                        <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                        <span className="text-xs flex-1 truncate">{doc.name}</span>
                                        <span className="text-xs text-muted-foreground shrink-0">
                                          {doc.size}
                                        </span>
                                        <button
                                          className="text-muted-foreground hover:text-primary transition-colors"
                                          aria-label="Download document"
                                        >
                                          <Download className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                          className="text-muted-foreground hover:text-destructive transition-colors"
                                          aria-label="Remove document"
                                          onClick={() =>
                                            updateDeal(selectedDeal.id, {
                                              legalDocs: (selectedDeal.legalDocs || []).filter(
                                                (d: { id: string }) => d.id !== doc.id,
                                              ),
                                            } as Partial<Deal>)
                                          }
                                        >
                                          <X className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}

                              <button
                                onClick={() => {
                                  const mockDoc = {
                                    id: Date.now().toString(),
                                    name: `Document_${(selectedDeal.legalDocs || []).length + 1}.pdf`,
                                    size: '2.1 MB',
                                    type: 'CR',
                                  };
                                  updateDeal(selectedDeal.id, {
                                    legalDocs: [...(selectedDeal.legalDocs || []), mockDoc],
                                  } as Partial<Deal>);
                                  if (!selectedDeal.completedRequirements?.includes('legal_docs')) {
                                    toggleRequirement(selectedDeal.id, 'legal_docs');
                                  }
                                  toast.success('Document uploaded');
                                }}
                                className="w-full flex items-center justify-center gap-2 h-9 border border-dashed border-border rounded-lg text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                              >
                                <Upload className="h-3.5 w-3.5" />
                                Upload Document (CR or VAT)
                              </button>
                            </div>
                          )}

                          {/* ── Discount panel ── */}
                          {isExpanded && req.id === 'discount_applied' && (
                            <div className="mt-1 p-3 bg-muted/30 border border-border/50 rounded-lg space-y-2">
                              <p className="text-xs text-muted-foreground font-medium">
                                Select Discount
                              </p>
                              <button
                                onClick={() => {
                                  updateDeal(selectedDeal.id, {
                                    discount: null,
                                  } as Partial<Deal>);
                                  if (
                                    !selectedDeal.completedRequirements?.includes(
                                      'discount_applied',
                                    )
                                  ) {
                                    toggleRequirement(selectedDeal.id, 'discount_applied');
                                  }
                                  setExpandedReq(null);
                                  toast.success('No discount applied');
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-muted text-sm text-muted-foreground transition-colors"
                              >
                                No discount
                              </button>
                              {[
                                {
                                  id: 'd1',
                                  label: '10% Off — First 3 months',
                                  value: 10,
                                },
                                {
                                  id: 'd2',
                                  label: '15% Off — Annual commitment',
                                  value: 15,
                                },
                                {
                                  id: 'd3',
                                  label: '20% Off — Strategic partner',
                                  value: 20,
                                },
                                { id: 'd4', label: 'Custom discount', value: 0 },
                              ].map((discount) => (
                                <button
                                  key={discount.id}
                                  onClick={() => {
                                    updateDeal(selectedDeal.id, {
                                      discount,
                                    } as Partial<Deal>);
                                    if (
                                      !selectedDeal.completedRequirements?.includes(
                                        'discount_applied',
                                      )
                                    ) {
                                      toggleRequirement(selectedDeal.id, 'discount_applied');
                                    }
                                    setExpandedReq(null);
                                    toast.success(`Discount applied: ${discount.label}`);
                                  }}
                                  className={cn(
                                    'w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors',
                                    selectedDeal.discount?.id === discount.id
                                      ? 'border-primary bg-primary/10 text-primary'
                                      : 'border-border hover:bg-muted text-foreground',
                                  )}
                                >
                                  {discount.label}
                                  {selectedDeal.discount?.id === discount.id && (
                                    <Check className="h-3.5 w-3.5 float-right mt-0.5" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // ── Payment method: custom rendering ──
                    if (req.type === 'payment_method') {
                      const paymentDone =
                        selectedDeal.paymentLink?.url || selectedDeal.bankTransferReceipt;
                      const pmCompleted = isCompleted || !!paymentDone;

                      return (
                        <div key={req.id} className="space-y-0">
                          {/* Requirement row */}
                          <div
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all',
                              pmCompleted
                                ? 'bg-muted/30 border-border/30 opacity-60'
                                : req.isBlocker
                                  ? 'bg-destructive/5 border-destructive/20'
                                  : 'bg-card border-border hover:border-border/80',
                            )}
                          >
                            {/* Checkbox */}
                            <div
                              className={cn(
                                'w-5 h-5 rounded flex items-center justify-center shrink-0 border',
                                pmCompleted ? 'bg-primary border-primary' : 'border-border',
                              )}
                            >
                              {pmCompleted && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>

                            {/* Label */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={cn(
                                    'text-sm',
                                    pmCompleted && 'line-through text-muted-foreground',
                                  )}
                                >
                                  {req.label}
                                </span>
                                {req.isBlocker && !pmCompleted && (
                                  <span className="text-xs text-destructive font-medium shrink-0">
                                    Required
                                  </span>
                                )}
                              </div>
                              {pmCompleted && selectedDeal.paymentMethod && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {selectedDeal.paymentMethod === 'payment_link'
                                    ? `Payment Link · ${selectedDeal.paymentLink?.status === 'paid' ? 'Paid' : 'Pending'}`
                                    : 'Bank Transfer · Receipt uploaded'}
                                </p>
                              )}
                              {!pmCompleted && selectedDeal.paymentMethod && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {selectedDeal.paymentMethod === 'payment_link'
                                    ? 'Payment Link'
                                    : 'Bank Transfer'}
                                </p>
                              )}
                            </div>

                            {/* Action button */}
                            {!pmCompleted && !selectedDeal.paymentMethod && (
                              <button
                                onClick={() => setPaymentMethodExpanded(!paymentMethodExpanded)}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors shrink-0"
                              >
                                Select
                              </button>
                            )}
                            {pmCompleted && (
                              <button
                                onClick={() => setPaymentMethodExpanded(!paymentMethodExpanded)}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
                              >
                                {paymentMethodExpanded ? 'Close' : 'Edit'}
                              </button>
                            )}
                          </div>

                          {/* STATE 1: Method selector (inline) */}
                          {!pmCompleted && !selectedDeal.paymentMethod && paymentMethodExpanded && (
                            <div className="mt-2 ml-7 grid grid-cols-2 gap-2">
                              <button
                                onClick={() => {
                                  updateDeal(selectedDeal.id, {
                                    paymentMethod: 'payment_link',
                                  } as Partial<Deal>);
                                  setPaymentMethodExpanded(false);
                                  const mrr = selectedDeal.estimatedMRR || 0;
                                  const cycle = selectedDeal.billingCycle || 'Monthly';
                                  const amount = cycle === 'Annual' ? mrr * 12 : mrr;
                                  setPaymentAmount(amount.toString());
                                  setPaymentCurrency(selectedDeal.currency || 'SAR');
                                  setPaymentNotes('');
                                  setPaymentStep('form');
                                  setGeneratedLink('');
                                  setLinkCopied(false);
                                  setPaymentLinkOpen(true);
                                }}
                                className="flex flex-col items-center gap-2 py-3 rounded-xl border border-border hover:border-primary/50 bg-muted/30 transition-all"
                              >
                                <Link2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">
                                  Payment Link
                                </span>
                              </button>
                              <button
                                onClick={() => {
                                  updateDeal(selectedDeal.id, {
                                    paymentMethod: 'bank_transfer',
                                  } as Partial<Deal>);
                                }}
                                className="flex flex-col items-center gap-2 py-3 rounded-xl border border-border hover:border-primary/50 bg-muted/30 transition-all"
                              >
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">
                                  Bank Transfer
                                </span>
                              </button>
                            </div>
                          )}

                          {/* STATE 2b: Bank transfer inline — bank details + upload */}
                          {!pmCompleted && selectedDeal.paymentMethod === 'bank_transfer' && (
                            <div className="mt-2 ml-7 space-y-2">
                              <div className="px-3 py-2.5 bg-muted/30 border border-border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-muted-foreground">
                                    Bank Details
                                  </span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        'Bank: Riyad Bank | IBAN: SA12 3456 7890 1234 5678 90 | Ref: ' +
                                          selectedDeal.id,
                                      );
                                      toast.success('Copied!');
                                    }}
                                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                                  >
                                    <Copy className="h-3 w-3" /> Copy
                                  </button>
                                </div>
                                <div className="space-y-1">
                                  {[
                                    { label: 'Bank', value: 'Riyad Bank' },
                                    { label: 'IBAN', value: 'SA12 3456 7890 1234 5678 90' },
                                    { label: 'Ref', value: selectedDeal.id },
                                  ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">{label}</span>
                                      <span className="font-mono font-medium">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  updateDeal(selectedDeal.id, {
                                    bankTransferReceipt: {
                                      fileName: 'Transfer_Receipt.pdf',
                                      uploadedAt: new Date().toISOString(),
                                    },
                                  } as Partial<Deal>);
                                  toggleRequirement(selectedDeal.id, 'payment_method_selected');
                                  toast.success('Receipt uploaded!');
                                }}
                                className="w-full h-10 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg text-xs text-muted-foreground hover:border-blue-400/50 hover:text-blue-400 transition-colors"
                              >
                                <Upload className="h-4 w-4" />
                                Upload Transfer Receipt
                              </button>
                            </div>
                          )}

                          {/* STATE 3: Unified payment method + status card */}
                          {pmCompleted && paymentMethodExpanded && (
                            <>
                              {selectedDeal.paymentMethod === 'payment_link' &&
                                selectedDeal.paymentLink && (
                                  <div className="mt-2 ml-7 rounded-xl border border-border overflow-hidden">
                                    {/* Row 1: Method summary */}
                                    <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border/50">
                                      <Link2 className="h-3.5 w-3.5 text-primary shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium">Payment Link</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {selectedDeal.paymentLink.url}
                                        </p>
                                      </div>
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-medium shrink-0">
                                        Pending
                                      </span>
                                    </div>

                                    {/* Row 2: Payment status */}
                                    {selectedDeal.paymentStatus !== 'confirmed' ? (
                                      <div className="px-3 py-2.5 border-b border-border/50">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse shrink-0" />
                                          <span className="text-xs text-yellow-400 font-medium">
                                            Awaiting Payment
                                          </span>
                                        </div>
                                        <Button
                                          size="sm"
                                          className="w-full gap-2 h-8 text-xs"
                                          onClick={() => setConfirmPaymentOpen(true)}
                                        >
                                          <CheckCircle2 className="h-3.5 w-3.5" />
                                          Confirm Payment Received
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="border-b border-border/50">
                                        <button
                                          onClick={() => setTrackPaymentOpen(!trackPaymentOpen)}
                                          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/30 transition-colors"
                                        >
                                          <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                                            <span className="text-xs font-medium text-primary">
                                              Payment Confirmed ✓
                                            </span>
                                          </div>
                                          <ChevronDown
                                            className={cn(
                                              'h-3.5 w-3.5 text-muted-foreground transition-transform',
                                              trackPaymentOpen && 'rotate-180',
                                            )}
                                          />
                                        </button>
                                        {trackPaymentOpen && (
                                          <div className="px-3 pb-3 space-y-1.5 border-t border-border/30">
                                            {[
                                              {
                                                label: 'Amount',
                                                value: `${selectedDeal.paymentLink?.currency || 'SAR'} ${(selectedDeal.paymentLink?.amount || 0).toLocaleString()}`,
                                              },
                                              { label: 'Method', value: 'Payment Link' },
                                              { label: 'Reference', value: selectedDeal.id },
                                              {
                                                label: 'Confirmed',
                                                value: selectedDeal.paymentConfirmedAt
                                                  ? new Date(
                                                      selectedDeal.paymentConfirmedAt,
                                                    ).toLocaleDateString('en-GB', {
                                                      day: '2-digit',
                                                      month: 'short',
                                                      year: 'numeric',
                                                    })
                                                  : '—',
                                              },
                                              {
                                                label: 'By',
                                                value: selectedDeal.paymentConfirmedBy || '—',
                                              },
                                            ].map(({ label, value }) => (
                                              <div
                                                key={label}
                                                className="flex justify-between pt-1.5"
                                              >
                                                <span className="text-xs text-muted-foreground">
                                                  {label}
                                                </span>
                                                <span className="text-xs font-medium">{value}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Row 3: Actions */}
                                    <div className="flex items-center gap-3 px-3 py-2">
                                      <button
                                        onClick={() => {
                                          setGeneratedLink(selectedDeal.paymentLink!.url);
                                          setPaymentAmount(
                                            selectedDeal.paymentLink!.amount.toString(),
                                          );
                                          setPaymentCurrency(selectedDeal.paymentLink!.currency);
                                          setLinkCopied(false);
                                          setPaymentStep('generated');
                                          setPaymentLinkOpen(true);
                                        }}
                                        className="text-xs text-primary hover:underline"
                                      >
                                        View / Resend
                                      </button>
                                      <span className="text-muted-foreground/30">·</span>
                                      <button
                                        onClick={() => {
                                          updateDeal(selectedDeal.id, {
                                            paymentMethod: undefined,
                                            paymentLink: undefined,
                                            paymentStatus: undefined,
                                            completedRequirements:
                                              selectedDeal.completedRequirements?.filter(
                                                (r: string) => r !== 'payment_method_selected',
                                              ) || [],
                                          } as Partial<Deal>);
                                          setPaymentMethodExpanded(false);
                                        }}
                                        className="text-xs text-muted-foreground hover:text-foreground"
                                      >
                                        Change method
                                      </button>
                                    </div>
                                  </div>
                                )}

                              {selectedDeal.paymentMethod === 'bank_transfer' &&
                                selectedDeal.bankTransferReceipt && (
                                  <div className="mt-2 ml-7 rounded-xl border border-border overflow-hidden">
                                    {/* Row 1: Method summary */}
                                    <div className="flex items-center gap-3 px-3 py-2.5 border-b border-border/50">
                                      <Building2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium">Bank Transfer</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {selectedDeal.bankTransferReceipt.fileName}
                                        </p>
                                      </div>
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-medium shrink-0">
                                        Pending
                                      </span>
                                    </div>

                                    {/* Row 2: Payment status */}
                                    {selectedDeal.paymentStatus !== 'confirmed' ? (
                                      <div className="px-3 py-2.5 border-b border-border/50">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse shrink-0" />
                                          <span className="text-xs text-yellow-400 font-medium">
                                            Awaiting Payment
                                          </span>
                                        </div>
                                        <Button
                                          size="sm"
                                          className="w-full gap-2 h-8 text-xs"
                                          onClick={() => setConfirmPaymentOpen(true)}
                                        >
                                          <CheckCircle2 className="h-3.5 w-3.5" />
                                          Confirm Payment Received
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="border-b border-border/50">
                                        <button
                                          onClick={() => setTrackPaymentOpen(!trackPaymentOpen)}
                                          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/30 transition-colors"
                                        >
                                          <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                                            <span className="text-xs font-medium text-primary">
                                              Payment Confirmed ✓
                                            </span>
                                          </div>
                                          <ChevronDown
                                            className={cn(
                                              'h-3.5 w-3.5 text-muted-foreground transition-transform',
                                              trackPaymentOpen && 'rotate-180',
                                            )}
                                          />
                                        </button>
                                        {trackPaymentOpen && (
                                          <div className="px-3 pb-3 space-y-1.5 border-t border-border/30">
                                            {[
                                              {
                                                label: 'Amount',
                                                value: `SAR ${(selectedDeal.estimatedMRR || 0).toLocaleString()}`,
                                              },
                                              { label: 'Method', value: 'Bank Transfer' },
                                              {
                                                label: 'Receipt',
                                                value:
                                                  selectedDeal.bankTransferReceipt?.fileName || '—',
                                              },
                                              { label: 'Reference', value: selectedDeal.id },
                                              {
                                                label: 'Confirmed',
                                                value: selectedDeal.paymentConfirmedAt
                                                  ? new Date(
                                                      selectedDeal.paymentConfirmedAt,
                                                    ).toLocaleDateString('en-GB', {
                                                      day: '2-digit',
                                                      month: 'short',
                                                      year: 'numeric',
                                                    })
                                                  : '—',
                                              },
                                              {
                                                label: 'By',
                                                value: selectedDeal.paymentConfirmedBy || '—',
                                              },
                                            ].map(({ label, value }) => (
                                              <div
                                                key={label}
                                                className="flex justify-between pt-1.5"
                                              >
                                                <span className="text-xs text-muted-foreground">
                                                  {label}
                                                </span>
                                                <span className="text-xs font-medium">{value}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Row 3: Actions */}
                                    <div className="flex items-center gap-3 px-3 py-2">
                                      <button
                                        onClick={() => toast.info('Opening receipt...')}
                                        className="text-xs text-primary hover:underline"
                                      >
                                        View Receipt
                                      </button>
                                      <span className="text-muted-foreground/30">·</span>
                                      <button
                                        onClick={() => {
                                          updateDeal(selectedDeal.id, {
                                            bankTransferReceipt: null,
                                            completedRequirements:
                                              selectedDeal.completedRequirements?.filter(
                                                (r: string) => r !== 'payment_method_selected',
                                              ) || [],
                                          } as Partial<Deal>);
                                        }}
                                        className="text-xs text-muted-foreground hover:text-destructive"
                                      >
                                        Remove receipt
                                      </button>
                                      <span className="text-muted-foreground/30">·</span>
                                      <button
                                        onClick={() => {
                                          updateDeal(selectedDeal.id, {
                                            paymentMethod: undefined,
                                            bankTransferReceipt: null,
                                            paymentStatus: undefined,
                                            completedRequirements:
                                              selectedDeal.completedRequirements?.filter(
                                                (r: string) => r !== 'payment_method_selected',
                                              ) || [],
                                          } as Partial<Deal>);
                                          setPaymentMethodExpanded(false);
                                        }}
                                        className="text-xs text-muted-foreground hover:text-foreground"
                                      >
                                        Change method
                                      </button>
                                    </div>
                                  </div>
                                )}
                            </>
                          )}
                        </div>
                      );
                    }

                    // ── Non-documents stages: original rendering ──
                    return (
                      <div key={req.id} className="space-y-2">
                        <div
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all',
                            isCompleted
                              ? 'bg-muted/30 border-border/30 opacity-60'
                              : req.isBlocker
                                ? 'bg-destructive/5 border-destructive/20'
                                : 'bg-card border-border hover:border-border/80',
                          )}
                        >
                          {isAutoChecked ? (
                            <div
                              className="w-5 h-5 rounded flex items-center justify-center shrink-0 border bg-primary border-primary opacity-70 cursor-default"
                              title="Auto-filled from deal data"
                            >
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                isToggleable && toggleRequirement(selectedDeal.id, req.id)
                              }
                              className={cn(
                                'w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all',
                                isCompleted
                                  ? 'bg-primary border-primary'
                                  : 'border-border hover:border-primary/50',
                              )}
                            >
                              {isCompleted && <Check className="h-3 w-3 text-primary-foreground" />}
                            </button>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  'text-sm',
                                  isCompleted && 'line-through text-muted-foreground',
                                )}
                              >
                                {req.label}
                              </span>
                              {isAutoChecked && (
                                <span className="text-[10px] text-muted-foreground italic">
                                  auto-filled
                                </span>
                              )}
                              {req.isBlocker && !isCompleted && (
                                <span className="text-xs text-destructive font-medium shrink-0">
                                  Required
                                </span>
                              )}
                            </div>
                            {req.description && !isCompleted && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {req.description}
                              </p>
                            )}
                          </div>

                          {!isCompleted &&
                            (req.type === 'send_email' || req.type === 'send_whatsapp' ? (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => {
                                    setActiveRequirement(req);
                                    setSelectedTemplate('');
                                    setEmailNote('');
                                    setSendEmailOpen(true);
                                  }}
                                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                                >
                                  <Mail className="h-3 w-3" />
                                  Send
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveRequirement(req);
                                    setMarkSentOpen(true);
                                  }}
                                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                                >
                                  <Check className="h-3 w-3" />
                                  Done
                                </button>
                              </div>
                            ) : req.type === 'log_interaction' ? (
                              <button
                                onClick={() => {
                                  setActiveRequirement(req);
                                  setInteractionType('call');
                                  setInteractionDate(new Date().toISOString().slice(0, 16));
                                  setInteractionNotes('');
                                  setLogInteractionOpen(true);
                                }}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors shrink-0"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                                Log
                              </button>
                            ) : req.type === 'data_field' && req.field ? (
                              <button
                                onClick={() => setEditingField(req.field!)}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors shrink-0"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                {selectedDeal[req.field as keyof typeof selectedDeal]
                                  ? 'Edit'
                                  : 'Add'}
                              </button>
                            ) : null)}

                          {isCompleted && (
                            <span className="text-xs text-muted-foreground shrink-0">Done</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SECTION: Activity Log */}
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Activity Log
              </h3>
              <div className="space-y-2">
                {(selectedDeal.activities || [])
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 group"
                    >
                      <div
                        className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                          activity.type === 'email_sent' && 'bg-blue-500/10 text-blue-400',
                          activity.type === 'whatsapp_sent' && 'bg-green-500/10 text-green-400',
                          activity.type === 'call_logged' && 'bg-purple-500/10 text-purple-400',
                          activity.type === 'meeting_logged' && 'bg-purple-500/10 text-purple-400',
                          activity.type === 'stage_change' && 'bg-primary/10 text-primary',
                          activity.type === 'field_updated' && 'bg-muted text-muted-foreground',
                          activity.type === 'manual_check' && 'bg-muted text-muted-foreground',
                        )}
                      >
                        {activity.type === 'email_sent' && <Mail className="h-3.5 w-3.5" />}
                        {activity.type === 'whatsapp_sent' && (
                          <MessageCircle className="h-3.5 w-3.5" />
                        )}
                        {activity.type === 'call_logged' && <Phone className="h-3.5 w-3.5" />}
                        {activity.type === 'meeting_logged' && (
                          <MessageSquare className="h-3.5 w-3.5" />
                        )}
                        {activity.type === 'stage_change' && (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                        {activity.type === 'field_updated' && <Pencil className="h-3.5 w-3.5" />}
                        {activity.type === 'manual_check' && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm text-foreground">
                              {activity.type === 'email_sent' &&
                                `Email sent via ${activity.channel}`}
                              {activity.type === 'whatsapp_sent' && 'WhatsApp message sent'}
                              {activity.type === 'call_logged' && `${activity.channel} logged`}
                              {activity.type === 'meeting_logged' && 'Meeting logged'}
                              {activity.type === 'stage_change' && 'Stage changed'}
                              {activity.type === 'field_updated' && 'Field updated'}
                              {activity.type === 'manual_check' && 'Action completed'}
                            </p>
                            {activity.template && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Template: {activity.template}
                              </p>
                            )}
                            {activity.note && (
                              <p className="text-xs text-muted-foreground mt-1 bg-muted rounded px-2 py-1">
                                {activity.note}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {new Date(activity.date).toLocaleString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                · {activity.loggedBy}
                              </span>
                            </div>
                          </div>
                          {activity.canEdit && (
                            <button
                              onClick={() => setEditingActivity(activity)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {(!selectedDeal.activities || selectedDeal.activities.length === 0) && (
                  <p className="text-xs text-muted-foreground italic text-center py-4">
                    No activity logged yet
                  </p>
                )}
              </div>
            </section>

            {/* SECTION: Notes */}
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Notes
              </h3>
              <div className="space-y-2 mb-3">
                {(selectedDeal.notes || []).map((n) => (
                  <div key={n.id} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                      {n.author.charAt(0)}
                    </div>
                    <div className="flex-1 bg-muted/30 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{n.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeDate(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{n.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && noteText.trim()) handleAddNote();
                  }}
                  placeholder="Add a note... (Enter to save)"
                  className="flex-1 h-8 px-3 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 px-3 text-xs shrink-0"
                  onClick={handleAddNote}
                  disabled={!noteText.trim()}
                >
                  Save
                </Button>
              </div>
            </section>
          </div>

          {/* FIXED BOTTOM: Stage navigation */}
          <div className="shrink-0 px-6 py-4 border-t border-border bg-card space-y-2">
            {selectedDeal.closedStatus === 'won' ? (
              <div className="flex items-center justify-center gap-2 py-1">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Deal Won</span>
              </div>
            ) : selectedDeal.closedStatus === 'lost' ? (
              <div className="flex items-center justify-center gap-2 py-1">
                <X className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Deal Lost</span>
              </div>
            ) : nextStage ? (
              hasBlockers ? (
                <Button className="w-full gap-2" disabled>
                  <Lock className="h-4 w-4" />
                  Move to {nextStage.label}
                  <span className="ml-auto text-xs opacity-60">
                    {completedCount}/{totalReqs}
                  </span>
                </Button>
              ) : missingNonBlockers.length > 0 ? (
                <Button className="w-full gap-2" onClick={() => setMoveWarningOpen(true)}>
                  <AlertCircle className="h-4 w-4" />
                  Move to {nextStage.label}
                  <span className="ml-auto text-xs opacity-60">
                    {completedCount}/{totalReqs}
                  </span>
                </Button>
              ) : (
                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    moveDealToStage(selectedDeal.id, nextStage.id);
                    toast.success(`Moved to ${nextStage.label}`);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                  Move to {nextStage.label}
                </Button>
              )
            ) : selectedDeal.paymentStatus === 'confirmed' ? (
              <Button
                className="w-full gap-2"
                onClick={() => {
                  markWon(selectedDeal.id);
                  toast.success(`"${selectedDeal.companyName}" marked as Won`);
                }}
              >
                <Trophy className="h-4 w-4" />
                Move to Won
              </Button>
            ) : hasBlockers ? (
              <Button className="w-full gap-2" disabled>
                <Lock className="h-4 w-4" />
                Move to Won
                <span className="ml-auto text-xs opacity-60">
                  {completedCount}/{totalReqs}
                </span>
              </Button>
            ) : missingNonBlockers.length > 0 ? (
              <Button className="w-full gap-2" onClick={() => setMoveWarningOpen(true)}>
                <AlertCircle className="h-4 w-4" />
                Move to Won
                <span className="ml-auto text-xs opacity-60">
                  {completedCount}/{totalReqs}
                </span>
              </Button>
            ) : (
              <Button
                className="w-full gap-2"
                onClick={() => {
                  markWon(selectedDeal.id);
                  toast.success(`"${selectedDeal.companyName}" marked as Won`);
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Move to Won
              </Button>
            )}
            {!selectedDeal.closedStatus && (
              <button
                onClick={handleMarkLost}
                className="w-full text-center text-xs text-muted-foreground hover:text-destructive transition-colors py-1"
              >
                Mark as Lost
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Dialogs ─── */}

      {/* Move warning */}
      <AlertDialog open={moveWarningOpen} onOpenChange={setMoveWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Requirements Incomplete</AlertDialogTitle>
            <AlertDialogDescription>
              The following requirements are not completed for this stage:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-1.5 my-2">
            {missingNonBlockers.map((req) => (
              <div key={req.id} className="flex items-center gap-2 text-sm text-destructive">
                <X className="h-3.5 w-3.5 shrink-0" />
                {req.label}
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Complete First</AlertDialogCancel>
            <AlertDialogAction
              className="bg-transparent text-foreground shadow-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                if (selectedDeal) {
                  if (nextStage) {
                    moveDealToStage(selectedDeal.id, nextStage.id);
                    toast.success(`Moved to ${nextStage.label}`);
                  } else {
                    markWon(selectedDeal.id);
                    toast.success(`"${selectedDeal.companyName}" marked as Won`);
                  }
                }
              }}
            >
              Move Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Payment */}
      <AlertDialog open={confirmPaymentOpen} onOpenChange={setConfirmPaymentOpen}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment Received?</AlertDialogTitle>
            <AlertDialogDescription>
              Confirming payment received for <strong>{selectedDeal?.companyName}</strong>. This
              action will be logged and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-muted/30 border border-border rounded-lg p-3 my-2 space-y-1.5">
            {[
              {
                label: 'Amount',
                value: `${selectedDeal?.paymentLink?.currency || 'SAR'} ${(selectedDeal?.paymentLink?.amount || selectedDeal?.estimatedMRR || 0).toLocaleString()}`,
              },
              {
                label: 'Method',
                value:
                  selectedDeal?.paymentMethod === 'payment_link' ? 'Payment Link' : 'Bank Transfer',
              },
              { label: 'Company', value: selectedDeal?.companyName },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirmPayment(selectedDeal!.id);
                setConfirmPaymentOpen(false);
                setTrackPaymentOpen(true);
                toast.success('Payment confirmed! Deal ready to move to Won.');
              }}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Email */}
      <Dialog open={sendEmailOpen} onOpenChange={setSendEmailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Email / WhatsApp</DialogTitle>
            <DialogDescription>
              To: {selectedDeal?.contactName} ({selectedDeal?.contactEmail})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg border border-primary bg-primary/10 text-sm text-primary">
                <Mail className="h-4 w-4" /> Email
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </button>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Select Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Choose a template...</option>
                {EMAIL_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Add note (optional)
              </label>
              <textarea
                value={emailNote}
                onChange={(e) => setEmailNote(e.target.value)}
                rows={2}
                placeholder="What was discussed..."
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSendEmailOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedTemplate}
              onClick={() => {
                if (activeRequirement && selectedDeal) {
                  toggleRequirement(selectedDeal.id, activeRequirement.id);
                  const tpl = EMAIL_TEMPLATES.find((t) => t.id === selectedTemplate);
                  addActivity(selectedDeal.id, {
                    id: `a-${Date.now()}`,
                    type: 'email_sent',
                    requirementId: activeRequirement.id,
                    channel: 'Email',
                    template: tpl?.label,
                    note: emailNote || undefined,
                    date: new Date().toISOString(),
                    loggedAt: new Date().toISOString(),
                    loggedBy: 'You',
                    canEdit: true,
                  });
                }
                toast.success('Marked as sent');
                setSendEmailOpen(false);
                setSelectedTemplate('');
                setEmailNote('');
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Mark as Sent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Interaction */}
      <Dialog open={logInteractionOpen} onOpenChange={setLogInteractionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Interaction</DialogTitle>
            <DialogDescription>
              Record an interaction with {selectedDeal?.contactName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Type</label>
              <div className="flex gap-2">
                {(
                  [
                    { value: 'call', label: 'Call', Icon: Phone },
                    { value: 'meeting', label: 'Meeting', Icon: MessageSquare },
                    { value: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
                    { value: 'email', label: 'Email', Icon: Mail },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setInteractionType(t.value)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border text-xs transition-colors',
                      interactionType === t.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:bg-muted',
                    )}
                  >
                    <t.Icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Date & Time</label>
              <input
                type="datetime-local"
                value={interactionDate}
                onChange={(e) => setInteractionDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Notes (required)</label>
              <textarea
                value={interactionNotes}
                onChange={(e) => setInteractionNotes(e.target.value)}
                rows={3}
                placeholder="What was discussed..."
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setLogInteractionOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={interactionNotes.length < 10}
              onClick={() => {
                if (activeRequirement && selectedDeal) {
                  toggleRequirement(selectedDeal.id, activeRequirement.id);
                  const channelMap: Record<string, DealActivity['channel']> = {
                    call: 'Call',
                    meeting: 'Meeting',
                    whatsapp: 'WhatsApp',
                    email: 'Email',
                  };
                  const typeMap: Record<string, DealActivity['type']> = {
                    call: 'call_logged',
                    meeting: 'meeting_logged',
                    whatsapp: 'whatsapp_sent',
                    email: 'email_sent',
                  };
                  addActivity(selectedDeal.id, {
                    id: `a-${Date.now()}`,
                    type: typeMap[interactionType] || 'call_logged',
                    requirementId: activeRequirement.id,
                    channel: channelMap[interactionType],
                    note: interactionNotes,
                    date: interactionDate || new Date().toISOString(),
                    loggedAt: new Date().toISOString(),
                    loggedBy: 'You',
                    canEdit: true,
                  });
                }
                toast.success('Interaction logged');
                setLogInteractionOpen(false);
                setInteractionNotes('');
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Log Interaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Done (externally sent) */}
      <Dialog open={markSentOpen} onOpenChange={setMarkSentOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Mark as Done</DialogTitle>
            <DialogDescription>
              Record that you already sent this outside the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block font-medium">
                Channel used
              </label>
              <div className="flex gap-2">
                {(['Email', 'WhatsApp', 'Call'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setMarkSentChannel(ch)}
                    className={cn(
                      'flex-1 h-9 rounded-lg border text-sm transition-colors',
                      markSentChannel === ch
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border text-muted-foreground hover:bg-muted',
                    )}
                  >
                    {ch === 'Email' && <Mail className="h-3.5 w-3.5 inline mr-1.5" />}
                    {ch === 'WhatsApp' && <MessageCircle className="h-3.5 w-3.5 inline mr-1.5" />}
                    {ch === 'Call' && <Phone className="h-3.5 w-3.5 inline mr-1.5" />}
                    {ch}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block font-medium">When</label>
              <input
                type="datetime-local"
                value={markSentDate}
                onChange={(e) => setMarkSentDate(e.target.value)}
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full h-9 px-3 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block font-medium">
                Note (optional)
              </label>
              <textarea
                value={markSentNote}
                onChange={(e) => setMarkSentNote(e.target.value)}
                rows={2}
                placeholder="What was discussed or shared..."
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setMarkSentOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (activeRequirement && selectedDeal) {
                  toggleRequirement(selectedDeal.id, activeRequirement.id);
                  const typeMap: Record<string, DealActivity['type']> = {
                    Email: 'email_sent',
                    WhatsApp: 'whatsapp_sent',
                    Call: 'call_logged',
                  };
                  addActivity(selectedDeal.id, {
                    id: `a-${Date.now()}`,
                    type: typeMap[markSentChannel] || 'email_sent',
                    requirementId: activeRequirement.id,
                    channel: markSentChannel,
                    note: markSentNote || undefined,
                    date: markSentDate || new Date().toISOString(),
                    loggedAt: new Date().toISOString(),
                    loggedBy: 'You',
                    canEdit: true,
                  });
                  toast.success(`Marked as done via ${markSentChannel}`);
                }
                setMarkSentOpen(false);
                setMarkSentNote('');
                setMarkSentDate('');
              }}
            >
              <Check className="h-4 w-4 mr-1.5" />
              Mark as Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Activity */}
      <Dialog open={!!editingActivity} onOpenChange={() => setEditingActivity(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          {editingActivity && (
            <div className="space-y-3 py-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block font-medium">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  defaultValue={editingActivity.date.slice(0, 16)}
                  onChange={(e) =>
                    setEditingActivity((prev) => (prev ? { ...prev, date: e.target.value } : null))
                  }
                  className="w-full h-9 px-3 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block font-medium">Note</label>
                <textarea
                  defaultValue={editingActivity.note || ''}
                  onChange={(e) =>
                    setEditingActivity((prev) => (prev ? { ...prev, note: e.target.value } : null))
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setEditingActivity(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (editingActivity && selectedDeal) {
                  updateDeal(selectedDeal.id, {
                    activities: selectedDeal.activities.map((a) =>
                      a.id === editingActivity.id ? editingActivity : a,
                    ),
                  } as Partial<Deal>);
                  toast.success('Activity updated');
                  setEditingActivity(null);
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Lost */}
      <Dialog open={lostDialogOpen} onOpenChange={setLostDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Mark as Lost</DialogTitle>
            <DialogDescription>Select the reason this deal was lost.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              {LOST_REASONS.map((reason) => (
                <label key={reason} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="lostReason"
                    value={reason}
                    checked={lostReason === reason}
                    onChange={() => setLostReason(reason)}
                    className="accent-destructive"
                  />
                  <span className="text-sm text-foreground">{reason}</span>
                </label>
              ))}
            </div>
            <textarea
              placeholder="Optional notes..."
              value={lostNote}
              onChange={(e) => setLostNote(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLostDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmLost}>
              Confirm Lost
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Payment Link */}
      <Dialog
        open={paymentLinkOpen}
        onOpenChange={(open) => {
          if (!open && paymentStep !== 'loading') {
            setPaymentLinkOpen(false);
            setPaymentStep('form');
            setLinkCopied(false);
            setPaymentAmount('');
            setPaymentNotes('');
          } else if (open) {
            setPaymentLinkOpen(true);
          }
        }}
      >
        {paymentStep === 'form' && (
          <DialogContent className="max-w-sm p-6">
            <DialogHeader className="pr-8">
              <DialogTitle>Generate Payment Link</DialogTitle>
              <DialogDescription>Creating link for {selectedDeal?.companyName}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 w-full">
              {/* Customer summary */}
              <div className="w-full bg-muted/40 rounded-lg p-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{selectedDeal?.requestedPlan || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing</span>
                  <span className="font-medium">{selectedDeal?.billingCycle || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-xs">{selectedDeal?.contactEmail}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="w-full">
                <label className="text-xs text-muted-foreground mb-1.5 block">Amount *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-1 h-9 px-3 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <select
                    value={paymentCurrency}
                    onChange={(e) => setPaymentCurrency(e.target.value)}
                    className="w-20 h-9 px-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option>SAR</option>
                    <option>AED</option>
                    <option>USD</option>
                    <option>KWD</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="w-full">
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Note to customer (optional)
                </label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Annual Pro plan subscription"
                  className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button variant="ghost" size="sm" onClick={() => setPaymentLinkOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!paymentAmount}
                onClick={() => {
                  setPaymentStep('loading');
                  const mockLink = `https://pay.highlit.io/inv/pl-${Date.now().toString().slice(-10)}`;
                  setTimeout(() => {
                    setGeneratedLink(mockLink);
                    if (selectedDeal) {
                      updateDeal(selectedDeal.id, {
                        paymentLink: {
                          id: Date.now().toString(),
                          url: mockLink,
                          amount: Number(paymentAmount),
                          currency: paymentCurrency,
                          plan: selectedDeal.requestedPlan,
                          billingCycle: selectedDeal.billingCycle || 'Monthly',
                          status: 'pending',
                          createdAt: new Date().toISOString(),
                        },
                      } as Partial<Deal>);
                      if (!selectedDeal.completedRequirements?.includes('payment_link_generated')) {
                        toggleRequirement(selectedDeal.id, 'payment_link_generated');
                      }
                    }
                    setPaymentStep('generated');
                  }, 2000);
                }}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Generate Link
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {paymentStep === 'loading' && (
          <DialogContent className="max-w-sm p-6">
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium">Generating payment link...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Creating link for {selectedDeal?.companyName}
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => {
                setPaymentStep('form');
                toast.error('Cancelled');
              }}
            >
              Cancel
            </Button>
          </DialogContent>
        )}

        {paymentStep === 'generated' && (
          <DialogContent className="max-w-sm p-6">
            <DialogHeader className="pr-8">
              <DialogTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                Payment Link Ready
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 w-full">
              {/* Link copy box */}
              <div className="w-full flex items-center gap-2 px-3 py-2.5 bg-muted border border-border rounded-lg">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-primary font-mono truncate flex-1">
                  {generatedLink}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {linkCopied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* QR Code + info */}
              <div className="w-full flex gap-3 p-3 bg-muted/30 border border-border/50 rounded-lg">
                <div className="w-20 h-20 shrink-0 bg-white rounded-lg p-1 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(generatedLink)}`}
                    alt="QR"
                    className="w-full h-full"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Scan to pay</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Customer can scan this QR to open the payment page on their phone.
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span className="text-xs text-yellow-400 font-medium">Pending payment</span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="w-full flex items-center justify-between px-1">
                <span className="text-sm text-muted-foreground">Total amount</span>
                <span className="text-sm font-bold">
                  {paymentCurrency} {Number(paymentAmount).toLocaleString()}
                </span>
              </div>

              {/* Send buttons */}
              <div className="w-full grid grid-cols-2 gap-2 pt-1">
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    toast.success('Payment link sent via email');
                    setPaymentLinkOpen(false);
                    setPaymentStep('form');
                  }}
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    toast.success('Payment link sent via WhatsApp');
                    setPaymentLinkOpen(false);
                    setPaymentStep('form');
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Or share the copied link manually
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  setPaymentLinkOpen(false);
                  setPaymentStep('form');
                }}
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
