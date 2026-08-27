'use client';

import { Source, Layer } from '@vis.gl/react-maplibre';
import type { FloodZone } from '@/types/flood';
import { riskLevelColors } from '@/lib/risk/riskStyles';
import { riskLevelLabels } from '@/lib/risk/riskStyles';

interface FloodLayerProps {
  zones: FloodZone[];
  visible?: boolean;
}

export function FloodLayer({ zones, visible = true }: FloodLayerProps) {
  if (!visible || zones.length === 0) return null;

  const geojson = {
    type: 'FeatureCollection' as const,
    features: zones.map((zone) => ({
      type: 'Feature' as const,
      properties: {
        id: zone.id,
        name: zone.name,
        riskLevel: zone.riskLevel,
        riskLabel: riskLevelLabels[zone.riskLevel],
        areaKm2: zone.areaKm2,
        confidence: zone.confidence,
      },
      geometry: zone.geometry,
    })),
  };

  return (
    <Source id="flood-zones" type="geojson" data={geojson}>
      <Layer
        id="flood-zones-fill"
        type="fill"
        paint={{
          'fill-color': [
            'match',
            ['get', 'riskLevel'],
            'critical',
            riskLevelColors.critical,
            'high',
            riskLevelColors.high,
            'moderate',
            riskLevelColors.moderate,
            'low',
            riskLevelColors.low,
            riskLevelColors.moderate,
          ],
          'fill-opacity': 0.35,
        }}
      />
      <Layer
        id="flood-zones-outline"
        type="line"
        paint={{
          'line-color': [
            'match',
            ['get', 'riskLevel'],
            'critical',
            riskLevelColors.critical,
            'high',
            riskLevelColors.high,
            'moderate',
            riskLevelColors.moderate,
            'low',
            riskLevelColors.low,
            riskLevelColors.moderate,
          ],
          'line-width': 2,
          'line-opacity': 0.8,
        }}
      />
    </Source>
  );
}
