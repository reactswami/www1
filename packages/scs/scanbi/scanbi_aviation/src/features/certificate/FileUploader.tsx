import { Box, Button, Flex, HStack, Progress, Text, VStack } from '@chakra-ui/react';
import { FileIcon, LockClosedIcon, UploadIcon } from '@radix-ui/react-icons';
import { useToast } from '@statseeker/hooks';
import { useMutation } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { uploadCertifcates } from '~/api/certificates/api';
import { queryClient, queryKeys } from '~/lib';
import { type Certificate } from '~/types';

export function FileUploader({
   closeScheduler,
   showCancelButton = true,
}: {
   closeScheduler: () => void;
   showCancelButton?: boolean;
}) {
   const toast = useToast();
   const [publicFile, setPublicFile] = useState<File | null>(null);
   const [privateFile, setPrivateFile] = useState<File | null>(null);
   const { mutate: uploadCertificates, isPending: isUploading } = useMutation({
      mutationKey: ['uploadCertificatess'],
      mutationFn: (certificates: { client_cert: string; client_key: string }) =>
         uploadCertifcates(certificates),
      onSuccess: (data) => {
         toast({
            title: 'Success',
            description: 'Certificates uploaded successfully',
            status: 'success',
         });
         queryClient.invalidateQueries({ queryKey: queryKeys.ct_certificate });
         closeScheduler();
      },
      onError: (error: AxiosError<{ result?: { msg?: string } } | undefined>) => {
         let message = error?.response?.data?.result?.msg || error.message;
         toast({
            title: 'Error',
            description: message,
            status: 'error',
         });
      },
   });
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isPublic: boolean) => {
      if (e.target.files && e.target.files.length > 0) {
         if (isPublic) {
            setPublicFile(e.target.files[0] ?? null);
         } else {
            setPrivateFile(e.target.files[0] ?? null);
         }
      } else {
         if (isPublic) {
            setPublicFile(null);
         } else {
            setPrivateFile(null);
         }
      }
   };
   const acceptFileTypes = '.pem,.crt,.cer,.key,.p12,.pfx';
   const form = useForm<Certificate>();
   const {
      handleSubmit,
      register,
      formState: { errors },
      getValues,
   } = form;
   function handleFileUpload() {
      uploadCertificates({
         client_cert: getValues('client_cert'),
         client_key: getValues('client_key'),
      });
      closeScheduler();
   }
   const clientCertRegister = register('client_cert', {
      required: 'Client certificate is required',
   });
   const clientCertRef = useRef<HTMLInputElement>(null);
   useImperativeHandle(clientCertRegister.ref, () => clientCertRef.current);
   const clientKeyRegister = register('client_key', {
      required: 'Client key is required',
   });
   const clientKeyRef = useRef<HTMLInputElement>(null);
   useImperativeHandle(clientKeyRegister.ref, () => clientKeyRef.current);

   return (
      <Box>
         <VStack spacing={4} align="stretch" as={'form'} onSubmit={handleSubmit(handleFileUpload)}>
            <HStack spacing={4} align="stretch">
               <Box flex={1}>
                  <VStack
                     spacing={3}
                     p={4}
                     borderWidth="2px"
                     borderStyle="dashed"
                     borderColor={errors.client_cert ? 'red.500' : 'brand.200'}
                     borderRadius="md"
                     onClick={() => clientCertRef.current?.click()}
                     cursor="pointer"
                     transition="all 0.2s"
                     _hover={{ bg: '#e4ebf1' }}
                  >
                     <input
                        type="file"
                        style={{ display: 'none' }}
                        name={clientCertRegister.name}
                        ref={clientCertRef}
                        onChange={(e) => {
                           clientCertRegister.onChange(e);
                           handleFileChange(e, true);
                        }}
                        onBlur={clientCertRegister.onBlur}
                        accept={acceptFileTypes}
                     />
                     <FileIcon width={24} height={24} />
                     <Text fontWeight="medium">Public Certificate</Text>
                     {publicFile ? (
                        <Text fontSize="sm" color="green.500">
                           {publicFile.name}
                        </Text>
                     ) : (
                        <Text fontSize="sm" color="gray.500">
                           Click to select file
                        </Text>
                     )}
                  </VStack>
               </Box>
               <Box flex={1}>
                  <VStack
                     spacing={3}
                     p={4}
                     borderWidth="2px"
                     borderStyle="dashed"
                     borderColor={errors.client_key ? 'red.500' : 'brand.200'}
                     borderRadius="md"
                     onClick={() => clientKeyRef.current?.click()}
                     cursor="pointer"
                     transition="all 0.2s"
                     _hover={{ bg: '#e4ebf1' }}
                  >
                     <input
                        type="file"
                        style={{ display: 'none' }}
                        name={clientKeyRegister.name}
                        ref={clientKeyRef}
                        onChange={(e) => {
                           clientKeyRegister.onChange(e);
                           handleFileChange(e, false);
                        }}
                        onBlur={clientKeyRegister.onBlur}
                        accept={acceptFileTypes}
                     />
                     <LockClosedIcon width={24} height={24} />
                     <Text fontWeight="medium">Private Certificate</Text>
                     {privateFile ? (
                        <Text fontSize="sm" color="green.500">
                           {privateFile.name}
                        </Text>
                     ) : (
                        <Text fontSize="sm" color="gray.500">
                           Click to select file
                        </Text>
                     )}
                  </VStack>
               </Box>
            </HStack>
            {(publicFile ? 50 : 0) + (privateFile ? 50 : 0) > 0 && (
               <Progress
                  value={(publicFile ? 50 : 0) + (privateFile ? 50 : 0)}
                  size="sm"
                  colorScheme="green"
                  borderRadius="full"
               />
            )}
            <Flex mt={2} justifyContent={'flex-end'}>
               {showCancelButton ? (
                  <Button variant="ghost" mr={3} onClick={closeScheduler}>
                     Cancel
                  </Button>
               ) : null}
               <Button
                  leftIcon={<UploadIcon />}
                  type="submit"
                  isDisabled={!publicFile || !privateFile || isUploading}
                  isLoading={isUploading}
               >
                  Upload Certificates
               </Button>
            </Flex>
            <Flex>
               <Text color={'red'}>{errors.client_cert?.message}</Text>
            </Flex>
            <Flex>
               <Text color={'red'}>{errors.client_key?.message}</Text>
            </Flex>
         </VStack>
      </Box>
   );
}
