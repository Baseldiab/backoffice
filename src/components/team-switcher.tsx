'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronsUpDown, Check } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { widgets } from '@/lib/mock-data';
import { useWorkspaceStore } from '@/lib/workspace-store';

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const activeWidgetId = useWorkspaceStore((s) => s.activeWidgetId);
  const setActiveWidgetId = useWorkspaceStore((s) => s.setActiveWidgetId);

  const activeWidget = widgets.find((w) => w.id === activeWidgetId) ?? widgets[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">
                  {activeWidget.appName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">{activeWidget.appName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeWidget.platform}
                </span>
              </div>
              <ChevronsUpDown className="ms-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {widgets.map((widget) => (
              <DropdownMenuItem
                key={widget.id}
                className="gap-2 p-2"
                onClick={() => setActiveWidgetId(widget.id)}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <span className="text-xs font-medium">
                    {widget.appName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="grid flex-1 text-sm leading-tight">
                  <span className="truncate font-medium">{widget.appName}</span>
                  <span className="truncate text-xs text-muted-foreground">{widget.platform}</span>
                </div>
                {widget.id === activeWidgetId && <Check className="ms-auto h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => router.push('/dashboard/settings')}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <span className="text-lg leading-none">+</span>
              </div>
              <span className="text-muted-foreground">Add workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
