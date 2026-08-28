'use client';

<<<<<<< HEAD
import { useState } from 'react';
=======
/**
 * app/flood-analysis/page.tsx
 *
 * Real Sentinel-1 SAR Flood Detection Page (Phase 1)
 *
 * Workflow:
 *   User selects study area + pre/post event date ranges + threshold
 *   -> POST /api/earth-engine/flood
 *   -> Real EE change detection (bi-temporal log-ratio)
 *   -> Returns flood area km2 + GeoJSON polygons
 *   -> Displayed on MapLibre map via SARFloodLayer
 *
 * NOTE: This page does NOT use AnalysisSimulator or any fake/demo timers.
 *       All progress stages reflect the real API call.
 */

import { useState, useMemo, useCallback } from 'react';
>>>>>>> fab0acf (adding SAR)
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
<<<<<<< HEAD
  EarthEngineStatusIndicator,
  SimulatedDataNote,
  LoadingState,
} from '@/components/shared/StateIndicators';
import { useFloodAnalysis } from '@/hooks/use-flood-analysis';
import { sangliSentinel1Analysis } from '@/data/satelliteAnalysis';
import { floodZones } from '@/data/floodZones';
=======
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
>>>>>>> fab0acf (adding SAR)
import {
  Satellite,
  Waves,
  Target,
  Info,
  MapPin,
  Radar,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  Loader2,
  Info,
  RotateCcw,
  Map,
} from 'lucide-react';
import { useRealFloodAnalysis, REAL_FLOOD_STAGE_LABELS, type RealFloodAnalysisParams } from '@/hooks/use-flood-analysis';
import { getAllStudyAreas, getStudyArea, getAreaGisData } from '@/lib/earthengine/studyAreas';
import { cn } from '@/lib/utils';

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

<<<<<<< HEAD
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
=======
// Stage ordering for progress display
const STAGE_ORDER = [
  'searching',
  'compositing',
  'detecting',
  'masking',
  'computing',
  'vectorizing',
  'done',
] as const;

type StageName = (typeof STAGE_ORDER)[number];

export default function FloodAnalysisPage() {
  const [selectedAreaId, setSelectedAreaId] = useState('sangli');

  // Get study area defaults
  const studyAreas = useMemo(() => getAllStudyAreas(), []);
  const currentArea = useMemo(() => getStudyArea(selectedAreaId), [selectedAreaId]);
  const areaGis = useMemo(() => getAreaGisData(selectedAreaId), [selectedAreaId]);

  // Form state — default to study area's suggested date ranges
  const [preStartDate, setPreStartDate] = useState(currentArea.preEventDateRange[0]);
  const [preEndDate, setPreEndDate] = useState(currentArea.preEventDateRange[1]);
  const [postStartDate, setPostStartDate] = useState(currentArea.postEventDateRange[0]);
  const [postEndDate, setPostEndDate] = useState(currentArea.postEventDateRange[1]);
  const [polarization, setPolarization] = useState('VV');
  const [threshold, setThreshold] = useState('-1.5');
  const [minAreaKm2, setMinAreaKm2] = useState('0.1');

  // Update date defaults when area changes
  const handleAreaChange = useCallback((areaId: string) => {
    setSelectedAreaId(areaId);
    const area = getStudyArea(areaId);
    setPreStartDate(area.preEventDateRange[0]);
    setPreEndDate(area.preEventDateRange[1]);
    setPostStartDate(area.postEventDateRange[0]);
    setPostEndDate(area.postEventDateRange[1]);
  }, []);

  const { stage, stageLabel, data, error, loading, run, reset } = useRealFloodAnalysis();
>>>>>>> fab0acf (adding SAR)

  const handleRun = useCallback(() => {
    const params: RealFloodAnalysisParams = {
      areaId: selectedAreaId,
      preStartDate,
      preEndDate,
      postStartDate,
      postEndDate,
      polarization,
      threshold: parseFloat(threshold) || -1.5,
      minAreaM2: Math.round((parseFloat(minAreaKm2) || 0.1) * 1e6),
    };
    run(params);
  }, [selectedAreaId, preStartDate, preEndDate, postStartDate, postEndDate, polarization, threshold, minAreaKm2, run]);

<<<<<<< HEAD
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
=======
  const handleReset = useCallback(() => {
    reset();
    const area = getStudyArea(selectedAreaId);
    setPreStartDate(area.preEventDateRange[0]);
    setPreEndDate(area.preEventDateRange[1]);
    setPostStartDate(area.postEventDateRange[0]);
    setPostEndDate(area.postEventDateRange[1]);
    setThreshold('-1.5');
    setMinAreaKm2('0.1');
  }, [reset, selectedAreaId]);

  const currentStageIndex = STAGE_ORDER.indexOf(stage as StageName);
  const isComplete = stage === 'done';
  const isError = stage === 'error';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Satellite className="h-5 w-5 text-primary" />
            Sentinel-1 SAR Flood Detection
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real change-detection pipeline · COPERNICUS/S1_GRD · Google Earth Engine
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isComplete && data?.live && (
            <Badge className="bg-risk-low text-destructive-foreground gap-1">
              <CheckCircle2 className="h-3 w-3" />
              LIVE EARTH ENGINE
            </Badge>
          )}
          {isComplete && !data?.live && (
            <Badge variant="outline" className="border-risk-moderate/40 text-risk-moderate gap-1">
              <XCircle className="h-3 w-3" />
              Offline / Error
            </Badge>
          )}
        </div>
      </div>

      {/* Controls Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Analysis Parameters
          </CardTitle>
          <CardDescription>
            Select study area, event date ranges, and detection settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Study Area */}
          <div className="space-y-2">
            <Label htmlFor="study-area" className="text-xs font-semibold">Study Area</Label>
            <Select value={selectedAreaId} onValueChange={handleAreaChange}>
              <SelectTrigger id="study-area" className="w-full bg-background font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {studyAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    <div className="flex items-center justify-between gap-3 py-0.5">
                      <span className="font-semibold">{area.name}</span>
                      <span className="text-xs text-muted-foreground">({area.state})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Center: {currentArea.centerLat.toFixed(4)}°N, {currentArea.centerLon.toFixed(4)}°E ·
              Buffer: {(currentArea.bufferSizeMeters / 1000).toFixed(0)} km
            </p>
          </div>

          <Separator />

          {/* Date Ranges */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground">Pre-Event Period (baseline)</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="pre-start" className="text-[11px] text-muted-foreground">Start date</Label>
                  <Input
                    id="pre-start"
                    type="date"
                    value={preStartDate}
                    onChange={(e) => setPreStartDate(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pre-end" className="text-[11px] text-muted-foreground">End date</Label>
                  <Input
                    id="pre-end"
                    type="date"
                    value={preEndDate}
                    onChange={(e) => setPreEndDate(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground">Post-Event Period (flood observation)</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="post-start" className="text-[11px] text-muted-foreground">Start date</Label>
                  <Input
                    id="post-start"
                    type="date"
                    value={postStartDate}
                    onChange={(e) => setPostStartDate(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="post-end" className="text-[11px] text-muted-foreground">End date</Label>
                  <Input
                    id="post-end"
                    type="date"
                    value={postEndDate}
                    onChange={(e) => setPostEndDate(e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detection Settings */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="polarization" className="text-xs font-semibold">Polarization</Label>
              <Select value={polarization} onValueChange={setPolarization}>
                <SelectTrigger id="polarization" className="h-8 text-xs bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VV">VV (vertical-vertical)</SelectItem>
                  <SelectItem value="VH">VH (vertical-horizontal)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">VV recommended for open water</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="threshold" className="text-xs font-semibold">Change Threshold (dB)</Label>
              <Input
                id="threshold"
                type="number"
                step="0.5"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="h-8 text-xs"
              />
              <p className="text-[11px] text-muted-foreground">Negative = backscatter decrease = flood</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="min-area" className="text-xs font-semibold">Min Flood Area (km²)</Label>
              <Input
                id="min-area"
                type="number"
                step="0.05"
                min="0.01"
                value={minAreaKm2}
                onChange={(e) => setMinAreaKm2(e.target.value)}
                className="h-8 text-xs"
              />
              <p className="text-[11px] text-muted-foreground">Filter out small noise patches</p>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleRun}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Flood Detection
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={loading}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <p className="text-[11px] text-muted-foreground ml-1">
              Real EE analysis typically takes 15–60 seconds
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Panel — shown when running or done/error */}
      {stage !== 'idle' && (
        <Card className={cn(
          'border',
          isError && 'border-risk-critical/40',
          isComplete && 'border-risk-low/40',
          loading && 'border-primary/30'
        )}>
          <CardContent className="p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Processing Stages
            </p>
            <div className="space-y-2">
              {STAGE_ORDER.filter(s => s !== 'done').map((s, idx) => {
                const isDone = isComplete || (loading && idx < currentStageIndex);
                const isActive = loading && s === stage;
                const label = REAL_FLOOD_STAGE_LABELS[s];
                return (
                  <div key={s} className="flex items-center gap-2.5 text-xs">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-risk-low" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                    ) : isError && idx === currentStageIndex ? (
                      <XCircle className="h-4 w-4 shrink-0 text-risk-critical" />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full border border-muted-foreground/30" />
                    )}
                    <span className={cn(
                      isDone ? 'text-foreground' :
                      isActive ? 'text-primary font-medium' :
                      'text-muted-foreground'
                    )}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {isComplete && (
              <div className="flex items-center gap-2 rounded-md border border-risk-low/30 bg-risk-low/10 px-3 py-2 text-xs">
                <CheckCircle2 className="h-4 w-4 text-risk-low" />
                <span className="text-risk-low font-medium">
                  Analysis complete — flood area: {data?.floodAreaKm2?.toFixed(2)} km²
                  {data?.live ? ' (LIVE Earth Engine)' : ''}
                </span>
              </div>
            )}

            {isError && (
              <div className="flex items-start gap-2 rounded-md border border-risk-critical/30 bg-risk-critical/10 px-3 py-2 text-xs">
                <XCircle className="h-4 w-4 text-risk-critical shrink-0 mt-0.5" />
                <span className="text-risk-critical">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>
>>>>>>> fab0acf (adding SAR)
      )}

      {/* Results */}
      {isComplete && data && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#2563eb]/15">
                  <Waves className="h-5 w-5 text-[#2563eb]" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Flood Area</span>
                  <p className="text-lg font-bold text-foreground">{data.floodAreaKm2.toFixed(2)} km²</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-risk-moderate/15">
                  <Gauge className="h-5 w-5 text-risk-moderate" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Coverage</span>
                  <p className="text-lg font-bold text-foreground">{data.floodPercentage.toFixed(2)}%</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Pre-event</span>
                  <p className="text-base font-bold text-foreground">{data.preEventDate}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-risk-high/15">
                  <Target className="h-5 w-5 text-risk-high" />
                </div>
                <div>
<<<<<<< HEAD
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
=======
                  <span className="text-xs text-muted-foreground">Post-event</span>
                  <p className="text-base font-bold text-foreground">{data.postEventDate}</p>
>>>>>>> fab0acf (adding SAR)
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Analysis Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Satellite className="h-5 w-5 text-primary" />
<<<<<<< HEAD
                  Satellite Analysis
                </CardTitle>
                <CardDescription>
                  Sentinel-1 SAR parameters from Google Earth Engine
=======
                  Detection Parameters
                </CardTitle>
                <CardDescription>
                  SAR change-detection results from Google Earth Engine
>>>>>>> fab0acf (adding SAR)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    { label: 'Sensor', value: data.sensor },
                    { label: 'Collection', value: data.collection },
                    { label: 'Polarization', value: data.polarization },
                    { label: 'Change Threshold', value: `${data.threshold} dB` },
                    { label: 'Pre-event scenes', value: `${data.preEventCount} image(s)` },
                    { label: 'Post-event scenes', value: `${data.postEventCount} image(s)` },
                    { label: 'Study area', value: `${data.studyAreaKm2.toFixed(1)} km²` },
                    { label: 'Flood GeoJSON', value: data.floodGeoJSON ? `${data.floodGeoJSON.features.length} polygon(s)` : 'None' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-2.5 rounded-md border border-border bg-secondary/40 p-2.5">
                      <div className="min-w-0">
                        <span className="block text-[11px] text-muted-foreground">{label}</span>
                        <span className="block text-sm font-medium text-foreground">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
<<<<<<< HEAD
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-foreground">
                    {data.location}
                  </span>
=======
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Radar className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>Method: <strong className="text-foreground">{data.changeDetectionMethod}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>Water mask: <strong className="text-foreground">{data.permanentWaterDataset}</strong></span>
                  </div>
>>>>>>> fab0acf (adding SAR)
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.live ? (
<<<<<<< HEAD
                    <Badge className="bg-risk-low text-destructive-foreground">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Live EE Data
=======
                    <Badge className="bg-risk-low text-destructive-foreground gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      LIVE EARTH ENGINE
>>>>>>> fab0acf (adding SAR)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-risk-moderate/40 text-risk-moderate">
                      <XCircle className="mr-1 h-3 w-3" />
<<<<<<< HEAD
                      Offline Result
=======
                      Not Live
>>>>>>> fab0acf (adding SAR)
                    </Badge>
                  )}
                  <Badge variant="outline">
                    SAR Change Detection
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Scientific Notes */}
            <Card className="border-risk-moderate/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 text-risk-moderate" />
                  Scientific Disclaimer
                </CardTitle>
<<<<<<< HEAD
                <CardDescription>
                  Important limitation of this analysis
                </CardDescription>
=======
                <CardDescription>Baseline system — not ground truth</CardDescription>
>>>>>>> fab0acf (adding SAR)
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-risk-moderate/30 bg-risk-moderate/10 p-4 text-sm leading-relaxed text-foreground">
                  {data.metadata.processingNotes || 'SAR-based change detection using Sentinel-1 VV backscatter log-ratio.'}
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <p>
<<<<<<< HEAD
                    This result is a <strong className="text-foreground">potential flood mask</strong> derived
                    from a single Sentinel-1 SAR acquisition using VV polarization thresholding at -17 dB.
                  </p>
                  <p>
                    It identifies pixels with low backscatter consistent with standing water, but may
                    also include permanent water bodies or smooth surfaces. Field validation is recommended.
=======
                    • <strong className="text-foreground">Method:</strong> Post − Pre median composite in dB domain. Negative
                    change ({data.threshold} dB threshold) indicates backscatter decrease consistent with inundation.
                  </p>
                  <p>
                    • <strong className="text-foreground">Permanent water:</strong> Pixels with JRC occurrence ≥ 80% are
                    excluded to avoid classifying rivers/lakes as new floods.
                  </p>
                  <p>
                    • <strong className="text-foreground">False positives possible from:</strong> terrain shadows, dense
                    vegetation, urban structures, and soil moisture. Results are not ground truth.
>>>>>>> fab0acf (adding SAR)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
<<<<<<< HEAD
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
=======
                    <Map className="h-5 w-5 text-primary" />
                    SAR Flood Extent — Interactive Map
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Blue polygon = SAR-detected flood area · {currentArea.name}
                    {data.floodGeoJSON && data.floodGeoJSON.features.length > 0
                      ? ` · ${data.floodGeoJSON.features.length} flood polygon(s)`
                      : data.floodAreaKm2 === 0
                      ? ' · No flood area detected'
                      : ' · GeoJSON vectorization failed — check EE logs'
                    }
                  </CardDescription>
                </div>
                {data.floodAreaKm2 > 0 && (
                  <Badge className="bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/30">
                    {data.floodAreaKm2.toFixed(2)} km² detected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <DisasterMap
                  key={`sar-map-${selectedAreaId}-${data.postEventDate}`}
                  center={[currentArea.centerLon, currentArea.centerLat]}
                  zoom={currentArea.zoom}
                  floodZones={areaGis.floodZones}
                  roads={areaGis.roads}
                  facilities={areaGis.facilities}
                  routes={[]}
                  showRoutes={false}
                  showLegend={true}
                  className="h-[500px]"
                  overlayLabel={`Sentinel-1 SAR Change Detection · ${currentArea.name} · Pre: ${data.preEventDate} → Post: ${data.postEventDate}`}
                  sarFloodGeoJSON={data.floodGeoJSON}
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {data.floodGeoJSON && data.floodGeoJSON.features.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-4 rounded-sm bg-[#2563eb]/60 border border-[#2563eb]" />
                    <span>SAR flood detection (real EE result)</span>
                  </div>
                )}
                <span>Background overlays are estimated GIS layers (not SAR measurements).</span>
              </div>
>>>>>>> fab0acf (adding SAR)
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

      {/* Idle state — instructions */}
      {stage === 'idle' && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Satellite className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Ready to run Sentinel-1 flood detection</p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Select your study area and event date ranges above, then click{' '}
              <strong>Run Flood Detection</strong> to contact Google Earth Engine and run
              real SAR change-detection analysis.
            </p>
            <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0" />
              <span>Requires Earth Engine credentials configured in environment variables.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
