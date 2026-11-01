"use client";

import { PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED } from "@/lib/ui";
import { cn } from "@/lib/utils";
import CardImage from "@/components/CardImage";
import { useLanguage } from "@/components/LanguageProvider";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
import { resolveMediaSrc } from "@/lib/media";

const DEFAULT_HIGHLIGHTS = [
  {
    title: "Flexible timings",
    titleHi: "लचीली टाइमिंग",
    body: "Live slots planned around overseas time zones so international students can join without leaving their country.",
    bodyHi: "ओवरसीज़ टाइम ज़ोन के हिसाब से लाइव स्लॉट — इंटरनेशनल स्टूडेंट्स अपने देश से join कर सकते हैं।",
  },
  {
    title: "Online guidance & remote support",
    titleHi: "Online guidance और remote support",
    body: "1-to-1 teaching plus WhatsApp help between classes for practice, fitting and boutique techniques.",
    bodyHi: "1-to-1 टीचिंग और क्लास के बीच WhatsApp मदद — प्रैक्टिस, fitting और boutique techniques के लिए।",
  },
  {
    title: "Certificate & boutique expertise",
    titleHi: "सर्टिफिकेट और boutique expertise",
    body: "Finish agreed modules for a certificate from a boutique training institute in Bihar, rooted in real Patna studio work.",
    bodyHi: "तय मॉड्यूल पूरा करें — बिहार के boutique training institute से सर्टिफिकेट, असली Patna स्टूडियो के काम के साथ।",
  },
];

const DEFAULT_STEPS = [
  {
    step: "01",
    title: "Share your enquiry",
    titleHi: "Enquiry भेजें",
    desc: "Country, time zone, skill level and whether you want online or hybrid training in Patna.",
    descHi: "देश, टाइम ज़ोन, स्किल लेवल और online या Patna में hybrid training।",
  },
  {
    step: "02",
    title: "Confirm syllabus & fees",
    titleHi: "Syllabus और फीस कन्फर्म",
    desc: "We share modules, duration, international payment options and certificate details.",
    descHi: "मॉड्यूल, अवधि, international payment options और सर्टिफिकेट की जानकारी।",
  },
  {
    step: "03",
    title: "Start live training",
    titleHi: "लाइव ट्रेनिंग शुरू",
    desc: "Online guidance from our Patna faculty, with remote support between sessions.",
    descHi: "Patna फैकल्टी से online guidance — सेशन्स के बीच remote support।",
  },
  {
    step: "04",
    title: "Certificate & next steps",
    titleHi: "सर्टिफिकेट और अगला कदम",
    desc: "Project review, certificate, and optional in-studio practicals when you visit Bihar.",
    descHi: "प्रोजेक्ट रिव्यू, सर्टिफिकेट, और Bihar visit पर optional in-studio practicals।",
  },
];

function normalizeHighlights(raw) {
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_HIGHLIGHTS;
  return raw.map((item, i) => {
    const fallback = DEFAULT_HIGHLIGHTS[i] || DEFAULT_HIGHLIGHTS[0];
    return {
      title: item.title || fallback.title,
      titleHi: item.titleHi || item.title_hi || fallback.titleHi,
      body: item.body || fallback.body,
      bodyHi: item.bodyHi || item.body_hi || fallback.bodyHi,
      image: item.image || "",
    };
  });
}

function CardPhoto({ src, alt }) {
  const resolved = resolveMediaSrc(src);
  if (!resolved) return null;
  return <CardImage src={resolved} alt={alt || ""} ratio="16/9" className="nri-card__media" />;
}

function normalizeSteps(raw) {
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_STEPS;
  return raw.map((item, i) => {
    const fallback = DEFAULT_STEPS[i] || DEFAULT_STEPS[0];
    return {
      step: item.step || fallback.step,
      title: item.title || fallback.title,
      titleHi: item.titleHi || item.title_hi || fallback.titleHi,
      desc: item.desc || fallback.desc,
      descHi: item.descHi || item.desc_hi || fallback.descHi,
      image: item.image || "",
    };
  });
}

export default function NriClientsHighlights({
  highlights,
  highlightEyebrow,
  highlightEyebrowHi,
  highlightTitle,
  highlightTitleHi,
  highlightSubtitle,
  highlightSubtitleHi,
  processEyebrow,
  processEyebrowHi,
  processTitle,
  processTitleHi,
  processSubtitle,
  processSubtitleHi,
  processSteps,
}) {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const items = normalizeHighlights(highlights);
  const steps = normalizeSteps(processSteps);

  return (
    <>
      <section id="nri-support" className={cn(PAGE_CONTAINER, PAGE_SECTION, "nri-block max-w-6xl")}>
        <LocalizedSectionHeader
          eyebrow={highlightEyebrow || "Built for learners abroad"}
          eyebrowHi={highlightEyebrowHi || "विदेश में सीखने वालों के लिए"}
          title={highlightTitle || "A Fashion Designing Course Made for NRI Students"}
          titleHi={highlightTitleHi || "NRI विद्यार्थियों के लिए फैशन डिजाइनिंग कोर्स"}
          subtitle={
            highlightSubtitle ||
            "Online guidance, flexible timings and remote support — with India-based boutique expertise from Patna."
          }
          subtitleHi={highlightSubtitleHi}
        />
        <ul className="nri-highlights">
          {items.map((item, index) => (
            <li key={item.title} className="nri-card">
              <CardPhoto src={item.image} alt={hi && item.titleHi ? item.titleHi : item.title} />
              <span className="nri-card__index" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="nri-card__title">{hi && item.titleHi ? item.titleHi : item.title}</h3>
              <p className="nri-card__body">{hi && item.bodyHi ? item.bodyHi : item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="nri-process" className={cn(PAGE_CONTAINER, PAGE_SECTION, PAGE_SECTION_BORDERED, "nri-block max-w-6xl")}>
        <LocalizedSectionHeader
          eyebrow={processEyebrow || "Admission path"}
          eyebrowHi={processEyebrowHi || "एडमिशन पथ"}
          title={processTitle || "From enquiry to certificate"}
          titleHi={processTitleHi || "Enquiry से सर्टिफिकेट तक"}
          subtitle={
            processSubtitle ||
            "A clear admission path for overseas Indians joining online or hybrid fashion designing training."
          }
          subtitleHi={processSubtitleHi}
        />
        <ol className="nri-steps">
          {steps.map((item) => (
            <li key={item.step} className="nri-step">
              <CardPhoto src={item.image} alt={hi && item.titleHi ? item.titleHi : item.title} />
              <span className="nri-step__no">{item.step}</span>
              <h3 className="nri-card__title">{hi && item.titleHi ? item.titleHi : item.title}</h3>
              <p className="nri-card__body">{hi && item.descHi ? item.descHi : item.desc}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
