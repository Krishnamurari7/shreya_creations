"use client";

import { useCallback, useState } from "react";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { getRazorpayKeyId } from "@/lib/products";
import { trackInitiateCheckout } from "@/lib/analytics";
import { useLanguage } from "@/components/LanguageProvider";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Browser only"));
      return;
    }
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Razorpay));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function RazorpayPayButton({ product, className = "" }) {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const keyId = getRazorpayKeyId();
  const price = product?.price != null ? Number(product.price) : 0;

  const pay = useCallback(async () => {
    if (!keyId) {
      setError(hi ? "TODO(owner): Razorpay key id जोड़ें" : "TODO(owner): add Razorpay key id");
      return;
    }
    if (!price || price <= 0) {
      setError(hi ? "कीमत उपलब्ध नहीं" : "Price not available");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          productTitle: product.title,
          amount: price,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment");

      trackInitiateCheckout(product.title, price, {
        source_page: typeof window !== "undefined" ? window.location.pathname : undefined,
      });

      const Razorpay = await loadRazorpayScript();
      const rzp = new Razorpay({
        key: keyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Shreya Creation",
        description: product.title,
        order_id: data.orderId,
        theme: { color: "#CC4F06" },
        method: { upi: true, card: true, netbanking: true, wallet: true },
      });

      rzp.on("payment.failed", () => {
        setError(hi ? "पेमेंट असफल — WhatsApp से ऑर्डर करें।" : "Payment failed — order on WhatsApp instead.");
      });

      rzp.open();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : hi
            ? "पेमेंट शुरू नहीं हो सका"
            : "Could not start payment"
      );
    } finally {
      setLoading(false);
    }
  }, [hi, keyId, price, product.slug, product.title]);

  if (!price) return null;

  return (
    <div className={cn("razorpay-pay", className)}>
      <button
        type="button"
        onClick={pay}
        disabled={loading}
        className={cn(BTN_PRIMARY, "w-full", "sm:w-auto", "razorpay-pay__btn")}
        data-track-cta="razorpay_pay"
        data-track-item={product.title}
      >
        {loading
          ? "…"
          : hi
            ? `UPI / कार्ड से ₹${price.toLocaleString("en-IN")} में खरीदें`
            : `Pay ₹${price.toLocaleString("en-IN")} via UPI / Card`}
      </button>
      {!keyId && (
        <p className="text-[10px] text-muted mt-1 owner-todo-marker">
          TODO(owner): add Razorpay key id
        </p>
      )}
      {error && (
        <p className="text-xs text-orange-text mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
