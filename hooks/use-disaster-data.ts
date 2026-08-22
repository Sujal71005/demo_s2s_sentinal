'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchIncidents,
  fetchFacilities,
  fetchFloodZones,
  fetchRoads,
  fetchRiskAssessments,
  fetchResponseActions,
  fetchRoutes,
  toggleResponseAction,
} from '@/lib/supabase/queries';
import type { Incident } from '@/types/incident';
import type { Facility } from '@/types/facility';
import type { FloodZone } from '@/types/flood';
import type { Road } from '@/types/road';
import type { RiskAssessment } from '@/types/risk';
import type { ResponseAction, Route } from '@/types/response';

interface DisasterData {
  incidents: Incident[];
  facilities: Facility[];
  floodZones: FloodZone[];
  roads: Road[];
  riskAssessments: RiskAssessment[];
  responseActions: ResponseAction[];
  routes: Route[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  toggleAction: (actionId: string, completed: boolean) => Promise<void>;
}

export function useDisasterData(incidentId?: string): DisasterData {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [floodZones, setFloodZones] = useState<FloodZone[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [responseActions, setResponseActions] = useState<ResponseAction[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        inc,
        fac,
        fz,
        rd,
        ra,
        actions,
        rt,
      ] = await Promise.all([
        fetchIncidents(),
        fetchFacilities(incidentId),
        fetchFloodZones(incidentId),
        fetchRoads(incidentId),
        fetchRiskAssessments(),
        fetchResponseActions(incidentId),
        fetchRoutes(incidentId),
      ]);
      setIncidents(inc);
      setFacilities(fac);
      setFloodZones(fz);
      setRoads(rd);
      setRiskAssessments(ra);
      setResponseActions(actions);
      setRoutes(rt);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [incidentId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleAction = useCallback(
    async (actionId: string, completed: boolean) => {
      setResponseActions((prev) =>
        prev.map((a) => (a.id === actionId ? { ...a, completed } : a))
      );
      try {
        await toggleResponseAction(actionId, completed);
      } catch (err) {
        setResponseActions((prev) =>
          prev.map((a) => (a.id === actionId ? { ...a, completed: !completed } : a))
        );
        const message = err instanceof Error ? err.message : 'Failed to update action';
        setError(message);
      }
    },
    []
  );

  return {
    incidents,
    facilities,
    floodZones,
    roads,
    riskAssessments,
    responseActions,
    routes,
    loading,
    error,
    refetch: load,
    toggleAction,
  };
}
