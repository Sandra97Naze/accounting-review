import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      '@typescript-eslint': typescriptEslintPlugin
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
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
