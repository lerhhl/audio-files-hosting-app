import type { NextConfig } from "next";
import { MAX_FILE_UPLOAD_SIZE } from "./src/app/constants";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: `${MAX_FILE_UPLOAD_SIZE.mb}mb`,
    },
  },
};

export default nextConfig;
