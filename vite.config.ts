import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ].filter(Boolean),
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
    sourcemap: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/") || id.includes("node_modules/react-router-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-framer";
          }
          if (id.includes("node_modules/recharts")) {
            return "vendor-recharts";
          }
          if (id.includes("node_modules/@giphy")) {
            return "vendor-giphy";
          }
          if (id.includes("node_modules/@emoji-mart")) {
            // Keep @emoji-mart/react in vendor-emoji, but let @emoji-mart/data
            // split into its own dynamic chunk since we lazy-load it
            if (!id.includes("@emoji-mart/data")) {
              return "vendor-emoji";
            }
          }
          if (id.includes("components/Login") || id.includes("components/Signup")) {
            return "feature-auth";
          }
          if (id.includes("components/Dashboard") || id.includes("components/EnhancedBookshelf")) {
            return "feature-admin";
          }
        },
      },
    },
  },
});
