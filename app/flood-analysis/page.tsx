'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
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
import {
  EarthEngineStatusIndicator,
  SimulatedDataNote,
  LoadingState,
} from '@/components/shared/StateIndicators';
import { useFloodAnalysis } from '@/hooks/use-flood-analysis';
import { sangliSentinel1Analysis } from '@/data/satelliteAnalysis';
import { floodZones } from '@/data/floodZones';
import {
  Satellite,
  Waves,
  Target,
  Info,
  MapPin,
  Radar,
  Orbit,
  ArrowDownUp,
  Gauge,
  Crosshair,
  AlertTriangle,
  Database,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const DisasterMap = dynamic(
  () => import('@/components/map/DisasterMap').then((m) => m.DisasterMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[450px] items-center justify-center rounded-lg border border-border bg-card">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  }
);

const SANGLI_MAP_CENTER: [number, number] = [74.51427049360484, 16.916590928882822];

export default function FloodAnalysisPage() {
  const { data, loading, error, refetch } = useFloodAnalysis();
  const [retrying, setRetrying] = useState(false);

  const totalSimArea = floodZones.reduce((sum, z) => sum + z.areaKm2, 0);
  const avgConfidence = Math.round(
    floodZones.reduce((sum, z) => sum + z.confidence, 0) / floodZones.length
  );

  const floodedAreaDisplay = data
    ? (data.potentialFloodedAreaKm2).toFixed(2)
    : sangliSentinel1Analysis.analysis.potentialFloodedAreaKm2.toFixed(2);

  const centroid = data
    ? data.centroid
    : sangliSentinel1Analysis.analysis.centroid;

  const handleRefetch = async () => {
    setRetrying(true);
    refetch();
    setTimeout(() => setRetrying(false), 1000);
  };

  const satelliteInfoItems = data
    ? [
        { icon: Satellite, label: 'Satellite', value: data.satellite },
        { icon: Radar, label: 'Sensor', value: data.sensor },
        { icon: Target, label: 'Date', value: '14 August 2019' },
        { icon: Orbit, label: 'Relative Orbit', value: String(data.relativeOrbit) },
        { icon: ArrowDownUp, label: 'Orbit Direction', value: data.orbitDirection },
        { icon: Gauge, label: 'Polarization', value: data.polarization },
        { icon: Gauge, label: 'VV Threshold', value: `${data.thresholdDb} dB` },
        {
          icon: Waves,
          label: 'Potential Flooded Area',
          value: `${floodedAreaDisplay} km²`,
        },
        {
          icon: Crosshair,
          label: 'Centroid',
          value: `${centroid.longitude.toFixed(4)}°, ${centroid.latitude.toFixed(4)}°`,
        },
      ]
    : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <EarthEngineStatusIndicator
          live={data?.live ?? false}
          loading={loading}
          floodedArea={floodedAreaDisplay}
          error={error ?? data?.error}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefetch}
          disabled={loading || retrying}
          className="shrink-0"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading || retrying ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading && (
        <LoadingState
          label="Querying Google Earth Engine for Sentinel-1 SAR imagery..."
          className="h-[400px]"
        />
      )}

      {!loading && data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-risk-critical/15">
                  <Waves className="h-5 w-5 text-risk-critical" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Potential Flooded Area</span>
                  <p className="text-lg font-bold text-foreground">
                    {floodedAreaDisplay} km²
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15">
                  <Satellite className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Satellite</span>
                  <p className="text-lg font-bold text-foreground">Sentinel-1</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-risk-high/15">
                  <Target className="h-5 w-5 text-risk-high" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Acquisition</span>
                  <p className="text-lg font-bold text-foreground">14 Aug 2019</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-risk-low/15">
                  <Database className="h-5 w-5 text-risk-low" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Dataset</span>
                  <p className="text-lg font-bold text-foreground">COPERNICUS/S1_GRD</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Satellite className="h-5 w-5 text-primary" />
                  Satellite Analysis
                </CardTitle>
                <CardDescription>
                  Sentinel-1 SAR parameters from Google Earth Engine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {satelliteInfoItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2.5 rounded-md border border-border bg-secondary/40 p-2.5"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <span className="block text-[11px] text-muted-foreground">
                            {item.label}
                          </span>
                          <span className="block text-sm font-medium text-foreground">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Separator className="my-3" />
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-foreground">
                    {data.location}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge className="bg-risk-low text-destructive-foreground">
                    Source: {data.source}
                  </Badge>
                  {data.live ? (
                    <Badge className="bg-risk-low text-destructive-foreground">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Live EE Data
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-risk-moderate/40 text-risk-moderate">
                      <XCircle className="mr-1 h-3 w-3" />
                      Offline Result
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-risk-moderate/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 text-risk-moderate" />
                  Scientific Disclaimer
                </CardTitle>
                <CardDescription>
                  Important limitation of this analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-risk-moderate/30 bg-risk-moderate/10 p-4 text-sm leading-relaxed text-foreground">
                  {data.disclaimer}
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <p>
                    This result is a <strong className="text-foreground">potential flood mask</strong> derived
                    from a single Sentinel-1 SAR acquisition using VV polarization thresholding at -17 dB.
                  </p>
                  <p>
                    It identifies pixels with low backscatter consistent with standing water, but may
                    also include permanent water bodies or smooth surfaces. Field validation is recommended.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Crosshair className="h-5 w-5 text-primary" />
                    Flood Centroid — Map View
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Detected flood centroid near Sangli, Maharashtra ({centroid.longitude.toFixed(4)}°, {centroid.latitude.toFixed(4)}°)
                  </CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground">Analysis Type</span>
                  <p className="text-xs font-medium text-foreground">{data.analysisType}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DisasterMap
                center={SANGLI_MAP_CENTER}
                zoom={12}
                floodZones={floodZones}
                roads={[]}
                facilities={[]}
                showRoutes={false}
                showLegend={true}
                floodCentroid={[centroid.longitude, centroid.latitude]}
                className="h-[450px]"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                The marker indicates the SAR-derived flood centroid. Flood-zone polygons shown are
                simulated overlays for demonstration — not the actual Earth Engine flood mask geometry.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data Source</CardTitle>
                <CardDescription>
                  Earth Engine dataset and method details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-border bg-secondary/40 p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Google Earth Engine</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Cloud-based geospatial processing platform
                  </p>
                </div>
                <div className="rounded-md border border-border bg-secondary/40 p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Satellite className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Sentinel-1 SAR</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    C-band Synthetic Aperture Radar (Copernicus mission)
                  </p>
                </div>
                <div className="rounded-md border border-border bg-secondary/40 p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm font-medium text-foreground">COPERNICUS/S1_GRD</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sentinel-1 Ground Range Detected image collection
                  </p>
                </div>
                <Separator />
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VV backscatter threshold</span>
                    <span className="font-medium text-foreground">{data.thresholdDb} dB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Analysis type</span>
                    <span className="font-medium text-foreground">{data.analysisType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pre-flood comparison</span>
                    <span className="font-medium text-foreground">
                      {data.preFloodComparisonAvailable ? 'Available' : 'Not available'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Methodology</CardTitle>
                <CardDescription>
                  How the Sentinel-1 potential flood mask was derived
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      1
                    </span>
                    <span>
                      <span className="text-foreground font-medium">Acquire SAR imagery</span> —
                      Sentinel-1 C-band SAR scene acquired on 14 August 2019 (relative orbit 136, descending pass).
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      2
                    </span>
                    <span>
                      <span className="text-foreground font-medium">VV backscatter thresholding</span> —
                      A VV polarization threshold of -17 dB is applied to identify pixels with low backscatter,
                      indicative of potential standing water.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      3
                    </span>
                    <span>
                      <span className="text-foreground font-medium">Potential flood mask</span> —
                      Thresholded pixels are aggregated to produce a potential flooded area of {floodedAreaDisplay} km².
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      4
                    </span>
                    <span>
                      <span className="text-foreground font-medium">Infrastructure overlay</span> —
                      The flood mask is intersected with road, facility, and population data to assess impact.
                    </span>
                  </li>
                </ol>
                <div className="mt-4 rounded-md border border-risk-moderate/30 bg-risk-moderate/10 p-3 text-xs text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> No suitable pre-flood Sentinel-1 image
                  was available for July 2019 over the exact study area. This is a single-scene
                  thresholding result, not a before-vs-after change detection product.
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Simulated Flood Zone Overlays</CardTitle>
              <CardDescription>
                Estimated zone boundaries (not from Sentinel-1) — for prototype visualization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {floodZones.map((zone) => (
                <div
                  key={zone.id}
                  className="rounded-md border border-border bg-secondary/40 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {zone.id} — {zone.name}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {zone.areaKm2} km² — Simulated overlay
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        zone.riskLevel === 'critical'
                          ? 'border-risk-critical/40 text-risk-critical'
                          : zone.riskLevel === 'high'
                            ? 'border-risk-high/40 text-risk-high'
                            : 'border-risk-moderate/40 text-risk-moderate'
                      }
                    >
                      {zone.confidence}% conf.
                    </Badge>
                  </div>
                </div>
              ))}
              <Separator className="my-1" />
              <p className="text-xs text-muted-foreground">
                Total simulated overlay area: {totalSimArea.toFixed(1)} km² · Avg confidence: {avgConfidence}%.
                The real Sentinel-1 potential flooded area is {floodedAreaDisplay} km².
              </p>
            </CardContent>
          </Card>

          <SimulatedDataNote />
        </>
      )}
    </div>
  );
}
