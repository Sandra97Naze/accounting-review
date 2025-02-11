/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuration pour Netlify
  output: 'standalone', // Recommandé pour Netlify
  
  // Gestion des redirects
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
