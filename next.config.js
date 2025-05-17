/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable TypeScript type checking during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Also ignore ESLint errors during the build
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals.push({
      'three/examples/jsm/controls/OrbitControls': 'OrbitControls',
      'three/examples/jsm/loaders/GLTFLoader': 'GLTFLoader',
    });
    return config;
  },
}

module.exports = nextConfig 