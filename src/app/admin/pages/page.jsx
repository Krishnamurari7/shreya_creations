"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RepeaterField from "@/components/admin/RepeaterField";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  BilingualField,
  BilingualTextarea,
  SectionHeading,
  HeaderWithHighlight,
  HeaderSimple,
  CtaEditor,
  FeaturesEditor,
  HomeTab,
} from "@/components/admin/PageEditorForm";
import { PAGE_DEFAULTS, DEFAULT_PILLARS, PAGE_EDITOR_KEYS, FEATURE_FIELDS } from "@/lib/cms/defaults";
import { ADMIN_LABEL } from "@/lib/admin/formClasses";

const TABS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "shop", label: "Shop" },
  { id: "courses", label: "Courses" },
  { id: "portfolio", label: "Portfolio" },
  { id: "lookbook", label: "Lookbook" },
  { id: "faq", label: "FAQ" },
];

function emptyPages() {
  const pages = {};
  for (const key of PAGE_EDITOR_KEYS) {
    pages[key] = structuredClone(PAGE_DEFAULTS[key]);
  }
  return pages;
}

function normalizeAcademyPerks(perks, perksHi) {
  if (!Array.isArray(perks) || !perks.length) return PAGE_DEFAULTS.home.academy_perks;
  if (typeof perks[0] === "object" && perks[0]?.text) return perks;
  return perks.map((text, i) => ({
    text: typeof text === "string" ? text : "",
    text_hi: Array.isArray(perksHi) ? perksHi[i] || "" : "",
  }));
}

export default function PagesAdmin() {
  const configured = isSupabaseConfigured();
  const [tab, setTab] = useState("home");
  const [pages, setPages] = useState(emptyPages);
  const [pillars, setPillars] = useState(DEFAULT_PILLARS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!configured) {
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.from("settings").select("pages, about_pillars").eq("id", 1).single();
      if (data) {
        const base = emptyPages();
        const fromDb = data.pages && typeof data.pages === "object" ? data.pages : {};
        for (const key of PAGE_EDITOR_KEYS) {
          const merged = { ...base[key], ...(fromDb[key] || {}) };
          if (key === "home") {
            merged.academy_perks = normalizeAcademyPerks(merged.academy_perks, merged.academy_perks_hi);
          }
          base[key] = merged;
        }
        setPages(base);
        if (Array.isArray(data.about_pillars) && data.about_pillars.length) {
          setPillars(data.about_pillars);
        }
      }
      setLoading(false);
    })();
  }, [configured]);

  const patchPage = (slug, key, value) => {
    setPages((prev) => ({ ...prev, [slug]: { ...prev[slug], [key]: value } }));
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    const supabase = createClient();
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      setMsg("Session expired. Log in again at /admin/login.");
      setSaving(false);
      return;
    }
    const { error } = await supabase.from("settings").upsert({
      id: 1,
      pages,
      about_pillars: pillars,
      updated_at: new Date().toISOString(),
    });
    setMsg(error ? error.message : "Saved! All page copy is live on the site.");
    setSaving(false);
  };

  if (!configured) {
    return (
      <div>
        <AdminPageHeader title="Page editor" />
        <div className="glass rounded-2xl p-5 text-marigold border border-marigold/30 text-sm">Connect Supabase to edit pages.</div>
      </div>
    );
  }

  if (loading) return <p className="admin-muted">Loading…</p>;

  const page = pages[tab] || {};
  const onChange = (k, v) => patchPage(tab, k, v);

  return (
    <div>
      <AdminPageHeader
        title="Page editor"
        subtitle="Homepage sections (Hero, Why Choose Us, Courses, Services, Founder, Success, Contact) and all page copy — English & Hindi."
      />

      <div className="admin-tabs" role="tablist" aria-label="Page sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`admin-tab ${tab === t.id ? "is-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass admin-form-card admin-form-card--wide space-y-5">
        {tab === "home" && <HomeTab home={pages.home} patchPage={patchPage} />}

        {tab === "about" && (
          <>
            <HeaderSimple page={page} onChange={onChange} />
            <p className="admin-muted">Leave subtitle empty to use site tagline from Settings.</p>
            <SectionHeading>Hero block</SectionHeading>
            <BilingualField label="Headline (before highlight)" enKey="hero_title_before" hiKey="hero_title_before_hi" values={page} onChange={onChange} />
            <BilingualField label="Headline highlight" enKey="hero_title_highlight" hiKey="hero_title_highlight_hi" values={page} onChange={onChange} />
            <div>
              <label className={ADMIN_LABEL}>Hero image</label>
              <ImageUploader multiple={false} value={page.hero_image || ""} onChange={(url) => onChange("hero_image", url)} />
            </div>
            <SectionHeading>Section titles</SectionHeading>
            <BilingualField label="Pillars section title" enKey="pillars_title" hiKey="pillars_title_hi" values={page} onChange={onChange} />
            <BilingualField label="Trust section title" enKey="trust_title" hiKey="trust_title_hi" values={page} onChange={onChange} />
            <SectionHeading>Leadership team</SectionHeading>
            <BilingualField label="Team section title" enKey="team_title" hiKey="team_title_hi" values={page} onChange={onChange} />
            <RepeaterField
              label="Team members"
              items={page.team_members || []}
              onChange={(v) => onChange("team_members", v)}
              addLabel="Add team member"
              fields={[
                { key: "name", label: "Name (EN)" },
                { key: "name_hi", label: "Name (HI)" },
                { key: "role", label: "Role (EN)", wide: true },
                { key: "role_hi", label: "Role (HI)", wide: true },
              ]}
            />
            <RepeaterField
              label="About pillars"
              items={pillars}
              onChange={setPillars}
              addLabel="Add pillar"
              fields={[
                { key: "emoji", label: "Emoji", default: "✦" },
                { key: "title", label: "Title (EN)" },
                { key: "title_hi", label: "Title (HI)" },
                { key: "desc", label: "Description (EN)", type: "textarea", wide: true },
                { key: "desc_hi", label: "Description (HI)", type: "textarea", wide: true },
              ]}
            />
            <CtaEditor page={page} onChange={onChange} />
          </>
        )}

        {tab === "contact" && (
          <>
            <HeaderSimple page={page} onChange={onChange} />
            <p className="admin-muted">Map embed URL is in Site content.</p>
            <CtaEditor page={page} onChange={onChange} />
          </>
        )}

        {tab === "shop" && (
          <>
            <HeaderWithHighlight page={page} onChange={onChange} />
            <FeaturesEditor page={page} onChange={onChange} />
            <CtaEditor page={page} onChange={onChange} />
          </>
        )}

        {tab === "courses" && (
          <>
            <HeaderWithHighlight page={page} onChange={onChange} />
            <FeaturesEditor page={page} onChange={onChange} />
            <CtaEditor page={page} onChange={onChange} showWaMessage />
          </>
        )}

        {tab === "portfolio" && (
          <>
            <HeaderSimple page={page} onChange={onChange} />
            <SectionHeading>Trust section</SectionHeading>
            <BilingualField label="Eyebrow" enKey="trust_eyebrow" hiKey="trust_eyebrow_hi" values={page} onChange={onChange} />
            <BilingualField label="Title" enKey="trust_title" hiKey="trust_title_hi" values={page} onChange={onChange} />
            <SectionHeading>Craft highlights</SectionHeading>
            <BilingualField label="Eyebrow" enKey="craft_eyebrow" hiKey="craft_eyebrow_hi" values={page} onChange={onChange} />
            <BilingualField label="Title" enKey="craft_title" hiKey="craft_title_hi" values={page} onChange={onChange} />
            <BilingualTextarea label="Subtitle" enKey="craft_subtitle" hiKey="craft_subtitle_hi" values={page} onChange={onChange} />
            <RepeaterField
              label="Highlight cards"
              items={page.craft_highlights || []}
              onChange={(v) => onChange("craft_highlights", v)}
              addLabel="Add highlight"
              fields={FEATURE_FIELDS}
            />
            <CtaEditor page={page} onChange={onChange} showHighlight />
          </>
        )}

        {tab === "lookbook" && (
          <>
            <HeaderWithHighlight page={page} onChange={onChange} />
            <CtaEditor page={page} onChange={onChange} />
          </>
        )}

        {tab === "faq" && (
          <>
            <HeaderWithHighlight page={page} onChange={onChange} />
            <CtaEditor page={page} onChange={onChange} />
          </>
        )}

        <div className="admin-form-actions pt-4">
          <button type="button" onClick={save} disabled={saving} className="btn-gold rounded-full px-7 py-3 disabled:opacity-60">
            {saving ? "Saving…" : "Save all pages"}
          </button>
          {msg && <p className="text-sm text-gold break-words">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
