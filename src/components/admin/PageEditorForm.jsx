"use client";

import RepeaterField from "@/components/admin/RepeaterField";
import ImageUploader from "@/components/admin/ImageUploader";
import { FEATURE_FIELDS } from "@/lib/cms/defaults";

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

export function HomeTab({ home, patchPage }) {
  const onChange = (k, v) => patchPage("home", k, v);
  return (
    <>
      <SectionHeading>Header</SectionHeading>
      <p className="admin-muted">
        Top scrolling bar: <a href="/admin/content" className="text-gold hover:underline">Site content</a> ? Top announcement bar.
        Brand name, tagline & logo text: <a href="/admin/settings" className="text-gold hover:underline">Settings</a>.
      </p>

      <SectionHeading>Hero banner</SectionHeading>
      <BilingualField label="Badge" enKey="hero_boutique_badge" hiKey="hero_boutique_badge_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="hero_boutique_title" hiKey="hero_boutique_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="hero_boutique_title_highlight" hiKey="hero_boutique_title_highlight_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="hero_boutique_subtitle" hiKey="hero_boutique_subtitle_hi" values={home} onChange={onChange} rows={3} />
      <BilingualField label="Keyword chips" enKey="hero_boutique_keywords" hiKey="hero_boutique_keywords_hi" values={home} onChange={onChange} />
      <p className="admin-muted">Keyword chips: separate with / e.g. Course / Boutique / Institute</p>
      <BilingualField label="Career CTA button" enKey="hero_boutique_cta" hiKey="hero_boutique_cta_hi" values={home} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Career CTA link</label>
        <input
          value={home.hero_cta_href || ""}
          onChange={(e) => onChange("hero_cta_href", e.target.value)}
          placeholder="/contact"
          className={ADMIN_INPUT}
        />
      </div>
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
          placeholder="/video%201.mp4"
          className={ADMIN_INPUT}
        />
      </div>
      <div>
        <label className={ADMIN_LABEL}>Booking video path</label>
        <input
          value={home.hero_book_local_video || ""}
          onChange={(e) => onChange("hero_book_local_video", e.target.value)}
          placeholder="/video%202.mp4"
          className={ADMIN_INPUT}
        />
      </div>
      <p className="admin-muted">Hero stat bar numbers are fixed in the site design.</p>

      <SectionHeading>Why Choose Us</SectionHeading>
      <BilingualField label="Eyebrow" enKey="why_choose_eyebrow" hiKey="why_choose_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="why_choose_title" hiKey="why_choose_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Brand pillar tag" enKey="why_choose_brand_tag" hiKey="why_choose_brand_tag_hi" values={home} onChange={onChange} />
      <BilingualField label="USP pillar tag" enKey="why_choose_usp_tag" hiKey="why_choose_usp_tag_hi" values={home} onChange={onChange} />
      <BilingualField label="USP hint" enKey="why_choose_usp_hint" hiKey="why_choose_usp_hint_hi" values={home} onChange={onChange} />
      <BilingualField label="More reasons divider" enKey="why_choose_divider" hiKey="why_choose_divider_hi" values={home} onChange={onChange} />
      <RepeaterField
        label="Feature cards (desktop)"
        items={home.why_choose_features || []}
        onChange={(v) => onChange("why_choose_features", v)}
        addLabel="Add feature"
        fields={[
          { key: "icon", label: "Icon", default: "?" },
          { key: "title", label: "Title (EN)" },
          { key: "title_hi", label: "Title (HI)" },
          { key: "sub", label: "Subtitle (EN)", wide: true },
          { key: "sub_hi", label: "Subtitle (HI)", wide: true },
        ]}
      />
      <p className="admin-muted">Brand message & service USP text come from Settings.</p>

      <SectionHeading>Courses preview (Homepage)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="courses_eyebrow" hiKey="courses_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="academy_heading" hiKey="academy_heading_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="academy_heading_highlight" hiKey="academy_heading_highlight_hi" values={home} onChange={onChange} />
      <p className="admin-muted">Individual courses: <a href="/admin/courses" className="text-gold hover:underline">Courses admin</a>.</p>

      <SectionHeading>Shop preview (Homepage)</SectionHeading>
      <p className="admin-muted">
        Products: <a href="/admin/products" className="text-gold hover:underline">Shop admin</a>.
      </p>
      <BilingualField label="Eyebrow" enKey="shop_preview_eyebrow" hiKey="shop_preview_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="shop_preview_title" hiKey="shop_preview_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="shop_preview_title_highlight" hiKey="shop_preview_title_highlight_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="shop_preview_subtitle" hiKey="shop_preview_subtitle_hi" values={home} onChange={onChange} />
      <BilingualField label="CTA button" enKey="shop_preview_cta" hiKey="shop_preview_cta_hi" values={home} onChange={onChange} />
      <RepeaterField
        label="Shop perks ribbon"
        items={home.shop_preview_perks || []}
        onChange={(v) => onChange("shop_preview_perks", v)}
        addLabel="Add perk"
        fields={[
          { key: "icon", label: "Icon", default: "?" },
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

      <SectionHeading>Founder message (slider)</SectionHeading>
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
      <p className="admin-muted">Slide 2 — Sangi Shreya (Director & Lead Mentor)</p>
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
        Process steps: edit in <a href="/admin/content" className="text-gold hover:underline">Site content</a> ? Process steps (JSON).
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
