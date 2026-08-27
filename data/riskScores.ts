import type { RiskAssessment } from '@/types/risk';

export const riskAssessments: RiskAssessment[] = [
  {
    id: 'RA-R102',
    roadId: 'R-102',
    roadName: 'Sangli-Kolhapur Highway',
    riskScore: 91,
    riskLevel: 'critical',
    factorBreakdown: {
      floodExposure: 82,
      populationExposure: 71,
      roadImportance: 90,
      criticalFacility: 100,
      elevationRisk: 78,
    },
    priority: 1,
    recommendation:
      'Immediate closure required. Divert traffic via Miraj Bypass. Deploy emergency response teams to assist stranded vehicles.',
  },
  {
    id: 'RA-R112',
    roadId: 'R-112',
    roadName: 'Krishna River Bridge Road',
    riskScore: 88,
    riskLevel: 'critical',
    factorBreakdown: {
      floodExposure: 90,
      populationExposure: 45,
      roadImportance: 75,
      criticalFacility: 100,
      elevationRisk: 85,
    },
    priority: 2,
    recommendation:
      'Inspect Bridge B-04 for structural integrity. Restrict heavy vehicle movement until assessment is complete.',
  },
  {
    id: 'RA-R105',
    roadId: 'R-105',
    roadName: 'Haripur Road',
    riskScore: 74,
    riskLevel: 'high',
    factorBreakdown: {
      floodExposure: 68,
      populationExposure: 55,
      roadImportance: 70,
      criticalFacility: 80,
      elevationRisk: 72,
    },
    priority: 3,
    recommendation:
      'Monitor water levels. Preposition rescue boats. Prepare for partial closure if flooding worsens.',
  },
  {
    id: 'RA-R121',
    roadId: 'R-121',
    roadName: 'Industrial Estate Road',
    riskScore: 71,
    riskLevel: 'high',
    factorBreakdown: {
      floodExposure: 60,
      populationExposure: 65,
      roadImportance: 68,
      criticalFacility: 70,
      elevationRisk: 70,
    },
    priority: 4,
    recommendation:
      'Alert industrial units to activate flood protocols. Ensure drainage pumps are operational.',
  },
  {
    id: 'RA-R108',
    roadId: 'R-108',
    roadName: 'Vishrambag-Sangli Road',
    riskScore: 69,
    riskLevel: 'high',
    factorBreakdown: {
      floodExposure: 55,
      populationExposure: 70,
      roadImportance: 60,
      criticalFacility: 65,
      elevationRisk: 68,
    },
    priority: 5,
    recommendation:
      'Monitor urban drainage. Clear debris from culverts to prevent waterlogging in residential areas.',
  },
];
