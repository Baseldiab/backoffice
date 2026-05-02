'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MoreHorizontal, Pencil, Copy, Pin, Archive, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn, formatRelativeDate } from '@/lib/utils';
import { widgets } from '@/lib/mock-data';
import type { StoryGroup } from '@/lib/types';

const STATUS_BADGE: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  test: { label: 'Test', variant: 'outline' },
  archived: { label: 'Archived', variant: 'secondary' },
  scheduled: { label: 'Scheduled', variant: 'outline' },
};

interface StoryGroupCardProps {
  group: StoryGroup;
  selected?: boolean;
  onSelect?: (group: StoryGroup) => void;
  onEdit: (group: StoryGroup) => void;
  onDuplicate: (group: StoryGroup) => void;
  onTogglePin: (group: StoryGroup) => void;
  onArchive: (group: StoryGroup) => void;
  onDelete: (group: StoryGroup) => void;
  onToggleStatus: (group: StoryGroup) => void;
}

export function StoryGroupCard({
  group,
  selected,
  onSelect,
  onEdit,
  onDuplicate,
  onTogglePin,
  onArchive,
  onDelete,
  onToggleStatus,
}: StoryGroupCardProps) {
  const router = useRouter();
  const statusConfig = STATUS_BADGE[group.status] ?? STATUS_BADGE.inactive;
  const isActive = group.status === 'active';
  const storyPreviews = group.stories.slice(0, 4);

  const navigateToStudio = () => {
    router.push(`/studio/${group.id}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={navigateToStudio}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateToStudio();
        }
      }}
      aria-label={`Open ${group.title} in Studio`}
      className={cn(
        'group relative cursor-pointer rounded-xl bg-muted/50 border border-border/50 p-4 transition-all duration-200',
        selected
          ? 'ring-1 ring-foreground/20'
          : 'hover:ring-1 hover:ring-border hover:-translate-y-0.5',
      )}
    >
      {/* Selection checkbox */}
      {onSelect && (
        <div className="absolute start-3 top-3 z-10" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selected}
            onCheckedChange={() => onSelect(group)}
            aria-label={`Select ${group.title}`}
            className={cn(
              'border-border transition-opacity data-[state=checked]:bg-foreground data-[state=checked]:text-background data-[state=checked]:border-foreground',
              selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            )}
          />
        </div>
      )}

      {/* Header row — cover + title + menu */}
      <div className="flex items-start gap-3">
        {/* Circular cover */}
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={group.coverImage} alt={group.title} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-sm font-medium">{group.title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {group.storiesCount} {group.storiesCount === 1 ? 'story' : 'stories'}
              </p>
            </div>

            {/* 3-dot menu */}
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEdit(group)}>
                    <Pencil className="me-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(group)}>
                    <Copy className="me-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onTogglePin(group)}>
                    <Pin className="me-2 h-4 w-4" />
                    {group.isPinned ? 'Unpin' : 'Pin'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onArchive(group)}>
                    <Archive className="me-2 h-4 w-4" />
                    {group.status === 'archived' ? 'Unarchive' : 'Archive'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(group)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="me-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Story thumbnails row — hidden on tablet, visible on desktop */}
      <div className="mt-3 hidden items-center gap-1.5 lg:flex">
        {storyPreviews.map((story) => (
          <div
            key={story.id}
            className="h-10 w-10 overflow-hidden rounded-md bg-muted"
            title={story.title}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={story.thumbnail} alt={story.title} className="h-full w-full object-cover" />
          </div>
        ))}
        {group.storiesCount > 4 && (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
            +{group.storiesCount - 4}
          </div>
        )}
      </div>

      {/* Footer — status, audience, toggle */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={group.status}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <Badge variant={statusConfig.variant} className="text-[10px]" role="status">
                <span className="sr-only">Status: </span>
                {statusConfig.label}
              </Badge>
            </motion.div>
          </AnimatePresence>
          {group.isPinned && <Pin className="h-3 w-3 text-muted-foreground" />}
          {group.isSponsored && (
            <Badge variant="outline" className="text-[10px]">
              Sponsored
            </Badge>
          )}
          {group.audience !== 'none' && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span className="text-[10px]">
                {group.labels.length > 0 ? group.labels[0] : 'Custom'}
              </span>
            </div>
          )}
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={isActive}
            onCheckedChange={() => onToggleStatus(group)}
            className="scale-75"
            aria-label={`Toggle ${group.title}`}
          />
        </div>
      </div>

      {/* Workspace badges — shown only when published to multiple workspaces */}
      {group.widgetIds.length > 1 && (
        <div className="mt-2 flex items-center gap-1">
          {group.widgetIds.map((wId) => {
            const widget = widgets.find((w) => w.id === wId);
            if (!widget) return null;
            const shortLabel =
              widget.platform === 'ios' ? 'iOS' : widget.platform === 'android' ? 'Android' : 'Web';
            return (
              <span
                key={wId}
                className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {shortLabel}
              </span>
            );
          })}
        </div>
      )}

      {/* Updated timestamp */}
      <p className="mt-2 text-[10px] text-muted-foreground">
        Updated {formatRelativeDate(group.updatedAt)}
      </p>
    </div>
  );
}
