import { cx } from '@/lib/utils';

import styles from './dropdown.module.css';

export type DropdownSeparatorProps = {
  className?: string | undefined;
};

export function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return <div role="separator" className={cx(styles.separator, className)} />;
}
