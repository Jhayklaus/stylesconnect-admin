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
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
