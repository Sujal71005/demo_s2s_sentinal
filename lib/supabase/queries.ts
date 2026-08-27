import { supabase } from '@/lib/supabase/client';
import { incidents as staticIncidents } from '@/data/incidents';
import { facilities as staticFacilities } from '@/data/facilities';
import { floodZones as staticFloodZones } from '@/data/floodZones';
import { roads as staticRoads } from '@/data/roads';
import { riskAssessments as staticRiskAssessments } from '@/data/riskScores';
import { responseActions as staticResponseActions } from '@/data/responseActions';
import { routes as staticRoutes } from '@/data/routes';
import type { Incident } from '@/types/incident';
import type { Facility } from '@/types/facility';
import type { FloodZone } from '@/types/flood';
import type { Road } from '@/types/road';
import type { RiskAssessment, RiskFactorBreakdown } from '@/types/risk';
import type { ResponseAction, Route } from '@/types/response';

type DbIncident = {
  id: string;
  name: string;
  region: string;
  status: Incident['status'];
  start_date: string;
  description: string;
  center_lng: number;
  center_lat: number;
  zoom: number;
  data_source: Incident['dataSource'];
  affected_area_km2: number;
  affected_roads: number;
  population_exposed: number;
  critical_facilities: number;
};

function mapIncident(row: DbIncident): Incident {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    status: row.status,
    startDate: row.start_date,
    description: row.description,
    center: [row.center_lng, row.center_lat],
    zoom: row.zoom,
    dataSource: row.data_source,
    affectedAreaKm2: Number(row.affected_area_km2),
    affectedRoads: row.affected_roads,
    populationExposed: row.population_exposed,
    criticalFacilities: row.critical_facilities,
  };
}

export async function fetchIncidents(): Promise<Incident[]> {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return staticIncidents;
  return (data as DbIncident[]).map(mapIncident);
}

export async function fetchIncidentById(id: string): Promise<Incident | undefined> {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) {
    return staticIncidents.find((i) => i.id === id);
  }
  return mapIncident(data as DbIncident);
}

type DbFacility = {
  id: string;
  incident_id: string;
  name: string;
  type: Facility['type'];
  risk_level: Facility['riskLevel'];
  latitude: number;
  longitude: number;
  capacity: number;
  occupants: number;
  operational: boolean;
};

function mapFacility(row: DbFacility): Facility {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    riskLevel: row.risk_level,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    capacity: row.capacity,
    occupants: row.occupants,
    operational: row.operational,
  };
}

export async function fetchFacilities(incidentId?: string): Promise<Facility[]> {
  let query = supabase.from('facilities').select('*');
  if (incidentId) query = query.eq('incident_id', incidentId);
  const { data, error } = await query.order('name');
  if (error || !data || data.length === 0) return staticFacilities;
  return (data as DbFacility[]).map(mapFacility);
}

type DbFloodZone = {
  id: string;
  incident_id: string;
  name: string;
  risk_level: FloodZone['riskLevel'];
  area_km2: number;
  confidence: number;
  data_source: FloodZone['dataSource'];
  geometry: { type: 'Polygon'; coordinates: [number, number][][] };
};

function mapFloodZone(row: DbFloodZone): FloodZone {
  return {
    id: row.id,
    name: row.name,
    riskLevel: row.risk_level,
    areaKm2: Number(row.area_km2),
    confidence: row.confidence,
    dataSource: row.data_source,
    geometry: row.geometry,
  };
}

export async function fetchFloodZones(incidentId?: string): Promise<FloodZone[]> {
  let query = supabase.from('flood_zones').select('*');
  if (incidentId) query = query.eq('incident_id', incidentId);
  const { data, error } = await query.order('name');
  if (error || !data || data.length === 0) return staticFloodZones;
  return (data as DbFloodZone[]).map(mapFloodZone);
}

type DbRoad = {
  id: string;
  incident_id: string;
  name: string;
  class: Road['class'];
  risk_level: Road['riskLevel'];
  risk_score: number;
  flood_exposure: number;
  population_exposure: Road['populationExposure'];
  critical_connectivity: boolean;
  geometry: { type: 'LineString'; coordinates: [number, number][] };
};

function mapRoad(row: DbRoad): Road {
  return {
    id: row.id,
    name: row.name,
    class: row.class,
    riskLevel: row.risk_level,
    riskScore: row.risk_score,
    floodExposure: row.flood_exposure,
    populationExposure: row.population_exposure,
    criticalConnectivity: row.critical_connectivity,
    geometry: row.geometry,
  };
}

export async function fetchRoads(incidentId?: string): Promise<Road[]> {
  let query = supabase.from('roads').select('*');
  if (incidentId) query = query.eq('incident_id', incidentId);
  const { data, error } = await query.order('name');
  if (error || !data || data.length === 0) return staticRoads;
  return (data as DbRoad[]).map(mapRoad);
}

type DbRiskAssessment = {
  id: string;
  road_id: string;
  road_name: string;
  risk_score: number;
  risk_level: RiskAssessment['riskLevel'];
  factor_breakdown: RiskFactorBreakdown;
  priority: number;
  recommendation: string;
};

function mapRiskAssessment(row: DbRiskAssessment): RiskAssessment {
  return {
    id: row.id,
    roadId: row.road_id,
    roadName: row.road_name,
    riskScore: row.risk_score,
    riskLevel: row.risk_level,
    factorBreakdown: row.factor_breakdown,
    priority: row.priority,
    recommendation: row.recommendation,
  };
}

export async function fetchRiskAssessments(): Promise<RiskAssessment[]> {
  const { data, error } = await supabase
    .from('risk_assessments')
    .select('*')
    .order('priority');
  if (error || !data || data.length === 0) return staticRiskAssessments;
  return (data as DbRiskAssessment[]).map(mapRiskAssessment);
}

type DbResponseAction = {
  id: string;
  incident_id: string;
  type: ResponseAction['type'];
  title: string;
  description: string;
  priority: ResponseAction['priority'];
  target_id: string;
  completed: boolean;
};

function mapResponseAction(row: DbResponseAction): ResponseAction {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    priority: row.priority,
    targetId: row.target_id,
    completed: row.completed,
  };
}

export async function fetchResponseActions(
  incidentId?: string
): Promise<ResponseAction[]> {
  let query = supabase.from('response_actions').select('*');
  if (incidentId) query = query.eq('incident_id', incidentId);
  const { data, error } = await query.order('priority');
  if (error || !data || data.length === 0) return staticResponseActions;
  return (data as DbResponseAction[]).map(mapResponseAction);
}

export async function toggleResponseAction(
  actionId: string,
  completed: boolean
): Promise<void> {
  const { error } = await supabase
    .from('response_actions')
    .update({ completed, updated_at: new Date().toISOString() })
    .eq('id', actionId);
  if (error) throw error;
}

type DbRoute = {
  id: string;
  incident_id: string;
  name: string;
  from_name: string;
  to_name: string;
  risk_level: Route['riskLevel'];
  estimated_time_min: number;
  distance_km: number;
  geometry: { type: 'LineString'; coordinates: [number, number][] };
};

function mapRoute(row: DbRoute): Route {
  return {
    id: row.id,
    name: row.name,
    fromName: row.from_name,
    toName: row.to_name,
    riskLevel: row.risk_level,
    estimatedTimeMin: row.estimated_time_min,
    distanceKm: Number(row.distance_km),
    geometry: row.geometry,
  };
}

export async function fetchRoutes(incidentId?: string): Promise<Route[]> {
  let query = supabase.from('routes').select('*');
  if (incidentId) query = query.eq('incident_id', incidentId);
  const { data, error } = await query.order('name');
  if (error || !data || data.length === 0) return staticRoutes;
  return (data as DbRoute[]).map(mapRoute);
}
