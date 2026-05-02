'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Copy,
  Trash2,
  ChevronsUp,
  ChevronsDown,
  Info,
  Minus,
  Plus,
  Upload,
  ImageIcon,
  Link2,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useStudioStore } from '@/lib/studio-store';
// Only subscribes to selectedElement to minimize re-renders

// ─── Mock element state ──────────────────────────────────────────────────────

interface ElementProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  fillColor: string;
  borderEnabled: boolean;
  borderColor: string;
  borderWidth: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  textAlign: string;
  textColor: string;
  isTextElement: boolean;
}

const DEFAULT_ELEMENT: ElementProperties = {
  x: 40,
  y: 120,
  width: 313,
  height: 56,
  rotation: 0,
  opacity: 100,
  fillColor: '#ffffff',
  borderEnabled: false,
  borderColor: '#ffffff',
  borderWidth: 1,
  fontFamily: 'Inter',
  fontSize: 24,
  fontWeight: '600',
  textAlign: 'center',
  textColor: '#ffffff',
  isTextElement: true,
};

// ─── Dynamic Tags ────────────────────────────────────────────────────────────

const DYNAMIC_TAGS = [
  { value: '{{username}}', label: 'Username', preview: 'Ahmed' },
  { value: '{{city}}', label: 'City', preview: 'Dubai' },
  { value: '{{last_purchase}}', label: 'Last Purchase', preview: 'Linen Blazer' },
  { value: '{{loyalty_tier}}', label: 'Loyalty Tier', preview: 'Gold' },
  { value: '{{app_name}}', label: 'App Name', preview: 'MAISON' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
  className,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1', className)}>
      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          aria-label={label}
          className="h-8 pe-7 text-xs tabular-nums"
        />
        {suffix && (
          <span className="absolute end-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ColorButton({ color, onClick }: { color: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-8 w-8 rounded-md border border-border transition-colors hover:border-foreground"
      style={{ backgroundColor: color }}
      aria-label={`Color ${color}`}
    />
  );
}

// ─── Properties Panel ────────────────────────────────────────────────────────

// ─── Template element type labels ────────────────────────────────────────────

const ELEMENT_TYPE_LABELS: Record<string, string> = {
  text: 'Text Element',
  image: 'Image Element',
  cta: 'CTA Button',
  options: 'Options',
};

// ─── Template-aware Properties Panel sections ────────────────────────────────

function TemplateTextProperties() {
  const [text, setText] = useState('Story Title');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [textColor, setTextColor] = useState('#ffffff');

  return (
    <div className="space-y-4 px-4 py-3">
      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Text Content
        </Label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-8 text-xs"
          placeholder="Enter text..."
        />
      </div>

      <Separator />

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Font</Label>
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="Cairo">Cairo</SelectItem>
            <SelectItem value="Tajawal">Tajawal</SelectItem>
            <SelectItem value="Poppins">Poppins</SelectItem>
            <SelectItem value="Montserrat">Montserrat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Size</Label>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setFontSize(Math.max(8, fontSize - 1))}
            aria-label="Decrease font size"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            min={8}
            max={120}
            aria-label="Font size"
            className="h-8 text-center text-xs tabular-nums"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setFontSize(Math.min(120, fontSize + 1))}
            aria-label="Increase font size"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Alignment
        </Label>
        <div className="flex gap-1">
          {[
            { value: 'left', icon: AlignLeft },
            { value: 'center', icon: AlignCenter },
            { value: 'right', icon: AlignRight },
          ].map(({ value, icon: Icon }) => (
            <Button
              key={value}
              variant={value === 'center' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              aria-label={`Align ${value}`}
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Color</Label>
        <div className="flex items-center gap-2">
          <ColorButton color={textColor} />
          <Input
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="h-8 flex-1 font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}

function TemplateImageProperties() {
  return (
    <div className="space-y-4 px-4 py-3">
      <div className="space-y-2">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Image Source
        </Label>
        <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border p-6 text-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">No image selected</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 w-full gap-1.5 text-xs">
          <Upload className="h-3 w-3" />
          Click to Upload
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-full gap-1.5 text-xs">
          <ImageIcon className="h-3 w-3" />
          Browse Stock
        </Button>
      </div>

      <Separator />

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Fit Mode
        </Label>
        <Select defaultValue="cover">
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Border Radius
        </Label>
        <Slider defaultValue={[16]} min={0} max={32} step={1} className="py-1" />
      </div>
    </div>
  );
}

function TemplateCTAProperties() {
  const [buttonText, setButtonText] = useState('Shop Now');
  const [linkUrl, setLinkUrl] = useState('https://');
  const [buttonColor, setButtonColor] = useState('#ffffff');

  return (
    <div className="space-y-4 px-4 py-3">
      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Button Text
        </Label>
        <Input
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="h-8 text-xs"
          placeholder="Enter button text..."
        />
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Button Color
        </Label>
        <div className="flex items-center gap-2">
          <ColorButton color={buttonColor} />
          <Input
            value={buttonColor}
            onChange={(e) => setButtonColor(e.target.value)}
            className="h-8 flex-1 font-mono text-xs"
          />
        </div>
        <div className="mt-1.5 flex gap-1.5">
          {['#ffffff', '#000000', '#3ECF8E', '#ef4444', '#3b82f6', '#d4a017'].map((c) => (
            <button
              key={c}
              onClick={() => setButtonColor(c)}
              className={cn(
                'h-6 w-6 rounded-full border border-border transition-transform hover:scale-110',
              )}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Link2 className="h-3 w-3" />
            Link URL
          </span>
        </Label>
        <Input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className="h-8 font-mono text-xs"
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Style</Label>
        <Select defaultValue="filled">
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="filled">Filled</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="ghost">Ghost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Shape</Label>
        <Select defaultValue="pill">
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pill">Pill (rounded-full)</SelectItem>
            <SelectItem value="rounded">Rounded (rounded-xl)</SelectItem>
            <SelectItem value="square">Square</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function TemplateOptionsProperties() {
  const [options, setOptions] = useState(['Option A', 'Option B', 'Option C', 'Option D']);

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  };

  return (
    <div className="space-y-4 px-4 py-3">
      <div className="space-y-2">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Options ({options.length})
        </Label>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-medium text-muted-foreground">
              {String.fromCharCode(65 + i)}
            </span>
            <Input
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              className="h-8 text-xs"
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 flex-1 gap-1 text-[10px]"
          onClick={() =>
            setOptions((prev) => [...prev, `Option ${String.fromCharCode(65 + prev.length)}`])
          }
          disabled={options.length >= 6}
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 flex-1 gap-1 text-[10px]"
          onClick={() => setOptions((prev) => prev.slice(0, -1))}
          disabled={options.length <= 2}
        >
          <Minus className="h-3 w-3" />
          Remove
        </Button>
      </div>

      <Separator />

      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Layout</Label>
        <Select defaultValue="stacked">
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stacked">Stacked</SelectItem>
            <SelectItem value="side-by-side">Side by Side</SelectItem>
            <SelectItem value="grid">Grid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-start gap-1.5 rounded-md bg-muted/50 px-2.5 py-2">
        <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          Responses are collected via the SDK at runtime.
        </p>
      </div>
    </div>
  );
}

// ─── Main Properties Panel ──────────────────────────────────────────────────

export function PropertiesPanel() {
  const { selectedElement, selectedElementType, selectedFont, setSelectedFont } = useStudioStore();
  const [props, setProps] = useState<ElementProperties>(() => ({
    ...DEFAULT_ELEMENT,
    fontFamily: selectedFont,
  }));
  const [lockAspectRatio, setLockAspectRatio] = useState(false);
  const [selectedTag, setSelectedTag] = useState(DYNAMIC_TAGS[0].value);
  const [showTagPreview, setShowTagPreview] = useState(false);

  // Keep local fontFamily in sync with store
  React.useEffect(() => {
    setProps((prev) => ({ ...prev, fontFamily: selectedFont }));
  }, [selectedFont]);

  const update = (partial: Partial<ElementProperties>) => {
    setProps((prev) => ({ ...prev, ...partial }));
    if (partial.fontFamily) {
      setSelectedFont(partial.fontFamily);
    }
  };

  // Determine if this is a template element (starts with "tpl-")
  const isTemplateElement = selectedElement?.startsWith('tpl-') ?? false;
  const elementTypeLabel = selectedElementType
    ? (ELEMENT_TYPE_LABELS[selectedElementType] ?? 'Element')
    : 'Text Element';

  return (
    <AnimatePresence>
      {selectedElement && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="shrink-0 overflow-hidden border-s border-border bg-card"
        >
          <ScrollArea className="h-full">
            <div className="w-[280px]">
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-xs font-semibold">Properties</span>
                <span className="text-[10px] text-muted-foreground">{elementTypeLabel}</span>
              </div>

              {/* Template-specific content panels */}
              {isTemplateElement && selectedElementType === 'text' && <TemplateTextProperties />}
              {isTemplateElement && selectedElementType === 'image' && <TemplateImageProperties />}
              {isTemplateElement && selectedElementType === 'cta' && <TemplateCTAProperties />}
              {isTemplateElement && selectedElementType === 'options' && (
                <TemplateOptionsProperties />
              )}

              {/* Template element actions */}
              {isTemplateElement && (
                <div className="border-t border-border px-4 py-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                      <Copy className="h-3 w-3" />
                      Duplicate
                    </Button>
                    <Button variant="destructive" size="sm" className="h-8 gap-1.5 text-xs">
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}

              {/* Default (non-template) element properties */}
              {!isTemplateElement && (
                <Accordion
                  type="multiple"
                  defaultValue={[
                    'transform',
                    'appearance',
                    'typography',
                    'dynamic-tags',
                    'actions',
                  ]}
                  className="px-4"
                >
                  {/* ─── Transform ─────────────────────────────────────────── */}
                  <AccordionItem value="transform">
                    <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                      Transform
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {/* Position */}
                        <div className="grid grid-cols-2 gap-2">
                          <NumberInput label="X" value={props.x} onChange={(x) => update({ x })} />
                          <NumberInput label="Y" value={props.y} onChange={(y) => update({ y })} />
                        </div>

                        {/* Size */}
                        <div className="flex items-end gap-2">
                          <div className="grid flex-1 grid-cols-2 gap-2">
                            <NumberInput
                              label="W"
                              value={props.width}
                              onChange={(width) => {
                                if (lockAspectRatio) {
                                  const ratio = props.height / props.width;
                                  update({ width, height: Math.round(width * ratio) });
                                } else {
                                  update({ width });
                                }
                              }}
                              min={1}
                            />
                            <NumberInput
                              label="H"
                              value={props.height}
                              onChange={(height) => {
                                if (lockAspectRatio) {
                                  const ratio = props.width / props.height;
                                  update({ height, width: Math.round(height * ratio) });
                                } else {
                                  update({ height });
                                }
                              }}
                              min={1}
                            />
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={lockAspectRatio ? 'secondary' : 'ghost'}
                                size="icon"
                                className="mb-0.5 h-8 w-8 shrink-0"
                                onClick={() => setLockAspectRatio(!lockAspectRatio)}
                                aria-label="Lock aspect ratio"
                              >
                                {lockAspectRatio ? (
                                  <Lock className="h-3.5 w-3.5" />
                                ) : (
                                  <Unlock className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Lock aspect ratio</TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Rotation */}
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Rotation
                          </Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[props.rotation]}
                              onValueChange={([v]) => update({ rotation: v })}
                              min={0}
                              max={360}
                              step={1}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={props.rotation}
                              onChange={(e) => update({ rotation: Number(e.target.value) })}
                              min={0}
                              max={360}
                              className="h-8 w-16 text-xs tabular-nums"
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ─── Appearance ────────────────────────────────────────── */}
                  <AccordionItem value="appearance">
                    <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                      Appearance
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {/* Opacity */}
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Opacity
                          </Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[props.opacity]}
                              onValueChange={([v]) => update({ opacity: v })}
                              min={0}
                              max={100}
                              step={1}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={props.opacity}
                              onChange={(e) => update({ opacity: Number(e.target.value) })}
                              min={0}
                              max={100}
                              className="h-8 w-16 text-xs tabular-nums"
                            />
                          </div>
                        </div>

                        {/* Fill color */}
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Fill Color
                          </Label>
                          <div className="flex items-center gap-2">
                            <ColorButton color={props.fillColor} />
                            <Input
                              value={props.fillColor}
                              onChange={(e) => update({ fillColor: e.target.value })}
                              className="h-8 flex-1 font-mono text-xs"
                            />
                          </div>
                        </div>

                        {/* Border */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Border
                            </Label>
                            <Switch
                              checked={props.borderEnabled}
                              onCheckedChange={(borderEnabled) => update({ borderEnabled })}
                              className="scale-75"
                            />
                          </div>
                          {props.borderEnabled && (
                            <div className="flex items-center gap-2">
                              <ColorButton color={props.borderColor} />
                              <Input
                                value={props.borderColor}
                                onChange={(e) => update({ borderColor: e.target.value })}
                                className="h-8 flex-1 font-mono text-xs"
                              />
                              <Input
                                type="number"
                                value={props.borderWidth}
                                onChange={(e) => update({ borderWidth: Number(e.target.value) })}
                                min={1}
                                max={20}
                                className="h-8 w-14 text-xs tabular-nums"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ─── Typography (only for text elements) ──────────────── */}
                  {props.isTextElement && (
                    <AccordionItem value="typography">
                      <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                        Typography
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          {/* Font */}
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Font
                            </Label>
                            <Select
                              value={props.fontFamily}
                              onValueChange={(fontFamily) => update({ fontFamily })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Cairo">Cairo</SelectItem>
                                <SelectItem value="Tajawal">Tajawal</SelectItem>
                                <SelectItem value="Almarai">Almarai</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Size */}
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Size
                            </Label>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={() =>
                                  update({ fontSize: Math.max(8, props.fontSize - 1) })
                                }
                                aria-label="Decrease font size"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={props.fontSize}
                                onChange={(e) => update({ fontSize: Number(e.target.value) })}
                                min={8}
                                max={120}
                                aria-label="Font size"
                                className="h-8 text-center text-xs tabular-nums"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={() =>
                                  update({ fontSize: Math.min(120, props.fontSize + 1) })
                                }
                                aria-label="Increase font size"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Weight */}
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Weight
                            </Label>
                            <Select
                              value={props.fontWeight}
                              onValueChange={(fontWeight) => update({ fontWeight })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="400">Regular</SelectItem>
                                <SelectItem value="500">Medium</SelectItem>
                                <SelectItem value="600">Semibold</SelectItem>
                                <SelectItem value="700">Bold</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Alignment */}
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Alignment
                            </Label>
                            <div className="flex gap-1">
                              {[
                                { value: 'left', icon: AlignLeft },
                                { value: 'center', icon: AlignCenter },
                                { value: 'right', icon: AlignRight },
                                { value: 'justify', icon: AlignJustify },
                              ].map(({ value, icon: Icon }) => (
                                <Button
                                  key={value}
                                  variant={props.textAlign === value ? 'secondary' : 'ghost'}
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => update({ textAlign: value })}
                                  aria-label={`Align ${value}`}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Text color */}
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Color
                            </Label>
                            <div className="flex items-center gap-2">
                              <ColorButton color={props.textColor} />
                              <Input
                                value={props.textColor}
                                onChange={(e) => update({ textColor: e.target.value })}
                                aria-label="Text color"
                                className="h-8 flex-1 font-mono text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* ─── Dynamic Tags ─────────────────────────────────────── */}
                  <AccordionItem value="dynamic-tags">
                    <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        Personalization
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                          Insert dynamic content that changes per user.
                        </p>

                        {/* Tag selector */}
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Tag
                          </Label>
                          <Select value={selectedTag} onValueChange={setSelectedTag}>
                            <SelectTrigger className="h-8 font-mono text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DYNAMIC_TAGS.map((tag) => (
                                <SelectItem key={tag.value} value={tag.value}>
                                  <span className="font-mono">{tag.value}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button variant="outline" size="sm" className="h-8 w-full text-xs">
                          Insert Tag
                        </Button>

                        {/* Preview toggle */}
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Preview
                          </Label>
                          <Switch
                            checked={showTagPreview}
                            onCheckedChange={setShowTagPreview}
                            className="scale-75"
                          />
                        </div>

                        {showTagPreview && (
                          <div className="rounded-md border border-border bg-muted/50 px-3 py-2">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-mono text-foreground">
                                Hi {DYNAMIC_TAGS.find((t) => t.value === selectedTag)?.preview}
                              </span>
                            </p>
                            <p className="mt-1 text-[10px] text-muted-foreground/60">
                              Original: Hi {selectedTag}
                            </p>
                          </div>
                        )}

                        {/* Info tooltip */}
                        <div className="flex items-start gap-1.5 rounded-md bg-muted/50 px-2.5 py-2">
                          <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                          <p className="text-[10px] leading-relaxed text-muted-foreground">
                            Tags are replaced with real user data in the SDK at runtime.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ─── Actions ───────────────────────────────────────────── */}
                  <AccordionItem value="actions" className="border-b-0">
                    <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                      Actions
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                            <Copy className="h-3 w-3" />
                            Duplicate
                          </Button>
                          <Button variant="destructive" size="sm" className="h-8 gap-1.5 text-xs">
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                            <ChevronsUp className="h-3 w-3" />
                            Forward
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                            <ChevronsDown className="h-3 w-3" />
                            Backward
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
