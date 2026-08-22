'use client';

import { useState, useEffect, useCallback } from 'react';

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
