// ============================================================
// utils.ts
// ============================================================

import { type EntityErrors } from "@statseeker/hooks";
import { validate } from '@statseeker/utils/validator';
import { type Device } from "./type";

/**
 * Default SNMP credential options for device configuration.
 * Provides common SNMP authentication methods for network devices.
 * 
 * @constant
 * @type {Array<{value: string, label: string}>}
 */
export const DEFAULT_SNMP_OPTIONS: { value: string; label: string }[] = [
    { value: 'no-credentials', label: 'No credentials, ping-only' },
];

export const AUTO_CONFIG_SNMP = { value: 'auto', label: 'Auto Config' };

/**
 * Default device object template used when creating new devices.
 * All fields are initialized with empty or default values.
 * 
 * @constant
 * @type {Omit<Device, 'id'>}
 */
export const DEFAULT_DEVICE: Device = {
    id: 0,
    ipaddress: '<1.1.1.1>',
    manual_name: '<device-name>',
    snmp: 'no-credentials',
};

export const validateEmptyDevices = (devices: Device[]): EntityErrors => {
    let emptyDevices: EntityErrors = [];

    devices.forEach(device => {
        const ip = device.ipaddress.trim().toLowerCase();
        const name = device?.manual_name?.trim().toLowerCase();

        if (!ip && !name) {
            emptyDevices.push({ id: device.id, error: "Device cannot be empty" });
        } else if (!ip) {

            emptyDevices.push({ id: device.id, error: "IP Address cannot be empty" });
        } else if (!name) {
            emptyDevices.push({ id: device.id, error: "Device name cannot be empty" });
        }

        if (device.ipaddress) {
            if (!validate(device.ipaddress).isIpAddress()) {
                emptyDevices.push({ id: device.id, error: "Invalid IP Address" });
            }
        }
        if (device?.manual_name !== undefined) {
            if (!validate(device?.manual_name).isDeviceName()) {
                emptyDevices.push({ id: device.id, error: "Invalid device name" });
            }
        }
    });

    return emptyDevices;

};

export const validateDuplicateDevices = (devices: Device[]): EntityErrors => {
    const ipCounts = new Map<string, number[]>();
    const nameCounts = new Map<string, number[]>();

    devices.forEach(device => {
        const ip = device.ipaddress.trim().toLowerCase();
        const name = device?.manual_name?.trim().toLowerCase();

        if (ip) {
            if (!ipCounts.has(ip)) ipCounts.set(ip, []);
            ipCounts.get(ip)!.push(device.id);
        }

        if (name) {
            if (!nameCounts.has(name)) nameCounts.set(name, []);
            nameCounts.get(name)!.push(device.id);
        }
    });

    const duplicateIds = new Set<number>();

    ipCounts.forEach(ids => {
        if (ids.length > 1) {
            ids.forEach(id => duplicateIds.add(id));
        }
    });

    nameCounts.forEach(ids => {
        if (ids.length > 1) {
            ids.forEach(id => duplicateIds.add(id));
        }
    });

    return Array.from(duplicateIds).map(id => ({ id, error: 'Duplicate Device' }));
};

export function isDefaultDevice(device?: Device) {
    return (device?.ipaddress === DEFAULT_DEVICE.ipaddress && device?.name === DEFAULT_DEVICE.name);
}