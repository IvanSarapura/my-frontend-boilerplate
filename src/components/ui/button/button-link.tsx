import Link from 'next/link';
import type { ComponentProps } from 'react';

import {
  buttonClassName,
  type ButtonSize,
  type ButtonVariant,
} from './button-class';

export type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** A `next/link` styled as a `Button` — for CTAs that navigate to a route. */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClassName({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}
