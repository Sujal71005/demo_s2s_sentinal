'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Satellite,
  Map as MapIcon,
  Database,
  Activity,
  Info,
  Circle,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-primary" />
            Demo Mode
          </CardTitle>
          <CardDescription>
            The application is running with simulated flood data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-foreground">
                Demo Mode Active
              </span>
              <p className="text-xs text-muted-foreground">
                Uses mock data instead of live satellite feeds
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-foreground">
                Show Demo Data Indicator
              </span>
              <p className="text-xs text-muted-foreground">
                Display the &quot;Demo Data Active&quot; banner on all pages
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapIcon className="h-5 w-5 text-primary" />
            Map Settings
          </CardTitle>
          <CardDescription>
            Configure the map tile provider and default view
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-foreground">
                Tile Provider
              </span>
              <p className="text-xs text-muted-foreground">
                OpenStreetMap (free, no API key required)
              </p>
            </div>
            <Badge variant="secondary">OSM Raster</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-foreground">
                Custom Style URL
              </span>
              <p className="text-xs text-muted-foreground">
                Set NEXT_PUBLIC_MAP_STYLE_URL in .env to use a custom map style
              </p>
            </div>
            <Badge variant="outline">Env Variable</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-foreground">
                Default Zoom Level
              </span>
              <p className="text-xs text-muted-foreground">
                Initial zoom for the incident map view
              </p>
            </div>
            <Badge variant="secondary">11</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Satellite className="h-5 w-5 text-primary" />
            Data Source
          </CardTitle>
          <CardDescription>
            Satellite imagery and flood detection configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-foreground">
                Satellite Platform
              </span>
              <p className="text-xs text-muted-foreground">
                Sentinel-1 SAR (planned — not yet integrated)
              </p>
            </div>
            <Badge variant="outline" className="border-risk-moderate/40 text-risk-moderate">
              Planned
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-foreground">
                Processing Engine
              </span>
              <p className="text-xs text-muted-foreground">
                Google Earth Engine (planned — not yet integrated)
              </p>
            </div>
            <Badge variant="outline" className="border-risk-moderate/40 text-risk-moderate">
              Planned
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-foreground">
                Current Data Source
              </span>
              <p className="text-xs text-muted-foreground">
                Local mock data files in /data directory
              </p>
            </div>
            <Badge className="bg-risk-low text-destructive-foreground">Active</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-primary" />
            System Status
          </CardTitle>
          <CardDescription>
            Current platform health and service availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {[
            { name: 'Frontend Application', status: 'Operational' },
            { name: 'Map Rendering Engine', status: 'Operational' },
            { name: 'Risk Calculation Engine', status: 'Operational' },
            { name: 'Satellite Data Pipeline', status: 'Not Integrated' },
            { name: 'Backend API Server', status: 'Not Integrated' },
            { name: 'Database (PostGIS)', status: 'Not Integrated' },
          ].map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between rounded-md border border-border bg-secondary/40 p-2.5"
            >
              <span className="text-sm text-foreground">{service.name}</span>
              <div className="flex items-center gap-2">
                <Circle
                  className={`h-2 w-2 ${
                    service.status === 'Operational'
                      ? 'fill-risk-low text-risk-low'
                      : 'fill-muted-foreground text-muted-foreground'
                  }`}
                />
                <span
                  className={`text-xs ${
                    service.status === 'Operational'
                      ? 'text-risk-low'
                      : 'text-muted-foreground'
                  }`}
                >
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-5 w-5 text-primary" />
            Application Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Application Name</span>
            <span className="font-medium text-foreground">S2S Sentinels</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Team</span>
            <span className="font-medium text-foreground">TechSentinals</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Event</span>
            <span className="font-medium text-foreground">Smart India Hackathon 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Problem Statement</span>
            <span className="font-medium text-foreground">Satellite-to-Street</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-medium text-foreground">0.1.0 (Prototype)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Framework</span>
            <span className="font-medium text-foreground">Next.js 13.5 + TypeScript</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Map Engine</span>
            <span className="font-medium text-foreground">MapLibre GL JS</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
