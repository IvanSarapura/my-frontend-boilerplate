import { type TextareaHTMLAttributes, useId } from 'react';

import { cx } from '@/lib/utils';

import styles from './textarea.module.css';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string | undefined;
  error?: string | undefined;
  helper?: string | undefined;
};

export function Textarea({
  label,
  error,
  helper,
  className,
  id,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cx(styles.textarea, error && styles.error, className)}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${textareaId}-error`
            : helper
              ? `${textareaId}-helper`
              : undefined
        }
        {...props}
      />
      {error && (
        <span
          id={`${textareaId}-error`}
          className={styles.errorText}
          role="alert"
        >
          {error}
        </span>
      )}
      {helper && !error && (
        <span id={`${textareaId}-helper`} className={styles.helper}>
          {helper}
        </span>
      )}
    </div>
  );
}
