import {
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
} from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
import { Flex } from '@statseeker/components/Layout/Flex';
import { Input } from '@statseeker/components/Legacy/Input/Input';
import { Text } from '@statseeker/components/Typography/Text';
import { type ChangeEvent, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { type LicenseResponse } from '~/api';

type FormValues = { server_id: string };
interface LicenseUpdateModalProps {
   mode: 'download' | 'upload';
   onDownload: (server_id: string) => void;
   onUpload: (data: string) => void;
   onClose: () => void;
   license?: LicenseResponse;
   isLoading?: boolean;
}

export const LicenseUpdateModal = (props: LicenseUpdateModalProps) => {
   const { register, handleSubmit, formState } = useForm<FormValues>({
      defaultValues: { server_id: props.license?.result.server_id ?? '' },
   });

   const fileUploadRef = useRef<HTMLInputElement>(null);
   const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         props.onUpload(await file.text());
         event.target.value = '';
      }
   };

   const submitForm = ({ server_id }: { server_id: string }) => {
      if (props.mode === 'download') {
         props.onDownload(server_id);
      } else {
         fileUploadRef.current?.click();
      }
   };

   return (
      <Modal isOpen onClose={props.onClose} size={'md'}>
         <ModalOverlay />
         <ModalContent>
            <ModalHeader>Apply New License</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(submitForm)}>
               <ModalBody>
                  <Flex flexDir={'column'} gap={2}>
                     <Text>
                        Enter your Server ID, then click{' '}
                        {props.mode === 'download' ? (
                           <>
                              <Text as="b">Download</Text> to retrieve
                           </>
                        ) : (
                           <>
                              <Text as="b">Upload</Text> to select
                           </>
                        )}{' '}
                        your Statseeker license.
                     </Text>
                     <Input
                        type="text"
                        {...register('server_id', {
                           required: `Server ID is required.`,
                        })}
                        label="Server ID"
                        error={formState.errors['server_id']?.message}
                        isRequired={true}
                     />
                  </Flex>
               </ModalBody>
               <ModalFooter>
                  <Flex justifyContent={'flex-end'} gap={2}>
                     <Button variant="primary" onClick={props.onClose} isDisabled={props.isLoading}>
                        Cancel
                     </Button>
                     <Button variant="secondary" type="submit" isLoading={props.isLoading}>
                        {props.mode === 'download' ? 'Download' : 'Upload'}
                     </Button>
                  </Flex>
               </ModalFooter>
            </form>
            <input
               ref={fileUploadRef}
               type="file"
               accept=".lic"
               style={{ display: 'none' }}
               onChange={uploadFile}
            />
         </ModalContent>
      </Modal>
   );
};
