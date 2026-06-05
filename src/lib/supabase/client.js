import { createBrowserClient } from "@supabase/ssr";

// Returns null when env vars are not configured yet, so the site can run
// on local seed data before Supabase is connected.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("YOUR-PROJECT")) return null;
  return createBrowserClient(url, key);
}

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("YOUR-PROJECT") && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
