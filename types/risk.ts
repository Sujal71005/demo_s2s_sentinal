import type { RiskLevel } from './incident';

export interface RiskFactorBreakdown {
  floodExposure: number;
  populationExposure: number;
  roadImportance: number;
  criticalFacility: number;
  elevationRisk: number;
}

export interface RiskAssessment {
  id: string;
  roadId: string;
  roadName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  factorBreakdown: RiskFactorBreakdown;
  priority: number;
  recommendation: string;
}

export interface RiskFactorWeights {
  floodExposure: number;
  populationExposure: number;
  roadImportance: number;
  criticalFacility: number;
  elevationRisk: number;
}
