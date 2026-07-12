"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

export const GA_ID = "G-L0FL0BBDXS";

function buildPath(pathname, searchParams) {
  const query = searchParams?.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function shouldTrack(pathname) {
  return Boolean(pathname) && !pathname.startsWith("/admin");
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
        `}
      </Script>
      <Suspense fallback={null}>
        <GAPageViews />
      </Suspense>
    </>
  );
}
