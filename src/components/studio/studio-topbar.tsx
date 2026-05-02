'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Check,
  Undo2,
  Redo2,
  Minus,
  Plus,
  Eye,
  EyeOff,
  HelpCircle,
  Loader2,
  Wand2,
  PenLine,
  MousePointerClick,
  Languages,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useShallow } from 'zustand/react/shallow';
import { DEVICE_PRESETS, useStudioStore } from '@/lib/studio-store';
import { UnsavedChangesPrompt } from '@/components/studio/unsaved-changes-dialog';

const AI_QUICK_ACTIONS = [
  {
    id: 'improve',
    label: 'Improve Copy',
    desc: 'Enhance text clarity and engagement',
    icon: PenLine,
  },
  {
    id: 'cta',
    label: 'Add CTA',
    desc: 'Suggest a call-to-action for this slide',
    icon: MousePointerClick,
  },
  {
    id: 'translate',
    label: 'Translate to Arabic',
    desc: 'Auto-translate all text to Arabic',
    icon: Languages,
  },
  {
    id: 'layout',
    label: 'Auto-Layout',
    desc: 'Reposition elements for optimal balance',
    icon: LayoutGrid,
  },
];

interface StudioTopbarProps {
  groupTitle: string;
  onOpenShortcuts: () => void;
  storiesCount?: number;
}

export function StudioTopbar({ groupTitle, onOpenShortcuts, storiesCount = 0 }: StudioTopbarProps) {
  const {
    deviceId,
    setDeviceId,
    showSafeArea,
    toggleSafeArea,
    zoom,
    zoomIn,
    zoomOut,
    canUndo,
    canRedo,
    isSaving,
    hasUnsavedChanges,
    lastSavedAt,
    markDirty,
  } = useStudioStore(
    useShallow((s) => ({
      deviceId: s.deviceId,
      setDeviceId: s.setDeviceId,
      showSafeArea: s.showSafeArea,
      toggleSafeArea: s.toggleSafeArea,
      zoom: s.zoom,
      zoomIn: s.zoomIn,
      zoomOut: s.zoomOut,
      canUndo: s.canUndo,
      canRedo: s.canRedo,
      isSaving: s.isSaving,
      hasUnsavedChanges: s.hasUnsavedChanges,
      lastSavedAt: s.lastSavedAt,
      markDirty: s.markDirty,
    })),
  );

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-3">
      {/* Left — Logo + Studio + Group name */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <span className="text-xs font-bold text-primary-foreground">H</span>
        </div>
        <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />
        <span className="text-sm font-medium text-muted-foreground">Studio</span>
        <span className="text-sm text-muted-foreground">/</span>
        <span className="text-sm font-medium">{groupTitle}</span>
      </div>

      {/* Center — Device + Safe Area + Zoom */}
      <div className="flex items-center gap-2">
        <Select value={deviceId} onValueChange={setDeviceId}>
          <SelectTrigger className="h-8 w-[180px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEVICE_PRESETS.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name} ({d.width}&times;{d.height})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showSafeArea ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={toggleSafeArea}
              aria-label="Toggle safe area"
            >
              {showSafeArea ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Safe Area</TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-1 rounded-md border border-border bg-muted/50 px-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={zoomOut}
            disabled={zoom <= 50}
            aria-label="Zoom out"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center text-xs tabular-nums">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={zoomIn}
            disabled={zoom >= 200}
            aria-label="Zoom in"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Right — AI Enhance, Undo/Redo, shortcuts, save, actions */}
      <div className="flex items-center gap-2">
        {/* AI Enhance */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
              <Wand2 className="h-3.5 w-3.5" />
              AI Enhance
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-2" align="end">
            <div className="space-y-1">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Quick Actions</p>
              {AI_QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-start transition-colors hover:bg-muted"
                    onClick={() => toast.success(`${action.label} applied (mock)`)}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{action.label}</p>
                      <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-5" />

        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={!canUndo}
                aria-label="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (⌘Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={!canRedo}
                aria-label="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onOpenShortcuts}
              aria-label="Keyboard shortcuts"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Keyboard Shortcuts</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />

        {/* Auto-save indicator */}
        <div className="flex items-center gap-1.5">
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Saving...</span>
            </>
          ) : (
            <>
              <Check className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {lastSavedAt
                  ? `Saved at ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'All changes saved'}
              </span>
            </>
          )}
        </div>

        <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />

        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => {
            if (hasUnsavedChanges) {
              setShowLeaveDialog(true);
            } else {
              window.history.back();
            }
          }}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="h-8"
          onClick={() => {
            if (storiesCount === 0) {
              toast.error('Add at least one story before publishing.');
              return;
            }
            markDirty();
            toast.success('Story published');
          }}
        >
          Publish
        </Button>
      </div>

      <UnsavedChangesPrompt open={showLeaveDialog} onOpenChange={setShowLeaveDialog} />
    </header>
  );
}
