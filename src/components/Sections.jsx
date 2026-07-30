"use client";

import { PAGE_CONTAINER, REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Glass3DCard, Float3D } from "@/components/Glass3DCard";
import TrustStats from "@/components/TrustStats";
import { useLanguage } from "@/components/LanguageProvider";
import { greetingMessage, waLink } from "@/lib/whatsapp";

export function TrustWall({ items, localize = false }) {
  return <TrustStats items={items} localize={localize} />;
}

/**
 * First grapheme of the reviewer's name, uppercased. Falls back to a neutral
 * dot so a missing/blank name never renders an empty circle.
 */
function initialOf(name) {
  const first = (name || "").trim().match(/\p{L}|\p{N}/u)?.[0];
  return first ? first.toLocaleUpperCase() : "•";
}

function InitialsAvatar({ name }) {
  return (
    <span className="testimonial-avatar" aria-hidden="true">
      {initialOf(name)}
    </span>
  );
}

function StarRating({ rating = 5 }) {
  const value = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));
  return (
    <span className="testimonial-stars" role="img" aria-label={`${value} out of 5 stars`}>
      {"★".repeat(value)}
      <span className="testimonial-stars__empty">{"★".repeat(5 - value)}</span>
    </span>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="testimonial-badge__glyph" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.56-5.15 3.56-8.8Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3a7.2 7.2 0 0 1-10.72-3.78h-4v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.34 14.31a7.2 7.2 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.79l4-3.09Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.35 6.61l4 3.1A7.2 7.2 0 0 1 12 4.75Z" />
    </svg>
  );
}

/**
 * Rendered only for reviews whose `source` is 'google'. Everything else is a
 * manually entered testimonial and must not claim Google verification.
 */
function VerifiedGoogleBadge({ label }) {
  return (
    <span className="testimonial-badge">
      <GoogleGlyph />
      {label}
    </span>
  );
}

function TestimonialCard({ t, verifiedLabel }) {
  const isGoogleReview = t.source === "google";
  const quote = (
    <>
      <div className="flex items-center justify-between gap-3 mb-3">
        <StarRating rating={t.rating} />
        {isGoogleReview && <VerifiedGoogleBadge label={verifiedLabel} />}
      </div>
      <Float3D translateZ="55" className="mt-1">
        <blockquote className="text-ink font-normal leading-relaxed italic">
          &ldquo;{t.text}&rdquo;
        </blockquote>
      </Float3D>
      <Float3D translateZ="35" className="mt-5">
        <figcaption className="flex items-center gap-3">
          <InitialsAvatar name={t.name} />
          <span className="font-display text-lg text-ink font-medium">{t.name}</span>
        </figcaption>
      </Float3D>
    </>
  );

  return (
    <Glass3DCard
      layered
      as="figure"
      role="group"
      containerClassName="shrink-0 w-auto"
      className="testimonial-card snap-start shrink-0 w-[min(calc(100vw-2.5rem),300px)] sm:w-[300px] md:w-[360px] rounded-2xl sm:rounded-3xl p-5 sm:p-7"
    >
      {isGoogleReview && t.review_url ? (
        <a
          href={t.review_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block focus-visible:outline-none"
        >
          {quote}
        </a>
      ) : (
        quote
      )}
    </Glass3DCard>
  );
}

/* Line icons for the trust bar and the two review tracks. */
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function OutfitIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path {...STROKE} d="M9 3.2 5.2 5a1.6 1.6 0 0 0-.87 1.75l.6 3.15 2.32-.5V20.6h9.5V9.4l2.32.5.6-3.15A1.6 1.6 0 0 0 18.8 5L15 3.2" />
      <path {...STROKE} d="M9 3.2a3 3 0 0 0 6 0" />
    </svg>
  );
}

function StudentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path {...STROKE} d="M2.6 8.6 12 4.2l9.4 4.4L12 13 2.6 8.6Z" />
      <path {...STROKE} d="M6.6 10.6v4.6c0 1.7 2.4 3 5.4 3s5.4-1.3 5.4-3v-4.6" />
      <path {...STROKE} d="M21.4 8.6v5.6" />
    </svg>
  );
}

function ExpressIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle {...STROKE} cx="12" cy="13.4" r="7.4" />
      <path {...STROKE} d="M12 9.6v3.8l2.6 1.8" />
      <path {...STROKE} d="M9.4 2.8h5.2" />
      <path {...STROKE} d="M12 2.8V6" />
    </svg>
  );
}

function TrustIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path {...STROKE} d="M12 2.8 4.6 5.9v5.5c0 4.3 3 8.3 7.4 9.8 4.4-1.5 7.4-5.5 7.4-9.8V5.9L12 2.8Z" />
      <path {...STROKE} d="m8.8 11.9 2.3 2.3 4.1-4.4" />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.22 8.24c0 4.54-3.7 8.23-8.24 8.23Z"
      />
      <path
        fill="currentColor"
        d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"
      />
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="review-cta__arrow" aria-hidden="true" focusable="false">
      <path {...STROKE} d="M4.5 12h14m0 0-5-5m5 5-5 5" />
    </svg>
  );
}

const COPY = {
  en: {
    verified: "Verified Google Review",
    region: "Client testimonials",
    goTo: (n) => `Go to testimonial ${n}`,
    googleLabel: "Google Rating",
    googleNote: (n) => (n > 0 ? `${n}+ Reviews` : "Verified Reviews"),
    trustValue: (y) => `${y}+`,
    trustLabel: "Years of Trust",
    trustNote: (y) => `Since ${y}`,
    outfitsLabel: "Outfits Delivered",
    outfitsNote: "Perfect fitting, premium quality",
    studentsLabel: "Students Trained",
    studentsNote: "From basic to advanced",
    expressValue: (h) => `${h}h`,
    expressLabel: "Express Delivery",
    expressNote: "No extra charge",
    boutiqueLabel: "Boutique Client Reviews",
    boutiqueNote: "From our happy stitching clients",
    instituteLabel: "Institute Student Reviews",
    instituteNote: "From our fashion designing students",
    waTitle: "Book on WhatsApp",
    waNote: "Chat with our team now",
    googleCtaTitle: "View Google Reviews",
    googleCtaNote: "See what our clients say about us",
    thanks: (brand) => `Thank you for trusting ${brand}. Your trust is our greatest motivation.`,
  },
  hi: {
    verified: "सत्यापित Google समीक्षा",
    region: "ग्राहक प्रशंसापत्र",
    goTo: (n) => `प्रशंसापत्र ${n} पर जाएँ`,
    googleLabel: "Google रेटिंग",
    googleNote: (n) => (n > 0 ? `${n}+ समीक्षाएँ` : "सत्यापित समीक्षाएँ"),
    trustValue: (y) => `${y}+`,
    trustLabel: "वर्षों का भरोसा",
    trustNote: (y) => `${y} से`,
    outfitsLabel: "आउटफिट डिलीवर",
    outfitsNote: "परफेक्ट फिटिंग, प्रीमियम क्वालिटी",
    studentsLabel: "प्रशिक्षित छात्र",
    studentsNote: "बेसिक से एडवांस तक",
    expressValue: (h) => `${h} घंटे`,
    expressLabel: "एक्सप्रेस डिलीवरी",
    expressNote: "कोई अतिरिक्त शुल्क नहीं",
    boutiqueLabel: "बुटीक ग्राहकों की समीक्षा",
    boutiqueNote: "हमारे खुश सिलाई ग्राहकों से",
    instituteLabel: "संस्थान के छात्रों की समीक्षा",
    instituteNote: "हमारे फैशन डिज़ाइनिंग छात्रों से",
    waTitle: "व्हाट्सएप पर बुक करें",
    waNote: "अभी हमारी टीम से बात करें",
    googleCtaTitle: "Google समीक्षाएँ देखें",
    googleCtaNote: "देखिए हमारे ग्राहक क्या कहते हैं",
    thanks: (brand) => `${brand} पर भरोसा करने के लिए धन्यवाद। आपका विश्वास ही हमारी सबसे बड़ी प्रेरणा है।`,
  },
};

function TrustHighlight({ icon, iconClassName, value, valueSuffix, label, note }) {
  return (
    <div className="trust-highlight">
      <span className={cn("trust-highlight__icon", iconClassName)} aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="trust-highlight__value">
          <span>{value}</span>
          {valueSuffix}
        </p>
        <p className="trust-highlight__label">{label}</p>
        {note && <p className="trust-highlight__note">{note}</p>}
      </div>
    </div>
  );
}

/**
 * Four headline proof points. The first slot shows the Google score only when an
 * owner has entered one in settings — otherwise it falls back to years of trust
 * so the row never advertises a rating we cannot back up.
 */
function TrustHighlights({ site, copy }) {
  const rating = site.googleRating;
  const reviewCount = Number(site.googleReviewCount) || 0;
  const years = site.yearsExperience;
  const foundingYear = site.foundingYear;

  return (
    <div className="trust-highlights">
      {rating ? (
        <TrustHighlight
          icon={<GoogleGlyph />}
          iconClassName="trust-highlight__icon--google"
          value={rating.toFixed(1)}
          valueSuffix={<span className="trust-highlight__star" aria-hidden="true">★</span>}
          label={copy.googleLabel}
          note={copy.googleNote(reviewCount)}
        />
      ) : (
        <TrustHighlight
          icon={<TrustIcon />}
          value={copy.trustValue(years)}
          label={copy.trustLabel}
          note={copy.trustNote(foundingYear)}
        />
      )}
      <TrustHighlight
        icon={<OutfitIcon />}
        value={`${site.outfitsDelivered}+`}
        label={copy.outfitsLabel}
        note={copy.outfitsNote}
      />
      <TrustHighlight
        icon={<StudentIcon />}
        value={`${site.studentsTaught}+`}
        label={copy.studentsLabel}
        note={copy.studentsNote}
      />
      <TrustHighlight
        icon={<ExpressIcon />}
        value={copy.expressValue(site.expressDeliveryHours)}
        label={copy.expressLabel}
        note={copy.expressNote}
      />
    </div>
  );
}

function TrackHeading({ icon, label, note }) {
  return (
    <div className="testimonial-track__head">
      <span className="testimonial-track__chip" aria-hidden="true">{icon}</span>
      <span className="min-w-0">
        <span className="testimonial-track__label">{label}</span>
        <span className="testimonial-track__note">{note}</span>
      </span>
    </div>
  );
}

/**
 * One full-bleed row of review cards: an auto-scrolling marquee from md up,
 * a snap-scrolling swipe list with dots below that.
 */
function TestimonialTrack({ items, copy, label, note, icon, reverse = false }) {
  const [marquee, setMarquee] = useState(false);
  const [active, setActive] = useState(0);
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setMarquee(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // The marquee keyframe scrolls the track by half its width, so the number of
  // copies has to stay even for the loop to be seamless. Short lists get extra
  // copies so a two-review category still fills a wide screen.
  const list = useMemo(() => {
    if (!marquee || !items.length) return items;
    const copies = Math.max(2, 2 * Math.ceil(3 / items.length));
    return Array.from({ length: copies }, () => items).flat();
  }, [items, marquee]);

  const onScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    const cards = trackRef.current?.children;
    if (!scroller || !cards?.length || marquee) return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < cards.length; i += 1) {
      const card = cards[i];
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    }
    setActive(nearest);
  }, [marquee]);

  const scrollTo = (i) => {
    const scroller = scrollerRef.current;
    const card = trackRef.current?.children[i];
    if (!scroller || !card) return;
    scroller.scrollTo({
      left: card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <div className="min-w-0">
      {label && (
        <div className={PAGE_CONTAINER}>
          <TrackHeading icon={icon} label={label} note={note} />
        </div>
      )}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="testimonials-marquee no-bar"
        role="region"
        aria-roledescription="carousel"
        aria-label={label || copy.region}
        tabIndex={0}
      >
        <div
          ref={trackRef}
          className={cn(
            "testimonials-marquee__track pb-4 px-1",
            reverse && "testimonials-marquee__track--reverse"
          )}
        >
          {list.map((t, i) => (
            <TestimonialCard key={`${t.id || t.name}-${i}`} t={t} verifiedLabel={copy.verified} />
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <div className="testimonials-dots md:hidden">
          {items.map((t, i) => (
            <button
              key={t.id || i}
              type="button"
              aria-label={copy.goTo(i + 1)}
              aria-current={i === active}
              className={cn("testimonials-dot", i === active && "is-active")}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Testimonials({ items = [], site = {} }) {
  const { lang } = useLanguage();
  const copy = COPY[lang] || COPY.en;

  const { boutique, institute } = useMemo(() => {
    const groups = { boutique: [], institute: [] };
    for (const t of items) {
      groups[t.category === "institute" ? "institute" : "boutique"].push(t);
    }
    return groups;
  }, [items]);

  if (!items.length) return null;

  // Labels only earn their space when both audiences are actually represented;
  // otherwise a single unlabelled track reads cleaner.
  const split = boutique.length > 0 && institute.length > 0;
  const whatsappHref = waLink(site.whatsapp, greetingMessage(lang));

  return (
    <div className={cn(REVEAL, "relative", "min-w-0")}>
      <div className={PAGE_CONTAINER}>
        <TrustHighlights site={site} copy={copy} />
      </div>

      <div className="mt-10 space-y-9 md:space-y-11">
        {split ? (
          <>
            <TestimonialTrack
              items={boutique}
              copy={copy}
              icon={<OutfitIcon />}
              label={copy.boutiqueLabel}
              note={copy.boutiqueNote}
            />
            <TestimonialTrack
              items={institute}
              copy={copy}
              icon={<StudentIcon />}
              label={copy.instituteLabel}
              note={copy.instituteNote}
              reverse
            />
          </>
        ) : (
          <TestimonialTrack items={items} copy={copy} />
        )}
      </div>

      <div className={cn(PAGE_CONTAINER, "mt-10")}>
        <div className="review-cta-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="review-cta review-cta--whatsapp"
          >
            <span className="review-cta__badge" aria-hidden="true"><WhatsAppGlyph /></span>
            <span className="review-cta__copy">
              <span className="review-cta__title">{copy.waTitle}</span>
              <span className="review-cta__note">{copy.waNote}</span>
            </span>
            <ArrowGlyph />
          </a>

          {site.googleReviewsUrl && (
            <a
              href={site.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="review-cta review-cta--google"
            >
              <span className="review-cta__badge review-cta__badge--light" aria-hidden="true"><GoogleGlyph /></span>
              <span className="review-cta__copy">
                <span className="review-cta__title">{copy.googleCtaTitle}</span>
                <span className="review-cta__note">{copy.googleCtaNote}</span>
              </span>
              <ArrowGlyph />
            </a>
          )}
        </div>

        {site.brandName && (
          <p className="testimonials-thanks">
            <span aria-hidden="true">♥</span> {copy.thanks(site.brandName)} <span aria-hidden="true">♥</span>
          </p>
        )}
      </div>
    </div>
  );
}
