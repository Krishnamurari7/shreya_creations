"use client";

import { PAGE_CONTAINER } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import StudentRegistrationForm from "@/components/StudentRegistrationForm";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/components/LanguageProvider";
import { fadeUp } from "@/lib/motion";

const STEP_ICONS = ["chat", "form", "docs", "pay", "id", "orient", "train"];

const STEPS = {
  en: {
    eyebrow: "Admission process",
    title: "7 steps to join Shreya Creation",
    subtitle: "Fill the form below — step 2 of our admission process. We confirm the rest on WhatsApp.",
    activeLabel: "You are here",
    trust: [
      { icon: "shield", text: "Secure online save" },
      { icon: "clock", text: "~15 min reply" },
      { icon: "cert", text: "Certificate included" },
    ],
    steps: [
      "Counselling & course selection",
      "Fill this online admission form",
      "Submit 2 passport photos + Aadhaar copy at studio",
      "Pay fees via cash, UPI, or bank transfer",
      "Receive admission number & student ID",
      "Orientation & starter kit briefing",
      "Regular training in your assigned batch",
    ],
  },
  hi: {
    eyebrow: "एडमिशन प्रक्रिया",
    title: "श्रेया क्रिएशन में शामिल होने के 7 चरण",
    subtitle: "नीचे फॉर्म भरें — हमारी 7-चरणीय प्रक्रिया का चरण 2। बाकी WhatsApp पर कन्फर्म होगा।",
    activeLabel: "आप यहाँ हैं",
    trust: [
      { icon: "shield", text: "सुरक्षित ऑनलाइन सेव" },
      { icon: "clock", text: "~15 मिनट जवाब" },
      { icon: "cert", text: "सर्टिफिकेट शामिल" },
    ],
    steps: [
      "काउंसलिंग और कोर्स चयन",
      "यह ऑनलाइन एडमिशन फॉर्म भरें",
      "स्टूडियो पर 2 पासपोर्ट फोटो + आधार कॉपी जमा करें",
      "नकद, UPI या बैंक ट्रांसफर से फीस जमा करें",
      "एडमिशन नंबर और स्टूडेंट ID प्राप्त करें",
      "ओरिएंटेशन और स्टार्टर किट",
      "निर्धारित बैच में नियमित प्रशिक्षण",
    ],
  },
};

function StepIcon({ type }) {
  const props = {
    className: "register-step-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "chat":
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "form":
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      );
    case "docs":
      return (
        <svg {...props}>
          <path d="M16 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="12" height="14" rx="2" />
        </svg>
      );
    case "pay":
      return (
        <svg {...props}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      );
    case "id":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="2" />
          <path d="M15 8h4M15 12h4M7 16h10" />
        </svg>
      );
    case "orient":
      return (
        <svg {...props}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
        </svg>
      );
  }
}

function TrustIcon({ type }) {
  const props = {
    className: "register-trust-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    "aria-hidden": true,
  };

  if (type === "clock") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  if (type === "cert") {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="6" />
        <path d="M8.5 14.5 7 22l5-2.5L17 22l-1.5-7.5" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function RegisterPageClient({ site, courses, defaultCourseSlug = "" }) {
  const { lang } = useLanguage();
  const t = STEPS[lang] || STEPS.en;
  const reduceMotion = useReducedMotion();

  return (
    <section className={cn(PAGE_CONTAINER, "register-page", "max-w-6xl", "pb-10", "sm:pb-14", "lg:pb-16", "relative", "z-20")}>
      <SectionHeading
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        className="mb-6 sm:mb-8"
      />

      <ul className="register-trust-strip" aria-label={lang === "hi" ? "विश्वास बिंदु" : "Trust highlights"}>
        {t.trust.map((item) => (
          <li key={item.text} className="register-trust-strip__item">
            <TrustIcon type={item.icon} />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>

      <div className="register-page__grid">
        <motion.aside
          className="register-timeline"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          custom={0.1}
          variants={fadeUp}
        >
          <div className="register-timeline__head">
            <span className="register-timeline__eyebrow">{lang === "hi" ? "7 चरण" : "7 steps"}</span>
            <p className="register-timeline__note">{t.activeLabel}</p>
          </div>

          <ol className="register-timeline__list">
            {t.steps.map((step, i) => {
              const active = i === 1;
              const done = i === 0;
              return (
                <li
                  key={step}
                  className={cn(
                    "register-timeline__item",
                    active && "register-timeline__item--active",
                    done && "register-timeline__item--done"
                  )}
                >
                  <span className="register-timeline__marker" aria-hidden>
                    <StepIcon type={STEP_ICONS[i] || "train"} />
                    <span className="register-timeline__num">{i + 1}</span>
                  </span>
                  <div className="register-timeline__body">
                    <p className="register-timeline__text">{step}</p>
                    {active && <span className="register-timeline__badge">{t.activeLabel}</span>}
                  </div>
                </li>
              );
            })}
          </ol>
        </motion.aside>

        <motion.div
          className="register-page__form"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          custom={0.2}
          variants={fadeUp}
        >
          <StudentRegistrationForm
            number={site.whatsapp}
            courses={courses}
            defaultCourseSlug={defaultCourseSlug}
          />
        </motion.div>
      </div>
    </section>
  );
}
