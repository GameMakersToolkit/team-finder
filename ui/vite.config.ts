import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    // envDir: "../", // Uncomment this if you're running the UI outside of Dockerw
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    plugins: [react()],
  }
});
