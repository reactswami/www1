import { type ApiObject } from '@statseeker/api/internal_api';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { HttpResponse, type PathParams, http, delay } from 'msw';
import {
   addErrorMock,
   describeCredentialMock,
   getCredentialsMock,
   getCredentialDevicesMock,
   getDevicesWithCredentialName,
   getCredentialsById,
   createCredential,
} from './mocks';
import { environment } from '~/config';

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
      | ({
           command: 'bulk_update';
           row: SNMPCredential;
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
      | (ApiObject & { command: 'get' }),
      undefined,
      '/cgi/internal_api'
   >('/cgi/internal_api', async ({ request }) => {
      await delay();
      const resp = await request.json();

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
               body: JSON.stringify(resp),
            }
         );

         const data = await proxiedResponse.json();
         return HttpResponse.json(data, {
            status: proxiedResponse.status,
            statusText: proxiedResponse.statusText,
         });
      }

      try {
         if (resp.object_type === 'device') {
            if (resp.context === 'getDevicesWithCredentialName') {
               return HttpResponse.json(getDevicesWithCredentialName(resp));
            }
            return HttpResponse.json(getCredentialDevicesMock(resp));
         }
         switch (resp.command) {
            case 'describe':
               return HttpResponse.json(describeCredentialMock());
            case 'get': {
               if (resp.id_filter && resp.id_filter.length > 0) {
                  return HttpResponse.json(getCredentialsById(resp.id_filter));
               }
               return HttpResponse.json(getCredentialsMock(resp));
            }
            case 'add': {
               const cred = resp.rows[0];
               return HttpResponse.json(createCredential(cred));
            }
            default:
               return HttpResponse.json(getCredentialsMock(resp));
         }
      } catch (err) {
         return HttpResponse.json({ success: false }, { status: 400 });
      }
   }),
];

/**
 * Failed handlers
 * Very useful for testing, since you can quickly replace existing handlers with fail calls to test your code
 *
 * `server.use(...failedHandlers);`
 */
export const failedHandlers = [
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
      | ({
           command: 'bulk_update';
           row: SNMPCredential;
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
        },
      undefined,
      '/cgi/internal_api'
   >('/cgi/internal_api', async ({ request }) => {
      const resp = await request.json();

      try {
         switch (resp.command) {
            case 'add':
               return HttpResponse.json(addErrorMock());

            default:
               return HttpResponse.json(getCredentialsMock(resp));
         }
      } catch {
         return HttpResponse.json({ success: false }, { status: 400 });
      }
   }),
];
