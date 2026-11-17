"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BUSINESS_TYPES, EMPLOYMENT_TYPES, EXPERIENCE_OPTIONS, HIRING_TERMS_VERSION, INDIAN_STATES, STAFF_ROLES, WORKPLACE_TYPES } from "@/lib/hiring";
import { HIRING_COPY, hiringErrorMessage, hiringOptionLabel } from "@/lib/hiring-copy";
import { hiringSchema } from "@/lib/hiring-validation";

const STEP_FIELDS = [
  ["companyName", "businessType", "businessTypeOther", "contactName", "ownerName", "mobile", "whatsapp", "email", "website", "businessAddress", "businessState", "businessCity", "pinCode"],
  ["positions"],
  ["workAddress", "workState", "workCity", "workplaceType", "workplaceTypeOther", "employmentType", "joiningDate", "workingHours", "weeklyOff", "accommodation", "food", "benefits"],
  ["details", "consentAccuracy", "consentTerms", "consentContact", "termsVersion"],
];
const newPosition = () => ({ role: STAFF_ROLES[0], customRole: "", quantity: 1, experience: EXPERIENCE_OPTIONS[0], skills: "", salaryMin: "", salaryMax: "", negotiable: false });
const initial = {
  idempotencyKey: "", companyName: "", businessType: BUSINESS_TYPES[0], businessTypeOther: "", contactName: "", ownerName: "",
  mobile: "", whatsapp: "", email: "", website: "", businessAddress: "", businessState: "Bihar", businessCity: "", pinCode: "",
  positions: [newPosition()], workAddress: "", workState: "Bihar", workCity: "", workplaceType: WORKPLACE_TYPES[0], workplaceTypeOther: "",
  employmentType: EMPLOYMENT_TYPES[0], joiningDate: "", workingHours: "", weeklyOff: "", accommodation: false, food: false,
  benefits: "", details: "", consentAccuracy: false, consentTerms: false, consentContact: false,
  termsVersion: HIRING_TERMS_VERSION, websiteTrap: "",
};

function Field({ label, name, error, required, children }) {
  return <label className="block text-[13px] font-semibold text-ink" htmlFor={name}>
    <span>{label}{required && <span className="text-orange" aria-hidden="true"> *</span>}</span>
    {children}
    {error && <span id={`${name}-error`} className="mt-1 block text-sm text-red-600" role="alert">{error}</span>}
  </label>;
}

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-ink/15 bg-[var(--surface-muted)] px-4 py-3 text-ink placeholder:text-muted transition focus:border-orange focus:outline-none focus:ring-4 focus:ring-orange/10 disabled:cursor-not-allowed disabled:opacity-60";

export default function HiringForm({ contactHref, locale = "en", terms }) {
  const t = (HIRING_COPY[locale] || HIRING_COPY.en).form;
  const labels = t.labels;
  const optionLabel = (value) => hiringOptionLabel(locale, value);
  const errorLabel = (message) => hiringErrorMessage(locale, message);
  const [form, setForm] = useState(initial);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [pending, setPending] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const pendingRef = useRef(false);
  const headingRef = useRef(null);
  const total = useMemo(() => form.positions.reduce((n, p) => n + (Number(p.quantity) || 0), 0), [form.positions]);

  useEffect(() => {
    if (!sameAddress) return;
    setForm((old) => ({ ...old, workAddress: old.businessAddress, workState: old.businessState, workCity: old.businessCity }));
  }, [sameAddress, form.businessAddress, form.businessState, form.businessCity]);

  const update = (name, value) => { setForm((old) => ({ ...old, [name]: value })); setErrors((old) => ({ ...old, [name]: undefined })); };
  const updatePosition = (index, name, value) => {
    setForm((old) => ({ ...old, positions: old.positions.map((p, i) => i === index ? { ...p, [name]: value } : p) }));
    setErrors((old) => ({ ...old, [`positions.${index}.${name}`]: undefined }));
  };
  const input = (name, label, options = {}) => <Field label={label} name={name} required={options.required} error={errors[name]}>
    <input id={name} className={inputClass} type={options.type || "text"} inputMode={options.inputMode} autoComplete={options.autoComplete}
      placeholder={options.placeholder} value={form[name]} onChange={(e) => update(name, e.target.value)} maxLength={options.maxLength}
      required={options.required} disabled={sameAddress && name === "workCity"} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} />
  </Field>;
  const area = (name, label, options = {}) => <Field label={label} name={name} required={options.required} error={errors[name]}>
    <textarea id={name} className={inputClass} rows={options.rows || 3} value={form[name]} onChange={(e) => update(name, e.target.value)}
      placeholder={options.placeholder} maxLength={options.maxLength || 5000} required={options.required} disabled={sameAddress && name === "workAddress"}
      aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} />
  </Field>;
  const select = (name, label, options, required = true) => <Field label={label} name={name} required={required} error={errors[name]}>
    <select id={name} className={inputClass} value={form[name]} onChange={(e) => update(name, e.target.value)} required={required} disabled={sameAddress && name === "workState"}
      aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined}>
      {options.map((option) => <option key={option} value={option}>{optionLabel(option)}</option>)}
    </select>
  </Field>;

  function validate(nextForm, currentStep = null) {
    const result = hiringSchema.safeParse({ ...nextForm, idempotencyKey: nextForm.idempotencyKey || crypto.randomUUID() });
    const nextErrors = {};
    if (!result.success) for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!nextErrors[path]) nextErrors[path] = errorLabel(issue.message);
    }
    if (nextForm.businessType === "Other" && !nextForm.businessTypeOther.trim()) nextErrors.businessTypeOther = errorLabel("Describe the business type.");
    if (nextForm.workplaceType === "Other" && !nextForm.workplaceTypeOther.trim()) nextErrors.workplaceTypeOther = errorLabel("Describe the workplace type.");
    nextForm.positions.forEach((p, i) => {
      if (p.role === "Other" && !p.customRole.trim()) nextErrors[`positions.${i}.customRole`] = errorLabel("Enter the position name.");
      if (p.salaryMin !== "" && p.salaryMax !== "" && Number(p.salaryMin) > Number(p.salaryMax)) nextErrors[`positions.${i}.salaryMax`] = errorLabel("Maximum must be at least the minimum.");
    });
    const relevant = currentStep == null ? nextErrors : Object.fromEntries(Object.entries(nextErrors).filter(([path]) => STEP_FIELDS[currentStep].includes(path.split(".")[0])));
    setErrors(relevant);
    return Object.keys(relevant).length === 0;
  }

  const goTo = (next) => { setStep(next); setServerError(""); requestAnimationFrame(() => headingRef.current?.focus()); };
  const next = () => { if (validate(form, step)) goTo(step + 1); };
  const useBusinessAddress = () => setForm((old) => ({ ...old, workAddress: old.businessAddress, workState: old.businessState, workCity: old.businessCity }));

  async function submit(e) {
    e.preventDefault();
    if (pendingRef.current || requestId) return;
    const data = { ...form, idempotencyKey: form.idempotencyKey || crypto.randomUUID() };
    setForm(data);
    if (!validate(data)) {
      const result = hiringSchema.safeParse(data);
      const first = result.success ? 3 : Math.max(0, STEP_FIELDS.findIndex((fields) => result.error.issues.some((issue) => fields.includes(String(issue.path[0])))));
      goTo(first);
      setServerError(t.correction);
      return;
    }
    pendingRef.current = true; setPending(true); setServerError("");
    try {
      const response = await fetch("/api/hiring", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await response.json();
      if (!response.ok || !body.requestId) {
        if (body.issues) setErrors(Object.fromEntries(body.issues.map((issue) => [issue.path.join("."), errorLabel(issue.message)])));
        throw new Error(locale === "hi" ? t.saveFailed : (body.error || t.saveFailed));
      }
      setRequestId(body.requestId);
    } catch (error) { setServerError(error.message || t.saveFailed); }
    finally { pendingRef.current = false; setPending(false); }
  }

  if (requestId) return <section id="staff-requirement-form" className="mx-auto max-w-4xl scroll-mt-10 px-4 py-20 sm:px-6" aria-live="polite">
    <div className="rounded-3xl border border-green/30 bg-surface p-8 text-center shadow-card sm:p-12">
      <div className="mb-4 text-4xl text-green">✓</div>
      <h2 className="font-display text-3xl text-ink">{t.thankYou}</h2>
      <p className="mx-auto mt-3 max-w-xl text-muted">{t.success}</p>
      <p className="mt-6 text-sm text-muted">{t.requestId}</p><p className="mt-1 text-xl font-semibold tracking-wide text-ink">{requestId}</p>
    </div>
  </section>;

  return <section id="staff-requirement-form" className="scroll-mt-10 bg-[var(--surface-muted)] py-12 sm:py-24">
    <div className="mx-auto grid max-w-page gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,.34fr)_minmax(0,.66fr)] lg:gap-14">
      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange">{t.eyebrow}</p>
        <h2 className="mt-5 max-w-md font-display text-4xl leading-[1.15] text-ink sm:text-5xl">{t.title}</h2>
        <p className="mt-5 max-w-md leading-7 text-muted">{t.description}</p>
        <div className="mt-8 hidden border-t border-ink/15 pt-6 lg:block">
          <p className="text-sm font-semibold text-ink">{t.helpfulTitle}</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            {t.helpfulItems.map((item) => <li key={item}>✓ {item}</li>)}
          </ul>
        </div>
        {contactHref && <a href={contactHref} target="_blank" rel="noopener noreferrer" className="mt-8 hidden w-fit items-center gap-2 border-b border-orange pb-1 text-sm font-semibold text-orange lg:inline-flex">{t.helpLink} <span aria-hidden="true">↗</span></a>}
      </aside>
      <form noValidate onSubmit={submit} className="min-w-0 rounded-[2rem] border border-ink/10 bg-surface p-5 shadow-lift sm:p-8">
      <div className="mb-8 rounded-2xl bg-[#251a15] p-5 text-[#fff8ef] sm:p-6" aria-label={t.progressLabel}>
        <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e7b184]"><span>{t.step} {String(step + 1).padStart(2, "0")} / 04</span><span>{(step + 1) * 25}% {t.complete}</span></div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step + 1} aria-label={t.progressStepLabel}>
          <div className="h-full rounded-full bg-[#e7b184] transition-all duration-300" style={{ width: ((step + 1) * 25) + "%" }} />
        </div>
        <ol className="mt-5 hidden grid-cols-4 gap-3 text-xs sm:grid">{t.steps.map((label, i) => <li key={label} className={"leading-5 " + (i === step ? "font-semibold text-white" : "text-[#c9b7aa]")}>{label}</li>)}</ol>
        <p className="mt-4 text-sm font-semibold sm:hidden">{t.steps[step]}</p>
      </div>
      <h3 ref={headingRef} tabIndex={-1} className="font-display text-2xl text-ink focus:outline-none sm:text-3xl">{t.steps[step]}</h3>
      <p className="mb-7 mt-2 text-sm leading-6 text-muted">{t.stepDetails[step]}</p>
      {serverError && <p role="alert" className="mb-5 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-700">{serverError}</p>}

      {step === 0 && <div className="grid gap-5 sm:grid-cols-2">
        <p className="sm:col-span-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange">{t.businessContact}</p>
        {input("companyName", labels.companyName, { required: true, maxLength: 200, autoComplete: "organization" })}
        {select("businessType", labels.businessType, BUSINESS_TYPES)}
        {form.businessType === "Other" && input("businessTypeOther", labels.businessTypeOther, { required: true })}
        {input("contactName", labels.contactName, { required: true, autoComplete: "name" })}
        {input("ownerName", labels.ownerName)}
        {input("mobile", labels.mobile, { required: true, type: "tel", inputMode: "tel", autoComplete: "tel" })}
        <div>{input("whatsapp", labels.whatsapp, { type: "tel", inputMode: "tel" })}<label className="mt-2 flex items-center gap-2 text-sm text-muted"><input type="checkbox" className="h-4 w-4 accent-orange" checked={Boolean(form.mobile && form.whatsapp === form.mobile)} onChange={(e) => update("whatsapp", e.target.checked ? form.mobile : "")} /> {t.sameAsMobile}</label></div>
        {input("email", labels.email, { type: "email", autoComplete: "email" })}
        {input("website", labels.website, { type: "url", placeholder: "https://" })}
        <p className="sm:col-span-2 border-t border-ink/10 pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-orange">{t.businessAddress}</p>
        <div className="sm:col-span-2">{area("businessAddress", labels.businessAddress, { required: true, maxLength: 1000 })}</div>
        {select("businessState", labels.businessState, INDIAN_STATES)}
        {input("businessCity", labels.businessCity, { required: true, autoComplete: "address-level2" })}
        {input("pinCode", labels.pinCode, { required: true, inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
      </div>}

      {step === 1 && <div className="space-y-5">
        {form.positions.map((p, i) => <fieldset key={i} className="rounded-2xl border border-ink/15 p-5 sm:p-6"><legend className="px-2 font-semibold text-ink">{t.position} {i + 1}</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            {[["role", labels.role, STAFF_ROLES], ["experience", labels.experience, EXPERIENCE_OPTIONS]].map(([name, label, options]) => <Field key={name} label={label} name={`positions.${i}.${name}`} required error={errors[`positions.${i}.${name}`]}><select id={`positions.${i}.${name}`} className={inputClass} value={p[name]} onChange={(e) => updatePosition(i, name, e.target.value)}>{options.map((value) => <option key={value} value={value}>{optionLabel(value)}</option>)}</select></Field>)}
            {p.role === "Other" && <Field label={labels.customRole} name={`positions.${i}.customRole`} required error={errors[`positions.${i}.customRole`]}><input id={`positions.${i}.customRole`} className={inputClass} value={p.customRole} onChange={(e) => updatePosition(i, "customRole", e.target.value)} /></Field>}
            <Field label={labels.quantity} name={`positions.${i}.quantity`} required error={errors[`positions.${i}.quantity`]}><input id={`positions.${i}.quantity`} className={inputClass} type="number" min="1" max="1000" step="1" value={p.quantity} onChange={(e) => updatePosition(i, "quantity", e.target.value === "" ? 0 : Number(e.target.value))} /></Field>
            <Field label={labels.skills} name={`positions.${i}.skills`} error={errors[`positions.${i}.skills`]}><input id={`positions.${i}.skills`} className={inputClass} value={p.skills} onChange={(e) => updatePosition(i, "skills", e.target.value)} placeholder={t.placeholders.skills} /></Field>
            {[["salaryMin", labels.salaryMin], ["salaryMax", labels.salaryMax]].map(([name, label]) => <Field key={name} label={label} name={`positions.${i}.${name}`} error={errors[`positions.${i}.${name}`]}><input id={`positions.${i}.${name}`} className={inputClass} type="number" min="0" max="10000000" step="1" value={p[name]} onChange={(e) => updatePosition(i, name, e.target.value === "" ? "" : Number(e.target.value))} /></Field>)}
            <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" className="h-4 w-4 accent-orange" checked={p.negotiable} onChange={(e) => updatePosition(i, "negotiable", e.target.checked)} /> {t.salaryNegotiable}</label>
          </div>
          {form.positions.length > 1 && <button type="button" className="mt-5 text-sm font-semibold text-orange underline" onClick={() => setForm((old) => ({ ...old, positions: old.positions.filter((_, j) => j !== i) }))}>{t.removePosition} {i + 1}</button>}
        </fieldset>)}
        <button type="button" className="rounded-xl border border-orange px-4 py-2 text-sm font-semibold text-orange hover:bg-orange/10" onClick={() => setForm((old) => ({ ...old, positions: [...old.positions, newPosition()] }))} disabled={form.positions.length >= 20}>{t.addPosition}</button>
        <p className="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-5 py-4 text-sm font-semibold text-ink"><span>{t.totalStaff}</span><strong className="font-display text-3xl text-orange">{total}</strong></p>
        <p className="text-sm text-muted">{t.budgetNote}</p>
      </div>}

      {step === 2 && <div className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-ink/10 bg-[var(--surface-muted)] p-4 text-sm font-medium text-ink"><input type="checkbox" className="h-4 w-4 accent-orange" checked={sameAddress} onChange={(e) => { setSameAddress(e.target.checked); if (e.target.checked) useBusinessAddress(); }} /> {t.sameAsAddress}</label>
        <div className="sm:col-span-2">{area("workAddress", labels.workAddress, { required: true, maxLength: 1000 })}</div>
        {select("workState", labels.workState, INDIAN_STATES)}
        {input("workCity", labels.workCity, { required: true })}
        {select("workplaceType", labels.workplaceType, WORKPLACE_TYPES)}
        {form.workplaceType === "Other" && input("workplaceTypeOther", labels.workplaceTypeOther, { required: true })}
        {select("employmentType", labels.employmentType, EMPLOYMENT_TYPES)}
        {input("joiningDate", labels.joiningDate, { required: true, type: "date" })}
        {input("workingHours", labels.workingHours, { required: true, placeholder: t.placeholders.workingHours })}
        {input("weeklyOff", labels.weeklyOff, { required: true, placeholder: t.placeholders.weeklyOff })}
        <Field label={labels.accommodation} name="accommodation" required><select id="accommodation" className={inputClass} value={form.accommodation ? "Yes" : "No"} onChange={(e) => update("accommodation", e.target.value === "Yes")}><option value="No">{optionLabel("No")}</option><option value="Yes">{optionLabel("Yes")}</option></select></Field>
        <Field label={labels.food} name="food" required><select id="food" className={inputClass} value={form.food ? "Yes" : "No"} onChange={(e) => update("food", e.target.value === "Yes")}><option value="No">{optionLabel("No")}</option><option value="Yes">{optionLabel("Yes")}</option></select></Field>
        <div className="sm:col-span-2">{area("benefits", labels.benefits, { maxLength: 1000 })}</div>
      </div>}

      {step === 3 && <div className="space-y-5">
        {area("details", labels.details, { rows: 5, placeholder: t.placeholders.details })}
        <div className="rounded-2xl border border-ink/15 bg-[var(--surface-muted)] p-5"><h4 className="font-display text-xl text-ink">{t.termsTitle}</h4><p className="mt-1 text-xs text-muted">{t.version} {HIRING_TERMS_VERSION}</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink">{terms.map((term) => <li key={term}>{term}</li>)}</ol>
          <p className="mt-4 text-sm text-muted">{t.readPrivacy} <Link className="underline text-orange" href={locale === "hi" ? "/hi/policies/privacy" : "/policies/privacy"} target="_blank">{t.privacyLabel}</Link>.</p>
        </div>
        {[["consentAccuracy", t.consent[0]], ["consentTerms", t.consent[1]], ["consentContact", t.consent[2]]].map(([name, label]) => <label key={name} className="block rounded-xl border border-ink/15 bg-[var(--surface-muted)] p-4 text-sm text-ink"><span className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-4 w-4 accent-orange" checked={form[name]} onChange={(e) => update(name, e.target.checked)} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} /><span>{label}</span></span>{errors[name] && <span id={`${name}-error`} role="alert" className="mt-1 block pl-6 text-red-600">{errors[name]}</span>}</label>)}
      </div>}
      <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="websiteTrap">{locale === "hi" ? "खाली छोड़ें" : "Leave this empty"}</label><input id="websiteTrap" tabIndex={-1} autoComplete="off" value={form.websiteTrap} onChange={(e) => update("websiteTrap", e.target.value)} /></div>
      <div className="mt-9 flex items-center justify-between gap-3 border-t border-ink/10 pt-6">
        {step > 0 ? <button type="button" className="min-h-12 flex-1 rounded-full border border-ink/20 px-6 py-3 font-semibold text-ink transition hover:bg-[var(--surface-muted)] sm:flex-none" onClick={() => goTo(step - 1)}>{t.back}</button> : <span />}
        {step < 3 ? <button type="button" className="min-h-12 flex-1 rounded-full bg-orange px-7 py-3 font-semibold text-white transition hover:bg-orange-dark sm:flex-none" onClick={next}>{t.next} →</button> : <button type="submit" disabled={pending} className="min-h-12 flex-1 rounded-full bg-orange px-7 py-3 font-semibold text-white transition hover:bg-orange-dark disabled:opacity-60 sm:flex-none">{pending ? t.submitting : t.submit}</button>}
      </div>
      </form>
    </div>
  </section>;
}
