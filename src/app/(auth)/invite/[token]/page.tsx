'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff, MailX, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_TOKEN = 'valid-token-123';

const MOCK_INVITE = {
  email: 'ahmed.alghamdi@hikayat.io',
  jobTitle: 'Operations Manager',
  role: 'Ops Manager',
};

const PREFIXES = [
  { code: '+966', flag: '🇸🇦' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+965', flag: '🇰🇼' },
  { code: '+974', flag: '🇶🇦' },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-[#3ECF8E]';
const disabledCls =
  'w-full cursor-not-allowed rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground opacity-60 outline-none';
const errorCls = 'border-destructive focus:ring-destructive/50';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormFields {
  firstName: string;
  lastName: string;
  mobile: string;
  mobilePrefix: string;
  password: string;
  confirmPassword: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const labels = ['Weak', 'Weak', 'Medium', 'Strong'];
  const barColors = ['bg-red-500', 'bg-red-500', 'bg-yellow-400', 'bg-[#3ECF8E]'];
  const textColors = ['text-red-500', 'text-red-500', 'text-yellow-400', 'text-[#3ECF8E]'];
  return { score, label: labels[score], barColor: barColors[score], textColor: textColors[score] };
}

function validate(f: FormFields): Record<string, string> {
  const e: Record<string, string> = {};
  if (!f.firstName.trim()) e.firstName = 'Required';
  if (!f.lastName.trim()) e.lastName = 'Required';
  if (!f.mobile.trim()) e.mobile = 'Required';
  if (!f.password) {
    e.password = 'Required';
  } else if (getStrength(f.password).score < 3) {
    e.password = 'Must be 8+ chars, include a number and special character';
  }
  if (!f.confirmPassword) {
    e.confirmPassword = 'Required';
  } else if (f.confirmPassword !== f.password) {
    e.confirmPassword = 'Passwords do not match';
  }
  return e;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InviteAcceptPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const isValid = params.token === VALID_TOKEN;

  const [success, setSuccess] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fields, setFields] = useState<FormFields>({
    firstName: '',
    lastName: '',
    mobile: '',
    mobilePrefix: '+966',
    password: '',
    confirmPassword: '',
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const errors = attempted ? validate(fields) : {};
  const strength = getStrength(fields.password);

  function update(field: keyof FormFields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }));
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    setAttempted(true);
    if (Object.keys(validate(fields)).length === 0) {
      setSuccess(true);
    }
  }

  // ── Expired state ─────────────────────────────────────────────────────────

  if (!isValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D0D0D] p-6">
        <div className="mb-8">
          <span className="text-2xl font-bold text-[#3ECF8E]">Hikayat</span>
        </div>
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-10 text-center shadow-lg shadow-black/30">
          <div className="mb-5 flex justify-center">
            <div className="rounded-full bg-muted p-4">
              <MailX className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <h1 className="mb-2 text-xl font-semibold text-foreground">Invitation Expired</h1>
          <p className="mb-1 text-sm text-muted-foreground">
            This invitation link has expired or is invalid.
          </p>
          <p className="text-sm text-muted-foreground">
            Contact your administrator for a new invitation.
          </p>
        </div>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D0D0D] p-6">
        <div className="mb-8">
          <span className="text-2xl font-bold text-[#3ECF8E]">Hikayat</span>
        </div>
        <div className="w-full max-w-lg rounded-xl border border-border bg-card p-10 text-center shadow-lg shadow-black/30">
          <div className="mb-5 flex justify-center">
            <div className="rounded-full bg-[#3ECF8E]/10 p-5">
              <CheckCircle2 className="h-14 w-14 text-[#3ECF8E]" />
            </div>
          </div>
          <h1 className="mb-2 text-xl font-semibold text-foreground">
            Account Successfully Created!
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Your account is ready. You can now sign in to Hikayat BackOffice.
          </p>
          <Button
            className="w-full bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
            onClick={() => router.push('/login')}
          >
            Go to Login
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">You can also close this window.</p>
        </div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────

  const avatarInitials =
    (fields.firstName[0] ?? '').toUpperCase() + (fields.lastName[0] ?? '').toUpperCase() || null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D0D0D] px-6 py-12">
      {/* Logo + heading */}
      <div className="mb-2 text-center">
        <span className="text-2xl font-bold text-[#3ECF8E]">Hikayat</span>
      </div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Welcome to Hikayat BackOffice</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Complete your registration to get started.
      </p>

      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-8 shadow-lg shadow-black/30">
        {/* ── Section 1: Assigned data ── */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Assigned by Administrator
          </p>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Email Address
              </label>
              <input type="email" value={MOCK_INVITE.email} disabled className={disabledCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Job Title
                </label>
                <input type="text" value={MOCK_INVITE.jobTitle} disabled className={disabledCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Role</label>
                <input type="text" value={MOCK_INVITE.role} disabled className={disabledCls} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              These fields were set by your administrator and cannot be changed.
            </p>
          </div>
        </div>

        <div className="mb-6 border-t border-border" />

        {/* ── Section 2: Complete profile ── */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Complete Your Profile
          </p>
          <div className="space-y-4">
            {/* Avatar upload */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition-colors hover:border-[#3ECF8E]/60"
                aria-label="Upload profile picture"
              >
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : avatarInitials ? (
                  <span className="text-base font-semibold text-muted-foreground">
                    {avatarInitials}
                  </span>
                ) : (
                  <Upload className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/50 group-hover:flex">
                  <Upload className="h-4 w-4 text-white" />
                </div>
              </button>
              <div>
                <p className="text-sm font-medium text-foreground">Profile Picture</p>
                <p className="text-xs text-muted-foreground">Click to upload. Optional.</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatar}
              />
            </div>

            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  First Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={fields.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  placeholder="First name"
                  className={cn(inputCls, errors.firstName && errorCls)}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={fields.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Last name"
                  className={cn(inputCls, errors.lastName && errorCls)}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Mobile Number <span className="text-destructive">*</span>
              </label>
              <div className="flex">
                <select
                  value={fields.mobilePrefix}
                  onChange={(e) => update('mobilePrefix', e.target.value)}
                  className="cursor-pointer rounded-l-md border border-r-0 border-border bg-muted px-2 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-inset focus:ring-[#3ECF8E]"
                >
                  {PREFIXES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.flag} {p.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={fields.mobile}
                  onChange={(e) => update('mobile', e.target.value)}
                  placeholder="50 000 0000"
                  className={cn(
                    'flex-1 rounded-l-none rounded-r-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-[#3ECF8E]',
                    errors.mobile && errorCls,
                  )}
                />
              </div>
              {errors.mobile && <p className="mt-1 text-xs text-destructive">{errors.mobile}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={fields.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Create a password"
                  className={cn(inputCls, 'pr-10', errors.password && errorCls)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength indicator */}
              {fields.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-colors duration-200',
                          i <= strength.score ? strength.barColor : 'bg-muted',
                        )}
                      />
                    ))}
                  </div>
                  <p className={cn('mt-1 text-xs', strength.textColor)}>{strength.label}</p>
                </div>
              )}
              {errors.password ? (
                <p className="mt-1 text-xs text-destructive">{errors.password}</p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  Min 8 characters, must include a number and special character.
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={fields.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Repeat your password"
                  className={cn(inputCls, 'pr-10', errors.confirmPassword && errorCls)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6">
          <Button
            className="w-full bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
            onClick={handleSubmit}
          >
            Complete Registration
          </Button>
        </div>
      </div>
    </div>
  );
}
