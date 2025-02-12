/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['next'],
  
  webpack: (config, { isServer }) => {
    // Résolution d'alias pour @
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');

    // Configuration du loader TypeScript
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
              moduleResolution: 'node'
            }
          }
        }
      ],
      exclude: /node_modules/
    });

    // Extensions
    config.resolve.extensions.push('.ts', '.tsx');

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

module.exports = nextConfig;
