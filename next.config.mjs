/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  images: {
    remotePatterns: [
      // Supabase Storage public URLs
      { protocol: "https", hostname: "*.supabase.co" },
      // Unsplash placeholders used in the fallback seed data
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
