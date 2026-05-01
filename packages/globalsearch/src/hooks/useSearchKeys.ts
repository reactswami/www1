import { useCallback, useEffect, useRef } from 'react';
import { useSearchContext } from '../components/SearchContext/SearchContext';
import useKeyPress from './useKeyPress';
import useSearchActions from './useSearchActions';

const DEFAULT_THROTTLE_DELAY = 100;

type NavigationQueue = {
   down: number;
   up: number;
};

function useThrottle<T extends (...args: any[]) => void>(
   callback: T,
   delay: number = DEFAULT_THROTTLE_DELAY
): T {
   const lastCall = useRef<number>(0);
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   useEffect(() => {
      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
         }
      };
   }, []);

   // multiple keyhits causes function out of scope
   return useCallback(
      ((...args: Parameters<T>) => {
         const now = Date.now();
         const timeSinceLastCall = now - lastCall.current;

         if (timeSinceLastCall >= delay) {
            lastCall.current = now;
            callback(...args);
         } else { // while delayed queue it in the timeout
            if (timeoutRef.current) {
               clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
               lastCall.current = Date.now();
               callback(...args);
            }, delay - timeSinceLastCall);
         }
      }) as T,
      [callback, delay]
   );
}

function useSearchKeys({ onOpen, onClose, isOpen }: { onOpen: () => void; onClose: () => void; isOpen: boolean }) {
   const {
      dispatch,
      state: { searchTerm, isLoading, hoverActionIndex, hoverFilterIndex },
   } = useSearchContext();

   const { runPrimaryAction, runSecondaryAction, selectFilter, resetSearch } = useSearchActions();

   const navigationQueue = useRef<NavigationQueue>({ down: 0, up: 0 });

   // Navigation functions
   const navigateDown = useCallback(async () => {
      if (!isOpen) return;

      dispatch({
         type: 'NAVIGATE_RESULT',
         payload: { dir: 'down', index: navigationQueue.current.down }
      });
      navigationQueue.current.down = 0;
   }, [dispatch, isOpen]);

   const navigateUp = useCallback(async () => {
      if (!isOpen) return;

      dispatch({
         type: 'NAVIGATE_RESULT',
         payload: { dir: 'up', index: navigationQueue.current.up }
      });
      navigationQueue.current.up = 0;
   }, [dispatch, isOpen]);

   // handle Enter key actions based on modifiers
   const handleEnterKey = useCallback(async (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (hoverFilterIndex !== -1) {
         selectFilter();
         dispatch({
            type: 'RESET_FILTER_HOVER',
         });
      } else if (hoverActionIndex !== -1 || event.metaKey) {
         runSecondaryAction({});
         dispatch({
            type: 'RESET_ACTION_HOVER',
         });
      } else {
         runPrimaryAction({});
      }
   }, [isOpen, selectFilter, runSecondaryAction, runPrimaryAction, dispatch, hoverActionIndex, hoverFilterIndex]);

   // handle navigation filtering (left/right arrows with modifiers)
   const handleFilterNavigation = useCallback(async (event: KeyboardEvent, direction: 'left' | 'right') => {
      if (event.altKey) {
         dispatch({
            type: 'NAVIGATE_FILTER',
            payload: { dir: direction, index: 1 }
         });

      } else if (event.ctrlKey || event.metaKey) {
         dispatch({
            type: 'NAVIGATE_ACTION',
            payload: { dir: direction, index: 1 }
         });
      }
   }, [dispatch]);

   // reset on escape
   const resetSearchState = useCallback(() => {
      onClose();
      dispatch({
         type: 'RESET_STATE',
      });
      navigationQueue.current = { down: 0, up: 0 };
   }, [onClose, dispatch]);



   const throttledNavigateDown = useThrottle(navigateDown);
   const throttledNavigateUp = useThrottle(navigateUp);


   useEffect(() => {
      if (isLoading || !searchTerm) {
         navigationQueue.current.up = 0;
         navigationQueue.current.down = 0;
      }
   }, [isLoading, searchTerm]);

   // Initialize the actionkeys for the filter and selected results
   const NAVIGATION_KEYS = [
      'ArrowDown',
      'ArrowUp',
      'Enter',
      'Escape',
      'k',
      'ArrowLeft',
      'ArrowRight'
   ];

   const onNavigationKeyPress = useCallback(async (event: Event) => {
      const e = event as KeyboardEvent;
      switch (e.key) {
         case 'k': {
            if (e.ctrlKey) {
               if (!isOpen) {
                  resetSearch();
                  onOpen();
               }
               break;
            } else {
               return;
            }
         }
         case 'Escape':
            if (isOpen) {
               resetSearchState();
            } else {
               return;
            }
            break;
         case 'ArrowDown':
            if (isOpen) {
               navigationQueue.current.down = navigationQueue.current.down + 1;
               navigationQueue.current.up = 0;
               throttledNavigateDown();
               break;
            } else {
               return;
            }
         case 'ArrowUp':
            if (isOpen) {
               navigationQueue.current.up = navigationQueue.current.up + 1;
               navigationQueue.current.down = 0;
               throttledNavigateUp();
               break;
            } else {
               return;
            }
         case 'ArrowLeft':
         case 'ArrowRight':
            if (isOpen && (e.altKey || e.ctrlKey || e.metaKey)) {
               handleFilterNavigation(e, e.key === 'ArrowLeft' ? 'left' : 'right');
               break;
            } else {
               return;
            }
         case 'Enter':
            if (isOpen) {
               handleEnterKey(e);
               break;
            } else {
               return;
            }
         default: {
            if (!isOpen) {
               return;
            }
         }
      }
      e.preventDefault();
   }, [isOpen, throttledNavigateDown, throttledNavigateUp, handleEnterKey,
      resetSearchState, handleFilterNavigation, resetSearch, onOpen]);

   useKeyPress(NAVIGATION_KEYS, onNavigationKeyPress, null);
};


export default useSearchKeys;