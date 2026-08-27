import { incidents } from '@/data/incidents';
import type { Incident } from '@/types/incident';

export async function getIncidents(): Promise<Incident[]> {
  return incidents;
}

export async function getIncidentById(id: string): Promise<Incident | undefined> {
  return incidents.find((i) => i.id === id);
}

export async function getDefaultIncident(): Promise<Incident> {
  return incidents[0];
}
