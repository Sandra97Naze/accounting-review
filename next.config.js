/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['next'],
  
  webpack: (config, { isServer }) => {
    // Résolution d'alias pour @
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');

    // Fallbacks pour les modules Node
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        stream: false,
        child_process: false
      };
    }

    return config;
  },

  async redirects() {
    return [
      {
        source: '/companies',
        destination: '/',
        permanent: false
      }
    ];
  }
};

module.exports = nextConfig;
