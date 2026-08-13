"use client";

import { BTN_PRIMARY, GLASS, TEXT_GOLD_GRADIENT } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { BRAND_NAME, LOGO_SRC } from "@/lib/brand";

const NOT_ADMIN_MSG =
  "This account is signed in but does not have admin access. Ask the site owner to run the grant_admin.sql script in Supabase for your email.";

async function accountIsAdmin(supabase) {
  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (!rpcError && isAdmin === true) return true;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: row } = await supabase
    .from("admins")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  return Boolean(row?.role);
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (searchParams.get("error") === "not_admin") {
      setError(NOT_ADMIN_MSG);
    }
  }, [searchParams]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase is not configured yet. Add your keys to .env.local.");
      setLoading(false);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }

    const admin = await accountIsAdmin(supabase);
    if (!admin) {
      await supabase.auth.signOut();
      setLoading(false);
      setError(NOT_ADMIN_MSG);
      return;
    }

    setLoading(false);
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className={cn(GLASS, "w-full", "max-w-md", "rounded-3xl", "p-6", "sm:p-8", "mx-auto")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_SRC} alt={BRAND_NAME} className="h-20 w-auto max-w-[12rem] object-contain mx-auto mb-4" />
      <h1 className="font-display text-3xl sm:text-4xl text-ink text-center">
        Shreya <span className={TEXT_GOLD_GRADIENT}>Admin</span>
      </h1>
      <p className="text-center text-subtle text-sm mt-2 mb-7">Sign in to manage your site</p>

      {!configured && (
        <div className="mb-5 rounded-xl border border-marigold/40 bg-marigold/10 px-4 py-3 text-sm text-marigold">
          Demo mode: connect Supabase (see README) to enable real login and editing.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4" noValidate aria-describedby={error ? "login-error" : undefined}>
        <div>
          <label htmlFor="login-email" className="block text-xs uppercase tracking-wide text-gold/70 mb-1">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-ink/5 border border-gold/20 rounded-xl px-4 py-3 text-ink focus:border-gold/60 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-orange-text"
            placeholder="owner@shreyacreation.com"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-xs uppercase tracking-wide text-gold/70 mb-1">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-ink/5 border border-gold/20 rounded-xl px-4 py-3 text-ink focus:border-gold/60 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-orange-text"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <p id="login-error" className="text-rose text-sm" role="alert">
            {error}
          </p>
        )}
        <button disabled={loading} className={cn(BTN_PRIMARY, "w-full")}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
