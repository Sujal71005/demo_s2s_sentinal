'use client';

import { Marker } from '@vis.gl/react-maplibre';
import { AlertTriangle } from 'lucide-react';
import type { Road } from '@/types/road';
import { riskLevelColors } from '@/lib/risk/riskStyles';
import { cn } from '@/lib/utils';

interface RiskLayerProps {
  roads: Road[];
  selectedRoadId?: string;
  visible?: boolean;
}

export function RiskLayer({
  roads,
  selectedRoadId,
  visible = true,
}: RiskLayerProps) {
  if (!visible) return null;

  const riskRoads = roads.filter(
    (r) => r.riskLevel === 'critical' || r.riskLevel === 'high'
  );

  return (
    <>
      {riskRoads.map((road) => {
        const coords = road.geometry.coordinates;
        const midIndex = Math.floor(coords.length / 2);
        const [lng, lat] = coords[midIndex];
        const color = riskLevelColors[road.riskLevel];
        const isSelected = road.id === selectedRoadId;

        return (
          <Marker
            key={`risk-${road.id}`}
            longitude={lng}
            latitude={lat}
            anchor="center"
          >
            <div
              className={cn(
                'flex items-center justify-center rounded-full border-2 shadow-lg transition-transform',
                isSelected ? 'scale-125' : 'hover:scale-110'
              )}
              style={{
                width: 24,
                height: 24,
                backgroundColor: color,
                borderColor: 'white',
              }}
            >
              <AlertTriangle
                className="h-3 w-3 text-white"
                strokeWidth={3}
              />
            </div>
          </Marker>
        );
      })}
    </>
  );
}
