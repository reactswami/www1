import { useDisclosure } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError, type AxiosResponse } from 'axios';
import { useRef } from 'react';
import { type SubmitHandler } from 'react-hook-form';
import { type TableRowData } from '../useFetchOaTableData';
import { type UpdateOaPayload, updateOa } from '~/api';
import { toastMessages } from '~/config/messages';
import { useToast, queryKeys } from '~/lib';
import { type OaFormValues } from '~/types';


interface Props {
   oa: TableRowData;
}

export const useUpdateOa = ({ oa }: Props) => {
   const toast = useToast();
   const queryClient = useQueryClient();
   const updatedOaName = useRef<string>();
   const { mutate, isPending: isUpdatingOa } = useMutation<
      AxiosResponse<unknown>,
      AxiosError,
      UpdateOaPayload
   >({
      mutationFn: (updatedOa) => updateOa({ ...updatedOa }),
      onSuccess: (response, updatedOa) => {
         const name = (response.data as { name: string }).name;
         updatedOaName.current = name;
         closeEdit();
         queryClient.invalidateQueries({ queryKey: queryKeys.all });
         if (updatedOa.dirtyFields) {
            openDownload(); // Open the download modal
         }
         toast(toastMessages.updateOa.success(updatedOa.name));
      },
      onError: (
         {
            response: {
               // @ts-ignore
               data: { message },
            },
         },
         updatedOa
      ) => {
         toast(toastMessages.updateOa.error(updatedOa.name, message));
      },
   });

   const onSubmit: SubmitHandler<OaFormValues> = (data) => {
      const body = generateUpdateOaPayload(oa?.name, data);
      mutate(body);
   };

   const { onOpen: openDownload, isOpen: isDownloadOpen, onClose: closeDownload } = useDisclosure();
   const { onOpen: openEdit, isOpen: isEditOpen, onClose: closeEdit } = useDisclosure();

   return {
      isUpdatingOa,
      openEdit,
      closeEdit,
      isEditOpen,
      onSubmit,
      isDownloadOpen,
      closeDownload,
      updatedOaName: updatedOaName.current,
   };
};

const generateUpdateOaPayload = (
   name: string,
   data: OaFormValues
): UpdateOaPayload => {
   const {
      hostname,
      ipaddress,
      netmask,
      gateway,
      timeout,
      region,
      site,
      location,
      latitude,
      longitude,
      dirtyFields,
      ipv6address,
      ipv6gateway,
      ipv6prefix
   } = data;

   const body: Partial<UpdateOaPayload> = {
      name,
      hostname,
      ipaddress,
      netmask,
      gateway,
      ipv6address,
      ipv6gateway,
      ipv6prefix,
      region,
      site,
      latitude,
      longitude,
      location: location ?? '',
      timeout: Number(timeout),
      dirtyFields
   };

   return body;
};