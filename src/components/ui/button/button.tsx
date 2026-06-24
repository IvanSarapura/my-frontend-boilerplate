'use client';

import type { ButtonHTMLAttributes } from 'react';

import {
  buttonClassName,
  type ButtonSize,
  type ButtonVariant,
} from './button-class';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
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
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}
