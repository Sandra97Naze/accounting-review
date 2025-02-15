import path from 'path';
import withBundleAnalyzer from '@next/bundle-analyzer';
@type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Configuration pour améliorer le caching
  experimental: {
    // Optimisations pour le build
    optimizeCss: true,
    optimizePackageImports: ['lucide-react']
  }
}

module.exports = nextConfig
  
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

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})(nextConfig);
