'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LayoutTemplate, Plus, Rss, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  SocialImportFlow,
  type SocialPlatform,
  type SocialContentType,
} from '@/components/content/social-import-flow';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type View = 'options' | 'social' | 'rss';

// ---------------------------------------------------------------------------
// Slide variants for view transitions
// ---------------------------------------------------------------------------

const slideForward = {
  initial: { x: 40, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: { x: -40, opacity: 0, transition: { duration: 0.15 } },
};

const slideBack = {
  initial: { x: -40, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: { x: 40, opacity: 0, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreateGroupDialog({ open, onOpenChange }: CreateGroupDialogProps) {
  const router = useRouter();
  const [view, setView] = useState<View>('options');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  // RSS sub-form state
  const [rssName, setRssName] = useState('');
  const [rssUrl, setRssUrl] = useState('');

  const reset = useCallback(() => {
    setView('options');
    setDirection('forward');
    setRssName('');
    setRssUrl('');
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  // -- Navigation helpers --

  function navigateToStudio(queryExtra = '') {
    const groupId = `sg-new-${Date.now()}`;
    const groupTitle = encodeURIComponent('Untitled Story Group');
    handleOpenChange(false);
    router.push(`/studio/new?group=${groupId}&groupTitle=${groupTitle}${queryExtra}`);
  }

  function handleSocialImport(
    platform: SocialPlatform,
    _contentType: SocialContentType,
    count: number,
  ) {
    const platformName = platform === 'instagram' ? 'Instagram' : 'TikTok';
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const groupTitle = `${platformName} Import — ${dateStr}`;
    const groupId = `sg-new-${Date.now()}`;
    handleOpenChange(false);
    router.push(
      `/studio/new?group=${groupId}&groupTitle=${encodeURIComponent(groupTitle)}&source=${platform}`,
    );
    toast.success(`${count} stories imported from ${platformName}`);
  }

  function handleRssCreate() {
    const groupId = `sg-new-${Date.now()}`;
    const groupTitle = encodeURIComponent(rssName.trim() || 'RSS Import');
    handleOpenChange(false);
    router.push(`/studio/new?group=${groupId}&groupTitle=${groupTitle}&source=rss`);
  }

  const variants = direction === 'forward' ? slideForward : slideBack;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[540px] flex flex-col overflow-visible">
        <SheetHeader>
          <SheetTitle>New Story Group</SheetTitle>
          <SheetDescription>Choose how you want to create your stories.</SheetDescription>
        </SheetHeader>

        {/* Animated view content */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-visible mt-4 py-2">
          <AnimatePresence mode="wait" initial={false}>
            {/* ── Social Import Flow ── */}
            {view === 'social' && (
              <motion.div
                key="social"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="px-1"
              >
                <SocialImportFlow
                  onBack={() => {
                    setDirection('back');
                    setView('options');
                  }}
                  onImport={handleSocialImport}
                />
              </motion.div>
            )}

            {/* ── RSS Form ── */}
            {view === 'rss' && (
              <motion.div
                key="rss"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4 px-1"
              >
                <button
                  onClick={() => {
                    setDirection('back');
                    setView('options');
                  }}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <p className="text-sm font-medium">Create from RSS Feed</p>

                <div className="rounded-xl bg-muted/50 p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rss-name">Feed Name</Label>
                    <Input
                      id="rss-name"
                      placeholder="e.g. Company Blog"
                      value={rssName}
                      onChange={(e) => setRssName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rss-url">Feed URL</Label>
                    <Input
                      id="rss-url"
                      placeholder="https://example.com/feed.xml"
                      value={rssUrl}
                      onChange={(e) => setRssUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    disabled={!rssName.trim() || !rssUrl.trim()}
                    onClick={handleRssCreate}
                    className="w-full"
                  >
                    Create
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Creation Method Options (default) ── */}
            {view === 'options' && (
              <motion.div
                key="options"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-3 px-1"
              >
                {/* Create from Scratch */}
                <button
                  onClick={() => navigateToStudio()}
                  className="flex w-full items-center gap-4 rounded-xl bg-muted/50 p-4 text-start transition-all hover:ring-1 hover:ring-border hover:bg-muted/80"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Create from Scratch</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Start with a blank canvas in the Studio
                    </p>
                  </div>
                </button>

                {/* Use AI */}
                <button
                  onClick={() => navigateToStudio('&panel=ai')}
                  className="flex w-full items-center gap-4 rounded-xl bg-muted/50 p-4 text-start transition-all hover:ring-1 hover:ring-border hover:bg-muted/80"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Use AI</p>
                      <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary">
                        New
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Describe your story and let AI generate it
                    </p>
                  </div>
                </button>

                {/* Use Template */}
                <button
                  onClick={() => navigateToStudio('&panel=templates')}
                  className="flex w-full items-center gap-4 rounded-xl bg-muted/50 p-4 text-start transition-all hover:ring-1 hover:ring-border hover:bg-muted/80"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <LayoutTemplate className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Use Template</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Pick from ready-made story designs
                    </p>
                  </div>
                </button>

                {/* Import from Social Media */}
                <button
                  onClick={() => {
                    setDirection('forward');
                    setView('social');
                  }}
                  className="flex w-full items-center gap-4 rounded-xl bg-muted/50 p-4 text-start transition-all hover:ring-1 hover:ring-border hover:bg-muted/80"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Share2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Import from Social Media</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Import from Instagram, TikTok, or Snapchat
                    </p>
                  </div>
                </button>

                {/* Create from RSS Feed */}
                <button
                  onClick={() => {
                    setDirection('forward');
                    setView('rss');
                  }}
                  className="flex w-full items-center gap-4 rounded-xl bg-muted/50 p-4 text-start transition-all hover:ring-1 hover:ring-border hover:bg-muted/80"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Rss className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Create from RSS Feed</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Auto-generate stories from your RSS feed
                    </p>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
