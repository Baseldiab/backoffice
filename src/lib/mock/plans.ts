export interface PlanFeature {
  id: string;
  label: string;
  category: 'stories' | 'analytics' | 'integrations' | 'support' | 'ai' | 'customization';
  type: 'boolean' | 'limit' | 'text';
  description?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isPopular: boolean;
  monthlyPrice: number;
  annualPrice: number;
  currency: 'USD';
  discountId?: string;
  features: Record<string, boolean | number | string>;
  limits: {
    impressionsPerMonth: number | 'unlimited';
    activeWidgets: number | 'unlimited';
    teamMembers: number | 'unlimited';
    aiCreditsPerMonth: number;
    customDomains: number;
    dataRetentionDays: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const PLAN_FEATURES: PlanFeature[] = [
  { id: 'story_groups', label: 'Story Groups', category: 'stories', type: 'boolean' },
  { id: 'video_stories', label: 'Video Stories', category: 'stories', type: 'boolean' },
  { id: 'interactive_stories', label: 'Polls & Quizzes', category: 'stories', type: 'boolean' },
  { id: 'shoppable_stories', label: 'Shoppable Stories', category: 'stories', type: 'boolean' },
  { id: 'scheduled_stories', label: 'Scheduled Publishing', category: 'stories', type: 'boolean' },
  { id: 'rtl_support', label: 'Arabic RTL Support', category: 'stories', type: 'boolean' },
  { id: 'basic_analytics', label: 'Basic Analytics', category: 'analytics', type: 'boolean' },
  {
    id: 'advanced_analytics',
    label: 'Advanced Analytics',
    category: 'analytics',
    type: 'boolean',
  },
  { id: 'custom_reports', label: 'Custom Reports', category: 'analytics', type: 'boolean' },
  { id: 'api_access', label: 'API Access', category: 'integrations', type: 'boolean' },
  { id: 'webhooks', label: 'Webhooks', category: 'integrations', type: 'boolean' },
  { id: 'zapier', label: 'Zapier Integration', category: 'integrations', type: 'boolean' },
  {
    id: 'salla_zid',
    label: 'Salla & Zid Integration',
    category: 'integrations',
    type: 'boolean',
  },
  { id: 'email_support', label: 'Email Support', category: 'support', type: 'boolean' },
  { id: 'priority_support', label: 'Priority Support', category: 'support', type: 'boolean' },
  {
    id: 'dedicated_manager',
    label: 'Dedicated Account Manager',
    category: 'support',
    type: 'boolean',
  },
  { id: 'ai_content', label: 'AI Content Generation', category: 'ai', type: 'boolean' },
  { id: 'ai_translation', label: 'AI Translation', category: 'ai', type: 'boolean' },
  { id: 'ai_image', label: 'AI Image Generation', category: 'ai', type: 'boolean' },
  { id: 'white_label', label: 'White Label', category: 'customization', type: 'boolean' },
  { id: 'custom_domain', label: 'Custom Domain', category: 'customization', type: 'boolean' },
  { id: 'custom_fonts', label: 'Custom Fonts', category: 'customization', type: 'boolean' },
];

export const MOCK_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses getting started',
    isActive: true,
    isPopular: false,
    monthlyPrice: 49,
    annualPrice: 39,
    currency: 'USD',
    limits: {
      impressionsPerMonth: 50000,
      activeWidgets: 2,
      teamMembers: 2,
      aiCreditsPerMonth: 50,
      customDomains: 0,
      dataRetentionDays: 30,
    },
    features: {
      story_groups: true,
      video_stories: false,
      interactive_stories: false,
      shoppable_stories: false,
      scheduled_stories: false,
      rtl_support: true,
      basic_analytics: true,
      advanced_analytics: false,
      custom_reports: false,
      api_access: false,
      webhooks: false,
      zapier: false,
      salla_zid: false,
      email_support: true,
      priority_support: false,
      dedicated_manager: false,
      ai_content: true,
      ai_translation: false,
      ai_image: false,
      white_label: false,
      custom_domain: false,
      custom_fonts: false,
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing businesses that need more power',
    isActive: true,
    isPopular: true,
    monthlyPrice: 149,
    annualPrice: 119,
    currency: 'USD',
    limits: {
      impressionsPerMonth: 250000,
      activeWidgets: 10,
      teamMembers: 5,
      aiCreditsPerMonth: 200,
      customDomains: 1,
      dataRetentionDays: 90,
    },
    features: {
      story_groups: true,
      video_stories: true,
      interactive_stories: true,
      shoppable_stories: true,
      scheduled_stories: true,
      rtl_support: true,
      basic_analytics: true,
      advanced_analytics: true,
      custom_reports: false,
      api_access: true,
      webhooks: true,
      zapier: false,
      salla_zid: true,
      email_support: true,
      priority_support: true,
      dedicated_manager: false,
      ai_content: true,
      ai_translation: true,
      ai_image: false,
      white_label: false,
      custom_domain: true,
      custom_fonts: false,
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For established businesses with advanced needs',
    isActive: true,
    isPopular: false,
    monthlyPrice: 349,
    annualPrice: 279,
    currency: 'USD',
    limits: {
      impressionsPerMonth: 1000000,
      activeWidgets: 25,
      teamMembers: 15,
      aiCreditsPerMonth: 500,
      customDomains: 3,
      dataRetentionDays: 180,
    },
    features: {
      story_groups: true,
      video_stories: true,
      interactive_stories: true,
      shoppable_stories: true,
      scheduled_stories: true,
      rtl_support: true,
      basic_analytics: true,
      advanced_analytics: true,
      custom_reports: true,
      api_access: true,
      webhooks: true,
      zapier: true,
      salla_zid: true,
      email_support: true,
      priority_support: true,
      dedicated_manager: false,
      ai_content: true,
      ai_translation: true,
      ai_image: true,
      white_label: false,
      custom_domain: true,
      custom_fonts: true,
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    isActive: true,
    isPopular: false,
    monthlyPrice: 999,
    annualPrice: 799,
    currency: 'USD',
    limits: {
      impressionsPerMonth: 'unlimited',
      activeWidgets: 'unlimited',
      teamMembers: 'unlimited',
      aiCreditsPerMonth: 2000,
      customDomains: 10,
      dataRetentionDays: 365,
    },
    features: {
      story_groups: true,
      video_stories: true,
      interactive_stories: true,
      shoppable_stories: true,
      scheduled_stories: true,
      rtl_support: true,
      basic_analytics: true,
      advanced_analytics: true,
      custom_reports: true,
      api_access: true,
      webhooks: true,
      zapier: true,
      salla_zid: true,
      email_support: true,
      priority_support: true,
      dedicated_manager: true,
      ai_content: true,
      ai_translation: true,
      ai_image: true,
      white_label: true,
      custom_domain: true,
      custom_fonts: true,
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];
