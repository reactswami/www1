import { useDisclosure } from '@chakra-ui/react';
import { type Task } from '@statseeker/api/internal_api/entities';
import { useToast } from '@statseeker/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userSyncTaskQuery } from '~/lib/ReactQuery/queryOptions';
import { updateUserSyncSchedule } from '~/utils/utils';


export function useUserSyncConfigureSchedule(userSyncScheduleTask: Task | undefined) {
    const scheduleDisclosure = useDisclosure();
    const queryClient = useQueryClient();
    const toast = useToast();


    const mutation = useMutation({
        mutationFn: (taskData: Task) => updateUserSyncSchedule({ queryClient, enabled: taskData.enabled, time: taskData.time }),
        onSuccess: () => {
            scheduleDisclosure.onClose();
            toast({
                title: 'Success',
                description: 'Schedule Updated',
                status: 'success',
            });
            queryClient.invalidateQueries({ queryKey: userSyncTaskQuery.queryKey });
        },
        onError: ({ message }) => {
            toast({
                title: 'Error',
                description: message,
                status: 'error',
            });
        },
    });

    return {
        scheduleDisclosure,
        mutation,
        userSyncScheduleTask,
    };
}