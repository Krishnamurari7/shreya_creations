/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "react-pdf", "pdfjs-dist"],
  images: {
    formats: ["image/avif", "image/webp"],
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
