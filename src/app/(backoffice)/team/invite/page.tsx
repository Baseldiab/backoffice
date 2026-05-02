'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTeamStore } from '@/lib/team-store';
import { ALL_ROLES, type InviteEntry, type TeamRole } from '@/lib/mock/team';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  role: TeamRole;
  touched: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeEntry(idx: number): FormEntry {
  return {
    id: `entry_${Date.now()}_${idx}`,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    role: 'Viewer',
    touched: false,
  };
}

function validateEntry(e: FormEntry): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!e.firstName.trim()) errors.firstName = 'Required';
  if (!e.lastName.trim()) errors.lastName = 'Required';
  if (!e.email.trim()) {
    errors.email = 'Required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email.trim())) {
    errors.email = 'Invalid email';
  }
  return errors;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-[#3ECF8E]';
const errorInputCls = 'border-destructive focus:ring-destructive/50';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InvitePage() {
  const router = useRouter();
  const { members, addMembers } = useTeamStore();

  const [entries, setEntries] = useState<FormEntry[]>([makeEntry(0)]);
  const [submitted, setSubmitted] = useState(false);

  // ── Entry management ──────────────────────────────────────────────────────

  function addEntry() {
    if (entries.length >= 10) return;
    setEntries((prev) => [...prev, makeEntry(prev.length)]);
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function updateEntry(id: string, field: keyof Omit<FormEntry, 'id' | 'touched'>, value: string) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value, touched: true } : e)),
    );
  }

  // ── Duplicate detection ───────────────────────────────────────────────────

  function isDuplicateEmail(email: string, currentId: string): boolean {
    if (!email.trim()) return false;
    const lower = email.trim().toLowerCase();
    const inExisting = members.some((m) => m.email.toLowerCase() === lower);
    const inOther = entries.some(
      (e) => e.id !== currentId && e.email.trim().toLowerCase() === lower,
    );
    return inExisting || inOther;
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  function handleSubmit() {
    setSubmitted(true);

    const hasErrors = entries.some((e) => Object.keys(validateEntry(e)).length > 0);
    if (hasErrors) {
      toast.error('Please fix the errors before sending');
      return;
    }

    const inviteEntries: InviteEntry[] = entries.map((e) => ({
      firstName: e.firstName.trim(),
      lastName: e.lastName.trim(),
      email: e.email.trim(),
      phone: e.phone.trim(),
      jobTitle: e.jobTitle.trim(),
      role: e.role,
    }));

    addMembers(inviteEntries);
    toast.success(`${entries.length} invitation${entries.length > 1 ? 's' : ''} sent successfully`);
    router.push('/team');
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Back">
          <Link href="/team">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Invite Team Members</h2>
          <p className="text-sm text-muted-foreground">
            Add up to 10 people at once. All will receive an email invitation.
          </p>
        </div>
      </div>

      {/* Entry cards */}
      {entries.map((entry, idx) => {
        const errors = submitted || entry.touched ? validateEntry(entry) : {};
        const isDup = isDuplicateEmail(entry.email, entry.id);

        return (
          <div key={entry.id} className="rounded-lg border border-border bg-card p-5">
            {/* Card header */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Person {idx + 1}</span>
              {entries.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeEntry(entry.id)}
                  aria-label="Remove person"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* Duplicate warning */}
            {isDup && (
              <div className="mb-4 flex items-start gap-2 rounded-md border border-yellow-500/30 bg-yellow-500/[0.06] px-3 py-2.5 text-xs text-yellow-500">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  A member with this email already exists or is being added in another card. This
                  invitation will be skipped.
                </span>
              </div>
            )}

            {/* Form grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  First Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={entry.firstName}
                  onChange={(e) => updateEntry(entry.id, 'firstName', e.target.value)}
                  placeholder="First name"
                  className={cn(inputCls, errors.firstName && errorInputCls)}
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={entry.lastName}
                  onChange={(e) => updateEntry(entry.id, 'lastName', e.target.value)}
                  placeholder="Last name"
                  className={cn(inputCls, errors.lastName && errorInputCls)}
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={entry.email}
                  onChange={(e) => updateEntry(entry.id, 'email', e.target.value)}
                  placeholder="email@company.com"
                  className={cn(inputCls, errors.email && errorInputCls)}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Phone</label>
                <input
                  type="tel"
                  value={entry.phone}
                  onChange={(e) => updateEntry(entry.id, 'phone', e.target.value)}
                  placeholder="+966 50 000 0000"
                  className={inputCls}
                />
              </div>

              {/* Job Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Job Title</label>
                <input
                  type="text"
                  value={entry.jobTitle}
                  onChange={(e) => updateEntry(entry.id, 'jobTitle', e.target.value)}
                  placeholder="e.g. Product Manager"
                  className={inputCls}
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Role <span className="text-destructive">*</span>
                </label>
                <Select value={entry.role} onValueChange={(v) => updateEntry(entry.id, 'role', v)}>
                  <SelectTrigger className="h-9 w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add another person */}
      {entries.length < 10 && (
        <button
          onClick={addEntry}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:border-[#3ECF8E]/50 hover:text-[#3ECF8E]"
        >
          <Plus className="h-4 w-4" />
          Add Another Person
          <span className="text-xs opacity-60">({entries.length}/10)</span>
        </button>
      )}

      {/* Sticky action bar */}
      <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-between border-t border-border bg-background px-6 py-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{entries.length}</span>{' '}
          {entries.length === 1 ? 'person' : 'people'} to invite
        </p>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/team">Cancel</Link>
          </Button>
          <Button
            size="sm"
            className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
            onClick={handleSubmit}
          >
            Send Invitations
          </Button>
        </div>
      </div>
    </div>
  );
}
