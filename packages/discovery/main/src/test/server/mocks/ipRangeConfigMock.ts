import { type ApiObject, type ApiField, apply_all_logic } from "@statseeker/api/internal_api";
  const ipRanges = [
     {
        id: 1,
        name: 'Default',
        enabled: 1,
        ip_range: {
        include: ['10.100.0.0/16', '10.200.1.*'],
        },
        includesCount: 2,
        excludesCount: 0,
        enabledString: 'enabled'
     },
     {
        id: 34,
        name: 'Private Network',
        enabled: 1,
        ip_range: {
        exclude: ['10.300.1.10'],
        },
        includesCount: 1,
        excludesCount: 0,
        enabledString: 'enabled'
     },
     {
        id: 5,
        name: 'Public Network',
        enabled: 1,
        ip_range: {
        include: ['10.300.[2-20].*'],
        exclude: [
          '10.300.2.55',
          '10.300.3.55',
          '10.300.4.55',
          '10.300.5.55',
          '10.300.6.55',
          '10.300.7.55',
          '10.300.8.55',
          '10.300.9.55',
          '10.300.10.55',
          '10.300.11.55',
          '10.300.12.55'
        ]
        },
        includesCount: 1,
        excludesCount: 11,
        enabledString: 'enabled'
     },
     {
        id: 4,
        name: 'DMZ',
        enabled: 1,
        ip_range: {
        include: ['10.99.99.0/24'],
        exclude: []
        },
        includesCount: 1,
        excludesCount: 0,
        enabledString: 'enabled'
     },
     {
        id: 3,
        name: 'Head Office but its a really long name that definitely will not fit in the list width',
        enabled: 0,
        ip_range: {
        include: ['10.200.1.*'],
        exclude: ['10.200.1.55']
        },
        includesCount: 2,
        excludesCount: 0,
        enabledString: 'disabled'
     },
  ];

  export function getRangesMock(request: ApiObject) {
    // Take a copy so array is new, but object refs are still intact
    let myIpRanges = [...ipRanges];

     // Apply enabled filter
     let enabledFilter: number | undefined = undefined;
     let enabledField = request.fields?.find((field: string | ApiField) => {
        if (typeof field === 'string') {
           return field === 'enabled';
        }
        return field.key === 'enabled';
     });
     if (enabledField && typeof enabledField !== 'string') {
        if (enabledField?.filter === '= 1') {
          enabledFilter = 1;
        }
        else if (enabledField?.filter === '= 0') {
          enabledFilter = 0;
        }
     }
     if (enabledFilter !== undefined) {
        myIpRanges = myIpRanges.filter((range) => (range?.enabled === enabledFilter));
     }

     const result = apply_all_logic(request, myIpRanges);

     return {
        success: true,
        errcode: 0,
        errmsg: 'ok',
        time: 1714431052,
        sequence: 2,
        data_total: result.data_total,
        data: result.data,
        describe: null,
     };
  }