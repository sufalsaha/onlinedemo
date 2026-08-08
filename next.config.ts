/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the local (Windows) Prisma query engine out of the serverless bundle —
  // it is unusable on Vercel's Linux runtime and each copy is ~21MB.
  outputFileTracingExcludes: {
    "/*": ["generated/prisma/**/*.tmp*", "generated/prisma/**/*windows*"],
  },
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Change "10mb" to whatever size you need (e.g., "50mb")
    },
  },
};

export default nextConfig;