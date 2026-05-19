import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HeadScripts } from './head-scripts';

// Mock next/headers — controlled per test via mockHeadersGet.
const mockHeadersGet = vi.fn<(name: string) => string | null>();

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve({ get: mockHeadersGet }),
}));

const TEST_PROPS = {
  appName: 'Test App',
  appUrl: 'https://test.example.com',
  description: 'Test description',
};

function getScripts(container: HTMLElement): HTMLScriptElement[] {
  return Array.from(container.querySelectorAll('script'));
}

describe('HeadScripts', () => {
  beforeEach(() => {
    mockHeadersGet.mockReset();
  });

  it('renders exactly three <script> elements', async () => {
    mockHeadersGet.mockReturnValue('nonce-abc');
    const jsx = await HeadScripts(TEST_PROPS);
    const { container } = render(jsx);
    expect(getScripts(container)).toHaveLength(3);
  });

  it('applies the nonce from x-nonce to every script tag', async () => {
    mockHeadersGet.mockImplementation((name) =>
      name === 'x-nonce' ? 'nonce-abc' : null,
    );
    const jsx = await HeadScripts(TEST_PROPS);
    const { container } = render(jsx);
    const scripts = getScripts(container);
    scripts.forEach((script) => {
      expect(script.getAttribute('nonce')).toBe('nonce-abc');
    });
  });

  it('omits the nonce attribute when x-nonce is absent (graceful degrade)', async () => {
    mockHeadersGet.mockReturnValue(null);
    const jsx = await HeadScripts(TEST_PROPS);
    const { container } = render(jsx);
    const scripts = getScripts(container);
    scripts.forEach((script) => {
      expect(script.hasAttribute('nonce')).toBe(false);
    });
  });

  it('first script contains the anti-FOUC theme init payload', async () => {
    mockHeadersGet.mockReturnValue('nonce-abc');
    const jsx = await HeadScripts(TEST_PROPS);
    const { container } = render(jsx);
    const [themeScript] = getScripts(container);
    expect(themeScript?.innerHTML).toContain("localStorage.getItem('theme')");
    expect(themeScript?.innerHTML).toContain('data-theme');
    expect(themeScript?.getAttribute('type')).toBeNull();
  });

  it('emits a valid WebSite JSON-LD with the provided app metadata', async () => {
    mockHeadersGet.mockReturnValue('nonce-abc');
    const jsx = await HeadScripts(TEST_PROPS);
    const { container } = render(jsx);
    const [, websiteScript] = getScripts(container);
    expect(websiteScript?.getAttribute('type')).toBe('application/ld+json');
    const payload = JSON.parse(websiteScript?.innerHTML ?? '{}');
    expect(payload).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Test App',
      url: 'https://test.example.com',
      description: 'Test description',
    });
  });

  it('emits a valid Organization JSON-LD with the provided app metadata', async () => {
    mockHeadersGet.mockReturnValue('nonce-abc');
    const jsx = await HeadScripts(TEST_PROPS);
    const { container } = render(jsx);
    const [, , orgScript] = getScripts(container);
    expect(orgScript?.getAttribute('type')).toBe('application/ld+json');
    const payload = JSON.parse(orgScript?.innerHTML ?? '{}');
    expect(payload).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Test App',
      url: 'https://test.example.com',
    });
  });
});
