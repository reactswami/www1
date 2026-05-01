import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities/snmp_credential';
import { CredentialsForm } from '@statseeker/components/Legacy/CredentialsForm';
import { useToast } from '@statseeker/hooks';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { addCredential } from '~/api/snmp_credential';
import { queryClient } from '~/lib/ReactQuery';

export function AddCredentialsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const toast = useToast();
    const mutation = useMutation({
        mutationFn: (credential: SNMPCredential) => addCredential({ newCred: credential }),
        onSuccess: () => {
            queryClient.invalidateQueries();
            onClose();
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to create SNMP Credential',
                status: 'error',
            });
        },
    });
    const handleSubmit = useCallback(
        function handleSubmit(credential: SNMPCredential) {
            mutation.mutate(credential);
        },
        [mutation]
    );
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'6xl'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add SNMP Credentials</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <CredentialsForm
                        mode="add"
                        defaultValues={{ version: 2 }}
                        onSubmit={handleSubmit}
                        mutationIsSuccess={mutation.isSuccess}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
