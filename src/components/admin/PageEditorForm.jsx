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
        Top scrolling bar: <a href="/admin/content" className="text-gold hover:underline">Site content</a> → Top announcement bar.
        Brand name, tagline & logo text: <a href="/admin/settings" className="text-gold hover:underline">Settings</a>.
      </p>

      <SectionHeading>Hero Banner</SectionHeading>
      <BilingualField label="Badge" enKey="hero_badge" hiKey="hero_badge_hi" values={home} onChange={onChange} />
      <BilingualField label="Title line 1" enKey="hero_title_line1" hiKey="hero_title_line1_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="hero_title_highlight" hiKey="hero_title_highlight_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="hero_subtitle" hiKey="hero_subtitle_hi" values={home} onChange={onChange} rows={3} />
      <BilingualField label="Button label" enKey="hero_cta_label" hiKey="hero_cta_label_hi" values={home} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Button link</label>
        <input
          value={home.hero_cta_href || ""}
          onChange={(e) => onChange("hero_cta_href", e.target.value)}
          placeholder="/shop"
          className={ADMIN_INPUT}
        />
      </div>
      <div>
        <label className={ADMIN_LABEL}>Hero banner image</label>
        <ImageUploader multiple={false} value={home.hero_image || ""} onChange={(url) => onChange("hero_image", url)} />
      </div>
      <BilingualField label="Floating card title" enKey="hero_card_title" hiKey="hero_card_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Floating card text" enKey="hero_card_text" hiKey="hero_card_text_hi" values={home} onChange={onChange} />

      <SectionHeading>Hero Identity Tiles</SectionHeading>
      <p className="admin-muted">Two chips under the hero subtitle that instantly show what Shreya creation is (institute + boutique).</p>
      <div>
        <label className={ADMIN_LABEL}>Tile 1 icon</label>
        <input value={home.hero_tile1_icon || ""} onChange={(e) => onChange("hero_tile1_icon", e.target.value)} placeholder="🎓" className={ADMIN_INPUT} />
      </div>
      <BilingualField label="Tile 1 title" enKey="hero_tile1_title" hiKey="hero_tile1_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Tile 1 subtitle" enKey="hero_tile1_sub" hiKey="hero_tile1_sub_hi" values={home} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Tile 2 icon</label>
        <input value={home.hero_tile2_icon || ""} onChange={(e) => onChange("hero_tile2_icon", e.target.value)} placeholder="🧵" className={ADMIN_INPUT} />
      </div>
      <BilingualField label="Tile 2 title" enKey="hero_tile2_title" hiKey="hero_tile2_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Tile 2 subtitle" enKey="hero_tile2_sub" hiKey="hero_tile2_sub_hi" values={home} onChange={onChange} />

      <SectionHeading>Why Choose Us</SectionHeading>
      <BilingualField label="Eyebrow" enKey="why_choose_eyebrow" hiKey="why_choose_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="why_choose_title" hiKey="why_choose_title_hi" values={home} onChange={onChange} />
      <RepeaterField
        label="Feature cards"
        items={home.why_choose_features || []}
        onChange={(v) => onChange("why_choose_features", v)}
        addLabel="Add feature"
        fields={[
          { key: "icon", label: "Icon", default: "✦" },
          { key: "title", label: "Title (EN)" },
          { key: "title_hi", label: "Title (HI)" },
          { key: "sub", label: "Subtitle (EN)", wide: true },
          { key: "sub_hi", label: "Subtitle (HI)", wide: true },
        ]}
      />

      <SectionHeading>Collection Showcase</SectionHeading>
      <BilingualField label="Eyebrow" enKey="collection_eyebrow" hiKey="collection_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="collection_title" hiKey="collection_title_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Body" enKey="collection_body" hiKey="collection_body_hi" values={home} onChange={onChange} />
      <BilingualField label="Button label" enKey="collection_cta_label" hiKey="collection_cta_label_hi" values={home} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Button link</label>
        <input
          value={home.collection_cta_href || ""}
          onChange={(e) => onChange("collection_cta_href", e.target.value)}
          placeholder="/portfolio"
          className={ADMIN_INPUT}
        />
      </div>
      <div>
        <label className={ADMIN_LABEL}>Left showcase image</label>
        <ImageUploader multiple={false} value={home.collection_image_left || ""} onChange={(url) => onChange("collection_image_left", url)} />
      </div>
      <div>
        <label className={ADMIN_LABEL}>Right showcase image</label>
        <ImageUploader multiple={false} value={home.collection_image_right || ""} onChange={(url) => onChange("collection_image_right", url)} />
      </div>

      <SectionHeading>Courses Overview</SectionHeading>
      <BilingualField label="Eyebrow" enKey="courses_eyebrow" hiKey="courses_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="courses_title" hiKey="courses_title_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="courses_subtitle" hiKey="courses_subtitle_hi" values={home} onChange={onChange} />
      <p className="admin-muted">Individual courses: <a href="/admin/courses" className="text-gold hover:underline">Courses admin</a>.</p>
      <BilingualField label="Section badge" enKey="academy_badge" hiKey="academy_badge_hi" values={home} onChange={onChange} />
      <BilingualField label="Academy heading" enKey="academy_heading" hiKey="academy_heading_hi" values={home} onChange={onChange} />
      <BilingualField label="Heading highlight" enKey="academy_heading_highlight" hiKey="academy_heading_highlight_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Academy subheading" enKey="academy_subheading" hiKey="academy_subheading_hi" values={home} onChange={onChange} />
      <input placeholder="Studio location" value={home.academy_location || ""} onChange={(e) => onChange("academy_location", e.target.value)} className={ADMIN_INPUT} />
      <BilingualField label="Studio title" enKey="academy_title" hiKey="academy_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Studio title accent" enKey="academy_title_accent" hiKey="academy_title_accent_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Studio subtitle" enKey="academy_subtitle" hiKey="academy_subtitle_hi" values={home} onChange={onChange} />
      <RepeaterField
        label="Academy features"
        items={home.academy_features || []}
        onChange={(v) => onChange("academy_features", v)}
        fields={[
          { key: "icon", label: "Icon", default: "🧵" },
          { key: "text", label: "Text (EN)", wide: true },
          { key: "text_hi", label: "Text (HI)", wide: true },
        ]}
      />
      <RepeaterField
        label="Academy stat highlights"
        items={home.academy_highlights || []}
        onChange={(v) => onChange("academy_highlights", v)}
        fields={[
          { key: "value", label: "Value", default: "1:1" },
          { key: "label", label: "Label (EN)" },
          { key: "label_hi", label: "Label (HI)" },
        ]}
      />
      <RepeaterField
        label="Academy perks (checklist)"
        items={home.academy_perks || []}
        onChange={(v) => onChange("academy_perks", v)}
        fields={[
          { key: "text", label: "Text (EN)", wide: true },
          { key: "text_hi", label: "Text (HI)", wide: true },
        ]}
      />
      <BilingualField label="CTA button" enKey="academy_cta" hiKey="academy_cta_hi" values={home} onChange={onChange} />
      <BilingualField label="Note headline" enKey="academy_note" hiKey="academy_note_hi" values={home} onChange={onChange} />
      <BilingualField label="Note subtext" enKey="academy_note_sub" hiKey="academy_note_sub_hi" values={home} onChange={onChange} />

      <SectionHeading>Video Section (YouTube)</SectionHeading>
      <p className="admin-muted">
        Paste a YouTube link or embed URL. The section appears on the homepage only when a valid video URL is set.
      </p>
      <BilingualField label="Eyebrow" enKey="video_eyebrow" hiKey="video_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="video_title" hiKey="video_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="video_title_highlight" hiKey="video_title_highlight_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="video_subtitle" hiKey="video_subtitle_hi" values={home} onChange={onChange} />
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

      <SectionHeading>Boutique Services Overview</SectionHeading>
      <BilingualField label="Eyebrow" enKey="services_eyebrow" hiKey="services_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="services_title" hiKey="services_title_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="services_subtitle" hiKey="services_subtitle_hi" values={home} onChange={onChange} />
      <p className="admin-muted">
        Service cards: edit in <a href="/admin/content" className="text-gold hover:underline">Site content</a> → Services (JSON).
      </p>

      <SectionHeading>Founder Message (slider)</SectionHeading>
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

      <SectionHeading>Student Success</SectionHeading>
      <BilingualField label="Eyebrow" enKey="success_eyebrow" hiKey="success_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="success_title" hiKey="success_title_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="success_subtitle" hiKey="success_subtitle_hi" values={home} onChange={onChange} />
      <p className="admin-muted">
        Testimonial cards: <a href="/admin/testimonials" className="text-gold hover:underline">Testimonials admin</a>.
      </p>

      <SectionHeading>Contact Section</SectionHeading>
      <CtaEditor page={home} onChange={onChange} fieldPrefix="bottom_cta_" />
    </>
  );
}
