import { type ApiObject, apply_all_logic } from '@statseeker/api/internal_api';

export function getSearchMock(request: ApiObject) {
   const data = [{}];

   const result = apply_all_logic(request, data);
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714629694,
      sequence: 26,
      data_total: result.data_total,
      data: result.data,
      describe: null,
   };
}
