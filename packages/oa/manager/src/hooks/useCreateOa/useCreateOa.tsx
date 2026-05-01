import { useDisclosure } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { type AxiosError, type AxiosResponse } from 'axios';
import { useRef } from 'react';
import { type SubmitHandler } from 'react-hook-form';
import { type CreateOaPayload, createOa } from '~/api';
import { toastMessages } from '~/config/messages';
import { useToast } from '~/lib';
import { type OaFormValues } from '~/types';

export const useCreateOa = () => {
   const toast = useToast();
   const newOaName = useRef<string>();
   const { mutate: createOaMutation, isPending: isCreatingOa } = useMutation<
      AxiosResponse<unknown>,
      AxiosError,
      CreateOaPayload
   >({
      mutationFn: (newOa) => createOa({ ...newOa }),
      onSuccess: (response) => {
         const name = (response.data as { name: string }).name;
         newOaName.current = name;
         closeCreate();
         openDownload(); // Open the download modal
         toast(toastMessages.createOa.success());
      },
      onError: (
         {
            response: {
               // @ts-ignore
               data: { message },
            },
         },
      ) => {
         toast(toastMessages.createOa.error(message));
      },
   });
   const { onOpen: openDownload, isOpen: isNewDownloadOpen, onClose: closeNewDownload } = useDisclosure();
   const { onOpen: openCreate, isOpen: isCreateOpen, onClose: closeCreate } = useDisclosure();

   const onSubmit: SubmitHandler<OaFormValues> = (data) => {
      const body = generateCreateOaPayload(data);
      createOaMutation(body);
   };

   return {
      isCreatingOa,
      openCreate,
      isCreateOpen,
      closeCreate,
      onSubmit,
      isNewDownloadOpen,
      closeNewDownload,
      newOaName: newOaName.current,
   };
};

const generateCreateOaPayload = (data: OaFormValues): CreateOaPayload => {
   const {
      hostname,
      manual_name,
      ipaddress,
      netmask,
      gateway,
      timeout,
      region,
      site,
      location,
      latitude,
      longitude,
      ipv6address,
      ipv6gateway,
      ipv6prefix
   } = data;

   const body: CreateOaPayload = {
      hostname,
      manual_name,
      ipaddress,
      netmask,
      gateway,
      region: region ?? '',
      site: site ?? '',
      location: location ?? '',
      timeout: Number(timeout),
      latitude: 0,
      longitude: 0,
      ipv6address,
      ipv6gateway,
      ipv6prefix
   };

   // Passing an empty string for lat/lon isn't supported by the API
   if (latitude) {
      body.latitude = Number(latitude);
   }
   if (longitude) {
      body.longitude = Number(longitude);
   }

   return body;
};
