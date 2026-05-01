/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */
import {
   ApiGetRequest,
   api_add,
   api_bulk_update,
   api_delete,
   api_update,
   type ApiField,
   type ApiObject,
} from '@statseeker/api/internal_api';
import { type AddIpRangeData, type IpRangeConfigFromAPI, type getRangesQueryParams, type IpRangeConfig, type IpRangeConfigWithCounts, type BulkUpdateIpRangeData } from '~/types';

function buildGetRangesRequest(params?: getRangesQueryParams) {
   const text_filter = params?.text_filter;
   const limit = params?.limit;
   let fields: (string | ApiField)[] = ['id', 'name', 'ip_range', {key:'enabled'}];

   // Find field to sort on and replace it with a version that has sort direction applied
   if (params?.sort) {
      let sortCol = fields.find((field: string | ApiField) => {
         if (typeof field === 'string') {
            return field === params?.sort;
         }
         return field.key === params?.sort;
      });
      if (sortCol) { // There is a chance of sorting on a different column in getRangesWithCounts
         fields = fields.filter((f) => f !== sortCol);
         if (typeof sortCol === 'string') {
            sortCol = { key: sortCol };
         }
         let newSortCol = {
            ...sortCol,
            sort_desc: params?.dir === 'desc',
         };
         fields = [...fields, newSortCol];
      }
   }

   if (params?.enabled_filter !== undefined) {
      let enabledField = fields.find((field: string | ApiField) => {
         if (typeof field === 'string') {
            return field === 'enabled';
         }
         return field.key === 'enabled';
      });
      if (enabledField && typeof enabledField !== 'string') {
         enabledField.filter = `= ${params?.enabled_filter}`;
      }
   }

   let options: ApiObject = {
      object_type: 'ip_range_config',
      fields,
      text_filter,
      context: 'getRanges',
   };

   if (text_filter) {
      options = { ...options, text_filter };
   }

   if (limit) {
      options = { ...options, limit };
   }

   if (params?.sort) {
      const sort = [params?.sort];
      options = { ...options, sort };
   }

   return options;
}

async function getRanges(params?: getRangesQueryParams) {
   const options = buildGetRangesRequest(params);
   return await new ApiGetRequest<IpRangeConfig>({
      ...options,
   }).run_api_request();
}

async function getRangesWithCounts(params?: getRangesQueryParams) {
   const options = buildGetRangesRequest(params);

   // Check if sorting on fields we are about to add
   // Only descending is needed here as asc is the default
   let includesSortDesc: boolean = false;
   if (params?.sort === 'includesCount' && params?.dir === 'desc') {
      includesSortDesc = true;
   }
   let excludesSortDesc: boolean = false;
   if (params?.sort === 'excludesCount' && params?.dir === 'desc') {
      excludesSortDesc = true;
   }

   // Replace ip_range with formula fields to get counts
   options.fields = options.fields?.filter((f) => f !== 'ip_range');
   options.fields = options.fields?.concat([
      {
         name: 'ip_range',
         hide: true,
      },
      {
         name: 'id',
         key: 'includesCount',
         formula: 'JQ(".include | length", {ip_range})',
         sort_desc: includesSortDesc,
      },
      {
         name: 'id',
         key: 'excludesCount',
         formula: 'JQ(".exclude | length", {ip_range})',
         sort_desc: excludesSortDesc,
      },
   ]);
   return await new ApiGetRequest<IpRangeConfigWithCounts>({
      ...options,
   }).run_api_request();
}

async function getRangeById(id: number) {
   return await new ApiGetRequest<IpRangeConfig>({
      object_type: 'ip_range_config',
      fields: ['id', 'name', 'ip_range', 'enabled'],
      id_filter: [id],
      context: 'getRangeById',
   }).run_api_request();
}

async function addRange({ newRange }: {
   newRange: AddIpRangeData;
}) {
   return await api_add<IpRangeConfigFromAPI>({
      object_type: 'ip_range_config',
      rows: [newRange],
      context: 'addRange',
   });
}

async function deleteRanges({ ids }: { ids: number[] }) {
   return await api_delete<IpRangeConfigFromAPI>({
      object_type: 'ip_range_config',
      ids,
      context: 'deleteRanges',
   });
}

async function updateRange(newRange: IpRangeConfig) {
   return await api_update<IpRangeConfig>({
      object_type: 'ip_range_config',
      rows: [newRange],
      context: 'updateRanges',
   });
}

async function bulkUpdateRanges(getRangesParams: getRangesQueryParams, rangeIdsToUpdate: number[] | undefined, newData: BulkUpdateIpRangeData) {
   let options = buildGetRangesRequest(getRangesParams);
   if (rangeIdsToUpdate && rangeIdsToUpdate.length > 0) {
      options.id_filter = rangeIdsToUpdate;
   }
   const req = new ApiGetRequest<BulkUpdateIpRangeData>({
      ...options
   });
   return await api_bulk_update<BulkUpdateIpRangeData>({
      req,
      row: newData,
      context: 'updateRanges',
   });
}

export { getRanges, getRangesWithCounts, addRange, deleteRanges, updateRange, bulkUpdateRanges, getRangeById };
