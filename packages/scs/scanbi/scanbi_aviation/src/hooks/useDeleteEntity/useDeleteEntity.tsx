import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEntity } from '~/api/entity';
import { toastMessages } from '~/config/messages';
import { useToast } from '~/lib';
import { invalidateEntityQueries } from '~/types/api';
import { type EntityType } from '~/types/models';

interface Props {
   id: number;
   name: string;
   entity: EntityType;
}

export const useDeleteEntity = ({ id, name, entity }: Props) => {
   const queryClient = useQueryClient();
   const toast = useToast();
   return useMutation({
      mutationFn: () => deleteEntity({ id }, entity),
      onSuccess: () => {
         invalidateEntityQueries(entity, queryClient);
         toast(toastMessages.deleteEntity.success(entity, name));
      },
      onError: ({ message }) => {
         toast(toastMessages.deleteEntity.error(name, message));
      },
   });
};
