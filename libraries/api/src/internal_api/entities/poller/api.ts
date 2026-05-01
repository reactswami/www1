import { ApiGetRequest, api_describe } from '../../api-request';
import { type PollerListItem, type PollerService } from './type';

export async function getPollersList(service: PollerService = 'all', text_filter?: string) {
   const serviceFilters: Record<PollerService, { filter: string }> = {
      all: {
         filter: "{service} IN ('ping', 'snmp') AND {enabled} = 1 AND {component} = 'collector'",
      },
      snmp: {
         filter: "{service} IN ('snmp') AND {enabled} = 1 AND {component} = 'collector'",
      },
      ping: {
         filter: "{service} IN ('ping') AND {enabled} = 1 AND {component} = 'collector'",
      }
   };

   const { filter } = serviceFilters[service];
   return new ApiGetRequest<PollerListItem>({
      object_type: 'oa_component_service',
      fields: [
         {
            name: 'enabled',
            hide: true,
            text_filter_include: false,
         },
         {
            hide: true,
            key: 'component',
            name: 'name',
            object: 'oa_component',
            text_filter_include: false,
         },
         {
            key: 'service',
            name: 'name',
            object: 'oa_service',
            links: ['componentLink', 'serviceLink'],
            text_filter_include: false,
            aggr_format: 'list_unique',
         },
         {
            name: 'name',
            object: 'device_oa',
            text_filter_include: true,
         },
         {
            key: 'componentId',
            name: 'id',
            object: 'oa_component',
            links: ['componentLink'],
         },
         {
            name: "ipaddress",
            object: "device_oa",
            text_filter_include: true
         },
         'id',
         'deviceid',
         'cfg',
      ],
      filter,
      group_by: ["name"],
      text_filter
   }
   ).run_api_request();
}
/**
 * Gets API schema for poller objects
 * @returns {Promise<Poller>} Poller object schema
 * @example
 * const schema = await describePoller();
 * console.log(schema.properties);
 */
export const describePoller = async () => api_describe({ object_type: 'poller' });
