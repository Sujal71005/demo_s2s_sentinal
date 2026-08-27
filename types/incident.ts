export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type IncidentStatus = 'active' | 'monitoring' | 'contained' | 'resolved';

export type DataSource = 'demo' | 'satellite' | 'manual';

export interface Incident {
  id: string;
  name: string;
  region: string;
  status: IncidentStatus;
  startDate: string;
  description: string;
  center: [number, number];
  zoom: number;
  dataSource: DataSource;
  affectedAreaKm2: number;
  affectedRoads: number;
  populationExposed: number;
  criticalFacilities: number;
}
