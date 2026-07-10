import { headers } from 'next/headers';

import {
  LEGACY_THEME_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from '@/components/providers/theme-storage-key';
import {
  generateOrganizationJsonLd,
  generateWebsiteJsonLd,
  serializeJsonLd,
} from '@/lib/json-ld';

// Anti-FOUC: applies data-theme before first paint. Reads the namespaced key
// (shared with theme-provider via theme-storage-key), falling back to and
// migrating the legacy key one time (P3-02).
const THEME_INIT_SCRIPT = `(function(){try{var K=${JSON.stringify(THEME_STORAGE_KEY)},L=${JSON.stringify(LEGACY_THEME_STORAGE_KEY)};var t=localStorage.getItem(K);if(t!=='light'&&t!=='dark'&&t!=='system'){var l=localStorage.getItem(L);if(l==='light'||l==='dark'||l==='system'){t=l;localStorage.setItem(K,l);localStorage.removeItem(L);}}if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

type HeadScriptsProps = {
  appName: string;
  appUrl: string;
  description: string;
  locale: string;
};

// Renders nonce-bound inline scripts in <head>: theme init + JSON-LD.
// MUST be wrapped in <Suspense> at the call site so reading the nonce via
// headers() doesn't opt the whole layout out of PPR. See README → proxy.ts.
export async function HeadScripts({
  appName,
  appUrl,
  description,
  locale,
}: HeadScriptsProps) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  const websiteJsonLd = generateWebsiteJsonLd({
    name: appName,
    // Localized so /en and /es emit distinct WebSite nodes (hreflang signal).
    url: `${appUrl}/${locale}`,
    description,
    inLanguage: locale,
  });
  // Organization is the language-neutral entity — keep its canonical (bare) url.
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
