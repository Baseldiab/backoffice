# Hikayat Backoffice v2 — Project Memory

## Tech Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS 3.4, shadcn/ui
- Package manager: npm (package-lock.json present)
- Sonner for toasts (Toaster in providers.tsx, theme="dark")
- date-fns for date formatting

## Project Layout
- `src/app/(backoffice)/` — all backoffice pages with shared layout
- Layout: custom `<Sidebar>` + `<Topbar>` (NOT shadcn SidebarProvider)
- Main content: `<main className="flex-1 overflow-y-auto px-6 py-6">`

## Key Conventions
- Brand green: `bg-[#3ECF8E] text-[#0D0D0D]` (hardcoded hex — `bg-brand` is undefined in Tailwind config)
- `brand` CSS color is NOT in tailwind.config.ts — use `#3ECF8E` directly for buttons
- Focus ring: `focus:ring-1 focus:ring-[#3ECF8E]`
- Tables: `rounded-lg border border-border bg-card`, thead has `border-b border-border`
- Table rows: `divide-y divide-border bg-background`, hover: `hover:bg-card/60`
- Page structure: `<div className="space-y-5">`

## Shared Components
- `StatusBadge` — supports: active, inactive, pending, trial, churned, suspended, open, resolved, escalated, enabled, disabled, success, warning, error
- `ConfirmDialog` — props: open, onOpenChange, title, description, confirmLabel, variant, onConfirm
- `StatCard` in `src/components/shared/StatCard.tsx`

## Mock Data Files
- `src/lib/mock/customers.ts` — Company type + MOCK_CUSTOMERS
- `src/lib/mock/team.ts` — TeamMember type + MOCK_TEAM (10 members)

## Team Module (built)
- Page: `src/app/(backoffice)/team/page.tsx`
- Components: `src/components/team/role-badge.tsx`, `employee-drawer.tsx`, `invite-modal.tsx`
- Role badge colors: Super Admin=purple, Ops Manager=blue, Finance Officer=emerald, Support Agent=orange, Content Manager=pink, Viewer=gray
- Pending rows: `border-l-2 border-yellow-500` on first td + `bg-yellow-500/[0.03]` on tr
- Invite modal: Dialog max-w-2xl, Manual Entry tab + Bulk Upload tab
- Bulk preview: 5 valid rows + 2 error rows (hardcoded mock)
- Employee drawer: Sheet side="right" w-[400px]

## Sidebar Navigation
- File: `src/components/layout/Sidebar.tsx`
- Groups: Overview, Customers, Operations, Team, System
- Team group added with "Team Members" → `/team`

## Prettier Config
- Project uses prettier with eslint-plugin-prettier — run `npx prettier --write <files>` after writing
