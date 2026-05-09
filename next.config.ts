import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage — thêm sau khi có URL
      // { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
