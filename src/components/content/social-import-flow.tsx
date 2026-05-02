'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  CircleDot,
  Grid3x3,
  Image as ImageIcon,
  Loader2,
  Music,
  Play,
  RefreshCw,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SocialView = 'platform-select' | 'instagram' | 'tiktok' | 'import-grid';
export type SocialPlatform = 'instagram' | 'tiktok';
export type SocialContentType = 'stories' | 'posts' | 'reels' | 'videos';

interface SocialImportFlowProps {
  onBack: () => void;
  onImport: (platform: SocialPlatform, contentType: SocialContentType, count: number) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GRADIENTS = [
  'from-rose-500/40 to-orange-500/40',
  'from-blue-500/40 to-purple-500/40',
  'from-emerald-500/40 to-teal-500/40',
  'from-pink-500/40 to-violet-500/40',
  'from-amber-500/40 to-red-500/40',
  'from-cyan-500/40 to-blue-500/40',
  'from-fuchsia-500/40 to-pink-500/40',
  'from-indigo-500/40 to-purple-500/40',
  'from-lime-500/40 to-emerald-500/40',
];

const DURATIONS = ['0:15', '0:30', '0:12', '0:45', '0:08', '0:22', '0:18', '0:35', '0:27'];

const MOCK_CONTENT = Array.from({ length: 9 }, (_, i) => ({
  id: `content-${i}`,
  gradient: GRADIENTS[i],
  duration: DURATIONS[i],
}));

// ---------------------------------------------------------------------------
// Animation variants
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
// Inline SVG icons for social platforms
// ---------------------------------------------------------------------------

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GhostIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C7.58 2 4 5.58 4 10v8c0 .55.45 1 1 1s1-.32 1-.73c0-.55.45-1 1-1s1 .45 1 1c0 .55.45 1 1 1s1-.45 1-1 .45-1 1-1 1 .45 1 1c0 .55.45 1 1 1s1-.45 1-1 .45-1 1-1 1 .45 1 1c0 .41.45.73 1 .73s1-.45 1-1v-8c0-4.42-3.58-8-8-8zm-2 11a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SocialImportFlow({ onBack, onImport }: SocialImportFlowProps) {
  const [view, setView] = useState<SocialView>('platform-select');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [platform, setPlatform] = useState<SocialPlatform | null>(null);
  const [contentType, setContentType] = useState<SocialContentType | null>(null);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

  // -- Navigation --

  function goToPlatform(p: SocialPlatform) {
    setDirection('forward');
    setPlatform(p);
    setView(p);
  }

  function goToImportGrid(type: SocialContentType) {
    setDirection('forward');
    setContentType(type);
    setSelectedItems(new Set());
    setView('import-grid');
  }

  function goBack() {
    setDirection('back');
    if (view === 'import-grid') {
      setView(platform!);
    } else if (view === 'instagram' || view === 'tiktok') {
      setView('platform-select');
    } else {
      onBack();
    }
  }

  // -- Mock OAuth --

  function handleConnect(p: SocialPlatform) {
    setConnecting(true);
    setTimeout(() => {
      if (p === 'instagram') setInstagramConnected(true);
      else setTiktokConnected(true);
      setConnecting(false);
    }, 2000);
  }

  function handleDisconnect(p: SocialPlatform) {
    if (p === 'instagram') {
      setInstagramConnected(false);
      setAutoSync(false);
    } else {
      setTiktokConnected(false);
    }
  }

  // -- Selection --

  function toggleItem(id: string) {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // -- Import --

  function handleImport() {
    if (!platform || !contentType || selectedItems.size === 0) return;
    const count = selectedItems.size;
    setImporting(true);
    const toastId = toast.loading(`Importing ${count} items...`);
    setTimeout(() => {
      toast.dismiss(toastId);
      onImport(platform, contentType, count);
    }, 2000);
  }

  // -- Auto-sync --

  function handleAutoSyncToggle(checked: boolean) {
    setAutoSync(checked);
    if (checked) toast.success('Daily sync enabled');
  }

  const isVideo = contentType === 'reels' || contentType === 'videos';
  const variants = direction === 'forward' ? slideForward : slideBack;

  const contentTypeLabel =
    contentType === 'stories'
      ? 'Stories'
      : contentType === 'posts'
        ? 'Posts'
        : contentType === 'reels'
          ? 'Reels'
          : 'Videos';

  // ── Back button shared element ──

  function BackButton({ onClick }: { onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    );
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <AnimatePresence mode="wait" initial={false}>
        {/* ════════════════════════════════════════════════════════════════ */}
        {/* Platform Select                                                */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {view === 'platform-select' && (
          <motion.div
            key="platform-select"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            <BackButton onClick={onBack} />
            <p className="text-sm font-medium">Import from Social Media</p>

            <div className="space-y-3">
              {/* Instagram */}
              <button
                onClick={() => goToPlatform('instagram')}
                className="flex w-full items-center gap-4 rounded-xl bg-muted/50 p-4 text-start transition-all hover:ring-1 hover:ring-border hover:bg-muted/80"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
                  <InstagramIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Instagram</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Import stories, posts, and reels
                  </p>
                </div>
              </button>

              {/* TikTok */}
              <button
                onClick={() => goToPlatform('tiktok')}
                className="flex w-full items-center gap-4 rounded-xl bg-muted/50 p-4 text-start transition-all hover:ring-1 hover:ring-border hover:bg-muted/80"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground">
                  <Music className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="text-sm font-medium">TikTok</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Import videos from your account
                  </p>
                </div>
              </button>

              {/* Snapchat — disabled / coming soon */}
              <div className="flex w-full items-center gap-4 rounded-xl bg-muted/50 p-4 opacity-50 cursor-not-allowed">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400">
                  <GhostIcon className="h-5 w-5 text-yellow-900" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Snapchat</p>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      Coming Soon
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">Import Spotlight content</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* Instagram Flow                                                 */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {view === 'instagram' && (
          <motion.div
            key="instagram"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            <BackButton onClick={goBack} />
            <p className="text-sm font-medium">Import from Instagram</p>

            {!instagramConnected ? (
              <div className="rounded-xl bg-muted/50 p-6 space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
                  <InstagramIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Connect Instagram Business Account</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Link your account to import content
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleConnect('instagram')}
                  disabled={connecting}
                  className="gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <InstagramIcon className="h-4 w-4" />
                      Connect with Instagram
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <>
                {/* Connected state */}
                <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Connected as @hikayat_store</p>
                      <p className="text-xs text-muted-foreground">Instagram Business Account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect('instagram')}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Import options */}
                <div className="space-y-3">
                  {/* Auto-sync Daily Stories */}
                  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">Auto-sync Daily Stories</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Automatically sync your Instagram Stories every day
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={autoSync}
                      onCheckedChange={handleAutoSyncToggle}
                      className="shrink-0 ms-3"
                    />
                  </div>

                  {/* Import Stories */}
                  <button
                    onClick={() => goToImportGrid('stories')}
                    className="flex w-full items-center gap-3 rounded-xl bg-muted/50 p-4 text-start transition-all hover:ring-1 hover:ring-border hover:bg-muted/80"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <CircleDot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Import Stories</p>
                      <p className="text-xs text-muted-foreground">
                        Select specific stories to import
                      </p>
                    </div>
                  </button>

                  {/* Import Posts */}
                  <button
                    onClick={() => goToImportGrid('posts')}
                    className="flex w-full items-center gap-3 rounded-xl bg-muted/50 p-4 text-start transition-all hover:ring-1 hover:ring-border hover:bg-muted/80"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Import Posts</p>
                      <p className="text-xs text-muted-foreground">Import posts as story slides</p>
                    </div>
                  </button>

                  {/* Import Reels */}
                  <button
                    onClick={() => goToImportGrid('reels')}
                    className="flex w-full items-center gap-3 rounded-xl bg-muted/50 p-4 text-start transition-all hover:ring-1 hover:ring-border hover:bg-muted/80"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Video className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Import Reels</p>
                      <p className="text-xs text-muted-foreground">Import Reels as video stories</p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TikTok Flow                                                    */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {view === 'tiktok' && (
          <motion.div
            key="tiktok"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            <BackButton onClick={goBack} />
            <p className="text-sm font-medium">Import from TikTok</p>

            {!tiktokConnected ? (
              <div className="rounded-xl bg-muted/50 p-6 space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
                  <Music className="h-6 w-6 text-background" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Connect TikTok Account</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Link your account to import content
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleConnect('tiktok')}
                  disabled={connecting}
                  className="gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Music className="h-4 w-4" />
                      Connect with TikTok
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <>
                {/* Connected state */}
                <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Connected as @hikayat_store</p>
                      <p className="text-xs text-muted-foreground">TikTok Account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect('tiktok')}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Import Videos */}
                <button
                  onClick={() => goToImportGrid('videos')}
                  className="flex w-full items-center gap-3 rounded-xl bg-muted/50 p-4 text-start transition-all hover:ring-1 hover:ring-border hover:bg-muted/80"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Video className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Import Videos</p>
                    <p className="text-xs text-muted-foreground">Select TikTok videos to import</p>
                  </div>
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* Import Grid (shared for Stories / Posts / Reels / Videos)       */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {view === 'import-grid' && (
          <motion.div
            key="import-grid"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            <BackButton onClick={goBack} />
            <p className="text-sm font-medium">Import {contentTypeLabel}</p>

            {/* 3×3 grid */}
            <div className="grid grid-cols-3 gap-2">
              {MOCK_CONTENT.map((item) => {
                const selected = selectedItems.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      'relative aspect-square rounded-lg overflow-hidden transition-all',
                      selected
                        ? 'ring-2 ring-foreground'
                        : 'ring-1 ring-transparent hover:ring-border',
                    )}
                  >
                    {/* Gradient placeholder */}
                    <div
                      className={cn(
                        'absolute inset-0 bg-gradient-to-br flex items-center justify-center',
                        item.gradient,
                      )}
                    >
                      <ImageIcon className="h-6 w-6 text-white/40" />
                    </div>

                    {/* Checkbox (neutral style) */}
                    <div className="absolute top-1.5 end-1.5 pointer-events-none">
                      <Checkbox
                        checked={selected}
                        tabIndex={-1}
                        className="h-4 w-4 rounded border-white/60 bg-black/30 data-[state=checked]:bg-foreground data-[state=checked]:text-background data-[state=checked]:border-foreground"
                      />
                    </div>

                    {/* Video indicators (reels / videos only) */}
                    {isVideo && (
                      <div className="absolute bottom-1.5 start-1.5 flex items-center gap-1">
                        <Play className="h-3 w-3 text-white fill-white" />
                        <span className="text-[10px] font-medium text-white drop-shadow">
                          {item.duration}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sticky bottom bar */}
            <div className="sticky bottom-0 flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{selectedItems.size}</span> selected
              </p>
              <Button
                onClick={handleImport}
                disabled={selectedItems.size === 0 || importing}
                size="sm"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin me-2" />
                    Importing...
                  </>
                ) : (
                  'Import Selected'
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
