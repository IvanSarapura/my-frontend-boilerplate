'use client';

import type { ButtonHTMLAttributes } from 'react';

import { cx } from '@/lib/utils';

import styles from './button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(styles.button, styles[variant], styles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
