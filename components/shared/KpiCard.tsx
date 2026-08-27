import { cn } from '@/lib/utils';
import { riskLevelBgClasses, riskLevelLabels } from '@/lib/risk/riskStyles';
import type { RiskLevel } from '@/types/incident';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  contextLabel: string;
  riskLevel?: RiskLevel;
  className?: string;
}

export function KpiCard({
  icon: Icon,
  title,
  value,
  contextLabel,
  riskLevel,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
        </div>
        {riskLevel && (
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 text-[10px] font-medium',
              riskLevelBgClasses[riskLevel]
            )}
          >
            {riskLevelLabels[riskLevel]}
          </span>
        )}
      </div>
      <div className="mt-3">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        <p className="mt-1 text-xs text-muted-foreground">{contextLabel}</p>
      </div>
    </div>
  );
}
