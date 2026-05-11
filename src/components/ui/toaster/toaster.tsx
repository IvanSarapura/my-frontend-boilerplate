'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import {
  TOAST_DURATION_MS,
  useToast,
} from '@/components/providers/toast-provider';
import { cx } from '@/lib/utils';

import styles from './toaster.module.css';

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const icons = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const TOAST_FADE_START_MS = TOAST_DURATION_MS - 500;
const TOAST_REMOVE_DELAY_MS = 200;

function ToastItem({
  id,
  title,
  description,
  variant = 'default',
  onRemove,
}: {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  onRemove: (id: string) => void;
}) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLeaving(true), TOAST_FADE_START_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => onRemove(id), TOAST_REMOVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [leaving, id, onRemove]);

  return (
    <div
      className={cx(styles.toast, styles[variant], leaving && styles.leaving)}
    >
      <span className={styles.icon}>{icons[variant]}</span>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <button
        type="button"
        className={styles.close}
        onClick={() => setLeaving(true)}
        aria-label="Dismiss notification"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export function Toaster() {
  const isClient = useIsClient();
  const { toasts, removeToast } = useToast();

  const handleRemove = useCallback(
    (id: string) => removeToast(id),
    [removeToast],
  );

  if (!isClient) return null;

  return createPortal(
    <div
      className={styles.toaster}
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onRemove={handleRemove} />
      ))}
    </div>,
    document.body,
  );
}
