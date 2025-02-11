// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Pour génération statique
  trailingSlash: true,
  
  // Configuration pour Netlify
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/companies': { page: '/companies' },
      '/login': { page: '/login' }
    }
  }
}

module.exports = nextConfig
