import { Box, Heading, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
   message?: string;
   isFullScreen?: boolean;
   color?: string;
}

export const Loader = ({ message, isFullScreen = true, color = 'gray.800' }: Props) => {
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

   return showLoader ? (
      <LoadingScreen message={message} isFullScreen={isFullScreen} color={color} />
   ) : null;
};

const LoadingScreen = ({ message, isFullScreen, color }: Props) => (
   <Box
      as={motion.div}
      initial={{ opacity: 0 }}
      transitionDuration="1s"
      animate={{ opacity: 1 }}
      height={isFullScreen ? '100vh' : '100%'} // For backwards compatibility, I had to add that nullish check
      width={'100%'}
      display="flex"
      flexDirection={'column'}
      flexGrow={1}
      justifyContent={'center'}
      alignItems={'center'}
      gap={'lg'}
      padding={8}
   >
      <Spinner thickness=".25rem" speed="0.65s" emptyColor="gray.200" color={color} size="xl" />
      <Heading size="sm" fontWeight="normal">
         {message ?? 'Loading'}
      </Heading>
   </Box>
);
