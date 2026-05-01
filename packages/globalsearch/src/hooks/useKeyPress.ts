import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

function useKeyPress(keys: any, callbackKeyDown: any, callbackKeyUp?: any, node = null) {
   const callbackRef = useRef(callbackKeyDown);
   const callbackKeyUpRef = useRef(callbackKeyUp);

   useLayoutEffect(() => {
      callbackRef.current = callbackKeyDown;
      callbackKeyUpRef.current = callbackKeyUp;
   });

   const isTargetKey = useCallback(
      (eventKey: string) => keys.includes(eventKey),
      [keys]
   );

   // handle what happens on key press
   const handleKeyPress = useCallback(
      (e: Event) => {
         const event = e as KeyboardEvent;
         if (isTargetKey(event.key)) {
            callbackRef.current(event);
         }
      },
      [isTargetKey]
   );

   const handleKeyUp = useCallback(
      (e: Event) => {
         const event = e as KeyboardEvent;
         // check if one of the key is part of the ones we want
         if (isTargetKey(event.key)) {
            callbackKeyUpRef?.current(event);
         }
      },
      [isTargetKey]
   );

   useEffect(() => {

      // target is either the provided node or the document
      const targetNode = node ?? document;
      // attach the event listener
      if (targetNode && callbackKeyDown) {
         targetNode.addEventListener('keydown', handleKeyPress);
      }

      if (targetNode && callbackKeyUp) {
         targetNode.addEventListener('keyup', handleKeyUp);
      }

      // remove the event listener
      return () => {

         if (targetNode && callbackKeyDown) {
            targetNode.removeEventListener('keydown', handleKeyPress);
         }

         if (targetNode) {
            targetNode.removeEventListener('keydown', handleKeyUp);
         }
      };
   }, [handleKeyPress, node, callbackKeyDown, callbackKeyUp, handleKeyUp]);
};

export default useKeyPress;