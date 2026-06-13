'use client';

import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';

import { ChevronDownIcon } from '@/components/ui/icon';
import { cx } from '@/lib/utils';

import styles from './select.module.css';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const baseId = useId();
  const errorId = `${baseId}-error`;
  const labelId = label ? `${baseId}-label` : undefined;
  const triggerId = `${baseId}-trigger`;
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;
  const selectedLabel = options.find(o => o.value === value)?.label;

  const close = () => {
    // Return focus to the trigger only when it's still inside the widget
    // (Escape / selection); on an outside click the focus already moved away.
    if (wrapperRef.current?.contains(document.activeElement)) {
      triggerRef.current?.focus();
    }
    setOpen(false);
    setFocusedIndex(-1);
  };

  const onOutsideClick = useEffectEvent((e: MouseEvent) => {
    if (!wrapperRef.current?.contains(e.target as Node)) close();
  });

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => onOutsideClick(e);
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(i => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      const option = options[focusedIndex];
      if (option) {
        onChange(option.value);
        close();
      }
    }
  });

  useEffect(() => {
    if (!open) return;
    const listener = (e: KeyboardEvent) => onKeyDown(e);
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [open]);

  // Focus the listbox on open so its `aria-activedescendant` is announced as
  // the user arrows through options.
  useEffect(() => {
    if (open) listboxRef.current?.focus();
  }, [open]);

  return (
    <div className={cx(styles.wrapper, className)} ref={wrapperRef}>
      {label && (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={cx(
          styles.trigger,
          open && styles.open,
          error && styles.error,
        )}
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        <span className={!selectedLabel ? styles.placeholder : undefined}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDownIcon className={styles.chevron} />
      </button>
      {open && (
        <ul
          ref={listboxRef}
          id={listboxId}
          className={styles.menu}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId ?? triggerId}
          aria-activedescendant={
            focusedIndex >= 0 ? optionId(focusedIndex) : undefined
          }
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={optionId(index)}
              className={cx(
                styles.option,
                value === option.value && styles.selected,
                focusedIndex === index && styles.focused,
              )}
              role="option"
              aria-selected={value === option.value}
              tabIndex={-1}
              onPointerDown={() => {
                onChange(option.value);
                close();
              }}
              onPointerEnter={() => setFocusedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <span id={errorId} className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  );
}
