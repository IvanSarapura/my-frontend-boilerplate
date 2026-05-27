'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import {
  TOAST_DURATION_MS,
  useToast,
} from '@/components/providers/toast-provider';
import {
  CloseIcon,
  ErrorIcon,
  type IconComponent,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from '@/components/ui/icon';
import { cx } from '@/lib/utils';

import styles from './toaster.module.css';

type ToastVariant = 'default' | 'success' | 'error' | 'warning';

const VARIANT_ICONS: Record<ToastVariant, IconComponent> = {
  default: InfoIcon,
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
};

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    /* v8 ignore next -- getServerSnapshot only runs during SSR; jsdom is client-only */
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
  dismissLabel,
}: {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  onRemove: (id: string) => void;
  dismissLabel: string;
}) {
  const [leaving, setLeaving] = useState(false);
  const VariantIcon = VARIANT_ICONS[variant];

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
        <VariantIcon size={20} />
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <button
        type="button"
        className={styles.close}
        onClick={() => setLeaving(true)}
        aria-label={dismissLabel}
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}

type ToasterProps = {
  /** Accessible name for the toast region. Pass a localized string. */
  regionLabel?: string;
  /** Accessible name for each toast's dismiss button. Pass a localized string. */
  dismissLabel?: string;
};

export function Toaster({
  regionLabel = 'Notifications',
  dismissLabel = 'Dismiss notification',
}: ToasterProps) {
  const isClient = useIsClient();
  const { toasts, removeToast } = useToast();

  const handleRemove = useCallback(
    (id: string) => removeToast(id),
    [removeToast],
  );

  /* v8 ignore next -- SSR guard; useIsClient is always true under jsdom */
  if (!isClient) return null;

  return createPortal(
    <div
      className={styles.toaster}
      role="region"
      aria-live="polite"
      aria-label={regionLabel}
    >
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          {...toast}
          onRemove={handleRemove}
          dismissLabel={dismissLabel}
        />
      ))}
    </div>,
    document.body,
  );
}
