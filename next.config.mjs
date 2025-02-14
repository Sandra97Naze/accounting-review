import path from 'path';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['next'],
  
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
