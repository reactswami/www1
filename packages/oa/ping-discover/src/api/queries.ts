import { type Cfg } from './fetchOasWithPingService';

const getOAsWithPingServiceQuery = {
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
            service: {
               field: 'name',
               object: 'oa_service',
               hide: true,
               link: ['componentLink', 'serviceLink'],
            },
            componentId: {
               field: 'id',
               object: 'oa_component',
               link: ['componentLink'],
            },
            deviceId: {
               field: 'id',
               object: 'device_oa',
               link: ['deviceLink'],
            },
            ipaddress: {
               field: 'ipaddress',
               object: 'device_oa',
               link: ['deviceLink'],
               hide: true,
            },
            enabled: {
               hide: true,
            },
            visible: {
               object: 'oa_component',
               hide: true,
            },
            cfg: {
               field: 'cfg',
            },
            poll: {
               hide: true,
               field: 'poll',
               object: 'device_oa',
               link: ['deviceLink'],
            },
            status: {
               hide: true,
               field: 'status',
               object: 'device_oa',
               link: ['deviceLink'],
            },
         },
         filter:
            "{visible} AND {enabled} AND {service} REGEXP 'ping' AND {ipaddress} IS NOT('127.0.0.1') AND {status} IS ('up') AND {poll} IS NOT ('off')",
         group_by: ['{name}'],
      },
   ],
};

const updateCfg = ({
   cfg,
   deviceId,
   componentId,
}: {
   cfg: Cfg;
   componentId: string;
   deviceId: string;
}) => ({
   command: 'update',
   user: 'admin',
   objects: [
      {
         type: 'oa_component_service',
         fields: {
            deviceId: {
               field: 'deviceid',
               filter: { query: `= ${deviceId}` },
            },
            componentId: {
               field: 'componentid',
               filter: { query: `= ${componentId}` },
            },
         },
         data: [
            {
               cfg,
            },
         ],
      },
   ],
});

const queries = {
   getOAsWithPingService: getOAsWithPingServiceQuery,
   updateCfg,
};

export const Queries = Object.freeze(queries);
