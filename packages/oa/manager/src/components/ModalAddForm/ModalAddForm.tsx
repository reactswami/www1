import { Heading } from '@chakra-ui/react';
import { SSModal } from '@statseeker/components/Layout/Modal';
import { type SubmitHandler } from 'react-hook-form';
import { FormOa } from '..';
import { type OaFormValues } from '~/types';

interface Props {
   isOpen: boolean;
   onClose: () => void;
   isCreatingOa: boolean;
   onSubmit: SubmitHandler<OaFormValues>;
}

export const ModalAddForm = ({ isOpen, onClose, isCreatingOa, onSubmit }: Props) => {
   return (
      <SSModal
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         closeOnOverlayClick={false}
         contentProps={{ maxWidth: '100vw', width: 'max-content', padding: 8 }}
         bodyProps={{ padding: 0 }}
      >
         <Heading>Create Observability Appliance</Heading>
         <FormOa
            isCreatingNewOa={true}
            onCancel={onClose}
            onSubmit={onSubmit}
            isSubmitting={isCreatingOa}
         />
      </SSModal>
   );
};
