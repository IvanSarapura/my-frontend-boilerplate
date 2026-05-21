'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import {
  TOAST_DURATION_MS,
  useToast,
} from '@/components/providers/toast-provider';
import { Icon, type IconName } from '@/components/ui/icon';
import { cx } from '@/lib/utils';

import styles from './toaster.module.css';

type ToastVariant = 'default' | 'success' | 'error' | 'warning';

const VARIANT_ICONS: Record<ToastVariant, IconName> = {
  default: 'info',
  success: 'success',
  error: 'error',
  warning: 'warning',
};

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

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
  variant?: ToastVariant;
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
      <div className={styles.iconWrapper}>
        <Icon name={VARIANT_ICONS[variant]} size={20} />
      </div>
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
        <Icon name="close" size={16} />
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
      {toasts.map(toast => (
        <ToastItem key={toast.id} {...toast} onRemove={handleRemove} />
      ))}
    </div>,
    document.body,
  );
}
