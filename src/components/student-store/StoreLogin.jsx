"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
export default function StoreLogin() {
  const router = useRouter(), params = useSearchParams();
  const [mode, setMode] = useState("sign-in"), [email, setEmail] = useState(""), [password, setPassword] = useState(""), [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setMessage(""); const db = createClient(); if (!db) { setMessage("Sign in is temporarily unavailable"); setBusy(false); return; }
    const result = mode === "sign-up" ? await db.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/student-store/auth/callback` } }) : await db.auth.signInWithPassword({ email, password });
    setBusy(false); if (result.error) { setMessage(result.error.message); return; }
    if (mode === "sign-up" && !result.data.session) { setMessage("Check your email to confirm your account, then sign in."); return; }
    const next = params.get("next") || "/student-store/my-orders";
    router.push(next.startsWith("/student-store/") ? next : "/student-store/my-orders"); router.refresh();
  }
  return <div className="max-w-md rounded-2xl border border-[#654534] p-6"><div className="flex gap-3 mb-6"><button className={mode === "sign-in" ? "text-[#ffb27c] underline" : ""} onClick={() => setMode("sign-in")}>Sign in</button><button className={mode === "sign-up" ? "text-[#ffb27c] underline" : ""} onClick={() => setMode("sign-up")}>Create account</button></div><form onSubmit={submit} className="space-y-4"><label className="store-label">Email<input type="email" required autoComplete="email" className="store-input" value={email} onChange={e => setEmail(e.target.value)} /></label><label className="store-label">Password<input type="password" required minLength={6} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} className="store-input" value={password} onChange={e => setPassword(e.target.value)} /></label><button disabled={busy} className="rounded-full bg-[#c9632e] px-6 py-3 font-bold disabled:opacity-50">{busy ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}</button></form>{message && <p role="status" className="text-[#ffb397] mt-4">{message}</p>}<p className="text-xs text-[#c5ac99] mt-6">Creating an account does not automatically verify admission. The institute must link an admitted registration, or enable public shopping, before checkout.</p></div>;
}
