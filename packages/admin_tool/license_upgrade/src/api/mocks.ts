import { type LicenseResponse } from './type';

export async function getLicenseMock() {
   return new Promise<LicenseResponse>((resolve) => {
      setTimeout(() => {
         resolve({
            meta: {},
            result: {
               hardware_id: '194966353758285:3094118331:141279407614334',
               not_after: 0,
               perpetual: true,
               device_count: 500,
               port_count: 5000,
               server_id: '77284632-3779062905',
               tier: 'Statseeker Professional',
               valid_new_license: true,
               csrf_token: 'mock_csrf_token_value',
               version: '25.2',
            },
            success: true,
         });
      }, 1000);
   });
}
