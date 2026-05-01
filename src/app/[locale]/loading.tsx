import { Spinner } from '@/components/ui/spinner';

import styles from '../loading.module.css';

export default function LocaleLoading() {
  return (
    <div role="status" aria-label="Loading" className={styles.container}>
      <Spinner size="lg" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
