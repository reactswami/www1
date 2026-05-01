import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Debounce a value. Useful for debouncing a set value in a useState hook.
 * It allows to avoid triggering a use state too often
 * @example This is used as part of the filter search input in data table when server side rendered.
 * @param value The new value
 * @param delayInMs time to debounce, in milliseconds
 * @returns
 */
export const useDebounceValue = <T,>(value: T, delayInMs: number): T => {
   // State and setters for debounced value
   const [debouncedValue, setDebouncedValue] = useState<T>(value);
   useEffect(
      () => {
         // Update debounced value after delay
         const handler = setTimeout(() => {
            setDebouncedValue(value);
         }, delayInMs);
         // Cancel the timeout if value changes (also on delay change or unmount)
         // This is how we prevent debounced value from updating if value is changed ...
         // .. within the delay period. Timeout gets cleared and restarted.
         return () => {
            clearTimeout(handler);
         };
      },
      [value, delayInMs] // Only re-call effect if value or delay changes
   );
   return debouncedValue;
};

function debounce<Callback extends (...args: Parameters<Callback>) => void>(
   fn: Callback,
   delay: number
) {
   let timer: ReturnType<typeof setTimeout> | null = null;
   return (...args: Parameters<Callback>) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
         fn(...args);
      }, delay);
   };
}

export function useDebounce<
   Callback extends (...args: Parameters<Callback>) => ReturnType<Callback>
>(callback: Callback, delay: number) {
   const callbackRef = useRef(callback);
   useEffect(() => {
      callbackRef.current = callback;
   });
   return useMemo(
      () => debounce((...args: Parameters<Callback>) => callbackRef.current(...args), delay),
      [delay]
   );
}

