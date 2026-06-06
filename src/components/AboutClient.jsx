"use client";

import CardImage from "@/components/CardImage";
import { TrustWall } from "@/components/Sections";
import { Glass3DCard } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized } from "@/lib/i18n";
import { pickPage, pickPillar } from "@/lib/cms";
import TeamSection from "@/components/TeamSection";

export default function AboutClient({ site, trust, pillars, aboutPage }) {
  const { lang } = useLanguage();
  const about = aboutPage || site.pages?.about || {};
  const intro = pickLocalized(site, lang, "intro", "introHi");
  const aboutExtra = pickLocalized(site, lang, "aboutBody", "aboutBodyHi");
  const pillarList = (pillars || site.aboutPillars || []).map((p) => pickPillar(p, lang));

  const heroBefore = pickPage(about, lang, "heroTitleBefore", "heroTitleBeforeHi");
  const heroHighlight = pickPage(about, lang, "heroTitleHighlight", "heroTitleHighlightHi");
  const pillarsTitle = pickPage(about, lang, "pillarsTitle", "pillarsTitleHi");
  const trustTitle = pickPage(about, lang, "trustTitle", "trustTitleHi");
  const heroImage = about.heroImage || "/atelier_details.png";

  return (
    <>
      <section className="page-container max-w-6xl py-6 sm:py-10 grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center relative z-20">
        <div className="absolute -top-10 right-1/4 h-40 w-40 rounded-full bg-orange/5 blur-3xl pointer-events-none" />
        <div className="lg:col-span-5 relative flex justify-center reveal">
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-purple/10 blur-2xl -z-10" />
          <div className="relative w-full max-w-[280px] sm:max-w-md rounded-2xl sm:rounded-[2rem] overflow-hidden glass border border-orange/25 shadow-2xl p-2 sm:p-3 group transition-transform duration-500 hover:-translate-y-1">
            <CardImage src={heroImage} alt="Atelier" ratio="3/4" position="top" className="rounded-3xl" />
            <div className="absolute inset-2 sm:inset-3 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none rounded-3xl" />
            {site.founded && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 glass rounded-full px-4 py-1.5 border border-gold/30 text-[10px] uppercase tracking-widest text-orange font-semibold whitespace-nowrap">
                {site.founded}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4 sm:space-y-5 reveal text-center lg:text-left">
          <span className="section-eyebrow">{lang === "hi" ? "हमारी कहानी" : "Our Story"}</span>
          <h2 className="section-title mt-2">
            {heroBefore}{" "}
            <span className="text-gold-gradient">{heroHighlight}</span>
          </h2>
          <div className="hairline max-w-xs mx-auto lg:mx-0 lg:max-w-sm" />
          <p className="text-muted font-normal leading-relaxed text-base sm:text-lg max-w-xl mx-auto lg:mx-0">{intro}</p>
          {aboutExtra && (
            <p className="text-ink font-normal leading-relaxed text-sm sm:text-base max-w-xl mx-auto lg:mx-0 border-l-2 border-orange/30 pl-4 lg:pl-5 text-left">
              {aboutExtra}
            </p>
          )}
        </div>
      </section>

      {pillarList.length > 0 && (
        <section className="section-muted py-12 sm:py-20 relative z-20">
          <div className="page-container max-w-6xl">
          <div className="text-center mb-8 sm:mb-12 reveal">
            <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">Our values</span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl text-ink mt-2">{pillarsTitle}</h2>
            <div className="hairline max-w-xs mx-auto mt-6" />
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {pillarList.map((p, i) => (
              <Glass3DCard key={i} className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative group">
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="font-display text-2xl text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-ink font-normal leading-relaxed">{p.desc}</p>
              </Glass3DCard>
            ))}
          </div>
          </div>
        </section>
      )}

      <TeamSection aboutPage={about} />

      <section className="page-container max-w-6xl pb-12 sm:pb-8 relative z-20">
        <div className="text-center mb-8 sm:mb-12 reveal">
          <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">By the numbers</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl text-ink mt-2">{trustTitle}</h2>
        </div>
        <TrustWall items={trust} localize />
      </section>
    </>
  );
}
