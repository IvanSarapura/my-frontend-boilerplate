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
  // Inside a <form>, HTML defaults to type="submit" — opt in explicitly instead.
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}
