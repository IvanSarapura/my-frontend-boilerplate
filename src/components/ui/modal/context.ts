'use client';

import { createContext, useContext } from 'react';

type ModalContextValue = {
  titleId: string;
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
