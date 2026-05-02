export type TicketStatus = 'Open' | 'Pending' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketChannel = 'Email' | 'WhatsApp' | 'Live Chat';

export interface TicketMessage {
  id: string;
  sender: string;
  senderType: 'customer' | 'agent';
  content: string;
  timestamp: string;
}

export interface InternalNote {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  companyId: string;
  companyName: string;
  companyPlan: 'Starter' | 'Pro' | 'Business' | 'Enterprise';
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  channel: TicketChannel;
  assignedTo: string | null;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  messages: TicketMessage[];
  internalNotes: InternalNote[];
  tags: string[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
}

export const AGENT_LIST: Agent[] = [
  { id: 'agent_1', name: 'Khalid Al-Rashidi', role: 'Support Agent' },
  { id: 'agent_2', name: 'Dina Yousef', role: 'Support Agent' },
  { id: 'agent_3', name: 'Omar Khalid', role: 'Ops Manager' },
  { id: 'agent_4', name: 'Nour Al-Zahrawi', role: 'Content Manager' },
  { id: 'agent_5', name: 'Sara Bin Nasser', role: 'Finance Officer' },
];

export const ALL_STATUSES: TicketStatus[] = ['Open', 'Pending', 'Resolved', 'Closed'];
export const ALL_PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
export const ALL_CHANNELS: TicketChannel[] = ['Email', 'WhatsApp', 'Live Chat'];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'tkt_1',
    ticketNumber: 'TKT-2026-001',
    companyId: 'co_1',
    companyName: 'Noon Digital',
    companyPlan: 'Enterprise',
    subject: 'Story widget not loading on iOS 17',
    description:
      'Our story widget stops rendering after the iOS 17.4 update. Affects all users on iPhone 14 and 15 models.',
    status: 'Open',
    priority: 'Urgent',
    channel: 'Email',
    assignedTo: 'Khalid Al-Rashidi',
    contactEmail: 'tech@noon.com',
    createdAt: '2026-04-10T06:20:00Z',
    updatedAt: '2026-04-11T14:30:00Z',
    resolvedAt: null,
    messages: [
      {
        id: 'msg_1_1',
        sender: 'Rami Hassan',
        senderType: 'customer',
        content:
          'Hi, our story widget is completely broken on iOS 17. We pushed an update yesterday and now users on iPhone 14/15 see a blank white screen instead of stories. This is urgent — we have an active campaign running.',
        timestamp: '2026-04-10T06:20:00Z',
      },
      {
        id: 'msg_1_2',
        sender: 'Khalid Al-Rashidi',
        senderType: 'agent',
        content:
          "Hello Rami, I've escalated this to our engineering team. Could you share your widget SDK version and the app bundle ID? Also, does the issue occur in TestFlight builds or only production?",
        timestamp: '2026-04-10T09:15:00Z',
      },
      {
        id: 'msg_1_3',
        sender: 'Rami Hassan',
        senderType: 'customer',
        content:
          "SDK version 3.2.1, bundle ID com.noon.app. Happens in both TestFlight and production. I've attached the crash logs to this email thread.",
        timestamp: '2026-04-10T10:40:00Z',
      },
      {
        id: 'msg_1_4',
        sender: 'Khalid Al-Rashidi',
        senderType: 'agent',
        content:
          "Got the logs, thank you. Our team identified a WKWebView rendering regression. We're preparing hotfix 3.2.2, ETA 4 hours. I'll keep you posted.",
        timestamp: '2026-04-11T14:30:00Z',
      },
    ],
    internalNotes: [
      {
        id: 'note_1_1',
        author: 'Omar Khalid',
        content:
          'Engineering confirmed regression in WKWebView on iOS 17.4. Hotfix branch created. Priority escalated.',
        timestamp: '2026-04-11T11:00:00Z',
      },
    ],
    tags: ['iOS', 'widget', 'urgent', 'bug'],
  },
  {
    id: 'tkt_2',
    ticketNumber: 'TKT-2026-002',
    companyId: 'co_2',
    companyName: 'STC Pay',
    companyPlan: 'Enterprise',
    subject: 'API rate limit errors on story publish endpoint',
    description:
      'We are hitting 429 errors when publishing more than 20 stories per minute via the API.',
    status: 'Open',
    priority: 'High',
    channel: 'WhatsApp',
    assignedTo: 'Omar Khalid',
    contactEmail: 'integrations@stcpay.com.sa',
    createdAt: '2026-04-12T07:10:00Z',
    updatedAt: '2026-04-12T08:45:00Z',
    resolvedAt: null,
    messages: [
      {
        id: 'msg_2_1',
        sender: 'Faisal Almadani',
        senderType: 'customer',
        content:
          'Good morning. We have an automated pipeline that publishes stories in bulk and we keep getting HTTP 429 responses. Our current tier should support higher limits.',
        timestamp: '2026-04-12T07:10:00Z',
      },
      {
        id: 'msg_2_2',
        sender: 'Omar Khalid',
        senderType: 'agent',
        content:
          'Hi Faisal, good morning. I can see your account is on Enterprise. Let me check your current rate limit configuration. Can you share which API endpoint specifically and the approximate request pattern?',
        timestamp: '2026-04-12T08:45:00Z',
      },
    ],
    internalNotes: [],
    tags: ['API', 'rate-limit', 'enterprise'],
  },
  {
    id: 'tkt_3',
    ticketNumber: 'TKT-2026-003',
    companyId: 'co_3',
    companyName: 'Aramco Digital',
    companyPlan: 'Enterprise',
    subject: 'Request to increase monthly story limit',
    description: 'Current limit of 500 stories/month is insufficient. Need to upgrade to 2000.',
    status: 'Pending',
    priority: 'Medium',
    channel: 'Email',
    assignedTo: 'Dina Yousef',
    contactEmail: 'digital@aramco.com',
    createdAt: '2026-04-11T11:00:00Z',
    updatedAt: '2026-04-11T15:20:00Z',
    resolvedAt: null,
    messages: [
      {
        id: 'msg_3_1',
        sender: 'Tariq Al-Saud',
        senderType: 'customer',
        content:
          "We're approaching our monthly story limit of 500 with two weeks still to go. We need this increased to at least 2000. Please advise on pricing.",
        timestamp: '2026-04-11T11:00:00Z',
      },
      {
        id: 'msg_3_2',
        sender: 'Dina Yousef',
        senderType: 'agent',
        content:
          "Hi Tariq, I've forwarded your request to our account team. They'll reach out within one business day with a custom Enterprise add-on pricing proposal.",
        timestamp: '2026-04-11T15:20:00Z',
      },
    ],
    internalNotes: [
      {
        id: 'note_3_1',
        author: 'Dina Yousef',
        content:
          'Forwarded to Sara for billing quote. Waiting on pricing approval from management.',
        timestamp: '2026-04-11T15:25:00Z',
      },
    ],
    tags: ['billing', 'upgrade', 'limits'],
  },
  {
    id: 'tkt_4',
    ticketNumber: 'TKT-2026-004',
    companyId: 'co_4',
    companyName: 'Careem Technologies',
    companyPlan: 'Business',
    subject: 'Invoice amount does not match contract',
    description:
      'April invoice shows $1,200 but our contract specifies $950/month for Business plan.',
    status: 'Open',
    priority: 'High',
    channel: 'Live Chat',
    assignedTo: 'Sara Bin Nasser',
    contactEmail: 'finance@careem.com',
    createdAt: '2026-04-12T09:30:00Z',
    updatedAt: '2026-04-12T10:00:00Z',
    resolvedAt: null,
    messages: [
      {
        id: 'msg_4_1',
        sender: 'Laila Mourad',
        senderType: 'customer',
        content:
          "Hi, I'm disputing invoice #INV-2026-0412. We're on the Business plan at $950/month but you've charged $1,200. Can you review and issue a corrected invoice?",
        timestamp: '2026-04-12T09:30:00Z',
      },
      {
        id: 'msg_4_2',
        sender: 'Sara Bin Nasser',
        senderType: 'agent',
        content:
          "Hi Laila, I'm sorry for the confusion. I'm pulling up your account now. The $250 difference may be from an add-on that was auto-renewed. I'll investigate and get back to you within the hour.",
        timestamp: '2026-04-12T10:00:00Z',
      },
    ],
    internalNotes: [
      {
        id: 'note_4_1',
        author: 'Sara Bin Nasser',
        content:
          'The overage is from extra story slots added in March. Need to check if customer was notified. Will issue credit if not.',
        timestamp: '2026-04-12T10:05:00Z',
      },
    ],
    tags: ['billing', 'invoice', 'dispute'],
  },
  {
    id: 'tkt_5',
    ticketNumber: 'TKT-2026-005',
    companyId: 'co_5',
    companyName: 'Jahez International',
    companyPlan: 'Business',
    subject: 'Custom Arabic font not rendering in stories',
    description: 'Uploaded a custom Arabic font (Noto Naskh Arabic) but it displays as fallback.',
    status: 'Pending',
    priority: 'Low',
    channel: 'Email',
    assignedTo: 'Khalid Al-Rashidi',
    contactEmail: 'product@jahez.net',
    createdAt: '2026-04-10T13:00:00Z',
    updatedAt: '2026-04-11T09:00:00Z',
    resolvedAt: null,
    messages: [
      {
        id: 'msg_5_1',
        sender: 'Nadia Al-Otaibi',
        senderType: 'customer',
        content:
          'We uploaded the Noto Naskh Arabic TTF font via the Studio but all stories still show the default font. This breaks our brand guidelines for Arabic content.',
        timestamp: '2026-04-10T13:00:00Z',
      },
      {
        id: 'msg_5_2',
        sender: 'Khalid Al-Rashidi',
        senderType: 'agent',
        content:
          'Hi Nadia, custom font loading for Arabic requires the OTF format for best compatibility. Could you re-upload the font in OTF? Also, are you applying the font at the story group level or per-slide?',
        timestamp: '2026-04-10T16:45:00Z',
      },
      {
        id: 'msg_5_3',
        sender: 'Nadia Al-Otaibi',
        senderType: 'customer',
        content:
          'We only have TTF. Can you convert it on your end? We applied it at the group level.',
        timestamp: '2026-04-11T09:00:00Z',
      },
    ],
    internalNotes: [],
    tags: ['fonts', 'Arabic', 'Studio'],
  },
  {
    id: 'tkt_6',
    ticketNumber: 'TKT-2026-006',
    companyId: 'co_6',
    companyName: 'Kitopi',
    companyPlan: 'Pro',
    subject: 'Analytics dashboard showing zero impressions',
    description: 'Analytics have shown 0 impressions for 3 days despite active story groups.',
    status: 'Open',
    priority: 'Urgent',
    channel: 'WhatsApp',
    assignedTo: null,
    contactEmail: 'growth@kitopi.com',
    createdAt: '2026-04-09T08:00:00Z',
    updatedAt: '2026-04-09T08:00:00Z',
    resolvedAt: null,
    messages: [
      {
        id: 'msg_6_1',
        sender: 'Ahmed Ziad',
        senderType: 'customer',
        content:
          'Our analytics have shown exactly 0 impressions for the last 72 hours. Stories are live and we can see them in the app, so the tracking must be broken. This is critical for our reporting.',
        timestamp: '2026-04-09T08:00:00Z',
      },
    ],
    internalNotes: [
      {
        id: 'note_6_1',
        author: 'Omar Khalid',
        content:
          'UNASSIGNED — needs immediate pickup. Analytics ingestion pipeline was redeployed on April 9. Possible event drop.',
        timestamp: '2026-04-09T10:00:00Z',
      },
    ],
    tags: ['analytics', 'tracking', 'data-loss'],
  },
  {
    id: 'tkt_7',
    ticketNumber: 'TKT-2026-007',
    companyId: 'co_7',
    companyName: 'Namshi',
    companyPlan: 'Pro',
    subject: 'Story draft not saving after session timeout',
    description: 'When the Studio session times out, draft changes are lost on re-login.',
    status: 'Pending',
    priority: 'Medium',
    channel: 'Email',
    assignedTo: 'Dina Yousef',
    contactEmail: 'content@namshi.com',
    createdAt: '2026-04-11T14:00:00Z',
    updatedAt: '2026-04-12T08:00:00Z',
    resolvedAt: null,
    messages: [
      {
        id: 'msg_7_1',
        sender: 'Sara Abou Ali',
        senderType: 'customer',
        content:
          "Our content team loses work regularly because the auto-save doesn't persist when the session expires. We'd expect drafts to be saved server-side. Is this a known issue?",
        timestamp: '2026-04-11T14:00:00Z',
      },
      {
        id: 'msg_7_2',
        sender: 'Dina Yousef',
        senderType: 'agent',
        content:
          'Hi Sara, this is a known limitation with the current Studio version. Auto-save syncs every 30 seconds, but the session token expiry can interrupt the final save. We have a fix in the next release (v4.1). Expected rollout April 20th.',
        timestamp: '2026-04-12T08:00:00Z',
      },
    ],
    internalNotes: [],
    tags: ['Studio', 'auto-save', 'session'],
  },
  {
    id: 'tkt_8',
    ticketNumber: 'TKT-2026-008',
    companyId: 'co_8',
    companyName: 'Fetchr',
    companyPlan: 'Starter',
    subject: 'Request for API documentation access',
    description: 'Need access to the REST API docs for custom widget integration.',
    status: 'Open',
    priority: 'Low',
    channel: 'Email',
    assignedTo: null,
    contactEmail: 'dev@fetchr.us',
    createdAt: '2026-04-12T06:00:00Z',
    updatedAt: '2026-04-12T06:00:00Z',
    resolvedAt: null,
    messages: [
      {
        id: 'msg_8_1',
        sender: 'Karim Nader',
        senderType: 'customer',
        content:
          "Hello, we're on the Starter plan and trying to integrate Hikayat into our custom React Native app. The developer portal link seems to be behind an upgrade gate. Can you share the API docs directly?",
        timestamp: '2026-04-12T06:00:00Z',
      },
    ],
    internalNotes: [],
    tags: ['API', 'documentation', 'Starter'],
  },
  {
    id: 'tkt_9',
    ticketNumber: 'TKT-2026-009',
    companyId: 'co_9',
    companyName: 'Tamatem Games',
    companyPlan: 'Business',
    subject: 'CTR dropped by 60% after story group reorder',
    description: 'Reordering story groups caused a significant drop in click-through rate.',
    status: 'Resolved',
    priority: 'High',
    channel: 'Live Chat',
    assignedTo: 'Omar Khalid',
    contactEmail: 'marketing@tamatem.co',
    createdAt: '2026-04-08T10:00:00Z',
    updatedAt: '2026-04-09T16:00:00Z',
    resolvedAt: '2026-04-09T16:00:00Z',
    messages: [
      {
        id: 'msg_9_1',
        sender: 'Lama Khalidi',
        senderType: 'customer',
        content:
          'After we reordered our story groups yesterday, our CTR fell from 8.2% to 3.1%. Nothing else changed. Can you help investigate?',
        timestamp: '2026-04-08T10:00:00Z',
      },
      {
        id: 'msg_9_2',
        sender: 'Omar Khalid',
        senderType: 'agent',
        content:
          "Hi Lama, I reviewed your placement config. The first group slot has a significantly higher CTR due to screen placement. Your top-performing group (Summer Sale) was moved to position 4. I'd recommend reverting it to position 1.",
        timestamp: '2026-04-08T14:00:00Z',
      },
      {
        id: 'msg_9_3',
        sender: 'Lama Khalidi',
        senderType: 'customer',
        content: 'That makes sense! We reverted and CTR is back to 7.9%. Thank you so much!',
        timestamp: '2026-04-09T10:00:00Z',
      },
      {
        id: 'msg_9_4',
        sender: 'Omar Khalid',
        senderType: 'agent',
        content:
          "Great to hear! I've added a placement guide article to your knowledge base. Marking this as resolved.",
        timestamp: '2026-04-09T16:00:00Z',
      },
    ],
    internalNotes: [],
    tags: ['analytics', 'CTR', 'placement'],
  },
  {
    id: 'tkt_10',
    ticketNumber: 'TKT-2026-010',
    companyId: 'co_10',
    companyName: 'Anghami',
    companyPlan: 'Business',
    subject: 'Team invite link expired before use',
    description: 'New team member received an invite but it expired before they could register.',
    status: 'Resolved',
    priority: 'Low',
    channel: 'Email',
    assignedTo: 'Dina Yousef',
    contactEmail: 'ops@anghami.com',
    createdAt: '2026-04-07T09:00:00Z',
    updatedAt: '2026-04-07T11:30:00Z',
    resolvedAt: '2026-04-07T11:30:00Z',
    messages: [
      {
        id: 'msg_10_1',
        sender: 'Mariam Abi Nader',
        senderType: 'customer',
        content:
          'We sent a team invite to our new content manager but she says the link has expired. It was only sent 3 days ago. Can you re-send or extend the expiry?',
        timestamp: '2026-04-07T09:00:00Z',
      },
      {
        id: 'msg_10_2',
        sender: 'Dina Yousef',
        senderType: 'agent',
        content:
          "Hi Mariam, invite links expire after 48 hours for security. I've reset and re-sent the invite to the same email address. She should receive it within 5 minutes.",
        timestamp: '2026-04-07T11:30:00Z',
      },
    ],
    internalNotes: [],
    tags: ['team', 'invite', 'access'],
  },
  {
    id: 'tkt_11',
    ticketNumber: 'TKT-2026-011',
    companyId: 'co_1',
    companyName: 'Noon Digital',
    companyPlan: 'Enterprise',
    subject: 'WhatsApp channel integration setup assistance',
    description: 'Need help connecting the WhatsApp Business API to Hikayat story triggers.',
    status: 'Resolved',
    priority: 'Medium',
    channel: 'WhatsApp',
    assignedTo: 'Khalid Al-Rashidi',
    contactEmail: 'integrations@noon.com',
    createdAt: '2026-04-05T12:00:00Z',
    updatedAt: '2026-04-12T10:00:00Z',
    resolvedAt: '2026-04-12T10:00:00Z',
    messages: [
      {
        id: 'msg_11_1',
        sender: 'Youssef Mansour',
        senderType: 'customer',
        content:
          "We want to trigger story displays when users send specific WhatsApp keywords. Our tech team has the WhatsApp Business API set up but isn't sure how to hook it into Hikayat webhooks.",
        timestamp: '2026-04-05T12:00:00Z',
      },
      {
        id: 'msg_11_2',
        sender: 'Khalid Al-Rashidi',
        senderType: 'agent',
        content:
          "I've shared our webhook integration guide and a sample payload schema for WhatsApp triggers. I'll also schedule a 30-minute technical call tomorrow if needed.",
        timestamp: '2026-04-06T09:00:00Z',
      },
      {
        id: 'msg_11_3',
        sender: 'Youssef Mansour',
        senderType: 'customer',
        content: 'The guide was very clear! We got it working. The webhook fires correctly now.',
        timestamp: '2026-04-12T09:30:00Z',
      },
      {
        id: 'msg_11_4',
        sender: 'Khalid Al-Rashidi',
        senderType: 'agent',
        content: 'Fantastic! Marking this resolved. Let us know if you need further assistance.',
        timestamp: '2026-04-12T10:00:00Z',
      },
    ],
    internalNotes: [],
    tags: ['WhatsApp', 'integration', 'webhook'],
  },
  {
    id: 'tkt_12',
    ticketNumber: 'TKT-2026-012',
    companyId: 'co_2',
    companyName: 'STC Pay',
    companyPlan: 'Enterprise',
    subject: 'Stories not visible in production app build',
    description:
      'Stories display in dev but not in production build. Likely a certificate or config issue.',
    status: 'Closed',
    priority: 'High',
    channel: 'Live Chat',
    assignedTo: 'Omar Khalid',
    contactEmail: 'mobile@stcpay.com.sa',
    createdAt: '2026-04-01T08:00:00Z',
    updatedAt: '2026-04-03T14:00:00Z',
    resolvedAt: '2026-04-03T14:00:00Z',
    messages: [
      {
        id: 'msg_12_1',
        sender: 'Abdulrahman Al-Dosari',
        senderType: 'customer',
        content:
          "Stories work perfectly in our debug build but the production build (signed with distribution certificate) shows nothing. App doesn't crash, just blank where stories should appear.",
        timestamp: '2026-04-01T08:00:00Z',
      },
      {
        id: 'msg_12_2',
        sender: 'Omar Khalid',
        senderType: 'agent',
        content:
          "This is typically caused by SSL pinning in production builds blocking our CDN. Could you check if your network security config explicitly pins certificates? If so, you'll need to add *.hikayat.io to your allowlist.",
        timestamp: '2026-04-01T11:00:00Z',
      },
      {
        id: 'msg_12_3',
        sender: 'Abdulrahman Al-Dosari',
        senderType: 'customer',
        content: 'That was exactly it. Added hikayat.io to the allowlist and everything works now.',
        timestamp: '2026-04-03T13:45:00Z',
      },
    ],
    internalNotes: [],
    tags: ['mobile', 'SSL', 'production', 'Android'],
  },
  {
    id: 'tkt_13',
    ticketNumber: 'TKT-2026-013',
    companyId: 'co_3',
    companyName: 'Aramco Digital',
    companyPlan: 'Enterprise',
    subject: 'Onboarding assistance for new marketing team',
    description: 'New 8-person marketing team needs onboarding sessions on Studio and Analytics.',
    status: 'Closed',
    priority: 'Low',
    channel: 'Email',
    assignedTo: 'Nour Al-Zahrawi',
    contactEmail: 'marketing@aramco.com',
    createdAt: '2026-03-28T10:00:00Z',
    updatedAt: '2026-04-04T16:00:00Z',
    resolvedAt: '2026-04-04T16:00:00Z',
    messages: [
      {
        id: 'msg_13_1',
        sender: 'Dana Al-Farsi',
        senderType: 'customer',
        content:
          "We've onboarded a new marketing team of 8 people. Could you arrange training sessions for Hikayat Studio and the Analytics dashboard?",
        timestamp: '2026-03-28T10:00:00Z',
      },
      {
        id: 'msg_13_2',
        sender: 'Nour Al-Zahrawi',
        senderType: 'agent',
        content:
          'Absolutely! I can schedule two 90-minute sessions. Session 1: Studio basics. Session 2: Analytics deep dive. Do any of the following slots work: April 1st 10am or April 2nd 2pm (GST)?',
        timestamp: '2026-03-28T14:00:00Z',
      },
      {
        id: 'msg_13_3',
        sender: 'Dana Al-Farsi',
        senderType: 'customer',
        content: 'April 1st 10am works great. Thank you!',
        timestamp: '2026-03-29T09:00:00Z',
      },
      {
        id: 'msg_13_4',
        sender: 'Nour Al-Zahrawi',
        senderType: 'agent',
        content:
          "Both sessions are completed. I've shared the recording links and resource pack. Closing this ticket. Please reach out anytime!",
        timestamp: '2026-04-04T16:00:00Z',
      },
    ],
    internalNotes: [
      {
        id: 'note_13_1',
        author: 'Nour Al-Zahrawi',
        content:
          'Enterprise account — provide white-glove service. They may upgrade to managed plan.',
        timestamp: '2026-03-28T14:05:00Z',
      },
    ],
    tags: ['onboarding', 'training', 'enterprise'],
  },
  {
    id: 'tkt_14',
    ticketNumber: 'TKT-2026-014',
    companyId: 'co_4',
    companyName: 'Careem Technologies',
    companyPlan: 'Business',
    subject: 'GDPR data export request for EU users',
    description: 'Legal team requires full data export of story interaction data for EU users.',
    status: 'Resolved',
    priority: 'Medium',
    channel: 'Email',
    assignedTo: 'Sara Bin Nasser',
    contactEmail: 'legal@careem.com',
    createdAt: '2026-04-06T11:00:00Z',
    updatedAt: '2026-04-12T09:00:00Z',
    resolvedAt: '2026-04-12T09:00:00Z',
    messages: [
      {
        id: 'msg_14_1',
        sender: 'Hind Al-Marzouqi',
        senderType: 'customer',
        content:
          'Our legal team is requesting a full GDPR-compliant data export covering story interaction events for EU-based users from Jan 1 to Mar 31, 2026. Deadline is April 15.',
        timestamp: '2026-04-06T11:00:00Z',
      },
      {
        id: 'msg_14_2',
        sender: 'Sara Bin Nasser',
        senderType: 'agent',
        content:
          "Understood. I've submitted the data export request to our DPO. You'll receive a signed export manifest and the encrypted CSV within 3 business days. I'll follow up with tracking.",
        timestamp: '2026-04-07T09:00:00Z',
      },
      {
        id: 'msg_14_3',
        sender: 'Sara Bin Nasser',
        senderType: 'agent',
        content:
          'The data export is ready. I have sent the encrypted file and decryption key to your DPO email. Please confirm receipt.',
        timestamp: '2026-04-12T09:00:00Z',
      },
    ],
    internalNotes: [
      {
        id: 'note_14_1',
        author: 'Sara Bin Nasser',
        content:
          'Coordinating with DPO team. Export includes user_id, event_type, timestamps only — no PII beyond what customer already holds.',
        timestamp: '2026-04-07T09:05:00Z',
      },
    ],
    tags: ['GDPR', 'data-export', 'legal', 'compliance'],
  },
  {
    id: 'tkt_15',
    ticketNumber: 'TKT-2026-015',
    companyId: 'co_6',
    companyName: 'Kitopi',
    companyPlan: 'Pro',
    subject: 'Interested in upgrading to Enterprise plan',
    description: 'Account is growing rapidly. Want to discuss Enterprise features and pricing.',
    status: 'Pending',
    priority: 'Low',
    channel: 'Live Chat',
    assignedTo: 'Nour Al-Zahrawi',
    contactEmail: 'ceo@kitopi.com',
    createdAt: '2026-04-11T16:00:00Z',
    updatedAt: '2026-04-11T16:30:00Z',
    resolvedAt: null,
    messages: [
      {
        id: 'msg_15_1',
        sender: 'Mohamad Ballout',
        senderType: 'customer',
        content:
          "Hi, we're hitting the Pro plan limits consistently. Can you tell me more about what Enterprise includes and book a demo?",
        timestamp: '2026-04-11T16:00:00Z',
      },
      {
        id: 'msg_15_2',
        sender: 'Nour Al-Zahrawi',
        senderType: 'agent',
        content:
          "Hi Mohamad! Excited to hear Kitopi is growing so fast. I've forwarded your details to our Enterprise sales team. They'll send a personalized proposal within 24 hours.",
        timestamp: '2026-04-11T16:30:00Z',
      },
    ],
    internalNotes: [
      {
        id: 'note_15_1',
        author: 'Nour Al-Zahrawi',
        content: 'High-value upsell opportunity. Loop in sales. MRR potential: ~$2,400/month.',
        timestamp: '2026-04-11T16:35:00Z',
      },
    ],
    tags: ['sales', 'upgrade', 'enterprise-prospect'],
  },
];
