import { Flex, Input as ChakraInput } from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
import { Input } from "@statseeker/components/Legacy/Input";
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from "react";
import { useFormContext } from 'react-hook-form';


export const parseCertificate = (file: File): Promise<string> => {
    const MAX_SIZE = 1024 * 1024; // 1MB
    return new Promise((resolve, reject) => {
        if (file.size > MAX_SIZE) {
            reject(new Error('Certificate file is too large. Maximum allowed size is 1MB.'));
            return;
        }
        const reader = new FileReader();

        reader.onloadend = (e: any) => {
            const content = e.target.result;
            if (typeof content !== 'string') {
                reject(new Error('Failed to read certificate file.'));
                return;
            }
            resolve(content as string);
        };

        reader.onerror = function () {
            const err = reader.error ? new Error(`Failed to read certificate file: ${reader.error.message}`) : new Error('Failed to read certificate file due to an unknown error.');
            reject(err);
        };

        reader.readAsText(file);
    });
};

export default function CertFileInput({
    isDisabled,
}: {
    isDisabled: boolean; /* Whether this input is disabled */
}) {
    const toast = useToast();
    const { setValue, watch } = useFormContext();
    const ldapCertificate = watch('ldap_certificate');
    const [localFileName, setLocalFileName] = useState<string | null>(null);

    // Ref for the file input to trigger it programmatically
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const changeFileMutation = useMutation({
        mutationFn: async (file: File | null) => {
            if (!file) throw new Error('No file selected.');
            const content = await parseCertificate(file);
            setValue('ldap_certificate', content);
            setLocalFileName(file.name);
        },
        onError: (error) => {
            toast({
                status: 'error',
                title: 'File Error',
                description: error.message || 'An error occurred while processing the file.',
            });
        },
    });

    return (
        <Flex w={350}>
            {/* File input here */}

            {/* The hidden file input actually handling the upload */}
            <ChakraInput
                type="file"
                ref={fileInputRef}
                onChange={async (file) => changeFileMutation.mutate(file.target.files ? file.target.files[0] : null)}
                isDisabled={isDisabled}
                hidden={true}
            />
            {/* The visible input showing the selected file name */}
            <Input
                isDisabled={true}
                value={
                    localFileName ? localFileName :
                        ldapCertificate === 'set' ? 'Certificate is set' :
                            ldapCertificate ? ldapCertificate : ''
                }
            />
            <Button
                variant={'secondary'}
                onClick={() => fileInputRef.current?.click()}
                isDisabled={isDisabled}
                flexGrow={1}
                minW={'-moz-fit-content'}
            >
                {ldapCertificate === 'set' ? 'Change Certificate' : 'Upload Certificate'}
            </Button>
        </Flex>
    );
}