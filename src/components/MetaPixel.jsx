"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

export const PIXEL_ID = "1734269331327084";

function shouldTrack(pathname) {
  return Boolean(pathname) && !pathname.startsWith("/admin");
}

function MetaPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    const send = () => {
      if (typeof window.fbq !== "function") return false;
      window.fbq("track", "PageView");
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

export default function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <MetaPageViews />
      </Suspense>
    </>
  );
}
