import { type InputHTMLAttributes, type ReactNode, useId } from 'react';

import { cx } from '@/lib/utils';

import styles from './toggle-switch.module.css';

type ToggleSwitchVariant =
  | 'rounded'
  | 'rectangular'
  | 'outlined'
  | 'outlined-max';
type ToggleSwitchSize = 'sm' | 'md' | 'lg';

type ToggleSwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> & {
  variant?: ToggleSwitchVariant;
  size?: ToggleSwitchSize;
  label?: string;
  labelPosition?: 'left' | 'right';
  /** Optional decorative content rendered inside the sliding thumb. */
  icon?: ReactNode;
};

export function ToggleSwitch({
  variant = 'rounded',
  size = 'md',
  label,
  labelPosition = 'right',
  icon,
  className,
  id,
  ...props
}: ToggleSwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  return (
    <div className={cx(styles.wrapper, className)}>
      {label && labelPosition === 'left' && (
        <label htmlFor={switchId} className={styles.labelText}>
          {label}
        </label>
      )}
      <label className={cx(styles.switch, styles[size])}>
        <input
          type="checkbox"
          role="switch"
          id={switchId}
          className={styles.input}
          {...props}
        />
        <span className={cx(styles.slider, styles[variant])} aria-hidden="true">
          <span className={styles.thumb}>{icon}</span>
        </span>
      </label>
      {label && labelPosition === 'right' && (
        <label htmlFor={switchId} className={styles.labelText}>
          {label}
        </label>
      )}
    </div>
  );
}
