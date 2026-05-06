export type RequirementType =
  | 'data_field'
  | 'send_email'
  | 'send_whatsapp'
  | 'log_interaction'
  | 'manual_check'
  | 'legal_docs'
  | 'payment_link'
  | 'payment_method';

export interface StageRequirement {
  id: string;
  label: string;
  type: RequirementType;
  field?: string;
  isBlocker?: boolean;
  description?: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  color: string;
  requirements: StageRequirement[];
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'new',
    label: 'New Request',
    color: '#71717A',
    requirements: [
      {
        id: 'company_name',
        label: 'Company name',
        type: 'data_field',
        field: 'companyName',
        isBlocker: true,
      },
      {
        id: 'contact_name',
        label: 'Contact name',
        type: 'data_field',
        field: 'contactName',
        isBlocker: true,
      },
      {
        id: 'contact_email',
        label: 'Email or phone',
        type: 'data_field',
        field: 'contactEmail',
        isBlocker: true,
      },
      { id: 'country', label: 'Country', type: 'data_field', field: 'country', isBlocker: true },
      { id: 'source_tagged', label: 'Tag lead source', type: 'data_field', field: 'source' },
      { id: 'owner_assigned', label: 'Assign owner', type: 'data_field', field: 'assignedTo' },
      {
        id: 'platforms_selected',
        label: 'Target platforms',
        type: 'data_field',
        field: 'platforms',
        isBlocker: true,
      },
      {
        id: 'goals_captured',
        label: 'Business goals captured',
        type: 'data_field',
        field: 'goals',
        isBlocker: true,
      },
    ],
  },
  {
    id: 'contacted',
    label: 'First Contact',
    color: '#3B82F6',
    requirements: [
      {
        id: 'outreach_done',
        label: 'Send initial outreach',
        type: 'send_email',
        isBlocker: true,
        description: 'Send intro email or WhatsApp to prospect',
      },
      {
        id: 'interaction_logged',
        label: 'Log first interaction',
        type: 'log_interaction',
        isBlocker: true,
        description: 'Record what was discussed',
      },
      {
        id: 'use_case_identified',
        label: 'Identify business use case',
        type: 'data_field',
        field: 'industry',
      },
      { id: 'contact_verified', label: 'Verify contact info', type: 'manual_check' },
    ],
  },
  {
    id: 'qualified',
    label: 'Qualified',
    color: '#8B5CF6',
    requirements: [
      {
        id: 'demo_completed',
        label: 'Schedule & complete demo',
        type: 'log_interaction',
        isBlocker: true,
        description: 'Log the demo call',
      },
      {
        id: 'decision_maker',
        label: 'Identify decision maker',
        type: 'data_field',
        field: 'contactName',
        isBlocker: true,
      },
      {
        id: 'company_size',
        label: 'Confirm company size',
        type: 'data_field',
        field: 'companySize',
      },
      { id: 'expected_usage', label: 'Estimate expected usage', type: 'manual_check' },
      { id: 'country_confirmed', label: 'Confirm country', type: 'data_field', field: 'country' },
    ],
  },
  {
    id: 'documents',
    label: 'Commercial Setup',
    color: '#F59E0B',
    requirements: [
      {
        id: 'plan_selected',
        label: 'Select plan',
        type: 'data_field',
        field: 'requestedPlan',
        isBlocker: true,
      },
      {
        id: 'billing_cycle',
        label: 'Billing cycle',
        type: 'data_field',
        field: 'billingCycle',
        isBlocker: true,
      },
      {
        id: 'billing_email',
        label: 'Billing email',
        type: 'data_field',
        field: 'contactEmail',
        isBlocker: true,
      },
      {
        id: 'company_legal_name',
        label: 'Company legal name',
        type: 'data_field',
        field: 'companyName',
        isBlocker: true,
      },
      {
        id: 'legal_docs',
        label: 'Legal documents (CR + VAT)',
        type: 'legal_docs',
        isBlocker: true,
      },
      { id: 'discount_applied', label: 'Apply discount (if any)', type: 'manual_check' },
    ],
  },
  {
    id: 'contract',
    label: 'Activation',
    color: '#EC4899',
    requirements: [
      {
        id: 'payment_method_selected',
        label: 'Select payment method',
        type: 'payment_method',
        isBlocker: true,
      },
      {
        id: 'agreement_signed',
        label: 'Send agreement to customer',
        type: 'send_email',
        isBlocker: true,
      },
      { id: 'payment_tracked', label: 'Track payment status', type: 'manual_check' },
    ],
  },
];

export const EMAIL_TEMPLATES = [
  {
    id: 'intro',
    label: 'Introduction Email',
    subject: 'Introducing Highlit — In-App Stories for your platform',
  },
  { id: 'follow_up', label: 'Follow-up Email', subject: 'Following up on our conversation' },
  { id: 'demo_invite', label: 'Demo Invitation', subject: 'Schedule a demo with Highlit' },
  {
    id: 'proposal',
    label: 'Commercial Proposal',
    subject: 'Highlit — Commercial Proposal for [Company]',
  },
  {
    id: 'agreement',
    label: 'Agreement & Terms',
    subject: 'Highlit Service Agreement — Action Required',
  },
  {
    id: 'payment_link',
    label: 'Payment Link',
    subject: 'Complete your Highlit subscription payment',
  },
  {
    id: 'onboarding',
    label: 'Welcome & Onboarding',
    subject: 'Welcome to Highlit! Here is how to get started',
  },
];

export type DealPriority = 'Low' | 'Medium' | 'High';
export type DealSource = 'Website Form' | 'Direct' | 'Referral' | 'Event';

export interface Deal {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  country: 'SA' | 'AE' | 'KW' | 'QA';
  countryFlag: string;
  industry: string;
  companySize: string;
  requestedPlan: 'Starter' | 'Pro' | 'Business' | 'Enterprise';
  estimatedMRR: number;
  currency: 'SAR' | 'AED' | 'USD';
  stageId: string;
  closedStatus?: 'won' | 'lost' | null;
  wonAt?: string;
  priority: DealPriority;
  source: DealSource;
  assignedTo: string | null;
  assignedAvatar: string;
  createdAt: string;
  updatedAt: string;
  expectedCloseDate: string | null;
  notes: Array<{ id: string; text: string; author: string; createdAt: string }>;
  activities: Array<{
    id: string;
    type:
      | 'email_sent'
      | 'whatsapp_sent'
      | 'call_logged'
      | 'meeting_logged'
      | 'manual_check'
      | 'stage_change'
      | 'field_updated';
    requirementId?: string;
    channel?: 'Email' | 'WhatsApp' | 'Call' | 'Meeting';
    template?: string;
    note?: string;
    date: string;
    loggedAt: string;
    loggedBy: string;
    canEdit: boolean;
  }>;
  billingCycle: 'Monthly' | 'Annual' | null;
  crNumber?: string;
  vatNumber?: string;
  legalDocs?: Array<{ id: string; name: string; size: string; type: string }>;
  discount?: { id: string; label: string; value: number } | null;
  paymentLink?: {
    id: string;
    url: string;
    amount: number;
    currency: string;
    plan: string;
    billingCycle: string;
    status: 'pending' | 'paid' | 'expired';
    createdAt: string;
  } | null;
  platforms: ('iOS' | 'Android' | 'Web')[];
  goals: string;
  tags: string[];
  website: string;
  lostReason?: string;
  paymentMethod?: 'payment_link' | 'bank_transfer';
  bankTransferReceipt?: { fileName: string; uploadedAt: string } | null;
  completedRequirements: string[];
}

export type DealActivity = Deal['activities'][0];

export const deals: Deal[] = [
  // ── NEW (3) ────────────────────────────────────────────────────────────────
  {
    id: 'deal-001',
    companyName: 'Maison Retail SA',
    contactName: 'Rawan Al-Ghamdi',
    contactEmail: 'rawan@maisonretail.sa',
    contactPhone: '+966 50 111 2233',
    country: 'SA',
    countryFlag: '🇸🇦',
    industry: 'Retail & E-Commerce',
    companySize: '51-200',
    requestedPlan: 'Business',
    estimatedMRR: 1200,
    currency: 'SAR',
    billingCycle: null,
    stageId: 'new',
    priority: 'High',
    source: 'Website Form',
    assignedTo: 'Saad Al-Rashid',
    assignedAvatar: 'SR',
    createdAt: '2026-04-18T09:15:00Z',
    updatedAt: '2026-04-18T09:15:00Z',
    expectedCloseDate: '2026-05-30',
    notes: [
      {
        id: 'n-001-1',
        text: 'High-intent lead — they mentioned switching from a competitor. Fast follow-up needed.',
        author: 'Saad Al-Rashid',
        createdAt: '2026-04-18T10:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-001-1',
        type: 'field_updated',
        note: 'Lead created from website contact form.',
        date: '2026-04-18T09:15:00Z',
        loggedAt: '2026-04-18T09:15:00Z',
        loggedBy: 'System',
        canEdit: false,
      },
      {
        id: 'a-001-2',
        type: 'email_sent',
        channel: 'Email',
        template: 'Welcome Email',
        note: 'Automated welcome email sent to rawan@maisonretail.sa.',
        date: '2026-04-18T09:16:00Z',
        loggedAt: '2026-04-18T09:16:00Z',
        loggedBy: 'System',
        canEdit: false,
      },
    ],
    platforms: ['iOS', 'Web'],
    goals: 'Increase user engagement through in-app stories for our e-commerce app',
    tags: ['retail', 'high-intent'],
    website: 'https://maisonretail.sa',
    completedRequirements: [],
  },
  {
    id: 'deal-002',
    companyName: 'Al Noor Clinics AE',
    contactName: 'Dr. Tariq Hassan',
    contactEmail: 'tariq@alnoor.ae',
    contactPhone: '+971 52 888 4455',
    country: 'AE',
    countryFlag: '🇦🇪',
    industry: 'Healthcare',
    companySize: '201-500',
    requestedPlan: 'Enterprise',
    estimatedMRR: 3500,
    currency: 'AED',
    billingCycle: null,
    stageId: 'new',
    priority: 'High',
    source: 'Referral',
    assignedTo: 'Nadia Khalil',
    assignedAvatar: 'NK',
    createdAt: '2026-04-20T11:00:00Z',
    updatedAt: '2026-04-20T11:00:00Z',
    expectedCloseDate: '2026-06-15',
    notes: [
      {
        id: 'n-002-1',
        text: 'Referred by Noon Commerce. Multiple clinic locations across UAE. Big opportunity.',
        author: 'Nadia Khalil',
        createdAt: '2026-04-20T11:30:00Z',
      },
      {
        id: 'n-002-2',
        text: 'Requires HIPAA-adjacent compliance discussion. Flag for legal review.',
        author: 'Nadia Khalil',
        createdAt: '2026-04-21T09:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-002-1',
        type: 'field_updated',
        note: 'Lead created via referral from Noon Commerce account team.',
        date: '2026-04-20T11:00:00Z',
        loggedAt: '2026-04-20T11:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: false,
      },
      {
        id: 'a-002-2',
        type: 'email_sent',
        channel: 'Email',
        template: 'Introduction Email',
        note: 'Introduction email sent with product overview deck.',
        date: '2026-04-20T14:00:00Z',
        loggedAt: '2026-04-20T14:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: true,
      },
      {
        id: 'a-002-3',
        type: 'call_logged',
        channel: 'Call',
        note: 'Brief intro call — Dr. Tariq confirmed interest. Scheduling demo.',
        date: '2026-04-21T10:00:00Z',
        loggedAt: '2026-04-21T10:30:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: true,
      },
    ],
    platforms: ['iOS', 'Android'],
    goals:
      'Deliver patient health tips and appointment reminders via in-app stories across clinic locations',
    tags: ['healthcare', 'enterprise', 'referral'],
    website: 'https://alnoor.ae',
    completedRequirements: [],
  },
  {
    id: 'deal-003',
    companyName: 'Tamara Foods KW',
    contactName: 'Fatima Al-Sabah',
    contactEmail: 'fatima@tamarafoods.kw',
    contactPhone: '+965 65 777 3322',
    country: 'KW',
    countryFlag: '🇰🇼',
    industry: 'Food & Beverage',
    companySize: '11-50',
    requestedPlan: 'Pro',
    estimatedMRR: 499,
    currency: 'USD',
    billingCycle: null,
    stageId: 'new',
    priority: 'Medium',
    source: 'Website Form',
    assignedTo: null,
    assignedAvatar: '??',
    createdAt: '2026-04-22T08:30:00Z',
    updatedAt: '2026-04-22T08:30:00Z',
    expectedCloseDate: null,
    notes: [
      {
        id: 'n-003-1',
        text: 'SMB lead. Interested in stories for their food delivery app. Unassigned — needs owner.',
        author: 'System',
        createdAt: '2026-04-22T08:30:00Z',
      },
    ],
    activities: [
      {
        id: 'a-003-1',
        type: 'field_updated',
        note: 'Lead created from website contact form.',
        date: '2026-04-22T08:30:00Z',
        loggedAt: '2026-04-22T08:30:00Z',
        loggedBy: 'System',
        canEdit: false,
      },
      {
        id: 'a-003-2',
        type: 'email_sent',
        channel: 'Email',
        note: 'Automated welcome email sent.',
        date: '2026-04-22T08:31:00Z',
        loggedAt: '2026-04-22T08:31:00Z',
        loggedBy: 'System',
        canEdit: false,
      },
    ],
    platforms: ['Android'],
    goals: 'Promote daily specials and seasonal menus through stories in our food delivery app',
    tags: ['food', 'smb'],
    website: 'https://tamarafoods.kw',
    completedRequirements: [],
  },

  // ── CONTACTED (2) ──────────────────────────────────────────────────────────
  {
    id: 'deal-004',
    companyName: 'Riyadh Auto Group',
    contactName: 'Khalid Al-Otaibi',
    contactEmail: 'khalid@riyadhauto.sa',
    contactPhone: '+966 55 300 1122',
    country: 'SA',
    countryFlag: '🇸🇦',
    industry: 'Automotive',
    companySize: '201-500',
    requestedPlan: 'Business',
    estimatedMRR: 1500,
    currency: 'SAR',
    billingCycle: null,
    stageId: 'contacted',
    priority: 'Medium',
    source: 'Event',
    assignedTo: 'Saad Al-Rashid',
    assignedAvatar: 'SR',
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-04-14T15:00:00Z',
    expectedCloseDate: '2026-06-01',
    notes: [
      {
        id: 'n-004-1',
        text: 'Met at GITEX 2026. Showed interest in showroom stories for their app.',
        author: 'Saad Al-Rashid',
        createdAt: '2026-04-10T10:30:00Z',
      },
    ],
    activities: [
      {
        id: 'a-004-1',
        type: 'field_updated',
        note: 'Lead created from GITEX 2026 event.',
        date: '2026-04-10T10:00:00Z',
        loggedAt: '2026-04-10T10:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: false,
      },
      {
        id: 'a-004-2',
        type: 'call_logged',
        channel: 'Call',
        note: 'Discovery call completed. Confirmed they use a custom iOS app.',
        date: '2026-04-14T15:00:00Z',
        loggedAt: '2026-04-14T15:30:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: true,
      },
      {
        id: 'a-004-3',
        type: 'email_sent',
        channel: 'Email',
        template: 'Introduction Email',
        note: 'Sent iOS SDK integration guide and pricing deck.',
        date: '2026-04-14T16:00:00Z',
        loggedAt: '2026-04-14T16:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: true,
      },
    ],
    platforms: ['iOS'],
    goals: 'Showcase new vehicle launches and dealership events via in-app stories',
    tags: ['automotive', 'event'],
    website: 'https://riyadhauto.sa',
    completedRequirements: ['contact_verified'],
  },
  {
    id: 'deal-005',
    companyName: 'Doha Living QA',
    contactName: 'Mariam Al-Thani',
    contactEmail: 'mariam@dohaliving.qa',
    contactPhone: '+974 33 556 7788',
    country: 'QA',
    countryFlag: '🇶🇦',
    industry: 'Real Estate',
    companySize: '51-200',
    requestedPlan: 'Pro',
    estimatedMRR: 799,
    currency: 'USD',
    billingCycle: null,
    stageId: 'contacted',
    priority: 'Low',
    source: 'Direct',
    assignedTo: 'Nadia Khalil',
    assignedAvatar: 'NK',
    createdAt: '2026-04-08T09:00:00Z',
    updatedAt: '2026-04-16T11:00:00Z',
    expectedCloseDate: '2026-07-01',
    notes: [
      {
        id: 'n-005-1',
        text: 'Long sales cycle expected — real estate sector tends to move slowly. Keep warm.',
        author: 'Nadia Khalil',
        createdAt: '2026-04-16T11:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-005-1',
        type: 'field_updated',
        note: 'Lead created via direct outreach from sales team.',
        date: '2026-04-08T09:00:00Z',
        loggedAt: '2026-04-08T09:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: false,
      },
      {
        id: 'a-005-2',
        type: 'email_sent',
        channel: 'Email',
        template: 'Introduction Email',
        note: 'Initial outreach email sent — introduced Hikayat stories platform.',
        date: '2026-04-09T10:00:00Z',
        loggedAt: '2026-04-09T10:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: true,
      },
      {
        id: 'a-005-3',
        type: 'call_logged',
        channel: 'Call',
        note: 'Left voicemail. Mariam called back — interested but needs board approval.',
        date: '2026-04-16T11:00:00Z',
        loggedAt: '2026-04-16T11:30:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: true,
      },
    ],
    platforms: ['iOS', 'Web'],
    goals: 'Use stories for virtual property tours and new listing announcements',
    tags: ['real-estate', 'slow-cycle'],
    website: 'https://dohaliving.qa',
    completedRequirements: ['contact_verified', 'interaction_logged'],
  },

  // ── QUALIFIED (2) ──────────────────────────────────────────────────────────
  {
    id: 'deal-006',
    companyName: 'Gulf Pharma AE',
    contactName: 'Ali Mansoor',
    contactEmail: 'ali@gulfpharma.ae',
    contactPhone: '+971 50 444 9900',
    country: 'AE',
    countryFlag: '🇦🇪',
    industry: 'Pharmaceuticals',
    companySize: '501-1000',
    requestedPlan: 'Enterprise',
    estimatedMRR: 4500,
    currency: 'AED',
    billingCycle: null,
    stageId: 'qualified',
    priority: 'High',
    source: 'Referral',
    assignedTo: 'Saad Al-Rashid',
    assignedAvatar: 'SR',
    createdAt: '2026-03-25T09:00:00Z',
    updatedAt: '2026-04-10T14:00:00Z',
    expectedCloseDate: '2026-05-15',
    notes: [
      {
        id: 'n-006-1',
        text: 'Strong fit. They have 3 mobile apps across product lines. Custom onboarding required.',
        author: 'Saad Al-Rashid',
        createdAt: '2026-04-10T14:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-006-1',
        type: 'field_updated',
        note: 'Lead created via referral.',
        date: '2026-03-25T09:00:00Z',
        loggedAt: '2026-03-25T09:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: false,
      },
      {
        id: 'a-006-2',
        type: 'call_logged',
        channel: 'Call',
        note: 'Full qualification call — confirmed budget, authority, and timeline.',
        date: '2026-04-05T10:00:00Z',
        loggedAt: '2026-04-05T10:30:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: true,
      },
      {
        id: 'a-006-3',
        type: 'stage_change',
        note: 'Moved from First Contact to Qualified.',
        date: '2026-04-10T14:00:00Z',
        loggedAt: '2026-04-10T14:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: false,
      },
    ],
    platforms: ['iOS', 'Android', 'Web'],
    goals: 'Educate healthcare professionals on new products through interactive in-app stories',
    tags: ['pharma', 'enterprise', 'high-priority'],
    website: 'https://gulfpharma.ae',
    completedRequirements: ['industry', 'company_size', 'decision_maker', 'demo_completed'],
  },
  {
    id: 'deal-007',
    companyName: 'Savola Digital SA',
    contactName: 'Noura Al-Faisal',
    contactEmail: 'noura@savoladigital.sa',
    contactPhone: '+966 56 211 8844',
    country: 'SA',
    countryFlag: '🇸🇦',
    industry: 'FMCG',
    companySize: '1000+',
    requestedPlan: 'Enterprise',
    estimatedMRR: 5000,
    currency: 'SAR',
    billingCycle: null,
    stageId: 'qualified',
    priority: 'High',
    source: 'Event',
    assignedTo: 'Nadia Khalil',
    assignedAvatar: 'NK',
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-04-08T12:00:00Z',
    expectedCloseDate: '2026-05-20',
    notes: [
      {
        id: 'n-007-1',
        text: 'They want to run Ramadan story campaigns across their brand portfolio. Huge volume potential.',
        author: 'Nadia Khalil',
        createdAt: '2026-04-08T12:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-007-1',
        type: 'field_updated',
        note: 'Lead created from Saudi Tech Summit event.',
        date: '2026-03-20T10:00:00Z',
        loggedAt: '2026-03-20T10:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: false,
      },
      {
        id: 'a-007-2',
        type: 'meeting_logged',
        channel: 'Meeting',
        note: 'Demo call — showed Hikayat Studio. Noura loved the template gallery.',
        date: '2026-04-02T11:00:00Z',
        loggedAt: '2026-04-02T12:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: true,
      },
      {
        id: 'a-007-3',
        type: 'stage_change',
        note: 'Moved to Qualified after successful demo.',
        date: '2026-04-08T12:00:00Z',
        loggedAt: '2026-04-08T12:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: false,
      },
    ],
    platforms: ['iOS', 'Android'],
    goals:
      'Run seasonal Ramadan story campaigns across brand portfolio to boost consumer engagement',
    tags: ['fmcg', 'enterprise', 'seasonal'],
    website: 'https://savola.sa',
    completedRequirements: ['industry', 'company_size', 'demo_completed'],
  },

  // ── DOCUMENTS (2) ──────────────────────────────────────────────────────────
  {
    id: 'deal-008',
    companyName: 'Jazeel Media KW',
    contactName: 'Bader Al-Kandari',
    contactEmail: 'bader@jazeelmedia.kw',
    contactPhone: '+965 66 900 1234',
    country: 'KW',
    countryFlag: '🇰🇼',
    industry: 'Media & Entertainment',
    companySize: '51-200',
    requestedPlan: 'Business',
    estimatedMRR: 2200,
    currency: 'USD',
    billingCycle: null,
    stageId: 'documents',
    priority: 'Medium',
    source: 'Direct',
    assignedTo: 'Saad Al-Rashid',
    assignedAvatar: 'SR',
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-04-15T10:00:00Z',
    expectedCloseDate: '2026-05-10',
    notes: [
      {
        id: 'n-008-1',
        text: 'Waiting on their legal team to review the DPA. Should be 1-2 weeks.',
        author: 'Saad Al-Rashid',
        createdAt: '2026-04-15T10:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-008-1',
        type: 'field_updated',
        note: 'Lead created via direct contact.',
        date: '2026-03-10T09:00:00Z',
        loggedAt: '2026-03-10T09:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: false,
      },
      {
        id: 'a-008-2',
        type: 'email_sent',
        channel: 'Email',
        template: 'Agreement & Terms',
        note: 'Sent DPA and Terms of Service for legal review.',
        date: '2026-04-12T11:00:00Z',
        loggedAt: '2026-04-12T11:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: true,
      },
      {
        id: 'a-008-3',
        type: 'stage_change',
        note: 'Moved to Documents stage — awaiting legal sign-off.',
        date: '2026-04-15T10:00:00Z',
        loggedAt: '2026-04-15T10:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: false,
      },
    ],
    platforms: ['iOS', 'Android', 'Web'],
    goals: 'Deliver breaking news and exclusive content through immersive stories',
    tags: ['media', 'legal-review'],
    website: 'https://jazeelmedia.kw',
    completedRequirements: ['plan_selected'],
  },
  {
    id: 'deal-009',
    companyName: 'Emaar Digital AE',
    contactName: 'Hassan Al-Maktoum',
    contactEmail: 'hassan.am@emaar.ae',
    contactPhone: '+971 55 700 2288',
    country: 'AE',
    countryFlag: '🇦🇪',
    industry: 'Real Estate',
    companySize: '1000+',
    requestedPlan: 'Enterprise',
    estimatedMRR: 8000,
    currency: 'AED',
    billingCycle: 'Annual',
    stageId: 'documents',
    priority: 'High',
    source: 'Referral',
    assignedTo: 'Nadia Khalil',
    assignedAvatar: 'NK',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-04-18T09:00:00Z',
    expectedCloseDate: '2026-05-05',
    notes: [
      {
        id: 'n-009-1',
        text: 'Massive deal. Emaar wants Hikayat embedded across all 4 of their mobile apps. Procurement is reviewing.',
        author: 'Nadia Khalil',
        createdAt: '2026-04-18T09:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-009-1',
        type: 'call_logged',
        channel: 'Call',
        note: 'Initial call with Hassan — confirmed enterprise-level requirements.',
        date: '2026-03-05T10:00:00Z',
        loggedAt: '2026-03-05T10:30:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: true,
      },
      {
        id: 'a-009-2',
        type: 'email_sent',
        channel: 'Email',
        template: 'Commercial Proposal',
        note: 'Sent enterprise proposal with custom SLA and white-glove onboarding.',
        date: '2026-04-10T14:00:00Z',
        loggedAt: '2026-04-10T14:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: true,
      },
      {
        id: 'a-009-3',
        type: 'stage_change',
        note: 'Moved to Documents — procurement reviewing proposal.',
        date: '2026-04-18T09:00:00Z',
        loggedAt: '2026-04-18T09:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: false,
      },
    ],
    platforms: ['iOS', 'Android'],
    goals:
      'Embed Hikayat stories across all 4 mobile apps for property showcases and lifestyle content',
    tags: ['real-estate', 'enterprise', 'strategic'],
    website: 'https://emaar.ae',
    completedRequirements: ['plan_selected', 'billing_cycle'],
  },

  // ── CONTRACT (2) ──────────────────────────────────────────────────────────
  {
    id: 'deal-010',
    companyName: 'Tamkeen Fintech SA',
    contactName: 'Omar Al-Zahrani',
    contactEmail: 'omar@tamkeen.sa',
    contactPhone: '+966 54 122 9900',
    country: 'SA',
    countryFlag: '🇸🇦',
    industry: 'Fintech',
    companySize: '51-200',
    requestedPlan: 'Pro',
    estimatedMRR: 999,
    currency: 'SAR',
    billingCycle: 'Annual',
    stageId: 'contract',
    priority: 'Medium',
    source: 'Website Form',
    assignedTo: 'Saad Al-Rashid',
    assignedAvatar: 'SR',
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-04-20T13:00:00Z',
    expectedCloseDate: '2026-04-30',
    notes: [
      {
        id: 'n-010-1',
        text: 'Contract out for e-signature via DocuSign. Expect signing within 3-5 business days.',
        author: 'Saad Al-Rashid',
        createdAt: '2026-04-20T13:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-010-1',
        type: 'call_logged',
        channel: 'Call',
        note: 'Final negotiation call — agreed on Pro plan with annual billing discount.',
        date: '2026-04-15T10:00:00Z',
        loggedAt: '2026-04-15T10:30:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: true,
      },
      {
        id: 'a-010-2',
        type: 'email_sent',
        channel: 'Email',
        template: 'Agreement & Terms',
        note: 'Contract sent via DocuSign for e-signature.',
        date: '2026-04-20T13:00:00Z',
        loggedAt: '2026-04-20T13:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: true,
      },
      {
        id: 'a-010-3',
        type: 'stage_change',
        note: 'Moved to Contract Sent stage.',
        date: '2026-04-20T13:00:00Z',
        loggedAt: '2026-04-20T13:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: false,
      },
    ],
    platforms: ['iOS', 'Web'],
    goals: 'Onboard new users with interactive financial tips and product tutorials',
    tags: ['fintech', 'close-ready'],
    website: 'https://tamkeen.sa',
    paymentMethod: 'payment_link',
    paymentLink: {
      id: 'pl-010',
      url: 'https://pay.hikayat.io/inv/pl-010',
      amount: 11988,
      currency: 'SAR',
      plan: 'Pro',
      billingCycle: 'Annual',
      status: 'pending',
      createdAt: '2026-04-19T10:00:00Z',
    },
    completedRequirements: ['payment_method_selected', 'agreement_signed'],
  },
  {
    id: 'deal-011',
    companyName: 'Warba Insurance KW',
    contactName: 'Sulaiman Al-Barrak',
    contactEmail: 'sulaiman@warba.kw',
    contactPhone: '+965 69 444 7711',
    country: 'KW',
    countryFlag: '🇰🇼',
    industry: 'Insurance',
    companySize: '201-500',
    requestedPlan: 'Business',
    estimatedMRR: 1800,
    currency: 'USD',
    billingCycle: 'Monthly',
    stageId: 'contract',
    priority: 'High',
    source: 'Referral',
    assignedTo: 'Nadia Khalil',
    assignedAvatar: 'NK',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-04-22T11:00:00Z',
    expectedCloseDate: '2026-04-28',
    notes: [
      {
        id: 'n-011-1',
        text: 'Sulaiman confirmed the contract is with legal — signing expected by end of this week.',
        author: 'Nadia Khalil',
        createdAt: '2026-04-22T11:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-011-1',
        type: 'call_logged',
        channel: 'Call',
        note: 'Final price negotiation — agreed on $1,800/mo with 2yr lock-in.',
        date: '2026-04-18T14:00:00Z',
        loggedAt: '2026-04-18T14:30:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: true,
      },
      {
        id: 'a-011-2',
        type: 'email_sent',
        channel: 'Email',
        template: 'Agreement & Terms',
        note: 'Master Services Agreement sent for review.',
        date: '2026-04-20T09:00:00Z',
        loggedAt: '2026-04-20T09:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: true,
      },
      {
        id: 'a-011-3',
        type: 'stage_change',
        note: 'Moved to Contract Sent — awaiting legal sign-off.',
        date: '2026-04-22T11:00:00Z',
        loggedAt: '2026-04-22T11:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: false,
      },
    ],
    platforms: ['iOS', 'Android'],
    goals: 'Simplify insurance product education and claims updates through in-app stories',
    tags: ['insurance', 'contract-ready'],
    website: 'https://warba.kw',
    completedRequirements: ['agreement_signed'],
  },

  // ── WON (2) ────────────────────────────────────────────────────────────────
  {
    id: 'deal-012',
    companyName: 'Noon Commerce',
    contactName: 'Ahmed Al-Mansouri',
    contactEmail: 'ahmed@noon.com',
    contactPhone: '+971 56 123 4567',
    country: 'AE',
    countryFlag: '🇦🇪',
    industry: 'E-Commerce',
    companySize: '1000+',
    requestedPlan: 'Enterprise',
    estimatedMRR: 9500,
    currency: 'AED',
    billingCycle: 'Annual',
    stageId: 'contract',
    closedStatus: 'won',
    wonAt: '2026-04-01T10:00:00Z',
    priority: 'High',
    source: 'Direct',
    assignedTo: 'Nadia Khalil',
    assignedAvatar: 'NK',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-04-01T10:00:00Z',
    expectedCloseDate: '2026-04-01',
    notes: [
      {
        id: 'n-012-1',
        text: 'Contract signed. Onboarding kick-off scheduled for April 5th. Assign dedicated CSM.',
        author: 'Nadia Khalil',
        createdAt: '2026-04-01T10:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-012-1',
        type: 'call_logged',
        channel: 'Call',
        note: 'Contract review call — all terms agreed.',
        date: '2026-03-28T10:00:00Z',
        loggedAt: '2026-03-28T10:30:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: true,
      },
      {
        id: 'a-012-2',
        type: 'manual_check',
        note: 'Signed Enterprise agreement received.',
        date: '2026-04-01T09:30:00Z',
        loggedAt: '2026-04-01T09:30:00Z',
        loggedBy: 'System',
        canEdit: false,
      },
      {
        id: 'a-012-3',
        type: 'stage_change',
        note: 'Deal marked as Won. Onboarding initiated.',
        date: '2026-04-01T10:00:00Z',
        loggedAt: '2026-04-01T10:00:00Z',
        loggedBy: 'Nadia Khalil',
        canEdit: false,
      },
    ],
    platforms: ['iOS', 'Android', 'Web'],
    goals: 'Drive flash sale engagement and personalized product recommendations via stories',
    tags: ['e-commerce', 'enterprise', 'won'],
    website: 'https://noon.com',
    completedRequirements: ['payment_method_selected', 'agreement_signed', 'payment_tracked'],
  },
  {
    id: 'deal-013',
    companyName: 'STC Pay',
    contactName: 'Lina Al-Harbi',
    contactEmail: 'lina@stcpay.com.sa',
    contactPhone: '+966 50 999 8877',
    country: 'SA',
    countryFlag: '🇸🇦',
    industry: 'Fintech',
    companySize: '201-500',
    requestedPlan: 'Business',
    estimatedMRR: 2999,
    currency: 'SAR',
    billingCycle: 'Annual',
    stageId: 'contract',
    closedStatus: 'won',
    wonAt: '2026-04-10T11:00:00Z',
    priority: 'High',
    source: 'Event',
    assignedTo: 'Saad Al-Rashid',
    assignedAvatar: 'SR',
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-04-10T11:00:00Z',
    expectedCloseDate: '2026-04-10',
    notes: [
      {
        id: 'n-013-1',
        text: 'Won after 2-month sales cycle. They loved the Arabic RTL story support. Great reference customer.',
        author: 'Saad Al-Rashid',
        createdAt: '2026-04-10T11:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-013-1',
        type: 'manual_check',
        note: 'Business plan contract signed via DocuSign.',
        date: '2026-04-10T09:00:00Z',
        loggedAt: '2026-04-10T09:00:00Z',
        loggedBy: 'System',
        canEdit: false,
      },
      {
        id: 'a-013-2',
        type: 'stage_change',
        note: 'Deal marked as Won.',
        date: '2026-04-10T11:00:00Z',
        loggedAt: '2026-04-10T11:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: false,
      },
      {
        id: 'a-013-3',
        type: 'field_updated',
        note: 'First payment processed. Customer portal access granted.',
        date: '2026-04-10T12:00:00Z',
        loggedAt: '2026-04-10T12:00:00Z',
        loggedBy: 'System',
        canEdit: false,
      },
    ],
    platforms: ['iOS', 'Android'],
    goals: 'Highlight new payment features and Arabic RTL story support for Gulf users',
    tags: ['fintech', 'rtl', 'reference-customer'],
    website: 'https://stcpay.com.sa',
    completedRequirements: ['payment_method_selected', 'agreement_signed', 'payment_tracked'],
  },

  // ── LOST (1) ──────────────────────────────────────────────────────────────
  {
    id: 'deal-014',
    companyName: 'Zain Digital KW',
    contactName: 'Abdullah Al-Mutawa',
    contactEmail: 'aab@zain.com',
    contactPhone: '+965 60 300 5566',
    country: 'KW',
    countryFlag: '🇰🇼',
    industry: 'Telecommunications',
    companySize: '1000+',
    requestedPlan: 'Enterprise',
    estimatedMRR: 6000,
    currency: 'USD',
    billingCycle: null,
    stageId: 'qualified',
    closedStatus: 'lost',
    priority: 'High',
    source: 'Direct',
    assignedTo: 'Saad Al-Rashid',
    assignedAvatar: 'SR',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-03-20T14:00:00Z',
    expectedCloseDate: '2026-03-15',
    lostReason: 'Budget constraints',
    notes: [
      {
        id: 'n-014-1',
        text: 'Budget freeze due to internal restructuring. Abdullah said to reach back in Q3 2026.',
        author: 'Saad Al-Rashid',
        createdAt: '2026-03-20T14:00:00Z',
      },
    ],
    activities: [
      {
        id: 'a-014-1',
        type: 'call_logged',
        channel: 'Call',
        note: 'Final call — Abdullah confirmed budget freeze for all new vendors in H1.',
        date: '2026-03-18T11:00:00Z',
        loggedAt: '2026-03-18T11:30:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: true,
      },
      {
        id: 'a-014-2',
        type: 'stage_change',
        note: 'Deal marked as Lost — Budget constraints. Follow up Q3 2026.',
        date: '2026-03-20T14:00:00Z',
        loggedAt: '2026-03-20T14:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: false,
      },
      {
        id: 'a-014-3',
        type: 'email_sent',
        channel: 'Email',
        note: 'Sent farewell email with invitation to reconnect when budget reopens.',
        date: '2026-03-20T15:00:00Z',
        loggedAt: '2026-03-20T15:00:00Z',
        loggedBy: 'Saad Al-Rashid',
        canEdit: true,
      },
    ],
    platforms: ['iOS', 'Android', 'Web'],
    goals: 'Engage telecom subscribers with personalized offers and plan upgrade stories',
    tags: ['telecom', 'budget-freeze', 'follow-up-q3'],
    website: 'https://zain.com',
    completedRequirements: ['demo_completed', 'decision_maker'],
  },
];
