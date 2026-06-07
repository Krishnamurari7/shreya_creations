"use client";

import { useLanguage } from "@/components/LanguageProvider";
import SectionHeading from "@/components/SectionHeading";

export default function LocalizedSectionHeader({
  eyebrow,
  eyebrowHi,
  title,
  titleHi,
  subtitle,
  subtitleHi,
  className = "",
}) {
  const { lang } = useLanguage();
  const e = lang === "hi" && eyebrowHi ? eyebrowHi : eyebrow;
  const t = lang === "hi" && titleHi ? titleHi : title;
  const s = lang === "hi" && subtitleHi ? subtitleHi : subtitle;

  return <SectionHeading eyebrow={e} title={t} subtitle={s} className={className} />;
}
