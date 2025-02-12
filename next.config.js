/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  webpack: (config, { isServer }) => {
    // Conservez votre configuration existante pour ts-loader
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

    // Conservez vos configurations de résolution d'extensions
    config.resolve.extensions.push('.ts', '.tsx');

    // Conservez vos configurations de fallback
    config.resolve.fallback = { 
      fs: false,
      path: false,
      stream: false 
    };
    
    // Ajoutez la gestion des modules externes si nécessaire
    config.externals = config.externals || [];
    // Vous pouvez ajouter des configurations de modules externes ici si besoin
    
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
