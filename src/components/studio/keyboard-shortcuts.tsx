'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ShortcutGroup {
  title: string;
  shortcuts: { label: string; keys: string[] }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'General',
    shortcuts: [
      { label: 'Undo', keys: ['⌘', 'Z'] },
      { label: 'Redo', keys: ['⌘', '⇧', 'Z'] },
      { label: 'Save', keys: ['⌘', 'S'] },
      { label: 'Preview', keys: ['⌘', '⇧', 'P'] },
      { label: 'Duplicate', keys: ['⌘', 'D'] },
      { label: 'Delete', keys: ['⌘', '⌫'] },
    ],
  },
  {
    title: 'Tools',
    shortcuts: [
      { label: 'Text tool', keys: ['T'] },
      { label: 'CTA', keys: ['C'] },
      { label: 'Poll', keys: ['P'] },
      { label: 'Media', keys: ['M'] },
      { label: 'Element', keys: ['E'] },
      { label: 'Layers', keys: ['L'] },
    ],
  },
  {
    title: 'Canvas',
    shortcuts: [
      { label: 'Pan canvas', keys: ['Space'] },
      { label: 'Zoom in', keys: ['⌘', '+'] },
      { label: 'Zoom out', keys: ['⌘', '-'] },
      { label: 'Fit to screen', keys: ['⌘', '0'] },
    ],
  },
  {
    title: 'Elements',
    shortcuts: [
      { label: 'Bring forward', keys: ['⌘', ']'] },
      { label: 'Send backward', keys: ['⌘', '['] },
      { label: 'Bring to front', keys: ['⌘', '⇧', ']'] },
      { label: 'Send to back', keys: ['⌘', '⇧', '['] },
      { label: 'Select all', keys: ['⌘', 'A'] },
      { label: 'Deselect', keys: ['Esc'] },
    ],
  },
];

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h4>
              <div className="space-y-1.5">
                {group.shortcuts.map((shortcut) => (
                  <div key={shortcut.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{shortcut.label}</span>
                    <div className="flex items-center gap-0.5">
                      {shortcut.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
