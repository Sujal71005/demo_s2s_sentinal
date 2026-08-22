import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const EDGE_FUNCTION_URL = SUPABASE_URL
  ? `${SUPABASE_URL}/functions/v1/earth-engine-flood`
  : null;

export async function GET() {
  const saEmail = process.env.EE_SERVICE_ACCOUNT_EMAIL;
  const saKey = process.env.EE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;

  const localReport = {
    EE_SERVICE_ACCOUNT_EMAIL: { present: Boolean(saEmail), length: saEmail?.length ?? 0 },
    EE_SERVICE_ACCOUNT_KEY: { present: Boolean(saKey), length: saKey?.length ?? 0 },
    GOOGLE_CLOUD_PROJECT: { present: Boolean(projectId), length: projectId?.length ?? 0 },
  };

  let edgeFunctionStatus: {
    reachable: boolean;
    live: boolean | null;
    httpStatus: number | null;
    error: string | null;
    responsePreview: Record<string, unknown> | null;
  } = {
    reachable: false,
    live: null,
    httpStatus: null,
    error: null,
    responsePreview: null,
  };

  if (EDGE_FUNCTION_URL && SUPABASE_ANON_KEY) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const json = await res.json().catch(() => null);

      edgeFunctionStatus = {
        reachable: res.ok,
        live: typeof json?.live === 'boolean' ? json.live : null,
        httpStatus: res.status,
        error: json?.error ?? null,
        responsePreview: json
          ? {
              live: json.live,
              potentialFloodedAreaKm2: json.potentialFloodedAreaKm2,
              hasError: Boolean(json.error),
            }
          : null,
      };
    } catch (err) {
      edgeFunctionStatus.error =
        err instanceof Error ? err.message : 'Fetch failed';
    }
  } else {
    edgeFunctionStatus.error =
      'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not configured';
  }

  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      architecture: 'edge-function-proxy',
      edgeFunctionUrl: EDGE_FUNCTION_URL ?? 'not-configured',
      localEnvCredentials: localReport,
      edgeFunction: edgeFunctionStatus,
      note: 'Credentials are stored in Bolt Secrets and injected into the Supabase Edge Function environment, not the Next.js server runtime.',
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
