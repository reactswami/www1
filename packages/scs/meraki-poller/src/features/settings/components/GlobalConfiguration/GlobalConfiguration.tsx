import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Collapse, Flex, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { NetworkConfigForm } from '~/components/FormNetworkConfig';

export const GlobalConfiguration = () => {
   const { isOpen, onToggle } = useDisclosure();
   return (
      <Flex flexDirection={'column'} gap="md">
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
            <Heading size="md">Advanced polling settings</Heading>
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
            <Flex flexDirection={'column'} gap="px" marginBottom={4} paddingX={3}>
               <Text>
                  Specify the default Network/Organization polling
                  configuration. This configuration can be overridden by
                  network/organization specific configuration rules.
               </Text>
            </Flex>
            <Box paddingX={3} paddingBottom={2}>
               <NetworkConfigForm />
            </Box>
         </Collapse>
      </Flex>
   );
};
