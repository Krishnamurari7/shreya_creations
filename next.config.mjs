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
    // The nav label is "Lookbook" and the route is /lookbook; /blog only ever existed
    // in inbound links and the old nav label.
    return [{ source: "/blog", destination: "/lookbook", permanent: true }];
  },
};

export default nextConfig;
