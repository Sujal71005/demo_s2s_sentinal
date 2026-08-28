'use client';

import { useState, useCallback } from 'react';
import {
  Map,
  NavigationControl,
  ScaleControl,
  Marker,
} from '@vis.gl/react-maplibre';
import { Crosshair } from 'lucide-react';
import { FloodLayer } from './FloodLayer';
import { RoadLayer } from './RoadLayer';
import { FacilityLayer } from './FacilityLayer';
import { RiskLayer } from './RiskLayer';
import { RouteLayer } from './RouteLayer';
import { MapLegend } from './MapLegend';
import { SARFloodLayer } from './SARFloodLayer';
import { getMapStyle } from '@/lib/map/config';
import type { FloodZone } from '@/types/flood';
import type { Road } from '@/types/road';
import type { Facility } from '@/types/facility';
import type { Route } from '@/types/response';
import type { GeoJSONFeatureCollection } from '@/types/satellite';
import { cn } from '@/lib/utils';

interface DisasterMapProps {
  center: [number, number];
  zoom?: number;
  floodZones: FloodZone[];
  roads: Road[];
  facilities: Facility[];
  routes?: Route[];
  selectedRoadId?: string;
  onSelectRoad?: (roadId: string) => void;
  showLegend?: boolean;
  showRoutes?: boolean;
  className?: string;
  interactive?: boolean;
  floodCentroid?: [number, number];
  overlayLabel?: string;
  /** Real SAR flood GeoJSON from Earth Engine — rendered as blue overlay */
  sarFloodGeoJSON?: GeoJSONFeatureCollection | null;
}


export function DisasterMap({
  center,
  zoom = 11,
  floodZones,
  roads,
  facilities,
  routes = [],
  selectedRoadId,
  onSelectRoad,
  showLegend = true,
  showRoutes = true,
  className,
  interactive = true,
  floodCentroid,
  overlayLabel = 'Sentinel-1 SAR · Simulated overlays',
  sarFloodGeoJSON,
}: DisasterMapProps) {

  const [hoveredRoadId, setHoveredRoadId] = useState<string | null>(null);

  const handleRoadClick = useCallback(
    (roadId: string) => {
      onSelectRoad?.(roadId);
    },
    [onSelectRoad]
  );

  return (
    <div
      className={cn(
        'map-container relative overflow-hidden rounded-lg border border-border bg-card',
        className
      )}
    >
      <Map
        initialViewState={{
          longitude: center[0],
          latitude: center[1],
          zoom,
        }}
        mapStyle={getMapStyle()}
        interactive={interactive}
        dragPan={interactive}
        scrollZoom={interactive}
        boxZoom={interactive}
        dragRotate={interactive}
        keyboard={interactive}
        touchZoomRotate={interactive}
        attributionControl={{ compact: true }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <ScaleControl position="bottom-left" unit="metric" />

        <FloodLayer zones={floodZones} />

        {/* Real SAR flood detection layer — rendered on top of demo overlays */}
        {sarFloodGeoJSON && (
          <SARFloodLayer geojson={sarFloodGeoJSON} visible={sarFloodGeoJSON.features.length > 0} />
        )}

        <RoadLayer
          roads={roads}
          selectedRoadId={selectedRoadId ?? hoveredRoadId ?? undefined}
        />
        <RiskLayer roads={roads} selectedRoadId={selectedRoadId} />
        <FacilityLayer facilities={facilities} />
        {showRoutes && <RouteLayer routes={routes} />}

        {floodCentroid && (
          <Marker longitude={floodCentroid[0]} latitude={floodCentroid[1]} anchor="center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-risk-critical shadow-lg">
              <Crosshair className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
          </Marker>
        )}

        {roads.map((road) => {
          const coords = road.geometry.coordinates;
          const midIndex = Math.floor(coords.length / 2);
          const [lng, lat] = coords[midIndex];
          return (
            <Marker
              key={`click-${road.id}`}
              longitude={lng}
              latitude={lat}
              anchor="center"
            >
              <button
                className="h-6 w-6 cursor-pointer rounded-full border-2 border-primary/40 bg-transparent hover:border-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label={`Select ${road.name}`}
                onClick={() => handleRoadClick(road.id)}
                onMouseEnter={() => setHoveredRoadId(road.id)}
                onMouseLeave={() => setHoveredRoadId(null)}
              />
            </Marker>
          );
        })}
      </Map>

      {showLegend && (
        <MapLegend
          className="absolute bottom-3 right-3 z-10"
          compact
          showSarFlood={!!(sarFloodGeoJSON && sarFloodGeoJSON.features.length > 0)}
        />
      )}
      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-md border border-border bg-card/95 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-lg backdrop-blur">
        {overlayLabel}
      </div>
    </div>
  );
}
