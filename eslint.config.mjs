import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import reactCompiler from 'eslint-plugin-react-compiler';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: { 'react-compiler/react-compiler': 'error' },
  },
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
