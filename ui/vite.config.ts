import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { playwright } from "@vitest/browser-playwright";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    // envDir: "../", // Uncomment this if you're running the UI outside of Dockerw
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    plugins: [react()],
    test: {
      browser: {
        enabled: true,
        provider: playwright(),
        instances: [
          { browser: 'chromium' },
        ],
      }
    }
  }
});
