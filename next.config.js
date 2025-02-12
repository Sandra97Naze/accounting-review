/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty',
        child_process: 'empty'
      };
    }
    
    // Extensions
    config.resolve.extensions.push('.ts', '.tsx');
    
    // Fallbacks
    config.resolve.fallback = {
      fs: false,
      path: false,
      stream: false
    };
    
    // Modules externes
    config.externals = config.externals || [];
    
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
}

module.exports = nextConfig
