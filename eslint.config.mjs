// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactCompiler from 'eslint-plugin-react-compiler';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import storybook from 'eslint-plugin-storybook';
import testingLibrary from 'eslint-plugin-testing-library';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: { 'react-compiler/react-compiler': 'error' },
  },
  {
    // eslint-config-next already registers jsx-a11y; just extend the rules
    rules: {
      ...jsxA11y.configs.recommended.rules,
      // Next.js <Link> renders <a> without explicit href in JSX
      'jsx-a11y/anchor-is-valid': 'off',
    },
  },
  {
    plugins: { import: importPlugin },
    rules: {
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off', // TypeScript resolver handles this
    },
  },
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    ...security.configs.recommended,
    rules: {
      ...security.configs.recommended.rules,
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-possible-timing-attacks': 'off',
    },
  },
  {
    // Scope to Vitest + React Testing Library tests only.
    // Playwright e2e specs (e2e/*.spec.ts) use a different API and are excluded.
    files: ['src/**/*.test.{ts,tsx}'],
    plugins: { 'testing-library': testingLibrary },
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      // Off: UI primitive tests (Skeleton, Spinner, decorative wrappers) must
      // inspect DOM nodes that lack ARIA roles — these rules force adding
      // synthetic test IDs to internal nodes, which is itself an antipattern.
      'testing-library/no-node-access': 'off',
      'testing-library/no-container': 'off',
    },
  },
  {
    // Production code must import individual icons (CloseIcon, ChevronDownIcon, …),
    // never the dev-only catalog (which pulls all 171 into the bundle).
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/components/ui/icon/icons.test.tsx',
      'src/components/ui/icon/icons.stories.tsx',
      'src/components/ui/icon/icons-registry.dev.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/components/ui/icon/icons-registry.dev',
              message:
                'icons-registry.dev is dev-only (used by Storybook gallery and icon enumeration tests). Production code must import individual icons from "@/components/ui/icon".',
            },
          ],
        },
      ],
    },
  },
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'storybook-static/**',
    'next-env.d.ts',
    'coverage/**',
  ]),
  ...storybook.configs['flat/recommended'],
]);

export default eslintConfig;
