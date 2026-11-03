import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Jusqu'au 4K pour les grands écrans — Next n'agrandit jamais au-delà de la source.
    deviceSizes: [360, 420, 640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3840],
    imageSizes: [48, 64, 96, 128, 256, 384],
    qualities: [60, 70, 75, 80, 85, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
