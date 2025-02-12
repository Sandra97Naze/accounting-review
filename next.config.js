/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Pour le déploiement sur Netlify
  
  // Gestion des redirections
  async redirects() {
    return [
      {
        source: '/companies',
        destination: '/',
        permanent: false
      }
    ];
  },

  // Nouvelle configuration webpack pour xlsx
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      path: false,
      stream: false 
    };
    return config;
  },
};

module.exports = nextConfig;
