import type { RiskLevel } from '@/types/incident';
import type {
  RiskAssessment,
  RiskFactorBreakdown,
  RiskFactorWeights,
} from '@/types/risk';

export const RISK_WEIGHTS: RiskFactorWeights = {
  floodExposure: 0.4,
  populationExposure: 0.25,
  roadImportance: 0.15,
  criticalFacility: 0.1,
  elevationRisk: 0.1,
};

export interface RiskInput {
  floodExposure: number;
  populationExposure: number;
  roadImportance: number;
  criticalFacility: number;
  elevationRisk: number;
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 30) return 'moderate';
  return 'low';
}

export function calculateRisk(input: RiskInput): {
  riskScore: number;
  riskLevel: RiskLevel;
  factorBreakdown: RiskFactorBreakdown;
} {
  const factorBreakdown: RiskFactorBreakdown = {
    floodExposure: input.floodExposure,
    populationExposure: input.populationExposure,
    roadImportance: input.roadImportance,
    criticalFacility: input.criticalFacility,
    elevationRisk: input.elevationRisk,
  };

  const riskScore = Math.round(
    input.floodExposure * RISK_WEIGHTS.floodExposure +
      input.populationExposure * RISK_WEIGHTS.populationExposure +
      input.roadImportance * RISK_WEIGHTS.roadImportance +
      input.criticalFacility * RISK_WEIGHTS.criticalFacility +
      input.elevationRisk * RISK_WEIGHTS.elevationRisk
  );

  return {
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    factorBreakdown,
  };
}

export function buildRiskAssessment(
  roadId: string,
  roadName: string,
  input: RiskInput,
  priority: number,
  recommendation: string
): RiskAssessment {
  const { riskScore, riskLevel, factorBreakdown } = calculateRisk(input);
  return {
    id: `RA-${roadId}`,
    roadId,
    roadName,
    riskScore,
    riskLevel,
    factorBreakdown,
    priority,
    recommendation,
  };
}
