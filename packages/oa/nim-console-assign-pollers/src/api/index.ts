/**
 * Barrel file for API
 * This folder contains all the API and server-state related logic, such as API Endpoints.
 */

import { axios } from '~/lib';

type FetchDevicePingPollersResponse = {
   data: {
      objects: [
         {
            data: {
               defaultPoller?: string;
               deviceid: number;
               pollersName?: string;
               pollersId?: string;
               pollersPoll?: string;
               enabledStatus?: string;
            }[];
         }
      ];
   };
};

export const fetchDevicePingPoller = async (
   id: string
): Promise<
   {
      id: string;
      name: string;
      poll: 'on' | 'off' | 'exceeded';
      enabled: 'on' | 'off' | 'exceeded';
      isDefault: boolean;
      isExceeded: boolean;
   }[]
> => {
   const response = await axios.post<FetchDevicePingPollersResponse>(
      '/cgi/oa_api_proxy',
      getDevicePingPollersQuery(id)
   );

   const { pollersName, pollersId, pollersPoll, defaultPoller, enabledStatus } =
      response.data.data.objects[0].data[0];
   // Pollers id and poll are returning a string of concatenated values "{value1},{value2}"
   const pollersNameArray = pollersName?.split(',') || [];
   const pollersIdArray = pollersId?.split(',') || [];
   const pollersPollArray = (pollersPoll?.split(',') as ('on' | 'off' | 'exceeded')[]) || [];
   const pollersEnabledArray = (enabledStatus?.split(',') as ('on' | 'off' | 'exceeded')[]) || [];

   if (pollersNameArray.length !== pollersIdArray.length) {
      throw Error('Query error');
   }
   return pollersNameArray.map((name: string, index: number) => ({
      name,
      id: pollersIdArray[index],
      poll: pollersPollArray[index],
      enabled: pollersEnabledArray[index],
      isDefault: defaultPoller === name,
      isExceeded: pollersEnabledArray[index] === 'exceeded',
   }));
};

const getDevicePingPollersQuery = (id: string) => ({
   command: 'get',
   user: 'admin',
   objects: [
      {
         filter: `{deviceid} = '${id}'`,
         group_by: ['{deviceid}'],
         type: 'ping',
         limit: 0,
         fields: {
            enabledStatus: {
               aggregation_format: 'list',
               field: 'poll',
            },
            deviceid: {
               field: 'id',
               link: ['deviceLink'],
               object: 'cdt_device',
            },
            device_default_poller_name: {
               field: 'default_poller',
               hide: true,
               link: ['deviceLink'],
               object: 'cdt_device',
            },
            pollers_names: {
               aggregation_format: 'list',
               field: 'name',
               object: 'cdt_device_oa',
               hide: true,
               link: ['pollerDeviceLink'],
            },
            defaultPoller: {
               aggregation_format: 'list_unique',
               formula:
                  'CASE WHEN {pollers_names} = {device_default_poller_name} THEN {pollers_names} ELSE NULL END',
            },
            pollerIp: {
               hide: true,
               field: 'ipaddress',
               aggregation_format: 'list',
               link: ['pollerDeviceLink'],
               object: 'device_oa',
            },
            pollersName: {
               field: 'name',
               aggregation_format: 'list',
               link: ['pollerDeviceLink'],
               object: 'device_oa',
            },
            pollersId: {
               field: 'id',
               aggregation_format: 'list',
               link: ['pollerDeviceLink'],
               object: 'device_oa',
            },
            pollersPoll: {
               field: 'poll',
               aggregation_format: 'list',
               link: ['pollerDeviceLink'],
               object: 'device_oa',
            },
         },
      },
   ],
});
