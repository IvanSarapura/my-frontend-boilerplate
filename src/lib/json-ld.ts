type JsonLdWebSite = {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
};

export function generateWebsiteJsonLd({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description: string;
}): JsonLdWebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
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
