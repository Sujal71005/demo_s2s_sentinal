import { cn } from '@/lib/utils';
import { Info, Satellite, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

interface StateIndicatorProps {
  className?: string;
}

interface ConnectionStatusProps extends StateIndicatorProps {
  live: boolean;
  loading: boolean;
  floodedArea?: string;
  error?: string | null;
}

export function EarthEngineStatusIndicator({
  live,
  loading,
  floodedArea,
  error,
  className,
}: ConnectionStatusProps) {
  if (loading) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary',
          className
        )}
      >
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
        <span className="font-medium">
          Connecting to Google Earth Engine — analyzing Sentinel-1 SAR data...
        </span>
      </div>
    );
  }

  if (live) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-md border border-risk-low/30 bg-risk-low/10 px-3 py-2 text-xs text-risk-low',
          className
        )}
      >
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span className="font-medium">
          Earth Engine Connected — Sentinel-1 SAR analysis live
          {floodedArea ? ` · Potential flooded area: ${floodedArea} km²` : ''}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border border-risk-moderate/30 bg-risk-moderate/10 px-3 py-2 text-xs text-risk-moderate',
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span className="font-medium">
        {error
          ? `Earth Engine offline — ${error}`
          : 'Earth Engine not configured — showing verified offline result. See Flood Analysis page for setup instructions.'}
      </span>
    </div>
  );
}

export function Sentinel1AnalysisIndicator({ className }: StateIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border border-risk-low/30 bg-risk-low/10 px-3 py-2 text-xs text-risk-low',
        className
      )}
    >
      <Satellite className="h-4 w-4 shrink-0" />
      <span className="font-medium">
        Sentinel-1 Analysis — Google Earth Engine / Sentinel-1, 14 August 2019.
      </span>
    </div>
  );
}

export function SimulatedDataNote({ className }: StateIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground',
        className
      )}
    >
      <Info className="h-4 w-4 shrink-0" />
      <span>
        Roads, facilities, population, and flood-zone boundaries shown here are
        estimated/simulated overlays — not Sentinel-1 measurements.
      </span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center',
        className
      )}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function ErrorState({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-risk-critical/30 bg-risk-critical/10 p-8 text-center',
        className
      )}
    >
      <p className="text-sm font-medium text-risk-critical">Error</p>
      <p className="mt-1 text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

export function LoadingState({
  label = 'Loading...',
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center',
        className
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
