/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "react-pdf", "pdfjs-dist"],
  images: {
    remotePatterns: [
      // Supabase Storage public URLs
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async redirects() {
    // Public nav uses Blog at /blog; keep /lookbook working for old inbound links.
    return [{ source: "/lookbook", destination: "/blog", permanent: true }];
  },
};

export default nextConfig;
