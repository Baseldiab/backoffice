'use client';

import React from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Signal, Wifi, BatteryFull, Plus, ImageIcon, Video, Sparkles } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DEVICE_PRESETS, useStudioStore } from '@/lib/studio-store';
import { getTemplateById } from '@/components/studio/templates';
import type { Story } from '@/lib/types';

const ARABIC_FONT_NAMES = new Set([
  'Cairo',
  'Tajawal',
  'Almarai',
  'Noto Kufi Arabic',
  'IBM Plex Sans Arabic',
  'Scheherazade New',
  'Changa',
  'El Messiri',
  'Lemonada',
  'Readex Pro',
]);

/** A story is "blank" if it has no visual content */
function isBlankStory(story: Story): boolean {
  return (
    !story.thumbnail &&
    !story.gradient &&
    !story.templateId &&
    !(story.type === 'video' && story.videoUrl)
  );
}

interface CanvasPreviewProps {
  stories: Story[];
  onOpenAI?: () => void;
}

/** Renders the background media layer for a story that has content */
function StoryMedia({ story }: { story: Story }) {
  // Template component rendering
  if (story.templateId) {
    const templateDef = getTemplateById(story.templateId);
    if (templateDef) {
      const TemplateComponent = templateDef.component;
      return (
        <motion.div
          key={story.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          <TemplateComponent width={393} height={852} />
        </motion.div>
      );
    }
  }

  if (story.gradient) {
    return (
      <motion.div
        key={story.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={cn('absolute inset-0 z-0 bg-gradient-to-br', story.gradient)}
      />
    );
  }

  if (story.type === 'video' && story.videoUrl) {
    return (
      <motion.div
        key={story.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="absolute inset-0 z-0"
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          key={story.videoUrl}
          src={story.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>
    );
  }

  if (story.thumbnail) {
    return (
      <motion.img
        key={story.id}
        src={story.thumbnail}
        alt={story.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
    );
  }

  // Blank story — plain muted background, no text
  return (
    <motion.div
      key={story.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-0 bg-muted/30"
    />
  );
}

// ─── Template click zones ────────────────────────────────────────────────────
// Defines clickable regions for each template type so the user can "select"
// elements (text, image, CTA, options) and see the Properties panel update.

type ElementType = 'text' | 'image' | 'cta' | 'options';

interface ClickZone {
  id: string;
  label: string;
  type: ElementType;
  /** CSS position values as percentages */
  top: string;
  left: string;
  width: string;
  height: string;
}

const TEMPLATE_CLICK_ZONES: Record<string, ClickZone[]> = {
  'flash-sale': [
    {
      id: 'tpl-title',
      label: '50% OFF',
      type: 'text',
      top: '30%',
      left: '15%',
      width: '70%',
      height: '18%',
    },
    {
      id: 'tpl-cta',
      label: 'Shop Now',
      type: 'cta',
      top: '78%',
      left: '20%',
      width: '60%',
      height: '8%',
    },
  ],
  'new-arrival': [
    {
      id: 'tpl-image',
      label: 'Product Image',
      type: 'image',
      top: '22%',
      left: '20%',
      width: '60%',
      height: '30%',
    },
    {
      id: 'tpl-title',
      label: 'Product Name',
      type: 'text',
      top: '55%',
      left: '15%',
      width: '70%',
      height: '12%',
    },
    {
      id: 'tpl-cta',
      label: 'Discover More',
      type: 'cta',
      top: '78%',
      left: '20%',
      width: '60%',
      height: '8%',
    },
  ],
  poll: [
    {
      id: 'tpl-title',
      label: 'What do you think?',
      type: 'text',
      top: '14%',
      left: '10%',
      width: '80%',
      height: '12%',
    },
    {
      id: 'tpl-options',
      label: 'Poll Options',
      type: 'options',
      top: '42%',
      left: '8%',
      width: '84%',
      height: '22%',
    },
  ],
  quiz: [
    {
      id: 'tpl-title',
      label: 'Quiz Question',
      type: 'text',
      top: '10%',
      left: '10%',
      width: '80%',
      height: '16%',
    },
    {
      id: 'tpl-options',
      label: 'Answer Options',
      type: 'options',
      top: '34%',
      left: '8%',
      width: '84%',
      height: '42%',
    },
  ],
  countdown: [
    {
      id: 'tpl-title',
      label: 'Coming Soon',
      type: 'text',
      top: '14%',
      left: '15%',
      width: '70%',
      height: '10%',
    },
    {
      id: 'tpl-cta',
      label: 'Notify Me',
      type: 'cta',
      top: '78%',
      left: '20%',
      width: '60%',
      height: '8%',
    },
  ],
  'swipe-cta': [
    {
      id: 'tpl-image',
      label: 'Background Image',
      type: 'image',
      top: '0%',
      left: '0%',
      width: '100%',
      height: '50%',
    },
    {
      id: 'tpl-title',
      label: 'Offer Text',
      type: 'text',
      top: '60%',
      left: '10%',
      width: '80%',
      height: '15%',
    },
    {
      id: 'tpl-cta',
      label: 'Swipe Up CTA',
      type: 'cta',
      top: '80%',
      left: '25%',
      width: '50%',
      height: '10%',
    },
  ],
  welcome: [
    {
      id: 'tpl-title',
      label: 'Welcome Text',
      type: 'text',
      top: '15%',
      left: '10%',
      width: '80%',
      height: '22%',
    },
    {
      id: 'tpl-cta',
      label: 'Get Started',
      type: 'cta',
      top: '78%',
      left: '20%',
      width: '60%',
      height: '8%',
    },
  ],
  testimonial: [
    {
      id: 'tpl-title',
      label: 'Review Text',
      type: 'text',
      top: '28%',
      left: '10%',
      width: '80%',
      height: '22%',
    },
    {
      id: 'tpl-image',
      label: 'Reviewer Avatar',
      type: 'image',
      top: '60%',
      left: '25%',
      width: '50%',
      height: '12%',
    },
  ],
  event: [
    {
      id: 'tpl-title',
      label: 'Event Name',
      type: 'text',
      top: '24%',
      left: '10%',
      width: '80%',
      height: '12%',
    },
    {
      id: 'tpl-cta',
      label: 'RSVP Now',
      type: 'cta',
      top: '78%',
      left: '20%',
      width: '60%',
      height: '8%',
    },
  ],
  'product-showcase': [
    {
      id: 'tpl-image',
      label: 'Product Image',
      type: 'image',
      top: '16%',
      left: '18%',
      width: '65%',
      height: '32%',
    },
    {
      id: 'tpl-title',
      label: 'Product Info',
      type: 'text',
      top: '52%',
      left: '10%',
      width: '80%',
      height: '18%',
    },
    {
      id: 'tpl-cta',
      label: 'Add to Cart',
      type: 'cta',
      top: '78%',
      left: '8%',
      width: '84%',
      height: '8%',
    },
  ],
  ramadan: [
    {
      id: 'tpl-title',
      label: 'Greeting Text',
      type: 'text',
      top: '32%',
      left: '10%',
      width: '80%',
      height: '20%',
    },
    {
      id: 'tpl-cta',
      label: 'Shop Collection',
      type: 'cta',
      top: '78%',
      left: '15%',
      width: '70%',
      height: '8%',
    },
  ],
  'national-day': [
    {
      id: 'tpl-title',
      label: 'Celebration Text',
      type: 'text',
      top: '35%',
      left: '10%',
      width: '80%',
      height: '22%',
    },
    {
      id: 'tpl-cta',
      label: 'Shop Now',
      type: 'cta',
      top: '78%',
      left: '20%',
      width: '60%',
      height: '8%',
    },
  ],
};

function TemplateClickOverlay({
  templateId,
  selectedElement,
  onSelect,
}: {
  templateId: string;
  selectedElement: string | null;
  onSelect: (id: string | null, type: ElementType) => void;
}) {
  const zones = TEMPLATE_CLICK_ZONES[templateId] ?? [];

  return (
    <div className="absolute inset-0 z-10">
      {zones.map((zone) => {
        const isSelected = selectedElement === zone.id;
        return (
          <div
            key={zone.id}
            role="button"
            tabIndex={0}
            aria-label={zone.label}
            className={cn(
              'absolute cursor-pointer transition-all',
              isSelected
                ? 'border-2 border-dashed border-primary/80 bg-primary/5'
                : 'border border-transparent hover:border-dashed hover:border-white/30 hover:bg-white/5',
            )}
            style={{
              top: zone.top,
              left: zone.left,
              width: zone.width,
              height: zone.height,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(isSelected ? null : zone.id, zone.type);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(isSelected ? null : zone.id, zone.type);
              }
            }}
          >
            {isSelected && (
              <span className="absolute -top-5 start-0 whitespace-nowrap rounded bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground">
                {zone.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CanvasPreview({ stories, onOpenAI }: CanvasPreviewProps) {
  const {
    deviceId,
    showSafeArea,
    zoom,
    activeStoryIndex,
    setSelectedElement,
    selectedFont,
    selectedElement,
  } = useStudioStore(
    useShallow((s) => ({
      deviceId: s.deviceId,
      showSafeArea: s.showSafeArea,
      zoom: s.zoom,
      activeStoryIndex: s.activeStoryIndex,
      setSelectedElement: s.setSelectedElement,
      selectedFont: s.selectedFont,
      selectedElement: s.selectedElement,
    })),
  );

  const device = DEVICE_PRESETS.find((d) => d.id === deviceId) ?? DEVICE_PRESETS[0];
  const scale = zoom / 100;
  const activeStory = stories[activeStoryIndex] ?? null;
  const isBlank = activeStory ? isBlankStory(activeStory) : false;

  return (
    <div
      className="flex flex-1 items-center justify-center overflow-hidden bg-muted/20"
      onClick={() => setSelectedElement(null)}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative overflow-hidden rounded-[2.5rem] border-2 border-border bg-background shadow-2xl"
        style={{
          width: device.width * scale,
          height: device.height * scale,
          maxHeight: 'calc(100vh - 12rem)',
          maxWidth: 'calc((100vh - 12rem) * 9 / 16)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Story media background */}
        <AnimatePresence mode="wait">
          {activeStory ? (
            <StoryMedia story={activeStory} />
          ) : (
            <motion.div
              key="no-stories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-0 bg-muted/30"
            />
          )}
        </AnimatePresence>

        {/* Add Content overlay — blank story or no stories */}
        {(!activeStory || isBlank) && (
          <div className="absolute inset-0 z-10 flex h-full flex-col items-center justify-center gap-3">
            <Plus className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Add Content</p>
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-48 gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info('Upload: Coming in production');
                }}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Upload Image
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-48 gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info('Upload: Coming in production');
                }}
              >
                <Video className="h-3.5 w-3.5" />
                Upload Video
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-48 gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAI?.();
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Use AI
              </Button>
            </div>
          </div>
        )}

        {/* Template element interaction overlay — clickable zones for template elements */}
        {activeStory?.templateId && (
          <TemplateClickOverlay
            templateId={activeStory.templateId}
            selectedElement={selectedElement}
            onSelect={(id, type) => {
              setSelectedElement(id, type);
            }}
          />
        )}

        {/* Text element overlay — only for non-template stories with content */}
        {activeStory &&
          !isBlank &&
          !activeStory.templateId &&
          (() => {
            const isArabicFont = ARABIC_FONT_NAMES.has(selectedFont);
            const dir = isArabicFont ? 'rtl' : 'ltr';
            return (
              <div
                className={cn(
                  'absolute inset-x-0 top-1/3 z-10 flex flex-col items-center gap-2 px-6 text-center',
                  selectedElement === 'layer-1' &&
                    'ring-2 ring-primary/60 ring-offset-2 ring-offset-transparent rounded-md mx-4',
                )}
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElement(selectedElement === 'layer-1' ? null : 'layer-1');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedElement(selectedElement === 'layer-1' ? null : 'layer-1');
                  }
                }}
                aria-label="Text element"
              >
                <p
                  style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                  className="text-xl font-bold text-white drop-shadow-lg"
                  dir={dir}
                >
                  {isArabicFont ? 'عنوان القصة' : 'Story Title'}
                </p>
                <p
                  style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                  className="text-sm text-white/80 drop-shadow-md"
                  dir={dir}
                >
                  {isArabicFont ? 'نص وصفي هنا' : 'Subtitle text here'}
                </p>
              </div>
            );
          })()}

        {/* Story progress bar */}
        <div className="absolute inset-x-0 top-0 z-20 flex gap-1 px-4 pt-2">
          {stories.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-0.5 flex-1 rounded-full',
                i <= activeStoryIndex ? 'bg-white' : 'bg-white/30',
              )}
            />
          ))}
        </div>

        {/* Status bar mockup */}
        <div className="relative z-10 flex h-11 items-center justify-between px-8 pt-1">
          <span className="text-[10px] font-medium text-white drop-shadow-sm">9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="h-3 w-3 text-white drop-shadow-sm" />
            <Wifi className="h-3 w-3 text-white drop-shadow-sm" />
            <BatteryFull className="h-3 w-3 text-white drop-shadow-sm" />
          </div>
        </div>

        {/* Safe area overlay — top */}
        {showSafeArea && (
          <div className="absolute inset-x-0 top-0 z-30 h-11 border-b border-dashed border-amber-500/40">
            <span className="absolute end-2 top-0.5 text-[8px] font-medium text-amber-500/60">
              Safe Zone
            </span>
          </div>
        )}

        {/* Safe area overlay — bottom */}
        {showSafeArea && (
          <div className="absolute inset-x-0 bottom-0 z-30 h-[34px] border-t border-dashed border-amber-500/40">
            <span className="absolute start-2 bottom-0.5 text-[8px] font-medium text-amber-500/60">
              Safe Zone
            </span>
          </div>
        )}

        {/* Home indicator */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex h-[34px] items-end justify-center pb-2">
          <div className="h-1 w-28 rounded-full bg-white/30" />
        </div>
      </motion.div>
    </div>
  );
}
