import styles from '../loading.module.css';

export default function LocaleLoading() {
  return (
    <div role="status" aria-label="Loading" className={styles.container}>
      <div className={styles.spinner} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
