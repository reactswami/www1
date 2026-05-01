/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

import { type ApiField, type ApiObject, type ApiObjectLink, type ApiResponse } from './types';

/**
 * @class APIGetRequest
 * @description The APIGetRequest is a representation of an internal API request.
 *              This mimics the C++/Python ApiGetRequest
 */
export class ApiGetRequest<T> implements ApiObject {
   object_type: string;
   fields?: (string | ApiField)[];
   context?: string;
   id_filter?: number[];
   group_id_filter?: number[];
   group_name_filter?: string[];
   text_filter?: string;
   filter?: string;
   post_filter?: string;
   sortmode?: 'novals_small' | 'novals_large' | 'novals_before' | 'novals_after';
   limit?: number;
   offset?: number;
   sort?: string[];
   sort_all?: boolean;
   group_by?: string[];
   group_by_all?: boolean;
   output_single_format?: boolean;
   options?: Record<string, unknown>;
   links?: Record<string, ApiObjectLink>;

   constructor(req: string | ApiObject) {
      if (typeof req === 'string') {
         this.object_type = req;
      } else {
         this.object_type = req.object_type;
         Object.assign(this, req);
      }
   }

   /**
    * Adds a field to the request
    *
    * @param field Either the display name or a ApiField object
    *
    * @returns The request
    */
   addField(field: string | ApiField) {
      if (!this.fields) {
         this.fields = [];
      }
      if (typeof field === 'string') {
         this.fields.push({ key: field });
      } else {
         this.fields.push(field);
      }

      return this;
   }

   /**
    * Adds multiple fields to the request
    *
    * @param fields The fields to add
    *
    * @returns The request
    */
   addFields(...fields: (string | ApiField)[]) {
      for (const field of fields) {
         this.addField(field);
      }

      return this;
   }

   /**
    * Find a field in the request
    *
    * @param key The display name of the field to find
    *
    * @returns The found field, or undefined of the field doesn't exist
    */
   findField(key: string) {
      if (!this.fields?.length) {
         return undefined;
      }
      const idx = this.fields.findIndex((f) => (typeof f === 'string' ? f : f.key) === key);

      const field = this.fields[idx];
      if (typeof field === 'string') {
         // Convert the string field to an object
         this.fields[idx] = { key: field };
         return this.fields[idx] as ApiField;
      }

      return field;
   }

   /**
    * Run the request
    *
    * @returns A promise containing the response
    */
   async run_api_request() {
      return await internalApiCmd<T>({ command: 'get', ...this });
   }
}

/**
 * Run a GET request.
 *
 * This is a alias for calling `req.run_api_request()`
 *
 * @param req The request to run
 *
 * @returns A promise containing the response
 */
export const api_get = async <T>(req: ApiGetRequest<T>) => {
   return await req.run_api_request();
};

/**
 * Run an ADD request.
 *
 * @param object_type The name of the object to run the request
 * @param rows        The list of rows to add
 * @param options     An optional object to pass to the API for module specific options
 * @param sequence    An optional sequence for validating the modification
 * @param context     An optional context value to identify this request in logs
 *
 * @returns A promise containing the response
 */
export const api_add = async <T, K = T>({
   object_type,
   rows,
   options,
   sequence = 0,
   context = 'ui-api-add',
}: {
   object_type: string;
   rows: Omit<K, 'id'>[];
   options?: Record<string, unknown>;
   sequence?: number;
   context?: string;
}) => {
   return internalApiCmd<T, K>({
      command: 'add',
      object_type: object_type,
      rows,
      sequence,
      context,
      options,
   });
};

/**
 * Run an UPDATE request.
 *
 * @param object_type The name of the object to run the request
 * @param rows        The list of rows to add
 * @param options     An optional object to pass to the API for module specific options
 * @param sequence    An optional sequence for validating the modification
 * @param context     An optional context value to identify this request in logs
 *
 * @returns A promise containing the response
 */
export const api_update = async <T>({
   object_type,
   rows,
   options,
   sequence = 0,
   context = 'ui-api-update',
}: {
   object_type: string;
   rows: T[];
   options?: Record<string, unknown>;
   sequence?: number;
   context?: string;
}) => {
   return internalApiCmd<T>({
      command: 'update',
      object_type: object_type,
      rows: rows,
      sequence,
      context,
      options,
   });
};

/**
 * Run a bulk UPDATE request.
 *
 * @param req         The request to retrieve the rows that need to be updated
 * @param row         The values to assign to all matching rows
 * @param options     An optional object to pass to the API for module specific options
 * @param sequence    An optional sequence for validating the modification
 * @param context     An optional context value to identify this request in logs
 *
 * @returns A promise containing the response
 */
export const api_bulk_update = async <T>({
   req,
   row,
   options,
   sequence = 0,
   context = 'ui-api-bulk-update',
}: {
   req: ApiGetRequest<T>;
   row: T;
   options?: Record<string, unknown>;
   sequence?: number;
   context?: string;
}) => {
   return internalApiCmd<T>({
      command: 'bulk_update',
      ...req,
      row,
      options,
      sequence,
      context,
   });
};

/**
 * Run a DELETE request.
 *
 * @param object_type The name of the object to run the request
 * @param ids         The ids to delete
 * @param options     An optional object to pass to the API for module specific options
 * @param sequence    An optional sequence for validating the modification
 * @param context     An optional context value to identify this request in logs
 *
 * @returns A promise containing the response
 */
export const api_delete = async <T>({
   object_type,
   ids,
   options,
   sequence = 0,
   context = 'ui-api-delete',
}: {
   object_type: string;
   ids: number[];
   options?: Record<string, unknown>;
   sequence?: number;
   context?: string;
}) => {
   return internalApiCmd<T>({
      command: 'delete',
      object_type: object_type,
      ids,
      options,
      sequence,
      context,
   });
};

/**
 * Run a Describe request.
 *
 * @param object_type The name of the object to run the request
 * @param context     An optional context value to identify this request in logs
 *
 * @returns A promise containing the response
 */
export const api_describe = async ({
   object_type,
   context = 'ui-api-describe',
}: {
   object_type: string;
   context?: string;
}) => {
   return internalApiCmd<void>({
      command: 'describe',
      object_type: object_type,
      context,
   });
};

/**
 * Run an execute request
 *
 * @param object_type The name of the object to run the request
 * @param context     An optional context value to identify this request in logs
 * @param options     An optional object to pass to the API for module specific options
 *
 * @returns A promise containing the response
 */

export const api_execute = async<T>({
   object_type,
   context = 'ui-api-execute',
   options,
}: {
   object_type: string;
   context?: string;
   options?: Record<string, unknown>;
}) => {
   return internalApiCmd<T>({
      command: 'execute',
      object_type,
      context,
      options,
   });
};

/**
 * Helper function to safely escape a value used in an API filter/formula
 *
 * @param value the value to escape
 *
 * @returns the escaped value
 */
export const createApiFormulaString = (value: null | number | string) => {
   if (value === null) {
      return 'NULL';
   } else if (typeof value === 'number') {
      return value.toString();
   } else {
      // Escape strings and surround with single quotes
      let dest = "'";
      for (const ch of value) {
         if (ch === "'") {
            dest += "'";
         }
         dest += ch;
      }
      dest += "'";
      return dest;
   }
};

/**
 * Helper function to create an API filter
 *
 * @param field the field to filter on
 * @param op    the filter operation
 * @param value the filter value
 *
 * @returns A valid API filter with the value escaped properly
 */
export const createApiFilter = (field: string, op: string, value: null | number | string) => {
   return `{${field}} ${op} ${createApiFormulaString(value)}`;
};

/**
 * Helper function to create an API IN filter
 *
 * @param field      the field to filter on
 * @param value_list the values to include in the IN clause
 *
 * @returns A valid API filter with the values escaped properly
 */
export const createApiInFilter = (field: string, value_list: Array<null | number | string>) => {
   const parsedList = value_list.map((v) => createApiFormulaString(v));
   return `{${field}} IN (${parsedList.join()})`;
};

/**
 * An internal function to run an API command
 *
 * @param cmd The command to run on the internal API
 *
 * @returns A promise containing the API response
 */
const internalApiCmd = async <T, K = T>(
   cmd:
      | {
           command: 'add' | 'update';
           object_type: string;
           rows: Omit<K, 'id'>[];
           sequence?: number;
           context?: string;
           options?: Record<string, unknown>;
        }
      | ({
           command: 'bulk_update';
           row: K;
           sequence?: number;
           context?: string;
           options?: Record<string, unknown>;
        } & ApiObject)
      | {
           command: 'delete';
           object_type: string;
           ids: number[];
           sequence?: number;
           context?: string;
           options?: Record<string, unknown>;
        }
      | {
           command: 'describe';
           object_type: string;
           context?: string;
        }
      | {
           command: 'execute';
           object_type: string;
           sequence?: number;
           context?: string;
           options?: Record<string, unknown>;
        }
      | (ApiObject & { command: 'get' })
): Promise<ApiResponse<T>> => {
   const headers = { 'Content-Type': 'application/json' };
   const resp = await fetch('/cgi/internal_api', {
      method: 'POST',
      headers,
      body: JSON.stringify(cmd),
   });
   if (!resp.ok) {
      throw new Error('Network error');
   }
   if (resp.status >= 400) {
      throw resp.statusText;
   }

   let apiResp: ApiResponse<T>;
   try {
      apiResp = await resp.json();
   } catch {
      throw new Error('Failed to decode API response');
   }

   if (!apiResp.success) {
      throw new Error(apiResp.errmsg);
   }

   return apiResp;
};
