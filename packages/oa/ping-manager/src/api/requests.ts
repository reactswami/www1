/*
 * All software Copyright 2024 of Techniche Technologies Pty Ltd., All rights reserved.
 * Any redistribution or reproduction of part or all of the contents in any form is
 * prohibited without express written permission of the company.
 */

import { ApiGetRequest, createApiFilter } from '@statseeker/api/internal_api';
import { type PingTableDeviceRow } from '~/components/Table';
import { type DeviceOa, type Group } from '~/types/models';

export interface FetchDevicePingPollersPayload {
   offset: number;
   limit: number;
   search: string;
   sortBy: [string, 'asc' | 'desc'];
   groupFilter?: number;
   pollerFilter?: string[];
   exceededFilter?: boolean;
}

export interface FetchDevicePingPollersResponse {
   data: PingTableDeviceRow[];
   total: number;
}

export interface FetchOAsWithPingServiceEnabledResponse {
   data: Pick<DeviceOa, 'name' | 'id'>[];
}

const getGroups = async () =>
   new ApiGetRequest<Group>({
      object_type: 'group',
      fields: [
         'name',
         'id',
         {
            key: 'entities',
            hide: true,
            format: 'objects',
            filter: "IN ('cdt_device')",
         },
      ],
      sort: ['name'],
   }).run_api_request();

const getOAsWithPingEnabled = async () =>
   new ApiGetRequest<Pick<DeviceOa, 'name' | 'id' | 'ipaddress'>>({
      object_type: 'oa_component_service',
      group_by: ['name'],
      fields: [
         { key: 'id', object: 'device_oa', filter: '> 0' },
         { key: 'ipaddress', object: 'device_oa' },
         { key: 'name', object: 'device_oa' },
         {
            key: 'services',
            name: 'name',
            object: 'oa_service',
            hide: true,
            aggr_format: 'list_unique',
            links: ['componentLink', 'serviceLink'],
            filter: "REGEXP 'ping'",
         },
         {
            key: 'enabled',
            hide: true,
            aggr_format: 'list',
            filter: '= 1',
         },
      ],
   }).run_api_request();

const getDevicesWithPingEnabled = async (payload: FetchDevicePingPollersPayload) => {
   const [sortField, sortOrder] = payload.sortBy[0] ? payload.sortBy : ['device', 'asc'];
   /**
    * IMPORTANT: If updating this request the request needs to be updated in nim/nim_ping_admin/main.cpp to match exactly.
    * This matters because we only want to apply pollers to the filtered devices.
    */
   const req = new ApiGetRequest<PingTableDeviceRow>({
      object_type: 'ping',
      limit: payload.limit,
      offset: payload.offset,
      group_by: ['device'],
      group_id_filter: payload.groupFilter ? [payload.groupFilter] : undefined,
      text_filter: payload.search ? payload.search : undefined,
      sort: [sortField],
      fields: [
         { key: 'deviceid', text_filter_include: false },
         { key: 'enabledStatus', name: 'poll', aggr_format: 'list', text_filter_include: false },
         { key: 'device', object: 'cdt_device', name: 'name', links: ['deviceLink'] },
         { key: 'ipaddress', object: 'cdt_device', links: ['deviceLink'] },
         {
            key: 'device_default_poller_name',
            name: 'default_poller',
            hide: true,
            links: ['deviceLink'],
            object: 'cdt_device',
            text_filter_include: false,
         },
         {
            key: 'default_poller',
            aggr_format: 'list_unique',
            formula:
               'CASE WHEN {pollersName} = {device_default_poller_name} THEN {pollersName} ELSE NULL END',
         },
         {
            key: 'hasExceeded',
            hide: true,
            post_formula: "CASE WHEN {enabledStatus} REGEXP 'exceeded' THEN 1 ELSE 0 END",
            text_filter_include: false,
         },
         {
            key: 'enabledPollersName',
            formula:
               "CASE WHEN {enabledStatus} IN ('on', 'exceeded') THEN {pollersName} ELSE NULL END",
            aggr_format: 'list',
         },
         {
            key: 'pollersName',
            object: 'device_oa',
            name: 'name',
            aggr_format: 'list',
            links: ['pollerDeviceLink'],
            text_filter_include: false,
         },
         { key: 'retired', hide: true, links: ['deviceLink'], object: 'cdt_device', text_filter_include: false },
      ],
   });

   // Add all the post filtering
   const postFilters: string[] = [createApiFilter('retired', '!=', 'on')];
   if (payload.exceededFilter) {
      postFilters.push('{hasExceeded} = 1');
   }
   if (payload.pollerFilter && payload.pollerFilter.length > 0) {
      const filters = payload.pollerFilter
         .map((filter) => createApiFilter('enabledPollersName', 'REGEXP', `(^|,)${filter}(,|$)`))
         .join(' AND ');
      postFilters.push(filters);
   }
   if (postFilters.length > 0) {
      req.post_filter = postFilters.join(' AND ');
   }

   // Add sort order to the sort field
   const field = req.findField(sortField);
   if (field) {
      field.sort_desc = sortOrder === 'desc';
   }

   return req.run_api_request();
};

export const requests = Object.freeze({
   getGroups,
   getOAsWithPingEnabled,
   getDevicesWithPingEnabled,
});
