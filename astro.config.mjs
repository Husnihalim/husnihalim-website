import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://husnihalim.com",
  trailingSlash: "always",
  build: {
    assets: "assets",
    format: "directory",
  },
  server: {
    port: 4321,
  },
});
