import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    // 90 is for the small album covers, where the default 75 shows compression on detailed art.
    qualities: [75, 90],
  },
};

export default nextConfig;
