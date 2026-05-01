import {
   Modal as ChakraModal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   useDisclosure,
} from '@chakra-ui/react';

import { type ReactNode } from 'react';

export interface useModalProps {
   title: string;
   body: ReactNode;
   footer: ReactNode;
   closeOnOverlayClick?: boolean;
}
export const useModal = ({
   title,
   body,
   footer,
   closeOnOverlayClick = true,
}: useModalProps) => {
   const { isOpen, onOpen, onClose } = useDisclosure();

   const Modal = () => (
      <ChakraModal
         closeOnOverlayClick={closeOnOverlayClick}
         isOpen={isOpen}
         onClose={onClose}
      >
         <ModalOverlay />
         <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{body}</ModalBody>
            <ModalFooter>{footer}</ModalFooter>
         </ModalContent>
      </ChakraModal>
   );

   return {
      close: onClose,
      open: onOpen,
      Modal,
   };
};
