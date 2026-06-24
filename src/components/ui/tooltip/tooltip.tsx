'use client';

import {
  arrow,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  type Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import React, { useRef, useState } from 'react';

import { cx } from '@/lib/utils';

import styles from './tooltip.module.css';

export type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: Placement | undefined;
  delay?: number | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
};

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 300,
  disabled = false,
  className,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      // eslint-disable-next-line react-hooks/refs -- floating-ui reads ref.current outside render during position computation
      arrow({ element: arrowRef }),
    ],
  });

  const hover = useHover(context, {
    move: false,
    delay: { open: delay, close: 0 },
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  if (disabled) return <>{children}</>;

  // Merge the tooltip's aria-describedby with any the trigger already has
  // (e.g. a form error) instead of overwriting, so both are announced.
  const referenceProps = getReferenceProps();
  const childDescribedBy = (
    React.Children.only(children).props as { 'aria-describedby'?: string }
  )['aria-describedby'];
  const ariaDescribedBy =
    [childDescribedBy, referenceProps['aria-describedby'] as string | undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  // Children.only() returns ReactElement<unknown>; widen to a string-keyed
  // props bag so cloneElement accepts the callback ref + merged a11y props.
  const trigger = React.cloneElement(
    React.Children.only(children) as React.ReactElement<
      Record<string, unknown>
    >,
    {
      ref: refs.setReference,
      ...referenceProps,
      'aria-describedby': ariaDescribedBy,
    },
  );

  return (
    <>
      {trigger}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={cx(styles.tooltip, className)}
            {...getFloatingProps()}
          >
            {content}
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className={styles.arrow}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
