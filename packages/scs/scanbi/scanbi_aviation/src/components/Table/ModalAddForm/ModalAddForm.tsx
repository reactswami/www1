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

interface Props {
   disclosure: UseDisclosureReturn;
   render: () => React.ReactElement;
   title: string;
}

export const ModalAddForm = ({ disclosure, render, title }: Props) => {
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
