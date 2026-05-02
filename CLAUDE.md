# CLAUDE.md — Hikayat Dashboard Project

## ⚡ Project Identity

**Hikayat** is a SaaS In-App Stories platform competing with Storyly.io, targeting Gulf market businesses.
This project is the **Dashboard UI/UX Shell** — a fully functional frontend with mock data, ready for backend integration.

- **Phase**: MVP UI Build (English-first, RTL-ready architecture)
- **Language**: English UI only. Arabic/RTL is Phase 2 — but architecture must support `dir="rtl"` switching from Day 1
- **Handoff Target**: PM → Development Team (they will connect APIs)
- **Design Standard**: shadcn/ui Blocks (https://ui.shadcn.com/blocks) — specifically `dashboard-01` and `sidebar-07` patterns
- **Theme**: Dark Mode First — sophisticated deep charcoal/navy aesthetic

---

## 🛠 Tech Stack (Non-Negotiable)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 14+ (App Router) |
| UI Library | shadcn/ui | Latest (new-york-v4 style) |
| Styling | Tailwind CSS | 3.4+ |
| Font | Inter | via next/font/google |
| Icons | Lucide React | Latest |
| Charts | Recharts | Latest |
| State | Zustand | Latest |
| Animations | Framer Motion | Latest |
| Package Manager | npm | Latest |

---

## 🎯 Design Standard: shadcn Blocks

The **ONLY** acceptable design standard is the official shadcn/ui blocks page.
Reference: https://ui.shadcn.com/blocks

### Core Layout Pattern (MANDATORY)

Use the exact `SidebarProvider + SidebarInset` pattern from shadcn blocks `dashboard-01`:

```tsx
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### Header Pattern (MANDATORY)

Use `SidebarTrigger + Breadcrumb` exactly like `sidebar-07`:

```tsx
<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
  <div className="flex items-center gap-2 px-4">
    <SidebarTrigger className="-ml-1" />
    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Overview</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
</header>
```

### Content Container Pattern (MANDATORY)

All content areas use `rounded-xl bg-muted/50` containers:

```tsx
<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
  {/* KPI Cards Row */}
  <div className="grid auto-rows-min gap-4 md:grid-cols-4">
    <div className="rounded-xl bg-muted/50 p-6">{/* Card content */}</div>
    <div className="rounded-xl bg-muted/50 p-6">{/* Card content */}</div>
    <div className="rounded-xl bg-muted/50 p-6">{/* Card content */}</div>
    <div className="rounded-xl bg-muted/50 p-6">{/* Card content */}</div>
  </div>
  {/* Chart area */}
  <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 p-6">
    {/* Chart */}
  </div>
</div>
```

---

## 📁 Project Structure (STRICT)

```
hikayat-dashboard/
├── app/
│   ├── layout.tsx                    # Root layout: Inter font, dark theme, ThemeProvider
│   ├── page.tsx                      # Redirect to /dashboard
│   ├── dashboard/
│   │   ├── layout.tsx                # SidebarProvider + AppSidebar + SidebarInset
│   │   ├── page.tsx                  # Overview dashboard (default)
│   │   ├── content/
│   │   │   ├── page.tsx              # Story Groups list
│   │   │   └── [groupId]/
│   │   │       └── page.tsx          # Individual stories in a group
│   │   ├── studio/
│   │   │   └── [storyId]/
│   │   │       └── page.tsx          # Story editor (Studio) — full screen, no sidebar
│   │   ├── analytics/
│   │   │   ├── page.tsx              # Performance (default)
│   │   │   ├── interaction/
│   │   │   │   └── page.tsx
│   │   │   └── [groupId]/
│   │   │       └── page.tsx          # Drilldown view
│   │   ├── settings/
│   │   │   ├── page.tsx              # Apps (default)
│   │   │   ├── team/page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   └── profile/page.tsx
│   │   └── onboarding/
│   │       └── page.tsx              # First-time setup wizard
├── components/
│   ├── ui/                           # shadcn/ui primitives (DO NOT MODIFY)
│   ├── app-sidebar.tsx               # Main sidebar (shadcn Sidebar component)
│   ├── nav-main.tsx                  # Main navigation items
│   ├── nav-user.tsx                  # User menu at bottom
│   ├── team-switcher.tsx             # Workspace/app switcher at top
│   ├── site-header.tsx               # SidebarTrigger + Breadcrumb
│   ├── section-cards.tsx             # KPI metric cards row
│   ├── chart-area-interactive.tsx    # Main performance chart
│   ├── data-table.tsx                # Reusable data table
│   ├── dashboard/
│   │   ├── kpi-card.tsx
│   │   ├── performance-chart.tsx
│   │   └── recent-activity.tsx
│   ├── content/
│   │   ├── story-group-card.tsx
│   │   ├── story-group-grid.tsx
│   │   ├── create-group-dialog.tsx
│   │   ├── edit-group-panel.tsx
│   │   └── status-tabs.tsx
│   ├── studio/
│   │   ├── canvas-preview.tsx
│   │   ├── toolbar-left.tsx
│   │   ├── template-gallery.tsx
│   │   └── story-timeline.tsx
│   ├── analytics/
│   │   ├── performance-table.tsx
│   │   ├── drilldown-table.tsx
│   │   └── filter-bar.tsx
│   └── shared/
│       ├── empty-state.tsx
│       ├── loading-skeleton.tsx
│       └── confirm-dialog.tsx
├── lib/
│   ├── mock-data.ts
│   ├── constants.ts
│   ├── utils.ts
│   └── types.ts
├── hooks/
│   └── use-mock-data.ts
└── styles/
    └── globals.css
```

---

## 🎨 Design System — Dark Mode First

### Theme: Dark Mode Default

The dashboard launches in **dark mode by default**. This is non-negotiable.
Use `class="dark"` on the `<html>` tag. ThemeProvider should default to "dark".

### Color Palette

```css
/* Dark theme (DEFAULT) */
.dark {
  /* Brand */
  --primary: 153 72% 53%;           /* #3ECF8E — Emerald Green */
  --primary-foreground: 0 0% 2%;

  /* Background layers (deep charcoal, NOT pure black) */
  --background: 220 13% 7%;         /* #0F1117 — deepest layer */
  --foreground: 210 20% 95%;

  --card: 220 13% 10%;              /* #171B22 — card surfaces */
  --card-foreground: 210 20% 95%;

  --muted: 220 13% 14%;             /* #1E2028 — muted containers (rounded-xl bg-muted/50) */
  --muted-foreground: 215 15% 55%;

  --border: 220 13% 18%;            /* #272B35 — subtle borders */
  --input: 220 13% 18%;

  /* Sidebar */
  --sidebar-background: 220 13% 9%;
  --sidebar-foreground: 210 20% 85%;
  --sidebar-primary: 153 72% 53%;
  --sidebar-primary-foreground: 0 0% 2%;
  --sidebar-accent: 220 13% 14%;
  --sidebar-accent-foreground: 210 20% 85%;
  --sidebar-border: 220 13% 15%;
  --sidebar-ring: 153 72% 53%;

  /* Accent colors */
  --accent: 220 13% 14%;
  --accent-foreground: 210 20% 95%;
  --destructive: 0 72% 51%;
  --ring: 153 72% 53%;

  --radius: 0.625rem;
  --chart-1: 220 10% 56%;            /* Zinc 400 — primary chart line */
  --chart-2: 220 10% 44%;            /* Zinc 500 */
  --chart-3: 220 10% 68%;            /* Zinc 300 */
  --chart-4: 220 10% 36%;            /* Zinc 600 */
  --chart-5: 220 10% 78%;            /* Zinc 200 */
}

/* Light theme (alternate, not default) */
:root {
  --primary: 153 72% 40%;
  --primary-foreground: 0 0% 100%;
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  --card: 0 0% 100%;
  --card-foreground: 224 71% 4%;
  --muted: 220 14% 96%;
  --muted-foreground: 220 9% 46%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --accent: 220 14% 96%;
  --accent-foreground: 224 71% 4%;
  --destructive: 0 84% 60%;
  --ring: 153 72% 40%;
  --radius: 0.625rem;
  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 5% 26%;
  --sidebar-primary: 153 72% 40%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 240 5% 96%;
  --sidebar-accent-foreground: 240 5% 26%;
  --sidebar-border: 220 13% 91%;
  --sidebar-ring: 153 72% 40%;
}
```

### Typography

```
Font:       Inter (via next/font/google)
Headers:    font-semibold tracking-tight text-foreground
Body:       font-normal text-muted-foreground
Labels:     text-sm font-medium text-foreground
Captions:   text-xs text-muted-foreground
Numbers:    font-mono tabular-nums (for metrics/analytics)
```

### Container Patterns (shadcn blocks standard)

```
Primary containers:   rounded-xl bg-muted/50 p-6
Card surfaces:        rounded-xl border bg-card p-6
Content gaps:         gap-4 (standard), gap-6 (sections)
Page padding:         p-4 lg:p-6
Grid:                 grid auto-rows-min gap-4 md:grid-cols-3
Full-height area:     min-h-[50vh] flex-1 rounded-xl bg-muted/50
```

### Chart Styling (Premium Monochrome)

```tsx
// Charts follow a NEUTRAL, monochrome aesthetic (like shadcn dashboard-01).
// Green is NEVER used in charts. Charts use grayscale/slate tones.
//
// 1. Gradient fills: subtle white/gray opacity to transparent
// 2. Smooth curves: type="natural"
// 3. Minimal axes: hide grid or very subtle dotted
// 4. Clean thin stroke: strokeWidth={1.5}
// 5. Custom dark tooltip: bg-card border rounded-lg
// 6. Neutral palette: --chart-1 through --chart-5 (zinc shades)

<AreaChart>
  <defs>
    <linearGradient id="fillChart" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.0} />
    </linearGradient>
  </defs>
  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
  <XAxis tickLine={false} axisLine={false} tickMargin={8} />
  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
  <Area type="natural" strokeWidth={1.5} stroke="hsl(var(--chart-1))" fill="url(#fillChart)" />
</AreaChart>
```

### Green Accent Strategy (STRICT)

Emerald Green (#3ECF8E) is a **strategic accent only**. It must NOT dominate the UI.

**USE green for:**
- Primary action buttons ("+ New Story Group", "Save", "Publish")
- Positive trend badges (+16.4%, +3.2%)
- Success status indicators ("Active" badge dot)
- Sidebar active item indicator
- Toggle/Switch "on" state

**NEVER use green for:**
- Chart lines, fills, or gradients (use neutral zinc palette)
- Metric selector active state (use bg-muted with subtle border)
- Table row highlights
- Card borders or backgrounds
- Section headers or decorative elements

---

## 📏 shadcn/ui Rules (STRICT — NO EXCEPTIONS)

### Rule 0: Use shadcn Sidebar Component
```
MANDATORY: Use the official shadcn Sidebar component.
Install: npx shadcn add sidebar
This gives you: Sidebar, SidebarProvider, SidebarInset, SidebarTrigger,
SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, etc.

DO NOT build a custom sidebar. Use the shadcn one.
Reference: sidebar-07 block (collapsible to icons)
```

### Rule 1: Component Hierarchy
```
ALWAYS use shadcn components. NEVER build custom versions of:
- Button, Input, Select, Checkbox, RadioGroup
- Dialog, Sheet, Popover, DropdownMenu
- Table, Tabs, Card, Badge, Avatar
- Tooltip, Separator, ScrollArea
- Command (for search), Calendar, DatePicker
- Sidebar, SidebarProvider, SidebarInset, SidebarTrigger
- Breadcrumb, BreadcrumbList, BreadcrumbItem
```

### Rule 2: Button Variants
```tsx
// Primary actions: <Button>Create Story Group</Button>
// Secondary: <Button variant="outline">Cancel</Button>
// Destructive: <Button variant="destructive">Delete</Button>
// Ghost: <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
// Link: <Button variant="link">View all</Button>
```

### Rule 3: Form Patterns
```tsx
// ALWAYS wrap form fields:
<div className="space-y-2">
  <Label htmlFor="name">Group Title</Label>
  <Input id="name" placeholder="Enter title..." />
  <p className="text-xs text-muted-foreground">Appears in the story bar.</p>
</div>

// Side panels: Sheet (side="right")
// Modals: Dialog
// Destructive confirmations: AlertDialog
```

### Rule 4: Empty States (EVERY screen needs one)
```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="rounded-full bg-muted p-4 mb-4">
    <FileText className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-semibold mb-2">No Story Groups Yet</h3>
  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
    Create your first story group to start engaging your users.
  </p>
  <Button><Plus className="mr-2 h-4 w-4" />Create Story Group</Button>
</div>
```

### Rule 5: Loading Skeletons (EVERY data component needs one)
```tsx
<div className="grid grid-cols-3 gap-4">
  {Array.from({ length: 3 }).map((_, i) => (
    <Skeleton key={i} className="h-[200px] rounded-xl" />
  ))}
</div>
```

---

## 🎬 Animation Rules (Framer Motion)

```tsx
// Page mount: fade + slide up
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}

// Card grid stagger: 50ms between children
// Card hover: whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
// Tab content: AnimatePresence mode="wait" with fade
// Duration: 150-300ms micro, 300-500ms page
// ALWAYS respect prefers-reduced-motion
```

---

## 🖥 Screen Specifications

### Screen 1: Overview Dashboard
```
Route: /dashboard
Layout: SidebarInset standard
Components:
  - SiteHeader: SidebarTrigger + Breadcrumb "Dashboard > Overview"
  - SectionCards: 4 KPI cards in grid (rounded-xl bg-muted/50)
    → Engagement Rate, CTR, Response Rate, Active Users
    → Each: metric value (text-2xl font-bold tabular-nums), trend badge, sparkline
  - ChartAreaInteractive: Performance area chart (rounded-xl bg-muted/50)
    → Left metric selector + Right chart area
    → Daily/Weekly/Monthly toggle
    → Neutral zinc gradient fill, smooth curves (NOT green)
    → Metric selector active state: bg-muted with subtle border (NOT green tint)
  - RecentActivity: table/list in rounded-xl bg-muted/50
```

### Screen 2: Content Management
```
Route: /dashboard/content
Components:
  - SiteHeader: Breadcrumb "Dashboard > Content" + "+ New Story Group" button
  - StatusTabs: All, Active, Inactive, Test, Archived
  - FilterBar: Widget selector, Labels, Audiences dropdowns
  - StoryGroupGrid: cards in rounded-xl bg-muted/50 containers
  - Grid/List view toggle
```

### Screen 3: Edit Story Group (Side Panel)
```
Route: /dashboard/content (Sheet overlay, side="right", 540px)
Sections (Accordion): Cover, Title, Audience, Schedule, Style, Sponsored
Footer: "Save as Test" (outline) + "Update" (primary)
```

### Screen 4: Hikayat Studio ("Photoshop-Grade" Editor)
```
Route: /dashboard/studio/[storyId]
Layout: FULL SCREEN — no sidebar, own layout. Dark theme (bg-background).

ARCHITECTURE: Double-Layer Interface
  ┌──────────────────────────────────────────────────────────────┐
  │  Studio Topbar (h-12, bg-card border-b)                      │
  ├────┬────────────┬───────────────────────────┬────────────────┤
  │Rail│ Secondary   │     Canvas + Safe Area    │  Properties/   │
  │56px│ Panel 280px │     (Phone Preview)       │  Layers Panel  │
  │    │ (slides     │                           │  (280px,       │
  │    │  in/out)    │                           │   conditional) │
  ├────┴────────────┴───────────────────────────┴────────────────┤
  │  Story Timeline (h-20, bg-card border-t)                      │
  └──────────────────────────────────────────────────────────────┘

PRIMARY RAIL (56px, bg-card border-r):
  → Templates (Sparkles icon) — opens template gallery panel
  → Text (Type icon) — opens text options: Title, Subtitle, Body, Custom
  → CTA (MousePointerClick) — opens CTA library: Button, Swipe-Up, Link
  → Interactive (MessageSquare) — opens: Poll, Quiz, Emoji Rating, Countdown
  → Media (Image) — opens: Upload, Unsplash, Stock Video
  → Element (Shapes) — opens: shapes, dividers, stickers
  → Layers (Layers icon) — opens layers panel (z-order management)
  → Active state: bg-muted text-foreground (NOT green)
  → Tooltip on hover with keyboard shortcut hint

SECONDARY PANEL (280px, slides from left with Framer Motion spring):
  → Contextual content based on active rail item
  → Glassmorphism: bg-card/80 backdrop-blur-xl border-r border-border
  → Close button (X) to collapse back
  → Scrollable content with ScrollArea
  → Text panel: font size presets, text type cards
  → CTA panel: animated CTA component previews
  → Interactive panel: Poll/Quiz/Rating preview cards
  → Media panel: drag-drop upload zone + Unsplash search grid

CANVAS AREA (center, flexible width):
  → Phone frame: rounded-[2.5rem] border-2 border-border shadow-2xl
  → Device selector dropdown (topbar):
    - iPhone 15 Pro (393×852, 19.5:9)
    - iPhone SE (375×667, 16:9)
    - Galaxy S24 (360×780, 19.5:9)
    - iPad Mini (744×1133, 3:4)
  → Safe area overlay toggle:
    - Top: status bar (44px) — dotted border with "Safe Zone" label
    - Bottom: home indicator (34px) — dotted border
    - Notch area indicator
  → Canvas bg: bg-muted/30 (subtle contrast from page bg)
  → Progress bar at top of phone frame (shows position in story sequence)

PROPERTIES PANEL (280px, right side, conditional):
  → Shows when an element is selected on canvas
  → Sections: Position (x, y), Size (w, h), Opacity slider, Rotation
  → Color picker, font selector, alignment buttons
  → "Dynamic Tags" section for personalization:
    - Dropdown: {{username}}, {{city}}, {{last_purchase}}, {{loyalty_tier}}
    - Insert button that adds tag to selected text element
    - Preview: shows "Hi {{username}}" → "Hi Ahmed"

TOPBAR:
  → Left: Hikayat logo + "Studio" text + story group name (editable)
  → Center: Device dropdown + "Safe Area" toggle + Zoom controls (50-200%)
  → Right:
    - Undo (Cmd+Z) / Redo (Cmd+Shift+Z) — disabled state when no history
    - Keyboard shortcuts button (?) — opens shortcuts overlay
    - Auto-save indicator: "All changes saved" or "Saving..." spinner
    - Cancel (outline) + Publish (primary green — ONLY green element)

STORY TIMELINE (bottom):
  → Horizontal scroll of story thumbnails
  → Active: border-2 border-foreground (NOT green)
  → Drag to reorder
  → "+" add blank, sparkle icon "From template"
  → Duration badge on each thumbnail (e.g., "5s")
  → Delete story: hover → trash icon overlay

KEYBOARD SHORTCUTS OVERLAY (Dialog):
  → Cmd+Z: Undo | Cmd+Shift+Z: Redo
  → Cmd+D: Duplicate | Cmd+Backspace: Delete
  → Cmd+S: Save | Cmd+Shift+P: Preview
  → Cmd+]: Bring forward | Cmd+[: Send backward
  → T: Text tool | C: CTA | P: Poll
  → Hold Space: Pan canvas

Green accent: ONLY on Publish button. Everything else neutral.
```

### Screen 5: Analytics — Performance
```
Route: /dashboard/analytics
Components: sub-tabs, filter bar, sortable data table, export, drilldown on click
```

### Screen 6: Settings
```
Route: /dashboard/settings
Sub-pages: Apps, Team, Billing, Profile
All in rounded-xl bg-muted/50 containers
```

### Screen 7: Onboarding Wizard
```
Route: /dashboard/onboarding
Full-page centered wizard, 6 steps, animated transitions
```

---

## ⚠️ Critical Rules

1. **DARK MODE FIRST** — default theme is dark. `class="dark"` on html tag
2. **USE SHADCN SIDEBAR** — SidebarProvider + SidebarInset. No custom sidebars
3. **rounded-xl bg-muted/50** — all content containers follow this pattern
4. **NEVER pure black** — use deep charcoal (#0F1117) as darkest color
5. **Charts: NEUTRAL monochrome** — zinc/slate gradients, NOT green. See "Green Accent Strategy"
6. **Green = strategic accent ONLY** — buttons, positive trends, active states. Never charts, never decorative
6. **Inter font only** — via next/font/google
7. **Brand color: #3ECF8E** — Emerald Green everywhere
8. **English only** — all UI text in English
9. **RTL-ready architecture** — use logical properties (start/end not left/right)
10. **EVERY screen** needs: empty state + loading skeleton + error boundary
11. **Forms**: red border + helper text on validation error. Sonner toast on success/failure
12. **Bulk actions**: Content page supports multi-select → archive/delete
13. **Search**: "No results" state for every filterable list
14. **NEVER** hardcode colors — use CSS variables
15. **NEVER** skip hover/focus states
16. **ALWAYS** use cn() utility for conditional classes
17. **ALWAYS** respect prefers-reduced-motion for animations
18. **ALWAYS** add aria-label to icon-only buttons
