'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon } from '@/components/ui/icon';
import { useModalBehavior } from '@/hooks/use-modal-behavior';
import { cx } from '@/lib/utils';

import { ModalContext } from './context';
import styles from './modal.module.css';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /**
   * Convenience title. When set, Modal renders title + close button + body;
   * when omitted, it renders `children` for compound composition
   * (`<ModalHeader>`, `<ModalBody>`, `<ModalFooter>`).
   */
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Accessible name for the close button. Pass a localized string. */
  closeLabel?: string;
  /**
   * Accessible name for the dialog. In compound mode (`title` omitted), provide
   * either a `<ModalHeader>` (preferred) or this `ariaLabel`; otherwise the
   * dialog has no accessible name (dev-warned).
   */
  ariaLabel?: string;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  closeLabel = 'Close dialog',
  ariaLabel,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const headerMountedRef = useRef(false);
  const titleId = useId();

  useModalBehavior(open, onClose, overlayRef);

  const registerHeader = useCallback(() => {
    headerMountedRef.current = true;
    return () => {
      headerMountedRef.current = false;
    };
  }, []);

  const isCompound = title === undefined;

  // Dev guardrail: a compound modal with neither a <ModalHeader> nor `ariaLabel`
  // leaves `aria-labelledby` dangling → no accessible name.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (open && isCompound && !ariaLabel && !headerMountedRef.current) {
      console.warn(
        'Modal: compound modal has no accessible name. Render a <ModalHeader> or pass `ariaLabel`.',
      );
    }
  }, [open, isCompound, ariaLabel]);

  if (!open) return null;

  return createPortal(
    <ModalContext.Provider value={{ titleId, registerHeader }}>
      <div
        ref={overlayRef}
        className={styles.overlay}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabel ? undefined : titleId}
        aria-label={ariaLabel}
      >
        <div
          className={cx(
            styles.content,
            isCompound && styles.contentCompound,
            className,
          )}
        >
          {isCompound ? (
            <>
              <button
                type="button"
                className={cx(styles.close, styles.closeFloating)}
                onClick={onClose}
                aria-label={closeLabel}
              >
                <CloseIcon size={20} />
              </button>
              {children}
            </>
          ) : (
            <>
              <div className={styles.header}>
                <h2 id={titleId} className={styles.title}>
                  {title}
                </h2>
                <button
                  type="button"
                  className={styles.close}
                  onClick={onClose}
                  aria-label={closeLabel}
                >
                  <CloseIcon size={20} />
                </button>
              </div>
              <div className={styles.body}>{children}</div>
              {footer && <div className={styles.footer}>{footer}</div>}
            </>
          )}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body,
  );
}
