'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, CalendarDays } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { widgets } from '@/lib/mock-data';
import { useWorkspaceStore } from '@/lib/workspace-store';
function getBreadcrumbs(pathname: string) {
  const segments = pathname.replace('/dashboard', '').split('/').filter(Boolean);

  if (segments.length === 0) {
    return [{ label: 'Overview', href: undefined }];
  }

  const crumbs = segments.map((segment, index) => {
    const href = '/dashboard/' + segments.slice(0, index + 1).join('/');
    const label = segment
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const isLast = index === segments.length - 1;
    return { label, href: isLast ? undefined : href };
  });

  // Analytics page default sub-tab breadcrumb
  if (segments.length === 1 && segments[0] === 'analytics') {
    crumbs[0].href = '/dashboard/analytics';
    crumbs.push({ label: 'Performance', href: undefined });
  }

  return crumbs;
}

export function SiteHeader() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname ?? '');
  const activeWidgetId = useWorkspaceStore((s) => s.activeWidgetId);
  const activeWidget = widgets.find((w) => w.id === activeWidgetId) ?? widgets[0];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ms-1" />
        <Separator orientation="vertical" className="me-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.label}>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <span className="hidden text-xs text-muted-foreground md:inline">
          — {activeWidget.appName}
        </span>
      </div>
      <div className="hidden items-center gap-2 pe-4 md:flex">
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <CalendarDays className="h-4 w-4" />
          <span className="hidden lg:inline">Last 14 days</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
