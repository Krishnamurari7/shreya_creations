import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },
  transpilePackages: ["three", "react-pdf", "pdfjs-dist"],
  images: {
    formats: ["image/avif", "image/webp"],
    // OpenNext Cloudflare only serves qualities listed here (default is [75]).
    // Requests with other q= values return 400 and show broken images.
    qualities: [65, 75, 80],
    deviceSizes: [360, 414, 640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 150, 220, 256, 384],
    remotePatterns: [
      // Supabase Storage public URLs (CMS uploads; founder photos are self-hosted)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async redirects() {
    // Public nav uses Blog at /blog; keep /lookbook working for old inbound links.
    return [
      { source: "/lookbook", destination: "/blog", permanent: true },
      {
        source: "/courses/fashion-designing-course",
        destination: "/courses/boutique-master-commando-training",
        permanent: true,
      },
      {
        source: "/hi/courses/fashion-designing-course",
        destination: "/hi/courses/boutique-master-commando-training",
        permanent: true,
      },
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(self), usb=()",
      },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "Content-Security-Policy-Report-Only",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.youtube.com https://www.instagram.com https://maps.googleapis.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https: *.supabase.co https://www.facebook.com https://www.google-analytics.com",
          "font-src 'self' data:",
          "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://connect.facebook.net https://www.facebook.com",
          "frame-src 'self' https://*.supabase.co https://www.youtube.com https://www.google.com https://maps.google.com https://www.instagram.com https://www.googletagmanager.com",
          "frame-ancestors 'self'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      },
    ];
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
