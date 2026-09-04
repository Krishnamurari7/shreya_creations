"use client";

import { useMemo, useState } from "react";
import { waLink, studentRegistrationMessage } from "@/lib/whatsapp";
import { useLanguage } from "@/components/LanguageProvider";
import { pickLocalized } from "@/lib/i18n";
import { trackLead, trackWhatsAppClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { LOGO_SRC } from "@/lib/brand";
import { formatPhoneDisplay } from "@/lib/site-config";

const GST_NUMBER = "10CROPS2823L2ZI";
const STATE_CODE = "10-Bihar";
const WEBSITE = "www.shreyacreation.com";

const BANK = {
  accountName: "SHREYAS CREATION",
  bankName: "Canara Bank",
  accountNo: "1967201001031",
  ifsc: "CNRB0001967",
  branch: "S.K Puri",
};

const FEE_LABELS = [
  { key: "feeCourse", label: "Course Fee" },
  { key: "feeRegistration", label: "Registration Fee" },
  { key: "feeMaterial", label: "Material / Kit Charge" },
  { key: "feeGstAmount", label: "GST amount" },
];

const TERMS = [
  "Fees once paid are non-refundable under any circumstances.",
  "Course duration and batch timing will be as mentioned above.",
  "Minimum 75% attendance is required for certificate eligibility.",
  "Installment payments must be cleared on or before due dates.",
  "Certificate will be issued only after full fee payment & course completion.",
  "Institute reserves the right to reschedule batches if required.",
];

const PAYMENT_MODES = [
  { id: "cash", label: "Cash", icon: "cash" },
  { id: "upi", label: "UPI", icon: "upi" },
  { id: "card", label: "Card", icon: "card" },
  { id: "bank", label: "Bank Transfer", icon: "bank" },
];

const BATCH_OPTIONS = [
  { value: "morning", en: "Morning 9–12", hi: "सुबह 9–12" },
  { value: "afternoon", en: "Afternoon 12–3", hi: "दोपहर 12–3" },
  { value: "evening", en: "Evening 3–6", hi: "शाम 3–6" },
  { value: "any", en: "Flexible", hi: "लचीला" },
];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function courseKey(course) {
  return course.id || course.slug;
}

function handleFromUrl(url, fallback = "") {
  if (!url) return fallback;
  try {
    const path = new URL(url).pathname.replace(/\/+$/, "");
    const last = path.split("/").filter(Boolean).pop() || "";
    return last.replace(/^@/, "") || fallback;
  } catch {
    return fallback;
  }
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

function LineField({ id, label, required, suffix, children, className }) {
  return (
    <div className={cn("adm-doc__line", className)}>
      <label htmlFor={id} className="adm-doc__line-label">
        {label}
        {required ? <span className="adm-doc__req">*</span> : null}
        <span aria-hidden> :</span>
      </label>
      <div className="adm-doc__line-input">
        {children}
        {suffix ? <span className="adm-doc__line-suffix">{suffix}</span> : null}
      </div>
    </div>
  );
}

function PayIcon({ type }) {
  if (type === "cash") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }
  if (type === "upi") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5" />
      </svg>
    );
  }
  if (type === "card") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 10h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8z" />
      <path d="M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

export default function StudentRegistrationForm({
  number,
  courses = [],
  defaultCourseSlug = "",
  site = null,
}) {
  const { lang } = useLanguage();

  const defaultCourse =
    courses.find((c) => c.slug === defaultCourseSlug) || courses[0] || null;

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [invoiceNo, setInvoiceNo] = useState("");
  const [formDate, setFormDate] = useState(todayIso);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [courseId, setCourseId] = useState(defaultCourse ? courseKey(defaultCourse) : "");
  const [courseCode, setCourseCode] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [preferredBatch, setPreferredBatch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [feeCourse, setFeeCourse] = useState("");
  const [feeRegistration, setFeeRegistration] = useState("");
  const [feeMaterial, setFeeMaterial] = useState("");
  const [feeGstPercent, setFeeGstPercent] = useState("");
  const [feeGstAmount, setFeeGstAmount] = useState("");
  const [feeTotal, setFeeTotal] = useState("");
  const [inst1Due, setInst1Due] = useState("");
  const [inst1Amount, setInst1Amount] = useState("");
  const [inst1Paid, setInst1Paid] = useState(false);
  const [inst2Due, setInst2Due] = useState("");
  const [inst2Amount, setInst2Amount] = useState("");
  const [inst2Paid, setInst2Paid] = useState(false);
  const [inst3Due, setInst3Due] = useState("");
  const [inst3Amount, setInst3Amount] = useState("");
  const [inst3Paid, setInst3Paid] = useState(false);
  const [planTotal, setPlanTotal] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [paymentReceivedDate, setPaymentReceivedDate] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [signatureNote, setSignatureNote] = useState("");
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
  const fb = handleFromUrl(site?.socials?.facebook, "shreyascreation");
  const ig = handleFromUrl(site?.socials?.instagram, "shreya.creationss");
  const yt = handleFromUrl(site?.socials?.youtube, "ShreyaCreations111");

  const feeSetters = {
    feeCourse: setFeeCourse,
    feeRegistration: setFeeRegistration,
    feeMaterial: setFeeMaterial,
    feeGstAmount: setFeeGstAmount,
  };
  const feeValues = {
    feeCourse,
    feeRegistration,
    feeMaterial,
    feeGstAmount,
  };

  const recalcTotal = (next = {}) => {
    const c = toNum(next.feeCourse ?? feeCourse) || 0;
    const r = toNum(next.feeRegistration ?? feeRegistration) || 0;
    const m = toNum(next.feeMaterial ?? feeMaterial) || 0;
    const g = toNum(next.feeGstAmount ?? feeGstAmount) || 0;
    const sum = c + r + m + g;
    setFeeTotal(sum > 0 ? String(sum) : "");
  };

  const onCourseChange = (value) => {
    setCourseId(value);
    const c = courses.find((x) => courseKey(x) === value);
    if (c?.slug) setCourseCode(String(c.slug).slice(0, 16).toUpperCase());
    if (c?.duration) {
      const match = String(c.duration).match(/(\d+)/);
      if (match) setDurationMonths(match[1]);
    }
    if (c?.price != null && c.price !== "") {
      const p = String(c.price);
      setFeeCourse(p);
      recalcTotal({ feeCourse: p });
    }
    if (error) setError("");
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
    setError("");
    setSaving(true);

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: "Patna",
      course_id: UUID_RE.test(courseId) ? courseId : undefined,
      course_name: courseTitle || "General enquiry",
      course_slug: selectedCourse?.slug,
      preferred_batch: preferredBatch || undefined,
      guardian_name: guardianName.trim() || undefined,
      invoice_no: invoiceNo.trim() || undefined,
      form_date: formDate || undefined,
      course_code: courseCode.trim() || undefined,
      duration_months: durationMonths.trim() || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      fee_course: toNum(feeCourse),
      fee_registration: toNum(feeRegistration),
      fee_material: toNum(feeMaterial),
      fee_gst_percent: toNum(feeGstPercent),
      fee_gst_amount: toNum(feeGstAmount),
      fee_total: toNum(feeTotal),
      installment_1_due: inst1Due || undefined,
      installment_1_amount: toNum(inst1Amount),
      installment_1_paid: inst1Paid,
      installment_2_due: inst2Due || undefined,
      installment_2_amount: toNum(inst2Amount),
      installment_2_paid: inst2Paid,
      installment_3_due: inst3Due || undefined,
      installment_3_amount: toNum(inst3Amount),
      installment_3_paid: inst3Paid,
      payment_mode: paymentMode || undefined,
      amount_received: toNum(amountReceived),
      payment_received_date: paymentReceivedDate || undefined,
      received_by: receivedBy.trim() || undefined,
      message: [
        signatureNote.trim() ? `Signature note: ${signatureNote.trim()}` : null,
        planTotal ? `Payment plan total: ₹${planTotal}` : null,
      ]
        .filter(Boolean)
        .join("\n") || undefined,
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
    <div className="adm-doc">
      <header className="adm-doc__letterhead">
        <div className="adm-doc__brand-row">
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

          <div className="adm-doc__socials-wrap">
            <p className="adm-doc__socials-label">Follow us on -</p>
            <ul className="adm-doc__socials" aria-label="Social">
              <li>
                <span className="adm-doc__social-icon adm-doc__social-icon--fb" aria-hidden>
                  f
                </span>
                <span>/{fb}</span>
              </li>
              <li>
                <span className="adm-doc__social-icon adm-doc__social-icon--ig" aria-hidden>
                  ◇
                </span>
                <span>/{ig}</span>
              </li>
              <li>
                <span className="adm-doc__social-icon adm-doc__social-icon--yt" aria-hidden>
                  ▶
                </span>
                <span>@{yt}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="adm-doc__title-row">
          <div className="adm-doc__title-pill">
            <span>TAX INVOICE</span>
          </div>
          <div className="adm-doc__gst">
            <span>
              GST Number : <strong>{GST_NUMBER}</strong>
            </span>
            <span>
              State Code : <strong>{STATE_CODE}</strong>
            </span>
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
              ? "आपकी जानकारी ऑनलाइन सेव है और admin panel में दिखेगी। WhatsApp खुलना चाहिए।"
              : "Your details are saved online and will appear in the admin panel. WhatsApp should open."}
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

          <div className="adm-doc__grid adm-doc__grid--top">
            <div className="adm-doc__col">
              <DocSection title="BILL DETAILS">
                <LineField id="reg-invoice" label="Invoice No.">
                  <input
                    id="reg-invoice"
                    type="text"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    placeholder="e.g. SC-INV-001"
                  />
                </LineField>
                <LineField id="reg-date" label="Date">
                  <input
                    id="reg-date"
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </LineField>
              </DocSection>

              <DocSection title="STUDENT DETAILS">
                <LineField id="reg-name" label="Student Name" required>
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    }}
                    autoComplete="name"
                    required
                  />
                </LineField>
                <LineField id="reg-guardian" label="Father / Guardian Name">
                  <input
                    id="reg-guardian"
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                  />
                </LineField>
                <LineField id="reg-phone" label="Mobile No" required>
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
                <LineField id="reg-email" label="Email">
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </LineField>
                <LineField id="reg-address" label="Address" required className="adm-doc__line--tall">
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
              </DocSection>
            </div>

            <DocSection title="COURSE DETAILS" className="adm-doc__section--course">
              <LineField id="reg-course" label="Course Name" required>
                <select id="reg-course" value={courseId} onChange={(e) => onCourseChange(e.target.value)} required>
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={courseKey(c)} value={courseKey(c)}>
                      {pickLocalized(c, lang, "title", "title_hi")}
                    </option>
                  ))}
                </select>
              </LineField>
              <LineField id="reg-code" label="Course Code">
                <input
                  id="reg-code"
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              </LineField>
              <LineField id="reg-duration" label="Duration" suffix="Months">
                <input
                  id="reg-duration"
                  type="text"
                  inputMode="numeric"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value.replace(/\D/g, "").slice(0, 2))}
                />
              </LineField>
              <LineField id="reg-batch" label="Batch / Timing">
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
              <LineField id="reg-start" label="Start Date">
                <input id="reg-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </LineField>
              <LineField id="reg-end" label="End Date">
                <input id="reg-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </LineField>
            </DocSection>
          </div>

          <div className="adm-doc__grid adm-doc__grid--mid">
            <DocSection title="FEE BREAKUP">
              <table className="adm-doc__table">
                <thead>
                  <tr>
                    <th className="adm-doc__th-sno">S. No.</th>
                    <th>Particulars</th>
                    <th className="adm-doc__th-amt">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {FEE_LABELS.map((row, i) => (
                    <tr key={row.key}>
                      <td>{i + 1}</td>
                      <td>
                        {row.key === "feeGstAmount" ? (
                          <span className="adm-doc__gst-row">
                            GST @{" "}
                            <input
                              type="text"
                              inputMode="decimal"
                              className="adm-doc__inline-input"
                              value={feeGstPercent}
                              onChange={(e) => setFeeGstPercent(e.target.value.replace(/[^\d.]/g, ""))}
                              aria-label="GST percent"
                              placeholder="%"
                            />{" "}
                            %
                          </span>
                        ) : (
                          row.label
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          inputMode="decimal"
                          className="adm-doc__cell-input"
                          value={feeValues[row.key]}
                          onChange={(e) => {
                            const v = e.target.value.replace(/[^\d.]/g, "");
                            feeSetters[row.key](v);
                            recalcTotal({ [row.key]: v });
                          }}
                          aria-label={row.label}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="adm-doc__total-bar">
                <span>TOTAL AMOUNT</span>
                <span className="adm-doc__total-amt">
                  ₹{" "}
                  <input
                    type="text"
                    inputMode="decimal"
                    className="adm-doc__cell-input adm-doc__cell-input--on-orange"
                    value={feeTotal}
                    onChange={(e) => setFeeTotal(e.target.value.replace(/[^\d.]/g, ""))}
                    aria-label="Total amount"
                  />
                </span>
              </div>
            </DocSection>

            <DocSection title="PAYMENT PLAN">
              <table className="adm-doc__table adm-doc__table--plan">
                <thead>
                  <tr>
                    <th>Installment No</th>
                    <th>Due Date</th>
                    <th>Amount (₹)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1st Installment</td>
                    <td>
                      <input
                        type="date"
                        className="adm-doc__cell-input"
                        value={inst1Due}
                        onChange={(e) => setInst1Due(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        inputMode="decimal"
                        className="adm-doc__cell-input"
                        value={inst1Amount}
                        onChange={(e) => setInst1Amount(e.target.value.replace(/[^\d.]/g, ""))}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={cn("adm-doc__check", inst1Paid && "adm-doc__check--on")}
                        aria-pressed={inst1Paid}
                        aria-label="1st installment paid"
                        onClick={() => setInst1Paid((v) => !v)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>2nd Installment</td>
                    <td>
                      <input
                        type="date"
                        className="adm-doc__cell-input"
                        value={inst2Due}
                        onChange={(e) => setInst2Due(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        inputMode="decimal"
                        className="adm-doc__cell-input"
                        value={inst2Amount}
                        onChange={(e) => setInst2Amount(e.target.value.replace(/[^\d.]/g, ""))}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={cn("adm-doc__check", inst2Paid && "adm-doc__check--on")}
                        aria-pressed={inst2Paid}
                        aria-label="2nd installment paid"
                        onClick={() => setInst2Paid((v) => !v)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        type="text"
                        className="adm-doc__cell-input"
                        value={inst3Due ? "3rd Installment" : ""}
                        placeholder="3rd / Other"
                        readOnly
                        tabIndex={-1}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="adm-doc__cell-input"
                        value={inst3Due}
                        onChange={(e) => setInst3Due(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        inputMode="decimal"
                        className="adm-doc__cell-input"
                        value={inst3Amount}
                        onChange={(e) => setInst3Amount(e.target.value.replace(/[^\d.]/g, ""))}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={cn("adm-doc__check", inst3Paid && "adm-doc__check--on")}
                        aria-pressed={inst3Paid}
                        aria-label="3rd installment paid"
                        onClick={() => setInst3Paid((v) => !v)}
                      />
                    </td>
                  </tr>
                  <tr className="adm-doc__tr-total">
                    <td colSpan={2}>Total</td>
                    <td>
                      <input
                        type="text"
                        inputMode="decimal"
                        className="adm-doc__cell-input"
                        value={planTotal}
                        onChange={(e) => setPlanTotal(e.target.value.replace(/[^\d.]/g, ""))}
                        aria-label="Payment plan total"
                      />
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </DocSection>
          </div>

          <div className="adm-doc__grid adm-doc__grid--mid">
            <DocSection title="PAYMENT MODE">
              <div className="adm-doc__pay-modes" role="group" aria-label="Payment mode">
                {PAYMENT_MODES.map((m) => {
                  const on = paymentMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      className={cn("adm-doc__pay-mode", on && "adm-doc__pay-mode--on")}
                      aria-pressed={on}
                      onClick={() => setPaymentMode(on ? "" : m.id)}
                    >
                      <span className={cn("adm-doc__check", on && "adm-doc__check--on")} aria-hidden />
                      <span className="adm-doc__pay-icon">
                        <PayIcon type={m.icon} />
                      </span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="adm-doc__pay-fields">
                <LineField id="reg-amt-recv" label="Amount Received">
                  <input
                    id="reg-amt-recv"
                    type="text"
                    inputMode="decimal"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value.replace(/[^\d.]/g, ""))}
                    placeholder="₹"
                  />
                </LineField>
                <LineField id="reg-pay-date" label="Date">
                  <input
                    id="reg-pay-date"
                    type="date"
                    value={paymentReceivedDate}
                    onChange={(e) => setPaymentReceivedDate(e.target.value)}
                  />
                </LineField>
                <LineField id="reg-recv-by" label="Received By">
                  <input
                    id="reg-recv-by"
                    type="text"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                  />
                </LineField>
                <LineField id="reg-sign" label="Signature">
                  <input
                    id="reg-sign"
                    type="text"
                    value={signatureNote}
                    onChange={(e) => setSignatureNote(e.target.value)}
                    placeholder="Name / note"
                  />
                </LineField>
              </div>
            </DocSection>

            <DocSection title="TERMS & CONDITIONS">
              <ol className="adm-doc__terms">
                {TERMS.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </DocSection>
          </div>

          <div className="adm-doc__bottom">
            <div className="adm-doc__bank">
              <p className="adm-doc__bank-title">BANK DETAILS (For Online Transfer)</p>
              <p className="adm-doc__bank-line">
                <span>
                  <strong>Account Name :</strong> {BANK.accountName}
                </span>
                <span className="adm-doc__bank-sep" aria-hidden>
                  |
                </span>
                <span>
                  <strong>Bank Name :</strong> {BANK.bankName}
                </span>
                <span className="adm-doc__bank-sep" aria-hidden>
                  |
                </span>
                <span>
                  <strong>Account No. :</strong> {BANK.accountNo}
                </span>
                <span className="adm-doc__bank-sep" aria-hidden>
                  |
                </span>
                <span>
                  <strong>IFSC Code :</strong> {BANK.ifsc}
                </span>
                <span className="adm-doc__bank-sep" aria-hidden>
                  |
                </span>
                <span>
                  <strong>Branch :</strong> {BANK.branch}
                </span>
              </p>
            </div>
          </div>

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

      <footer className="adm-doc__footer">
        <span className="adm-doc__footer-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.25a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z" />
          </svg>
          {phone1} / {phone2Short}
        </span>
        <span className="adm-doc__footer-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {WEBSITE}
        </span>
        <span className="adm-doc__footer-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Boring Road Patna
        </span>
      </footer>
    </div>
  );
}
