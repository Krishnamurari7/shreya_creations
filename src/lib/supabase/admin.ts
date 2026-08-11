import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl, isSupabaseConfigured } from "./config";

/** Service-role client — server-only. Never import from client components. */
export function createAdminClient() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !isSupabaseConfigured()) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
