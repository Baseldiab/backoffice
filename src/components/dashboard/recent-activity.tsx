'use client';

import React from 'react';
import { FileText, Pencil, Send, Archive, Copy, Trash2, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { recentActivity } from '@/lib/mock-data';
import { formatRelativeDate, getInitials } from '@/lib/utils';
import type { ActivityAction } from '@/lib/types';

const ACTION_CONFIG: Record<
  ActivityAction,
  {
    label: string;
    icon: React.ElementType;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
  }
> = {
  created: { label: 'Created', icon: FileText, variant: 'default' },
  updated: { label: 'Updated', icon: Pencil, variant: 'secondary' },
  published: { label: 'Published', icon: Send, variant: 'default' },
  archived: { label: 'Archived', icon: Archive, variant: 'outline' },
  duplicated: { label: 'Duplicated', icon: Copy, variant: 'secondary' },
  deleted: { label: 'Deleted', icon: Trash2, variant: 'destructive' },
  scheduled: { label: 'Scheduled', icon: Clock, variant: 'outline' },
};

export function RecentActivity() {
  return (
    <div className="rounded-xl bg-muted/50">
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <h2 className="text-base font-semibold tracking-tight">Recent Activity</h2>
        <Button variant="link" size="sm" className="text-xs text-muted-foreground">
          View all
        </Button>
      </div>
      <div className="divide-y divide-border/50">
        {recentActivity.slice(0, 5).map((item) => {
          const config = ACTION_CONFIG[item.action];
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-accent/30"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={item.userAvatar} alt={item.userName} />
                <AvatarFallback className="bg-accent text-xs font-medium">
                  {getInitials(item.userName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Icon className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="font-medium">{item.userName}</span>{' '}
                    <span className="text-muted-foreground">{config.label.toLowerCase()}</span>{' '}
                    <span className="font-medium">{item.targetName}</span>
                  </p>
                </div>
              </div>

              <Badge variant={config.variant} className="hidden shrink-0 sm:inline-flex">
                {config.label}
              </Badge>

              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {formatRelativeDate(item.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
