import { Zap, Search } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';

export default function AICreditsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">AI Credits</h2>
        <p className="text-sm text-muted-foreground">
          Monitor and manage AI credit usage across all companies.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
        <StatCard title="Total Credits Issued" value="—" icon={Zap} />
        <StatCard title="Credits Used (MTD)" value="—" icon={Zap} />
        <StatCard title="Credits Remaining" value="—" icon={Zap} />
      </div>

      {/* Usage table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-medium text-foreground">Usage by Company</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search…"
              className="rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 border-b border-border px-4 py-3">
          {['Company', 'Credits Allocated', 'Credits Used', 'Remaining'].map((h) => (
            <span
              key={h}
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              {h}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
            <Zap className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">No usage data</p>
            <p className="text-xs text-muted-foreground">
              AI credit usage will appear here once companies start using the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
