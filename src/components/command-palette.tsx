'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  FileText,
  Home,
  Palette,
  Plus,
  Settings,
  Users,
  CreditCard,
  UserCircle,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

const PAGES = [
  { label: 'Overview', href: '/dashboard', icon: Home },
  { label: 'Content', href: '/dashboard/content', icon: FileText },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings — Apps', href: '/dashboard/settings', icon: Settings },
  { label: 'Settings — Team', href: '/dashboard/settings/team', icon: Users },
  {
    label: 'Settings — Billing',
    href: '/dashboard/settings/billing',
    icon: CreditCard,
  },
  {
    label: 'Settings — Profile',
    href: '/dashboard/settings/profile',
    icon: UserCircle,
  },
];

const ACTIONS = [
  { label: 'New Story Group', href: '/dashboard/content', icon: Plus },
  { label: 'Open Studio', href: '/studio/new', icon: Palette },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages and actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {PAGES.map((page) => (
            <CommandItem key={page.href} onSelect={() => navigate(page.href)}>
              <page.icon className="mr-2 h-4 w-4" />
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          {ACTIONS.map((action) => (
            <CommandItem key={action.label} onSelect={() => navigate(action.href)}>
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
