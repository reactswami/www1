export function manualConfgImportSuccessMock() {
   return {
      meta: {},
      result: [
         {
            auth_method: null,
            auth_pass: null,
            auth_user: null,
            community: 'public',
            context: null,
            ipaddress: '10.114.1.1',
            manual_name: 'my-test',
            ping_only: null,
            priv_method: null,
            priv_pass: null,
            version: 2,
         },
         {
            auth_method: 'md5',
            auth_pass: 'statseeker',
            auth_user: 'statseeker',
            community: '',
            context: 'foobar',
            ipaddress: '10.114.1.2',
            manual_name: 'my-test-snmpv3',
            ping_only: null,
            priv_method: 'aes',
            priv_pass: 'statseeker',
            version: 3,
         },
         {
            auth_method: 'md5',
            auth_pass: 'statseeker',
            auth_user: 'statseeker',
            community: '',
            context: 'foobar',
            ipaddress: '10.214.1.2',
            manual_name: 'my-down-device',
            ping_only: null,
            priv_method: 'aes',
            priv_pass: 'statseeker',
            version: 3,
         },
      ],
      success: 'true',
   };
}

export function manualConfigImportErrorMock() {
   return {
      meta: {},
      result: [
         {
            errors: ['Missing IP Address', 'Community must be provided for SNMP Versions 1 and 2'],
            line: 1,
         },
         {
            errors: ['Missing or incorrect Authentication'],
            line: 2,
         },
      ],
      success: 'false',
   };
}
