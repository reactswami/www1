import { type Ref, useLayoutEffect, useRef, useState } from 'react';

interface Result<T> {
   ref: Ref<T>;
   dimensions: DOMRect | undefined;
}

/**
 * Get the dimensions of a React component
 */
export const useDimensions = <
   T extends HTMLElement = HTMLElement
>(): Result<T> => {
   const ref = useRef<T>(null);
   const [dimensions, setDimensions] = useState<DOMRect>();
   useLayoutEffect(() => {
      if (!ref.current) {
         return;
      }
      setDimensions(ref.current.getBoundingClientRect());
   }, [ref]);

   return { ref, dimensions };
};
