'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RealFloodDetectionResponse } from '@/types/satellite';

// ---------------------------------------------------------------------------
// Legacy GET hook — used by Dashboard
// ---------------------------------------------------------------------------

export interface FloodAnalysisData {
  source: string;
  satellite: string;
  sensor: string;
  location: string;
  date: string;
  acquisition: string;
  relativeOrbit: number;
  orbitDirection: string;
  polarization: string;
  thresholdDb: number;
  potentialFloodedAreaKm2: number;
  centroid: {
    longitude: number;
    latitude: number;
  };
  analysisType: string;
  preFloodComparisonAvailable: boolean;
  live: boolean;
  disclaimer: string;
  error?: string;
}

interface UseFloodAnalysisState {
  data: FloodAnalysisData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFloodAnalysis(): UseFloodAnalysisState {
  const [data, setData] = useState<FloodAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTrigger((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchAnalysis() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/earth-engine/flood', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const json: FloodAnalysisData = await res.json();

        if (!cancelled) {
          setData(json);
          if (json.error && !json.live) {
            setError(json.error);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to fetch flood analysis';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchAnalysis();

    return () => {
      cancelled = true;
    };
  }, [refetchTrigger]);

  return { data, loading, error, refetch };
}

// ---------------------------------------------------------------------------
// Real bi-temporal change-detection hook — used by Flood Analysis page
// ---------------------------------------------------------------------------

export type RealFloodStage =
  | 'idle'
  | 'searching'
  | 'compositing'
  | 'detecting'
  | 'masking'
  | 'computing'
  | 'vectorizing'
  | 'done'
  | 'error';

export const REAL_FLOOD_STAGE_LABELS: Record<RealFloodStage, string> = {
  idle: 'Ready to run',
  searching: 'Searching Sentinel-1 scenes...',
  compositing: 'Building pre/post composites...',
  detecting: 'Running SAR change detection...',
  masking: 'Applying permanent-water mask...',
  computing: 'Computing flood area...',
  vectorizing: 'Vectorizing flood polygon...',
  done: 'Analysis complete',
  error: 'Analysis failed',
};

export interface RealFloodAnalysisParams {
  areaId: string;
  preStartDate: string;
  preEndDate: string;
  postStartDate: string;
  postEndDate: string;
  polarization?: string;
  threshold?: number;
  minAreaM2?: number;
}

export interface UseRealFloodAnalysisState {
  stage: RealFloodStage;
  stageLabel: string;
  data: RealFloodDetectionResponse | null;
  error: string | null;
  loading: boolean;
  run: (params: RealFloodAnalysisParams) => void;
  reset: () => void;
}

export function useRealFloodAnalysis(): UseRealFloodAnalysisState {
  const [stage, setStage] = useState<RealFloodStage>('idle');
  const [data, setData] = useState<RealFloodDetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStage('idle');
    setData(null);
    setError(null);
  }, []);

  const run = useCallback(async (params: RealFloodAnalysisParams) => {
    setStage('searching');
    setData(null);
    setError(null);

    try {
      // All stages happen inside the single EE API call.
      // We advance the stage label on a timer to give visual feedback
      // that the request is in progress — but we do NOT resolve until
      // the real API responds. This is NOT a fake timer: the API call
      // runs in parallel and resolves whenever EE actually finishes.

      const stageProgression: Array<{ stage: RealFloodStage; delay: number }> = [
        { stage: 'compositing', delay: 3000 },
        { stage: 'detecting', delay: 8000 },
        { stage: 'masking', delay: 15000 },
        { stage: 'computing', delay: 22000 },
        { stage: 'vectorizing', delay: 30000 },
      ];

      let progressionActive = true;
      const timers: ReturnType<typeof setTimeout>[] = [];

      for (const { stage: s, delay } of stageProgression) {
        const t = setTimeout(() => {
          if (progressionActive) setStage(s);
        }, delay);
        timers.push(t);
      }

      // Real API call
      const res = await fetch('/api/earth-engine/flood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      // Cancel pending stage timers
      progressionActive = false;
      timers.forEach(clearTimeout);

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}: ${res.statusText}`);
      }

      const json: RealFloodDetectionResponse = await res.json();

      if (!json.success && json.error) {
        setError(json.error);
        setStage('error');
        setData(json); // still store for display
        return;
      }

      setData(json);
      setStage('done');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to run flood detection';
      setError(message);
      setStage('error');
    }
  }, []);

  return {
    stage,
    stageLabel: REAL_FLOOD_STAGE_LABELS[stage],
    data,
    error,
    loading: stage !== 'idle' && stage !== 'done' && stage !== 'error',
    run,
    reset,
  };
}
