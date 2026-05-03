import { SSModal } from '@statseeker/components/Layout/Modal';
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
      <>
         <SSModal
            isOpen
            onClose={props.onClose}
            size="md"
            title="Apply New License"
            form={{ id: 'LicenseUpgradeForm', onSubmit: handleSubmit(submitForm) }}
            confirmButton={{
               label: props.mode === 'download' ? 'Download' : 'Upload',
               variant: 'secondary',
               formId: 'LicenseUpgradeForm',
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
