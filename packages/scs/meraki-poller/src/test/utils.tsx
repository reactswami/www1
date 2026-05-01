import { type ReactNode } from 'react';
import { vi } from 'vitest';
import { AppProvider } from '~/providers/AppProvider';

export const silenceConsole = () => {
   vi.spyOn(global.console, 'error').mockImplementation(vi.fn());
   vi.spyOn(global.console, 'warn').mockImplementation(vi.fn());
   vi.spyOn(global.console, 'log').mockImplementation(vi.fn());
   vi.spyOn(global.console, 'info').mockImplementation(vi.fn());
};

/**
 * A wrapper for the render method that includes react router and the query client provider from React Query.
 */
export const testWrapper = {
   wrapper: ({ children }: { children: ReactNode }) => (
      <AppProvider>{children}</AppProvider>
   ),
};
