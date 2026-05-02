'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { StoryGroupStatus } from '@/lib/types';

type StatusTab = 'all' | StoryGroupStatus;

interface StatusTabsProps {
  activeTab: StatusTab;
  onTabChange: (tab: StatusTab) => void;
  counts: Record<StatusTab, number>;
}

const TABS: { value: StatusTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'test', label: 'Test' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'archived', label: 'Archived' },
];

export function StatusTabs({ activeTab, onTabChange, counts }: StatusTabsProps) {
  return (
    <ScrollArea className="min-w-0 max-w-full">
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as StatusTab)}>
        <TabsList className="bg-muted/50">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs">
              {tab.label}
              <AnimatePresence mode="wait">
                <motion.span
                  key={counts[tab.value]}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground"
                >
                  {counts[tab.value]}
                </motion.span>
              </AnimatePresence>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ScrollBar orientation="horizontal" className="h-1.5" />
    </ScrollArea>
  );
}

export type { StatusTab };
