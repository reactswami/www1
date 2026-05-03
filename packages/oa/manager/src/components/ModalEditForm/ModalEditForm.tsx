import { Heading } from '@chakra-ui/react';
import { SSModal } from '@statseeker/components/Layout/Modal';
import { type SubmitHandler } from 'react-hook-form';
import { FormOa } from '..';
import { type TableRowData } from '~/hooks/useFetchOaTableData';
import { type OaFormValues } from '~/types';

export interface ModalEditFormProps {
   isOpen: boolean;
   onClose: () => void;
   oa: TableRowData;
   isSubmitting: boolean;
   onSubmit: SubmitHandler<OaFormValues>;
}

export const ModalEditForm = ({ isOpen, onClose, oa, isSubmitting, onSubmit }: ModalEditFormProps) => {
   return (
      <SSModal
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         closeOnOverlayClick={false}
         contentProps={{ maxWidth: '100vw', width: 'max-content', padding: 8 }}
         bodyProps={{ padding: 0 }}
      >
         <Heading>Edit Observability Appliance</Heading>
         <FormOa
            isSubmitting={isSubmitting}
            isCreatingNewOa={false}
            onSubmit={onSubmit}
            id={oa?.id}
            defaultValues={{ ...(oa ?? {}), timeout: oa?.timeout.toString() ?? '10' }}
            isEnabled={oa?.poll === 'on'}
            onCancel={onClose}
         />
      </SSModal>
   );
};
