import type { RiskLevel } from './incident';

export type ResponseActionType =
  | 'close_road'
  | 'inspect_bridge'
  | 'prioritize_access'
  | 'monitor_zone'
  | 'evacuation'
  | 'relief_camp';

export type ResponsePriority = 'critical' | 'high' | 'moderate' | 'low';

export interface ResponseAction {
  id: string;
  type: ResponseActionType;
  title: string;
  description: string;
  priority: ResponsePriority;
  targetId: string;
  completed: boolean;
}

export interface Route {
  id: string;
  name: string;
  fromName: string;
  toName: string;
  riskLevel: RiskLevel;
  estimatedTimeMin: number;
  distanceKm: number;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}
