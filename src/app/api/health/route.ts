// Wildcard CORS is safe here: this public monitoring endpoint exposes only
// { status, timestamp } — no user or auth data. Scoped to /api/health alone;
// other /api/ routes must set their own, more restrictive headers.
const CORS_PREFLIGHT_MAX_AGE_SECONDS = '86400'; // 1 day preflight cache
const HTTP_NO_CONTENT = 204;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age': CORS_PREFLIGHT_MAX_AGE_SECONDS,
} as const;

export async function GET() {
  return Response.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
    { headers: CORS_HEADERS },
  );
}

export function OPTIONS() {
  return new Response(null, { status: HTTP_NO_CONTENT, headers: CORS_HEADERS });
}
