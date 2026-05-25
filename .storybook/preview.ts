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
      // a11y violations fail the story. If intentional, override per story via
      // `parameters.a11y.config.rules` with a justifying comment ('todo'/'off' relax this).
      test: 'error',
    },
  },
};

export default preview;
