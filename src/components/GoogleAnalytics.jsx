"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

export const GA_ID = "G-L0FL0BBDXS";
export const AW_ID = "AW-11033186057";
export const AW_CONTACT_CONVERSION = "ads_conversion_Contact_Us_1";

function buildPath(pathname, searchParams) {
  const query = searchParams?.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function shouldTrack(pathname) {
  return Boolean(pathname) && !pathname.startsWith("/admin");
}

/** Fire Google Ads Contact Us conversion; optionally delay navigation until the hit is sent. */
export function gtagSendEvent(url) {
  if (typeof window === "undefined") return false;

  const callback = () => {
    if (typeof url === "string") {
      window.location = url;
    }
  };

  if (typeof window.gtag !== "function") {
    callback();
    return false;
  }

  window.gtag("event", AW_CONTACT_CONVERSION, {
    event_callback: callback,
    event_timeout: 2000,
  });
  return false;
}

/** Fire Contact Us conversion without navigating away (e.g. WhatsApp opens in a new tab). */
export function trackContactConversion() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", AW_CONTACT_CONVERSION, {});
}

function GAPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    const pagePath = buildPath(pathname, searchParams);

    const send = () => {
      if (typeof window.gtag !== "function") return false;
      window.gtag("config", GA_ID, { page_path: pagePath });
      return true;
    };

    if (send()) return undefined;

    let attempts = 0;
    const id = window.setInterval(() => {
      attempts += 1;
      if (send() || attempts >= 25) window.clearInterval(id);
    }, 200);

    return () => window.clearInterval(id);
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
          gtag('config', '${AW_ID}');

          window.gtagSendEvent = function gtagSendEvent(url) {
            var callback = function () {
              if (typeof url === 'string') {
                window.location = url;
              }
            };
            gtag('event', '${AW_CONTACT_CONVERSION}', {
              'event_callback': callback,
              'event_timeout': 2000,
            });
            return false;
          };
        `}
      </Script>
      <Suspense fallback={null}>
        <GAPageViews />
      </Suspense>
    </>
  );
}
