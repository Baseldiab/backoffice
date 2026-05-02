'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { getPermissionsByModule } from '@/lib/mock/roles';

type Props = {
  module: string;
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: (module: string, checked: boolean) => void;
  defaultOpen?: boolean;
};

export function PermissionModuleAccordion({
  module,
  selected,
  onToggle,
  onToggleAll,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const perms = getPermissionsByModule(module);
  const enabledCount = perms.filter((p) => selected.includes(p.id)).length;
  const allChecked = enabledCount === perms.length;
  const someChecked = enabledCount > 0 && !allChecked;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allChecked}
            data-state={someChecked ? 'indeterminate' : undefined}
            onCheckedChange={(v) => onToggleAll(module, !!v)}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select all ${module} permissions`}
          />
          <span className="text-sm font-medium text-foreground">{module}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {enabledCount}/{perms.length}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="grid grid-cols-2 gap-2 p-4">
          {perms.map((p) => (
            <label key={p.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => onToggle(p.id)} />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
