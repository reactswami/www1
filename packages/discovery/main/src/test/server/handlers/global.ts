import { type ApiObject } from '@statseeker/api/internal_api';
import { getGroupsMock } from '@statseeker/api/internal_api/entities/group/mocks';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities/snmp_credential';
import { HttpResponse, http, type PathParams } from 'msw';
import { environment } from '~/config';
import {
   createCredential,
   describeCredentialMock,
   describeDiscoverHistoryMock,
   getAllDevicesMock,
   getCredentialsMock,
   getDeviceCountMock,
   getDeviceCountWithGroupMock,
   getDiscoveryHistory,
   getDiscoveryHistoryById,
   getNimOptionsMock,
   getRangesMock,
   getUsers,
   manualConfgImportSuccessMock,
   getDiscoverySchedule,
   getDiscoveryScheduleById,
} from '~/mocks';

export const globalHandlers = [
   http.post<
      PathParams,
      | {
           command: 'add' | 'update';
           object_type: string;
           rows: SNMPCredential[];
           sequence?: number;
           context?: string;
           options?: Record<string, unknown>;
        }
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
      | (ApiObject & { command: 'get' }),
      undefined,
      '/cgi/internal_api'
   >('/cgi/internal_api', async ({ request }) => {
      const requestBody = await request.json();

      if (environment.proxy_requests) {
         const proxiedResponse = await fetch(
            `${environment.proxy_requests?.proxy_server}/cgi/internal_api`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'X-Proxy-Host': environment.proxy_requests?.host,
                  'X-Proxy-User': environment.proxy_requests?.user,
                  'X-Proxy-Password': environment.proxy_requests?.password,
               },
               body: JSON.stringify(requestBody),
            }
         );

         const data = await proxiedResponse.json();
         return HttpResponse.json(data, {
            status: proxiedResponse.status,
            statusText: proxiedResponse.statusText,
         });
      }

      if (requestBody.object_type === 'discover_history') {
         if (requestBody.context === 'getDiscoveryHistory') {
            return HttpResponse.json(getDiscoveryHistory(requestBody));
         }
         if (requestBody.context === 'getDiscoveryHistoryById') {
            return HttpResponse.json(getDiscoveryHistoryById(requestBody));
         }
      }

      if (requestBody.object_type === 'task') {
         if (requestBody.context === 'getTask') {
            return HttpResponse.json(getDiscoverySchedule(requestBody));
         }

         if (requestBody.context === 'getTaskById') {
            return HttpResponse.json(getDiscoveryScheduleById(requestBody));
         }
      }
      switch (requestBody.object_type) {
         case 'discover':
            return HttpResponse.json({
               success: true,
               errcode: 0,
               errmsg: 'ok',
               time: 1714431052,
               sequence: 2,
               data_total: 1,
               data: [],
               describe: null,
            });

         case 'user':
            return HttpResponse.json(getUsers());

         case 'discover_history': {
            switch (requestBody.command) {
               case 'describe':
                  return HttpResponse.json(describeDiscoverHistoryMock());
               default:
                  return HttpResponse.json(getDiscoveryHistory(requestBody));
            }
         }

         case 'snmp_credential': {
            switch (requestBody.command) {
               case 'describe':
                  return HttpResponse.json(describeCredentialMock());
               case 'get':
                  return HttpResponse.json(getCredentialsMock(requestBody));
               case 'add':
                  return HttpResponse.json(createCredential(requestBody.rows[0]));
               default:
                  return HttpResponse.json(describeCredentialMock());
            }
         }
         case 'ip_range_config': {
            switch (requestBody.command) {
               case 'get':
                  return HttpResponse.json(getRangesMock(requestBody));
               default:
                  return HttpResponse.json(describeCredentialMock());
            }
         }
         case 'device': {
            switch (requestBody.command) {
               case 'get':
                  switch (requestBody.context) {
                     case 'devices':
                        return HttpResponse.json(getAllDevicesMock(requestBody));
                     case 'deviceCount':
                        return HttpResponse.json(getDeviceCountMock());
                     case 'devicesCountWithGroups':
                        return HttpResponse.json(getDeviceCountWithGroupMock(requestBody));
                     default:
                        return HttpResponse.json(getAllDevicesMock(requestBody));
                  }

               default:
                  return HttpResponse.json(getAllDevicesMock(requestBody));
            }
         }
         case 'group': {
            return HttpResponse.json(getGroupsMock());
         }
         case 'nim_options': {
            return HttpResponse.json(getNimOptionsMock());
         }

         default:
            return HttpResponse.json({
               success: true,
               errcode: 0,
               errmsg: 'ok',
               time: 1714431052,
               sequence: 2,
               data_total: 0,
               data: [],
               describe: null,
            });
      }
   }),
   http.post<PathParams, undefined, undefined, '/cgi/discover_manual_cfg_decoder'>(
      '/cgi/discover_manual_cfg_decoder',
      async () => {
         await new Promise((r) => setTimeout(r, 200));
         return HttpResponse.json(manualConfgImportSuccessMock());
      }
   ),
];

/**
 * Failed handlers
 * Very useful for testing, since you can quickly replace existing handlers with fail calls to test your code
 *
 * `server.use(...failedHandlers);`
 */
export const failedHandlers = [
   // http.post(routes.TEST_CONNECTION, () => {
   //    return HttpResponse.json({ status: 400 });
   // }),
   // http.get(routes.GET_GLOBAL_CONFIG, () => {
   //    return HttpResponse.json({ status: 400 });
   // }),
   // http.post(routes.UPDATE_GLOBAL_CONFIG, () => {
   //    return HttpResponse.json({ status: 400 });
   // }),
   // http.post(routes.GET_ORGANISATIONS, () => {
   //    return HttpResponse.json({ status: 400 });
   // }),
   // http.post(routes.GET_NETWORKS, () => {
   //    return HttpResponse.json({ status: 400 });
   // }),
];
