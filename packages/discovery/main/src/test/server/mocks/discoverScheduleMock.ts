import { apply_all_logic } from '@statseeker/api/internal_api/api-mocks';
import { type ApiObject } from '@statseeker/api/internal_api/types';
import { db } from '../db';

export function getDiscoverySchedule(request: ApiObject) {
   const _all_schedule = db.discover_schedule.getAll();
   let scheduleList = JSON.parse(JSON.stringify(_all_schedule));

   const matches = request.filter?.match('{id} = ([0-9]+)');
   if (matches && matches?.length > 0) {
      const scheduleId = parseInt(matches[1], 10);
      for (let i = scheduleList.length - 1; i >= 0; i--) {
         let schedule = scheduleList.data[i];
         if (schedule.id !== scheduleId) {
            scheduleList.splice(i, 1);
         }
      }
   }

   let scheduleData = _all_schedule;

   if (request.filter?.includes('mode')) {
      let filter = request.filter.split('=')[1].trim();
      filter = filter.split("'")[1].replaceAll("'", '');
      scheduleData = db.discover_schedule.findMany({
         where: {
            discoverMode: {
               equals: filter,
            },
         },
      });
   }

   if (request.filter?.includes('enabled')) {
      let filter;
      if (request.filter?.includes('AND')) {
         filter = request.filter.split('AND')[0].trim().split('REGEXP')[1];
      } else {
         filter = request.filter.split('REGEXP')[1].trim();
      }
      filter = filter.split("'")[1];
      scheduleData = db.discover_schedule.findMany({
         where: {
            enabled: {
               equals: Number(filter),
            },
         },
      });
   }

   const result = apply_all_logic(request, scheduleData);

   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714431052,
      sequence: 2,
      data_total: result.data_total,
      data: result.data,
      describe: null,
   };
}

export function getDiscoveryScheduleById(request: ApiObject) {
   const id = request?.id_filter && request?.id_filter[0];

   const schedule = db.discover_schedule.findFirst({
      where: {
         id: {
            equals: id,
         },
      },
   });

   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714431052,
      sequence: 2,
      data_total: 1,
      data: [schedule],
      describe: null,
   };
}
