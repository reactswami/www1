import { Box, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import React from 'react';

export const IFRAME_NAME = 'ping-discover-output';

export interface Props {
   iframeURL: string | null;
   iframeRef: React.RefObject<HTMLIFrameElement>;
   isRunning: boolean;
}

export const PingDiscoveryOutputSection = ({ iframeURL, iframeRef, isRunning }: Props) => {
   return (
      <Box
         border="1px"
         flexGrow={1}
         flexShrink={0}
         flexBasis={'50%'}
         position={'relative'}
         borderColor="gray.300"
      >
         <Heading position="absolute" bottom="100%" paddingBottom={3} size="sm">
            Discovery Output
         </Heading>
         <Flex
            height={'100%'}
            width={'100%'}
            direction={'column'}
            gap="sm"
            alignItems="center"
            justifyContent="center"
            background="white"
         >
            {iframeURL ? (
               <>
                  <Box
                     ref={iframeRef}
                     as="iframe"
                     height={'100%'}
                     width={'100%'}
                     name={IFRAME_NAME}
                     src={iframeURL}
                  />
                  {isRunning && (
                     <Spinner
                        thickness=".25rem"
                        speed="1.25s"
                        emptyColor="gray.200"
                        color="gray.800"
                        size="xl"
                        position={'absolute'}
                     />
                  )}
               </>
            ) : (
               <>
                  <Heading size="md">Discovery output</Heading>
                  <Text paddingLeft={3} paddingRight={3}>
                     The results of the ping discovery will be displayed once the discovery process
                     starts.
                  </Text>
               </>
            )}
         </Flex>
      </Box>
   );
};
