import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Ensure Prisma query engine and native modules are included in trace
  outputFileTracingIncludes: {
    "/": [
      "./node_modules/.prisma/client/**/*",
      "./prisma/**/*",
    ],
  },
  // Explicitly externalize Prisma to ensure it's not bundled
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
