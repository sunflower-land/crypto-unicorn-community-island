import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  define: {
    "process.env": process.env,
  },
  server: {
    port: 3003,
  },
  build: {
    rollupOptions: {
      input: {
        // main: resolve(__dirname, "index.html"),
        scene: resolve(__dirname, "Scene.ts"),
      },
    },
  },
});
