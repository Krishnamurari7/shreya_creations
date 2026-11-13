"use client";

import { useEffect, useState } from "react";
import { BTN_PRIMARY, GLASS } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { PAGE_DEFAULTS } from "@/lib/cms/defaults";
import { CTA_PAGE_OPTIONS, CTA_PAGE_KEYS } from "@/lib/admin/ctaBoxOptions";
import { normalizeCtaPath } from "@/lib/cms/cta-boxes";
import { greetingMessage } from "@/lib/whatsapp";
import { STUDIO_CTA } from "@/components/PageCTA";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CtaBoxesEditor from "@/components/admin/CtaBoxesEditor";
import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";

function templatePath(path) {
  if (CTA_PAGE_KEYS[path]) return path;
  const match = path.match(/^\/(shop|courses|portfolio|blog)\/[^/*]+$/);
  return match ? `/${match[1]}/*` : path;
}

function validLink(value) {
  const href = typeof value === "string" ? value.trim() : "";
  return (href.startsWith("/") && !href.startsWith("//")) || /^https:\/\//i.test(href);
}

function currentCopy(path, pages) {
  const template = templatePath(path);
  const key = CTA_PAGE_KEYS[template];
  const page = key
    ? { ...PAGE_DEFAULTS[key], ...(template === "/blog/*" ? {} : (pages?.[key] || {})) }
    : {};
  const prefix = template === "/" ? "bottom_cta_" : "cta_";
  const field = (name, fallback = "") => {
    const value = page[`${prefix}${name}`];
    return typeof value === "string" && value.trim() ? value : fallback;
  };
  const primaryHref = page[`${prefix}primary_href`] || "";
  const secondaryHref = page[`${prefix}secondary_href`];
  const rawPerks = page[`${prefix}perks`];
  const perks = Array.isArray(rawPerks) && rawPerks.length
    ? rawPerks.map((item) => typeof item === "string"
      ? { text: item, text_hi: item }
      : { text: item.text || "", text_hi: item.text_hi || item.textHi || item.text || "" })
    : STUDIO_CTA.en.perks.map((text, index) => ({ text, text_hi: STUDIO_CTA.hi.perks[index] }));

  const portfolioDetail = template === "/portfolio/*";
  return {
    path,
    enabled: true,
    eyebrow: field("eyebrow", STUDIO_CTA.en.eyebrow),
    eyebrow_hi: field("eyebrow_hi", STUDIO_CTA.hi.eyebrow),
    title: field("title", STUDIO_CTA.en.title),
    title_hi: field("title_hi", STUDIO_CTA.hi.title),
    title_highlight: field("title_highlight"),
    title_highlight_hi: field("title_highlight_hi"),
    subtitle: portfolioDetail
      ? "Share a reference photo on WhatsApp — or book a studio visit for a custom consultation."
      : field("subtitle", STUDIO_CTA.en.subtitle),
    subtitle_hi: portfolioDetail
      ? "रेफरेंस फोटो WhatsApp पर भेजें — या कस्टम सलाह के लिए स्टूडियो विज़िट बुक करें।"
      : field("subtitle_hi", STUDIO_CTA.hi.subtitle),
    perks,
    reply: field("reply", STUDIO_CTA.en.reply),
    reply_hi: field("reply_hi", STUDIO_CTA.hi.reply),
    primary_label: field("primary_label", STUDIO_CTA.en.primary),
    primary_label_hi: field("primary_label_hi", STUDIO_CTA.hi.primary),
    primary_action: primaryHref ? "link" : "whatsapp",
    primary_href: primaryHref,
    wa_message: field("wa_message", greetingMessage("en")),
    wa_message_hi: field("wa_message_hi", greetingMessage("hi")),
    secondary_label: field("secondary_label", STUDIO_CTA.en.secondary),
    secondary_label_hi: field("secondary_label_hi", STUDIO_CTA.hi.secondary),
    secondary_action: secondaryHref === "" ? "hide" : "link",
    secondary_href: secondaryHref || "/contact",
  };
}

export default function CtaBoxesAdmin() {
  const configured = isSupabaseConfigured();
  const [pages, setPages] = useState({});
  const [entries, setEntries] = useState([]);
  const [selected, setSelected] = useState("/");
  const [customPath, setCustomPath] = useState("");
  const [customPaths, setCustomPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("settings").select("pages").eq("id", 1).single();
      if (!active) return;
      if (error) setMessage(error.message);
      else {
        setPages(data.pages || {});
        setEntries(Array.isArray(data.pages?.ctaBoxes?.entries) ? data.pages.ctaBoxes.entries : []);
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, [configured]);

  const options = [...CTA_PAGE_OPTIONS];
  for (const rawPath of [...customPaths, ...entries.map((entry) => entry.path)]) {
    const path = normalizeCtaPath(rawPath);
    if (path && !options.some((option) => option.path === path)) options.push({ path, label: path });
  }
  const saved = entries.find((entry) => normalizeCtaPath(entry.path) === selected);
  const shown = saved || currentCopy(selected, pages);

  const changeSelected = (next) => {
    setEntries((previous) => [
      ...previous.filter((entry) => normalizeCtaPath(entry.path) !== selected),
      ...next,
    ]);
    setMessage("");
  };

  const addCustomPath = () => {
    const raw = customPath.trim();
    if (!raw.startsWith("/") || /[?#*]/.test(raw)) {
      setMessage("Enter an exact page path such as /shop/item-slug.");
      return;
    }
    const path = normalizeCtaPath(raw);
    if (!/^\/(shop|courses|portfolio|blog)\/[^/]+$/.test(path)) {
      setMessage("Only product, course, portfolio, and blog detail URLs can be added here.");
      return;
    }
    setCustomPaths((previous) => previous.includes(path) ? previous : [...previous, path]);
    setSelected(path);
    setCustomPath("");
    setMessage("");
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const invalid = entries.find((entry) =>
        (entry.primary_action === "link" && !validLink(entry.primary_href)) ||
        (entry.secondary_action === "link" && !validLink(entry.secondary_href))
      );
      if (invalid) throw new Error(`Enter a valid page path or HTTPS URL for ${invalid.path}.`);
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Session expired. Log in again at /admin/login.");
      const { data, error: readError } = await supabase.from("settings").select("pages").eq("id", 1).single();
      if (readError) throw readError;
      const latestPages = data.pages || {};
      const nextPages = {
        ...latestPages,
        ctaBoxes: { ...(latestPages.ctaBoxes || {}), entries },
      };
      const { error: writeError } = await supabase.from("settings").upsert({
        id: 1,
        pages: nextPages,
        updated_at: new Date().toISOString(),
      });
      if (writeError) throw writeError;
      const detailPaths = entries
        .filter((entry) => !entry.path.endsWith("/*"))
        .flatMap((entry) => [entry.path, entry.path === "/" ? "/hi" : `/hi${entry.path}`]);
      const { revalidateSiteContent } = await import("@/lib/admin/revalidate");
      await revalidateSiteContent(detailPaths);
      setPages(nextPages);
      setMessage("Saved. CTA box changes are live on the site.");
    } catch (error) {
      setMessage(error.message || "Could not save CTA boxes.");
    } finally {
      setSaving(false);
    }
  };

  if (!configured) {
    return <><AdminPageHeader title="CTA Boxes" /><p className="admin-muted">Connect Supabase to edit CTA boxes.</p></>;
  }
  if (loading) return <p className="admin-muted">Loading CTA boxes…</p>;

  return (
    <div>
      <AdminPageHeader
        title="CTA Boxes"
        subtitle="Edit the full Visit Our Studio box on every page, including English and Hindi copy."
      />
      <div className={cn(GLASS, "admin-form-card", "admin-form-card--wide", "space-y-5")}>
        <div>
          <label className={ADMIN_LABEL} htmlFor="cta-box-page">Choose a page or group</label>
          <select id="cta-box-page" value={selected} onChange={(event) => setSelected(event.target.value)} className={ADMIN_INPUT}>
            {options.map((option) => <option key={option.path} value={option.path}>{option.label} — {option.path}</option>)}
          </select>
          <p className="admin-muted mt-2">A group such as /shop/* changes every matching detail page. An exact page entry takes priority.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-56 flex-1">
            <label className={ADMIN_LABEL} htmlFor="custom-cta-path">Specific detail page</label>
            <input
              id="custom-cta-path"
              value={customPath}
              onChange={(event) => setCustomPath(event.target.value)}
              placeholder="/shop/item-slug"
              className={ADMIN_INPUT}
            />
          </div>
          <button type="button" onClick={addCustomPath} className="text-sm text-gold hover:underline pb-2">Select page</button>
        </div>
        <CtaBoxesEditor
          entries={[shown]}
          onChange={changeSelected}
          showAdd={false}
        />
        <div className="admin-form-actions pt-4">
          <button type="button" onClick={save} disabled={saving} className={BTN_PRIMARY}>
            {saving ? "Saving…" : "Save CTA boxes"}
          </button>
          {message && <p className="text-sm text-gold break-words" role="status">{message}</p>}
        </div>
      </div>
    </div>
  );
}
