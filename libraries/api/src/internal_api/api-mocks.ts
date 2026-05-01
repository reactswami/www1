/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

import { type ApiObject } from '@statseeker/api/internal_api';

/**
 * Reduce the keys in the Result Data to those requested in the command.
 * Note: This also includes logic for hidden fields.
 *
 * @param request The API request being made
 * @param resultData The result data to be manipulated
 *
 * @returns A copy of the result data with fields logic applied
 */
export const apply_fields_logic = <ResultDataT extends {}, ResultDataK extends keyof ResultDataT>(
   request: ApiObject,
   resultData: ResultDataT[]
) => {
   // Need a deep copy so repeated calls with different fields don't modify original objects
   let newResultData = JSON.parse(JSON.stringify(resultData));

   let visibleFields: string[] = [];
   if (request.fields === undefined) {
      console.error('No fields in request', request);
      return newResultData;
   }

   visibleFields = request.fields.map((field) => {
      if (typeof field === 'string') {
         return field;
      }
      if (typeof field.key === 'string' && !field.hide) {
         return field.key;
      }
      if (typeof field.name === 'string' && !field.hide) {
         return field.name;
      }
      return '';
   });
   if (!visibleFields.includes('id')) {
      visibleFields.push('id');
   }

   newResultData = newResultData.map((result: ResultDataT) => {
      let keys = Object.keys(result) as ResultDataK[];
      for (let key of keys) {
         if (!visibleFields.includes(key as string)) {
            delete result[key];
         }
      }
      return result;
   });

   return newResultData;
};

/**
 * Filter the Result Data to results that match the text_filter in the command.
 *
 * @param request The API request being made
 * @param resultData The result data to be manipulated
 *
 * @returns The result data with text_filter applied
 */
export const apply_text_filter_logic = <
   ResultDataT extends {},
   ResultDataK extends keyof ResultDataT
>(
   request: ApiObject,
   resultData: ResultDataT[]
) => {
   let newResultData = resultData;

   let search = request.text_filter + '';
   if (request.text_filter !== undefined && search !== '') {
      newResultData = newResultData.filter((result) => {
         let keys = Object.keys(result) as ResultDataK[];
         for (let key of keys) {
            let val = result[key];
            if (typeof val === 'string' && val.search(search) >= 0) {
               return true;
            }
         }
         return false;
      });
   }

   return newResultData;
};

/**
 * Sort the Result Data based on the command.
 *
 * @param request The API request being made
 * @param resultData The result data to be sorted
 *
 * @returns The sorted result data
 */
export const apply_sort_logic = <ResultDataT extends {}, ResultDataK extends keyof ResultDataT>(
   request: ApiObject,
   resultData: ResultDataT[]
) => {
   let newResultData = resultData;

   if (request.sort && request.sort.length > 0) {
      let indexOrder: number[] = [];
      for (let i = 0; i < newResultData.length; i++) {
         indexOrder.push(i);
      }

      let sortField = request.sort[0] as ResultDataK;
      let field = request.fields?.filter(
         (field) => field === sortField || (typeof field === 'object' && field.key === sortField)
      );
      let desc = field && field.length > 0 && typeof field[0] === 'object' && field[0].sort_desc;
      indexOrder.sort((a, b) => {
         let aVal = newResultData[a][sortField];
         let bVal = newResultData[b][sortField];
         if (desc) {
            [aVal, bVal] = [bVal, aVal];
         }
         if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal);
         } else {
            return aVal > bVal ? 1 : aVal === bVal ? 0 : -1;
         }
      });
      newResultData = indexOrder.map((idx) => newResultData[idx]);
   }

   return newResultData;
};

/**
 * Truncate the Result Data based on the limit and offset in the command.
 *
 * @param request The API request being made
 * @param resultData The result data to be truncated
 *
 * @returns The truncated result data
 */
export const apply_limit_offset_logic = <ResultDataT extends {}>(
   request: ApiObject,
   resultData: ResultDataT[]
) => {
   let newResultData = resultData;

   let data_total = newResultData.length;
   let limit = data_total;
   if (request.limit !== undefined && request.limit < data_total) {
      limit = request.limit;
   }
   let offset = 0;
   if (request.offset !== undefined && request.offset > 0) {
      offset = request.offset;
   }
   newResultData = newResultData.slice(offset, offset + limit);

   return { data: newResultData, data_total };
};

/**
 * Manipulates the Result Data based on common internal api logic relevant to the details of the command.
 *
 * @param request The API request being made
 * @param resultData The result data to be manipulated
 *
 * @returns A copy of the result data with manipulations applied
 */
export const apply_all_logic = <ResultDataT extends {}>(
   request: ApiObject,
   resultData: ResultDataT[]
) => {
   let newResultData = resultData;

   newResultData = apply_fields_logic(request, newResultData);
   newResultData = apply_text_filter_logic(request, newResultData);
   newResultData = apply_sort_logic(request, newResultData);
   return apply_limit_offset_logic(request, newResultData);
};
