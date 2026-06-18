import "./globals.css";
// Self-hosted fonts (bundled, no build-time network fetch)
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/jost/300.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "@fontsource/jost/600.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppAssistant from "@/components/WhatsAppAssistant";
import ScrollReveal from "@/components/ScrollReveal";
import SiteProtection from "@/components/SiteProtection";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeScript from "@/components/ThemeScript";
import { getSiteSettings } from "@/lib/data";
import { BRAND_MESSAGE_HI, SERVICE_USP_HI } from "@/lib/i18n";

export const metadata = {
  title: `Shreya creation — ${BRAND_MESSAGE_HI}`,
  description:
    `${BRAND_MESSAGE_HI} — bespoke stitching, bridal couture & fashion courses in Patna. ${SERVICE_USP_HI}. Order on WhatsApp.`,
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Shreya creation",
    description: "Couture stitching & fashion courses. Order on WhatsApp.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0710" },
    { media: "(prefers-color-scheme: light)", color: "#FFF9F0" },
  ],
};

export default async function RootLayout({ children }) {
  const site = await getSiteSettings();
  return (
    <html lang={site.defaultLanguage === "hi" ? "hi" : "en"} suppressHydrationWarning>
      <body className="bg-atmosphere">
        <ThemeScript />
        <ThemeProvider>
          <LanguageProvider defaultLang={site.defaultLanguage}>
            <ScrollReveal />
            <SiteProtection />
            <Navbar site={site} />
            <main className="relative z-0 flex-1 min-w-0 w-full overflow-x-hidden">{children}</main>
            <Footer site={site} />
            <WhatsAppAssistant number={site.whatsapp} />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
