'use client';

import { Marker } from '@vis.gl/react-maplibre';
import { Hospital, Shield, Building2, Siren, Flame } from 'lucide-react';
import type { Facility } from '@/types/facility';
import { riskLevelColors } from '@/lib/risk/riskStyles';
import { cn } from '@/lib/utils';

interface FacilityLayerProps {
  facilities: Facility[];
  selectedFacilityId?: string;
  visible?: boolean;
}

const facilityIcons = {
  hospital: Hospital,
  health_center: Building2,
  shelter: Shield,
  police: Siren,
  fire_station: Flame,
};

export function FacilityLayer({
  facilities,
  selectedFacilityId,
  visible = true,
}: FacilityLayerProps) {
  if (!visible || facilities.length === 0) return null;

  return (
    <>
      {facilities.map((facility) => {
        const Icon = facilityIcons[facility.type] ?? Building2;
        const color = riskLevelColors[facility.riskLevel];
        const isSelected = facility.id === selectedFacilityId;

        return (
          <Marker
            key={facility.id}
            longitude={facility.longitude}
            latitude={facility.latitude}
            anchor="bottom"
          >
            <div
              className={cn(
                'flex items-center justify-center rounded-full border-2 shadow-lg transition-transform',
                isSelected
                  ? 'h-10 w-10 scale-110'
                  : 'h-8 w-8 hover:scale-110'
              )}
              style={{
                backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
                borderColor: color,
              }}
            >
              <Icon
                className="h-4 w-4"
                style={{ color }}
                strokeWidth={2.5}
              />
            </div>
          </Marker>
        );
      })}
    </>
  );
}
