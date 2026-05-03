import {
   Alert,
   AlertIcon,
   Checkbox,
   Link,
} from '@chakra-ui/react';
import { type APILicense } from '@statseeker/api/internal_api/entities/license/type';
import { Button } from '@statseeker/components/Form/Button';
import { Flex } from '@statseeker/components/Layout/Flex';
import { SSModal } from '@statseeker/components/Layout/Modal';
import { Input } from '@statseeker/components/Legacy/Input/Input';
import { Text } from '@statseeker/components/Typography/Text';
import { type ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LicenseContent } from './LicenseContent';

type FormValues = { server_id: string };
interface LicenseUpdateModalProps {
   mode: 'download' | 'upload';
   onDownload: (server_id: string) => void;
   onUpload: (server_id: string, data: string) => void;
   onClose: () => void;
   onApply: () => void;
   currentLicense?: APILicense;
   newLicense?: APILicense;
   isLoading?: boolean;
}

export const LicenseUpdateModal = (props: LicenseUpdateModalProps) => {
   const { register, handleSubmit, formState, getValues } = useForm<FormValues>({
      defaultValues: { server_id: props.currentLicense?.server_id ?? '' },
   });

   const fileUploadRef = useRef<HTMLInputElement>(null);
   const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         props.onUpload(getValues('server_id'), await file.text());
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

   const [accepted, setAccepted] = useState(false);

   return (
      <>
         {props.newLicense ? (
            <SSModal
               isOpen
               onClose={props.onClose}
               size="6xl"
               title="Apply New License"
               confirmButton={{
                  label: 'Apply',
                  variant: 'secondary',
                  onClick: props.onApply,
                  isDisabled: !accepted,
                  isLoading: props.isLoading,
               }}
               cancelButton={{
                  label: 'Cancel',
                  onClick: props.onClose,
                  isDisabled: props.isLoading,
               }}
            >
               <Flex justifyContent={'space-between'} gap={4}>
                  {props.currentLicense?.tier && (
                     <LicenseContent
                        heading="Existing License"
                        license={props.currentLicense}
                     />
                  )}
                  <LicenseContent
                     heading={props.currentLicense?.tier ? 'New License' : ''}
                     license={props.newLicense}
                  />
               </Flex>
               <Flex grow={1} flexDir={'column'} gap={4} mt={4}>
                  <Alert status="warning">
                     <AlertIcon />
                     Please review the changes before applying the new license. Ensure that
                     the new license meets your requirements.
                  </Alert>
                  <Flex align="center" gap={2}>
                     <Checkbox onChange={() => setAccepted(!accepted)} checked={accepted} />
                     <Text fontSize="sm">
                        I have read and agree to the{' '}
                        <Link
                           href="https://www.statseeker.com/eula"
                           target="_blank"
                           rel="noopener noreferrer"
                        >
                           End User License Agreement (EULA)
                        </Link>
                     </Text>
                  </Flex>
               </Flex>
            </SSModal>
         ) : (
            <SSModal
               isOpen
               onClose={props.onClose}
               size="md"
               title="Apply New License"
               form={{ id: 'LicenseForm', onSubmit: handleSubmit(submitForm) }}
               confirmButton={{
                  label: props.mode === 'download' ? 'Download' : 'Upload',
                  variant: 'secondary',
                  formId: 'LicenseForm',
                  isLoading: props.isLoading,
               }}
               cancelButton={{
                  label: 'Cancel',
                  onClick: props.onClose,
                  isDisabled: props.isLoading,
               }}
            >
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
            </SSModal>
         )}
         <input
            ref={fileUploadRef}
            type="file"
            accept=".lic"
            style={{ display: 'none' }}
            onChange={uploadFile}
         />
      </>
   );
};
