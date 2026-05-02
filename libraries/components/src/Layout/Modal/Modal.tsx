import {
   Modal as ChakraModal,
   ModalOverlay as ChakraModalOverlay,
   ModalContent as ChakraModalContent,
   ModalHeader as ChakraModalHeader,
   ModalFooter as ChakraModalFooter,
   ModalBody as ChakraModalBody,
   ModalCloseButton as ChakraModalCloseButton,
   type ModalProps,
   type ModalOverlayProps,
   type ModalContentProps,
   type ModalHeaderProps,
   type ModalFooterProps,
   type ModalBodyProps,
   useDisclosure,
   type UseDisclosureReturn,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Modal = (props: ModalProps) => <ChakraModal {...props} />;

export const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>((props, ref) => {
   return <ChakraModalOverlay {...props} ref={ref} />;
});

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>((props, ref) => {
   return <ChakraModalContent {...props} ref={ref} />;
});

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>((props, ref) => {
   return <ChakraModalHeader {...props} ref={ref} />;
});

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>((props, ref) => {
   return <ChakraModalFooter {...props} ref={ref} />;
});

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>((props, ref) => {
   return <ChakraModalBody {...props} ref={ref} />;
});

export const ModalCloseButton = () => <ChakraModalCloseButton />;

export { useDisclosure };
export type { UseDisclosureReturn };
