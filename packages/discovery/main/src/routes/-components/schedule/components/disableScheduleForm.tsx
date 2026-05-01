import { type UseDisclosureReturn } from '@chakra-ui/react';
import ConfirmDialog from '@statseeker/components/Legacy/ConfirmDialog/ConfirmDialog';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useDisableSchedule from '../hooks/useDisableSchedule';
import { getDiscoverScheduleByIdQuery } from '~/lib/ReactQuery/queryOptions/discoverSchedule';

interface Props {
   id: number[];
   disclosure: UseDisclosureReturn;
   enabled: number;
}

export default ({ id, disclosure, enabled }: Props) => {
   const { disableScheduleMutation } = useDisableSchedule({ disclosure, enabled });
   const { onClose, isOpen } = disclosure;
   const {
      data: schedule,
      refetch,
      isLoading,
   } = useQuery(getDiscoverScheduleByIdQuery({ id: id[0] }));
   const data = schedule?.data;
   const scheduleName = data && data?.length > 0 ? data[0]?.name : '';
   const { isPending } = disableScheduleMutation;

   const handleConfirm = async () => {
      await disableScheduleMutation.mutate({ id });
      onClose();
   };

   useEffect(() => {
      if (!isOpen) {
         return;
      }
      refetch(); // Refetch every time it opens (unless cached)
   }, [isOpen, refetch]);

   const getTitle = () => {
      if (id.length === 0) {
         return 'Disable all configured schedules';
      }

      if (id.length === 1) {
         return `Disable Schedule - ${scheduleName}`;
      }

      if (id.length > 1) {
         return `Disable Schedules`;
      }

      return '';
   };

   const count = id.length || 'all';
   const suffix = count === 1 ? '' : 's';
   const getConfirmation = () => `Are you sure you want to disable ${count} schedule${suffix}?`;

   return (
      <ConfirmDialog
         title={getTitle()}
         onAction={async () => await handleConfirm()}
         isLoading={isPending || isLoading}
         isOpen={isOpen}
         onClose={onClose}
         confirmation={getConfirmation()}
         action="Disable"
      />
   );
};
