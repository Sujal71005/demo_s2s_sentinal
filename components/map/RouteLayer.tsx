'use client';

import { Source, Layer } from '@vis.gl/react-maplibre';
import type { Route } from '@/types/response';

interface RouteLayerProps {
  routes: Route[];
  visible?: boolean;
}

export function RouteLayer({ routes, visible = true }: RouteLayerProps) {
  if (!visible || routes.length === 0) return null;

  const geojson = {
    type: 'FeatureCollection' as const,
    features: routes.map((route) => ({
      type: 'Feature' as const,
      properties: {
        id: route.id,
        name: route.name,
        riskLevel: route.riskLevel,
      },
      geometry: route.geometry,
    })),
  };

  return (
    <Source id="safe-routes" type="geojson" data={geojson}>
      <Layer
        id="safe-routes-line"
        type="line"
        paint={{
          'line-color': '#22c55e',
          'line-width': 5,
          'line-opacity': 0.85,
          'line-dasharray': [2, 1],
        }}
      />
    </Source>
  );
}
