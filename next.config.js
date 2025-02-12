/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  webpack: (config, { isServer }) => {
    // Add TypeScript loader
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
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
      ]
    });

    // Resolve TypeScript and JavaScript extensions
    config.resolve.extensions.push('.ts', '.tsx');

    // Fallback configurations
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
