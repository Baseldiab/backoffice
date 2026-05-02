'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, MailCheck, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ── Password strength ────────────────────────────────────────────────────────

function getStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score as 0 | 1 | 2 | 3 | 4;
}

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'] as const;
const strengthColor = [
  '',
  'bg-destructive',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-[#3ECF8E]',
] as const;

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i <= strength ? strengthColor[strength] : 'bg-border',
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Strength:{' '}
        <span
          className={cn(
            strength === 1 && 'text-destructive',
            strength === 2 && 'text-orange-500',
            strength === 3 && 'text-yellow-500',
            strength === 4 && 'text-[#3ECF8E]',
          )}
        >
          {strengthLabel[strength]}
        </span>
      </p>
    </div>
  );
}

// ── Shared input style ───────────────────────────────────────────────────────

const inputCls = (error?: string) =>
  cn(
    'h-11 w-full rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:ring-1 focus:ring-[#3ECF8E]',
    error ? 'border-destructive' : 'border-border',
  );

// ── Step 1 — Enter Email ─────────────────────────────────────────────────────

function StepEmail({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onSubmit(email);
  };

  return (
    <div className="w-full max-w-sm">
      <Link
        href="/login"
        className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Forgot your password?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your work email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="you@company.com"
              autoComplete="email"
              className={cn(inputCls(error), 'pl-10')}
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-[#3ECF8E] text-[#0D0D0D] transition-all duration-200 hover:bg-[#3ECF8E]/90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember it?{' '}
        <Link href="/login" className="text-[#3ECF8E] transition-opacity hover:opacity-80">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}

// ── Step 2 — Check Email ─────────────────────────────────────────────────────

function StepCheckEmail({ email, onResend }: { email: string; onResend: () => void }) {
  const [cooldown, setCooldown] = useState(45);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return;
    setResending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResending(false);
    setCooldown(45);
    onResend();
  }, [cooldown, onResend]);

  return (
    <div className="w-full max-w-sm text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-[#3ECF8E]/10 p-4">
          <MailCheck className="h-12 w-12 text-[#3ECF8E]" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        We sent a password reset link to{' '}
        <span className="font-medium text-foreground">{email}</span>
      </p>

      <p className="mt-4 text-sm text-muted-foreground">
        Didn&apos;t receive it? Check your spam folder or{' '}
        {cooldown > 0 ? (
          <span className="text-muted-foreground/60">resend in {cooldown}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-[#3ECF8E] transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'resend email'}
          </button>
        )}
      </p>

      <Button variant="ghost" className="mt-8 h-11 w-full transition-all duration-200" asChild>
        <Link href="/login">← Back to Sign In</Link>
      </Button>
    </div>
  );
}

// ── Step 3 — Reset Password ──────────────────────────────────────────────────

function StepResetPassword() {
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ newPw?: string; confirmPw?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!newPw) errs.newPw = 'Password is required';
    else if (newPw.length < 8) errs.newPw = 'Must be at least 8 characters';
    else if (!/[0-9]/.test(newPw) || !/[^A-Za-z0-9]/.test(newPw))
      errs.newPw = 'Must include a number and special character';
    if (!confirmPw) errs.confirmPw = 'Please confirm your password';
    else if (newPw !== confirmPw) errs.confirmPw = 'Passwords do not match';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-[#3ECF8E]/10 p-4">
            <CheckCircle className="h-12 w-12 text-[#3ECF8E]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Password updated</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your password has been updated successfully.
        </p>
        <Button
          className="mt-8 h-11 w-full bg-[#3ECF8E] text-[#0D0D0D] transition-all duration-200 hover:bg-[#3ECF8E]/90"
          asChild
        >
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Link
        href="/forgot-password"
        className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Set new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Must be at least 8 characters with a number and special character.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* New password */}
        <div className="space-y-1">
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPw}
              onChange={(e) => {
                setNewPw(e.target.value);
                setErrors((p) => ({ ...p, newPw: undefined }));
              }}
              placeholder="New password"
              autoComplete="new-password"
              className={cn(inputCls(errors.newPw), 'px-4 pr-10')}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrengthBar password={newPw} />
          {errors.newPw && <p className="text-xs text-destructive">{errors.newPw}</p>}
        </div>

        {/* Confirm password */}
        <div className="space-y-1">
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPw}
              onChange={(e) => {
                setConfirmPw(e.target.value);
                setErrors((p) => ({ ...p, confirmPw: undefined }));
              }}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className={cn(inputCls(errors.confirmPw), 'px-4 pr-10')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPw && <p className="text-xs text-destructive">{errors.confirmPw}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-[#3ECF8E] text-[#0D0D0D] transition-all duration-200 hover:bg-[#3ECF8E]/90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating…
            </>
          ) : (
            'Update Password'
          )}
        </Button>
      </form>
    </div>
  );
}

// ── Page orchestrator ────────────────────────────────────────────────────────

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');

  const [step, setStep] = useState<'email' | 'sent' | 'reset'>(
    stepParam === 'reset' ? 'reset' : 'email',
  );
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleEmailSubmit = (email: string) => {
    setSubmittedEmail(email);
    setStep('sent');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      {/* Top logo */}
      <div className="mb-auto pt-4">
        <Link href="/login" className="text-lg font-bold text-[#3ECF8E]">
          Hikayat
        </Link>
      </div>

      <div className="flex w-full flex-1 items-center justify-center">
        {step === 'email' && <StepEmail onSubmit={handleEmailSubmit} />}
        {step === 'sent' && (
          <StepCheckEmail
            email={submittedEmail}
            onResend={() => {
              /* toast would go here */
            }}
          />
        )}
        {step === 'reset' && <StepResetPassword />}
      </div>

      <p className="mt-auto pt-4 text-center text-xs text-muted-foreground/40">
        © 2026 Hikayat Platform · Internal Use Only
      </p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordContent />
    </Suspense>
  );
}
