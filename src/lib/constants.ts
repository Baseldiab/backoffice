import type { StoryGroupStatus, ChartMetric, UserRole, PlanTier } from './types';

// ─── Navigation ──────────────────────────────────────────────────────────────

export const MAIN_NAV_ITEMS = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    title: 'Content',
    href: '/dashboard/content',
    icon: 'FolderOpen',
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: 'BarChart3',
    children: [
      { title: 'Performance', href: '/dashboard/analytics', icon: 'TrendingUp' },
      { title: 'Interaction', href: '/dashboard/analytics/interaction', icon: 'MousePointerClick' },
    ],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: 'Settings',
  },
] as const;

// ─── Status Configuration ────────────────────────────────────────────────────

export const STATUS_OPTIONS: {
  value: StoryGroupStatus;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  { value: 'active', label: 'Active', color: 'text-primary', bgColor: 'bg-primary/10' },
  { value: 'inactive', label: 'Inactive', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  { value: 'test', label: 'Test', color: 'text-foreground', bgColor: 'bg-muted' },
  { value: 'archived', label: 'Archived', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  { value: 'scheduled', label: 'Scheduled', color: 'text-foreground', bgColor: 'bg-muted' },
];

export const STATUS_LABELS: Record<StoryGroupStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  test: 'Test',
  archived: 'Archived',
  scheduled: 'Scheduled',
};

// ─── Chart Metrics ───────────────────────────────────────────────────────────

export const CHART_METRICS: {
  id: ChartMetric;
  label: string;
  color: string;
}[] = [
  { id: 'reach', label: 'Reach', color: 'hsl(var(--chart-1))' },
  { id: 'impressions', label: 'Impression', color: 'hsl(var(--chart-2))' },
  { id: 'clicks', label: 'Click', color: 'hsl(var(--chart-3))' },
  { id: 'activeUsers', label: 'Active Users', color: 'hsl(var(--chart-4))' },
  { id: 'eventTracker', label: 'Event Tracker', color: 'hsl(var(--chart-5))' },
];

// ─── Analytics Columns ───────────────────────────────────────────────────────

export const ANALYTICS_COLUMNS = [
  { key: 'storyGroup', label: 'Story Group', sortable: true },
  { key: 'widgets', label: 'Widgets', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'audience', label: 'Audience', sortable: false },
  { key: 'reach', label: 'Reach', sortable: true, numeric: true },
  { key: 'activeUsers', label: 'Active Users', sortable: true, numeric: true },
  { key: 'impressions', label: 'Impression', sortable: true, numeric: true },
  { key: 'clicks', label: 'Click', sortable: true, numeric: true },
  { key: 'ctr', label: 'CTR', sortable: true, numeric: true },
  { key: 'completionRate', label: 'Complete', sortable: true, numeric: true },
  { key: 'shareFromClick', label: 'Share from Click', sortable: true, numeric: true },
] as const;

export const DRILLDOWN_COLUMNS = [
  { key: 'story', label: 'Story', sortable: true },
  { key: 'storyId', label: 'Story ID', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'reach', label: 'Reach', sortable: true, numeric: true },
  { key: 'impressions', label: 'Impression', sortable: true, numeric: true },
  { key: 'clicks', label: 'Click', sortable: true, numeric: true },
  { key: 'ctr', label: 'CTR', sortable: true, numeric: true },
  { key: 'completionRate', label: 'Complete', sortable: true, numeric: true },
  { key: 'avgWatchLength', label: 'Avg Watch Length', sortable: true, numeric: true },
  { key: 'tapForward', label: 'Tap Forward', sortable: true, numeric: true },
  { key: 'tapBackward', label: 'Tap Backward', sortable: true, numeric: true },
] as const;

// ─── Roles ───────────────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: 'Full access. Can manage billing and delete the workspace.',
  admin: 'Can manage team, content, and settings. Cannot manage billing.',
  editor: 'Can create and edit content. Cannot manage team or settings.',
  viewer: 'Read-only access to content and analytics.',
};

// ─── Plan Tiers ──────────────────────────────────────────────────────────────

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: 'Free',
  starter: 'Starter',
  growth: 'Growth',
  enterprise: 'Enterprise',
};

// ─── Date Ranges ─────────────────────────────────────────────────────────────

export const DATE_RANGE_OPTIONS = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 14 days', value: '14d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Custom', value: 'custom' },
] as const;

// ─── Story Template Categories ───────────────────────────────────────────────

export const TEMPLATE_CATEGORIES = [
  'All',
  'My Templates',
  'Recents',
  'Activation',
  'Conversion',
  'Engagement',
  'Education',
  'Feedback',
  'Announcement',
] as const;

// ─── Studio Toolbar Items ────────────────────────────────────────────────────

export const STUDIO_TOOLBAR_ITEMS = [
  { id: 'templates', label: 'Templates', icon: 'LayoutTemplate' },
  { id: 'text', label: 'Text', icon: 'Type' },
  { id: 'cta', label: 'CTA', icon: 'MousePointerClick' },
  { id: 'interactive', label: 'Interactive', icon: 'Sparkles' },
  { id: 'media', label: 'Media', icon: 'Image' },
  { id: 'element', label: 'Element', icon: 'Shapes' },
  { id: 'apps', label: 'Apps', icon: 'Grid3x3' },
  { id: 'assets', label: 'Assets', icon: 'FolderOpen' },
] as const;

// ─── Onboarding Steps ────────────────────────────────────────────────────────

export const ONBOARDING_STEPS = [
  { step: 1, title: 'Account Type', description: 'Select your account type' },
  { step: 2, title: 'Business Type', description: 'Mobile app, website, or both?' },
  { step: 3, title: 'Add App', description: 'Register your first app' },
  { step: 4, title: 'Integration', description: 'Copy your integration token' },
  { step: 5, title: 'First Story', description: 'Choose a template' },
  { step: 6, title: 'Preview', description: 'Preview with QR code' },
] as const;

// ─── Misc ────────────────────────────────────────────────────────────────────

export const APP_NAME = 'Hikayat';
export const APP_DESCRIPTION = 'In-App Stories Platform';
export const ITEMS_PER_PAGE = 12;
export const MAX_STORIES_PER_GROUP = 20;
export const MAX_FILE_SIZE_MB = 10;
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
