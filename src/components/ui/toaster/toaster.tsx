'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
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

  // Pausable auto-dismiss: clear the timer on hover/focus and resume with the
  // time left on leave/blur, so a reader can keep a toast up (WCAG 2.2.1).
  const remainingRef = useRef(TOAST_FADE_START_MS);
  const startRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    clearTimer();
    startRef.current = Date.now();
    timerRef.current = setTimeout(() => setLeaving(true), remainingRef.current);
  }, [clearTimer]);

  const pause = useCallback(() => {
    if (timerRef.current === null) return;
    clearTimer();
    remainingRef.current -= Date.now() - startRef.current;
  }, [clearTimer]);

  useEffect(() => {
    resume();
    return clearTimer;
  }, [resume, clearTimer]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => onRemove(id), TOAST_REMOVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [leaving, id, onRemove]);

  return (
    <div
      className={cx(styles.toast, styles[variant], leaving && styles.leaving)}
      // error toasts get an assertive live region; the rest stay polite via the
      // container's aria-live="polite".
      {...(variant === 'error' ? { role: 'alert' } : {})}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
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

export type ToasterProps = {
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
          onRemove={removeToast}
          dismissLabel={dismissLabel}
        />
      ))}
    </div>,
    document.body,
  );
}
