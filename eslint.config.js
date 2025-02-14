import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
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
  }
];

export default eslintConfig;
