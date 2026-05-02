import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalCloseButton,
   ModalBody,
   Flex,
   UnorderedList,
   ListItem,
   ModalFooter,
   Button,
   FormErrorMessage,
   FormControl,
} from '@statseeker/components/Layout';
import { Text } from '@statseeker/components/Typography/Text';
import { DownloadIcon, EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { type ManualConfig } from '@statseeker/api/internal_api/entities';
import FileUpload from '@statseeker/components/Legacy/IPRanges/FileUpload/FileUpload';
import { useToast } from '@statseeker/hooks';
import { useMutation } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getManualConfigsFromImportFile } from '~/api';
import { type ManualConfigError } from '~/types';

export function ManualDeviceAdditionImportModal({
   isOpen,
   onClose,
   onImport,
}: {
   isOpen: boolean;
   onClose: () => void;
   onImport: (data: ManualConfig[]) => void;
}) {
   const form = useForm();
   const { getValues } = form;
   const [hasFile, setHasFile] = useState<boolean>(false);
   const [errors, setErrors] = useState<ManualConfigError[]>([]);
   const [showHelpText, setShowHelpText] = useState(false);

   const checkHasFile = (filename: string | null) => {
      setHasFile(filename !== null);
   };
   const toast = useToast();
   const { mutate: uploadManualConfig, isPending: isUploading } = useMutation({
      mutationKey: ['uploadManualConfigs'],
      mutationFn: (manualConfigs: { file: string }) =>
         getManualConfigsFromImportFile(manualConfigs),
      onMutate: () => {
         setShowHelpText(false);
      },
      onSuccess: (data) => {
         if (data.data.success === 'false') {
            setErrors(data.data.result);
         } else {
            toast({
               title: 'Success',
               description: 'Manual configs uploaded',
               status: 'success',
            });
            setErrors([]);
            form.reset();
            setShowHelpText(false);
            onImport(data.data.result);
         }
      },
      onError: (error: AxiosError<{ result?: { msg?: string } } | undefined>) => {
         let message = error?.response?.data?.result?.msg || error.message;
         toast({
            title: 'Error',
            description: message,
            status: 'error',
         });
      },
   });

   function internalOnClose() {
      setErrors([]);
      setShowHelpText(false);
      form.reset();
      onClose();
   }

   return (
      <Modal isOpen={isOpen} isCentered onClose={internalOnClose}>
         <ModalOverlay />
         <ModalContent width={'xxl'}>
            <ModalHeader>Import Devices from file</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
               <Flex flexDir={'column'} gap={2}>
                  <Text>
                     The CSV file must contain a header and one device per line with the following columns:{' '}
                     <br />
                  </Text>
                  {showHelpText ? (
                     <UnorderedList>
                        <ListItem>IP Address</ListItem>
                        <ListItem>Device Name</ListItem>
                        <ListItem>SNMP Version (1, 2, 3)</ListItem>
                        <ListItem>Community</ListItem>
                        <ListItem>
                           Authentication (MD5, SHA1, SHA224, SHA256, SHA384, SHA512)
                        </ListItem>
                        <ListItem>Authentication User</ListItem>
                        <ListItem>Authentication Password</ListItem>
                        <ListItem>Privacy (AES, AES 192, AES 256, DES, DES3)</ListItem>
                        <ListItem>Privacy Password</ListItem>
                        <ListItem>Context</ListItem>
                        <ListItem>Ping-only (true, false)</ListItem>
                        <ListItem>Encrypted (true, false)</ListItem>
                     </UnorderedList>
                  ) : null}
                  <Flex gap={2} alignItems={'center'}>
                     {' '}
                     <a href="/assets/manual_config.csv" download style={{ display: 'flex' }}>
                        <Button leftIcon={<DownloadIcon />} variant={'link'}>
                           Download Template
                        </Button>
                     </a>
                     {showHelpText ? (
                        <Button
                           variant={'link'}
                           leftIcon={<EyeClosedIcon />}
                           onClick={() => setShowHelpText(false)}
                        >
                           Hide available fields
                        </Button>
                     ) : (
                        <Button
                           variant={'link'}
                           leftIcon={<EyeOpenIcon />}
                           onClick={() => setShowHelpText(true)}
                        >
                           Show available fields
                        </Button>
                     )}
                  </Flex>
                  <FileUpload methods={form} callback={checkHasFile} />
                  {errors && errors.length > 0 ? (
                     <>
                        <Flex maxHeight={'100px'} overflowY={'auto'}>
                           <FormControl isInvalid>
                              {errors.map((error) => (
                                 <FormErrorMessage key={error.line}>
                                    Line {error.line}: {error.errors.join(', ')}
                                 </FormErrorMessage>
                              ))}
                           </FormControl>
                        </Flex>
                     </>
                  ) : null}
               </Flex>
            </ModalBody>{' '}
            <ModalFooter>
               <Flex gap="2" paddingTop={'1rem'} alignSelf={'flex-end'}>
                  <Button onClick={internalOnClose} variant="ghost">
                     Cancel
                  </Button>
                  <Button
                     isLoading={isUploading}
                     isDisabled={!hasFile}
                     onClick={() => {
                        if (getValues('file')) {
                           uploadManualConfig({ file: getValues('file') });
                        }
                     }}
                  >
                     Import Devices
                  </Button>
               </Flex>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
}
