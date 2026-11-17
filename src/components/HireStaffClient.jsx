"use client";

import Image from "next/image";
import Link from "next/link";
import HiringForm from "@/components/HiringForm";
import { EMPLOYER_TERMS, STAFF_ROLES } from "@/lib/hiring";

const CATEGORIES = [
  ["Boutique Owners", "Master Ji, Tailor, Blouse Specialist"],
  ["Fashion Designers & Studios", "Designer, Cutting Master, Sample Tailor"],
  ["Clothing Brands", "Stitching, Finishing, Quality Staff"],
  ["Garment Manufacturers", "Operators, Cutting, Production Staff"],
  ["Export Houses & Textile Companies", "Role-specific trained staff"],
  ["Tailoring Units", "Stitching, Fitting Staff"],
  ["Fashion Designing Institutes", "Trainer and associated staff"],
  ["Retail Clothing Companies", "Boutique Manager, Alteration Staff"],
];
const PROCESS = [
  ["Share Your Requirement", "Tell us the roles, quantity, experience, salary and workplace."],
  ["Requirement Review", "Our team reviews the details and contacts you."],
  ["Candidate Matching", "We consider available candidates by skills, experience, location and interest."],
  ["Interview & Skill Assessment", "Interview candidates and arrange appropriate practical assessments."],
  ["Selection & Joining", "Agree compensation, terms and joining directly with the candidate."],
];

export default function HireStaffClient({ contactHref }) {
  return <div className="text-ink">
    <section className="relative isolate overflow-hidden border-b border-ink/10 bg-surface">
      <div className="mx-auto grid max-w-page items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="relative z-10"><p className="text-xs font-semibold uppercase tracking-[.24em] text-orange">Shreya Creation · Hire Staff</p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl leading-tight sm:text-5xl xl:text-6xl">Hire Trained Professionals for Your Fashion Business</h1>
          <p className="mt-6 text-lg font-semibold text-orange">Hire Skilled. Hire Trained. Hire with Confidence.</p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">अपने Boutique, Fashion Studio, Clothing Brand या Garment Manufacturing Unit के लिए उपयुक्त स्टाफ खोजें। Shreya Creation आपकी जरूरत के अनुसार प्रशिक्षित विद्यार्थियों और अनुभवी पेशेवरों से जुड़ने, इंटरव्यू आयोजित करने और चयन प्रक्रिया में सहायता करता है।</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#staff-requirement-form" className="rounded-xl bg-orange px-6 py-3 font-semibold text-white shadow-card hover:bg-orange-dark">Submit Staff Requirement</a>
            {contactHref && <a href={contactHref} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-orange px-6 py-3 font-semibold text-orange hover:bg-orange/10">Talk to Our Team</a>}</div>
        </div>
        <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] shadow-card sm:min-h-[420px] lg:h-full"><Image src="/slider2.webp" alt="Fashion designer in a garment studio" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-right" priority /></div>
      </div>
    </section>

    <section className="mx-auto max-w-page px-4 py-20 sm:px-6"><div className="mb-9 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-orange">Who we support</p><h2 className="mt-3 font-display text-3xl sm:text-4xl">Staffing Support for the Fashion Industry</h2></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{CATEGORIES.map(([title, detail], i) => <article key={title} className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card"><span className="text-sm font-semibold text-orange">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-4 font-display text-xl">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{detail}</p></article>)}</div>
      <p className="mt-7 text-center text-sm text-muted">एक कर्मचारी की जरूरत हो या पूरी टीम की—अपनी आवश्यकता साझा करें।</p>
    </section>

    <section className="bg-surface/70 py-20"><div className="mx-auto max-w-page px-4 sm:px-6"><div className="mb-9 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-orange">Possible roles</p><h2 className="mt-3 font-display text-3xl sm:text-4xl">Find Professionals for Your Requirements</h2></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{STAFF_ROLES.filter((r) => r !== "Other").map((role) => <div key={role} className="rounded-xl border border-ink/10 bg-bg px-5 py-4 text-sm font-medium">✦ <span className="ml-2">{role}</span></div>)}</div>
      <p className="mt-6 text-sm text-muted">उम्मीदवारों की उपलब्धता पद, अनुभव, कार्यस्थल और प्रस्तावित वेतन के अनुसार होगी। ये अनुरोध के विकल्प हैं; किसी खास उम्मीदवार की मौजूदा उपलब्धता का दावा नहीं।</p>
    </div></section>

    <section className="mx-auto max-w-page px-4 py-20 sm:px-6"><div className="mb-10 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-orange">The process</p><h2 className="mt-3 font-display text-3xl sm:text-4xl">How Our Hiring Process Works</h2></div>
      <ol className="grid gap-4 lg:grid-cols-5">{PROCESS.map(([title, detail], i) => <li key={title} className="relative rounded-2xl border border-ink/10 bg-surface p-5 shadow-card lg:before:absolute lg:before:left-full lg:before:top-10 lg:before:z-10 lg:before:h-px lg:before:w-4 lg:before:bg-orange/50 last:before:hidden"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange text-sm font-bold text-white">{i + 1}</span><h3 className="mt-4 font-display text-lg">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{detail}</p></li>)}</ol>
    </section>

    <HiringForm />

    <section id="employer-terms" className="scroll-mt-28 border-y border-ink/10 bg-surface py-16"><div className="mx-auto max-w-4xl px-4 sm:px-6"><h2 className="font-display text-3xl">Employer Terms & Conditions</h2><p className="mt-3 text-sm text-muted">Please read before submitting a staffing inquiry. Placement and timelines are not guaranteed.</p><ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed">{EMPLOYER_TERMS.map((term) => <li key={term}>{term}</li>)}</ol>
      <p className="mt-6 text-sm text-muted">We use employer details to review and manage your request. Candidate information remains private until authorized disclosure with candidate permission. Read the <Link href="/policies/privacy" className="font-semibold text-orange underline">Privacy Policy</Link> for contact and data requests.</p></div></section>

    <section className="mx-auto max-w-page px-4 py-20 text-center sm:px-6"><h2 className="font-display text-3xl sm:text-4xl">Ready to Build Your Fashion Team?</h2><p className="mx-auto mt-4 max-w-2xl text-muted">अपनी staff requirement साझा करें और अपने business के लिए उपयुक्त लोगों से जुड़ने की प्रक्रिया शुरू करें।</p><div className="mt-8 flex flex-wrap justify-center gap-3"><a href="#staff-requirement-form" className="rounded-xl bg-orange px-6 py-3 font-semibold text-white hover:bg-orange-dark">Submit Your Requirement</a>{contactHref && <a href={contactHref} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-orange px-6 py-3 font-semibold text-orange">Contact Our Team</a>}</div></section>
  </div>;
}
