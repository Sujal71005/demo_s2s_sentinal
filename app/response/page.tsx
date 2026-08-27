'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDisasterData } from '@/hooks/use-disaster-data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sentinel1AnalysisIndicator, SimulatedDataNote } from '@/components/shared/StateIndicators';
import type { ResponsePriority } from '@/types/response';
import {
  Ban,
  Construction,
  Hospital,
  Eye,
  Tent,
  Route as RouteIcon,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Navigation,
} from 'lucide-react';

const DisasterMap = dynamic(
  () => import('@/components/map/DisasterMap').then((m) => m.DisasterMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-card">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  }
);

const priorityConfig: Record<
  ResponsePriority,
  { label: string; color: string; bg: string }
> = {
  critical: {
    label: 'Critical',
    color: 'text-risk-critical',
    bg: 'border-risk-critical/30 bg-risk-critical/10',
  },
  high: {
    label: 'High',
    color: 'text-risk-high',
    bg: 'border-risk-high/30 bg-risk-high/10',
  },
  moderate: {
    label: 'Moderate',
    color: 'text-risk-moderate',
    bg: 'border-risk-moderate/30 bg-risk-moderate/10',
  },
  low: {
    label: 'Low',
    color: 'text-risk-low',
    bg: 'border-risk-low/30 bg-risk-low/10',
  },
};

const actionIcons = {
  close_road: Ban,
  inspect_bridge: Construction,
  prioritize_access: Hospital,
  monitor_zone: Eye,
  evacuation: Tent,
  relief_camp: Tent,
};

export default function ResponsePage() {
  const { incidents, facilities, floodZones, roads, routes, responseActions, loading, toggleAction } = useDisasterData('INC-SANGLI-2019');
  const [showRoute, setShowRoute] = useState(true);

  const completedActions = new Set(
    responseActions.filter((a) => a.completed).map((a) => a.id)
  );

  const toggleActionHandler = (actionId: string) => {
    const action = responseActions.find((a) => a.id === actionId);
    if (!action) return;
    toggleAction(actionId, !action.completed);
  };

  const sortedActions = [...responseActions].sort((a, b) => {
    const order: Record<ResponsePriority, number> = {
      critical: 0,
      high: 1,
      moderate: 2,
      low: 3,
    };
    return order[a.priority] - order[b.priority];
  });

  const incident = incidents[0];
  const saferRoute = routes[0];

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Sentinel1AnalysisIndicator />
      <SimulatedDataNote />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recommended Actions</CardTitle>
              <CardDescription>
                Prioritized response plan based on risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {sortedActions.map((action) => {
                const Icon = actionIcons[action.type] ?? Eye;
                const isCompleted = completedActions.has(action.id);
                const pc = priorityConfig[action.priority];

                return (
                  <div
                    key={action.id}
                    className={`rounded-md border p-3 ${pc.bg} ${
                      isCompleted ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleActionHandler(action.id)}
                        className="mt-0.5 shrink-0"
                        aria-label={
                          isCompleted ? 'Mark as incomplete' : 'Mark as complete'
                        }
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-risk-low" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${pc.color}`} />
                          <span
                            className={`text-sm font-medium ${
                              isCompleted
                                ? 'text-muted-foreground line-through'
                                : 'text-foreground'
                            }`}
                          >
                            {action.title}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {action.description}
                        </p>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${pc.color} border-current`}
                        >
                          {pc.label} Priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Separator className="my-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {completedActions.size} of {responseActions.length} completed
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    responseActions.forEach((a) => {
                      if (a.completed) toggleAction(a.id, false);
                    });
                  }}
                  className="h-7 text-xs"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <RouteIcon className="h-4 w-4 text-risk-low" />
                Find Safer Route
              </CardTitle>
              <CardDescription>
                Recommended alternative route avoiding flood zones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {saferRoute && (
                <>
                  <div className="rounded-md border border-risk-low/30 bg-risk-low/10 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">
                        {saferRoute.name}
                      </span>
                      <Badge className="bg-risk-low text-destructive-foreground">
                        Safe
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {saferRoute.fromName} → {saferRoute.toName}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-foreground">
                        <Navigation className="h-3 w-3 text-primary" />
                        {saferRoute.distanceKm} km
                      </span>
                      <span className="flex items-center gap-1 text-foreground">
                        <Clock className="h-3 w-3 text-primary" />
                        {saferRoute.estimatedTimeMin} min
                      </span>
                    </div>
                  </div>
                  <Button
                    variant={showRoute ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => setShowRoute(!showRoute)}
                  >
                    <RouteIcon className="mr-2 h-4 w-4" />
                    {showRoute ? 'Hide Safer Route' : 'Show Safer Route'}
                  </Button>
                  <p className="text-[11px] text-muted-foreground">
                    Demo route shown for prototype. In production, OSRM would
                    calculate the safest path based on real-time flood data.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <DisasterMap
            center={incident.center}
            zoom={incident.zoom}
            floodZones={floodZones}
            roads={roads}
            facilities={facilities}
            routes={showRoute ? routes : []}
            showRoutes={true}
            className="h-[600px] lg:h-[700px]"
          />
        </div>
      </div>
    </div>
  );
}
