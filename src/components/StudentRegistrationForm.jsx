"use client";

import { BTN_PRIMARY, INTERACTIVE_CARD, REVEAL } from "@/lib/ui";
import { useMemo, useState } from "react";
import { waLink, studentRegistrationMessage } from "@/lib/whatsapp";
import { Glass3DCard } from "@/components/Glass3DCard";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized } from "@/lib/i18n";
import { trackLead, trackWhatsAppClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const COPY = {
  en: {
    title: "Student Admission Form",
    subtitle: "Fill your details — we save them online and confirm admission on WhatsApp.",
    stepPersonal: "Personal",
    stepCourse: "Course",
    stepMore: "More info",
    personal: "Personal details",
    courseSection: "Course preference",
    background: "Background & documents",
    name: "Full name",
    phone: "Phone / WhatsApp",
    email: "Email (optional)",
    dob: "Date of birth (optional)",
    gender: "Gender (optional)",
    address: "Address",
    city: "City",
    course: "Course you want to join",
    batch: "Preferred batch timing",
    education: "Highest education",
    guardian: "Parent / guardian name (optional)",
    aadhaar: "Aadhaar last 4 digits (optional)",
    referral: "How did you hear about us?",
    message: "Any questions or notes",
    selectCourse: "Select a course",
    selectBatch: "Select batch timing",
    selectEducation: "Select education",
    selectGender: "Select gender",
    submit: "Submit admission form",
    footnote:
      "After submit, WhatsApp opens so we can confirm counselling, fees, and documents (photos, Aadhaar copy).",
    successTitle: "Application saved!",
    success: "Your details are saved online. WhatsApp should open — we'll confirm counselling, fees & documents.",
    nameRequired: "Please enter your full name.",
    phoneRequired: "Please enter your phone number.",
    courseRequired: "Please select a course.",
    addressRequired: "Please enter your address.",
    aadhaarInvalid: "Enter exactly 4 digits for Aadhaar (last 4 only).",
    saveError: "Could not save online. Please try WhatsApp directly.",
    savedBadge: "Saved online",
    courseSelected: "Selected course",
    optional: "Optional",
    namePh: "e.g. Priyanshi Sharma",
    phonePh: "e.g. 9876543210",
    emailPh: "you@email.com",
    addressPh: "House no., area, landmark…",
    cityPh: "Patna",
    guardianPh: "Parent or guardian name",
    messagePh: "Any question about fees, batch, or demo class…",
  },
  hi: {
    title: "छात्र एडमिशन फॉर्म",
    subtitle: "अपनी जानकारी भरें — हम ऑनलाइन सेव करेंगे और WhatsApp पर एडमिशन कन्फर्म करेंगे।",
    stepPersonal: "व्यक्तिगत",
    stepCourse: "कोर्स",
    stepMore: "अतिरिक्त",
    personal: "व्यक्तिगत जानकारी",
    courseSection: "कोर्स पसंद",
    background: "पृष्ठभूमि और दस्तावेज",
    name: "पूरा नाम",
    phone: "फ़ोन / WhatsApp",
    email: "ईमेल (वैकल्पिक)",
    dob: "जन्म तिथि (वैकल्पिक)",
    gender: "लिंग (वैकल्पिक)",
    address: "पता",
    city: "शहर",
    course: "जिस कोर्स में एडमिशन चाहिए",
    batch: "पसंदीदा बैच समय",
    education: "उच्चतम शिक्षा",
    guardian: "अभिभावक का नाम (वैकल्पिक)",
    aadhaar: "आधार के अंतिम 4 अंक (वैकल्पिक)",
    referral: "हमारे बारे में कैसे पता चला?",
    message: "कोई सवाल या नोट",
    selectCourse: "कोर्स चुनें",
    selectBatch: "बैच समय चुनें",
    selectEducation: "शिक्षा चुनें",
    selectGender: "लिंग चुनें",
    submit: "एडमिशन फॉर्म जमा करें",
    footnote:
      "जमा करने के बाद WhatsApp खुलेगा — काउंसलिंग, फीस और दस्तावेज (फोटो, आधार कॉपी) कन्फर्म होंगे।",
    successTitle: "आवेदन सेव हो गया!",
    success: "आपकी जानकारी ऑनलाइन सेव है। WhatsApp खुलना चाहिए — काउंसलिंग, फीस और दस्तावेज कन्फर्म करेंगे।",
    nameRequired: "कृपया अपना पूरा नाम लिखें।",
    phoneRequired: "कृपया अपना फ़ोन नंबर लिखें।",
    courseRequired: "कृपया कोर्स चुनें।",
    addressRequired: "कृपया अपना पता लिखें।",
    aadhaarInvalid: "आधार के अंतिम 4 अंक ही लिखें (ठीक 4 अंक)।",
    saveError: "ऑनलाइन सेव नहीं हो सका। सीधे WhatsApp करें।",
    savedBadge: "ऑनलाइन सेव",
    courseSelected: "चुना गया कोर्स",
    optional: "वैकल्पिक",
    namePh: "उदा. प्रियांशी शर्मा",
    phonePh: "उदा. 9876543210",
    emailPh: "aap@email.com",
    addressPh: "मकान नं., इलाका, लैंडमार्क…",
    cityPh: "पटना",
    guardianPh: "अभिभावक का नाम",
    messagePh: "फीस, बैच या डेमो क्लास के बारे में कोई सवाल…",
  },
};

const BATCH_OPTIONS = [
  { value: "morning", en: "Morning", hi: "सुबह", time: "9 – 12" },
  { value: "afternoon", en: "Afternoon", hi: "दोपहर", time: "12 – 3" },
  { value: "evening", en: "Evening", hi: "शाम", time: "3 – 6" },
  { value: "any", en: "Flexible", hi: "लचीला", time: "Any" },
];

const EDUCATION_OPTIONS = [
  { value: "10th", en: "10th pass", hi: "10वीं पास" },
  { value: "12th", en: "12th pass", hi: "12वीं पास" },
  { value: "graduate", en: "Graduate", hi: "स्नातक" },
  { value: "other", en: "Other", hi: "अन्य" },
];

const GENDER_OPTIONS = [
  { value: "female", en: "Female", hi: "महिला" },
  { value: "male", en: "Male", hi: "पुरुष" },
  { value: "other", en: "Other", hi: "अन्य" },
];

const REFERRAL_OPTIONS = [
  { value: "google", en: "Google search", hi: "Google खोज" },
  { value: "instagram", en: "Instagram / Facebook", hi: "Instagram / Facebook" },
  { value: "friend", en: "Friend / family", hi: "दोस्त / परिवार" },
  { value: "student", en: "Existing student", hi: "मौजूदा छात्र" },
  { value: "other", en: "Other", hi: "अन्य" },
];

const FORM_STEPS = ["personal", "course", "more"];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function courseKey(course) {
  return course.id || course.slug;
}

function SectionPanel({ icon, title, optional, children, className }) {
  return (
    <div className={cn("reg-form__panel", className)}>
      <div className="reg-form__panel-head">
        <span className="reg-form__panel-icon" aria-hidden>
          {icon}
        </span>
        <div>
          <h4 className="reg-form__panel-title">{title}</h4>
          {optional && <span className="reg-form__panel-optional">{optional}</span>}
        </div>
      </div>
      <div className="reg-form__panel-body">{children}</div>
    </div>
  );
}

function FormProgress({ t, filled }) {
  const labels = [t.stepPersonal, t.stepCourse, t.stepMore];
  return (
    <div className="reg-form__progress" aria-hidden>
      {FORM_STEPS.map((key, i) => (
        <div
          key={key}
          className={cn("reg-form__progress-step", filled >= i + 1 && "reg-form__progress-step--filled")}
        >
          <span className="reg-form__progress-dot">{i + 1}</span>
          <span className="reg-form__progress-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function BatchChips({ value, onChange, lang, t }) {
  return (
    <div className="reg-form__chips" role="group" aria-label={t.batch}>
      {BATCH_OPTIONS.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            className={cn("reg-form__chip", selected && "reg-form__chip--active")}
            aria-pressed={selected}
            onClick={() => onChange(selected ? "" : o.value)}
          >
            <span className="reg-form__chip-label">{lang === "hi" ? o.hi : o.en}</span>
            <span className="reg-form__chip-time">{o.time}</span>
          </button>
        );
      })}
    </div>
  );
}

function CoursePreview({ course, lang, label }) {
  if (!course) return null;
  const title = pickLocalized(course, lang, "title", "title_hi");
  const duration = course.duration;
  const price = course.price;

  return (
    <div className="reg-form__course-preview">
      <span className="reg-form__course-preview-label">{label}</span>
      <p className="reg-form__course-preview-title">{title}</p>
      {(duration || price != null) && (
        <p className="reg-form__course-preview-meta">
          {duration && <span>{duration}</span>}
          {duration && price != null && <span aria-hidden> · </span>}
          {price != null && <span>₹{Number(price).toLocaleString("en-IN")}</span>}
        </p>
      )}
    </div>
  );
}

function SuccessState({ title, message }) {
  return (
    <div className="reg-form__success" role="status">
      <div className="reg-form__success-icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h4 className="reg-form__success-title">{title}</h4>
      <p className="reg-form__success-text">{message}</p>
    </div>
  );
}

export default function StudentRegistrationForm({
  number,
  courses = [],
  defaultCourseSlug = "",
}) {
  const { lang } = useLanguage();
  const t = COPY[lang] || COPY.en;

  const defaultCourse =
    courses.find((c) => c.slug === defaultCourseSlug) || courses[0] || null;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Patna");
  const [courseId, setCourseId] = useState(defaultCourse ? courseKey(defaultCourse) : "");
  const [preferredBatch, setPreferredBatch] = useState("");
  const [education, setEducation] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [aadhaarLast4, setAadhaarLast4] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedCourse =
    courses.find((c) => courseKey(c) === courseId || c.slug === courseId) || null;
  const courseTitle = selectedCourse
    ? pickLocalized(selectedCourse, lang, "title", "title_hi")
    : "";

  const filledSteps = useMemo(() => {
    let n = 0;
    if (name.trim() && phone.trim() && address.trim()) n = 1;
    if (n >= 1 && courseId) n = 2;
    if (n >= 2 && (education || guardianName || aadhaarLast4 || referralSource || message)) n = 3;
    return n;
  }, [name, phone, address, courseId, education, guardianName, aadhaarLast4, referralSource, message]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.nameRequired);
      return;
    }
    if (!phone.trim()) {
      setError(t.phoneRequired);
      return;
    }
    if (!courseId && !courseTitle) {
      setError(t.courseRequired);
      return;
    }
    if (!address.trim()) {
      setError(t.addressRequired);
      return;
    }
    if (aadhaarLast4 && !/^\d{4}$/.test(aadhaarLast4)) {
      setError(t.aadhaarInvalid);
      return;
    }
    setError("");
    setSaving(true);

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      date_of_birth: dob || undefined,
      gender: gender || undefined,
      address: address.trim(),
      city: city.trim() || "Patna",
      course_id: UUID_RE.test(courseId) ? courseId : undefined,
      course_name: courseTitle || "General enquiry",
      course_slug: selectedCourse?.slug,
      preferred_batch: preferredBatch || undefined,
      education: education || undefined,
      guardian_name: guardianName.trim() || undefined,
      aadhaar_last4: aadhaarLast4 || undefined,
      referral_source: referralSource || undefined,
      message: message.trim() || undefined,
      locale: lang,
      source_page: typeof window !== "undefined" ? window.location.pathname : "/register",
      website: honeypot,
    };

    let saved = false;
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      saved = res.ok;
      if (!saved) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || t.saveError);
      }
    } catch {
      setError(t.saveError);
    }

    if (saved) {
      setSubmitted(true);
      trackLead("student_registration", {
        cta_label: "admission_form",
        source_page: window.location.pathname,
        course: courseTitle,
      });
      const href = waLink(
        number,
        studentRegistrationMessage({
          name: name.trim(),
          courseName: courseTitle,
          phone: phone.trim(),
          lang,
        })
      );
      trackWhatsAppClick(null, {
        cta_label: "admission_form",
        source_page: window.location.pathname,
      });
      window.open(href, "_blank");
    }
    setSaving(false);
  };

  return (
    <Glass3DCard
      layered
      className={cn(
        REVEAL,
        INTERACTIVE_CARD,
        "reg-form-card",
        "rounded-2xl sm:rounded-[2rem]",
        "relative overflow-hidden"
      )}
    >
      <div className="reg-form-card__glow reg-form-card__glow--tr" aria-hidden />
      <div className="reg-form-card__glow reg-form-card__glow--bl" aria-hidden />

      <div className="reg-form-card__inner">
        <header className="reg-form__header">
          <div className="reg-form__header-copy">
            <span className="reg-form__eyebrow">{lang === "hi" ? "चरण 2 / 7" : "Step 2 of 7"}</span>
            <h3 className="reg-form__title">{t.title}</h3>
            <p className="reg-form__subtitle">{t.subtitle}</p>
          </div>
          <span className="reg-form__badge">
            <span className="reg-form__badge-dot" aria-hidden />
            {t.savedBadge}
          </span>
        </header>

        {submitted ? (
          <SuccessState title={t.successTitle} message={t.success} />
        ) : (
          <>
            <FormProgress t={t} filled={filledSteps} />

            <form
              onSubmit={submit}
              className="reg-form"
              noValidate
              aria-describedby={error ? "registration-form-error" : undefined}
            >
              <div className="reg-form__honeypot" aria-hidden>
                <label htmlFor="reg-website">Website</label>
                <input
                  id="reg-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <SectionPanel
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                title={t.personal}
              >
                <div className="reg-form__grid">
                  <div className="reg-form__field reg-form__field--full">
                    <label htmlFor="reg-name" className="contact-field-label">
                      {t.name}<span className="reg-form__req">*</span>
                    </label>
                    <div className="contact-field-wrap">
                      <input
                        id="reg-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (error) setError("");
                        }}
                        className="contact-field-input reg-form__input"
                        placeholder={t.namePh}
                        autoComplete="name"
                        required
                      />
                    </div>
                  </div>

                  <div className="reg-form__field">
                    <label htmlFor="reg-phone" className="contact-field-label">
                      {t.phone}<span className="reg-form__req">*</span>
                    </label>
                    <div className="contact-field-wrap">
                      <input
                        id="reg-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (error) setError("");
                        }}
                        className="contact-field-input reg-form__input"
                        placeholder={t.phonePh}
                        autoComplete="tel"
                        required
                      />
                    </div>
                  </div>

                  <div className="reg-form__field">
                    <label htmlFor="reg-email" className="contact-field-label">{t.email}</label>
                    <div className="contact-field-wrap">
                      <input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="contact-field-input reg-form__input"
                        placeholder={t.emailPh}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="reg-form__field">
                    <label htmlFor="reg-dob" className="contact-field-label">{t.dob}</label>
                    <div className="contact-field-wrap">
                      <input
                        id="reg-dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="contact-field-input reg-form__input reg-form__input--plain"
                      />
                    </div>
                  </div>

                  <div className="reg-form__field">
                    <label htmlFor="reg-gender" className="contact-field-label">{t.gender}</label>
                    <div className="contact-field-wrap">
                      <select
                        id="reg-gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="contact-field-input reg-form__input reg-form__input--plain"
                      >
                        <option value="">{t.selectGender}</option>
                        {GENDER_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {lang === "hi" ? o.hi : o.en}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="reg-form__field reg-form__field--full">
                    <label htmlFor="reg-address" className="contact-field-label">
                      {t.address}<span className="reg-form__req">*</span>
                    </label>
                    <div className="contact-field-wrap">
                      <textarea
                        id="reg-address"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (error) setError("");
                        }}
                        rows={2}
                        className="contact-field-input reg-form__input reg-form__input--plain resize-none leading-relaxed min-h-[4.5rem]"
                        placeholder={t.addressPh}
                        required
                      />
                    </div>
                  </div>

                  <div className="reg-form__field">
                    <label htmlFor="reg-city" className="contact-field-label">{t.city}</label>
                    <div className="contact-field-wrap">
                      <input
                        id="reg-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="contact-field-input reg-form__input reg-form__input--plain"
                        placeholder={t.cityPh}
                      />
                    </div>
                  </div>
                </div>
              </SectionPanel>

              <SectionPanel
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
                  </svg>
                }
                title={t.courseSection}
              >
                <div className="reg-form__grid">
                  <div className="reg-form__field reg-form__field--full">
                    <label htmlFor="reg-course" className="contact-field-label">
                      {t.course}<span className="reg-form__req">*</span>
                    </label>
                    <div className="contact-field-wrap">
                      <select
                        id="reg-course"
                        value={courseId}
                        onChange={(e) => {
                          setCourseId(e.target.value);
                          if (error) setError("");
                        }}
                        className="contact-field-input reg-form__input reg-form__input--plain"
                        required
                      >
                        <option value="">{t.selectCourse}</option>
                        {courses.map((c) => (
                          <option key={courseKey(c)} value={courseKey(c)}>
                            {pickLocalized(c, lang, "title", "title_hi")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <CoursePreview course={selectedCourse} lang={lang} label={t.courseSelected} />
                  </div>

                  <div className="reg-form__field reg-form__field--full">
                    <span className="contact-field-label">{t.batch}</span>
                    <BatchChips
                      value={preferredBatch}
                      onChange={setPreferredBatch}
                      lang={lang}
                      t={t}
                    />
                  </div>
                </div>
              </SectionPanel>

              <SectionPanel
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                }
                title={t.background}
                optional={t.optional}
              >
                <div className="reg-form__grid">
                  <div className="reg-form__field">
                    <label htmlFor="reg-education" className="contact-field-label">{t.education}</label>
                    <div className="contact-field-wrap">
                      <select
                        id="reg-education"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="contact-field-input reg-form__input reg-form__input--plain"
                      >
                        <option value="">{t.selectEducation}</option>
                        {EDUCATION_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {lang === "hi" ? o.hi : o.en}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="reg-form__field">
                    <label htmlFor="reg-guardian" className="contact-field-label">{t.guardian}</label>
                    <div className="contact-field-wrap">
                      <input
                        id="reg-guardian"
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        className="contact-field-input reg-form__input reg-form__input--plain"
                        placeholder={t.guardianPh}
                      />
                    </div>
                  </div>

                  <div className="reg-form__field">
                    <label htmlFor="reg-aadhaar" className="contact-field-label">{t.aadhaar}</label>
                    <div className="contact-field-wrap">
                      <input
                        id="reg-aadhaar"
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={aadhaarLast4}
                        onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className="contact-field-input reg-form__input reg-form__input--plain"
                        placeholder="••••"
                      />
                    </div>
                  </div>

                  <div className="reg-form__field">
                    <label htmlFor="reg-referral" className="contact-field-label">{t.referral}</label>
                    <div className="contact-field-wrap">
                      <select
                        id="reg-referral"
                        value={referralSource}
                        onChange={(e) => setReferralSource(e.target.value)}
                        className="contact-field-input reg-form__input reg-form__input--plain"
                      >
                        <option value="">—</option>
                        {REFERRAL_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {lang === "hi" ? o.hi : o.en}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="reg-form__field reg-form__field--full">
                    <label htmlFor="reg-message" className="contact-field-label">{t.message}</label>
                    <div className="contact-field-wrap">
                      <textarea
                        id="reg-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="contact-field-input reg-form__input reg-form__input--plain resize-none leading-relaxed min-h-[5rem]"
                        placeholder={t.messagePh}
                      />
                    </div>
                  </div>
                </div>
              </SectionPanel>

              {error && (
                <p id="registration-form-error" className="reg-form__error" role="alert">
                  {error}
                </p>
              )}

              <div className="reg-form__submit-wrap">
                <button type="submit" disabled={saving} className={cn(BTN_PRIMARY, "reg-form__submit")}>
                  {saving ? (
                    <span className="reg-form__submit-loading" aria-hidden />
                  ) : (
                    <>
                      {t.submit}
                      <span aria-hidden>→</span>
                    </>
                  )}
                </button>
                <p className="reg-form__footnote">{t.footnote}</p>
              </div>
            </form>
          </>
        )}
      </div>
    </Glass3DCard>
  );
}
