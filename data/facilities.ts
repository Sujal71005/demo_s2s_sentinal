import type { Facility } from '@/types/facility';
import { SATELLITE_FLOOD_CENTROID } from '@/data/satelliteAnalysis';

const [cx, cy] = SATELLITE_FLOOD_CENTROID;

export const facilities: Facility[] = [
  {
    id: 'F-001',
    name: 'Sangli District Hospital',
    type: 'hospital',
    riskLevel: 'critical',
    latitude: cy + 0.01,
    longitude: cx - 0.01,
    capacity: 500,
    occupants: 420,
    operational: true,
  },
  {
    id: 'F-002',
    name: 'Kolhapur Primary Health Centre',
    type: 'health_center',
    riskLevel: 'high',
    latitude: cy - 0.03,
    longitude: cx + 0.03,
    capacity: 80,
    occupants: 65,
    operational: true,
  },
  {
    id: 'F-003',
    name: 'Civil Court Emergency Shelter',
    type: 'shelter',
    riskLevel: 'moderate',
    latitude: cy + 0.02,
    longitude: cx + 0.01,
    capacity: 300,
    occupants: 180,
    operational: true,
  },
  {
    id: 'F-004',
    name: 'Sangli City Police Station',
    type: 'police',
    riskLevel: 'low',
    latitude: cy - 0.01,
    longitude: cx - 0.02,
    capacity: 50,
    occupants: 35,
    operational: true,
  },
  {
    id: 'F-005',
    name: 'Regional Fire Station',
    type: 'fire_station',
    riskLevel: 'moderate',
    latitude: cy,
    longitude: cx + 0.04,
    capacity: 30,
    occupants: 28,
    operational: true,
  },
];
