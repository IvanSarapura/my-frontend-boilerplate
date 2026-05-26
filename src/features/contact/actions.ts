'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { defaultLocale, type Locale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

import { getContactSchema } from './schemas';

export type ContactState =
  | { success: false; errors: Record<string, string[]> }
  | { success: true; message: string };

const LOCALE_COOKIE = 'NEXT_LOCALE';

async function getLocaleFromCookie(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value && (locales as readonly string[]).includes(value)
    ? (value as Locale)
    : defaultLocale;
}

export async function submitContactAction(
  _prevState: ContactState | null,
  formData: FormData,
): Promise<ContactState> {
  const locale = await getLocaleFromCookie();
  const messages = await getDictionary(locale);
  const schema = getContactSchema(messages.errors.contact);

  const raw = {
    name: formData.get('name')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    message: formData.get('message')?.toString() ?? '',
  };

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  // Envío opt-in: conectar aquí un email transaccional (Resend, Postmark…).

  return {
    success: true,
    message: messages.contact.successMessage,
  };
}
