import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import visualizer from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [reactRefresh()],
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
