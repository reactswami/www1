import { Button, Flex, Heading, type UseDisclosureReturn } from '@chakra-ui/react';
import { PlusIcon } from '@statseeker/ui/icons';

interface Props {
   hasFilters: boolean;
   disclosure: UseDisclosureReturn;
   noFilteredDataError: string;
   noDataError: string;
   actionTitle: string;
}

export const TableEmptyState = ({ hasFilters, disclosure, noFilteredDataError, noDataError, actionTitle }: Props) => {
   return (
      <Flex
         direction={'column'}
         alignItems={'center'}
         gap="4"
         justifyContent={'center'}
         flexGrow={1}
         paddingBottom={24}
         height="100%"
         width="100%"
      >
         <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            paddingY={12}
            paddingX={8}
            shadow="md"
            background="white"
            border="1px"
            borderColor={'gray.600'}
         >
            <Heading size="lg" paddingBottom={2}>
               {hasFilters ? noFilteredDataError : noDataError}
            </Heading>
            {!hasFilters && (
               <Button
                  onClick={disclosure.onOpen}
                  marginTop={8}
                  variant="outline"
                  leftIcon={<PlusIcon />}
               >
                  {actionTitle}
               </Button>
            )}
         </Flex>
      </Flex>
   );
};
