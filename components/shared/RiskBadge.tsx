import { cn } from '@/lib/utils';
import { riskLevelBgClasses, riskLevelLabels } from '@/lib/risk/riskStyles';
import type { RiskLevel } from '@/types/incident';

interface RiskBadgeProps {
  level: RiskLevel;
  showDot?: boolean;
  className?: string;
}

export function RiskBadge({
  level,
  showDot = true,
  className,
}: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        riskLevelBgClasses[level],
        className
      )}
    >
      {showDot && (
        <span
 className="h-1.5 w-1.5 rounded-full bg-current"
        />
      )}
      {riskLevelLabels[level]}
    </span>
  );
}
