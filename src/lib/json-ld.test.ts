import { describe, expect, it } from 'vitest';

import {
  generateBreadcrumbListJsonLd,
  generateOrganizationJsonLd,
  generateWebsiteJsonLd,
  serializeJsonLd,
} from './json-ld';

describe('generateWebsiteJsonLd', () => {
  it('returns a valid WebSite JSON-LD payload', () => {
    expect(
      generateWebsiteJsonLd({
        name: 'Test',
        url: 'https://test.example.com',
        description: 'A test site',
      }),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Test',
      url: 'https://test.example.com',
      description: 'A test site',
    });
  });
});

describe('generateOrganizationJsonLd', () => {
  const baseInput = { name: 'Acme', url: 'https://acme.example.com' };

  it('omits logo and sameAs when neither is provided', () => {
    const result = generateOrganizationJsonLd(baseInput);

    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Acme',
      url: 'https://acme.example.com',
    });
    expect(result).not.toHaveProperty('logo');
    expect(result).not.toHaveProperty('sameAs');
  });

  it('includes logo when provided', () => {
    const result = generateOrganizationJsonLd({
      ...baseInput,
      logo: 'https://acme.example.com/logo.png',
    });

    expect(result.logo).toBe('https://acme.example.com/logo.png');
    expect(result).not.toHaveProperty('sameAs');
  });

  it('omits sameAs when the array is empty (length === 0 branch)', () => {
    const result = generateOrganizationJsonLd({
      ...baseInput,
      sameAs: [],
    });

    expect(result).not.toHaveProperty('sameAs');
  });

  it('includes sameAs when the array has entries', () => {
    const result = generateOrganizationJsonLd({
      ...baseInput,
      sameAs: ['https://twitter.com/acme', 'https://github.com/acme'],
    });

    expect(result.sameAs).toEqual([
      'https://twitter.com/acme',
      'https://github.com/acme',
    ]);
  });

  it('includes both logo and sameAs when both are provided', () => {
    const result = generateOrganizationJsonLd({
      ...baseInput,
      logo: 'https://acme.example.com/logo.png',
      sameAs: ['https://twitter.com/acme'],
    });

    expect(result).toMatchObject({
      logo: 'https://acme.example.com/logo.png',
      sameAs: ['https://twitter.com/acme'],
    });
  });
});

describe('generateBreadcrumbListJsonLd', () => {
  it('returns an empty itemListElement for an empty input array', () => {
    expect(generateBreadcrumbListJsonLd([])).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [],
    });
  });

  it('emits a single ListItem with position 1 for one input', () => {
    const result = generateBreadcrumbListJsonLd([
      { name: 'Home', url: 'https://example.com/' },
    ]);

    expect(result.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://example.com/',
      },
    ]);
  });

  it('assigns sequential positions starting at 1 for multiple items', () => {
    const result = generateBreadcrumbListJsonLd([
      { name: 'Home', url: 'https://example.com/' },
      { name: 'Posts', url: 'https://example.com/posts' },
      { name: 'Post 42', url: 'https://example.com/posts/42' },
    ]);

    expect(result.itemListElement.map(item => item.position)).toEqual([
      1, 2, 3,
    ]);
    expect(result.itemListElement.map(item => item.name)).toEqual([
      'Home',
      'Posts',
      'Post 42',
    ]);
  });
});

describe('serializeJsonLd', () => {
  it('escapes characters that could break out of a <script> block', () => {
    const json = serializeJsonLd(
      generateWebsiteJsonLd({
        name: '</script><img src=x onerror=alert(1)>',
        url: 'https://example.com',
        description: 'a & b',
      }),
    );

    expect(json).not.toContain('<');
    expect(json).not.toContain('>');
    expect(json).toContain('\\u003c');
    expect(json).toContain('\\u003e');
    expect(json).toContain('\\u0026');
  });

  it('still produces valid JSON that round-trips to the original object', () => {
    const data = generateWebsiteJsonLd({
      name: 'A & B </script>',
      url: 'https://example.com',
      description: 'desc',
    });
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
});
