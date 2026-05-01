const getOAsInGroup = (groupId: number) => {
   return {
      command: 'get',
      user: 'admin',
      objects: [
         {
            type: 'device_oa',
            groups: [groupId],
            fields: {
               id: {
                  field: 'id',
                  object: 'device_oa',
               }
            }
         }
      ]
   };
};

const getOasWithServicesQuery = {
   command: 'get',
   user: 'admin',
   objects: [
      {
         type: 'oa_component_service',
         fields: {
            id: {
               field: 'id',
               object: 'device_oa',
            },
            name: {
               field: 'name',
               object: 'device_oa',
            },
            status: {
               field: 'status',
               object: 'device_oa',
            },
            uptime: {
               field: 'uptime',
               object: 'device_oa',
            },
            hostname: {
               object: 'device_oa',
               field: 'hostname',
            },
            gateway: {
               object: 'device_oa',
               field: 'gateway',
            },
            ipv6gateway: {
               object: 'device_oa',
               field: 'ipv6gateway',
            },
            poll: {
               object: 'device_oa',
               field: 'poll',
            },
            netmask: {
               object: 'device_oa',
               field: 'netmask',
            },
            ipaddress: {
               object: 'device_oa',
               field: 'ipaddress',
               filter: { query: '!= "127.0.0.1"' },
            },
            ipv6prefix: {
               object: 'device_oa',
               field: 'ipv6prefix',
            },
            ipv6address: {
               object: 'device_oa',
               field: 'ipv6address',
            },
            timeout: {
               object: 'device_oa',
               field: 'timeout',
            },
            version: {
               object: 'device_oa',
               field: 'version',
            },
            latitude: {
               object: 'device_oa',
               field: 'latitude',
            },
            longitude: {
               object: 'device_oa',
               field: 'longitude',
            },
            site: {
               object: 'device_oa',
               field: 'site',
            },
            region: {
               object: 'device_oa',
               field: 'region',
            },
            location: {
               object: 'device_oa',
               field: 'sysLocation',
            },
            service: {
               field: 'name',
               object: 'oa_service',
               hide: true,
               link: ['componentLink', 'serviceLink'],
            },
            enabled: {
               hide: true,
            },
            visible: {
               object: 'oa_component',
               hide: true,
            },
            actions: {
               aggregation_format: 'list_unique',
               field: 'actions',
               link: ['componentLink', 'serviceLink'],
               object: 'oa_service',
            },
            services: {
               formula:
                  'CASE WHEN {visible} AND {enabled} THEN {service} ELSE NULL END',
               aggregation_format: 'list_unique',
            },
         },
         group_by: ['{name}'],
      },
   ],
};

const updateOaComponents = (
   oaId: string,
   services: { id: string; enabled: 1 | 0 }[]
) => ({
   command: 'update',
   user: 'admin',
   objects: services.map(({ id, enabled }) => ({
      type: 'oa_component_service',
      fields: {
         deviceid: {
            field: 'deviceid',
            filter: { query: `= ${oaId}` },
         },
         componentid: {
            field: 'componentid',
            filter: { query: `= ${id}` },
         },
      },
      data: [
         {
            enabled,
         },
      ],
   })),
});

const deleteOa = (id: string) => ({
   fields: {
      id: {
         filter: { query: `= ${id}` },
      },
   },
});

const getAvailableServiceForOa = (id: string) => ({
   command: 'get',
   user: 'admin',
   objects: [
      {
         type: 'oa_component_service',
         fields: {
            id: {
               object: 'oa_component',
               link: ['componentLink'],
            },
            name: {
               object: 'oa_component',
               link: ['componentLink'],
               sort: {
                  priority: 1,
                  order: 'asc',
               }
            },
            enabled: {},
            description: {
               object: 'oa_component',
               link: ['componentLink'],
            },
            serviceName: {
               field: 'name',
               object: 'oa_service',
               link: ['componentLink', 'serviceLink'],
            },
            serviceDescription: {
               field: 'description',
               object: 'oa_service',
               link: ['componentLink', 'serviceLink'],
            },
            oaid: {
               field: 'id',
               object: 'device_oa',
               filter: { query: `= ${id}` },
               hide: true,
            },
            visible: {
               object: 'oa_component',
               filter: { query: '== 1' },
               hide: true,
            },
         },
         limit: 0,
      },
   ],
});

const getOrphanDevicesPingedOnlyByOa = (oaName: string) => ({
   command: 'get',
   objects: [
      {
         post_filter: `{pollers} REGEXP '^${oaName}$'`,
         fields: {
            device: {
               field: 'name',
               link: ['deviceLink'],
               object: 'device',
            },
            id: {},
            pollers: {
               aggregation_format: 'list_unique',
               field: 'name',
               link: ['pollerDeviceLink'],
               object: 'device_oa',
            },
            ping: {
               field: 'poll',
               filter: {
                  query: "= 'on'",
               },
               hide: true,
            },
            snmp: {
               field: 'snmp_poll',
               filter: {
                  query: "!= 'on'",
               },
               hide: true,
               link: ['deviceLink'],
               object: 'device',
            },
         },
         group_by: ['{device}'],
         type: 'ping',
      },
   ],
   user: 'admin',
});

const queries = {
   getOasWithService: getOasWithServicesQuery,
   getOAsInGroup,
   deleteOa,
   getAvailableServiceForOa,
   updateOaComponents,
   getOrphanDevicesPingedOnlyByOa,
};

export const Queries = Object.freeze(queries);
