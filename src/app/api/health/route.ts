// CORS policy: the health endpoint is a public monitoring surface (uptime
// monitors, status dashboards, browser-based observability tools). It only
// exposes { status, timestamp } — no user data, no auth-derived state — so a
// wildcard allow-origin is appropriate and matches industry convention for
// health endpoints (Vercel, GitHub, AWS, Cloudflare all do the same).
//
// IMPORTANT: this permissive policy is scoped to /api/health alone. Any other
// route under /api/ must declare its own (more restrictive) CORS headers and
// MUST NOT copy these blindly.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
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
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
