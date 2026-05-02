'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Download, Printer, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  MOCK_INVOICES,
  Invoice,
  InvoiceStatus,
  BillingCountry,
  Currency,
} from '@/lib/mock/billing';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  Paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Unpaid: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  Refunded: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
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

// ── Badges ────────────────────────────────────────────────────────────────────

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InvoiceDetailPage({ params }: { params: { invoiceId: string } }) {
  const initial = MOCK_INVOICES.find((i) => i.id === params.invoiceId) ?? MOCK_INVOICES[0];

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(initial);
  const [search, setSearch] = useState('');

  const listItems = useMemo(() => {
    if (!search.trim()) return MOCK_INVOICES;
    const q = search.toLowerCase();
    return MOCK_INVOICES.filter(
      (i) => i.invoiceNumber.toLowerCase().includes(q) || i.companyName.toLowerCase().includes(q),
    );
  }, [search]);

  const total = selectedInvoice.amount + selectedInvoice.vatAmount;
  const vatNumber = VAT_NUMBERS[selectedInvoice.country];

  return (
    <div className="fixed inset-0 z-50 flex bg-background">
      {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
      <div className="flex w-80 shrink-0 flex-col border-r border-border bg-card">
        {/* Header */}
        <div className="space-y-2 border-b border-border p-3">
          <Link
            href="/billing"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Billing
          </Link>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoices…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        {/* Invoice list */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {listItems.map((invoice) => {
              const isActive = invoice.id === selectedInvoice.id;
              return (
                <button
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
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
                    <span className="shrink-0 text-xs font-bold text-foreground">
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

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
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
              {/* Header row */}
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#3ECF8E]">Hikayat</h1>
                  <p className="mt-1 text-xs text-muted-foreground">billing@hikayat.io</p>
                  <p className="text-xs text-muted-foreground">Riyadh, Saudi Arabia</p>
                  <p className="text-xs text-muted-foreground">VAT: 300-0000-0001-0000</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">TAX INVOICE</p>
                  <p className="mt-1 font-mono text-sm text-muted-foreground">
                    {selectedInvoice.invoiceNumber}
                  </p>
                  <div className="mt-2">
                    <InvoiceStatusBadge status={selectedInvoice.status} />
                  </div>
                </div>
              </div>

              {/* Billed To + Invoice Details */}
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
                    Invoice Details
                  </p>
                  {[
                    { label: 'Invoice #', value: selectedInvoice.invoiceNumber },
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

              {/* Amount highlight */}
              <div className="mb-6 rounded-xl border border-[#3ECF8E]/10 bg-[#3ECF8E]/5 p-5">
                <p className="text-xs text-muted-foreground">
                  Invoice of {selectedInvoice.currency}
                </p>
                <p className="mt-1 text-3xl font-bold text-[#3ECF8E]">
                  {fmtAmount(total, selectedInvoice.currency)}
                </p>
              </div>

              <Separator className="mb-6 bg-[#2A2A2A]" />

              {/* Line items */}
              <table className="mb-1 w-full text-sm">
                <thead>
                  <tr>
                    {['Description', 'Qty', 'Rate', 'Amount'].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'bg-muted/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground',
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
                    <td className="px-3 py-3">
                      <p className="font-medium text-foreground">{selectedInvoice.plan} Plan</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedInvoice.billingCycle} subscription
                      </p>
                    </td>
                    <td className="px-3 py-3 text-right text-muted-foreground">1</td>
                    <td className="px-3 py-3 text-right">
                      {fmtAmount(selectedInvoice.amount, selectedInvoice.currency)}
                    </td>
                    <td className="px-3 py-3 text-right font-medium text-foreground">
                      {fmtAmount(selectedInvoice.amount, selectedInvoice.currency)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="mb-6 space-y-1.5 pt-3">
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
                <div className="flex justify-between border-t-2 border-border pt-2 text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>{fmtAmount(total, selectedInvoice.currency)}</span>
                </div>
              </div>

              {/* Payment info */}
              <div className="mb-6 rounded-lg border border-border bg-muted/20 px-4 py-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium text-foreground">
                    {selectedInvoice.paymentMethod}
                  </span>
                </div>
                {selectedInvoice.paidAt && (
                  <div className="mt-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Paid On</span>
                    <span className="font-medium text-foreground">
                      {fmtDate(selectedInvoice.paidAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* ZATCA QR — SA only */}
              {selectedInvoice.country === 'SA' && selectedInvoice.zatcaQR && (
                <>
                  <Separator className="mb-6 bg-[#2A2A2A]" />
                  <div className="mb-6 flex flex-col items-center gap-3">
                    <span className="flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 text-[10px] font-medium text-emerald-400">
                      <Shield className="h-3 w-3" />
                      ZATCA Compliant — Saudi Arabia
                    </span>
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-border bg-muted">
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
                  Payment is due within the terms specified above. For billing questions, contact
                  billing@hikayat.io
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
