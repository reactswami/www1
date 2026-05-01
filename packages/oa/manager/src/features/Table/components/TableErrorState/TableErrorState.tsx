import {
   Alert,
   AlertDescription,
   AlertIcon,
   AlertTitle,
   Flex,
} from '@chakra-ui/react';

export const TableErrorState = () => {
   return (
      <Flex
         direction={'column'}
         alignItems={'flex-start'}
         gap="4"
         justifyContent={'flex-start'}
         flexGrow={1}
         padding={12}
         height="100%"
         width="100%"
         position="absolute"
         top={0}
         left={0}
      >
         <Alert status="error">
            <AlertIcon />
            <AlertTitle>
               Error: Unable to retrieve the list of appliances
            </AlertTitle>
            <AlertDescription>
               If the problem persists, please contact the support team.
            </AlertDescription>
         </Alert>
      </Flex>
   );
};

