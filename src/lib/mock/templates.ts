export type TemplateChannel = 'email' | 'sms' | 'whatsapp';
export type TemplateStatus = 'active' | 'draft' | 'archived';
export type TemplateLanguage = 'en' | 'ar' | 'both';
export type TemplateCategory =
  | 'onboarding'
  | 'billing'
  | 'sales'
  | 'support'
  | 'marketing'
  | 'notification';

export interface TemplateParameter {
  key: string;
  label: string;
  description: string;
  required: boolean;
  example: string;
}

export interface Template {
  id: string;
  name: string;
  channel: TemplateChannel;
  category: TemplateCategory;
  language: TemplateLanguage;
  status: TemplateStatus;
  subject?: string;
  bodyEn: string;
  bodyAr?: string;
  parameters: TemplateParameter[];
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  createdBy: string;
  tags: string[];
}

export const GLOBAL_PARAMETERS: TemplateParameter[] = [
  {
    key: 'customer_name',
    label: 'Customer Name',
    description: 'Full name of the contact',
    required: false,
    example: 'Ahmed Al-Rashidi',
  },
  {
    key: 'company_name',
    label: 'Company Name',
    description: 'Name of the company',
    required: false,
    example: 'Noon Commerce',
  },
  {
    key: 'agent_name',
    label: 'Agent Name',
    description: 'Name of the Highlit agent',
    required: false,
    example: 'Sarah Al-Mutairi',
  },
  {
    key: 'plan_name',
    label: 'Plan Name',
    description: 'Subscription plan name',
    required: false,
    example: 'Pro',
  },
  {
    key: 'amount',
    label: 'Amount',
    description: 'Payment amount',
    required: false,
    example: 'SAR 1,499',
  },
  {
    key: 'due_date',
    label: 'Due Date',
    description: 'Payment or renewal due date',
    required: false,
    example: 'May 15, 2026',
  },
  {
    key: 'payment_link',
    label: 'Payment Link',
    description: 'URL to payment page',
    required: false,
    example: 'https://pay.highlit.io/inv/123',
  },
  {
    key: 'support_email',
    label: 'Support Email',
    description: 'Highlit support email',
    required: false,
    example: 'support@highlit.io',
  },
  {
    key: 'dashboard_link',
    label: 'Dashboard Link',
    description: 'Link to customer dashboard',
    required: false,
    example: 'https://app.highlit.io',
  },
  {
    key: 'discount_value',
    label: 'Discount Value',
    description: 'Discount percentage or amount',
    required: false,
    example: '20%',
  },
];

const p = (keys: string[]) => keys.map((k) => GLOBAL_PARAMETERS.find((g) => g.key === k)!);

export const MOCK_TEMPLATES: Template[] = [
  {
    id: 'tpl-1',
    name: 'Introduction Email',
    channel: 'email',
    category: 'sales',
    language: 'both',
    status: 'active',
    subject: 'Introducing Highlit — In-App Stories for {{company_name}}',
    bodyEn: `Hi {{customer_name}},\n\nI hope this message finds you well.\n\nI'm {{agent_name}} from Highlit, and I wanted to reach out because we help companies like {{company_name}} engage their users with native in-app stories.\n\nOur platform is built Arabic-first for the Gulf market, and we'd love to show you what we can do.\n\nWould you have 20 minutes this week for a quick demo?\n\nBest regards,\n{{agent_name}}\nHighlit Platform`,
    bodyAr: `مرحباً {{customer_name}}،\n\nأتمنى أن تكون بخير.\n\nأنا {{agent_name}} من Highlit، وأردت التواصل معك لأننا نساعد شركات مثل {{company_name}} على تفاعل المستخدمين من خلال قصص داخل التطبيق.\n\nهل لديك 20 دقيقة هذا الأسبوع لعرض سريع؟\n\nمع أطيب التحيات،\n{{agent_name}}`,
    parameters: p(['customer_name', 'company_name', 'agent_name']),
    usageCount: 47,
    lastUsedAt: '2026-04-28',
    createdAt: '2026-01-15',
    createdBy: 'Admin',
    tags: ['sales', 'outreach'],
  },
  {
    id: 'tpl-2',
    name: 'Demo Invitation',
    channel: 'email',
    category: 'sales',
    language: 'en',
    status: 'active',
    subject: 'Your Highlit Demo is Ready — {{company_name}}',
    bodyEn: `Hi {{customer_name}},\n\nThank you for your interest in Highlit!\n\nI'd love to walk you through how {{company_name}} can use our platform to boost engagement.\n\nPlease click below to schedule a time that works for you:\n{{dashboard_link}}\n\nLooking forward to connecting!\n\n{{agent_name}}\nHighlit Platform`,
    parameters: p(['customer_name', 'company_name', 'agent_name', 'dashboard_link']),
    usageCount: 23,
    lastUsedAt: '2026-04-25',
    createdAt: '2026-02-01',
    createdBy: 'Admin',
    tags: ['sales', 'demo'],
  },
  {
    id: 'tpl-3',
    name: 'Payment Link',
    channel: 'email',
    category: 'billing',
    language: 'both',
    status: 'active',
    subject: 'Complete Your Highlit Subscription — {{plan_name}} Plan',
    bodyEn: `Hi {{customer_name}},\n\nYour {{plan_name}} plan is ready to activate!\n\nTotal amount: {{amount}}\n\nComplete your payment here:\n{{payment_link}}\n\nThis link expires on {{due_date}}. If you have any questions, contact us at {{support_email}}.\n\nBest,\nHighlit Team`,
    bodyAr: `مرحباً {{customer_name}}،\n\nخطة {{plan_name}} جاهزة للتفعيل!\n\nالمبلغ الإجمالي: {{amount}}\n\nأكمل الدفع من هنا:\n{{payment_link}}\n\nينتهي هذا الرابط في {{due_date}}.`,
    parameters: p([
      'customer_name',
      'plan_name',
      'amount',
      'payment_link',
      'due_date',
      'support_email',
    ]),
    usageCount: 89,
    lastUsedAt: '2026-04-29',
    createdAt: '2026-01-01',
    createdBy: 'Admin',
    tags: ['billing', 'payment'],
  },
  {
    id: 'tpl-4',
    name: 'Follow-up WhatsApp',
    channel: 'whatsapp',
    category: 'sales',
    language: 'both',
    status: 'active',
    subject: undefined,
    bodyEn: `Hi {{customer_name}} 👋\n\nThis is {{agent_name}} from Highlit. Just following up on our conversation about {{company_name}}.\n\nHave you had a chance to review our proposal? I'm here to answer any questions!\n\nBest,\n{{agent_name}}`,
    bodyAr: `مرحباً {{customer_name}} 👋\n\nأنا {{agent_name}} من Highlit. أتابع معك بخصوص {{company_name}}.\n\nهل راجعت عرضنا؟ أنا هنا للإجابة على أي استفسارات!`,
    parameters: p(['customer_name', 'company_name', 'agent_name']),
    usageCount: 156,
    lastUsedAt: '2026-04-29',
    createdAt: '2026-01-20',
    createdBy: 'Admin',
    tags: ['sales', 'follow-up'],
  },
  {
    id: 'tpl-5',
    name: 'Welcome Onboarding',
    channel: 'email',
    category: 'onboarding',
    language: 'both',
    status: 'active',
    subject: 'Welcome to Highlit, {{customer_name}}! 🎉',
    bodyEn: `Hi {{customer_name}},\n\nWelcome to Highlit! Your {{plan_name}} account is now active.\n\nGet started here: {{dashboard_link}}\n\nIf you need help, reach us at {{support_email}}.\n\nExcited to have {{company_name}} on board!\n\nThe Highlit Team`,
    bodyAr: `مرحباً {{customer_name}}،\n\nأهلاً بك في Highlit! حسابك على خطة {{plan_name}} أصبح نشطاً الآن.\n\nابدأ من هنا: {{dashboard_link}}\n\nفريق Highlit`,
    parameters: p([
      'customer_name',
      'company_name',
      'plan_name',
      'dashboard_link',
      'support_email',
    ]),
    usageCount: 34,
    lastUsedAt: '2026-04-27',
    createdAt: '2026-01-01',
    createdBy: 'Admin',
    tags: ['onboarding', 'welcome'],
  },
  {
    id: 'tpl-6',
    name: 'SMS Payment Reminder',
    channel: 'sms',
    category: 'billing',
    language: 'both',
    status: 'active',
    subject: undefined,
    bodyEn: `Highlit: Hi {{customer_name}}, your {{plan_name}} renewal of {{amount}} is due on {{due_date}}. Pay here: {{payment_link}}`,
    bodyAr: `Highlit: مرحباً {{customer_name}}، تجديد خطة {{plan_name}} بمبلغ {{amount}} مستحق في {{due_date}}. ادفع هنا: {{payment_link}}`,
    parameters: p(['customer_name', 'plan_name', 'amount', 'due_date', 'payment_link']),
    usageCount: 67,
    lastUsedAt: '2026-04-20',
    createdAt: '2026-02-15',
    createdBy: 'Admin',
    tags: ['billing', 'reminder'],
  },
];
