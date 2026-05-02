'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Sparkles, Trash2, GripVertical, Play } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useShallow } from 'zustand/react/shallow';
import { useStudioStore } from '@/lib/studio-store';
import type { Story } from '@/lib/types';

const THUMB_W = 56;
const THUMB_H = 100;

interface StoryTimelineProps {
  stories: Story[];
  onOpenGallery?: () => void;
  onAddBlank?: () => void;
  onDeleteStory?: (index: number) => void;
  onReorderStories?: (reorderedStories: Story[]) => void;
}

function ThumbnailMedia({ story }: { story: Story }) {
  if (story.gradient) {
    return <div className={cn('h-full w-full bg-gradient-to-br', story.gradient)} />;
  }

  if (story.type === 'video' && story.videoUrl) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        src={story.videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }

  if (!story.thumbnail) {
    return (
      <div className="h-full w-full rounded-md border border-dashed border-muted-foreground/30 bg-muted/50" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={story.thumbnail} alt={story.title} className="h-full w-full object-cover" />
  );
}

function SortableStoryThumb({
  story,
  index,
  isActive,
  hoveredIndex,
  setHoveredIndex,
  setActiveStoryIndex,
  setDeleteIndex,
}: {
  story: Story;
  index: number;
  isActive: boolean;
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
  setActiveStoryIndex: (i: number) => void;
  setDeleteIndex: (i: number | null) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: story.id,
  });

  const isVideo = story.type === 'video';
  const isHovered = hoveredIndex === index;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: THUMB_W,
    height: THUMB_H,
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={setNodeRef}
          style={style}
          className={cn(
            'group/thumb relative shrink-0 overflow-hidden rounded-md bg-muted transition-all',
            isActive
              ? 'border-2 border-foreground'
              : 'border border-transparent hover:border-muted-foreground',
            isDragging && 'opacity-80 scale-105 shadow-xl z-50',
          )}
          onClick={() => setActiveStoryIndex(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          aria-label={story.title}
        >
          <ThumbnailMedia story={story} />

          {/* AI-generated badge (top-right) */}
          {story.aiGenerated && (
            <div className="absolute end-1 top-1 z-10">
              <span className="flex items-center rounded bg-background/70 px-1 py-px">
                <Sparkles className="h-2.5 w-2.5 text-foreground" />
              </span>
            </div>
          )}

          {/* Bottom badges row */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-1 pb-1">
            {isVideo ? (
              <span className="flex items-center gap-0.5 rounded bg-background/70 px-1 py-px">
                <Play className="h-2 w-2 fill-foreground text-foreground" />
              </span>
            ) : (
              <span />
            )}
            <span className="rounded bg-background/70 px-1 py-px text-[9px] font-medium tabular-nums text-foreground">
              5s
            </span>
          </div>

          {/* Drag handle */}
          <div
            className="absolute start-0 top-0 z-10 flex h-full items-center opacity-0 transition-opacity group-hover/thumb:opacity-100 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3 w-3 text-foreground/50" />
          </div>

          {/* Delete button on hover */}
          {isHovered && !isDragging && (
            <div
              className="absolute end-0 top-0 z-20 p-0.5"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteIndex(index);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  e.preventDefault();
                  setDeleteIndex(index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Delete story"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded bg-destructive/90 transition-colors hover:bg-destructive">
                <Trash2 className="h-3 w-3 text-white" />
              </span>
            </div>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {story.title}
      </TooltipContent>
    </Tooltip>
  );
}

function DragOverlayThumb({ story }: { story: Story }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-md bg-muted border-2 border-foreground opacity-90 shadow-2xl scale-105"
      style={{ width: THUMB_W, height: THUMB_H }}
    >
      <ThumbnailMedia story={story} />
    </div>
  );
}

export function StoryTimeline({
  stories,
  onOpenGallery,
  onAddBlank,
  onDeleteStory,
  onReorderStories,
}: StoryTimelineProps) {
  const { activeStoryIndex, setActiveStoryIndex } = useStudioStore(
    useShallow((s) => ({
      activeStoryIndex: s.activeStoryIndex,
      setActiveStoryIndex: s.setActiveStoryIndex,
    })),
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stories.findIndex((s) => s.id === active.id);
    const newIndex = stories.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(stories, oldIndex, newIndex);
    onReorderStories?.(reordered);
    toast.success('Story order updated');
  }

  function handleConfirmDelete() {
    if (deleteIndex === null) return;
    onDeleteStory?.(deleteIndex);
    toast.success('Story deleted');
    setDeleteIndex(null);
  }

  const activeStory = activeId ? stories.find((s) => s.id === activeId) : null;

  return (
    <>
      <div className="shrink-0 overflow-y-visible border-t border-border bg-card/80 backdrop-blur-md">
        <div className="overflow-x-auto overflow-y-visible px-4 py-3">
          <div className="flex items-center gap-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={stories.map((s) => s.id)}
                strategy={horizontalListSortingStrategy}
              >
                {stories.map((story, index) => (
                  <SortableStoryThumb
                    key={story.id}
                    story={story}
                    index={index}
                    isActive={activeStoryIndex === index}
                    hoveredIndex={hoveredIndex}
                    setHoveredIndex={setHoveredIndex}
                    setActiveStoryIndex={setActiveStoryIndex}
                    setDeleteIndex={setDeleteIndex}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeStory ? <DragOverlayThumb story={activeStory} /> : null}
              </DragOverlay>
            </DndContext>

            {/* Add blank story */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  style={{ width: THUMB_W, height: THUMB_H }}
                  onClick={onAddBlank}
                  aria-label="Add blank story"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Add blank story</TooltipContent>
            </Tooltip>

            {/* From template */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  style={{ width: THUMB_W, height: THUMB_H }}
                  onClick={onOpenGallery}
                  aria-label="From template"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[9px]">Template</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">From template</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this story?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the story from the timeline. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
