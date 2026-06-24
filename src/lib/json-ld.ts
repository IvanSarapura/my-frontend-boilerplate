type JsonLdWebSite = {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  inLanguage: string;
};

export function generateWebsiteJsonLd({
  name,
  url,
  description,
  inLanguage,
}: {
  name: string;
  url: string;
  description: string;
  inLanguage: string;
}): JsonLdWebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    inLanguage,
  };
}

type JsonLdOrganization = {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
};

export function generateOrganizationJsonLd({
  name,
  url,
  logo,
  sameAs,
}: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}): JsonLdOrganization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo && { logo }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
  };
}

type BreadcrumbItem = { name: string; url: string };

type JsonLdBreadcrumbList = {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
};

export function generateBreadcrumbListJsonLd(
  items: BreadcrumbItem[],
): JsonLdBreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type JsonLdArticle = {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  url: string;
  inLanguage: string;
};

export function generateArticleJsonLd({
  headline,
  description,
  url,
  inLanguage,
}: {
  headline: string;
  description: string;
  url: string;
  inLanguage: string;
}): JsonLdArticle {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    inLanguage,
  };
}

// JSON.stringify leaves `<`, `>`, `&` intact, so a value containing
// `</script>` could break out of an inline JSON-LD block. Escape them (plus the
// U+2028/U+2029 line separators) before injecting via dangerouslySetInnerHTML.
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
