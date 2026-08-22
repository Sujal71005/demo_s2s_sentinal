'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Circle, Activity, Cpu, Database, Satellite, Map } from 'lucide-react';

const services = [
  {
    name: 'Frontend Application',
    icon: Activity,
    status: 'operational',
    description: 'Next.js application server is running',
  },
  {
    name: 'Map Rendering Engine',
    icon: Map,
    status: 'operational',
    description: 'MapLibre GL JS rendering is functional',
  },
  {
    name: 'Risk Calculation Engine',
    icon: Cpu,
    status: 'operational',
    description: 'Weighted risk model is computing scores',
  },
  {
    name: 'Mock Data Layer',
    icon: Database,
    status: 'operational',
    description: 'Local mock data files are loaded',
  },
  {
    name: 'Satellite Data Pipeline',
    icon: Satellite,
    status: 'pending',
    description: 'Google Earth Engine integration is planned for a future phase',
  },
  {
    name: 'Backend API Server',
    icon: Cpu,
    status: 'pending',
    description: 'FastAPI backend integration is planned for a future phase',
  },
  {
    name: 'Database (PostGIS)',
    icon: Database,
    status: 'pending',
    description: 'PostgreSQL + PostGIS database is planned for a future phase',
  },
];

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  operational: {
    label: 'Operational',
    color: 'text-risk-low',
    dot: 'fill-risk-low text-risk-low',
  },
  pending: {
    label: 'Planned',
    color: 'text-muted-foreground',
    dot: 'fill-muted-foreground text-muted-foreground',
  },
};

export default function SystemStatusPage() {
  const operationalCount = services.filter(
    (s) => s.status === 'operational'
  ).length;
  const totalCount = services.length;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-risk-low/15">
              <Circle className="h-6 w-6 fill-risk-low text-risk-low" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">
                All Systems Operational
              </h2>
              <p className="text-sm text-muted-foreground">
                {operationalCount} of {totalCount} services are running.
                Remaining services are planned for future integration.
              </p>
            </div>
            <Badge className="bg-risk-low text-destructive-foreground">
              Operational
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Service Status</CardTitle>
          <CardDescription>
            Detailed status of all platform components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {services.map((service) => {
            const Icon = service.icon;
            const sc = statusConfig[service.status];
            return (
              <div
                key={service.name}
                className="flex items-center gap-3 rounded-md border border-border bg-secondary/40 p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">
                    {service.name}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className={`h-2.5 w-2.5 ${sc.dot}`} />
                  <span className={`text-xs font-medium ${sc.color}`}>
                    {sc.label}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Build Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Environment</span>
            <span className="font-medium text-foreground">Prototype / Demo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mode</span>
            <span className="font-medium text-foreground">Demo Mode (No Auth)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data Source</span>
            <span className="font-medium text-foreground">Local Mock Data</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Map Provider</span>
            <span className="font-medium text-foreground">OpenStreetMap (Free)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
