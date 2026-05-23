import { Button } from '@/components/ui/button';
import {
  CloseIcon,
  ErrorIcon,
  type IconComponent,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from '@/components/ui/icon';
import { cx } from '@/lib/utils';

import styles from './alert.module.css';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

type AlertProps = {
  variant?: AlertVariant | undefined;
  title?: string | undefined;
  children?: React.ReactNode | undefined;
  onClose?: (() => void) | undefined;
  icon?: boolean | undefined;
  className?: string | undefined;
};

const VARIANT_ICONS: Record<AlertVariant, IconComponent> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  icon = true,
  className,
}: AlertProps) {
  const VariantIcon = VARIANT_ICONS[variant];
  return (
    <div
      className={cx(styles.alert, styles[variant], className)}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {icon && <VariantIcon className={styles.icon} size={20} />}
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.description}>{children}</div>}
      </div>
      {onClose && (
        <Button
          variant="icon"
          size="sm"
          onClick={onClose}
          aria-label="Dismiss alert"
          className={styles.close}
        >
          <CloseIcon size={16} />
        </Button>
      )}
    </div>
  );
}
