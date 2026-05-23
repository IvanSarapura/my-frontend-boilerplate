import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ICON_CATALOG } from './icons-registry.dev';

describe('Icon catalog', () => {
  it('contains at least one icon', () => {
    expect(ICON_CATALOG.length).toBeGreaterThan(0);
  });

  it('renders an svg with non-empty children for every catalogued icon', () => {
    ICON_CATALOG.forEach(({ name, Component }) => {
      const { container, unmount } = render(<Component aria-label={name} />);
      const svg = container.querySelector('svg');
      expect(svg, `${name} did not render an <svg>`).toBeInTheDocument();
      expect(
        svg?.children.length,
        `${name} rendered an empty <svg>`,
      ).toBeGreaterThan(0);
      unmount();
    });
  });

  it('has unique names', () => {
    const names = ICON_CATALOG.map(({ name }) => name);
    expect(new Set(names).size).toBe(names.length);
  });
});
