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
  }
};

module.exports = nextConfig;
