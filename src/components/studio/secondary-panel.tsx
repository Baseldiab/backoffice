'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Circle,
  Square,
  Star,
  Triangle,
  Minus,
  GripVertical,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MessageSquare,
  HelpCircle,
  Smile,
  Timer,
  MousePointerClick,
  ArrowUp,
  Link2,
  Type,
  Sparkles,
  Camera,
  Video,
  SeparatorHorizontal,
  MessageCircleQuestion,
  Plus,
  Upload,
  Wand2,
  Loader2,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
import { type RailTool, useStudioStore } from '@/lib/studio-store';
import { TEMPLATE_REGISTRY, type TemplateDefinition } from '@/components/studio/templates';

const PANEL_LABELS: Record<RailTool, string> = {
  ai: 'AI Generate',
  templates: 'Templates',
  text: 'Text',
  cta: 'Call to Action',
  interactive: 'Interactive',
  media: 'Media',
  element: 'Elements',
  layers: 'Layers',
};

// ─── AI Generate Panel ──────────────────────────────────────────────────────

const AI_STORY_TYPES = [
  { value: 'promotional', label: 'Promotional' },
  { value: 'educational', label: 'Educational' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'announcement', label: 'Announcement' },
];

const AI_STYLES = [
  { id: 'minimal', label: 'Minimal', gradient: 'from-zinc-700 to-zinc-900' },
  { id: 'bold', label: 'Bold', gradient: 'from-rose-500 to-orange-500' },
  { id: 'elegant', label: 'Elegant', gradient: 'from-violet-600 to-indigo-600' },
  { id: 'playful', label: 'Playful', gradient: 'from-cyan-400 to-blue-500' },
];

const AI_LANGUAGES = ['English', 'Arabic', 'French'];

const AI_SLIDE_OPTIONS = [3, 4, 5, 6];

/** Multiple gradient sets so regeneration produces visually different results */
const AI_GRADIENT_SETS = [
  [
    'from-violet-600 to-indigo-600',
    'from-fuchsia-500 to-purple-600',
    'from-rose-500 to-orange-400',
    'from-pink-500 to-rose-500',
    'from-amber-400 to-yellow-500',
    'from-cyan-500 to-blue-600',
  ],
  [
    'from-emerald-500 to-teal-600',
    'from-sky-500 to-indigo-500',
    'from-amber-500 to-red-500',
    'from-lime-500 to-emerald-500',
    'from-orange-500 to-pink-500',
    'from-blue-600 to-violet-600',
  ],
  [
    'from-rose-400 to-fuchsia-600',
    'from-teal-400 to-cyan-600',
    'from-indigo-400 to-purple-600',
    'from-yellow-400 to-orange-500',
    'from-green-500 to-teal-500',
    'from-red-500 to-rose-600',
  ],
];

const SLIDE_NAMES = ['Hook', 'Body', 'Detail', 'Social Proof', 'CTA', 'Outro'];

interface AIResult {
  id: string;
  name: string;
  gradient: string;
}

function generateMockSlides(count: number, setIndex: number): AIResult[] {
  const gradients = AI_GRADIENT_SETS[setIndex % AI_GRADIENT_SETS.length];
  return Array.from({ length: count }, (_, i) => ({
    id: `ai-${setIndex}-${i}`,
    name: `Slide ${i + 1} — ${SLIDE_NAMES[i] ?? `Slide ${i + 1}`}`,
    gradient: gradients[i % gradients.length],
  }));
}

function AIContent({
  onApplyAI,
  onViewChange,
  backToPromptTrigger,
}: {
  onApplyAI?: (slides: { name: string; gradient: string }[]) => void;
  onViewChange?: (view: 'form' | 'loading' | 'results') => void;
  backToPromptTrigger?: number;
}) {
  const [prompt, setPrompt] = useState('');
  const [storyType, setStoryType] = useState('promotional');
  const [slideCount, setSlideCount] = useState(3);
  const [selectedStyle, setSelectedStyle] = useState('minimal');
  const [language, setLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AIResult[] | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [credits, setCredits] = useState(10);

  // Notify parent of current view state
  React.useEffect(() => {
    if (isGenerating) onViewChange?.('loading');
    else if (results) onViewChange?.('results');
    else onViewChange?.('form');
  }, [isGenerating, results, onViewChange]);

  // Parent triggered "back to prompt" via header back button
  React.useEffect(() => {
    if (backToPromptTrigger && backToPromptTrigger > 0) {
      setResults(null);
    }
  }, [backToPromptTrigger]);

  function handleGenerate() {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResults(null);
    const currentGen = generationCount;
    setTimeout(() => {
      setIsGenerating(false);
      setResults(generateMockSlides(slideCount, currentGen));
      setGenerationCount((c) => c + 1);
      setCredits((c) => Math.max(0, c - 1));
    }, 3000);
  }

  function handleRegenerate() {
    setIsGenerating(true);
    setResults(null);
    const currentGen = generationCount;
    setTimeout(() => {
      const newSlides = generateMockSlides(slideCount, currentGen);
      setIsGenerating(false);
      setResults(newSlides);
      setGenerationCount((c) => c + 1);
      setCredits((c) => Math.max(0, c - 1));
      toast.success(`Story regenerated — ${newSlides.length} new slides`);
    }, 3000);
  }

  function handleApply() {
    if (!results) return;
    onApplyAI?.(results.map((r) => ({ name: r.name, gradient: r.gradient })));
    setResults(null);
    setPrompt('');
  }

  // ── Results view (replaces entire form) ──────────────────────────────────
  if (results && !isGenerating) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-3 p-3">
          {/* Header */}
          <p className="text-xs font-medium">Generated Slides — {results.length} slides</p>

          {/* Credits counter */}
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {credits} AI credit{credits !== 1 ? 's' : ''} remaining
            </span>
          </div>

          {/* Slide grid */}
          <div className="grid grid-cols-2 gap-2">
            {results.map((slide) => (
              <div
                key={slide.id}
                className={cn(
                  'group relative flex aspect-[9/16] items-end overflow-hidden rounded-lg bg-gradient-to-br p-2',
                  slide.gradient,
                )}
              >
                <span className="text-[9px] font-medium text-white/80">{slide.name}</span>
                <div className="absolute end-1 top-1">
                  <Sparkles className="h-3 w-3 text-white/60" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 flex gap-2 border-t border-border bg-card/90 p-3 backdrop-blur-sm">
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleRegenerate}>
            Regenerate
          </Button>
          <Button size="sm" className="flex-1 text-xs" onClick={handleApply}>
            Apply All
          </Button>
        </div>
      </div>
    );
  }

  // ── Loading view (replaces entire form) ──────────────────────────────────
  if (isGenerating) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-3 p-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <p className="text-xs font-medium">Generating {slideCount} slides...</p>
          </div>
          <p className="text-[10px] text-muted-foreground">This usually takes a few seconds.</p>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: slideCount }).map((_, i) => (
              <Skeleton key={i} className="aspect-[9/16] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Form view (default) ──────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-3">
        {/* Credits counter */}
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {credits} AI credit{credits !== 1 ? 's' : ''} remaining
          </span>
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <Label className="text-xs">Describe your story</Label>
          <Textarea
            placeholder="e.g. A flash sale for Ramadan with countdown and swipe-up CTA..."
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="resize-none text-xs"
          />
        </div>

        {/* Story Type */}
        <div className="space-y-2">
          <Label className="text-xs">Story Type</Label>
          <Select value={storyType} onValueChange={setStoryType}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AI_STORY_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Slides Count */}
        <div className="space-y-2">
          <Label className="text-xs">Number of Slides</Label>
          <div className="flex gap-1.5">
            {AI_SLIDE_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setSlideCount(n)}
                className={cn(
                  'flex h-8 flex-1 items-center justify-center rounded-md text-xs font-medium transition-colors',
                  slideCount === n
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="space-y-2">
          <Label className="text-xs">Style</Label>
          <div className="grid grid-cols-2 gap-2">
            {AI_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={cn(
                  'flex aspect-[4/3] items-end rounded-lg bg-gradient-to-br p-2 transition-all',
                  style.gradient,
                  selectedStyle === style.id
                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                    : 'opacity-70 hover:opacity-100',
                )}
              >
                <span className="text-[10px] font-medium text-white">{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label className="text-xs">Language</Label>
          <div className="flex gap-1.5">
            {AI_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  'rounded-full px-3 py-1 text-[10px] font-medium transition-colors',
                  language === lang
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Generate Button */}
      <div className="sticky bottom-0 border-t border-border bg-card/80 p-3 backdrop-blur-sm">
        <Button
          className="w-full gap-2"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
        >
          <Wand2 className="h-4 w-4" />
          Generate Story
        </Button>
      </div>
    </div>
  );
}

// ─── Templates Panel ────────────────────────────────────────────────────────

const TEMPLATE_CATEGORIES = ['All', 'Activation', 'Conversion', 'Data Collection', 'Announcement'];

const CATEGORY_MAP: Record<string, string> = {
  Activation: 'activation',
  Conversion: 'conversion',
  'Data Collection': 'data-collection',
  Announcement: 'announcement',
};

function TemplateMiniCard({ template }: { template: TemplateDefinition }) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br',
        template.thumbnail,
      )}
    >
      <span className="text-xl">{template.thumbnailEmoji}</span>
      <span className="px-2 text-center text-[9px] font-medium leading-tight text-white drop-shadow-sm">
        {template.name}
      </span>
    </div>
  );
}

function TemplatesContent({
  onOpenGallery,
  onApplyTemplate,
}: {
  onOpenGallery: () => void;
  onApplyTemplate?: (template: { name: string; gradient: string; templateId: string }) => void;
}) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? TEMPLATE_REGISTRY
      : TEMPLATE_REGISTRY.filter((t) => t.category === CATEGORY_MAP[activeCategory]);

  return (
    <div className="space-y-3 p-3">
      <Button variant="outline" className="w-full gap-2" onClick={onOpenGallery}>
        <Sparkles className="h-4 w-4" />
        Get some inspiration
      </Button>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors',
              activeCategory === cat
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((template) => (
          <button
            key={template.id}
            onClick={() =>
              onApplyTemplate?.({
                name: template.name,
                gradient: template.thumbnail,
                templateId: template.id,
              })
            }
            className="group relative flex aspect-[9/16] items-end overflow-hidden rounded-lg transition-transform hover:scale-[1.02]"
          >
            <TemplateMiniCard template={template} />
            <span className="relative z-10 p-2 text-[10px] font-medium text-white drop-shadow-md">
              {template.name}
            </span>
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="rounded-md bg-white px-3 py-1 text-xs font-medium text-black">
                Use
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Text Panel ─────────────────────────────────────────────────────────────

const TEXT_TYPES = [
  { label: 'Add a title', className: 'text-xl font-bold', desc: 'Large heading text' },
  { label: 'Add a subtitle', className: 'text-base font-semibold', desc: 'Medium emphasis text' },
  { label: 'Add body text', className: 'text-sm font-normal', desc: 'Regular paragraph text' },
];

const FONT_SIZES = ['S', 'M', 'L', 'XL'];
const FONT_SIZE_MAP: Record<string, number> = { S: 14, M: 18, L: 24, XL: 32 };

interface FontOption {
  value: string;
  label: string;
  /** Arabic subtitle description */
  arabicDesc?: string;
  /** Google Fonts family name for loading */
  googleFamily: string;
  /** The group this font belongs to */
  group: 'arabic' | 'latin';
}

const FONT_OPTIONS: FontOption[] = [
  // Arabic fonts
  {
    value: 'Cairo',
    label: 'Cairo',
    arabicDesc: 'عناوين عصرية',
    googleFamily: 'Cairo',
    group: 'arabic',
  },
  {
    value: 'Tajawal',
    label: 'Tajawal',
    arabicDesc: 'نصوص واضحة',
    googleFamily: 'Tajawal',
    group: 'arabic',
  },
  {
    value: 'Almarai',
    label: 'Almarai',
    arabicDesc: 'مفضل في التطبيقات السعودية',
    googleFamily: 'Almarai',
    group: 'arabic',
  },
  {
    value: 'Noto Kufi Arabic',
    label: 'Noto Kufi Arabic',
    arabicDesc: 'كوفي فاخر',
    googleFamily: 'Noto+Kufi+Arabic',
    group: 'arabic',
  },
  {
    value: 'IBM Plex Sans Arabic',
    label: 'IBM Plex Arabic',
    arabicDesc: 'تقني ورسمي',
    googleFamily: 'IBM+Plex+Sans+Arabic',
    group: 'arabic',
  },
  {
    value: 'Scheherazade New',
    label: 'Scheherazade New',
    arabicDesc: 'كلاسيكي وراقي',
    googleFamily: 'Scheherazade+New',
    group: 'arabic',
  },
  {
    value: 'Changa',
    label: 'Changa',
    arabicDesc: 'جريء وحديث',
    googleFamily: 'Changa',
    group: 'arabic',
  },
  {
    value: 'El Messiri',
    label: 'El Messiri',
    arabicDesc: 'أنيق ومزخرف',
    googleFamily: 'El+Messiri',
    group: 'arabic',
  },
  {
    value: 'Lemonada',
    label: 'Lemonada',
    arabicDesc: 'مرح ومبدع',
    googleFamily: 'Lemonada',
    group: 'arabic',
  },
  {
    value: 'Readex Pro',
    label: 'Readex Pro',
    arabicDesc: 'متعدد الاستخدامات',
    googleFamily: 'Readex+Pro',
    group: 'arabic',
  },
  // Latin fonts
  { value: 'Inter', label: 'Inter', googleFamily: 'Inter', group: 'latin' },
  { value: 'Roboto', label: 'Roboto', googleFamily: 'Roboto', group: 'latin' },
  { value: 'Poppins', label: 'Poppins', googleFamily: 'Poppins', group: 'latin' },
  { value: 'Montserrat', label: 'Montserrat', googleFamily: 'Montserrat', group: 'latin' },
  { value: 'Open Sans', label: 'Open Sans', googleFamily: 'Open+Sans', group: 'latin' },
];

const ARABIC_FONTS = FONT_OPTIONS.filter((f) => f.group === 'arabic');
const LATIN_FONTS = FONT_OPTIONS.filter((f) => f.group === 'latin');

/** Tracks which Google Fonts have already been loaded via <link> */
const loadedFonts = new Set<string>();

function loadGoogleFont(font: FontOption) {
  if (loadedFonts.has(font.value)) return;
  loadedFonts.add(font.value);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.googleFamily}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

/** Pre-load all studio fonts on mount */
function useLoadStudioFonts() {
  React.useEffect(() => {
    for (const font of FONT_OPTIONS) {
      loadGoogleFont(font);
    }
  }, []);
}

function TextContent() {
  useLoadStudioFonts();
  const [activeSize, setActiveSize] = useState('M');
  const { selectedFont, setSelectedFont, markDirty } = useStudioStore(
    useShallow((s) => ({
      selectedFont: s.selectedFont,
      setSelectedFont: s.setSelectedFont,
      markDirty: s.markDirty,
    })),
  );

  const currentFont = FONT_OPTIONS.find((f) => f.value === selectedFont);
  const isArabic = currentFont?.group === 'arabic';
  const previewText = isArabic ? 'مرحباً بك في حكايات' : 'Hello Hikayat';
  const fontSize = FONT_SIZE_MAP[activeSize] ?? 18;

  function handleFontChange(value: string) {
    if (value === '__custom') return;
    setSelectedFont(value);
    markDirty();
  }

  return (
    <div className="space-y-4 p-3">
      {/* Text type cards */}
      <div className="space-y-2">
        {TEXT_TYPES.map((opt) => (
          <button
            key={opt.label}
            className="flex w-full flex-col gap-1 rounded-lg border border-border bg-muted/50 p-3 text-start transition-colors hover:bg-muted"
          >
            <span className={opt.className}>{opt.label}</span>
            <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
          </button>
        ))}
      </div>

      <Separator />

      {/* Font Family */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Font Family</p>
        <Select value={selectedFont} onValueChange={handleFontChange}>
          <SelectTrigger className="h-9">
            <SelectValue>
              <span style={{ fontFamily: `'${selectedFont}', sans-serif` }}>
                {currentFont?.label ?? selectedFont}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[320px]">
            <SelectGroup>
              <SelectLabel>Arabic Fonts</SelectLabel>
              {ARABIC_FONTS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span className="flex items-center gap-2">
                    <span style={{ fontFamily: `'${font.value}', sans-serif` }}>{font.label}</span>
                    <span className="text-[10px] text-muted-foreground" dir="rtl">
                      {font.arabicDesc}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Latin Fonts</SelectLabel>
              {LATIN_FONTS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: `'${font.value}', sans-serif` }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectItem value="__custom" disabled>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Upload className="h-3.5 w-3.5" />
                  Custom Font — Coming soon
                </span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Live preview */}
        <div
          className="rounded-lg border border-border bg-muted/50 p-3 text-center"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <p
            style={{
              fontFamily: `'${selectedFont}', sans-serif`,
              fontSize: `${fontSize}px`,
            }}
            className="leading-relaxed text-foreground transition-all duration-200"
          >
            {previewText}
          </p>
        </div>
      </div>

      <Separator />

      {/* Font size presets */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Font Size</p>
        <div className="flex gap-1.5">
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setActiveSize(size)}
              className={cn(
                'flex h-8 flex-1 items-center justify-center rounded-md text-xs font-medium transition-colors',
                activeSize === size
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CTA Panel ──────────────────────────────────────────────────────────────

const CTA_STYLES = [
  {
    label: 'Button',
    desc: 'Tap to open link',
    icon: MousePointerClick,
    preview: 'rounded-full bg-foreground px-4 py-1.5 text-[10px] font-medium text-background',
    previewText: 'Shop Now',
  },
  {
    label: 'Swipe Up',
    desc: 'Swipe gesture CTA',
    icon: ArrowUp,
    preview: 'flex flex-col items-center gap-0.5',
    previewText: '↑ Swipe Up',
  },
  {
    label: 'Link',
    desc: 'Inline text link',
    icon: Link2,
    preview: 'text-[10px] underline underline-offset-2',
    previewText: 'Learn more →',
  },
];

const CTA_COLORS = [
  'bg-white',
  'bg-foreground',
  'bg-primary',
  'bg-rose-500',
  'bg-blue-500',
  'bg-amber-400',
];

function CTAContent() {
  return (
    <div className="space-y-4 p-3">
      {CTA_STYLES.map((opt) => {
        const Icon = opt.icon;
        return (
          <button
            key={opt.label}
            className="flex w-full flex-col gap-3 rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-start">
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
              </div>
            </div>
            {/* Mini preview */}
            <div className="flex h-10 items-center justify-center rounded-md bg-background/50">
              <span className={opt.preview}>{opt.previewText}</span>
            </div>
          </button>
        );
      })}

      <Separator />

      {/* Color presets */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Color</p>
        <div className="flex gap-2">
          {CTA_COLORS.map((color, i) => (
            <button
              key={i}
              className={cn(
                'h-6 w-6 rounded-full border border-border transition-transform hover:scale-110',
                color,
              )}
              aria-label={`Color ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Interactive Panel ──────────────────────────────────────────────────────

const INTERACTIVE_ITEMS = [
  {
    label: 'Poll',
    desc: '2–4 answer choices',
    icon: MessageSquare,
    preview: ['Option A', 'Option B'],
  },
  {
    label: 'Quiz',
    desc: 'Right/wrong answers',
    icon: HelpCircle,
    preview: ['Correct ✓', 'Wrong ✗'],
  },
  {
    label: 'Emoji Rating',
    desc: 'Reaction scale 1–5',
    icon: Smile,
    preview: ['😍', '😊', '😐', '😕', '😢'],
  },
  {
    label: 'Countdown',
    desc: 'Timer to a date',
    icon: Timer,
    preview: ['03', ':', '14', ':', '59'],
  },
  {
    label: 'Question',
    desc: 'Open text response',
    icon: MessageCircleQuestion,
    preview: ['Type your answer...'],
  },
];

function InteractiveContent() {
  return (
    <div className="space-y-2 p-3">
      {INTERACTIVE_ITEMS.map((opt) => {
        const Icon = opt.icon;
        return (
          <div
            key={opt.label}
            className="space-y-2 rounded-lg border border-border bg-muted/50 p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
            {/* Mini preview */}
            <div className="flex items-center justify-center gap-1 rounded-md bg-background/50 p-2">
              {opt.preview.map((item, i) => (
                <span
                  key={i}
                  className={cn(
                    'text-[10px] text-muted-foreground',
                    opt.label === 'Emoji Rating' && 'text-sm',
                    (opt.label === 'Poll' || opt.label === 'Quiz') &&
                      'rounded bg-muted px-2 py-0.5',
                  )}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Media Panel ────────────────────────────────────────────────────────────

const MEDIA_TABS = ['Upload', 'Unsplash', 'Stock'];

function MediaContent() {
  const [activeTab, setActiveTab] = useState('Upload');

  return (
    <div className="space-y-3 p-3">
      {/* Tabs */}
      <div className="flex rounded-lg bg-muted p-0.5">
        {MEDIA_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 rounded-md py-1.5 text-xs font-medium transition-colors',
              activeTab === tab
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Upload' && (
        <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border p-8 text-center">
          <div className="flex gap-2">
            <Camera className="h-5 w-5 text-muted-foreground" />
            <Video className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium">Upload media</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Drag & drop or <span className="text-foreground">browse</span>
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground">PNG, JPG, MP4 up to 50MB</p>
        </div>
      )}

      {activeTab === 'Unsplash' && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute start-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Unsplash..."
              aria-label="Search Unsplash"
              className="h-8 ps-7 text-xs"
            />
          </div>
          {/* Masonry-style grid */}
          <div className="columns-2 gap-1.5 space-y-1.5">
            {[120, 160, 100, 140, 110, 150, 130, 90].map((h, i) => (
              <div key={i} className="rounded-md bg-muted" style={{ height: h }} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Stock' && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute start-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stock videos..."
              aria-label="Search stock videos"
              className="h-8 ps-7 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-md bg-muted" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Element Panel ──────────────────────────────────────────────────────────

const SHAPE_ITEMS = [
  { label: 'Circle', icon: Circle },
  { label: 'Rectangle', icon: Square },
  { label: 'Star', icon: Star },
  { label: 'Triangle', icon: Triangle },
  { label: 'Line', icon: Minus },
  { label: 'Divider', icon: SeparatorHorizontal },
];

function ElementContent() {
  return (
    <div className="space-y-3 p-3">
      <p className="text-xs font-medium text-muted-foreground">Shapes</p>
      <div className="grid grid-cols-3 gap-2">
        {SHAPE_ITEMS.map((shape) => {
          const Icon = shape.icon;
          return (
            <button
              key={shape.label}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted"
            >
              <Icon className="h-6 w-6 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground">{shape.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Layers Panel ───────────────────────────────────────────────────────────

const MOCK_LAYERS = [
  { id: 'layer-1', name: 'Title Text', type: 'text' as const, visible: true, locked: false },
  { id: 'layer-2', name: 'CTA Button', type: 'cta' as const, visible: true, locked: false },
  { id: 'layer-3', name: 'Background Image', type: 'media' as const, visible: true, locked: true },
];

function LayersContent() {
  const { selectedElement, setSelectedElement } = useStudioStore(
    useShallow((s) => ({
      selectedElement: s.selectedElement,
      setSelectedElement: s.setSelectedElement,
    })),
  );

  return (
    <div className="space-y-1 p-2">
      {MOCK_LAYERS.map((layer) => (
        <button
          key={layer.id}
          onClick={() => setSelectedElement(selectedElement === layer.id ? null : layer.id)}
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-2 py-2 transition-colors',
            selectedElement === layer.id ? 'bg-muted' : 'hover:bg-muted/50',
          )}
        >
          <GripVertical className="h-3 w-3 shrink-0 cursor-grab text-muted-foreground/50" />
          <Type className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-start text-xs">{layer.name}</span>
          <span
            className="text-muted-foreground hover:text-foreground"
            role="button"
            tabIndex={0}
            aria-label="Toggle visibility"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === 'Enter' && e.stopPropagation()}
          >
            {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </span>
          <span
            className="text-muted-foreground hover:text-foreground"
            role="button"
            tabIndex={0}
            aria-label="Toggle lock"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === 'Enter' && e.stopPropagation()}
          >
            {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Main Panel ─────────────────────────────────────────────────────────────

interface SecondaryPanelProps {
  onOpenGallery: () => void;
  onApplyTemplate?: (template: { name: string; gradient: string; templateId: string }) => void;
  onApplyAI?: (slides: { name: string; gradient: string }[]) => void;
}

export function SecondaryPanel({ onOpenGallery, onApplyTemplate, onApplyAI }: SecondaryPanelProps) {
  const { activeTool, setActiveTool } = useStudioStore(
    useShallow((s) => ({ activeTool: s.activeTool, setActiveTool: s.setActiveTool })),
  );

  const [aiView, setAiView] = useState<'form' | 'loading' | 'results'>('form');
  const [backTrigger, setBackTrigger] = useState(0);
  const showAiBack = activeTool === 'ai' && aiView === 'results';

  function renderContent(tool: RailTool) {
    switch (tool) {
      case 'ai':
        return (
          <AIContent
            onApplyAI={onApplyAI}
            onViewChange={setAiView}
            backToPromptTrigger={backTrigger}
          />
        );
      case 'templates':
        return <TemplatesContent onOpenGallery={onOpenGallery} onApplyTemplate={onApplyTemplate} />;
      case 'text':
        return <TextContent />;
      case 'cta':
        return <CTAContent />;
      case 'interactive':
        return <InteractiveContent />;
      case 'media':
        return <MediaContent />;
      case 'element':
        return <ElementContent />;
      case 'layers':
        return <LayersContent />;
    }
  }

  return (
    <AnimatePresence>
      {activeTool && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-full shrink-0 overflow-hidden border-e border-border bg-card/80 backdrop-blur-xl"
        >
          <div className="flex h-full w-[280px] flex-col">
            {/* Header */}
            <div className="flex items-center gap-1 border-b border-border px-3 py-2">
              {showAiBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="-ms-1 h-7 w-7"
                  onClick={() => setBackTrigger((t) => t + 1)}
                  aria-label="Back to prompt"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <span className="flex-1 text-sm font-medium">{PANEL_LABELS[activeTool]}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setActiveTool(null)}
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">{renderContent(activeTool)}</ScrollArea>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
