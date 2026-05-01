// ============================================================
// DevicePanel.tsx
// ============================================================

import {
    Box,
    FormControl,
    Select,
} from '@chakra-ui/react';
import { Button } from '@statseeker/components/Form/Button';
import { Flex } from '@statseeker/components/Layout';
import { Input } from '@statseeker/components/Legacy/Input/Input';
import { FormLabel } from '@statseeker/components/Legacy/Input/Label/Label';
import { CrossIcon, ErrorCircleIcon } from '@statseeker/components/Media';
import React, { useCallback, memo } from 'react';
import { type DevicePanelProps } from './type';

/**
 * DevicePanel component - renders a single device entry in horizontal layout.
 * 
 * This is a memoized component that displays input fields for device configuration
 * in a compact horizontal form. It includes IP address, name, SNMP credentials,
 * and an optional remove button.
 * 
 * Features:
 * - Horizontal layout with three input fields and one button
 * - Validation styling (red border) when validate prop is true and fields are empty
 * - Remove button (hidden when only one device exists)
 * - Optimized with React.memo to prevent unnecessary re-renders
 * - Individual field change handlers with useCallback optimization
 * - Responsive to validation state changes
 * 
 * @component
 * @param {DevicePanelProps} props - Component props
 * @returns {React.ReactElement} Rendered device panel
 * 
 * @example
 * <DevicePanel
 *   device={{ id: 1, ipAddress: '', name: '', snmpCredentials: 'default' }}
 *   devicesLength={2}
 *   onUpdate={handleUpdate}
 *   onRemove={handleRemove}
 *   removeButtonText="Remove"
 *   snmpOptions={[
 *     { value: 'default', label: "Use 'default'" },
 *     { value: 'snmpv2', label: 'SNMP v2' }
 *   ]}
 *   validate={true}
 * />
 */
export const DevicePanel = memo<DevicePanelProps>(({
    entity: device,
    entitiesLength: devicesLength,
    onUpdate,
    onRemove,
    snmpOptions,
    validate = false,
    error,
    displayHeader = false
}) => {
    /**
     * Handles IP address input changes.
     * Memoized to prevent recreation on every render.
     * 
     * @callback handleIpChange
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
     */
    const handleIpChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onUpdate(device.id, 'ipaddress', e.target.value);
        },
        [device.id, onUpdate]
    );

    /**
     * Handles device name input changes.
     * Memoized to prevent recreation on every render.
     * 
     * @callback handleNameChange
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
     */
    const handleNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onUpdate(device.id, 'manual_name', e.target.value);
        },
        [device.id, onUpdate]
    );

    /**
     * Handles SNMP credentials select changes.
     * Memoized to prevent recreation on every render.
     * 
     * @callback handleSnmpChange
     * @param {React.ChangeEvent<HTMLSelectElement>} e - Select change event
     */
    const handleSnmpChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            onUpdate(device.id, 'snmp', e.target.value);
        },
        [device.id, onUpdate]
    );

    /**
     * Handles remove button click.
     * Memoized to prevent recreation on every render.
     * 
     * @callback handleRemove
     */
    const handleRemove = useCallback(() => {
        onRemove(device.id);
    }, [device.id, onRemove]);


    /**
     * Spacing between form controls in the horizontal layout.
     * @type {number}
     */
    const gapLeft = 3;

    return (
        <Flex
            borderWidth="1px"
            borderRadius="md"
            borderColor={validate ? "red.400" : "transparent"}
            p={validate ? '2' : '0'}
            position="relative"
            transition="all 0.2s"
            flexDir={'column'}
        >

            <Flex gap={0}>
                <FormControl>
                    <Input
                        value={device.ipaddress}
                        onChange={handleIpChange}
                        placeholder="Enter IP address"
                        {...displayHeader && {
                            label: "IP Address"
                        }}

                    />
                </FormControl>

                {/* Device Name Input */}
                < FormControl pl={gapLeft} >
                    <Input
                        value={device.manual_name}
                        onChange={handleNameChange}
                        placeholder="Enter device name"
                        {...displayHeader && {
                            label: "Device Name"
                        }}
                    />
                </FormControl >

                {/* SNMP Credentials Select */}
                < FormControl pl={gapLeft} >
                    <FormLabel {...displayHeader && {
                        label: "SNMP Credentials"
                    }}>
                        <Select
                            value={device.snmp}
                            onChange={handleSnmpChange}
                            bg="inherit"
                            zIndex={1000}
                        >
                            {snmpOptions?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </FormLabel>
                </FormControl >
                {/* Remove Button (conditionally rendered) */}
                < Box alignSelf={'flex-end'} pl={gapLeft} >
                    {devicesLength > 1 && (
                        <Button
                            variant={'secondary'}
                            colorScheme='red'
                            aria-label="Remove Device"
                            icon={<CrossIcon size='sm' />}
                            onClick={handleRemove}
                        />
                    )}
                </Box >
            </Flex >
            {validate &&
                <Flex color={'red.500'} width={'full'} pt='8px' gap='5px'>
                    <Box alignSelf={'center'}>
                        <ErrorCircleIcon size={'sm'} />
                    </Box>
                    <Box>{error?.error}</Box>
                </Flex>
            }
        </Flex >
    );
});