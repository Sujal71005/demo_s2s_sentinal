'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { Sentinel1AnalysisIndicator, SimulatedDataNote } from '@/components/shared/StateIndicators';
import { useDisasterData } from '@/hooks/use-disaster-data';
import { facilityTypeLabels } from '@/lib/risk/riskStyles';
import { Map as MapIcon, Layers } from 'lucide-react';

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

export default function IncidentsPage() {
  const { incidents, facilities, floodZones, roads, routes, loading } = useDisasterData('INC-SANGLI-2019');
  const [selectedRoadId, setSelectedRoadId] = useState<string | undefined>();

  const incident = useMemo(() => incidents[0], [incidents]);
  const selectedRoad = roads.find((r) => r.id === selectedRoadId);

  if (loading || !incident) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Sentinel1AnalysisIndicator />
      <SimulatedDataNote />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <DisasterMap
            center={incident.center}
            zoom={incident.zoom}
            floodZones={floodZones}
            roads={roads}
            facilities={facilities}
            routes={routes}
            selectedRoadId={selectedRoadId}
            onSelectRoad={setSelectedRoadId}
            className="h-[600px] lg:h-[700px]"
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MapIcon className="h-4 w-4 text-primary" />
                Active Incident
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-semibold text-foreground">
                  {incident.name}
                </span>
                <p className="text-xs text-muted-foreground">{incident.region}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border border-border bg-secondary/40 p-2">
                  <span className="text-muted-foreground">Flooded</span>
                  <p className="font-semibold text-foreground">
                    {incident.affectedAreaKm2} km²
                  </p>
                </div>
                <div className="rounded-md border border-border bg-secondary/40 p-2">
                  <span className="text-muted-foreground">Roads</span>
                  <p className="font-semibold text-foreground">
                    {incident.affectedRoads}
                  </p>
                </div>
                <div className="rounded-md border border-border bg-secondary/40 p-2">
                  <span className="text-muted-foreground">Population</span>
                  <p className="font-semibold text-foreground">
                    {incident.populationExposed.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="rounded-md border border-border bg-secondary/40 p-2">
                  <span className="text-muted-foreground">Facilities</span>
                  <p className="font-semibold text-foreground">
                    {incident.criticalFacilities}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedRoad && (
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Selected Road</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {selectedRoad.id}
                  </span>
                  <RiskBadge level={selectedRoad.riskLevel} />
                </div>
                <p className="text-xs text-muted-foreground">{selectedRoad.name}</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Score</span>
                    <span className="font-medium text-foreground">
                      {selectedRoad.riskScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flood Exposure</span>
                    <span className="font-medium text-foreground">
                      {selectedRoad.floodExposure}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hospital Access</span>
                    <span className="font-medium text-foreground">
                      {selectedRoad.criticalConnectivity ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Layers className="h-4 w-4 text-primary" />
                Map Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Flood Zones</span>
                <Badge variant="secondary">{floodZones.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Roads</span>
                <Badge variant="secondary">{roads.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Facilities</span>
                <Badge variant="secondary">{facilities.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Safe Routes</span>
                <Badge variant="secondary">{routes.length}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Critical Facilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="flex items-center justify-between rounded-md border border-border bg-secondary/40 p-2.5"
                >
                  <div>
                    <span className="text-xs font-medium text-foreground">
                      {facility.name}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {facilityTypeLabels[facility.type]}
                    </p>
                  </div>
                  <RiskBadge level={facility.riskLevel} showDot={false} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
