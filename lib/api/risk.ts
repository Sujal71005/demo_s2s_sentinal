import { riskAssessments } from '@/data/riskScores';
import { roads } from '@/data/roads';
import { facilities } from '@/data/facilities';
import type { RiskAssessment } from '@/types/risk';
import type { Road } from '@/types/road';
import type { Facility } from '@/types/facility';

export async function getRiskAssessments(): Promise<RiskAssessment[]> {
  return riskAssessments;
}

export async function getRiskAssessmentByRoadId(
  roadId: string
): Promise<RiskAssessment | undefined> {
  return riskAssessments.find((r) => r.roadId === roadId);
}

export async function getRoads(): Promise<Road[]> {
  return roads;
}

export async function getRoadById(id: string): Promise<Road | undefined> {
  return roads.find((r) => r.id === id);
}

export async function getFacilities(): Promise<Facility[]> {
  return facilities;
}

export async function getFacilityById(
  id: string
): Promise<Facility | undefined> {
  return facilities.find((f) => f.id === id);
}
