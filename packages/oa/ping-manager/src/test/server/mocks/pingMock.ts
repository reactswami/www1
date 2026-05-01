export function getAllPingPollersMock() {
   return {
      success: true,
      errcode: 0,
      errmsg: 'ok',
      time: 1724298711,
      sequence: 1,
      data_total: 4,
      data: [
         {
            deviceid: 715,
            enabledStatus: 'on,on',
            device: 'CDT-Viptela',
            ipaddress: '10.126.77.6',
            default_poller: 'qa-vm-test61',
            enabledPollersName: 'oa75,qa-vm-test61',
            pollersName: 'oa75,qa-vm-test61',
         },
         {
            deviceid: 653,
            enabledStatus: 'on',
            device: 'oa75',
            ipaddress: '10.2.26.75',
            default_poller: 'qa-vm-test61',
            enabledPollersName: 'qa-vm-test61',
            pollersName: 'qa-vm-test61',
         },
         {
            deviceid: 666,
            enabledStatus: 'on',
            device: 'oa76',
            ipaddress: '10.2.26.76',
            default_poller: 'qa-vm-test61',
            enabledPollersName: 'qa-vm-test61',
            pollersName: 'qa-vm-test61',
         },
         {
            deviceid: 512,
            enabledStatus: 'off',
            device: 'qa-vm-test61',
            ipaddress: '127.0.0.1',
            default_poller: 'qa-vm-test61',
            enabledPollersName: null,
            pollersName: 'qa-vm-test61',
         },
      ],
      describe: null,
   };
}
