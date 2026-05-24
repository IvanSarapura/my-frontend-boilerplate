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

type TooltipProps = {
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

  // Forward ref and interaction props onto the trigger. getReferenceProps()
  // includes an aria-describedby pointing at the tooltip; merge it with any
  // aria-describedby the trigger already has (e.g. a form error) instead of
  // overwriting it, so both are announced.
  const referenceProps = getReferenceProps();
  const childDescribedBy = (
    React.Children.only(children).props as { 'aria-describedby'?: string }
  )['aria-describedby'];
  const ariaDescribedBy =
    [childDescribedBy, referenceProps['aria-describedby'] as string | undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  const trigger = React.cloneElement(React.Children.only(children), {
    ref: refs.setReference,
    ...referenceProps,
    'aria-describedby': ariaDescribedBy,
  } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

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
