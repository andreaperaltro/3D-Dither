/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push({
      'three/examples/jsm/controls/OrbitControls': 'OrbitControls',
      'three/examples/jsm/loaders/GLTFLoader': 'GLTFLoader',
    });
    return config;
  },
}

module.exports = nextConfig 