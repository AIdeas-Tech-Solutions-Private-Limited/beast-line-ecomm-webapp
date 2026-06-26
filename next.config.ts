import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Keep standalone output flat when a parent directory also has a lockfile
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
