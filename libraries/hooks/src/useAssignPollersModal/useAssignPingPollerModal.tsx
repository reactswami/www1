import {
   Alert,
   AlertDescription,
   AlertIcon,
   AlertTitle,
   Badge,
   Box,
   Button,
   Center,
   Divider,
   Flex,
   FormControl,
   FormLabel,
   Heading,
   IconButton,
   Input,
   List,
   ListItem,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   Popover,
   PopoverArrow,
   PopoverBody,
   PopoverCloseButton,
   PopoverContent,
   PopoverTrigger,
   Tag,
   Text,
   Tooltip,
   VStack,
   useDisclosure,
   type ModalProps,
} from '@chakra-ui/react';
import { regexpSearch } from '@statseeker/components/Legacy/react-table';
import { Cross2Icon, StarIcon } from '@statseeker/ui/icons';
import { memo, useState } from 'react';
import { type Poller, useAssignPingPoller } from './useAssignPingPoller';

export interface Props {
   globalFilter?: string;
   groupFilter?: number;
   isAllSelected?: boolean;
   modalOptions?: Partial<ModalProps>;
   queryKey?: string[];
   selectedDevices: number[];
   preselectedPollers?: (Poller & { isDefault?: boolean; isExceeded?: boolean })[];
   hideClose?: boolean;
   pollerFilter?: string[];
   exceedFilter?: boolean;
}

/* This hook contains the modal to assign pollers to devices. It returns the modal component, and the disclosure to open/close the modal */
export const useAssignPollersModal = ({
   globalFilter,
   groupFilter,
   selectedDevices,
   modalOptions = {
      isCentered: true,
      size: 'xl',
   },
   isAllSelected = false,
   queryKey,
   preselectedPollers = [],
   hideClose = false,
   exceedFilter = false,
   pollerFilter = [],
}: Props) => {
   const disclosure = useDisclosure();
   const { isOpen, onClose } = disclosure;

   /* We encapsulate the modal with its own hook within the hook so we can export the disclosure */
   /* Note that the internal hook state (useAssignPoller) is within the element to avoid unecessary re-renders */
   const ModalElement = () => {
      const [search, setSearch] = useState('');
      const {
         isLoading,
         isError,
         isSuccess,
         isSaving,
         save,
         setPollerAsDefault,
         defaultPoller,
         selectedPollers,
         addPoller,
         removePoller,
         isPollerSelected,
         oaList,
      } = useAssignPingPoller({
         isOpen,
         onClose,
         selectedDevices,
         isAllSelected,
         queryKey,
         globalFilter,
         groupFilter,
         preselectedPollers,
         exceedFilter,
         pollerFilter,
      });

      const getSelectedDeviceCountSentence = () => {
         const deviceSelectedCount = selectedDevices.length;
         const firstPart = isAllSelected
            ? 'All devices'
            : deviceSelectedCount > 1
            ? `The ${deviceSelectedCount} selected devices`
            : 'The device';
         return `${firstPart} will be ping-polled from the pollers that are selected below.`;
      };

      const oaIsExceededPreselectedPoller = (oa: string) => {
         return preselectedPollers
            .filter((poller) => poller.isExceeded)
            .map((poller) => poller.name)
            .includes(oa);
      };

      return (
         <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} {...modalOptions}>
            <ModalOverlay />
            <ModalContent
               maxWidth={'100vw'}
               width={modalOptions.size == 'full' ? '100vw' : 'max-content'}
               padding={2}
            >
               {!hideClose && <ModalCloseButton />}
               <ModalHeader>Assign Ping Pollers</ModalHeader>
               <ModalBody>
                  <Text>{getSelectedDeviceCountSentence()}</Text>
                  <Text>
                     The configuration below will overwrite any existing configuration on the
                     selected devices.
                  </Text>
                  {isLoading && <Text>Loading list of appliances</Text>}
                  {isError && (
                     <Alert status="error" flexDirection={'column'} alignItems={'start'}>
                        <Flex>
                           <AlertIcon />
                           <AlertTitle>Unable to retrieve the list of appliances</AlertTitle>
                        </Flex>
                        <AlertDescription>
                           Please try again. If the problem persists, please contact the support
                           team.
                        </AlertDescription>
                     </Alert>
                  )}
                  {isSuccess && (
                     <Flex flexDirection={'column'} gap="lg">
                        <Alert status="info" width={'max-content'} marginTop={4}>
                           <AlertIcon />
                           It can take up to a minute to appear in the list after assigning pollers.
                        </Alert>
                        <Flex paddingY={4} gap="xl">
                           <VStack alignItems={'stretch'} flexGrow={1} flexShrink={0}>
                              <Center>
                                 <Heading size="sm">Pollers available</Heading>
                              </Center>
                              <Divider />
                              <FormControl>
                                 <FormLabel>Search</FormLabel>
                                 <Input onChange={(e) => setSearch(e.target.value)} />
                              </FormControl>
                              <List
                                 transition="300ms background ease-out"
                                 height="500px"
                                 minWidth={'500px'}
                                 borderRadius="base"
                                 border="1px"
                                 borderColor="gray.100"
                                 overflowY="auto"
                              >
                                 <>
                                    {oaList
                                       .filter((oa) => !isPollerSelected(oa))
                                       .filter(({ name }) => regexpSearch(search, name))
                                       .sort((oa) => (oa.poll === 'off' ? 1 : -1))

                                       .map((oa) => (
                                          <ListItem
                                             key={oa.name}
                                             transition={'ease-in 100ms background'}
                                             borderBottom="1px"
                                             display="flex"
                                             alignItems="center"
                                             borderColor="gray.100"
                                             borderRadius={'sm'}
                                             onClick={() => addPoller(oa)}
                                             padding={2}
                                             paddingX={4}
                                             tabIndex={0}
                                             cursor="pointer"
                                             gap={'sm'}
                                             opacity={oa.poll === 'off' ? 0.8 : 1}
                                             _hover={{
                                                backgroundColor: 'blue.50',
                                             }}
                                             _focus={{
                                                border: '1px',
                                                backgroundColor: 'blue.50',
                                             }}
                                          >
                                             <Box
                                                display="flex"
                                                flexGrow={1}
                                                gap={2}
                                                alignItems="center"
                                             >
                                                <Text>{oa.name}</Text>
                                                {oa.poll === 'off' && (
                                                   <Tooltip
                                                      placement="right"
                                                      label="This Observability Appliance is disabled"
                                                   >
                                                      <Tag>Disabled</Tag>
                                                   </Tooltip>
                                                )}
                                             </Box>
                                          </ListItem>
                                       ))}
                                 </>
                              </List>
                           </VStack>
                           <VStack flexGrow={1} flexShrink={0}>
                              <Heading size="sm">Pollers selected</Heading>
                              <Divider />
                              <List
                                 paddingY={2}
                                 flexGrow={1}
                                 height="500px"
                                 overflowY="auto"
                                 minWidth={'500px'}
                              >
                                 {selectedPollers
                                    .sort((a) => (a.poll === 'off' ? 1 : -1))
                                    .sort((oa) => (oa.id === defaultPoller.id ? -1 : 1))
                                    .map((oa) => (
                                       <ListItem
                                          key={oa.name}
                                          display="flex"
                                          gap="sm"
                                          flexWrap={'nowrap'}
                                          marginBottom="px"
                                          alignItems="center"
                                          justifyContent={'space-between'}
                                          paddingX={3}
                                          paddingY={1}
                                          border="1px"
                                          borderRadius="md"
                                          borderColor="gray.300"
                                          flexGrow={1}
                                          opacity={oa.poll === 'off' ? 0.8 : 1}
                                       >
                                          <Flex
                                             alignItems={'center'}
                                             flexGrow={1}
                                             gap="sm"
                                             justifyContent={'space-between'}
                                          >
                                             <Box
                                                display="flex"
                                                flexGrow={1}
                                                gap={2}
                                                alignItems="center"
                                             >
                                                <Text>{oa.name}</Text>
                                                {oa.poll === 'off' && (
                                                   <Tooltip
                                                      placement="right"
                                                      label="This Observability Appliance is disabled"
                                                   >
                                                      <Tag>Disabled</Tag>
                                                   </Tooltip>
                                                )}
                                             </Box>

                                             {oaIsExceededPreselectedPoller(oa.name) && (
                                                <Tooltip
                                                   placement="right"
                                                   label="The ping polling for this device and Observability Appliance combination exceeds current license limits"
                                                >
                                                   <Badge colorScheme={'red'}>Exceeded</Badge>
                                                </Tooltip>
                                             )}

                                             {defaultPoller.name === oa.name ? (
                                                <Popover placement="bottom-end">
                                                   <PopoverTrigger>
                                                      <Badge colorScheme="orange" cursor="help">
                                                         Default poller
                                                      </Badge>
                                                   </PopoverTrigger>
                                                   <PopoverContent background="white" shadow="md">
                                                      <PopoverArrow />
                                                      <PopoverCloseButton />
                                                      <PopoverBody>
                                                         The default poller is the poller used to
                                                         define the status of a device.
                                                      </PopoverBody>
                                                   </PopoverContent>
                                                </Popover>
                                             ) : (
                                                <Tooltip label="set as default poller" flexGrow={1}>
                                                   <IconButton
                                                      aria-label="make poller default"
                                                      variant="ghost"
                                                      icon={<StarIcon />}
                                                      onClick={() => setPollerAsDefault(oa)}
                                                   />
                                                </Tooltip>
                                             )}
                                          </Flex>
                                          <Tooltip label="remove poller" justifySelf={'flex-end'}>
                                             <IconButton
                                                icon={<Cross2Icon />}
                                                variant="ghost"
                                                aria-label="remove poller from selected"
                                                onClick={() => removePoller(oa)}
                                             />
                                          </Tooltip>
                                       </ListItem>
                                    ))}
                                 {selectedPollers.length === 0 && (
                                    <VStack>
                                       <Text>Select pollers in the left hand side</Text>
                                    </VStack>
                                 )}
                              </List>
                           </VStack>
                        </Flex>
                     </Flex>
                  )}
               </ModalBody>

               <ModalFooter justifyContent={'flex-start'}>
                  <Button
                     mr={3}
                     onClick={save}
                     isLoading={isSaving}
                     isDisabled={isLoading || isError}
                  >
                     Save
                  </Button>
                  <Button variant="ghost" onClick={onClose} isDisabled={isSaving}>
                     Cancel
                  </Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      );
   };

   return {
      Modal: memo(ModalElement),
      disclosure,
   };
};
