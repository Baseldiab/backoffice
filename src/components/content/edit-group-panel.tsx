'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Upload } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { widgets } from '@/lib/mock-data';
import type { StoryGroup } from '@/lib/types';

interface EditGroupPanelProps {
  group: StoryGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGroupPanel({ group, open, onOpenChange }: EditGroupPanelProps) {
  const [title, setTitle] = useState('');
  const [publishTo, setPublishTo] = useState<string[]>([]);
  const [removedWorkspaces, setRemovedWorkspaces] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (group) {
      setTitle(group.title);
      setPublishTo([...group.widgetIds]);
      setRemovedWorkspaces([]);
      setStartDate(group.schedule.start?.split('T')[0] ?? '');
      setEndDate(group.schedule.end?.split('T')[0] ?? '');
      setErrors({});
      setSubmitted(false);
    }
  }, [group]);

  function togglePublishTo(widgetId: string) {
    setPublishTo((prev) => {
      if (prev.includes(widgetId)) {
        const next = prev.filter((id) => id !== widgetId);
        if (next.length === 0) {
          setErrors((e) => ({ ...e, publishTo: 'At least one workspace must be selected.' }));
          return prev;
        }
        setErrors((e) => ({ ...e, publishTo: '' }));
        // Track removal for warning
        if (group?.widgetIds.includes(widgetId)) {
          setRemovedWorkspaces((r) => [...r, widgetId]);
        }
        return next;
      }
      setErrors((e) => ({ ...e, publishTo: '' }));
      setRemovedWorkspaces((r) => r.filter((id) => id !== widgetId));
      return [...prev, widgetId];
    });
  }

  if (!group) return null;

  function validate() {
    const errs: Record<string, string> = {};
    if (title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters.';
    }
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      errs.endDate = 'End date must be after start date.';
    }
    return errs;
  }

  function handleSave(asTest: boolean) {
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error('Invalid form data. Check highlighted fields.');
      return;
    }
    onOpenChange(false);
    toast.success(asTest ? 'Saved as test' : 'Changes saved');
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col overflow-visible sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Story Group</SheetTitle>
          <SheetDescription>Update the settings for &ldquo;{group.title}&rdquo;.</SheetDescription>
        </SheetHeader>

        <div className="-mx-6 flex-1 overflow-y-auto overflow-x-visible px-6 py-2">
          <Accordion
            type="multiple"
            defaultValue={['cover', 'title', 'publishTo']}
            className="w-full"
          >
            {/* Cover */}
            <AccordionItem value="cover">
              <AccordionTrigger>Cover</AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={group.coverImage}
                        alt={group.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Cover
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 200x200px, PNG or JPG. Max 2MB.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Title */}
            <AccordionItem value="title">
              <AccordionTrigger>Title</AccordionTrigger>
              <AccordionContent className="p-0.5 pb-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-title">Group Title</Label>
                    <Input
                      id="group-title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (submitted) setErrors((prev) => ({ ...prev, title: '' }));
                      }}
                      placeholder="Enter title"
                      className={cn(submitted && errors.title && 'border-destructive')}
                    />
                    {submitted && errors.title ? (
                      <p className="text-xs text-destructive">{errors.title}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Appears in the story bar.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group-description">Description (optional)</Label>
                    <Textarea
                      id="group-description"
                      placeholder="Internal notes about this group..."
                      rows={3}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Publish To */}
            <AccordionItem value="publishTo">
              <AccordionTrigger>Publish To</AccordionTrigger>
              <AccordionContent className="p-0.5 pb-4">
                <div className="space-y-3">
                  {widgets.map((widget) => {
                    const platformLabel =
                      widget.platform === 'ios'
                        ? 'iOS App'
                        : widget.platform === 'android'
                          ? 'Android App'
                          : 'Website';
                    return (
                      <div key={widget.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`edit-publish-${widget.id}`}
                          checked={publishTo.includes(widget.id)}
                          onCheckedChange={() => togglePublishTo(widget.id)}
                          className="border-border data-[state=checked]:bg-foreground data-[state=checked]:text-background data-[state=checked]:border-foreground"
                        />
                        <Label
                          htmlFor={`edit-publish-${widget.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {widget.appName} ({platformLabel})
                        </Label>
                      </div>
                    );
                  })}
                  {submitted && errors.publishTo ? (
                    <p className="mt-2 text-xs text-destructive">{errors.publishTo}</p>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Select where this story group will appear.
                    </p>
                  )}
                  {removedWorkspaces.length > 0 && (
                    <div className="rounded-md border border-border bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">
                        {removedWorkspaces
                          .map((id) => {
                            const w = widgets.find((w) => w.id === id);
                            return w ? `This will hide the story group from ${w.appName}.` : null;
                          })
                          .filter(Boolean)
                          .join(' ')}
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Audience */}
            <AccordionItem value="audience">
              <AccordionTrigger>Audience</AccordionTrigger>
              <AccordionContent className="p-0.5 pb-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select defaultValue={group.audience}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">All Users</SelectItem>
                        <SelectItem value="labels">By Labels</SelectItem>
                        <SelectItem value="custom">Custom Segment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {group.labels.length > 0 && (
                    <div className="space-y-2">
                      <Label>Labels</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {group.labels.map((label) => (
                          <span
                            key={label}
                            className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs text-foreground"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Schedule */}
            <AccordionItem value="schedule">
              <AccordionTrigger>Schedule</AccordionTrigger>
              <AccordionContent className="p-0.5 pb-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <div className="relative">
                        <Input
                          id="start-date"
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            if (submitted) setErrors((prev) => ({ ...prev, endDate: '' }));
                          }}
                          className="pe-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                        <Calendar className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <div className="relative">
                        <Input
                          id="end-date"
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            if (submitted) setErrors((prev) => ({ ...prev, endDate: '' }));
                          }}
                          className={cn(
                            'pe-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer',
                            submitted && errors.endDate && 'border-destructive',
                          )}
                        />
                        <Calendar className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      {submitted && errors.endDate ? (
                        <p className="text-xs text-destructive">{errors.endDate}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Leave end date empty for an always-on story group.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Style */}
            <AccordionItem value="style">
              <AccordionTrigger>Style</AccordionTrigger>
              <AccordionContent className="p-0.5 pb-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Cover Shape</Label>
                    <Select defaultValue="circle">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circle">Circle</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rounded">Rounded Rectangle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Border Ring</Label>
                      <p className="text-xs text-muted-foreground">
                        Show a colored ring around unseen stories.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sponsored */}
            <AccordionItem value="sponsored">
              <AccordionTrigger>Sponsored</AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mark as Sponsored</Label>
                      <p className="text-xs text-muted-foreground">
                        Adds a &ldquo;Sponsored&rdquo; badge and tracks ad metrics.
                      </p>
                    </div>
                    <Switch defaultChecked={group.isSponsored} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-border/50 pt-4">
          <Button variant="outline" onClick={() => handleSave(true)}>
            Save as Test
          </Button>
          <Button onClick={() => handleSave(false)}>Update</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
