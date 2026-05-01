import { type ApiField, type ApiObject } from '@statseeker/api/internal_api';
import { apply_all_logic } from '@statseeker/api/internal_api/api-mocks';
import { type IpRangeConfig } from '~/types/ipRange';

type ipRangeType = {
   id: number;
   name: string;
   enabled?: 1 | 0;
   ip_range?: {
      include?: string[];
      exclude?: string[];
   };
};
const ipRanges: ipRangeType[] = [
   {
      id: 1,
      name: 'Default',
      enabled: 1,
      ip_range: {
         include: ['10.100.0.0/16', '10.200.1.*'],
         exclude: [],
      },
   },
   {
      id: 34,
      name: 'Private Network',
      enabled: 1,
      ip_range: {
         include: ['10.300.1.10'],
         exclude: [],
      },
   },
   {
      id: 5,
      name: 'Public Network',
      enabled: 1,
      ip_range: {
         include: ['10.300.[2-20].*'],
         exclude: [
            '10.300.2.55',
            '10.300.3.55',
            '10.300.4.55',
            '10.300.5.55',
            '10.300.6.55',
            '10.300.7.55',
            '10.300.8.55',
            '10.300.9.55',
            '10.300.10.55',
            '10.300.11.55',
            '10.300.12.55',
         ],
      },
   },
   {
      id: 4,
      name: 'DMZ',
      enabled: 1,
      ip_range: {
         include: ['10.99.99.0/24'],
         exclude: [],
      },
   },
   {
      id: 3,
      name: 'Head Office but its a really long name that definitely will not fit in the list width',
      enabled: 0,
      ip_range: {
         include: ['10.200.1.*'],
         exclude: ['10.200.1.55'],
      },
   },
];

export function getRangesMock(request: ApiObject) {
   // Take a copy so array is new, but object refs are still intact
   let myIpRanges = [...ipRanges];

   // Apply enabled filter
   let enabledFilter: number | undefined = undefined;
   let enabledField = request.fields?.find((field: string | ApiField) => {
      if (typeof field === 'string') {
         return field === 'enabled';
      }
      return field.key === 'enabled';
   });
   if (enabledField && typeof enabledField !== 'string') {
      if (enabledField?.filter === '= 1') {
         enabledFilter = 1;
      } else if (enabledField?.filter === '= 0') {
         enabledFilter = 0;
      }
   }
   if (enabledFilter !== undefined) {
      myIpRanges = myIpRanges.filter((range) => range?.enabled === enabledFilter);
   }

   const result = apply_all_logic(request, myIpRanges);

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

export function getRangesByIdMock(request: ApiObject) {
   let myRanges = JSON.parse(JSON.stringify(ipRanges)).filter((ipRange: ipRangeType) =>
      request?.id_filter?.includes(ipRange.id)
   );
   const result = apply_all_logic(request, myRanges);
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

type messyApiUpdateCommand = {
   command: 'add' | 'update';
   object_type: string;
   rows: IpRangeConfig[];
   sequence?: number | undefined;
   context?: string | undefined;
   options?: Record<string, unknown> | undefined;
};

export function updateRangesMock(request: messyApiUpdateCommand) {
   let myRanges = [...ipRanges].filter((ipRange: ipRangeType) =>
      request?.rows?.map((r) => r.id).includes(ipRange.id)
   );
   for (let range of myRanges) {
      // set enabled to request enabled
      range.enabled = request?.rows?.find((r) => r.id === range.id)?.enabled;
   }
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714431052,
      sequence: 2,
      data: [],
      data_total: 1,
      describe: null,
   };
}

type messyApiBulkUpdateCommand = {
   command: 'bulk_update';
   row: IpRangeConfig;
   sequence?: number;
   context?: string;
   options?: Record<string, unknown>;
} & ApiObject;

export function bulkUpdateRangesMock(request: messyApiBulkUpdateCommand) {
   let myRanges = [...ipRanges].filter((ipRange: ipRangeType) =>
      request?.id_filter?.includes(ipRange.id)
   );
   for (let range of myRanges) {
      // set enabled to request enabled
      range.enabled = request?.row?.enabled;
   }
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714431052,
      sequence: 2,
      data: [],
      data_total: 1,
      describe: null,
   };
}

export function addErrorMock() {
   return {
      success: false,
      errcode: -4,
      errmsg: 'Unable Insert Entry: Another entry already exists',
      time: 1716432957,
      sequence: 0,
      data_total: 0,
      data: [],
      describe: null,
   };
}
