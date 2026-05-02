'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_TEMPLATES } from '@/lib/mock/templates';
import type {
  Template,
  TemplateChannel,
  TemplateCategory,
  TemplateStatus,
  TemplateLanguage,
} from '@/lib/mock/templates';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Copy,
  Archive,
  ArchiveRestore,
  Trash2,
  Mail,
  MessageCircle,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS: Record<TemplateStatus, string> = {
  active: 'bg-primary/10 text-primary',
  draft: 'bg-yellow-500/10 text-yellow-400',
  archived: 'bg-muted text-muted-foreground',
};

const CHANNEL_CONFIG: Record<
  TemplateChannel,
  { icon: React.ElementType; label: string; color: string }
> = {
  email: { icon: Mail, label: 'Email', color: 'bg-blue-500/10 text-blue-400' },
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'bg-primary/10 text-primary' },
  sms: { icon: MessageSquare, label: 'SMS', color: 'bg-purple-500/10 text-purple-400' },
};

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  onboarding: 'Onboarding',
  billing: 'Billing',
  sales: 'Sales',
  support: 'Support',
  marketing: 'Marketing',
  notification: 'Notification',
};

const LANGUAGE_LABELS: Record<TemplateLanguage, string> = {
  en: 'EN',
  ar: 'AR',
  both: 'EN+AR',
};

function relativeTime(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<TemplateChannel | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TemplateStatus | 'all'>('all');
  const [langFilter, setLangFilter] = useState<TemplateLanguage | 'all'>('all');
  const [archiveTarget, setArchiveTarget] = useState<Template | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!t.name.toLowerCase().includes(q)) return false;
      }
      if (channelFilter !== 'all' && t.channel !== channelFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (langFilter !== 'all' && t.language !== langFilter) return false;
      return true;
    });
  }, [templates, searchQuery, channelFilter, categoryFilter, statusFilter, langFilter]);

  const emailCount = templates.filter((t) => t.channel === 'email').length;
  const whatsappCount = templates.filter((t) => t.channel === 'whatsapp').length;
  const smsCount = templates.filter((t) => t.channel === 'sms').length;

  const stats = [
    { label: 'Total', value: String(templates.length) },
    { label: 'Email', value: String(emailCount) },
    { label: 'WhatsApp', value: String(whatsappCount) },
    { label: 'SMS', value: String(smsCount) },
  ];

  function handleDuplicate(tpl: Template) {
    const dup: Template = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      name: `Copy of ${tpl.name}`,
      usageCount: 0,
      lastUsedAt: undefined,
      status: 'draft',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTemplates((prev) => [dup, ...prev]);
    toast.success(`Duplicated "${tpl.name}"`);
  }

  function handleArchive() {
    if (!archiveTarget) return;
    const isArchived = archiveTarget.status === 'archived';
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === archiveTarget.id
          ? { ...t, status: isArchived ? ('active' as const) : ('archived' as const) }
          : t,
      ),
    );
    toast.success(
      isArchived ? `"${archiveTarget.name}" restored` : `"${archiveTarget.name}" archived`,
    );
    setArchiveTarget(null);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  }

  const hasFilters = !!(
    searchQuery ||
    channelFilter !== 'all' ||
    categoryFilter !== 'all' ||
    statusFilter !== 'all' ||
    langFilter !== 'all'
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Message Templates</h1>
          <p className="text-sm text-muted-foreground">Manage email, SMS, and WhatsApp templates</p>
        </div>
        <Button asChild>
          <Link href="/marketing/templates/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 flex-wrap">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-muted/50 px-3 py-2 flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">{s.label}</span>
            <span className="text-xs font-semibold text-foreground tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value as TemplateChannel | 'all')}
          className="h-9 appearance-none pl-3 pr-8 rounded-lg border border-input bg-transparent text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <option value="all">All Channels</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="sms">SMS</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as TemplateCategory | 'all')}
          className="h-9 appearance-none pl-3 pr-8 rounded-lg border border-input bg-transparent text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="onboarding">Onboarding</option>
          <option value="billing">Billing</option>
          <option value="sales">Sales</option>
          <option value="support">Support</option>
          <option value="marketing">Marketing</option>
          <option value="notification">Notification</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TemplateStatus | 'all')}
          className="h-9 appearance-none pl-3 pr-8 rounded-lg border border-input bg-transparent text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value as TemplateLanguage | 'all')}
          className="h-9 appearance-none pl-3 pr-8 rounded-lg border border-input bg-transparent text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
          <option value="both">Both</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => {
              setSearchQuery('');
              setChannelFilter('all');
              setCategoryFilter('all');
              setStatusFilter('all');
              setLangFilter('all');
            }}
            className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {hasFilters
              ? 'Try adjusting your filters or search query.'
              : 'Create your first message template.'}
          </p>
          {!hasFilters && (
            <Button asChild>
              <Link href="/marketing/templates/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Template Name
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Channel
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Category
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Language
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Usage
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground py-3 px-4">
                  Last Used
                </th>
                <th className="text-right text-xs font-medium text-muted-foreground py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tpl) => {
                const ch = CHANNEL_CONFIG[tpl.channel];
                const ChIcon = ch.icon;
                return (
                  <tr
                    key={tpl.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium">{tpl.name}</p>
                      {tpl.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {tpl.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium',
                          ch.color,
                        )}
                      >
                        <ChIcon className="h-3 w-3" />
                        {ch.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground capitalize">
                      {CATEGORY_LABELS[tpl.category]}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {LANGUAGE_LABELS[tpl.language]}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                          STATUS_COLORS[tpl.status],
                        )}
                      >
                        {tpl.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm tabular-nums text-muted-foreground">
                      {tpl.usageCount} times
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {tpl.lastUsedAt ? relativeTime(tpl.lastUsedAt) : 'Never'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/marketing/templates/${tpl.id}/edit`)}
                          >
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/marketing/templates/${tpl.id}/edit`)}
                          >
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(tpl)}>
                            <Copy className="mr-2 h-3.5 w-3.5" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setArchiveTarget(tpl)}>
                            {tpl.status === 'archived' ? (
                              <>
                                <ArchiveRestore className="mr-2 h-3.5 w-3.5" />
                                Unarchive
                              </>
                            ) : (
                              <>
                                <Archive className="mr-2 h-3.5 w-3.5" />
                                Archive
                              </>
                            )}
                          </DropdownMenuItem>
                          {tpl.usageCount === 0 && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeleteTarget(tpl)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Archive Dialog */}
      {archiveTarget && (
        <ConfirmDialog
          open={!!archiveTarget}
          onOpenChange={() => setArchiveTarget(null)}
          title={archiveTarget.status === 'archived' ? 'Unarchive Template' : 'Archive Template'}
          description={
            archiveTarget.status === 'archived'
              ? `Restore "${archiveTarget.name}" and make it available for use again?`
              : `Archive "${archiveTarget.name}"? It will no longer be available for sending.`
          }
          confirmLabel={archiveTarget.status === 'archived' ? 'Unarchive' : 'Archive'}
          variant="default"
          onConfirm={handleArchive}
        />
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={() => setDeleteTarget(null)}
          title="Delete Template"
          description={`Permanently delete "${deleteTarget.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
