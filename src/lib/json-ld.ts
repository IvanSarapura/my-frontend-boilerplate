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
