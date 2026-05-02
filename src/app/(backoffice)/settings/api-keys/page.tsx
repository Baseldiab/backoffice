'use client';

import { useState } from 'react';
import { KeyRound, Copy, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string | null;
  status: 'active' | 'inactive';
}

const PLACEHOLDER_KEYS: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Production API Key',
    prefix: 'hk_prod_••••',
    created: '2024-01-15',
    lastUsed: '2024-03-20',
    status: 'active',
  },
  {
    id: 'key_2',
    name: 'Staging API Key',
    prefix: 'hk_stg_••••',
    created: '2024-02-01',
    lastUsed: null,
    status: 'inactive',
  },
];

export default function ApiKeysPage() {
  const [keys] = useState(PLACEHOLDER_KEYS);
  const [pendingDelete, setPendingDelete] = useState<ApiKey | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  function toggleReveal(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
          <p className="text-sm text-muted-foreground">
            Manage platform API keys for external integrations.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2 bg-brand text-[#0D0D0D] hover:bg-brand/90 text-xs font-semibold"
        >
          <Plus className="h-3.5 w-3.5" />
          New Key
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-surface divide-y divide-border">
        {keys.map((key) => (
          <div key={key.id} className="flex items-center gap-4 px-4 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
              <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{key.name}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <code className="text-xs text-muted-foreground font-mono">
                  {revealed.has(key.id) ? `hk_prod_sk_1234567890abcdef` : key.prefix}
                </code>
                <button
                  onClick={() => toggleReveal(key.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {revealed.has(key.id) ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Created {key.created} · {key.lastUsed ? `Last used ${key.lastUsed}` : 'Never used'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={key.status} />
              <button
                onClick={() => setPendingDelete(key)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete API Key"
        description={`Are you sure you want to delete "${pendingDelete?.name}"? Any integrations using this key will stop working immediately.`}
        confirmLabel="Delete Key"
        variant="destructive"
        onConfirm={() => setPendingDelete(null)}
      />
    </div>
  );
}
