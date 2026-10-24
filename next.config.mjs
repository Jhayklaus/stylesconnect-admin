/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Listing photos and profile pictures are served from the app's S3 bucket.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "style-connect-fashion-bucket.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  // The browser only ever talks to this app; the backend's address stays
  // server-side. Read when the server starts, so changing API_BASE_URL needs a
  // restart (and a rebuild for `next start`).
  async rewrites() {
    const apiBase = process.env.API_BASE_URL;
    if (!apiBase) return [];
    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiBase.replace(/\/+$/, "")}/:path*`,
      },
    ];
  },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
