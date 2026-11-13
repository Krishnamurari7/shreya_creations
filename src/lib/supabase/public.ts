import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config";

/** Public read-only Supabase client — no cookies, safe for cached Server Components. */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, {
        ...init,
        next: { revalidate: 3600, tags: ["site-content"] },
      }),
    },
  });
}
