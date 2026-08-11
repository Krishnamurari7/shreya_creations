"use client";

import { useState } from "react";
import { BTN_SECONDARY, REVEAL } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { FEE_STRUCTURE_PDF_PATH } from "@/lib/conversion-config";
import { trackLead } from "@/lib/analytics";
import { Glass3DCard } from "@/components/Glass3DCard";

export default function FeeStructureLeadMagnet({ pdfPath = FEE_STRUCTURE_PDF_PATH, lang = "en" }) {
  const hi = lang === "hi";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (website.trim()) return;
    if (!name.trim() || !phone.trim()) {
      setError(hi ? "नाम और फ़ोन जरूरी हैं।" : "Name and phone are required.");
      return;
    }

    setError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/lead/fee-structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          website: website.trim(),
          source: "fee_structure_pdf",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }

      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: "Fee structure PDF download",
          source: "fee_structure_pdf",
          source_page: window.location.pathname,
          inquiry_type: "brochure",
          locale: lang,
          website: website.trim(),
        }),
      });

      trackLead("brochure_download", {
        cta_label: "fee_structure_pdf",
        source_page: window.location.pathname,
      });

      setStatus("done");
      window.open(pdfPath, "_blank", "noopener,noreferrer");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message
          : hi
            ? "कुछ गलत हो गया। बाद में कोशिश करें।"
            : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <Glass3DCard
      className={cn(REVEAL, "fee-lead-magnet", "rounded-2xl", "p-5", "sm:p-6", "border-orange/15")}
    >
      <div className="fee-lead-magnet__copy">
        <h3 className="font-display text-xl text-ink">
          {hi ? "कोर्स फीस स्ट्रक्चर (PDF)" : "Course Fee Structure (PDF)"}
        </h3>
        <p className="text-sm text-muted mt-1.5 leading-relaxed">
          {hi
            ? "नाम और फ़ोन भरें — PDF तुरंत डाउनलोड होगी।"
            : "Enter your name and phone to download the fee PDF instantly."}
        </p>
      </div>

      {status === "done" ? (
        <p className="text-sm text-orange font-medium mt-4" role="status">
          {hi ? "धन्यवाद! PDF खुल गई होनी चाहिए।" : "Thank you! Your PDF should have opened."}
        </p>
      ) : (
        <form onSubmit={submit} className="fee-lead-magnet__form mt-4 space-y-3">
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="fee-lead-magnet__honeypot"
            aria-hidden
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={hi ? "आपका नाम" : "Your name"}
              autoComplete="name"
              required
              className="fee-lead-magnet__input"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={hi ? "फ़ोन / WhatsApp" : "Phone / WhatsApp"}
              autoComplete="tel"
              required
              className="fee-lead-magnet__input"
            />
          </div>
          {error && (
            <p className="text-xs text-orange-text" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className={cn(BTN_SECONDARY, "w-full", "sm:w-auto")}
          >
            {status === "loading"
              ? "…"
              : hi
                ? "फीस PDF डाउनलोड करें"
                : "Download Fee Structure PDF"}
          </button>
        </form>
      )}
    </Glass3DCard>
  );
}
