import "./globals.css";
import { latinFontVariables } from "@/lib/fonts";
import { MEDIA } from "@/lib/media";
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

  return (
    <html lang="en" className={latinFontVariables} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/background-mobile.webp"
          type="image/webp"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href={MEDIA.background}
          type="image/webp"
          media="(min-width: 768px)"
          fetchPriority="high"
        />
        {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="anonymous" />
        ) : null}
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
