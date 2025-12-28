import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.warn("⚠️ VITE_CONVEX_URL not set. Add it to your .env file.");
}

export const convex = new ConvexReactClient(
  convexUrl || "https://placeholder.convex.cloud",
);

// Expose convex client globally for admin scripts
if (typeof window !== "undefined") {
  (window as Window & { __CONVEX__?: ConvexReactClient }).__CONVEX__ = convex;
}
