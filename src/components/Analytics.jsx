"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import {
  getGtmId,
  getMetaPixelId,
  initGa4Fallback,
  initGtmDataLayer,
  initMetaPixel,
  isPhoneHref,
  isWhatsAppHref,
  trackPageView,
  trackPhoneClick,
  trackWhatsAppClick,
} from "@/lib/analytics";

function buildPath(pathname, searchParams) {
  const query = searchParams?.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function shouldTrack(pathname) {
  return Boolean(pathname) && !pathname.startsWith("/admin");
}

function AnalyticsBootstrap() {
  useEffect(() => {
    initGtmDataLayer();
    initMetaPixel();
    initGa4Fallback();
  }, []);

  return null;
}

function AnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    const pagePath = buildPath(pathname, searchParams);

    const send = () => {
      trackPageView(pagePath);
      return true;
    };

    if (send()) return undefined;

    let attempts = 0;
    const id = window.setInterval(() => {
      attempts += 1;
      if (attempts >= 25) window.clearInterval(id);
      else send();
    }, 200);

    return () => window.clearInterval(id);
  }, [pathname, searchParams]);

  return null;
}

/** Site-wide WhatsApp and tel: click capture via event delegation. */
function AnalyticsClickTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldTrack(pathname)) return undefined;

    const onClick = (event) => {
      const anchor = event.target?.closest?.("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (isWhatsAppHref(href)) {
        trackWhatsAppClick(event.target, { source_page: pathname });
      } else if (isPhoneHref(href)) {
        trackPhoneClick(event.target, { source_page: pathname });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}

export default function Analytics() {
  const gtmId = getGtmId();
  const pixelId = getMetaPixelId();

  return (
    <>
      {gtmId ? (
        <Script
          id="gtm-container"
          src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          strategy="afterInteractive"
        />
      ) : null}

      {pixelId ? (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      ) : null}

      <AnalyticsBootstrap />

      <Suspense fallback={null}>
        <AnalyticsPageViews />
        <AnalyticsClickTracking />
      </Suspense>
    </>
  );
}
