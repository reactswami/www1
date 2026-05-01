// ============================================================
// type.ts (DevicePanel)
// ============================================================

import { ManualConfig } from "@statseeker/api/internal_api/entities";
import { type EntityPanelProps } from "@statseeker/components/Legacy/EntityCard";

/**
 * Represents a network device with SNMP configuration.
 * Extends BaseEntity to include an id field for unique identification.
 * 
 * @interface Device
 * @extends {BaseEntity}
 * 
 * @property {number} id - Unique identifier for the device (inherited from BaseEntity)
 * @property {string} ipAddress - IP address of the network device
 * @property {string} name - Human-readable name for the device
 * @property {string} snmpCredentials - SNMP authentication method identifier
 * 
 * @example
 * const device: Device = {
 *   id: 1,
 *   ipAddress: '192.168.1.1',
 *   name: 'Router 1',
 *   snmpCredentials: 'default'
 * };
 */
export interface Device extends ManualConfig {
    snmp: string;
    id: number;
}

/**
 * Props for the DevicePanel component.
 * Represents a single device entry in a horizontal form layout.
 * 
 * @interface DevicePanelProps
 * 
 * @property {Device} device - The device object to display and edit
 * @property {number} devicesLength - Total number of devices in the list (used to show/hide remove button)
 * @property {(id: number, field: keyof Omit<Device, 'id'>, value: string) => void} onUpdate - Callback fired when any field is updated
 * @property {(id: number) => void} onRemove - Callback fired when remove button is clicked
 * @property {string} removeButtonText - Text to display on the remove button
 * @property {Array<{value: string, label: string}>} snmpOptions - SNMP credential options for the select dropdown
 * @property {boolean} [validate] - Whether to show validation styling (red border) for empty fields
 * 
 * @example
 * <DevicePanel
 *   device={{ id: 1, ipAddress: '192.168.1.1', name: 'Router', snmpCredentials: 'default' }}
 *   devicesLength={3}
 *   onUpdate={(id, field, value) => console.log(`Updated ${field} to ${value}`)}
 *   onRemove={(id) => console.log(`Remove device ${id}`)}
 *   removeButtonText="Delete"
 *   snmpOptions={DEFAULT_SNMP_OPTIONS}
 *   validate={true}
 * />
 */
export interface DevicePanelProps extends EntityPanelProps<Device> {
    snmpOptions?: Array<{ value: string; label: string }>;
}
