module.exports = {
  extends: [
    'next/core-web-vitals'
  ],
  rules: {
    // Custom ESLint rules can be added here
  },
  // Remove any references to useEslintrc and extensions
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  }
};
