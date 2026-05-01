import { type Task } from '@statseeker/api/internal_api/entities';
import ScheduleForm from '@statseeker/components/Legacy/ScheduleForm/ScheduleForm';

export function UserSyncConfigureSchedule({
    scheduleDisclosure,
    mutation,
    userSyncScheduleTask
}: any) {
    return (
        <ScheduleForm
            title='Configure User Synchronization Schedule'
            disclosure={scheduleDisclosure}
            onSubmit={(task: Task) => mutation.mutate(task)}
            defaultValue={{
                scheduleId: userSyncScheduleTask?.id,
                scheduleName: 'User Synchronization Scheule',
                scheduleEnabled: false,
            }}
            isSubmitting={mutation.isPending}
            allowEnableConfiguration={true}
            disabledFields={['scheduleName']}
        />
    );
}