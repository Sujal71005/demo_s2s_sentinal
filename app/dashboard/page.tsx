'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Waves,
  TrainTrack,
  Users,
  Building2,
  ChevronDown,
  CircleDot,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/shared/KpiCard';
import { AnalysisSimulator } from '@/components/shared/AnalysisSimulator';
import { SimulatedDataNote, EarthEngineStatusIndicator } from '@/components/shared/StateIndicators';
import { useDisasterData } from '@/hooks/use-disaster-data';
import { useFloodAnalysis } from '@/hooks/use-flood-analysis';

const DisasterMap = dynamic(
  () => import('@/components/map/DisasterMap').then((m) => m.DisasterMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-border bg-card">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  }
);

export default function DashboardPage() {
  const { incidents, floodZones, roads, facilities, routes, riskAssessments, loading } = useDisasterData('INC-SANGLI-2019');
  const [selectedIncidentId, setSelectedIncidentId] = useState('');
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const { data: floodData, loading: floodLoading, error: floodError } = useFloodAnalysis();

  useEffect(() => {
    if (incidents.length > 0 && !selectedIncidentId) {
      setSelectedIncidentId(incidents[0].id);
    }
  }, [incidents, selectedIncidentId]);

  const incident = useMemo(
    () => incidents.find((i) => i.id === selectedIncidentId) ?? incidents[0],
    [selectedIncidentId, incidents]
  );

  const criticalRoads = roads.filter((r) => r.riskLevel === 'critical');
  const topRiskAssessment = riskAssessments[0];

  if (loading || !incident) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const liveFloodedArea = floodData
    ? `${floodData.potentialFloodedAreaKm2.toFixed(2)}`
    : `${incident.affectedAreaKm2}`;

  return (
    <div className="space-y-5">
      <EarthEngineStatusIndicator
        live={floodData?.live ?? false}
        loading={floodLoading}
        floodedArea={liveFloodedArea}
        error={floodError ?? floodData?.error}
      />
      <SimulatedDataNote />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Select
            value={selectedIncidentId}
            onValueChange={setSelectedIncidentId}
          >
            <SelectTrigger className="w-[280px]" aria-label="Select incident">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {incidents.map((inc) => (
                <SelectItem key={inc.id} value={inc.id}>
                  {inc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge
            variant="outline"
            className="border-risk-low/40 bg-risk-low/10 text-risk-low"
          >
            <CircleDot className="mr-1 h-3 w-3" />
            Sentinel-1 Analysis
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{incident.region}</span>
        <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
        <span>{new Date(incident.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      <AnalysisSimulator onComplete={() => setAnalysisCompleted(true)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Waves}
          title="Potential Flooded Area"
          value={`${liveFloodedArea} km²`}
          contextLabel={floodData?.live ? 'Sentinel-1 SAR — live Earth Engine data' : 'Sentinel-1 SAR — verified offline result'}
          riskLevel="critical"
        />
        <KpiCard
          icon={TrainTrack}
          title="Affected Roads"
          value={incident.affectedRoads}
          contextLabel={`Estimated — ${criticalRoads.length} critical, ${roads.filter((r) => r.riskLevel === 'high').length} high risk`}
          riskLevel="high"
        />
        <KpiCard
          icon={Users}
          title="Population Exposed"
          value={incident.populationExposed.toLocaleString('en-IN')}
          contextLabel="Estimated — people in flood zones"
          riskLevel="high"
        />
        <KpiCard
          icon={Building2}
          title="Critical Facilities"
          value={incident.criticalFacilities}
          contextLabel="Estimated — hospitals, shelters, emergency services"
          riskLevel="critical"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DisasterMap
            center={incident.center}
            zoom={incident.zoom}
            floodZones={floodZones}
            roads={roads}
            facilities={facilities}
            routes={routes}
            floodCentroid={floodData ? [floodData.centroid.longitude, floodData.centroid.latitude] : undefined}
            className="h-[500px] lg:h-[600px]"
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Priority Alert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-risk-critical/30 bg-risk-critical/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-risk-critical">
                    {topRiskAssessment.roadName}
                  </span>
                  <Badge className="bg-risk-critical text-destructive-foreground">
                    {topRiskAssessment.riskScore}/100
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {topRiskAssessment.recommendation}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Critical Roads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {criticalRoads.map((road) => (
                <div
                  key={road.id}
                  className="flex items-center justify-between rounded-md border border-border bg-secondary/40 p-2.5"
                >
                  <div>
                    <span className="text-xs font-medium text-foreground">
                      {road.id}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {road.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-risk-critical">
                      {road.riskScore}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {road.floodExposure}% flooded
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Flood Zones Detected</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {floodZones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex items-center justify-between rounded-md border border-border bg-secondary/40 p-2.5"
                >
                  <div>
                    <span className="text-xs font-medium text-foreground">
                      {zone.id}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {zone.areaKm2} km²
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-foreground">
                      {zone.confidence}% conf.
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {analysisCompleted && (
        <div className="rounded-md border border-risk-low/30 bg-risk-low/10 px-4 py-3 text-xs text-risk-low">
          {floodData?.live
            ? `Earth Engine analysis complete — potential flooded area: ${liveFloodedArea} km² (live Sentinel-1 data). Road, population, and facility figures are estimated/simulated overlays.`
            : `Sentinel-1 analysis results shown — potential flooded area: ${liveFloodedArea} km² (verified offline result). Road, population, and facility figures are estimated/simulated overlays.`}
        </div>
      )}
    </div>
  );
}
