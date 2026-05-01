import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Flex,
} from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
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
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {'Confirm Execute'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex flexDirection="column" gap={4}>
                        <Text>
                            Are you sure you want to perform a user synchronization?
                        </Text>
                        <Text>
                            Misconfigured policies can result in a large number of users added to {getProductName()}.
                            Please consider performing a dry run to validate policy configuration.
                        </Text>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" mr={3} onClick={handleConfirm}>
                        {'Run'}
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}