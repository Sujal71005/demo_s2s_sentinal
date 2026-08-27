import { floodZones } from '@/data/floodZones';
import type { FloodZone } from '@/types/flood';

export async function getFloodZones(): Promise<FloodZone[]> {
  return floodZones;
}

export async function getFloodZoneById(
  id: string
): Promise<FloodZone | undefined> {
  return floodZones.find((f) => f.id === id);
}

export interface FloodAnalysisResult {
  totalFloodedAreaKm2: number;
  confidenceScore: number;
  zonesDetected: number;
  dataSource: string;
  analysisTimestamp: string;
}

export async function getFloodAnalysisSummary(): Promise<FloodAnalysisResult> {
  const zones = await getFloodZones();
  const totalArea = zones.reduce((sum, z) => sum + z.areaKm2, 0);
  const avgConfidence = Math.round(
    zones.reduce((sum, z) => sum + z.confidence, 0) / zones.length
  );
  return {
    totalFloodedAreaKm2: Math.round(totalArea * 10) / 10,
    confidenceScore: avgConfidence,
    zonesDetected: zones.length,
    dataSource: 'demo',
    analysisTimestamp: new Date().toISOString(),
  };
}
