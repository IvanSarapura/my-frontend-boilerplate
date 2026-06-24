import { type InputHTMLAttributes, useId } from 'react';

import { cx } from '@/lib/utils';

import styles from './input.module.css';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string | undefined;
  error?: string | undefined;
  helper?: string | undefined;
};

export function Input({
  label,
  error,
  helper,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cx(styles.input, error && styles.error, className)}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
        }
        {...props}
      />
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
