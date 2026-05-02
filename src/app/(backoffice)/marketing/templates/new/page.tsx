'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GLOBAL_PARAMETERS } from '@/lib/mock/templates';
import type {
  TemplateChannel,
  TemplateCategory,
  TemplateLanguage,
  TemplateStatus,
} from '@/lib/mock/templates';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Save,
  Mail,
  MessageCircle,
  MessageSquare,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

const CHANNEL_TABS: { value: TemplateChannel; label: string; icon: React.ElementType }[] = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'sms', label: 'SMS', icon: MessageSquare },
];

const CATEGORIES: { value: TemplateCategory; label: string }[] = [
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'billing', label: 'Billing' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Support' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'notification', label: 'Notification' },
];

function extractParams(text: string) {
  const matches = text.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  return Array.from(new Set(matches.map((m) => m.slice(2, -2))));
}

function replaceParams(text: string, fill: boolean) {
  if (!fill) {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => `{{${key}}}`);
  }
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const param = GLOBAL_PARAMETERS.find((p) => p.key === key);
    return param ? param.example : `{{${key}}}`;
  });
}

function smsSegments(text: string, isArabic: boolean) {
  const charLimit = isArabic ? 70 : 160;
  return Math.max(1, Math.ceil(text.length / charLimit));
}

export default function NewTemplatePage() {
  const router = useRouter();

  const [channel, setChannel] = useState<TemplateChannel>('email');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('sales');
  const [language, setLanguage] = useState<TemplateLanguage>('en');
  const [status, setStatus] = useState<TemplateStatus>('active');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [bodyAr, setBodyAr] = useState('');
  const [previewLang, setPreviewLang] = useState<'en' | 'ar'>('en');
  const [fillSamples, setFillSamples] = useState(false);
  const [paramsOpen, setParamsOpen] = useState(false);
  const [activeTextarea, setActiveTextarea] = useState<'bodyEn' | 'bodyAr' | 'subject' | null>(
    null,
  );

  const bodyEnRef = useRef<HTMLTextAreaElement>(null);
  const bodyArRef = useRef<HTMLTextAreaElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);

  const showArabic = language === 'ar' || language === 'both';
  const showEnglish = language === 'en' || language === 'both';

  const allText = [bodyEn, bodyAr, subject].join(' ');
  const detectedKeys = useMemo(() => extractParams(allText), [allText]);
  const detectedParams = useMemo(() => {
    return detectedKeys.map((key) => {
      const global = GLOBAL_PARAMETERS.find((p) => p.key === key);
      return (
        global || {
          key,
          label: key,
          description: 'Custom parameter',
          required: false,
          example: `[${key}]`,
        }
      );
    });
  }, [detectedKeys]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setTagInput('');
  };

  const insertParameter = useCallback(
    (key: string) => {
      const insertion = `{{${key}}}`;
      const refs: Record<string, React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>> = {
        bodyEn: bodyEnRef,
        bodyAr: bodyArRef,
        subject: subjectRef,
      };
      const target = activeTextarea ? refs[activeTextarea] : null;
      if (target?.current) {
        const el = target.current;
        const start = el.selectionStart ?? el.value.length;
        const end = el.selectionEnd ?? el.value.length;
        const newVal = el.value.slice(0, start) + insertion + el.value.slice(end);
        if (activeTextarea === 'bodyEn') setBodyEn(newVal);
        else if (activeTextarea === 'bodyAr') setBodyAr(newVal);
        else if (activeTextarea === 'subject') setSubject(newVal);
        requestAnimationFrame(() => {
          el.focus();
          const pos = start + insertion.length;
          el.setSelectionRange(pos, pos);
        });
      } else {
        if (showEnglish) setBodyEn((prev) => prev + insertion);
        else setBodyAr((prev) => prev + insertion);
      }
    },
    [activeTextarea, showEnglish],
  );

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Template name is required');
      return;
    }
    if (showEnglish && !bodyEn.trim()) {
      toast.error('English body is required');
      return;
    }
    if (language === 'ar' && !bodyAr.trim()) {
      toast.error('Arabic body is required');
      return;
    }
    toast.success(`Template "${name}" created successfully`);
    router.push('/marketing/templates');
  };

  const previewBody = previewLang === 'ar' && bodyAr ? bodyAr : bodyEn;
  const previewSubject = subject;

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl space-y-6 px-6 py-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/marketing/templates" aria-label="Back to templates">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">Create Template</h1>
            </div>

            {/* Channel Tabs */}
            <div className="flex gap-2">
              {CHANNEL_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                      channel === tab.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-foreground/20',
                    )}
                    onClick={() => setChannel(tab.value)}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Basic Info */}
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold">Basic Info</h2>
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Introduction Email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TemplateCategory)}
                  className="w-full h-9 pl-3 pr-8 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as TemplateLanguage)}
                  className="w-full h-9 pl-3 pr-8 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="en">English only</option>
                  <option value="ar">Arabic only</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Type and press Enter..."
                    className="flex-1"
                  />
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                          aria-label={`Remove ${tag}`}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Status</Label>
                  <p className="text-xs text-muted-foreground">
                    {status === 'active' ? 'Ready to use' : 'Not yet available'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {(['active', 'draft'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                        status === s
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-foreground/20',
                      )}
                      onClick={() => setStatus(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold">Content</h2>

              {channel === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    ref={subjectRef as React.RefObject<HTMLInputElement>}
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onFocus={() => setActiveTextarea('subject')}
                    placeholder="e.g. Welcome to Highlit, {{customer_name}}!"
                  />
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {subject.length} chars
                  </p>
                </div>
              )}

              {showEnglish && (
                <div className="space-y-2">
                  <Label htmlFor="bodyEn">
                    Body (English){language === 'en' || language === 'both' ? ' *' : ''}
                  </Label>
                  <Textarea
                    ref={bodyEnRef as React.RefObject<HTMLTextAreaElement>}
                    id="bodyEn"
                    value={bodyEn}
                    onChange={(e) => setBodyEn(e.target.value)}
                    onFocus={() => setActiveTextarea('bodyEn')}
                    rows={channel === 'email' ? 10 : channel === 'whatsapp' ? 6 : 4}
                    placeholder="Write your message..."
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {bodyEn.length} chars
                    </p>
                    {channel === 'sms' && (
                      <p className="text-xs text-muted-foreground tabular-nums">
                        · {smsSegments(bodyEn, false)} SMS segment
                        {smsSegments(bodyEn, false) > 1 ? 's' : ''}
                      </p>
                    )}
                    {channel === 'sms' && bodyEn.length > 160 && (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                        <AlertTriangle className="h-3 w-3" />
                        Multi-segment
                      </span>
                    )}
                    {channel === 'whatsapp' && bodyEn.length > 1024 && (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                        <AlertTriangle className="h-3 w-3" />
                        Over 1024 chars
                      </span>
                    )}
                  </div>
                  {channel === 'whatsapp' && (
                    <p className="text-xs text-muted-foreground">
                      WhatsApp supports *bold*, _italic_, ~strikethrough~
                    </p>
                  )}
                  {channel === 'sms' && (
                    <p className="text-xs text-muted-foreground">160 chars per segment (Latin)</p>
                  )}
                </div>
              )}

              {showArabic && (
                <div className="space-y-2">
                  <Label htmlFor="bodyAr">Body (Arabic){language === 'ar' ? ' *' : ''}</Label>
                  <Textarea
                    ref={bodyArRef as React.RefObject<HTMLTextAreaElement>}
                    id="bodyAr"
                    value={bodyAr}
                    onChange={(e) => setBodyAr(e.target.value)}
                    onFocus={() => setActiveTextarea('bodyAr')}
                    rows={channel === 'email' ? 10 : channel === 'whatsapp' ? 6 : 4}
                    placeholder="اكتب رسالتك..."
                    dir="rtl"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {bodyAr.length} chars
                    </p>
                    {channel === 'sms' && (
                      <>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          · {smsSegments(bodyAr, true)} SMS segment
                          {smsSegments(bodyAr, true) > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Arabic SMS: 70 chars per segment
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Parameters */}
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold">Parameters</h2>

              {/* Detected */}
              {detectedParams.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Detected parameters — these will be filled when sending
                  </p>
                  {detectedParams.map((param) => {
                    const isCustom = !GLOBAL_PARAMETERS.find((g) => g.key === param.key);
                    return (
                      <div
                        key={param.key}
                        className={cn(
                          'flex items-center gap-2 p-2 border rounded-lg',
                          isCustom
                            ? 'bg-yellow-500/5 border-yellow-500/20'
                            : 'bg-muted/30 border-border/50',
                        )}
                      >
                        <code className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                          {`{{${param.key}}}`}
                        </code>
                        <span className="text-xs text-muted-foreground flex-1">{param.label}</span>
                        <span className="text-xs text-muted-foreground/60 italic">
                          {param.example}
                        </span>
                        {isCustom && (
                          <span className="text-[10px] text-yellow-400 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Custom
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {'Type {{parameter_name}} in the body to use dynamic parameters'}
                </p>
              )}

              {/* Available Parameters Reference */}
              <div>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setParamsOpen(!paramsOpen)}
                >
                  {paramsOpen ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                  Available Parameters
                </button>
                {paramsOpen && (
                  <div className="grid grid-cols-2 gap-1.5 mt-3">
                    {GLOBAL_PARAMETERS.map((param) => (
                      <button
                        key={param.key}
                        type="button"
                        onClick={() => insertParameter(param.key)}
                        className="flex items-start gap-2 p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-left"
                      >
                        <code className="text-xs bg-muted text-muted-foreground px-1 rounded font-mono shrink-0 mt-0.5">
                          {`{{${param.key}}}`}
                        </code>
                        <div>
                          <p className="text-xs font-medium">{param.label}</p>
                          <p className="text-xs text-muted-foreground">{param.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Preview */}
        <div className="w-96 shrink-0 border-l border-border overflow-y-auto bg-card/50">
          <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Preview</h3>
              {language === 'both' && (
                <div className="flex gap-1">
                  {(['en', 'ar'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      className={cn(
                        'rounded px-2 py-0.5 text-xs font-medium uppercase transition-colors',
                        previewLang === l
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                      onClick={() => setPreviewLang(l)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch checked={fillSamples} onCheckedChange={setFillSamples} />
              <span className="text-xs text-muted-foreground">Fill with sample data</span>
            </div>
          </div>

          <div className="p-4">
            {/* Email Preview */}
            {channel === 'email' && (
              <div className="bg-white text-gray-900 rounded-xl overflow-hidden border">
                <div className="px-4 py-3 bg-gray-50 border-b text-xs text-gray-500">
                  <div>
                    From: <span className="font-medium">Highlit Platform</span>
                  </div>
                  <div>
                    To:{' '}
                    <span className="font-medium">
                      {fillSamples ? 'Ahmed Al-Rashidi' : '{{customer_name}}'}
                    </span>
                  </div>
                  <div>
                    Subject:{' '}
                    <span className="font-medium">
                      {replaceParams(previewSubject || '(No subject)', fillSamples)}
                    </span>
                  </div>
                </div>
                <div
                  className="px-5 py-4 text-sm whitespace-pre-wrap leading-relaxed"
                  dir={previewLang === 'ar' ? 'rtl' : 'ltr'}
                >
                  {previewBody ? (
                    fillSamples ? (
                      replaceParams(previewBody, true)
                    ) : (
                      <HighlightedBody text={previewBody} />
                    )
                  ) : (
                    <span className="text-gray-400 italic">Start typing to see preview...</span>
                  )}
                </div>
              </div>
            )}

            {/* WhatsApp Preview */}
            {channel === 'whatsapp' && (
              <div className="bg-[#0B1418] rounded-xl p-4">
                <div className="max-w-[280px] ml-auto">
                  <div
                    className="bg-[#005C4B] text-white rounded-2xl rounded-br-sm px-3 py-2 text-sm whitespace-pre-wrap"
                    dir={previewLang === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {previewBody ? (
                      fillSamples ? (
                        replaceParams(previewBody, true)
                      ) : (
                        <HighlightedBody text={previewBody} light />
                      )
                    ) : (
                      <span className="text-white/50 italic">Start typing...</span>
                    )}
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">{'\u2713\u2713'} Now</div>
                </div>
              </div>
            )}

            {/* SMS Preview */}
            {channel === 'sms' && (
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="max-w-[260px] ml-auto">
                  <div
                    className="bg-[#007AFF] text-white rounded-2xl rounded-br-sm px-3 py-2 text-sm whitespace-pre-wrap"
                    dir={previewLang === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {previewBody ? (
                      fillSamples ? (
                        replaceParams(previewBody, true)
                      ) : (
                        <HighlightedBody text={previewBody} light />
                      )
                    ) : (
                      <span className="text-white/50 italic">Start typing...</span>
                    )}
                  </div>
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {previewBody.length} chars · {smsSegments(previewBody, previewLang === 'ar')}{' '}
                    SMS
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border bg-card px-6 py-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/marketing/templates')}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleCreate}>
          <Save className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>
    </div>
  );
}

function HighlightedBody({ text, light }: { text: string; light?: boolean }) {
  const parts = text.split(/(\{\{\w+\}\})/g);
  return (
    <>
      {parts.map((part, i) =>
        /\{\{\w+\}\}/.test(part) ? (
          <span
            key={i}
            className={cn(
              'rounded px-0.5',
              light
                ? 'bg-white/20 text-green-200 font-medium'
                : 'bg-green-100 text-green-700 font-medium',
            )}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
