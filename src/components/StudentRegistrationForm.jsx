"use client";

import { useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized } from "@/lib/i18n";
import { trackLead } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { LOGO_SRC } from "@/lib/brand";
import { formatPhoneDisplay } from "@/lib/site-config";

const MAX_PHOTO_INPUT_BYTES = 8 * 1024 * 1024;

/** Resize / compress to a passport-ish JPEG data URL for upload + PDF. */
function compressPassportPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file || !String(file.type || "").startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    if (typeof file.size === "number" && file.size > MAX_PHOTO_INPUT_BYTES) {
      reject(new Error("Photo must be 8 MB or smaller."));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const maxW = 400;
        const maxH = 500;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        const scale = Math.min(maxW / w, maxH / h, 1);
        w = Math.max(1, Math.round(w * scale));
        h = Math.max(1, Math.round(h * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process photo."));
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Could not process photo."));
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read that image."));
    };
    img.src = objectUrl;
  });
}

const GST_NUMBER = "10CROPS2823L2ZI";
const WEBSITE = "www.shreyacreation.com";
const HSN_CODE = "999293";

const BATCH_OPTIONS = [
  { value: "morning", en: "Morning 9–12", hi: "सुबह 9–12" },
  { value: "afternoon", en: "Afternoon 12–3", hi: "दोपहर 12–3" },
  { value: "evening", en: "Evening 3–6", hi: "शाम 3–6" },
  { value: "any", en: "Flexible", hi: "लचीला" },
];

const DOC_OPTIONS = [
  { id: "id_proof", en: "ID Proof", hi: "आईडी प्रूफ" },
  { id: "photo", en: "Passport Size Photo", hi: "पासपोर्ट साइज़ फोटो" },
  { id: "address_proof", en: "Address Proof", hi: "पता प्रमाण" },
  { id: "edu_proof", en: "Educational Proof", hi: "शैक्षणिक प्रमाण" },
];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function courseKey(course) {
  return course.id || course.slug;
}

function toNum(v) {
  const n = Number(String(v || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function DocSection({ title, children, className }) {
  return (
    <section className={cn("adm-doc__section", className)}>
      {title ? <div className="adm-doc__section-bar">{title}</div> : null}
      <div className="adm-doc__section-body">{children}</div>
    </section>
  );
}

function LineField({ id, label, required, children, className }) {
  return (
    <div className={cn("adm-doc__line", className)}>
      <label htmlFor={id} className="adm-doc__line-label">
        {label}
        {required ? <span className="adm-doc__req">*</span> : null}
        <span aria-hidden> :</span>
      </label>
      <div className="adm-doc__line-input">{children}</div>
    </div>
  );
}

function CheckOption({ checked, onChange, label, name }) {
  return (
    <label className="adm-doc__check-opt">
      <button
        type="button"
        className={cn("adm-doc__check", checked && "adm-doc__check--on")}
        aria-pressed={checked}
        aria-label={label}
        name={name}
        onClick={onChange}
      />
      <span>{label}</span>
    </label>
  );
}

export default function StudentRegistrationForm({
  number: _whatsappNumber,
  courses = [],
  defaultCourseSlug = "",
  site = null,
}) {
  const { lang } = useLanguage();

  const defaultCourse =
    courses.find((c) => c.slug === defaultCourseSlug) || courses[0] || null;

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [name, setName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Patna");
  const [district, setDistrict] = useState("Patna");
  const [stateName, setStateName] = useState("Bihar");
  const [pin, setPin] = useState("");

  const [courseId, setCourseId] = useState(defaultCourse ? courseKey(defaultCourse) : "");
  const [durationMonths, setDurationMonths] = useState("");
  const [preferredBatch, setPreferredBatch] = useState("");
  const [courseMode, setCourseMode] = useState("offline");
  const [admissionDate, setAdmissionDate] = useState(todayIso);
  const [feeCourse, setFeeCourse] = useState("");
  const [feeDiscount, setFeeDiscount] = useState("");
  const [feeTotal, setFeeTotal] = useState("");

  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [sewingMachine, setSewingMachine] = useState("");
  const [previousCourse, setPreviousCourse] = useState("");

  const [docs, setDocs] = useState({
    id_proof: false,
    photo: false,
    address_proof: false,
    edu_proof: false,
  });
  const [docOther, setDocOther] = useState("");
  const [passportPhoto, setPassportPhoto] = useState("");
  const photoInputRef = useRef(null);

  const [agreed, setAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedCourse =
    courses.find((c) => courseKey(c) === courseId || c.slug === courseId) || null;
  const courseTitle = selectedCourse
    ? pickLocalized(selectedCourse, lang, "title", "title_hi")
    : "";

  const brand = site?.brandName || site?.brand || "Shreya Creation";
  const phone1 = formatPhoneDisplay(site?.phonePrimary || site?.phone1 || "+919031105666");
  const phone2Display = formatPhoneDisplay(site?.phoneSecondary || site?.phone2 || "+917903155125");
  const phone2Short = phone2Display.replace("+91 ", "");
  const addressLine =
    site?.addressLine || site?.address || "East Boring Canal Road, Patna-800001 (Bihar)";

  const recalcFinal = (next = {}) => {
    const course = toNum(next.feeCourse ?? feeCourse) || 0;
    const discount = toNum(next.feeDiscount ?? feeDiscount) || 0;
    const final = Math.max(0, course - discount);
    setFeeTotal(course > 0 || discount > 0 ? String(final) : "");
  };

  const onCourseChange = (value) => {
    setCourseId(value);
    const c = courses.find((x) => courseKey(x) === value);
    if (c?.duration) {
      const match = String(c.duration).match(/(\d+)/);
      if (match) setDurationMonths(match[1]);
    }
    if (c?.price != null && c.price !== "") {
      const p = String(c.price);
      setFeeCourse(p);
      recalcFinal({ feeCourse: p });
    }
    if (error) setError("");
  };

  const toggleDoc = (id) => {
    setDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onPassportPhotoPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await compressPassportPhoto(file);
      setPassportPhoto(dataUrl);
      setDocs((prev) => ({ ...prev, photo: true }));
      if (error) setError("");
    } catch (err) {
      setError(
        err?.message ||
          (lang === "hi" ? "फोटो चुनने में समस्या हुई।" : "Could not use that photo.")
      );
    }
  };

  const clearPassportPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPassportPhoto("");
    setDocs((prev) => ({ ...prev, photo: false }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === "hi" ? "कृपया छात्र का नाम लिखें।" : "Please enter student name.");
      return;
    }
    if (!phone.trim()) {
      setError(lang === "hi" ? "कृपया मोबाइल नंबर लिखें।" : "Please enter mobile number.");
      return;
    }
    if (!courseId && !courseTitle) {
      setError(lang === "hi" ? "कृपया कोर्स चुनें।" : "Please select a course.");
      return;
    }
    if (!address.trim()) {
      setError(lang === "hi" ? "कृपया पता लिखें।" : "Please enter address.");
      return;
    }
    if (!agreed) {
      setError(
        lang === "hi"
          ? "कृपया घोषणा स्वीकार करें।"
          : "Please confirm the declaration to continue."
      );
      return;
    }
    setError("");
    setSaving(true);

    const selectedDocs = DOC_OPTIONS.filter((d) => docs[d.id]).map((d) => d.en);
    if (docOther.trim()) selectedDocs.push(`Other: ${docOther.trim()}`);

    const payload = {
      name: name.trim().toUpperCase(),
      phone: phone.trim(),
      email: email.trim(),
      date_of_birth: dob || undefined,
      gender: gender || undefined,
      address: address.trim(),
      city: city.trim() || "Patna",
      whatsapp_phone: whatsapp.trim() || phone.trim() || undefined,
      district: district.trim() || undefined,
      state: stateName.trim() || undefined,
      pin_code: pin.trim() || undefined,
      course_id: UUID_RE.test(courseId) ? courseId : undefined,
      course_name: courseTitle || "General enquiry",
      course_slug: selectedCourse?.slug,
      preferred_batch: preferredBatch || undefined,
      course_mode: courseMode || undefined,
      education: education.trim() || undefined,
      guardian_name: guardianName.trim() || undefined,
      experience: experience.trim() || undefined,
      sewing_machine: sewingMachine || undefined,
      previous_training: previousCourse.trim() || undefined,
      documents_submitted: selectedDocs.length ? selectedDocs.join(", ") : undefined,
      passport_photo: passportPhoto || undefined,
      form_date: admissionDate || undefined,
      duration_months: durationMonths.trim() || undefined,
      fee_course: toNum(feeCourse),
      fee_discount: toNum(feeDiscount),
      fee_total: toNum(feeTotal),
      message: "Declaration accepted: yes",
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
        setError(data.error || (lang === "hi" ? "सेव नहीं हो सका।" : "Could not save online."));
      }
    } catch {
      setError(lang === "hi" ? "सेव नहीं हो सका।" : "Could not save online.");
    }

    if (saved) {
      setSubmitted(true);
      trackLead("student_registration", {
        cta_label: "admission_form",
        source_page: window.location.pathname,
        course: courseTitle,
      });
    }
    setSaving(false);
  };

  return (
    <div className="adm-doc">
      <header className="adm-doc__letterhead">
        <div className="adm-doc__brand-row adm-doc__brand-row--enroll">
          <div className="adm-doc__logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="" className="adm-doc__logo" width={72} height={72} />
          </div>

          <div className="adm-doc__brand-center">
            <h2 className="adm-doc__brand-name">{brand.toUpperCase()}</h2>
            <p className="adm-doc__brand-sub">BOUTIQUE &amp; INSTITUTE</p>
            <p className="adm-doc__services">FASHION DESIGNING • STITCHING • BOUTIQUE TRAINING</p>
            <p className="adm-doc__tagline">Learn • Create • Earn</p>
          </div>

          <div className="adm-doc__photo-slot">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              className="sr-only"
              tabIndex={-1}
              onChange={onPassportPhotoPick}
            />
            <button
              type="button"
              className={cn("adm-doc__photo-box", passportPhoto && "adm-doc__photo-box--filled")}
              onClick={() => photoInputRef.current?.click()}
              aria-label={
                lang === "hi" ? "पासपोर्ट साइज़ फोटो चुनें" : "Choose passport size photo"
              }
            >
              {passportPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={passportPhoto} alt="" className="adm-doc__photo-preview" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="3.25" />
                    <path d="M5.5 19.5c1.6-3.2 4-4.8 6.5-4.8s4.9 1.6 6.5 4.8" />
                  </svg>
                  <span>{lang === "hi" ? "फोटो चुनें" : "Passport Size Photo"}</span>
                </>
              )}
            </button>
            {passportPhoto ? (
              <button type="button" className="adm-doc__photo-clear" onClick={clearPassportPhoto}>
                {lang === "hi" ? "हटाएँ" : "Remove"}
              </button>
            ) : null}
          </div>
        </div>

        <div className="adm-doc__title-row adm-doc__title-row--enroll">
          <div className="adm-doc__title-pill">
            <span>ADMISSION / ENROLLMENT FORM</span>
          </div>
        </div>
      </header>

      {submitted ? (
        <div className="adm-doc__success" role="status">
          <h4 className="adm-doc__success-title">
            {lang === "hi" ? "आवेदन सेव हो गया!" : "Application saved!"}
          </h4>
          <p className="adm-doc__success-text">
            {lang === "hi"
              ? "आपकी जानकारी ऑनलाइन सेव है। टीम जल्द संपर्क करेगी — आवेदन admin panel में दिखेगा।"
              : "Your details are saved online. Our team will contact you soon — the application will appear in the admin panel."}
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="adm-doc__form" noValidate>
          <div className="adm-doc__honeypot" aria-hidden>
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

          <div className="adm-doc__watermark" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="" />
          </div>

          <DocSection title="STUDENT DETAILS">
            <LineField id="reg-name" label="Student Name (In Capital)" required>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value.toUpperCase());
                  if (error) setError("");
                }}
                autoComplete="name"
                required
              />
            </LineField>
            <LineField id="reg-guardian" label="Father/Husband / Guardian Name">
              <input
                id="reg-guardian"
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
              />
            </LineField>

            <div className="adm-doc__line-row">
              <LineField id="reg-dob" label="Date of Birth">
                <input id="reg-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </LineField>
              <div className="adm-doc__line">
                <span className="adm-doc__line-label">Gender :</span>
                <div className="adm-doc__checks" role="group" aria-label="Gender">
                  {[
                    { id: "female", en: "Female", hi: "महिला" },
                    { id: "male", en: "Male", hi: "पुरुष" },
                    { id: "other", en: "Other", hi: "अन्य" },
                  ].map((g) => (
                    <CheckOption
                      key={g.id}
                      name={`gender-${g.id}`}
                      label={lang === "hi" ? g.hi : g.en}
                      checked={gender === g.id}
                      onChange={() => setGender(gender === g.id ? "" : g.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="adm-doc__line-row">
              <LineField id="reg-phone" label="Mobile Number" required>
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="tel"
                  required
                />
              </LineField>
              <LineField id="reg-wa" label="WhatsApp Number">
                <input
                  id="reg-wa"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Same as mobile if applicable"
                />
              </LineField>
            </div>

            <LineField id="reg-email" label="Email ID">
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </LineField>

            <LineField id="reg-address" label="Full Address" required className="adm-doc__line--tall">
              <textarea
                id="reg-address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (error) setError("");
                }}
                rows={2}
                required
              />
            </LineField>

            <div className="adm-doc__addr-grid">
              <LineField id="reg-city" label="City">
                <input id="reg-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
              </LineField>
              <LineField id="reg-district" label="District">
                <input
                  id="reg-district"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </LineField>
              <LineField id="reg-state" label="State">
                <input
                  id="reg-state"
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                />
              </LineField>
              <LineField id="reg-pin" label="PIN Code">
                <input
                  id="reg-pin"
                  type="text"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </LineField>
            </div>
          </DocSection>

          <DocSection title="COURSE DETAILS" className="adm-doc__section--course">
            <div className="adm-doc__line-row">
              <LineField id="reg-course" label="Course Name" required>
                <select
                  id="reg-course"
                  value={courseId}
                  onChange={(e) => onCourseChange(e.target.value)}
                  required
                >
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={courseKey(c)} value={courseKey(c)}>
                      {pickLocalized(c, lang, "title", "title_hi")}
                    </option>
                  ))}
                </select>
              </LineField>
              <LineField id="reg-duration" label="Course Duration">
                <input
                  id="reg-duration"
                  type="text"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  placeholder="e.g. 3 Months"
                />
              </LineField>
            </div>

            <div className="adm-doc__line-row">
              <LineField id="reg-batch" label="Batch/Timing">
                <select
                  id="reg-batch"
                  value={preferredBatch}
                  onChange={(e) => setPreferredBatch(e.target.value)}
                >
                  <option value="">Select</option>
                  {BATCH_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {lang === "hi" ? o.hi : o.en}
                    </option>
                  ))}
                </select>
              </LineField>
              <div className="adm-doc__line">
                <span className="adm-doc__line-label">Mode :</span>
                <div className="adm-doc__checks" role="group" aria-label="Mode">
                  {[
                    { id: "offline", en: "Offline", hi: "ऑफ़लाइन" },
                    { id: "online", en: "Online", hi: "ऑनलाइन" },
                  ].map((m) => (
                    <CheckOption
                      key={m.id}
                      name={`mode-${m.id}`}
                      label={lang === "hi" ? m.hi : m.en}
                      checked={courseMode === m.id}
                      onChange={() => setCourseMode(m.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <LineField id="reg-admission-date" label="Admission Date">
              <input
                id="reg-admission-date"
                type="date"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
              />
            </LineField>

            <div className="adm-doc__fee-boxes">
              <label className="adm-doc__fee-box">
                <span>Course Fee (₹)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={feeCourse}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d.]/g, "");
                    setFeeCourse(v);
                    recalcFinal({ feeCourse: v });
                  }}
                />
              </label>
              <label className="adm-doc__fee-box">
                <span>Discount / Scholarship (₹)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={feeDiscount}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d.]/g, "");
                    setFeeDiscount(v);
                    recalcFinal({ feeDiscount: v });
                  }}
                />
              </label>
              <label className="adm-doc__fee-box adm-doc__fee-box--final">
                <span>Final Payable (₹)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={feeTotal}
                  onChange={(e) => setFeeTotal(e.target.value.replace(/[^\d.]/g, ""))}
                />
              </label>
            </div>
          </DocSection>

          <DocSection title="EDUCATIONAL / SKILL BACKGROUND">
            <LineField id="reg-edu" label="Highest Qualification">
              <input
                id="reg-edu"
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. 12th / Graduate"
              />
            </LineField>
            <LineField id="reg-exp" label="Previous Stitching / Fashion Designing Experience">
              <input
                id="reg-exp"
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </LineField>
            <div className="adm-doc__line">
              <span className="adm-doc__line-label">Sewing Machine Available :</span>
              <div className="adm-doc__checks" role="group" aria-label="Sewing machine">
                {[
                  { id: "yes", en: "Yes", hi: "हाँ" },
                  { id: "no", en: "No", hi: "नहीं" },
                ].map((o) => (
                  <CheckOption
                    key={o.id}
                    name={`sewing-${o.id}`}
                    label={lang === "hi" ? o.hi : o.en}
                    checked={sewingMachine === o.id}
                    onChange={() => setSewingMachine(sewingMachine === o.id ? "" : o.id)}
                  />
                ))}
              </div>
            </div>
            <LineField id="reg-prev" label="Previous Course / Training if any">
              <input
                id="reg-prev"
                type="text"
                value={previousCourse}
                onChange={(e) => setPreviousCourse(e.target.value)}
              />
            </LineField>
          </DocSection>

          <DocSection title="DOCUMENT SUBMITTED">
            <div className="adm-doc__docs">
              {DOC_OPTIONS.map((d) => (
                <CheckOption
                  key={d.id}
                  name={`doc-${d.id}`}
                  label={lang === "hi" ? d.hi : d.en}
                  checked={docs[d.id]}
                  onChange={() => toggleDoc(d.id)}
                />
              ))}
              <div className="adm-doc__doc-other">
                <CheckOption
                  name="doc-other"
                  label={lang === "hi" ? "अन्य :" : "Other :"}
                  checked={Boolean(docOther.trim())}
                  onChange={() => {
                    if (docOther.trim()) setDocOther("");
                  }}
                />
                <div className="adm-doc__line-input adm-doc__line-input--inline">
                  <input
                    type="text"
                    value={docOther}
                    onChange={(e) => setDocOther(e.target.value)}
                    aria-label="Other document"
                  />
                </div>
              </div>
            </div>
          </DocSection>

          <DocSection title="Declaration">
            <p className="adm-doc__declaration">
              I hereby declare that the above information is true and correct to the best of my
              knowledge. I have read and understood all the rules &amp; regulations of Shreya Creation
              Boutique &amp; Institute and I agree to abide by them. I am aware that the course fee
              once paid is non-refundable.
            </p>
            <label className="adm-doc__agree">
              <button
                type="button"
                className={cn("adm-doc__check", agreed && "adm-doc__check--on")}
                aria-pressed={agreed}
                onClick={() => {
                  setAgreed((v) => !v);
                  if (error) setError("");
                }}
              />
              <span>
                {lang === "hi"
                  ? "मैं घोषणा स्वीकार करती/करता हूँ"
                  : "I agree to the declaration above"}
              </span>
            </label>

            <div className="adm-doc__signs">
              {[
                "Student Signature",
                "Parent / Guardian Signature",
                "Counsellor Signature",
                "Institute Authorized Signature",
              ].map((label) => (
                <div key={label} className="adm-doc__sign">
                  <span className="adm-doc__sign-line" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </DocSection>

          {error ? (
            <p className="adm-doc__error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="adm-doc__submit-wrap">
            <button type="submit" disabled={saving} className="adm-doc__submit">
              {saving ? (
                <span className="adm-doc__submit-loading" aria-hidden />
              ) : lang === "hi" ? (
                "एडमिशन फॉर्म जमा करें"
              ) : (
                "Submit admission form"
              )}
            </button>
          </div>
        </form>
      )}

      <footer className="adm-doc__footer adm-doc__footer--enroll">
        <div className="adm-doc__trust-badge" aria-hidden>
          <span className="adm-doc__trust-years">17</span>
          <span className="adm-doc__trust-text">सालों का भरोसा</span>
        </div>

        <div className="adm-doc__footer-contact">
          <p className="adm-doc__footer-heading">CONTACT US</p>
          <span className="adm-doc__footer-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.25a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z" />
            </svg>
            {phone1} / {phone2Short}
          </span>
          <span className="adm-doc__footer-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {addressLine}
          </span>
          <span className="adm-doc__footer-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {WEBSITE}
          </span>
        </div>

        <div className="adm-doc__stitch-badge" aria-hidden>
          <span className="adm-doc__stitch-clock">24h</span>
          <span className="adm-doc__stitch-text">Get your clothes stitched within</span>
        </div>

        <div className="adm-doc__gst-box">
          <p className="adm-doc__footer-heading">GST DETAILS</p>
          <p>
            GSTIN — <strong>{GST_NUMBER}</strong>
          </p>
          <p>Trade Name — Shreya Creation Boutique &amp; Institute</p>
          <p>Service — Training / Coaching</p>
          <p>
            HSN Code — <strong>{HSN_CODE}</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}
