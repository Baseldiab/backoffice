'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Search, Plus, MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { MOCK_CUSTOMERS, Company, Plan, CompanyStatus } from '@/lib/mock/customers';
import { formatCurrency, formatRelativeDate, cn } from '@/lib/utils';
import { Pagination } from '@/components/shared/Pagination';

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
  return 'active'; // Enterprise
}

const PLANS: Plan[] = ['Starter', 'Pro', 'Business', 'Enterprise'];

const STATUSES: { value: CompanyStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'trial', label: 'Trial' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'churned', label: 'Churned' },
];

const COUNTRIES = [
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'UAE' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'QA', name: 'Qatar' },
];

const CREDIT_TOTALS: Record<Plan, number> = {
  Starter: 3000,
  Pro: 10000,
  Business: 20000,
  Enterprise: 50000,
};

const COUNTRY_FLAGS: Record<string, string> = {
  SA: '🇸🇦',
  AE: '🇦🇪',
  KW: '🇰🇼',
  QA: '🇶🇦',
};

const PAGE_SIZE = 8;

const inputCls =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-[#3ECF8E]';

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const router = useRouter();

  // Filter state
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [page, setPage] = useState(1);

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<Company | null>(null);
  const [creditsTarget, setCreditsTarget] = useState<Company | null>(null);

  // Add company form
  const [newName, setNewName] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState<Plan>('Starter');
  const [newCountry, setNewCountry] = useState('SA');

  // Add credits form
  const [creditsAmount, setCreditsAmount] = useState('');

  // Local companies (supports adding)
  const [customers, setCustomers] = useState<Company[]>(MOCK_CUSTOMERS);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q) && !c.domain.toLowerCase().includes(q))
        return false;
      if (filterPlan !== 'all' && c.plan !== filterPlan) return false;
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
      if (filterCountry !== 'all' && c.country !== filterCountry) return false;
      return true;
    });
  }, [customers, search, filterPlan, filterStatus, filterCountry]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, filtered.length);
  const rows = filtered.slice(start, end);

  function setFilter<T extends string>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  function resetFilters() {
    setSearch('');
    setFilterPlan('all');
    setFilterStatus('all');
    setFilterCountry('all');
    setPage(1);
  }

  // ── Selection ──────────────────────────────────────────────────────────────

  const allPageSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) rows.forEach((r) => next.delete(r.id));
      else rows.forEach((r) => next.add(r.id));
      return next;
    });
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  function handleSuspend() {
    if (!suspendTarget) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === suspendTarget.id ? { ...c, status: 'suspended' as CompanyStatus } : c,
      ),
    );
    setSuspendTarget(null);
  }

  function handleAddCredits() {
    const amount = parseInt(creditsAmount);
    if (!creditsTarget || isNaN(amount) || amount <= 0) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === creditsTarget.id ? { ...c, creditsTotal: c.creditsTotal + amount } : c,
      ),
    );
    setCreditsTarget(null);
    setCreditsAmount('');
  }

  function handleAddCompany() {
    if (!newName || !newDomain || !newEmail) return;
    const today = new Date().toISOString().split('T')[0];
    const newCompany: Company = {
      id: `c${Date.now()}`,
      name: newName,
      domain: newDomain,
      email: newEmail,
      phone: '',
      address: '',
      industry: '',
      country: newCountry as 'SA' | 'AE' | 'KW' | 'QA',
      countryName: COUNTRIES.find((c) => c.code === newCountry)?.name ?? newCountry,
      countryFlag: COUNTRY_FLAGS[newCountry] ?? '🌍',
      plan: newPlan,
      status: 'trial',
      mrrCents: 0,
      creditsUsed: 0,
      creditsTotal: CREDIT_TOTALS[newPlan],
      billingCycle: 'Monthly',
      nextRenewal: '',
      paymentLastFour: '',
      registeredAt: today,
      lastLoginAt: today,
      tags: [],
      customerFit: 'Medium',
      accountOwner: '',
      lastPayment: null,
      impressionData: [],
      users: [],
      widgets: [],
      creditHistory: [],
      auditLog: [],
      notes: [],
    };
    setCustomers((prev) => [newCompany, ...prev]);
    setAddOpen(false);
    setNewName('');
    setNewDomain('');
    setNewEmail('');
    setNewPlan('Starter');
    setNewCountry('SA');
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Customers</h2>
          <p className="text-sm text-muted-foreground">All companies using the Hikayat platform.</p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90 text-xs font-medium"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Company
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or domain…"
            className={cn(inputCls, 'pl-9')}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterPlan} onValueChange={setFilter(setFilterPlan)}>
            <SelectTrigger className="h-8 w-[108px] text-xs">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              {PLANS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilter(setFilterStatus)}>
            <SelectTrigger className="h-8 w-[116px] text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCountry} onValueChange={setFilter(setFilterCountry)}>
            <SelectTrigger className="h-8 w-[124px] text-xs">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk selection bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-md border border-[#3ECF8E]/30 bg-[#3ECF8E]/5 px-4 py-2.5">
          <span className="text-sm font-medium text-[#3ECF8E]">{selected.size} selected</span>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              className="text-xs"
              onClick={() => {
                setCustomers((prev) =>
                  prev.map((c) =>
                    selected.has(c.id) ? { ...c, status: 'suspended' as CompanyStatus } : c,
                  ),
                );
                setSelected(new Set());
              }}
            >
              Suspend Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setSelected(new Set())}
            >
              Export Selected
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSelected(new Set())}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 cursor-pointer accent-[#3ECF8E]"
                />
              </th>
              {['Company', 'Plan', 'Status', 'Country', 'MRR', 'AI Credits', 'Created', ''].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A] bg-background">
            {rows.length > 0 ? (
              rows.map((c) => (
                <tr key={c.id} className="group transition-colors hover:bg-card/60">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleRow(c.id)}
                      className="h-3.5 w-3.5 cursor-pointer accent-[#3ECF8E]"
                    />
                  </td>

                  {/* Company */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-xs font-semibold text-foreground">
                        {initials(c.name)}
                      </div>
                      <div>
                        <button
                          onClick={() => router.push(`/customers/${c.id}`)}
                          className="font-medium text-foreground transition-colors hover:text-[#3ECF8E]"
                        >
                          {c.name}
                        </button>
                        <p className="text-xs text-muted-foreground">{c.domain}</p>
                      </div>
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="px-4 py-3">
                    <StatusBadge status={planVariant(c.plan)} label={c.plan} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>

                  {/* Country */}
                  <td className="px-4 py-3 text-sm text-foreground">
                    <span>{c.countryFlag}</span>
                    <span className="ml-1.5">{c.countryName}</span>
                  </td>

                  {/* MRR */}
                  <td className="px-4 py-3">
                    {c.mrrCents > 0 ? (
                      <span className="font-medium text-[#3ECF8E]">
                        {formatCurrency(c.mrrCents)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* AI Credits */}
                  <td className="px-4 py-3 text-sm text-foreground">
                    {c.creditsUsed.toLocaleString()}/{c.creditsTotal.toLocaleString()}
                  </td>

                  {/* Created */}
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatRelativeDate(c.registeredAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/customers/${c.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setCreditsTarget(c)}>
                          Add Credits
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setSuspendTarget(c)}
                        >
                          Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">No companies found</p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1 text-xs"
                      onClick={resetFilters}
                    >
                      Clear filters
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={safePage}
        totalItems={filtered.length}
        itemsPerPage={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* ── Dialogs ─────────────────────────────────────────────────────────── */}

      {/* Suspend confirm */}
      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={(o) => !o && setSuspendTarget(null)}
        title="Suspend Account"
        description={`Suspending ${suspendTarget?.name ?? 'this company'} will immediately revoke platform access for all its users. This can be reversed at any time.`}
        confirmLabel="Suspend"
        onConfirm={handleSuspend}
      />

      {/* Add Credits */}
      <Dialog open={!!creditsTarget} onOpenChange={(o) => !o && setCreditsTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add AI Credits</DialogTitle>
            <DialogDescription>
              Adding credits to{' '}
              <span className="font-medium text-foreground">{creditsTarget?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-1">
            <label className="mb-1.5 block text-xs font-medium text-foreground">Amount</label>
            <input
              type="number"
              value={creditsAmount}
              onChange={(e) => setCreditsAmount(e.target.value)}
              placeholder="e.g. 5000"
              min="1"
              className={inputCls}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreditsTarget(null)}>
              Cancel
            </Button>
            <Button
              className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
              onClick={handleAddCredits}
              disabled={!creditsAmount || parseInt(creditsAmount) <= 0}
            >
              Add Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Company */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
            <DialogDescription>Register a new company on the Hikayat platform.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Company Name *
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Noon Commerce"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Domain *</label>
              <input
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="e.g. example.com"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Email *</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="contact@example.com"
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Plan</label>
                <Select value={newPlan} onValueChange={(v) => setNewPlan(v as Plan)}>
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
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Country</label>
                <Select value={newCountry} onValueChange={setNewCountry}>
                  <SelectTrigger className="h-9 w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
              onClick={handleAddCompany}
              disabled={!newName || !newDomain || !newEmail}
            >
              Add Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
