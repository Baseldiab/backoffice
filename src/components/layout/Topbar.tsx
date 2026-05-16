'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, LogOut, User, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// TODO: wire up auth — signOut stub
const signOut = (_opts?: { callbackUrl?: string }) => {
  if (_opts?.callbackUrl) window.location.href = _opts.callbackUrl;
};

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/customers': 'Customers',
  '/billing': 'Billing',
  '/support': 'Support',
  '/ai-credits': 'AI Credits',
  '/monitoring': 'Monitoring',
  '/settings/feature-flags': 'Feature Flags',
  '/settings/api-keys': 'API Keys',
};

function usePageTitle() {
  const pathname = usePathname();
  if (pathname?.startsWith('/customers/')) return 'Customer Detail';
  return PAGE_TITLES[pathname ?? ''] ?? 'Backoffice';
}

export function Topbar() {
  const title = usePageTitle();

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-6">
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </button>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
          <span className="sr-only">Notifications</span>
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 items-center gap-2 rounded-full px-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus:outline-none">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-[#0D0D0D]">
              A
            </div>
            <span className="hidden sm:inline">Admin</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              admin@hikayat.com
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-sm">
              <User className="h-3.5 w-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-sm">
              <Settings className="h-3.5 w-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-sm text-destructive"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
