import {
   Heading,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalOverlay,
} from '@chakra-ui/react';
import { type SubmitHandler } from 'react-hook-form';
import { FormOa } from '..';
import { type OaFormValues } from '~/types';

interface Props {
   isOpen: boolean;
   onClose: () => void;
   isCreatingOa: boolean;
   onSubmit: SubmitHandler<OaFormValues>;
};

export const ModalAddForm = ({ isOpen, onClose, isCreatingOa, onSubmit }: Props) => {
   return (
      <>
         <Modal
            isOpen={isOpen}
            isCentered
            onClose={onClose}
            closeOnOverlayClick={false}
         >
            <ModalOverlay />
            <ModalContent maxWidth={'100vw'} width={'max-content'} padding={8}>
               <ModalCloseButton />
               <ModalBody padding={0}>
                  <Heading>Create Observability Appliance</Heading>
                  <FormOa
                     isCreatingNewOa={true}
                     onCancel={onClose}
                     onSubmit={onSubmit}
                     isSubmitting={isCreatingOa}
                  />
               </ModalBody>
            </ModalContent>
         </Modal>
      </>
   );
};
