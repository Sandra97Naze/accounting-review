/** @type {import('next').NextConfig} */
const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['next'],
  
  webpack: (config, { isServer }) => {
    // Expand alias configuration to include multiple service paths
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/utils': path.resolve(__dirname, 'src/utils')
    };

    // Maintain existing fallback configuration for Node modules
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

module.exports = withBundleAnalyzer(nextConfig);
