import { type UseDisclosureReturn } from '@chakra-ui/react';
import { SSAlertDialog } from '@statseeker/components/Layout/AlertDialog';
import { Text } from '@statseeker/components/Typography';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useDeleteSchedule from '../hooks/useDeleteSchedule';
import { getDiscoverScheduleByIdQuery } from '~/lib/ReactQuery/queryOptions/discoverSchedule';

interface Props {
   id: number[];
   disclosure: UseDisclosureReturn;
}

export default ({ id, disclosure }: Props) => {
   const { deleteScheduleMutation } = useDeleteSchedule({ disclosure });
   const { onClose, isOpen } = disclosure;
   const {
      data: schedule,
      refetch,
      isLoading,
   } = useQuery(getDiscoverScheduleByIdQuery({ id: id[0] }));
   const data = schedule?.data;
   const scheduleName = data && data?.length > 0 ? data[0]?.name : '';
   const { isPending } = deleteScheduleMutation;

   const handleConfirm = async () => {
      await deleteScheduleMutation.mutate({ ids: id });
      onClose();
   };

   useEffect(() => {
      if (!isOpen) return;
      refetch();
   }, [isOpen, refetch]);

   const getTitle = () => {
      if (id.length === 0) return 'Delete all configured schedules';
      if (id.length === 1) return `Delete Schedule - ${scheduleName}`;
      if (id.length > 1) return 'Delete Schedules';
      return '';
   };

   const count = id.length || 'all';
   const suffix = count === 1 ? '' : 's';
   const confirmation = `Are you sure you want to delete ${count} schedule${suffix}? This action cannot be undone`;

   return (
      <SSAlertDialog
         isOpen={isOpen}
         onClose={onClose}
         isCentered
         size="xl"
         title={getTitle()}
         confirmButton={{
            label: 'Delete',
            variant: 'danger',
            onClick: handleConfirm,
            isLoading: isPending || isLoading,
         }}
         cancelButton={{ label: 'Cancel' }}
         bodyProps={{ gap: 'md', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
         <Text paddingY={2}>{confirmation}</Text>
      </SSAlertDialog>
   );
};
