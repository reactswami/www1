import { useDisclosure } from '@chakra-ui/react';
import { type IpRange } from '@statseeker/api/internal_api/entities';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { useEffect } from 'react';
import {
   useForm,
} from 'react-hook-form';
import { getRangesFromImportFile } from './api';
import { type ImportRangesFromFileFormData, type UseImportRangesFromFileReturn } from './types';


const useImportRangesFromFile = (onImport: (importedRanges: IpRange) => void): UseImportRangesFromFileReturn => {
   const disclosure = useDisclosure();
   const methods = useForm();

   useEffect(() => {
      if (disclosure.isOpen) {
         methods.reset();
      }
   }, [disclosure.isOpen, methods]);

   const toast = useToast();
   const { mutate: uploadIpRange, isPending: isUploading } = useMutation({
      mutationKey: ['uploadIpRanges'],
      mutationFn: (ipRange: ImportRangesFromFileFormData) => getRangesFromImportFile(ipRange),
      onSuccess: ({
         data: {
            result: { include, exclude },
         },
      }) => {
         toast({
            title: 'Success',
            description: 'IP ranges uploaded',
            status: 'success',
         });
         disclosure.onClose();

         onImport({
            include: include ? include : [],
            exclude: exclude ? exclude : [],
         });
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
   return {
      ipRangeDisclosure: disclosure,
      uploadIpRange,
      isUploading,
      methods,
   };
};

export default useImportRangesFromFile;
