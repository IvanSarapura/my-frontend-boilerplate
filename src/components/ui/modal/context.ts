'use client';

import { createContext, useContext } from 'react';

type ModalContextValue = {
  titleId: string;
  /** Called by <ModalHeader> on mount; returns its unmount cleanup. Lets Modal
   * dev-warn when a compound modal has no accessible name (no header, no
   * `ariaLabel`). The registry lives in Modal so the ref stays local. */
  registerHeader: () => () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error(
      'ModalHeader must be rendered inside <Modal> — context not found.',
    );
  }
  return ctx;
}
