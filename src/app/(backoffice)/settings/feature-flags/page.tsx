'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scope: 'global' | 'company' | 'beta';
}

const PLACEHOLDER_FLAGS: FeatureFlag[] = [
  {
    id: 'ai-story-gen',
    name: 'AI Story Generation',
    description: 'Enable AI-powered story generation for all users.',
    enabled: true,
    scope: 'global',
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Show extended analytics dashboard to enterprise customers.',
    enabled: false,
    scope: 'company',
  },
  {
    id: 'beta-editor',
    name: 'Beta Editor',
    description: 'New rich text editor currently in beta.',
    enabled: false,
    scope: 'beta',
  },
];

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState(PLACEHOLDER_FLAGS);
  const [pendingToggle, setPendingToggle] = useState<FeatureFlag | null>(null);

  function handleToggleRequest(flag: FeatureFlag) {
    setPendingToggle(flag);
  }

  function handleConfirm() {
    if (!pendingToggle) return;
    setFlags((prev) =>
      prev.map((f) => (f.id === pendingToggle.id ? { ...f, enabled: !f.enabled } : f)),
    );
    setPendingToggle(null);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Feature Flags</h2>
        <p className="text-sm text-muted-foreground">
          Toggle platform features globally or per company.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border">
        {flags.map((flag) => (
          <div key={flag.id} className="flex items-center gap-4 px-4 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
              <Flag className="h-3.5 w-3.5 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{flag.name}</p>
                <span className="rounded px-1.5 py-0.5 text-[10px] font-medium border border-border text-muted-foreground capitalize">
                  {flag.scope}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{flag.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={flag.enabled ? 'enabled' : 'disabled'} />
              <button
                onClick={() => handleToggleRequest(flag)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                  flag.enabled ? 'bg-brand' : 'bg-border'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    flag.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!pendingToggle}
        onOpenChange={(open) => !open && setPendingToggle(null)}
        title={pendingToggle?.enabled ? 'Disable Feature Flag' : 'Enable Feature Flag'}
        description={`Are you sure you want to ${pendingToggle?.enabled ? 'disable' : 'enable'} "${pendingToggle?.name}"? This may affect live users.`}
        confirmLabel={pendingToggle?.enabled ? 'Disable' : 'Enable'}
        variant={pendingToggle?.enabled ? 'destructive' : 'default'}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
