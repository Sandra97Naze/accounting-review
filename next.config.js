import path from 'path';
import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react']
  },

  webpack: (config, { isServer }) => {
    // Résolution d'alias pour @
    config.resolve.alias['@'] = path.resolve(process.cwd(), 'src');
    
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

// Export avec l'analyseur de bundle
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})(nextConfig);
