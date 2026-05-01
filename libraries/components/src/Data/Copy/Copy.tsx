import { Box } from '@chakra-ui/react';
import { Flex } from '@statseeker/components/Layout/Flex';
import { CheckIcon } from '@statseeker/components/Media/Icon/CheckIcon';
import { CopyIcon } from '@statseeker/components/Media/Icon/CopyIcon';
import { forwardRef, useEffect, useState, type PropsWithChildren } from 'react';

interface CopyProps {
   text: string;
}

export const Copy = forwardRef<HTMLDivElement, PropsWithChildren<CopyProps>>((props, ref) => {
   const [copied, setCopied] = useState(false);

   useEffect(() => {
      if (copied) {
         const timer = setTimeout(() => setCopied(false), 1000);
         return () => clearTimeout(timer);
      }
      return;
   }, [copied]);

   const handleClick = async () => {
      await navigator.clipboard.writeText(props.text);
      setCopied(true);
   };

   return (
      <Flex gap={2} ref={ref}>
         {props.children}
         <Box alignContent={'center'}>
            {copied ? (
               <CheckIcon size="sm" />
            ) : (
               <Box cursor={'pointer'} onClick={handleClick}>
                  <CopyIcon size="sm" />
               </Box>
            )}
         </Box>
      </Flex>
   );
});
