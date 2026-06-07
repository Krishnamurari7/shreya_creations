"use client";

import { Glass3DCard } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickTeamMember } from "@/lib/i18n";
import { pickPage } from "@/lib/cms";
import { DEFAULT_TEAM } from "@/lib/seed";

export default function TeamSection({ aboutPage }) {
  const { lang } = useLanguage();
  const about = aboutPage || {};
  const members = (about.teamMembers?.length ? about.teamMembers : DEFAULT_TEAM).map((m) =>
    pickTeamMember(m, lang)
  );
  const title = pickPage(about, lang, "teamTitle", "teamTitleHi") || (lang === "hi" ? "हमारी टीम" : "Our Leadership");
  const eyebrow = lang === "hi" ? "नेतृत्व" : "Leadership";

  if (!members.length) return null;

  return (
    <section className="page-container max-w-6xl py-14 sm:py-16 lg:py-20 relative z-20">
      <div className="text-center mb-8 sm:mb-12 reveal">
        <span className="section-eyebrow">{eyebrow}</span>
        <h2 className="section-title mt-2">{title}</h2>
        <div className="section-ornament mt-6" aria-hidden>
          <span className="text-gold text-xs">✦</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-4xl mx-auto">
        {members.map((member, i) => (
          <Glass3DCard
            key={member.name}
            as="article"
            className="team-card reveal text-center rounded-2xl sm:rounded-3xl px-6 py-8 sm:px-8 sm:py-10 border-gold/25 bg-cream/80 interactive-card"
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="team-avatar-ring mx-auto mb-5">
              <div className="flex h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] items-center justify-center rounded-full bg-purple/10 text-2xl font-display text-purple">
                {member.name.charAt(0)}
              </div>
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-ink">{member.name}</h3>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-orange font-semibold">{member.role}</p>
          </Glass3DCard>
        ))}
      </div>
    </section>
  );
}
