"use client";

import { motion, useReducedMotion } from "framer-motion";
import CardImage from "@/components/CardImage";
import { Glass3DCard } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickTeamMember } from "@/lib/i18n";
import { pickPage } from "@/lib/cms";
import { DEFAULT_TEAM } from "@/lib/seed";
import { fadeUp, staggerDelay } from "@/lib/motion";

export default function TeamSection({ aboutPage, memberImages = [] }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const about = aboutPage || {};
  const rawMembers = about.teamMembers?.length ? about.teamMembers : DEFAULT_TEAM;
  const members = rawMembers.map((m, i) => ({
    ...pickTeamMember(m, lang),
    image: m.image || memberImages[i] || null,
  }));
  const title =
    pickPage(about, lang, "teamTitle", "teamTitleHi") ||
    (lang === "hi" ? "हमारी टीम" : "Our Leadership");
  const eyebrow = lang === "hi" ? "नेतृत्व" : "Leadership";
  const subtitle =
    lang === "hi"
      ? "अनुभवी मेंटर्स जो कौशल को कारोबार में बदलने में मदद करते हैं"
      : "Experienced mentors who help turn skill into business";

  if (!members.length) return null;

  return (
    <section className="about-team page-container max-w-6xl py-10 sm:py-14 lg:py-16 relative z-20 min-w-0">
      <motion.div
        className="text-center mb-6 sm:mb-10 lg:mb-12 reveal"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        custom={0}
        variants={fadeUp}
      >
        <span className="section-eyebrow">
          <span className="sparkle-pulse text-gold text-[10px]" aria-hidden>
            ✦
          </span>
          {eyebrow}
        </span>
        <h2 className="section-title mt-2 text-balance">{title}</h2>
        <p className="mt-3 section-lead max-w-xl mx-auto text-pretty">{subtitle}</p>
        <div className="section-ornament mt-5 sm:mt-6" aria-hidden>
          <span className="text-gold text-xs">✦</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-8 max-w-4xl mx-auto">
        {members.map((member, i) => (
          <Glass3DCard
            key={member.name}
            as="article"
            className="team-card team-card--photo reveal text-center rounded-2xl sm:rounded-3xl px-5 py-7 sm:px-8 sm:py-10 border-gold/25 bg-cream/80 interactive-card overflow-hidden"
            style={staggerDelay(i, 120)}
          >
            <div className="team-card__portrait mx-auto mb-4 sm:mb-5">
              {member.image ? (
                <div className="team-card__photo-ring gradient-ring rounded-full p-[2px]">
                  <div className="team-card__photo-inner rounded-full overflow-hidden bg-cream p-0.5">
                    <CardImage
                      src={member.image}
                      alt={member.name}
                      ratio="1/1"
                      position="top"
                      className="team-card__photo rounded-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="team-avatar-ring mx-auto">
                  <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-orange/10 text-3xl font-display text-orange">
                    {member.name.charAt(0)}
                  </div>
                </div>
              )}
            </div>
            <h3 className="font-display text-lg sm:text-xl lg:text-2xl text-ink">{member.name}</h3>
            <p className="mt-1.5 sm:mt-2 text-[0.65rem] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] text-orange font-semibold">
              {member.role}
            </p>
          </Glass3DCard>
        ))}
      </div>
    </section>
  );
}
