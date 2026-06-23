import "./globals.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
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
    `${BRAND_MESSAGE_HI} — bespoke stitching, bridal couture & 10 fashion courses in Patna. ${SERVICE_USP_HI}. Order on WhatsApp.`,
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
    description: "Couture stitching & 10 professional fashion courses. Order on WhatsApp.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0710" },
    { media: "(prefers-color-scheme: light)", color: "#E8D5A3" },
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
