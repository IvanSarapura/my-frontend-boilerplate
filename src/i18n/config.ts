import type en from './messages/en.json';

export type Locale = 'en' | 'es';

export const defaultLocale: Locale = 'en';

export const locales: Locale[] = ['en', 'es'];

export type Messages = typeof en;

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
