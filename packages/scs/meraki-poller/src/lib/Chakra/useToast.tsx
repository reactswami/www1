import { useToast as useChakraToast } from '@chakra-ui/react';

export const useToast = () => {
   const toast = useChakraToast({
      position: 'top-right',
      isClosable: true,
      containerStyle: { color: 'white' },
   });

   return toast;
};
