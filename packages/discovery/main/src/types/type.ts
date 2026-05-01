import { type DiscoverModes, type DiscoverHistory, type ManualConfig } from '@statseeker/api/internal_api/entities';
import * as z from 'zod';

export type PostDiscoveryActionOptions = {
   email?: string;
   runAutogroupingRules?: boolean;
   createInterfaceTypeGroups?: boolean;
   createInterfaceSpeedGroups?: boolean;
};

export type PollerOptions = {
   poller_id?: number;
};

export type MonitoringOptions = {
   operstatusPolling?: boolean;
   adminStatusPolling?: boolean;
   nonUnicastPacketPolling?: string;
};

export type SNMPOptions = {
   maxSimultaneousWalks: number;
   maxSimultaneousDeviceWalks: number;
   maxRepetitions: number;
   useGetNext: boolean;
   minimalWalk: boolean;
   snmpErrorLog: boolean;
   numberOfRetries: number;
   walkTimeout: number;
};

export type ExistingDeviceOptions = {
   excludeExistingDevices?: boolean;
   retestSnmpCredentials?: 'all' | 'down' | 'none';
   rediscoverCustomDataTypes?: boolean;
   pingOnlyForceAdd?: boolean;
   manualForceAdd?: boolean;
};

export type DiscoveryHistoryList = Omit<DiscoverHistory, 'duration'> & {
   duration: string;
};

export type DevicePanelOptions = {
   devices: string[] | undefined;
   groups: string[] | undefined;
};

export type ManualConfigError = {
   line: string;
   errors: string[];
};

export type ManualDeviceAddition = {
   manualConfig?: ManualConfig[];
};

export interface AdvancedOptions extends PostDiscoveryActionOptions, MonitoringOptions, ExistingDeviceOptions, SNMPOptions { }

const PollerOptionsSchema = z.object({
   poller_id: z.number(),
   poller: z.string().optional(),
});

const PostDiscoveryActionOptionsSchema = z.object({
   email: z.string().optional(),
   runAutogroupingRules: z.boolean().optional(),
   createInterfaceTypeGroups: z.boolean().optional(),
   createInterfaceSpeedGroups: z.boolean().optional(),
});

const MonitoringOptionsSchema = z.object({
   operstatusPolling: z.boolean().optional(),
   adminStatusPolling: z.boolean().optional(),
   nonUnicastPacketPolling: z.string().optional(),
});

const SNMPOptionsSchema = z.object({
   maxSimultaneousWalks: z.number(),
   maxSimultaneousDeviceWalks: z.number(),
   maxRepetitions: z.number(),
   useGetNext: z.boolean(),
   minimalWalk: z.boolean(),
   snmpErrorLog: z.boolean(),
   numberOfRetries: z.number(),
   walkTimeout: z.number(),
});

const ExistingDeviceOptionsSchema = z.object({
   excludeExistingDevices: z.boolean().optional(),
   retestSnmpCredentials: z.enum(['all', 'down', 'none']).optional(),
   rediscoverCustomDataTypes: z.boolean().optional(),
   pingOnlyForceAdd: z.boolean().optional(),
   manualForceAdd: z.boolean().optional(),
});

const SNMPCredentialSchema = z.object({
   snmpCredentials: z.array(z.number()).optional(),
});

const AdvancedOptionsSchema = PostDiscoveryActionOptionsSchema
   .merge(MonitoringOptionsSchema)
   .merge(ExistingDeviceOptionsSchema)
   .merge(SNMPOptionsSchema)
   .merge(SNMPCredentialSchema)
   .merge(PollerOptionsSchema);

const IpRangeSchema = z.discriminatedUnion('mode', [
   z.object({
      mode: z.literal('iprange'),
      iprangeList: z.array(z.number()),
   }),
   z.object({
      mode: z.literal('hostsfile')
   }),
   z.object({
      mode: z.undefined()
   }),
]);

export const DiscoverOptionsSchema = z.intersection(AdvancedOptionsSchema, IpRangeSchema);


// Type inference to ensure they match
export type DiscoverOptions = z.infer<typeof DiscoverOptionsSchema> & ManualDeviceAddition;
export type IPRangeOptions = z.infer<typeof IpRangeSchema>;
export type SNMPCredentialOptions = z.infer<typeof SNMPCredentialSchema>;
export type TaskConfig = DiscoverOptions;

export type DiscoverRoutes = '/network' | '/manual' | '/ping' | '/rewalk';
export type RouteModes = Extract<DiscoverModes, 'Manual' | 'Discover' | 'Rewalk' | "Ping Only Discover">;
export type DiscoverModeRoute = Record<RouteModes, Partial<DiscoverRoutes>>;

