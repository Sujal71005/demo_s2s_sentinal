'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { Sentinel1AnalysisIndicator, SimulatedDataNote } from '@/components/shared/StateIndicators';
import { roads } from '@/data/roads';
import { facilities } from '@/data/facilities';
import { floodZones } from '@/data/floodZones';
import { riskAssessments } from '@/data/riskScores';
import { incidents } from '@/data/incidents';
import { RISK_WEIGHTS } from '@/lib/risk/calculateRisk';
import { facilityTypeLabels } from '@/lib/risk/riskStyles';
import { ShieldAlert, TrendingDown, TrendingUp } from 'lucide-react';
import type { RiskFactorBreakdown } from '@/types/risk';

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

const factorLabels: Record<keyof RiskFactorBreakdown, string> = {
  floodExposure: 'Flood Exposure',
  populationExposure: 'Population Exposure',
  roadImportance: 'Road Importance',
  criticalFacility: 'Hospital Connectivity',
  elevationRisk: 'Elevation Risk',
};

export default function RiskPage() {
  const [selectedRoadId, setSelectedRoadId] = useState<string | undefined>(
    riskAssessments[0].roadId
  );

  const incident = useMemo(() => incidents[0], []);
  const selectedAssessment = riskAssessments.find(
    (r) => r.roadId === selectedRoadId
  );
  const selectedRoad = roads.find((r) => r.id === selectedRoadId);

  const sortedAssessments = [...riskAssessments].sort(
    (a, b) => b.riskScore - a.riskScore
  );

  const avgRisk = Math.round(
    riskAssessments.reduce((sum, r) => sum + r.riskScore, 0) /
      riskAssessments.length
  );

  const criticalCount = riskAssessments.filter(
    (r) => r.riskLevel === 'critical'
  ).length;
  const highCount = riskAssessments.filter(
    (r) => r.riskLevel === 'high'
  ).length;

  return (
    <div className="space-y-5">
      <Sentinel1AnalysisIndicator />
      <SimulatedDataNote />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-risk-critical/15">
                <ShieldAlert className="h-5 w-5 text-risk-critical" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Average Risk Score</span>
                <p className="text-lg font-bold text-foreground">{avgRisk}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-risk-critical/15">
                <TrendingUp className="h-5 w-5 text-risk-critical" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Critical Risk Roads</span>
                <p className="text-lg font-bold text-foreground">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-risk-high/15">
                <TrendingDown className="h-5 w-5 text-risk-high" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">High Risk Roads</span>
                <p className="text-lg font-bold text-foreground">{highCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Affected Roads</CardTitle>
              <CardDescription>
                Click a road to view detailed risk breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead className="text-right">Flood %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAssessments.map((assessment) => {
                      const road = roads.find((r) => r.id === assessment.roadId);
                      const isSelected = assessment.roadId === selectedRoadId;
                      return (
                        <TableRow
                          key={assessment.id}
                          className={
                            isSelected
                              ? 'bg-primary/10'
                              : 'cursor-pointer hover:bg-secondary/60'
                          }
                          onClick={() => setSelectedRoadId(assessment.roadId)}
                        >
                          <TableCell className="font-mono text-xs font-medium">
                            {assessment.roadId}
                          </TableCell>
                          <TableCell className="text-sm">
                            {assessment.roadName}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {assessment.riskScore}
                          </TableCell>
                          <TableCell>
                            <RiskBadge level={assessment.riskLevel} />
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {road?.floodExposure ?? 0}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <DisasterMap
              center={incident.center}
              zoom={incident.zoom}
              floodZones={floodZones}
              roads={roads}
              facilities={facilities}
              selectedRoadId={selectedRoadId}
              onSelectRoad={setSelectedRoadId}
              showRoutes={false}
              className="h-[400px]"
            />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {selectedAssessment && selectedRoad && (
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Road {selectedAssessment.roadId}
                  </CardTitle>
                  <RiskBadge level={selectedAssessment.riskLevel} />
                </div>
                <CardDescription>{selectedAssessment.roadName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-border bg-secondary/40 p-3 text-center">
                  <span className="text-xs text-muted-foreground">Risk Score</span>
                  <p className="text-3xl font-bold text-foreground">
                    {selectedAssessment.riskScore}
                    <span className="text-base text-muted-foreground">/100</span>
                  </p>
                  <Badge
                    className={
                      selectedAssessment.riskLevel === 'critical'
                        ? 'mt-1 bg-risk-critical text-destructive-foreground'
                        : selectedAssessment.riskLevel === 'high'
                          ? 'mt-1 bg-risk-high text-destructive-foreground'
                          : 'mt-1'
                    }
                  >
                    Priority #{selectedAssessment.priority} —{' '}
                    {selectedAssessment.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Risk Factor Breakdown
                  </span>
                  {(Object.keys(factorLabels) as Array<keyof RiskFactorBreakdown>).map(
                    (key) => {
                      const value = selectedAssessment.factorBreakdown[key];
                      const weight = Math.round(RISK_WEIGHTS[key] * 100);
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {factorLabels[key]}
                              <span className="ml-1 text-muted-foreground/60">
                                ({weight}%)
                              </span>
                            </span>
                            <span className="font-medium text-foreground">
                              {value}
                            </span>
                          </div>
                          <Progress
                            value={value}
                            className="mt-1 h-1.5"
                          />
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="rounded-md border border-border bg-secondary/40 p-3">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Recommendation
                  </span>
                  <p className="mt-1 text-xs text-foreground">
                    {selectedAssessment.recommendation}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md border border-border bg-secondary/40 p-2.5">
                    <span className="text-muted-foreground">Flood Exposure</span>
                    <p className="font-semibold text-foreground">
                      {selectedRoad.floodExposure}%
                    </p>
                  </div>
                  <div className="rounded-md border border-border bg-secondary/40 p-2.5">
                    <span className="text-muted-foreground">Population</span>
                    <p className="font-semibold text-foreground capitalize">
                      {selectedRoad.populationExposure}
                    </p>
                  </div>
                  <div className="rounded-md border border-border bg-secondary/40 p-2.5">
                    <span className="text-muted-foreground">Road Class</span>
                    <p className="font-semibold text-foreground capitalize">
                      {selectedRoad.class}
                    </p>
                  </div>
                  <div className="rounded-md border border-border bg-secondary/40 p-2.5">
                    <span className="text-muted-foreground">Hospital Access</span>
                    <p className="font-semibold text-foreground">
                      {selectedRoad.criticalConnectivity ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Critical Facilities at Risk</CardTitle>
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
