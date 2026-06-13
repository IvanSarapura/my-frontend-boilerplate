'use client';

import { useId, useState } from 'react';

import { cx } from '@/lib/utils';

import { RadioContext } from './context';
import styles from './radio.module.css';

type RadioGroupProps = {
  name: string;
  label?: string | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  error?: string | undefined;
  helper?: string | undefined;
  disabled?: boolean | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  className?: string | undefined;
  children: React.ReactNode;
};

export function RadioGroup({
  name,
  label,
  value: controlledValue,
  defaultValue,
  onChange,
  error,
  helper,
  disabled = false,
  orientation = 'vertical',
  className,
  children,
}: RadioGroupProps) {
  const reactId = useId();
  const groupId = `radio-group-${name}-${reactId}`;
  const labelId = `${groupId}-label`;
  const errorId = `${groupId}-error`;
  const helperId = `${groupId}-helper`;

  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const value = isControlled ? controlledValue : internal;

  const handleChange = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const describedBy = error ? errorId : helper ? helperId : undefined;

  return (
    <RadioContext.Provider
      value={{
        name,
        value,
        onChange: handleChange,
        disabled,
        describedBy,
        invalid: !!error,
      }}
    >
      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={describedBy}
        aria-invalid={!!error || undefined}
        className={cx(styles.group, className)}
      >
        {label && (
          <span id={labelId} className={styles.groupLabel}>
            {label}
          </span>
        )}
        <div
          className={cx(
            styles.list,
            orientation === 'horizontal' ? styles.horizontal : styles.vertical,
          )}
        >
          {children}
        </div>
        {error && (
          <span id={errorId} className={styles.errorText} role="alert">
            {error}
          </span>
        )}
        {helper && !error && (
          <span id={helperId} className={styles.helper}>
            {helper}
          </span>
        )}
      </div>
    </RadioContext.Provider>
  );
}
