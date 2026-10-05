import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// Shared alias so every data module takes the same client type, whether it
// came from lib/supabase/server (Server Components/Actions) or
// lib/supabase/client (Client Components).
export type TypedSupabaseClient = SupabaseClient<Database>;
