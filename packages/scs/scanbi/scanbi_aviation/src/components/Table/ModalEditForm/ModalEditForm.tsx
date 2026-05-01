import {
   Heading,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalOverlay,
   type UseDisclosureReturn,
} from '@chakra-ui/react';
import React from 'react';

export interface EditProps {
   disclosure: UseDisclosureReturn;
   render: () => React.ReactElement;
   title: string;
}

export const ModalEditForm = ({ disclosure, render, title }: EditProps) => {
   return (
      <>
         <Modal
            isOpen={disclosure.isOpen}
            isCentered
            onClose={disclosure.onClose}
            closeOnOverlayClick={false}
         >
            <ModalOverlay />
            <ModalContent maxWidth={'100vw'} width={'max-content'} padding={8}>
               <ModalCloseButton />
               <ModalBody padding={0}>
                  <Heading>{title}</Heading>
                  {render()}
               </ModalBody>
            </ModalContent>
         </Modal>
      </>
   );
};
