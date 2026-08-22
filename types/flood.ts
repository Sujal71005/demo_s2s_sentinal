import type { RiskLevel } from './incident';

export interface FloodZone {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  areaKm2: number;
  confidence: number;
  dataSource: 'demo' | 'satellite';
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
}
