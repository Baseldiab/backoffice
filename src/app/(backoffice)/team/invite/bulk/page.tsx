'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  FileText,
  Trash2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useTeamStore } from '@/lib/team-store';
import { ALL_ROLES, type InviteEntry, type TeamRole } from '@/lib/mock/team';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type BulkRowStatus = 'valid' | 'error';

interface BulkRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  role: TeamRole;
  status: BulkRowStatus;
  error?: string;
}

// ─── Mock data (hardcoded preview) ───────────────────────────────────────────

function makeBulkRows(): BulkRow[] {
  return [
    {
      id: 'v0',
      firstName: 'Hassan',
      lastName: 'Al-Amri',
      email: 'hassan.alamri@company.com',
      phone: '+966 50 111 2222',
      jobTitle: 'Product Manager',
      role: 'Ops Manager',
      status: 'valid',
    },
    {
      id: 'v1',
      firstName: 'Lina',
      lastName: 'Mansour',
      email: 'lina.mansour@company.com',
      phone: '+971 55 333 4444',
      jobTitle: 'UX Designer',
      role: 'Content Manager',
      status: 'valid',
    },
    {
      id: 'v2',
      firstName: 'Yousef',
      lastName: 'Al-Harbi',
      email: 'yousef.alharbi@company.com',
      phone: '+966 54 555 6666',
      jobTitle: 'Data Analyst',
      role: 'Viewer',
      status: 'valid',
    },
    {
      id: 'v3',
      firstName: 'Mona',
      lastName: 'Khaled',
      email: 'mona.khaled@company.com',
      phone: '+974 55 777 8888',
      jobTitle: 'Support Specialist',
      role: 'Support Agent',
      status: 'valid',
    },
    {
      id: 'v4',
      firstName: 'Ziad',
      lastName: 'Al-Sulaiman',
      email: 'ziad.alsulaiman@company.com',
      phone: '+965 99 999 0000',
      jobTitle: 'Finance Manager',
      role: 'Finance Officer',
      status: 'valid',
    },
    {
      id: 'e0',
      firstName: 'Layla',
      lastName: 'Al-Hassan',
      email: 'layla.alhassan@hikayat.io',
      phone: '+966 50 123 4567',
      jobTitle: 'Head of Platform',
      role: 'Super Admin',
      status: 'error',
      error: 'Email already exists',
    },
    {
      id: 'e1',
      firstName: 'Bad',
      lastName: 'Email',
      email: 'not-an-email',
      phone: '',
      jobTitle: '',
      role: 'Viewer',
      status: 'error',
      error: 'Invalid email address',
    },
  ];
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = ['Upload File', 'Preview & Edit', 'Done'];
  return (
    <div className="flex items-center gap-1">
      {steps.map((label, idx) => {
        const n = (idx + 1) as 1 | 2 | 3;
        const isActive = step === n;
        const isDone = step > n;
        return (
          <div key={n} className="flex items-center gap-1">
            {idx > 0 && (
              <div
                className={cn('h-px w-6', isDone || isActive ? 'bg-[#3ECF8E]/60' : 'bg-border')}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                  isActive && 'bg-[#3ECF8E] text-[#0D0D0D]',
                  isDone && 'bg-[#3ECF8E]/20 text-[#3ECF8E]',
                  !isActive && !isDone && 'bg-muted text-muted-foreground',
                )}
              >
                {isDone ? '✓' : n}
              </div>
              <span
                className={cn(
                  'text-xs',
                  isActive ? 'font-medium text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const cellInputCls =
  'w-full rounded border-0 bg-transparent px-2 py-1 text-sm text-foreground outline-none focus:bg-muted/40 focus:ring-1 focus:ring-[#3ECF8E] placeholder:text-muted-foreground/50';
const cellSelectCls =
  'w-full rounded border-0 bg-transparent px-2 py-1 text-sm text-foreground outline-none focus:bg-muted/40 focus:ring-1 focus:ring-[#3ECF8E] cursor-pointer';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BulkInvitePage() {
  const { addMembers } = useTeamStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [confirmedEmails, setConfirmedEmails] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validRows = rows.filter((r) => r.status === 'valid');
  const errorRows = rows.filter((r) => r.status === 'error');

  // ── Step 1 ────────────────────────────────────────────────────────────────

  function handleFileSelect(file: File) {
    setFileName(file.name);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }

  function proceedToPreview() {
    setRows(makeBulkRows());
    setStep(2);
  }

  // ── Step 2 ────────────────────────────────────────────────────────────────

  function updateRow(id: string, field: keyof BulkRow, value: string) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, [field]: value };
        if (field === 'email') {
          if (!value.trim()) {
            updated.status = 'error';
            updated.error = 'Email required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
            updated.status = 'error';
            updated.error = 'Invalid email address';
          } else {
            updated.status = 'valid';
            updated.error = undefined;
          }
        }
        return updated;
      }),
    );
  }

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function handleProceed() {
    if (errorRows.length > 0) {
      setShowErrorDialog(true);
    } else {
      submitRows(validRows);
    }
  }

  function submitRows(rowsToSubmit: BulkRow[]) {
    const entries: InviteEntry[] = rowsToSubmit.map((r) => ({
      firstName: r.firstName,
      lastName: r.lastName,
      email: r.email,
      phone: r.phone,
      jobTitle: r.jobTitle,
      role: r.role,
    }));
    addMembers(entries);
    setConfirmedEmails(entries.map((e) => e.email));
    setStep(3);
  }

  // ── Step 3 ────────────────────────────────────────────────────────────────

  function handleInviteMore() {
    setStep(1);
    setFileName(null);
    setRows([]);
    setConfirmedEmails([]);
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
          <h2 className="text-lg font-semibold text-foreground">Bulk Invite via CSV</h2>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file to invite multiple team members at once.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator step={step} />

      {/* ── Step 1: Upload ──────────────────────────────────────────────────── */}

      {step === 1 && (
        <div className="space-y-4">
          {/* Template download */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Download CSV Template</p>
                <p className="text-xs text-muted-foreground">
                  Use this template to format your invite list correctly.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Download
            </Button>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 text-center transition-colors',
              isDragOver
                ? 'border-[#3ECF8E]/60 bg-[#3ECF8E]/[0.04]'
                : 'border-border hover:border-[#3ECF8E]/30 hover:bg-muted/30',
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
            />
            {fileName ? (
              <>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#3ECF8E]/10">
                  <FileText className="h-5 w-5 text-[#3ECF8E]" />
                </div>
                <p className="text-sm font-medium text-foreground">{fileName}</p>
                <p className="mt-1 text-xs text-muted-foreground">Click to change file</p>
              </>
            ) : (
              <>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Drop your CSV here, or click to browse
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Supports .csv files only</p>
              </>
            )}
          </div>

          {/* Sticky bar */}
          <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-between border-t border-border bg-background px-6 py-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/team">Cancel</Link>
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
              onClick={proceedToPreview}
            >
              Preview Import
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Preview & Edit ──────────────────────────────────────────── */}

      {step === 2 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-[#3ECF8E]/30 bg-[#3ECF8E]/[0.06] px-3 py-1 text-xs text-[#3ECF8E]">
              <CheckCircle2 className="h-3 w-3" />
              {validRows.length} valid
            </span>
            {errorRows.length > 0 && (
              <span className="flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/[0.06] px-3 py-1 text-xs text-yellow-500">
                <AlertTriangle className="h-3 w-3" />
                {errorRows.length} {errorRows.length === 1 ? 'error' : 'errors'}
              </span>
            )}
            <span className="ml-auto text-xs text-muted-foreground">Click any cell to edit</span>
          </div>

          {/* Editable table */}
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['First Name', 'Last Name', 'Email', 'Phone', 'Job Title', 'Role', ''].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className={cn('group', row.status === 'error' && 'bg-yellow-500/[0.03]')}
                    >
                      <td
                        className={cn(
                          'px-3 py-2',
                          row.status === 'error' && 'border-l-2 border-yellow-500',
                        )}
                      >
                        <input
                          type="text"
                          value={row.firstName}
                          onChange={(e) => updateRow(row.id, 'firstName', e.target.value)}
                          placeholder="First name"
                          className={cellInputCls}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={row.lastName}
                          onChange={(e) => updateRow(row.id, 'lastName', e.target.value)}
                          placeholder="Last name"
                          className={cellInputCls}
                        />
                      </td>
                      <td className="px-3 py-2 text-left">
                        <input
                          type="email"
                          value={row.email}
                          onChange={(e) => updateRow(row.id, 'email', e.target.value)}
                          placeholder="email@company.com"
                          className={cn(
                            cellInputCls,
                            row.error === 'Invalid email address' && 'text-red-400',
                            row.error === 'Email already exists' && 'text-yellow-400',
                          )}
                        />
                        {row.error === 'Invalid email address' && (
                          <span className="mt-0.5 block border-b border-red-500 pb-0.5 text-xs text-red-400">
                            Invalid email address
                          </span>
                        )}
                        {row.error === 'Email already exists' && (
                          <span className="mt-0.5 block text-xs text-yellow-400">
                            Email already exists
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="tel"
                          value={row.phone}
                          onChange={(e) => updateRow(row.id, 'phone', e.target.value)}
                          placeholder="+966 50 000 0000"
                          className={cellInputCls}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={row.jobTitle}
                          onChange={(e) => updateRow(row.id, 'jobTitle', e.target.value)}
                          placeholder="Job title"
                          className={cellInputCls}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={row.role}
                          onChange={(e) => updateRow(row.id, 'role', e.target.value)}
                          className={cellSelectCls}
                        >
                          {ALL_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          onClick={() => deleteRow(row.id)}
                          aria-label="Delete row"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sticky bar */}
          <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-between border-t border-border bg-background px-6 py-4">
            <Button variant="outline" size="sm" onClick={() => setStep(1)}>
              Back
            </Button>
            <div className="flex items-center gap-3">
              {errorRows.length > 0 && (
                <span className="text-xs text-yellow-500">
                  {errorRows.length} row{errorRows.length > 1 ? 's' : ''} will be skipped
                </span>
              )}
              <Button
                size="sm"
                className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
                disabled={validRows.length === 0}
                onClick={handleProceed}
              >
                Send {validRows.length} Invitation{validRows.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>

          {/* Skip errors dialog */}
          <ConfirmDialog
            open={showErrorDialog}
            onOpenChange={setShowErrorDialog}
            title="Skip Error Rows?"
            description={`${errorRows.length} row${errorRows.length > 1 ? 's' : ''} with errors will be skipped. ${validRows.length} valid invitation${validRows.length !== 1 ? 's' : ''} will be sent. Do you want to proceed?`}
            confirmLabel={`Send ${validRows.length} Invitation${validRows.length !== 1 ? 's' : ''}`}
            variant="default"
            onConfirm={() => {
              setShowErrorDialog(false);
              submitRows(validRows);
            }}
          />
        </div>
      )}

      {/* ── Step 3: Confirmation ────────────────────────────────────────────── */}

      {step === 3 && (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#3ECF8E]/10">
            <CheckCircle2 className="h-8 w-8 text-[#3ECF8E]" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Invitations Sent!</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {confirmedEmails.length} team member
            {confirmedEmails.length !== 1 ? 's have' : ' has'} been invited. They&apos;ll receive an
            email with instructions to join.
          </p>

          {/* Email list */}
          <div className="mt-6 w-full max-w-sm rounded-lg border border-border bg-card p-4 text-left">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Invitations sent to
            </p>
            <div className="space-y-2">
              {confirmedEmails.map((email) => (
                <div key={email} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#3ECF8E]" />
                  <span className="text-sm text-foreground">{email}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/team">View Team</Link>
            </Button>
            <Button
              className="bg-[#3ECF8E] text-[#0D0D0D] hover:bg-[#3ECF8E]/90"
              onClick={handleInviteMore}
            >
              Invite More
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
