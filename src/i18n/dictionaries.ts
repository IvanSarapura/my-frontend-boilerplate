import 'server-only';

import { cache } from 'react';

import type { Locale, Messages } from '@/i18n/config';

const load = async (
  loader: () => Promise<{ default: unknown }>,
): Promise<Messages> => (await loader()).default as Messages;

const loaders: Record<Locale, () => Promise<Messages>> = {
  en: () => load(() => import('@/i18n/messages/en.json')),
  es: () => load(() => import('@/i18n/messages/es.json')),
};

export const getDictionary = cache(
  async (locale: Locale): Promise<Messages> => loaders[locale](),
);
