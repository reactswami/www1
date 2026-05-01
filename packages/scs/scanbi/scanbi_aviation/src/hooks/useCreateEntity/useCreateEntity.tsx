import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosError, type AxiosResponse } from 'axios';
import { createEntity } from '~/api/entity';
import { toastMessages } from '~/config/messages';
import { useToast } from '~/lib';
import { type CreatePayload, invalidateEntityQueries } from '~/types/api';
import { type EntityType } from '~/types/models';

interface Props {
   onCloseFormModal: () => void; // This allow to close the add modal itself
   entity: EntityType;
}

export const useCreateEntity = ({ onCloseFormModal, entity }: Props) => {
   const toast = useToast();
   const queryClient = useQueryClient();
   const { mutate: createEntityMutation, isPending: isCreatingEntity } = useMutation<
      AxiosResponse<unknown>,
      AxiosError,
      CreatePayload
   >({
      mutationFn: (newEntity) => createEntity({ ...newEntity }, entity),
      onSuccess: (response, newEntity) => {
         invalidateEntityQueries(entity, queryClient);
         const name = (response.data as { name: string }).name;
         onCloseFormModal();
         toast(toastMessages.createEntity.success(entity));
         return response.data;
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
         newEntity
      ) => {
         toast(toastMessages.createEntity.error(entity, msg));
      },
   });

   return {
      createEntity: createEntityMutation,
      isCreatingEntity,
   };
};
