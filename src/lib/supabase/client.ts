"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";
import { supabaseAnonKey, supabaseUrl } from "./env";

// Browser-side Supabase client. Safe to use in client components: it only
// ever holds the public anon key, and every request is still subject to
// row-level security on the server.
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl(), supabaseAnonKey());
}
