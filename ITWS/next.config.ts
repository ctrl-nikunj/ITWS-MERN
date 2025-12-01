import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ['jimp', 'discrete-wavelets', 'dct2'],
};

export default nextConfig;
