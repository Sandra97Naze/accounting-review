const { nextConfig } = require('next/core-web-vitals');

module.exports = {
  ...nextConfig,
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn', // Transformer en warning
    '@typescript-eslint/no-explicit-any': 'warn', 
    'react/no-unescaped-entities': 'off', 
    'react/jsx-no-comment-textnodes': 'off',
    'react/jsx-no-undef': 'warn',
    'react-hooks/exhaustive-deps': 'warn'
  },
  ignores: [
    'node_modules/',
    '.next/',
    'dist/',
    'build/',
    'public/'
  ]
};
