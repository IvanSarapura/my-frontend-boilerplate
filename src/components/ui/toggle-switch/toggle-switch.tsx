import type { InputHTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import styles from './toggle-switch.module.css';

type ToggleSwitchVariant = 'rounded' | 'rectangular';
type ToggleSwitchSize = 'sm' | 'md' | 'lg';

type ToggleSwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> & {
  variant?: ToggleSwitchVariant;
  size?: ToggleSwitchSize;
  label?: string;
  labelPosition?: 'left' | 'right';
};

export function ToggleSwitch({
  variant = 'rounded',
  size = 'md',
  label,
  labelPosition = 'right',
  className,
  id,
  ...props
}: ToggleSwitchProps) {
  const switchId = id ?? props.name;

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
          id={switchId}
          className={styles.input}
          {...props}
        />
        <span
          className={cx(styles.slider, styles[variant])}
          aria-hidden="true"
        />
      </label>
      {label && labelPosition === 'right' && (
        <label htmlFor={switchId} className={styles.labelText}>
          {label}
        </label>
      )}
    </div>
  );
}
