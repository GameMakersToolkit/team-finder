import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import visualizer from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    plugins: [react()],
    build: {
      sourcemap: mode === "production",
      rollupOptions: {
        plugins: [
          mode === "production" &&
            visualizer({
              filename: "build-stats.html",
            }),
        ].filter((x) => x),
      },
    },
  };
});
