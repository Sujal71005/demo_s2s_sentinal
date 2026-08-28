'use client';

/**
 * SARFloodLayer.tsx
 *
 * MapLibre layer for displaying real Sentinel-1 SAR flood detection results.
 * Renders the GeoJSON FeatureCollection returned by the EE change-detection pipeline.
 *
 * Distinct from FloodLayer (which shows demo/risk-level polygons):
 * - Uses a solid flood-blue fill (#2563eb)
 * - Has a clear outline for boundary visibility
 * - Shows tooltips with metadata from EE processing
 */

import { Source, Layer } from '@vis.gl/react-maplibre';
import type { GeoJSONFeatureCollection } from '@/types/satellite';

interface SARFloodLayerProps {
  geojson: GeoJSONFeatureCollection;
  visible?: boolean;
  opacity?: number;
}

// SAR flood detection color: vivid blue to distinguish from demo overlays
const SAR_FLOOD_FILL_COLOR = '#2563eb';   // Tailwind blue-600
const SAR_FLOOD_OUTLINE_COLOR = '#1d4ed8'; // Tailwind blue-700

export function SARFloodLayer({
  geojson,
  visible = true,
  opacity = 0.45,
}: SARFloodLayerProps) {
  if (!visible || !geojson || geojson.features.length === 0) return null;

  return (
    <Source id="sar-flood-detection" type="geojson" data={geojson as any}>
      {/* Fill */}
      <Layer
        id="sar-flood-fill"
        type="fill"
        paint={{
          'fill-color': SAR_FLOOD_FILL_COLOR,
          'fill-opacity': opacity,
        }}
      />
      {/* Outline */}
      <Layer
        id="sar-flood-outline"
        type="line"
        paint={{
          'line-color': SAR_FLOOD_OUTLINE_COLOR,
          'line-width': 2,
          'line-opacity': 0.9,
        }}
      />
    </Source>
  );
}
