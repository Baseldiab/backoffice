'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CORRECT_OTP = '123456';

export default function LoginPage() {
  const router = useRouter();

  // ── Step state ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  // ── Credentials state ───────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [credLoading, setCredLoading] = useState(false);
  const [credErrors, setCredErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [shake] = useState(false);

  // ── OTP state ───────────────────────────────────────────────────────────────
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Resend cooldown timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // ── Auto-focus first OTP input when step changes ────────────────────────────
  useEffect(() => {
    if (step === 'otp') {
      setCooldown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  // ── Credentials submit ──────────────────────────────────────────────────────
  const handleCredSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof credErrors = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    if (Object.keys(errs).length) {
      setCredErrors(errs);
      return;
    }
    setCredErrors({});
    setCredLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setCredLoading(false);
    setStep('otp');
  };

  // ── OTP verify ──────────────────────────────────────────────────────────────
  const verifyOtp = useCallback(
    async (code: string) => {
      setOtpLoading(true);
      setOtpError('');
      await new Promise((r) => setTimeout(r, 1000));
      setOtpLoading(false);
      if (code === CORRECT_OTP) {
        router.push('/dashboard');
      } else {
        setOtpError('Invalid code. Please try again.');
        setOtpValues(['', '', '', '', '', '']);
        setTimeout(() => otpRefs.current[0]?.focus(), 50);
      }
    },
    [router],
  );

  // ── OTP input handlers ──────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    // Handle paste of full code
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (digits.length === 6) {
        const next = [...digits];
        setOtpValues(next);
        setOtpError('');
        otpRefs.current[5]?.focus();
        verifyOtp(next.join(''));
        return;
      }
    }
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpValues];
    next[index] = digit;
    setOtpValues(next);
    setOtpError('');
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    if (next.every((v) => v !== '') && next.join('').length === 6) {
      verifyOtp(next.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otpValues[index]) {
        const next = [...otpValues];
        next[index] = '';
        setOtpValues(next);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setOtpValues(['', '', '', '', '', '']);
    setOtpError('');
    setCooldown(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpValues.join('');
    if (code.length < 6) return;
    verifyOtp(code);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen">
      {/* ── Left Column ── */}
      <div
        className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden lg:flex"
        style={{ background: 'linear-gradient(135deg, #0D0F12 0%, #111827 50%, #0D1F17 100%)' }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #3ECF8E 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Floating glow */}
        <div
          className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
          style={{ background: '#3ECF8E' }}
        />

        {/* Content */}
        <div className="relative z-10 flex max-w-md flex-col items-center px-12 text-center">
          {/* Logo mark */}
          <div
            className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: 'rgba(62,207,142,0.15)',
              border: '1px solid rgba(62,207,142,0.3)',
            }}
          >
            <span className="text-2xl font-bold" style={{ color: '#3ECF8E' }}>
              H
            </span>
          </div>

          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">Highlit</h1>
          <p className="mb-10 text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Gulf&apos;s Native In-App Stories Platform
          </p>

          {/* Stats row */}
          <div className="mb-12 flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Customers
              </p>
            </div>
            <div className="h-8 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">6</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Gulf Markets
              </p>
            </div>
            <div className="h-8 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#3ECF8E' }}>
                99.9%
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Uptime
              </p>
            </div>
          </div>

          {/* Feature list */}
          <div className="flex w-full flex-col gap-3">
            {[
              { icon: '⚡', text: 'Arabic-First RTL Architecture' },
              { icon: '🛡️', text: 'PDPL & ZATCA Compliant' },
              { icon: '🌍', text: 'Hosted in Gulf Region' },
            ].map((f) => (
              <div
                key={f.text}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom label */}
        <p className="absolute bottom-8 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © 2026 Highlit Platform · Internal Use Only
        </p>
      </div>

      {/* ── Right Column ── */}
      <div className="flex w-full flex-col items-center justify-between bg-background px-6 py-12 lg:w-1/2">
        {/* Top logo */}
        <div className="flex w-full justify-center lg:justify-start">
          <span className="text-lg font-bold text-[#3ECF8E]">Highlit</span>
        </div>

        {/* Form area */}
        <div className={cn('w-full max-w-sm', shake && 'shake')}>
          {step === 'credentials' ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign in to your BackOffice account
                </p>
              </div>

              <form onSubmit={handleCredSubmit} noValidate className="space-y-4">
                {credErrors.form && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {credErrors.form}
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setCredErrors((p) => ({ ...p, email: undefined }));
                      }}
                      placeholder="you@company.com"
                      autoComplete="email"
                      className={cn(
                        'h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:ring-1 focus:ring-[#3ECF8E]',
                        credErrors.email ? 'border-destructive' : 'border-border',
                      )}
                    />
                  </div>
                  {credErrors.email && (
                    <p className="text-xs text-destructive">{credErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setCredErrors((p) => ({ ...p, password: undefined }));
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={cn(
                        'h-11 w-full rounded-lg border bg-background pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:ring-1 focus:ring-[#3ECF8E]',
                        credErrors.password ? 'border-destructive' : 'border-border',
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {credErrors.password && (
                    <p className="text-xs text-destructive">{credErrors.password}</p>
                  )}
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#3ECF8E] transition-opacity hover:opacity-80"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={credLoading}
                  className="h-11 w-full bg-[#3ECF8E] text-[#0D0D0D] transition-all duration-200 hover:bg-[#3ECF8E]/90 disabled:opacity-60"
                >
                  {credLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Need access? <span className="text-foreground">Contact your administrator.</span>
              </p>

              <p className="mt-4 text-center text-xs text-muted-foreground/50">
                Testing invite flow?{' '}
                <Link
                  href="/invite/valid-token-123"
                  className="text-[#3ECF8E]/70 hover:text-[#3ECF8E]"
                >
                  → Open invite page
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* OTP step */}
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setOtpValues(['', '', '', '', '', '']);
                  setOtpError('');
                }}
                className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Two-Factor Authentication</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter the 6-digit code sent to{' '}
                  <span className="font-semibold text-[#3ECF8E]">{email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} noValidate>
                {/* OTP inputs */}
                <div className="my-6 flex justify-center gap-3">
                  {otpValues.map((val, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={val}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      disabled={otpLoading}
                      className={cn(
                        'h-14 w-12 rounded-xl border bg-card text-center text-xl font-bold text-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50',
                        otpError ? 'border-destructive' : 'border-border',
                      )}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="mb-4 text-center text-xs text-destructive">{otpError}</p>
                )}

                <Button
                  type="submit"
                  disabled={otpLoading || otpValues.join('').length < 6}
                  className="h-11 w-full bg-[#3ECF8E] text-[#0D0D0D] transition-all duration-200 hover:bg-[#3ECF8E]/90 disabled:opacity-60"
                >
                  {otpLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Didn&apos;t receive a code?{' '}
                {cooldown > 0 ? (
                  <span className="text-muted-foreground/60">Resend in {cooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#3ECF8E] transition-opacity hover:opacity-80"
                  >
                    Resend code
                  </button>
                )}
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/40">
          © 2026 Highlit Platform · Internal Use Only
        </p>
      </div>
    </div>
  );
}
