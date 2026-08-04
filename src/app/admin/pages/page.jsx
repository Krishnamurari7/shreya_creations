"use client";

import { BTN_PRIMARY, GLASS } from "@/lib/ui";
import { cn } from "@/lib/utils";
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
  HomeTab,
} from "@/components/admin/PageEditorForm";
import {
  PAGE_DEFAULTS,
  DEFAULT_PILLARS,
  PAGE_EDITOR_KEYS,
  FEATURE_FIELDS,
  NRI_HIGHLIGHT_FIELDS,
  NRI_STEP_FIELDS,
} from "@/lib/cms/defaults";
import {
  mergeJourneyCardsForEditor,
  mergeHeroServiceCardsForEditor,
  mergeHeroFeatureStripForEditor,
  mergeAboutJourneyForEditor,
  categoryCardsForEditor,
  categoryCardsFromEditor,
} from "@/lib/cms";
import { ABOUT_JOURNEY_FIELDS } from "@/lib/cms/home-blocks";
import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";

const TABS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "shop", label: "Shop" },
  { id: "courses", label: "Courses" },
  { id: "portfolio", label: "Portfolio" },
  { id: "lookbook", label: "Blog" },
  { id: "nri", label: "NRI Clients" },
  { id: "faq", label: "FAQ" },
];

function emptyPages() {
  const pages = {};
  for (const key of PAGE_EDITOR_KEYS) {
    pages[key] = structuredClone(PAGE_DEFAULTS[key]);
  }
  pages.home.hero_service_cards = mergeHeroServiceCardsForEditor(pages.home.hero_service_cards);
  pages.home.hero_feature_strip = mergeHeroFeatureStripForEditor(pages.home.hero_feature_strip);
  pages.home.category_cards = categoryCardsForEditor(pages.home.category_cards);
  pages.about.journey_steps = mergeAboutJourneyForEditor(pages.about.journey_steps);
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
            merged.journey_cards = mergeJourneyCardsForEditor(merged.journey_cards);
            merged.hero_service_cards = mergeHeroServiceCardsForEditor(merged.hero_service_cards);
            merged.hero_feature_strip = mergeHeroFeatureStripForEditor(merged.hero_feature_strip);
            merged.category_cards = categoryCardsForEditor(merged.category_cards);
          }
          if (key === "about") {
            merged.journey_steps = mergeAboutJourneyForEditor(merged.journey_steps);
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
    const payload = structuredClone(pages);
    if (payload.home) {
      payload.home.category_cards = categoryCardsFromEditor(payload.home.category_cards);
    }
    const { error } = await supabase.from("settings").upsert({
      id: 1,
      pages: payload,
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
        <div className={cn(GLASS, "rounded-2xl", "p-5", "text-marigold", "border", "border-marigold/30", "text-sm")}>Connect Supabase to edit pages.</div>
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
        subtitle="Homepage sections and copy for About, Contact, Shop, Courses, Portfolio, Blog, and FAQ — English & Hindi."
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

      <div className={cn(GLASS, "admin-form-card", "admin-form-card--wide", "space-y-5")}>
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
            <SectionHeading>Our Journey timeline</SectionHeading>
            <BilingualField label="Section label" enKey="journey_title" hiKey="journey_title_hi" values={page} onChange={onChange} />
            <RepeaterField
              label="Journey steps"
              items={page.journey_steps || []}
              onChange={(v) => onChange("journey_steps", v)}
              addLabel="Add step"
              fields={ABOUT_JOURNEY_FIELDS}
            />
            <p className="admin-muted">
              Year values auto-fill from Settings (founding year, students, courses count, express hours) based on the step&apos;s stat key.
            </p>
            <CtaEditor page={page} onChange={onChange} showWaMessage />
          </>
        )}

        {tab === "contact" && (
          <>
            <HeaderWithHighlight page={page} onChange={onChange} />
            <p className="admin-muted">Map embed URL is in Site content.</p>
            <CtaEditor page={page} onChange={onChange} showWaMessage />
          </>
        )}

        {tab === "shop" && (
          <>
            <HeaderWithHighlight page={page} onChange={onChange} />
            <CtaEditor page={page} onChange={onChange} showWaMessage />
          </>
        )}

        {tab === "courses" && (
          <>
            <HeaderWithHighlight page={page} onChange={onChange} />
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
            <CtaEditor page={page} onChange={onChange} showHighlight showWaMessage />
          </>
        )}

        {tab === "lookbook" && (
          <>
            <HeaderWithHighlight page={page} onChange={onChange} />
            <SectionHeading>Listing SEO</SectionHeading>
            <p className="admin-muted">
              Controls the <code>/blog</code> listing page title, description and social image. Per-post SEO is in{" "}
              <a href="/admin/lookbook" className="text-gold hover:underline">
                Blog admin
              </a>
              .
            </p>
            <div>
              <label className={ADMIN_LABEL}>Meta title</label>
              <input
                value={page.meta_title || ""}
                onChange={(e) => onChange("meta_title", e.target.value)}
                className={ADMIN_INPUT}
                placeholder="Blog | Style Tips & Atelier Guides from Shreya Creation Patna"
              />
            </div>
            <div>
              <label className={ADMIN_LABEL}>Meta description</label>
              <textarea
                rows={3}
                value={page.meta_description || ""}
                onChange={(e) => onChange("meta_description", e.target.value)}
                className={ADMIN_INPUT}
                placeholder="Bridal blouse ideas, stitching tips…"
              />
            </div>
            <div>
              <label className={ADMIN_LABEL}>OG / social image</label>
              <ImageUploader value={page.og_image || ""} onChange={(url) => onChange("og_image", url)} />
            </div>
            <BilingualTextarea
              label="SEO intro paragraph"
              enKey="seo_intro"
              hiKey="seo_intro_hi"
              values={page}
              onChange={onChange}
            />
            <SectionHeading>Feature cards</SectionHeading>
            <RepeaterField
              label="Highlight cards"
              items={page.features || []}
              onChange={(v) => onChange("features", v)}
              addLabel="Add feature"
              fields={FEATURE_FIELDS}
            />
            <p className="admin-muted">
              Blog posts:{" "}
              <a href="/admin/lookbook" className="text-gold hover:underline">
                Blog admin
              </a>
              .
            </p>
            <CtaEditor page={page} onChange={onChange} showWaMessage />
          </>
        )}

        {tab === "nri" && (
          <>
            <HeaderSimple page={page} onChange={onChange} />
            <SectionHeading>Service highlights</SectionHeading>
            <RepeaterField
              label="Highlight cards"
              items={page.highlights || []}
              onChange={(v) => onChange("highlights", v)}
              addLabel="Add highlight"
              fields={NRI_HIGHLIGHT_FIELDS}
            />
            <SectionHeading>Process section</SectionHeading>
            <BilingualField label="Eyebrow" enKey="process_eyebrow" hiKey="process_eyebrow_hi" values={page} onChange={onChange} />
            <BilingualField label="Title" enKey="process_title" hiKey="process_title_hi" values={page} onChange={onChange} />
            <BilingualTextarea label="Subtitle" enKey="process_subtitle" hiKey="process_subtitle_hi" values={page} onChange={onChange} />
            <RepeaterField
              label="Process steps"
              items={page.process_steps || []}
              onChange={(v) => onChange("process_steps", v)}
              addLabel="Add step"
              fields={NRI_STEP_FIELDS}
            />
            <SectionHeading>Feature strip</SectionHeading>
            <RepeaterField
              label="Feature cards"
              items={page.features || []}
              onChange={(v) => onChange("features", v)}
              addLabel="Add feature"
              fields={FEATURE_FIELDS}
            />
            <CtaEditor page={page} onChange={onChange} showWaMessage />
          </>
        )}

        {tab === "faq" && (
          <>
            <HeaderWithHighlight page={page} onChange={onChange} />
            <CtaEditor page={page} onChange={onChange} showWaMessage />
          </>
        )}

        <div className="admin-form-actions pt-4">
          <button type="button" onClick={save} disabled={saving} className={BTN_PRIMARY}>
            {saving ? "Saving…" : "Save all pages"}
          </button>
          {msg && <p className="text-sm text-gold break-words">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
