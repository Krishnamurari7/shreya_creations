/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    return [{ source: "/lookbook", destination: "/blog", permanent: true }];
  },
};

export default nextConfig;
