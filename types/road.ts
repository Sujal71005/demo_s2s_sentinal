import type { RiskLevel } from './incident';

export type RoadClass = 'highway' | 'major' | 'secondary' | 'local';

export type PopulationExposure = 'low' | 'moderate' | 'high' | 'critical';

export interface Road {
  id: string;
  name: string;
  class: RoadClass;
  riskLevel: RiskLevel;
  riskScore: number;
  floodExposure: number;
  populationExposure: PopulationExposure;
  criticalConnectivity: boolean;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}
