"use client";

import RepeaterField from "@/components/admin/RepeaterField";
import ImageUploader from "@/components/admin/ImageUploader";
import BoutiqueHeroBannerEditor from "@/components/admin/BoutiqueHeroBannerEditor";
import BoutiqueNavEditor from "@/components/admin/BoutiqueNavEditor";
import HomeAwardGalleryPicker from "@/components/admin/HomeAwardGalleryPicker";
import {
  FEATURE_FIELDS,
  PROCESS_FEATURE_FIELDS,
  LANDING_DESIGN_FIELDS,
  LANDING_SERVICE_FIELDS,
  LANDING_PRICE_FIELDS,
  LANDING_OPTION_FIELDS,
  LANDING_PROCESS_FIELDS,
  LANDING_FAQ_FIELDS,
  LANDING_SEARCH_FIELDS,
  NRI_HIGHLIGHT_FIELDS,
  NRI_STEP_FIELDS,
  NRI_POINT_FIELDS,
  NRI_SERVICE_FIELDS,
  NRI_FEATURE_FIELDS,
  NRI_TOPIC_FIELDS,
  NRI_COURSE_FIELDS,
  NRI_RAIL_FIELDS,
} from "@/lib/cms/defaults";
import {
  CATEGORY_CARD_FIELDS,
  HOME_AWARD_FIELDS,
  HOME_BRIDAL_CTA_FIELDS,
  HOME_BRIDAL_SLIDE_FIELDS,
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
        <BilingualTextarea
          label="WhatsApp message"
          enKey={fk("wa_message")}
          hiKey={fk("wa_message_hi")}
          values={page}
          onChange={onChange}
          rows={3}
        />
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
export function BoutiquePageEditor({ page, onChange, publicPath = "/shop", variant = "shop", onBannerBusyChange }) {
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

      <SectionHeading>Page title</SectionHeading>
      <p className="admin-muted">This title is available to screen readers and search engines. The visible hero contains only the banner.</p>
      <BilingualField label="Page title" enKey="header_title" hiKey="header_title_hi" values={page} onChange={onChange} />
      <SectionHeading>Hero banners by screen size</SectionHeading>
      <BoutiqueHeroBannerEditor page={page} onChange={onChange} onBusyChange={onBannerBusyChange} />
      <div>
        <label className={ADMIN_LABEL}>Fallback hero image</label>
        <ImageUploader
          multiple={false}
          value={page.hero_image || ""}
          onChange={(url) => onChange("hero_image", url)}
        />
      </div>

      {!isService && (
        <>
          <SectionHeading>Boutique menu categories</SectionHeading>
          <BoutiqueNavEditor items={page.boutique_nav || []} onChange={(items) => onChange("boutique_nav", items)} />
        </>
      )}

      {isService && (
        <>
          <SectionHeading>Booking message</SectionHeading>
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

      <SectionHeading>Homepage bridal carousel hero</SectionHeading>
      <p className="admin-muted">Edit the text on the left and add, remove, or reorder video slides on the right. Use <code>{"{{year}}"}</code> in the badge to show the founding year from Settings.</p>
      <BilingualField label="Badge" enKey="hero_bridal_badge" hiKey="hero_bridal_badge_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Main title (line breaks allowed)" enKey="hero_bridal_title" hiKey="hero_bridal_title_hi" values={home} onChange={onChange} rows={2} />
      <BilingualField label="Gold title line" enKey="hero_bridal_highlight" hiKey="hero_bridal_highlight_hi" values={home} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="hero_bridal_subtitle" hiKey="hero_bridal_subtitle_hi" values={home} onChange={onChange} rows={3} />
      <BilingualField label="Location" enKey="hero_bridal_location" hiKey="hero_bridal_location_hi" values={home} onChange={onChange} />
      <RepeaterField
        label="Hero buttons"
        items={home.hero_bridal_ctas || []}
        onChange={(items) => onChange("hero_bridal_ctas", items)}
        addLabel="Add button"
        fields={HOME_BRIDAL_CTA_FIELDS}
      />
      <RepeaterField
        label="Carousel slides"
        items={home.hero_bridal_slides || []}
        onChange={(items) => onChange("hero_bridal_slides", items)}
        addLabel="Add slide"
        fields={HOME_BRIDAL_SLIDE_FIELDS}
      />
      <p className="admin-muted">Upload a desktop video for each slide. Tablet and mobile videos are optional overrides. The poster image appears only while the video loads. Each video plays fully before the next slide. Save all pages to publish.</p>
      <p className="admin-muted">
        Stat bar numbers (years / students / outfits) come from{" "}
        <a href="/admin/settings" className="text-gold hover:underline">Settings → Facts</a>.
      </p>

      <SectionHeading>Awards and recognition carousel</SectionHeading>
      <BilingualField label="Section heading" enKey="awards_heading" hiKey="awards_heading_hi" values={home} onChange={onChange} />
      <HomeAwardGalleryPicker items={home.award_items || []} onChange={(items) => onChange("award_items", items)} />
      <RepeaterField
        label="Carousel photos and captions"
        items={home.award_items || []}
        onChange={(v) => onChange("award_items", v)}
        addLabel="Add award photo"
        fields={HOME_AWARD_FIELDS}
      />
      <p className="admin-muted">Selected Gallery photos appear here. You can also upload a new photo, edit captions, remove photos or change their order. Use Save all pages to publish changes.</p>

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

function ImageAltFields({ label, enKey, hiKey, page, onChange }) {
  return (
    <BilingualField label={label} enKey={enKey} hiKey={hiKey} values={page} onChange={onChange} />
  );
}

function SingleImage({ label, pageKey, page, onChange, hint }) {
  return (
    <div>
      <label className={ADMIN_LABEL}>{label}</label>
      {hint ? <p className="admin-muted mb-2">{hint}</p> : null}
      <ImageUploader multiple={false} value={page[pageKey] || ""} onChange={(url) => onChange(pageKey, url || "")} />
    </div>
  );
}

/** Full CMS editor for /nri-clients. Header title is the page H1; section titles are H2. */
export function NriPageEditor({ page, onChange }) {
  return (
    <>
      <SectionHeading>SEO</SectionHeading>
      <p className="admin-muted">
        Public URL: <code>/nri-clients</code> and <code>/hi/nri-clients</code> — NRI Fashion Designing Course
        landing. Meta title and description power search results. The page header title is the only H1. Each
        section title is an H2. Highlight, feature, service, topic, step, and related-course cards each have an Image
        upload. Section images are optional.
      </p>
      <BilingualField label="Meta title" enKey="meta_title" hiKey="meta_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea
        label="Meta description"
        enKey="meta_description"
        hiKey="meta_description_hi"
        values={page}
        onChange={onChange}
        rows={3}
      />
      <div>
        <label className={ADMIN_LABEL}>OG / social image (optional — falls back to hero image)</label>
        <ImageUploader value={page.og_image || ""} onChange={(url) => onChange("og_image", url)} />
      </div>
      <ImageAltFields label="Social image alt" enKey="image_alt" hiKey="image_alt_hi" page={page} onChange={onChange} />

      <HeaderSimple page={page} onChange={onChange} />
      <p className="admin-muted">Header title = on-page H1. Keep the main keyword in this heading.</p>
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
      <ImageAltFields label="Hero image alt" enKey="hero_image_alt" hiKey="hero_image_alt_hi" page={page} onChange={onChange} />
      <SectionHeading>Hero buttons</SectionHeading>
      <BilingualField label="Admission enquiry button" enKey="hero_cta_stitch" hiKey="hero_cta_stitch_hi" values={page} onChange={onChange} />
      <BilingualField label="Call button" enKey="hero_cta_class" hiKey="hero_cta_class_hi" values={page} onChange={onChange} />
      <BilingualField label="WhatsApp button" enKey="hero_cta_wa" hiKey="hero_cta_wa_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Hero badges"
        items={page.rail || []}
        onChange={(v) => onChange("rail", v)}
        addLabel="Add badge"
        fields={NRI_RAIL_FIELDS}
      />

      <SectionHeading>Highlight cards (H2 + H3)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="highlights_eyebrow" hiKey="highlights_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="highlights_title" hiKey="highlights_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="highlights_subtitle" hiKey="highlights_subtitle_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Highlight cards"
        items={page.highlights || []}
        onChange={(v) => onChange("highlights", v)}
        addLabel="Add highlight"
        fields={NRI_HIGHLIGHT_FIELDS}
      />

      <SectionHeading>Order process (H2 + H3)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="process_eyebrow" hiKey="process_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="process_title" hiKey="process_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="process_subtitle" hiKey="process_subtitle_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Process steps"
        items={page.process_steps || []}
        onChange={(v) => onChange("process_steps", v)}
        addLabel="Add step"
        fields={NRI_STEP_FIELDS}
      />

      <SectionHeading>Feature strip (H2 + H3)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="features_eyebrow" hiKey="features_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="features_title" hiKey="features_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="features_subtitle" hiKey="features_subtitle_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Feature cards"
        items={page.features || []}
        onChange={(v) => onChange("features", v)}
        addLabel="Add feature"
        fields={NRI_FEATURE_FIELDS}
      />

      <SectionHeading>Concept (H2)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="concept_eyebrow" hiKey="concept_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="concept_title" hiKey="concept_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="concept_subtitle" hiKey="concept_subtitle_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Points"
        items={page.concept_points || []}
        onChange={(v) => onChange("concept_points", v)}
        addLabel="Add point"
        fields={NRI_POINT_FIELDS}
      />
      <SingleImage
        label="Section image"
        pageKey="concept_image"
        page={page}
        onChange={onChange}
        hint="Optional. Shows above the checklist."
      />
      <ImageAltFields label="Section image alt" enKey="concept_image_alt" hiKey="concept_image_alt_hi" page={page} onChange={onChange} />

      <SectionHeading>Services (H2 + H3)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="services_eyebrow" hiKey="services_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="services_title" hiKey="services_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="services_subtitle" hiKey="services_subtitle_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Service cards"
        items={page.services || []}
        onChange={(v) => onChange("services", v)}
        addLabel="Add service"
        fields={NRI_SERVICE_FIELDS}
      />

      <SectionHeading>Fashion training (H2 + H3)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="training_eyebrow" hiKey="training_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="training_title" hiKey="training_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="training_subtitle" hiKey="training_subtitle_hi" values={page} onChange={onChange} />
      <BilingualField label="Online card title" enKey="training_online_title" hiKey="training_online_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Online card text" enKey="training_online_desc" hiKey="training_online_desc_hi" values={page} onChange={onChange} />
      <SingleImage label="Online card image" pageKey="training_online_image" page={page} onChange={onChange} hint="Optional." />
      <BilingualField label="Offline card title" enKey="training_offline_title" hiKey="training_offline_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Offline card text" enKey="training_offline_desc" hiKey="training_offline_desc_hi" values={page} onChange={onChange} />
      <SingleImage label="Offline card image" pageKey="training_offline_image" page={page} onChange={onChange} hint="Optional." />
      <BilingualField label="Note" enKey="training_note" hiKey="training_note_hi" values={page} onChange={onChange} />
      <BilingualField label="Button" enKey="training_cta" hiKey="training_cta_hi" values={page} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Training image</label>
        <ImageUploader multiple={false} value={page.training_image || ""} onChange={(url) => onChange("training_image", url)} />
      </div>
      <ImageAltFields label="Training image alt" enKey="training_image_alt" hiKey="training_image_alt_hi" page={page} onChange={onChange} />

      <SectionHeading>Learn topics (H2)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="learn_eyebrow" hiKey="learn_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="learn_title" hiKey="learn_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="learn_subtitle" hiKey="learn_subtitle_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Topics"
        items={page.learn_topics || []}
        onChange={(v) => onChange("learn_topics", v)}
        addLabel="Add topic"
        fields={NRI_TOPIC_FIELDS}
      />
      <SingleImage
        label="Section image"
        pageKey="learn_image"
        page={page}
        onChange={onChange}
        hint="Optional. Shows above the topic list."
      />
      <ImageAltFields label="Section image alt" enKey="learn_image_alt" hiKey="learn_image_alt_hi" page={page} onChange={onChange} />

      <SectionHeading>Ready-to-wear saree (H2)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="rtw_eyebrow" hiKey="rtw_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="rtw_title" hiKey="rtw_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="rtw_subtitle" hiKey="rtw_subtitle_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Points"
        items={page.rtw_points || []}
        onChange={(v) => onChange("rtw_points", v)}
        addLabel="Add point"
        fields={NRI_POINT_FIELDS}
      />
      <BilingualTextarea label="Keyword line" enKey="rtw_keywords" hiKey="rtw_keywords_hi" values={page} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Section image</label>
        <ImageUploader multiple={false} value={page.rtw_image || ""} onChange={(url) => onChange("rtw_image", url)} />
      </div>
      <ImageAltFields label="Image alt" enKey="rtw_image_alt" hiKey="rtw_image_alt_hi" page={page} onChange={onChange} />

      <SectionHeading>Remote learning banner (H2)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="remote_kicker" hiKey="remote_kicker_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="remote_title" hiKey="remote_title_hi" values={page} onChange={onChange} />
      <BilingualField label="Script line" enKey="remote_script" hiKey="remote_script_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Body" enKey="remote_body" hiKey="remote_body_hi" values={page} onChange={onChange} />
      <BilingualField label="Courses button" enKey="remote_primary_label" hiKey="remote_primary_label_hi" values={page} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Courses link</label>
        <input
          value={page.remote_primary_href || "/courses"}
          onChange={(e) => onChange("remote_primary_href", e.target.value)}
          className={ADMIN_INPUT}
        />
      </div>
      <BilingualField label="Class button" enKey="remote_secondary_label" hiKey="remote_secondary_label_hi" values={page} onChange={onChange} />
      <SingleImage
        label="Banner image"
        pageKey="remote_image"
        page={page}
        onChange={onChange}
        hint="Optional. Shows at the top of the banner."
      />
      <ImageAltFields label="Banner image alt" enKey="remote_image_alt" hiKey="remote_image_alt_hi" page={page} onChange={onChange} />

      <SectionHeading>Class steps (H2 + H3)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="classes_eyebrow" hiKey="classes_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="classes_title" hiKey="classes_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="classes_subtitle" hiKey="classes_subtitle_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Class steps"
        items={page.class_steps || []}
        onChange={(v) => onChange("class_steps", v)}
        addLabel="Add step"
        fields={NRI_STEP_FIELDS}
      />
      <SingleImage
        label="Section image"
        pageKey="classes_image"
        page={page}
        onChange={onChange}
        hint="Optional. Shows above the steps."
      />
      <ImageAltFields label="Section image alt" enKey="classes_image_alt" hiKey="classes_image_alt_hi" page={page} onChange={onChange} />

      <SectionHeading>Bridal (H2)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="bridal_eyebrow" hiKey="bridal_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="bridal_title" hiKey="bridal_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Quote" enKey="bridal_quote" hiKey="bridal_quote_hi" values={page} onChange={onChange} rows={2} />
      <BilingualTextarea label="Body" enKey="bridal_body" hiKey="bridal_body_hi" values={page} onChange={onChange} />
      <BilingualField label="Stitching button" enKey="bridal_cta" hiKey="bridal_cta_hi" values={page} onChange={onChange} />
      <BilingualField label="Portfolio button" enKey="bridal_secondary_label" hiKey="bridal_secondary_label_hi" values={page} onChange={onChange} />
      <div>
        <label className={ADMIN_LABEL}>Portfolio link</label>
        <input
          value={page.bridal_secondary_href || "/portfolio"}
          onChange={(e) => onChange("bridal_secondary_href", e.target.value)}
          className={ADMIN_INPUT}
        />
      </div>
      <div>
        <label className={ADMIN_LABEL}>Bridal image</label>
        <ImageUploader multiple={false} value={page.bridal_image || ""} onChange={(url) => onChange("bridal_image", url)} />
      </div>
      <ImageAltFields label="Bridal image alt" enKey="bridal_image_alt" hiKey="bridal_image_alt_hi" page={page} onChange={onChange} />

      <SectionHeading>Why choose (H2)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="why_eyebrow" hiKey="why_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="why_title" hiKey="why_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="why_subtitle" hiKey="why_subtitle_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Reasons"
        items={page.why_points || []}
        onChange={(v) => onChange("why_points", v)}
        addLabel="Add reason"
        fields={NRI_POINT_FIELDS}
      />
      <SingleImage
        label="Section image"
        pageKey="why_image"
        page={page}
        onChange={onChange}
        hint="Optional. Shows above the reasons."
      />
      <ImageAltFields label="Section image alt" enKey="why_image_alt" hiKey="why_image_alt_hi" page={page} onChange={onChange} />

      <SectionHeading>Related courses (H2 + H3)</SectionHeading>
      <RepeaterField
        label="Course cards"
        items={page.related_courses || []}
        onChange={(v) => onChange("related_courses", v)}
        addLabel="Add course"
        fields={NRI_COURSE_FIELDS}
      />

      <SectionHeading>FAQ (H2 + H3)</SectionHeading>
      <BilingualField label="Eyebrow" enKey="faq_eyebrow" hiKey="faq_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Heading" enKey="faq_title" hiKey="faq_title_hi" values={page} onChange={onChange} />
      <BilingualTextarea label="Subtitle" enKey="faq_subtitle" hiKey="faq_subtitle_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Questions"
        items={page.faqs || []}
        onChange={(v) => onChange("faqs", v)}
        addLabel="Add question"
        fields={LANDING_FAQ_FIELDS}
      />

      <SectionHeading>WhatsApp messages</SectionHeading>
      <p className="admin-muted">
        Text that opens in WhatsApp when someone taps a button on this page. Stitching buttons share one message.
        Class buttons share another.
      </p>
      <BilingualTextarea
        label="Custom stitching buttons"
        enKey="wa_stitch_message"
        hiKey="wa_stitch_message_hi"
        values={page}
        onChange={onChange}
        rows={3}
      />
      <BilingualTextarea
        label="1-to-1 class buttons"
        enKey="wa_class_message"
        hiKey="wa_class_message_hi"
        values={page}
        onChange={onChange}
        rows={3}
      />
      <BilingualTextarea
        label="General WhatsApp button"
        enKey="wa_general_message"
        hiKey="wa_general_message_hi"
        values={page}
        onChange={onChange}
        rows={3}
      />

      <CtaEditor page={page} onChange={onChange} showWaMessage />
      <BilingualField label="Bottom CTA eyebrow" enKey="cta_eyebrow" hiKey="cta_eyebrow_hi" values={page} onChange={onChange} />
      <BilingualField label="Reply line" enKey="cta_reply" hiKey="cta_reply_hi" values={page} onChange={onChange} />
      <RepeaterField
        label="Bottom CTA perks"
        items={page.cta_perks || []}
        onChange={(v) => onChange("cta_perks", v)}
        addLabel="Add perk"
        fields={NRI_POINT_FIELDS}
      />
    </>
  );
}
