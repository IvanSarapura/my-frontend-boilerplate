import { headers } from 'next/headers';

import {
  generateOrganizationJsonLd,
  generateWebsiteJsonLd,
  serializeJsonLd,
} from '@/lib/json-ld';

// Anti-FOUC: applies data-theme before first paint. Keep in sync with
// src/components/providers/theme-provider.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

type HeadScriptsProps = {
  appName: string;
  appUrl: string;
  description: string;
};

// Renders nonce-bound inline scripts in <head>: theme init + JSON-LD.
// MUST be wrapped in <Suspense> at the call site so reading the nonce via
// headers() doesn't opt the whole layout out of PPR. See README → proxy.ts.
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

  // suppressHydrationWarning: browsers strip the nonce attribute after CSP
  // enforcement (CSP3 §6.6.4.6), causing a benign mismatch. See README → proxy.ts.
  return (
    <>
      <script
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
      />
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
      />
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(organizationJsonLd),
        }}
      />
    </>
  );
}
