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
      <SectionHeading>Hero</SectionHeading>
      <BilingualField label="Badge" enKey="hero_badge" hiKey="hero_badge_hi" values={home} onChange={onChange} />
      <BilingualField label="Title line 1" enKey="hero_title_line1" hiKey="hero_title_line1_hi" values={home} onChange={onChange} />
      <BilingualField label="Title highlight" enKey="hero_title_highlight" hiKey="hero_title_highlight_hi" values={home} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Hero banner image</label>
        <ImageUploader multiple={false} value={home.hero_image || ""} onChange={(url) => onChange("hero_image", url)} />
      </div>
      <BilingualField label="Floating card title" enKey="hero_card_title" hiKey="hero_card_title_hi" values={home} onChange={onChange} />
      <BilingualField label="Floating card text" enKey="hero_card_text" hiKey="hero_card_text_hi" values={home} onChange={onChange} />

      <SectionHeading>Quick stats (under hero)</SectionHeading>
      <div className="grid sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="space-y-2 glass rounded-xl p-3">
            <input placeholder={`Stat ${n} value`} value={home[`stat${n}_value`] || ""} onChange={(e) => onChange(`stat${n}_value`, e.target.value)} className={ADMIN_INPUT} />
            <input placeholder="Label EN" value={home[`stat${n}_label`] || ""} onChange={(e) => onChange(`stat${n}_label`, e.target.value)} className={ADMIN_INPUT} />
            <input placeholder="Label HI" value={home[`stat${n}_label_hi`] || ""} onChange={(e) => onChange(`stat${n}_label_hi`, e.target.value)} className={ADMIN_INPUT} />
          </div>
        ))}
      </div>

      <SectionHeading>Atelier intro</SectionHeading>
      <BilingualField label="Eyebrow" enKey="atelier_eyebrow" hiKey="atelier_eyebrow_hi" values={home} onChange={onChange} />
      <BilingualField label="Title" enKey="atelier_title" hiKey="atelier_title_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Body" enKey="atelier_body" hiKey="atelier_body_hi" values={home} onChange={onChange} rows={4} />
      <div>
        <label className={ADMIN_LABEL}>Atelier image</label>
        <ImageUploader multiple={false} value={home.atelier_image || ""} onChange={(url) => onChange("atelier_image", url)} />
      </div>
      <BilingualField label="Image quote" enKey="atelier_quote" hiKey="atelier_quote_hi" values={home} onChange={onChange} />

      <SectionHeading>Academy block</SectionHeading>
      <BilingualField label="Section badge" enKey="academy_badge" hiKey="academy_badge_hi" values={home} onChange={onChange} />
      <BilingualField label="Heading" enKey="academy_heading" hiKey="academy_heading_hi" values={home} onChange={onChange} />
      <BilingualField label="Heading highlight" enKey="academy_heading_highlight" hiKey="academy_heading_highlight_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subheading" enKey="academy_subheading" hiKey="academy_subheading_hi" values={home} onChange={onChange} />
      <input placeholder="Location" value={home.academy_location || ""} onChange={(e) => onChange("academy_location", e.target.value)} className={ADMIN_INPUT} />
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

      <CtaEditor page={home} onChange={onChange} fieldPrefix="bottom_cta_" />

      <p className="admin-muted">
        Marquee, services & process steps: edit in{" "}
        <a href="/admin/content" className="text-gold hover:underline">Site content</a>.
      </p>
    </>
  );
}
