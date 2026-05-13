'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '@/components/ui/icon';
import { useModalBehavior } from '@/hooks/use-modal-behavior';
import { cx } from '@/lib/utils';

import styles from './modal.module.css';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useModalBehavior(open, onClose, overlayRef);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={cx(styles.content, className)}>
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
