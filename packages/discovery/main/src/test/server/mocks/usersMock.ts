import { users } from '../db';

export function getUsers() {
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1714431052,
      sequence: 2,
      data_total: users.length,
      data: users.map((user) => ({
         name: user,
         id: user,
      })),
      describe: null,
   };
}
