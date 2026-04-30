import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Frontend Boilerplate</h1>
      <p className={styles.subtitle}>
        Next.js · TypeScript · Vitest · Prettier · ESLint
      </p>
    </main>
  );
}
