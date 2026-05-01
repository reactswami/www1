import RemoteApp from '@statseeker/components/RemoteApp/RemoteApp';
import { createFileRoute } from '@tanstack/react-router';
import * as z from 'zod';
import { remotesConfig } from '~/config/remotes.config';
import { type PingDiscoverProps } from '~/types';

const envConfig = import.meta.env.MODE === 'production' ? remotesConfig.production : remotesConfig.development;

const PingDiscoverSchema = z.object({
   poller: z.object({
      id: z.number(),
      name: z.string(),
      deviceid: z.number(),
      ipaddress: z.string().optional(),
      service: z.string().optional(),
      cfg: z.string().optional(),
      componentId: z.number().optional(),
   }),
   include_ranges: z.array(z.string()).optional(),
   exclude_ranges: z.array(z.string()).optional(),
});
export const Route = createFileRoute('/ping_discover')({
   validateSearch: (search) => PingDiscoverSchema.parse(search),
   component: PingDiscover,
});

function PingDiscover() {
   const search = Route.useSearch();
   return (
      <RemoteApp<PingDiscoverProps> appName='pingDiscover' moduleName='./RemoteApp' envConfig={envConfig} friendlyAppName='Ping Discover' props={{ ...search }} />
   );
}

