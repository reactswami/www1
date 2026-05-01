import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

type MergeFunction<T> = (existing: T[], newData: T[]) => {
   result: T[];
   hasChanged: boolean;
};

interface UseLocalStorageOptions<T> {
   serializer?: {
      stringify: (value: T[]) => string;
      parse: (value: string) => T[];
   };
   syncAcrossTabs?: boolean;
   onError?: (error: Error, operation: 'read' | 'write' | 'remove') => void;
}

type UseLocalStorageReturn<T> = [
   value: T[],
   setValue: (value: T[] | ((prev: T[]) => T[])) => void,
   actions: {
      clear: () => void;
      refresh: () => void;
   }
];

export default function useLocalStorage<T>(
   key: string,
   initialValue: T[],
   mergeFunction?: MergeFunction<T>,
   options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {

   const serializer = useMemo(() => options.serializer || {
      stringify: JSON.stringify,
      parse: JSON.parse,
   }, [options.serializer]);

   const onError = useMemo(() => options.onError || ((error: Error, operation: 'read' | 'write' | 'remove') => {
      console.warn(`useLocalStorage ${operation} error for key "${key}":`, error);
   }), [options.onError, key]);

   const isInitialLoad = useRef(true);

   const readFromStorage = useCallback((): T[] => {
      if (typeof window === 'undefined') {
         return initialValue;
      }

      try {
         const item = localStorage.getItem(key);
         if (item === null) {
            return initialValue;
         }
         return serializer.parse(item);
      } catch (error) {
         onError(error as Error, 'read');
         return initialValue;
      }
   }, [key, initialValue, serializer, onError]);

   const writeToStorage = (value: T[]): boolean => {

      try {
         localStorage.setItem(key, serializer.stringify(value));
         return true;
      } catch (error) {
         onError(error as Error, 'write');
         return false;
      }
   };

   const [storedValue, setStoredValue] = useState<T[]>(() => {
      const value = readFromStorage();
      isInitialLoad.current = false;
      return value;
   });


   const setValue = (value: T[] | ((prev: T[]) => T[])): void => {
      setStoredValue((prevValue) => {

         const newValue = typeof value === 'function' ? value(prevValue) : value;

         if (!Array.isArray(newValue)) {
            console.warn(`useLocalStorage: setValue expected an array, got ${typeof newValue}`);
            return prevValue;
         }

         if (mergeFunction && !isInitialLoad.current) {
            const existingStorageValue = readFromStorage();
            const { result: mergedValue, hasChanged } = mergeFunction(existingStorageValue, newValue);

            if (hasChanged) {
               writeToStorage(mergedValue);
               return mergedValue;
            }

            return prevValue;
         } else {
            writeToStorage(newValue);
            return newValue;
         }
      });
   };

   const clear = (): void => {
      try {
         writeToStorage([]);
      } catch (error) {
         onError(error as Error, 'remove');
      }
   };

   const refresh = (): void => {
      const currentValue = readFromStorage();
      setStoredValue(currentValue);
   };

   useEffect(() => {
      if (!options.syncAcrossTabs || typeof window === 'undefined') {
         return;
      }

      const handleStorageChange = (e: StorageEvent) => {
         if (e.key === key && e.newValue !== null) {
            try {
               const newValue = serializer.parse(e.newValue);
               setStoredValue(newValue);
            } catch (error) {
               onError(error as Error, 'read');
            }
         }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
   }, [key, serializer, onError, options.syncAcrossTabs]);

   return [
      storedValue,
      setValue,
      {
         clear,
         refresh,
      },
   ];
}
