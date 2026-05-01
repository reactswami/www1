import { type UseDisclosureReturn } from '@chakra-ui/react';
import { type Task } from '@statseeker/api/internal_api/entities';

export const ScheduleType = Object.freeze({
   Once: 'one_time',
   Daily: 'daily',
   Weekly: 'weekly',
   Monthly: 'monthly',
   Advanced: 'advanced',
});

export const DaysOfWeek = Object.freeze({
   Monday: '1',
   Tuesday: '2',
   Wednesday: '3',
   Thursday: '4',
   Friday: '5',
   Saturday: '6',
   Sunday: '0',
});

type ScheduleTypeKeys = keyof typeof ScheduleType;
export type ScheduleTypeValues = (typeof ScheduleType)[ScheduleTypeKeys];

export type ScheduleProps = {
   scheduleName?: string;
   scheduleValue?: string | number;
   scheduleId?: number;
   scheduleEnabled?: boolean;
};

export type ScheduleFormProps = {
   disclosure: UseDisclosureReturn;
   defaultValue: ScheduleProps;
   title?: string;
   saveButtonTitle?: string;
   isCopy?: boolean;
   onSubmit: (schedule: Task) => void;
   isSubmitting?: boolean;
   validateDuplicateSchedule?: (id?: number, value?: string | number) => Promise<string | undefined>;
   allowEnableConfiguration?: boolean;
   disabledFields?: string[];
};

export type ScheduleFormValues = {
   scheduleName?: string;
   scheduleType: ScheduleTypeValues;
   runOnce?: string;
   weekDays?: string[];
   daysOfMonth?: string[];
   runAt?: string;
   cron?: string;
   enabled?: boolean;
};
