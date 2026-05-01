// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactCompiler from 'eslint-plugin-react-compiler';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = defineConfig([...nextVitals, ...nextTs, {
  plugins: { 'react-compiler': reactCompiler },
  rules: { 'react-compiler/react-compiler': 'error' },
}, {
  // eslint-config-next already registers jsx-a11y; just extend the rules
  rules: {
    ...jsxA11y.configs.recommended.rules,
    // Next.js <Link> renders <a> without explicit href in JSX
    'jsx-a11y/anchor-is-valid': 'off',
  },
}, {
  plugins: { import: importPlugin },
  rules: {
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off', // TypeScript resolver handles this
  },
}, {
  plugins: { 'simple-import-sort': simpleImportSort },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}, prettier, globalIgnores([
  '.next/**',
  'out/**',
  'build/**',
  'next-env.d.ts',
  'coverage/**',
]), ...storybook.configs["flat/recommended"]]);

export default eslintConfig;
