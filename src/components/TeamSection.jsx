"use client";

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

  if (!members.length) return null;

  return (
    <section className="page-container max-w-6xl py-12 sm:py-16 relative z-20">
      <div className="text-center mb-8 sm:mb-10 reveal">
        <span className="text-orange uppercase tracking-[0.25em] text-xs font-semibold">
          {lang === "hi" ? "नेतृत्व" : "Leadership"}
        </span>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-ink mt-2">{title}</h2>
        <div className="hairline max-w-xs mx-auto mt-6" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
        {members.map((member) => (
          <article
            key={member.name}
            className="team-card reveal text-center rounded-2xl border border-gold/30 bg-cream px-6 py-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gold/50"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple/10 text-xl font-display text-purple">
              {member.name.charAt(0)}
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-ink">{member.name}</h3>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-orange font-semibold">{member.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
