import { Alert, AlertDescription, AlertIcon, AlertTitle, Flex } from '@chakra-ui/react';

interface Props {
   title: string;
   description: string;
}

export const TableErrorState = ({title, description}: Props) => {
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
      >
         <Alert status="error">
            <AlertIcon />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
               {description}
            </AlertDescription>
         </Alert>
      </Flex>
   );
};
