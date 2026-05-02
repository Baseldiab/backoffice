'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  DollarSign,
  AlertCircle,
  Users,
  MoreHorizontal,
  Search,
  X,
  Download,
  FileText,
  RotateCcw,
  Shield,
  ArrowLeft,
  Printer,
  Mail,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { StatCard } from '@/components/shared/StatCard';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

import {
  MOCK_INVOICES,
  revenueSummary,
  Invoice,
  InvoiceStatus,
  BillingPlan,
  Currency,
  BillingCountry,
} from '@/lib/mock/billing';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/shared/Pagination';

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

const PLAN_CHART_COLORS: Record<BillingPlan, string> = {
  Enterprise: '#3f3f46',
  Business: '#52525b',
  Pro: '#71717a',
  Starter: '#a1a1aa',
};

const COUNTRY_CHART_COLORS: Record<BillingCountry, string> = {
  SA: '#3f3f46',
  AE: '#52525b',
  KW: '#71717a',
  QA: '#a1a1aa',
};

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  Paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Unpaid: 'bg-yellow-500/10  text-yellow-400  border-yellow-500/20',
  Failed: 'bg-red-500/10     text-red-400     border-red-500/20',
  Refunded: 'bg-zinc-500/10    text-zinc-400    border-zinc-500/20',
};

const PLAN_STYLES: Record<BillingPlan, string> = {
  Starter: 'bg-zinc-800         text-zinc-300    border-zinc-700',
  Pro: 'bg-blue-500/10      text-blue-400    border-blue-500/20',
  Business: 'bg-violet-500/10    text-violet-400  border-violet-500/20',
  Enterprise: 'bg-amber-500/10     text-amber-400   border-amber-500/20',
};

const COUNTRY_NAMES: Record<BillingCountry, string> = {
  SA: 'Saudi Arabia',
  AE: 'United Arab Emirates',
  KW: 'Kuwait',
  QA: 'Qatar',
};

const COUNTRY_FLAGS: Record<BillingCountry, string> = {
  SA: '🇸🇦',
  AE: '🇦🇪',
  KW: '🇰🇼',
  QA: '🇶🇦',
};

const VAT_NUMBERS: Record<BillingCountry, string | null> = {
  SA: '300-1234-5678-9012',
  AE: '100-2345-6789-0013',
  KW: null,
  QA: null,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtAmount(amount: number, currency: Currency): string {
  const prefix: Record<Currency, string> = {
    USD: '$',
    SAR: 'SAR ',
    AED: 'AED ',
    KWD: 'KD ',
  };
  return `${prefix[currency]}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtDate(d: string | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function fmtUSD(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

// ── Badges ────────────────────────────────────────────────────────────────────

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

function PlanBadge({ plan }: { plan: BillingPlan }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        PLAN_STYLES[plan],
      )}
    >
      {plan}
    </span>
  );
}

// ── Charts ────────────────────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
  background: '#111111',
  border: '1px solid #2A2A2A',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#a1a1aa',
};

function RevenueByPlanChart() {
  const data = (['Enterprise', 'Business', 'Pro', 'Starter'] as BillingPlan[]).map((plan) => ({
    name: plan,
    value: revenueSummary.revenueByPlan[plan],
    color: PLAN_CHART_COLORS[plan],
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Revenue by Plan</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 16, bottom: 0, left: 8 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#71717a' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`)}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#a1a1aa' }}
            axisLine={false}
            tickLine={false}
            width={76}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            formatter={(value) => {
              const n = typeof value === 'number' ? value : Number(value) || 0;
              return [`$${n.toLocaleString()}`, 'Revenue'] as [string, string];
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function RevenueByCountryChart() {
  const data = (['SA', 'AE', 'KW', 'QA'] as BillingCountry[]).map((country) => ({
    name: `${COUNTRY_FLAGS[country]} ${country}`,
    value: revenueSummary.revenueByCountry[country],
    color: COUNTRY_CHART_COLORS[country],
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Revenue by Country</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 16, bottom: 0, left: 8 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#71717a' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`)}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#a1a1aa' }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            formatter={(value) => {
              const n = typeof value === 'number' ? value : Number(value) || 0;
              return [`$${n.toLocaleString()}`, 'Revenue'] as [string, string];
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Invoice Split View ────────────────────────────────────────────────────────

function InvoiceSplitView({
  invoices,
  selectedInvoice,
  onSelectInvoice,
  onBack,
}: {
  invoices: Invoice[];
  selectedInvoice: Invoice;
  onSelectInvoice: (invoice: Invoice) => void;
  onBack: () => void;
}) {
  const [listSearch, setListSearch] = useState('');

  const listItems = listSearch
    ? invoices.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(listSearch.toLowerCase()) ||
          i.companyName.toLowerCase().includes(listSearch.toLowerCase()),
      )
    : invoices;

  const total = selectedInvoice.amount + selectedInvoice.vatAmount;
  const vatNumber = VAT_NUMBERS[selectedInvoice.country];

  return (
    <div className="flex h-[640px] overflow-hidden rounded-xl border border-border">
      {/* LEFT PANEL */}
      <div className="flex w-80 shrink-0 flex-col border-r border-border bg-card">
        <div className="space-y-2 border-b border-border p-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Invoices
            </button>
            <span className="text-xs font-semibold text-foreground">Invoices</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search…"
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {listItems.map((invoice) => {
              const isActive = invoice.id === selectedInvoice.id;
              return (
                <button
                  key={invoice.id}
                  onClick={() => onSelectInvoice(invoice)}
                  className={cn(
                    'flex flex-col gap-1 border-l-2 px-3 py-2.5 text-left transition-colors hover:bg-muted/30',
                    isActive ? 'border-primary bg-primary/5' : 'border-transparent',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-medium text-foreground">
                      {invoice.invoiceNumber}
                    </span>
                    <InvoiceStatusBadge status={invoice.status} />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground">
                      {invoice.companyName}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-foreground">
                      {fmtAmount(invoice.amount + invoice.vatAmount, invoice.currency)}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {fmtDate(invoice.issuedAt)}
                  </span>
                </button>
              );
            })}
            {listItems.length === 0 && (
              <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                No invoices found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        {/* Action bar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-2.5">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled className="gap-1.5 text-xs">
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
            <Button variant="ghost" size="sm" disabled className="gap-1.5 text-xs">
              <Mail className="h-3.5 w-3.5" />
              Email
            </Button>
            <Button variant="ghost" size="sm" disabled className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </Button>
          </div>
          {selectedInvoice.country === 'SA' && (
            <span className="flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
              <Shield className="h-2.5 w-2.5" />
              ZATCA Compliant
            </span>
          )}
        </div>

        {/* Invoice document */}
        <ScrollArea className="flex-1">
          <div className="mx-auto max-w-2xl p-8">
            <div className="rounded-xl border border-border bg-card p-8">
              {/* Header */}
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#3ECF8E]">Hikayat</h1>
                  <p className="mt-1 text-xs text-muted-foreground">billing@hikayat.io</p>
                  <p className="text-xs text-muted-foreground">Riyadh, Saudi Arabia</p>
                  <p className="text-xs text-muted-foreground">VAT: 300-0000-0001-0000</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Tax Invoice
                  </p>
                  <p className="mt-1 font-mono text-xl font-bold text-foreground">
                    {selectedInvoice.invoiceNumber}
                  </p>
                  <div className="mt-1.5">
                    <InvoiceStatusBadge status={selectedInvoice.status} />
                  </div>
                </div>
              </div>

              {/* Amount highlight */}
              <div className="mb-8 rounded-xl border border-[#3ECF8E]/10 bg-[#3ECF8E]/5 p-6 text-center">
                <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Total Amount
                </p>
                <p className="text-3xl font-bold text-[#3ECF8E]">
                  {fmtAmount(total, selectedInvoice.currency)}
                </p>
              </div>

              {/* Billed To + Invoice Info */}
              <div className="mb-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Billed To
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedInvoice.companyName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {COUNTRY_FLAGS[selectedInvoice.country]}{' '}
                    {COUNTRY_NAMES[selectedInvoice.country]}
                  </p>
                  {vatNumber && <p className="text-xs text-muted-foreground">VAT: {vatNumber}</p>}
                  <p className="text-xs text-muted-foreground">{selectedInvoice.paymentMethod}</p>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Invoice Info
                  </p>
                  {[
                    { label: 'Issue Date', value: fmtDate(selectedInvoice.issuedAt) },
                    { label: 'Due Date', value: fmtDate(selectedInvoice.dueDate) },
                    { label: 'Paid Date', value: fmtDate(selectedInvoice.paidAt) },
                  ].map(({ label, value }) => (
                    <div key={label} className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="mb-6 bg-[#2A2A2A]" />

              {/* Line items */}
              <table className="mb-4 w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Description', 'Qty', 'Rate', 'Amount'].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground',
                          i === 0 ? 'text-left' : 'text-right',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/40">
                    <td className="py-3">
                      <p className="font-medium text-foreground">{selectedInvoice.plan} Plan</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedInvoice.billingCycle} subscription
                      </p>
                    </td>
                    <td className="py-3 text-right text-muted-foreground">1</td>
                    <td className="py-3 text-right">
                      {fmtAmount(selectedInvoice.amount, selectedInvoice.currency)}
                    </td>
                    <td className="py-3 text-right font-medium text-foreground">
                      {fmtAmount(selectedInvoice.amount, selectedInvoice.currency)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="mb-6 space-y-1.5">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">
                    {fmtAmount(selectedInvoice.amount, selectedInvoice.currency)}
                  </span>
                </div>
                {selectedInvoice.vatRate > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>VAT ({selectedInvoice.vatRate}%)</span>
                    <span className="text-foreground">
                      {fmtAmount(selectedInvoice.vatAmount, selectedInvoice.currency)}
                    </span>
                  </div>
                )}
                <Separator className="my-1.5 bg-[#2A2A2A]" />
                <div className="flex justify-between text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>{fmtAmount(total, selectedInvoice.currency)}</span>
                </div>
              </div>

              {/* ZATCA QR — SA only */}
              {selectedInvoice.country === 'SA' && selectedInvoice.zatcaQR && (
                <>
                  <Separator className="mb-6 bg-[#2A2A2A]" />
                  <div className="flex flex-col items-center gap-2 py-2">
                    <p className="text-xs font-medium text-muted-foreground">ZATCA QR Code</p>
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-border bg-[#141414]">
                      <p className="text-center text-[10px] leading-snug text-muted-foreground">
                        QR
                        <br />
                        Placeholder
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Scan to verify invoice authenticity
                    </p>
                  </div>
                </>
              )}

              <Separator className="my-6 bg-[#2A2A2A]" />

              {/* Footer */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Thanks for the business.</p>
                <p className="mt-1 text-xs text-muted-foreground/50">
                  For billing questions, contact billing@hikayat.io
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ── Refund Dialog ─────────────────────────────────────────────────────────────

interface RefundDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefunded: (invoiceId: string) => void;
}

function RefundDialog({ invoice, open, onOpenChange, onRefunded }: RefundDialogProps) {
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; reason?: string }>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  function reset() {
    setRefundType('full');
    setPartialAmount('');
    setReason('');
    setErrors({});
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  function validate(): boolean {
    const errs: { amount?: string; reason?: string } = {};
    if (!reason.trim()) errs.reason = 'Reason is required';
    if (refundType === 'partial') {
      const val = parseFloat(partialAmount);
      if (!partialAmount || isNaN(val) || val <= 0) errs.amount = 'Enter a valid amount';
      else if (invoice && val > invoice.amount) errs.amount = `Cannot exceed ${invoice.amount}`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleConfirmed() {
    if (!invoice) return;
    onRefunded(invoice.id);
    setConfirmOpen(false);
    handleClose(false);
  }

  if (!invoice) return null;

  const refundAmount = refundType === 'full' ? invoice.amount : parseFloat(partialAmount) || 0;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Issue Refund</DialogTitle>
            <DialogDescription>
              {invoice.invoiceNumber} · {invoice.companyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            {/* Refund type */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Refund Type
              </p>
              <RadioGroup
                value={refundType}
                onValueChange={(v) => setRefundType(v as 'full' | 'partial')}
                className="flex gap-5"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="full" id="rf-full" />
                  <Label htmlFor="rf-full" className="cursor-pointer text-sm">
                    Full ({fmtAmount(invoice.amount, invoice.currency)})
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="partial" id="rf-partial" />
                  <Label htmlFor="rf-partial" className="cursor-pointer text-sm">
                    Partial
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Partial amount input */}
            {refundType === 'partial' && (
              <div>
                <Label htmlFor="rf-amount" className="mb-1.5 block text-sm">
                  Amount{' '}
                  <span className="text-muted-foreground">
                    (max {fmtAmount(invoice.amount, invoice.currency)})
                  </span>
                </Label>
                <Input
                  id="rf-amount"
                  type="number"
                  min={0.01}
                  max={invoice.amount}
                  step={0.01}
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  placeholder="0.00"
                  className={errors.amount ? 'border-destructive' : ''}
                />
                {errors.amount && <p className="mt-1 text-xs text-destructive">{errors.amount}</p>}
              </div>
            )}

            {/* Reason */}
            <div>
              <Label htmlFor="rf-reason" className="mb-1.5 block text-sm">
                Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="rf-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the reason for this refund…"
                rows={3}
                className={errors.reason ? 'border-destructive' : ''}
              />
              {errors.reason && <p className="mt-1 text-xs text-destructive">{errors.reason}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (validate()) setConfirmOpen(true);
              }}
            >
              Confirm Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Refund"
        description={`Refund ${fmtAmount(refundAmount, invoice.currency)} to ${invoice.companyName}? This action cannot be undone.`}
        confirmLabel="Yes, Issue Refund"
        onConfirm={handleConfirmed}
      />
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Refund
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundInvoice, setRefundInvoice] = useState<Invoice | null>(null);

  // Filtered + paginated
  const filtered = useMemo(() => {
    let r = invoices;
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (i) => i.invoiceNumber.toLowerCase().includes(q) || i.companyName.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== 'all') r = r.filter((i) => i.status === statusFilter);
    if (countryFilter !== 'all') r = r.filter((i) => i.country === countryFilter);
    if (paymentFilter !== 'all') r = r.filter((i) => i.paymentMethod === paymentFilter);
    return r;
  }, [invoices, search, statusFilter, countryFilter, paymentFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters =
    !!search || statusFilter !== 'all' || countryFilter !== 'all' || paymentFilter !== 'all';

  function resetPage() {
    setPage(1);
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setCountryFilter('all');
    setPaymentFilter('all');
    setPage(1);
  }

  function openInvoice(invoice: Invoice) {
    router.push(`/billing/${invoice.id}`);
  }

  function openRefund(invoice: Invoice) {
    setRefundInvoice(invoice);
    setRefundOpen(true);
  }

  function handleRefunded(id: string) {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Refunded' as const } : i)),
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Billing</h2>
            <p className="text-sm text-muted-foreground">
              Revenue, invoices, and subscription management.
            </p>
          </div>
          <Button variant="outline" size="sm" disabled className="gap-2 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="MRR"
            value={fmtUSD(revenueSummary.mrr)}
            description="Monthly Recurring Revenue"
            trend={{ value: revenueSummary.mrrGrowth, label: 'vs last month' }}
            icon={DollarSign}
          />
          <StatCard
            title="ARR"
            value={fmtUSD(revenueSummary.arr)}
            description="Annual Recurring Revenue"
            icon={CreditCard}
          />
          <StatCard
            title="Failed Payments"
            value={revenueSummary.failedPayments}
            description="Require attention"
            icon={AlertCircle}
            className={
              revenueSummary.failedPayments > 0
                ? 'border-destructive/30 bg-destructive/5'
                : undefined
            }
          />
          <StatCard
            title="Active Subscriptions"
            value={revenueSummary.activeSubscriptions}
            description="Paying customers"
            icon={Users}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RevenueByPlanChart />
          <RevenueByCountryChart />
        </div>

        {/* Invoices */}
        {selectedInvoice ? (
          <InvoiceSplitView
            invoices={invoices}
            selectedInvoice={selectedInvoice}
            onSelectInvoice={setSelectedInvoice}
            onBack={() => setSelectedInvoice(null)}
          />
        ) : (
          <div className="rounded-xl border border-border bg-card">
            {/* Table toolbar */}
            <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Invoices
                <span className="ml-2 rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-normal text-zinc-400">
                  {filtered.length}
                </span>
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetPage();
                    }}
                    className="h-8 w-44 pl-8 text-xs"
                  />
                </div>

                {/* Status */}
                <Select
                  value={statusFilter}
                  onValueChange={(v) => {
                    setStatusFilter(v);
                    resetPage();
                  }}
                >
                  <SelectTrigger className="h-8 w-[108px] text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                {/* Country */}
                <Select
                  value={countryFilter}
                  onValueChange={(v) => {
                    setCountryFilter(v);
                    resetPage();
                  }}
                >
                  <SelectTrigger className="h-8 w-[108px] text-xs">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="SA">🇸🇦 Saudi Arabia</SelectItem>
                    <SelectItem value="AE">🇦🇪 UAE</SelectItem>
                    <SelectItem value="KW">🇰🇼 Kuwait</SelectItem>
                    <SelectItem value="QA">🇶🇦 Qatar</SelectItem>
                  </SelectContent>
                </Select>

                {/* Payment method */}
                <Select
                  value={paymentFilter}
                  onValueChange={(v) => {
                    setPaymentFilter(v);
                    resetPage();
                  }}
                >
                  <SelectTrigger className="h-8 w-[112px] text-xs">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="Mada">Mada</SelectItem>
                    <SelectItem value="STC Pay">STC Pay</SelectItem>
                    <SelectItem value="Stripe">Stripe</SelectItem>
                    <SelectItem value="PayTabs">PayTabs</SelectItem>
                    <SelectItem value="KNET">KNET</SelectItem>
                  </SelectContent>
                </Select>

                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 gap-1 px-2 text-xs text-muted-foreground"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Empty state */}
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[#141414]">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">No invoices found</p>
                  <p className="text-xs text-muted-foreground">
                    {hasFilters ? 'Try adjusting your filters.' : 'No invoices to display.'}
                  </p>
                </div>
                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {[
                        'Invoice #',
                        'Company / Plan',
                        'Amount',
                        'VAT',
                        'Status',
                        'Payment',
                        'Date',
                        '',
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]/50">
                    {paginated.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="group transition-colors hover:bg-white/[0.02]"
                      >
                        {/* Invoice # */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openInvoice(invoice)}
                            className="font-mono text-xs font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {invoice.invoiceNumber}
                          </button>
                        </td>

                        {/* Company + Plan */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-foreground">
                              {invoice.companyName}
                            </span>
                            <PlanBadge plan={invoice.plan} />
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm font-medium text-foreground">
                            {fmtAmount(invoice.amount, invoice.currency)}
                          </span>
                          {invoice.billingCycle === 'Annual' && (
                            <span className="ml-1.5 rounded bg-zinc-800 px-1 py-0.5 text-[10px] text-zinc-400">
                              Annual
                            </span>
                          )}
                        </td>

                        {/* VAT */}
                        <td className="px-4 py-3">
                          {invoice.vatRate > 0 ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-foreground">
                                {fmtAmount(invoice.vatAmount, invoice.currency)}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {invoice.vatRate}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <InvoiceStatusBadge status={invoice.status} />
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground">
                            {invoice.paymentMethod}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground">
                            {fmtDate(invoice.issuedAt)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                className="gap-2 text-xs"
                                onClick={() => openInvoice(invoice)}
                              >
                                <FileText className="h-3.5 w-3.5" />
                                View Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-xs"
                                onClick={() => openRefund(invoice)}
                                disabled={invoice.status !== 'Paid'}
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Issue Refund
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="gap-2 text-xs text-muted-foreground"
                                disabled
                              >
                                <Download className="h-3.5 w-3.5" />
                                Download PDF
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="border-t border-border px-4 py-3">
              <Pagination
                currentPage={page}
                totalItems={filtered.length}
                itemsPerPage={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </div>

      {/* Refund dialog */}
      <RefundDialog
        invoice={refundInvoice}
        open={refundOpen}
        onOpenChange={setRefundOpen}
        onRefunded={handleRefunded}
      />
    </>
  );
}
