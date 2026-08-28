import { cn } from '@/lib/utils';

interface MapLegendProps {
  className?: string;
  compact?: boolean;
  showSarFlood?: boolean;
}

interface LegendItem {
  label: string;
  color: string;
  shape: 'circle' | 'line' | 'square';
}

const legendItems: LegendItem[] = [
  { label: 'Critical Flood Zone', color: 'hsl(var(--risk-critical))', shape: 'square' },
  { label: 'High Risk', color: 'hsl(var(--risk-high))', shape: 'circle' },
  { label: 'Moderate Risk', color: 'hsl(var(--risk-moderate))', shape: 'circle' },
  { label: 'Recommended / Safe Route', color: 'hsl(var(--risk-low))', shape: 'line' },
  { label: 'Critical Facility', color: 'hsl(var(--info))', shape: 'circle' },
  { label: 'Road Network', color: 'hsl(var(--muted-foreground))', shape: 'line' },
];

const sarFloodItem: LegendItem = {
  label: 'SAR Flood Detection (Sentinel-1)',
  color: '#2563eb',
  shape: 'square',
};

export function MapLegend({ className, compact, showSarFlood = false }: MapLegendProps) {
  const items = showSarFlood ? [sarFloodItem, ...legendItems] : legendItems;

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur',
        compact && 'p-2',
        className
      )}
    >
      <h3
        className={cn(
          'mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
          compact && 'mb-1.5'
        )}
      >
        Legend
      </h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span
              className="inline-block shrink-0"
              style={{
                backgroundColor: item.color,
                width: item.shape === 'line' ? 16 : 10,
                height: item.shape === 'line' ? 3 : 10,
                borderRadius: item.shape === 'circle' ? '9999px' : 2,
                border:
                  item.shape === 'circle' ? `1px solid ${item.color}` : 'none',
              }}
            />
            <span
              className={cn(
                'text-xs text-card-foreground',
                compact && 'text-[11px]'
              )}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

