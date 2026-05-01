import { type Device } from "@statseeker/components/Legacy/DevicePanel";
import { type EntityCardProps } from "@statseeker/components/Legacy/EntityCard";

export interface DeviceCardProps extends Omit<EntityCardProps<Device>, 'renderPanel'> {
    snmpOptions?: Array<{ value: string; label: string }>;
}