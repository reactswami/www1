export function getOasMock() {
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1724298711,
      sequence: 4,
      data_total: 2,
      data: [
         {
            id: 653,
            ipaddress: '10.2.26.75',
            name: 'oa75',
         },
         {
            id: 512,
            ipaddress: '127.0.0.1',
            name: 'qa-vm-test61',
         },
      ],
      describe: null,
   };
}
