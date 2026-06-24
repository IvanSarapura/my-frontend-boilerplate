import { type InputHTMLAttributes, useId } from 'react';

import { CheckIcon } from '@/components/ui/icon';
import { cx } from '@/lib/utils';

import styles from './checkbox.module.css';

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  label?: string | undefined;
  error?: string | undefined;
  helper?: string | undefined;
};

export function Checkbox({
  label,
  error,
  helper,
  className,
  id,
  disabled,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error
    ? `${inputId}-error`
    : helper
      ? `${inputId}-helper`
      : undefined;

  return (
    <div className={styles.field}>
      <label
        htmlFor={inputId}
        className={cx(styles.row, disabled && styles.disabled)}
      >
        <input
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className={styles.input}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...props}
        />
        <span
          className={cx(styles.box, error && styles.boxError, className)}
          aria-hidden="true"
        >
          <CheckIcon size={14} className={styles.check} />
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </label>
      {error && (
        <span id={`${inputId}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
      {helper && !error && (
        <span id={`${inputId}-helper`} className={styles.helper}>
          {helper}
        </span>
      )}
    </div>
  );
}
