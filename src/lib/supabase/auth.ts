import { createClient } from "./server";

export type AdminSession =
  | { ok: true; supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>; userId: string; role: string }
  | { ok: false; status: 401 | 403 | 503; message: string };

/** Verify the current request belongs to an admin (server routes / actions). */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, status: 503, message: "Supabase is not configured." };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, status: 401, message: "Not authenticated." };
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (!rpcError && isAdmin === true) {
    const { data: row } = await supabase
      .from("admins")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    return { ok: true, supabase, userId: user.id, role: row?.role || "editor" };
  }

  const { data: row } = await supabase
    .from("admins")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!row?.role) {
    return { ok: false, status: 403, message: "Admin access required." };
  }

  return { ok: true, supabase, userId: user.id, role: row.role };
}

/** Owner-only operations (e.g. managing other admins). */
export async function requireOwner(): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!session.ok) return session;
  if (session.role !== "owner") {
    return { ok: false, status: 403, message: "Owner access required." };
  }
  return session;
}
