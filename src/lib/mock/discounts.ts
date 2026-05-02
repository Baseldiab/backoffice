export type DiscountType = 'percentage' | 'fixed';
export type DiscountCycle = 'monthly' | 'annual' | 'both';
export type DiscountStatus = 'scheduled' | 'active' | 'paused' | 'expired';

export interface Discount {
  id: string;
  nameEn: string;
  nameAr: string;
  type: DiscountType;
  value: number;
  cycle: DiscountCycle;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  status: DiscountStatus;
  usageCount: number;
  maxUsage: number | null;
  applicablePlans: string[];
  createdAt: string;
  createdBy: string;
}

export const getDiscountStatus = (discount: Discount): DiscountStatus => {
  if (discount.status === 'paused') return 'paused';
  const now = new Date();
  const start = new Date(discount.startDate);
  const end = new Date(discount.endDate);
  if (now < start) return 'scheduled';
  if (now > end) return 'expired';
  return 'active';
};

export const MOCK_DISCOUNTS: Discount[] = [
  {
    id: 'disc-1',
    nameEn: 'Gulf Summer Sale',
    nameAr: 'تخفيضات الصيف الخليجي',
    type: 'percentage',
    value: 20,
    cycle: 'both',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    isPublic: true,
    status: 'scheduled',
    usageCount: 0,
    maxUsage: 100,
    applicablePlans: ['starter', 'pro', 'business'],
    createdAt: '2026-04-15',
    createdBy: 'Admin',
  },
  {
    id: 'disc-2',
    nameEn: 'Ramadan Special',
    nameAr: 'عرض رمضان الخاص',
    type: 'percentage',
    value: 15,
    cycle: 'monthly',
    startDate: '2026-03-01',
    endDate: '2026-03-30',
    isPublic: true,
    status: 'expired',
    usageCount: 43,
    maxUsage: 50,
    applicablePlans: ['starter', 'pro'],
    createdAt: '2026-02-20',
    createdBy: 'Admin',
  },
  {
    id: 'disc-3',
    nameEn: 'New Customer Welcome',
    nameAr: 'عرض ترحيب بالعملاء الجدد',
    type: 'percentage',
    value: 10,
    cycle: 'monthly',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isPublic: false,
    status: 'active',
    usageCount: 28,
    maxUsage: null,
    applicablePlans: ['starter'],
    createdAt: '2026-01-01',
    createdBy: 'Admin',
  },
  {
    id: 'disc-4',
    nameEn: 'Enterprise Annual Deal',
    nameAr: 'عرض المؤسسات السنوي',
    type: 'fixed',
    value: 500,
    cycle: 'annual',
    startDate: '2026-04-01',
    endDate: '2026-12-31',
    isPublic: false,
    status: 'active',
    usageCount: 5,
    maxUsage: 20,
    applicablePlans: ['enterprise'],
    createdAt: '2026-03-25',
    createdBy: 'Admin',
  },
  {
    id: 'disc-5',
    nameEn: 'National Day KSA',
    nameAr: 'اليوم الوطني السعودي',
    type: 'percentage',
    value: 23,
    cycle: 'both',
    startDate: '2026-09-20',
    endDate: '2026-09-25',
    isPublic: true,
    status: 'scheduled',
    usageCount: 0,
    maxUsage: 200,
    applicablePlans: ['starter', 'pro', 'business', 'enterprise'],
    createdAt: '2026-04-20',
    createdBy: 'Admin',
  },
];
