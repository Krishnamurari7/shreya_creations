"use client";

import { useState } from "react";
import Link from "next/link";

const ROLE_OPTIONS = [
  ["Fashion Design", "Fashion Design", "फ़ैशन डिज़ाइन"],
  ["Tailoring", "Tailoring / Stitching", "टेलरिंग / सिलाई"],
  ["Embroidery", "Embroidery", "कढ़ाई"],
  ["Boutique Operations", "Boutique Operations", "बुटीक संचालन"],
  ["Sales & Customer Care", "Sales & Customer Care", "सेल्स और ग्राहक सेवा"],
  ["Marketing & Content", "Marketing & Content", "मार्केटिंग और कंटेंट"],
  ["Other", "Other", "अन्य"],
];
const COPY = {
  en: {
    eyebrow: "Work with Shreya Creation", title: "Apply for an internship or a job",
    intro: "Interested in fashion, tailoring, boutique work or creative business? Tell us about yourself and upload your resume. Our team will review your application and contact you if there is a suitable opening.",
    note: "Applications are reviewed by our team. Submission does not guarantee an interview or placement.",
    type: "I am applying for", internship: "Internship", job: "Job", name: "Full name", email: "Email address", phone: "Mobile number", city: "Current city", role: "Area of interest", experience: "Experience or relevant skills", portfolio: "Portfolio link (optional)", message: "A short note about you (optional)", resume: "Resume (PDF or DOCX, max 5 MB)", consent: "I agree that Shreya Creation may use my details and resume to review this application and contact me. I have read the", privacy: "Privacy Policy", submit: "Send application", sending: "Uploading resume…", success: "Application received. Reference:", error: "Could not submit your application. Please try again.", fileError: "Please choose a PDF or DOCX file up to 5 MB.", required: "Required fields are marked *.",
  },
  hi: {
    eyebrow: "श्रेया क्रिएशन के साथ काम करें", title: "इंटर्नशिप या नौकरी के लिए आवेदन करें",
    intro: "फ़ैशन, सिलाई, बुटीक या रचनात्मक काम में रुचि है? अपने बारे में बताएं और रिज़्यूमे भेजें। उपयुक्त अवसर होने पर हमारी टीम आपसे संपर्क करेगी।",
    note: "हमारी टीम आवेदन की समीक्षा करती है। आवेदन भेजने से इंटरव्यू या नौकरी की गारंटी नहीं मिलती।",
    type: "मैं आवेदन कर रहा/रही हूँ", internship: "इंटर्नशिप", job: "नौकरी", name: "पूरा नाम", email: "ईमेल पता", phone: "मोबाइल नंबर", city: "वर्तमान शहर", role: "रुचि का क्षेत्र", experience: "अनुभव या संबंधित कौशल", portfolio: "पोर्टफ़ोलियो लिंक (वैकल्पिक)", message: "अपने बारे में संक्षिप्त जानकारी (वैकल्पिक)", resume: "रिज़्यूमे (PDF या DOCX, अधिकतम 5 MB)", consent: "मैं सहमत हूँ कि श्रेया क्रिएशन मेरे आवेदन की समीक्षा और मुझसे संपर्क करने के लिए मेरी जानकारी व रिज़्यूमे का उपयोग करे। मैंने पढ़ी है", privacy: "गोपनीयता नीति", submit: "आवेदन भेजें", sending: "रिज़्यूमे अपलोड हो रहा है…", success: "आवेदन प्राप्त हुआ। संदर्भ संख्या:", error: "आवेदन भेजा नहीं जा सका। कृपया फिर प्रयास करें।", fileError: "कृपया 5 MB तक की PDF या DOCX फ़ाइल चुनें।", required: "* वाले फ़ील्ड आवश्यक हैं।",
  },
};

const input = "mt-2 w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/15";
function Field({ label, name, children, required = false }) {
  return <label className="block text-sm font-semibold text-ink">{label}{required && <span className="text-orange"> *</span>}{children || <input name={name} className={input} required={required} />}</label>;
}

export default function CareerApplicationForm({ locale = "en" }) {
  const t = COPY[locale] || COPY.en;
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("resume");
    if (!(file instanceof File) || file.size < 100 || file.size > 5 * 1024 * 1024 || !/\.(pdf|docx)$/i.test(file.name)) {
      setResult({ error: t.fileError }); return;
    }
    setBusy(true); setResult(null);
    try {
      const response = await fetch("/api/careers", { method: "POST", body: data });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || t.error);
      setResult({ id: json.applicationId });
      form.reset();
    } catch (error) { setResult({ error: error.message || t.error }); }
    finally { setBusy(false); }
  }

  return <section id="career-application" className="scroll-mt-24 bg-[#f8efe7] py-20 sm:py-24" aria-labelledby="career-application-title">
    <div className="mx-auto grid max-w-page gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,.4fr)_minmax(0,.6fr)] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">{t.eyebrow}</p>
        <h2 id="career-application-title" className="mt-5 font-display text-4xl leading-tight text-ink sm:text-5xl">{t.title}</h2>
        <p className="mt-6 max-w-md leading-8 text-muted">{t.intro}</p>
        <p className="mt-8 max-w-md border-l-2 border-orange pl-4 text-sm leading-6 text-muted">{t.note}</p>
      </div>
      <form onSubmit={submit} encType="multipart/form-data" className="grid gap-5 rounded-3xl border border-ink/10 bg-white p-5 shadow-card sm:grid-cols-2 sm:p-8">
        <p className="text-xs text-muted sm:col-span-2">{t.required}</p>
        <Field label={t.type} required><select name="opportunity" className={input} defaultValue="" required><option value="" disabled>—</option><option value="Internship">{t.internship}</option><option value="Job">{t.job}</option></select></Field>
        <Field label={t.role} required><select name="preferredRole" className={input} defaultValue="" required><option value="" disabled>—</option>{ROLE_OPTIONS.map(([value, en, hi]) => <option value={value} key={value}>{locale === "hi" ? hi : en}</option>)}</select></Field>
        <Field label={t.name} required><input name="fullName" autoComplete="name" maxLength={120} minLength={2} className={input} required /></Field>
        <Field label={t.email} required><input name="email" type="email" autoComplete="email" maxLength={254} className={input} required /></Field>
        <Field label={t.phone} required><input name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[+]?[0-9 ]{10,18}" className={input} required /></Field>
        <Field label={t.city} required><input name="city" autoComplete="address-level2" maxLength={100} minLength={2} className={input} required /></Field>
        <Field label={t.experience}><textarea name="experience" rows={3} maxLength={500} className={input} /></Field>
        <Field label={t.portfolio}><input name="portfolioUrl" type="url" maxLength={500} placeholder="https://" className={input} /></Field>
        <div className="sm:col-span-2"><Field label={t.message}><textarea name="message" rows={3} maxLength={2000} className={input} /></Field></div>
        <div className="sm:col-span-2"><Field label={t.resume} required><input name="resume" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className={`${input} file:mr-4 file:rounded-full file:border-0 file:bg-orange/10 file:px-4 file:py-2 file:font-semibold file:text-orange`} required /></Field></div>
        <label className="flex items-start gap-3 text-sm leading-6 text-muted sm:col-span-2"><input name="consent" value="yes" type="checkbox" required className="mt-1.5 h-4 w-4 accent-orange" /><span>{t.consent} <Link href={locale === "hi" ? "/hi/policies/privacy" : "/policies/privacy"} className="font-semibold text-orange underline underline-offset-2">{t.privacy}</Link>.</span></label>
        <div className="sm:col-span-2" aria-live="polite">{result?.id && <p role="status" className="rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-800">{t.success} {result.id}</p>}{result?.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{result.error}</p>}</div>
        <button type="submit" disabled={busy} className="min-h-12 rounded-full bg-orange px-8 py-3 font-semibold text-white transition hover:bg-orange-dark disabled:cursor-wait disabled:opacity-60 sm:col-span-2 sm:justify-self-start">{busy ? t.sending : t.submit} <span aria-hidden="true">↗</span></button>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-px w-px opacity-0" />
      </form>
    </div>
  </section>;
}
