import type {
  StoryGroup,
  Story,
  Widget,
  KPIMetric,
  ChartDataPoint,
  AnalyticsData,
  ActivityItem,
  TeamMember,
  BillingPlan,
  PaymentMethod,
  Invoice,
} from './types';

// ─── Widgets ─────────────────────────────────────────────────────────────────

export const widgets: Widget[] = [
  {
    id: 'widget-1',
    name: 'Default App',
    platform: 'ios',
    appName: 'MAISON',
    appIcon: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=80&h=80&fit=crop',
    token: 'shk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    createdAt: '2025-11-15T10:00:00Z',
  },
  {
    id: 'widget-2',
    name: 'Website Widget',
    platform: 'web',
    appName: 'MAISON Web',
    appIcon: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=80&h=80&fit=crop',
    token: 'shk_live_q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
    createdAt: '2025-12-03T14:30:00Z',
  },
];

// ─── Stories ─────────────────────────────────────────────────────────────────

const springCollectionStories: Story[] = [
  {
    id: 'story-101',
    title: 'Linen Tailoring — Editorial',
    thumbnail:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=711&fit=crop&crop=top',
    videoUrl: 'https://videos.pexels.com/video-files/4625518/4625518-uhd_1440_2560_30fps.mp4',
    status: 'active',
    type: 'video',
    interactiveComponents: [
      { id: 'ic-1', type: 'cta', config: { text: 'Shop the Look', url: '/spring' } },
    ],
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-28T11:00:00Z',
  },
  {
    id: 'story-102',
    title: 'Pastel Palette Lookbook',
    thumbnail:
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=711&fit=crop&crop=top',
    status: 'active',
    type: 'image',
    interactiveComponents: [
      { id: 'ic-2', type: 'swipe', config: { direction: 'up', url: '/collection' } },
    ],
    createdAt: '2026-02-01T09:30:00Z',
    updatedAt: '2026-02-28T11:00:00Z',
  },
  {
    id: 'story-103',
    title: 'Behind the Seams',
    thumbnail:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=711&fit=crop&crop=top',
    videoUrl: 'https://videos.pexels.com/video-files/4625518/4625518-uhd_1440_2560_30fps.mp4',
    status: 'active',
    type: 'video',
    interactiveComponents: [
      { id: 'ic-3', type: 'countdown', config: { endDate: '2026-03-15T00:00:00Z' } },
      { id: 'ic-4', type: 'cta', config: { text: 'Pre-Order', url: '/preorder' } },
    ],
    createdAt: '2026-02-05T14:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'story-104',
    title: 'Botanical Print Close-up',
    thumbnail:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=711&fit=crop&crop=top',
    status: 'active',
    type: 'image',
    interactiveComponents: [],
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-28T11:00:00Z',
  },
];

const streetwearDropStories: Story[] = [
  {
    id: 'story-201',
    title: 'Oversized Silhouettes',
    thumbnail:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=711&fit=crop&crop=top',
    status: 'active',
    type: 'image',
    interactiveComponents: [
      { id: 'ic-5', type: 'cta', config: { text: 'View Drop', url: '/streetwear' } },
    ],
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'story-202',
    title: 'Studio Session BTS',
    thumbnail:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=711&fit=crop&crop=top',
    status: 'active',
    type: 'video',
    interactiveComponents: [],
    createdAt: '2026-02-26T11:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'story-203',
    title: 'Limited to 200 Pieces',
    thumbnail:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=711&fit=crop&crop=top',
    status: 'active',
    type: 'image',
    interactiveComponents: [
      { id: 'ic-6', type: 'countdown', config: { endDate: '2026-03-10T00:00:00Z' } },
    ],
    createdAt: '2026-02-27T15:00:00Z',
    updatedAt: '2026-03-02T08:00:00Z',
  },
];

const stylePollStories: Story[] = [
  {
    id: 'story-301',
    title: 'Pick Your Favourite Look',
    thumbnail:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=711&fit=crop&crop=top',
    status: 'active',
    type: 'image',
    interactiveComponents: [
      {
        id: 'ic-7',
        type: 'poll',
        config: {
          question: 'Which outfit wins?',
          options: ['Minimal Tailored', 'Bold Streetwear', 'Classic Monochrome', 'Relaxed Linen'],
        },
      },
    ],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-20T14:00:00Z',
  },
  {
    id: 'story-302',
    title: 'What Should We Design Next?',
    thumbnail:
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=711&fit=crop&crop=top',
    status: 'active',
    type: 'image',
    interactiveComponents: [
      {
        id: 'ic-8',
        type: 'quiz',
        config: {
          question: 'Which category excites you most?',
          options: ['Outerwear', 'Knitwear', 'Denim', 'Accessories'],
        },
      },
    ],
    createdAt: '2026-01-16T11:00:00Z',
    updatedAt: '2026-02-20T14:00:00Z',
  },
  {
    id: 'story-303',
    title: 'Rate This Season',
    thumbnail:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=711&fit=crop&crop=top',
    status: 'active',
    type: 'image',
    interactiveComponents: [
      {
        id: 'ic-9',
        type: 'emoji',
        config: { question: 'How do you feel about our new line?', scale: 5 },
      },
    ],
    createdAt: '2026-01-17T09:00:00Z',
    updatedAt: '2026-02-20T14:00:00Z',
  },
  {
    id: 'story-304',
    title: 'Packaging Feedback',
    thumbnail:
      'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=711&fit=crop&crop=center',
    status: 'archived',
    type: 'image',
    interactiveComponents: [
      {
        id: 'ic-10',
        type: 'poll',
        config: {
          question: 'Unboxing experience?',
          options: ['Loved it', 'It was fine', 'Needs work'],
        },
      },
    ],
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-02-15T12:00:00Z',
  },
];

const accessoriesStories: Story[] = [
  {
    id: 'story-401',
    title: 'Leather Goods — Hero Shot',
    thumbnail:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=711&fit=crop&crop=center',
    status: 'active',
    type: 'video',
    interactiveComponents: [],
    createdAt: '2026-02-20T08:00:00Z',
    updatedAt: '2026-02-28T10:00:00Z',
  },
  {
    id: 'story-402',
    title: 'Sunglasses Edit',
    thumbnail:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=711&fit=crop&crop=center',
    status: 'active',
    type: 'image',
    interactiveComponents: [
      { id: 'ic-11', type: 'cta', config: { text: 'Shop Eyewear', url: '/accessories' } },
    ],
    createdAt: '2026-02-21T09:00:00Z',
    updatedAt: '2026-02-28T10:00:00Z',
  },
  {
    id: 'story-403',
    title: 'Jewellery Flat Lay',
    thumbnail:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=711&fit=crop&crop=center',
    status: 'active',
    type: 'image',
    interactiveComponents: [
      { id: 'ic-12', type: 'swipe', config: { direction: 'up', url: '/jewellery' } },
    ],
    createdAt: '2026-02-22T11:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'story-404',
    title: 'Handbag Detail Close-up',
    thumbnail:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=711&fit=crop&crop=center',
    status: 'active',
    type: 'image',
    interactiveComponents: [],
    createdAt: '2026-02-23T14:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'story-405',
    title: 'Watch Collection Reveal',
    thumbnail:
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=711&fit=crop&crop=center',
    status: 'active',
    type: 'video',
    interactiveComponents: [
      {
        id: 'ic-13',
        type: 'poll',
        config: {
          question: 'Which finish do you prefer?',
          options: ['Silver', 'Gold', 'Rose Gold'],
        },
      },
    ],
    createdAt: '2026-02-24T10:00:00Z',
    updatedAt: '2026-03-02T11:00:00Z',
  },
];

const endOfSeasonStories: Story[] = [
  {
    id: 'story-501',
    title: 'Up to 60% Off — Outerwear',
    thumbnail:
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=711&fit=crop&crop=top',
    status: 'archived',
    type: 'image',
    interactiveComponents: [
      { id: 'ic-14', type: 'countdown', config: { endDate: '2026-02-14T00:00:00Z' } },
      { id: 'ic-15', type: 'cta', config: { text: 'Shop Sale', url: '/sale' } },
    ],
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-14T00:00:00Z',
  },
  {
    id: 'story-502',
    title: 'Final Reductions — Knitwear',
    thumbnail:
      'https://images.unsplash.com/photo-1434389677669-e08b4cda3a30?w=400&h=711&fit=crop&crop=top',
    status: 'archived',
    type: 'image',
    interactiveComponents: [],
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-14T00:00:00Z',
  },
  {
    id: 'story-503',
    title: 'Last Pieces — Denim',
    thumbnail:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=711&fit=crop&crop=center',
    status: 'archived',
    type: 'video',
    interactiveComponents: [
      { id: 'ic-16', type: 'cta', config: { text: 'Browse Denim', url: '/denim' } },
    ],
    createdAt: '2026-02-11T10:00:00Z',
    updatedAt: '2026-02-14T00:00:00Z',
  },
];

const lookbookStories: Story[] = [
  {
    id: 'story-601',
    title: 'How to Style Oversized Blazers',
    thumbnail:
      'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=400&h=711&fit=crop&crop=top',
    status: 'active',
    type: 'video',
    interactiveComponents: [],
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'story-602',
    title: '5 Ways to Wear White',
    thumbnail:
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400&h=711&fit=crop&crop=top',
    status: 'active',
    type: 'video',
    interactiveComponents: [
      { id: 'ic-17', type: 'cta', config: { text: 'Shop Whites', url: '/whites' } },
    ],
    createdAt: '2026-01-06T11:00:00Z',
    updatedAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'story-603',
    title: 'Capsule Wardrobe Guide',
    thumbnail:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=711&fit=crop&crop=top',
    status: 'active',
    type: 'image',
    interactiveComponents: [
      {
        id: 'ic-18',
        type: 'quiz',
        config: { question: 'Was this helpful?', options: ['Yes', 'No', 'Want more'] },
      },
    ],
    createdAt: '2026-01-07T09:30:00Z',
    updatedAt: '2026-02-01T09:00:00Z',
  },
];

// ─── Story Groups ────────────────────────────────────────────────────────────

export const storyGroups: StoryGroup[] = [
  {
    id: 'sg-1',
    title: "Spring Collection '26",
    coverImage:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&h=200&fit=crop&crop=face',
    status: 'active',
    storiesCount: 4,
    stories: springCollectionStories,
    audience: 'none',
    labels: [],
    widgetIds: ['widget-1', 'widget-2'],
    schedule: { start: '2026-02-01T00:00:00Z', end: '2026-04-30T23:59:59Z' },
    isPinned: true,
    isSponsored: false,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-03-05T14:30:00Z',
  },
  {
    id: 'sg-2',
    title: 'Limited Drop: Streetwear',
    coverImage:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop&crop=face',
    status: 'active',
    storiesCount: 3,
    stories: streetwearDropStories,
    audience: 'labels',
    labels: ['VIP', 'Early Access'],
    widgetIds: ['widget-1', 'widget-2'],
    schedule: { start: '2026-03-01T00:00:00Z', end: '2026-03-31T23:59:59Z' },
    isPinned: false,
    isSponsored: false,
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-03-06T09:15:00Z',
  },
  {
    id: 'sg-3',
    title: 'Style Poll — Vote Now',
    coverImage:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop&crop=face',
    status: 'inactive',
    storiesCount: 4,
    stories: stylePollStories,
    audience: 'custom',
    labels: ['All Customers'],
    widgetIds: ['widget-1'],
    schedule: { start: null, end: null },
    isPinned: false,
    isSponsored: false,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-20T14:00:00Z',
  },
  {
    id: 'sg-4',
    title: 'Flash Sale: Accessories',
    coverImage:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop&crop=center',
    status: 'test',
    storiesCount: 5,
    stories: accessoriesStories,
    audience: 'labels',
    labels: ['Gulf Region', 'Premium'],
    widgetIds: ['widget-1'],
    schedule: { start: '2026-03-10T00:00:00Z', end: '2026-04-09T23:59:59Z' },
    isPinned: false,
    isSponsored: true,
    createdAt: '2026-02-20T08:00:00Z',
    updatedAt: '2026-03-07T16:45:00Z',
  },
  {
    id: 'sg-5',
    title: 'End of Season Sale',
    coverImage:
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&h=200&fit=crop&crop=top',
    status: 'archived',
    storiesCount: 3,
    stories: endOfSeasonStories,
    audience: 'none',
    labels: [],
    widgetIds: ['widget-2'],
    schedule: { start: '2026-02-12T00:00:00Z', end: '2026-02-14T00:00:00Z' },
    isPinned: false,
    isSponsored: false,
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-14T00:05:00Z',
  },
  {
    id: 'sg-6',
    title: 'Styling Lookbook',
    coverImage:
      'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=200&h=200&fit=crop&crop=face',
    status: 'scheduled',
    storiesCount: 3,
    stories: lookbookStories,
    audience: 'labels',
    labels: ['New Customers'],
    widgetIds: ['widget-2'],
    schedule: { start: '2026-03-15T00:00:00Z', end: null },
    isPinned: false,
    isSponsored: false,
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-03-04T11:00:00Z',
  },
];

// ─── KPI Metrics ─────────────────────────────────────────────────────────────

export const kpiMetrics: KPIMetric[] = [
  {
    id: 'engagement-rate',
    label: 'Engagement Rate',
    value: 24.8,
    previousValue: 21.3,
    trend: 'up',
    format: 'percentage',
    description: 'Percentage of users interacting with stories',
  },
  {
    id: 'avg-ctr',
    label: 'Avg CTR',
    value: 8.6,
    previousValue: 9.1,
    trend: 'down',
    format: 'percentage',
    description: 'Average click-through rate across all story groups',
  },
  {
    id: 'avg-response-rate',
    label: 'Avg Response Rate',
    value: 42.3,
    previousValue: 38.7,
    trend: 'up',
    format: 'percentage',
    description: 'Response rate on interactive components',
  },
  {
    id: 'active-users',
    label: 'Active Users',
    value: 18420,
    previousValue: 16850,
    trend: 'up',
    format: 'number',
    description: 'Users who viewed at least one story',
  },
];

// ─── Chart Data (14 days) ────────────────────────────────────────────────────

export const chartData: ChartDataPoint[] = [
  {
    date: '2026-02-23',
    reach: 12400,
    impressions: 28500,
    clicks: 2150,
    activeUsers: 8900,
    eventTracker: 1240,
  },
  {
    date: '2026-02-24',
    reach: 13100,
    impressions: 30200,
    clicks: 2380,
    activeUsers: 9200,
    eventTracker: 1350,
  },
  {
    date: '2026-02-25',
    reach: 11800,
    impressions: 26800,
    clicks: 2050,
    activeUsers: 8600,
    eventTracker: 1180,
  },
  {
    date: '2026-02-26',
    reach: 14200,
    impressions: 32100,
    clicks: 2680,
    activeUsers: 9800,
    eventTracker: 1420,
  },
  {
    date: '2026-02-27',
    reach: 15600,
    impressions: 35400,
    clicks: 2890,
    activeUsers: 10500,
    eventTracker: 1560,
  },
  {
    date: '2026-02-28',
    reach: 16800,
    impressions: 38200,
    clicks: 3150,
    activeUsers: 11200,
    eventTracker: 1680,
  },
  {
    date: '2026-03-01',
    reach: 18200,
    impressions: 41500,
    clicks: 3420,
    activeUsers: 12100,
    eventTracker: 1820,
  },
  {
    date: '2026-03-02',
    reach: 17500,
    impressions: 39800,
    clicks: 3280,
    activeUsers: 11800,
    eventTracker: 1750,
  },
  {
    date: '2026-03-03',
    reach: 19100,
    impressions: 43200,
    clicks: 3610,
    activeUsers: 12800,
    eventTracker: 1910,
  },
  {
    date: '2026-03-04',
    reach: 20400,
    impressions: 46100,
    clicks: 3850,
    activeUsers: 13500,
    eventTracker: 2040,
  },
  {
    date: '2026-03-05',
    reach: 21800,
    impressions: 49500,
    clicks: 4120,
    activeUsers: 14200,
    eventTracker: 2180,
  },
  {
    date: '2026-03-06',
    reach: 23100,
    impressions: 52400,
    clicks: 4380,
    activeUsers: 15100,
    eventTracker: 2310,
  },
  {
    date: '2026-03-07',
    reach: 22400,
    impressions: 50800,
    clicks: 4210,
    activeUsers: 14800,
    eventTracker: 2240,
  },
  {
    date: '2026-03-08',
    reach: 24500,
    impressions: 55200,
    clicks: 4620,
    activeUsers: 16200,
    eventTracker: 2450,
  },
];

// ─── Analytics Data (per Story Group) ────────────────────────────────────────

export const analyticsData: AnalyticsData[] = [
  {
    storyGroupId: 'sg-1',
    reach: 45200,
    impressions: 128400,
    clicks: 11250,
    ctr: 8.76,
    completionRate: 72.4,
    activeUsers: 18420,
    tapForward: 34200,
    tapBackward: 5800,
    avgWatchLength: 4.2,
    shareFromClick: 3.8,
  },
  {
    storyGroupId: 'sg-2',
    reach: 28100,
    impressions: 76500,
    clicks: 6120,
    ctr: 8.0,
    completionRate: 68.9,
    activeUsers: 12300,
    tapForward: 21400,
    tapBackward: 3900,
    avgWatchLength: 3.8,
    shareFromClick: 2.9,
  },
  {
    storyGroupId: 'sg-3',
    reach: 32400,
    impressions: 89200,
    clicks: 8540,
    ctr: 9.57,
    completionRate: 81.2,
    activeUsers: 14800,
    tapForward: 18900,
    tapBackward: 6200,
    avgWatchLength: 5.1,
    shareFromClick: 4.2,
  },
  {
    storyGroupId: 'sg-4',
    reach: 8900,
    impressions: 22100,
    clicks: 1980,
    ctr: 8.96,
    completionRate: 65.3,
    activeUsers: 3200,
    tapForward: 6800,
    tapBackward: 1200,
    avgWatchLength: 3.5,
    shareFromClick: 2.1,
  },
  {
    storyGroupId: 'sg-5',
    reach: 52800,
    impressions: 156200,
    clicks: 14800,
    ctr: 9.47,
    completionRate: 58.6,
    activeUsers: 22100,
    tapForward: 42300,
    tapBackward: 8100,
    avgWatchLength: 2.9,
    shareFromClick: 5.4,
  },
  {
    storyGroupId: 'sg-6',
    reach: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    completionRate: 0,
    activeUsers: 0,
    tapForward: 0,
    tapBackward: 0,
    avgWatchLength: 0,
    shareFromClick: 0,
  },
];

// ─── Recent Activity ─────────────────────────────────────────────────────────

export const recentActivity: ActivityItem[] = [
  {
    id: 'act-1',
    action: 'published',
    targetType: 'story_group',
    targetName: 'Limited Drop: Streetwear',
    userId: 'user-1',
    userName: 'Nadia Karim',
    userAvatar: 'https://i.pravatar.cc/80?img=47',
    timestamp: '2026-03-08T14:30:00Z',
  },
  {
    id: 'act-2',
    action: 'updated',
    targetType: 'story_group',
    targetName: 'Flash Sale: Accessories',
    userId: 'user-2',
    userName: 'Rami Haddad',
    userAvatar: 'https://i.pravatar.cc/80?img=68',
    timestamp: '2026-03-08T11:15:00Z',
  },
  {
    id: 'act-3',
    action: 'created',
    targetType: 'story',
    targetName: 'Watch Collection Reveal',
    userId: 'user-3',
    userName: 'Leyla Amiri',
    userAvatar: 'https://i.pravatar.cc/80?img=5',
    timestamp: '2026-03-07T16:45:00Z',
  },
  {
    id: 'act-4',
    action: 'archived',
    targetType: 'story_group',
    targetName: 'End of Season Sale',
    userId: 'user-1',
    userName: 'Nadia Karim',
    userAvatar: 'https://i.pravatar.cc/80?img=47',
    timestamp: '2026-03-07T10:00:00Z',
  },
  {
    id: 'act-5',
    action: 'duplicated',
    targetType: 'story_group',
    targetName: "Spring Collection '26",
    userId: 'user-2',
    userName: 'Rami Haddad',
    userAvatar: 'https://i.pravatar.cc/80?img=68',
    timestamp: '2026-03-06T15:20:00Z',
  },
  {
    id: 'act-6',
    action: 'scheduled',
    targetType: 'story_group',
    targetName: 'Styling Lookbook',
    userId: 'user-4',
    userName: 'Tariq Nassif',
    userAvatar: 'https://i.pravatar.cc/80?img=52',
    timestamp: '2026-03-06T09:00:00Z',
  },
  {
    id: 'act-7',
    action: 'updated',
    targetType: 'story',
    targetName: 'Limited to 200 Pieces',
    userId: 'user-3',
    userName: 'Leyla Amiri',
    userAvatar: 'https://i.pravatar.cc/80?img=5',
    timestamp: '2026-03-05T14:10:00Z',
  },
  {
    id: 'act-8',
    action: 'created',
    targetType: 'story_group',
    targetName: 'Limited Drop: Streetwear',
    userId: 'user-1',
    userName: 'Nadia Karim',
    userAvatar: 'https://i.pravatar.cc/80?img=47',
    timestamp: '2026-03-04T11:30:00Z',
  },
  {
    id: 'act-9',
    action: 'published',
    targetType: 'story_group',
    targetName: 'Style Poll — Vote Now',
    userId: 'user-2',
    userName: 'Rami Haddad',
    userAvatar: 'https://i.pravatar.cc/80?img=68',
    timestamp: '2026-03-03T16:00:00Z',
  },
  {
    id: 'act-10',
    action: 'deleted',
    targetType: 'story',
    targetName: 'Old Campaign Draft',
    userId: 'user-4',
    userName: 'Tariq Nassif',
    userAvatar: 'https://i.pravatar.cc/80?img=52',
    timestamp: '2026-03-02T13:45:00Z',
  },
];

// ─── Team Members ────────────────────────────────────────────────────────────

export const teamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Nadia Karim',
    email: 'nadia@maison.com',
    avatar: 'https://i.pravatar.cc/80?img=47',
    role: 'owner',
    lastActive: '2026-03-08T14:30:00Z',
    joinedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Rami Haddad',
    email: 'rami@maison.com',
    avatar: 'https://i.pravatar.cc/80?img=68',
    role: 'admin',
    lastActive: '2026-03-08T11:15:00Z',
    joinedAt: '2025-10-15T00:00:00Z',
  },
  {
    id: 'user-3',
    name: 'Leyla Amiri',
    email: 'leyla@maison.com',
    avatar: 'https://i.pravatar.cc/80?img=5',
    role: 'editor',
    lastActive: '2026-03-07T16:45:00Z',
    joinedAt: '2025-12-01T00:00:00Z',
  },
  {
    id: 'user-4',
    name: 'Tariq Nassif',
    email: 'tariq@maison.com',
    avatar: 'https://i.pravatar.cc/80?img=52',
    role: 'viewer',
    lastActive: '2026-03-06T09:00:00Z',
    joinedAt: '2026-01-10T00:00:00Z',
  },
];

// ─── Billing ─────────────────────────────────────────────────────────────────

export const currentPlan: BillingPlan = {
  id: 'plan-growth',
  name: 'Growth',
  tier: 'growth',
  price: 99,
  currency: 'USD',
  interval: 'monthly',
  features: [
    'Unlimited story groups',
    'Up to 50 stories per group',
    'Advanced analytics',
    'Custom branding',
    'Priority support',
    'Team collaboration (up to 10)',
    'API access',
    'Interactive components',
  ],
  limits: {
    storyGroups: -1,
    storiesPerGroup: 50,
    widgets: 5,
    teamMembers: 10,
    monthlyImpressions: 500000,
  },
};

export const availablePlans: BillingPlan[] = [
  {
    id: 'plan-free',
    name: 'Free',
    tier: 'free',
    price: 0,
    currency: 'USD',
    interval: 'monthly',
    features: ['Up to 3 story groups', 'Up to 5 stories per group', 'Basic analytics', '1 widget'],
    limits: {
      storyGroups: 3,
      storiesPerGroup: 5,
      widgets: 1,
      teamMembers: 1,
      monthlyImpressions: 10000,
    },
  },
  {
    id: 'plan-starter',
    name: 'Starter',
    tier: 'starter',
    price: 29,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Up to 10 story groups',
      'Up to 20 stories per group',
      'Standard analytics',
      '2 widgets',
      'Email support',
    ],
    limits: {
      storyGroups: 10,
      storiesPerGroup: 20,
      widgets: 2,
      teamMembers: 3,
      monthlyImpressions: 100000,
    },
  },
  currentPlan,
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    price: 299,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Unlimited everything',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'SSO / SAML',
      'Audit logs',
      'White-label option',
    ],
    limits: {
      storyGroups: -1,
      storiesPerGroup: -1,
      widgets: -1,
      teamMembers: -1,
      monthlyImpressions: -1,
    },
  },
];

export const paymentMethod: PaymentMethod = {
  id: 'pm-1',
  type: 'card',
  brand: 'Visa',
  last4: '4242',
  expiryMonth: 12,
  expiryYear: 2027,
  isDefault: true,
};

export const invoices: Invoice[] = [
  {
    id: 'inv-6',
    number: 'INV-2026-006',
    amount: 99,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2026-03-01T00:00:00Z',
    dueAt: '2026-03-15T00:00:00Z',
    paidAt: '2026-03-01T08:12:00Z',
    downloadUrl: '#',
  },
  {
    id: 'inv-5',
    number: 'INV-2026-005',
    amount: 99,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2026-02-01T00:00:00Z',
    dueAt: '2026-02-15T00:00:00Z',
    paidAt: '2026-02-01T09:30:00Z',
    downloadUrl: '#',
  },
  {
    id: 'inv-4',
    number: 'INV-2026-004',
    amount: 99,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2026-01-01T00:00:00Z',
    dueAt: '2026-01-15T00:00:00Z',
    paidAt: '2026-01-01T10:00:00Z',
    downloadUrl: '#',
  },
  {
    id: 'inv-3',
    number: 'INV-2025-003',
    amount: 99,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2025-12-01T00:00:00Z',
    dueAt: '2025-12-15T00:00:00Z',
    paidAt: '2025-12-01T07:45:00Z',
    downloadUrl: '#',
  },
  {
    id: 'inv-2',
    number: 'INV-2025-002',
    amount: 29,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2025-11-01T00:00:00Z',
    dueAt: '2025-11-15T00:00:00Z',
    paidAt: '2025-11-02T11:20:00Z',
    downloadUrl: '#',
  },
  {
    id: 'inv-1',
    number: 'INV-2025-001',
    amount: 29,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2025-10-01T00:00:00Z',
    dueAt: '2025-10-15T00:00:00Z',
    paidAt: '2025-10-01T08:00:00Z',
    downloadUrl: '#',
  },
];
