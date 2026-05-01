import {
   Heading,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalOverlay,
} from '@chakra-ui/react';
import { ReactElement, type ReactNode } from 'react';
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

export const ModalEditForm = ({
   isOpen,
   onClose,
   oa,
   isSubmitting,
   onSubmit,
}: ModalEditFormProps) => {
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
                  <Heading>Edit Observability Appliance</Heading>
                  <FormOa
                     isSubmitting={isSubmitting}
                     isCreatingNewOa={false}
                     onSubmit={onSubmit}
                     id={oa?.id}
                     defaultValues={{
                        ...(oa ?? {}),
                        timeout: oa?.timeout.toString() ?? '10',
                     }}
                     isEnabled={oa?.poll === 'on'}
                     onCancel={onClose}
                  />
               </ModalBody>
            </ModalContent>
         </Modal>
      </>
   );
};