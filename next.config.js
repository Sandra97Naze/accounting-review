/** @type {import('next').NextConfig} */
const nextConfig = {
 typescript: {
   ignoreBuildErrors: false
 },
 webpack: (config, { isServer }) => {
   // Configuration ts-loader
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
};

module.exports = nextConfig;
