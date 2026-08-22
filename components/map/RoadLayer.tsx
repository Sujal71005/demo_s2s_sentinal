'use client';

import { Source, Layer } from '@vis.gl/react-maplibre';
import type { Road } from '@/types/road';
import { riskLevelColors } from '@/lib/risk/riskStyles';

interface RoadLayerProps {
  roads: Road[];
  selectedRoadId?: string;
  visible?: boolean;
}

export function RoadLayer({
  roads,
  selectedRoadId,
  visible = true,
}: RoadLayerProps) {
  if (!visible || roads.length === 0) return null;

  const geojson = {
    type: 'FeatureCollection' as const,
    features: roads.map((road) => ({
      type: 'Feature' as const,
      properties: {
        id: road.id,
        name: road.name,
        riskLevel: road.riskLevel,
        riskScore: road.riskScore,
        isSelected: road.id === selectedRoadId,
      },
      geometry: road.geometry,
    })),
  };

  return (
    <Source id="roads" type="geojson" data={geojson}>
      <Layer
        id="roads-line"
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
            riskLevelColors.low,
          ],
          'line-width': [
            'case',
            ['get', 'isSelected'],
            6,
            3,
          ],
          'line-opacity': 0.9,
        }}
      />
    </Source>
  );
}
