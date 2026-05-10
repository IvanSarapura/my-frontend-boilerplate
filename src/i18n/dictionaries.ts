import 'server-only';

import type { Locale, Messages } from '@/i18n/config';

const loaders: Record<Locale, () => Promise<Messages>> = {
  en: () =>
    import('@/i18n/messages/en.json').then(
      (m) => m.default as unknown as Messages,
    ),
  es: () =>
    import('@/i18n/messages/es.json').then(
      (m) => m.default as unknown as Messages,
    ),
};

export async function getDictionary(locale: Locale): Promise<Messages> {
  return loaders[locale]();
}
