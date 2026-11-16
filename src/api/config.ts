// Requests go through our own proxy (api/owm.ts on Vercel, Vite proxy in dev),
// which adds the OpenWeatherMap API key server-side.
export const API_CONFIG = {
  BASE_URL: "/api/owm/data/2.5",
  GEO: "/api/owm/geo/1.0",
};
