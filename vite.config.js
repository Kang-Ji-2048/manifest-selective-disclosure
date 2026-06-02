import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Manifest PoC — plain React + Vite, no extra services.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
