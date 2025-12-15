// Environment variable validation
// This ensures all required environment variables are present

interface EnvConfig {
  CONVEX_URL: string;
  // Add other required env vars here
}

function validateEnv(): EnvConfig {
  const requiredVars = ["VITE_CONVEX_URL"] as const;

  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(", ")}. ` +
        `Some features may not work correctly. ` +
        `Copy .env.example to .env and fill in the values.`,
    );
  }

  return {
    CONVEX_URL: import.meta.env.VITE_CONVEX_URL || "",
  };
}

export const env = validateEnv();

// Helper to check if we're in development mode
export const isDev = import.meta.env.DEV;

// Helper to check if we're in production mode
export const isProd = import.meta.env.PROD;

// Helper for conditional features
export const features = {
  // Enable/disable features based on env
  analytics: isProd,
  debugMode: isDev,
  mockData: !env.CONVEX_URL,
};
