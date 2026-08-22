/*
# Create disaster monitoring database schema

## Purpose
This migration creates the complete database schema for the S2S Sentinels disaster
monitoring application. It persists flood incidents, facilities, flood zones, roads,
risk assessments, response actions, and evacuation routes for the Sangli, Maharashtra
study area. The app is single-tenant (no sign-in) so all data is shared/public.

## New Tables

1. **incidents** — Flood disaster incidents with status, affected area, and population exposure.
   - id (text, primary key) — human-readable incident ID (e.g. INC-SANGLI-2019)
   - name (text) — display name
   - region (text) — geographic region
   - status (text) — active | monitoring | contained | resolved
   - start_date (text) — ISO date string
   - description (text) — incident description
   - center_lng, center_lat (numeric) — map center coordinates
   - zoom (integer) — map zoom level
   - data_source (text) — demo | satellite | manual
   - affected_area_km2 (numeric) — flooded area in square kilometers
   - affected_roads (integer) — count of affected roads
   - population_exposed (integer) — estimated population affected
   - critical_facilities (integer) — count of critical facilities at risk
   - created_at (timestamptz)

2. **facilities** — Critical infrastructure (hospitals, shelters, police, fire stations).
   - id (text, primary key)
   - incident_id (text, FK to incidents) — which incident this facility belongs to
   - name (text)
   - type (text) — hospital | health_center | shelter | police | fire_station
   - risk_level (text) — low | moderate | high | critical
   - latitude, longitude (numeric)
   - capacity (integer) — total capacity
   - occupants (integer) — current occupants
   - operational (boolean)
   - created_at (timestamptz)

3. **flood_zones** — Identified flood zones with polygon geometry.
   - id (text, primary key)
   - incident_id (text, FK to incidents)
   - name (text)
   - risk_level (text)
   - area_km2 (numeric)
   - confidence (integer) — 0-100 confidence score
   - data_source (text) — demo | satellite
   - geometry (jsonb) — GeoJSON Polygon
   - created_at (timestamptz)

4. **roads** — Road network with flood exposure and risk scoring.
   - id (text, primary key)
   - incident_id (text, FK to incidents)
   - name (text)
   - class (text) — highway | major | secondary | local
   - risk_level (text)
   - risk_score (integer) — 0-100
   - flood_exposure (integer) — 0-100 percentage
   - population_exposure (text) — low | moderate | high | critical
   - critical_connectivity (boolean)
   - geometry (jsonb) — GeoJSON LineString
   - created_at (timestamptz)

5. **risk_assessments** — Detailed risk assessments per road.
   - id (text, primary key)
   - road_id (text, FK to roads)
   - road_name (text)
   - risk_score (integer)
   - risk_level (text)
   - factor_breakdown (jsonb) — { floodExposure, populationExposure, roadImportance, criticalFacility, elevationRisk }
   - priority (integer) — priority ranking
   - recommendation (text)
   - created_at (timestamptz)

6. **response_actions** — Recommended response actions for the incident.
   - id (text, primary key)
   - incident_id (text, FK to incidents)
   - type (text) — close_road | inspect_bridge | prioritize_access | monitor_zone | evacuation | relief_camp
   - title (text)
   - description (text)
   - priority (text) — critical | high | moderate | low
   - target_id (text) — ID of the referenced entity (road, facility, zone)
   - completed (boolean, default false)
   - created_at (timestamptz)
   - updated_at (timestamptz)

7. **routes** — Safer evacuation routes.
   - id (text, primary key)
   - incident_id (text, FK to incidents)
   - name (text)
   - from_name (text)
   - to_name (text)
   - risk_level (text)
   - estimated_time_min (integer)
   - distance_km (numeric)
   - geometry (jsonb) — GeoJSON LineString
   - created_at (timestamptz)

## Security
- RLS enabled on ALL tables.
- All policies use TO anon, authenticated (single-tenant, no sign-in, intentionally public data).
- USING (true) / WITH CHECK (true) is acceptable because this is a shared public monitoring dashboard.

## Important Notes
1. All geometry columns use jsonb to store GeoJSON objects.
2. Foreign keys cascade on delete so removing an incident cleans up related data.
3. The response_actions table has an updated_at column to track when actions are toggled.
4. Idempotent: uses IF NOT EXISTS for tables and DROP IF EXISTS before CREATE for policies.
*/

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id text PRIMARY KEY,
  name text NOT NULL,
  region text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'monitoring', 'contained', 'resolved')),
  start_date text NOT NULL,
  description text NOT NULL,
  center_lng numeric NOT NULL,
  center_lat numeric NOT NULL,
  zoom integer NOT NULL DEFAULT 12,
  data_source text NOT NULL DEFAULT 'demo' CHECK (data_source IN ('demo', 'satellite', 'manual')),
  affected_area_km2 numeric NOT NULL DEFAULT 0,
  affected_roads integer NOT NULL DEFAULT 0,
  population_exposed integer NOT NULL DEFAULT 0,
  critical_facilities integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_incidents" ON incidents;
CREATE POLICY "anon_select_incidents" ON incidents FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_incidents" ON incidents;
CREATE POLICY "anon_insert_incidents" ON incidents FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_incidents" ON incidents;
CREATE POLICY "anon_update_incidents" ON incidents FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_incidents" ON incidents;
CREATE POLICY "anon_delete_incidents" ON incidents FOR DELETE
  TO anon, authenticated USING (true);

-- Facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id text PRIMARY KEY,
  incident_id text NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('hospital', 'health_center', 'shelter', 'police', 'fire_station')),
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  capacity integer NOT NULL DEFAULT 0,
  occupants integer NOT NULL DEFAULT 0,
  operational boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_facilities" ON facilities;
CREATE POLICY "anon_select_facilities" ON facilities FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_facilities" ON facilities;
CREATE POLICY "anon_insert_facilities" ON facilities FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_facilities" ON facilities;
CREATE POLICY "anon_update_facilities" ON facilities FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_facilities" ON facilities;
CREATE POLICY "anon_delete_facilities" ON facilities FOR DELETE
  TO anon, authenticated USING (true);

-- Flood zones table
CREATE TABLE IF NOT EXISTS flood_zones (
  id text PRIMARY KEY,
  incident_id text NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  name text NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
  area_km2 numeric NOT NULL DEFAULT 0,
  confidence integer NOT NULL DEFAULT 0,
  data_source text NOT NULL DEFAULT 'demo' CHECK (data_source IN ('demo', 'satellite')),
  geometry jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE flood_zones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_flood_zones" ON flood_zones;
CREATE POLICY "anon_select_flood_zones" ON flood_zones FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_flood_zones" ON flood_zones;
CREATE POLICY "anon_insert_flood_zones" ON flood_zones FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_flood_zones" ON flood_zones;
CREATE POLICY "anon_update_flood_zones" ON flood_zones FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_flood_zones" ON flood_zones;
CREATE POLICY "anon_delete_flood_zones" ON flood_zones FOR DELETE
  TO anon, authenticated USING (true);

-- Roads table
CREATE TABLE IF NOT EXISTS roads (
  id text PRIMARY KEY,
  incident_id text NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  name text NOT NULL,
  class text NOT NULL CHECK (class IN ('highway', 'major', 'secondary', 'local')),
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
  risk_score integer NOT NULL DEFAULT 0,
  flood_exposure integer NOT NULL DEFAULT 0,
  population_exposure text NOT NULL CHECK (population_exposure IN ('low', 'moderate', 'high', 'critical')),
  critical_connectivity boolean NOT NULL DEFAULT false,
  geometry jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE roads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_roads" ON roads;
CREATE POLICY "anon_select_roads" ON roads FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_roads" ON roads;
CREATE POLICY "anon_insert_roads" ON roads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_roads" ON roads;
CREATE POLICY "anon_update_roads" ON roads FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_roads" ON roads;
CREATE POLICY "anon_delete_roads" ON roads FOR DELETE
  TO anon, authenticated USING (true);

-- Risk assessments table
CREATE TABLE IF NOT EXISTS risk_assessments (
  id text PRIMARY KEY,
  road_id text NOT NULL REFERENCES roads(id) ON DELETE CASCADE,
  road_name text NOT NULL,
  risk_score integer NOT NULL DEFAULT 0,
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
  factor_breakdown jsonb NOT NULL,
  priority integer NOT NULL DEFAULT 0,
  recommendation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_risk_assessments" ON risk_assessments;
CREATE POLICY "anon_select_risk_assessments" ON risk_assessments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_risk_assessments" ON risk_assessments;
CREATE POLICY "anon_insert_risk_assessments" ON risk_assessments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_risk_assessments" ON risk_assessments;
CREATE POLICY "anon_update_risk_assessments" ON risk_assessments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_risk_assessments" ON risk_assessments;
CREATE POLICY "anon_delete_risk_assessments" ON risk_assessments FOR DELETE
  TO anon, authenticated USING (true);

-- Response actions table
CREATE TABLE IF NOT EXISTS response_actions (
  id text PRIMARY KEY,
  incident_id text NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('close_road', 'inspect_bridge', 'prioritize_access', 'monitor_zone', 'evacuation', 'relief_camp')),
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('critical', 'high', 'moderate', 'low')),
  target_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE response_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_response_actions" ON response_actions;
CREATE POLICY "anon_select_response_actions" ON response_actions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_response_actions" ON response_actions;
CREATE POLICY "anon_insert_response_actions" ON response_actions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_response_actions" ON response_actions;
CREATE POLICY "anon_update_response_actions" ON response_actions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_response_actions" ON response_actions;
CREATE POLICY "anon_delete_response_actions" ON response_actions FOR DELETE
  TO anon, authenticated USING (true);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id text PRIMARY KEY,
  incident_id text NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  name text NOT NULL,
  from_name text NOT NULL,
  to_name text NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
  estimated_time_min integer NOT NULL DEFAULT 0,
  distance_km numeric NOT NULL DEFAULT 0,
  geometry jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_routes" ON routes;
CREATE POLICY "anon_select_routes" ON routes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_routes" ON routes;
CREATE POLICY "anon_insert_routes" ON routes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_routes" ON routes;
CREATE POLICY "anon_update_routes" ON routes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_routes" ON routes;
CREATE POLICY "anon_delete_routes" ON routes FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_facilities_incident_id ON facilities(incident_id);
CREATE INDEX IF NOT EXISTS idx_flood_zones_incident_id ON flood_zones(incident_id);
CREATE INDEX IF NOT EXISTS idx_roads_incident_id ON roads(incident_id);
CREATE INDEX IF NOT EXISTS idx_response_actions_incident_id ON response_actions(incident_id);
CREATE INDEX IF NOT EXISTS idx_routes_incident_id ON routes(incident_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_road_id ON risk_assessments(road_id);
