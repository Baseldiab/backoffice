import { Activity, Server, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';

const SERVICES = [
  { name: 'API Gateway', status: 'active' as const, latency: '—' },
  { name: 'Auth Service', status: 'active' as const, latency: '—' },
  { name: 'AI Pipeline', status: 'active' as const, latency: '—' },
  { name: 'Database (Primary)', status: 'active' as const, latency: '—' },
  { name: 'Storage', status: 'active' as const, latency: '—' },
  { name: 'Email Service', status: 'active' as const, latency: '—' },
];

export default function MonitoringPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Monitoring</h2>
        <p className="text-sm text-muted-foreground">
          System health, uptime, and performance metrics.
        </p>
      </div>

      {/* System status banner */}
      <div className="flex items-center gap-3 rounded-lg border border-brand/20 bg-brand/5 px-4 py-3">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
        <p className="text-sm text-foreground">
          All systems operational.{' '}
          <span className="text-muted-foreground">Last checked just now.</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard title="Uptime (30d)" value="—" icon={Activity} />
        <StatCard title="Avg Latency" value="—" description="p50" icon={Server} />
        <StatCard title="Error Rate" value="—" icon={AlertTriangle} />
        <StatCard title="Requests (24h)" value="—" icon={Activity} />
      </div>

      {/* Services table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-medium text-foreground">Service Health</h3>
        </div>

        <div className="divide-y divide-border">
          {SERVICES.map((service) => (
            <div key={service.name} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background">
                  <Server className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground">{service.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs text-muted-foreground">Latency: {service.latency}</span>
                <StatusBadge status={service.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent incidents */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h3 className="mb-4 text-sm font-medium text-foreground">Recent Incidents</h3>
        <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border">
          <p className="text-sm text-muted-foreground">No incidents in the last 30 days.</p>
        </div>
      </div>
    </div>
  );
}
