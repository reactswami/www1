/// <reference types="react" />
import { type PollerListItem } from "@statseeker/api/internal_api/entities";

export type PingDiscoverProps = {
    poller?: PollerListItem;
    include_ranges?: string[];
    exclude_ranges?: string[];
};
export declare function RemoteApp(props: PingDiscoverProps): import("react").JSX.Element;
export default RemoteApp;
