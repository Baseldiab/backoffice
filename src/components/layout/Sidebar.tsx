'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  LifeBuoy,
  Zap,
  Activity,
  Flag,
  KeyRound,
  ChevronRight,
  BookOpen,
  Users,
  Shield,
  Kanban,
  Tag,
  LayoutTemplate,
  History,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Customers',
    items: [
      { label: 'Customers', href: '/customers', icon: Building2 },
      { label: 'Sales Pipeline', href: '/pipeline', icon: Kanban },
      { label: 'Billing', href: '/billing', icon: CreditCard },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Support', href: '/support', icon: LifeBuoy },
      { label: 'AI Credits', href: '/ai-credits', icon: Zap },
      { label: 'Monitoring', href: '/monitoring', icon: Activity },
    ],
  },
  {
    label: 'Team',
    items: [
      { label: 'Team Members', href: '/team', icon: Users },
      { label: 'Roles', href: '/team/roles', icon: Shield },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Discounts', href: '/marketing/discounts', icon: Tag },
      { label: 'Templates', href: '/marketing/templates', icon: LayoutTemplate },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Plans', href: '/plans', icon: CreditCard },
      { label: 'Feature Flags', href: '/settings/feature-flags', icon: Flag },
      { label: 'API Keys', href: '/settings/api-keys', icon: KeyRound },
      { label: 'Activity Log', href: '/activity-log', icon: History },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand">
          <BookOpen className="h-4 w-4 text-[#0D0D0D]" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          Hikayat
        </span>
        <span className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-medium text-sidebar-primary border border-sidebar-primary/30">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                        active
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                      )}
                    >
                      {/* Active left border indicator */}
                      {active && (
                        <span className="absolute left-0 top-1 h-[calc(100%-8px)] w-0.5 rounded-full bg-brand" />
                      )}
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          active
                            ? 'text-brand'
                            : 'text-muted-foreground group-hover:text-sidebar-foreground',
                        )}
                      />
                      <span>{item.label}</span>
                      {active && <ChevronRight className="ml-auto h-3 w-3 text-brand opacity-60" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <p className="text-[11px] text-muted-foreground">v0.1.0 · Internal</p>
      </div>
    </aside>
  );
}
