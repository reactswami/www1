import { getPollersList, type PollerListItem } from '@statseeker/api/internal_api/entities';
import { queryOptions } from '@tanstack/react-query';

export const getPollersWithKeyWord = (pollerSearch?: string) => {
    return getPollersList('all', pollerSearch);
};

export type PollerSelect = (data: PollerListItem[]) => PollerListItem[];

const STATSEEKER_SERVER_IP = '127.0.0.1';
const hasSNMP = (poller: PollerListItem) => poller?.service?.includes('snmp');
const hasPing = (poller: PollerListItem) => poller?.service?.includes('ping');
const hasSnmpAndPing = (poller: PollerListItem) => hasSNMP(poller) && hasPing(poller);
export const isStatseekerServer = (poller: PollerListItem) => poller?.ipaddress?.includes(STATSEEKER_SERVER_IP);

export const getAllPollers = (pollerSearch?: string, pollerSelect?: PollerSelect | void) =>
    queryOptions<PollerListItem[]>({
        queryKey: ['poller', pollerSearch],
        queryFn: () => getPollersWithKeyWord(pollerSearch).then(data => data.data),
        staleTime: Infinity,
        ...(pollerSelect && { select: pollerSelect })
    });

export const filterStatseekerServer = (option: PollerListItem) => isStatseekerServer(option);
export const snmpPollerSelect = (data: PollerListItem[]) => [
    // Include the Statseeker Server
    ...data.filter(poller => isStatseekerServer(poller)),
    // Include all the pollers that has both snmp and ping enabled except the statseeker server
    ...data.filter(poller => hasSnmpAndPing(poller) && !isStatseekerServer(poller))
];

export const pingPollerSelect = (data: PollerListItem[]) => [
    // Include the Statseeker Server
    ...data.filter(poller => isStatseekerServer(poller)),
    // Include all the pollers that has only ping enabled except the statseeker server
    ...data.filter(poller => hasPing(poller) && !isStatseekerServer(poller))
];

/**
 * Helper function to compare two poller values for equality
 */
export const arePollerValuesEqual = (a: PollerListItem | null, b: PollerListItem | null): boolean => {
    return comparePoller(a, b) === 0 ? true : false;
};

const comparePoller = (a: PollerListItem | null, b: PollerListItem | null): -1 | 0 | 1 => {
    if (a === null && b === null) return 0;
    if (a === null) return -1;
    if (b === null) return 1;
    return a.id === b.id ? 0 : a.id > b.id ? 1 : -1;
};

/**
 * Helper function to compare arrays of pollers for equality
 */
export const arePollerArraysEqual = (a: PollerListItem[] | null, b: PollerListItem[] | null): boolean => {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;

    // Replacing the slower sort with with a faster Set 
    const idsA = new Set(a.map(poller => poller.id));
    const idsB = new Set(b.map(poller => poller.id));

    if (idsA.size !== idsB.size) return false;

    // Check if all IDs in A exist in B
    for (const id of idsA) {
        if (!idsB.has(id)) return false;
    }

    return true;
};
