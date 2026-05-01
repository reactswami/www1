import { useDisclosure } from '@chakra-ui/react';
import {
   type DiscoverExecuteOptions,
   type Task,
} from '@statseeker/api/internal_api/entities';
import ScheduleForm from '@statseeker/components/Legacy/ScheduleForm/ScheduleForm';
import DeleteScheduleForm from '../components/deleteScheduleForm';
import DisableScheduleForm from '../components/disableScheduleForm';
import useScheduleUpdate from './useScheduleUpdate';
import { validateDuplicateSchedule } from '~/utils';

/**
 * @description The hook colocates all the usage of the schedule form across the varioous
 * discover components and handles the submit handler separately for each of the cases.
 * Schedule form dependency will be limited to the hook through the task object on
 * various components.
 */
export default () => {
   const addDisclosure = useDisclosure();
   const editDisclosure = useDisclosure();
   const copyDisclosure = useDisclosure();
   const deleteDisclosure = useDisclosure();
   const disableDisclosure = useDisclosure();

   const { scheduleMutation: scheduleAdd } = useScheduleUpdate(addDisclosure, 'add');
   const { scheduleMutation: scheduleCopy } = useScheduleUpdate(copyDisclosure, 'add');
   const { scheduleMutation: scheduleEdit } = useScheduleUpdate(editDisclosure, 'edit');

   const displayScheduleAddForm = ({
      discoveryType,
      options,
   }: {
      discoveryType: 'Network' | 'Rewalk' | 'Ping-only';
      options: DiscoverExecuteOptions;
   }) => {
      if (addDisclosure) {
         return (
            <ScheduleForm
               title={`Create ${discoveryType} Schedule`}
               disclosure={addDisclosure}
               validateDuplicateSchedule={validateDuplicateSchedule}
               onSubmit={(task: Task) => {
                  const taskUpdated = {
                     ...task,
                     type: 'DiscoverSchedule',
                     commands: [{ ...DiscoverTaskCommand, options }],
                  };
                  scheduleAdd.mutate({ task: [taskUpdated] });
               }}
               defaultValue={{
                  scheduleName: '',
                  scheduleValue: '0 11 * * *',
               }}
               isSubmitting={scheduleAdd.isPending}
            />
         );
      }
   };

   const displayScheduleCopyForm = (ids: number[]) => {
      if (ids && ids.length === 1 && copyDisclosure) {
         return (
            <ScheduleForm
               validateDuplicateSchedule={validateDuplicateSchedule}
               disclosure={copyDisclosure}
               defaultValue={{ scheduleId: ids[0] as number }}
               title={"Copy Schedule"}
               saveButtonTitle='Copy'
               isCopy={true}
               onSubmit={(task: Task) => {
                  const { name, commands, time, type, enabled } = task;
                  const copyTask = { name, commands, time, type, enabled };
                  scheduleCopy.mutate({ task: [copyTask] });
               }}
               isSubmitting={scheduleCopy.isPending}
            />
         );
      }
   };

   const displayScheduleEditForm = (ids: number[]) => {
      if (ids && ids.length === 1 && editDisclosure) {
         return (
            <ScheduleForm
               validateDuplicateSchedule={validateDuplicateSchedule}
               disclosure={editDisclosure}
               defaultValue={{ scheduleId: ids[0] as number }}
               title={"Edit Schedule"}
               onSubmit={(task: Task) => {
                  scheduleEdit.mutate({ task: [task] });
               }}
               isSubmitting={scheduleEdit.isPending}
            />
         );
      }
   };

   const displayDeleteScheduleForm = (ids: number[] | 'all' | undefined) => {
      if (ids && ids.length > 0 && deleteDisclosure) {
         return <DeleteScheduleForm disclosure={deleteDisclosure} id={ids === 'all' ? [] : ids} />;
      }
   };

   const displayDisableScheduleForm = (ids: number[]) => {
      if (ids && ids.length > 0 && disableDisclosure) {
         return (
            <DisableScheduleForm disclosure={disableDisclosure} id={ids as number[]} enabled={0} />
         );
      }
   };

   return {
      displayScheduleEditForm,
      displayDeleteScheduleForm,
      displayDisableScheduleForm,
      displayScheduleAddForm,
      displayScheduleCopyForm,
      addDisclosure,
      editDisclosure,
      copyDisclosure,
      deleteDisclosure,
      disableDisclosure,
   };
};

export const DiscoverTaskCommand = {
   command: 'execute',
   object_type: 'discover',
   context: 'ui-api-execute',
};
