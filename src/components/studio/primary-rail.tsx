'use client';

import React from 'react';
import {
  Wand2,
  Sparkles,
  Type,
  MousePointerClick,
  MessageSquare,
  ImageIcon,
  Shapes,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useShallow } from 'zustand/react/shallow';
import { type RailTool, useStudioStore } from '@/lib/studio-store';

interface RailItem {
  id: RailTool;
  label: string;
  shortcut: string;
  icon: React.ElementType;
}

const RAIL_ITEMS: RailItem[] = [
  { id: 'ai', label: 'AI Generate', shortcut: 'A', icon: Wand2 },
  { id: 'templates', label: 'Templates', shortcut: '', icon: Sparkles },
  { id: 'text', label: 'Text', shortcut: 'T', icon: Type },
  { id: 'cta', label: 'CTA', shortcut: 'C', icon: MousePointerClick },
  { id: 'interactive', label: 'Interactive', shortcut: 'P', icon: MessageSquare },
  { id: 'media', label: 'Media', shortcut: 'M', icon: ImageIcon },
  { id: 'element', label: 'Element', shortcut: 'E', icon: Shapes },
];

const LAYERS_ITEM: RailItem = {
  id: 'layers',
  label: 'Layers',
  shortcut: 'L',
  icon: Layers,
};

export function PrimaryRail() {
  const { activeTool, toggleTool } = useStudioStore(
    useShallow((s) => ({ activeTool: s.activeTool, toggleTool: s.toggleTool })),
  );

  function renderItem(item: RailItem) {
    const Icon = item.icon;
    const isActive = activeTool === item.id;
    const tooltipText = item.shortcut ? `${item.label} (${item.shortcut})` : item.label;

    return (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>
          <button
            onClick={() => toggleTool(item.id)}
            className={cn(
              'flex w-full flex-col items-center gap-0.5 rounded-lg px-1 py-2 transition-colors',
              isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
            aria-label={item.label}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[9px] leading-tight">{item.label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{tooltipText}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex w-14 shrink-0 flex-col items-center border-e border-border bg-card py-2">
      <div className="flex flex-col items-center gap-1 px-1.5">{RAIL_ITEMS.map(renderItem)}</div>
      <Separator className="my-2 w-8" />
      <div className="px-1.5">{renderItem(LAYERS_ITEM)}</div>
    </div>
  );
}
