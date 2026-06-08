"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const configured = isSupabaseConfigured();

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md glass rounded-3xl p-6 sm:p-8 mx-auto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Shreya creation" className="h-20 w-auto max-w-[12rem] object-contain mx-auto mb-4" />
      <h1 className="font-display text-3xl sm:text-4xl text-ink text-center">
        Shreya <span className="text-gold-gradient">Admin</span>
      </h1>
      <p className="text-center text-subtle text-sm mt-2 mb-7">Sign in to manage your site</p>

      {!configured && (
        <div className="mb-5 rounded-xl border border-marigold/40 bg-marigold/10 px-4 py-3 text-sm text-marigold">
          Demo mode: connect Supabase (see README) to enable real login and editing.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gold/70 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-ink/5 border border-gold/20 rounded-xl px-4 py-3 text-ink focus:border-gold/60 focus:outline-none"
            placeholder="owner@shreyacreations.in"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-gold/70 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-ink/5 border border-gold/20 rounded-xl px-4 py-3 text-ink focus:border-gold/60 focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-rose text-sm">{error}</p>}
        <button disabled={loading} className="btn-gold rounded-full px-7 py-3 w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
