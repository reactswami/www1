import { type PollerListItem } from "@statseeker/api/internal_api/entities";
export type PingDiscoverProps = {
    poller?: PollerListItem;
    include_ranges?: string[];
    exclude_ranges?: string[];
};

