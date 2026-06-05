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
import { LanguageProvider } from "@/components/LanguageProvider";
import { getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "Shreya Creations — Couture Atelier & Fashion Courses",
  description:
    "Lehengas, gowns, blouses and bridal wear stitched to your size in 24 hours. Plus fashion-design courses. Order & enroll on WhatsApp.",
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
    title: "Shreya Creations",
    description: "Couture stitching & fashion courses. Order on WhatsApp.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }) {
  const site = await getSiteSettings();
  return (
    <html lang={site.defaultLanguage === "hi" ? "hi" : "en"}>
      <body className="bg-atmosphere">
        <LanguageProvider defaultLang={site.defaultLanguage}>
          <ScrollReveal />
          <Navbar site={site} />
          <main className="relative z-0 flex-1 min-w-0 w-full overflow-x-hidden">{children}</main>
          <Footer site={site} />
          <WhatsAppAssistant number={site.whatsapp} />
        </LanguageProvider>
      </body>
    </html>
  );
}
