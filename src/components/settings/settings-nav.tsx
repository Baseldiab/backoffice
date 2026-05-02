'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Smartphone, Users, CreditCard, UserCircle } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Apps', href: '/dashboard/settings', icon: Smartphone },
  { label: 'Team', href: '/dashboard/settings/team', icon: Users },
  { label: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
  { label: 'Profile', href: '/dashboard/settings/profile', icon: UserCircle },
];

function useActiveItem(pathname: string | null) {
  return (href: string) =>
    href === '/dashboard/settings'
      ? pathname === '/dashboard/settings'
      : (pathname?.startsWith(href) ?? false);
}

export function SettingsNav() {
  const pathname = usePathname();
  const isActive = useActiveItem(pathname);

  return (
    <>
      {/* Mobile / Tablet — horizontal scrollable tabs, sticky */}
      <div className="sticky top-0 z-10 -mx-4 bg-background px-4 pb-1 pt-1 lg:hidden">
        <ScrollArea className="w-full">
          <nav className="flex gap-1" aria-label="Settings">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-muted font-medium text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
      </div>

      {/* Desktop — vertical sidebar nav */}
      <nav className="hidden w-[200px] shrink-0 lg:block" aria-label="Settings">
        <div className="sticky top-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
