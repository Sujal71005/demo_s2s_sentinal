import type { RiskLevel } from './incident';

export type FacilityType =
  | 'hospital'
  | 'health_center'
  | 'shelter'
  | 'police'
  | 'fire_station';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  riskLevel: RiskLevel;
  latitude: number;
  longitude: number;
  capacity: number;
  occupants: number;
  operational: boolean;
}
