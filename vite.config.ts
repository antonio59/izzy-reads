import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5000,
    hmr: {
      clientPort: 5000,
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-framer": ["framer-motion"],
          "vendor-recharts": ["recharts"],
          "vendor-giphy": ["@giphy/js-fetch-api", "@giphy/react-components"],
          "vendor-emoji": ["@emoji-mart/react", "@emoji-mart/data"],
          // Feature chunks
          "feature-auth": [
            "./src/components/Login.tsx",
            "./src/components/Signup.tsx",
          ],
          "feature-admin": [
            "./src/components/Dashboard.tsx",
            "./src/components/EnhancedBookshelf.tsx",
          ],
        },
      },
    },
  },
});
