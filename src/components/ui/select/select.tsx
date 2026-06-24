'use client';

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { type KeyboardEvent, useId, useRef, useState } from 'react';

import { ChevronDownIcon } from '@/components/ui/icon';
import { cx } from '@/lib/utils';

import styles from './select.module.css';

type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
};

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  error,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const baseId = useId();
  const errorId = `${baseId}-error`;
  const labelId = label ? `${baseId}-label` : undefined;
  const triggerId = `${baseId}-trigger`;
  const valueId = `${baseId}-value`;
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const selectedIndex = options.findIndex(o => o.value === value);
  const selectedLabel =
    selectedIndex >= 0 ? options[selectedIndex]?.label : undefined;

  const listRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>(options.map(o => o.label));

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          // Match the menu width to the trigger.
          elements.floating.style.width = `${rects.reference.width}px`;
        },
        padding: 8,
      }),
    ],
  });

  const select = (index: number) => {
    const option = options[index];
    if (option) {
      onChange(option.value);
      setOpen(false);
    }
  };

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'listbox' });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex: selectedIndex >= 0 ? selectedIndex : null,
    onNavigate: setActiveIndex,
    loop: true,
    virtual: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex: selectedIndex >= 0 ? selectedIndex : null,
    onMatch: setActiveIndex,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss, role, listNav, typeahead],
  );

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      open &&
      activeIndex !== null &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      select(activeIndex);
    }
  };

  return (
    <div className={cx(styles.wrapper, className)}>
      {label && (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}
      <button
        ref={refs.setReference}
        id={triggerId}
        type="button"
        className={cx(
          styles.trigger,
          open && styles.open,
          error && styles.error,
        )}
        disabled={disabled}
        aria-haspopup="listbox"
        // Combobox name = optional visible label + the current value/placeholder.
        aria-labelledby={cx(labelId, valueId)}
        aria-describedby={error ? errorId : undefined}
        {...getReferenceProps({ onKeyDown: onTriggerKeyDown })}
      >
        <span
          id={valueId}
          className={!selectedLabel ? styles.placeholder : undefined}
        >
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDownIcon className={styles.chevron} />
      </button>
      {open && (
        <FloatingPortal>
          <ul
            // eslint-disable-next-line react-hooks/refs -- floating-ui callback ref, reads DOM node outside render
            ref={refs.setFloating}
            id={listboxId}
            className={styles.menu}
            style={floatingStyles}
            aria-labelledby={labelId ?? triggerId}
            {...getFloatingProps()}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                ref={node => {
                  listRef.current[index] = node;
                }}
                id={optionId(index)}
                className={cx(
                  styles.option,
                  value === option.value && styles.selected,
                  activeIndex === index && styles.focused,
                )}
                role="option"
                aria-selected={value === option.value}
                {...getItemProps({
                  onClick: () => select(index),
                })}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </FloatingPortal>
      )}
      {error && (
        <span id={errorId} className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  );
}
