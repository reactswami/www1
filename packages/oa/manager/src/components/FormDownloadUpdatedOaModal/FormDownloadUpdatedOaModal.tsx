import {
   Button,
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
   Text,
} from '@chakra-ui/react';

import { DownloadIcon } from '@statseeker/ui/icons';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '~/lib/ReactQuery';

interface Props {
   isOpen: boolean;
   onClose: () => void;
   newOaName: string;
}

export const FormDownloadUpdatedOaModal = ({ isOpen, onClose, newOaName }: Props) => {
   const queryClient = useQueryClient();

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         onCloseComplete={() => {
            queryClient.invalidateQueries({ queryKey: queryKeys.all });
         }}
         closeOnOverlayClick={false}
      >
         <ModalOverlay />
         <ModalContent minWidth={'max-content'}>
            <ModalCloseButton />

            <ModalHeader>Observability Appliance Updated</ModalHeader>

            <ModalBody>
               <Text>Your Observability Appliance configuration has been updated.</Text>
               <Text>Please download the new image for deployment.</Text>
            </ModalBody>

            <ModalFooter>
               <Button
                  mr={3}
                  onClick={() => {
                     const newTab = window.open(
                        `/cgi/oa_image_downloader?name=${newOaName}`,
                        '_blank'
                     );
                     if (newTab) {
                        newTab.focus();
                        onClose();
                     }
                  }}
                  leftIcon={<DownloadIcon />}
               >
                  Download
               </Button>
               <Button variant="ghost" onClick={onClose}>
                  Close
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
};
