import {
   Modal,
   ModalContent,
   ModalOverlay,
} from '@chakra-ui/react';
import type React from 'react';
import { AssignServicesForm } from '../AssignServicesForm';

export interface Props extends React.ComponentProps<typeof AssignServicesForm> {
   isOpen: boolean;
   onClose: () => void;
}

export const ModalAssignServices = ({ isOpen, onClose, ...rest }: Props) => {
   return (
      <Modal
         isOpen={isOpen}
         isCentered
         onClose={onClose}
         size="xl"
         closeOnOverlayClick={false}
         closeOnEsc={false}
      >
         <ModalOverlay />
         <ModalContent>
            <AssignServicesForm onClose={onClose} {...rest} />
         </ModalContent>
      </Modal>
   );
};
