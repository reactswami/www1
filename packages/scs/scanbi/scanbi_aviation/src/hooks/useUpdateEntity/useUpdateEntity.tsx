import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError, type AxiosResponse } from 'axios';
import { updateEntity } from '~/api';
import { toastMessages } from '~/config/messages';
import { useToast } from '~/lib';
import { type UpdatePayload, invalidateEntityQueries } from '~/types/api';
import { type EntityType } from '~/types/models';
import { ENTITY_TYPE } from '~/utils';

interface Props {
   onCloseFormModal: () => void; // This allow to close the add modal itself
   entity: EntityType;
}

export const useUpdateEntity = ({ onCloseFormModal, entity }: Props) => {
   const toast = useToast();
   const queryClient = useQueryClient();
   const { mutate: updateEntityMutation, isPending: isUpdatingEntity } = useMutation<
      AxiosResponse<unknown>,
      AxiosError,
      UpdatePayload
   >({
      mutationFn: (updatedEntity) => updateEntity({ ...updatedEntity }, entity),
      onSuccess: (response, updatedEntity) => {
         invalidateEntityQueries(entity, queryClient);
         onCloseFormModal();
         if (updatedEntity.title) {
            toast(toastMessages.updateEntity.success(updatedEntity.title));
         } else {
            if (entity === ENTITY_TYPE.NETWORKS) {
               toast(toastMessages.updateEntity.success(updatedEntity.scannerNetworkTitle));
            } else {
               toast(toastMessages.updateEntity.success(updatedEntity.name));
            }
         }
      },
      onError: (
         {
            response: {
               // @ts-ignore
               data: {
                  result: { msg },
               },
            },
         },
         updatedEntity
      ) => {
         if (updatedEntity.title) {
            toast(toastMessages.updateEntity.error(updatedEntity.title, msg));
         } else {
            if (entity === ENTITY_TYPE.NETWORKS) {
               toast(toastMessages.updateEntity.error(updatedEntity.scannerNetworkTitle, msg));
            } else {
               toast(toastMessages.updateEntity.error(updatedEntity.name, msg));
            }
         }
      },
   });

   return {
      updateEntity: updateEntityMutation,
      isUpdatingEntity,
   };
};
