'use client';

import type { ChangeEvent, InputHTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import { useRadioContext } from './context';
import styles from './radio.module.css';

type RadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'checked'
> & {
  value: string;
  label: string;
};

export function Radio({
  value,
  label,
  id,
  className,
  disabled: disabledProp,
  onChange: onChangeProp,
  name: nameProp,
  ...props
}: RadioProps) {
  const ctx = useRadioContext();

  const name = ctx?.name ?? nameProp;
  const disabled = (ctx?.disabled || disabledProp) ?? false;
  const checked = ctx ? ctx.value === value : undefined;
  const invalid = ctx?.invalid ?? false;

  const inputId = id ?? `${name ?? 'radio'}-${value}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (ctx) ctx.onChange(value);
    onChangeProp?.(event);
  };

  return (
    <label
      htmlFor={inputId}
      className={cx(styles.row, disabled && styles.disabled)}
    >
      <input
        id={inputId}
        type="radio"
        name={name}
        value={value}
        disabled={disabled}
        className={styles.input}
        {...(checked !== undefined ? { checked } : {})}
        onChange={handleChange}
        {...props}
      />
      <span
        className={cx(styles.box, invalid && styles.boxError, className)}
        aria-hidden="true"
      >
        <span className={styles.dot} />
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
