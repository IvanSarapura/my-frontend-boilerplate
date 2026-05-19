import '@/app/globals.css';

import type { Preview } from '@storybook/nextjs-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations (active policy as of Round 12)
      // 'off' - skip a11y checks entirely
      //
      // Stories surface accessibility violations as errors. Fix the component
      // (preferred) or, if the violation is intentional and justified, add a
      // per-story `parameters.a11y.config.rules` override with a comment
      // explaining why. CI integration via `test-storybook` is a follow-up
      // task — today this flag drives the Storybook UI signal.
      test: 'error',
    },
  },
};

export default preview;
