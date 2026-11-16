import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const ALLOWED_PATHS = new Set([
  "data/2.5/weather",
  "data/2.5/forecast",
  "geo/1.0/reverse",
  "geo/1.0/direct",
]);

export default defineConfig(({ mode }) => {
  // Empty prefix: also loads non-VITE_ vars, so the key never reaches the bundle
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      // Dev/Docker equivalent of api/owm.ts: injects the key server-side
      proxy: {
        "/api/owm": {
          target: "https://api.openweathermap.org",
          changeOrigin: true,
          rewrite: (p: string) => {
            const url = new URL(p, "http://localhost");
            const upstreamPath = url.pathname.replace(/^\/api\/owm\//, "");
            if (!ALLOWED_PATHS.has(upstreamPath)) return "/__blocked__";
            url.searchParams.delete("appid");
            url.searchParams.set("appid", env.OPENWEATHER_API_KEY ?? "");
            return `/${upstreamPath}?${url.searchParams.toString()}`;
          },
        },
      },
    },
  };
});
