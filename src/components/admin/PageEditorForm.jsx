"use client";

import RepeaterField from "@/components/admin/RepeaterField";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  FEATURE_FIELDS,
  PROCESS_FEATURE_FIELDS,
  LANDING_USP_FIELDS,
  LANDING_DESIGN_FIELDS,
  LANDING_SERVICE_FIELDS,
  LANDING_PRICE_FIELDS,
  LANDING_OPTION_FIELDS,
  LANDING_PROCESS_FIELDS,
  LANDING_FAQ_FIELDS,
  LANDING_SEARCH_FIELDS,
} from "@/lib/cms/defaults";
import {
  CATEGORY_CARD_FIELDS,
  HERO_FEATURE_FIELDS,
  HERO_SERVICE_FIELDS,
} from "@/lib/cms/home-blocks";

import { ADMIN_INPUT, ADMIN_LABEL } from "@/lib/admin/formClasses";

export function BilingualField({ label, enKey, hiKey, values, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className={ADMIN_LABEL}>{label} (English)</label>
        <input value={values[enKey] || ""} onChange={(e) => onChange(enKey, e.target.value)} className={ADMIN_INPUT} />
      </div>
      <div>
        <label className={ADMIN_LABEL}>{label} (Hindi)</label>
        <input value={values[hiKey] || ""} onChange={(e) => onChange(hiKey, e.target.value)} className={ADMIN_INPUT} />
      </div>
    </div>
  );
}

export function BilingualTextarea({ label, enKey, hiKey, values, onChange, rows = 3 }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className={ADMIN_LABEL}>{label} (English)</label>
        <textarea rows={rows} value={values[enKey] || ""} onChange={(e) => onChange(enKey, e.target.value)} className={ADMIN_INPUT} />
      </div>
      <div>
        <label className={ADMIN_LABEL}>{label} (Hindi)</label>
        <textarea rows={rows} value={values[hiKey] || ""} onChange={(e) => onChange(hiKey, e.target.value)} className={ADMIN_INPUT} />
      </div>
    </div>
  );
}

export function SectionHeading({ children }) {
  return <h3 className="admin-section-heading">{children}</h3>;
}

export function HeaderWithHighlight({ page, onChange }) {
  return (
    <>
      <SectionHeading>Page header</SectionHeading>
      <BilingualField label="Eyebrow" enKey="header_eyebrow" hiKey="header_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Title" enKey="header_title" hiKey="header_title_hi" values={page} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="header_highlight" hiKey="header_highlight_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="header_subtitle" hiKey="header_subtitle_hi" values={page} onChange={onChange} />
    </>
  );
}

export function HeaderSimple({ page, onChange }) {
  return (
    <>
      <SectionHeading>Page header</SectionHeading>
      <BilingualField label="Eyebrow" enKey="header_eyebrow" hiKey="header_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Title" enKey="header_title" hiKey="header_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="header_subtitle" hiKey="header_subtitle_hi" values={page} onChange={onChange} />
    </>
  );
}

export function CtaEditor({ page, onChange, showHighlight = false, showWaMessage = false, fieldPrefix = "cta_" }) {
  const fk = (key) => `${fieldPrefix}${key}`;
  return (
    <>
      <SectionHeading>Bottom CTA</SectionHeading>
      <BilingualField label="Title" enKey={fk("title")} hiKey={fk("title_hi")} values={page} onChange={onChange} />
      {showHighlight && (
        <BilingualField label="Title highlight" enKey={fk("title_highlight")} hiKey={fk("title_highlight_hi")} values={page} onChange={onChange} />
      )}
      <BilingualTextarea label="Subtitle" enKey={fk("subtitle")} hiKey={fk("subtitle_hi")} values={page} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Primary link (leave empty for WhatsApp button)</label>
        <input
          value={page[fk("primary_href")] ?? ""}
          onChange={(e) => onChange(fk("primary_href"), e.target.value)}
          placeholder="/shop"
          className={ADMIN_INPUT}
        />
      </div>
      <BilingualField label="Primary button" enKey={fk("primary_label")} hiKey={fk("primary_label_hi")} values={page} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Secondary link (leave empty to hide)</label>
        <input
          value={page[fk("secondary_href")] ?? ""}
          onChange={(e) => onChange(fk("secondary_href"), e.target.value)}
          placeholder="/contact"
          className={ADMIN_INPUT}
        />
      </div>
      <BilingualField label="Secondary button" enKey={fk("secondary_label")} hiKey={fk("secondary_label_hi")} values={page} onChange={onChange} />
      {showWaMessage && (
        <div>
          <label className={ADMIN_LABEL}>WhatsApp message (optional)</label>
          <textarea
            rows={2}
            value={page[fk("wa_message")] || ""}
            onChange={(e) => onChange(fk("wa_message"), e.target.value)}
            className={ADMIN_INPUT}
          />
        </div>
      )}
    </>
  );
}

export function FeaturesEditor({ page, onChange }) {
  return (
    <RepeaterField
      label="Feature cards"
      items={page.features || []}
      onChange={(v) => onChange("features", v)}
      addLabel="Add feature"
      fields={FEATURE_FIELDS}
    />
  );
}

/** Full editor for /shop and /boutique/[slug] pages.
 *  variant="service" → conversion landing fields (images + copy editable).
 *  variant="shop" → classic boutique overview fields.
 */
export function BoutiquePageEditor({ page, onChange, publicPath = "/shop", variant = "shop" }) {
  const isService = variant === "service";

  return (
    <>
      <SectionHeading>SEO</SectionHeading>
      <p className="admin-muted">
        Public URL: <code>{publicPath}</code>
        {isService ? " — changes go live on the boutique service landing page." : ""}
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
      <div>
        <label className={ADMIN_LABEL}>OG / social image</label>
        <ImageUploader value={page.og_image || ""} onChange={(url) => onChange("og_image", url)} />
      </div>

      <HeaderWithHighlight page={page} onChange={onChange} />
      <p className="admin-muted">
        {isService
          ? "Header title = landing H1. Eyebrow + tagline show in the hero."
          : "Header copy for the boutique overview page."}
      </p>
      <BilingualField
        label="Hero tagline"
        enKey="header_tagline"
        hiKey="header_tagline_hi"
        values={page}
        onChange={onChange}
      />
      {!isService && (
        <BilingualTextarea
          label="Intro body"
          enKey="intro_body"
          hiKey="intro_body_hi"
          values={page}
          onChange={onChange}
          rows={4}
        />
      )}
      <div>
        <label className={ADMIN_LABEL}>Hero image</label>
        <ImageUploader
          multiple={false}
          value={page.hero_image || ""}
          onChange={(url) => onChange("hero_image", url)}
        />
      </div>

      <SectionHeading>Hero CTAs</SectionHeading>
      <BilingualField
        label="Primary button"
        enKey="hero_cta_primary_label"
        hiKey="hero_cta_primary_label_hi"
        values={page}
        onChange={onChange}
      />
      {!isService && (
        <div>
          <label className={ADMIN_LABEL}>Primary link</label>
          <input
            value={page.hero_cta_primary_href || ""}
            onChange={(e) => onChange("hero_cta_primary_href", e.target.value)}
            className={ADMIN_INPUT}
            placeholder="/portfolio"
          />
        </div>
      )}
      <BilingualField
        label="Secondary button"
        enKey="hero_cta_secondary_label"
        hiKey="hero_cta_secondary_label_hi"
        values={page}
        onChange={onChange}
      />

      {isService && (
        <>
          <SectionHeading>Landing hero extras</SectionHeading>
          <BilingualField
            label="Side quote"
            enKey="landing_hero_quote"
            hiKey="landing_hero_quote_hi"
            values={page}
            onChange={onChange}
          />
          <BilingualField
            label="Quote CTA line"
            enKey="landing_hero_quote_cta"
            hiKey="landing_hero_quote_cta_hi"
            values={page}
            onChange={onChange}
          />
          <RepeaterField
            label="Hero USPs (4 recommended)"
            items={page.landing_usps || []}
            onChange={(v) => onChange("landing_usps", v)}
            addLabel="Add USP"
            fields={LANDING_USP_FIELDS}
          />
          <BilingualTextarea
            label="WhatsApp booking message"
            enKey="cta_wa_message"
            hiKey="landing_book_msg_hi"
            values={page}
            onChange={onChange}
            rows={3}
          />

          <SectionHeading>Design gallery</SectionHeading>
          <BilingualField
            label="Gallery title"
            enKey="landing_gallery_title"
            hiKey="landing_gallery_title_hi"
            values={page}
            onChange={onChange}
          />
          <BilingualTextarea
            label="Gallery intro"
            enKey="landing_gallery_lead"
            hiKey="landing_gallery_lead_hi"
            values={page}
            onChange={onChange}
            rows={2}
          />
          <RepeaterField
            label="Design cards (image + title)"
            items={page.landing_designs || []}
            onChange={(v) => onChange("landing_designs", v)}
            addLabel="Add design"
            fields={LANDING_DESIGN_FIELDS}
          />
          <BilingualField
            label="Select design button"
            enKey="landing_select_design"
            hiKey="landing_select_design_hi"
            values={page}
            onChange={onChange}
          />

          <SectionHeading>Services list</SectionHeading>
          <BilingualField
            label="Services title"
            enKey="landing_services_title"
            hiKey="landing_services_title_hi"
            values={page}
            onChange={onChange}
          />
          <RepeaterField
            label="Services"
            items={page.landing_services || []}
            onChange={(v) => onChange("landing_services", v)}
            addLabel="Add service"
            fields={LANDING_SERVICE_FIELDS}
          />

          <SectionHeading>Price table</SectionHeading>
          <BilingualField
            label="Prices title"
            enKey="landing_prices_title"
            hiKey="landing_prices_title_hi"
            values={page}
            onChange={onChange}
          />
          <BilingualField
            label="Type column label"
            enKey="landing_type_label"
            hiKey="landing_type_label_hi"
            values={page}
            onChange={onChange}
          />
          <RepeaterField
            label="Price rows"
            items={page.landing_prices || []}
            onChange={(v) => onChange("landing_prices", v)}
            addLabel="Add price row"
            fields={LANDING_PRICE_FIELDS}
          />
          <BilingualField
            label="Price column header"
            enKey="landing_price_col"
            hiKey="landing_price_col_hi"
            values={page}
            onChange={onChange}
          />
          <BilingualTextarea
            label="Price footnote"
            enKey="landing_price_note"
            hiKey="landing_price_note_hi"
            values={page}
            onChange={onChange}
            rows={2}
          />

          <SectionHeading>Booking form</SectionHeading>
          <BilingualField
            label="Form title"
            enKey="landing_form_title"
            hiKey="landing_form_title_hi"
            values={page}
            onChange={onChange}
          />
          <RepeaterField
            label="Type dropdown options"
            items={page.landing_type_options || []}
            onChange={(v) => onChange("landing_type_options", v)}
            addLabel="Add type option"
            fields={LANDING_OPTION_FIELDS}
          />
          <RepeaterField
            label="Measurement options"
            items={page.landing_measure_options || []}
            onChange={(v) => onChange("landing_measure_options", v)}
            addLabel="Add measurement option"
            fields={LANDING_OPTION_FIELDS}
          />
          <BilingualField
            label="Express checkbox label"
            enKey="landing_express_label"
            hiKey="landing_express_label_hi"
            values={page}
            onChange={onChange}
          />
          <BilingualField
            label="Submit button"
            enKey="landing_submit_label"
            hiKey="landing_submit_label_hi"
            values={page}
            onChange={onChange}
          />

          <SectionHeading>How to book (process)</SectionHeading>
          <BilingualField
            label="Process title"
            enKey="landing_process_title"
            hiKey="landing_process_title_hi"
            values={page}
            onChange={onChange}
          />
          <RepeaterField
            label="Process steps"
            items={page.landing_process || []}
            onChange={(v) => onChange("landing_process", v)}
            addLabel="Add step"
            fields={LANDING_PROCESS_FIELDS}
          />

          <SectionHeading>Quote + FAQs + visit + SEO tags</SectionHeading>
          <BilingualField
            label="Reviews section title"
            enKey="landing_reviews_title"
            hiKey="landing_reviews_title_hi"
            values={page}
            onChange={onChange}
          />
          <BilingualField
            label="FAQ section title"
            enKey="landing_faq_title"
            hiKey="landing_faq_title_hi"
            values={page}
            onChange={onChange}
          />
          <BilingualTextarea
            label="Center quote"
            enKey="landing_quote"
            hiKey="landing_quote_hi"
            values={page}
            onChange={onChange}
            rows={2}
          />
          <BilingualField
            label="Visit title"
            enKey="landing_visit_title"
            hiKey="landing_visit_title_hi"
            values={page}
            onChange={onChange}
          />
          <BilingualField
            label="Directions button"
            enKey="landing_directions_label"
            hiKey="landing_directions_label_hi"
            values={page}
            onChange={onChange}
          />
          <p className="admin-muted">
            Address comes from{" "}
            <a href="/admin/settings" className="text-gold hover:underline">
              Settings
            </a>
            . Reviews come from{" "}
            <a href="/admin" className="text-gold hover:underline">
              Testimonials
            </a>
            .
          </p>
          <RepeaterField
            label="FAQs"
            items={page.landing_faqs || []}
            onChange={(v) => onChange("landing_faqs", v)}
            addLabel="Add FAQ"
            fields={LANDING_FAQ_FIELDS}
          />
          <BilingualField
            label="Popular searches title"
            enKey="landing_searches_title"
            hiKey="landing_searches_title_hi"
            values={page}
            onChange={onChange}
          />
          <RepeaterField
            label="Popular searches"
            items={page.landing_popular_searches || []}
            onChange={(v) => onChange("landing_popular_searches", v)}
            addLabel="Add search tag"
            fields={LANDING_SEARCH_FIELDS}
          />
        </>
      )}

      {!isService && (
        <>
          <SectionHeading>About block</SectionHeading>
          <BilingualField label="About title" enKey="about_title" hiKey="about_title_hi" values={page} onChange={onChange} />
          <BilingualTextarea
            label="About body"
            enKey="about_body"
            hiKey="about_body_hi"
            values={page}
            onChange={onChange}
            rows={5}
          />

          <SectionHeading>Process section</SectionHeading>
          <BilingualField
            label="Process title"
            enKey="process_title"
            hiKey="process_title_hi"
            values={page}
            onChange={onChange}
          />
          <RepeaterField
            label="Process features"
            items={page.process_features || []}
            onChange={(v) => onChange("process_features", v)}
            addLabel="Add process feature"
            fields={PROCESS_FEATURE_FIELDS}
          />
          <p className="admin-muted">
            Icon keys: design, measure, bridal, hand, check, blouse, lehenga, stitch, star, clock, fabric…
          </p>

          <BilingualField
            label="Closing tagline"
            enKey="closing_tagline"
            hiKey="closing_tagline_hi"
            values={page}
            onChange={onChange}
          />

          <SectionHeading>Feature cards</SectionHeading>
          <FeaturesEditor page={page} onChange={onChange} />

          <CtaEditor page={page} onChange={onChange} showWaMessage />
        </>
      )}
    </>
  );
}

export function HomeTab({ home, patchPage }) {
  const onChange = (k, v) => patchPage("home", k, v);
  return (
    <>
      <SectionHeading>Header</SectionHeading>
      <p className="admin-muted">
        Top scrolling bar: <a href="/admin/content" className="text-gold hover:underline">Site content</a> → Top announcement bar.
        Brand name, tagline &amp; logo text: <a href="/admin/settings" className="text-gold hover:underline">Settings</a>.
      </p>

      <SectionHeading>Hero banner (live homepage)</SectionHeading>
      <BilingualField label="Badge" enKey="hero_boutique_badge" hiKey="hero_boutique_badge_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="hero_boutique_title" hiKey="hero_boutique_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="hero_boutique_title_highlight" hiKey="hero_boutique_title_highlight_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="hero_boutique_subtitle" hiKey="hero_boutique_subtitle_hi" values={home} onChange={onChange} rows={3} />
      <div>
        <label className={ADMIN_LABEL}>Demo video thumbnail</label>
        <ImageUploader multiple={false} value={home.hero_demo_thumb || ""} onChange={(url) => onChange("hero_demo_thumb", url)} />
      </div>
      <div>
        <label className={ADMIN_LABEL}>Booking video thumbnail</label>
        <ImageUploader multiple={false} value={home.hero_book_thumb || ""} onChange={(url) => onChange("hero_book_thumb", url)} />
      </div>
      <div>
        <label className={ADMIN_LABEL}>Demo video path</label>
        <input
          value={home.hero_local_video || ""}
          onChange={(e) => onChange("hero_local_video", e.target.value)}
          placeholder="/video-1.mp4"
          className={ADMIN_INPUT}
        />
      </div>
      <div>
        <label className={ADMIN_LABEL}>Booking video path</label>
        <input
          value={home.hero_book_local_video || ""}
          onChange={(e) => onChange("hero_book_local_video", e.target.value)}
          placeholder="/video-2.mp4"
          className={ADMIN_INPUT}
        />
      </div>
      <p className="admin-muted">
        Stat bar numbers (years / students / outfits) come from{" "}
        <a href="/admin/settings" className="text-gold hover:underline">Settings → Facts</a>.
      </p>

      <SectionHeading>Hero service cards</SectionHeading>
      <RepeaterField
        label="Service cards (scroll row under hero)"
        items={home.hero_service_cards || []}
        onChange={(v) => onChange("hero_service_cards", v)}
        addLabel="Add service card"
        fields={HERO_SERVICE_FIELDS}
      />

      <SectionHeading>Hero feature strip</SectionHeading>
      <RepeaterField
        label="Feature strip (under service cards)"
        items={home.hero_feature_strip || []}
        onChange={(v) => onChange("hero_feature_strip", v)}
        addLabel="Add feature"
        fields={HERO_FEATURE_FIELDS}
      />

      <SectionHeading>Quick explore cards</SectionHeading>
      <BilingualField label="Eyebrow" enKey="category_eyebrow" hiKey="category_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title before highlight" enKey="category_title_before" hiKey="category_title_before_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="category_title_highlight" hiKey="category_title_highlight_hi" values={home} onChange={onChange} />
      <BilingualField label="Title after highlight" enKey="category_title_after" hiKey="category_title_after_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="category_subtitle" hiKey="category_subtitle_hi" values={home} onChange={onChange} />
      <RepeaterField
        label="Explore cards"
        items={home.category_cards || []}
        onChange={(v) => onChange("category_cards", v)}
        addLabel="Add card"
        fields={CATEGORY_CARD_FIELDS}
      />
      <p className="admin-muted">
        Items: one per line as <code>English|Hindi</code>. For two-column cards (Boutique), start a column with{" "}
        <code># Heading EN|Heading HI</code> then list items under it.
      </p>

      <SectionHeading>Courses preview (Homepage)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="courses_eyebrow" hiKey="courses_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="academy_heading" hiKey="academy_heading_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="academy_heading_highlight" hiKey="academy_heading_highlight_hi" values={home} onChange={onChange} />
      <BilingualField label="Script tagline" enKey="courses_script_tagline" hiKey="courses_script_tagline_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="courses_subtitle" hiKey="courses_subtitle_hi" values={home} onChange={onChange} />
      <BilingualField label="View all button" enKey="courses_view_all" hiKey="courses_view_all_hi" values={home} onChange={onChange} />
      <SectionHeading>Demo class CTA (inside courses preview)</SectionHeading>
      <BilingualField label="Demo title" enKey="courses_demo_title" hiKey="courses_demo_title_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Demo subtitle" enKey="courses_demo_subtitle" hiKey="courses_demo_subtitle_hi" values={home} onChange={onChange} />
      <BilingualField label="Demo button" enKey="courses_demo_cta" hiKey="courses_demo_cta_hi" values={home} onChange={onChange} />
      <BilingualField label="Demo note" enKey="courses_demo_note" hiKey="courses_demo_note_hi" values={home} onChange={onChange} />
      <BilingualField label="Why choose title" enKey="courses_why_title" hiKey="courses_why_title_hi" values={home} onChange={onChange} />
      <p className="admin-muted">
        Filter tabs, trust badges, and why-stats are fixed in the design. Course cards:{" "}
        <a href="/admin/courses" className="text-gold hover:underline">Courses admin</a>.
      </p>

      <SectionHeading>Shop preview (Homepage)</SectionHeading>
      <p className="admin-muted">
        Products: <a href="/admin/products" className="text-gold hover:underline">Shop admin</a>.
      </p>
      <BilingualField label="Eyebrow" enKey="shop_preview_eyebrow" hiKey="shop_preview_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="shop_preview_title" hiKey="shop_preview_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="shop_preview_title_highlight" hiKey="shop_preview_title_highlight_hi" values={home} onChange={onChange} />
      <BilingualField label="CTA button" enKey="shop_preview_cta" hiKey="shop_preview_cta_hi" values={home} onChange={onChange} />
      <RepeaterField
        label="Shop perks ribbon"
        items={home.shop_preview_perks || []}
        onChange={(v) => onChange("shop_preview_perks", v)}
        addLabel="Add perk"
        fields={[
          { key: "icon", label: "Icon", default: "✦" },
          { key: "label", label: "Label (EN)" },
          { key: "label_hi", label: "Label (HI)" },
        ]}
      />

      <SectionHeading>Video section (YouTube)</SectionHeading>
      <p className="admin-muted">
        Paste a YouTube link or embed URL. The section appears on the homepage only when a valid video URL is set.
      </p>
      <BilingualField label="Eyebrow" enKey="video_eyebrow" hiKey="video_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="video_title" hiKey="video_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="video_title_highlight" hiKey="video_title_highlight_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="video_subtitle" hiKey="video_subtitle_hi" values={home} onChange={onChange} />
      <RepeaterField
        label="Video perks (sidebar list)"
        items={home.video_perks || []}
        onChange={(v) => onChange("video_perks", v)}
        addLabel="Add perk"
        fields={[
          { key: "text", label: "Text (EN)", wide: true },
          { key: "text_hi", label: "Text (HI)", wide: true },
        ]}
      />
      <div>
        <label className={ADMIN_LABEL}>YouTube video URL</label>
        <input
          value={home.video_url || ""}
          onChange={(e) => onChange("video_url", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
          className={ADMIN_INPUT}
        />
        <p className="admin-muted mt-1">Also accepts youtu.be links or https://www.youtube.com/embed/VIDEO_ID</p>
      </div>

      <SectionHeading>Founder message (About page slider)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="founder_eyebrow" hiKey="founder_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="founder_title" hiKey="founder_title_hi" values={home} onChange={onChange} />
      <p className="admin-muted">Slide 1 — Sanjay Kumar Mishra (Founder)</p>
      <BilingualTextarea label="Quote" enKey="founder_quote" hiKey="founder_quote_hi" values={home} onChange={onChange} rows={4} />
      <BilingualField label="Name" enKey="founder_name" hiKey="founder_name_hi" values={home} onChange={onChange} />
      <BilingualField label="Role" enKey="founder_role" hiKey="founder_role_hi" values={home} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Founder photo</label>
        <ImageUploader multiple={false} value={home.founder_image || ""} onChange={(url) => onChange("founder_image", url)} />
      </div>
      <p className="admin-muted">Slide 2 — Sangi Shreya (Director &amp; Lead Mentor)</p>
      <BilingualTextarea label="Quote" enKey="mentor_quote" hiKey="mentor_quote_hi" values={home} onChange={onChange} rows={4} />
      <BilingualField label="Name" enKey="mentor_name" hiKey="mentor_name_hi" values={home} onChange={onChange} />
      <BilingualField label="Role" enKey="mentor_role" hiKey="mentor_role_hi" values={home} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Director photo</label>
        <ImageUploader multiple={false} value={home.mentor_image || ""} onChange={(url) => onChange("mentor_image", url)} />
      </div>

      <SectionHeading>Portfolio preview (Homepage)</SectionHeading>
      <p className="admin-muted">
        Portfolio items: <a href="/admin/portfolio" className="text-gold hover:underline">Portfolio admin</a>.
      </p>
      <BilingualField label="Eyebrow" enKey="portfolio_preview_eyebrow" hiKey="portfolio_preview_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="portfolio_preview_title" hiKey="portfolio_preview_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="portfolio_preview_title_highlight" hiKey="portfolio_preview_title_highlight_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="portfolio_preview_subtitle" hiKey="portfolio_preview_subtitle_hi" values={home} onChange={onChange} />
      <BilingualField label="CTA button" enKey="portfolio_preview_cta" hiKey="portfolio_preview_cta_hi" values={home} onChange={onChange} />

      <SectionHeading>Explore categories (Homepage)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="explore_eyebrow" hiKey="explore_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="explore_title" hiKey="explore_title_hi" values={home} onChange={onChange} />
      <BilingualField label="View all link" enKey="explore_view_all" hiKey="explore_view_all_hi" values={home} onChange={onChange} />

      <SectionHeading>Design process (Homepage)</SectionHeading>
      <p className="admin-muted">
        Process steps: edit in <a href="/admin/content" className="text-gold hover:underline">Site content</a> → Process steps (JSON).
      </p>
      <BilingualField label="Eyebrow" enKey="process_eyebrow" hiKey="process_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="process_title" hiKey="process_title_hi" values={home} onChange={onChange} />

      <SectionHeading>Student success (testimonials)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="success_eyebrow" hiKey="success_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="success_title" hiKey="success_title_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="success_subtitle" hiKey="success_subtitle_hi" values={home} onChange={onChange} />
      <p className="admin-muted">
        Testimonial cards: <a href="/admin/testimonials" className="text-gold hover:underline">Testimonials admin</a>.
      </p>
    </>
  );
}
