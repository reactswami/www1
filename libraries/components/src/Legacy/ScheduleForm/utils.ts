import { type CronExpression, CronExpressionParser, CronFieldCollection } from 'cron-parser';
import {
   type DayOfMonthRange,
   type HourRange,
   type SixtyRange,
   type DayOfWeekRange,
} from 'cron-parser/dist/types/fields';

import cronstrue from 'cronstrue';
import {
   ScheduleType,
   type ScheduleTypeValues,
   type ScheduleFormValues,
   type ScheduleProps,
} from './types';

// 2017-02-10T08:12:39.483Z - Run Once
// 10 12 * * * - Daily
// 10 12 * * 2,3,4 - Weekly
// 10 12 4-10 * * - Monthly
// 10 12-15 4-10 * * - Advanced
export const getInterval = (scheduleValue: string | number) => {
   try {
      return CronExpressionParser.parse(scheduleValue as string);
   } catch {
      return null;
   }
};
export const isDaily = (interval: CronExpression) => {
   const allDays = interval.fields?.dayOfMonth?.values?.length === 31;
   const allWeek = interval.fields?.dayOfWeek?.values?.length === 8;
   const atHour = interval.fields?.hour.values.length === 1;
   const atMinute = interval.fields?.minute.values.length === 1;
   const atSecond =
      interval.fields.second.values.length === 1 && interval.fields.second.values[0] === 0;

   return allDays && allWeek && atHour && atMinute && atSecond;
};

export const isWeekly = (interval: CronExpression) => {
   const allDays = interval?.fields?.dayOfMonth?.values?.length === 31;
   const allWeek = interval?.fields?.dayOfWeek?.values?.length < 7;
   const atHour = interval.fields.hour.values.length === 1;
   const atMinute = interval.fields.minute.values.length === 1;
   const atSecond =
      interval.fields.second.values.length === 1 && interval.fields.second.values[0] === 0;

   return allDays && allWeek && atHour && atMinute && atSecond;
};

export const isMonthly = (interval: CronExpression) => {
   const allDays =
      interval?.fields?.dayOfMonth?.values?.length < 31 &&
      interval?.fields?.dayOfMonth?.values[0] !== 'L';
   const allWeek = interval?.fields?.dayOfWeek?.values?.length === 8;
   const atHour = interval.fields.hour.values.length === 1;
   const atMinute = interval.fields.minute.values.length === 1;
   const atSecond =
      interval.fields.second.values.length === 1 && interval.fields.second.values[0] === 0;

   return allDays && allWeek && atHour && atMinute && atSecond;
};

export const getCronValue = (
   item: string | null | undefined,
   cronValue: string | null | undefined | number
) => {
   let isCronValid = true;
   const actualValue = item ? item : cronValue ?? '';

   if (!isNaN(cronValue as number)) {
      return new Date((cronValue as number) * 1000).toLocaleString();
   }

   try {
      CronExpressionParser.parse(actualValue as string);
   } catch (e) {
      isCronValid = false;
   }

   if (!isCronValid) {
      return '';
   }

   try {
      const test = cronstrue.toString(actualValue as string, { verbose: true });
      if (test.includes('second')) {
         return '';
      }
      return test;
   } catch {
      return '';
   }
};

/*
 * The date time control requires the data to prepend with a zero if
 * hour or mintue is a single digit.
 * 2 am should be 02:00
 */
const formatRunAt = (hour: number, min: number) => {
   const fmtHour = hour < 10 ? `0${hour}` : hour;
   const fmtMin = min < 10 ? `0${min}` : min;
   return `${fmtHour}:${fmtMin}`;
};

export const getDefaultValues = (schedule: ScheduleProps): ScheduleFormValues => {
   const appendZero = (d: number) => (d < 10 ? `0${d}` : `${d}`);
   if (schedule.scheduleValue) {
      if (!isNaN(schedule.scheduleValue as number)) {
         const date = new Date((schedule.scheduleValue as number) * 1000);
         const runonce = `${date.getFullYear()}-${appendZero(date.getMonth() + 1)}-${appendZero(
            date.getDate()
         )}T${appendZero(date.getHours())}:${appendZero(date.getMinutes())}`;

         return {
            enabled: schedule.scheduleEnabled,
            scheduleName: schedule?.scheduleName,
            runOnce: runonce,
            scheduleType: ScheduleType.Once,
         };
      }
      const interval = getInterval(schedule.scheduleValue);

      if (!interval) {
         throw 'Invalid Schedule Value';
      }

      if (isDaily(interval)) {
         const hour = interval.fields?.hour.values[0];
         const minute = interval.fields?.minute.values[0];
         return {
            enabled: schedule.scheduleEnabled,
            scheduleName: schedule?.scheduleName,
            runAt: formatRunAt(hour, minute),
            scheduleType: ScheduleType.Daily,
         };
      }

      if (isWeekly(interval)) {
         const hour = interval.fields?.hour.values[0];
         const minute = interval.fields?.minute.values[0];
         const weeks = interval.fields?.dayOfWeek.values;
         return {
            enabled: schedule.scheduleEnabled,
            scheduleName: schedule?.scheduleName,
            runAt: formatRunAt(hour, minute),
            weekDays: weeks.map((n: number) => String(n)),
            scheduleType: ScheduleType.Weekly,
         };
      }

      if (isMonthly(interval)) {
         const hour = interval.fields?.hour.values[0];
         const minute = interval.fields?.minute.values[0];
         const days = interval.fields?.dayOfMonth.values;
         return {
            enabled: schedule.scheduleEnabled,
            scheduleName: schedule?.scheduleName,
            runAt: formatRunAt(hour, minute),
            daysOfMonth: days.map((n: any) => n.toString()),
            scheduleType: ScheduleType.Monthly,
         };
      }

      return {
         scheduleName: schedule?.scheduleName,
         cron: schedule?.scheduleValue as string,
         scheduleType: ScheduleType.Advanced,
         enabled: schedule.scheduleEnabled,
      };
   }

   return {
      scheduleName: schedule?.scheduleName,
      runOnce: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000)
         .toISOString()
         .slice(0, 16)
         .split('T')[1],
      scheduleType: ScheduleType.Once,
      enabled: schedule.scheduleEnabled,
   };
};

export const getWeeklyCron = ({
   hour,
   min,
   weekDays,
}: {
   hour: number | HourRange;
   min: number | SixtyRange;
   weekDays: string[];
}) => {
   const interval = CronExpressionParser.parse(`${min} ${hour} * * *`);

   const modified = CronFieldCollection.from(interval.fields, {
      hour: [hour as unknown as HourRange],
      minute: [min as unknown as SixtyRange],
      dayOfWeek: weekDays.map((n) => Number(n) as unknown as DayOfWeekRange),
   });

   return modified.stringify(); // "30 8 * * 1,3,5"
};

export const getMonthlyCron = ({
   hour,
   min,
   daysOfMonth,
}: {
   hour: number | HourRange;
   min: number | SixtyRange;
   daysOfMonth: string[];
}) => {
   const interval = CronExpressionParser.parse(`${min} ${hour} * * *`);

   const modified = CronFieldCollection.from(interval.fields, {
      hour: [hour as unknown as HourRange],
      minute: [min as unknown as SixtyRange],
      dayOfMonth: daysOfMonth.map((n) => Number(n) as unknown as DayOfMonthRange),
   });

   return modified.stringify(); // "30 8 * * 1,3,5"
};

export const getDailyCron = ({
   hour,
   min,
}: {
   hour: number | HourRange;
   min: number | SixtyRange;
}) => {
   const interval = CronExpressionParser.parse(`${min} ${hour} * * *`);

   const modified = CronFieldCollection.from(interval.fields, {
      hour: [hour as unknown as HourRange],
      minute: [min as unknown as SixtyRange],
   });

   return modified.stringify(); // "30 8 * * 1,3,5"
};

export const getCronToSubmit = ({
   scheduleType,
   data,
}: {
   scheduleType: ScheduleTypeValues;
   data: ScheduleFormValues;
}): string | number => {
   let crondata = null;
   let min = 0;
   let hour = 0;

   if (data?.runAt) {
      hour = Number(data?.runAt?.split(':')[0]);
      min = Number(data?.runAt?.split(':')[1]);
   }

   if (scheduleType === ScheduleType.Weekly && data?.runAt && data?.weekDays) {
      crondata = getWeeklyCron({
         hour: hour,
         min: min,
         weekDays: data?.weekDays,
      });
   }

   if (scheduleType === ScheduleType.Daily && data?.runAt) {
      crondata = getDailyCron({
         hour: hour,
         min: min,
      });
   }

   if (scheduleType === ScheduleType.Monthly && data?.runAt && data?.daysOfMonth) {
      crondata = getMonthlyCron({
         hour: hour,
         min: min,
         daysOfMonth: data?.daysOfMonth,
      });
   }

   if (scheduleType === ScheduleType.Advanced && data?.cron) {
      crondata = data.cron;
   }

   if (scheduleType === ScheduleType.Once && data?.runOnce) {
      crondata = new Date(data.runOnce).getTime() / 1000;
   }

   if (!crondata) {
      throw 'Failed to resolve the schedule';
   }
   return crondata;
};
