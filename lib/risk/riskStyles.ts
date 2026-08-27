import type { RiskLevel } from '@/types/incident';

export const RISK_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  moderate: '#eab308',
  low: '#22c55e',
  info: '#3b82f6',
} as const;

export const riskLevelColors: Record<RiskLevel, string> = {
  critical: RISK_COLORS.critical,
  high: RISK_COLORS.high,
  moderate: RISK_COLORS.moderate,
  low: RISK_COLORS.low,
};

export const riskLevelLabels: Record<RiskLevel, string> = {
  critical: 'Critical',
  high: 'High',
  moderate: 'Moderate',
  low: 'Low',
};

export const riskLevelBgClasses: Record<RiskLevel, string> = {
  critical: 'bg-risk-critical/15 text-risk-critical border-risk-critical/30',
  high: 'bg-risk-high/15 text-risk-high border-risk-high/30',
  moderate:
    'bg-risk-moderate/15 text-risk-moderate border-risk-moderate/30',
  low: 'bg-risk-low/15 text-risk-low border-risk-low/30',
};

export const facilityTypeLabels: Record<string, string> = {
  hospital: 'Hospital',
  health_center: 'Health Centre',
  shelter: 'Emergency Shelter',
  police: 'Police Station',
  fire_station: 'Fire Station',
};
