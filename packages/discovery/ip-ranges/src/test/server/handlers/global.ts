import { type ApiObject } from '@statseeker/api/internal_api';
import { HttpResponse, type PathParams, http } from 'msw';
import { addErrorMock, updateRangesMock, getRangesByIdMock, getRangesMock, bulkUpdateRangesMock } from './mocks';
import { type IpRangeConfig } from '~/types/ipRange';

export const globalHandlers = [
   http.post<
      PathParams,
      | {
           command: 'add' | 'update';
           object_type: string;
           rows: IpRangeConfig[];
           sequence?: number;
           context?: string;
           options?: Record<string, unknown>;
        }
      | ({
           command: 'bulk_update';
           row: IpRangeConfig;
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
      const resp = await request.json();

      try {
         switch (resp.command) {
            case 'update':
               return HttpResponse.json(updateRangesMock(resp));

            case 'bulk_update':
               return HttpResponse.json(bulkUpdateRangesMock(resp));

            case 'get':
               if (resp.id_filter && resp.id_filter.length > 0) {
                  return HttpResponse.json(getRangesByIdMock(resp));
               }
               return HttpResponse.json(getRangesMock(resp));
            default:
               return HttpResponse.json(getRangesMock(resp));
         }
      } catch {
         return HttpResponse.json({ success: false }, { status: 400 });
      }
   }),
   http.post<
      PathParams,
      undefined,
      undefined,
      '/cgi/nfc_decoder'
   >('/cgi/nfc_decoder', async () => {
      await new Promise(r => setTimeout(r, 200));
      return HttpResponse.json({
         meta: {},
         result: {
            exclude: ["10.3.1.33"],
            include: ["10.3.1.0/24", "10.3.2.5"],
         },
         success: "true"
      });
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
           rows: IpRangeConfig[];
           sequence?: number;
           context?: string;
           options?: Record<string, unknown>;
        }
      | ({
           command: 'bulk_update';
           row: IpRangeConfig;
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
      const resp = await request.json();

      try {
         switch (resp.command) {
            case 'add':
               return HttpResponse.json(addErrorMock());

            case 'get':
               if (resp.id_filter && resp.id_filter.length > 0) {
                  return HttpResponse.json(getRangesByIdMock(resp));
               }
               return HttpResponse.json(getRangesMock(resp));
            default:
               return HttpResponse.json(getRangesMock(resp));
         }
      } catch {
         return HttpResponse.json({ success: false }, { status: 400 });
      }
   }),
];
