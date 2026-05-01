import { useToast as useChakraToast } from '@chakra-ui/react';

/* This should be used over the Chakra default toast
 * It provides the default behavior for the toast notification (position, etc)
 */
export const useToast = () => {
   const toast = useChakraToast({
      position: 'top-right',
      isClosable: true,
      containerStyle: {
         color: 'white',
      },
   });

   return toast;
};
