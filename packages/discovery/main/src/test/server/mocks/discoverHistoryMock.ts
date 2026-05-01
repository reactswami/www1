import { apply_all_logic } from '@statseeker/api/internal_api/api-mocks';
import { type ApiObject } from '@statseeker/api/internal_api/types';
import { db } from '../db';

export function getDiscoveryHistoryById(request: ApiObject) {

   const id = request?.id_filter && request?.id_filter[0];

   const history = db.discover_history.findFirst({
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
      data: [history],
      describe: null,
   };
}

export function getDiscoveryHistory(request: ApiObject) {
   const _all_history = db.discover_history.getAll();
   let historyList = JSON.parse(JSON.stringify(_all_history));

   const matches = request.filter?.match('{id} = ([0-9]+)');
   if (matches && matches?.length > 0) {
      const historyId = parseInt(matches[1], 10);
      for (let i = historyList.length - 1; i >= 0; i--) {
         let history = historyList.data[i];
         if (history.id !== historyId) {
            historyList.splice(i, 1);
         }
      }
   }

   let historyData = _all_history;

   if (request.filter?.includes('user')) {
      let filter = request.filter.split('=')[1].trim();
      filter = filter.split("'")[1];
      historyData = db.discover_history.findMany({
         where: {
            user: {
               equals: filter,
            },
         },
      });
   }

   if (request.filter?.includes('mode')) {
      const filter = request.filter.split('=')[1].trim();
      historyData = db.discover_history.findMany({
         where: {
            mode: {
               equals: filter,
            },
         },
      });
   }

   if (request.filter?.includes('status')) {
      let filter;
      if (request.filter?.includes('AND')) {
         filter = request.filter.split('AND')[1].trim().split('=')[1];
      } else {
         filter = request.filter.split('=')[1].trim();
      }
      filter = filter.split("'")[1];
      historyData = db.discover_history.findMany({
         where: {
            status: {
               equals: filter,
            },
         },
      });
   }

   const result = apply_all_logic(request, historyData);

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
export function describeDiscoverHistoryMock() {
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714629694,
      sequence: 26,
      data_total: 0,
      data: [],
      describe: {
         allow_formula_fields: true,
         fields: {
            mode: {
               description: 'The mode the discovery process was run in',
               datatype: 'string',
               enum: {
                  '0': {
                     description: 'Rewalk',
                     label: 'Rewalk',
                  },
                  '1': {
                     description: 'Network Discovery',
                     label: 'Discover',
                  },
                  '2': {
                     label: 'Manual',
                     description: 'Manual Device Addition',
                  },
               },
               title: 'Mode',
            },
         },
         description:
            'This object contains details about current and past discovery and rewalk processes.',
         type: 'discover_history',
      },
   };
}
