/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      path: false,
      stream: false 
    };
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
  },
};

module.exports = nextConfig;
