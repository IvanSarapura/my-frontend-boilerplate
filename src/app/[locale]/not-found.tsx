import { cookies } from 'next/headers';
import Link from 'next/link';

import { defaultLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

import styles from '../error.module.css';

// `not-found` receives no params, so the locale comes from the NEXT_LOCALE
// cookie that proxy.ts sets (getDictionary self-defends if it's missing).
export default async function LocaleNotFound() {
  const locale = (await cookies()).get('NEXT_LOCALE')?.value ?? defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>{dict.common.notFound}</p>
      <Link href={`/${locale}`} className={styles.action}>
        {dict.common.backHome}
      </Link>
    </div>
  );
}
