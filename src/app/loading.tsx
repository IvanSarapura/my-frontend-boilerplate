import { Spinner } from '@/components/ui/spinner';

import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <Spinner size="lg" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
