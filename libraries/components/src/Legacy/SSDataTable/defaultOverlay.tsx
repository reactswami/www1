import { Flex, Heading } from '@chakra-ui/react';
import { type CustomNoRowsOverlayProps } from "ag-grid-react"; // AG Grid Component

export const DefaultOverlay = (props: CustomNoRowsOverlayProps & { overlayMessage: () => string }) => {
   return (
      <Flex
         direction={'column'}
         alignItems={'center'}
         gap="4"
         justifyContent={'center'}
         flexGrow={1}
         height="100%"
         width="100%"
      >
         {props.overlayMessage() && (
            <Flex
               direction="column"
               alignItems="center"
               marginTop={50}
               justifyContent="center"
               paddingY={2}
               paddingX={2}
               shadow="md"
               background="white"
               border="1px"
               borderColor={'gray.600'}
            >
               <Heading size="sm" color="gray.800" fontSize="sm" fontWeight="normal">
                  {props.overlayMessage()}
               </Heading>
            </Flex>
         )}
      </Flex>

   );
};