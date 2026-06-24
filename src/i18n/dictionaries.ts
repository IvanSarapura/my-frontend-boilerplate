import 'server-only';

import { cache } from 'react';

import {
  defaultLocale,
  isLocale,
  type Locale,
  type Messages,
} from '@/i18n/config';

const load = async (
  loader: () => Promise<{ default: unknown }>,
): Promise<Messages> => (await loader()).default as Messages;

const loaders: Record<Locale, () => Promise<Messages>> = {
  en: () => load(() => import('@/i18n/messages/en.json')),
  es: () => load(() => import('@/i18n/messages/es.json')),
};

// Self-defending: an unknown locale falls back to the default instead of
// throwing (a 500). Callers can pass a raw route string without casting.
export const getDictionary = cache(
  async (locale: string): Promise<Messages> =>
    loaders[isLocale(locale) ? locale : defaultLocale](),
);
