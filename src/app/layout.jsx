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
import { chromeSiteProps } from "@/lib/site-config";
import { getSiteUrl } from "@/lib/siteUrl";
import JsonLd from "@/components/JsonLd";

const siteUrl = getSiteUrl();

const siteTitle = "Best Boutique in Patna | Shreya Creation";
const siteDescription =
  "Discover Shreya Creation, the best boutique in Patna, offering designer bridal wear, custom stitching, stylish outfits, exquisite detailing, and personalised fashion solutions.";

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
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "shreyacreation",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: MEDIA.slider3,
        secureUrl: MEDIA.slider1,
        alt: "Best Boutique in Patna",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [MEDIA.slider3],
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
        },
      }
    : {}),
  other: {
    "twitter:url": `${siteUrl}/`,
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
  const chrome = chromeSiteProps(site);

  return (
    <html lang="en" className={latinFontVariables} suppressHydrationWarning>
      <head>
        {/* Google tag */}
        <script async src="https://www.googletagmanager.com/gtm.js?id=AW-11033186057"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`,
          }}
        />
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
        <JsonLd site={chrome} />
        <Analytics />
        <ThemeScript />
        <ThemeProvider>
          <LanguageProvider>
            <ScrollReveal />
            <SiteProtection />
            <Navbar site={chrome} />
            <main id="main-content" className="relative z-0 flex-1 min-w-0 w-full overflow-x-hidden">{children}</main>
            <Footer site={chrome} />
            <MobileContactBar site={chrome} />
            <WhatsAppAssistant number={chrome.whatsapp} />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
