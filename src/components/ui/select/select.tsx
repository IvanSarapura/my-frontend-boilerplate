'use client';

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

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
  const errorId = `${useId()}-error`;
  const selectedLabel = useMemo(
    () => options.find(o => o.value === value)?.label,
    [options, value],
  );

  const close = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, close]);

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

  return (
    <div className={cx(styles.wrapper, className)} ref={wrapperRef}>
      {label && <span className={styles.label}>{label}</span>}
      <button
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
        aria-describedby={error ? errorId : undefined}
      >
        <span className={!selectedLabel ? styles.placeholder : undefined}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDownIcon className={styles.chevron} />
      </button>
      {open && (
        <ul className={styles.menu} role="listbox">
          {options.map((option, index) => (
            <li
              key={option.value}
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
