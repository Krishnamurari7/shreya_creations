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
  BoutiquePageEditor,
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
import { BOUTIQUE_SERVICES } from "@/lib/boutique-services";

const TABS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "shop", label: "Boutique (All)" },
  ...BOUTIQUE_SERVICES.map((s) => ({
    id: s.cmsKey,
    label: s.navLabel,
    path: s.href,
  })),
  { id: "courses", label: "Courses" },
  { id: "portfolio", label: "Portfolio" },
  { id: "lookbook", label: "Blog" },
  { id: "nri", label: "NRI Clients" },
  { id: "faq", label: "FAQ" },
  { id: "ladiesTailor", label: "Ladies Tailor" },
  { id: "boutiqueBoringRoad", label: "Boutique Boring Road" },
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
        for (const key of PAGE_EDITOR_KEYS) {
          const pageFromDb = data.pages && typeof data.pages === "object" ? data.pages[key] : null;
          base[key] = {
            ...structuredClone(PAGE_DEFAULTS[key]),
            ...(pageFromDb && typeof pageFromDb === "object" ? pageFromDb : {}),
          };
          if (key === "home") {
            base[key].academy_perks = normalizeAcademyPerks(
              base[key].academy_perks,
              base[key].academy_perks_hi,
            );
            base[key].journey_cards = mergeJourneyCardsForEditor(base[key].journey_cards);
            base[key].hero_service_cards = mergeHeroServiceCardsForEditor(base[key].hero_service_cards);
            base[key].hero_feature_strip = mergeHeroFeatureStripForEditor(base[key].hero_feature_strip);
            base[key].category_cards = categoryCardsForEditor(base[key].category_cards);
          }
          if (key === "about") {
            base[key].journey_steps = mergeAboutJourneyForEditor(base[key].journey_steps);
          }
          if (BOUTIQUE_SERVICES.some((s) => s.cmsKey === key)) {
            const def = PAGE_DEFAULTS[key] || {};
            const listKeys = [
              "landing_usps",
              "landing_designs",
              "landing_services",
              "landing_prices",
              "landing_type_options",
              "landing_measure_options",
              "landing_process",
              "landing_faqs",
              "landing_popular_searches",
            ];
            for (const listKey of listKeys) {
              if (!Array.isArray(base[key][listKey]) || base[key][listKey].length === 0) {
                base[key][listKey] = structuredClone(def[listKey] || []);
              }
            }
            if (!base[key].hero_image && def.hero_image) {
              base[key].hero_image = def.hero_image;
            }
          }
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
    if (!error) {
      const { revalidateSiteContent } = await import("@/lib/admin/revalidate");
      await revalidateSiteContent(["/shop", "/ladies-tailor-patna", "/boutique-boring-road"]);
    }
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
        subtitle="Homepage sections and copy for About, Contact, Boutique categories, Courses, Portfolio, Blog, NRI Clients, and FAQ — English & Hindi."
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

        {tab === "shop" && <BoutiquePageEditor page={page} onChange={onChange} publicPath="/shop" variant="shop" />}

        {BOUTIQUE_SERVICES.some((s) => s.cmsKey === tab) && (
          <BoutiquePageEditor
            page={page}
            onChange={onChange}
            publicPath={BOUTIQUE_SERVICES.find((s) => s.cmsKey === tab)?.href || "/shop"}
            variant="service"
          />
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
                placeholder="Boutique & Fashion Designing Blog Patna | Shreya Creation"
              />
            </div>
            <div>
              <label className={ADMIN_LABEL}>Meta description</label>
              <textarea
                rows={3}
                value={page.meta_description || ""}
                onChange={(e) => onChange("meta_description", e.target.value)}
                className={ADMIN_INPUT}
                placeholder="Explore boutique fashion, tailoring tips, designer blouse ideas…"
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
            <SectionHeading>Featured article</SectionHeading>
            <p className="admin-muted">
              Pin a blog post on the listing page. The card title and excerpt always
              come from that post in{" "}
              <a href="/admin/lookbook" className="text-gold hover:underline">
                Blog admin
              </a>
              ; optional fields below are fallbacks only.
            </p>
            <div>
              <label className={ADMIN_LABEL}>Featured post slug</label>
              <input
                value={page.feature_post_slug || ""}
                onChange={(e) => onChange("feature_post_slug", e.target.value)}
                placeholder="fashion-designing-institute-designer-boutique-patna"
                className={ADMIN_INPUT}
              />
            </div>
            <div>
              <label className={ADMIN_LABEL}>Featured badge emoji</label>
              <input
                value={page.feature_post_emoji || ""}
                onChange={(e) => onChange("feature_post_emoji", e.target.value)}
                placeholder="👗"
                className={ADMIN_INPUT}
              />
            </div>
            <BilingualField
              label="Feature post title"
              enKey="feature_post_title"
              hiKey="feature_post_title_hi"
              values={page}
              onChange={onChange}
            />
            <BilingualField
              label="Feature headline (H1)"
              enKey="feature_post_h1"
              hiKey="feature_post_h1_hi"
              values={page}
              onChange={onChange}
            />
            <BilingualTextarea
              label="Feature description"
              enKey="feature_post_description"
              hiKey="feature_post_description_hi"
              values={page}
              onChange={onChange}
            />
            <SectionHeading>Posts block</SectionHeading>
            <BilingualField
              label="Block eyebrow"
              enKey="posts_block_title"
              hiKey="posts_block_title_hi"
              values={page}
              onChange={onChange}
            />
            <BilingualField label="Block heading" enKey="posts_block_h1" hiKey="posts_block_h1_hi" values={page} onChange={onChange} />
            <BilingualTextarea
              label="Block description"
              enKey="posts_block_description"
              hiKey="posts_block_description_hi"
              values={page}
              onChange={onChange}
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
            <BilingualTextarea
              label="Hero lead paragraph"
              enKey="hero_subtitle"
              hiKey="hero_subtitle_hi"
              values={page}
              onChange={onChange}
              rows={3}
            />
            <div>
              <label className={ADMIN_LABEL}>Hero image</label>
              <ImageUploader multiple={false} value={page.hero_image || ""} onChange={(url) => onChange("hero_image", url)} />
            </div>
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

        {(tab === "ladiesTailor" || tab === "boutiqueBoringRoad") && (
          <>
            <SectionHeading>SEO</SectionHeading>
            <p className="admin-muted">
              Public URL:{" "}
              <code>{tab === "ladiesTailor" ? "/ladies-tailor-patna" : "/boutique-boring-road"}</code>
            </p>
            <div>
              <label className={ADMIN_LABEL}>Meta title</label>
              <input
                value={page.meta_title || ""}
                onChange={(e) => onChange("meta_title", e.target.value)}
                className={ADMIN_INPUT}
              />
            </div>
            <div>
              <label className={ADMIN_LABEL}>Meta description</label>
              <textarea
                rows={3}
                value={page.meta_description || ""}
                onChange={(e) => onChange("meta_description", e.target.value)}
                className={ADMIN_INPUT}
              />
            </div>
            <HeaderSimple page={page} onChange={onChange} />
            <BilingualTextarea
              label="Intro body"
              enKey="intro_body"
              hiKey="intro_body_hi"
              values={page}
              onChange={onChange}
              rows={5}
            />
            <SectionHeading>Hero CTAs</SectionHeading>
            <BilingualField
              label="Primary button"
              enKey="hero_cta_primary_label"
              hiKey="hero_cta_primary_label_hi"
              values={page}
              onChange={onChange}
            />
            <BilingualField
              label="Secondary button"
              enKey="hero_cta_secondary_label"
              hiKey="hero_cta_secondary_label_hi"
              values={page}
              onChange={onChange}
            />
            <div>
              <label className={ADMIN_LABEL}>Secondary link</label>
              <input
                value={page.hero_cta_secondary_href || "/shop"}
                onChange={(e) => onChange("hero_cta_secondary_href", e.target.value)}
                className={ADMIN_INPUT}
              />
            </div>
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
