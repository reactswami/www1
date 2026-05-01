import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Collapse, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import { CheckCircledIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { Input } from '@statseeker/components/Legacy/Input/Input';
import { useModal } from '@statseeker/components/Legacy/Modal/Modal';

import { useQueryClient } from '@tanstack/react-query';
import { Section } from '../Section';
import { TestConnectionButton } from '../TestConnectionButton';
import { ConnectionForm } from '~/components/FormConnection';
import { useFetchGlobalConfig } from '~/hooks/useFetchGlobalConfig';
import { queryKeys } from '~/lib/ReactQuery';

export const ConnectionSettingsSection = () => {
   const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
   const { data } = useFetchGlobalConfig();
   const queryClient = useQueryClient();
   const { open, Modal, close } = useModal({
      title: 'Edit connection settings',
      footer: null,
      body: (
         <ConnectionForm
            buttonLabel="Save"
            buttonIcon={<CheckCircledIcon />}
            nextStep={() => {
               queryClient.invalidateQueries({ queryKey: queryKeys.globalConfig });
               close();
            }}
         />
      ),
      closeOnOverlayClick: false,
   });
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
            <Heading size="md">Connection settings</Heading>
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
            <Flex flexGrow={1} gap={'xl'} paddingX={3} paddingBottom={2}>
               <Box minW={'40ch'}>
                  <Heading size="xs">Current settings</Heading>
                  <Input label="API key" defaultValue={data?.data.api_key} isDisabled />
                  <Flex gap="sm">
                     <Input
                        flexGrow={1}
                        flexBasis={'30ch'}
                        label="Proxy"
                        defaultValue={data?.data.proxy_server}
                        isDisabled
                     />
                     <Input
                        flexBasis={'10ch'}
                        label="Port"
                        defaultValue={data?.data.proxy_port}
                        isDisabled
                     />
                  </Flex>
                  <Input label="username" defaultValue={data?.data.proxy_username} isDisabled />
               </Box>

               <Flex justifySelf={'flex-end'} direction={'column'} gap={'md'}>
                  <Heading size="xs">Actions</Heading>
                  <Flex direction="column" alignItems={'stretch'} gap="sm">
                     <Button variant={'outline'} onClick={open} leftIcon={<Pencil1Icon />}>
                        Edit connection settings
                     </Button>
                     <TestConnectionButton />
                  </Flex>
               </Flex>
            </Flex>
         </Collapse>
         <Modal />
      </Section>
   );
};
