import { IconItem } from '@storybook/addon-docs/blocks';
import { type ReactElement, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const StorybookIconItem = ({ icon }: { icon: ReactElement }) => {
   const [copied, setCopied] = useState(false);
   const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
   const ref = useRef<HTMLDivElement>(null);
   const name = typeof icon.type === 'string' ? icon.type : icon.type.name;

   useEffect(() => {
      if (copied) {
         const timer = setTimeout(() => setCopied(false), 750);
         return () => clearTimeout(timer);
      }
      return;
   }, [copied]);

   const handleClick = async () => {
      await navigator.clipboard.writeText(`<${name} />`);
      if (ref.current) {
         const rect = ref.current.getBoundingClientRect();
         setPosition({
            top: rect.top,
            left: rect.left,
         });
      }
      setCopied(true);
   };

   return (
      <>
         <div
            onClick={handleClick}
            ref={ref}
            style={{ display: 'inline-block', cursor: 'pointer' }}
         >
            <IconItem name={name}>{icon}</IconItem>
         </div>

         {copied &&
            position &&
            createPortal(
               <div
                  style={{
                     position: 'absolute',
                     top: `${position.top}px`,
                     left: `${position.left}px`,
                     background: '#FFFFFF',
                     color: '#333',
                     fontSize: '12px',
                     fontFamily: '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                     fontWeight: 500,
                     padding: '4px 8px',
                     borderRadius: '8px',
                     boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.08)',
                     zIndex: 9999,
                     pointerEvents: 'none',
                     whiteSpace: 'nowrap',
                  }}
               >
                  Copied
               </div>,
               document.body
            )}
      </>
   );
};
