import { ChevronDownIcon } from '@chakra-ui/icons';
import { Collapse, Flex, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { CleanupInterval } from '../CleanupInterval/CleanupInterval';
import { Section } from '../Section';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';

export const CleanupIntervalsSection = () => {
   const { data } = useFetchGlobalConfig();
   const { isOpen, onToggle } = useDisclosure();

   return (
      <Section>
         <Flex
            onClick={onToggle}
            justifyContent="space-between"
            transition="background 100ms ease-in"
            cursor="pointer"
            borderRadius="md"
            _hover={{
               background: 'gray.50',
            }}
            margin={0}
            paddingX={2}
            paddingY={1}
         >
            <Heading size="md">Cleanup intervals</Heading>
            <Flex
               justifyContent={'center'}
               alignItems="center"
               transition="all 100ms ease-in"
               transformOrigin={'center'}
               transform={`rotate(${isOpen ? '180deg' : '0deg'})`}
            >
               <ChevronDownIcon />
            </Flex>
         </Flex>
         <Collapse in={isOpen}>
            <Flex flexDirection={'column'} gap="sm" paddingX={3}>
               <Text>
                  By default Statseeker retains all Meraki data indefinitely.
                  Optionally each Meraki data type can have a data retention
                  period defined.
               </Text>
               <Text>
                  This defines the amount of time after data is no longer
                  available within the Meraki API that Statseeker will wait
                  before removing the data from Statseeker.
               </Text>
            </Flex>
            <Flex flexDirection={'column'} gap="sm" paddingX={3} paddingBottom={2}>
               {Object.entries(data!.data.cleanup_rules)
                  .sort()
                  .map(([key, value]) => (
                     <CleanupInterval key={key} keyValue={key} />
                  ))}
            </Flex>
         </Collapse>
      </Section>
   );
};
