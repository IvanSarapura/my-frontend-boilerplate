'use client';

import { createContext, useContext } from 'react';

export type RadioContextValue = {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
  describedBy: string | undefined;
  invalid: boolean;
};

export const RadioContext = createContext<RadioContextValue | null>(null);

export function useRadioContext() {
  return useContext(RadioContext);
}
