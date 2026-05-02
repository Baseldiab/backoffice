'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface AISlide {
  name: string;
  gradient: string;
}

interface AIPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slides: AISlide[];
  onApplyAll: () => void;
  onRegenerate: () => void;
}

export function AIPreviewModal({
  open,
  onOpenChange,
  slides,
  onApplyAll,
  onRegenerate,
}: AIPreviewModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  if (!slides.length) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Generated Story
          </DialogTitle>
          <DialogDescription>
            Preview the {slides.length} generated slides before adding them to your story.
          </DialogDescription>
        </DialogHeader>

        {/* Carousel */}
        <div className="relative flex items-center justify-center py-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute start-0 z-10 h-8 w-8"
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div
            className={cn(
              'mx-12 flex aspect-[9/16] w-48 items-end overflow-hidden rounded-2xl bg-gradient-to-br p-4 shadow-lg',
              activeSlide?.gradient,
            )}
          >
            <div className="space-y-1">
              <p className="text-sm font-bold text-white drop-shadow-md">{activeSlide?.name}</p>
              <p className="text-[10px] text-white/70">
                Slide {activeIndex + 1} of {slides.length}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute end-0 z-10 h-8 w-8"
            onClick={() => setActiveIndex((i) => Math.min(slides.length - 1, i + 1))}
            disabled={activeIndex === slides.length - 1}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === activeIndex ? 'w-4 bg-foreground' : 'w-1.5 bg-muted-foreground/40',
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <DialogFooter className="flex-row justify-end gap-2 sm:gap-2">
          <Button variant="outline" size="sm" onClick={onRegenerate}>
            Regenerate
          </Button>
          <Button size="sm" onClick={onApplyAll}>
            Apply All ({slides.length} slides)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
