import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config";

export { isSupabaseConfigured };

/** Browser client (anon key). Returns null in demo mode. */
export function createClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key || url.includes("YOUR-PROJECT")) return null;
  return createBrowserClient(url, key);
}
