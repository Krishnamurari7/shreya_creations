import "./globals.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/kaushan-script/400.css";
import "@fontsource/dancing-script/500.css";
import "@fontsource/dancing-script/600.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource/noto-serif-devanagari/400.css";
import "@fontsource/noto-serif-devanagari/500.css";
import "@fontsource/noto-serif-devanagari/600.css";
import "@fontsource/noto-serif-devanagari/700.css";
import "@fontsource/noto-sans-devanagari/400.css";
import "@fontsource/noto-sans-devanagari/500.css";
import "@fontsource/noto-sans-devanagari/600.css";
import "@fontsource/noto-sans-devanagari/700.css";
import { BG_ATMOSPHERE } from "@/lib/ui";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppAssistant from "@/components/WhatsAppAssistant";
import MobileContactBar from "@/components/MobileContactBar";
import ScrollReveal from "@/components/ScrollReveal";
import SiteProtection from "@/components/SiteProtection";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeScript from "@/components/ThemeScript";
import Analytics from "@/components/Analytics";
import { getSiteSettings } from "@/lib/data";
import { LOGO_SRC } from "@/lib/brand";
import { getSiteUrl } from "@/lib/siteUrl";
import JsonLd from "@/components/JsonLd";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { headers } from "next/headers";

const siteUrl = getSiteUrl();

const siteTitle = "Fashion Boutique Institute & 24hr Stitching in Patna | Shreya Creation";
const siteDescription =
  "Learn fashion designing & boutique courses in Patna, or get custom outfits stitched in 24 hours — bridal lehengas, designer blouses & more. Call/WhatsApp today.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Shreya Creation",
  },
  description: siteDescription,
  alternates: {
    types: {
      "text/markdown": "/llms.txt",
    },
  },
  applicationName: "Shreya Creation",
  authors: [{ name: "Shreya Creation", url: siteUrl }],
  creator: "Shreya Creation",
  publisher: "Shreya Creation",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: LOGO_SRC, sizes: "32x32", type: "image/png" },
      { url: LOGO_SRC, sizes: "192x192", type: "image/png" },
      { url: LOGO_SRC, sizes: "512x512", type: "image/png" },
    ],
    apple: LOGO_SRC,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Shreya Creation",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Shreya Creation — fashion boutique institute and stitching studio in Patna",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [DEFAULT_OG_IMAGE],
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
        },
      }
    : {}),
  other: {
    "p:domain_verify": "ab028a1a14ac0f537f56f869983f8c04",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0710" },
    { media: "(prefers-color-scheme: light)", color: "#CC4F06" },
  ],
};

export default async function RootLayout({ children }) {
  const site = await getSiteSettings();
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "en";
  const htmlLang = locale === "hi" ? "hi" : "en";

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="anonymous" />
        ) : null}
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="alternate" type="text/markdown" href={`${siteUrl}/llms.txt`} title="LLM site index" />
      </head>
      <body className={cn(BG_ATMOSPHERE, "has-mobile-contact-bar")} suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <JsonLd site={site} />
        <Analytics />
        <ThemeScript />
        <ThemeProvider>
          <LanguageProvider>
            <ScrollReveal />
            <SiteProtection />
            <Navbar site={site} />
            <main id="main-content" className="relative z-0 flex-1 min-w-0 w-full overflow-x-hidden">{children}</main>
            <Footer site={site} />
            <MobileContactBar site={site} />
            <WhatsAppAssistant number={site.whatsapp} />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
