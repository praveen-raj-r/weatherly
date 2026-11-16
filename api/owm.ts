// Vercel serverless proxy for OpenWeatherMap.
// The browser calls /api/owm/<path>?<params>; vercel.json rewrites that to
// /api/owm?path=<path>&<params>. The API key stays server-side.

const UPSTREAM = "https://api.openweathermap.org";

// Only these upstream endpoints may be proxied.
const ALLOWED_PATHS = new Set([
  "data/2.5/weather",
  "data/2.5/forecast",
  "geo/1.0/reverse",
  "geo/1.0/direct",
]);

export async function GET(request: Request): Promise<Response> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return Response.json({ message: "Server is missing API key" }, { status: 500 });
  }

  const incoming = new URL(request.url);
  const path = (incoming.searchParams.get("path") ?? "").replace(/^\/+|\/+$/g, "");

  if (!ALLOWED_PATHS.has(path)) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const params = new URLSearchParams(incoming.searchParams);
  params.delete("path");
  params.delete("appid"); // never trust a client-supplied key
  params.set("appid", apiKey);

  const upstream = await fetch(`${UPSTREAM}/${path}?${params.toString()}`);
  const body = await upstream.text();

  return new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
      // Let the CDN cache briefly to cut API usage
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
