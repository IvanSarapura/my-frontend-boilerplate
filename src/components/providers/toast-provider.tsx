'use client';

import { createContext, useCallback, useContext, useState } from 'react';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
};

// Visible lifetime of a toast. The dismissal lifecycle (fade-out + removal) is
// owned by `ToastItem` (see toaster.tsx), which reads this value — do NOT add a
// removal timer here, or toasts would be torn down by two competing timers.
export const TOAST_DURATION_MS = 5000;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
