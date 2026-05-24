'use client';

import { useId, useRef } from 'react';
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
   * Optional convenience title. When provided, Modal renders the legacy
   * structure (title row + close button inline + body + optional footer).
   * When omitted, Modal renders `children` directly so the consumer can
   * compose `<ModalHeader>`, `<ModalBody>`, `<ModalFooter>` as needed.
   */
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Accessible name for the close button. Pass a localized string. */
  closeLabel?: string;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  closeLabel = 'Close dialog',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useModalBehavior(open, onClose, overlayRef);

  if (!open) return null;

  const isCompound = title === undefined;

  return createPortal(
    <ModalContext.Provider value={{ titleId }}>
      <div
        ref={overlayRef}
        className={styles.overlay}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
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
