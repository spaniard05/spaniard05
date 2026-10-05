// Server-only environment variables (never NEXT_PUBLIC_, never imported from
// client components). Safe to use plain process.env.X here, unlike
// lib/supabase/env.ts — only NEXT_PUBLIC_* vars need the literal-access
// workaround for browser bundling.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const anthropicApiKey = () => requireEnv("ANTHROPIC_API_KEY");

export const googleClientId = () => requireEnv("GOOGLE_CLIENT_ID");
export const googleClientSecret = () => requireEnv("GOOGLE_CLIENT_SECRET");
export const googleRedirectUri = () => requireEnv("GOOGLE_REDIRECT_URI");
