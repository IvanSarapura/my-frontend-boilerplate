import { headers } from 'next/headers';

import {
  generateOrganizationJsonLd,
  generateWebsiteJsonLd,
} from '@/lib/json-ld';

// Theme init runs synchronously before first paint to apply data-theme
// from localStorage, preventing flash of incorrect theme on reload.
// Keep in sync with the contract in src/components/providers/theme-provider.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

type HeadScriptsProps = {
  appName: string;
  appUrl: string;
  description: string;
};

/**
 * Renders nonce-bound inline scripts in <head>: anti-FOUC theme init
 * + WebSite/Organization JSON-LD for SEO. Reads the CSP nonce from
 * request headers (set by src/proxy.ts).
 *
 * MUST be wrapped in <Suspense> at the call site. Calling `headers()`
 * directly in the root layout would force the entire app into dynamic
 * rendering and disable PPR (Cache Components). Isolated here, only
 * these script tags resolve per request; the rest of the layout shell
 * stays pre-renderable.
 */
export async function HeadScripts({
  appName,
  appUrl,
  description,
}: HeadScriptsProps) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  const websiteJsonLd = generateWebsiteJsonLd({
    name: appName,
    url: appUrl,
    description,
  });
  const organizationJsonLd = generateOrganizationJsonLd({
    name: appName,
    url: appUrl,
  });

  return (
    <>
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
      />
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
    </>
  );
}
