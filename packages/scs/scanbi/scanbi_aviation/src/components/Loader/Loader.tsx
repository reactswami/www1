import { Box, Heading, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Loader = ({ message }: { message?: string }) => {
   const TIME_IN_MS_TO_SHOW_LOADER = 300;
   const [showLoader, setShowLoader] = useState(false);

   useEffect(() => {
      const showLoaderAfterDelay = setTimeout(() => {
         setShowLoader(true);
      }, TIME_IN_MS_TO_SHOW_LOADER);

      return () => {
         // eslint-disable-next-line @typescript-eslint/no-unused-expressions
         showLoaderAfterDelay && clearTimeout(showLoaderAfterDelay); // This is called on unmount
      };
   }, []);

   return showLoader ? <LoadingScreen message={message} /> : null;
};

const LoadingScreen = ({ message }: { message?: string }) => (
   <Box
      as={motion.div}
      initial={{ opacity: 0 }}
      transitionDuration="1s"
      animate={{ opacity: 1 }}
      height={'100vh'}
      width={'100%'}
      display="flex"
      flexDirection={'column'}
      flexGrow={1}
      justifyContent={'center'}
      alignItems={'center'}
      gap={'lg'}
      padding={8}
   >
      <Spinner thickness=".25rem" speed="0.65s" emptyColor="gray.200" color="gray.800" size="xl" />
      <Heading size="sm" fontWeight="normal">
         {message ?? 'Loading'}
      </Heading>
   </Box>
);
