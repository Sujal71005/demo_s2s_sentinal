'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Sentinel1AnalysisIndicator, SimulatedDataNote } from '@/components/shared/StateIndicators';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { floodZones } from '@/data/floodZones';
import { roads } from '@/data/roads';
import { facilities } from '@/data/facilities';
import { riskAssessments } from '@/data/riskScores';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Waves, Users, Building2 } from 'lucide-react';

const riskDistributionData = [
  { name: 'Critical', value: riskAssessments.filter((r) => r.riskLevel === 'critical').length, fill: 'hsl(var(--risk-critical))' },
  { name: 'High', value: riskAssessments.filter((r) => r.riskLevel === 'high').length, fill: 'hsl(var(--risk-high))' },
  { name: 'Moderate', value: riskAssessments.filter((r) => r.riskLevel === 'moderate').length, fill: 'hsl(var(--risk-moderate))' },
  { name: 'Low', value: riskAssessments.filter((r) => r.riskLevel === 'low').length, fill: 'hsl(var(--risk-low))' },
];

const floodTimelineData = [
  { day: 'Day 1', area: 0.5, roads: 3, population: 800 },
  { day: 'Day 2', area: 1.2, roads: 7, population: 2100 },
  { day: 'Day 3', area: 2.4, roads: 12, population: 3900 },
  { day: 'Day 4', area: 3.2, roads: 17, population: 5284 },
  { day: 'Day 5', area: 2.8, roads: 15, population: 4800 },
  { day: 'Day 6', area: 2.1, roads: 11, population: 3600 },
  { day: 'Day 7', area: 1.6, roads: 8, population: 2400 },
];

const roadRiskData = roads.map((r) => ({
  name: r.id,
  score: r.riskScore,
  flood: r.floodExposure,
}));

const facilityRiskData = facilities.map((f) => ({
  name: f.name.length > 20 ? f.name.slice(0, 20) + '...' : f.name,
  risk: f.riskLevel === 'critical' ? 90 : f.riskLevel === 'high' ? 70 : f.riskLevel === 'moderate' ? 50 : 20,
  type: f.type,
}));

const TooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.5rem',
  fontSize: '12px',
  color: 'hsl(var(--foreground))',
};

export default function AnalyticsPage() {
  const totalFloodArea = floodZones.reduce((sum, z) => sum + z.areaKm2, 0);
  const peakPopulation = Math.max(...floodTimelineData.map((d) => d.population));

  return (
    <div className="space-y-5">
      <Sentinel1AnalysisIndicator />
      <SimulatedDataNote />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-risk-critical/15">
              <Waves className="h-5 w-5 text-risk-critical" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Peak Flood Area</span>
              <p className="text-lg font-bold text-foreground">{totalFloodArea.toFixed(1)} km²</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-risk-high/15">
              <TrendingUp className="h-5 w-5 text-risk-high" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Affected Roads</span>
              <p className="text-lg font-bold text-foreground">{roads.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Peak Exposed Population</span>
              <p className="text-lg font-bold text-foreground">
                {peakPopulation.toLocaleString('en-IN')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-info/15">
              <Building2 className="h-5 w-5 text-info" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Facilities at Risk</span>
              <p className="text-lg font-bold text-foreground">
                {facilities.filter((f) => f.riskLevel === 'critical' || f.riskLevel === 'high').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Flood Area Progression</CardTitle>
            <CardDescription>Flooded area (km²) over 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={floodTimelineData}>
                <defs>
                  <linearGradient id="floodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--risk-critical))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--risk-critical))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={TooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="area"
                  stroke="hsl(var(--risk-critical))"
                  strokeWidth={2}
                  fill="url(#floodGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Population Exposure Over Time</CardTitle>
            <CardDescription>Estimated exposed population per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={floodTimelineData}>
                <defs>
                  <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={TooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="population"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#popGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Road Risk Scores</CardTitle>
            <CardDescription>Risk score and flood exposure per road</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={roadRiskData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={60} />
                <Tooltip contentStyle={TooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="score" name="Risk Score" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="flood" name="Flood %" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Risk Distribution</CardTitle>
            <CardDescription>Road count by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TooltipStyle} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(value: string) => <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Facilities at Risk</CardTitle>
          <CardDescription>Risk level of critical facilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className="flex items-center justify-between rounded-md border border-border bg-secondary/40 p-3"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium text-foreground">{facility.name}</span>
                    <p className="text-xs text-muted-foreground capitalize">
                      {facility.type.replace('_', ' ')} — {facility.occupants}/{facility.capacity} capacity
                    </p>
                  </div>
                </div>
                <RiskBadge level={facility.riskLevel} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
