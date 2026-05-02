export type InvoiceStatus = 'Paid' | 'Unpaid' | 'Failed' | 'Refunded';
export type BillingPlan = 'Starter' | 'Pro' | 'Business' | 'Enterprise';
export type Currency = 'USD' | 'SAR' | 'AED' | 'KWD';
export type BillingCycle = 'Monthly' | 'Annual';
export type PaymentMethod = 'Mada' | 'STC Pay' | 'Stripe' | 'PayTabs' | 'KNET';
export type BillingCountry = 'SA' | 'AE' | 'KW' | 'QA';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  plan: BillingPlan;
  amount: number;
  currency: Currency;
  status: InvoiceStatus;
  billingCycle: BillingCycle;
  issuedAt: string;
  paidAt: string | null;
  dueDate: string;
  paymentMethod: PaymentMethod;
  country: BillingCountry;
  vatAmount: number;
  vatRate: number;
  zatcaQR?: string;
}

export interface RevenueSummary {
  mrr: number;
  arr: number;
  mrrGrowth: number;
  activeSubscriptions: number;
  revenueByPlan: Record<BillingPlan, number>;
  revenueByCountry: Record<BillingCountry, number>;
  failedPayments: number;
}

const ZATCA_QR = 'AQlIaWtheWF0ABIOMDI0LTAxLTAxVDAwOjAwOjAwAxMxNDk5MC4wMAITMjI0My41MA==';

function mkInvoice(
  id: string,
  invoiceNumber: string,
  companyId: string,
  companyName: string,
  plan: BillingPlan,
  amount: number,
  currency: Currency,
  status: InvoiceStatus,
  billingCycle: BillingCycle,
  issuedAt: string,
  paidAt: string | null,
  dueDate: string,
  paymentMethod: PaymentMethod,
  country: BillingCountry,
  vatRate: number,
): Invoice {
  return {
    id,
    invoiceNumber,
    companyId,
    companyName,
    plan,
    amount,
    currency,
    status,
    billingCycle,
    issuedAt,
    paidAt,
    dueDate,
    paymentMethod,
    country,
    vatRate,
    vatAmount: parseFloat(((amount * vatRate) / 100).toFixed(2)),
    ...(country === 'SA' ? { zatcaQR: ZATCA_QR } : {}),
  };
}

export const MOCK_INVOICES: Invoice[] = [
  mkInvoice(
    'inv-001',
    'INV-2024-001',
    'c1',
    'Nana Express',
    'Enterprise',
    14990,
    'SAR',
    'Paid',
    'Annual',
    '2024-01-15',
    '2024-01-16',
    '2025-01-15',
    'Stripe',
    'SA',
    15,
  ),
  mkInvoice(
    'inv-002',
    'INV-2024-002',
    'c2',
    'Jahez Group',
    'Business',
    599,
    'SAR',
    'Paid',
    'Monthly',
    '2024-01-20',
    '2024-01-20',
    '2024-02-20',
    'Mada',
    'SA',
    15,
  ),
  mkInvoice(
    'inv-003',
    'INV-2024-003',
    'c3',
    'Salla E-Commerce',
    'Pro',
    299,
    'SAR',
    'Paid',
    'Monthly',
    '2024-02-01',
    '2024-02-01',
    '2024-03-01',
    'STC Pay',
    'SA',
    15,
  ),
  mkInvoice(
    'inv-004',
    'INV-2024-004',
    'c4',
    'Floward ME',
    'Enterprise',
    14990,
    'AED',
    'Paid',
    'Annual',
    '2024-02-10',
    '2024-02-11',
    '2025-02-10',
    'PayTabs',
    'AE',
    5,
  ),
  mkInvoice(
    'inv-005',
    'INV-2024-005',
    'c5',
    'Careem Technologies',
    'Business',
    599,
    'AED',
    'Paid',
    'Monthly',
    '2024-02-15',
    '2024-02-15',
    '2024-03-15',
    'Stripe',
    'AE',
    5,
  ),
  mkInvoice(
    'inv-006',
    'INV-2024-006',
    'c6',
    'Talabat Kuwait',
    'Pro',
    299,
    'KWD',
    'Paid',
    'Monthly',
    '2024-02-20',
    '2024-02-20',
    '2024-03-20',
    'KNET',
    'KW',
    0,
  ),
  mkInvoice(
    'inv-007',
    'INV-2024-007',
    'c7',
    'Zain Digital',
    'Business',
    5990,
    'KWD',
    'Paid',
    'Annual',
    '2024-03-01',
    '2024-03-02',
    '2025-03-01',
    'KNET',
    'KW',
    0,
  ),
  mkInvoice(
    'inv-008',
    'INV-2024-008',
    'c8',
    'Ooredoo Qatar',
    'Enterprise',
    1499,
    'USD',
    'Paid',
    'Monthly',
    '2024-03-05',
    '2024-03-05',
    '2024-04-05',
    'PayTabs',
    'QA',
    0,
  ),
  mkInvoice(
    'inv-009',
    'INV-2024-009',
    'c9',
    'Mawater City',
    'Starter',
    99,
    'USD',
    'Paid',
    'Monthly',
    '2024-03-10',
    '2024-03-10',
    '2024-04-10',
    'Stripe',
    'QA',
    0,
  ),
  mkInvoice(
    'inv-010',
    'INV-2024-010',
    'c10',
    'Noon Commerce',
    'Business',
    599,
    'SAR',
    'Unpaid',
    'Monthly',
    '2024-03-15',
    null,
    '2024-04-15',
    'Mada',
    'SA',
    15,
  ),
  mkInvoice(
    'inv-011',
    'INV-2024-011',
    'c11',
    'MRSOOL',
    'Starter',
    99,
    'SAR',
    'Paid',
    'Monthly',
    '2024-04-01',
    '2024-04-01',
    '2024-05-01',
    'Mada',
    'SA',
    15,
  ),
  mkInvoice(
    'inv-012',
    'INV-2024-012',
    'c12',
    'Dubizzle',
    'Pro',
    2990,
    'AED',
    'Paid',
    'Annual',
    '2024-04-05',
    '2024-04-06',
    '2025-04-05',
    'PayTabs',
    'AE',
    5,
  ),
  mkInvoice(
    'inv-013',
    'INV-2024-013',
    'c13',
    'Namshi Fashion',
    'Business',
    599,
    'AED',
    'Failed',
    'Monthly',
    '2024-04-10',
    null,
    '2024-05-10',
    'Stripe',
    'AE',
    5,
  ),
  mkInvoice(
    'inv-014',
    'INV-2024-014',
    'c14',
    'Wataniya Telecom',
    'Starter',
    99,
    'KWD',
    'Unpaid',
    'Monthly',
    '2024-04-15',
    null,
    '2024-05-15',
    'KNET',
    'KW',
    0,
  ),
  mkInvoice(
    'inv-015',
    'INV-2024-015',
    'c15',
    'Beyon Connect',
    'Pro',
    299,
    'USD',
    'Paid',
    'Monthly',
    '2024-04-20',
    '2024-04-20',
    '2024-05-20',
    'PayTabs',
    'QA',
    0,
  ),
  mkInvoice(
    'inv-016',
    'INV-2024-016',
    'c16',
    'Al Rajhi Digital',
    'Enterprise',
    14990,
    'SAR',
    'Paid',
    'Annual',
    '2024-05-01',
    '2024-05-02',
    '2025-05-01',
    'Mada',
    'SA',
    15,
  ),
  mkInvoice(
    'inv-017',
    'INV-2024-017',
    'c17',
    'STC Solutions',
    'Pro',
    299,
    'SAR',
    'Refunded',
    'Monthly',
    '2024-05-10',
    '2024-05-10',
    '2024-06-10',
    'STC Pay',
    'SA',
    15,
  ),
  mkInvoice(
    'inv-018',
    'INV-2024-018',
    'c18',
    'Majid Al Futtaim',
    'Starter',
    99,
    'AED',
    'Unpaid',
    'Monthly',
    '2024-05-15',
    null,
    '2024-06-15',
    'PayTabs',
    'AE',
    5,
  ),
  mkInvoice(
    'inv-019',
    'INV-2024-019',
    'c19',
    'Boubyan Bank',
    'Pro',
    299,
    'KWD',
    'Failed',
    'Monthly',
    '2024-05-20',
    null,
    '2024-06-20',
    'KNET',
    'KW',
    0,
  ),
  mkInvoice(
    'inv-020',
    'INV-2024-020',
    'c20',
    'Qatar National Bank',
    'Business',
    5990,
    'USD',
    'Refunded',
    'Annual',
    '2024-06-01',
    '2024-06-02',
    '2025-06-01',
    'PayTabs',
    'QA',
    0,
  ),
];

// ── Revenue Summary ──────────────────────────────────────────────────────────

const paidInvoices = MOCK_INVOICES.filter((i) => i.status === 'Paid');

const mrr = Math.round(
  paidInvoices.reduce((acc, i) => {
    return acc + (i.billingCycle === 'Annual' ? i.amount / 12 : i.amount);
  }, 0),
);

const revenueByPlan: Record<BillingPlan, number> = {
  Starter: 0,
  Pro: 0,
  Business: 0,
  Enterprise: 0,
};
paidInvoices.forEach((i) => {
  revenueByPlan[i.plan] += i.amount;
});

const revenueByCountry: Record<BillingCountry, number> = {
  SA: 0,
  AE: 0,
  KW: 0,
  QA: 0,
};
paidInvoices.forEach((i) => {
  revenueByCountry[i.country] += i.amount;
});

export const revenueSummary: RevenueSummary = {
  mrr,
  arr: mrr * 12,
  mrrGrowth: 8.3,
  activeSubscriptions: paidInvoices.length,
  revenueByPlan,
  revenueByCountry,
  failedPayments: MOCK_INVOICES.filter((i) => i.status === 'Failed').length,
};
