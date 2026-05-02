'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { TEMPLATE_REGISTRY, type TemplateDefinition } from '@/components/studio/templates';

const CATEGORIES = [
  'All',
  'My Templates',
  'Recents',
  'Activation',
  'Conversion',
  'Data Collection',
  'Announcement',
  'Personalization',
  'Special Days',
];

const CATEGORY_MAP: Record<string, string> = {
  Activation: 'activation',
  Conversion: 'conversion',
  'Data Collection': 'data-collection',
  Announcement: 'announcement',
};

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyTemplate?: (template: { name: string; gradient: string; templateId: string }) => void;
}

function TemplateMiniPreview({ template }: { template: TemplateDefinition }) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br',
        template.thumbnail,
      )}
    >
      <span className="text-2xl">{template.thumbnailEmoji}</span>
    </div>
  );
}

export function TemplateGallery({ open, onOpenChange, onApplyTemplate }: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? TEMPLATE_REGISTRY
      : TEMPLATE_REGISTRY.filter((t) => t.category === CATEGORY_MAP[activeCategory]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] max-w-5xl flex-col gap-0 p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Templates
          </DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1">
          {/* Left sidebar — categories */}
          <div className="w-[200px] shrink-0 border-e border-border">
            <ScrollArea className="h-full">
              <div className="space-y-0.5 p-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'flex w-full rounded-md px-3 py-2 text-start text-sm transition-colors',
                      activeCategory === cat
                        ? 'bg-muted font-medium text-foreground'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main grid */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-4 gap-3"
                >
                  {filtered.map((template, i) => (
                    <motion.button
                      key={template.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: i * 0.03,
                      }}
                      onClick={() => {
                        onApplyTemplate?.({
                          name: template.name,
                          gradient: template.thumbnail,
                          templateId: template.id,
                        });
                        onOpenChange(false);
                      }}
                      className="group relative flex aspect-[9/16] items-end overflow-hidden rounded-lg shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg"
                    >
                      <TemplateMiniPreview template={template} />
                      <span className="relative z-10 p-3 text-xs font-medium text-white drop-shadow-md">
                        {template.name}
                      </span>
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-black shadow-md">
                          Use Template
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </AnimatePresence>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Sparkles className="mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">No templates yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Templates in this category will appear here.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
