function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// NEXT_PUBLIC_* vars are only inlined into the browser bundle when accessed
// as a literal `process.env.NEXT_PUBLIC_X` member expression — Next's build
// statically replaces that exact pattern. A dynamic `process.env[name]`
// lookup defeats that replacement and reads as undefined in client code, so
// these must stay written out literally rather than refactored through a
// shared helper that takes the key name as an argument.
export const supabaseUrl = () =>
  requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const supabaseAnonKey = () =>
  requireEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
