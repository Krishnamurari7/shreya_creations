/** Shared Supabase env helpers — safe for client and server. */
export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

// This is a public browser key. Keep a working fallback in source because
// Cloudflare's automatic build can still inject a disabled legacy anon key.
const PROJECT_PUBLISHABLE_KEY = "sb_publishable_BadWqkhTg_KoW8goxUKxUQ_OQYgbUVm";

export function getSupabaseAnonKey(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return configured?.startsWith("sb_publishable_") ? configured : PROJECT_PUBLISHABLE_KEY;
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(url && key && !url.includes("YOUR-PROJECT"));
}
