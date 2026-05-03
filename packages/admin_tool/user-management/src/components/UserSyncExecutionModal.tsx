import { SSModal } from '@statseeker/components/Layout/Modal';
import { Flex } from '@statseeker/components/Layout/Flex';
import { Text } from '@statseeker/components/Typography/Text';
import { getProductName } from '@statseeker/utils/environment';

export function UserSyncExecutionModal({
   isOpen,
   onClose,
   onConfirm,
}: {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
}) {
   const handleConfirm = () => {
      onConfirm();
      onClose();
   };

   return (
      <SSModal
         isOpen={isOpen}
         onClose={onClose}
         size="lg"
         title="Confirm Execute"
         confirmButton={{ label: 'Run', variant: 'primary', onClick: handleConfirm }}
         cancelButton={{ label: 'Cancel', onClick: onClose }}
      >
         <Flex flexDirection="column" gap={4}>
            <Text>
               Are you sure you want to perform a user synchronization?
            </Text>
            <Text>
               Misconfigured policies can result in a large number of users added to {getProductName()}.
               Please consider performing a dry run to validate policy configuration.
            </Text>
         </Flex>
      </SSModal>
   );
}
