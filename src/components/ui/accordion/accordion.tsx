'use client';

import { useState } from 'react';

import { cx } from '@/lib/utils';

import styles from './accordion.module.css';
import { AccordionContext } from './context';

type SingleProps = {
  type?: 'single';
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
};

type MultipleProps = {
  type: 'multiple';
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onValueChange?: ((value: string[]) => void) | undefined;
};

export type AccordionProps = (SingleProps | MultipleProps) & {
  className?: string | undefined;
  children: React.ReactNode;
};

function toSet(value: string | string[] | undefined): Set<string> {
  if (value === undefined) return new Set();
  return new Set(Array.isArray(value) ? value : [value]);
}

export function Accordion(props: AccordionProps) {
  const { className, children } = props;
  const type = props.type ?? 'single';

  const isControlled = props.value !== undefined;
  const [internal, setInternal] = useState<Set<string>>(() =>
    toSet(props.defaultValue),
  );

  const openItems = isControlled ? toSet(props.value) : internal;

  const toggle = (value: string) => {
    const next = new Set(openItems);
    if (next.has(value)) {
      next.delete(value);
    } else {
      if (type === 'single') next.clear();
      next.add(value);
    }

    if (!isControlled) setInternal(next);

    if (type === 'single') {
      const single = next.values().next().value ?? '';
      (props as SingleProps).onValueChange?.(single);
    } else {
      (props as MultipleProps).onValueChange?.(Array.from(next));
    }
  };

  const ctxValue = { type, openItems, toggle };

  return (
    <AccordionContext.Provider value={ctxValue}>
      <div className={cx(styles.root, className)}>{children}</div>
    </AccordionContext.Provider>
  );
}
