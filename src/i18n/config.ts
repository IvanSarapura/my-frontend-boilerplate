import type en from './messages/en.json';

export type Locale = 'en' | 'es';

export const defaultLocale: Locale = 'en';

export const locales: Locale[] = ['en', 'es'];

export type Messages = typeof en;

export async function getMessages(locale: Locale): Promise<Messages> {
  const messages = await import(`./messages/${locale}.json`);
  return messages.default as Messages;
}
